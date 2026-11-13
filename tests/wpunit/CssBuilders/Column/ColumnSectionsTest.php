<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Column;

use Generator;
use Kadence_Blocks_Column_Backdrop_Filter_Css;
use Kadence_Blocks_Column_Background_Color_Css;
use Kadence_Blocks_Column_Background_Image_Css;
use Kadence_Blocks_Column_Border_Color_Css;
use Kadence_Blocks_Column_Collapse_Order_Css;
use Kadence_Blocks_Column_Color_Rule_Css;
use Kadence_Blocks_Column_Flex_Display_Css;
use Kadence_Blocks_Column_Flex_Grow_Css;
use Kadence_Blocks_Column_Horizontal_Gap_Condition;
use Kadence_Blocks_Column_Horizontal_Gap_Css;
use Kadence_Blocks_Column_Hover_Color_Css;
use Kadence_Blocks_Css_Legacy_Condition;
use Kadence_Blocks_Css_Legacy_Sides_Section;
use Kadence_Blocks_Column_Max_Width_Desktop_Css;
use Kadence_Blocks_Column_Max_Width_Fallback_Css;
use Kadence_Blocks_Column_Max_Width_Mobile_Css;
use Kadence_Blocks_Column_Max_Width_Tablet_Css;
use Kadence_Blocks_Column_Min_Height_Css;
use Kadence_Blocks_Column_Opacity_Css;
use Kadence_Blocks_Column_Row_Alignment_Css;
use Kadence_Blocks_Css_Shadow_Section;
use Kadence_Blocks_Column_Sticky_Css;
use Kadence_Blocks_Column_Text_Align_Css;
use Kadence_Blocks_Css_Typed_Section;
use Kadence_Blocks_Column_Vertical_Gap_Css;
use Kadence_Blocks_Column_Z_Index_Css;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Css_Value_Section;

/**
 * The sections of the column CSS, one by one.
 */
final class ColumnSectionsTest extends Column_Test_Case {

	private const COLUMN = '.kadence-columnabc';

	private const INNER = '.kadence-columnabc > .kt-inside-inner-col';

