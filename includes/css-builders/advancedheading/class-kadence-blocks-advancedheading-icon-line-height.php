<?php
/**
 * Writes the line height of the icon.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the line height of the icon.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Icon_Line_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the line height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$height = $input->attribute( 'lineHeight' );

		if ( null === $height ) {
			return;
		}

		$unit = $input->attribute( 'lineType' );

		$input->css()->add_property( 'line-height', $height . ( empty( $unit ) ? 'px' : $unit ) );
	}
}
