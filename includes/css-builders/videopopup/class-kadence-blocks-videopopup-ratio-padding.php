<?php
/**
 * Sizes a custom ratio video like its image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Sizes a custom ratio video like its image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Ratio_Padding_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the bottom padding that keeps the ratio of the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$height = $input->attribute( 'imageHeight' );
		$width  = $input->attribute( 'imgWidth' );

		$input->css()->add_property( 'padding-bottom', floor( $height / $width * 100 ) . '% !important' );
	}
}
