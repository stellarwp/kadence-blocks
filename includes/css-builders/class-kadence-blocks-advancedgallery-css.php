<?php
/**
 * Builds the CSS for the advancedgallery block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/advancedgallery/loader.php';

/**
 * Builds the CSS for the advancedgallery block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Css {

	/**
	 * The selector of the gallery.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const WRAPPER = '.wp-block-kadence-advancedgallery.kb-gallery-wrap-id-{id}';

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
			Kadence_Blocks_Advancedgallery_Settings::derive( $attributes )
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
			$this->wrapper_sections(),
			$this->gutter_sections(),
			$this->image_sections(),
			$this->caption_sections(),
			$this->layout_sections(),
			$this->arrow_sections(),
			$this->dot_sections()
		);
	}

	/**
	 * The sections of the margin, the padding and the overflow of the gallery.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function wrapper_sections(): array {
		return [
			$this->selector( self::WRAPPER ),
			new Kadence_Blocks_Advancedgallery_Margin_Css(),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] ),
			$this->when_type( [ 'carousel' ], [ $this->selector( self::WRAPPER ), new Kadence_Blocks_Css_Static_Section( 'overflow', 'hidden' ) ] ),
		];
	}

	/**
	 * The sections of the space between the images.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function gutter_sections(): array {
		return [
			new Kadence_Blocks_Advancedgallery_Gutter_Css( 0, 'desktop', 10 ),
			new Kadence_Blocks_Advancedgallery_Gutter_Css( 1, 'tablet', null ),
			new Kadence_Blocks_Advancedgallery_Gutter_Css( 2, 'mobile', null ),
		];
	}

	/**
	 * The sections of the height, the corners and the shadow of the images.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function image_sections(): array {
		$fluid = '.kb-gallery-id-{id}.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius';
		$tiles = '.kb-gallery-id-{id}.kb-gallery-ul.kb-gallery-type-tiles';

		return [
			$this->when_type( [ 'fluidcarousel' ], [ new Kadence_Blocks_Advancedgallery_Carousel_Height_Css( [ $fluid, $fluid . ' img' ] ) ] ),
			$this->when_type(
				[ 'tiles' ],
				[ new Kadence_Blocks_Advancedgallery_Carousel_Height_Css( [ $tiles . ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img', $tiles . ' > .kadence-blocks-gallery-item' ] ) ]
			),
			new Kadence_Blocks_Advancedgallery_Image_Radius_Css( 'imageRadius', 'desktop' ),
			new Kadence_Blocks_Advancedgallery_Image_Radius_Css( 'tabletImageRadius', 'tablet' ),
			new Kadence_Blocks_Advancedgallery_Image_Radius_Css( 'mobileImageRadius', 'mobile' ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Advancedgallery_Shadow_Condition(), $this->shadow_sections(), [] ),
		];
	}

	/**
	 * The sections of the shadow of the images and of its hover state.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function shadow_sections(): array {
		$hover = '.kb-gallery-id-{id} .kadence-blocks-gallery-item:hover .kb-gal-image-radius';

		return [
			$this->selector( self::WRAPPER ),
			new Kadence_Blocks_Css_Static_Section( 'overflow', 'visible' ),
			new Kadence_Blocks_Advancedgallery_Shadow_Css( 'shadow', '.kb-gallery-id-{id} .kadence-blocks-gallery-item .kb-gal-image-radius, .kb-gallery-id-{id} .kadence-blocks-gallery-thumb-item .kb-gal-image-radius', true ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedgallery_Shadow_Entry_Condition( 'shadowHover' ),
				[ new Kadence_Blocks_Advancedgallery_Shadow_Css( 'shadowHover', $hover . ', .kb-gallery-id-{id} .kadence-blocks-gallery-thumb-item:hover .kb-gal-image-radius', false ) ],
				[ $this->selector( $hover ), new Kadence_Blocks_Css_Static_Section( 'box-shadow', '4px 2px 14px 0px rgba(0,0,0,0.2)' ) ]
			),
		];
	}

	/**
	 * The sections of the captions.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function caption_sections(): array {
		$caption = ' .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner .kadence-blocks-gallery-item__caption';

		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedgallery_Caption_Condition(),
				[
					$this->selector( '.kb-gallery-id-{id}' . $caption ),
					new Kadence_Blocks_Advancedgallery_Caption_Typography_Css(),
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Advancedgallery_Caption_Background_Condition(),
						[
							new Kadence_Blocks_Css_Choice_Section(
								new Kadence_Blocks_Advancedgallery_Caption_Placement_Condition(),
								[ $this->selector( [ '.kb-gallery-caption-style-bottom.kb-gallery-id-{id}' . $caption, '.kb-gallery-caption-style-bottom-hover.kb-gallery-id-{id}' . $caption ] ), new Kadence_Blocks_Advancedgallery_Caption_Background_Css( true ) ],
								[ $this->selector( [ '.kb-gallery-caption-style-cover-hover.kb-gallery-id-{id}' . $caption, '.kb-gallery-caption-style-below.kb-gallery-id-{id}' . $caption ] ), new Kadence_Blocks_Advancedgallery_Caption_Background_Css( false ) ]
							),
						],
						[]
					),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the mosaic grid and of the overflow of the scrolling types.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function layout_sections(): array {
		$wrapper  = '.kb-gallery-wrap-id-{id}.wp-block-kadence-advancedgallery';
		$carousel = $wrapper . ' .kt-blocks-carousel';
		$visible  = new Kadence_Blocks_Css_Static_Section( 'overflow', 'visible' );

		return [
			$this->when_type(
				[ 'mosaic' ],
				[
					$this->selector( '.kb-gallery-wrap-id-{id} .kb-gallery-ul.kb-gallery-type-mosaic .grid-pattern-container' ),
					new Kadence_Blocks_Advancedgallery_Responsive_Range_Css( 'mosaicRowHeight', 'grid-auto-rows', 'mosaicRowHeightUnit' ),
					new Kadence_Blocks_Advancedgallery_Responsive_Range_Css( 'gutter', 'grid-gap', 'gutterUnit' ),
					new Kadence_Blocks_Advancedgallery_Responsive_Range_Css( 'gutter', 'gap', 'gutterUnit' ),
				]
			),
			$this->when_type(
				[ 'carousel' ],
				[
					new Kadence_Blocks_Css_Enabled_Section(
						'overflow',
						[
							$this->selector( $wrapper ),
							$visible,
							$this->selector( $carousel ),
							$visible,
							$this->selector( $carousel . ' .splide__track' ),
							$visible,
							$this->selector( $carousel . ' .splide__pagination' ),
							new Kadence_Blocks_Css_Static_Section( 'overflow', 'hidden' ),
						]
					),
				]
			),
			$this->when_type(
				[ 'carousel', 'fluidcarousel', 'slider' ],
				[
					$this->selector( $wrapper ),
					$visible,
					$this->selector( $carousel ),
					$visible,
					$this->when_type( [ 'fluidcarousel' ], [ new Kadence_Blocks_Css_Static_Section( 'max-width', '100%' ) ] ),
				]
			),
		];
	}

	/**
	 * The sections of the size, the margin and the colors of the arrows.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function arrow_sections(): array {
		return [
			new Kadence_Blocks_Advancedgallery_Arrow_Size_Css( 0, 'desktop' ),
			new Kadence_Blocks_Advancedgallery_Arrow_Size_Css( 1, 'tablet' ),
			new Kadence_Blocks_Advancedgallery_Arrow_Size_Css( 2, 'mobile' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedgallery_Arrow_Position_Condition(),
				[ $this->selector( '.kb-gallery-id-{id} .splide__arrows' ) ],
				[ $this->selector( '.kb-gallery-id-{id} .splide__arrow' ) ]
			),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'arrowMargin', [ 'unit_key' => 'arrowMarginUnit' ] ),
			new Kadence_Blocks_Css_Choice_Section( Kadence_Blocks_Advancedgallery_Type_Condition::carousel(), $this->arrow_color_sections(), [] ),
		];
	}

	/**
	 * The sections of the colors and the border of the arrows and of the pause button.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function arrow_color_sections(): array {
		$arrow = '.kb-gallery-id-{id} .splide .splide__arrow';
		$pause = '.kb-gallery-id-{id} .kb-gallery-pause-button';

		return array_merge(
			$this->arrow_colors( $arrow ),
			[
				new Kadence_Blocks_Css_Enabled_Section( 'arrowCustomBorderWidth', [ $this->selector( $arrow ), new Kadence_Blocks_Advancedgallery_Border_Width_Css( 'arrowCustomBorderWidth', false ) ] ),
				new Kadence_Blocks_Css_Choice_Section(
					new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'arrowStyle', 'custom' ),
					array_merge(
						$this->arrow_colors( $pause ),
						[ new Kadence_Blocks_Css_Enabled_Section( 'arrowCustomBorderWidth', [ $this->selector( $pause ), new Kadence_Blocks_Advancedgallery_Border_Width_Css( 'arrowCustomBorderWidth', true ) ] ) ]
					),
					[]
				),
			]
		);
	}

	/**
	 * The sections of the colors of an element that has a color for each state.
	 *
	 * @since TBD
	 *
	 * @param string $selector The selector of the element.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function arrow_colors( $selector ): array {
		return Kadence_Blocks_Advancedgallery_Color_Rows::sections(
			$selector,
			[
				'color'            => 'arrowCustomColor',
				'background-color' => 'arrowCustomColorBackground',
				'border-color'     => 'arrowCustomColorBorder',
			],
			[
				''        => '',
				':hover'  => 'Hover',
				':active' => 'Active',
			]
		);
	}

	/**
	 * The sections of the dots of the scrolling types.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function dot_sections(): array {
		$dot    = '.kb-gallery-id-{id} .splide__pagination__page';
		$custom = new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'dotStyle', 'custom' );

		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'dotStyle', 'light' ),
				[ $this->selector( [ '.kb-gallery-id-{id} .splide.kt-carousel-dotstyle-light .splide__pagination__page', '.kb-gallery-id-{id} .splide.kt-carousel-dotstyle-light .splide__pagination__page.is-active' ] ), new Kadence_Blocks_Css_Static_Section( 'background-color', '#fff' ) ],
				[]
			),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'dotStyle', 'outlinedark' ), [ new Kadence_Blocks_Advancedgallery_Dot_Outline_Css( 'outlinedark', '#000' ) ], [] ),
			new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'dotStyle', 'outlinelight' ), [ new Kadence_Blocks_Advancedgallery_Dot_Outline_Css( 'outlinelight', '#fff' ) ], [] ),
			new Kadence_Blocks_Css_Choice_Section(
				$custom,
				Kadence_Blocks_Advancedgallery_Color_Rows::sections(
					$dot,
					[
						'background-color' => 'dotCustomColor',
						'border-color'     => 'dotCustomColorBorder',
					],
					[
						''           => '',
						':hover'     => 'Hover',
						'.is-active' => 'Active',
					]
				),
				[]
			),
			$this->selector( $dot ),
			new Kadence_Blocks_Css_Choice_Section( $custom, $this->dot_border_sections(), [] ),
		];
	}

	/**
	 * The sections of the border of the dots.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function dot_border_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Advancedgallery_Filled_Condition( [ 'dotCustomBorderWidth' ] ),
				[ new Kadence_Blocks_Advancedgallery_Border_Width_Css( 'dotCustomBorderWidth', true ) ],
				[
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Advancedgallery_Filled_Condition( [ 'dotCustomColorBorder', 'dotCustomColorBorderHover', 'dotCustomColorBorderActive' ] ),
						[ new Kadence_Blocks_Css_Static_Section( 'border-width', '2px' ), new Kadence_Blocks_Css_Static_Section( 'border-style', 'solid' ) ],
						[]
					),
				]
			),
		];
	}

	/**
	 * A section that sets one selector, or several that share a rule.
	 *
	 * @since TBD
	 *
	 * @param string|string[] $selectors The selectors, `{id}` stands for the block unique id.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function selector( $selectors ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Selector_Section( $selectors );
	}

	/**
	 * A section that runs other sections for some types of gallery.
	 *
	 * @since TBD
	 *
	 * @param string[]                     $types    The types.
	 * @param Kadence_Blocks_Css_Section[] $sections The sections.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function when_type( array $types, array $sections ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section( new Kadence_Blocks_Advancedgallery_Type_Condition( $types ), $sections, [] );
	}
}
