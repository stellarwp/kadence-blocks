<?php
/**
 * Writes the opacity of the overlay, which is saved out of a hundred.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the opacity of the overlay, which is saved out of a hundred.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Overlay_Opacity_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the opacity.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_opacity_from_100( $input->attributes(), 'overlayOpacity' );
	}
}
