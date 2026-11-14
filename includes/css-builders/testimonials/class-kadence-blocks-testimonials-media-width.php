<?php
/**
 * Writes the width of the media.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the width of the media.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Media_Width_Css implements Kadence_Blocks_Css_Section {

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
		$width = $input->item( 'mediaStyles', 0 )['width'] ?? null;

		if ( null === $width ) {
			return;
		}

		$input->css()->add_property( 'width', $width . 'px' );
	}
}
