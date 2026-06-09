<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Definition;

/**
 * Normalizes a token's "wp_preset" projection config into a (category, slug) pair.
 *
 * The category becomes the "<category>" segment of the WordPress preset variable
 * (--wp--preset--<category>--<slug>) and selects the theme.json bucket; the slug is the preset's
 * identifier within that bucket. Both the Css_Var bridge and the Theme_Json projector resolve
 * through this one class so the preset variable they emit and the theme.json preset slug can never
 * drift apart.
 *
 * The projection config is either a bare category string (slug derived from the token id's last
 * dot-segment) or an explicit ['category' => …, 'slug' => …] array for the rare case the slug must
 * differ from the id segment:
 *
 *   'wp_preset' => 'color'                                  // semantic.color.button-bg => (color, button-bg)
 *   'wp_preset' => ['category' => 'color', 'slug' => 'btn'] // => (color, btn)
 *
 * @since TBD
 */
final class Wp_Preset_Target {

	/**
	 * The projection key a token declares to opt into preset projection.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PROJECTION = 'wp_preset';

	/**
	 * The preset category, e.g. "color", "font-family", "spacing", "shadow".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $category;

	/**
	 * The preset slug, e.g. "button-bg".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public string $slug;

	/**
	 * @param string $category Preset category.
	 * @param string $slug     Preset slug.
	 */
	private function __construct( string $category, string $slug ) {
		$this->category = $category;
		$this->slug     = $slug;
	}

	/**
	 * Get the projection key.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_projection_key(): string {
		return self::PROJECTION;
	}

	/**
	 * Resolve a token's wp_preset config to a target, or null when the token does not declare a
	 * usable wp_preset projection (so callers skip it).
	 *
	 * @since TBD
	 *
	 * @param Token_Definition $token The token definition.
	 *
	 * @return self|null
	 */
	public static function from_token( Token_Definition $token ): ?self {
		if ( ! $token->has_projection( self::PROJECTION ) ) {
			return null;
		}

		$config = $token->projections[ self::PROJECTION ] ?? null;

		if ( is_string( $config ) && $config !== '' ) {
			return new self( $config, self::slug_from_id( $token->id ) );
		}

		if ( is_array( $config ) && isset( $config['category'] ) && is_string( $config['category'] ) && $config['category'] !== '' ) {
			$slug = isset( $config['slug'] ) && is_string( $config['slug'] ) && $config['slug'] !== ''
				? $config['slug']
				: self::slug_from_id( $token->id );

			return new self( $config['category'], $slug );
		}

		return null;
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
	public static function slug_from_id( string $id ): string {
		$pos = strrpos( $id, '.' );

		return $pos === false ? $id : substr( $id, $pos + 1 );
	}
}
