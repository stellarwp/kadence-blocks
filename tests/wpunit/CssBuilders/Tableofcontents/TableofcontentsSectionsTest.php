<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Tableofcontents;

use Error;
use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Tableofcontents_Border_Condition;
use Kadence_Blocks_Tableofcontents_Css;
use Kadence_Blocks_Tableofcontents_Font_Family;
use Kadence_Blocks_Tableofcontents_Font_Size;
use Kadence_Blocks_Tableofcontents_Letter_Spacing;
use Kadence_Blocks_Tableofcontents_Line_Height;
use Kadence_Blocks_Tableofcontents_List_Gap;
use Kadence_Blocks_Tableofcontents_Max_Width;
use Kadence_Blocks_Tableofcontents_Mobile_Line_Height;
use Kadence_Blocks_Tableofcontents_Shadow;
use Kadence_Blocks_Tableofcontents_Text_Property;

/**
 * The sections of the table of contents CSS, one by one.
 */
final class TableofcontentsSectionsTest extends Tableofcontents_Test_Case {

	private const LI = '.kb-table-of-content-nav.kb-table-of-content-idabc .kb-table-of-content-list li';

	private const SUB = '.kb-table-of-content-nav.kb-table-of-content-idabc .kb-table-of-content-list li .kb-table-of-contents-list-sub';

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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes ) );
	}

	/**
	 * A border condition is met, or not, for the attributes.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testBorderCondition( array $attributes, bool $expected ): void {
		$condition = new Kadence_Blocks_Tableofcontents_Border_Condition( 'containerBorderColor', 'containerBorder' );

		$this->assertSame( $expected, $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * Border widths that are not a list fail, as they always did.
	 *
	 * @return void
	 */
	public function testBorderWidthsThatAreNotAListFail(): void {
		$condition = new Kadence_Blocks_Tableofcontents_Border_Condition( 'containerBorderColor', 'containerBorder' );

		$this->expectException( Error::class );

		$condition->is_met( $this->input( [ 'containerBorder' => 'thick' ], new Kadence_Blocks_CSS() ) );
	}

	/**
	 * The whole block builds its CSS under its own style id, with one rule per part of the block.
	 *
	 * @return void
	 */
	public function testBuildWritesTheBlockCss(): void {
		$builder = new Kadence_Blocks_Tableofcontents_Css(
			new Kadence_Blocks_Css_Block_Context(
				'tableofcontents',
				static function () {
					return null;
				}
			)
		);

		$output = $builder->build(
			[
				'titleColor'  => '#112233',
				'contentSize' => [ 12 ],
			],
			new Kadence_Blocks_CSS(),
			'xyz',
			'toc-unit' 
		);

		$this->assertSameCss(
			'.kb-table-of-content-nav.kb-table-of-content-idxyz .kb-table-of-contents-title-wrap{color:#112233;}'
			. '.kb-table-of-content-nav.kb-table-of-content-idxyz .kb-table-of-contents-title{color:#112233;}'
			. '.kb-table-of-content-nav.kb-table-of-content-idxyz .kb-table-of-content-wrap .kb-table-of-content-list{font-size:12px;}',
			(string) $output
		);
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		yield 'a border color' => [
			'attributes' => [ 'containerBorderColor' => '#000' ],
			'expected'   => true,
		];
		yield 'a width on one side' => [
			'attributes' => [ 'containerBorder' => [ null, null, null, 0 ] ],
			'expected'   => true,
		];
		yield 'widths that are not numbers' => [
			'attributes' => [ 'containerBorder' => [ '', 'x', null, [] ] ],
			'expected'   => false,
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-tableofcontents-css.php';

		yield from $this->containerProvider();
		yield from $this->fontProvider();
		yield from $this->deviceProvider();
	}

	/**
	 * @return Generator
	 */
	private function containerProvider(): Generator {
		$on = [ 'displayShadow' => true ];

		yield 'a saved shadow' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Shadow(),
			'attributes' => $on + [
				'shadow' => [
					[
						'color'   => '#000000',
						'opacity' => 0.5,
						'hOffset' => 1,
						'vOffset' => 2,
						'blur'    => 3,
						'spread'  => 4,
						'inset'   => false,
					],
				],
			],
			'expected'   => '{box-shadow:1px 2px 3px 4px rgba(0, 0, 0, 0.5);}',
		];
		yield 'the default shadow when none was saved' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Shadow(),
			'attributes' => $on,
			'expected'   => '{box-shadow:rgba(0, 0, 0, 0.2) 0px 0px 14px 0px;}',
		];
		yield 'the default shadow when the saved one is not a list of shadows' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Shadow(),
			'attributes' => $on + [ 'shadow' => [ 'x' ] ],
			'expected'   => '{box-shadow:rgba(0, 0, 0, 0.2) 0px 0px 14px 0px;}',
		];
		yield 'no shadow when it is off' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Shadow(),
			'attributes' => [ 'displayShadow' => false ],
			'expected'   => '',
		];
		yield 'maximum width in pixels' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Max_Width(),
			'attributes' => [ 'maxWidth' => 500 ],
			'expected'   => '{max-width:500px;}',
		];
		yield 'maximum width in its unit' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Max_Width(),
			'attributes' => [
				'maxWidth'     => 50,
				'maxWidthType' => '%',
			],
			'expected'   => '{max-width:50%;}',
		];
		yield 'no maximum width' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Max_Width(),
			'attributes' => [ 'maxWidth' => '' ],
			'expected'   => '',
		];
		yield 'a text property' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Text_Property( 'text-align', 'titleAlign' ),
			'attributes' => [ 'titleAlign' => 'center' ],
			'expected'   => '{text-align:center;}',
		];
		yield 'a text property that was not saved' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Text_Property( 'text-align', 'titleAlign' ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function fontProvider(): Generator {
		yield 'font size in its unit' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Font_Size( 'title', 0 ),
			'attributes' => [
				'titleSize'     => [ 20 ],
				'titleSizeType' => 'em',
			],
			'expected'   => '{font-size:20em;}',
		];
		yield 'font size in pixels when no unit was saved' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Font_Size( 'content', 1 ),
			'attributes' => [
				'contentSize'     => [ 10, 14 ],
				'contentSizeType' => '',
			],
			'expected'   => '{font-size:14px;}',
		];
		yield 'no font size' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Font_Size( 'content', 2 ),
			'attributes' => [ 'contentSize' => [ 10, 14 ] ],
			'expected'   => '',
		];
		yield 'line height in its unit' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Line_Height( 'title', 1 ),
			'attributes' => [
				'titleLineHeight' => [ 1, 2 ],
				'titleLineType'   => 'em',
			],
			'expected'   => '{line-height:2em;}',
		];
		yield 'line height in pixels' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Line_Height( 'content', 0 ),
			'attributes' => [ 'contentLineHeight' => [ 30 ] ],
			'expected'   => '{line-height:30px;}',
		];
		yield 'line height on mobile' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Mobile_Line_Height( 'title' ),
			'attributes' => [
				'titleLineHeight' => [ 1, 2, 3 ],
				'titleLineType'   => 'rem',
			],
			'expected'   => '{line-height:3rem;}',
		];
		yield 'line height on mobile in pixels' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Mobile_Line_Height( 'content' ),
			'attributes' => [ 'contentLineHeight' => [ 1, 2, 3 ] ],
			'expected'   => '{line-height:3px;}',
		];
		yield 'no line height on mobile when it is not a list' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Mobile_Line_Height( 'content' ),
			'attributes' => [ 'contentLineHeight' => 'abc' ],
			'expected'   => '',
		];
		yield 'no line height on mobile when it is empty' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Mobile_Line_Height( 'content' ),
			'attributes' => [ 'contentLineHeight' => [ 1, 2 ] ],
			'expected'   => '',
		];
		yield 'letter spacing' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Letter_Spacing( 'title' ),
			'attributes' => [ 'titleLetterSpacing' => 2 ],
			'expected'   => '{letter-spacing:2px;}',
		];
		yield 'no letter spacing' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Letter_Spacing( 'title' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a font family' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Font_Family( 'title' ),
			'attributes' => [ 'titleTypography' => 'Open Sans' ],
			'expected'   => "{font-family:'Open Sans';}",
		];
		yield 'a Google font family' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Font_Family( 'content' ),
			'attributes' => [
				'contentTypography'     => 'Lato',
				'contentGoogleFont'     => true,
				'contentLoadGoogleFont' => true,
				'contentFontVariant'    => '700',
				'contentFontSubset'     => 'latin',
			],
			'expected'   => '{font-family:Lato;}',
		];
		yield 'a Google font family that is not to be loaded' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Font_Family( 'content' ),
			'attributes' => [
				'contentTypography'     => 'Lato',
				'contentGoogleFont'     => true,
				'contentLoadGoogleFont' => false,
			],
			'expected'   => '{font-family:Lato;}',
		];
		yield 'no font family' => [
			'section'    => new Kadence_Blocks_Tableofcontents_Font_Family( 'content' ),
			'attributes' => [ 'contentGoogleFont' => true ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function deviceProvider(): Generator {
		yield 'list gap on desktop' => [
			'section'    => new Kadence_Blocks_Tableofcontents_List_Gap( 0, true ),
			'attributes' => [ 'listGap' => [ 8 ] ],
			'expected'   => self::LI . '{margin-bottom:8px;}' . self::SUB . '{margin-top:8px;}',
		];
		yield 'list gap on tablet' => [
			'section'    => new Kadence_Blocks_Tableofcontents_List_Gap( 1, false ),
			'attributes' => [ 'listGap' => [ 8, 6 ] ],
			'expected'   => self::LI . '{margin-bottom:6px;}' . self::SUB . '{margin-top:6px;}',
		];
		yield 'a list gap that is not a list is read on tablet only' => [
			'section'    => new Kadence_Blocks_Tableofcontents_List_Gap( 1, false ),
			'attributes' => [ 'listGap' => 'abc' ],
			'expected'   => self::LI . '{margin-bottom:bpx;}' . self::SUB . '{margin-top:bpx;}',
		];
		yield 'a list gap that is not a list is not read on mobile' => [
			'section'    => new Kadence_Blocks_Tableofcontents_List_Gap( 2, true ),
			'attributes' => [ 'listGap' => 'abc' ],
			'expected'   => '',
		];
		yield 'no list gap' => [
			'section'    => new Kadence_Blocks_Tableofcontents_List_Gap( 0, true ),
			'attributes' => [ 'listGap' => [ 0 ] ],
			'expected'   => '',
		];
	}
}
