<?php
/**
 * Writes the maximum width of the image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';

/**
 * Writes the maximum width of the image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Image_Max_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$width = $input->attribute( 'maxWidth' );

		if ( empty( $width ) ) {
			return;
		}

		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kadence-info-box-image-inner-intrisic-container' );
		$input->css()->add_property( 'max-width', $width . 'px' );
	}
}
