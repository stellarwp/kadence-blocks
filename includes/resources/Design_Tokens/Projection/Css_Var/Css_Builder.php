<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Contracts\Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Font_Size_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Gap_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Spacing_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;

/**
 * Builds the CSS custom-property output for every token set at once — the CSS-variable backbone, in the
 * design-system "Option B" publisher shape so palette switching is pure CSS with no server re-resolve.
 *
 * For N sets (slug => its namespaced Resolved_Tokens) plus the active set's slug, emits:
 *
 *   1. One namespaced block per set — `--kb-token--<set>--<id>: <value-or-var>` straight from each set's
 *      namespaced projected map. The literal value of a token lives here, once; a set's alias chain stays
 *      inside the set (`--kb-token--<set>--<semantic>: var(--kb-token--<set>--<primitive>)`).
 *   2. The active-library alias layer — `--kb-token--<id>: var(--kb-token--<active>--<id>)` for every active
 *      token, so block content and the bridges below reference the canonical name without knowing which
 *      set is active (the server-side switch: re-point this layer).
 *   3. One switch selector per set — `[data-kb-token-set="<set>"] { --kb-token--<id>: var(--kb-token--<set>--<id>); <bridges> }`
 *      so a container attribute re-points the canonical token names — and the legacy global-var bridges in
 *      (4) — for that subtree. Emitted for every set (incl. the active one) so an element can revert to the
 *      active set under a non-active ancestor.
 *   4. The legacy global-var bridges: the `--global-kb-<family>-<slug>` slot overrides (spacing/gap/font-size)
 *      and, inside the switch selectors, the `--global-palette*` overrides — each pointing at the canonical
 *      names with the set's resolved literal as a fallback. Emitted at :root for the active set and inside
 *      every set's switch selector, so a block pinned to a set resolves these bridges to that set too. (The
 *      active :root palette itself stays owned by the legacy color filter and is not emitted here.)
 *
 * Scope of the switch selector: CSS substitutes a var() inside a custom property at the element where that
 * property is *declared*. The switch selector therefore re-declares both the canonical layer AND the bridges
 * in (4) on the attribute-carrying element, so a `[data-kb-token-set]` subtree resolves every token — the
 * canonical --kb-token--* and the --global-* bridges alike — to that set. (A host/theme custom property that
 * reads --kb-token--* only at :root still follows the active-library pointer, not a subtree attribute.)
 *
 * Bare :root makes the variables live everywhere KB prints them (front end and editor iframe alike).
 * :where(.kb-tokens) is an additional zero-specificity hook for future opt-in or preset scoping. The
 * `[data-kb-token-set]` switch selector declares `--kb-token--<id>` directly on the element that carries
 * the attribute, so that element and its subtree use the directly-declared value in preference to the one
 * inherited from the :root alias layer — a directly-cascaded value always beats an inherited one, so
 * source order does not matter (the two rules target different elements). Nothing here is !important —
 * per-instance preset overrides must be able to win by ordinary cascade.
 *
 * Pure: no WordPress calls, no globals, no side effects. The WordPress wiring lives in Projector.
 *
 * @since TBD
 */
final class Css_Builder {

	use Sanitizes_Css_Identifier;
	use Sanitizes_Css_Value;

	/**
	 * Object-cache group shared with the resolver.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * The HTML attribute a container sets to switch the token set for its subtree. Its
	 * `[data-kb-token-set="<slug>"]` rule re-points the canonical alias layer — and the legacy global-var
	 * bridges — at that set's namespaced vars.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SWITCH_ATTR = 'data-kb-token-set';

	/**
	 * The registry the token sets are resolved and projected from.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Per-request memo of built CSS, keyed on the object-cache key of each cached fragment plus the
	 * full-assembly signature, so a write (which bumps a set's version) invalidates the affected entries
	 * without an explicit purge hook.
	 *
	 * @since TBD
	 *
	 * @var array<string,string>
	 */
	private array $memo = [];

