<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Css_Builder as Token_Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use RuntimeException;

/**
 * Builds the scoped CSS for selectable Kadence block presets across every token set at once, so a preset
 * follows palette switching the same way the raw token layer does.
 *
 * A selected preset reaches output purely through the cascade: the editor adds a "kb-preset--<name>"
 * class to the block, and this builder emits, per (block, preset), a rule that retargets the --global-*
 * custom properties (a numbered palette slot or a named button slot) the block consumes in its render path
 * / SCSS, re-skinning it with zero changes to the block's markup.
 *
 * A block declares one flat preset list, and each preset may define a different subset of the block's
 * bound surface; the build emits, per preset, exactly the properties that preset resolves. Two presets
 * that both retarget the same --global-<slot> carry equal specificity, so the selected-preset rule wins
 * over the class-less $default rule by higher specificity, and a per-instance edit wins over both.
 *
 * The emission mirrors the raw-token (Css_Var) projection so a preset var is just another token in the
 * same multi-set graph:
 *
 *   1. One namespaced preset-var block per set —
 *      --kb-token--<set>--preset--<block>--<preset>--<property>: <value-or-var> — where an aliased
 *      binding reads var(--kb-token--<set>--<target>), so the preset chains to that set's namespaced token
 *      and a set's chain stays inside the set; a literal binding emits the literal.
 *   2. An active-library alias layer pointing each canonical preset var at the active set's namespaced one
 *      (--kb-token--preset--…: var(--kb-token--<active>--preset--…)).
 *   3. One [data-kb-token-set="<set>"] switch selector per set re-pointing the canonical preset vars at
 *      that set, so a body class / container attribute swaps the preset palette client-side — the scoped
 *      rules below read the canonical preset var on the block element, so they follow it for their subtree.
 *   4. Per (block, preset) scoped rules — ".wp-block-<block>.kb-preset--<preset>" — pointing each
 *      --global-<slot> at the canonical preset var. These read the canonical var (which the switch
 *      selectors re-point per set), so a rule is set-independent and is emitted from every set's fragment —
 *      a preset that exists only in a non-active set (e.g. a user-created preset on the "dark" set) still
 *      gets its retarget rule. A class-less ".wp-block-<block>" rule for the active set's $default preset
 *      is emitted alongside the active fragment, so a block with no preset selected still shows its preset.
 *
 * Scoping is per (block, preset): the same preset name on two blocks ("ghost" on a Button and a Row) gets
 * its own qualified rule, so values never collide. Both named presets and the "$default" preset carry
 * ordinary class/element specificity, so a per-instance edit still wins.
 *
 * Nothing here is !important and the scope carries ordinary class specificity, so a per-instance inline
 * style still wins over a preset. Values are sanitized defensively before they reach a declaration.
 *
 * Pure: no WordPress calls beyond the object cache in css_for_version(). The hooks live in Projector.
 *
 * @since TBD
 */
final class Css_Builder {

	use Sanitizes_Css_Identifier;
	use Sanitizes_Css_Value;

	/**
	 * The preset var namespace, appended after the shared --kb-token-- prefix (and after any set
	 * namespace).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRESET_SEGMENT = 'preset--';

	/**
	 * Kadence theme global custom-property slots a preset may retarget beyond the numbered palette
	 * (palette1..9). These are the button's own color slots — the exact --global-* properties the
	 * button render path already consumes — so a preset re-skins the button with no change to its
	 * render path.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const NAMED_GLOBAL_SLOTS = [
		'palette-btn-bg',
		'palette-btn',
		'palette-btn-bg-hover',
		'palette-btn-hover',
	];

	/**
	 * Object-cache group shared with the rest of the Design Tokens module.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * @var Token_Registry The registry the preset sets (and their bindings) are read from.
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Preset_Resolver Flattens each preset's bindings to resolved CSS values.
	 *
	 * @since TBD
	 */
	private Preset_Resolver $presets;

