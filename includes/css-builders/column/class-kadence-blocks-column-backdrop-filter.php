<?php
/**
 * Writes the backdrop filter of the column.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the backdrop filter of the column.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Backdrop_Filter_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the filter.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$type = $input->attribute( 'backdropFilterType' );

		if ( empty( $type ) || 'none' === $type ) {
			return;
		}

		$css = $input->css();

		Kadence_Blocks_Column_Selector::set( $input, 'inner' );
		$css->add_property( '-webkit-backdrop-filter', $input->attribute( 'backdropFilterString' ) );
		$css->add_property( 'backdrop-filter', $input->attribute( 'backdropFilterString' ) );
	}
}
