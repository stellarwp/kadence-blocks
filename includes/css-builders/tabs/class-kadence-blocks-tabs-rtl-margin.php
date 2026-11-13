<?php
/**
 * Spaces the titles of the tabs in a right to left language.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Spaces the titles of the tabs in a right to left language.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Rtl_Margin {

	/**
	 * Write the margins of the titles of the tabs, when the language is read right to left.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param int|float|string               $gap   The gap between the tabs, in pixels.
	 *
	 * @return void
	 */
	public static function write( Kadence_Blocks_Css_Build_Input $input, $gap ): void {
		if ( ! is_rtl() ) {
			return;
		}

		$css = $input->css();

		$css->set_selector( '.rtl .wp-block-kadence-tabs .kt-tabs-id' . $input->unique_id() . ' > .kt-tabs-title-list li .kt-tab-title' );
		$css->add_property( 'margin-right', '0px' );
		$css->add_property( 'margin-left', $gap . 'px' );
	}
}
