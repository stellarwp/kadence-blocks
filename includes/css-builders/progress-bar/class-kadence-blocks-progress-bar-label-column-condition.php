<?php
/**
 * Tells whether the label sits above or below the bar.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the label sits above or below the bar.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Label_Column_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the label layout puts the label on top or at the bottom.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return in_array( $input->attribute( 'labelLayout' ), [ 'lt', 'lb' ], true );
	}
}
