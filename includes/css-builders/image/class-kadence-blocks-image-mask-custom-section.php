<?php
/**
 * Writes a custom mask.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes a custom mask.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Mask_Custom_Section implements Kadence_Blocks_Css_Section {

	/**
	 * Write the mask of the saved URL, with the saved size, repeat and position or the defaults.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$url = $input->attribute( 'maskUrl' );

		if ( empty( $url ) ) {
			return;
		}

		$size     = $input->attribute( 'maskSize' );
		$position = $input->attribute( 'maskPosition' );
		$repeat   = $input->attribute( 'maskRepeat' );

		Kadence_Blocks_Image_Mask_Writer::write(
			$input->css(),
			'url(' . $url . ')',
			! empty( $size ) ? $size : 'auto',
			! empty( $repeat ) ? $repeat : 'no-repeat',
			! empty( $position ) ? $position : 'center center'
		);
	}
}
