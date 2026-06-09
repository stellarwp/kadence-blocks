<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;

/**
 * Builds the CSS custom-property output for a resolved token set — the CSS-variable backbone.
 *
 * Emits two declaration blocks, both scoped to ":root,:root:where(.kb-tokens)":
 *
 *   1. The --kb-token--* family, straight from the Resolver's css-var => value map. This is the
 *      single source other projectors and adapters point at.
 *   2. A --wp--preset--<category>--<slug>: var(--kb-token--*) bridge for every token that declares a
 *      "wp_preset" projection, so WordPress preset variables (and the editor swatches that read them)
 *      resolve to the token value without a second copy of it.
 *
 * Bare :root makes the variables live everywhere KB prints them (front end and editor iframe alike).
 * :where(.kb-tokens) is an additional zero-specificity hook for future opt-in or variant scoping.
 * Neither selector escalates specificity; nothing here is !important — per-instance variant overrides
 * must be able to win by ordinary cascade.
 *
 * Pure: no WordPress calls, no globals, no side effects. The WordPress wiring lives in Projector.
 *
 * @since TBD
 */
final class Css_Builder {

	/**
	 * The root scope for both declaration blocks. :where() contributes zero specificity, so neither
	 * selector weighs more than a bare :root. Never !important.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public const SCOPE = ':root,:root:where(.kb-tokens)';

	/**
	 * The projection key a token declares to opt into the --wp--preset--* bridge.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const WP_PRESET = 'wp_preset';

	/**
	 * Object-cache group shared with the resolver.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Per-request memo keyed on the store version, so a write (which bumps the version)
	 * automatically invalidates the in-memory result without an explicit purge hook.
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
	 * Build the full CSS string for the resolved set. Front end and editor share it verbatim.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return string The CSS, or an empty string when there is nothing to project.
	 */
	public function css( Resolved_Tokens $resolved ): string {
		$tokens  = $this->token_block( $resolved->by_var() );
		$presets = $this->preset_block( $resolved );

		return $tokens . $presets;
	}

	/**
	 * Cached variant of css(): memoized per request and persisted in the object cache keyed on the
	 * store version, so a token write (which bumps the version) invalidates it automatically.
	 *
	 * The plugin version is folded into the cache key alongside the store version: the store version
	 * tracks stored overrides, but projected CSS also depends on shipped declarations and the baseline,
	 * which change with a plugin build. Including KADENCE_BLOCKS_VERSION busts the cache on upgrade.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved set (already version-correct from the resolver).
	 * @param string          $version  The store version the resolved set was built from.
	 *
	 * @return string
	 */
	public function css_for_version( Resolved_Tokens $resolved, string $version ): string {
		if ( isset( $this->memo[ $version ] ) ) {
			return $this->memo[ $version ];
		}

		$cache_key = 'projected_css_' . KADENCE_BLOCKS_VERSION . '_' . $version;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			return $this->memo[ $version ] = $cached;
		}

		$css = $this->css( $resolved );

		wp_cache_set( $cache_key, $css, self::CACHE_GROUP, DAY_IN_SECONDS );

		return $this->memo[ $version ] = $css;
	}

	/**
	 * Emit the --kb-token--* declarations from the resolver's css-var => value map.
	 *
	 * @since TBD
	 *
	 * @param array<string,string> $by_var css-var => CSS value.
	 *
	 * @return string
	 */
	private function token_block( array $by_var ): string {
		if ( $by_var === [] ) {
			return '';
		}

		$declarations = '';
		foreach ( $by_var as $var => $value ) {
			$declarations .= $var . ':' . $this->sanitize_value( $value ) . ';';
		}

		return self::SCOPE . '{' . $declarations . '}';
	}

	/**
	 * Emit the --wp--preset--*: var(--kb-token--*) bridge for tokens declaring a "wp_preset" projection.
	 *
	 * Each preset points at its token's variable rather than the literal value, so the two can never
	 * disagree and a token change updates both in one place.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return string
	 */
	private function preset_block( Resolved_Tokens $resolved ): string {
		$declarations = '';

		// category, slug and css_var come from developer-declared registry config,
		// not from the store — no sanitization needed here (contrast with token_block()).
		foreach ( $this->registry->by_projection( self::WP_PRESET ) as $id => $token ) {
			// Skip tokens whose value is absent or empty: an empty CSS value would produce a
			// --wp--preset-- declaration that resolves to nothing in the browser.
			$value = $resolved->value( $id );
			if ( $value === null || $value === '' ) {
				continue;
			}

			[ $category, $slug ] = $this->preset_target( $token, $id );
			if ( $category === '' ) {
				continue;
			}

			$preset        = Wp_Preset_Var::from( $category, $slug );
			$declarations .= $preset . ':var(' . $token->css_var . ');';
		}

		return $declarations === '' ? '' : self::SCOPE . '{' . $declarations . '}';
	}

	/**
	 * Resolve a token's wp_preset config to a (category, slug) pair.
	 *
	 * The projection value is either a bare category string (slug derived from the token id's last
	 * dot-segment) or an explicit ['category' => …, 'slug' => …] array for the rare case the slug must
	 * differ from the id segment.
	 *
	 *   'wp_preset' => 'color'                          // semantic.color.button-bg => color / button-bg
	 *   'wp_preset' => ['category' => 'color', 'slug' => 'btn']
	 *
	 * @since TBD
	 *
	 * @param Token_Definition $token The token definition.
	 * @param string           $id    The token id.
	 *
	 * @return array{0:string,1:string} [ category, slug ]; category '' means "skip".
	 */
	private function preset_target( Token_Definition $token, string $id ): array {
		$config = $token->projections[ self::WP_PRESET ] ?? null;

		if ( is_string( $config ) && $config !== '' ) {
			return [ $config, $this->slug_from_id( $id ) ];
		}

		if ( is_array( $config ) && isset( $config['category'] ) && is_string( $config['category'] ) ) {
			$slug = isset( $config['slug'] ) && is_string( $config['slug'] ) ? $config['slug'] : $this->slug_from_id( $id );

			return [ $config['category'], $slug ];
		}

		return [ '', '' ];
	}

	/**
	 * The last dot-segment of a token id, used as the default preset slug.
	 *
	 * Example: semantic.color.button-bg => button-bg
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return string
	 */
	private function slug_from_id( string $id ): string {
		$pos = strrpos( $id, '.' );

		return $pos === false ? $id : substr( $id, $pos + 1 );
	}

	/**
	 * Defense-in-depth sanitizer for a custom-property value.
	 *
	 * Values from the Resolver are already well-formed; this only guarantees a stray value can never
	 * break out of the declaration or inject a rule (strips "{", "}", ";", "<", ">" and control
	 * characters). Not esc_attr(), which would mangle legitimate CSS such as the quotes/commas in a
	 * font-family stack.
	 *
	 * @since TBD
	 *
	 * @param string $value The raw CSS value.
	 *
	 * @return string
	 */
	private function sanitize_value( string $value ): string {
		$value = preg_replace( '/[\x00-\x1F\x7F]/', '', $value ) ?? '';

		return str_replace( [ '{', '}', ';', '<', '>' ], '', $value );
	}
}
