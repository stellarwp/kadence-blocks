<?php
/**
 * Lottie max width section.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the maximum width of the animation.
 *
 * @since TBD
 */
final class Kadence_Blocks_Lottie_Max_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the maximum width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->add_property( 'max-width', $input->derived( 'width' ) );
	}
}
