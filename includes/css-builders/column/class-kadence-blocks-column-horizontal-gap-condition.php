<?php
/**
 * Tells whether the gap is the one of the old horizontal columns.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the gap is the one of the old horizontal columns.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Horizontal_Gap_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the column was saved by version one and flows from left to right on desktop.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$layout = $input->derived( 'layout' );

		return ! $layout->is_version_two() && 'horizontal' === $layout->device( 0 )->direction();
	}
}
