<?php
/**
 * Writes the size of the rating icons, 16 pixels when none was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the size of the rating icons, 16 pixels when none was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Rating_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$size = $input->item( 'ratingStyles', 0 )['size'] ?? null;

		$input->css()->add_property( 'font-size', null !== $size ? $size . 'px' : '16px' );
	}
}
