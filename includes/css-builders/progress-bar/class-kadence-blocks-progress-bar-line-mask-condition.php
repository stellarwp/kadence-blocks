<?php
/**
 * Tells whether the bar is a line of masks.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the bar is a line of masks.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Line_Mask_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the bar type is the line mask. The comparison is loose, as it always was.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$type = $input->attribute( 'barType' );

		return null !== $type && 'line-mask' == $type;
	}
}
