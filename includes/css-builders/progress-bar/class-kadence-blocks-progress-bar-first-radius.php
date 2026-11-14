<?php
/**
 * Writes the border radius of the bar on desktop, in pixels.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the border radius of the bar on desktop, in pixels.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_First_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the border radius.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( 'border-radius', $input->item( 'progressBorderRadius', 0 ), 'px' );
	}
}
