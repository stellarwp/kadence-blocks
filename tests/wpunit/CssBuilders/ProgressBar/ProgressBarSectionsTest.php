<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\ProgressBar;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Progress_Bar_Alignment_Css;
use Kadence_Blocks_Progress_Bar_First_Radius_Css;
use Kadence_Blocks_Progress_Bar_Inside_Line_Condition;
use Kadence_Blocks_Progress_Bar_Label_Column_Condition;
use Kadence_Blocks_Progress_Bar_Line_Bar_Condition;
use Kadence_Blocks_Progress_Bar_Line_Mask_Condition;
use Kadence_Blocks_Progress_Bar_Mask;
use Kadence_Blocks_Progress_Bar_Mask_Bar_Css;
use Kadence_Blocks_Progress_Bar_Mask_Dimensions_Css;
use Kadence_Blocks_Progress_Bar_Mask_Image_Css;
use Kadence_Blocks_Progress_Bar_Mask_Size;
use Kadence_Blocks_Progress_Bar_Number_Font_Css;
use Kadence_Blocks_Progress_Bar_Number_Font_Merge;
use Kadence_Blocks_Progress_Bar_Radius_Css;

/**
 * The sections of the progress bar CSS, one by one.
 */
final class ProgressBarSectionsTest extends ProgressBar_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_bar( $section, $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		$this->load();

		yield 'a radius in pixels on desktop' => [
			'section'    => new Kadence_Blocks_Progress_Bar_First_Radius_Css(),
			'attributes' => [ 'progressBorderRadius' => [ 4, 6, 8 ] ],
			'expected'   => '.s{border-radius:4px;}',
		];
		yield 'no radius on desktop' => [
			'section'    => new Kadence_Blocks_Progress_Bar_First_Radius_Css(),
			'attributes' => [ 'progressBorderRadius' => [ 0, 6, 8 ] ],
			'expected'   => '',
		];
		yield 'a radius saved as a string reads its first character' => [
			'section'    => new Kadence_Blocks_Progress_Bar_First_Radius_Css(),
			'attributes' => [ 'progressBorderRadius' => '7' ],
			'expected'   => '.s{border-radius:7px;}',
		];
		yield 'a radius on tablet' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Radius_Css( 1 ),
			'attributes' => [ 'progressBorderRadius' => [ 4, 6, 8 ] ],
			'expected'   => '.s{border-radius:6px;}',
		];
		yield 'a radius on mobile' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Radius_Css( 2 ),
			'attributes' => [ 'progressBorderRadius' => [ 4, 6, 8 ] ],
			'expected'   => '.s{border-radius:8px;}',
		];
		yield 'centered content' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Alignment_Css( 'hAlign' ),
			'attributes' => [ 'hAlign' => 'center' ],
			'expected'   => '.s{justify-content:center;text-align:center;}',
		];
		yield 'content on the right' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Alignment_Css( 'thAlign' ),
			'attributes' => [ 'thAlign' => 'right' ],
			'expected'   => '.s{justify-content:flex-end;text-align:right;}',
		];
		yield 'content on the left' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Alignment_Css( 'mhAlign' ),
			'attributes' => [ 'mhAlign' => 'left' ],
			'expected'   => '.s{justify-content:flex-start;}',
		];
		yield 'an unknown alignment writes nothing' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Alignment_Css( 'hAlign' ),
			'attributes' => [ 'hAlign' => 'bogus' ],
			'expected'   => '',
		];
		yield 'the percentage keeps its own font' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Number_Font_Css(),
			'attributes' => [ 'numberFont' => [ 'color' => '#00f' ] ],
			'expected'   => '.s{color:#00f;}',
		];
		yield 'the percentage takes the font of the label when it has none' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Number_Font_Css(),
			'attributes' => [ 'labelFont' => [ 'color' => '#f00' ] ],
			'expected'   => '.s{color:#f00;}',
		];
		yield 'the percentage changes the font of the label' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Number_Font_Css(),
			'attributes' => [
				'labelFont'  => [
					'color'         => '#f00',
					'textTransform' => 'uppercase',
				],
				'numberFont' => [ 'color' => '#00f' ],
			],
			'expected'   => '.s{color:#00f;text-transform:uppercase;}',
		];
		yield 'no font writes nothing' => [
			'section'    => new Kadence_Blocks_Progress_Bar_Number_Font_Css(),
			'attributes' => [],
			'expected'   => '',
		];
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
		$this->assertSame( $expected, $condition->is_met( $this->bar_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		$this->load();

		yield 'a bar with no type is a line' => [ new Kadence_Blocks_Progress_Bar_Line_Bar_Condition(), [], true ];
		yield 'a line bar is a line' => [ new Kadence_Blocks_Progress_Bar_Line_Bar_Condition(), [ 'barType' => 'line' ], true ];
		yield 'an empty type is not a line' => [ new Kadence_Blocks_Progress_Bar_Line_Bar_Condition(), [ 'barType' => '' ], false ];
		yield 'a circle is not a line' => [ new Kadence_Blocks_Progress_Bar_Line_Bar_Condition(), [ 'barType' => 'circle' ], false ];
		yield 'a label with no position is inside a line' => [ new Kadence_Blocks_Progress_Bar_Inside_Line_Condition(), [], true ];
		yield 'a label inside a bar with an empty type is inside a line' => [ new Kadence_Blocks_Progress_Bar_Inside_Line_Condition(), [ 'barType' => '' ], true ];
		yield 'a label outside a line is not inside' => [ new Kadence_Blocks_Progress_Bar_Inside_Line_Condition(), [ 'labelPosition' => 'outside' ], false ];
		yield 'a label inside a circle is not inside a line' => [ new Kadence_Blocks_Progress_Bar_Inside_Line_Condition(), [ 'barType' => 'circle' ], false ];
		yield 'a label on top is a column' => [ new Kadence_Blocks_Progress_Bar_Label_Column_Condition(), [ 'labelLayout' => 'lt' ], true ];
		yield 'a label at the bottom is a column' => [ new Kadence_Blocks_Progress_Bar_Label_Column_Condition(), [ 'labelLayout' => 'lb' ], true ];
		yield 'a label on the side is not a column' => [ new Kadence_Blocks_Progress_Bar_Label_Column_Condition(), [ 'labelLayout' => 'rt' ], false ];
		yield 'a label with no layout is not a column' => [ new Kadence_Blocks_Progress_Bar_Label_Column_Condition(), [], false ];
		yield 'the line mask is a mask bar' => [ new Kadence_Blocks_Progress_Bar_Line_Mask_Condition(), [ 'barType' => 'line-mask' ], true ];
		yield 'a bar with no type is not a mask bar' => [ new Kadence_Blocks_Progress_Bar_Line_Mask_Condition(), [], false ];
		yield 'a line is not a mask bar' => [ new Kadence_Blocks_Progress_Bar_Line_Mask_Condition(), [ 'barType' => 'line' ], false ];
		yield 'a bar type of true is a mask bar, as the loose comparison always said' => [ new Kadence_Blocks_Progress_Bar_Line_Mask_Condition(), [ 'barType' => true ], true ];
	}

	/**
	 * The font of the percentage is the one of the label with what the number font changes.
	 *
	 * @dataProvider fontProvider
	 *
	 * @param array<string, mixed> $number   The number font.
	 * @param array<string, mixed> $label    The label font.
	 * @param array<string, mixed> $expected The font expected.
	 *
	 * @return void
	 */
	public function testNumberFontMerge( array $number, array $label, array $expected ): void {
		$context = $this->bar_input( [], new Kadence_Blocks_CSS() )->context();

		$this->assertSame( $expected, Kadence_Blocks_Progress_Bar_Number_Font_Merge::resolve( $number, $label, $context ) );
	}

	/**
	 * @return Generator
	 */
	public function fontProvider(): Generator {
		$this->load();

		yield 'a color replaces the color of the label' => [
			'number'   => [ 'color' => '#00f' ],
			'label'    => [
				'color' => '#f00',
				'size'  => [ '14', '', '' ],
			],
			'expected' => [
				'color' => '#00f',
				'size'  => [ '14', '', '' ],
			],
		];
		yield 'the unit of the line height goes with the line height' => [
			'number'   => [
				'lineHeight' => [ 3, '', '' ],
				'lineType'   => 'px',
			],
			'label'    => [ 'lineType' => 'em' ],
			'expected' => [
				'lineType'   => 'px',
				'lineHeight' => [ 3, '', '' ],
			],
		];
		yield 'a line height saved without a unit keeps the unit of the label' => [
			'number'   => [ 'lineHeight' => [ 3, '', '' ] ],
			'label'    => [ 'lineType' => 'em' ],
			'expected' => [
				'lineType'   => 'em',
				'lineHeight' => [ 3, '', '' ],
			],
		];
		yield 'a unit with no line height is dropped' => [
			'number'   => [
				'lineHeight' => [ '', '', '' ],
				'lineType'   => 'px',
			],
			'label'    => [ 'lineType' => 'em' ],
			'expected' => [ 'lineType' => 'em' ],
		];
	}

	/**
	 * A percentage font that was saved as a string reads as no changes: the label font is kept, with a warning as it always had.
	 *
	 * @return void
	 */
	public function testNumberFontSavedAsStringKeepsTheLabelFont(): void {
		$warnings = 0;

		set_error_handler(
			static function () use ( &$warnings ) {
				++$warnings;

				return true;
			}
		);

		$css = $this->write_bar(
			new Kadence_Blocks_Progress_Bar_Number_Font_Css(),
			[
				'numberFont' => 'abc',
				'labelFont'  => [ 'color' => '#f00' ],
			] 
		);

		restore_error_handler();

		$this->assertSameCss( '.s{color:#f00;}', $css );
		$this->assertSame( 1, $warnings );
	}

	/**
	 * A label font that was saved as a string fails the way it always did: it cannot be merged.
	 *
	 * @return void
	 */
	public function testLabelFontSavedAsStringFails(): void {
		$this->expectException( \TypeError::class );

		$this->write_bar(
			new Kadence_Blocks_Progress_Bar_Number_Font_Css(),
			[
				'numberFont' => [ 'color' => '#00f' ],
				'labelFont'  => 'abc',
			] 
		);
	}

	/**
	 * The size of the mask is 11.5 pixels of height for every unit of the progress width, and one mask wide per repeat.
	 *
	 * @dataProvider sizeProvider
	 *
	 * @param Kadence_Blocks_Progress_Bar_Mask_Size $size   The size.
	 * @param string                                $height The height expected.
	 * @param string                                $width  The width expected.
	 *
	 * @return void
	 */
	public function testMaskSize( Kadence_Blocks_Progress_Bar_Mask_Size $size, string $height, string $width ): void {
		$this->assertSame( $height, $size->height_css() );
		$this->assertSame( $width, $size->width_css() );
	}

	/**
	 * @return Generator
	 */
	public function sizeProvider(): Generator {
		$this->load();

		yield 'desktop with the width saved' => [
			'size'   => Kadence_Blocks_Progress_Bar_Mask_Size::desktop( 4, 5 ),
			'height' => '46px',
			'width'  => '230px',
		];
		yield 'desktop with no width saved' => [
			'size'   => Kadence_Blocks_Progress_Bar_Mask_Size::desktop( null, 5 ),
			'height' => '23px',
			'width'  => '115px',
		];
		yield 'desktop with a width that is no number' => [
			'size'   => Kadence_Blocks_Progress_Bar_Mask_Size::desktop( 'abc', 5 ),
			'height' => '80px',
			'width'  => '400px',
		];
		yield 'desktop with no repeat keeps the zero width' => [
			'size'   => Kadence_Blocks_Progress_Bar_Mask_Size::desktop( 2, 0 ),
			'height' => '23px',
			'width'  => '0px',
		];
		yield 'tablet with the width saved' => [
			'size'   => Kadence_Blocks_Progress_Bar_Mask_Size::responsive( 3, 2 ),
			'height' => '34.5px',
			'width'  => '69px',
		];
		yield 'tablet with no width saved writes nothing' => [
			'size'   => Kadence_Blocks_Progress_Bar_Mask_Size::responsive( null, 2 ),
			'height' => '',
			'width'  => '',
		];
		yield 'tablet with no repeat writes no width' => [
			'size'   => Kadence_Blocks_Progress_Bar_Mask_Size::responsive( 3, 0 ),
			'height' => '34.5px',
			'width'  => '',
		];
	}

	/**
	 * The mask is the star, a named mask or a custom one, repeated and spread over the bar.
	 *
	 * @dataProvider maskProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $expected   The image, the repeat, the position and the aspect ratio expected.
	 *
	 * @return void
	 */
	public function testMask( array $attributes, array $expected ): void {
		$mask = new Kadence_Blocks_Progress_Bar_Mask( $attributes );

		$this->assertSame(
			$expected,
			[
				'image'    => $mask->image(),
				'repeat'   => $mask->repeat(),
				'position' => $mask->position(),
				'ratio'    => $mask->aspect_ratio(),
			]
		);
	}

	/**
	 * @return Generator
	 */
	public function maskProvider(): Generator {
		$this->load();

		$base = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/';

		yield 'the star, five times' => [
			'attributes' => [],
			'expected'   => [
				'image'    => str_repeat( 'url(' . $base . 'star.svg),', 4 ) . 'url(' . $base . 'star.svg)',
				'repeat'   => 'no-repeat,no-repeat,no-repeat,no-repeat,no-repeat',
				'position' => '0%,25%,50%,75%,100%',
				'ratio'    => '5/1',
			],
		];
		yield 'one named mask, once' => [
			'attributes' => [
				'maskSvg'        => 'heart',
				'maskIterations' => 1,
			],
			'expected'   => [
				'image'    => 'url(' . $base . 'heart.svg)',
				'repeat'   => 'no-repeat',
				'position' => '0%',
				'ratio'    => '1/1',
			],
		];
		yield 'a custom mask' => [
			'attributes' => [
				'maskSvg'        => 'custom',
				'maskUrl'        => 'https://example.com/a.svg',
				'maskIterations' => 2,
			],
			'expected'   => [
				'image'    => 'url(https://example.com/a.svg),url(https://example.com/a.svg)',
				'repeat'   => 'no-repeat,no-repeat',
				'position' => '0%,100%',
				'ratio'    => '2/1',
			],
		];
		yield 'a custom mask with no address is the star' => [
			'attributes' => [
				'maskSvg'        => 'custom',
				'maskIterations' => 1,
			],
			'expected'   => [
				'image'    => 'url(' . $base . 'star.svg)',
				'repeat'   => 'no-repeat',
				'position' => '0%',
				'ratio'    => '1/1',
			],
		];
	}

	/**
	 * The size of the mask of a device is the one worked out for it.
	 *
	 * @return void
	 */
	public function testMaskKnowsTheSizeOfEveryDevice(): void {
		$mask = new Kadence_Blocks_Progress_Bar_Mask(
			[
				'progressWidth'       => 4,
				'progressWidthTablet' => 3,
			]
		);

		$this->assertSame( '46px', $mask->size( 'desktop' )->height_css() );
		$this->assertSame( '34.5px', $mask->size( 'tablet' )->height_css() );
		$this->assertSame( '', $mask->size( 'mobile' )->height_css() );
	}

	/**
	 * The sections of the mask write the image and the sizes from the mask they are given.
	 *
	 * @return void
	 */
	public function testMaskSections(): void {
		$mask = new Kadence_Blocks_Progress_Bar_Mask(
			[
				'maskIterations'      => 2,
				'progressWidth'       => 4,
				'progressWidthMobile' => 3,
			]
		);
		$base = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/star.svg';

		$image = $this->write_bar( new Kadence_Blocks_Progress_Bar_Mask_Image_Css(), [], [ 'mask' => $mask ] );
		$size  = $this->write_bar( new Kadence_Blocks_Progress_Bar_Mask_Dimensions_Css( 'mobile' ), [], [ 'mask' => $mask ] );

		$this->assertSameCss(
			'.s{-webkit-mask-image:url(' . $base . '),url(' . $base . ');mask-image:url(' . $base . '),url(' . $base . ');-webkit-mask-size:contain;mask-size:contain;'
			. '-webkit-mask-repeat:no-repeat,no-repeat;mask-repeat:no-repeat,no-repeat;-webkit-mask-position:0%,100%;mask-position:0%,100%;aspect-ratio:2/1;}',
			$image
		);
		$this->assertSameCss( '.s{height:34.5px;width:69px;}', $size );
	}

	/**
	 * A bar of masks writes the image, the size on desktop and the sizes of the devices that have one.
	 *
	 * @return void
	 */
	public function testMaskBar(): void {
		$css = $this->write_bar(
			new Kadence_Blocks_Progress_Bar_Mask_Bar_Css(),
			[
				'maskIterations'      => 1,
				'progressWidthTablet' => 2,
			]
		);

		$base = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/star.svg';

		$this->assertSameCss(
			'.kb-progress-bar-containerabc .kb-progress-bar-abc{-webkit-mask-image:url(' . $base . ');mask-image:url(' . $base . ');'
			. '-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:0%;mask-position:0%;aspect-ratio:1/1;'
			. 'height:23px;width:23px;max-width:100%;}' . self::TABLET . '{.kb-progress-bar-containerabc .kb-progress-bar-abc{height:23px;width:23px;}}',
			$css
		);
	}

	/**
	 * Load the classes the providers build their data from, as the providers run before the set up.
	 *
	 * @return void
	 */
	private function load(): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/progress-bar/loader.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
	}
}
