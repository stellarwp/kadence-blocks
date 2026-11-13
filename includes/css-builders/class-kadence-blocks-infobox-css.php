<?php
/**
 * Builds the CSS for the infobox block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/infobox/loader.php';

/**
 * Builds the CSS for the infobox block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Css {

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
			[
				'base'      => ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ? '.kt-info-box' . $unique_id : '#kt-info-box' . $unique_id,
				'title_tag' => ( new Kadence_Blocks_Infobox_Title_Tag() )->resolve( $attributes, $this->context ),
				'media'     => new Kadence_Blocks_Infobox_Media( $attributes ),
			]
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
			$this->container_sections(),
			$this->media_sections(),
			$this->title_sections(),
			$this->text_sections(),
			$this->learn_more_sections(),
			[ new Kadence_Blocks_Infobox_Shadow_Css() ]
		);
	}

	/**
	 * The sections of the sizes, the border, the background and the hover state of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return array_merge( $this->height_sections(), $this->border_sections(), $this->background_sections(), $this->hover_sections() );
	}

	/**
	 * The sections of the height and the width.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function height_sections(): array {
		return [
			new Kadence_Blocks_Infobox_Full_Height_Css(),
			new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap' ),
			new Kadence_Blocks_Infobox_Stretch_Css(),
			new Kadence_Blocks_Infobox_Selector_Css( '.wp-block-kadence-column.kb-section-dir-horizontal > .kt-inside-inner-col > {base}' ),
			new Kadence_Blocks_Infobox_Max_Width_Css( 'maxWidth', 'desktop', 0 ),
			new Kadence_Blocks_Infobox_Max_Width_Css( 'tabletMaxWidth', 'tablet', 1 ),
			new Kadence_Blocks_Infobox_Max_Width_Css( 'mobileMaxWidth', 'mobile', 2 ),
			new Kadence_Blocks_Infobox_Selector_Css( '.wp-block-kadence-column.kb-section-dir-horizontal > .kt-inside-inner-col > {base} .kt-blocks-info-box-link-wrap' ),
			new Kadence_Blocks_Css_Static_Section( 'max-width', 'unset' ),
			new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap' ),
		];
	}

	/**
	 * The sections of the border and the alignment of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function border_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'containerBorder' ], [ 'containerBorderRadius' ], [ 'containerBorderWidth' ] ),
				[
					new Kadence_Blocks_Css_Alpha_Color_Section( 'border-color', 'containerBorder', 'containerBorderOpacity' ),
					new Kadence_Blocks_Infobox_Unit_Radius_Css( 'containerBorderRadius' ),
					new Kadence_Blocks_Css_Measure_Section( 'border-width', 'containerBorderWidth' ),
				],
				[
					new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle' ),
					new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
				]
			),
			new Kadence_Blocks_Infobox_Text_Align_Css( 'hAlignTablet', 'tablet' ),
			new Kadence_Blocks_Infobox_Text_Align_Css( 'hAlignMobile', 'mobile' ),
		];
	}

	/**
	 * The sections of the background, the padding and the margin of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function background_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'containerBackground', 'maxWidth', 'tabletMaxWidth', 'mobileMaxWidth' ], [ 'containerBackgroundOpacity' ], [] ),
				[
					new Kadence_Blocks_Infobox_Container_Background_Css(),
					new Kadence_Blocks_Infobox_Max_Width_Css( 'maxWidth', 'desktop', 0 ),
					new Kadence_Blocks_Infobox_Max_Width_Css( 'tabletMaxWidth', 'tablet', 1 ),
					new Kadence_Blocks_Infobox_Max_Width_Css( 'mobileMaxWidth', 'mobile', 2 ),
				],
				[]
			),
			new Kadence_Blocks_Css_Measure_Section(
				'padding',
				'containerPadding',
				[
					'tablet_key' => 'containerTabletPadding',
					'mobile_key' => 'containerMobilePadding',
				] 
			),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'containerMargin', [ 'unit_key' => 'containerMarginUnit' ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'maxWidthUnit', '%' ),
				[ new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-media-align-top .kt-blocks-info-box-media-container' ), new Kadence_Blocks_Css_Static_Section( 'max-width', '100%' ) ],
				[]
			),
		];
	}

	/**
	 * The sections of the hover state of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function hover_sections(): array {
		return [
			new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap:hover' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'containerHoverBorder' ], [], [] ),
				[ new Kadence_Blocks_Css_Alpha_Color_Section( 'border-color', 'containerHoverBorder', 'containerHoverBorderOpacity' ) ],
				[
					new Kadence_Blocks_Css_Border_Styles_Section( 'borderHoverStyle' ),
					new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderHoverRadius', [ 'unit_key' => 'borderHoverRadiusUnit' ] ),
				]
			),
			new Kadence_Blocks_Css_Alpha_Color_Section( 'background', 'containerHoverBackground', 'containerHoverBackgroundOpacity' ),
		];
	}

	/**
	 * The sections of the media: the image, the icon, the number and the box around them.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function media_sections(): array {
		return array_merge( $this->image_sections(), $this->icon_sections(), $this->box_sections() );
	}

	/**
	 * The sections of the image.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function image_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'mediaType', 'image' ),
				[
					new Kadence_Blocks_Infobox_Selector_Css( '{base}.wp-block-kadence-infobox' ),
					new Kadence_Blocks_Css_Static_Section( 'max-width', '100%' ),
					new Kadence_Blocks_Css_Scoped_Section( 'mediaImage', [ new Kadence_Blocks_Infobox_Image_Max_Width_Css() ] ),
					new Kadence_Blocks_Infobox_Selector_Css( '{base} .kadence-info-box-image-inner-intrisic-container .kadence-info-box-image-intrisic' ),
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Infobox_Ratio_Condition(),
						[ new Kadence_Blocks_Infobox_Ratio_Css() ],
						[ new Kadence_Blocks_Css_Scoped_Section( 'mediaImage', [ new Kadence_Blocks_Infobox_Dimension_Ratio_Css() ] ) ]
					),
					new Kadence_Blocks_Css_Scoped_Section( 'mediaImage', [ new Kadence_Blocks_Infobox_Image_Size_Css() ] ),
					new Kadence_Blocks_Css_Static_Section( 'max-width', '100%' ),
				],
				[]
			),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Infobox_Svg_Condition(), [ new Kadence_Blocks_Infobox_Svg_Css() ], [] ),
		];
	}

	/**
	 * The sections of the size of the icon and the font of the number.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_sections(): array {
		return [
			new Kadence_Blocks_Infobox_Icon_Size_Css( 'size', 'desktop', false ),
			new Kadence_Blocks_Infobox_Icon_Size_Css( 'tabletSize', 'tablet', true ),
			new Kadence_Blocks_Infobox_Icon_Size_Css( 'mobileSize', 'mobile', true ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Infobox_Number_Condition(),
				[
					new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-number' ),
					new Kadence_Blocks_Css_Scoped_Section( 'mediaNumber', [ new Kadence_Blocks_Infobox_Font_Family_Css(), new Kadence_Blocks_Css_Value_Section( 'font-style', 'style' ), new Kadence_Blocks_Infobox_Font_Weight_Css() ] ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the box around the media, and of its hover state.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function box_sections(): array {
		$margin = new Kadence_Blocks_Css_Side_List_Section( 'margin', 'margin-%s', 'marginUnit', false );

		return [
			new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-media' ),
			new Kadence_Blocks_Css_Scoped_Section( 'mediaIcon', [ new Kadence_Blocks_Css_Color_Section( 'color', 'color' ) ] ),
			new Kadence_Blocks_Css_Scoped_Section(
				'mediaStyle',
				[
					new Kadence_Blocks_Css_Color_Section( 'background', 'background' ),
					new Kadence_Blocks_Css_Color_Section( 'border-color', 'border' ),
					new Kadence_Blocks_Infobox_Media_Radius_Css(),
					new Kadence_Blocks_Css_Side_List_Section( 'borderWidth', 'border-%s-width', 'borderWidthUnit', false ),
					new Kadence_Blocks_Css_Side_List_Section( 'padding', 'padding-%s', 'paddingUnit', false ),
				]
			),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Infobox_Margin_Placement( false ), [ new Kadence_Blocks_Css_Scoped_Section( 'mediaStyle', [ $margin ] ) ], [] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Infobox_Margin_Placement( true ),
				[ new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-media-container' ), new Kadence_Blocks_Css_Scoped_Section( 'mediaStyle', [ $margin ] ) ],
				[]
			),
			new Kadence_Blocks_Infobox_Image_Radius_Css(),
			new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media' ),
			new Kadence_Blocks_Css_Scoped_Section( 'mediaIcon', [ new Kadence_Blocks_Css_Color_Section( 'color', 'hoverColor' ) ] ),
			new Kadence_Blocks_Css_Scoped_Section(
				'mediaStyle',
				[ new Kadence_Blocks_Css_Color_Section( 'background', 'hoverBackground' ), new Kadence_Blocks_Css_Color_Section( 'border-color', 'hoverBorder' ) ]
			),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Infobox_Draw_Border_Condition(), [ new Kadence_Blocks_Infobox_Draw_Border_Css() ], [] ),
		];
	}

	/**
	 * The sections of the title.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function title_sections(): array {
		$selector = '{base} .kt-infobox-textcontent {tag}.kt-blocks-info-box-title';

		return [
			new Kadence_Blocks_Css_Gate_Section(
				[ 'titleColor', 'titleFont' ],
				[
					new Kadence_Blocks_Infobox_Selector_Css( $selector ),
					new Kadence_Blocks_Css_Color_Section( 'color', 'titleColor' ),
					new Kadence_Blocks_Css_Scoped_Section( 'titleFont', array_merge( $this->font_sections(), [ new Kadence_Blocks_Infobox_Numeric_Sides_Css( 'padding' ), new Kadence_Blocks_Infobox_Numeric_Sides_Css( 'margin' ) ] ) ),
				]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'titleHoverColor' ], [], [] ),
				[ new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap:hover {tag}.kt-blocks-info-box-title' ), new Kadence_Blocks_Css_Color_Section( 'color', 'titleHoverColor' ) ],
				[]
			),
			new Kadence_Blocks_Infobox_Font_Device_Css( 'titleFont', $selector, 'tablet', 1 ),
			new Kadence_Blocks_Infobox_Font_Device_Css( 'titleFont', $selector, 'mobile', 2 ),
			new Kadence_Blocks_Infobox_Min_Height_Css( 'titleMinHeight', 'titleMinHeightUnit', '{base} {tag}.kt-blocks-info-box-title' ),
			new Kadence_Blocks_Infobox_Media_Align_Tablet_Css(),
			new Kadence_Blocks_Infobox_Media_Align_Mobile_Css(),
		];
	}

	/**
	 * The sections of the text.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function text_sections(): array {
		$selector = '.wp-block-kadence-infobox{base} .kt-blocks-info-box-text';

		return [
			new Kadence_Blocks_Css_Gate_Section(
				[ 'textColor', 'textFont', 'textSpacing' ],
				[
					new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-infobox-textcontent .kt-blocks-info-box-text' ),
					new Kadence_Blocks_Css_Color_Section( 'color', 'textColor' ),
					new Kadence_Blocks_Infobox_Selector_Css( $selector ),
					new Kadence_Blocks_Css_Scoped_Section( 'textFont', $this->font_sections() ),
					new Kadence_Blocks_Css_Scoped_Section( 'textSpacing', [ new Kadence_Blocks_Infobox_Numeric_Sides_Css( 'padding' ), new Kadence_Blocks_Infobox_Numeric_Sides_Css( 'margin' ) ] ),
				]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'textHoverColor' ], [], [] ),
				[ new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text' ), new Kadence_Blocks_Css_Color_Section( 'color', 'textHoverColor' ) ],
				[]
			),
			new Kadence_Blocks_Infobox_Font_Device_Css( 'textFont', $selector, 'tablet', 1 ),
			new Kadence_Blocks_Infobox_Font_Device_Css( 'textFont', $selector, 'mobile', 2 ),
			new Kadence_Blocks_Infobox_Min_Height_Css( 'textMinHeight', 'textMinHeightUnit', '{base} .kt-blocks-info-box-text' ),
		];
	}

	/**
	 * The sections of the learn more link.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function learn_more_sections(): array {
		$selector = '{base} .kt-blocks-info-box-learnmore';

		return [
			new Kadence_Blocks_Css_Scoped_Section(
				'learnMoreStyles',
				array_merge(
					[
						new Kadence_Blocks_Infobox_Selector_Css( $selector ),
						new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
						new Kadence_Blocks_Css_Color_Section( 'background', 'background' ),
						new Kadence_Blocks_Css_Color_Section( 'border-color', 'border' ),
						new Kadence_Blocks_Infobox_Unit_Radius_Css( 'borderRadius' ),
					],
					$this->font_sections(),
					[
						new Kadence_Blocks_Infobox_Learn_More_Border_Css(),
						new Kadence_Blocks_Css_Side_List_Section( 'padding', 'padding-%s', 'paddingUnit', true ),
						new Kadence_Blocks_Css_Side_List_Section( 'margin', 'margin-%s', 'marginUnit', true ),
						new Kadence_Blocks_Css_Gate_Section(
							[ 'colorHover', 'borderHover' ],
							[
								new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore,{base} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-learnmore:focus' ),
								new Kadence_Blocks_Css_Color_Section( 'color', 'colorHover' ),
								new Kadence_Blocks_Css_Color_Section( 'background', 'backgroundHover' ),
								new Kadence_Blocks_Css_Color_Section( 'border-color', 'borderHover' ),
							]
						),
					]
				)
			),
			new Kadence_Blocks_Infobox_Font_Device_Css( 'learnMoreStyles', $selector, 'tablet', 1 ),
			new Kadence_Blocks_Infobox_Font_Device_Css( 'learnMoreStyles', $selector, 'mobile', 2 ),
		];
	}

	/**
	 * The sections of one font: the size, the spacing, the transform, the family, the style and the weight.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_sections(): array {
		return [
			new Kadence_Blocks_Infobox_Font_Size_Css(),
			new Kadence_Blocks_Infobox_Letter_Spacing_Css(),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'textTransform' ),
			new Kadence_Blocks_Infobox_Font_Family_Css(),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'style' ),
			new Kadence_Blocks_Infobox_Font_Weight_Css(),
		];
	}
}
