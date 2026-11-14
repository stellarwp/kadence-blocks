<?php
/**
 * Writes the font weight of the highlight.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the font weight of the highlight.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Font_Weight_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the weight.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_font_weight( 'font-weight', $input->attribute( 'markFontWeight' ) );
	}
}
