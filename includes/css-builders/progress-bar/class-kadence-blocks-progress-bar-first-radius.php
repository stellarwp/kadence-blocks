<?php
/**
 * Writes the border radius of the bar on desktop, in pixels.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border radius of the bar on desktop, in pixels.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_First_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the border radius.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( 'border-radius', $input->item( 'progressBorderRadius', 0 ), 'px' );
	}
}
