<?php
/**
 * Builds the CSS for the testimonials block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/testimonials/loader.php';

/**
 * Builds the CSS for the testimonials block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Css {

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
				'style'        => ! empty( $attributes['style'] ) ? $attributes['style'] : 'basic',
				'padding_unit' => ! empty( $attributes['wrapperPaddingType'] ) ? $attributes['wrapperPaddingType'] : 'px',
				'margin_unit'  => ! empty( $attributes['wrapperMarginUnit'] ) ? $attributes['wrapperMarginUnit'] : 'px',
				'carousel'     => new Kadence_Blocks_Testimonials_Carousel_Layout( $attributes ),
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
			[ new Kadence_Blocks_Testimonials_Google_Fonts_Css(), new Kadence_Blocks_Testimonials_Carousel_Assets_Css() ],
			$this->icon_sections(),
			$this->wrapper_sections(),
			$this->gap_sections(),
			$this->bubble_sections(),
			$this->container_sections(),
			$this->font_sections( $this->title_font() ),
			$this->font_sections( $this->content_font() ),
			$this->font_sections( $this->name_font() ),
			$this->font_sections( $this->occupation_font() ),
			$this->item_sections(),
			$this->media_sections(),
			$this->rating_sections(),
			$this->display_icon_sections()
		);
	}

	/**
	 * A selector inside the block.
	 *
	 * @since TBD
	 *
	 * @param string $suffix What follows the block in the selector.
	 *
	 * @return Kadence_Blocks_Css_Selector_Section
	 */
	private function selector( string $suffix ): Kadence_Blocks_Css_Selector_Section {
		return new Kadence_Blocks_Css_Selector_Section( '.kt-blocks-testimonials-wrap{id}' . $suffix );
	}

	/**
	 * A condition on the style of the block.
	 *
	 * @since TBD
	 *
	 * @param string[] $styles The styles.
	 * @param bool     $strict Whether the styles are compared strictly.
	 *
	 * @return Kadence_Blocks_Testimonials_Style_Condition
	 */
	private function style( array $styles, bool $strict = true ): Kadence_Blocks_Testimonials_Style_Condition {
		return new Kadence_Blocks_Testimonials_Style_Condition( $styles, $strict );
	}

	/**
	 * A section that runs when the layout is a carousel.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Section[] $sections The sections to run.
	 *
	 * @return Kadence_Blocks_Css_Choice_Section
	 */
	private function when_carousel( array $sections ): Kadence_Blocks_Css_Choice_Section {
		return new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Css_Strict_Condition( 'layout', 'carousel' ), $sections, [] );
	}

	/**
	 * A section that runs when the style is one of a list.
	 *
	 * @since TBD
	 *
	 * @param string[]                     $styles   The styles.
	 * @param Kadence_Blocks_Css_Section[] $sections The sections to run.
	 *
	 * @return Kadence_Blocks_Css_Choice_Section
	 */
	private function when_style( array $styles, array $sections ): Kadence_Blocks_Css_Choice_Section {
		return new Kadence_Blocks_Css_Choice_Section( $this->style( $styles ), $sections, [] );
	}

	/**
	 * A setting saved in the first item of an attribute, or else a separate attribute.
	 *
	 * @since TBD
	 *
	 * @param string $container   The attribute that stores the settings.
	 * @param string $key      The key of the setting, and the CSS property.
	 * @param string $fallback The separate attribute used when the settings have none.
	 * @param string $renderer The range renderer of the settings.
	 * @param bool   $guarded  Whether settings without the key count as empty.
	 *
	 * @return Kadence_Blocks_Css_Choice_Section
	 */
	private function nested_or_separate( string $container, string $key, string $fallback, string $renderer, bool $guarded = false ): Kadence_Blocks_Css_Choice_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Testimonials_Nested_Filled_Condition( $container, $key, $guarded ),
			[ new Kadence_Blocks_Css_Scoped_Section( $container, [ new Kadence_Blocks_Testimonials_Range_Css( $renderer, $key, $key ) ] ) ],
			[ new Kadence_Blocks_Css_Measure_Section( $key, $fallback ) ]
		);
	}

	/**
	 * The sections of the main icon, the icon of every testimonial and the rating icons.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function icon_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Testimonials_Array_Item_Condition( 'iconStyles' ), $this->main_icon_sections(), [] ),
			new Kadence_Blocks_Testimonials_Item_Icons_Css(),
			new Kadence_Blocks_Css_Scoped_Section(
				'ratingStyles',
				[
					$this->selector( ' .kt-testimonial-rating-wrap' ),
					new Kadence_Blocks_Testimonials_Range_Css( 'render_measure_range', 'margin', 'margin' ),
					$this->selector( ' .kt-testimonial-rating-wrap .kb-svg-icon-wrap' ),
					new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
					new Kadence_Blocks_Testimonials_Unit_Css( 'numeric_with_unit', 'font-size', 'size', 'px' ),
				]
			),
		];
	}

	/**
	 * The sections of the main icon.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function main_icon_sections(): array {
		return [
			$this->selector( ' .kt-svg-testimonial-global-icon' ),
			new Kadence_Blocks_Css_Scoped_Section(
				'iconStyles',
				[ new Kadence_Blocks_Css_Color_Section( 'color', 'color' ), new Kadence_Blocks_Testimonials_Unit_Css( 'numeric_with_unit', 'font-size', 'size', 'px' ) ]
			),
			new Kadence_Blocks_Testimonials_Icon_Border_Radius_Css(),
			new Kadence_Blocks_Css_Scoped_Section(
				'iconStyles',
				[
					new Kadence_Blocks_Css_Alpha_Color_Section( 'background', 'background', 'backgroundOpacity' ),
					new Kadence_Blocks_Css_Alpha_Color_Section( 'border-color', 'border', 'borderOpacity' ),
				]
			),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'borderWidth', 'iconStyles' ),
				[ new Kadence_Blocks_Css_Scoped_Section( 'iconStyles', [ new Kadence_Blocks_Testimonials_Range_Css( 'render_measure_range', 'borderWidth', 'border-width' ) ] ) ],
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'iconBorderStyle', 'border' ) ]
			),
			$this->nested_or_separate( 'iconStyles', 'padding', 'iconPadding', 'render_measure_range' ),
			$this->selector( ' .kt-svg-testimonial-global-icon-wrap' ),
			$this->nested_or_separate( 'iconStyles', 'margin', 'iconMargin', 'render_measure_range' ),
		];
	}

	/**
	 * The sections of the padding and the margin of the block, on every device.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function wrapper_sections(): array {
		$sides_x = [
			1 => 'right',
			3 => 'left',
		];
		$sides_y = [
			0 => 'top',
			2 => 'bottom',
		];

		return array_merge(
			[ $this->selector( '' ) ],
			$this->wrapper_sides( 'wrapperPadding', 'wrapperMargin', $sides_x, true ),
			[
				new Kadence_Blocks_Css_Device_Section( 'tablet', $this->wrapper_sides( 'wrapperTabletPadding', 'tabletWrapperMargin', $sides_x, true ) ),
				new Kadence_Blocks_Css_Device_Section( 'mobile', $this->wrapper_sides( 'wrapperMobilePadding', 'mobileWrapperMargin', $sides_x, true ) ),
				$this->carousel_item_sections(),
			],
			$this->wrapper_sides( 'wrapperPadding', 'wrapperMargin', $sides_y, true ),
			[
				new Kadence_Blocks_Css_Device_Section( 'tablet', $this->wrapper_sides( 'wrapperTabletPadding', 'tabletWrapperMargin', $sides_y, true ) ),
				new Kadence_Blocks_Css_Device_Section( 'mobile', $this->wrapper_sides( 'wrapperMobilePadding', 'mobileWrapperMargin', $sides_y, false ) ),
			]
		);
	}

	/**
	 * The sections of the padding then the margin of some sides of the block, on one device.
	 *
	 * @since TBD
	 *
	 * @param string $padding The attribute that stores the padding.
	 * @param string $margin  The attribute that stores the margin.
	 * @param array  $sides   The names of the sides, by index.
	 * @param bool   $usable  Whether the values are made usable by the block, or only given their unit.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function wrapper_sides( string $padding, string $margin, array $sides, bool $usable ): array {
		$sections = [];

		foreach ( $sides as $index => $name ) {
			$sections[] = new Kadence_Blocks_Testimonials_Wrapper_Side_Css( $padding, $index, 'padding-' . $name, 'padding_unit', $usable );
		}

		foreach ( $sides as $index => $name ) {
			$sections[] = new Kadence_Blocks_Testimonials_Wrapper_Side_Css( $margin, $index, 'margin-' . $name, 'margin_unit', $usable );
		}

		return $sections;
	}

	/**
	 * The sections of the item of a carousel: from here on its padding comes from the wrapper settings.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function carousel_item_sections(): Kadence_Blocks_Css_Section {
		$space = 'var(--global-kb-spacing-xxs, .5rem)';

		return $this->when_carousel(
			[
				$this->selector( ' .kt-blocks-carousel .kt-blocks-testimonial-carousel-item' ),
				new Kadence_Blocks_Css_Enabled_Section(
					'displayShadow',
					[
						new Kadence_Blocks_Css_Static_Section( 'padding-top', $space ),
						new Kadence_Blocks_Css_Static_Section( 'padding-bottom', $space ),
						new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Css_Static_Section( 'padding', $space ) ] ),
					]
				),
			]
		);
	}

	/**
	 * The sections of the gap between the testimonials, and of the slides of the carousel before it starts.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function gap_sections(): array {
		return [
			$this->selector( ' .kt-testimonial-grid-wrap' ),
			new Kadence_Blocks_Testimonials_Gap_Css(),
			$this->when_carousel(
				[
					new Kadence_Blocks_Testimonials_Carousel_Device_Css( 'desktop' ),
					new Kadence_Blocks_Testimonials_Carousel_Device_Css( 'tablet' ),
					new Kadence_Blocks_Testimonials_Carousel_Device_Css( 'mobile' ),
				]
			),
		];
	}

	/**
	 * The sections of the arrow of a bubble.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function bubble_sections(): array {
		return [
			$this->when_style(
				[ 'bubble', 'inlineimage' ],
				[
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-testimonials.kt-blocks-testimonials-wrap{id} .kt-testimonial-text-wrap:after' ),
					new Kadence_Blocks_Testimonials_Bubble_Arrow_Margin_Css(),
					new Kadence_Blocks_Testimonials_Bubble_Arrow_Color_Css(),
				]
			),
		];
	}

	/**
	 * The section that selects the item, or the text of the item when the style is a bubble.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Choice_Section
	 */
	private function container_selector(): Kadence_Blocks_Css_Choice_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			$this->style( [ 'bubble', 'inlineimage' ] ),
			[ $this->selector( ' .kt-testimonial-item-wrap .kt-testimonial-text-wrap' ) ],
			[ $this->selector( ' .kt-testimonial-item-wrap' ) ]
		);
	}

	/**
	 * The sections of the padding and the minimum height of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			$this->container_selector(),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'containerPadding' ),
			$this->selector( ' .kt-testimonial-item-wrap' ),
			new Kadence_Blocks_Testimonials_Range_Css( 'render_responsive_range', 'containerMinHeight', 'min-height' ),
		];
	}

	/**
	 * The sections of the width, the shadow, the border and the background of the items.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function item_sections(): array {
		$width = new Kadence_Blocks_Testimonials_Max_Width_Css();

		return [
			$this->when_style( [ 'bubble', 'inlineimage' ], [ $this->selector( ' .kt-testimonial-item-wrap' ), $width, new Kadence_Blocks_Testimonials_Icon_Overlap_Css() ] ),
			$this->when_style( [ 'basic' ], [ $this->selector( ' .kt-testimonial-item-wrap' ), $width ] ),
			$this->container_selector(),
			new Kadence_Blocks_Css_Enabled_Section( 'displayShadow', [ new Kadence_Blocks_Testimonials_Shadow_Css() ] ),
			$this->item_border_sections(),
			new Kadence_Blocks_Testimonials_Color_Output_Css( 'containerBackground', 'background', 'containerBackgroundOpacity' ),
			$this->item_radius_sections(),
			new Kadence_Blocks_Css_Choice_Section( $this->style( [ 'card', 'inlineimage', 'bubble' ], false ), [ $width ], [] ),
		];
	}

	/**
	 * The sections of the border of the items.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function item_border_sections(): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'containerBorderWidth', null ),
			[
				new Kadence_Blocks_Testimonials_Range_Css( 'render_measure_range', 'containerBorderWidth', 'border-width' ),
				new Kadence_Blocks_Testimonials_Default_Color_Css( 'containerBorder', '#eeeeee', 'border-color', 'containerBorderOpacity' ),
			],
			[ new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle' ) ]
		);
	}

	/**
	 * The sections of the border radius of the items.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function item_radius_sections(): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Legacy_Condition( [ 'containerBorderRadius' ], [], [] ),
			[ new Kadence_Blocks_Testimonials_Range_Css( 'render_range', 'containerBorderRadius', 'border-radius' ) ],
			[
				new Kadence_Blocks_Css_Measure_Section(
					'border-radius',
					'containerBorderRadius',
					[
						'unit_key'    => 'containerBorderRadiusUnit',
						'desktop_key' => 'responsiveContainerBorderRadius',
						'tablet_key'  => 'tabletContainerBorderRadius',
						'mobile_key'  => 'mobileContainerBorderRadius',
					]
				),
			]
		);
	}

	/**
	 * The font of the title.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function title_font(): array {
		return [
			'attribute'   => 'titleFont',
			'min_height'  => 'titleMinHeight',
			'selector'    => ' .kt-testimonial-item-wrap .kt-testimonial-title',
			'usable'      => true,
			'mobile_gate' => 1,
			'inside'      => [],
			'after'       => [
				new Kadence_Blocks_Testimonials_Font_Spacing_Css( 'titleFont', 'margin', 'titleMargin' ),
				new Kadence_Blocks_Testimonials_Font_Spacing_Css( 'titleFont', 'padding', 'titlePadding' ),
				new Kadence_Blocks_Testimonials_Min_Height_Css( 'titleMinHeight', 0 ),
			],
		];
	}

	/**
	 * The font of the content.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function content_font(): array {
		return [
			'attribute'   => 'contentFont',
			'min_height'  => 'contentMinHeight',
			'selector'    => ' .kt-testimonial-content',
			'usable'      => true,
			'mobile_gate' => 2,
			'inside'      => [
				new Kadence_Blocks_Css_Side_List_Section( 'margin', 'margin-%s' ),
				new Kadence_Blocks_Css_Side_List_Section( 'padding', 'padding-%s' ),
			],
			'after'       => [ new Kadence_Blocks_Testimonials_Min_Height_Css( 'contentMinHeight', 0 ) ],
		];
	}

	/**
	 * The font of the name.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function name_font(): array {
		return [
			'attribute'   => 'nameFont',
			'min_height'  => null,
			'selector'    => ' .kt-testimonial-name',
			'usable'      => true,
			'mobile_gate' => 2,
			'inside'      => [],
			'after'       => [],
		];
	}

	/**
	 * The font of the occupation.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function occupation_font(): array {
		return [
			'attribute'   => 'occupationFont',
			'min_height'  => null,
			'selector'    => ' .kt-testimonial-occupation',
			'usable'      => false,
			'mobile_gate' => 2,
			'inside'      => [],
			'after'       => [],
		];
	}

	/**
	 * The sections of one font on desktop, then on tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @param array $font The font: its attribute, its minimum height, its selector and what differs for it.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function font_sections( array $font ): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Testimonials_Font_Gate_Condition( $font['attribute'], $font['min_height'] ),
				array_merge(
					[
						$this->selector( $font['selector'] ),
						new Kadence_Blocks_Css_Scoped_Section( $font['attribute'], array_merge( $this->typography_sections( $font['usable'] ), $font['inside'] ) ),
					],
					$font['after']
				),
				[]
			),
			$this->font_device_sections( $font, 'tablet', 1, 1 ),
			$this->font_device_sections( $font, 'mobile', 2, $font['mobile_gate'] ),
		];
	}

	/**
	 * The sections of the color, the size, the spacing, the transform, the family, the style and the weight of a font.
	 *
	 * @since TBD
	 *
	 * @param bool $usable Whether the size is made usable by the block, or only given its unit.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function typography_sections( bool $usable ): array {
		return [
			new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
			new Kadence_Blocks_Testimonials_Font_Size_Css( $usable ),
			new Kadence_Blocks_Testimonials_Font_Line_Height_Css(),
			new Kadence_Blocks_Testimonials_Unit_Css( 'not_empty_with_unit', 'letter-spacing', 'letterSpacing', 'px' ),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'textTransform' ),
			new Kadence_Blocks_Testimonials_Font_Family_Css(),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'style' ),
			new Kadence_Blocks_Testimonials_Font_Weight_Css(),
		];
	}

	/**
	 * The sections of a font on tablet or mobile.
	 *
	 * @since TBD
	 *
	 * @param array  $font       The font.
	 * @param string $device     The device.
	 * @param int    $index      The index of the device.
	 * @param int    $min_index  The index of the minimum height that decides if the font has anything to write.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function font_device_sections( array $font, string $device, int $index, int $min_index ): Kadence_Blocks_Css_Section {
		$size     = $font['usable'] ? new Kadence_Blocks_Testimonials_Font_Device_Size_Css( $index ) : new Kadence_Blocks_Testimonials_Indexed_Unit_Css( 'font-size', 'size', $index, 'sizeType' );
		$sections = [
			$this->selector( $font['selector'] ),
			new Kadence_Blocks_Css_Scoped_Section( $font['attribute'], [ $size, new Kadence_Blocks_Testimonials_Indexed_Unit_Css( 'line-height', 'lineHeight', $index, 'lineType' ) ] ),
		];

		if ( null !== $font['min_height'] ) {
			$sections[] = new Kadence_Blocks_Testimonials_Min_Height_Css( $font['min_height'], $index );
		}

		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Testimonials_Font_Device_Condition( $font['attribute'], $index, $font['min_height'], $min_index ),
			[ new Kadence_Blocks_Css_Device_Section( $device, $sections ) ],
			[]
		);
	}

	/**
	 * The sections of the media: its size, its border, its background, its spacing and its ratio.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function media_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Testimonials_Media_Displayed_Condition(),
				array_merge( $this->media_box_sections(), $this->media_inner_sections() ),
				[]
			),
		];
	}

	/**
	 * The sections of the width, the border, the background and the spacing of the media.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function media_box_sections(): array {
		return [
			$this->selector( ' .kt-testimonial-media-inner-wrap' ),
			new Kadence_Blocks_Css_Choice_Section( $this->style( [ 'card' ] ), [], [ new Kadence_Blocks_Testimonials_Media_Width_Css() ] ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'borderWidth', 'mediaStyles' ),
				[
					new Kadence_Blocks_Css_Scoped_Section(
						'mediaStyles',
						[
							new Kadence_Blocks_Testimonials_Default_Color_Css( 'border', '#555555', 'border-color', '' ),
							new Kadence_Blocks_Testimonials_Range_Css( 'render_measure_range', 'borderWidth', 'border-width' ),
							new Kadence_Blocks_Testimonials_Range_Css( 'render_range', 'borderRadius', 'border-radius' ),
						]
					),
				],
				[
					new Kadence_Blocks_Css_Border_Styles_Section( 'mediaBorderStyle', 'border' ),
					new Kadence_Blocks_Testimonials_Border_Radius_Css( 'mediaBorderRadius', 'mediaBorderRadiusUnit' ),
				]
			),
			new Kadence_Blocks_Css_Scoped_Section( 'mediaStyles', [ new Kadence_Blocks_Testimonials_Color_Output_Css( 'background', 'background-color', 'backgroundOpacity' ) ] ),
			$this->nested_or_separate( 'mediaStyles', 'padding', 'mediaPadding', 'render_range' ),
			$this->nested_or_separate( 'mediaStyles', 'margin', 'mediaMargin', 'render_range' ),
		];
	}

	/**
	 * The sections that center the media icon and give the image of a card its ratio.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function media_inner_sections(): array {
		return [
			$this->selector( ' .kt-svg-testimonial-icon' ),
			new Kadence_Blocks_Css_Static_Section( 'justify-content', 'center' ),
			new Kadence_Blocks_Css_Static_Section( 'align-items', 'center' ),
			$this->selector( ' .kt-testimonial-media-inner-wrap .kadence-testimonial-image-intrisic' ),
			$this->when_style( [ 'card' ], [ new Kadence_Blocks_Testimonials_Media_Ratio_Css() ] ),
		];
	}

	/**
	 * The sections of the rating.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function rating_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section(
				'displayRating',
				[
					$this->selector( ' .kt-testimonial-rating-wrap' ),
					$this->nested_or_separate( 'ratingStyles', 'margin', 'ratingMargin', 'render_range', true ),
					new Kadence_Blocks_Css_Measure_Section( 'padding', 'ratingPadding' ),
					$this->selector( ' .kt-testimonial-rating-wrap .kt-svg-testimonial-rating-icon' ),
					new Kadence_Blocks_Testimonials_Rating_Color_Css(),
					new Kadence_Blocks_Testimonials_Rating_Size_Css(),
					new Kadence_Blocks_Css_Static_Section( 'display', 'inline-flex' ),
					new Kadence_Blocks_Css_Static_Section( 'justify-content', 'center' ),
					new Kadence_Blocks_Css_Static_Section( 'align-items', 'center' ),
				]
			),
		];
	}

	/**
	 * The sections of the icon of every testimonial, when it is shown.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function display_icon_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section(
				'displayIcon',
				[
					$this->selector( ' .kt-svg-testimonial-global-icon svg' ),
					new Kadence_Blocks_Css_Static_Section( 'display', 'inline-block' ),
					new Kadence_Blocks_Css_Static_Section( 'vertical-align', 'middle' ),
				]
			),
		];
	}
}
