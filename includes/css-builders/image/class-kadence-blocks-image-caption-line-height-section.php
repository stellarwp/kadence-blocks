<?php
/**
 * Writes the line height of the caption font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the line height of the caption font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Line_Height_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the line height of desktop.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$heights = $input->attribute( 'lineHeight' );

		if ( ! is_array( $heights ) || empty( $heights[0] ) ) {
			return;
		}

		$unit = $input->attribute( 'lineType' );

		$input->css()->add_property( 'line-height', $heights[0] . ( $unit ?? 'px' ) );
	}
}
