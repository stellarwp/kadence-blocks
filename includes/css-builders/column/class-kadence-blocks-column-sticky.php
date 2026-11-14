<?php
/**
 * Makes the column sticky and writes its desktop offset.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Makes the column sticky and writes its desktop offset.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Sticky_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the sticky rules.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( true !== $input->attribute( 'sticky' ) ) {
			return;
		}

		$css = $input->css();

		$css->set_selector( '#wrapper.site' );
		$css->add_property( 'overflow', 'clip' );

		( new Kadence_Blocks_Column_Sticky_Offset_Css( 'desktop', 0 ) )->write( $input );
	}
}
