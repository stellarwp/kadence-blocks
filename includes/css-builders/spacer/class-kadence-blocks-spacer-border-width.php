<?php
/**
 * Writes the thickness of the divider.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the thickness of the divider.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Border_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the thickness.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$height = $input->attribute( 'dividerHeight' );

		$input->css()->add_property( 'border-top-width', $height . 'px' );
	}
}
