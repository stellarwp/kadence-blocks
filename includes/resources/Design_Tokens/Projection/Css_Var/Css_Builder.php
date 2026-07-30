<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Contracts\Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Font_Size_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Gap_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Slot\Spacing_Target;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Value;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;

/**
 * Builds the CSS custom-property output for the single active token set — the CSS-variable backbone.
 *
 * Only one library (token set) is emitted at a time: the active-library pointer selects it, and the resolver
 * hands the builder that set's canonical resolved maps. The builder emits a single `:root` block:
 *
 *   1. The canonical token layer — `--kb-token--<id>: <value-or-var>` straight from the active set's
 *      canonical projected map. The literal value of a token lives here, once; an alias chain reads the
 *      canonical name (`--kb-token--<semantic>: var(--kb-token--<primitive>)`), so editing a referenced
 *      token updates every dependent token live, with no server re-resolve.
 *   2. The legacy global-var slot bridges — `--global-kb-<family>-<slug>: var(--kb-token--<id>, <literal>)`
 *      for the spacing/gap/font-size slot families — pointing at the canonical names with the resolved
 *      literal as a fallback. (The `:root` palette itself stays owned by the legacy color filter and is not
 *      emitted here.)
 *   3. Per-breakpoint responsive redeclarations — the affected `--kb-token--<id>` vars re-declared inside
 *      each breakpoint's `@media` block at the same `:root` scope, so a value declared once is overridden
 *      within the query and every consuming token / block follows for free.
 *
 * Bare `:root` makes the variables live everywhere KB prints them (front end and editor iframe alike).
 * `:where(.kb-tokens)` is an additional zero-specificity hook for future opt-in or preset scoping. Nothing
 * here is `!important` — per-instance preset overrides must be able to win by ordinary cascade.
 *
 * Pure: no WordPress calls beyond the object cache in css_for_version(), no globals, no side effects. The
 * WordPress wiring lives in Projector.
 *
 * @since TBD
 */
final class Css_Builder {

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
	 * The registry the active token set is resolved and projected from.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Per-request memo of built CSS, keyed on the object-cache key of the `:root` block, so a write (which
	 * bumps the set's version) invalidates the affected entry without an explicit purge hook.
	 *
	 * @since TBD
	 *
	 * @var array<string,string>
	 */
	private array $memo = [];

	/**
	 * @param Token_Registry $registry
	 */
	public function __construct( Token_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Build the active set's CSS string. Front end and editor share it verbatim. The pure, uncached
	 * assembler (its cached counterpart is css_for_version()).
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens      $resolved    The active set's canonical resolved maps (from
	 *                                           Token_Resolver::resolve()).
	 * @param array<string,string> $breakpoints Breakpoint => media-query string (e.g.
	 *                                           "tablet" => "(max-width: 1024px)"), for the per-breakpoint
	 *                                           responsive var redeclaration.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( Resolved_Tokens $resolved, array $breakpoints = [] ): string {
		return $this->build_root( $resolved, $breakpoints );
	}

	/**
	 * Cached version of css(): assembles the `:root` block from the object cache with a per-request memo. A
	 * write bumps the set's store version, which changes the cache key, so a fresh block is built on the next
	 * request.
	 *
	 * The plugin version is folded into the cache key alongside the store version: the store version tracks
	 * stored overrides, but projected CSS also depends on shipped declarations and the baseline, which change
	 * with a plugin build. Including KADENCE_BLOCKS_VERSION busts on upgrade.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens      $resolved    The active set's canonical resolved maps.
	 * @param string               $slug        The active set's slug, folded into the cache key.
	 * @param string               $version     The store version the set was built from.
	 * @param array<string,string> $breakpoints Breakpoint => media-query string, for the per-breakpoint
	 *                                           responsive var redeclaration.
	 *
	 * @return string
	 */
	public function css_for_version( Resolved_Tokens $resolved, string $slug, string $version, array $breakpoints = [] ): string {
		$cache_key = 'projected_css_root_' . KADENCE_BLOCKS_VERSION . '_' . $slug . '_' . $version . '_' . $this->breakpoint_signature( $breakpoints );

		if ( isset( $this->memo[ $cache_key ] ) ) {
			return $this->memo[ $cache_key ];
		}

		$cached = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $cache_key ] = $cached;
		}

		$css = $this->build_root( $resolved, $breakpoints );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $cache_key ] = $css;
	}

	/**
	 * Build (uncached) the active set's `:root` block: the canonical token declarations plus the slot
	 * bridges, followed by the per-breakpoint responsive redeclarations. The single assembly definition
	 * shared by css() and the cached css_for_version().
	 *
	 * The projection preserves alias indirection: a reference-valued token reads `var(--kb-token--<target>)`
	 * and a composite keeps a `var()` for any aliased field, so editing a referenced token updates every
	 * dependent token live, with no server re-resolve. A raw-valued token (a primitive, or a semantic
	 * overridden to a literal) emits the literal — the value lives once, at the leaf. var() references derive
	 * from the alias grammar (`[\w.-]+`) and survive sanitization untouched, which still strips any breakout
	 * characters from the literal portions.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens      $resolved    The active set's canonical resolved maps.
	 * @param array<string,string> $breakpoints Breakpoint => media-query string, for the responsive
	 *                                           redeclaration blocks appended after the base declarations.
	 *
	 * @return string
	 */
	private function build_root( Resolved_Tokens $resolved, array $breakpoints ): string {
		$declarations = '';
		foreach ( $resolved->projected_vars() as $var => $value ) {
			$declarations .= $var . ':' . $this->sanitize_value( $value ) . ';';
		}

		$declarations .= $this->all_slot_declarations( $resolved );

		if ( $declarations === '' ) {
			return '';
		}

		return Scope::root() . '{' . $declarations . '}' . $this->responsive_blocks( $resolved->projected_responsive(), $breakpoints );
	}

	/**
	 * Emit the per-breakpoint responsive redeclarations: for each breakpoint that has overrides, redeclare
	 * the affected `--kb-token--<id>` vars inside that breakpoint's `@media` block, at the same :root scope,
	 * so a value declared once at :root is overridden within the query and every consuming token / block
	 * follows for free. Breakpoints are emitted in the given order (tablet before mobile), so the narrower
	 * max-width override wins by source order. A document with no responsive tokens emits nothing, keeping
	 * flat output byte-for-byte unchanged.
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
	 * A short, stable signature of the active breakpoint media-query strings, folded into the cache key so a
	 * change to the filterable breakpoints busts the projected-CSS cache. serialize() keeps this
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
	 * The slot-family bridge declarations for the resolved active set: `--global-kb-<family>-<slug>:
	 * var(--kb-token--<id>, <literal>);` for every spacing, gap and font-size token claiming a slot.
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
	 * Kadence Blocks renders a dimension attribute that holds a preset slug as
	 * `var(--global-kb-<family>-<slug>, <fallback>)` but ships those slug values with no per-set indirection
	 * of its own (spacing/gap as plain literals, font-size via a filter). Pointing the slug variable at the
	 * token — later in source order than KB's own definition — redirects every block already storing that
	 * slot at the token, with the resolved length as a literal fallback for contexts that lack the token vars
	 * (e.g. preview iframes).
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
		// fallback can carry stored values, so just that is sanitized.
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
}
