<?php
/**
 * Writes the border width of the learn more link.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border width of the learn more link.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Learn_More_Border_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$width = $input->attribute( 'borderWidth' );

		if ( ! is_array( $width ) ) {
			return;
		}

		$input->css()->add_property( 'border-width', $width[0] . 'px ' . $width[1] . 'px ' . $width[2] . 'px ' . $width[3] . 'px' );
	}
}
