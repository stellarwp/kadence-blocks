<?php
/**
 * Writes the solid hover background of a button that does not have a gradient background.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the solid hover background of a button that does not have a gradient background.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_Hover_Background_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$background = $input->attribute( 'backgroundHover' );

		if ( 'gradient' === $input->derived( 'bg_type' ) || 'normal' !== $input->derived( 'bg_hover_type' ) || empty( $background ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'background', $css->render_color( $background ) );
	}
}
