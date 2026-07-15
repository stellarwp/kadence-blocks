<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Contracts\Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Gap_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Spacing_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Builds the CSS custom-property output for every token set at once — the CSS-variable backbone, in the
 * design-system "Option B" publisher shape so palette switching is pure CSS with no server re-resolve.
 *
 * For N sets (slug => its namespaced Resolved_Tokens) plus the active set's slug, emits:
 *
 *   1. One namespaced block per set — `--kb-token--<set>--<id>: <value-or-var>` straight from each set's
 *      namespaced projected map. The literal value of a token lives here, once; a set's alias chain stays
 *      inside the set (`--kb-token--<set>--<semantic>: var(--kb-token--<set>--<primitive>)`).
 *   2. The active-set alias layer — `--kb-token--<id>: var(--kb-token--<active>--<id>)` for every active
 *      token, so block content and the bridges below reference the canonical name without knowing which
 *      set is active (the server-side switch: re-point this layer).
 *   3. One switch selector per set — `[data-kb-token-set="<set>"] { --kb-token--<id>: var(--kb-token--<set>--<id>) }`
 *      so a body class / container attribute re-points the canonical token names for that subtree client-side.
 *      Emitted for every set (incl. the active one) so an element can revert to the active set under a
 *      non-active ancestor.
 *   4. The --global-kb-<family>-<slug> slot overrides, built from the active set and pointing at the
 *      canonical names — so they follow the active alias layer with no second copy of any value.
 *
 * Scope of the client-side switch selector: CSS substitutes a var() inside a custom property at the
 * element where that property is *declared*, so the bridges in (4) — and any host/theme custom property
 * that reads --kb-token--* — resolve at :root and do not follow a subtree `[data-kb-token-set]` attribute.
 * The attribute live-swaps only content that consumes --kb-token--* directly; the complete palette switch
 * (host surfaces included) is the active-set pointer, which re-points the :root alias layer in (2).
 *
 * Bare :root makes the variables live everywhere KB prints them (front end and editor iframe alike).
 * :where(.kb-tokens) is an additional zero-specificity hook for future opt-in or variant scoping. The
 * `[data-kb-token-set]` switch selector declares `--kb-token--<id>` directly on the element that carries
 * the attribute, so that element and its subtree use the directly-declared value in preference to the one
 * inherited from the :root alias layer — a directly-cascaded value always beats an inherited one, so
 * source order does not matter (the two rules target different elements). Nothing here is !important —
 * per-instance variant overrides must be able to win by ordinary cascade.
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
	 * A typography composite's sub-field => the CSS property a block reads it as. A composite token can
	 * only be consumed through a single `font` shorthand var, which is useless to a block that sets its
	 * properties individually (and renders empty unless the token carries both a size and a family); so
	 * every typography token is ALSO projected as one custom property per sub-field, named
	 * `--kb-token--<id>--<css-prop>`, that a block's CSS reads directly (e.g. the Button's `font-family`).
	 * A composite whose fields are not in this map (a shadow) contributes nothing here.
	 *
	 * @since TBD
	 *
	 * @var array<string, string>
	 */
	private const TYPOGRAPHY_FIELD_CSS_PROPS = [
		'fontFamily'    => 'font-family',
		'fontSize'      => 'font-size',
		'fontWeight'    => 'font-weight',
		'lineHeight'    => 'line-height',
		'fontStyle'     => 'font-style',
		'textTransform' => 'text-transform',
		'letterSpacing' => 'letter-spacing',
	];

	/**
	 * The HTML attribute a body class / container sets to switch the active token set client-side. Its
	 * `[data-kb-token-set="<slug>"]` rule re-points the canonical alias layer at that set's namespaced vars.
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
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( array $resolved_by_slug, string $active_slug ): string {
		if ( ! isset( $resolved_by_slug[ $active_slug ] ) ) {
			return '';
		}

		$css = '';
		foreach ( $resolved_by_slug as $slug => $resolved ) {
			$css .= $this->build_set_fragment( $resolved, (string) $slug );
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
	 *
	 * @return string
	 */
	public function css_for_version( array $resolved_by_slug, array $versions, string $active_slug ): string {
		if ( ! isset( $resolved_by_slug[ $active_slug ] ) ) {
			return '';
		}

		$signature = 'assembly:' . $active_slug;
		foreach ( $resolved_by_slug as $slug => $resolved ) {
			$signature .= '|' . (string) $slug . ':' . ( $versions[ $slug ] ?? '' );
		}

		if ( isset( $this->memo[ $signature ] ) ) {
			return $this->memo[ $signature ];
		}

		$css = '';
		foreach ( $resolved_by_slug as $slug => $resolved ) {
			$slug = (string) $slug;
			$css .= $this->set_fragment( $resolved, $slug, (string) ( $versions[ $slug ] ?? '' ) );
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
	 * @param Resolved_Tokens $resolved The set's namespaced resolved maps.
	 * @param string          $slug     The set slug.
	 * @param string          $version  The store version the set was built from.
	 *
	 * @return string
	 */
	public function set_fragment( Resolved_Tokens $resolved, string $slug, string $version ): string {
		$cache_key = 'projected_css_set_' . KADENCE_BLOCKS_VERSION . '_' . $slug . '_' . $version;

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build_set_fragment( $resolved, $slug );

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
	 * @param Resolved_Tokens $resolved The set's namespaced resolved maps.
	 * @param string          $slug     The set slug.
	 *
	 * @return string
	 */
	private function build_set_fragment( Resolved_Tokens $resolved, string $slug ): string {
		return $this->namespaced_block( $resolved ) . $this->switch_block( $resolved, $slug );
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
		return $this->alias_block( $active, $active_slug )
			. $this->slot_block( $active, Spacing_Target::class )
			. $this->slot_block( $active, Gap_Target::class )
			. $this->typography_field_block( $active );
	}

	/**
	 * Emit one custom property per typography sub-field — `--kb-token--<id>--<css-prop>: <value>;` — for
	 * every typography composite in the active set, so a block reads each property (font-family, weight,
	 * …) directly instead of the single, block-useless `font` shorthand. A field the token omits is not
	 * emitted, so the block's `var(--…--<prop>)` falls back to its own default; a field the token sets is
	 * emitted and wins. Resolved to the active set's literals (aliases already flattened); a write
	 * re-projects, so an override propagates. Non-typography composites (shadow) contribute nothing.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $active The active set's resolved maps.
	 *
	 * @return string
	 */
	private function typography_field_block( Resolved_Tokens $active ): string {
		$declarations = '';

		foreach ( $active->composite_ids() as $id ) {
			$fields = $active->composite( $id );

			if ( $fields === null ) {
				continue;
			}

			$prefix = Css_Var::from_id( $id );

			foreach ( self::TYPOGRAPHY_FIELD_CSS_PROPS as $field => $css_prop ) {
				if ( ! array_key_exists( $field, $fields ) ) {
					continue;
				}

				$value = $this->render_field( $fields[ $field ] );

				if ( $value === '' ) {
					continue;
				}

				$declarations .= $prefix . '--' . $css_prop . ':' . $this->sanitize_value( $value ) . ';';
			}
		}

		return $declarations === '' ? '' : Scope::root() . '{' . $declarations . '}';
	}

	/**
	 * Render a resolved typography sub-field to its CSS string: a fontFamily list becomes a comma-joined
	 * family stack (each space-bearing name quoted); any other field is cast to string.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The resolved sub-field value.
	 *
	 * @return string
	 */
	private function render_field( $value ): string {
		if ( is_array( $value ) ) {
			$families = array_map(
				static function ( $family ): string {
					$name = trim( Cast::to_string( $family ), " \t\n\r\0\x0B\"'" );

					return strpos( $name, ' ' ) !== false ? '"' . $name . '"' : $name;
				},
				$value
			);

			return implode( ', ', $families );
		}

		return Cast::to_string( $value );
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
	 * @param Resolved_Tokens $resolved The set's namespaced resolved maps.
	 *
	 * @return string
	 */
	private function namespaced_block( Resolved_Tokens $resolved ): string {
		$projected = $resolved->projected_vars();
		if ( $projected === [] ) {
			return '';
		}

		$declarations = '';
		foreach ( $projected as $var => $value ) {
			$declarations .= $var . ':' . $this->sanitize_value( $value ) . ';';
		}

		return Scope::root() . '{' . $declarations . '}';
	}

	/**
	 * Emit the active-set alias layer: each canonical `--kb-token--<id>` pointed at the active set's
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
	 * `--kb-token--<id>` at that set's namespaced var for the matched element's subtree. Nesting works
	 * because the attribute rule declares the property directly on the elements that carry it, overriding
	 * the value they would otherwise inherit from the :root alias layer.
	 *
	 * This re-points the canonical token layer only: content that reads `--kb-token--*` directly follows
	 * it, but the :root-declared slot bridges and any host/theme custom property that reads a
	 * token resolve at :root and follow the active-set pointer instead, not a subtree attribute.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The set's namespaced resolved maps.
	 * @param string          $slug     The set slug.
	 *
	 * @return string
	 */
	private function switch_block( Resolved_Tokens $resolved, string $slug ): string {
		$declarations = $this->point_canonical_at_set( $resolved, $slug );

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
	 * Emit the `--global-kb-<family>-<slug>: var(--kb-token--*, <literal>)` overrides for tokens claiming a
	 * slot in the given family (spacing, gap, …).
	 *
	 * Kadence Blocks renders a dimension attribute that holds a preset slug as
	 * `var(--global-kb-<family>-<slug>, <fallback>)` but, unlike colors and font sizes, ships those slug
	 * values as plain literals with no filter to override (and for gap does not define the variable at
	 * all). Defining the slug variable here — under the same `:root` scope, later in source order than KB's
	 * own definition — redirects every block already storing that slug at the token, with the resolved
	 * length as a literal fallback for contexts that lack the token vars (e.g. preview iframes). It is the
	 * dimension counterpart of the color/font-size legacy bridge for the families KB exposes no filter for.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens        $resolved     The resolved token maps.
	 * @param class-string<Target>   $target_class The slot-target type for this family.
	 *
	 * @return string
	 */
	private function slot_block( Resolved_Tokens $resolved, string $target_class ): string {
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

		return $declarations === '' ? '' : Scope::root() . '{' . $declarations . '}';
	}
}
