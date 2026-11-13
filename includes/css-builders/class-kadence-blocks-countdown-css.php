<?php
/**
 * Builds the CSS for the countdown block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/countdown/loader.php';

/**
 * Builds the CSS for the countdown block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Css {

	/**
	 * The selector of the container.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CONTAINER = '.kb-countdown-container-{id}';

	/**
	 * The selector of the date items that are not dividers.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ITEM = '.kb-countdown-container-{id} .kb-countdown-date-item:not( .kb-countdown-divider-item )';

	/**
	 * The selector of the dividers between the date items.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DIVIDER = '.kb-countdown-container-{id} .kb-countdown-date-item.kb-countdown-divider-item';

	/**
	 * The selector the parts of the countdown start with.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PART = '.kb-countdown-container.kb-countdown-container-{id}';

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * Create the builder.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context What this builder needs from the block.
	 */
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Build the block CSS.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public function build( $attributes, $css, $unique_id, $unique_style_id ) {
		$input = new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_style_id, $this->context );

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		return array_merge(
			$this->container_sections(),
			$this->item_sections(),
			$this->font_sections()
		);
	}

	/**
	 * The sections of the background, the border, the padding and the margin of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Countdown_Any_Condition( [ 'background', 'border' ], [ 'borderRadius', 'borderWidth' ] ),
				[
					new Kadence_Blocks_Css_Selector_Section( self::CONTAINER ),
					new Kadence_Blocks_Css_Color_Section( 'background', 'background' ),
					new Kadence_Blocks_Css_Color_Section( 'border-color', 'border' ),
					new Kadence_Blocks_Countdown_Sides_Css( 'borderRadius', Kadence_Blocks_Countdown_Side_Map::radius(), null ),
					new Kadence_Blocks_Countdown_Sides_Css( 'borderWidth', Kadence_Blocks_Countdown_Side_Map::border_width(), null ),
				],
				[]
			),
			$this->border_width_device( 'tablet', 'tabletBorderWidth' ),
			$this->border_width_device( 'mobile', 'mobileBorderWidth' ),
			new Kadence_Blocks_Css_Selector_Section( self::CONTAINER ),
			new Kadence_Blocks_Css_Measure_Section(
				'padding',
				'containerPadding',
				[
					'unit_key'   => 'paddingType',
					'tablet_key' => 'containerTabletPadding',
					'mobile_key' => 'containerMobilePadding',
				] 
			),
			new Kadence_Blocks_Css_Measure_Section(
				'margin',
				'containerMargin',
				[
					'unit_key'   => 'marginType',
					'tablet_key' => 'containerTabletMargin',
					'mobile_key' => 'containerMobileMargin',
				] 
			),
		];
	}

	/**
	 * The section of the border width of the container on a device.
	 *
	 * @since TBD
	 *
	 * @param string $device    The device, `tablet` or `mobile`.
	 * @param string $attribute The attribute that stores the border width.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function border_width_device( string $device, string $attribute ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Countdown_Any_Condition( [], [ $attribute ] ),
			[
				new Kadence_Blocks_Css_Device_Section(
					$device,
					[
						new Kadence_Blocks_Css_Selector_Section( self::CONTAINER ),
						new Kadence_Blocks_Countdown_Sides_Css( $attribute, Kadence_Blocks_Countdown_Side_Map::border_width(), null ),
					]
				),
			],
			[]
		);
	}

	/**
	 * The sections of the date items and the dividers between them.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function item_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Countdown_Any_Condition( [ 'itemBackground', 'itemBorder' ], [ 'itemBorderRadius', 'itemBorderWidth', 'itemPadding' ] ),
				[
					new Kadence_Blocks_Css_Selector_Section( self::ITEM ),
					new Kadence_Blocks_Css_Color_Section( 'background', 'itemBackground' ),
					new Kadence_Blocks_Css_Color_Section( 'border-color', 'itemBorder' ),
					new Kadence_Blocks_Countdown_Sides_Css( 'itemBorderRadius', Kadence_Blocks_Countdown_Side_Map::radius(), null ),
					new Kadence_Blocks_Countdown_Sides_Css( 'itemBorderWidth', Kadence_Blocks_Countdown_Side_Map::border_width(), null ),
					new Kadence_Blocks_Countdown_Sides_Css( 'itemPadding', Kadence_Blocks_Countdown_Side_Map::padding(), 'itemPaddingType' ),
					new Kadence_Blocks_Css_Selector_Section( self::DIVIDER ),
					new Kadence_Blocks_Countdown_Sides_Css( 'itemPadding', Kadence_Blocks_Countdown_Side_Map::vertical_padding(), 'itemPaddingType' ),
					new Kadence_Blocks_Countdown_Sides_Css( 'itemBorderWidth', Kadence_Blocks_Countdown_Side_Map::vertical_border_width(), null ),
				],
				[]
			),
			$this->item_device( 'tablet', 'itemTabletBorderWidth', 'itemTabletPadding', true ),
			$this->item_device( 'mobile', 'itemMobileBorderWidth', 'itemMobilePadding', false ),
		];
	}

	/**
	 * The section of the padding and the border width of the date items on a device.
	 *
	 * @since TBD
	 *
	 * @param string $device  The device, `tablet` or `mobile`.
	 * @param string $border  The attribute that stores the border width.
	 * @param string $padding The attribute that stores the padding.
	 * @param bool   $divider Whether the dividers get the padding and the border width too.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function item_device( string $device, string $border, string $padding, bool $divider ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Countdown_Any_Condition( [], [ $border, $padding ] ),
			[
				new Kadence_Blocks_Css_Device_Section(
					$device,
					array_merge(
						[
							new Kadence_Blocks_Css_Selector_Section( self::ITEM ),
							new Kadence_Blocks_Countdown_Sides_Css( $padding, Kadence_Blocks_Countdown_Side_Map::padding(), 'itemPaddingType' ),
							new Kadence_Blocks_Countdown_Sides_Css( $border, Kadence_Blocks_Countdown_Side_Map::border_width(), null ),
						],
						$divider ? $this->divider_sections( $border, $padding ) : []
					)
				),
			],
			[]
		);
	}

	/**
	 * The sections of the padding and the border width of the dividers on a device.
	 *
	 * @since TBD
	 *
	 * @param string $border  The attribute that stores the border width.
	 * @param string $padding The attribute that stores the padding.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function divider_sections( string $border, string $padding ): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::DIVIDER ),
			new Kadence_Blocks_Countdown_Sides_Css( $padding, Kadence_Blocks_Countdown_Side_Map::vertical_padding(), 'itemPaddingType' ),
			new Kadence_Blocks_Countdown_Sides_Css( $border, Kadence_Blocks_Countdown_Side_Map::vertical_border_width(), null ),
		];
	}

	/**
	 * The sections of the fonts and the colors of the numbers and the labels.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_sections(): array {
		return [
			$this->font_part( 'numberFont', 'numberColor', self::PART . ' .kb-countdown-date-item .kb-countdown-number', self::PART . ' .kb-countdown-date-item' ),
			$this->font_part( 'labelFont', 'labelColor', self::PART . ' .kb-countdown-date-item .kb-countdown-label', null ),
			$this->font_part( 'preLabelFont', 'preLabelColor', self::PART . ' .kb-countdown-item.kb-pre-timer', null ),
			$this->font_part( 'postLabelFont', 'postLabelColor', self::PART . ' .kb-countdown-item.kb-post-timer', null ),
		];
	}

	/**
	 * The section of the font and the color of one part of the countdown, on every device.
	 *
	 * @since TBD
	 *
	 * @param string      $font     The attribute that stores the font.
	 * @param string      $color    The attribute that stores the color.
	 * @param string      $selector The selector of the part.
	 * @param string|null $wrapper  The selector that gets the font size too, or null for none.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function font_part( string $font, string $color, string $selector, ?string $wrapper ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Countdown_Font_Used_Condition( $font, $color ),
			array_merge(
				[
					new Kadence_Blocks_Css_Selector_Section( $selector ),
					new Kadence_Blocks_Css_Color_Section( 'color', $color ),
				],
				$this->font_device( $font, 0, $selector, $wrapper, true ),
				[ new Kadence_Blocks_Css_Device_Section( 'tablet', $this->font_device( $font, 1, $selector, $wrapper, false ) ) ],
				[ new Kadence_Blocks_Css_Device_Section( 'mobile', $this->font_device( $font, 2, $selector, $wrapper, false ) ) ]
			),
			[]
		);
	}

	/**
	 * The sections of a font on one device. The desktop one also writes the text settings.
	 *
	 * @since TBD
	 *
	 * @param string      $font     The attribute that stores the font.
	 * @param int         $index    The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 * @param string      $selector The selector of the part.
	 * @param string|null $wrapper  The selector that gets the font size too, or null for none.
	 * @param bool        $desktop  Whether the sections are the ones of the desktop.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_device( string $font, int $index, string $selector, ?string $wrapper, bool $desktop ): array {
		$sections = $desktop ? [] : [ new Kadence_Blocks_Css_Selector_Section( $selector ) ];
		$sections = array_merge(
			$sections,
			[
				new Kadence_Blocks_Countdown_Font_Size_Css( $font, $index, null ),
				new Kadence_Blocks_Countdown_Font_Measure_Css( $font, 'lineHeight', 'lineType', 'line-height', $index ),
				new Kadence_Blocks_Countdown_Font_Measure_Css( $font, 'letterSpacing', 'letterType', 'letter-spacing', $index ),
			],
			$desktop ? $this->font_text_sections( $font ) : [],
			null === $wrapper ? [] : [ new Kadence_Blocks_Countdown_Font_Size_Css( $font, $index, $wrapper ) ]
		);

		return $sections;
	}

	/**
	 * The sections of the text transform, the family, the style and the weight of a font.
	 *
	 * @since TBD
	 *
	 * @param string $font The attribute that stores the font.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_text_sections( string $font ): array {
		return [
			new Kadence_Blocks_Countdown_Font_Value_Css( $font, 'textTransform', 'text-transform' ),
			new Kadence_Blocks_Countdown_Font_Family_Css( $font ),
			new Kadence_Blocks_Countdown_Font_Value_Css( $font, 'style', 'font-style' ),
			new Kadence_Blocks_Countdown_Font_Weight_Css( $font ),
		];
	}
}
