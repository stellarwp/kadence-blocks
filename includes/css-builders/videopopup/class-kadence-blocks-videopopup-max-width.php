<?php
/**
 * Limits the width of the video wrap.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Limits the width of the video wrap.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Max_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the maximum width, with the unit stored or pixels.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$unit = $input->attribute( 'maxWidthUnit' );

		$input->css()->add_property( 'max-width', $input->attribute( 'maxWidth' ) . ( ! empty( $unit ) ? $unit : 'px' ) . ';' );
	}
}
