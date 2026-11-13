<?php
/**
 * Advanced Buttons video assets.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Asks the block to load the lightbox assets when a button opens a video.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Video_Assets_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Load the assets for every video button.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$buttons = $input->attribute( 'btns' );

		if ( ! is_array( $buttons ) ) {
			return;
		}

		foreach ( $buttons as $button ) {
			$this->load_assets( $input, $button );
		}
	}

	/**
	 * Ask the block to load the lightbox assets when a button opens a video.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param mixed                          $button The saved button.
	 *
	 * @return void
	 */
	private function load_assets( Kadence_Blocks_Css_Build_Input $input, $button ): void {
		if ( ! is_array( $button ) || empty( $button['target'] ) || 'video' != $button['target'] ) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual -- Matches the original loose comparison.
			return;
		}

		$input->context()->call( 'enqueue_style', 'kadence-simplelightbox-css' );
		$input->context()->call( 'enqueue_script', 'kadence-blocks-videolight-js' );
	}
}
