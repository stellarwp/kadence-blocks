<?php
/**
 * Writes the color of the highlight, or its gradient when the highlight has one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the color of the highlight, or its gradient when the highlight has one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Mark_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		if ( empty( $input->attribute( 'enableMarkGradient' ) ) ) {
			$css->add_property( 'color', $css->render_color( $input->attribute( 'markColor', '#f76a0c' ) ) );
			return;
		}

		if ( empty( $input->attribute( 'markGradient' ) ) ) {
			return;
		}

		$css->add_property( 'background-image', $input->attribute( 'markGradient' ) );
		$css->add_property( '-webkit-background-clip', 'text' );
		$css->add_property( 'background-clip', 'text' );
		$css->add_property( '-webkit-text-fill-color', 'transparent' );
	}
}
