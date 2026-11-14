<?php
/**
 * Builds the CSS for the off canvas trigger block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the off canvas trigger block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Off_Canvas_Trigger_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Sized_Dynamic_Section(),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas-trigger{id}, .wp-block-kadence-off-canvas-trigger{id}:hover' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', Kadence_Blocks_Css_Device_Keys::arguments( 'padding' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', Kadence_Blocks_Css_Device_Keys::arguments( 'margin' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', Kadence_Blocks_Css_Device_Keys::arguments( 'borderRadius' ) ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'border', false, Kadence_Blocks_Css_Device_Keys::arguments( 'border' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas-trigger{id}:hover' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'borderHover', false, Kadence_Blocks_Css_Device_Keys::arguments( 'borderHover' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas-trigger{id} svg' ),
		];
	}
}
