<?php
/**
 * Writes the old top and bottom padding of the row on desktop.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the old top and bottom padding of the row on desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Vertical_Padding_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the padding.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( [ 'top', 'bottom' ] as $side ) {
			$this->write_side( $input, $side );
		}
	}

	/**
	 * Write the padding of one side: when it was saved, or when the unit is not pixels.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param string                         $side  The side.
	 *
	 * @return void
	 */
	private function write_side( Kadence_Blocks_Css_Build_Input $input, $side ): void {
		$padding = $input->attribute( $side . 'Padding' );
		$unit    = $input->attribute( 'paddingUnit' );

		if ( ! is_numeric( $padding ) && ( empty( $unit ) || 'px' === $unit ) ) {
			return;
		}

		$input->css()->add_property( 'padding-' . $side, ( is_numeric( $padding ) ? $padding : '25' ) . ( ! empty( $unit ) ? $unit : 'px' ) );
	}
}
