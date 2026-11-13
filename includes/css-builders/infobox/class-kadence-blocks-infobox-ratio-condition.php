<?php
/**
 * Tells whether the image has a ratio chosen.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the image has a ratio chosen.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Ratio_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the editor chose a ratio other than the one of the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$ratio = $input->attribute( 'imageRatio' );

		return ! empty( $ratio ) && 'inherit' !== $ratio;
	}
}
