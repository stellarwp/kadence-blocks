<?php
/**
 * Writes the padding rows had before the editor saved one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the padding rows had before the editor saved one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Default_Padding_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the padding.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! empty( $input->attribute( 'kbVersion' ) ) ) {
			return;
		}

		$input->css()->add_property( 'padding-top', 'var( --global-kb-row-default-top, 25px )' );
		$input->css()->add_property( 'padding-bottom', 'var( --global-kb-row-default-bottom, 25px )' );
	}
}
