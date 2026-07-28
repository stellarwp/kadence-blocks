<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use RuntimeException;

/**
 * Builds the scoped CSS for selectable Kadence block variants for the single active token set.
 *
 * A selected variant reaches output purely through the cascade: the editor adds a "kb-variant--<name>"
 * class to the block, and this builder emits, per (block, variant), a rule that retargets the --global-*
 * custom properties (a numbered palette slot or a named button slot) the block consumes in its render path
 * / SCSS, re-skinning it with zero changes to the block's markup.
 *
 * A block declares one flat variant list, and each variant may define a different subset of the block's
 * bound surface; the build emits, per variant, exactly the properties that variant resolves. Two variants
 * that both retarget the same --global-<slot> carry equal specificity, so the selected-variant rule wins
 * over the class-less $default rule by higher specificity, and a per-instance edit wins over both.
 *
 * Only the active set is emitted (the active-set pointer selects it). The build has two layers:
 *
 *   1. The canonical variant-var definitions at `:root` —
 *      --kb-token--variant--<block>--<variant>--<property>: <value-or-var> — where an aliased binding reads
 *      var(--kb-token--<target>) so the variant chains to the active set's canonical token, and a literal
 *      binding emits the literal.
 *   2. Per (block, variant) scoped rules — ".wp-block-<block>.kb-variant--<variant>" — pointing each
 *      --global-<slot> at the canonical variant var, plus a class-less ".wp-block-<block>" rule for the
 *      $default variant so a block with no variant selected still shows its preset.
 *
 * Scoping is per (block, variant): the same variant name on two blocks ("ghost" on a Button and a Row) gets
 * its own qualified rule, so values never collide. Both named variants and the "$default" preset carry
 * ordinary class/element specificity, so a per-instance edit still wins.
 *
 * Nothing here is !important and the scope carries ordinary class specificity, so a per-instance inline
 * style still wins over a variant. Values are sanitized defensively before they reach a declaration.
 *
 * Pure: no WordPress calls beyond the object cache in css_for_version(). The hooks live in Projector.
 *
 * @since TBD
 */
final class Css_Builder {

	use Sanitizes_Css_Identifier;
	use Sanitizes_Css_Value;

	/**
	 * The variant var namespace, appended after the shared --kb-token-- prefix.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VARIANT_SEGMENT = 'variant--';

	/**
	 * Kadence theme global custom-property slots a variant may retarget beyond the numbered palette
	 * (palette1..9). These are the button's own color slots — the exact --global-* properties the
	 * button render path already consumes — so a variant re-skins the button with no change to its
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
	 * @var Token_Registry The registry the variant sets (and their bindings) are read from.
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Variant_Resolver Flattens each variant's bindings to resolved CSS values.
	 *
	 * @since TBD
	 */
	private Variant_Resolver $variants;

	/**
	 * @var Token_Store The store, read for the cache-busting version the collect memo keys on.
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * Per-request memo of built CSS, keyed on the active set's object-cache key, so a write (which bumps the
	 * set's version) invalidates the affected entry on its own.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private array $memo = [];

	/**
	 * Per-request memo of the collected variant structure, keyed on the set slug AND its store version, so the
	 * registry/resolver walk runs once per set even when several layers read it, yet a write (which bumps the
	 * version) produces a fresh collection rather than serving the pre-write structure.
	 *
	 * @since TBD
	 *
	 * @var array<string, array<string, array{selector:string, default:string, variants:array<string, array<string, array{target:string, value:string}>>}>>
	 */
	private array $collected = [];

	/**
	 * @since TBD
	 *
	 * @param Token_Registry   $registry The token registry.
	 * @param Variant_Resolver $variants The variant resolver.
	 * @param Token_Store      $store    The store, for the cache-busting version.
	 */
	public function __construct( Token_Registry $registry, Variant_Resolver $variants, Token_Store $store ) {
		$this->registry = $registry;
		$this->variants = $variants;
		$this->store    = $store;
	}

	/**
	 * Build the active set's variant CSS: the canonical variant-var definitions plus the scoped retarget
	 * rules. The pure, uncached assembler (its cached counterpart is css_for_version()).
	 *
	 * @since TBD
	 *
	 * @param string $active_slug The active set's slug.
	 *
	 * @return string The CSS, or an empty string when no block contributes a slot-targeted value.
	 */
	public function css( string $active_slug ): string {
		return $this->build( $active_slug );
	}

