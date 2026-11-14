<?php
/**
 * Writes the letter spacing of a font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the letter spacing of a font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Letter_Spacing_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( 'letter-spacing', $input->attribute( 'letterSpacing' ), 'px' );
	}
}
