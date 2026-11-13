<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Rowlayout;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Rowlayout_Blend_Css;
use Kadence_Blocks_Rowlayout_Border_Color_Css;
use Kadence_Blocks_Rowlayout_Clip_Css;
use Kadence_Blocks_Rowlayout_Color_Output_Css;
use Kadence_Blocks_Rowlayout_Columns;
use Kadence_Blocks_Rowlayout_Custom_Css;
use Kadence_Blocks_Rowlayout_Default_Padding_Css;
use Kadence_Blocks_Rowlayout_Grid_Css;
use Kadence_Blocks_Rowlayout_Image_Css;
use Kadence_Blocks_Rowlayout_Min_Height_Css;
use Kadence_Blocks_Rowlayout_Min_Height_Device_Css;
use Kadence_Blocks_Rowlayout_Order_Css;
use Kadence_Blocks_Rowlayout_Overlay_Color_Css;
use Kadence_Blocks_Rowlayout_Overlay_Old_Gradient_Css;
use Kadence_Blocks_Rowlayout_Padding_Entries_Css;
use Kadence_Blocks_Rowlayout_Padding_Fallback_Css;
use Kadence_Blocks_Rowlayout_Radius_Condition;
use Kadence_Blocks_Rowlayout_Responsive_Overlay_Css;
use Kadence_Blocks_Rowlayout_Selectors;
use Kadence_Blocks_Rowlayout_Separator_Css;
use Kadence_Blocks_Rowlayout_Separator_Layer_Css;
use Kadence_Blocks_Rowlayout_Slider_Pause_Css;
use Kadence_Blocks_Rowlayout_Vertical_Alignment_Css;
use Kadence_Blocks_Rowlayout_Vertical_Padding_Css;
use Kadence_Blocks_Rowlayout_Visibility_Css;
use Kadence_Blocks_Rowlayout_Z_Index_Css;

/**
 * The sections of the row layout CSS, one by one.
 */
final class RowlayoutSectionsTest extends Rowlayout_Test_Case {

	private const BASE = '.kb-row-layout-idabc';

	private const INNER = '.kb-row-layout-idabc > .kt-row-column-wrap';

	/**
	 * A section writes the CSS expected for the attributes of a version two row.
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
		$this->assertSameCss( $expected, $this->write_row( $section, $attributes + [ 'kbVersion' => 2 ], $selector ) );
	}

	/**
	 * The selectors depend on the version of the block.
	 *
	 * @return void
	 */
	public function testSelectorsDependOnTheVersion(): void {
		$old = new Kadence_Blocks_Rowlayout_Selectors( [], 'abc' );
		$new = new Kadence_Blocks_Rowlayout_Selectors( [ 'kbVersion' => 2 ], 'abc' );

		$this->assertFalse( $old->is_updated() );
		$this->assertSame( '#kt-layout-idabc', $old->base() );
		$this->assertSame( '#kt-layout-idabc > .kt-row-column-wrap', $old->inner() );
		$this->assertSame( '#kt-layout-idabc a', $old->resolve( '{margin} a' ) );
		$this->assertTrue( $new->is_updated() );
		$this->assertSame( self::BASE, $new->base() );
		$this->assertSame( self::INNER, $new->inner() );
		$this->assertSame( '.kb-row-layout-wrap.wp-block-kadence-rowlayout.kb-row-layout-idabc a', $new->resolve( '{margin} a' ) );
	}

	/**
	 * The columns fall back to two equal columns, and every device falls back to the one before it.
	 *
	 * @dataProvider columnsProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param mixed                $count      The number of columns expected.
	 * @param string[]             $layouts    The layouts expected for desktop, tablet and mobile.
	 *
	 * @return void
	 */
	public function testColumns( array $attributes, $count, array $layouts ): void {
		$columns = new Kadence_Blocks_Rowlayout_Columns( $attributes );

		$this->assertSame( $count, $columns->count() );
		$this->assertSame( $layouts, [ $columns->layout_for( 'desktop' ), $columns->layout_for( 'tablet' ), $columns->layout_for( 'mobile' ) ] );
	}

