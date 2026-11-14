<?php
/**
 * Writes the maximum width of an item, 500 pixels when none was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the maximum width of an item, 500 pixels when none was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Max_Width_Css implements Kadence_Blocks_Css_Section {

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
		$input->css()->add_property( 'max-width', $input->attribute( 'containerMaxWidth', 500 ) . 'px' );
	}
}
