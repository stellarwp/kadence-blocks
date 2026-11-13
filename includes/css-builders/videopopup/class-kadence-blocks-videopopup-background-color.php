<?php
/**
 * Writes the background color of the video box.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the background color of the video box.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Background_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color with its opacity, one when there is no opacity.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->add_property( 'background-color', $css->render_color( $input->attribute( 'color' ), $input->attribute( 'colorOpacity', 1 ) ) );
	}
}
