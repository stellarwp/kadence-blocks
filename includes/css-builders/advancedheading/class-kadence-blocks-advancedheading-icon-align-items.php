<?php
/**
 * Writes how the icon lines up with the text.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes how the icon lines up with the text.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Icon_Align_Items_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$align = $input->attribute( 'iconVerticalAlign' );

		$input->css()->add_property( 'align-items', $align ?? 'center' );
	}
}
