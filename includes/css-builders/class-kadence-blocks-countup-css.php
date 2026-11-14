<?php
/**
 * Builds the CSS for the countup block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-builder.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/countup/loader.php';

/**
 * Builds the CSS for the countup block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countup_Css extends Kadence_Blocks_Css_Block_Builder {

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
		return array_merge( $this->title_sections(), $this->number_sections() );
	}

	/**
	 * The sections of the title.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function title_sections(): array {
		return array_merge(
			[
				new Kadence_Blocks_Css_Selector_Section( '.kb-count-up-{id} .kb-count-up-title' ),
				new Kadence_Blocks_Css_Color_Section( 'color', 'titleColor' ),
				new Kadence_Blocks_Css_Typography_Section( 'titleFont' ),
				new Kadence_Blocks_Css_Measure_Section( 'padding', 'titlePadding', $this->measure_arguments( 'title', 'Padding' ) ),
				new Kadence_Blocks_Css_Measure_Section( 'margin', 'titleMargin', $this->measure_arguments( 'title', 'Margin' ) ),
				new Kadence_Blocks_Css_Choice_Section(
					new Kadence_Blocks_Countup_Min_Height_Condition( 'titleMinHeight' ),
					$this->responsive_sections(
						new Kadence_Blocks_Css_Numeric_Unit_Section( 'min-height', 'titleMinHeight', 'px', 0 ),
						new Kadence_Blocks_Css_Numeric_Unit_Section( 'min-height', 'titleMinHeight', 'px', 1 ),
						new Kadence_Blocks_Css_Numeric_Unit_Section( 'min-height', 'titleMinHeight', 'px', 2 )
					),
					[]
				),
				new Kadence_Blocks_Css_Gate_Section( [ 'titleAlign' ], $this->align_sections( 'titleAlign' ) ),
			]
		);
	}

	/**
	 * The sections of the number.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function number_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-count-up-{id} .kb-count-up-number' ),
			new Kadence_Blocks_Css_Color_Section( 'color', 'numberColor' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Countup_Font_Condition( 'numberFont' ),
				[ new Kadence_Blocks_Css_Typography_Section( 'numberFont' ) ],
				[ new Kadence_Blocks_Css_Static_Section( 'font-size', '50px' ) ]
			),
			new Kadence_Blocks_Css_Selector_Section( '.kb-count-up-{id} .kb-count-up-number' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'numberPadding', $this->measure_arguments( 'number', 'Padding' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'numberMargin', $this->measure_arguments( 'number', 'Margin' ) ),
			new Kadence_Blocks_Css_Gate_Section( [ 'numberAlign' ], $this->align_sections( 'numberAlign' ) ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-count-up-{id} .kb-count-up-number' ),
			...$this->responsive_sections(
				new Kadence_Blocks_Css_Numeric_Unit_Section( 'min-height', 'numberMinHeight', 'px', 0 ),
				new Kadence_Blocks_Countup_Number_Height_Css( 1 ),
				new Kadence_Blocks_Countup_Number_Height_Css( 2 )
			),
		];
	}

	/**
	 * The sections of the text alignment of a part on each device.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the alignment of each device.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function align_sections( string $attribute ): array {
		return $this->responsive_sections(
			new Kadence_Blocks_Css_Item_Value_Section( 'text-align', $attribute, 0 ),
			new Kadence_Blocks_Css_Item_Value_Section( 'text-align', $attribute, 1 ),
			new Kadence_Blocks_Css_Item_Value_Section( 'text-align', $attribute, 2 )
		);
	}

	/**
	 * The sections of a part on desktop, then on tablet and then on mobile.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Section $desktop The section that writes on desktop.
	 * @param Kadence_Blocks_Css_Section $tablet  The section that writes on tablet.
	 * @param Kadence_Blocks_Css_Section $mobile  The section that writes on mobile.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function responsive_sections( Kadence_Blocks_Css_Section $desktop, Kadence_Blocks_Css_Section $tablet, Kadence_Blocks_Css_Section $mobile ): array {
		return [
			$desktop,
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ $tablet ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ $mobile ] ),
		];
	}

	/**
	 * The attributes of a measure of a part on each device.
	 *
	 * @since TBD
	 *
	 * @param string $part The part, `title` or `number`.
	 * @param string $kind The measure, `Padding` or `Margin`.
	 *
	 * @return array<string, string>
	 */
	private function measure_arguments( string $part, string $kind ): array {
		return [
			'desktop_key' => $part . $kind,
			'tablet_key'  => $part . 'Tablet' . $kind,
			'mobile_key'  => $part . 'Mobile' . $kind,
		];
	}
}
