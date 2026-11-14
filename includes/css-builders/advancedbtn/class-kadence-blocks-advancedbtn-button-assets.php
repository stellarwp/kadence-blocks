<?php
/**
 * Advanced Buttons button assets.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Asks the block to load the styles older buttons need.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Assets_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Load the styles.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->context()->call( 'enqueue_style', 'kb-button-deprecated-styles' );
	}
}
