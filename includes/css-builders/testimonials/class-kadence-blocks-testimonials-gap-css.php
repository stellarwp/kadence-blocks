<?php
/**
 * Writes the gap with the renderer of the CSS.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the gap with the renderer of the CSS.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Gap_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_gap( $input->attributes() );
	}
}
