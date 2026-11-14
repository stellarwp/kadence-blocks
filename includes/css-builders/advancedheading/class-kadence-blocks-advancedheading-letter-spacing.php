<?php
/**
 * Writes the letter spacing of the desktop.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the letter spacing of the desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Letter_Spacing_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the letter spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_with_unit( 'letter-spacing', $input->attribute( 'letterSpacing' ), $input->attribute( 'letterSpacingType', 'px' ) );
	}
}
