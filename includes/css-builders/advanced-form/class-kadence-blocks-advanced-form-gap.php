<?php
/**
 * Writes the gap between the fields.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the gap between the fields.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Gap_Css implements Kadence_Blocks_Css_Section {

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
		$settings = $input->derived( 'settings' );

		$input->css()->render_gap( $settings->group( 'style' ) );
	}
}
