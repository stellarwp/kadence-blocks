<?php
/**
 * Writes the gap of the old horizontal columns.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the gap of the old horizontal columns.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Horizontal_Gap_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the gap.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$attributes = $input->attributes();

		if ( ! is_numeric( $attributes['gutter'][0] ?? null ) ) {
			$attributes['gutter'][0] = 10;
		}

		if ( empty( $attributes['gutterVariable'] ) ) {
			$attributes['gutterVariable'] = [ 'custom', 'custom', 'custom' ];
		}

		$input->css()->render_row_gap( $attributes, 'gutterVariable', 'gap', 'gutter', 'gutterUnit' );
	}
}
