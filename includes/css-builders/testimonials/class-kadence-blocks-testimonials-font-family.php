<?php
/**
 * Writes the font family of a font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font family of a font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Font_Family_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the family.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$family = $input->attribute( 'family' );

		if ( empty( $family ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'font-family', $css->render_font_family( $family ) );
	}
}
