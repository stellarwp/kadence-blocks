<?php
/**
 * Writes the font size and the line height of a font on desktop.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size and the line height of a font on desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the sizes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css  = $input->css();
		$size = $input->attribute( 'size' );
		$line = $input->attribute( 'lineHeight' );

		if ( is_array( $size ) && ! empty( $size[0] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $size[0], $input->attribute( 'sizeType', 'px' ) ) );
		}

		if ( is_array( $line ) && ! empty( $line[0] ) ) {
			$css->add_property( 'line-height', $line[0] . $input->attribute( 'lineType', 'px' ) );
		}
	}
}
