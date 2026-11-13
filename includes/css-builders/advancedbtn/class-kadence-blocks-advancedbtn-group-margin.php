<?php
/**
 * Advanced Buttons group margin.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the margin of the button group, which is saved as a list holding one object of per device
 * values.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Group_Margin_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the margin.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$margin = $input->attribute( 'margin' );

		if ( ! is_array( $margin[0] ?? null ) ) {
			return;
		}

		$values = array_merge( $margin[0], [ 'marginType' => $input->attribute( 'marginUnit' ) ?: 'px' ] );

		$input->css()->render_measure_output(
			$values,
			'margin',
			'margin',
			[
				'desktop_key' => 'desk',
				'tablet_key'  => 'tablet',
				'mobile_key'  => 'mobile',
			]
		);
	}
}
