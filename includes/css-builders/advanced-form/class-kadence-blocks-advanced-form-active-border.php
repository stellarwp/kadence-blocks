<?php
/**
 * Writes the border color of the fields that have focus.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the border color of the fields that have focus.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Active_Border_Css implements Kadence_Blocks_Css_Section {

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
		$settings = $input->derived( 'settings' );
		$style    = $settings->group( 'style' );

		if ( empty( $style['borderActive'] ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'border-color', $css->sanitize_color( $style['borderActive'] ) );
	}
}
