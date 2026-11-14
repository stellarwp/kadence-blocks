<?php
/**
 * Writes the border radius of the main icon: pixels when it was saved with the icon, else the separate setting.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the border radius of the main icon: pixels when it was saved with the icon, else the separate
 * setting.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Icon_Border_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the radius.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->item( 'iconStyles', 0 );
		$radius   = $settings['borderRadius'] ?? null;

		if ( is_numeric( $radius ) ) {
			$input->css()->add_property( 'border-radius', $radius . 'px' );

			return;
		}

		( new Kadence_Blocks_Testimonials_Border_Radius_Css( 'iconBorderRadius', 'iconBorderRadiusUnit' ) )->write( $input );
	}
}
