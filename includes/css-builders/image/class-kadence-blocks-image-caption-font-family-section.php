<?php
/**
 * Writes the font family of the caption.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font family of the caption.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Font_Family_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the family: a Google font when it says so, or the plain family.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! empty( $input->attribute( 'google' ) ) ) {
			$this->write_google( $input );
			return;
		}

		$family = $input->attribute( 'family' );

		if ( ! empty( $family ) ) {
			$input->css()->add_property( 'font-family', $family );
		}
	}

	/**
	 * Write the family of a Google font, loaded unless the caption says it is not.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_google( Kadence_Blocks_Css_Build_Input $input ): void {
		$load    = $input->attribute( 'loadGoogle' );
		$variant = $input->attribute( 'variant' );
		$css     = $input->css();

		$css->add_property( 'font-family', $css->render_font_family( $input->attributes()['family'], null === $load || ! empty( $load ), ! empty( $variant ) ? $variant : null ) );
	}
}
