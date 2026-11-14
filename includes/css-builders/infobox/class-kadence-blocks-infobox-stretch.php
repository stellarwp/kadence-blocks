<?php
/**
 * Makes the link of a full height info box as high as the info box.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Makes the link of a full height info box as high as the info box.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Stretch_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->attribute( 'fullHeight' ) ) ) {
			return;
		}

		$input->css()->add_property( 'height', '100%' );

		if ( ( new Kadence_Blocks_Infobox_Learn_More_Layout_Condition() )->is_met( $input ) ) {
			( new Kadence_Blocks_Infobox_Learn_More_Layout_Css() )->write( $input );
		}
	}
}
