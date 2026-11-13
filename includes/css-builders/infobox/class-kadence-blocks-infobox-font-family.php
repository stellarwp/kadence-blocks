<?php
/**
 * Writes the family of a font, and asks for it to be loaded from Google when it is one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the family of a font, and asks for it to be loaded from Google when it is one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Font_Family_Css implements Kadence_Blocks_Css_Section {

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

		$load   = $input->attribute( 'loadGoogle' );
		$google = ! empty( $input->attribute( 'google' ) ) && ( null === $load || ! empty( $load ) );
		$css    = $input->css();

		$css->add_property( 'font-family', $css->render_font_family( $family, $google, $input->attribute( 'variant', '' ), $input->attribute( 'subset', '' ) ) );
	}
}
