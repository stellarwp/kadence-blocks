<?php
/**
 * Writes the padding rows had before the editor saved one.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the padding rows had before the editor saved one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Default_Padding_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the padding.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! empty( $input->attribute( 'kbVersion' ) ) ) {
			return;
		}

		$input->css()->add_property( 'padding-top', 'var( --global-kb-row-default-top, 25px )' );
		$input->css()->add_property( 'padding-bottom', 'var( --global-kb-row-default-bottom, 25px )' );
	}
}
