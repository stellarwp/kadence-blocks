<?php
/**
 * Advanced Buttons button border.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border color and style of a button.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Border_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the border.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css    = $input->css();
		$border = $input->attribute( 'border' );

		if ( ! empty( $border ) ) {
			$opacity = $input->attribute( 'borderOpacity' );

			$css->add_property( 'border-color', $css->render_color( $border, is_numeric( $opacity ) ? $opacity : 1 ) );
		}

		$this->write_style( $input );
	}

	/**
	 * Write the border style: the chosen one, or solid when a width was saved without a style.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_style( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! empty( $input->attribute( 'borderStyle' ) ) ) {
			$input->css()->add_property( 'border-style', $input->attribute( 'borderStyle' ) );
			return;
		}

		if ( ! empty( $input->attribute( 'borderWidth' ) ) ) {
			$input->css()->add_property( 'border-style', 'solid' );
		}
	}
}
