<?php
/**
 * Tells the browser that the fields are dark.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Tells the browser that the fields are dark.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Dark_Scheme_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color scheme.
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

		if ( ! isset( $style['isDark'] ) || true !== $style['isDark'] ) {
			return;
		}

		$input->css()->add_property( 'color-scheme', 'dark' );
	}
}
