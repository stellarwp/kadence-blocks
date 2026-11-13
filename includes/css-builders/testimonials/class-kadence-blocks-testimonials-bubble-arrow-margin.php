<?php
/**
 * Writes the margin of the arrow of a bubble, to match the border of the container.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the margin of the arrow of a bubble, to match the border of the container.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Bubble_Arrow_Margin_Css implements Kadence_Blocks_Css_Section {

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
		$width = $input->attribute( 'containerBorderWidth' );

		if ( is_array( $width ) && ! empty( $width[2] ) ) {
			$input->css()->add_property( 'margin-top', $width[2] . 'px' );

			return;
		}

		$this->write_from_border_style( $input );
	}

	/**
	 * Write the margin from the bottom of the border style.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	private function write_from_border_style( Kadence_Blocks_Css_Build_Input $input ): void {
		$border = $input->item( 'borderStyle', 0 );
		$bottom = $border['bottom'][2] ?? null;

		if ( empty( $bottom ) ) {
			return;
		}

		$unit = ! empty( $border['unit'] ) ? $border['unit'] : 'px';

		$input->css()->add_property( 'margin-top', $bottom . $unit );
	}
}
