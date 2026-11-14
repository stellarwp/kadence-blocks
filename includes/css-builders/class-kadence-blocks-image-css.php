<?php
/**
 * Builds the CSS for the image block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/image/loader.php';

/**
 * Builds the CSS for the image block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return array_merge(
			Kadence_Blocks_Image_Layout_Sections::sections(),
			Kadence_Blocks_Image_Style_Sections::sections(),
			Kadence_Blocks_Image_Caption_Sections::sections()
		);
	}
}
