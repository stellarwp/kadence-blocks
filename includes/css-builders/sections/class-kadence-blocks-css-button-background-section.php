<?php
/**
 * Writes the resting background of a button: the solid color, or the gradient.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the resting background of a button: the solid color, or the gradient.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_Background_Section implements Kadence_Blocks_Css_Section {

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
		$this->write_solid( $input );
		$this->write_gradient( $input );
	}

	/**
	 * Write the solid color. It is important when the hover background is a gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_solid( Kadence_Blocks_Css_Build_Input $input ): void {
		$background = $input->attribute( 'background' );

		if ( 'normal' !== $input->derived( 'bg_type' ) || empty( $background ) ) {
			return;
		}

		$css       = $input->css();
		$important = 'gradient' === $input->derived( 'bg_hover_type' ) ? ' !important' : '';

		$css->add_property( 'background', $css->render_color( $background ) . $important );
	}

	/**
	 * Write the gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_gradient( Kadence_Blocks_Css_Build_Input $input ): void {
		$gradient = $input->attribute( 'gradient' );

		if ( 'gradient' !== $input->derived( 'bg_type' ) || empty( $gradient ) ) {
			return;
		}

		$input->css()->add_property( 'background', $gradient . ' !important' );
	}
}
