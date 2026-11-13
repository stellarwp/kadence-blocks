<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Countdown;

use Generator;
use Kadence_Blocks_Countdown_Any_Condition;
use Kadence_Blocks_Countdown_Font;
use Kadence_Blocks_Countdown_Font_Family_Css;
use Kadence_Blocks_Countdown_Font_Measure_Css;
use Kadence_Blocks_Countdown_Font_Size_Css;
use Kadence_Blocks_Countdown_Font_Used_Condition;
use Kadence_Blocks_Countdown_Font_Value_Css;
use Kadence_Blocks_Countdown_Font_Weight_Css;
use Kadence_Blocks_Countdown_Side_Map;
use Kadence_Blocks_Countdown_Sides_Css;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Input_Condition;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections, the conditions and the font of the countdown CSS, one by one.
 */
final class CountdownSectionsTest extends Free_Section_Test_Case {

	private const SELECTOR = '.part-abc';

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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', self::SELECTOR ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		$this->load();

		yield from $this->sidesProvider();
		yield from $this->fontSizeProvider();
		yield from $this->fontTextProvider();
	}

	/**
	 * @return Generator
	 */
	private function sidesProvider(): Generator {
		$radius = Kadence_Blocks_Countdown_Side_Map::radius();

		yield 'sides write every numeric side in pixels' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', $radius, null ),
			'attributes' => [ 'box' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.part-abc{border-top-left-radius:1px;border-top-right-radius:2px;border-bottom-right-radius:3px;border-bottom-left-radius:4px;}',
		];
		yield 'sides skip what is not numeric and missing sides' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', $radius, null ),
			'attributes' => [ 'box' => [ '', 'x', '5' ] ],
			'expected'   => '.part-abc{border-bottom-right-radius:5px;}',
		];
		yield 'sides write nothing when the attribute is not a list' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', $radius, null ),
			'attributes' => [ 'box' => '5' ],
			'expected'   => '',
		];
		yield 'sides write nothing when the attribute is missing' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', $radius, null ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'sides use the saved unit' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', Kadence_Blocks_Countdown_Side_Map::padding(), 'unit' ),
			'attributes' => [
				'box'  => [ 1, 2, 3, 4 ],
				'unit' => 'em',
			],
			'expected'   => '.part-abc{padding-top:1em;padding-right:2em;padding-bottom:3em;padding-left:4em;}',
		];
		yield 'sides fall back to pixels when the unit is not saved' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', Kadence_Blocks_Countdown_Side_Map::vertical_padding(), 'unit' ),
			'attributes' => [ 'box' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.part-abc{padding-top:1px;padding-bottom:3px;}',
		];
		yield 'sides write the border widths of the top and the bottom' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', Kadence_Blocks_Countdown_Side_Map::vertical_border_width(), null ),
			'attributes' => [ 'box' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.part-abc{border-top-width:1px;border-bottom-width:3px;}',
		];
		yield 'sides write every border width' => [
			'section'    => new Kadence_Blocks_Countdown_Sides_Css( 'box', Kadence_Blocks_Countdown_Side_Map::border_width(), null ),
			'attributes' => [ 'box' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.part-abc{border-top-width:1px;border-right-width:2px;border-bottom-width:3px;border-left-width:4px;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function fontSizeProvider(): Generator {
		$size = function ( $index, $selector = null ) {
			return new Kadence_Blocks_Countdown_Font_Size_Css( 'font', $index, $selector );
		};

		yield 'font size writes the size with the default unit' => [
			'section'    => $size( 0 ),
			'attributes' => [ 'font' => [ [ 'size' => [ 12, 14, 16 ] ] ] ],
			'expected'   => '.part-abc{font-size:12px;}',
		];
		yield 'font size writes the size of the device with the saved unit' => [
			'section'    => $size( 1 ),
			'attributes' => [
				'font' => [
					[
						'size'     => [ 12, 14, 16 ],
						'sizeType' => 'em',
					],
				],
			],
			'expected'   => '.part-abc{font-size:14em;}',
		];
		yield 'font size writes the size of a preset' => [
			'section'    => $size( 2 ),
			'attributes' => [ 'font' => [ [ 'size' => [ '', '', 'md' ] ] ] ],
			'expected'   => '.part-abc{font-size:var(--global-kb-font-size-md, 1.25rem);}',
		];
		yield 'font size writes under its own selector' => [
			'section'    => $size( 0, '.wrap-{id}' ),
			'attributes' => [ 'font' => [ [ 'size' => [ 12 ] ] ] ],
			'expected'   => '.wrap-abc{font-size:12px;}',
		];
		yield 'font size keeps the current selector when there is no size' => [
			'section'    => $size( 0, '.wrap-{id}' ),
			'attributes' => [ 'font' => [ [ 'size' => [ '' ] ] ] ],
			'expected'   => '',
		];
		yield 'font size writes nothing when the sizes are not a list' => [
			'section'    => $size( 0 ),
			'attributes' => [ 'font' => [ [ 'size' => 12 ] ] ],
			'expected'   => '',
		];
		yield 'font size writes nothing without a font' => [
			'section'    => $size( 0 ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function fontTextProvider(): Generator {
		yield 'line height uses the saved unit' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Measure_Css( 'font', 'lineHeight', 'lineType', 'line-height', 1 ),
			'attributes' => [
				'font' => [
					[
						'lineHeight' => [ 1, 2, 3 ],
						'lineType'   => 'em',
					],
				],
			],
			'expected'   => '.part-abc{line-height:2em;}',
		];
		yield 'letter spacing uses pixels without a unit' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Measure_Css( 'font', 'letterSpacing', 'letterType', 'letter-spacing', 0 ),
			'attributes' => [ 'font' => [ [ 'letterSpacing' => [ 3 ] ] ] ],
			'expected'   => '.part-abc{letter-spacing:3px;}',
		];
		yield 'line height writes nothing when it is empty' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Measure_Css( 'font', 'lineHeight', 'lineType', 'line-height', 0 ),
			'attributes' => [ 'font' => [ [ 'lineHeight' => [ '' ] ] ] ],
			'expected'   => '',
		];
		yield 'line height writes nothing when it is not a list' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Measure_Css( 'font', 'lineHeight', 'lineType', 'line-height', 0 ),
			'attributes' => [ 'font' => [ [ 'lineHeight' => 4 ] ] ],
			'expected'   => '',
		];
		yield 'font value writes the text transform' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Value_Css( 'font', 'textTransform', 'text-transform' ),
			'attributes' => [ 'font' => [ [ 'textTransform' => 'uppercase' ] ] ],
			'expected'   => '.part-abc{text-transform:uppercase;}',
		];
		yield 'font value writes nothing when it is empty' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Value_Css( 'font', 'style', 'font-style' ),
			'attributes' => [ 'font' => [ [ 'style' => '' ] ] ],
			'expected'   => '',
		];
		yield 'font family writes the family' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Family_Css( 'font' ),
			'attributes' => [ 'font' => [ [ 'family' => 'Arial' ] ] ],
			'expected'   => '.part-abc{font-family:Arial;}',
		];
		yield 'font family quotes a family with spaces and loads a google font' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Family_Css( 'font' ),
			'attributes' => [
				'font' => [
					[
						'family'     => 'Open Sans',
						'google'     => true,
						'loadGoogle' => true,
						'variant'    => '700',
						'subset'     => 'latin',
					],
				],
			],
			'expected'   => ".part-abc{font-family:'Open Sans';}",
		];
		yield 'font family writes nothing without a family' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Family_Css( 'font' ),
			'attributes' => [ 'font' => [ [ 'family' => '' ] ] ],
			'expected'   => '',
		];
		yield 'font weight writes the weight' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Weight_Css( 'font' ),
			'attributes' => [ 'font' => [ [ 'weight' => '700' ] ] ],
			'expected'   => '.part-abc{font-weight:700;}',
		];
		yield 'font weight skips the regular weight' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Weight_Css( 'font' ),
			'attributes' => [ 'font' => [ [ 'weight' => 'regular' ] ] ],
			'expected'   => '',
		];
		yield 'font weight skips an empty weight' => [
			'section'    => new Kadence_Blocks_Countdown_Font_Weight_Css( 'font' ),
			'attributes' => [ 'font' => [ [ 'weight' => '' ] ] ],
			'expected'   => '',
		];
	}

	/**
	 * A condition is met, or not, for the attributes.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param Kadence_Blocks_Css_Input_Condition $condition  The condition.
	 * @param array<string, mixed>               $attributes The block attributes.
	 * @param bool                               $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testCondition( Kadence_Blocks_Css_Input_Condition $condition, array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		$this->load();

		$any  = new Kadence_Blocks_Countdown_Any_Condition( [ 'color' ], [ 'sides' ] );
		$used = new Kadence_Blocks_Countdown_Font_Used_Condition( 'font', 'color' );

		yield 'any is met by a saved attribute, even an empty one' => [
			'condition'  => $any,
			'attributes' => [ 'color' => '' ],
			'expected'   => true,
		];
		yield 'any is met by a list' => [
			'condition'  => $any,
			'attributes' => [ 'sides' => [] ],
			'expected'   => true,
		];
		yield 'any is not met by an attribute that is not a list' => [
			'condition'  => $any,
			'attributes' => [ 'sides' => '1' ],
			'expected'   => false,
		];
		yield 'any is not met by a null attribute' => [
			'condition'  => $any,
			'attributes' => [ 'color' => null ],
			'expected'   => false,
		];
		yield 'any is not met by nothing' => [
			'condition'  => $any,
			'attributes' => [],
			'expected'   => false,
		];
		yield 'font used is met by a font' => [
			'condition'  => $used,
			'attributes' => [ 'font' => [ [ 'size' => [ 1 ] ] ] ],
			'expected'   => true,
		];
		yield 'font used is met by a color' => [
			'condition'  => $used,
			'attributes' => [ 'color' => '#fff' ],
			'expected'   => true,
		];
		yield 'font used is not met by an empty font and no color' => [
			'condition'  => $used,
			'attributes' => [
				'font'  => [ [] ],
				'color' => '',
			],
			'expected'   => false,
		];
		yield 'font used is not met by a font that is not a list of fonts' => [
			'condition'  => $used,
			'attributes' => [ 'font' => 'x' ],
			'expected'   => false,
		];
	}

	/**
	 * The font reads its settings from the first entry of the saved list.
	 *
	 * @dataProvider fontProvider
	 *
	 * @param mixed $attribute The saved font attribute.
	 * @param bool  $empty     Whether the font is empty.
	 * @param bool  $google    Whether the font has to be loaded from Google.
	 *
	 * @return void
	 */
	public function testFont( $attribute, bool $empty, bool $google ): void {
		$font = new Kadence_Blocks_Countdown_Font( $attribute );

		$this->assertSame( $empty, $font->is_empty() );
		$this->assertSame( $google, $font->is_google() );
	}

	/**
	 * @return Generator
	 */
	public function fontProvider(): Generator {
		$this->load();

		yield 'nothing saved' => [
			'attribute' => null,
			'empty'     => true,
			'google'    => false,
		];
		yield 'a list of nothing' => [
			'attribute' => [],
			'empty'     => true,
			'google'    => false,
		];
		yield 'an entry that is not a font' => [
			'attribute' => [ 'x' ],
			'empty'     => true,
			'google'    => false,
		];
		yield 'a font that is not from google' => [
			'attribute' => [ [ 'family' => 'a' ] ],
			'empty'     => false,
			'google'    => false,
		];
		yield 'a google font that loads by default' => [
			'attribute' => [ [ 'google' => true ] ],
			'empty'     => false,
			'google'    => true,
		];
		yield 'a google font that loads' => [
			'attribute' => [
				[
					'google'     => true,
					'loadGoogle' => true,
				],
			],
			'empty'     => false,
			'google'    => true,
		];
		yield 'a google font that does not load' => [
			'attribute' => [
				[
					'google'     => true,
					'loadGoogle' => false,
				],
			],
			'empty'     => false,
			'google'    => false,
		];
	}

	/**
	 * Load the classes under test. Data providers run before the set up.
	 *
	 * @return void
	 */
	private function load(): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/countdown/loader.php';
	}
}
