<?php
/**
 * Writes the stacking order of the column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the stacking order of the column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Z_Index_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the stacking order.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$index = $input->attribute( 'zIndex' );

		if ( null === $index ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'column' );
		$css->add_property( 'z-index', 0 === $index ? 'auto' : $index );
		$css->add_property( 'position', 'relative' );
	}
}
