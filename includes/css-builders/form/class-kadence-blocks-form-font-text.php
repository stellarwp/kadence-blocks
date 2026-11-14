<?php
/**
 * Writes the spacing, the transform, the family, the style and the weight of a font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the spacing, the transform, the family, the style and the weight of a font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Font_Text_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the font.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$writer = new Kadence_Blocks_Css_Writer( $input->css() );

		$writer->numeric_with_unit( 'letter-spacing', $input->attribute( 'letterSpacing' ), 'px' );
		$writer->not_empty( 'text-transform', $input->attribute( 'textTransform' ) );
		$writer->not_empty( 'font-family', $input->attribute( 'family' ) );
		$writer->not_empty( 'font-style', $input->attribute( 'style' ) );
		$writer->not_empty( 'font-weight', $input->attribute( 'weight' ) );
	}
}
