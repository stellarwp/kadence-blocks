<?php
/**
 * Writes the stacking order of the row.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the stacking order of the row.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Z_Index_Css implements Kadence_Blocks_Css_Section {

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

		if ( ! is_numeric( $index ) ) {
			return;
		}

		Kadence_Blocks_Rowlayout_Selector::set( $input, $input->derived( 'selectors' )->is_updated() ? 'base' : 'inner' );
		$input->css()->add_property( 'z-index', $index );
		$input->css()->add_property( 'position', 'relative' );
	}
}
