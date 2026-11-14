<?php
/**
 * Writes the opacity of the overlay.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the opacity of the overlay.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Overlay_Opacity_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the opacity, 0.3 when none is saved, when it is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$opacity   = $input->attribute( 'overlayOpacity' );
		$opacity ??= 0.3;

		if ( is_numeric( $opacity ) ) {
			$input->css()->add_property( 'opacity', $opacity );
		}
	}
}
