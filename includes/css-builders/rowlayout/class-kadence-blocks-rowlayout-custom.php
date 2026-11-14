<?php
/**
 * Writes the custom CSS the editor saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the custom CSS the editor saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Custom_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Add the custom CSS.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$custom = $input->attribute( 'kadenceBlockCSS' );

		if ( empty( $custom ) ) {
			return;
		}

		$input->css()->add_css_string( str_replace( 'selector', $input->derived( 'selectors' )->base(), $custom ) );
	}
}
