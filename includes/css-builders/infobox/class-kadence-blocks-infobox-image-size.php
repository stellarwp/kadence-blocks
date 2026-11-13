<?php
/**
 * Writes the width of the image, and its height when it has one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the width of the image, and its height when it has one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Image_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( 'width', $input->attribute( 'width' ), 'px' );

		if ( ! empty( $input->attribute( 'height' ) ) ) {
			$input->css()->add_property( 'height', '0px' );
		}
	}
}
