<?php
/**
 * Tells whether the captions have a background.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the captions have a background.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Caption_Background_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the style of the captions has a background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$font = $input->item( 'captionStyles', 0 );

		return ! empty( $font['background'] );
	}
}
