<?php
/**
 * Writes the row and column gap of the column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the row and column gap of the column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Vertical_Gap_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the gaps.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$attributes = $input->attributes();
		$css        = $input->css();

		if ( empty( $attributes['gutterVariable'][0] ) ) {
			$attributes['gutterVariable'][0] = 'sm';
		}

		$css->render_row_gap( $attributes, 'rowGapVariable', 'row-gap', 'rowGap', 'rowGapUnit' );
		$css->render_row_gap( $attributes, 'gutterVariable', 'column-gap', 'gutter', 'gutterUnit' );
	}
}
