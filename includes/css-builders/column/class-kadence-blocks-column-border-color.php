<?php
/**
 * Writes the color of the border of the column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the color of the border of the column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Border_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$border = $input->attribute( 'border' );

		if ( empty( $border ) ) {
			return;
		}

		$opacity = $input->attribute( 'borderOpacity' );

		$input->css()->add_property( 'border-color', $input->css()->render_color( $border, is_numeric( $opacity ) ? $opacity : 1 ) );
	}
}
