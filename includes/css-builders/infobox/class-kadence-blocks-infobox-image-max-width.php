<?php
/**
 * Writes the maximum width of the image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

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