	/**
	 * Only some layouts can reverse the order of the columns, and only when the editor asked for it.
	 *
	 * @return void
	 */
	public function testCollapsing(): void {
		$reversing = new Kadence_Blocks_Rowlayout_Columns( [ 'collapseOrder' => 'right-to-left' ] );
		$ltr       = new Kadence_Blocks_Rowlayout_Columns( [ 'collapseOrder' => 'left-to-right' ] );
		$unset     = new Kadence_Blocks_Rowlayout_Columns( [] );

		$this->assertTrue( $reversing->is_collapsing( 'row' ) );
		$this->assertTrue( $reversing->is_collapsing( 'first-row' ) );
		$this->assertFalse( $reversing->is_collapsing( 'equal' ) );
		$this->assertFalse( $ltr->is_collapsing( 'row' ) );
		$this->assertFalse( $unset->is_collapsing( 'row' ) );
	}

	/**
	 * The widths are what the editor saved for the device, an empty string for the columns without one.
	 *
	 * @return void
	 */
	public function testWidths(): void {
		$columns = new Kadence_Blocks_Rowlayout_Columns(
			[
				'firstColumnWidth'        => 30,
				'secondColumnWidthTablet' => 40,
				'sixthColumnWidthMobile'  => 50,
			]
		);

		$this->assertSame( [ 30, '', '', '', '', '' ], $columns->widths( 'desktop' ) );
		$this->assertSame( [ '', 40, '', '', '', '' ], $columns->widths( 'tablet' ) );
		$this->assertSame( [ '', '', '', '', '', 50 ], $columns->widths( 'mobile' ) );
	}

	/**
	 * A tablet without widths of its own uses the widths of desktop, as the block says.
	 *
	 * @dataProvider inheritedWidthsProvider
	 *
	 * @param bool     $custom   Whether the block says the tablet has its own widths.
	 * @param string[] $expected The widths expected.
	 *
	 * @return void
	 */
	public function testTabletInheritsWidths( bool $custom, array $expected ): void {
		$attributes = [
			'columns'                => 3,
			'firstColumnWidth'       => 30,
			'firstColumnWidthTablet' => 40,
		];

		$this->answers['has_custom_widths'] = $custom;
		$input                              = $this->row_input( $attributes, new Kadence_Blocks_CSS() );

		$this->assertSame( $expected, ( new Kadence_Blocks_Rowlayout_Columns( $attributes ) )->widths_for( $input, 'tablet_inherit' ) );
		$this->assertSame( [ 'has_custom_widths', 3, 40, '', '', '', '', '' ], $this->calls[0] );
	}

	/**
	 * The grid asks the block for its template, with the gap of its device and the layout and widths it was told to use.
	 *
	 * @return void
	 */
	public function testGridAsksTheBlockForItsTemplate(): void {
		$this->answers['get_template_columns'] = 'repeat(2, 1fr)';

		$css = $this->write_row(
			new Kadence_Blocks_Rowlayout_Grid_Css( 'mobile', 'mobile', 'tablet' ),
			[
				'kbVersion'              => 2,
				'mobileLayout'           => 'two-grid',
				'firstColumnWidthMobile' => 100,
			] 
		);

		$this->assertSame( '{grid-template-columns:repeat(2, 1fr);}', str_replace( [ self::INNER ], '', $css ) );
		$this->assertSame( 'get_template_columns', $this->calls[0][0] );
		$this->assertSame( 2, $this->calls[0][2] );
		$this->assertSame( 'two-grid', $this->calls[0][3] );
		$this->assertSame( self::INNER, $this->calls[0][4] );
		$this->assertSame( [ 100, '', '', '', '', '' ], array_slice( $this->calls[0], 6 ) );
	}

