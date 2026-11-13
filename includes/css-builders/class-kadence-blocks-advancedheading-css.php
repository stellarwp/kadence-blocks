<?php
/**
 * Builds the CSS for the advancedheading block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/advancedheading/loader.php';

/**
 * Builds the CSS for the advancedheading block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Css {

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
			$this->box_sections(),
			$this->text_sections(),
			$this->color_sections(),
			$this->effect_sections(),
			$this->device_sections(),
			$this->icon_sections(),
			$this->mark_sections(),
			$this->image_sections(),
			$this->link_sections()
		);
	}

	/**
	 * The sections of the display, the margins, the width and the padding.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function box_sections(): array {
		return [
			$this->selector( '{root}, {root}{data}' ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Strict_Condition( 'htmlTag', 'span' ), [ new Kadence_Blocks_Css_Static_Section( 'display', 'block' ) ], [] ),
			new Kadence_Blocks_Advancedheading_Top_Margin_Css(),
			new Kadence_Blocks_Advancedheading_Margin_Side_Css( 'margin-right', 'rightMargin' ),
			new Kadence_Blocks_Advancedheading_Margin_Side_Css( 'margin-bottom', 'bottomMargin' ),
			new Kadence_Blocks_Advancedheading_Margin_Side_Css( 'margin-left', 'leftMargin' ),
			new Kadence_Blocks_Advancedheading_Range_Css( 'maxWidth', 'max-width' ),
			new Kadence_Blocks_Advancedheading_Max_Width_Align_Css(),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
		];
	}

	/**
	 * The sections of the alignment and the font of the desktop.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function text_sections(): array {
		return [
			new Kadence_Blocks_Css_Value_Section( 'text-align', 'align' ),
			new Kadence_Blocks_Advancedheading_Font_Size_Css( 'size', 'fontSize', 0, 'sizeType' ),
			new Kadence_Blocks_Advancedheading_Line_Height_Css( 'lineHeight', 0 ),
			new Kadence_Blocks_Advancedheading_Font_Weight_Css( 'fontWeight' ),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'fontStyle' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'typography' ], [], [] ),
				[ new Kadence_Blocks_Advancedheading_Font_Family_Css( 'typography', 'googleFont', 'loadGoogleFont', 'fontVariant' ) ],
				[ new Kadence_Blocks_Advancedheading_Preset_Typography_Css() ]
			),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'textTransform' ),
			new Kadence_Blocks_Advancedheading_Letter_Spacing_Css(),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Advancedheading_Device_Letter_Spacing_Css( 'tabletLetterSpacing' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Advancedheading_Device_Letter_Spacing_Css( 'mobileLetterSpacing' ) ] ),
		];
	}

	/**
	 * The sections of the color, the text gradient and the background.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function color_sections(): array {
		return [
			new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'color', 'color', 'colorClass', 'enableTextGradient' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedheading_Text_Gradient_Condition(),
				[
					$this->selector( '{root}, {root}{data} .kb-adv-text-inner' ),
					new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'background-image', 'textGradient', true ),
					new Kadence_Blocks_Css_Static_Section( 'background-clip', 'text' ),
					new Kadence_Blocks_Css_Static_Section( '-webkit-box-decoration-break', 'clone' ),
					new Kadence_Blocks_Css_Static_Section( 'box-decoration-break', 'clone' ),
					new Kadence_Blocks_Css_Static_Section( '-webkit-background-clip', 'text' ),
					new Kadence_Blocks_Css_Static_Section( '-webkit-text-fill-color', 'transparent' ),
					$this->selector( '{root}, {root}{data}' ),
				],
				[]
			),
			new Kadence_Blocks_Advancedheading_Themed_Color_Css( 'background-color', 'background', 'backgroundColorClass', 'enableTextGradient' ),
		];
	}

	/**
	 * The sections of the text shadow and the text orientation.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function effect_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Advancedheading_Text_Shadow_Condition(), [ new Kadence_Blocks_Advancedheading_Text_Shadow_Css() ], [] ),
			new Kadence_Blocks_Advancedheading_Orientation_Css( 'textOrientation', null, 0 ),
			new Kadence_Blocks_Advancedheading_Orientation_Css( 'tabletTextOrientation', 'tablet', 1 ),
			new Kadence_Blocks_Advancedheading_Orientation_Css( 'mobileTextOrientation', 'mobile', 2 ),
		];
	}

	/**
	 * The sections of the font of the tablet and the mobile, and of the border of every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function device_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section( 'tablet', $this->device_font_sections( 'tabSize', 'tabLineHeight', 'tabletAlign', 1 ) ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', $this->device_font_sections( 'mobileSize', 'mobileLineHeight', 'mobileAlign', 2 ) ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle', true, [ 'transparent_color' => true ] ),
			new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'borderRadius', 'borderRadiusUnit' ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'tabletBorderRadius', 'borderRadiusUnit' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'mobileBorderRadius', 'borderRadiusUnit' ) ] ),
		];
	}

	/**
	 * The sections of the size, the line height and the alignment of a device.
	 *
	 * @since TBD
	 *
	 * @param string $size   The attribute that stores the old size.
	 * @param string $height The attribute that stores the old line height.
	 * @param string $align  The attribute that stores the alignment.
	 * @param int    $index  The position of the device.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function device_font_sections( $size, $height, $align, $index ): array {
		return [
			new Kadence_Blocks_Advancedheading_Font_Size_Css( $size, 'fontSize', $index, 'sizeType' ),
			new Kadence_Blocks_Advancedheading_Line_Height_Css( $height, $index ),
			new Kadence_Blocks_Advancedheading_Align_Important_Css( $align ),
		];
	}

	/**
	 * The sections of the icon.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section(
				'icon',
				[
					$this->selector( '{root}{data}' ),
					new Kadence_Blocks_Css_Static_Section( 'display', 'flex' ),
					new Kadence_Blocks_Css_Static_Section( 'gap', '0.25em' ),
					new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'justify-content', 'align', false ),
					new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'justify-content', 'tabletAlign', true ) ] ),
					new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'justify-content', 'mobileAlign', true ) ] ),
					new Kadence_Blocks_Advancedheading_Icon_Align_Items_Css(),
					$this->selector( '{root}{data} .kb-adv-heading-icon svg' ),
					new Kadence_Blocks_Css_Static_Section( 'width', '1em' ),
					new Kadence_Blocks_Css_Static_Section( 'height', '1em' ),
					$this->selector( '{root}{data} .kb-adv-heading-icon' ),
					new Kadence_Blocks_Advancedheading_Color_Output_Css( 'iconColor', 'color' ),
					new Kadence_Blocks_Advancedheading_Range_Css( 'iconSize', 'font-size', 'iconSizeUnit' ),
					new Kadence_Blocks_Css_Measure_Section( 'padding', 'iconPadding', [ 'unit_key' => 'iconPaddingUnit' ] ),
					new Kadence_Blocks_Advancedheading_Icon_Line_Height_Css(),
					new Kadence_Blocks_Css_Enabled_Section(
						'iconColorHover',
						[ $this->selector( '{root}{data}:hover .kb-adv-heading-icon' ), new Kadence_Blocks_Advancedheading_Color_Output_Css( 'iconColorHover', 'color' ) ]
					),
				]
			),
		];
	}

	/**
	 * The sections of the highlight, on every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function mark_sections(): array {
		return array_merge(
			[ $this->selector( '{root} mark.kt-highlight, {root}{data} mark.kt-highlight' ) ],
			$this->mark_font_sections(),
			$this->mark_color_sections(),
			$this->mark_border_sections(),
			[
				$this->selector( '{root} mark.kt-highlight, {root}{data} mark.kt-highlight' ),
				new Kadence_Blocks_Css_Device_Section( 'tablet', $this->mark_device_sections( 1 ) ),
				new Kadence_Blocks_Css_Device_Section( 'mobile', $this->mark_device_sections( 2 ) ),
			]
		);
	}

	/**
	 * The sections of the size and the font of the highlight.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function mark_font_sections(): array {
		return [
			new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'letter-spacing', 'markLetterSpacing', null, 'markLetterSpacingType', 'px' ),
			new Kadence_Blocks_Advancedheading_Font_Size_Css( null, 'markSize', 0, 'markSizeType' ),
			new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'line-height', 'markLineHeight', 0, 'markLineType', 'px' ),
			new Kadence_Blocks_Advancedheading_Font_Family_Css( 'markTypography', 'markGoogleFont', 'markLoadGoogleFont', 'markFontVariant' ),
			new Kadence_Blocks_Advancedheading_Font_Weight_Css( 'markFontWeight' ),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'markFontStyle' ),
		];
	}

	/**
	 * The sections of the color, the gradients and the background of the highlight.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function mark_color_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedheading_Text_Gradient_Condition(),
				[
					new Kadence_Blocks_Css_Static_Section( '-webkit-text-fill-color', 'initial !important' ),
					new Kadence_Blocks_Css_Static_Section( '-webkit-background-clip', 'initial !important' ),
					new Kadence_Blocks_Css_Static_Section( 'background-clip', 'initial !important' ),
				],
				[]
			),
			new Kadence_Blocks_Advancedheading_Mark_Color_Css(),
			new Kadence_Blocks_Css_Enabled_Section(
				'enableMarkBackgroundGradient',
				[ new Kadence_Blocks_Advancedheading_Attribute_Property_Css( 'background-image', 'markBackgroundGradient', true ) ]
			),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'markTextTransform' ),
			new Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity', [ 'enableMarkGradient', 'enableMarkBackgroundGradient' ] ),
		];
	}

	/**
	 * The sections of the border, the radius and the padding of the highlight.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function mark_border_sections(): array {
		return [
			new Kadence_Blocks_Advancedheading_Filled_Alpha_Color_Css( 'border-color', 'markBorder', 'markBorderOpacity', [] ),
			new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'border-width', 'markBorderWidth', null, null, 'px' ),
			new Kadence_Blocks_Advancedheading_Mark_Border_Style_Css(),
			new Kadence_Blocks_Css_Border_Styles_Section( 'markBorderStyles' ),
			new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'markBorderRadius', 'markBorderRadiusUnit' ),
			new Kadence_Blocks_Css_Static_Section( '-webkit-box-decoration-break', 'clone' ),
			new Kadence_Blocks_Css_Static_Section( 'box-decoration-break', 'clone' ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'tabletMarkBorderRadius', 'markBorderRadiusUnit' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'mobileMarkBorderRadius', 'markBorderRadiusUnit' ) ] ),
			new Kadence_Blocks_Css_Measure_Section(
				'padding',
				'markPadding',
				[
					'desktop_key' => 'markPadding',
					'tablet_key'  => 'markTabPadding',
					'mobile_key'  => 'markMobilePadding',
				]
			),
		];
	}

	/**
	 * The sections of the size and the line height of the highlight on a device.
	 *
	 * @since TBD
	 *
	 * @param int $index The position of the device.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function mark_device_sections( $index ): array {
		return [
			new Kadence_Blocks_Advancedheading_Font_Size_Css( null, 'markSize', $index, 'markSizeType' ),
			new Kadence_Blocks_Advancedheading_Unit_Value_Css( 'line-height', 'markLineHeight', $index, 'markLineType', 'px' ),
		];
	}

	/**
	 * The sections of the inline image.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function image_sections(): array {
		return [
			$this->selector( '{root} img.kb-inline-image, {root}{data} img.kb-inline-image' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedheading_Inline_Width_Condition(),
				[ new Kadence_Blocks_Css_Static_Section( 'width', '150px' ), new Kadence_Blocks_Css_Static_Section( 'display', 'inline-block' ) ],
				[]
			),
			new Kadence_Blocks_Advancedheading_Range_Css( 'inlineImageWidth', 'width' ),
			new Kadence_Blocks_Css_Value_Section( 'vertical-align', 'inlineImageVerticalAlign' ),
			new Kadence_Blocks_Advancedheading_Aspect_Ratio_Css(),
			new Kadence_Blocks_Css_Border_Styles_Section( 'inlineImageBorderStyles' ),
			new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'inlineImageBorderRadius', 'inlineImageBorderRadiusUnit' ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'tabletInlineImageBorderRadius', 'inlineImageBorderRadiusUnit' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Advancedheading_Border_Radius_Css( 'mobileInlineImageBorderRadius', 'inlineImageBorderRadiusUnit' ) ] ),
		];
	}

	/**
	 * The sections of the link.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function link_sections(): array {
		$hover = '{root}{data} a:hover, a.kb-advanced-heading-link.kt-adv-heading-link{id}:hover';

		return [
			new Kadence_Blocks_Css_Enabled_Section(
				'linkColor',
				[
					$this->selector( '{root}{data} a, .kt-adv-heading-link{id}, .kt-adv-heading-link{id} .kt-adv-heading{id}{data}' ),
					new Kadence_Blocks_Css_Color_Section( 'color', 'linkColor' ),
				]
			),
			new Kadence_Blocks_Css_Enabled_Section(
				'linkHoverColor',
				[
					$this->selector( '{root}{data} a:hover, .kt-adv-heading-link{id}:hover, .kt-adv-heading-link{id}:hover .kt-adv-heading{id}{data}' ),
					new Kadence_Blocks_Advancedheading_Render_Color_Css( 'color', 'linkHoverColor' ),
				]
			),
			new Kadence_Blocks_Css_Enabled_Section(
				'linkStyle',
				[
					$this->selector( '{root}{data} a, a.kb-advanced-heading-link.kt-adv-heading-link{id}' ),
					new Kadence_Blocks_Css_Typed_Section(
						'linkStyle',
						[
							'none'            => [ new Kadence_Blocks_Css_Static_Section( 'text-decoration', 'none' ) ],
							'underline'       => [ new Kadence_Blocks_Css_Static_Section( 'text-decoration', 'underline' ), $this->selector( $hover ), new Kadence_Blocks_Css_Static_Section( 'text-decoration', 'underline' ) ],
							'hover_underline' => [ new Kadence_Blocks_Css_Static_Section( 'text-decoration', 'none' ), $this->selector( $hover ), new Kadence_Blocks_Css_Static_Section( 'text-decoration', 'underline' ) ],
						]
					),
				]
			),
		];
	}

	/**
	 * A section that sets the selector.
	 *
	 * @since TBD
	 *
	 * @param string $templates The selector. `{root}`, `{data}` and `{id}` stand for parts of the block selector.
	 *
	 * @return Kadence_Blocks_Advancedheading_Selector_Css
	 */
	private function selector( $templates ) {
		return new Kadence_Blocks_Advancedheading_Selector_Css( $templates );
	}
}
