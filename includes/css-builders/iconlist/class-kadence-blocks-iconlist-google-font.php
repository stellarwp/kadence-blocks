<?php
/**
 * Loads the Google font of the list text.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Loads the Google font of the list text.
 *
 * @since TBD
 */
final class Kadence_Blocks_Iconlist_Google_Font_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Load the font.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$font = $input->item( 'listStyles', 0 );

		if ( ! is_array( $font ) || ! $this->is_loadable( $font ) ) {
			return;
		}

		$variant = ! empty( $font['variant'] ) ? $font['variant'] : null;
		$subset  = ! empty( $font['subset'] ) ? $font['subset'] : null;

		$input->css()->maybe_add_google_font( $font['family'], $variant, $subset );
	}

	/**
	 * Whether the font is a Google font that has a family and is to be loaded.
	 *
	 * @since TBD
	 *
	 * @param array $font The font settings.
	 *
	 * @return bool
	 */
	private function is_loadable( array $font ): bool {
		if ( empty( $font['google'] ) || ! isset( $font['family'] ) ) {
			return false;
		}

		return ! isset( $font['loadGoogle'] ) || true === $font['loadGoogle'];
	}
}
