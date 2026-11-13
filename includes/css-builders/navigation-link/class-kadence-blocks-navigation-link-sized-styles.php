<?php
/**
 * Navigation link sized styles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Navigation link sized styles.
 *
 * @since TBD
 */
final class Kadence_Blocks_Navigation_Link_Sized_Styles implements Kadence_Blocks_Css_Section {

	/**
	 * Ask the block for the styles of each size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $size ) {
			$input->context()->call( 'sized_dynamic_styles', $css, $input->attributes(), $input->unique_id(), $size );
		}

		$css->set_media_state( 'desktop' );
	}
}
