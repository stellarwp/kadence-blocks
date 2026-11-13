<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedgallery;

use Generator;
use Kadence_Blocks_Advancedgallery_Arrow_Position_Condition;
use Kadence_Blocks_Advancedgallery_Arrow_Size_Css;
use Kadence_Blocks_Advancedgallery_Border_Width_Css;
use Kadence_Blocks_Advancedgallery_Caption_Background_Condition;
use Kadence_Blocks_Advancedgallery_Caption_Background_Css;
use Kadence_Blocks_Advancedgallery_Caption_Condition;
use Kadence_Blocks_Advancedgallery_Caption_Placement_Condition;
use Kadence_Blocks_Advancedgallery_Carousel_Height_Css;
use Kadence_Blocks_Advancedgallery_Carousel_Style_Condition;
use Kadence_Blocks_Advancedgallery_Color_Css;
use Kadence_Blocks_Advancedgallery_Color_Rows;
use Kadence_Blocks_Advancedgallery_Dot_Outline_Css;
use Kadence_Blocks_Advancedgallery_Filled_Condition;
use Kadence_Blocks_Advancedgallery_Gutter_Css;
use Kadence_Blocks_Advancedgallery_Image_Radius_Css;
use Kadence_Blocks_Advancedgallery_Margin_Css;
use Kadence_Blocks_Advancedgallery_Responsive_Range_Css;
use Kadence_Blocks_Advancedgallery_Settings;
use Kadence_Blocks_Advancedgallery_Shadow_Condition;
use Kadence_Blocks_Advancedgallery_Shadow_Css;
use Kadence_Blocks_Advancedgallery_Shadow_Entry;
use Kadence_Blocks_Advancedgallery_Shadow_Entry_Condition;
use Kadence_Blocks_Advancedgallery_Type_Condition;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;

/**
 * The sections of the gallery CSS, one by one.
 */
