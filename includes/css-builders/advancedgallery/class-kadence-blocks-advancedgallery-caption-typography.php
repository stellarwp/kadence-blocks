<?php
/**
 * Writes the font of the captions.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font of the captions.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Caption_Typography_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the font.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$font = [ 'caption' => $input->item( 'captionStyles', 0 ) ];

		$input->css()->render_typography( $font, 'caption' );
	}
}