	/**
	 * The HTML attribute that switches the active token set client-side ("data-kb-token-set"), for a future
	 * body-class switcher UI.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_switch_attribute(): string {
		return self::SWITCH_ATTR;
	}

	/**
	 * @param Token_Registry $registry
	 */
	public function __construct( Token_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Build the full multi-set CSS string. Front end and editor share it verbatim. The pure, uncached
	 * assembler (its cached counterpart is css_for_version()).
	 *
	 * @since TBD
	 *
	 * @param array<string,Resolved_Tokens> $resolved_by_slug Each set slug => its namespaced resolved maps
	 *                                                         (from Token_Resolver::resolve_namespaced()).
	 * @param string                        $active_slug      The active set's slug — the set the canonical
	 *                                                         alias layer points at.
	 * @param array<string,string>          $breakpoints      Breakpoint => media-query string (e.g.
	 *                                                         "tablet" => "(max-width: 1024px)"), for the
	 *                                                         per-breakpoint responsive var redeclaration.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( array $resolved_by_slug, string $active_slug, array $breakpoints = [] ): string {
		if ( ! isset( $resolved_by_slug[ $active_slug ] ) ) {
			return '';
		}

		$css = '';
		foreach ( $resolved_by_slug as $slug => $resolved ) {
			$css .= $this->build_set_fragment( $resolved, (string) $slug, $breakpoints );
		}

		return $css . $this->build_active_fragment( $resolved_by_slug[ $active_slug ], $active_slug );
	}

	/**
	 * Cached variant of css(): assembles the per-set fragments and the active fragment from the object
	 * cache at fragment granularity, with a per-request memo. Editing one set busts only that set's
	 * fragment; switching the active set reuses every per-set fragment and rebuilds only the active one.
	 *
	 * The plugin version is folded into each fragment's cache key alongside the store version: the store
	 * version tracks stored overrides, but projected CSS also depends on shipped declarations and the
	 * baseline, which change with a plugin build. Including KADENCE_BLOCKS_VERSION busts on upgrade.
	 *
	 * @since TBD
	 *
	 * @param array<string,Resolved_Tokens> $resolved_by_slug Each set slug => its namespaced resolved maps.
	 * @param array<string,string>          $versions         Each set slug => the store version it was built from.
	 * @param string                        $active_slug      The active set's slug.
	 * @param array<string,string>          $breakpoints      Breakpoint => media-query string, for the
	 *                                                         per-breakpoint responsive var redeclaration.
	 *
	 * @return string
	 */
	public function css_for_version( array $resolved_by_slug, array $versions, string $active_slug, array $breakpoints = [] ): string {
		if ( ! isset( $resolved_by_slug[ $active_slug ] ) ) {
			return '';
		}

		$breakpoint_signature = $this->breakpoint_signature( $breakpoints );
		$signature            = 'assembly:' . $active_slug . '@' . $breakpoint_signature;
		foreach ( $resolved_by_slug as $slug => $resolved ) {
			$signature .= '|' . (string) $slug . ':' . ( $versions[ $slug ] ?? '' );
		}

		if ( isset( $this->memo[ $signature ] ) ) {
			return $this->memo[ $signature ];
		}

		$css = '';
		foreach ( $resolved_by_slug as $slug => $resolved ) {
			$slug = (string) $slug;
			$css .= $this->set_fragment( $resolved, $slug, (string) ( $versions[ $slug ] ?? '' ), $breakpoints );
		}

		$css .= $this->active_fragment(
			$resolved_by_slug[ $active_slug ],
			$active_slug,
			(string) ( $versions[ $active_slug ] ?? '' )
		);

		return $this->memo[ $signature ] = $css;
	}

	/**
	 * A set's per-set fragment — its namespaced definition block plus its switch selector — served from /
	 * stored in the object cache. Active-independent: it depends only on this set's resolved map, so it is
	 * reused unchanged across a change of active set.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens      $resolved    The set's namespaced resolved maps.
	 * @param string               $slug        The set slug.
	 * @param string               $version     The store version the set was built from.
	 * @param array<string,string> $breakpoints Breakpoint => media-query string, folded into the cache key
	 *                                           because the emitted CSS depends on the active breakpoints.
	 *
	 * @return string
	 */
	public function set_fragment( Resolved_Tokens $resolved, string $slug, string $version, array $breakpoints = [] ): string {
		$cache_key = 'projected_css_set_' . KADENCE_BLOCKS_VERSION . '_' . $slug . '_' . $version . '_' . $this->breakpoint_signature( $breakpoints );

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build_set_fragment( $resolved, $slug, $breakpoints );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $cache_key ] = $css;
	}

