<?php
/**
 * Loads the Google font of the tab titles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Loads the Google font of the tab titles.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Google_Font_Css implements Kadence_Blocks_Css_Section {

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
		$family     = $input->attribute( 'googleFont' );
		$load       = $input->attribute( 'loadGoogleFont' );
		$typography = $input->attribute( 'typography' );

		if ( empty( $family ) || null === $typography || ( null !== $load && true != $load ) ) {
			return;
		}

		$input->css()->maybe_add_google_font( $typography, $input->attribute( 'fontVariant' ), $input->attribute( 'fontSubset' ) );
	}
}
