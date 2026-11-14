<?php
/**
 * Writes the border width of the four sides.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the border width of the four sides.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Border_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$width = $input->attribute( 'borderWidth' );

		if ( ! is_array( $width ) || ! is_numeric( $width[0] ?? null ) ) {
			return;
		}

		$input->css()->add_property( 'border-width', $width[0] . 'px ' . $width[1] . 'px ' . $width[2] . 'px ' . $width[3] . 'px' );
	}
}
