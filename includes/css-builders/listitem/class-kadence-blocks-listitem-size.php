<?php
/**
 * Writes the size of the icon when it is a number.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the size of the icon when it is a number.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_with_unit( 'font-size', $input->attribute( 'size' ), 'px !important' );
	}
}
