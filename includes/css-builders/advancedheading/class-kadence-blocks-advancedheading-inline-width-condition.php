<?php
/**
 * Tells whether the inline image has no usable desktop width.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the inline image has no usable desktop width.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Inline_Width_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the condition is met.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$width = $input->attribute( 'inlineImageWidth' );

		return empty( $width ) || ! is_array( $width ) || ! is_numeric( $width[0] ?? null );
	}
}
