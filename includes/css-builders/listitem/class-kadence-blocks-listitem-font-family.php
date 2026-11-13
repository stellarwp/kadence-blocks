<?php
/**
 * Writes the font family of the highlight, and loads it when it is a Google font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font family of the highlight, and loads it when it is a Google font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Font_Family_Css implements Kadence_Blocks_Css_Section {

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
		$family = $input->attribute( 'markTypography' );

		if ( empty( $family ) ) {
			return;
		}

		$variant = $input->attribute( 'markFontVariant' );
		$css     = $input->css();

		$css->add_property( 'font-family', $css->render_font_family( $family, $this->is_google( $input ), ! empty( $variant ) ? $variant : null ) );
	}

	/**
	 * Whether the font is a Google font that is to be loaded.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function is_google( Kadence_Blocks_Css_Build_Input $input ): bool {
		if ( empty( $input->attribute( 'markGoogleFont' ) ) ) {
			return false;
		}

		$load = $input->attribute( 'markLoadGoogleFont' );

		return null === $load || ! empty( $load );
	}
}