	/**
	 * Per-request memo of built CSS, keyed on each cached fragment's object-cache key and the full-assembly
	 * signature, so a write (which bumps a set's version) invalidates the affected entries on its own.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private array $memo = [];

	/**
	 * Per-request memo of the collected preset structure, keyed on the set slug, so the registry/resolver
	 * walk runs once per set even when several layers read it.
	 *
	 * @since TBD
	 *
	 * @var array<string, array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}>>
	 */
	private array $collected = [];

	/**
	 * @since TBD
	 *
	 * @param Token_Registry  $registry The token registry.
	 * @param Preset_Resolver $presets  The preset resolver.
	 */
	public function __construct( Token_Registry $registry, Preset_Resolver $presets ) {
		$this->registry = $registry;
		$this->presets  = $presets;
	}

	/**
	 * Build the full multi-set preset CSS: a namespaced preset-var block plus switch selector per set, the
	 * active-library alias layer, and the active set's scoped rules. The pure, uncached assembler (its cached
	 * counterpart is css_for_version()).
	 *
	 * @since TBD
	 *
	 * @param string[] $slugs       Every token set slug to emit, in order.
	 * @param string   $active_slug The active set's slug — the set the canonical alias layer points at.
	 *
	 * @return string The CSS, or an empty string when no block contributes a slot-targeted value.
	 */
	public function css( array $slugs, string $active_slug ): string {
		$css = '';
		foreach ( $slugs as $slug ) {
			$css .= $this->build_set_fragment( (string) $slug );
		}

		return $css . $this->build_active_fragment( $active_slug );
	}

	/**
	 * Cached preset of css(): assembles the per-set fragments and the active fragment from the object cache
	 * at fragment granularity, with a per-request memo. Editing one set busts only that set's fragment;
	 * switching the active set reuses every per-set fragment and rebuilds only the active one.
	 *
	 * The plugin version is folded into each fragment's cache key alongside the store version, so the cache
	 * also busts on a plugin build (shipped preset definitions and the baseline can change with it).
	 *
	 * @since TBD
	 *
	 * @param array<string, string> $versions    Each token set slug => the store version it was built from.
	 * @param string                $active_slug The active set's slug.
	 *
	 * @return string
	 */
	public function css_for_version( array $versions, string $active_slug ): string {
		$signature = 'assembly:' . $active_slug;
		foreach ( $versions as $slug => $version ) {
			$signature .= '|' . (string) $slug . ':' . $version;
		}

		if ( isset( $this->memo[ $signature ] ) ) {
			return $this->memo[ $signature ];
		}

		$css = '';
		foreach ( $versions as $slug => $version ) {
			$css .= $this->set_fragment( (string) $slug, $version );
		}

		$css .= $this->active_fragment( $active_slug, (string) ( $versions[ $active_slug ] ?? '' ) );

		return $this->memo[ $signature ] = $css;
	}

