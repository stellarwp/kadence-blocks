<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Testimonials;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Testimonials_Carousel_Assets_Css;
use Kadence_Blocks_Testimonials_Carousel_Layout;
use Kadence_Blocks_Testimonials_Google_Fonts_Css;
use Kadence_Blocks_Testimonials_Min_Height;
use Kadence_Blocks_Testimonials_Nested_Filled_Condition;
use TypeError;

/**
 * The sections of the testimonials CSS, one by one.
 */
final class TestimonialsSectionsTest extends Testimonials_Test_Case {

	private const CAROUSEL = '.kt-blocks-testimonials-wrapabc .kt-blocks-testimonials-inner-wrap .kt-blocks-carousel-init:not(.splide-initialized):not(.tns-slider)';

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
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected, string $selector = '.x' ): void {
		$this->assertSameCss( $expected, $this->write_testimonials( $section, $attributes, $selector ) );
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
		$this->assertSame( $expected, $condition->is_met( $this->testimonials_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * A list that is missing in the saved settings of the icon is an error, as it always was.
	 *
	 * @return void
	 */
	public function testNestedListThatIsMissingIsAnError(): void {
		$this->expectException( TypeError::class );

		$condition = new Kadence_Blocks_Testimonials_Nested_Filled_Condition( 'iconStyles', 'padding', false );
		$input     = $this->testimonials_input( [ 'iconStyles' => [ [ 'size' => 1 ] ] ], new Kadence_Blocks_CSS() );

		// The missing list is also a warning, which the tests turn into another error.
		set_error_handler( '__return_true' ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler

		try {
			$condition->is_met( $input );
		} finally {
			restore_error_handler();
		}
	}

	/**
	 * The carousel is asked for its styles and its scripts, and only when the layout is a carousel.
	 *
	 * @return void
	 */
	public function testCarouselAssetsAreAskedFromTheBlock(): void {
		$this->write_testimonials( new Kadence_Blocks_Testimonials_Carousel_Assets_Css(), [ 'layout' => 'carousel' ] );
		$this->write_testimonials( new Kadence_Blocks_Testimonials_Carousel_Assets_Css(), [ 'layout' => 'grid' ] );

		$this->assertSame( [ [ 'enqueue_style', 'kadence-blocks-splide' ], [ 'enqueue_script', 'kadence-blocks-splide-init' ] ], $this->calls );
	}

	/**
	 * A font is loaded only when it is a Google font that is to be loaded and has a family.
	 *
	 * @dataProvider googleFontProvider
	 *
	 * @param mixed                $font     The saved font.
	 * @param array<int, string>   $expected The families that are loaded.
	 *
	 * @return void
	 */
	public function testGoogleFontsAreLoadedOnlyWhenAsked( $font, array $expected ): void {
		$css = new class() extends Kadence_Blocks_CSS {
			/**
			 * The families that were loaded.
			 *
			 * @var array<int, string>
			 */
			public $families = [];

			/**
			 * Remember the family.
			 *
			 * @param string      $font_name    The family.
			 * @param string|null $font_variant The variant.
			 * @param string|null $subset       The subset.
			 *
			 * @return void
			 */
			public function maybe_add_google_font( $font_name, $font_variant = null, $subset = null ) {
				$this->families[] = $font_name . '|' . $font_variant . '|' . $subset;
			}
		};

		( new Kadence_Blocks_Testimonials_Google_Fonts_Css() )->write( $this->testimonials_input( [ 'contentFont' => [ $font ] ], $css ) );

		$this->assertSame( $expected, $css->families );
	}

	/**
	 * The gaps of the carousel fall back from device to device, and the columns to one.
	 *
	 * @return void
	 */
	public function testCarouselLayoutFallsBack(): void {
		$layout = new Kadence_Blocks_Testimonials_Carousel_Layout(
			[
				'gap'     => [ 10, '', 5 ],
				'columns' => [ 0, 0, 4 ],
			]
		);

		$this->assertSame( 'px', $layout->unit() );
		$this->assertSame( [ 10, 10, 5 ], [ $layout->gap( 'desktop' ), $layout->gap( 'tablet' ), $layout->gap( 'mobile' ) ] );
		$this->assertSame( [ '1', 4, '1' ], [ $layout->columns( 'desktop' ), $layout->columns( 'tablet' ), $layout->columns( 'mobile' ) ] );
		$this->assertSame( '32', ( new Kadence_Blocks_Testimonials_Carousel_Layout( [] ) )->gap( 'mobile' ) );
	}

	/**
	 * A minimum height is set only when it is a number in a list.
	 *
	 * @return void
	 */
	public function testMinHeightIsSetOnlyForNumbers(): void {
		$input = $this->testimonials_input(
			[
				'titleMinHeight'   => [ 1, 'x' ],
				'contentMinHeight' => '5',
			],
			new Kadence_Blocks_CSS()
		);

		$this->assertTrue( Kadence_Blocks_Testimonials_Min_Height::is_set( $input, 'titleMinHeight', 0 ) );
		$this->assertFalse( Kadence_Blocks_Testimonials_Min_Height::is_set( $input, 'titleMinHeight', 1 ) );
		$this->assertFalse( Kadence_Blocks_Testimonials_Min_Height::is_set( $input, 'contentMinHeight', 0 ) );
	}

	/**
	 * @return Generator
	 */
	public function googleFontProvider(): Generator {
		yield 'a font to load' => [
			'font'     => [
				'google'     => true,
				'loadGoogle' => true,
				'family'     => 'Roboto',
				'variant'    => '700',
				'subset'     => 'latin',
			],
			'expected' => [ 'Roboto|700|latin' ],
		];
		yield 'a font without a variant' => [
			'font'     => [
				'google'     => true,
				'loadGoogle' => true,
				'family'     => 'Roboto',
			],
			'expected' => [ 'Roboto||' ],
		];
		yield 'a Google font that is not to be loaded' => [
			'font'     => [
				'google'     => true,
				'loadGoogle' => false,
				'family'     => 'Roboto',
			],
			'expected' => [],
		];
		yield 'a font that is not a Google font' => [
			'font'     => [
				'google'     => 'yes',
				'loadGoogle' => true,
				'family'     => 'Roboto',
			],
			'expected' => [],
		];
		yield 'a Google font without a family' => [
			'font'     => [
				'google'     => true,
				'loadGoogle' => true,
			],
			'expected' => [],
		];
		yield 'a font that is not a list' => [
			'font'     => 'Roboto',
			'expected' => [],
		];
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/testimonials/loader.php';

		yield 'min height of a device' => [
			'section'    => new \Kadence_Blocks_Testimonials_Min_Height_Css( 'titleMinHeight', 1 ),
			'attributes' => [ 'titleMinHeight' => [ 10, 20, 30 ] ],
			'expected'   => '.x{min-height:20px;}',
		];
		yield 'min height that is not a number' => [
			'section'    => new \Kadence_Blocks_Testimonials_Min_Height_Css( 'titleMinHeight', 1 ),
			'attributes' => [ 'titleMinHeight' => [ 10, 'x', 30 ] ],
			'expected'   => '',
		];
		yield 'numeric value with a unit' => [
			'section'    => new \Kadence_Blocks_Testimonials_Unit_Css( 'numeric_with_unit', 'font-size', 'size', 'px' ),
			'attributes' => [ 'size' => '12' ],
			'expected'   => '.x{font-size:12px;}',
		];
		yield 'numeric value that is not a number' => [
			'section'    => new \Kadence_Blocks_Testimonials_Unit_Css( 'numeric_with_unit', 'font-size', 'size', 'px' ),
			'attributes' => [ 'size' => 'big' ],
			'expected'   => '',
		];
		yield 'value with a unit' => [
			'section'    => new \Kadence_Blocks_Testimonials_Unit_Css( 'not_empty_with_unit', 'letter-spacing', 'letterSpacing', 'px' ),
			'attributes' => [ 'letterSpacing' => 2 ],
			'expected'   => '.x{letter-spacing:2px;}',
		];
		yield 'value of a device with its unit' => [
			'section'    => new \Kadence_Blocks_Testimonials_Indexed_Unit_Css( 'line-height', 'lineHeight', 1, 'lineType' ),
			'attributes' => [
				'lineHeight' => [ 1, 2 ],
				'lineType'   => 'em',
			],
			'expected'   => '.x{line-height:2em;}',
		];
		yield 'value of a device with pixels' => [
			'section'    => new \Kadence_Blocks_Testimonials_Indexed_Unit_Css( 'line-height', 'lineHeight', 1, 'lineType' ),
			'attributes' => [ 'lineHeight' => [ 1, 2 ] ],
			'expected'   => '.x{line-height:2px;}',
		];
		yield 'range' => [
			'section'    => new \Kadence_Blocks_Testimonials_Range_Css( 'render_range', 'containerBorderRadius', 'border-radius' ),
			'attributes' => [ 'containerBorderRadius' => 5 ],
			'expected'   => '.x{border-radius:5px;}',
		];
		yield 'color output with opacity' => [
			'section'    => new \Kadence_Blocks_Testimonials_Color_Output_Css( 'containerBackground', 'background', 'containerBackgroundOpacity' ),
			'attributes' => [
				'containerBackground'        => '#ff0000',
				'containerBackgroundOpacity' => 0.5,
			],
			'expected'   => '.x{background:rgba(255, 0, 0, 0.5);}',
		];
		yield 'default color' => [
			'section'    => new \Kadence_Blocks_Testimonials_Default_Color_Css( 'containerBorder', '#eeeeee', 'border-color', 'containerBorderOpacity' ),
			'attributes' => [],
			'expected'   => '.x{border-color:#eeeeee;}',
		];
		yield 'saved color instead of the default' => [
			'section'    => new \Kadence_Blocks_Testimonials_Default_Color_Css( 'containerBorder', '#eeeeee', 'border-color', 'containerBorderOpacity' ),
			'attributes' => [ 'containerBorder' => '#ff0000' ],
			'expected'   => '.x{border-color:#ff0000;}',
		];
		yield 'border radius with a unit' => [
			'section'    => new \Kadence_Blocks_Testimonials_Border_Radius_Css( 'mediaBorderRadius', 'mediaBorderRadiusUnit' ),
			'attributes' => [
				'mediaBorderRadius'     => [ 1, 2, 3, 4 ],
				'mediaBorderRadiusUnit' => '%',
			],
			'expected'   => '.x{border-top-left-radius:1%;border-top-right-radius:2%;border-bottom-right-radius:3%;border-bottom-left-radius:4%;}',
		];
		yield 'border radius with pixels' => [
			'section'    => new \Kadence_Blocks_Testimonials_Border_Radius_Css( 'mediaBorderRadius', 'mediaBorderRadiusUnit' ),
			'attributes' => [ 'mediaBorderRadius' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.x{border-top-left-radius:1px;border-top-right-radius:2px;border-bottom-right-radius:3px;border-bottom-left-radius:4px;}',
		];
		yield 'max width' => [
			'section'    => new \Kadence_Blocks_Testimonials_Max_Width_Css(),
			'attributes' => [ 'containerMaxWidth' => 300 ],
			'expected'   => '.x{max-width:300px;}',
		];
		yield 'max width of five hundred pixels' => [
			'section'    => new \Kadence_Blocks_Testimonials_Max_Width_Css(),
			'attributes' => [],
			'expected'   => '.x{max-width:500px;}',
		];
		yield 'shadow' => [
			'section'    => new \Kadence_Blocks_Testimonials_Shadow_Css(),
			'attributes' => [
				'shadow' => [
					[
						'color'   => '#ff0000',
						'opacity' => 0.5,
						'spread'  => 1,
						'blur'    => 2,
						'hOffset' => 3,
						'vOffset' => 4,
					],
				],
			],
			'expected'   => '.x{box-shadow:3px 4px 2px 1px rgba(255, 0, 0, 0.5);}',
		];
		yield 'soft shadow' => [
			'section'    => new \Kadence_Blocks_Testimonials_Shadow_Css(),
			'attributes' => [],
			'expected'   => '.x{box-shadow:4px 2px 14px 0px rgba(0, 0, 0, 0.2);}',
		];
		yield 'gap' => [
			'section'    => new \Kadence_Blocks_Testimonials_Gap_Css(),
			'attributes' => [
				'gap'     => [ 10, 20, 30 ],
				'gapUnit' => 'px',
			],
			'expected'   => '.x{gap:10px;}@media all and (max-width: 1024px){.x{gap:20px;}}@media all and (max-width: 767px){.x{gap:30px;}}',
		];
		yield 'bubble arrow margin of the container border' => [
			'section'    => new \Kadence_Blocks_Testimonials_Bubble_Arrow_Margin_Css(),
			'attributes' => [ 'containerBorderWidth' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.x{margin-top:3px;}',
		];
		yield 'bubble arrow margin of the border style' => [
			'section'    => new \Kadence_Blocks_Testimonials_Bubble_Arrow_Margin_Css(),
			'attributes' => [
				'containerBorderWidth' => [ 1, 2, 0, 4 ],
				'borderStyle'          => [
					[
						'bottom' => [ '#111', 'solid', 5 ],
						'unit'   => 'em',
					],
				],
			],
			'expected'   => '.x{margin-top:5em;}',
		];
		yield 'bubble arrow margin of the border style in pixels' => [
			'section'    => new \Kadence_Blocks_Testimonials_Bubble_Arrow_Margin_Css(),
			'attributes' => [ 'borderStyle' => [ [ 'bottom' => [ '#111', 'solid', 5 ] ] ] ],
			'expected'   => '.x{margin-top:5px;}',
		];
		yield 'bubble arrow without a border' => [
			'section'    => new \Kadence_Blocks_Testimonials_Bubble_Arrow_Margin_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'bubble arrow color of the border style' => [
			'section'    => new \Kadence_Blocks_Testimonials_Bubble_Arrow_Color_Css(),
			'attributes' => [
				'borderStyle'     => [ [ 'bottom' => [ '#112233' ] ] ],
				'containerBorder' => '#ff0000',
			],
			'expected'   => '.x{border-top-color:#112233;}',
		];
		yield 'bubble arrow color of the container border' => [
			'section'    => new \Kadence_Blocks_Testimonials_Bubble_Arrow_Color_Css(),
			'attributes' => [
				'containerBorder'        => '#ff0000',
				'containerBorderOpacity' => 0.5,
			],
			'expected'   => '.x{border-top-color:rgba(255, 0, 0, 0.5);}',
		];
		yield 'bubble arrow without a color' => [
			'section'    => new \Kadence_Blocks_Testimonials_Bubble_Arrow_Color_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'icon radius in pixels' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Border_Radius_Css(),
			'attributes' => [
				'iconStyles'       => [ [ 'borderRadius' => 4 ] ],
				'iconBorderRadius' => [ 1, 1, 1, 1 ],
			],
			'expected'   => '.x{border-radius:4px;}',
		];
		yield 'icon radius of the separate setting' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Border_Radius_Css(),
			'attributes' => [
				'iconStyles'           => [ [] ],
				'iconBorderRadius'     => [ 1, 2, 3, 4 ],
				'iconBorderRadiusUnit' => '%',
			],
			'expected'   => '.x{border-top-left-radius:1%;border-top-right-radius:2%;border-bottom-right-radius:3%;border-bottom-left-radius:4%;}',
		];
		yield 'icon that overlaps' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Overlap_Css(),
			'attributes' => [
				'displayIcon' => true,
				'iconStyles'  => [
					[
						'icon'   => 'x',
						'margin' => [ -9, 0, 0, 0 ],
					],
				],
			],
			'expected'   => '.x{padding-top:9px;}',
		];
		yield 'icon that does not overlap' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Overlap_Css(),
			'attributes' => [
				'displayIcon' => true,
				'iconStyles'  => [
					[
						'icon'   => 'x',
						'margin' => [ 9, 0, 0, 0 ],
					],
				],
			],
			'expected'   => '',
		];
		yield 'icon that is not shown does not overlap' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Overlap_Css(),
			'attributes' => [ 'displayIcon' => false ],
			'expected'   => '',
		];
		yield 'icon without a name does not overlap' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Overlap_Css(),
			'attributes' => [
				'displayIcon' => true,
				'iconStyles'  => [
					[
						'icon'   => '',
						'margin' => [ -9, 0, 0, 0 ],
					],
				],
			],
			'expected'   => '',
		];
		yield 'icon without a margin does not overlap' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Overlap_Css(),
			'attributes' => [
				'displayIcon' => true,
				'iconStyles'  => [
					[
						'icon'   => 'x',
						'margin' => [],
					],
				],
			],
			'expected'   => '',
		];
		yield 'icon without a top margin does not overlap' => [
			'section'    => new \Kadence_Blocks_Testimonials_Icon_Overlap_Css(),
			'attributes' => [
				'displayIcon' => true,
				'iconStyles'  => [
					[
						'icon'   => 'x',
						'margin' => [ 0, 0, 0, 0 ],
					],
				],
			],
			'expected'   => '',
		];
		yield 'icons of the testimonials' => [
			'section'    => new \Kadence_Blocks_Testimonials_Item_Icons_Css(),
			'attributes' => [
				'testimonials' => [
					[
						'color' => '#ff0000',
						'isize' => 20,
					],
					'x',
					[ 'isize' => 'big' ],
				],
			],
			'expected'   => '.kt-blocks-testimonials-wrapabc .kt-testimonial-item-0 .kt-svg-testimonial-icon{color:#ff0000;font-size:20px;}',
			'selector'   => '',
		];
		yield 'no testimonials' => [
			'section'    => new \Kadence_Blocks_Testimonials_Item_Icons_Css(),
			'attributes' => [ 'testimonials' => 'x' ],
			'expected'   => '',
		];
		yield 'side of the padding' => [
			'section'    => new \Kadence_Blocks_Testimonials_Wrapper_Side_Css( 'wrapperPadding', 1, 'padding-right', 'padding_unit', true ),
			'attributes' => [ 'wrapperPadding' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.x{padding-right:2px;}',
		];
		yield 'side of the margin without the block' => [
			'section'    => new \Kadence_Blocks_Testimonials_Wrapper_Side_Css( 'wrapperMargin', 0, 'margin-top', 'margin_unit', false ),
			'attributes' => [ 'wrapperMargin' => [ 5, 2, 3, 4 ] ],
			'expected'   => '.x{margin-top:5rem;}',
		];
		yield 'side that was not saved' => [
			'section'    => new \Kadence_Blocks_Testimonials_Wrapper_Side_Css( 'wrapperMargin', 0, 'margin-top', 'margin_unit', false ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'carousel slides on desktop' => [
			'section'    => new \Kadence_Blocks_Testimonials_Carousel_Device_Css( 'desktop' ),
			'attributes' => [
				'columns'  => [ 3 ],
				'gap'      => [ 10 ],
				'gap_unit' => 'em',
			],
			'expected'   => self::CAROUSEL . ' .kb-slide-item{display:none;}' . self::CAROUSEL . ' .kb-slide-item:nth-child(-n+3){padding-left:10em;display:block;float:left;width:calc(100% / 3);}' . self::CAROUSEL . '{margin-left:-10em;}',
			'selector'   => '',
		];
		yield 'carousel slides on mobile' => [
			'section'    => new \Kadence_Blocks_Testimonials_Carousel_Device_Css( 'mobile' ),
			'attributes' => [
				'columns' => [ 3, 2, 2, 2, 1, 4 ],
				'gap'     => [ 10, 20 ],
			],
			'expected'   => '@media all and (max-width: 767px){' . self::CAROUSEL . ' .kb-slide-item{display:none;}' . self::CAROUSEL . ' .kb-slide-item:nth-child(-n+4){padding-left:20px;display:block;float:left;width:calc(100% / 4);}' . self::CAROUSEL . '{margin-left:-20px;}}',
			'selector'   => '',
		];
		yield 'font size made usable' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Size_Css( true ),
			'attributes' => [
				'size'     => [ 16 ],
				'sizeType' => 'em',
			],
			'expected'   => '.x{font-size:16em;}',
		];
		yield 'font size with its unit' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Size_Css( false ),
			'attributes' => [ 'size' => [ 16 ] ],
			'expected'   => '.x{font-size:16px;}',
		];
		yield 'font size that was not saved' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Size_Css( true ),
			'attributes' => [ 'size' => [ '' ] ],
			'expected'   => '',
		];
		yield 'font size of a device' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Device_Size_Css( 1 ),
			'attributes' => [ 'size' => [ 16, 14 ] ],
			'expected'   => '.x{font-size:14px;}',
		];
		yield 'font size of a device that was not saved' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Device_Size_Css( 2 ),
			'attributes' => [ 'size' => [ 16, 14 ] ],
			'expected'   => '',
		];
		yield 'line height' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Line_Height_Css(),
			'attributes' => [
				'lineHeight' => [ 2 ],
				'lineType'   => 'em',
			],
			'expected'   => '.x{line-height:2em;}',
		];
		yield 'line height that was not saved' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Line_Height_Css(),
			'attributes' => [ 'lineHeight' => [ 0 ] ],
			'expected'   => '',
		];
		yield 'font family' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Family_Css(),
			'attributes' => [ 'family' => 'Roboto' ],
			'expected'   => '.x{font-family:Roboto;}',
		];
		yield 'no font family' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Family_Css(),
			'attributes' => [ 'family' => '' ],
			'expected'   => '',
		];
		yield 'font weight' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Weight_Css(),
			'attributes' => [ 'weight' => '700' ],
			'expected'   => '.x{font-weight:700;}',
		];
		yield 'regular font weight' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Weight_Css(),
			'attributes' => [ 'weight' => 'regular' ],
			'expected'   => '',
		];
		yield 'font spacing of the font' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Spacing_Css( 'titleFont', 'margin', 'titleMargin' ),
			'attributes' => [
				'titleFont'   => [ [ 'margin' => [ 1, 2, 3, 4 ] ] ],
				'titleMargin' => [ 9, 9, 9, 9 ],
			],
			'expected'   => '.x{margin-top:1px;margin-right:2px;margin-bottom:3px;margin-left:4px;}',
		];
		yield 'font spacing of the separate setting' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Spacing_Css( 'titleFont', 'margin', 'titleMargin' ),
			'attributes' => [
				'titleFont'   => [ [ 'margin' => [ 0, 0, 0, 0 ] ] ],
				'titleMargin' => [ 9, 9, 9, 9 ],
			],
			'expected'   => '.x{margin-top:9px;margin-right:9px;margin-bottom:9px;margin-left:9px;}',
		];
		yield 'font spacing without a font' => [
			'section'    => new \Kadence_Blocks_Testimonials_Font_Spacing_Css( 'titleFont', 'margin', 'titleMargin' ),
			'attributes' => [ 'titleMargin' => [ 9, 9, 9, 9 ] ],
			'expected'   => '.x{margin-top:9px;margin-right:9px;margin-bottom:9px;margin-left:9px;}',
		];
		yield 'media width' => [
			'section'    => new \Kadence_Blocks_Testimonials_Media_Width_Css(),
			'attributes' => [ 'mediaStyles' => [ [ 'width' => 60 ] ] ],
			'expected'   => '.x{width:60px;}',
		];
		yield 'no media width' => [
			'section'    => new \Kadence_Blocks_Testimonials_Media_Width_Css(),
			'attributes' => [ 'mediaStyles' => [ [] ] ],
			'expected'   => '',
		];
		yield 'media ratio' => [
			'section'    => new \Kadence_Blocks_Testimonials_Media_Ratio_Css(),
			'attributes' => [ 'mediaStyles' => [ [ 'ratio' => 75 ] ] ],
			'expected'   => '.x{padding-bottom:75%;}',
		];
		yield 'no media ratio' => [
			'section'    => new \Kadence_Blocks_Testimonials_Media_Ratio_Css(),
			'attributes' => [ 'mediaStyles' => [ [ 'ratio' => '' ] ] ],
			'expected'   => '',
		];
		yield 'rating color' => [
			'section'    => new \Kadence_Blocks_Testimonials_Rating_Color_Css(),
			'attributes' => [ 'ratingStyles' => [ [ 'color' => '#ff0000' ] ] ],
			'expected'   => '.x{color:#ff0000;}',
		];
		yield 'gold rating color' => [
			'section'    => new \Kadence_Blocks_Testimonials_Rating_Color_Css(),
			'attributes' => [],
			'expected'   => '.x{color:#ffd700;}',
		];
		yield 'rating size' => [
			'section'    => new \Kadence_Blocks_Testimonials_Rating_Size_Css(),
			'attributes' => [ 'ratingStyles' => [ [ 'size' => 20 ] ] ],
			'expected'   => '.x{font-size:20px;}',
		];
		yield 'default rating size' => [
			'section'    => new \Kadence_Blocks_Testimonials_Rating_Size_Css(),
			'attributes' => [],
			'expected'   => '.x{font-size:16px;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/testimonials/loader.php';

		yield 'style in the list' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Style_Condition( [ 'bubble', 'inlineimage' ], true ),
			'attributes' => [ 'style' => 'bubble' ],
			'expected'   => true,
		];
		yield 'style not in the list' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Style_Condition( [ 'bubble', 'inlineimage' ], true ),
			'attributes' => [ 'style' => 'card' ],
			'expected'   => false,
		];
		yield 'style that was not saved is basic' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Style_Condition( [ 'basic' ], true ),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'style compared loosely' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Style_Condition( [ 'card' ], false ),
			'attributes' => [ 'style' => true ],
			'expected'   => true,
		];
		yield 'style compared strictly' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Style_Condition( [ 'card' ], true ),
			'attributes' => [ 'style' => true ],
			'expected'   => false,
		];
		yield 'first item is a list' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Array_Item_Condition( 'iconStyles' ),
			'attributes' => [ 'iconStyles' => [ [ 'size' => 1 ] ] ],
			'expected'   => true,
		];
		yield 'first item is not a list' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Array_Item_Condition( 'iconStyles' ),
			'attributes' => [ 'iconStyles' => 'x' ],
			'expected'   => false,
		];
		yield 'no first item' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Array_Item_Condition( 'iconStyles' ),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'list with a value' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Nested_Filled_Condition( 'iconStyles', 'padding', false ),
			'attributes' => [ 'iconStyles' => [ [ 'padding' => [ 0, 1, 0, 0 ] ] ] ],
			'expected'   => true,
		];
		yield 'list without a value' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Nested_Filled_Condition( 'iconStyles', 'padding', false ),
			'attributes' => [ 'iconStyles' => [ [ 'padding' => [ 0, '', '', 0 ] ] ] ],
			'expected'   => false,
		];
		yield 'list of settings that were not saved' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Nested_Filled_Condition( 'iconStyles', 'padding', false ),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'guarded list that is missing' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Nested_Filled_Condition( 'ratingStyles', 'margin', true ),
			'attributes' => [ 'ratingStyles' => [ [ 'size' => 1 ] ] ],
			'expected'   => false,
		];
		yield 'guarded list with a value' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Nested_Filled_Condition( 'ratingStyles', 'margin', true ),
			'attributes' => [ 'ratingStyles' => [ [ 'margin' => [ 1, 0, 0, 0 ] ] ] ],
			'expected'   => true,
		];
		yield 'a side that is filled' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'containerBorderWidth', null ),
			'attributes' => [ 'containerBorderWidth' => [ 0, '', '', 1 ] ],
			'expected'   => true,
		];
		yield 'no side that is filled' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'containerBorderWidth', null ),
			'attributes' => [ 'containerBorderWidth' => [ 0, '', '', '0' ] ],
			'expected'   => false,
		];
		yield 'sides that were not saved' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'containerBorderWidth', null ),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'a side of the settings that is filled' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'borderWidth', 'mediaStyles' ),
			'attributes' => [ 'mediaStyles' => [ [ 'borderWidth' => [ 0, 2, 0, 0 ] ] ] ],
			'expected'   => true,
		];
		yield 'no side of the settings that is filled' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Filled_Sides_Condition( 'borderWidth', 'mediaStyles' ),
			'attributes' => [ 'mediaStyles' => [ [ 'borderWidth' => [ 0, 0, 0, 0 ] ] ] ],
			'expected'   => false,
		];
		yield 'media that was not turned off' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Media_Displayed_Condition(),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'media that was turned on' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Media_Displayed_Condition(),
			'attributes' => [ 'displayMedia' => true ],
			'expected'   => true,
		];
		yield 'media that was turned off' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Media_Displayed_Condition(),
			'attributes' => [ 'displayMedia' => false ],
			'expected'   => false,
		];
		yield 'font with settings' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Gate_Condition( 'titleFont', 'titleMinHeight' ),
			'attributes' => [ 'titleFont' => [ [ 'color' => '#fff' ] ] ],
			'expected'   => true,
		];
		yield 'font without settings' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Gate_Condition( 'titleFont', 'titleMinHeight' ),
			'attributes' => [ 'titleFont' => [ [] ] ],
			'expected'   => false,
		];
		yield 'font that is not a list' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Gate_Condition( 'titleFont', null ),
			'attributes' => [ 'titleFont' => 'x' ],
			'expected'   => false,
		];
		yield 'font without settings but a minimum height' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Gate_Condition( 'titleFont', 'titleMinHeight' ),
			'attributes' => [ 'titleMinHeight' => [ 10 ] ],
			'expected'   => true,
		];
		yield 'font without settings and a minimum height that is not a number' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Gate_Condition( 'titleFont', 'titleMinHeight' ),
			'attributes' => [ 'titleMinHeight' => [ 'x' ] ],
			'expected'   => false,
		];
		yield 'font without a minimum height attribute' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Gate_Condition( 'nameFont', null ),
			'attributes' => [ 'titleMinHeight' => [ 10 ] ],
			'expected'   => false,
		];
		yield 'font with a size on the device' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Device_Condition( 'titleFont', 1, 'titleMinHeight', 1 ),
			'attributes' => [ 'titleFont' => [ [ 'size' => [ 1, 2 ] ] ] ],
			'expected'   => true,
		];
		yield 'font with a line height on the device' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Device_Condition( 'titleFont', 1, null, 1 ),
			'attributes' => [ 'titleFont' => [ [ 'lineHeight' => [ 1, 2 ] ] ] ],
			'expected'   => true,
		];
		yield 'font with nothing on the device' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Device_Condition( 'titleFont', 2, null, 2 ),
			'attributes' => [
				'titleFont' => [
					[
						'size'       => [ 1, 2 ],
						'lineHeight' => 'x',
					],
				],
			],
			'expected'   => false,
		];
		yield 'font that is not a list on the device' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Device_Condition( 'titleFont', 1, null, 1 ),
			'attributes' => [ 'titleFont' => 'x' ],
			'expected'   => false,
		];
		yield 'minimum height decides on the device' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Device_Condition( 'titleFont', 2, 'titleMinHeight', 1 ),
			'attributes' => [ 'titleMinHeight' => [ 0, 5 ] ],
			'expected'   => true,
		];
		yield 'minimum height of another index does not decide' => [
			'condition'  => new \Kadence_Blocks_Testimonials_Font_Device_Condition( 'titleFont', 2, 'titleMinHeight', 1 ),
			'attributes' => [ 'titleMinHeight' => [ 0, 'x', 5 ] ],
			'expected'   => false,
		];
	}
}
