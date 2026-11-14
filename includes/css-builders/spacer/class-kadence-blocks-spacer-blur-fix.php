<?php
/**
 * Keeps the divider from blurring when its thickness is odd.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Keeps the divider from blurring when its thickness is odd.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Blur_Fix_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( intval( absint( $input->attribute( 'dividerHeight' ) ) % 2 ) != 0 ) { // phpcs:ignore Universal.Operators.StrictComparisons.LooseNotEqual -- Kept from the original.
			$input->css()->add_property( 'height', '1px' );
		}
	}
}
