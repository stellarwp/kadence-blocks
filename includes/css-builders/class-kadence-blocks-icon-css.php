<?php
/**
 * Builds the CSS for the icon block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the icon block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Icon_Css extends Kadence_Blocks_Css_Block_Builder {

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
			new Kadence_Blocks_Icon_Items_Css( $this->item_sections() ),
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-icon.kt-svg-icons{id}' ),
			new Kadence_Blocks_Icon_Flex_Align_Css(),
			new Kadence_Blocks_Css_Enabled_Section( 'wrapIcons', [ new Kadence_Blocks_Css_Static_Section( 'flex-wrap', 'wrap' ) ] ),
			new Kadence_Blocks_Css_Gap_Section( 'gap', 'gap', 'gapUnit' ),
		];
	}

	/**
	 * The sections written for each icon saved before the icon block used single icons inside.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function item_sections(): array {
		return [
			new Kadence_Blocks_Icon_Item_Selector_Css( ' .kb-svg-icon-wrap' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'color', 'color' ),
			new Kadence_Blocks_Css_Responsive_Size_Section( [ 'size', 'tabletSize', 'mobileSize' ], 'font-size', '' ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Strict_Condition( 'style', 'stacked' ), $this->stacked_sections(), [] ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
			new Kadence_Blocks_Icon_Item_Selector_Css( ':hover .kb-svg-icon-wrap' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'hColor', 'color' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'hBackground', 'background' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'hBorder', 'border-color' ),
		];
	}

	/**
	 * The sections of the background, the border and the padding of a stacked icon.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function stacked_sections(): array {
		return [
			new Kadence_Blocks_Css_Color_Output_Section( 'background', 'background' ),
			new Kadence_Blocks_Css_Color_Output_Section( 'border', 'border-color' ),
			new Kadence_Blocks_Css_Range_Section( 'borderWidth', 'border-width', 'px' ),
			new Kadence_Blocks_Css_Range_Section( 'borderRadius', 'border-radius', 'px' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
		];
	}
}
