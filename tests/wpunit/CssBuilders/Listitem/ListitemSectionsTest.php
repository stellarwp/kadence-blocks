<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Listitem;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Listitem_Alpha_Color_Css;
use Kadence_Blocks_Listitem_Border_Radius_Css;
use Kadence_Blocks_Listitem_Border_Style_Css;
use Kadence_Blocks_Listitem_Font_Family_Css;
use Kadence_Blocks_Listitem_Font_Size_Css;
use Kadence_Blocks_Listitem_Font_Weight_Css;
use Kadence_Blocks_Listitem_Important_Css;
use Kadence_Blocks_Listitem_Mark_Color_Css;
use Kadence_Blocks_Listitem_Plain_Background_Condition;
use Kadence_Blocks_Listitem_Size_Css;
use Kadence_Blocks_Listitem_Styled_Condition;
use Kadence_Blocks_Listitem_Unit_Css;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections of the list item CSS, one by one.
 */
final class ListitemSectionsTest extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/listitem/loader.php';
	}

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
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', '.sel' ) );
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
		$this->assertSame( $expected, $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The font of the highlight is only loaded from Google when it is a Google font that is to be loaded.
	 *
	 * @dataProvider googleProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<int, string>   $expected   The families that are loaded.
	 *
	 * @return void
	 */
	public function testFontFamilyLoadsGoogleFonts( array $attributes, array $expected ): void {
		$css = new Kadence_Blocks_CSS();
		$css->clear();

		( new Kadence_Blocks_Listitem_Font_Family_Css() )->write( $this->input( $attributes, $css ) );

		$fonts = array_keys( $css->fonts_output() );
		$css->clear();

		$this->assertSame( $expected, $fonts );
	}

	/**
	 * @return Generator
	 */
	public function googleProvider(): Generator {
		$family = [ 'markTypography' => 'Family' ];

		yield 'a Google font' => [
			'attributes' => $family + [ 'markGoogleFont' => true ],
			'expected'   => [ 'Family' ],
		];
		yield 'a Google font that is to be loaded' => [
			'attributes' => $family + [
				'markGoogleFont'     => true,
				'markLoadGoogleFont' => true,
			],
			'expected'   => [ 'Family' ],
		];
		yield 'a Google font that is not to be loaded' => [
			'attributes' => $family + [
				'markGoogleFont'     => true,
				'markLoadGoogleFont' => false,
			],
			'expected'   => [],
		];
		yield 'a font that is not a Google font' => [
			'attributes' => $family + [ 'markLoadGoogleFont' => true ],
			'expected'   => [],
		];
		yield 'no font' => [
			'attributes' => [ 'markGoogleFont' => true ],
			'expected'   => [],
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/listitem/loader.php';

		yield 'a style that is not the default' => [
			'condition'  => new Kadence_Blocks_Listitem_Styled_Condition(),
			'attributes' => [ 'style' => 'stacked' ],
			'expected'   => true,
		];
		yield 'the default style' => [
			'condition'  => new Kadence_Blocks_Listitem_Styled_Condition(),
			'attributes' => [ 'style' => 'default' ],
			'expected'   => false,
		];
		yield 'no style' => [
			'condition'  => new Kadence_Blocks_Listitem_Styled_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'no gradient' => [
			'condition'  => new Kadence_Blocks_Listitem_Plain_Background_Condition(),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'a text gradient' => [
			'condition'  => new Kadence_Blocks_Listitem_Plain_Background_Condition(),
			'attributes' => [ 'enableMarkGradient' => true ],
			'expected'   => false,
		];
		yield 'a background gradient' => [
			'condition'  => new Kadence_Blocks_Listitem_Plain_Background_Condition(),
			'attributes' => [ 'enableMarkBackgroundGradient' => true ],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/listitem/loader.php';

		yield 'a number is the size of the icon' => [
			'section'    => new Kadence_Blocks_Listitem_Size_Css(),
			'attributes' => [ 'size' => '14' ],
			'expected'   => '.sel{font-size:14px !important;}',
		];
		yield 'a size that is not a number is dropped' => [
			'section'    => new Kadence_Blocks_Listitem_Size_Css(),
			'attributes' => [ 'size' => 'big' ],
			'expected'   => '',
		];
		yield 'an important color' => [
			'section'    => new Kadence_Blocks_Listitem_Important_Css( 'color', 'color', ' !important', true ),
			'attributes' => [ 'color' => '#ff0000' ],
			'expected'   => '.sel{color:#ff0000 !important;}',
		];
		yield 'an important background has no space before the flag' => [
			'section'    => new Kadence_Blocks_Listitem_Important_Css( 'background-color', 'background', '!important', true ),
			'attributes' => [ 'background' => 'palette3' ],
			'expected'   => '.sel{background-color:var(--global-palette3, #1A202C)!important;}',
		];
		yield 'an important number with its unit' => [
			'section'    => new Kadence_Blocks_Listitem_Important_Css( 'padding', 'padding', 'px !important', false ),
			'attributes' => [ 'padding' => 6 ],
			'expected'   => '.sel{padding:6px !important;}',
		];
		yield 'an important value that is empty is dropped' => [
			'section'    => new Kadence_Blocks_Listitem_Important_Css( 'padding', 'padding', 'px !important', false ),
			'attributes' => [ 'padding' => 0 ],
			'expected'   => '',
		];
		yield 'a value with the unit of the highlight' => [
			'section'    => new Kadence_Blocks_Listitem_Unit_Css( 'letter-spacing', 'markLetterSpacing', null, 'markLetterSpacingType' ),
			'attributes' => [
				'markLetterSpacing'     => 2,
				'markLetterSpacingType' => 'em',
			],
			'expected'   => '.sel{letter-spacing:2em;}',
		];
		yield 'a value with pixels when there is no unit' => [
			'section'    => new Kadence_Blocks_Listitem_Unit_Css( 'letter-spacing', 'markLetterSpacing', null, 'markLetterSpacingType' ),
			'attributes' => [ 'markLetterSpacing' => 2 ],
			'expected'   => '.sel{letter-spacing:2px;}',
		];
		yield 'a value of a device' => [
			'section'    => new Kadence_Blocks_Listitem_Unit_Css( 'line-height', 'markLineHeight', 1, 'markLineType' ),
			'attributes' => [
				'markLineHeight' => [ 1, 2, 3 ],
				'markLineType'   => 'em',
			],
			'expected'   => '.sel{line-height:2em;}',
		];
		yield 'a value in pixels only' => [
			'section'    => new Kadence_Blocks_Listitem_Unit_Css( 'border-width', 'markBorderWidth', null, null ),
			'attributes' => [
				'markBorderWidth' => 3,
				'markLineType'    => 'em',
			],
			'expected'   => '.sel{border-width:3px;}',
		];
		yield 'the font size of a device' => [
			'section'    => new Kadence_Blocks_Listitem_Font_Size_Css( 1 ),
			'attributes' => [
				'markSize'     => [ 10, 20, 30 ],
				'markSizeType' => 'rem',
			],
			'expected'   => '.sel{font-size:20rem;}',
		];
		yield 'the font size in pixels when there is no unit' => [
			'section'    => new Kadence_Blocks_Listitem_Font_Size_Css( 2 ),
			'attributes' => [ 'markSize' => [ 10, 20, 30 ] ],
			'expected'   => '.sel{font-size:30px;}',
		];
		yield 'no font size for the device' => [
			'section'    => new Kadence_Blocks_Listitem_Font_Size_Css( 2 ),
			'attributes' => [ 'markSize' => [ 10, 20 ] ],
			'expected'   => '',
		];
		yield 'a font family with spaces is quoted' => [
			'section'    => new Kadence_Blocks_Listitem_Font_Family_Css(),
			'attributes' => [ 'markTypography' => 'Open Sans' ],
			'expected'   => ".sel{font-family:'Open Sans';}",
		];
		yield 'no font family' => [
			'section'    => new Kadence_Blocks_Listitem_Font_Family_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a bold weight' => [
			'section'    => new Kadence_Blocks_Listitem_Font_Weight_Css(),
			'attributes' => [ 'markFontWeight' => 'bold' ],
			'expected'   => '.sel{font-weight:bold;}',
		];
		yield 'the color of the highlight' => [
			'section'    => new Kadence_Blocks_Listitem_Mark_Color_Css(),
			'attributes' => [ 'markColor' => '#123456' ],
			'expected'   => '.sel{color:#123456;}',
		];
		yield 'the orange color of the highlight when it has none' => [
			'section'    => new Kadence_Blocks_Listitem_Mark_Color_Css(),
			'attributes' => [],
			'expected'   => '.sel{color:#f76a0c;}',
		];
		yield 'the gradient of the highlight' => [
			'section'    => new Kadence_Blocks_Listitem_Mark_Color_Css(),
			'attributes' => [
				'enableMarkGradient' => true,
				'markGradient'       => 'linear-gradient(red,blue)',
				'markColor'          => '#fff',
			],
			'expected'   => '.sel{background-image:linear-gradient(red,blue);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}',
		];
		yield 'a gradient that is on but empty writes nothing' => [
			'section'    => new Kadence_Blocks_Listitem_Mark_Color_Css(),
			'attributes' => [
				'enableMarkGradient' => true,
				'markColor'          => '#fff',
			],
			'expected'   => '',
		];
		yield 'a color with its opacity' => [
			'section'    => new Kadence_Blocks_Listitem_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity' ),
			'attributes' => [
				'markBG'        => '#ff0000',
				'markBGOpacity' => 0.5,
			],
			'expected'   => '.sel{background:rgba(255, 0, 0, 0.5);}',
		];
		yield 'a color with an empty opacity is opaque' => [
			'section'    => new Kadence_Blocks_Listitem_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity' ),
			'attributes' => [
				'markBG'        => '#ff0000',
				'markBGOpacity' => 0,
			],
			'expected'   => '.sel{background:#ff0000;}',
		];
		yield 'no color with an opacity' => [
			'section'    => new Kadence_Blocks_Listitem_Alpha_Color_Css( 'background', 'markBG', 'markBGOpacity' ),
			'attributes' => [ 'markBGOpacity' => 0.5 ],
			'expected'   => '',
		];
		yield 'a border style' => [
			'section'    => new Kadence_Blocks_Listitem_Border_Style_Css(),
			'attributes' => [ 'markBorderStyle' => 'dashed' ],
			'expected'   => '.sel{border-style:dashed;}',
		];
		yield 'the solid border style is the default' => [
			'section'    => new Kadence_Blocks_Listitem_Border_Style_Css(),
			'attributes' => [ 'markBorderStyle' => 'solid' ],
			'expected'   => '',
		];
		yield 'no border style' => [
			'section'    => new Kadence_Blocks_Listitem_Border_Style_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a border radius in the unit of the highlight' => [
			'section'    => new Kadence_Blocks_Listitem_Border_Radius_Css( 'markBorderRadius' ),
			'attributes' => [
				'markBorderRadius'     => [ 1, 2, 3, 4 ],
				'markBorderRadiusUnit' => '%',
			],
			'expected'   => '.sel{border-top-left-radius:1%;border-top-right-radius:2%;border-bottom-right-radius:3%;border-bottom-left-radius:4%;}',
		];
		yield 'a border radius in pixels when there is no unit' => [
			'section'    => new Kadence_Blocks_Listitem_Border_Radius_Css( 'markBorderRadius' ),
			'attributes' => [ 'markBorderRadius' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.sel{border-top-left-radius:1px;border-top-right-radius:2px;border-bottom-right-radius:3px;border-bottom-left-radius:4px;}',
		];
	}
}
