<?php
/**
 * Tells whether the image is an SVG.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the image is an SVG.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Svg_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the image is an SVG.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return 'svg+xml' === ( $input->derived( 'media' )->image()['subtype'] ?? null );
	}
}
