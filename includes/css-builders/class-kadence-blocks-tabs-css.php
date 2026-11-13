<?php
/**
 * Builds the CSS for the tabs block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/tabs/loader.php';

/**
 * Builds the CSS for the tabs block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Css {

	/**
	 * The selector of the tab titles.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TITLE = '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li .kt-tab-title, .wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title';

	/**
	 * The selector of the tab titles on hover.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TITLE_HOVER = '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li .kt-tab-title:hover, .wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title:hover';

	/**
	 * The selector of the active tab title.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TITLE_ACTIVE = '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li.kt-tab-title-active .kt-tab-title, .wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tab-title-active .kt-tab-title';

	/**
	 * The selector of the subtitles on hover.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SUBTITLE_HOVER = '.kt-tabs-id{id} > .kt-tabs-title-list li .kt-tab-title:hover .kt-title-sub-text, .kt-tabs-id{id} > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title:hover .kt-title-sub-text';

	/**
	 * The selector of the active subtitle.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SUBTITLE_ACTIVE = '.kt-tabs-id{id} > .kt-tabs-title-list li.kt-tab-title-active .kt-title-sub-text, .kt-tabs-id{id} > .kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tab-title-active .kt-title-sub-text';

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
		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context,
			array_merge( Kadence_Blocks_Tabs_Layouts::resolve( $attributes ), [ 'gap' => Kadence_Blocks_Tabs_Gap::resolve( $attributes ) ] )
		);

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
			$this->font_sections(),
			$this->content_sections(),
			$this->title_margin_sections(),
			$this->vertical_sections(),
			$this->percent_sections(),
			$this->title_sections(),
			$this->state_sections(),
			$this->device_font_sections(),
			$this->subtitle_sections(),
			$this->size_sections()
		);
	}

	/**
	 * The sections that load the Google fonts.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_sections(): array {
		return [
			new Kadence_Blocks_Tabs_Google_Font_Css(),
			new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', [ new Kadence_Blocks_Tabs_Subtitle_Google_Font_Css() ] ),
		];
	}

	/**
	 * The sections of the border, the padding, the height and the background of the content.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function content_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kt-tabs-id{id} > .kt-tabs-content-wrap > .wp-block-kadence-tab' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Tabs_Content_Border_Condition(),
				[
					new Kadence_Blocks_Css_Measure_Section(
						'border-width',
						'contentBorder',
						[
							'tablet_key' => false,
							'mobile_key' => false,
						] 
					),
					new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'border-color', 'contentBorderColor' ),
				],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'contentBorderStyles' ) ]
			),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'contentBorderRadius' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'innerPadding' ),
			new Kadence_Blocks_Css_Enabled_Section(
				'minHeight',
				[ new Kadence_Blocks_Tabs_Responsive_Range_Css( 'min-height', 'minHeight', [ 'minHeight', 'tabletMinHeight', 'mobileMinHeight' ], [ '', '', '' ], 'px' ) ]
			),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'background', 'contentBgColor' ),
		];
	}

	/**
	 * The sections of the margin of the tab titles that sit in a list.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function title_margin_sections(): array {
		$row = new Kadence_Blocks_Tabs_Row_Layout_Condition();

		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Tabs_Title_Margin_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li' ),
					new Kadence_Blocks_Css_Measure_Section( 'margin', 'titleMargin', [ 'unit_key' => 'titleMarginUnit' ] ),
					new Kadence_Blocks_Css_Choice_Section(
						$row,
						[
							new Kadence_Blocks_Css_Choice_Section(
								new Kadence_Blocks_Css_Strict_Condition( 'widthType', 'percent' ),
								[ new Kadence_Blocks_Css_Static_Section( 'margin-right', '0px' ), new Kadence_Blocks_Css_Static_Section( 'margin-left', '0px' ) ],
								[]
							),
						],
						[]
					),
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li:last-child' ),
					new Kadence_Blocks_Css_Choice_Section( $row, [ new Kadence_Blocks_Css_Static_Section( 'margin-right', '0px' ) ], [] ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the vertical tabs, on every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function vertical_sections(): array {
		$sections = [];

		foreach ( [ 'desktopOnly', 'tabletOnly', 'mobile' ] as $index => $device ) {
			$layout = [ 'layout', 'tablet_layout', 'mobile_layout' ][ $index ];

			$sections[] = new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Tabs_Vertical_Layout_Condition( $layout, $index ),
				[ new Kadence_Blocks_Css_Device_Section( $device, Kadence_Blocks_Tabs_Vertical::sections( $index ) ) ],
				[]
			);
		}

		return $sections;
	}

	/**
	 * The sections of the tab titles that share the width of the tabs.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function percent_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Tabs_Percent_Width_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list' ),
					new Kadence_Blocks_Tabs_Gap_List_Css(),
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li .kt-tab-title' ),
					new Kadence_Blocks_Tabs_Gap_Title_Css(),
					new Kadence_Blocks_Tabs_Column_Width_Css( 1, 'tablet' ),
					new Kadence_Blocks_Tabs_Gutter_Css( 1, 'tablet' ),
					new Kadence_Blocks_Tabs_Column_Width_Css( 2, 'mobile' ),
					new Kadence_Blocks_Tabs_Gutter_Css( 2, 'mobile' ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the font, the border, the padding and the colors of the tab titles.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function title_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::TITLE ),
			new Kadence_Blocks_Css_Enabled_Section( 'size', [ new Kadence_Blocks_Tabs_Font_Size_Css( 'size' ) ] ),
			new Kadence_Blocks_Tabs_Unit_Value_Css( 'line-height', 'lineHeight', 'px', 'lineType' ),
			new Kadence_Blocks_Tabs_Unit_Value_Css( 'letter-spacing', 'letterSpacing', 'px', null ),
			new Kadence_Blocks_Css_Value_Section( 'font-family', 'typography' ),
			new Kadence_Blocks_Css_Value_Section( 'font-weight', 'fontWeight' ),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'fontStyle' ),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'textTransform' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-width', 'titleBorderWidth', [ 'unit_key' => 'titleBorderWidthUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'titleBorderRadius', [ 'unit_key' => 'titleBorderRadiusUnit' ] ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'titlePadding', [ 'unit_key' => 'titlePaddingUnit' ] ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'border-color', 'titleBorder' ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'titleColor' ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'background', 'titleBg' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Tabs_Title_Margin_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-tab-title' ),
					new Kadence_Blocks_Css_Measure_Section( 'margin', 'titleMargin', [ 'unit_key' => 'titleMarginUnit' ] ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the colors of the titles and the subtitles on hover and when active.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function state_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::TITLE_HOVER ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'border-color', 'titleBorderHover' ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'titleColorHover' ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'background', 'titleBgHover' ),
			new Kadence_Blocks_Css_Selector_Section( self::TITLE_ACTIVE ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'border-color', 'titleBorderActive' ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'titleColorActive' ),
			new Kadence_Blocks_Tabs_Active_Background_Css(),
			new Kadence_Blocks_Css_Selector_Section( Kadence_Blocks_Tabs_Subtitle::selector() ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'subtitleColor' ),
			new Kadence_Blocks_Css_Selector_Section( self::SUBTITLE_HOVER ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'subtitleColorHover' ),
			new Kadence_Blocks_Css_Selector_Section( self::SUBTITLE_ACTIVE ),
			new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'subtitleColorActive' ),
		];
	}

	/**
	 * The sections of the font size and the line height of the tab titles on tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function device_font_sections(): array {
		$sections = [];

		foreach ( [
			'tablet' => [ 'tabSize', 'tabLineHeight' ],
			'mobile' => [ 'mobileSize', 'mobileLineHeight' ],
		] as $device => $attributes ) {
			$sections[] = new Kadence_Blocks_Css_Gate_Section(
				$attributes,
				[
					new Kadence_Blocks_Css_Device_Section(
						$device,
						[
							new Kadence_Blocks_Css_Selector_Section( self::TITLE ),
							new Kadence_Blocks_Tabs_Font_Size_Css( $attributes[0] ),
							new Kadence_Blocks_Tabs_Line_Height_Css( $attributes[1] ),
						]
					),
				]
			);
		}

		return $sections;
	}

	/**
	 * The sections of the font of the subtitles, on every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function subtitle_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section( 'enableSubtitle', [ new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::sections() ) ] ),
			new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::device_sections( 1, 'tablet' ) ),
			new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::device_sections( 2, 'mobile' ) ),
		];
	}

	/**
	 * The sections of the maximum width of the tabs and the size of the icons.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function size_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id}' ),
			new Kadence_Blocks_Tabs_Responsive_Range_Css( 'max-width', 'maxWidth', [ 'maxWidth', 'tabletMaxWidth', 'mobileMaxWidth' ], [ '', '', '' ], 'px' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Tabs_Icon_Condition(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-tabs .kt-tabs-id{id} > .kt-tabs-title-list li svg' ),
					new Kadence_Blocks_Tabs_Responsive_Range_Css( 'font-size', 'size', [ 'iSize', 'tabletISize', 'mobileISize' ], [ '', '14', '' ], '' ),
				],
				[]
			),
		];
	}
}
