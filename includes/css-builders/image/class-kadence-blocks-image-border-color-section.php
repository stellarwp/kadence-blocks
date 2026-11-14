<?php
/**
 * Writes the border color saved before version 3.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the border color saved before version 3.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Border_Color_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the border color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->add_property( 'border-color', $css->render_color( $input->attribute( 'borderColor' ) ) );
	}
}
