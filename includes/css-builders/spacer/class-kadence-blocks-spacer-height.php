<?php
/**
 * Writes the height of the spacer.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the height of the spacer.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Height_Css implements Kadence_Blocks_Css_Section {

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
		$units  = ! empty( $input->attribute( 'spacerHeightUnits' ) ) ? $input->attribute( 'spacerHeightUnits' ) : 'px';
		$height = $input->attribute( 'spacerHeight' );

		if ( empty( $height ) && 'px' === $units ) {
			return;
		}

		$input->css()->add_property( 'height', ( ! empty( $height ) ? $height : '60' ) . $units );
	}
}
