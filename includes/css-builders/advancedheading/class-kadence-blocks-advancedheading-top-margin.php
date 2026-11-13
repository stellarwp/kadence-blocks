<?php
/**
 * Writes the top margin the block saved before it had one margin for every side.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the top margin the block saved before it had one margin for every side.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Top_Margin_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the top margin.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$top = $input->attribute( 'topMargin' );

		if ( ! is_numeric( $top ) ) {
			return;
		}

		$css = $input->css();

		$css->add_property( 'margin-top', $top . $input->attribute( 'marginType', 'px' ) );

		// This fixes an issue where the background does not show over the top of the item that is above it.
		if ( $top < 0 && ! empty( $input->attribute( 'background' ) ) ) {
			$css->add_property( 'position', 'relative' );
		}
	}
}
