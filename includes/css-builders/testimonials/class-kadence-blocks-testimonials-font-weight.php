<?php
/**
 * Writes the font weight of a font, unless it is the regular one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the font weight of a font, unless it is the regular one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Font_Weight_Css implements Kadence_Blocks_Css_Section {

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
		$weight = $input->attribute( 'weight' );

		if ( empty( $weight ) || 'regular' === $weight ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'font-weight', $css->render_font_weight( $weight ) );
	}
}
