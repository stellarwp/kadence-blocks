<?php
/**
 * Writes the border style of the highlight when it is not the solid default.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border style of the highlight when it is not the solid default.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Border_Style_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the style.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$style = $input->attribute( 'markBorderStyle' );

		if ( empty( $style ) || 'solid' === $style ) {
			return;
		}

		$input->css()->add_property( 'border-style', $style );
	}
}
