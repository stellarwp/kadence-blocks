<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use KadenceWP\KadenceBlocks\Adbar\Dot;
use WP_Theme_JSON_Resolver;

/**
 * Reads a block's site-level values from the user Global Styles, as block
 * attributes.
 *
 * The values are read from the stored `wp_global_styles` post, not through the
 * resolver: `settings.custom.kadence` is removed from what core renders, so the
 * resolver never returns it.
 *
 * @since TBD
 */
final class Store {

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Supported_Blocks $blocks ) {
		$this->blocks = $blocks;
	}

	/**
	 * Returns a block's site-level values as block attributes: its
	 * `settings.custom.kadence.<slug>` values plus the colors stored in core's
	 * style for the block, converted to Kadence color values.
	 *
	 * @since TBD
	 *
	 * @param string $block_name Block name, e.g. `kadence/singlebtn`.
	 *
	 * @return array<string, mixed> Attribute name => site-level value; empty in classic mode or for an unsupported block.
	 */
	public function attributes( string $block_name ): array {
		$block = $this->blocks->get( $block_name );

		if ( null === $block || ! kadence_blocks_is_fse_mode() ) {
			return [];
		}

		$user_data  = $this->user_data();
		$data       = new Dot( $user_data );
		$attributes = $data->get( 'settings.custom.kadence.' . $block->get_slug(), [] );
		$attributes = is_array( $attributes ) ? $attributes : [];
		$colors     = $data->get( 'styles.blocks.' . $block_name . '.color', [] );

		if ( ! is_array( $colors ) ) {
			return $attributes;
		}

		foreach ( $block->site_styles_attributes_map() as $attribute => $path ) {
			if ( ! self::can_convert( $path ) ) {
				continue;
			}

			$key    = substr( $path, strlen( 'color.' ) );
			$stored = $colors[ $key ] ?? null;

			if ( ! is_string( $stored ) || '' === $stored ) {
				continue;
			}

			$value = $this->attribute_color( $key, $stored );

			if ( '' !== $value ) {
				$attributes[ $attribute ] = $value;
			}
		}

		return $attributes;
	}

	/**
	 * Whether a path in a block's core style has a converter to a block
	 * attribute value. Only colors (`color.<key>`) do.
	 *
	 * @since TBD
	 *
	 * @param string $path Path in the block's core style, e.g. `color.background`.
	 *
	 * @return bool Whether the store can read a value at the path.
	 */
	public static function can_convert( string $path ): bool {
		return 1 === preg_match( '/^color\.[A-Za-z]+$/', $path );
	}

	/**
	 * Converts a color stored in core's style to a Kadence color attribute value.
	 *
	 * A Kadence palette reference becomes `paletteN`, which Kadence renders as
	 * `var(--global-paletteN)`. It is accepted in both stored forms: the
	 * `var:preset|color|theme-paletteN` reference, and the
	 * `var(--wp--preset--color--theme-paletteN)` value core's KSES pass rewrites
	 * it to, which names a variable core doesn't define. Other preset references
	 * become CSS through the style engine; any other value is kept.
	 *
	 * @param string $core_key The key under the block's `color` style, e.g. `background`.
	 * @param string $value    The stored value.
	 *
	 * @return string The attribute value, empty when the style engine returns none.
	 */
	private function attribute_color( string $core_key, string $value ): string {
		if (
			preg_match( '/^var:preset\|color\|theme-(palette\d+)$/', $value, $match )
			|| preg_match( '/^var\(--wp--preset--color--theme-(palette\d+)\)$/', $value, $match )
		) {
			return $match[1];
		}

		if ( 0 !== strpos( $value, 'var:preset|' ) ) {
			return $value;
		}

		$declarations = wp_style_engine_get_styles( [ 'color' => [ $core_key => $value ] ] )['declarations'];

		return $declarations ? reset( $declarations ) : '';
	}

	/**
	 * @return array<string, mixed> The decoded user Global Styles post, empty when there is none.
	 */
	private function user_data(): array {
		$post = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme() );

		if ( empty( $post['post_content'] ) ) {
			return [];
		}

		$data = json_decode( $post['post_content'], true );

		return is_array( $data ) ? $data : [];
	}
}
