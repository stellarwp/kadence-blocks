<?php
/**
 * Writes the border color of the fields that have focus.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

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
