<?php
/**
 * Writes the height of the stripe.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the height of the stripe.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Stripe_Height_Css implements Kadence_Blocks_Css_Section {

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
		$height = $input->attribute( 'dividerHeight' );

		$input->css()->add_property( 'height', ( ! empty( $height ) ? $height : '10' ) . 'px' );
	}
}
