<?php
/**
 * Writes the blend mode of the overlay.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the blend mode of the overlay.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Blend_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the blend mode.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$mode = $input->attribute( 'overlayBlendMode' );

		if ( ! empty( $mode ) && 'none' !== $mode ) {
			$input->css()->add_property( 'mix-blend-mode', $mode );
		}
	}
}
