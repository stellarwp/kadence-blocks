<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Composes_Selector_Suffix;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use RuntimeException;

/**
 * Builds the scoped CSS for selectable Kadence block presets for the single active token library.
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
 * Only the active library is emitted (the active-library pointer selects it). The build has two layers:
 *
 *   1. The canonical preset-var definitions at `:root` —
 *      --kb-token--preset--<block>--<preset>--<property>: <value-or-var> — where an aliased binding reads
 *      var(--kb-token--<target>) so the preset chains to the active library's canonical token, and a literal
 *      binding emits the literal.
 *   2. Per (block, preset) scoped rules — ".wp-block-<block>.kb-preset--<preset>" — pointing each
 *      --global-<slot> at the canonical preset var, plus a class-less ".wp-block-<block>" rule for the
 *      $default preset so a block with no preset selected still shows its preset.
 *   3. Per (block, preset) STATE rules for any binding declaring a `css_state` — the block-and-preset
 *      qualification wrapped in `:where()` so it costs no specificity, with the state suffix appended
 *      (":where(.wp-block-<block>.kb-preset--<preset>):hover > .kt-inside-inner-col") — carrying a real
 *      declaration, "<css_prop>: var(<canonical preset var>)", rather than a var retarget. The $default's
 *      counterpart is qualified by "this block carries no preset class" so the two can never both match.
 *      A state has no variable of the block's own to point at: the block renders its resting appearance
 *      from an attribute or a token default, and its state appearance only when the block itself sets one,
 *      so there is nothing for a preset to redirect. This layer supplies the state rule outright. It is
 *      the ONLY layer that renders a state binding — the block-default-CSS projector skips them, because
 *      that layer renders only the $default preset and so would put a state rule on every instance of the
 *      block whether or not a preset asked for one. See {@see Binding::CSS_STATE}.
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

	use Composes_Selector_Suffix;
	use Sanitizes_Css_Identifier;
	use Sanitizes_Css_Value;

	/**
	 * The preset var namespace, appended after the shared --kb-token-- prefix.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRESET_SEGMENT = 'preset--';

	/**
	 * The four positional slot labels a per-slot dimension property's base declaration splits into,
	 * in CSS shorthand order (top, right, bottom, left). They are positional labels, not a claim
	 * about geometry: for a side-shaped property (padding, margin, border width) the label matches
	 * the CSS side it names, while for a corner-shaped property such as `button-radius` index
	 * 0/`'top'` is really the top-left corner. Index N here is slot index N everywhere else in the
	 * pipeline — the resolver's slot list and the editor's `dimensionSlots()`.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private const SLOTS = [ 'top', 'right', 'bottom', 'left' ];

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
	 * @var Token_Registry The registry the preset bindings are read from.
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
	 * @var Token_Store The store, read for the cache-busting version the collect memo keys on.
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * Per-request memo of built CSS, keyed on the active library's object-cache key, so a write (which bumps the
	 * library's version) invalidates the affected entry on its own.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private array $memo = [];

	/**
	 * Per-request memo of the collected preset structure, keyed on the library slug AND its store version, so the
	 * registry/resolver walk runs once per library even when several layers read it, yet a write (which bumps the
	 * version) produces a fresh collection rather than serving the pre-write structure.
	 *
	 * @since TBD
	 *
	 * @var array<string, array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}>>}>>
	 */
	private array $collected = [];

	/**
	 * @since TBD
	 *
	 * @param Token_Registry  $registry The token registry.
	 * @param Preset_Resolver $presets  The preset resolver.
	 * @param Token_Store     $store    The store, for the cache-busting version.
	 */
	public function __construct( Token_Registry $registry, Preset_Resolver $presets, Token_Store $store ) {
		$this->registry = $registry;
		$this->presets  = $presets;
		$this->store    = $store;
	}

	/**
	 * Build the active library's preset CSS: the canonical preset-var definitions plus the scoped retarget
	 * rules. The pure, uncached assembler (its cached counterpart is css_for_version()).
	 *
	 * @since TBD
	 *
	 * @param string                $active_slug The active library's slug.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string (e.g.
	 *                                           "tablet" => "(max-width: 1024px)"), for the per-breakpoint
	 *                                           redeclarations. Empty emits none.
	 *
	 * @return string The CSS, or an empty string when no block contributes a slot-targeted value.
	 */
	public function css( string $active_slug, array $breakpoints = [] ): string {
		return $this->build( $active_slug, $breakpoints, false );
	}

	/**
	 * Build the EDITOR-scoped version of the active library's preset CSS. Identical to {@see self::css()} for
	 * every layer but the state rules: the canonical vars and the `--global-*` / `--kb-*` retargets carry no
	 * dependency on the markup's shape, so they are reused verbatim. A state binding declaring an
	 * `editor_css_state` has its rule re-scoped to the element the editor actually renders — the Section
	 * paints `.kadence-inner-column-inner` in the canvas and `.kt-inside-inner-col` on the front end — so the
	 * state lands in the preview too.
	 *
	 * @since TBD
	 *
	 * @param string                $active_slug The active library's slug.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 *
	 * @return string The CSS, or an empty string when no block contributes a slot-targeted value.
	 */
	public function editor_css( string $active_slug, array $breakpoints = [] ): string {
		return $this->build( $active_slug, $breakpoints, true );
	}

	/**
	 * Cached version of css(): assembles the active library's preset CSS from the object cache with a per-request
	 * memo. A write bumps the library's store version, which changes the cache key, so a fresh build is produced on
	 * the next request.
	 *
	 * The plugin version is folded into the cache key alongside the store version, so the cache also busts on a
	 * plugin build (shipped preset definitions and the baseline can change with it).
	 *
	 * @since TBD
	 *
	 * @param string                $active_slug The active library's slug.
	 * @param string                $version     The store version the active library was built from.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string, for the per-breakpoint
	 *                                           redeclarations.
	 *
	 * @return string
	 */
	public function css_for_version( string $active_slug, string $version, array $breakpoints = [] ): string {
		return $this->for_version( $active_slug, $version, $breakpoints, false );
	}

	/**
	 * Cached version of editor_css(): same memo/object-cache mechanics as {@see self::css_for_version()}, but
	 * keyed under a distinct `editor` context so the editor-scoped string (which differs from the front-end
	 * one for any state binding declaring an `editor_css_state`) never collides with, or gets served in place
	 * of, the front-end cache entry.
	 *
	 * @since TBD
	 *
	 * @param string                $active_slug The active library's slug.
	 * @param string                $version     The store version the active library was built from.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 *
	 * @return string
	 */
	public function editor_css_for_version( string $active_slug, string $version, array $breakpoints = [] ): string {
		return $this->for_version( $active_slug, $version, $breakpoints, true );
	}

	/**
	 * The active library's canonical `--kb-token--preset--*` declarations, without a selector wrapper — the raw
	 * `--kb-token--preset--<block>--<preset>--<property>:<value>;` list. The palette switch layer re-emits
	 * these under `[data-kb-palette]` so a per-block palette override forces each preset var to re-resolve
	 * against the subtree's re-tinted semantics (a preset that aliases a palette-changed color follows the
	 * chosen palette, so a preset Button re-skins with the rest of its subtree).
	 *
	 * @since TBD
	 *
	 * @param string $active_slug The active library's slug.
	 *
	 * @return string
	 */
	public function canonical_declarations( string $active_slug ): string {
		return $this->declarations_of( $this->collect( $active_slug ) );
	}

	/**
	 * Shared cache/memo plumbing for {@see self::css_for_version()} and {@see self::editor_css_for_version()}.
	 * The context (front end vs editor) is folded into both the per-request memo key and the object-cache key
	 * so the two builds never share a cache slot.
	 *
	 * @since TBD
	 *
	 * @param string                $active_slug The active library's slug.
	 * @param string                $version     The store version the active library was built from.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 * @param bool                  $editor      Whether to build the editor-scoped CSS.
	 *
	 * @return string
	 */
	private function for_version( string $active_slug, string $version, array $breakpoints, bool $editor ): string {
		$context   = $editor ? 'editor' : 'front';
		$cache_key = 'preset_css_root_' . $context . '_' . KADENCE_BLOCKS_VERSION . '_' . $active_slug . '_' . $version . '_' . $this->breakpoint_signature( $breakpoints );

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build( $active_slug, $breakpoints, $editor );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $cache_key ] = $css;
	}

	/**
	 * Build (uncached) the active library's preset CSS: the canonical preset-var definitions followed by the
	 * per-preset scoped rules and the class-less $default rules. The single assembly definition shared by
	 * css()/editor_css() and their cached counterparts.
	 *
	 * @since TBD
	 *
	 * @param string                $active_slug The active library slug.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 * @param bool                  $editor      Whether to scope state rules to the editor's markup.
	 *
	 * @return string
	 */
	private function build( string $active_slug, array $breakpoints, bool $editor ): string {
		$collected = $this->collect( $active_slug );

		return $this->canonical_block( $collected )
			. $this->scoped_presets( $collected, $editor )
			. $this->scoped_default( $collected, $editor )
			. $this->responsive_blocks( $active_slug, $collected, $breakpoints );
	}

	/**
	 * Walk every (block, preset, property) that resolves to a slot-targeted value for a library, into a
	 * structure the layers below build from. The projected value keeps its var() target canonical, so an
	 * aliased preset chains to the library's canonical token. Memoized per slug for the request.
	 *
	 * @since TBD
	 *
	 * @param string $slug The library slug to resolve against.
	 *
	 * @return array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}>>}>
	 */
	private function collect( string $slug ): array {
		$key = $slug . '_' . $this->store->get_version( $slug );

		if ( isset( $this->collected[ $key ] ) ) {
			return $this->collected[ $key ];
		}

		$out = [];

		foreach ( $this->registry->preset_binding_blocks() as $block ) {
			// A block may carry registered bindings before the document defines its presets; that is not an
			// error, it simply contributes nothing yet, so skip a block whose preset bindings the registry never declared.
			$bindings = $this->registry->for_block( $block );

			if ( $bindings === null ) {
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
					$values = $this->presets->resolve( $block, $preset, $slug );
				} catch ( RuntimeException $e ) {
					continue;
				}

				$properties = [];

				foreach ( $values as $property => $value ) {
					$binding = $bindings->binding( $property );

					if ( $binding === null ) {
						continue;
					}

					// Only a "dimension" kind binding ever carries a per-slot list (the write-time
					// guard rejects one on any other kind); gating the slot split on this, rather than
					// on the value's own shape, avoids a false-positive split of an unrelated value that
					// happens to contain spaces (e.g. a shadow literal).
					$dimension = $bindings->kind( $property ) === Preset_Bindings::get_kind_dimension();

					// A state binding carries a declaration rather than a var retarget, and both of its selectors
					// are collected so the front-end and editor builds share one memoized walk. It contributes
					// nothing without a property to set, since the state rule IS that declaration.
					if ( $binding->is_state() ) {
						$prop = $binding->css_prop();

						if ( $prop === null ) {
							continue;
						}

						$properties[ $property ] = [
							'target'    => null,
							'value'     => $value,
							'dimension' => $dimension,
							'prop'      => $prop,
							'state'     => $binding->css_state(),
							'editor'    => $binding->editor_css_state(),
						];

						continue;
					}

					$target = $this->target_var( $binding );

					if ( $target === null ) {
						continue;
					}

					$properties[ $property ] = [
						'target'    => $target,
						'value'     => $value,
						'dimension' => $dimension,
						'prop'      => null,
						'state'     => null,
						'editor'    => null,
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

		return $this->collected[ $key ] = $out;
	}

	/**
	 * Emit the canonical `--kb-token--preset--*` definitions from the active library's collected presets. The
	 * value preserves alias indirection canonically, so the preset chains to the active library's token.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}>>}> $collected The active library's collected presets.
	 *
	 * @return string
	 */
	private function canonical_block( array $collected ): string {
		$declarations = $this->declarations_of( $collected );

		return $declarations === '' ? '' : Scope::root() . '{' . $declarations . '}';
	}

	/**
	 * The raw `--kb-token--preset--*:<value>;` declaration list for the collected presets, shared by the
	 * `:root` canonical block and the palette switch layer's re-emission.
	 *
	 * A per-slot dimension property (border radius, padding, margin, border width) emits four extra
	 * slot-specific vars alongside its usual canonical var — see {@see self::property_declarations()}.
	 * Every other property emits exactly the single declaration it always has.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}>>}> $collected The active library's collected presets.
	 *
	 * @return string
	 */
	private function declarations_of( array $collected ): string {
		$declarations = '';

		foreach ( $collected as $block => $data ) {
			foreach ( $data['presets'] as $preset => $properties ) {
				foreach ( $properties as $property => $info ) {
					$declarations .= $this->property_declarations( $block, (string) $preset, (string) $property, $info );
				}
			}
		}

		return $declarations;
	}

	/**
	 * The base declaration(s) for one preset property.
	 *
	 * A scalar value (any non-dimension property, or a dimension property whose value was not a
	 * four-slot shorthand) emits the single canonical declaration it always has:
	 * `--kb-token--preset--<block>--<preset>--<property>:<value>;`.
	 *
	 * A per-slot dimension value instead emits four slot-specific vars — one per {@see self::SLOTS}
	 * suffix — plus the canonical var, now composed purely from `var()` references to those four:
	 * `--...--<property>:var(--...--top) var(--...--right) var(--...--bottom) var(--...--left);`. The
	 * slot vars are new plumbing underneath an unchanged public contract: the composed var's name and
	 * resolved value are exactly what they always were, so every bridge (`--global-*`, `--kb-btn-radius`)
	 * that already points at it keeps working unchanged, and {@see self::responsive_blocks()} can redeclare
	 * a single touched slot without ever redeclaring the composed var itself.
	 *
	 * @since TBD
	 *
	 * @param string                                  $block    The block name.
	 * @param string                                  $preset   The preset slug.
	 * @param string                                  $property The block property.
	 * @param array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string} $info The property's collected target/value/kind.
	 *
	 * @return string
	 */
	private function property_declarations( string $block, string $preset, string $property, array $info ): string {
		$slots = $this->slots_of( $info['value'], $info['dimension'] );

		if ( $slots === null ) {
			return $this->preset_var( $block, $preset, $property ) . ':' . $this->sanitize_value( $info['value'] ) . ';';
		}

		$declarations = '';
		$refs         = [];

		foreach ( self::SLOTS as $index => $slot_suffix ) {
			$slot_var      = $this->slot_var( $block, $preset, $property, $slot_suffix );
			$declarations .= $slot_var . ':' . $this->sanitize_value( $slots[ $index ] ) . ';';
			$refs[]        = 'var(' . $slot_var . ')';
		}

		return $declarations . $this->preset_var( $block, $preset, $property ) . ':' . implode( ' ', $refs ) . ';';
	}

	/**
	 * Split a property's projected value into its four slot values, or null when it isn't a per-slot
	 * dimension value.
	 *
	 * The split is lossless because {@see \KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver::project()}
	 * is the only place that joins a slot list with a bare space (`implode(' ', $projected)`), and
	 * `Dtcg_Validator` rejects any slot literal containing a space, so every segment `explode(' ', $value)`
	 * produces is exactly one slot — including the responsive-only `''` gap sentinel, which round-trips as
	 * an empty segment. The split is additionally gated on the property being a "dimension" kind binding
	 * (the only kind a slot list is meaningful for — see {@see Preset_Bindings::kind()}).
	 *
	 * @todo A slot list handed over as an array, rather than pre-joined into a string by the resolver,
	 *       would remove the need to split it back apart here at all.
	 *
	 * @since TBD
	 *
	 * @param string $value     The property's projected value.
	 * @param bool   $dimension Whether the property is a "dimension" kind binding.
	 *
	 * @return string[]|null The four slot values (index 0-3 = top, right, bottom, left; a gap is `''`),
	 *                       or null when the value is not a four-part per-slot shorthand.
	 */
	private function slots_of( string $value, bool $dimension ): ?array {
		if ( ! $dimension ) {
			return null;
		}

		$parts = explode( ' ', $value );

		return count( $parts ) === count( self::SLOTS ) ? $parts : null;
	}

	/**
	 * The per-slot var name for a (block, preset, property, slot): the canonical preset var with a
	 * "--<slot>" suffix, e.g. --kb-token--preset--kadence-singlebtn--hero--button-radius--top.
	 *
	 * @since TBD
	 *
	 * @param string $block       The block name.
	 * @param string $preset      The preset slug.
	 * @param string $property    The block property.
	 * @param string $slot_suffix The slot suffix (one of {@see self::SLOTS}).
	 *
	 * @return string
	 */
	private function slot_var( string $block, string $preset, string $property, string $slot_suffix ): string {
		return $this->preset_var( $block, $preset, $property ) . '--' . $slot_suffix;
	}

	/**
	 * The `@media`-block declaration(s) for one breakpoint's override of one property.
	 *
	 * A scalar override (a non-dimension property, or a dimension property overridden with one uniform
	 * value) redeclares the canonical var itself, exactly like the pre-per-slot behavior. A per-slot
	 * override instead redeclares only the touched slot vars — a `''` gap slot is skipped so that slot
	 * keeps inheriting live — and never redeclares the composed var (see {@see self::responsive_blocks()}).
	 *
	 * @since TBD
	 *
	 * @param string $block     The block name.
	 * @param string $preset    The preset slug.
	 * @param string $property  The block property.
	 * @param string $value     The breakpoint's projected override value for the property.
	 * @param bool   $dimension Whether the property is a "dimension" kind binding.
	 *
	 * @return string
	 */
	private function responsive_declarations( string $block, string $preset, string $property, string $value, bool $dimension ): string {
		$slots = $this->slots_of( $value, $dimension );

		if ( $slots === null ) {
			return $this->preset_var( $block, $preset, $property ) . ':' . $this->sanitize_value( $value ) . ';';
		}

		$declarations = '';

		foreach ( self::SLOTS as $index => $slot_suffix ) {
			if ( $slots[ $index ] === '' ) {
				continue; // A gap: not overridden at this breakpoint, keep inheriting live.
			}

			$declarations .= $this->slot_var( $block, $preset, $property, $slot_suffix ) . ':' . $this->sanitize_value( $slots[ $index ] ) . ';';
		}

		return $declarations;
	}

	/**
	 * Emit the per-preset scoped rules from the active library's collected presets: per (block, preset) a
	 * ".wp-block-<block>.kb-preset--<preset>" rule pointing each --global-<slot> at the canonical preset
	 * var.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}>>}> $collected The active library's collected presets.
	 *
	 * @return string
	 */
	private function scoped_presets( array $collected, bool $editor ): string {
		$css = '';

		foreach ( $collected as $block => $data ) {
			foreach ( $data['presets'] as $preset => $properties ) {
				$preset_class = '.' . Style::preset_class( (string) $preset );
				$declarations = $this->slot_declarations( $block, (string) $preset, $properties );

				if ( $declarations !== '' ) {
					$css .= $data['selector'] . $preset_class . '{' . $declarations . '}';
				}

				$css .= $this->state_rules(
					$block,
					(string) $preset,
					$this->state_scope( $data['selector'], $preset_class ),
					$properties,
					$editor
				);
			}
		}

		return $css;
	}

	/**
	 * Emit the class-less $default rules from the active library's collected presets: per block a
	 * ".wp-block-<block>" rule re-emitting the $default preset's declarations so a block with no preset
	 * selected still shows its preset. Its lower specificity yields to the kb-preset-- rules (a selected
	 * preset) and to a per-instance edit, so it only fills the gap.
	 *
	 * @since TBD
	 *
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}>>}> $collected The active library's collected presets.
	 *
	 * @return string
	 */
	private function scoped_default( array $collected, bool $editor ): string {
		$css = '';

		foreach ( $collected as $block => $data ) {
			$default = $data['default'];

			if ( $default === '' || ! isset( $data['presets'][ $default ] ) ) {
				continue;
			}

			$properties   = $data['presets'][ $default ];
			$declarations = $this->slot_declarations( $block, $default, $properties );

			if ( $declarations !== '' ) {
				$css .= $data['selector'] . '{' . $declarations . '}';
			}

			$css .= $this->state_rules( $block, $default, $this->state_scope( $data['selector'], null ), $properties, $editor );
		}

		return $css;
	}

	/**
	 * The scope a state rule is emitted under: the whole block-and-preset qualification wrapped in `:where()`,
	 * so it matches exactly as it would unwrapped while contributing no specificity of its own.
	 *
	 * Every other layer of this projection writes custom properties, whose specificity never competes with a
	 * block's own declarations. A state rule writes a real declaration, so it does — and the layering rule the
	 * whole projection rests on is that a preset yields to the block's own CSS. Left un-neutralized, the block
	 * class plus the preset class would put a state rule two classes above the state's own weight, which is
	 * more than most blocks spend on their per-instance rules; a preset's hover would then beat a hover the
	 * user set on the block itself.
	 *
	 * With the qualification weightless, a state rule weighs exactly what the binding's `css_state` names —
	 * which is where a block's author states the weight that block needs, the only place that knows what the
	 * block's own rules cost. That also leaves a named preset's rule and the `$default`'s at the SAME weight,
	 * which is why the `$default`'s is qualified by "this block has no preset class" rather than by nothing:
	 * the two must never both match, since neither could then outrank the other.
	 *
	 * @since TBD
	 *
	 * @param string      $selector The block's `.wp-block-*` selector.
	 * @param string|null $preset   The preset class selector (leading dot included) for a named preset, or
	 *                              null for the `$default`'s rule.
	 *
	 * @return string
	 */
	private function state_scope( string $selector, ?string $preset ): string {
		$qualifier = $preset !== null
			? $selector . $preset
			: $selector . ':not([class*="' . Style::get_class_prefix() . '"])';

		return ':where(' . $qualifier . ')';
	}

	/**
	 * Build the `--global-<slot>:var(<canonical preset var>);` declarations for one preset's properties.
	 *
	 * @since TBD
	 *
	 * @param string                                            $block      The block name.
	 * @param string                                            $preset     The preset slug.
	 * @param array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}> $properties The preset's collected properties.
	 *
	 * @return string
	 */
	private function slot_declarations( string $block, string $preset, array $properties ): string {
		$declarations = '';

		foreach ( $properties as $property => $info ) {
			// A state property has no variable of the block's own to retarget; it is emitted as its own rule
			// by state_rules() instead.
			if ( $info['target'] === null ) {
				continue;
			}

			$declarations .= $info['target'] . ':var(' . $this->preset_var( $block, $preset, (string) $property ) . ');';
		}

		return $declarations;
	}

	/**
	 * Emit one preset's state rules for a block: per distinct state suffix, a
	 * "<scope><suffix>{<css_prop>:var(<canonical preset var>);}" rule.
	 *
	 * The scope is the caller's — the preset-classed selector for a named preset, the bare block selector for
	 * the $default one — so the same specificity relationship the var-retarget layers have is preserved: a
	 * selected preset's state outranks the $default's, and the block's own per-instance state rule outranks
	 * both.
	 *
	 * Grouped by suffix so a block with several state properties on the same element emits one rule, matching
	 * how the block-default-CSS layer groups its own descendant rules.
	 *
	 * A `css_state` may name several states at once, comma separated (`*.kb-button:hover,*.kb-button:focus`),
	 * for the many blocks whose own CSS treats hover and keyboard focus as one look. Each part is scoped
	 * independently — the scope is repeated per part rather than distributed over the group — because a
	 * selector list only applies its leading compound to its FIRST part, so a naive concatenation would leave
	 * every part after the first matching the whole document.
	 *
	 * @since TBD
	 *
	 * @param string                                                                                          $block      The block name.
	 * @param string                                                                                          $preset     The preset slug, for the canonical var name.
	 * @param string                                                                                          $scope      The selector the state suffix is appended to.
	 * @param array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}> $properties The preset's collected properties.
	 * @param bool                                                                                            $editor     Whether to use each binding's editor state suffix.
	 *
	 * @return string
	 */
	private function state_rules( string $block, string $preset, string $scope, array $properties, bool $editor ): string {
		$by_suffix = [];

		foreach ( $properties as $property => $info ) {
			if ( $info['prop'] === null ) {
				continue;
			}

			$suffixes = $this->state_suffixes( $editor ? $info['editor'] : $info['state'] );

			// An empty suffix list would put the declaration on the block root with no state at all, which is
			// the block-default layer's job and would repaint every instance. A state binding whose suffix
			// sanitizes away contributes nothing rather than silently becoming a resting-state rule.
			if ( $suffixes === [] ) {
				continue;
			}

			$by_suffix[ implode( ',', $suffixes ) ][] = $info['prop'] . ':var(' . $this->preset_var( $block, $preset, (string) $property ) . ')';
		}

		$css = '';

		foreach ( $by_suffix as $suffix => $declarations ) {
			$parts = array_map(
				static function ( string $part ) use ( $scope ): string {
					return $scope . $part;
				},
				explode( ',', (string) $suffix )
			);

			$css .= implode( ',', $parts ) . '{' . implode( ';', $declarations ) . ';}';
		}

		return $css;
	}

	/**
	 * Split a binding's raw state selector into its individual, composed suffixes, dropping any part that
	 * sanitizes away to nothing.
	 *
	 * @since TBD
	 *
	 * @param string|null $state The binding's raw `css_state` / `editor_css_state`.
	 *
	 * @return string[] The composed suffixes, empty when the binding names no usable state.
	 */
	private function state_suffixes( ?string $state ): array {
		$suffixes = [];

		foreach ( explode( ',', (string) $state ) as $part ) {
			$suffix = $this->selector_suffix( $part );

			if ( $suffix !== '' ) {
				$suffixes[] = $suffix;
			}
		}

		return $suffixes;
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
	 * Redeclare each preset var that varies by breakpoint inside that breakpoint's `@media` block.
	 *
	 * For a scalar property (any non-dimension property, or a dimension property overridden uniformly),
	 * the canonical var itself is redeclared, exactly as before — the scoped `--global-*` / `--kb-*`
	 * bridges are untouched, because they already point at the preset var, so overriding it inside the
	 * media query is enough for every consumer to follow. Mirrors the token projection's
	 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Css_Builder} responsive layer: same
	 * media wrapper, same :root scope, same "redeclare the same custom property" approach.
	 *
	 * For a per-slot dimension property, ONLY the touched slot vars are redeclared — never the
	 * composed var. A gap slot (the responsive-only `''` sentinel {@see Preset_Resolver} keeps in place) is
	 * skipped entirely, so that slot keeps inheriting live from whatever the composed var's `var()` chain
	 * currently resolves to outside this media query, rather than freezing it. The composed var itself picks
	 * up a touched slot's new value automatically: browsers re-evaluate a `var()` reference live, so
	 * redeclaring one slot var here changes what the (untouched, never-redeclared) composed var resolves
	 * to for elements matching this breakpoint.
	 *
	 * @since TBD
	 *
	 * @param string                $active_slug The active library's slug.
	 * @param array<string, array{selector:string, default:string, presets:array<string, array<string, array{target:?string, value:string, dimension:bool, prop:?string, state:?string, editor:?string}>>}> $collected The collected preset structure, for the block/preset list.
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 *
	 * @return string
	 */
	private function responsive_blocks( string $active_slug, array $collected, array $breakpoints ): string {
		if ( $collected === [] || $breakpoints === [] ) {
			return '';
		}

		$by_breakpoint = [];

		foreach ( $collected as $block => $data ) {
			foreach ( $data['presets'] as $preset => $properties ) {
				try {
					$responsive = $this->presets->resolve_responsive( $block, (string) $preset, $active_slug );
				} catch ( RuntimeException $e ) {
					continue; // A preset that stopped resolving contributes no overrides, like the flat layer.
				}

				foreach ( $responsive as $breakpoint => $overrides ) {
					foreach ( $overrides as $property => $value ) {
						// Only a property the flat layer emitted has a var to override; skip anything else so a
						// media block can never introduce a var the base projection never defined.
						if ( ! isset( $properties[ $property ] ) ) {
							continue;
						}

						$declaration = $this->responsive_declarations(
							$block,
							(string) $preset,
							(string) $property,
							$value,
							$properties[ $property ]['dimension']
						);

						// An all-gap per-slot override declares nothing; keeping it out avoids an empty @media block.
						if ( $declaration === '' ) {
							continue;
						}

						$by_breakpoint[ $breakpoint ][] = $declaration;
					}
				}
			}
		}

		$css = '';

		foreach ( $breakpoints as $breakpoint => $query ) {
			if ( $query === '' || empty( $by_breakpoint[ $breakpoint ] ) ) {
				continue;
			}

			$css .= '@media all and ' . $query . '{' . Scope::root() . '{' . implode( '', $by_breakpoint[ $breakpoint ] ) . '}}';
		}

		return $css;
	}

	/**
	 * A stable signature for a breakpoint map, so the cache key changes when the filtered media queries do.
	 *
	 * @since TBD
	 *
	 * @param array<string, string> $breakpoints Breakpoint => media-query string.
	 *
	 * @return string
	 */
	private function breakpoint_signature( array $breakpoints ): string {
		if ( $breakpoints === [] ) {
			return 'none';
		}

		ksort( $breakpoints );

		return md5( (string) wp_json_encode( $breakpoints ) );
	}

	/**
	 * The canonical preset var name for a (block, preset, property):
	 * "--kb-token--preset--<block>--<preset>--<property>", e.g.
	 * --kb-token--preset--kadence-singlebtn--secondary--button-bg.
	 *
	 * @since TBD
	 *
	 * @param string $block    The block name.
	 * @param string $preset   The preset slug.
	 * @param string $property The block property.
	 *
	 * @return string
	 */
	private function preset_var( string $block, string $preset, string $property ): string {
		return Css_Var::get_prefix()
			. self::PRESET_SEGMENT
			. self::sanitize_identifier( str_replace( '/', '-', $block ) ) . '--'
			. self::sanitize_identifier( $preset ) . '--'
			. self::sanitize_identifier( $property );
	}
}
