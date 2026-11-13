<?php
/**
 * Header backdrop condition.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the header has a backdrop filter, which only Kadence Blocks Pro can apply.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Backdrop_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the header has a backdrop filter and Kadence Blocks Pro is active.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return ! empty( $input->attribute( 'pro_backdropFilterString' ) ) && $input->derived( 'environment' )->has_pro();
	}
}
