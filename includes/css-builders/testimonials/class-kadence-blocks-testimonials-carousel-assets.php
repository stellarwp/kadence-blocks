<?php
/**
 * Asks for the scripts and the styles of the carousel when the layout is a carousel.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Asks for the scripts and the styles of the carousel when the layout is a carousel.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Carousel_Assets_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Ask for the assets.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( 'carousel' !== $input->attribute( 'layout' ) ) {
			return;
		}

		$context = $input->context();

		$context->call( 'enqueue_style', 'kadence-blocks-splide' );
		$context->call( 'enqueue_script', 'kadence-blocks-splide-init' );
	}
}
