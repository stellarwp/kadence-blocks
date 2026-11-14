<?php
/**
 * Writes the blend mode of the overlay.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the blend mode of the overlay.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Blend_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the blend mode.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$mode = $input->attribute( 'overlayBlendMode' );

		if ( ! empty( $mode ) && 'none' !== $mode ) {
			$input->css()->add_property( 'mix-blend-mode', $mode );
		}
	}
}
