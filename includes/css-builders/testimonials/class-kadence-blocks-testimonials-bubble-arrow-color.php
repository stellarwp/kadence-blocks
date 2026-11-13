<?php
/**
 * Writes the color of the arrow of a bubble, to match the border of the container.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the color of the arrow of a bubble, to match the border of the container.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Bubble_Arrow_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$border = $input->item( 'borderStyle', 0 );
		$color  = $border['bottom'][0] ?? null;

		if ( ! empty( $color ) ) {
			$css = $input->css();

			$css->add_property( 'border-top-color', $css->render_color( $color ) );

			return;
		}

		( new Kadence_Blocks_Css_Alpha_Color_Section( 'border-top-color', 'containerBorder', 'containerBorderOpacity' ) )->write( $input );
	}
}
