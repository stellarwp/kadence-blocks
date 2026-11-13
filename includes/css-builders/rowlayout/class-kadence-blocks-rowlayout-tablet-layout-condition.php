<?php
/**
 * Tells whether the row has a tablet layout.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the row has a tablet layout.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Tablet_Layout_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the editor saved a tablet layout, or a width for the first tablet column.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return ! empty( $input->attribute( 'tabletLayout' ) ) || ! empty( $input->derived( 'columns' )->widths( 'tablet' )[0] );
	}
}
