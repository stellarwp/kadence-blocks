<?php
/**
 * Hides the parallax container of the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Hides the parallax container of the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Jarallax_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the rule.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		Kadence_Blocks_Rowlayout_Selector::set( $input, '{base} [id*="jarallax-container-"]' );
		$input->css()->add_property( 'display', 'none !important' );
	}
}