	/**
	 * The active fragment — the canonical alias layer plus the slot bridges — served from /
	 * stored in the object cache. Depends only on the active set, so a switch rebuilds just this.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $active      The active set's namespaced resolved maps.
	 * @param string          $active_slug The active set slug.
	 * @param string          $version     The store version the active set was built from.
	 *
	 * @return string
	 */
	public function active_fragment( Resolved_Tokens $active, string $active_slug, string $version ): string {
		$cache_key = 'projected_css_active_' . KADENCE_BLOCKS_VERSION . '_' . $active_slug . '_' . $version;

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build_active_fragment( $active, $active_slug );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $cache_key ] = $css;
	}

	/**
	 * Build (uncached) a set's per-set fragment: the namespaced definition block followed by its switch
	 * selector. The single assembly definition shared by css() and the cached set_fragment().
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens      $resolved    The set's namespaced resolved maps.
	 * @param string               $slug        The set slug.
	 * @param array<string,string> $breakpoints Breakpoint => media-query string.
	 *
	 * @return string
	 */
	private function build_set_fragment( Resolved_Tokens $resolved, string $slug, array $breakpoints = [] ): string {
		return $this->namespaced_block( $resolved, $breakpoints ) . $this->switch_block( $resolved, $slug );
	}

	/**
	 * Build (uncached) the active fragment: the canonical alias layer plus the slot bridges.
	 * The single assembly definition shared by css() and the cached active_fragment().
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $active      The active set's namespaced resolved maps.
	 * @param string          $active_slug The active set slug.
	 *
	 * @return string
	 */
	private function build_active_fragment( Resolved_Tokens $active, string $active_slug ): string {
		$slots = $this->all_slot_declarations( $active );

		return $this->alias_block( $active, $active_slug )
			. ( $slots === '' ? '' : Scope::root() . '{' . $slots . '}' );
	}

	/**
	 * Emit a set's `--kb-token--<set>--*` definitions from its namespaced projected css-var => value map.
	 *
	 * The projection preserves alias indirection: a reference-valued token reads
	 * `var(--kb-token--<set>--<target>)` and a composite keeps a `var()` for any aliased field, so the
	 * chain stays inside the set and editing a referenced token updates every dependent token live, with
	 * no server re-resolve. A raw-valued token (a primitive, or a semantic overridden to a literal) emits
	 * the literal — the value lives once, at the leaf. var() references derive from the alias grammar
	 * (`[\w.-]+`) and survive sanitization untouched, which still strips any breakout characters from the
	 * literal portions.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens      $resolved    The set's namespaced resolved maps.
	 * @param array<string,string> $breakpoints Breakpoint => media-query string, for the responsive
	 *                                           redeclaration blocks appended after the base declarations.
	 *
	 * @return string
	 */
	private function namespaced_block( Resolved_Tokens $resolved, array $breakpoints = [] ): string {
		$projected = $resolved->projected_vars();
		if ( $projected === [] ) {
			return '';
		}

		$declarations = '';
		foreach ( $projected as $var => $value ) {
			$declarations .= $var . ':' . $this->sanitize_value( $value ) . ';';
		}

		return Scope::root() . '{' . $declarations . '}' . $this->responsive_blocks( $resolved->projected_responsive(), $breakpoints );
	}

	/**
	 * Emit the per-breakpoint responsive redeclarations: for each breakpoint that has overrides, redeclare
	 * the affected `--kb-token--<set>--*` vars inside that breakpoint's `@media` block, at the same :root
	 * scope, so a value declared once at :root is overridden within the query and every consuming token /
	 * block follows for free. Breakpoints are emitted in the given order (tablet before mobile), so the
	 * narrower max-width override wins by source order. A document with no responsive tokens emits nothing,
	 * keeping flat output byte-for-byte unchanged.
	 *
	 * @since TBD
	 *
	 * @param array<string,array<string,string>> $responsive  css-var => [ breakpoint => value ] overrides.
	 * @param array<string,string>               $breakpoints Breakpoint => media-query string.
	 *
	 * @return string
	 */
	private function responsive_blocks( array $responsive, array $breakpoints ): string {
		if ( $responsive === [] ) {
			return '';
		}

		$css = '';
		foreach ( $breakpoints as $breakpoint => $query ) {
			if ( $query === '' ) {
				continue;
			}

			$declarations = '';
			foreach ( $responsive as $var => $by_breakpoint ) {
				if ( ! isset( $by_breakpoint[ $breakpoint ] ) ) {
					continue;
				}

				$declarations .= $var . ':' . $this->sanitize_value( $by_breakpoint[ $breakpoint ] ) . ';';
			}

			if ( $declarations === '' ) {
				continue;
			}

			$css .= '@media all and ' . $query . '{' . Scope::root() . '{' . $declarations . '}}';
		}

		return $css;
	}

	/**
	 * A short, stable signature of the active breakpoint media-query strings, folded into fragment cache
	 * keys so a change to the filterable breakpoints busts the projected-CSS cache. serialize() keeps this
	 * dependency-free (the builder stays WordPress-agnostic).
	 *
	 * @since TBD
	 *
	 * @param array<string,string> $breakpoints Breakpoint => media-query string.
	 *
	 * @return string
	 */
	private function breakpoint_signature( array $breakpoints ): string {
		if ( $breakpoints === [] ) {
			return 'none';
		}

		return substr( md5( serialize( $breakpoints ) ), 0, 12 );
	}

	/**
	 * Emit the active-library alias layer: each canonical `--kb-token--<id>` pointed at the active set's
	 * namespaced var. Block content and the slot bridges reference the canonical name, so they
	 * follow the active set with no re-resolve. Re-pointing this layer is the server-side switch.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $active      The active set's namespaced resolved maps.
	 * @param string          $active_slug The active set slug.
	 *
	 * @return string
	 */
	private function alias_block( Resolved_Tokens $active, string $active_slug ): string {
		$declarations = $this->point_canonical_at_set( $active, $active_slug );

		return $declarations === '' ? '' : Scope::root() . '{' . $declarations . '}';
	}

	/**
	 * Emit a set's switch selector: under `[data-kb-token-set="<set>"]`, re-point every canonical
	 * `--kb-token--<id>` at that set's namespaced var — and re-declare the legacy global-var bridges (the
	 * slot families and the palette) at that set — for the matched element's subtree. Nesting works because
	 * the attribute rule declares each property directly on the elements that carry it, overriding the value
	 * they would otherwise inherit from the :root alias layer.
	 *
	 * Because the bridge and the canonical re-point are declared on the same attribute-carrying element, a
	 * block pinned to this set resolves every token to it — both content reading `--kb-token--*` directly and
	 * the `--global-*` bridges. (A host/theme property that reads a token only at :root still follows the
	 * active-library pointer, not a subtree attribute.)
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The set's namespaced resolved maps.
	 * @param string          $slug     The set slug.
	 *
	 * @return string
	 */
	private function switch_block( Resolved_Tokens $resolved, string $slug ): string {
		// Re-point the canonical layer AND the legacy global-var bridges (the slot families and the palette)
		// for the subtree, so a block pinned to this set via [data-kb-token-set] resolves every token — not
		// just content that reads --kb-token--* directly — to this set. Because the bridge and the canonical
		// re-point are declared on the same attribute-carrying element, the bridge's var(--kb-token--<id>)
		// reads the set-pointed value.
		$declarations = $this->point_canonical_at_set( $resolved, $slug )
			. $this->all_slot_declarations( $resolved )
			. $this->palette_declarations( $resolved );

		if ( $declarations === '' ) {
			return '';
		}

		return '[' . self::SWITCH_ATTR . '="' . self::sanitize_identifier( $slug ) . '"]{' . $declarations . '}';
	}

	/**
	 * Build the `--kb-token--<id>: var(--kb-token--<slug>--<id>);` declarations that point every canonical
	 * token var at its namespaced counterpart in $slug. Both names derive from Css_Var::from_id, so the
	 * reference always matches the namespaced block's defined var. The id list is the resolved set's token
	 * ids; the names come from developer-declared ids, so no value sanitization is needed.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The (namespaced) resolved maps whose token ids drive the layer.
	 * @param string          $slug     The set slug the canonical names are pointed at.
	 *
	 * @return string
	 */
	private function point_canonical_at_set( Resolved_Tokens $resolved, string $slug ): string {
		$declarations = '';
		foreach ( array_keys( $resolved->by_id() ) as $id ) {
			$declarations .= Css_Var::from_id( $id ) . ':var(' . Css_Var::from_id( $id, $slug ) . ');';
		}

		return $declarations;
	}

	/**
	 * The slot-family bridge declarations for a resolved set: `--global-kb-<family>-<slug>:
	 * var(--kb-token--<id>, <literal>);` for every spacing, gap and font-size token claiming a slot.
	 *
	 * Kadence Blocks renders a dimension attribute that holds a preset slug as
	 * `var(--global-kb-<family>-<slug>, <fallback>)` but ships those slug values with no per-set indirection
	 * of its own (spacing/gap as plain literals, font-size via a filter). Pointing the slug variable at the
	 * token — later in source order than KB's own definition — redirects every block already storing that
	 * slug at the token, with the resolved length as a literal fallback for contexts that lack the token vars
	 * (e.g. preview iframes). Returned as raw declarations (no selector) so the caller can scope them at
	 * `:root` for the active set or inside a `[data-kb-token-set]` selector for a per-set subtree.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return string
	 */
	private function all_slot_declarations( Resolved_Tokens $resolved ): string {
		return $this->slot_declarations( $resolved, Spacing_Target::class )
			. $this->slot_declarations( $resolved, Gap_Target::class )
			. $this->slot_declarations( $resolved, Font_Size_Target::class );
	}

	/**
	 * The bridge declarations for one slot family: `--global-kb-<family>-<slug>: var(--kb-token--<id>,
	 * <literal>);` for every token claiming a slot in that family.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens      $resolved     The resolved token maps.
	 * @param class-string<Target> $target_class The slot-target type for this family.
	 *
	 * @return string
	 */
	private function slot_declarations( Resolved_Tokens $resolved, string $target_class ): string {
		$declarations = '';

		// The slot and css_var come from developer-declared registry config; only the resolved literal
		// fallback can carry stored values, so just that is sanitized (as in token_block()).
		foreach ( $this->registry->by_projection( $target_class::get_projection_key() ) as $id => $token ) {
			$target = $target_class::from_token( $token );
			if ( $target === null ) {
				continue;
			}

			$value = $resolved->value( $id );
			if ( $value === null || $value === '' ) {
				continue;
			}

			$declarations .= $target->css_property() . ':var(' . $token->css_var . ',' . $this->sanitize_value( $value ) . ');';
		}

		return $declarations;
	}

	/**
	 * The palette bridge declarations for a resolved set: `--global-<slug>: var(--kb-token--<id>,
	 * <literal>);` for every token claiming a Kadence palette slot (palette1..9).
	 *
	 * The active-library `:root` palette stays owned by the legacy color filter (Legacy_Filter_Bridge, which
	 * carries the Kadence-theme guard); these declarations are emitted only inside a `[data-kb-token-set]`
	 * selector, so a block pinned to a set reflects that set's palette without changing the default `:root`
	 * palette. Same var()-with-literal-fallback shape as the slot families.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return string
	 */
	private function palette_declarations( Resolved_Tokens $resolved ): string {
		$declarations = '';

		foreach ( $this->registry->by_projection( Kadence_Palette_Slot::get_projection_key() ) as $id => $token ) {
			$slot = Kadence_Palette_Slot::from_token( $token );
			if ( $slot === null ) {
				continue;
			}

			$value = $resolved->value( $id );
			if ( $value === null || $value === '' ) {
				continue;
			}

			$declarations .= '--global-' . $slot->slug . ':var(' . $token->css_var . ',' . $this->sanitize_value( $value ) . ');';
		}

		return $declarations;
	}
}
