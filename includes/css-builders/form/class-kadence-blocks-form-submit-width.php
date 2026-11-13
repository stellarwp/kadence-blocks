<?php
/**
 * Writes the fixed width of the submit button.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the fixed width of the submit button.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Submit_Width_Css implements Kadence_Blocks_Css_Section {

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
		$width = $input->attribute( 'fixedWidth' );

		if ( 'fixed' !== $input->attribute( 'widthType' ) || ! is_array( $width ) || empty( $width[0] ?? null ) ) {
			return;
		}

		$input->css()->add_property( 'width', $width[0] . 'px' );
	}
}
