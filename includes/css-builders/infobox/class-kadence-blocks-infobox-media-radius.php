<?php
/**
 * Rounds the media.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Rounds the media.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Media_Radius_Css implements Kadence_Blocks_Css_Section {

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
		$radius = $input->attribute( 'borderRadius' );

		if ( empty( $radius ) ) {
			return;
		}

		$input->css()->add_property( 'border-radius', $radius . $input->attribute( 'borderRadiusUnit', 'px' ) );
		$input->css()->add_property( 'overflow', 'hidden' );
	}
}
