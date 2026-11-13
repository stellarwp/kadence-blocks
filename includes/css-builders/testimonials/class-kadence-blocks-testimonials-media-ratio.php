<?php
/**
 * Writes the ratio of the media of a card.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the ratio of the media of a card.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Media_Ratio_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the ratio.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$ratio = $input->item( 'mediaStyles', 0 )['ratio'] ?? null;

		if ( empty( $ratio ) ) {
			return;
		}

		$input->css()->add_property( 'padding-bottom', $ratio . '%' );
	}
}
