<?php
/**
 * Writes a mask that ships with the plugin.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a mask that ships with the plugin.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Mask_Preset_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the mask of the saved name.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$base = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/';

		Kadence_Blocks_Image_Mask_Writer::write( $input->css(), 'url(' . $base . $input->attribute( 'maskSvg' ) . '.svg)', 'auto', 'no-repeat', 'center' );
	}
}
