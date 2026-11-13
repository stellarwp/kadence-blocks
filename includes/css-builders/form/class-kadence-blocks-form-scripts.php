<?php
/**
 * Asks the block to load the scripts of the form.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Asks the block to load the scripts of the form.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Scripts_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Ask for the scripts.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$context = $input->context();

		$context->call( 'enqueue_script', 'kadence-blocks-form' );

		if ( empty( $input->attribute( 'recaptcha' ) ) ) {
			return;
		}

		$context->call( 'enqueue_script', 'v2' === $input->attribute( 'recaptchaVersion' ) ? 'kadence-blocks-google-recaptcha-v2' : 'kadence-blocks-google-recaptcha-v3' );
	}
}
