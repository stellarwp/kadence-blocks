<?php
/**
 * Writes the margin of the gallery.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the margin of the gallery.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Margin_Css implements Kadence_Blocks_Css_Section {

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
		$margin = $input->item( 'margin', 0 );

		if ( ! isset( $margin ) ) {
			return;
		}

		// The unit of this margin is not in the standard place in the attributes.
		$unit = $input->attribute( 'marginUnit' );

		$input->css()->render_measure_output(
			array_merge( $margin, [ 'marginType' => ! empty( $unit ) ? $unit : 'px' ] ),
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
