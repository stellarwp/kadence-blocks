<?php
/**
 * Tells whether the site outputs media queries.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the site outputs media queries.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Media_Queries_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the site outputs media queries.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return (bool) apply_filters( 'kadence_blocks_css_output_media_queries', true );
	}
}