	/**
	 * Only a corner with a radius that is a number and not zero rounds the row.
	 *
	 * @dataProvider radiusProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the row has a rounded corner.
	 *
	 * @return void
	 */
	public function testRadiusCondition( array $attributes, bool $expected ): void {
		$input = $this->row_input( $attributes, new Kadence_Blocks_CSS() );

		$this->assertSame( $expected, ( new Kadence_Blocks_Rowlayout_Radius_Condition() )->is_met( $input ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/rowlayout/loader.php';

		yield from $this->spacingProvider();
		yield from $this->layoutProvider();
		yield from $this->decorationProvider();
		yield from $this->overlayProvider();
		yield from $this->edgeProvider();
	}

	/**
	 * @return Generator
	 */
	private function spacingProvider(): Generator {
		yield 'separators put the grid of an old row above them' => [
			'section'    => new Kadence_Blocks_Rowlayout_Separator_Layer_Css(),
			'attributes' => [
				'kbVersion' => 1,
				'topSep'    => 'wave',
			],
			'expected'   => '{z-index:10;position:relative;}',
		];
		yield 'a new row needs no layer for its separators' => [
			'section'    => new Kadence_Blocks_Rowlayout_Separator_Layer_Css(),
			'attributes' => [ 'topSep' => 'wave' ],
			'expected'   => '',
		];
		yield 'no separator no layer' => [
			'section'    => new Kadence_Blocks_Rowlayout_Separator_Layer_Css(),
			'attributes' => [
				'kbVersion' => 1,
				'topSep'    => 'none',
				'bottomSep' => '',
			],
			'expected'   => '',
		];
		yield 'middle alignment' => [
			'section'    => new Kadence_Blocks_Rowlayout_Vertical_Alignment_Css(),
			'attributes' => [ 'verticalAlignment' => 'middle' ],
			'expected'   => self::INNER . '{align-content:center;}:where(' . self::INNER . ') > .wp-block-kadence-column{justify-content:center;}',
			'selector'   => self::INNER,
		];
		yield 'bottom alignment' => [
			'section'    => new Kadence_Blocks_Rowlayout_Vertical_Alignment_Css(),
			'attributes' => [ 'verticalAlignment' => 'bottom' ],
			'expected'   => self::INNER . '{align-content:end;}:where(' . self::INNER . ') > .wp-block-kadence-column{justify-content:end;}',
			'selector'   => self::INNER,
		];
		yield 'unknown alignment' => [
			'section'    => new Kadence_Blocks_Rowlayout_Vertical_Alignment_Css(),
			'attributes' => [ 'verticalAlignment' => 'stretch' ],
			'expected'   => '',
		];
		yield 'old padding defaults' => [
			'section'    => new Kadence_Blocks_Rowlayout_Default_Padding_Css(),
			'attributes' => [ 'kbVersion' => 0 ],
			'expected'   => '{padding-top:var( --global-kb-row-default-top, 25px );padding-bottom:var( --global-kb-row-default-bottom, 25px );}',
		];
		yield 'no old padding defaults for a new row' => [
			'section'    => new Kadence_Blocks_Rowlayout_Default_Padding_Css(),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'padding of a unit that is not pixels is always written' => [
			'section'    => new Kadence_Blocks_Rowlayout_Vertical_Padding_Css(),
			'attributes' => [
				'topPadding'  => 10,
				'paddingUnit' => 'em',
			],
			'expected'   => '{padding-top:10em;padding-bottom:25em;}',
		];
		yield 'padding in pixels is written when it was saved' => [
			'section'    => new Kadence_Blocks_Rowlayout_Vertical_Padding_Css(),
			'attributes' => [ 'bottomPadding' => 0 ],
			'expected'   => '{padding-bottom:0px;}',
		];
		yield 'old padding on tablet' => [
			'section'    => new Kadence_Blocks_Rowlayout_Padding_Entries_Css( 'tablet', [ [ 'padding-top', 'tabletPadding', 0 ], [ 'padding-left', 'tabletPadding', 3 ] ] ),
			'attributes' => [
				'tabletPadding' => [ 1, 2, 3, 4 ],
				'paddingUnit'   => 'rem',
			],
			'expected'   => '@media all and (max-width: 1024px){{padding-top:1rem;padding-left:4rem;}}',
		];
		yield 'old padding on desktop in pixels' => [
			'section'    => new Kadence_Blocks_Rowlayout_Padding_Entries_Css( 'desktop', [ [ 'padding-left', 'leftPadding', null ] ] ),
			'attributes' => [ 'leftPadding' => 7 ],
			'expected'   => '{padding-left:7px;}',
		];
		yield 'default padding when none was saved' => [
			'section'    => new Kadence_Blocks_Rowlayout_Padding_Fallback_Css(),
			'attributes' => [],
			'expected'   => '{padding-top:var( --global-kb-row-default-top, var(--global-kb-spacing-sm, 1.5rem) );padding-bottom:var( --global-kb-row-default-bottom, var(--global-kb-spacing-sm, 1.5rem) );}',
		];
		yield 'no default padding when one was saved' => [
			'section'    => new Kadence_Blocks_Rowlayout_Padding_Fallback_Css(),
			'attributes' => [ 'padding' => [ '', '', '', '' ] ],
			'expected'   => '',
		];
		yield 'minimum height' => [
			'section'    => new Kadence_Blocks_Rowlayout_Min_Height_Css(),
			'attributes' => [
				'minHeight'     => 300,
				'minHeightUnit' => 'vh',
			],
			'expected'   => '{min-height:300vh;}',
		];
		yield 'minimum height of a device' => [
			'section'    => new Kadence_Blocks_Rowlayout_Min_Height_Device_Css( 'mobile', 'minHeightMobile' ),
			'attributes' => [ 'minHeightMobile' => 100 ],
			'expected'   => '@media all and (max-width: 767px){{min-height:100px;}}',
		];
		yield 'no minimum height of a device' => [
			'section'    => new Kadence_Blocks_Rowlayout_Min_Height_Device_Css( 'mobile', 'minHeightMobile' ),
			'attributes' => [ 'minHeightMobile' => '' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function layoutProvider(): Generator {
		yield 'the order of the columns of a row of two' => [
			'section'    => new Kadence_Blocks_Rowlayout_Order_Css( 'desktop' ),
			'attributes' => [
				'columns'       => 2,
				'colLayout'     => 'row',
				'collapseOrder' => 'right-to-left',
			],
			'expected'   => $this->order( 2 ),
		];
		yield 'no order when the layout does not collapse' => [
			'section'    => new Kadence_Blocks_Rowlayout_Order_Css( 'desktop' ),
			'attributes' => [
				'columns'       => 2,
				'colLayout'     => 'equal',
				'collapseOrder' => 'right-to-left',
			],
			'expected'   => '',
		];
	}

	/**
	 * The order of the columns of four rows of a number of columns.
	 *
	 * @param int $count How many columns a row has.
	 *
	 * @return string
	 */
	private function order( int $count ): string {
		$css = '';

		foreach ( [ 0, 1, 2, 3 ] as $row ) {
			foreach ( range( 1, $count ) as $item ) {
				$css .= self::INNER . ' > .wp-block-kadence-column:nth-child(' . ( $item + $row * $count ) . ' of *:not(style)){order:' . ( $count - $item + 1 + $row * 10 ) . ';}';
			}
		}

		return $css;
	}

	/**
	 * @return Generator
	 */
	private function decorationProvider(): Generator {
		yield 'the row is clipped by its rounded corners' => [
			'section'    => new Kadence_Blocks_Rowlayout_Clip_Css(),
			'attributes' => [],
			'expected'   => '{overflow:clip;isolation:isolate;}',
		];
		yield 'clipping switched off' => [
			'section'    => new Kadence_Blocks_Rowlayout_Clip_Css(),
			'attributes' => [ 'borderRadiusOverflow' => false ],
			'expected'   => '{isolation:isolate;}',
		];
		yield 'border color of a device' => [
			'section'    => new Kadence_Blocks_Rowlayout_Border_Color_Css( 'tablet', 'tabletBorder' ),
			'attributes' => [ 'tabletBorder' => '#ff0000' ],
			'expected'   => '@media all and (max-width: 1024px){{border-color:#ff0000;}}',
		];
		yield 'no border color of a device' => [
			'section'    => new Kadence_Blocks_Rowlayout_Border_Color_Css( 'tablet', 'tabletBorder' ),
			'attributes' => [],
			'expected'   => '',
		];
		yield 'a background image with its settings' => [
			'section'    => new Kadence_Blocks_Rowlayout_Image_Css( 'bgImg' ),
			'attributes' => [
				'bgImg'         => 'a.jpg',
				'bgImgSize'     => 'contain',
				'bgImgRepeat'   => 'repeat',
				'bgImgPosition' => 'top',
			],
			'expected'   => "{background-image:url('a.jpg');background-size:contain;background-position:top;background-attachment:scroll;background-repeat:repeat;}",
		];
		yield 'a parallax image is fixed, and scrolls on tablets' => [
			'section'    => new Kadence_Blocks_Rowlayout_Image_Css( 'bgImg' ),
			'attributes' => [
				'bgImg'           => 'a.jpg',
				'bgImgAttachment' => 'parallax',
			],
			'expected'   => "{background-image:url('a.jpg');background-size:cover;background-position:center center;background-attachment:fixed;background-repeat:no-repeat;}@media all and (max-width: 1024px), only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (-webkit-min-device-pixel-ratio: 2) and (hover: none){{background-attachment:scroll;}}",
		];
		yield 'no background image' => [
			'section'    => new Kadence_Blocks_Rowlayout_Image_Css( 'bgImg' ),
			'attributes' => [ 'bgImg' => '' ],
			'expected'   => '',
		];
		yield 'stacking order of a new row' => [
			'section'    => new Kadence_Blocks_Rowlayout_Z_Index_Css(),
			'attributes' => [ 'zIndex' => 3 ],
			'expected'   => self::BASE . '{z-index:3;position:relative;}',
		];
		yield 'stacking order of an old row goes on the grid' => [
			'section'    => new Kadence_Blocks_Rowlayout_Z_Index_Css(),
			'attributes' => [
				'kbVersion' => 1,
				'zIndex'    => 3,
			],
			'expected'   => '#kt-layout-idabc > .kt-row-column-wrap{z-index:3;position:relative;}',
		];
		yield 'no stacking order' => [
			'section'    => new Kadence_Blocks_Rowlayout_Z_Index_Css(),
			'attributes' => [ 'zIndex' => 'high' ],
			'expected'   => '',
		];
		yield 'text color' => [
			'section'    => new Kadence_Blocks_Rowlayout_Color_Output_Css( 'linkColor', '{base} a' ),
			'attributes' => [ 'linkColor' => '#222222' ],
			'expected'   => self::BASE . ' a{color:#222222;}',
		];
		yield 'no text color' => [
			'section'    => new Kadence_Blocks_Rowlayout_Color_Output_Css( 'linkColor', '{base} a' ),
			'attributes' => [ 'linkColor' => '' ],
			'expected'   => '',
		];
		yield 'custom css' => [
			'section'    => new Kadence_Blocks_Rowlayout_Custom_Css(),
			'attributes' => [ 'kadenceBlockCSS' => '' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function overlayProvider(): Generator {
		yield 'overlay color with its opacity' => [
			'section'    => new Kadence_Blocks_Rowlayout_Overlay_Color_Css(),
			'attributes' => [
				'overlay'             => '#ff0000',
				'overlayFirstOpacity' => 0.5,
			],
			'expected'   => '{background-color:rgba(255, 0, 0, 0.5);}',
		];
		yield 'overlay blend mode' => [
			'section'    => new Kadence_Blocks_Rowlayout_Blend_Css(),
			'attributes' => [ 'overlayBlendMode' => 'multiply' ],
			'expected'   => '{mix-blend-mode:multiply;}',
		];
		yield 'no overlay blend mode' => [
			'section'    => new Kadence_Blocks_Rowlayout_Blend_Css(),
			'attributes' => [ 'overlayBlendMode' => 'none' ],
			'expected'   => '',
		];
		yield 'the old gradient of the overlay' => [
			'section'    => new Kadence_Blocks_Rowlayout_Overlay_Old_Gradient_Css(),
			'attributes' => [
				'overlay'              => '#ff0000',
				'overlaySecond'        => '#0000ff',
				'overlayGradAngle'     => 45,
				'overlayGradLoc'       => 10,
				'overlayGradLocSecond' => 90,
			],
			'expected'   => '{background-image:linear-gradient(45deg, #ff0000 10%, #0000ff 90%);}',
		];
		yield 'the old gradient of the overlay with its defaults' => [
			'section'    => new Kadence_Blocks_Rowlayout_Overlay_Old_Gradient_Css(),
			'attributes' => [ 'overlayGradType' => 'radial' ],
			'expected'   => '{background-image:radial-gradient(at center center, transparent 0%, #00B5E2 100%);}',
		];
		yield 'the overlay of tablet' => [
			'section'    => new Kadence_Blocks_Rowlayout_Responsive_Overlay_Css( 'tablet', 'tabletOverlay' ),
			'attributes' => [
				'tabletOverlay' => [
					[
						'enable'           => true,
						'overlay'          => '#ff0000',
						'overlayBlendMode' => 'screen',
						'overlayOpacity'   => 50,
					],
				],
			],
			'expected'   => '@media all and (max-width: 1024px){' . self::BASE . ' > .kt-row-layout-overlay{opacity:0.50;background:#ff0000;mix-blend-mode:screen;}}',
		];
		yield 'the old gradient of the overlay of mobile' => [
			'section'    => new Kadence_Blocks_Rowlayout_Responsive_Overlay_Css( 'mobile', 'mobileOverlay' ),
			'attributes' => [
				'mobileOverlay' => [
					[
						'enable'               => true,
						'currentOverlayTab'    => 'grad',
						'overlay'              => '#ff0000',
						'overlayGradType'      => 'radial',
						'overlayBgImgPosition' => 'top',
					],
				],
			],
			'expected'   => '@media all and (max-width: 767px){' . self::BASE . ' > .kt-row-layout-overlay{background-image:radial-gradient(at top, #ff0000 0%, #00B5E2 100%);}}',
		];
		yield 'the overlay of a device that is not enabled' => [
			'section'    => new Kadence_Blocks_Rowlayout_Responsive_Overlay_Css( 'tablet', 'tabletOverlay' ),
			'attributes' => [
				'tabletOverlay' => [
					[
						'enable'  => false,
						'overlay' => '#ff0000',
					],
				],
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function edgeProvider(): Generator {
		yield 'bottom separator' => [
			'section'    => new Kadence_Blocks_Rowlayout_Separator_Css( 'bottom', false ),
			'attributes' => [
				'bottomSep'            => 'wave',
				'bottomSepHeight'      => 80,
				'bottomSepWidth'       => 120,
				'bottomSepColor'       => '#ff0000',
				'bottomSepHeightTab'   => 60,
				'bottomSepWidthMobile' => 'wide',
			],
			'expected'   => self::BASE . ' .kt-row-layout-bottom-sep{height:80px;}' . self::BASE . ' .kt-row-layout-bottom-sep svg{width:120%;fill:#ff0000!important;}'
				. '@media all and (max-width: 1024px){' . self::BASE . ' .kt-row-layout-bottom-sep{height:60px;}}'
				. '@media all and (max-width: 767px){' . self::BASE . ' .kt-row-layout-bottom-sep svg{width:wide%;}}',
		];
		yield 'top separator only counts numbers' => [
			'section'    => new Kadence_Blocks_Rowlayout_Separator_Css( 'top', true ),
			'attributes' => [
				'topSep'           => 'tilt',
				'topSepWidth'      => 'wide',
				'topSepHeightUnit' => 'vh',
				'topSepWidthTab'   => 90,
			],
			'expected'   => self::BASE . ' .kt-row-layout-top-sep{height:100vh;}'
				. '@media all and (max-width: 1024px){' . self::BASE . ' .kt-row-layout-top-sep svg{width:90%;}}',
		];
		yield 'no separator' => [
			'section'    => new Kadence_Blocks_Rowlayout_Separator_Css( 'top', true ),
			'attributes' => [
				'topSep'       => 'none',
				'topSepHeight' => 5,
			],
			'expected'   => '',
		];
		yield 'hidden on desktop' => [
			'section'    => new Kadence_Blocks_Rowlayout_Visibility_Css( 'vsdesk', 'desktopOnly' ),
			'attributes' => [ 'vsdesk' => true ],
			'expected'   => '@media all and (min-width: 1025px){' . self::BASE . '{display:none !important;}}',
		];
		yield 'not hidden' => [
			'section'    => new Kadence_Blocks_Rowlayout_Visibility_Css( 'vsdesk', 'desktopOnly' ),
			'attributes' => [ 'vsdesk' => false ],
			'expected'   => '',
		];
		yield 'the pause button of a slider, dark on light' => [
			'section'    => new Kadence_Blocks_Rowlayout_Slider_Pause_Css(),
			'attributes' => [
				'backgroundSettingTab'     => 'slider',
				'backgroundSliderSettings' => [
					[
						'arrowStyle'      => 'blackonlight',
						'showPauseButton' => true,
					],
				],
			],
			'expected'   => self::BASE . ' .kb-blocks-bg-slider .kb-gallery-pause-button{background-color:rgba(255, 255, 255, 0.8);color:#000;border:none;}',
		];
		yield 'the pause button of a slider, an outline' => [
			'section'    => new Kadence_Blocks_Rowlayout_Slider_Pause_Css(),
			'attributes' => [
				'backgroundSettingTab'     => 'slider',
				'backgroundSliderSettings' => [
					[
						'arrowStyle'      => 'outlinewhite',
						'showPauseButton' => true,
					],
				],
			],
			'expected'   => self::BASE . ' .kb-blocks-bg-slider .kb-gallery-pause-button{background-color:transparent;color:#fff;border:2px solid #fff;}',
		];
		yield 'the pause button of a slider with an unknown style' => [
			'section'    => new Kadence_Blocks_Rowlayout_Slider_Pause_Css(),
			'attributes' => [
				'backgroundSettingTab'     => 'slider',
				'backgroundSliderSettings' => [
					[
						'arrowStyle'      => 'weird',
						'showPauseButton' => true,
					],
				],
			],
			'expected'   => self::BASE . ' .kb-blocks-bg-slider .kb-gallery-pause-button{background-color:rgba(0, 0, 0, 0.8);color:#fff;border:none;}',
		];
		yield 'no pause button' => [
			'section'    => new Kadence_Blocks_Rowlayout_Slider_Pause_Css(),
			'attributes' => [
				'backgroundSettingTab'     => 'slider',
				'backgroundSliderSettings' => [ [ 'showPauseButton' => false ] ],
			],
			'expected'   => '',
		];
		yield 'no slider no pause button' => [
			'section'    => new Kadence_Blocks_Rowlayout_Slider_Pause_Css(),
			'attributes' => [ 'backgroundSettingTab' => 'normal' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function columnsProvider(): Generator {
		yield 'nothing saved' => [
			'attributes' => [],
			'count'      => 2,
			'layouts'    => [ 'equal', 'equal', 'row' ],
		];
		yield 'a tablet layout of its own' => [
			'attributes' => [
				'columns'      => 3,
				'colLayout'    => 'left-golden',
				'tabletLayout' => 'row',
				'mobileLayout' => 'two-grid',
			],
			'count'      => 3,
			'layouts'    => [ 'left-golden', 'row', 'two-grid' ],
		];
		yield 'a tablet layout that inherits' => [
			'attributes' => [
				'colLayout'    => 'left-golden',
				'tabletLayout' => 'inherit',
			],
			'count'      => 2,
			'layouts'    => [ 'left-golden', 'left-golden', 'row' ],
		];
	}

	/**
	 * @return Generator
	 */
	public function inheritedWidthsProvider(): Generator {
		yield 'a tablet with widths of its own' => [
			'custom'   => true,
			'expected' => [ 40, '', '', '', '', '' ],
		];
		yield 'a tablet that uses the widths of desktop' => [
			'custom'   => false,
			'expected' => [ 30, '', '', '', '', '' ],
		];
	}

	/**
	 * @return Generator
	 */
	public function radiusProvider(): Generator {
		yield 'a radius' => [
			'attributes' => [ 'borderRadius' => [ 0, 0, 5, 0 ] ],
			'expected'   => true,
		];
		yield 'only zeros' => [
			'attributes' => [ 'borderRadius' => [ 0, 0, 0, 0 ] ],
			'expected'   => false,
		];
		yield 'not numbers' => [
			'attributes' => [ 'borderRadius' => [ '', 'x', null, '' ] ],
			'expected'   => false,
		];
		yield 'nothing saved' => [
			'attributes' => [],
			'expected'   => false,
		];
	}
}
