<?php
/**
 * Writes the border radius of the main icon: pixels when it was saved with the icon, else the separate setting.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-testimonials-border-radius-css.php';

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
