<?php
/**
 * Tells whether a minimum height was saved as a number.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether a minimum height was saved as a number.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Min_Height {

	/**
	 * Whether the minimum height of a device is a number.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input     What the section needs to write its CSS.
	 * @param string                         $attribute The attribute that stores the minimum heights.
	 * @param int                            $index     The index of the device.
	 *
	 * @return bool
	 */
	public static function is_set( Kadence_Blocks_Css_Build_Input $input, $attribute, $index ): bool {
		return is_array( $input->attribute( $attribute ) ) && is_numeric( $input->item( $attribute, $index ) );
	}
}
