<?php
/**
 * Writes the background color of the column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the background color of the column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Background_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$background = $input->attribute( 'background' );

		if ( empty( $background ) ) {
			return;
		}

		$opacity = $input->attribute( 'backgroundOpacity' );

		$input->css()->add_property( 'background-color', $input->css()->render_color( $background, is_numeric( $opacity ) ? $opacity : 1 ) );
	}
}
