<?php
/**
 * Builds the CSS for the off canvas block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Builds the CSS for the off canvas block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Off_Canvas_Css extends Kadence_Blocks_Css_Block_Builder {

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
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-inner-wrap' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'border', false, Kadence_Blocks_Css_Device_Keys::arguments( 'border' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', Kadence_Blocks_Css_Device_Keys::arguments( 'borderRadius' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-inner' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', Kadence_Blocks_Css_Device_Keys::arguments( 'padding' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-close' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'closeIconPadding', Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconPadding', 'closeIconPaddingUnit' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'closeIconMargin', Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconMargin', 'closeIconMarginUnit' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'closeIconBorderRadius', Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconBorderRadius' ) ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'closeIconBorder', false, Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconBorder' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-off-canvas{id} .kb-off-canvas-close:hover, .wp-block-kadence-off-canvas{id} .kb-off-canvas-close:focus-visible' ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'closeIconBorderHover', false, Kadence_Blocks_Css_Device_Keys::arguments( 'closeIconBorderHover' ) ),
		];
	}
}
