<?php
/**
 * Tells whether the bar is a line.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the bar is a line.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Line_Bar_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the editor saved no bar type, or the line.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$type = $input->attribute( 'barType' );

		return null === $type || 'line' === $type;
	}
}
