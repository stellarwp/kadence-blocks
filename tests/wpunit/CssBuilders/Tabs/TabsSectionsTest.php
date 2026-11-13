<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Tabs;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Device_Section;
use Kadence_Blocks_Css_Scoped_Section;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Tabs_Active_Background_Css;
use Kadence_Blocks_Tabs_Column_Width_Css;
use Kadence_Blocks_Tabs_Content_Border_Condition;
use Kadence_Blocks_Tabs_Font_Size_Css;
use Kadence_Blocks_Tabs_Gap;
use Kadence_Blocks_Tabs_Gap_List_Css;
use Kadence_Blocks_Tabs_Gap_Title_Css;
use Kadence_Blocks_Tabs_Google_Font_Css;
use Kadence_Blocks_Tabs_Gutter_Css;
use Kadence_Blocks_Tabs_Icon_Condition;
use Kadence_Blocks_Tabs_Layouts;
use Kadence_Blocks_Tabs_Line_Height_Css;
use Kadence_Blocks_Tabs_Percent_Width_Condition;
use Kadence_Blocks_Tabs_Quad_Pixels_Css;
use Kadence_Blocks_Tabs_Responsive_Range_Css;
use Kadence_Blocks_Tabs_Row_Layout_Condition;
use Kadence_Blocks_Tabs_Rtl_Margin;
use Kadence_Blocks_Tabs_Sanitized_Color_Css;
use Kadence_Blocks_Tabs_Subtitle;
use Kadence_Blocks_Tabs_Subtitle_Device_Condition;
use Kadence_Blocks_Tabs_Subtitle_Device_Size_Css;
use Kadence_Blocks_Tabs_Subtitle_Google_Font_Css;
use Kadence_Blocks_Tabs_Subtitle_Size_Css;
use Kadence_Blocks_Tabs_Title_Margin_Condition;
use Kadence_Blocks_Tabs_Unit_Value_Css;
use Kadence_Blocks_Tabs_Vertical;
use Kadence_Blocks_Tabs_Vertical_Layout_Condition;

/**
 * The sections of the tabs CSS, one by one.
 */
