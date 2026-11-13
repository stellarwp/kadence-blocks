<?php
/**
 * Loads the Google font of the subtitles. It runs on the settings of the subtitle font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Loads the Google font of the subtitles. It runs on the settings of the subtitle font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Subtitle_Google_Font_Css implements Kadence_Blocks_Css_Section {

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
		$load   = $input->attribute( 'loadGoogle' );
		$family = $input->attribute( 'family' );

		if ( empty( $input->attribute( 'google' ) ) || null === $family || ( null !== $load && true !== $load ) ) {
			return;
		}

		$input->css()->maybe_add_google_font( $family, $input->attribute( 'variant' ), $input->attribute( 'subset' ) );
	}
}
