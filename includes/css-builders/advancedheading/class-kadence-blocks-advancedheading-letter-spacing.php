<?php
/**
 * Writes the letter spacing of the desktop.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the letter spacing of the desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Letter_Spacing_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the letter spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_with_unit( 'letter-spacing', $input->attribute( 'letterSpacing' ), $input->attribute( 'letterSpacingType', 'px' ) );
	}
}
