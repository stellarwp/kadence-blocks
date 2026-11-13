<?php
/**
 * Tells whether a row with no tablet layout still has a tablet gap.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether a row with no tablet layout still has a tablet gap.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Tablet_Gap_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the row has no tablet layout but a tablet gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$gap = $input->css()->render_row_gap_property( $input->attributes(), [ 'columnGutter', 'tabletGutter', 'mobileGutter' ], 'tablet', 'customGutter', 'gutterType' );

		return empty( $input->attribute( 'tabletLayout' ) ) && ! empty( $gap );
	}
}
