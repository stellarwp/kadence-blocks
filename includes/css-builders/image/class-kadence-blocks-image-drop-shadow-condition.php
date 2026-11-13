<?php
/**
 * Whether the drop shadow has saved values.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the drop shadow has saved values.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Drop_Shadow_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the first drop shadow is a list of settings.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$shadow = $input->attribute( 'dropShadow' );

		return is_array( $shadow ) && is_array( $shadow[0] ?? null );
	}
}
