<?php
/**
 * Writes the thickness of the divider.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the thickness of the divider.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Border_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the thickness.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$height = $input->attribute( 'dividerHeight' );

		$input->css()->add_property( 'border-top-width', $height . 'px' );
	}
}
