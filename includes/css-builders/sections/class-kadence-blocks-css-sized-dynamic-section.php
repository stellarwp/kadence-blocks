<?php
/**
 * Asks the block for the dynamic styles of each size.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';

/**
 * Asks the block for its dynamic styles on desktop, then on tablet and then on mobile, and goes back to desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Sized_Dynamic_Section implements Kadence_Blocks_Css_Section {

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
