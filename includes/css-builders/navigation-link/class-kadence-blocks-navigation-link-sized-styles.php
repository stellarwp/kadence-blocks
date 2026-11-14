<?php
/**
 * Navigation link sized styles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

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