	private const ROW_ITEM = '.wp-block-kadence-column.kb-section-dir-horizontal:not(.kb-section-md-dir-vertical)>.kt-inside-inner-col>.kadence-columnabc';

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
		$this->assertSameCss( $expected, $this->write_column( $section, $attributes ) );
	}

	/**
	 * The legacy condition is met when any filled attribute, number or side of a list was saved.
	 *
	 * @dataProvider legacyProvider
	 *
	 * @param Kadence_Blocks_Css_Legacy_Condition $condition  The condition.
	 * @param array<string, mixed>                   $attributes The block attributes.
	 * @param bool                                   $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testLegacyCondition( Kadence_Blocks_Css_Legacy_Condition $condition, array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $condition->is_met( $this->column_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The gap is the old horizontal one only for a version one column that flows from left to right on desktop.
	 *
	 * @dataProvider gapConditionProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testHorizontalGapCondition( array $attributes, bool $expected ): void {
		$input = $this->column_input( $attributes, new Kadence_Blocks_CSS() );

		$this->assertSame( $expected, ( new Kadence_Blocks_Column_Horizontal_Gap_Condition() )->is_met( $input ) );
	}

	/**
	 * The rows are told how to align the column, for every device that has a vertical alignment.
	 *
	 * @return void
	 */
	public function testRowAlignmentCallsTheBlock(): void {
		$attributes = [
			'verticalAlignment'       => 'top',
			'verticalAlignmentMobile' => 'bottom',
			'direction'               => [ 'vertical', '', 'horizontal' ],
		];

		$this->write_column( new Kadence_Blocks_Column_Row_Alignment_Css(), $attributes );

		$this->assertSame(
			[
				[ 'set_vertical_align', 'desktop', 'top', 'vertical', $this->calls[0][4], 'abc' ],
				[ 'set_vertical_align', 'tablet', 'top', 'vertical', $this->calls[1][4], 'abc' ],
				[ 'set_vertical_align', 'mobile', 'bottom', 'horizontal', $this->calls[2][4], 'abc' ],
			],
			$this->calls
		);
	}

	/**
	 * The rows are not told anything when no device has a vertical alignment.
	 *
	 * @return void
	 */
	public function testRowAlignmentSkipsDevicesWithoutAlignment(): void {
		$this->write_column( new Kadence_Blocks_Column_Row_Alignment_Css(), [] );

		$this->assertSame( [], $this->calls );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		self::load_sections();

		yield from $this->flowProvider();
		yield from $this->maxWidthProvider();
		yield from $this->boxProvider();
		yield from $this->fillProvider();
		yield from $this->ruleProvider();
	}

	/**
	 * Load the sections: the data providers run before the tests are set up.
	 *
	 * @return void
	 */
	private static function load_sections(): void {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/column/loader.php';
	}

	/**
	 * @return Generator
	 */
	private function flowProvider(): Generator {
		yield 'flex on desktop' => [
			'section'    => new Kadence_Blocks_Column_Flex_Display_Css(),
			'attributes' => [ 'direction' => [ 'horizontal' ] ],
			'expected'   => self::INNER . '{display:flex;}',
		];
		yield 'flex on tablet when desktop needs none' => [
			'section'    => new Kadence_Blocks_Column_Flex_Display_Css(),
			'attributes' => [ 'rowGapVariable' => [ '', 'sm' ] ],
			'expected'   => '@media all and (max-width: 1024px){' . self::INNER . '{display:flex;}}',
		];
		yield 'flex on mobile only when no larger device needs it' => [
			'section'    => new Kadence_Blocks_Column_Flex_Display_Css(),
			'attributes' => [ 'verticalAlignmentMobile' => 'top' ],
			'expected'   => '@media all and (max-width: 767px){' . self::INNER . '{display:flex;}}',
		];
		yield 'no flex' => [
			'section'    => new Kadence_Blocks_Column_Flex_Display_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'grow' => [
			'section'    => new Kadence_Blocks_Column_Flex_Grow_Css( 'tablet', 1 ),
			'attributes' => [ 'flexGrow' => [ 1, '2', 'x' ] ],
			'expected'   => '@media all and (max-width: 1024px){' . self::COLUMN . ', .wp-block-kadence-column.kb-section-dir-horizontal > .kt-inside-inner-col > ' . self::COLUMN . '{flex-grow:2;}' . self::INNER . '{height:100%;}}',
		];
		yield 'grow that is not a number' => [
			'section'    => new Kadence_Blocks_Column_Flex_Grow_Css( 'mobile', 2 ),
			'attributes' => [ 'flexGrow' => [ 1, 2, 'x' ] ],
			'expected'   => '',
		];
		yield 'minimum height with its unit' => [
			'section'    => new Kadence_Blocks_Column_Min_Height_Css( 'mobile', 2 ),
			'attributes' => [
				'height'     => [ 1, 2, 30 ],
				'heightUnit' => 'vh',
			],
			'expected'   => '@media all and (max-width: 767px){{min-height:30vh;}}',
		];
		yield 'sticky' => [
			'section'    => new Kadence_Blocks_Column_Sticky_Css(),
			'attributes' => [
				'sticky'           => true,
				'stickyOffset'     => [ 10 ],
				'stickyOffsetUnit' => 'rem',
			],
			'expected'   => '#wrapper.site{overflow:clip;}' . self::COLUMN . '{--kb-section-setting-offset:10rem;}',
		];
		yield 'not sticky' => [
			'section'    => new Kadence_Blocks_Column_Sticky_Css(),
			'attributes' => [
				'sticky'       => 'yes',
				'stickyOffset' => [ 10 ],
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function maxWidthProvider(): Generator {
		yield 'desktop max width' => [
			'section'    => new Kadence_Blocks_Column_Max_Width_Desktop_Css(),
			'attributes' => [
				'maxWidth'     => [ 500 ],
				'maxWidthUnit' => '%',
			],
			'expected'   => self::COLUMN . '{max-width:500%;margin-left:auto;margin-right:auto;}'
				. self::ROW_ITEM . '{-webkit-flex:0 1 500%;flex:0 1 500%;max-width:unset;margin-left:unset;margin-right:unset;}'
				. '@media all and (min-width: 1025px){.wp-block-kadence-column.kb-section-dir-horizontal>.kt-inside-inner-col>' . self::COLUMN . '{-webkit-flex:0 1 500%;flex:0 1 500%;max-width:unset;margin-left:unset;margin-right:unset;}}',
		];
		yield 'tablet max width' => [
			'section'    => new Kadence_Blocks_Column_Max_Width_Tablet_Css(),
			'attributes' => [
				'maxWidth'           => [ 500, 400 ],
				'maxWidthTabletUnit' => 'vw',
			],
			'expected'   => self::COLUMN . '{max-width:400vw;}' . self::ROW_ITEM . '{-webkit-flex:0 1 400vw;flex:0 1 400vw;}'
				. '@media all and (min-width: 768px) and (max-width: 1024px){.wp-block-kadence-column.kb-section-dir-horizontal>.kt-inside-inner-col>' . self::COLUMN . '{-webkit-flex:0 1 400vw;flex:0 1 400vw;max-width:unset;margin-left:unset;margin-right:unset;}}',
		];
		yield 'mobile max width' => [
			'section'    => new Kadence_Blocks_Column_Max_Width_Mobile_Css(),
			'attributes' => [
				'maxWidth'           => [ 1, 2, 300 ],
				'maxWidthMobileUnit' => 'em',
			],
			'expected'   => self::COLUMN . '{max-width:300em;margin-left:auto;margin-right:auto;}'
				. '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>' . self::COLUMN . '{-webkit-flex:0 1 300em;flex:0 1 300em;}'
				. '.wp-block-kadence-column>.kt-inside-inner-col>' . self::COLUMN . '{-webkit-flex:1 300em;flex:1 300em;}'
				. '.wp-block-kadence-column.kb-section-sm-dir-horizontal>.kt-inside-inner-col>' . self::COLUMN . ', .wp-block-kadence-column.kb-section-dir-horizontal:not(.kb-section-sm-dir-vertical):not(.kb-section-md-dir-vertical) >.kt-inside-inner-col>' . self::COLUMN . '{-webkit-flex:0 1 300em;flex:0 1 300em;max-width:unset;margin-left:unset;margin-right:unset;}',
		];
		yield 'tablet width is the fallback of mobile' => [
			'section'    => new Kadence_Blocks_Column_Max_Width_Fallback_Css( 1 ),
			'attributes' => [ 'maxWidth' => [ 1, 2 ] ],
			'expected'   => '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>' . self::COLUMN . '{max-width:2px;-webkit-flex:1;flex:1;margin-left:auto;margin-right:auto;}',
		];
		yield 'tablet fallback loses to mobile' => [
			'section'    => new Kadence_Blocks_Column_Max_Width_Fallback_Css( 1 ),
			'attributes' => [ 'maxWidth' => [ 1, 2, 3 ] ],
			'expected'   => '',
		];
		yield 'desktop fallback loses to tablet' => [
			'section'    => new Kadence_Blocks_Column_Max_Width_Fallback_Css( 0 ),
			'attributes' => [ 'maxWidth' => [ 1, 2 ] ],
			'expected'   => '',
		];
		yield 'desktop width is the fallback of mobile' => [
			'section'    => new Kadence_Blocks_Column_Max_Width_Fallback_Css( 0 ),
			'attributes' => [ 'maxWidth' => [ 1 ] ],
			'expected'   => '.wp-block-kadence-column.kb-section-sm-dir-vertical:not(.kb-section-sm-dir-horizontal):not(.kb-section-sm-dir-specificity)>.kt-inside-inner-col>' . self::COLUMN . '{max-width:1px;-webkit-flex:1;flex:1;margin-left:auto;margin-right:auto;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function boxProvider(): Generator {
		yield 'legacy padding on every device' => [
			'section'    => new Kadence_Blocks_Css_Legacy_Sides_Section( 'padding', [ 'top', 'bottom', 'left', 'right' ], 'paddingType' ),
			'attributes' => [
				'topPadding'    => 1,
				'leftPaddingT'  => 2,
				'rightPaddingM' => 3,
				'paddingType'   => 'em',
			],
			'expected'   => '.kt-test{}' === '' ? '' : '{padding-top:1em;}@media all and (max-width: 1024px){{padding-left:2em;}}@media all and (max-width: 767px){{padding-right:3em;}}',
		];
		yield 'shadow the editor saved' => [
			'section'    => new Kadence_Blocks_Css_Shadow_Section( 'shadow' ),
			'attributes' => [
				'shadow' => [
					[
						'color'   => '#000000',
						'opacity' => 0.5,
						'blur'    => 3,
						'spread'  => 4,
						'hOffset' => 5,
						'vOffset' => 6,
						'inset'   => false,
					],
				],
			],
			'expected'   => '{box-shadow:5px 6px 3px 4px rgba(0, 0, 0, 0.5);}',
		];
		yield 'shadow the editor did not save' => [
			'section'    => new Kadence_Blocks_Css_Shadow_Section( 'shadowHover' ),
			'attributes' => [ 'shadowHover' => 'none' ],
			'expected'   => '{box-shadow:rgba(0, 0, 0, 0.2) 0px 0px 14px 0px;}',
		];
		yield 'border color with opacity' => [
			'section'    => new Kadence_Blocks_Column_Border_Color_Css(),
			'attributes' => [
				'border'        => '#ff0000',
				'borderOpacity' => 0.4,
			],
			'expected'   => '{border-color:rgba(255, 0, 0, 0.4);}',
		];
		yield 'border color without opacity' => [
			'section'    => new Kadence_Blocks_Column_Border_Color_Css(),
			'attributes' => [ 'border' => '#ff0000' ],
			'expected'   => '{border-color:#ff0000;}',
		];
		yield 'no border color' => [
			'section'    => new Kadence_Blocks_Column_Border_Color_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'old horizontal gap' => [
			'section'    => new Kadence_Blocks_Column_Horizontal_Gap_Css(),
			'attributes' => [
				'gutter'         => [ 20 ],
				'gutterVariable' => [ 'custom' ],
				'gutterUnit'     => 'px',
			],
			'expected'   => '{gap:20px;}',
		];
		yield 'vertical gap' => [
			'section'    => new Kadence_Blocks_Column_Vertical_Gap_Css(),
			'attributes' => [
				'rowGap'         => [ 5 ],
				'rowGapVariable' => [ 'custom' ],
				'rowGapUnit'     => 'px',
				'gutter'         => [ 1 ],
				'gutterVariable' => [ '' ],
				'gutterUnit'     => 'em',
			],
			'expected'   => '{row-gap:5px;column-gap:var(--global-kb-gap-sm, 1rem);}',
		];
	}

	/**
	 * @return Generator
	 */
	private function fillProvider(): Generator {
		yield 'background color' => [
			'section'    => new Kadence_Blocks_Column_Background_Color_Css(),
			'attributes' => [
				'background'        => '#ff0000',
				'backgroundOpacity' => 0.5,
			],
			'expected'   => '{background-color:rgba(255, 0, 0, 0.5);}',
		];
		yield 'no background color' => [
			'section'    => new Kadence_Blocks_Column_Background_Color_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'hover color removes the image' => [
			'section'    => new Kadence_Blocks_Column_Hover_Color_Css( 'backgroundHover', false ),
			'attributes' => [ 'backgroundHover' => '#00ff00' ],
			'expected'   => '{background-color:#00ff00;background-image:none;}',
		];
		yield 'overlay hover color' => [
			'section'    => new Kadence_Blocks_Column_Hover_Color_Css( 'overlayHover', true ),
			'attributes' => [ 'overlayHover' => '#00ff00' ],
			'expected'   => '{background-color:#00ff00;background-image:none;}',
		];
		yield 'no hover color' => [
			'section'    => new Kadence_Blocks_Column_Hover_Color_Css( 'overlayHover', true ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'background image with defaults' => [
			'section'    => new Kadence_Blocks_Column_Background_Image_Css( 'backgroundImg' ),
			'attributes' => [ 'backgroundImg' => [ [ 'bgImg' => 'a.jpg' ] ] ],
			'expected'   => "{background-image:url('a.jpg');background-size:cover;background-position:center center;background-attachment:scroll;background-repeat:no-repeat;}",
		];
		yield 'fixed background image scrolls on tablets' => [
			'section'    => new Kadence_Blocks_Column_Background_Image_Css( 'backgroundImg' ),
			'attributes' => [
				'backgroundImg' => [
					[
						'bgImg'           => 'a.jpg',
						'bgImgAttachment' => 'fixed',
						'bgImgSize'       => 'contain',
					],
				],
			],
			'expected'   => "{background-image:url('a.jpg');background-size:contain;background-position:center center;background-attachment:fixed;background-repeat:no-repeat;}@media all and (max-width: 1024px), only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (-webkit-min-device-pixel-ratio: 2) and (hover: none){{background-attachment:scroll;}}",
		];
		yield 'no background image' => [
			'section'    => new Kadence_Blocks_Column_Background_Image_Css( 'backgroundImg' ),
			'attributes' => [ 'backgroundImg' => [ [ 'bgImg' => '' ] ] ],
			'expected'   => '',
		];
		yield 'opacity' => [
			'section'    => new Kadence_Blocks_Column_Opacity_Css( 'overlayOpacity' ),
			'attributes' => [ 'overlayOpacity' => 0.5 ],
			'expected'   => '{opacity:0.5;}',
		];
		yield 'opacity of zero is dropped by the CSS builder, as it always was' => [
			'section'    => new Kadence_Blocks_Column_Opacity_Css( 'overlayOpacity' ),
			'attributes' => [ 'overlayOpacity' => 0 ],
			'expected'   => '',
		];
		yield 'opacity that is not a number' => [
			'section'    => new Kadence_Blocks_Column_Opacity_Css( 'overlayOpacity' ),
			'attributes' => [ 'overlayOpacity' => '' ],
			'expected'   => '',
		];
		yield 'backdrop filter' => [
			'section'    => new Kadence_Blocks_Column_Backdrop_Filter_Css(),
			'attributes' => [
				'backdropFilterType'   => 'blur',
				'backdropFilterString' => 'blur(5px)',
			],
			'expected'   => self::INNER . '{-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px);}',
		];
		yield 'no backdrop filter' => [
			'section'    => new Kadence_Blocks_Column_Backdrop_Filter_Css(),
			'attributes' => [
				'backdropFilterType'   => 'none',
				'backdropFilterString' => 'x',
			],
			'expected'   => '',
		];
		yield 'normal type is the default' => [
			'section'    => new Kadence_Blocks_Css_Typed_Section(
				'backgroundType',
				[
					'normal'   => [ new Kadence_Blocks_Css_Value_Section( 'color', 'one' ) ],
					'gradient' => [ new Kadence_Blocks_Css_Value_Section( 'color', 'two' ) ],
				] 
			),
			'attributes' => [
				'one' => 'red',
				'two' => 'blue',
			],
			'expected'   => '{color:red;}',
		];
		yield 'gradient type' => [
			'section'    => new Kadence_Blocks_Css_Typed_Section(
				'backgroundType',
				[
					'normal'   => [ new Kadence_Blocks_Css_Value_Section( 'color', 'one' ) ],
					'gradient' => [ new Kadence_Blocks_Css_Value_Section( 'color', 'two' ) ],
				] 
			),
			'attributes' => [
				'backgroundType' => 'gradient',
				'one'            => 'red',
				'two'            => 'blue',
			],
			'expected'   => '{color:blue;}',
		];
		yield 'unknown type' => [
			'section'    => new Kadence_Blocks_Css_Typed_Section( 'backgroundType', [ 'normal' => [ new Kadence_Blocks_Css_Value_Section( 'color', 'one' ) ] ] ),
			'attributes' => [
				'backgroundType' => 'video',
				'one'            => 'red',
			],
			'expected'   => '',
		];
		yield 'type that is not text' => [
			'section'    => new Kadence_Blocks_Css_Typed_Section( 'backgroundType', [ 'normal' => [ new Kadence_Blocks_Css_Value_Section( 'color', 'one' ) ] ] ),
			'attributes' => [
				'backgroundType' => [ 'normal' ],
				'one'            => 'red',
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function ruleProvider(): Generator {
		yield 'text align' => [
			'section'    => new Kadence_Blocks_Column_Text_Align_Css( 1 ),
			'attributes' => [ 'textAlign' => [ 'left', 'right' ] ],
			'expected'   => self::COLUMN . '{text-align:right;}',
		];
		yield 'no text align' => [
			'section'    => new Kadence_Blocks_Column_Text_Align_Css( 2 ),
			'attributes' => [ 'textAlign' => [ 'left', 'right' ] ],
			'expected'   => '',
		];
		yield 'color' => [
			'section'    => new Kadence_Blocks_Column_Color_Rule_Css( 'linkColor', '{col} a' ),
			'attributes' => [ 'linkColor' => '#222222' ],
			'expected'   => self::COLUMN . ' a{color:#222222;}',
		];
		yield 'no color' => [
			'section'    => new Kadence_Blocks_Column_Color_Rule_Css( 'linkColor', '{col} a' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'stacking order' => [
			'section'    => new Kadence_Blocks_Column_Z_Index_Css(),
			'attributes' => [ 'zIndex' => 5 ],
			'expected'   => self::COLUMN . '{z-index:5;position:relative;}',
		];
		yield 'stacking order zero is automatic' => [
			'section'    => new Kadence_Blocks_Column_Z_Index_Css(),
			'attributes' => [ 'zIndex' => 0 ],
			'expected'   => self::COLUMN . '{z-index:auto;position:relative;}',
		];
		yield 'no stacking order' => [
			'section'    => new Kadence_Blocks_Column_Z_Index_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'collapse order on tablet' => [
			'section'    => new Kadence_Blocks_Column_Collapse_Order_Css( 'tab', '' ),
			'attributes' => [ 'collapseOrder' => 3 ],
			'expected'   => '.kt-row-column-wrap.kt-tab-layout-three-grid > ' . self::COLUMN . ', .kt-row-column-wrap.kt-tab-layout-two-grid > ' . self::COLUMN . ', .kt-row-column-wrap.kt-tab-layout-row > ' . self::COLUMN . '{order:3;}',
		];
		yield 'collapse order on mobile' => [
			'section'    => new Kadence_Blocks_Column_Collapse_Order_Css( 'mobile', ' !important' ),
			'attributes' => [ 'collapseOrder' => 0 ],
			'expected'   => '.kt-row-column-wrap.kt-mobile-layout-three-grid > ' . self::COLUMN . ', .kt-row-column-wrap.kt-mobile-layout-two-grid > ' . self::COLUMN . ', .kt-row-column-wrap.kt-mobile-layout-row > ' . self::COLUMN . '{order:0 !important;}',
		];
		yield 'no collapse order' => [
			'section'    => new Kadence_Blocks_Column_Collapse_Order_Css( 'tab', '' ),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function legacyProvider(): Generator {
		self::load_sections();

		yield 'filled' => [
			'condition'  => new Kadence_Blocks_Css_Legacy_Condition( [ 'border' ], [], [] ),
			'attributes' => [ 'border' => '#fff' ],
			'expected'   => true,
		];
		yield 'not filled' => [
			'condition'  => new Kadence_Blocks_Css_Legacy_Condition( [ 'border' ], [], [] ),
			'attributes' => [ 'border' => '' ],
			'expected'   => false,
		];
		yield 'number' => [
			'condition'  => new Kadence_Blocks_Css_Legacy_Condition( [], [ 'topPadding' ], [] ),
			'attributes' => [ 'topPadding' => '0' ],
			'expected'   => true,
		];
		yield 'not a number' => [
			'condition'  => new Kadence_Blocks_Css_Legacy_Condition( [], [ 'topPadding' ], [] ),
			'attributes' => [ 'topPadding' => '' ],
			'expected'   => false,
		];
		yield 'side of a list' => [
			'condition'  => new Kadence_Blocks_Css_Legacy_Condition( [], [], [ 'borderWidth' ] ),
			'attributes' => [ 'borderWidth' => [ '', '', '', 2 ] ],
			'expected'   => true,
		];
		yield 'list without numbers' => [
			'condition'  => new Kadence_Blocks_Css_Legacy_Condition( [], [], [ 'borderWidth' ] ),
			'attributes' => [ 'borderWidth' => [ '', '', '', '' ] ],
			'expected'   => false,
		];
		yield 'every side and device of a property' => [
			'condition'  => Kadence_Blocks_Css_Legacy_Condition::sides( 'margin' ),
			'attributes' => [ 'rightMarginM' => 1 ],
			'expected'   => true,
		];
		yield 'no side of a property' => [
			'condition'  => Kadence_Blocks_Css_Legacy_Condition::sides( 'margin' ),
			'attributes' => [ 'rightPaddingM' => 1 ],
			'expected'   => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function gapConditionProvider(): Generator {
		yield 'version one flowing across' => [
			'attributes' => [ 'direction' => [ 'horizontal' ] ],
			'expected'   => true,
		];
		yield 'version two flowing across' => [
			'attributes' => [
				'direction' => [ 'horizontal' ],
				'kbVersion' => 2,
			],
			'expected'   => false,
		];
		yield 'reversed' => [
			'attributes' => [ 'direction' => [ 'horizontal-reverse' ] ],
			'expected'   => false,
		];
		yield 'vertical' => [
			'attributes' => [],
			'expected'   => false,
		];
	}
}
