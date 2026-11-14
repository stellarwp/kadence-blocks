<?php
/**
 * Builds the CSS for the googlemaps block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/googlemaps/loader.php';

/**
 * Builds the CSS for the googlemaps block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Googlemaps_Css extends Kadence_Blocks_Css_Block_Builder {

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
		return array_merge(
			[ new Kadence_Blocks_Css_Selector_Section( '.kb-google-maps-container{id}' ) ],
			$this->size_sections(),
			[
				new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', $this->measure_arguments( 'margin' ) ),
				new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', $this->measure_arguments( 'padding' ) ),
			],
			$this->align_sections(),
			[ $this->filter_section() ]
		);
	}

	/**
	 * The sections of the maximum width and the height.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function size_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section( 'desktop', [ new Kadence_Blocks_Css_Numeric_Unit_Section( 'max-width', 'widthDesktop', 'px' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Css_Numeric_Unit_Section( 'max-width', 'widthTablet', 'px' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Css_Numeric_Unit_Section( 'max-width', 'widthMobile', 'px' ) ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Numeric_Attribute_Condition( 'heightDesktop' ),
				[ new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'heightDesktop', 'px' ) ],
				[ new Kadence_Blocks_Css_Static_Section( 'height', '450px' ) ]
			),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'heightTablet', 'px' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Css_Numeric_Unit_Section( 'height', 'heightMobile', 'px' ) ] ),
		];
	}

	/**
	 * The sections of the alignment on each device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function align_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section( 'desktop', [ new Kadence_Blocks_Googlemaps_Align_Css( 0 ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Googlemaps_Align_Css( 1 ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Googlemaps_Align_Css( 2 ) ] ),
		];
	}

	/**
	 * The section of the filter, written when the map has one other than the standard one.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function filter_section(): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Gate_Section(
			[ 'mapFilter' ],
			[
				new Kadence_Blocks_Css_Choice_Section(
					new Kadence_Blocks_Css_Strict_Condition( 'mapFilter', 'standard' ),
					[],
					[
						new Kadence_Blocks_Css_Selector_Section( '.kb-google-maps-container{id}' ),
						new Kadence_Blocks_Googlemaps_Filter_Css(),
					]
				),
			]
		);
	}

	/**
	 * The attributes of a margin or a padding on each device and its unit.
	 *
	 * @since TBD
	 *
	 * @param string $name The attribute name of the measure, `margin` or `padding`.
	 *
	 * @return array<string, string>
	 */
	private function measure_arguments( string $name ): array {
		return [
			'desktop_key' => $name . 'Desktop',
			'tablet_key'  => $name . 'Tablet',
			'mobile_key'  => $name . 'Mobile',
			'unit_key'    => $name . 'Unit',
		];
	}
}
