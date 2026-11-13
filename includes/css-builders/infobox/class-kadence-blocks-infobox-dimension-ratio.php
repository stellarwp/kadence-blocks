<?php
/**
 * Writes the height of the image from its own width and height.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the height of the image from its own width and height.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Dimension_Ratio_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the padding.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$height = $input->attribute( 'height' );
		$width  = $input->attribute( 'width' );

		if ( ! is_numeric( $height ) || ! is_numeric( $width ) ) {
			return;
		}

		$input->css()->add_property( 'padding-bottom', round( ( absint( $height ) / absint( $width ) ) * 100, 4 ) . '%' );
	}
}
