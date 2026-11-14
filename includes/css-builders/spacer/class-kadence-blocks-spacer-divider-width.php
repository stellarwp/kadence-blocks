<?php
/**
 * Writes the width of the divider.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the width of the divider.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Divider_Width_Css implements Kadence_Blocks_Css_Section {

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
		$width = $input->attribute( 'dividerWidth' );

		$input->css()->add_property( 'width', ( ! empty( $width ) ? $width : '80' ) . $input->derived( 'width_units' ) );
	}
}
