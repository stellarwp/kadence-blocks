<?php
/**
 * Pushes an item down when the icon overlaps it, because of a negative top margin of the icon.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Pushes an item down when the icon overlaps it, because of a negative top margin of the icon.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Icon_Overlap_Css implements Kadence_Blocks_Css_Section {

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
		$attributes = $input->attributes();

		if ( empty( $attributes['displayIcon'] ) ) {
			return;
		}

		$icon = $attributes['iconStyles'][0];

		if ( ! $icon['icon'] || ! $icon['margin'] || ! $icon['margin'][0] || ! ( $icon['margin'][0] < 0 ) ) {
			return;
		}

		$input->css()->add_property( 'padding-top', abs( $icon['margin'][0] ) . 'px' );
	}
}
