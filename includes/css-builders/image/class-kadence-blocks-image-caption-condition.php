<?php
/**
 * Whether the caption has styles to write.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the caption has styles to write.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the caption is not switched off and its first style is a list of settings.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$attributes = $input->attributes();

		if ( isset( $attributes['showCaption'] ) ) {
			return false;
		}

		$styles = $attributes['captionStyles'] ?? null;

		return is_array( $styles ) && is_array( $styles[0] );
	}
}
