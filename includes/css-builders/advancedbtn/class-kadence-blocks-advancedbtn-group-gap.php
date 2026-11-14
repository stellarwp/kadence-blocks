<?php
/**
 * Advanced Buttons group gap.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the gap between the buttons.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Group_Gap_Css implements Kadence_Blocks_Css_Section {

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
