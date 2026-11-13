<?php
/**
 * Tells whether the button has a fixed width.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the button has a fixed width.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Button_Fixed_Width_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the width type of the button is fixed.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return 'fixed' === $input->derived( 'width_type' );
	}
}
