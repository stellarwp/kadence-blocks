<?php
/**
 * Enqueues the scripts and the style the video popup needs.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Enqueues the scripts and the style the video popup needs.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Assets_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Enqueue the assets.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$context = $input->context();

		$context->call( 'enqueue_script', 'kadence-blocks-pro-glight-video-init' );
		$context->call( 'enqueue_script', 'kadence-glightbox' );
		$context->call( 'enqueue_style', 'kadence-glightbox' );
	}
}
