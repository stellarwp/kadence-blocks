<?php
/**
 * Writes the filter of the map.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the CSS filter of the map with its amount, 50 percent when the amount is not a number.
 *
 * @since TBD
 */
final class Kadence_Blocks_Googlemaps_Filter_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the filter.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$amount = $input->attribute( 'mapFilterAmount' );
		$level  = is_numeric( $amount ) ? $amount : 50;

		$input->css()->add_property( 'filter', $input->attribute( 'mapFilter' ) . '(' . $level . '%)' );
	}
}
