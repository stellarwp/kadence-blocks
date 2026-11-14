<?php
/**
 * Writes the color of the rating icons, gold when none was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the color of the rating icons, gold when none was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Rating_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_color_output( $input->item( 'ratingStyles', 0, [ 'color' => '#ffd700' ] ), 'color', 'color' );
	}
}
