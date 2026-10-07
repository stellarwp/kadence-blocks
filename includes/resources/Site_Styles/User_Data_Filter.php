<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use WP_Theme_JSON_Data;

/**
 * Keeps the Kadence site-level values out of what core renders from the user
 * Global Styles:
 * - `settings.custom.kadence` always, since core would turn every leaf into a
 *   `:root` custom property (the overlay reads the stored post instead);
 * - the supported blocks' `styles.blocks` entries when FSE mode is off, since
 *   the theme's `theme.json` makes core print them in classic mode too.
 *
 * The stored post is never changed, so switching FSE mode back on restores
 * everything. The REST endpoint the Site Editor loads reads the post directly
 * and still returns the values.
 *
 * @since TBD
 */
final class User_Data_Filter {

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
	 * Untyped, and the result is built from the same class it was given, since the Gutenberg
	 * plugin passes its own WP_Theme_JSON_Data_Gutenberg, which doesn't extend core's class.
	 *
	 * @since TBD
	 *
	 * @param WP_Theme_JSON_Data $theme_json The user-origin Global Styles.
	 *
	 * @return WP_Theme_JSON_Data The Global Styles without the Kadence values.
	 */
	public function filter( $theme_json ) {
		$data    = $theme_json->get_data();
		$changed = false;

		if ( isset( $data['settings']['custom']['kadence'] ) ) {
			unset( $data['settings']['custom']['kadence'] );
			$changed = true;
		}

		if ( ! kadence_blocks_is_fse_mode() ) {
			foreach ( array_keys( $this->blocks->all() ) as $block_name ) {
				if ( isset( $data['styles']['blocks'][ $block_name ] ) ) {
					unset( $data['styles']['blocks'][ $block_name ] );
					$changed = true;
				}
			}
		}

		if ( ! $changed ) {
			return $theme_json;
		}

		$class = get_class( $theme_json );

		return new $class( $data, 'custom' );
	}
}
