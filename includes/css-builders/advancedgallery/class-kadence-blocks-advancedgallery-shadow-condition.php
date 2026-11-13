<?php
/**
 * Tells whether the images have a shadow.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the images have a shadow.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Shadow_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the shadow is on and the gallery is not a mosaic.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return true === $input->attribute( 'displayShadow' ) && 'mosaic' !== $input->attribute( 'type' );
	}
}
