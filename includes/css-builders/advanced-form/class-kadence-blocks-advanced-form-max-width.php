<?php
/**
 * Writes the maximum width of the form.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the maximum width of the form.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Max_Width_Css implements Kadence_Blocks_Css_Section {

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
		$settings = $input->derived( 'settings' );

		$input->css()->render_responsive_range( $settings->all(), 'maxWidth', 'max-width', 'maxWidthUnit' );
	}
}
