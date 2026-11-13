<?php
/**
 * Tells whether the border of the content has a width.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the border of the content has a width.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Content_Border_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether one side of the content border is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$attributes = $input->attributes();
		$css        = $input->css();

		foreach ( [ 0, 1, 2, 3 ] as $side ) {
			// The builder takes the side by reference, which fails for a border saved as a string. That failure is kept.
			if ( isset( $attributes['contentBorder'][ $side ] ) && $css->is_number( $attributes['contentBorder'][ $side ] ) ) {
				return true;
			}
		}

		return false;
	}
}