	/**
	 * Cached variant of css(): assembles the active set's variant CSS from the object cache with a per-request
	 * memo. A write bumps the set's store version, which changes the cache key, so a fresh build is produced on
	 * the next request.
	 *
	 * The plugin version is folded into the cache key alongside the store version, so the cache also busts on a
	 * plugin build (shipped variant definitions and the baseline can change with it).
	 *
	 * @since TBD
	 *
	 * @param string $active_slug The active set's slug.
	 * @param string $version     The store version the active set was built from.
	 *
	 * @return string
	 */
	public function css_for_version( string $active_slug, string $version ): string {
		$cache_key = 'variant_css_root_' . KADENCE_BLOCKS_VERSION . '_' . $active_slug . '_' . $version;

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build( $active_slug );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $cache_key ] = $css;
	}

	/**
	 * Build (uncached) the active set's variant CSS: the canonical variant-var definitions followed by the
	 * per-variant scoped rules and the class-less $default rules. The single assembly definition shared by
	 * css() and the cached css_for_version().
	 *
	 * @since TBD
	 *
	 * @param string $active_slug The active set slug.
	 *
	 * @return string
	 */
	private function build( string $active_slug ): string {
		$collected = $this->collect( $active_slug );

		return $this->canonical_block( $collected )
			. $this->scoped_variants( $collected )
			. $this->scoped_default( $collected );
	}

	/**
	 * Walk every (block, variant, property) that resolves to a slot-targeted value for a set, into a
	 * structure the layers below build from. The projected value keeps its var() target canonical, so an
	 * aliased variant chains to the set's canonical token. Memoized per slug for the request.
	 *
	 * @since TBD
	 *
	 * @param string $slug The set slug to resolve against.
	 *
	 * @return array<string, array{selector:string, default:string, variants:array<string, array<string, array{target:string, value:string}>>}>
	 */
	private function collect( string $slug ): array {
		$key = $slug . '_' . $this->store->get_version( $slug );

		if ( isset( $this->collected[ $key ] ) ) {
			return $this->collected[ $key ];
		}

		$out = [];

		foreach ( $this->registry->variant_blocks() as $block ) {
			// A block may carry registered bindings before the document defines its variants; that is not an
			// error, it simply contributes nothing yet, so skip a block whose set the registry never declared.
			$set = $this->registry->for_block( $block );

			if ( $set === null ) {
				continue;
			}

			try {
				$names = $this->variants->names( $block, $slug );
			} catch ( RuntimeException $e ) {
				continue;
			}

			$variants = [];

			foreach ( $names as $variant ) {
				try {
					$values = $this->variants->resolve( $block, $variant, $slug );
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
					$variants[ $variant ] = $properties;
				}
			}

			if ( $variants === [] ) {
				continue;
			}

			try {
				$default = $this->variants->default_variant( $block, $slug );
			} catch ( RuntimeException $e ) {
				$default = '';
			}

			$out[ $block ] = [
				'selector' => $this->block_selector( $block ),
				'default'  => $default,
				'variants' => $variants,
			];
		}

		return $this->collected[ $key ] = $out;
	}

	/**
	 * The active set's canonical `--kb-token--variant--*` declarations, without a selector wrapper — the raw
	 * `--kb-token--variant--<block>--<variant>--<property>:<value>;` list. The palette switch layer re-emits
	 * these under `[data-kb-palette]` so a per-block palette override forces each variant var to re-resolve
	 * against the subtree's re-tinted semantics (a variant that aliases a palette-changed color follows the
	 * chosen palette, so a variant Button re-skins with the rest of its subtree).
	 *
	 * @since TBD
	 *
	 * @param string $active_slug The active set's slug.
	 *
	 * @return string
	 */
	public function canonical_declarations( string $active_slug ): string {
		return $this->declarations_of( $this->collect( $active_slug ) );
	}

	/**
	 * Emit the canonical `--kb-token--variant--*` definitions from the active set's collected variants. The
	 * value preserves alias indirection canonically, so the variant chains to the active set's token.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, variants:array<string, array<string, array{target:string, value:string}>>}> $collected The active set's collected variants.
	 *
	 * @return string
	 */
	private function canonical_block( array $collected ): string {
		$declarations = $this->declarations_of( $collected );

		return $declarations === '' ? '' : Scope::root() . '{' . $declarations . '}';
	}

	/**
	 * The raw `--kb-token--variant--*:<value>;` declaration list for the collected variants, shared by the
	 * `:root` canonical block and the palette switch layer's re-emission.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, variants:array<string, array<string, array{target:string, value:string}>>}> $collected The active set's collected variants.
	 *
	 * @return string
	 */
	private function declarations_of( array $collected ): string {
		$declarations = '';

		foreach ( $collected as $block => $data ) {
			foreach ( $data['variants'] as $variant => $properties ) {
				foreach ( $properties as $property => $info ) {
					$declarations .= $this->variant_var( $block, $variant, $property ) . ':' . $this->sanitize_value( $info['value'] ) . ';';
				}
			}
		}

		return $declarations;
	}

	/**
	 * Emit the per-variant scoped rules from the active set's collected variants: per (block, variant) a
	 * ".wp-block-<block>.kb-variant--<variant>" rule pointing each --global-<slot> at the canonical variant
	 * var.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, variants:array<string, array<string, array{target:string, value:string}>>}> $collected The active set's collected variants.
	 *
	 * @return string
	 */
	private function scoped_variants( array $collected ): string {
		$css = '';

		foreach ( $collected as $block => $data ) {
			foreach ( $data['variants'] as $variant => $properties ) {
				$declarations = $this->slot_declarations( $block, $variant, $properties );

				if ( $declarations !== '' ) {
					$css .= $data['selector'] . '.' . Style::variant_class( $variant ) . '{' . $declarations . '}';
				}
			}
		}

		return $css;
	}

	/**
	 * Emit the class-less $default rules from the active set's collected variants: per block a
	 * ".wp-block-<block>" rule re-emitting the $default variant's declarations so a block with no variant
	 * selected still shows its preset. Its lower specificity yields to the kb-variant-- rules (a selected
	 * variant) and to a per-instance edit, so it only fills the gap.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, variants:array<string, array<string, array{target:string, value:string}>>}> $collected The active set's collected variants.
	 *
	 * @return string
	 */
	private function scoped_default( array $collected ): string {
		$css = '';

		foreach ( $collected as $block => $data ) {
			$default = $data['default'];

			if ( $default === '' || ! isset( $data['variants'][ $default ] ) ) {
				continue;
			}

			$declarations = $this->slot_declarations( $block, $default, $data['variants'][ $default ] );

			if ( $declarations !== '' ) {
				$css .= $data['selector'] . '{' . $declarations . '}';
			}
		}

		return $css;
	}

	/**
	 * Build the `--global-<slot>:var(<canonical variant var>);` declarations for one variant's properties.
	 *
	 * @since TBD
	 *
	 * @param string                                             $block      The block name.
	 * @param string                                             $variant    The variant slug.
	 * @param array<string, array{target:string, value:string}> $properties The variant's collected properties.
	 *
	 * @return string
	 */
	private function slot_declarations( string $block, string $variant, array $properties ): string {
		$declarations = '';

		foreach ( $properties as $property => $info ) {
			$declarations .= $info['target'] . ':var(' . $this->variant_var( $block, $variant, $property ) . ');';
		}

		return $declarations;
	}

	/**
	 * The CSS custom property a selected variant sets for a binding, or null when the binding drives none.
	 *
	 * A binding that targets a Kadence palette slot resolves to `--global-<slot>` (the color path); a binding
	 * that declares a `css_var` resolves to `--<css_var>` (e.g. `--kb-btn-radius` for border-radius, which has
	 * no palette slot). The variant's scoped rule sets this property to the per-variant value, so it can vary
	 * per variant while the block reads the same variable.
	 *
	 * @since TBD
	 *
	 * @param Binding $binding The variant binding.
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
	 * @param Binding $binding The variant binding.
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
	 * The canonical variant var name for a (block, variant, property):
	 * "--kb-token--variant--<block>--<variant>--<property>", e.g.
	 * --kb-token--variant--kadence-singlebtn--secondary--button-bg.
	 *
	 * @since TBD
	 *
	 * @param string $block    The block name.
	 * @param string $variant  The variant slug.
	 * @param string $property The block property.
	 *
	 * @return string
	 */
	private function variant_var( string $block, string $variant, string $property ): string {
		return Css_Var::get_prefix()
			. self::VARIANT_SEGMENT
			. self::sanitize_identifier( str_replace( '/', '-', $block ) ) . '--'
			. self::sanitize_identifier( $variant ) . '--'
			. self::sanitize_identifier( $property );
	}
}
