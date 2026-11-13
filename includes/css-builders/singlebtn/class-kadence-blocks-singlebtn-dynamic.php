<?php
/**
 * Writes the transparent header styles of every device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the transparent header styles of every device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Dynamic_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the styles.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $size ) {
			$input->context()->call( 'sized_dynamic_styles', $input->css(), $input->attributes(), $input->unique_id(), $size );
		}

		$input->css()->set_media_state( 'desktop' );
	}
}