final class TabsSectionsTest extends Tabs_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	private const TITLES = '.wp-block-kadence-tabs .kt-tabs-idabc > .kt-tabs-title-list li .kt-tab-title';

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
		$this->assertSameCss( $expected, $this->write_tabs( $section, $attributes ) );
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
		$this->assertSame( $expected, $condition->is_met( $this->tabs_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * A content border that was saved as a string fails, as it always did: the builder takes its sides by reference.
	 *
	 * @return void
	 */
	public function testContentBorderSavedAsStringFails(): void {
		$this->expectException( \Error::class );

		( new Kadence_Blocks_Tabs_Content_Border_Condition() )->is_met( $this->tabs_input( [ 'contentBorder' => '5' ], new Kadence_Blocks_CSS() ) );
	}

	/**
	 * A device inherits the layout of the device before it, unless it has its own.
	 *
	 * @dataProvider layoutsProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param array<string, mixed> $expected   The layouts expected.
	 *
	 * @return void
	 */
	public function testLayouts( array $attributes, array $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Tabs_Layouts::resolve( $attributes ) );
	}

	/**
	 * The gap is the one saved when it is a number, and ten pixels otherwise.
	 *
	 * @dataProvider gapProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param mixed                $expected   The gap expected.
	 *
	 * @return void
	 */
	public function testGap( array $attributes, $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Tabs_Gap::resolve( $attributes ) );
	}

	/**
	 * The titles are spaced from the other side in a language that is read right to left.
	 *
	 * @dataProvider rtlProvider
	 *
	 * @param bool   $rtl      Whether the site reads right to left.
	 * @param string $expected The CSS expected.
	 *
	 * @return void
	 */
	public function testRtlMargin( bool $rtl, string $expected ): void {
		global $wp_locale;

		$direction                 = $wp_locale->text_direction;
		$wp_locale->text_direction = $rtl ? 'rtl' : 'ltr';

		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		Kadence_Blocks_Tabs_Rtl_Margin::write( $this->tabs_input( [], $css ), 7 );

		$wp_locale->text_direction = $direction;

		$this->assertSameCss( $expected, $css->css_output() );
	}

	/**
	 * The gap between the tabs is written on the list and on the titles, and mirrored when the language is read right to left.
	 *
	 * @return void
	 */
	public function testGapSectionsMirrorInRightToLeft(): void {
		global $wp_locale;

		$direction                 = $wp_locale->text_direction;
		$wp_locale->text_direction = 'rtl';

		$attributes = [
			'gutter' => [ 4, 5, 6 ],
		];
		$written    = $this->write_tabs( new Kadence_Blocks_Tabs_Gap_Title_Css(), $attributes )
			. $this->write_tabs( new Kadence_Blocks_Tabs_Gutter_Css( 1, 'tablet' ), $attributes );

		$wp_locale->text_direction = $direction;

		$rtl = '.rtl ' . self::TITLES;

		$this->assertSameCss(
			'.s{margin-right:4px;}' . $rtl . '{margin-right:0px;margin-left:4px;}'
			. self::TABLET . '{' . self::TITLES . '{margin-right:5px;}}'
			. self::TABLET . '{' . $rtl . '{margin-right:0px;margin-left:5px;}}',
			$written
		);
	}

	/**
	 * The Google fonts are loaded only when the editor asks for it.
	 *
	 * @dataProvider googleFontProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $section    The section that loads the font.
	 * @param array<int, string>   $expected   The fonts loaded.
	 *
	 * @return void
	 */
	public function testGoogleFonts( array $attributes, string $section, array $expected ): void {
		$css = new class() extends Kadence_Blocks_CSS {
			/**
			 * The fonts that were loaded.
			 *
			 * @var array<int, string>
			 */
			public $families = [];

			/**
			 * Remember the font.
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

		( new $section() )->write( $this->tabs_input( $attributes, $css ) );

		$this->assertSame( $expected, $css->families );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/tabs/loader.php';

		yield from $this->valueProvider();
		yield from $this->verticalProvider();
		yield from $this->percentProvider();
		yield from $this->subtitleProvider();
	}

	/**
	 * @return Generator
	 */
	private function valueProvider(): Generator {
		yield 'a color' => [
			'section'    => new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'titleColor' ),
			'attributes' => [ 'titleColor' => '#112233' ],
			'expected'   => '.s{color:#112233;}',
		];
		yield 'no color' => [
			'section'    => new Kadence_Blocks_Tabs_Sanitized_Color_Css( 'color', 'titleColor' ),
			'attributes' => [ 'titleColor' => '' ],
			'expected'   => '',
		];
		yield 'a line height with the unit saved' => [
			'section'    => new Kadence_Blocks_Tabs_Unit_Value_Css( 'line-height', 'lineHeight', 'px', 'lineType' ),
			'attributes' => [
				'lineHeight' => 2,
				'lineType'   => 'em',
			],
			'expected'   => '.s{line-height:2em;}',
		];
		yield 'a line height without a unit saved' => [
			'section'    => new Kadence_Blocks_Tabs_Unit_Value_Css( 'line-height', 'lineHeight', 'px', 'lineType' ),
			'attributes' => [ 'lineHeight' => 20 ],
			'expected'   => '.s{line-height:20px;}',
		];
		yield 'a value that has a fixed unit' => [
			'section'    => new Kadence_Blocks_Tabs_Unit_Value_Css( 'letter-spacing', 'letterSpacing', 'px', null ),
			'attributes' => [
				'letterSpacing' => 3,
				'lineType'      => 'em',
			],
			'expected'   => '.s{letter-spacing:3px;}',
		];
		yield 'no value with a unit' => [
			'section'    => new Kadence_Blocks_Tabs_Unit_Value_Css( 'letter-spacing', 'letterSpacing', 'px', null ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a value for every device' => [
			'section'    => new Kadence_Blocks_Tabs_Responsive_Range_Css( 'max-width', 'maxWidth', [ 'maxWidth', 'tabletMaxWidth', 'mobileMaxWidth' ], [ '', '', '' ], 'px' ),
			'attributes' => [
				'maxWidth'       => 100,
				'tabletMaxWidth' => 50,
				'mobileMaxWidth' => 20,
			],
			'expected'   => '.s{max-width:100px;}' . self::TABLET . '{.s{max-width:50px;}}' . self::MOBILE . '{.s{max-width:20px;}}',
		];
		yield 'no value for any device' => [
			'section'    => new Kadence_Blocks_Tabs_Responsive_Range_Css( 'max-width', 'maxWidth', [ 'maxWidth', 'tabletMaxWidth', 'mobileMaxWidth' ], [ '', '', '' ], 'px' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'the tablet falls back to its default' => [
			'section'    => new Kadence_Blocks_Tabs_Responsive_Range_Css( 'font-size', 'size', [ 'iSize', 'tabletISize', 'mobileISize' ], [ '', '14', '' ], '' ),
			'attributes' => [ 'iSize' => 10 ],
			'expected'   => '.s{font-size:10px;}' . self::TABLET . '{.s{font-size:14px;}}',
		];
		yield 'four sides in pixels' => [
			'section'    => new Kadence_Blocks_Tabs_Quad_Pixels_Css( 'padding', 'padding' ),
			'attributes' => [ 'padding' => [ 1, 2, 3, 4 ] ],
			'expected'   => '.s{padding:1px 2px 3px 4px;}',
		];
		yield 'missing sides stay empty' => [
			'section'    => new Kadence_Blocks_Tabs_Quad_Pixels_Css( 'padding', 'padding' ),
			'attributes' => [ 'padding' => [ 1 ] ],
			'expected'   => '.s{padding:1px px px px;}',
		];
		yield 'sides that are not a list' => [
			'section'    => new Kadence_Blocks_Tabs_Quad_Pixels_Css( 'padding', 'padding' ),
			'attributes' => [ 'padding' => '4' ],
			'expected'   => '',
		];
		yield 'a font size' => [
			'section'    => new Kadence_Blocks_Tabs_Font_Size_Css( 'size' ),
			'attributes' => [ 'size' => 20 ],
			'expected'   => '.s{font-size:20px;}',
		];
		yield 'a font size with a unit' => [
			'section'    => new Kadence_Blocks_Tabs_Font_Size_Css( 'tabSize' ),
			'attributes' => [
				'tabSize'  => 2,
				'sizeType' => 'em',
			],
			'expected'   => '.s{font-size:2em;}',
		];
		yield 'no font size' => [
			'section'    => new Kadence_Blocks_Tabs_Font_Size_Css( 'size' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a line height of the titles' => [
			'section'    => new Kadence_Blocks_Tabs_Line_Height_Css( 'tabLineHeight' ),
			'attributes' => [
				'tabLineHeight' => 30,
				'lineType'      => 'em',
			],
			'expected'   => '.s{line-height:30em;}',
		];
		yield 'a line height of the titles in pixels' => [
			'section'    => new Kadence_Blocks_Tabs_Line_Height_Css( 'tabLineHeight' ),
			'attributes' => [ 'tabLineHeight' => 30 ],
			'expected'   => '.s{line-height:30px;}',
		];
		yield 'no line height of the titles' => [
			'section'    => new Kadence_Blocks_Tabs_Line_Height_Css( 'tabLineHeight' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'the background of the active title' => [
			'section'    => new Kadence_Blocks_Tabs_Active_Background_Css(),
			'attributes' => [ 'titleBgActive' => '#123456' ],
			'expected'   => '.s{background:#123456;}',
		];
		yield 'the background of the active title is white by default' => [
			'section'    => new Kadence_Blocks_Tabs_Active_Background_Css(),
			'attributes' => [],
			'expected'   => '.s{background:#ffffff;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function verticalProvider(): Generator {
		$root  = '.wp-block-kadence-tabs .kt-tabs-idabc';
		$rules = static function ( string $width ) use ( $root ): string {
			return $root . '{display:flex;}'
				. $root . ' > .kt-tabs-title-list{float:none;width:' . $width . ';}'
				. $root . ' > .kt-tabs-content-wrap{float:none;width:auto;flex:1;-webkit-flex:1;}';
		};

		yield 'vertical tabs on desktop' => [
			'section'    => new Kadence_Blocks_Css_Device_Section( 'desktop', Kadence_Blocks_Tabs_Vertical::sections( 0 ) ),
			'attributes' => [
				'verticalTabWidth'     => [ 25 ],
				'verticalTabWidthUnit' => 'px',
			],
			'expected'   => $rules( '25px' ),
		];
		yield 'vertical tabs take a percent width by default' => [
			'section'    => new Kadence_Blocks_Css_Device_Section( 'desktop', Kadence_Blocks_Tabs_Vertical::sections( 0 ) ),
			'attributes' => [ 'verticalTabWidth' => [ 25 ] ],
			'expected'   => $rules( '25%' ),
		];
		yield 'vertical tabs on tablet take the width of the tablet' => [
			'section'    => new Kadence_Blocks_Css_Device_Section( 'tablet', Kadence_Blocks_Tabs_Vertical::sections( 1 ) ),
			'attributes' => [ 'verticalTabWidth' => [ 25, 30 ] ],
			'expected'   => self::TABLET . '{' . $rules( '30%' ) . '}',
		];
		yield 'vertical tabs on tablet fall back to the desktop width' => [
			'section'    => new Kadence_Blocks_Css_Device_Section( 'tablet', Kadence_Blocks_Tabs_Vertical::sections( 1 ) ),
			'attributes' => [ 'verticalTabWidth' => [ 25, '' ] ],
			'expected'   => self::TABLET . '{' . $rules( '25%' ) . '}',
		];
		yield 'vertical tabs on mobile take the width of the mobile' => [
			'section'    => new Kadence_Blocks_Css_Device_Section( 'mobile', Kadence_Blocks_Tabs_Vertical::sections( 2 ) ),
			'attributes' => [ 'verticalTabWidth' => [ 25, 30, 35 ] ],
			'expected'   => self::MOBILE . '{' . $rules( '35%' ) . '}',
		];
		yield 'vertical tabs on mobile fall back to the tablet width' => [
			'section'    => new Kadence_Blocks_Css_Device_Section( 'mobile', Kadence_Blocks_Tabs_Vertical::sections( 2 ) ),
			'attributes' => [ 'verticalTabWidth' => [ 25, 30 ] ],
			'expected'   => self::MOBILE . '{' . $rules( '30%' ) . '}',
		];
		yield 'vertical tabs on mobile fall back to the desktop width' => [
			'section'    => new Kadence_Blocks_Css_Device_Section( 'mobile', Kadence_Blocks_Tabs_Vertical::sections( 2 ) ),
			'attributes' => [ 'verticalTabWidth' => [ 25, '', '' ] ],
			'expected'   => self::MOBILE . '{' . $rules( '25%' ) . '}',
		];
	}

	/**
	 * @return Generator
	 */
	private function percentProvider(): Generator {
		$list = '.wp-block-kadence-tabs .kt-tabs-idabc > .kt-tabs-title-list';

		yield 'the list is pulled out by the gap' => [
			'section'    => new Kadence_Blocks_Tabs_Gap_List_Css(),
			'attributes' => [ 'gutter' => [ 12 ] ],
			'expected'   => '.s{margin-right:-12px;}',
		];
		yield 'the list is pulled out by the default gap' => [
			'section'    => new Kadence_Blocks_Tabs_Gap_List_Css(),
			'attributes' => [],
			'expected'   => '.s{margin-right:-10px;}',
		];
		yield 'the titles are spaced by the gap' => [
			'section'    => new Kadence_Blocks_Tabs_Gap_Title_Css(),
			'attributes' => [ 'gutter' => [ 12 ] ],
			'expected'   => '.s{margin-right:12px;}',
		];
		yield 'the width of a title on tablet' => [
			'section'    => new Kadence_Blocks_Tabs_Column_Width_Css( 1, 'tablet' ),
			'attributes' => [ 'tabWidth' => [ 4, 3 ] ],
			'expected'   => self::TABLET . '{' . $list . '.kb-tabs-list-columns > li{flex:0 1 33.33%;-webkit-flex:0 1 33.33%;}}',
		];
		yield 'the width of a title on mobile' => [
			'section'    => new Kadence_Blocks_Tabs_Column_Width_Css( 2, 'mobile' ),
			'attributes' => [ 'tabWidth' => [ 4, 3, 2 ] ],
			'expected'   => self::MOBILE . '{' . $list . '.kb-tabs-list-columns > li{flex:0 1 50%;-webkit-flex:0 1 50%;}}',
		];
		yield 'no width of a title' => [
			'section'    => new Kadence_Blocks_Tabs_Column_Width_Css( 1, 'tablet' ),
			'attributes' => [ 'tabWidth' => [ 4, '' ] ],
			'expected'   => '',
		];
		yield 'widths of the titles that are not a list' => [
			'section'    => new Kadence_Blocks_Tabs_Column_Width_Css( 1, 'tablet' ),
			'attributes' => [ 'tabWidth' => '43' ],
			'expected'   => '',
		];
		yield 'the gap of the titles on tablet' => [
			'section'    => new Kadence_Blocks_Tabs_Gutter_Css( 1, 'tablet' ),
			'attributes' => [ 'gutter' => [ 4, 8 ] ],
			'expected'   => self::TABLET . '{' . self::TITLES . '{margin-right:8px;}}',
		];
		yield 'the gap of the titles on mobile' => [
			'section'    => new Kadence_Blocks_Tabs_Gutter_Css( 2, 'mobile' ),
			'attributes' => [ 'gutter' => [ 4, 8, '0' ] ],
			'expected'   => self::MOBILE . '{' . self::TITLES . '{margin-right:0px;}}',
		];
		yield 'a gap that is not a number' => [
			'section'    => new Kadence_Blocks_Tabs_Gutter_Css( 1, 'tablet' ),
			'attributes' => [ 'gutter' => [ 4, 'wide' ] ],
			'expected'   => '',
		];
		yield 'gaps that are not a list' => [
			'section'    => new Kadence_Blocks_Tabs_Gutter_Css( 1, 'tablet' ),
			'attributes' => [ 'gutter' => '45' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function subtitleProvider(): Generator {
		$text = '.kt-tabs-idabc > .kt-tabs-title-list li .kt-title-sub-text, .kt-tabs-idabc > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-title-sub-text';

		yield 'the subtitle font' => [
			'section'    => new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::sections() ),
			'attributes' => [
				'subtitleFont' => [
					[
						'size'          => [ 12 ],
						'sizeType'      => 'em',
						'lineHeight'    => [ 2 ],
						'letterSpacing' => 1,
						'textTransform' => 'uppercase',
						'family'        => 'Roboto',
						'style'         => 'italic',
						'weight'        => '700',
						'padding'       => [ 1, 2, 3, 4 ],
						'margin'        => [ 5, 6, 7, 8 ],
					],
				],
			],
			'expected'   => $text . '{font-size:12em;line-height:2px;letter-spacing:1px;text-transform:uppercase;font-family:Roboto;font-style:italic;font-weight:700;padding:1px 2px 3px 4px;margin:5px 6px 7px 8px;}',
		];
		yield 'the subtitle font that is not a list of settings' => [
			'section'    => new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::sections() ),
			'attributes' => [ 'subtitleFont' => 'Roboto' ],
			'expected'   => '',
		];
		yield 'the size of the subtitle on desktop needs a list' => [
			'section'    => new Kadence_Blocks_Tabs_Subtitle_Size_Css( 'font-size', 'size', 'sizeType' ),
			'attributes' => [ 'size' => '12' ],
			'expected'   => '',
		];
		yield 'the size of the subtitle on desktop needs a value' => [
			'section'    => new Kadence_Blocks_Tabs_Subtitle_Size_Css( 'font-size', 'size', 'sizeType' ),
			'attributes' => [ 'size' => [ '' ] ],
			'expected'   => '',
		];
		yield 'the size of the subtitle on tablet' => [
			'section'    => new Kadence_Blocks_Tabs_Subtitle_Device_Size_Css( 'font-size', 'size', 'sizeType', 1 ),
			'attributes' => [
				'size'     => [ 10, 8 ],
				'sizeType' => '%',
			],
			'expected'   => '.s{font-size:8%;}',
		];
		yield 'the line height of the subtitle on mobile' => [
			'section'    => new Kadence_Blocks_Tabs_Subtitle_Device_Size_Css( 'line-height', 'lineHeight', 'lineType', 2 ),
			'attributes' => [ 'lineHeight' => [ 1, 2, 3 ] ],
			'expected'   => '.s{line-height:3px;}',
		];
		yield 'the sizes of the subtitle on tablet' => [
			'section'    => new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::device_sections( 1, 'tablet' ) ),
			'attributes' => [
				'subtitleFont' => [
					[
						'size'       => [ 10, 8 ],
						'lineHeight' => [ 1, 2 ],
					],
				],
			],
			'expected'   => self::TABLET . '{' . $text . '{font-size:8px;line-height:2px;}}',
		];
		yield 'the sizes of the subtitle on mobile' => [
			'section'    => new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::device_sections( 2, 'mobile' ) ),
			'attributes' => [ 'subtitleFont' => [ [ 'lineHeight' => [ 1, 2, 4 ] ] ] ],
			'expected'   => self::MOBILE . '{' . $text . '{line-height:4px;}}',
		];
		yield 'no sizes of the subtitle on mobile' => [
			'section'    => new Kadence_Blocks_Css_Scoped_Section( 'subtitleFont', Kadence_Blocks_Tabs_Subtitle::device_sections( 2, 'mobile' ) ),
			'attributes' => [ 'subtitleFont' => [ [ 'size' => [ 10, 8 ] ] ] ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/tabs/loader.php';

		yield 'a border width' => [
			'condition'  => new Kadence_Blocks_Tabs_Content_Border_Condition(),
			'attributes' => [ 'contentBorder' => [ '', '', '', 2 ] ],
			'expected'   => true,
		];
		yield 'no border width' => [
			'condition'  => new Kadence_Blocks_Tabs_Content_Border_Condition(),
			'attributes' => [ 'contentBorder' => [ '', 'x' ] ],
			'expected'   => false,
		];
		yield 'a margin on desktop' => [
			'condition'  => new Kadence_Blocks_Tabs_Title_Margin_Condition(),
			'attributes' => [ 'titleMargin' => [ 1, 2, 3, 4 ] ],
			'expected'   => true,
		];
		yield 'a margin on mobile' => [
			'condition'  => new Kadence_Blocks_Tabs_Title_Margin_Condition(),
			'attributes' => [ 'mobileTitleMargin' => [ 1 ] ],
			'expected'   => true,
		];
		yield 'a margin that is not a list' => [
			'condition'  => new Kadence_Blocks_Tabs_Title_Margin_Condition(),
			'attributes' => [ 'titleMargin' => '4' ],
			'expected'   => false,
		];
		yield 'no layout saved is the tabs layout' => [
			'condition'  => new Kadence_Blocks_Tabs_Row_Layout_Condition(),
			'attributes' => [],
			'expected'   => true,
		];
		yield 'the tabs layout' => [
			'condition'  => new Kadence_Blocks_Tabs_Row_Layout_Condition(),
			'attributes' => [ 'layout' => 'tabs' ],
			'expected'   => true,
		];
		yield 'another layout' => [
			'condition'  => new Kadence_Blocks_Tabs_Row_Layout_Condition(),
			'attributes' => [ 'layout' => 'accordion' ],
			'expected'   => false,
		];
		yield 'vertical tabs with a width' => [
			'condition'  => new Kadence_Blocks_Tabs_Vertical_Layout_Condition( 'layout', 0 ),
			'attributes' => [
				'layout'           => 'vtabs',
				'verticalTabWidth' => [ 20 ],
			],
			'expected'   => true,
		];
		yield 'vertical tabs without a width' => [
			'condition'  => new Kadence_Blocks_Tabs_Vertical_Layout_Condition( 'layout', 0 ),
			'attributes' => [ 'layout' => 'vtabs' ],
			'expected'   => false,
		];
		yield 'vertical tabs on mobile with the width of the desktop' => [
			'condition'  => new Kadence_Blocks_Tabs_Vertical_Layout_Condition( 'mobile_layout', 2 ),
			'attributes' => [
				'layout'           => 'vtabs',
				'verticalTabWidth' => [ 20 ],
			],
			'expected'   => true,
		];
		yield 'vertical tabs that are not vertical on mobile' => [
			'condition'  => new Kadence_Blocks_Tabs_Vertical_Layout_Condition( 'mobile_layout', 2 ),
			'attributes' => [
				'layout'           => 'vtabs',
				'mobileLayout'     => 'tabs',
				'verticalTabWidth' => [ 20 ],
			],
			'expected'   => false,
		];
		yield 'titles that share the width' => [
			'condition'  => new Kadence_Blocks_Tabs_Percent_Width_Condition(),
			'attributes' => [ 'widthType' => 'percent' ],
			'expected'   => true,
		];
		yield 'titles that share the width of vertical tabs' => [
			'condition'  => new Kadence_Blocks_Tabs_Percent_Width_Condition(),
			'attributes' => [
				'widthType' => 'percent',
				'layout'    => 'vtabs',
			],
			'expected'   => false,
		];
		yield 'titles that have their own width' => [
			'condition'  => new Kadence_Blocks_Tabs_Percent_Width_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'a title with an icon' => [
			'condition'  => new Kadence_Blocks_Tabs_Icon_Condition(),
			'attributes' => [ 'titles' => [ [ 'icon' => '' ], [ 'icon' => 'fe_check' ] ] ],
			'expected'   => true,
		];
		yield 'titles without an icon' => [
			'condition'  => new Kadence_Blocks_Tabs_Icon_Condition(),
			'attributes' => [ 'titles' => [ [ 'text' => 'a' ] ] ],
			'expected'   => false,
		];
		yield 'no titles' => [
			'condition'  => new Kadence_Blocks_Tabs_Icon_Condition(),
			'attributes' => [],
			'expected'   => false,
		];
		yield 'a subtitle size on tablet' => [
			'condition'  => new Kadence_Blocks_Tabs_Subtitle_Device_Condition( 1 ),
			'attributes' => [ 'size' => [ 1, 2 ] ],
			'expected'   => true,
		];
		yield 'a subtitle line height on mobile' => [
			'condition'  => new Kadence_Blocks_Tabs_Subtitle_Device_Condition( 2 ),
			'attributes' => [ 'lineHeight' => [ 1, 2, 3 ] ],
			'expected'   => true,
		];
		yield 'a subtitle size that is not a list' => [
			'condition'  => new Kadence_Blocks_Tabs_Subtitle_Device_Condition( 1 ),
			'attributes' => [ 'size' => '12' ],
			'expected'   => false,
		];
		yield 'no subtitle size on mobile' => [
			'condition'  => new Kadence_Blocks_Tabs_Subtitle_Device_Condition( 2 ),
			'attributes' => [ 'size' => [ 1, 2 ] ],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function layoutsProvider(): Generator {
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => [
				'layout'        => 'tabs',
				'tablet_layout' => 'tabs',
				'mobile_layout' => 'tabs',
			],
		];
		yield 'a layout for every device' => [
			'attributes' => [
				'layout'       => 'vtabs',
				'tabletLayout' => 'accordion',
				'mobileLayout' => 'tabs',
			],
			'expected'   => [
				'layout'        => 'vtabs',
				'tablet_layout' => 'accordion',
				'mobile_layout' => 'tabs',
			],
		];
		yield 'devices that inherit' => [
			'attributes' => [
				'layout'       => 'vtabs',
				'tabletLayout' => 'inherit',
				'mobileLayout' => 'inherit',
			],
			'expected'   => [
				'layout'        => 'vtabs',
				'tablet_layout' => 'vtabs',
				'mobile_layout' => 'vtabs',
			],
		];
		yield 'mobile inherits from tablet' => [
			'attributes' => [
				'layout'       => 'vtabs',
				'tabletLayout' => 'accordion',
				'mobileLayout' => 'inherit',
			],
			'expected'   => [
				'layout'        => 'vtabs',
				'tablet_layout' => 'accordion',
				'mobile_layout' => 'accordion',
			],
		];
	}

	/**
	 * @return Generator
	 */
	public function gapProvider(): Generator {
		yield 'no gap saved' => [
			'attributes' => [],
			'expected'   => 10,
		];
		yield 'a gap' => [
			'attributes' => [ 'gutter' => [ 4 ] ],
			'expected'   => 4,
		];
		yield 'a gap that is not a number' => [
			'attributes' => [ 'gutter' => [ 'wide' ] ],
			'expected'   => 10,
		];
	}

	/**
	 * @return Generator
	 */
	public function rtlProvider(): Generator {
		yield 'a language read from left to right' => [
			'rtl'      => false,
			'expected' => '',
		];
		yield 'a language read from right to left' => [
			'rtl'      => true,
			'expected' => '.rtl ' . self::TITLES . '{margin-right:0px;margin-left:7px;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function googleFontProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/tabs/loader.php';

		$title    = Kadence_Blocks_Tabs_Google_Font_Css::class;
		$subtitle = Kadence_Blocks_Tabs_Subtitle_Google_Font_Css::class;

		yield 'a font to load' => [
			'attributes' => [
				'googleFont'  => true,
				'typography'  => 'Roboto',
				'fontVariant' => '700',
				'fontSubset'  => 'latin',
			],
			'section'    => $title,
			'expected'   => [ 'Roboto|700|latin' ],
		];
		yield 'a font that is asked to load' => [
			'attributes' => [
				'googleFont'     => true,
				'loadGoogleFont' => true,
				'typography'     => 'Roboto',
			],
			'section'    => $title,
			'expected'   => [ 'Roboto||' ],
		];
		yield 'a font that is asked not to load' => [
			'attributes' => [
				'googleFont'     => true,
				'loadGoogleFont' => false,
				'typography'     => 'Roboto',
			],
			'section'    => $title,
			'expected'   => [],
		];
		yield 'a font that is not a Google font' => [
			'attributes' => [
				'googleFont' => false,
				'typography' => 'Roboto',
			],
			'section'    => $title,
			'expected'   => [],
		];
		yield 'a Google font without a family' => [
			'attributes' => [ 'googleFont' => true ],
			'section'    => $title,
			'expected'   => [],
		];
		yield 'a font of the subtitle' => [
			'attributes' => [
				'google'  => true,
				'family'  => 'Lato',
				'variant' => '400',
				'subset'  => 'greek',
			],
			'section'    => $subtitle,
			'expected'   => [ 'Lato|400|greek' ],
		];
		yield 'a font of the subtitle that is asked to load' => [
			'attributes' => [
				'google'     => true,
				'loadGoogle' => true,
				'family'     => 'Lato',
			],
			'section'    => $subtitle,
			'expected'   => [ 'Lato||' ],
		];
		yield 'a font of the subtitle that is asked not to load' => [
			'attributes' => [
				'google'     => true,
				'loadGoogle' => 'yes',
				'family'     => 'Lato',
			],
			'section'    => $subtitle,
			'expected'   => [],
		];
		yield 'a font of the subtitle that is not a Google font' => [
			'attributes' => [ 'family' => 'Lato' ],
			'section'    => $subtitle,
			'expected'   => [],
		];
		yield 'a font of the subtitle without a family' => [
			'attributes' => [ 'google' => true ],
			'section'    => $subtitle,
			'expected'   => [],
		];
	}
}