final class AdvancedgallerySectionsTest extends Advancedgallery_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	private const FLUID_HEIGHT = '.kb-gallery-id-abc.kb-gallery-ul.kb-gallery-type-fluidcarousel .kt-blocks-carousel figure .kb-gal-image-radius';

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected, string $selector = '' ): void {
		$this->assertSameCss( $expected, $this->write_gallery( $section, $attributes, $selector ) );
	}

	/**
	 * A condition is met, or not, for the attributes.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param object               $condition  The condition.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testCondition( $condition, array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $condition->is_met( $this->gallery_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The values every section shares are worked out from the version, the type and the unit of the gutter.
	 *
	 * @dataProvider settingsProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $expected   The values derived.
	 *
	 * @return void
	 */
	public function testSettings( array $attributes, array $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Advancedgallery_Settings::derive( $attributes ) );
	}

	/**
	 * The first shadow is found under the attribute, or comes from the default when the attribute is missing and the entry has one.
	 *
	 * @dataProvider entryProvider
	 *
	 * @param array<string, mixed> $attributes    The block attributes.
	 * @param bool                 $with_fallback Whether a missing attribute falls back to the default shadow.
	 * @param array|null           $expected      The shadow expected.
	 *
	 * @return void
	 */
	public function testShadowEntry( array $attributes, bool $with_fallback, ?array $expected ): void {
		$entry = new Kadence_Blocks_Advancedgallery_Shadow_Entry( 'shadow', $with_fallback );

		$this->assertSame( $expected, $entry->first( $this->gallery_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The color rows hold one color section for each state of each property, property by property.
	 *
	 * @return void
	 */
	public function testColorRowsAreOneSectionForEachStateOfEachProperty(): void {
		$sections = Kadence_Blocks_Advancedgallery_Color_Rows::sections(
			'.dot',
			[
				'color'        => 'one',
				'border-color' => 'two',
			],
			[
				''       => '',
				':hover' => 'Hover',
			] 
		);
		$css      = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$input = $this->gallery_input(
			[
				'one'      => '#111111',
				'oneHover' => '#222222',
				'two'      => '#333333',
				'twoHover' => '#444444',
			],
			$css 
		);

		foreach ( $sections as $section ) {
			$section->write( $input );
		}

		$this->assertCount( 4, $sections );
		$this->assertSameCss( '.dot{color:#111111;border-color:#333333;}.dot:hover{color:#222222;border-color:#444444;}', $css->css_output() );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedgallery/loader.php';

		yield from $this->gutterProvider();
		yield from $this->imageProvider();
		yield from $this->captionProvider();
		yield from $this->arrowProvider();
		yield from $this->dotProvider();
	}

	/**
	 * @return Generator
	 */
	private function gutterProvider(): Generator {
		$grid = '.wp-block-kadence-advancedgallery .kb-gallery-type-grid.kb-gallery-id-abc{margin:-5px;}.kb-gallery-type-grid.kb-gallery-id-abc .kadence-blocks-gallery-item{padding:5px;}';

		yield 'the gutter of a masonry gallery is half on each side of an image' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 0, 'desktop', 10 ),
			'attributes' => [ 'gutter' => [ 20 ] ],
			'expected'   => '.wp-block-kadence-advancedgallery .kb-gallery-type-masonry.kb-gallery-id-abc{margin:-10px;}.kb-gallery-type-masonry.kb-gallery-id-abc .kadence-blocks-gallery-item{padding:10px;}',
		];
		yield 'the gutter falls back to 10 on desktop' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 0, 'desktop', 10 ),
			'attributes' => [
				'type'       => 'grid',
				'gutter'     => [ 'wide' ],
				'gutterUnit' => 'em',
			],
			'expected'   => '.wp-block-kadence-advancedgallery .kb-gallery-type-grid.kb-gallery-id-abc{margin:-5em;}.kb-gallery-type-grid.kb-gallery-id-abc .kadence-blocks-gallery-item{padding:5em;}',
		];
		yield 'the tablet gutter is written in the tablet query' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 1, 'tablet', null ),
			'attributes' => [
				'type'   => 'grid',
				'gutter' => [ 20, 10 ],
			],
			'expected'   => self::TABLET . '{' . $grid . '}',
		];
		yield 'a tablet gutter that is not a number is skipped' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 1, 'tablet', null ),
			'attributes' => [
				'type'   => 'grid',
				'gutter' => [ 20, '' ],
			],
			'expected'   => '',
		];
		yield 'the mobile gutter of tiles' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 2, 'mobile', null ),
			'attributes' => [
				'type'   => 'tiles',
				'gutter' => [ 20, 10, 6 ],
			],
			'expected'   => self::MOBILE . '{.wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-abc{margin:-3px;}.kb-gallery-type-tiles.kb-gallery-id-abc .kadence-blocks-gallery-item{padding:3px;}}',
		];
		yield 'a gallery that does not space its images gets no gutter rule' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 0, 'desktop', 10 ),
			'attributes' => [ 'type' => 'mosaic' ],
			'expected'   => '',
		];
		yield 'the gutter of a thumbnail gallery is the space under the slider, from the second version of the block' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 0, 'desktop', 10 ),
			'attributes' => [
				'type'      => 'thumbslider',
				'kbVersion' => 2,
				'gutter'    => [ 8 ],
			],
			'expected'   => '.kb-gallery-type-thumbslider.kb-gallery-id-abc .kt-blocks-carousel-init {margin-bottom:8px;}',
		];
		yield 'the first version of the thumbnail gallery has no gutter' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Gutter_Css( 0, 'desktop', 10 ),
			'attributes' => [
				'type'   => 'thumbslider',
				'gutter' => [ 8 ],
			],
			'expected'   => '',
		];
		yield 'the margin takes its unit from outside the list' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Margin_Css(),
			'attributes' => [
				'margin'     => [ [ 'desk' => [ 1, 2, 3, 4 ] ] ],
				'marginUnit' => 'em',
			],
			'expected'   => '{margin-top:1em;margin-right:2em;margin-bottom:3em;margin-left:4em;}',
		];
		yield 'the margin is px unless the gallery says otherwise' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Margin_Css(),
			'attributes' => [ 'margin' => [ [ 'desk' => [ 1, 2, 3, 4 ] ] ] ],
			'expected'   => '{margin-top:1px;margin-right:2px;margin-bottom:3px;margin-left:4px;}',
		];
		yield 'no margin, no rule' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Margin_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'the mosaic grid has a gap for each device' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Responsive_Range_Css( 'gutter', 'gap', 'gutterUnit' ),
			'attributes' => [
				'gutter'     => [ 4, 3, 2 ],
				'gutterUnit' => 'em',
			],
			'expected'   => '{gap:4em;}' . self::TABLET . '{{gap:3em;}}' . self::MOBILE . '{{gap:2em;}}',
		];
	}

	/**
	 * @return Generator
	 */
	private function imageProvider(): Generator {
		$radius = '.kb-gallery-id-abc .kadence-blocks-gallery-item .kb-gal-image-radius, .kb-gallery-id-abc .kb-slide-item .kb-gal-image-radius img';

		yield 'the corners of the images, with the missing ones at zero' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Image_Radius_Css( 'imageRadius', 'desktop' ),
			'attributes' => [
				'imageRadius'     => [ 5, 6, 'x' ],
				'imageRadiusUnit' => 'em',
			],
			'expected'   => $radius . '{border-radius:5em 6em 0em 0em;}',
		];
		yield 'the corners of the images on tablet' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Image_Radius_Css( 'tabletImageRadius', 'tablet' ),
			'attributes' => [ 'tabletImageRadius' => [ 1, 2, 3, 4 ] ],
			'expected'   => self::TABLET . '{' . $radius . '{border-radius:1px 2px 3px 4px;}}',
		];
		yield 'corners without a number first are skipped' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Image_Radius_Css( 'imageRadius', 'desktop' ),
			'attributes' => [ 'imageRadius' => [ 'x', 2, 3, 4 ] ],
			'expected'   => '',
		];
		yield 'the height of the images of a fluid carousel on every device' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Carousel_Height_Css( [ '.kb-gallery-id-{id} .one', '.kb-gallery-id-{id} .two' ] ),
			'attributes' => [ 'carouselHeight' => [ 200, '', 150 ] ],
			'expected'   => '.kb-gallery-id-abc .one, .kb-gallery-id-abc .two{height:200px;}' . self::MOBILE . '{.kb-gallery-id-abc .one, .kb-gallery-id-abc .two{height:150px;}}',
		];
		yield 'a height that is not a list is skipped' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Carousel_Height_Css( [ self::FLUID_HEIGHT ] ),
			'attributes' => [ 'carouselHeight' => 200 ],
			'expected'   => '',
		];
		yield 'the shadow of the images with the shadow that was saved' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Shadow_Css( 'shadow', '.kb-gallery-id-{id} .image', false ),
			'attributes' => [
				'shadow' => [
					[
						'hOffset' => 1,
						'vOffset' => 2,
						'blur'    => 3,
						'spread'  => 0,
						'color'   => '#ffffff',
						'opacity' => 0.5,
					],
				],
			],
			'expected'   => '.kb-gallery-id-abc .image{box-shadow:1px 2px 3px 0px rgba(255, 255, 255, 0.5);}',
		];
		yield 'the shadow of the images falls back to the default one' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Shadow_Css( 'shadow', '.kb-gallery-id-{id} .image', true ),
			'attributes' => [],
			'expected'   => '.kb-gallery-id-abc .image{box-shadow:4px 2px 14px 0px rgba(0, 0, 0, 0.2);}',
		];
		yield 'no shadow, no rule' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Shadow_Css( 'shadow', '.kb-gallery-id-{id} .image', false ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function captionProvider(): Generator {
		yield 'the background of the captions at the bottom fades out' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Caption_Background_Css( true ),
			'attributes' => [
				'captionStyles' => [
					[
						'background'        => '#000000',
						'backgroundOpacity' => 0.5,
					],
				],
			],
			'expected'   => '.x{background:linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0, rgba(0, 0, 0, 0) 100%);}',
			'selector'   => '.x',
		];
		yield 'the background of the other captions is solid and 80 percent opaque unless the opacity is a number' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Caption_Background_Css( false ),
			'attributes' => [
				'captionStyles' => [
					[
						'background'        => '#000000',
						'backgroundOpacity' => 'x',
					],
				],
			],
			'expected'   => '.x{background:rgba(0, 0, 0, 0.8);}',
			'selector'   => '.x',
		];
	}

	/**
	 * @return Generator
	 */
	private function arrowProvider(): Generator {
		yield 'the size of the arrows' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Arrow_Size_Css( 0, 'desktop' ),
			'attributes' => [
				'arrowSize'     => [ 20 ],
				'arrowSizeUnit' => 'em',
			],
			'expected'   => '.kb-gallery-id-abc .splide__arrow{font-size:20em;}',
		];
		yield 'the size of the arrows on mobile is in px unless the gallery says otherwise' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Arrow_Size_Css( 2, 'mobile' ),
			'attributes' => [ 'arrowSize' => [ 20, 10, 8 ] ],
			'expected'   => self::MOBILE . '{.kb-gallery-id-abc .splide__arrow{font-size:8px;}}',
		];
		yield 'an empty size is skipped' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Arrow_Size_Css( 1, 'tablet' ),
			'attributes' => [ 'arrowSize' => [ 20, 0 ] ],
			'expected'   => '',
		];
		yield 'a color is written with its selector when it was saved' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Color_Css( '.kb-gallery-id-{id} .splide .splide__arrow', 'color', 'arrowCustomColor' ),
			'attributes' => [ 'arrowCustomColor' => '#112233' ],
			'expected'   => '.kb-gallery-id-abc .splide .splide__arrow{color:#112233;}',
		];
		yield 'a color that was not saved leaves the selector alone' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Color_Css( '.kb-gallery-id-{id} .splide .splide__arrow', 'color', 'arrowCustomColor' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'the border of the arrows' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Border_Width_Css( 'arrowCustomBorderWidth', false ),
			'attributes' => [ 'arrowCustomBorderWidth' => 3 ],
			'expected'   => '.x{border-width:3px;}',
			'selector'   => '.x',
		];
		yield 'the border of the pause button is solid' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Border_Width_Css( 'arrowCustomBorderWidth', true ),
			'attributes' => [ 'arrowCustomBorderWidth' => 3 ],
			'expected'   => '.x{border-width:3px;border-style:solid;}',
			'selector'   => '.x',
		];
	}

	/**
	 * @return Generator
	 */
	private function dotProvider(): Generator {
		$dot = '.kb-gallery-id-abc .splide.kt-carousel-dotstyle-outlinedark .splide__pagination__page';

		yield 'the dots that are an outline' => [
			'section'    => new Kadence_Blocks_Advancedgallery_Dot_Outline_Css( 'outlinedark', '#000' ),
			'attributes' => [],
			'expected'   => $dot . '{background-color:transparent;box-shadow:inset 0 0 0 1px #000;-webkit-transition:box-shadow 0.3s ease;-moz-transition:box-shadow 0.3s ease;transition:box-shadow 0.3s ease;}'
				. $dot . '.is-active{background-color:transparent;box-shadow:inset 0 0 0 8px #000;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedgallery/loader.php';

		yield 'a masonry gallery is one of the types' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Type_Condition( [ 'masonry', 'grid' ] ),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'a mosaic is not one of the types' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Type_Condition( [ 'masonry', 'grid' ] ),
			'attributes' => [ 'type' => 'mosaic' ],
			'expected'   => false,
		];
		yield 'a slider scrolls' => [
			'condition'  => Kadence_Blocks_Advancedgallery_Type_Condition::carousel(),
			'attributes' => [ 'type' => 'slider' ],
			'expected'   => true,
		];
		yield 'a grid does not scroll' => [
			'condition'  => Kadence_Blocks_Advancedgallery_Type_Condition::carousel(),
			'attributes' => [ 'type' => 'grid' ],
			'expected'   => false,
		];
		yield 'a scrolling gallery with the style' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'dotStyle', 'custom' ),
			'attributes' => [
				'type'     => 'carousel',
				'dotStyle' => 'custom',
			],
			'expected'   => true,
		];
		yield 'a scrolling gallery with another style' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'dotStyle', 'custom' ),
			'attributes' => [
				'type'     => 'carousel',
				'dotStyle' => 'light',
			],
			'expected'   => false,
		];
		yield 'a gallery that does not scroll with the style' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Carousel_Style_Condition( 'dotStyle', 'custom' ),
			'attributes' => [
				'type'     => 'grid',
				'dotStyle' => 'custom',
			],
			'expected'   => false,
		];
		yield 'one filled attribute is enough' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Filled_Condition( [ 'a', 'b' ] ),
			'attributes' => [
				'a' => '',
				'b' => 'x',
			],
			'expected'   => true,
		];
		yield 'no filled attribute' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Filled_Condition( [ 'a', 'b' ] ),
			'attributes' => [
				'a' => '',
				'b' => 0,
			],
			'expected'   => false,
		];
		yield 'arrows at an edge' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Arrow_Position_Condition(),
			'attributes' => [ 'arrowPosition' => 'inside' ],
			'expected'   => true,
		];
		yield 'arrows in the center' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Arrow_Position_Condition(),
			'attributes' => [ 'arrowPosition' => 'center' ],
			'expected'   => false,
		];
		yield 'arrows without a position' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Arrow_Position_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'a shadow that is on' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Shadow_Condition(),
			'attributes' => [ 'displayShadow' => true ],
			'expected'   => true,
		];
		yield 'a shadow that is on for a mosaic' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Shadow_Condition(),
			'attributes' => [
				'displayShadow' => true,
				'type'          => 'mosaic',
			],
			'expected'   => false,
		];
		yield 'a shadow that is only truthy' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Shadow_Condition(),
			'attributes' => [ 'displayShadow' => 1 ],
			'expected'   => false,
		];
		yield 'a hover shadow that was saved' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Shadow_Entry_Condition( 'shadowHover' ),
			'attributes' => [ 'shadowHover' => [ [ 'blur' => 1 ] ] ],
			'expected'   => true,
		];
		yield 'a hover shadow that is not a list of shadows' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Shadow_Entry_Condition( 'shadowHover' ),
			'attributes' => [ 'shadowHover' => 'x' ],
			'expected'   => false,
		];
		yield 'captions that are shown and styled' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Condition(),
			'attributes' => [
				'showCaption'   => true,
				'captionStyles' => [ [ 'size' => 1 ] ],
			],
			'expected'   => true,
		];
		yield 'captions that are hidden' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Condition(),
			'attributes' => [
				'showCaption'   => false,
				'captionStyles' => [ [ 'size' => 1 ] ],
			],
			'expected'   => false,
		];
		yield 'captions without a style' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Condition(),
			'attributes' => [ 'showCaption' => true ],
			'expected'   => false,
		];
		yield 'a caption background' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Background_Condition(),
			'attributes' => [ 'captionStyles' => [ [ 'background' => '#fff' ] ] ],
			'expected'   => true,
		];
		yield 'no caption background' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Background_Condition(),
			'attributes' => [ 'captionStyles' => [ [ 'background' => '' ] ] ],
			'expected'   => false,
		];
		yield 'captions with no style sit at the bottom' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Placement_Condition(),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'captions that appear on hover at the bottom' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Placement_Condition(),
			'attributes' => [ 'captionStyle' => 'bottom-hover' ],
			'expected'   => true,
		];
		yield 'captions below the image' => [
			'condition'  => new Kadence_Blocks_Advancedgallery_Caption_Placement_Condition(),
			'attributes' => [ 'captionStyle' => 'below' ],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function settingsProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedgallery/loader.php';

		yield 'a gallery with nothing saved' => [
			'attributes' => [],
			'expected'   => [
				'updated_version' => false,
				'gallery_type'    => 'masonry',
				'gutter_unit'     => 'px',
			],
		];
		yield 'a gallery of the second version' => [
			'attributes' => [
				'kbVersion'  => 2,
				'type'       => 'grid',
				'gutterUnit' => 'em',
			],
			'expected'   => [
				'updated_version' => true,
				'gallery_type'    => 'grid',
				'gutter_unit'     => 'em',
			],
		];
		yield 'the first version is not the updated one' => [
			'attributes' => [ 'kbVersion' => 1 ],
			'expected'   => [
				'updated_version' => false,
				'gallery_type'    => 'masonry',
				'gutter_unit'     => 'px',
			],
		];
	}

	/**
	 * @return Generator
	 */
	public function entryProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedgallery/loader.php';

		yield 'the first shadow that was saved' => [
			'attributes'    => [ 'shadow' => [ [ 'blur' => 3 ], [ 'blur' => 9 ] ] ],
			'with_fallback' => true,
			'expected'      => [ 'blur' => 3 ],
		];
		yield 'a missing shadow with a fallback' => [
			'attributes'    => [],
			'with_fallback' => true,
			'expected'      => [
				'hOffset' => 4,
				'vOffset' => 2,
				'blur'    => 14,
				'spread'  => 0,
				'color'   => '#000000',
				'opacity' => 0.2,
			],
		];
		yield 'a missing shadow without a fallback' => [
			'attributes'    => [],
			'with_fallback' => false,
			'expected'      => null,
		];
		yield 'shadows that are not a list' => [
			'attributes'    => [ 'shadow' => 'x' ],
			'with_fallback' => true,
			'expected'      => null,
		];
		yield 'a first shadow that is not a shadow' => [
			'attributes'    => [ 'shadow' => [ 'x' ] ],
			'with_fallback' => true,
			'expected'      => null,
		];
	}
}