	/**
	 * A set's per-set fragment — its namespaced preset-var block plus its switch selector — served from /
	 * stored in the object cache. Active-independent: it depends only on this set's resolved presets.
	 *
	 * @since TBD
	 *
	 * @param string $slug    The set slug.
	 * @param string $version The store version the set was built from.
	 *
	 * @return string
	 */
	public function set_fragment( string $slug, string $version ): string {
		$cache_key = 'preset_css_set_' . KADENCE_BLOCKS_VERSION . '_' . $slug . '_' . $version;

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build_set_fragment( $slug );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $cache_key ] = $css;
	}

	/**
	 * The active fragment — the canonical alias layer plus the coercive scoped rules — served from / stored
	 * in the object cache. Depends only on the active set, so a switch rebuilds just this.
	 *
	 * @since TBD
	 *
	 * @param string $active_slug The active set slug.
	 * @param string $version     The store version the active set was built from.
	 *
	 * @return string
	 */
	public function active_fragment( string $active_slug, string $version ): string {
		$cache_key = 'preset_css_active_' . KADENCE_BLOCKS_VERSION . '_' . $active_slug . '_' . $version;

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build_active_fragment( $active_slug );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $cache_key ] = $css;
	}

	/**
	 * Build (uncached) a set's per-set fragment: its namespaced preset-var block, its switch selector, and
	 * its per-preset scoped retarget rules. The scoped rules read the canonical preset var (which the
	 * switch selectors re-point per set), so emitting them from every set's fragment — not just the active
	 * one — is what lets a preset that exists only in a non-active set still retarget its slots when a block
	 * is placed on that set. A rule shared across sets is byte-identical, so the duplication is inert.
	 *
	 * @since TBD
	 *
	 * @param string $slug The set slug.
	 *
	 * @return string
	 */
	private function build_set_fragment( string $slug ): string {
		$collected = $this->collect( $slug );

		return $this->namespaced_block( $collected, $slug )
			. $this->switch_block( $collected, $slug )
			. $this->scoped_presets( $collected );
	}

	/**
	 * Build (uncached) the active fragment: the canonical alias layer plus the class-less $default rules. The
	 * single assembly definition shared by css() and the cached active_fragment().
	 *
	 * @since TBD
	 *
	 * @param string $active_slug The active set slug.
	 *
	 * @return string
	 */
	private function build_active_fragment( string $active_slug ): string {
		$collected = $this->collect( $active_slug );

		return $this->alias_block( $collected, $active_slug ) . $this->scoped_default( $collected );
	}

	/**
	 * Walk every (block, preset, property) that resolves to a slot-targeted value for a set, into a
	 * structure the layers below build from. The projected value namespaces its var() target to the set, so
	 * an aliased preset chains to that set's namespaced token. Memoized per slug for the request.
	 *
	 * @since TBD
	 *
	 * @param string $slug The set slug to resolve against (and namespace the values to).
	 *
	 * @return array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}>
	 */
	private function collect( string $slug ): array {
		if ( isset( $this->collected[ $slug ] ) ) {
			return $this->collected[ $slug ];
		}

		$out = [];

		foreach ( $this->registry->preset_binding_blocks() as $block ) {
			// A block may carry registered bindings before the document defines its presets; that is not an
			// error, it simply contributes nothing yet, so skip a block whose set the registry never declared.
			$set = $this->registry->for_block( $block );

			if ( $set === null ) {
				continue;
			}

			try {
				$names = $this->presets->names( $block, $slug );
			} catch ( RuntimeException $e ) {
				continue;
			}

			$presets = [];

			foreach ( $names as $preset ) {
				try {
					$values = $this->presets->resolve( $block, $preset, $slug, $slug );
				} catch ( RuntimeException $e ) {
					continue;
				}

				$properties = [];

				foreach ( $values as $property => $value ) {
					$binding = $set->binding( $property );

					if ( $binding === null ) {
						continue;
					}

					$target = $this->target_var( $binding );

					if ( $target === null ) {
						continue;
					}

					$properties[ $property ] = [
						'target' => $target,
						'value'  => $value,
					];
				}

				if ( $properties !== [] ) {
					$presets[ $preset ] = $properties;
				}
			}

			if ( $presets === [] ) {
				continue;
			}

			try {
				$default = $this->presets->default_preset( $block, $slug );
			} catch ( RuntimeException $e ) {
				$default = '';
			}

			$out[ $block ] = [
				'selector' => $this->block_selector( $block ),
				'default'  => $default,
				'presets'  => $presets,
			];
		}

		return $this->collected[ $slug ] = $out;
	}

	/**
	 * Emit a set's `--kb-token--<set>--preset--*` definitions from its collected presets. The value
	 * preserves alias indirection namespaced to the set, so the preset chains to that set's token.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}> $collected The set's collected presets.
	 * @param string                                                                                                                            $slug      The set slug to namespace the var names under.
	 *
	 * @return string
	 */
	private function namespaced_block( array $collected, string $slug ): string {
		$declarations = '';

		foreach ( $collected as $block => $data ) {
			foreach ( $data['presets'] as $preset => $properties ) {
				foreach ( $properties as $property => $info ) {
					$declarations .= $this->preset_var( $block, $preset, $property, $slug ) . ':' . $this->sanitize_value( $info['value'] ) . ';';
				}
			}
		}

		return $declarations === '' ? '' : Scope::root() . '{' . $declarations . '}';
	}

	/**
	 * Emit the active-library alias layer: each canonical preset var pointed at the active set's namespaced
	 * preset var, so the scoped rules (which read the canonical var) follow the active set.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}> $collected   The active set's collected presets.
	 * @param string                                                                                                                            $active_slug The active set slug.
	 *
	 * @return string
	 */
	private function alias_block( array $collected, string $active_slug ): string {
		$declarations = $this->point_canonical_at_set( $collected, $active_slug );

		return $declarations === '' ? '' : Scope::root() . '{' . $declarations . '}';
	}

	/**
	 * Emit a set's switch selector: under `[data-kb-token-set="<set>"]`, re-point every canonical preset
	 * var at that set's namespaced preset var for the matched element's subtree, so a body class /
	 * container attribute swaps the preset palette client-side (the scoped --global-<slot> rules read the
	 * canonical preset var on the block element, so they follow it there).
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}> $collected The set's collected presets.
	 * @param string                                                                                                                            $slug      The set slug.
	 *
	 * @return string
	 */
	private function switch_block( array $collected, string $slug ): string {
		$declarations = $this->point_canonical_at_set( $collected, $slug );

		if ( $declarations === '' ) {
			return '';
		}

		return '[' . Token_Css_Builder::get_switch_attribute() . '="' . self::sanitize_identifier( $slug ) . '"]{' . $declarations . '}';
	}

	/**
	 * Build the `--kb-token--preset--…: var(--kb-token--<slug>--preset--…);` declarations that point every
	 * canonical preset var at its namespaced counterpart in $slug. Both names derive from preset_var(), so
	 * the reference always matches the namespaced block's defined var.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}> $collected The collected presets whose ids drive the layer.
	 * @param string                                                                                                                            $slug      The set slug the canonical names are pointed at.
	 *
	 * @return string
	 */
	private function point_canonical_at_set( array $collected, string $slug ): string {
		$declarations = '';

		foreach ( $collected as $block => $data ) {
			foreach ( $data['presets'] as $preset => $properties ) {
				foreach ( $properties as $property => $info ) {
					$declarations .= $this->preset_var( $block, $preset, $property ) . ':var(' . $this->preset_var( $block, $preset, $property, $slug ) . ');';
				}
			}
		}

		return $declarations;
	}

	/**
	 * Emit the per-preset scoped rules from a set's collected presets: per (block, preset) a
	 * ".wp-block-<block>.kb-preset--<preset>" rule pointing each --global-<slot> at the canonical preset
	 * var. Called for every set (not just the active one), so a preset that exists only in a non-active set
	 * still gets its retarget rule; the rule body is set-independent (it reads the canonical var the switch
	 * selectors re-point), so a rule shared across sets is byte-identical.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}> $collected The set's collected presets.
	 *
	 * @return string
	 */
	private function scoped_presets( array $collected ): string {
		$css = '';

		foreach ( $collected as $block => $data ) {
			foreach ( $data['presets'] as $preset => $properties ) {
				$declarations = $this->slot_declarations( $block, $preset, $properties );

				if ( $declarations !== '' ) {
					$css .= $data['selector'] . '.' . Style::preset_class( $preset ) . '{' . $declarations . '}';
				}
			}
		}

		return $css;
	}

	/**
	 * Emit the class-less $default rules from the active set's collected presets: per block a
	 * ".wp-block-<block>" rule re-emitting the $default preset's declarations so a block with no preset
	 * selected still shows its preset. Its lower specificity yields to the kb-preset-- rules (a selected
	 * preset) and to a per-instance edit, so it only fills the gap. Built from the active set — the preset a
	 * block shows when it follows the active set with no selection.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:string, value:string}>>}> $collected The active set's collected presets.
	 *
	 * @return string
	 */
	private function scoped_default( array $collected ): string {
		$css = '';

		foreach ( $collected as $block => $data ) {
			$default = $data['default'];

			if ( $default === '' || ! isset( $data['presets'][ $default ] ) ) {
				continue;
			}

			$declarations = $this->slot_declarations( $block, $default, $data['presets'][ $default ] );

			if ( $declarations !== '' ) {
				$css .= $data['selector'] . '{' . $declarations . '}';
			}
		}

		return $css;
	}

	/**
	 * Build the `--global-<slot>:var(<canonical preset var>);` declarations for one preset's properties.
	 *
	 * @since TBD
	 *
	 * @param string                                                     $block      The block name.
	 * @param string                                                     $preset    The preset slug.
	 * @param array<string, array{target:string, value:string}>         $properties The preset's collected properties.
	 *
	 * @return string
	 */
	private function slot_declarations( string $block, string $preset, array $properties ): string {
		$declarations = '';

		foreach ( $properties as $property => $info ) {
			$declarations .= $info['target'] . ':var(' . $this->preset_var( $block, $preset, $property ) . ');';
		}

		return $declarations;
	}

	/**
	 * The CSS custom property a selected preset sets for a binding, or null when the binding drives none.
	 *
	 * A binding that targets a Kadence palette slot resolves to `--global-<slot>` (the color path); a binding
	 * that declares a `css_var` resolves to `--<css_var>` (e.g. `--kb-btn-radius` for border-radius, which has
	 * no palette slot). The preset's scoped rule sets this property to the per-preset value, so it can vary
	 * per preset while the block reads the same variable.
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The preset binding.
	 *
	 * @return string|null The full custom-property name (e.g. "--global-palette-btn-bg", "--kb-btn-radius"), or null.
	 */
	private function target_var( Binding $binding ): ?string {
		$slot = $this->global_slot( $binding );

		if ( $slot !== null ) {
			return '--global-' . $slot;
		}

		$css_var = $binding->css_var();

		if ( $css_var !== null ) {
			return '--' . $css_var;
		}

		return null;
	}

	/**
	 * The Kadence global custom-property slot a binding targets, or null when it targets none.
	 *
	 * Recognizes the numbered palette slots (palette1..9 → --global-paletteN) and the named button
	 * slots in {@see NAMED_GLOBAL_SLOTS} (e.g. palette-btn-bg → --global-palette-btn-bg). Reads the
	 * binding's effective projections so a token-reference binding inherits the referenced token's
	 * slot and an inline binding declares its own; both reach the same --global-<slot>.
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The preset binding.
	 *
	 * @return string|null The slot ("palette3", "palette-btn-bg"), or null.
	 */
	private function global_slot( Binding $binding ): ?string {
		$slot = $this->registry->effective_projections( $binding )[ Binding::get_kadence_slot_key() ] ?? null;

		if ( ! is_string( $slot ) ) {
			return null;
		}

		if ( preg_match( '/^palette[1-9]$/', $slot ) === 1 || in_array( $slot, self::NAMED_GLOBAL_SLOTS, true ) ) {
			return $slot;
		}

		return null;
	}

	/**
	 * The block's CSS class selector: a Kadence (or any namespaced) block => ".wp-block-<namespace>-<name>".
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return string
	 */
	private function block_selector( string $block ): string {
		$parts     = explode( '/', $block, 2 );
		$namespace = $parts[0];
		$name      = $parts[1] ?? $namespace;

		return '.wp-block-' . self::sanitize_identifier( $namespace ) . '-' . self::sanitize_identifier( $name );
	}

	/**
	 * The preset var name for a (block, preset, property), optionally namespaced to a token set:
	 * "--kb-token--[<set>--]preset--<block>--<preset>--<property>", e.g.
	 * --kb-token--dark--preset--kadence-singlebtn--secondary--button-bg.
	 *
	 * @since TBD
	 *
	 * @param string $block     The block name.
	 * @param string $preset   The preset slug.
	 * @param string $property  The block property.
	 * @param string $namespace Optional token-set slug to namespace the variable under. Empty yields the
	 *                          canonical (un-namespaced) name.
	 *
	 * @return string
	 */
	private function preset_var( string $block, string $preset, string $property, string $namespace = '' ): string {
		return Css_Var::get_prefix()
			. ( $namespace === '' ? '' : self::sanitize_identifier( $namespace ) . '--' )
			. self::PRESET_SEGMENT
			. self::sanitize_identifier( str_replace( '/', '-', $block ) ) . '--'
			. self::sanitize_identifier( $preset ) . '--'
			. self::sanitize_identifier( $property );
	}
}
