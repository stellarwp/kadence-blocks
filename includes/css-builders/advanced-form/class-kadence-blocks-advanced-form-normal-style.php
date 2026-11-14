<?php
/**
 * Keeps the help text from being italic when its style is normal.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Keeps the help text from being italic when its style is normal.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Normal_Style_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the style.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );
		$help     = $settings->group( 'helpFont' );

		if ( empty( $help['style'] ) || 'normal' !== $help['style'] ) {
			return;
		}

		$input->css()->add_property( 'font-style', 'normal' );
	}
}
