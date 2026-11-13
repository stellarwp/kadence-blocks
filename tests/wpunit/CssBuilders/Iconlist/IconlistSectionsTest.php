<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Iconlist;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Iconlist_Columns_Condition;
use Kadence_Blocks_Iconlist_Environment;
use Kadence_Blocks_Iconlist_Gap_Css;
use Kadence_Blocks_Iconlist_Google_Font_Css;
use Kadence_Blocks_Iconlist_Label_Gap_Css;
use Kadence_Blocks_Iconlist_Legacy_Size_Css;
use Kadence_Blocks_Iconlist_List_Styles_Condition;
use Kadence_Blocks_Iconlist_Outer_Margin_Css;
use Kadence_Blocks_Iconlist_Site_Environment;
use Kadence_Blocks_Iconlist_Suffixed_Css;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections of the icon list CSS, one by one.
 */
final class IconlistSectionsTest extends Free_Section_Test_Case {

	private const TABLET = '@media all and (max-width: 1024px)';

	private const MOBILE = '@media all and (max-width: 767px)';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/iconlist/loader.php';
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
	 * The columns condition is met, or not, for the attributes.
	 *
	 * @dataProvider columnsProvider
	 *
	 * @param string               $device     The device.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testColumnsCondition( string $device, array $attributes, bool $expected ): void {
		$condition = new Kadence_Blocks_Iconlist_Columns_Condition( $device );

		$this->assertSame( $expected, $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The list styles condition is met only when the first entry holds settings.
	 *
	 * @dataProvider listStylesProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testListStylesCondition( array $attributes, bool $expected ): void {
		$condition = new Kadence_Blocks_Iconlist_List_Styles_Condition();

		$this->assertSame( $expected, $condition->is_met( $this->input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The gap between the icon and the label goes on the left of a right to left site and on the right of the others.
	 *
	 * @dataProvider labelGapProvider
	 *
	 * @param bool   $rtl      Whether the site is right to left.
	 * @param string $expected The CSS expected.
	 *
	 * @return void
	 */
	public function testLabelGapFollowsTheDirection( bool $rtl, string $expected ): void {
		$environment = new class( $rtl ) implements Kadence_Blocks_Iconlist_Environment {

			/**
			 * Whether the site is right to left.
			 *
			 * @var bool
			 */
			private $rtl;

			/**
			 * Create the environment.
			 *
			 * @param bool $rtl Whether the site is right to left.
			 */
			public function __construct( bool $rtl ) {
				$this->rtl = $rtl;
			}

			/**
			 * Whether the site is right to left.
			 *
			 * @return bool
			 */
			public function is_rtl(): bool {
				return $this->rtl;
			}
		};

		$section = new Kadence_Blocks_Iconlist_Label_Gap_Css( $environment );

		$this->assertSameCss( $expected, $this->write_section( $section, [ 'listLabelGap' => 8 ], 'abc', '.sel' ) );
	}

	/**
	 * The site environment reports the direction of the site.
	 *
	 * @return void
	 */
	public function testSiteEnvironmentReportsTheDirection(): void {
		$this->assertSame( is_rtl(), ( new Kadence_Blocks_Iconlist_Site_Environment() )->is_rtl() );
	}

	/**
	 * A Google font is loaded when it is a Google font with a family that is to be loaded.
	 *
	 * @dataProvider fontProvider
	 *
	 * @param array<string, mixed>      $attributes The block attributes.
	 * @param array<string, mixed>|null $expected   The font that is registered, or null for none.
	 *
	 * @return void
	 */
	public function testGoogleFont( array $attributes, ?array $expected ): void {
		$css = new Kadence_Blocks_CSS();
		$css->clear();

		( new Kadence_Blocks_Iconlist_Google_Font_Css() )->write( $this->input( $attributes, $css ) );

		$fonts = $css->fonts_output();
		$css->clear();

		$this->assertSame( null === $expected ? [] : [ 'Family' => $expected ], $fonts );
	}

	/**
	 * @return Generator
	 */
	public function fontProvider(): Generator {
		$font = static function ( array $settings ): array {
			return [
				'listStyles' => [
					array_merge(
						[
							'google' => true,
							'family' => 'Family',
						],
						$settings 
					),
				],
			];
		};

		yield 'a Google font with a variant and a subset' => [
			'attributes' => $font(
				[
					'variant' => '700',
					'subset'  => 'latin',
				] 
			),
			'expected'   => [
				'fontfamily'   => 'Family',
				'fontvariants' => [ '700' ],
				'fontsubsets'  => [ 'latin' ],
			],
		];
		yield 'a Google font without a variant' => [
			'attributes' => $font( [ 'loadGoogle' => true ] ),
			'expected'   => [
				'fontfamily'   => 'Family',
				'fontvariants' => [],
				'fontsubsets'  => [],
			],
		];
		yield 'a font that is not to be loaded' => [
			'attributes' => $font( [ 'loadGoogle' => false ] ),
			'expected'   => null,
		];
		yield 'a font that is not a Google font' => [
			'attributes' => $font( [ 'google' => false ] ),
			'expected'   => null,
		];
		yield 'a font without a family' => [
			'attributes' => [ 'listStyles' => [ [ 'google' => true ] ] ],
			'expected'   => null,
		];
		yield 'list styles that are not a list' => [
			'attributes' => [ 'listStyles' => 'Family' ],
			'expected'   => null,
		];
		yield 'no list styles' => [
			'attributes' => [],
			'expected'   => null,
		];
	}

	/**
	 * @return Generator
	 */
	public function labelGapProvider(): Generator {
		yield 'a left to right site' => [
			'rtl'      => false,
			'expected' => '.sel{margin-right:8px;}',
		];
		yield 'a right to left site' => [
			'rtl'      => true,
			'expected' => '.sel{margin-left:8px;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function listStylesProvider(): Generator {
		yield 'settings' => [
			'attributes' => [ 'listStyles' => [ [ 'color' => 'red' ] ] ],
			'expected'   => true,
		];
		yield 'an empty list' => [
			'attributes' => [ 'listStyles' => [] ],
			'expected'   => false,
		];
		yield 'an entry that is not settings' => [
			'attributes' => [ 'listStyles' => [ 'red' ] ],
			'expected'   => false,
		];
		yield 'a string' => [
			'attributes' => [ 'listStyles' => 'red' ],
			'expected'   => false,
		];
		yield 'nothing' => [
			'attributes' => [],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function columnsProvider(): Generator {
		yield 'desktop with columns' => [
			'device'     => 'desktop',
			'attributes' => [ 'columns' => 2 ],
			'expected'   => true,
		];
		yield 'desktop with a negative count' => [
			'device'     => 'desktop',
			'attributes' => [ 'columns' => -3 ],
			'expected'   => true,
		];
		yield 'desktop with one column' => [
			'device'     => 'desktop',
			'attributes' => [ 'columns' => 1 ],
			'expected'   => false,
		];
		yield 'desktop with nothing' => [
			'device'     => 'desktop',
			'attributes' => [],
			'expected'   => false,
		];
		yield 'desktop ignores the tablet' => [
			'device'     => 'desktop',
			'attributes' => [ 'tabletColumns' => 3 ],
			'expected'   => false,
		];
		yield 'tablet with its own columns' => [
			'device'     => 'tablet',
			'attributes' => [
				'tabletColumns' => 2,
				'columns'       => 1,
			],
			'expected'   => true,
		];
		yield 'tablet that inherits the columns' => [
			'device'     => 'tablet',
			'attributes' => [ 'columns' => 2 ],
			'expected'   => true,
		];
		yield 'tablet with one column of its own' => [
			'device'     => 'tablet',
			'attributes' => [
				'tabletColumns' => 1,
				'columns'       => 3,
			],
			'expected'   => false,
		];
		yield 'tablet with nothing' => [
			'device'     => 'tablet',
			'attributes' => [],
			'expected'   => false,
		];
		yield 'mobile with its own columns' => [
			'device'     => 'mobile',
			'attributes' => [ 'mobileColumns' => 2 ],
			'expected'   => true,
		];
		yield 'mobile that inherits the tablet' => [
			'device'     => 'mobile',
			'attributes' => [
				'tabletColumns' => 2,
				'columns'       => 1,
			],
			'expected'   => true,
		];
		yield 'mobile that inherits the desktop' => [
			'device'     => 'mobile',
			'attributes' => [ 'columns' => 2 ],
			'expected'   => true,
		];
		yield 'mobile with one column of its own' => [
			'device'     => 'mobile',
			'attributes' => [
				'mobileColumns' => 1,
				'tabletColumns' => 3,
				'columns'       => 3,
			],
			'expected'   => false,
		];
		yield 'mobile under a tablet with one column' => [
			'device'     => 'mobile',
			'attributes' => [
				'tabletColumns' => 1,
				'columns'       => 3,
			],
			'expected'   => false,
		];
		yield 'mobile with nothing' => [
			'device'     => 'mobile',
			'attributes' => [],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/iconlist/loader.php';

		$list = '.kt-svg-icon-list-itemsabc ul.kt-svg-icon-list .kt-svg-icon-list-level-';

		yield 'a list margin that is a list means none on the wrapper' => [
			'section'    => new Kadence_Blocks_Iconlist_Outer_Margin_Css(),
			'attributes' => [ 'listMargin' => [ [ 1, 2, 3, 4 ] ] ],
			'expected'   => '.wp-block-kadence-iconlist.kt-svg-icon-list-itemsabc:not(.this-stops-third-party-issues){margin-top:0px;margin-bottom:0px;}',
		];
		yield 'a list margin that was never set means a default bottom margin' => [
			'section'    => new Kadence_Blocks_Iconlist_Outer_Margin_Css(),
			'attributes' => [],
			'expected'   => '.wp-block-kadence-iconlist.kt-svg-icon-list-itemsabc:not(.this-stops-third-party-issues){margin-bottom:var(--global-kb-spacing-sm, 1.5rem);}',
		];
		yield 'a list margin that is empty means nothing' => [
			'section'    => new Kadence_Blocks_Iconlist_Outer_Margin_Css(),
			'attributes' => [ 'listMargin' => [] ],
			'expected'   => '',
		];
		yield 'a list margin that is not a list means nothing' => [
			'section'    => new Kadence_Blocks_Iconlist_Outer_Margin_Css(),
			'attributes' => [ 'listMargin' => '5' ],
			'expected'   => '',
		];
		yield 'a column gap for every device' => [
			'section'    => new Kadence_Blocks_Iconlist_Gap_Css( 'column-gap', [ 'columnGap', 'tabletColumnGap', 'mobileColumnGap' ], true, '' ),
			'attributes' => [
				'columnGap'       => 10,
				'tabletColumnGap' => 20,
				'mobileColumnGap' => 30,
			],
			'expected'   => '.sel{column-gap:10px;}' . self::TABLET . '{.sel{column-gap:20px;}}' . self::MOBILE . '{.sel{column-gap:30px;}}',
		];
		yield 'an empty column gap is no gap' => [
			'section'    => new Kadence_Blocks_Iconlist_Gap_Css( 'column-gap', [ 'columnGap', 'tabletColumnGap', 'mobileColumnGap' ], true, '' ),
			'attributes' => [
				'columnGap'       => 0,
				'tabletColumnGap' => 0,
			],
			'expected'   => '',
		];
		yield 'a list gap that was never set is 5' => [
			'section'    => new Kadence_Blocks_Iconlist_Gap_Css( 'grid-row-gap', [ 'listGap', 'tabletListGap', 'mobileListGap' ], false, '5' ),
			'attributes' => [],
			'expected'   => '.sel{grid-row-gap:5px;}',
		];
		yield 'a list gap that was set' => [
			'section'    => new Kadence_Blocks_Iconlist_Gap_Css( 'grid-row-gap', [ 'listGap', 'tabletListGap', 'mobileListGap' ], false, '5' ),
			'attributes' => [
				'listGap'       => 8,
				'tabletListGap' => 9,
				'mobileListGap' => 12,
			],
			'expected'   => '.sel{grid-row-gap:8px;}' . self::TABLET . '{.sel{grid-row-gap:9px;}}' . self::MOBILE . '{.sel{grid-row-gap:12px;}}',
		];
		yield 'a legacy size for each level that has a number' => [
			'section'    => new Kadence_Blocks_Iconlist_Legacy_Size_Css(),
			'attributes' => [ 'items' => [ [ 'size' => 20 ], [ 'size' => 'big' ], [ 'icon' => 'x' ], [ 'size' => '30' ] ] ],
			'expected'   => $list . '0 .kt-svg-icon-list-single svg{font-size:20px;}' . $list . '3 .kt-svg-icon-list-single svg{font-size:30px;}',
		];
		yield 'legacy sizes that are not a list' => [
			'section'    => new Kadence_Blocks_Iconlist_Legacy_Size_Css(),
			'attributes' => [ 'items' => 'abc' ],
			'expected'   => '',
		];
		yield 'no legacy sizes' => [
			'section'    => new Kadence_Blocks_Iconlist_Legacy_Size_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a value with its unit' => [
			'section'    => new Kadence_Blocks_Iconlist_Suffixed_Css( 'border-radius', 'borderRadius', '%', null ),
			'attributes' => [ 'borderRadius' => 40 ],
			'expected'   => '.sel{border-radius:40%;}',
		];
		yield 'a value that was not set and has no fallback' => [
			'section'    => new Kadence_Blocks_Iconlist_Suffixed_Css( 'border-radius', 'borderRadius', '%', null ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a value that was not set and has a fallback' => [
			'section'    => new Kadence_Blocks_Iconlist_Suffixed_Css( 'border-width', 'borderWidth', 'px', '0px' ),
			'attributes' => [],
			'expected'   => '.sel{border-width:0px;}',
		];
		yield 'an empty value keeps its unit' => [
			'section'    => new Kadence_Blocks_Iconlist_Suffixed_Css( 'padding', 'padding', 'px', null ),
			'attributes' => [ 'padding' => '' ],
			'expected'   => '.sel{padding:px;}',
		];
	}
}
