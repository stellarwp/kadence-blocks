<?php
/**
 * Writes the letter spacing of the caption font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the letter spacing of the caption font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Letter_Spacing_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the letter spacing: one value in pixels, or one for every device.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$spacing = $input->attribute( 'letterSpacing' );

		if ( empty( $spacing ) ) {
			return;
		}

		$css = $input->css();

		if ( is_array( $spacing ) ) {
			$css->render_responsive_range( $input->attributes(), 'letterSpacing', 'letter-spacing', 'px' );
			return;
		}

		$css->add_property( 'letter-spacing', $spacing . 'px' );
	}
}
