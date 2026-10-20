<?php
// cspell:ignore tableofcontents .

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use IntegrationTester;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Tableofcontents_Block;
use KadenceWP\KadenceBlocks\Site_Styles\Supported_Blocks;
use Tests\integration\Kadence\SiteStyles\Support\SiteValuesTrait;

/**
 * Covers the site-level styles of the Table of Contents. Its editor paints the title
 * and the list inline, so the Kadence-only site values reach the instance attributes
 * through the overlay; the list's text color is core's.
 */
final class SiteStylesTableOfContentsTest extends WPTestCase {
	use SiteValuesTrait;

	protected IntegrationTester $tester;

	/**
	 * Restores the block type a test re-registered and empties the CSS a test built.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		Kadence_Blocks_CSS::$styles = [];

		$this->restore_reregistered_block();

		parent::tearDown();
	}

	/**
	 * A table without values of its own takes the site values, and its own padding side wins over the site padding.
	 *
	 * @return void
	 */
	public function testTheSiteValuesFillWhatTheTableLeavesAtItsDefaults(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			'tableofcontents',
			[
				'titleColor'       => '#aa0000',
				'containerPadding' => [ 40, 40, 40, 40 ],
			]
		);

		$table = $this->render_attributes(
			'tableofcontents',
			[
				'uniqueID'         => 'a',
				'titleColor'       => '#00aa00',
				'containerPadding' => [ 5, 'sm', 'sm', 'sm' ],
			]
		);
		$other = $this->render_attributes( 'tableofcontents', [ 'uniqueID' => 'b' ] );

		$this->assertSame( '#00aa00', $table['titleColor'] );
		$this->assertSame( [ 5, 40, 40, 40 ], $table['containerPadding'] );
		$this->assertSame( '#aa0000', $other['titleColor'] );
	}

	/**
	 * A table that still carries every registered default, as a rendered block does, shows a site value for each attribute the overlay lists.
	 *
	 * @return void
	 */
	public function testNoRegisteredDefaultHidesASiteValue(): void {
		$this->tester->enable_fse_mode();
		$defaults = Supported_Blocks::registered_defaults( 'kadence/tableofcontents' );
		$site     = [];

		foreach ( Kadence_Blocks_Tableofcontents_Block::get_instance()->site_styles_overlay_attributes() as $name ) {
			$site[ $name ] = $this->differing_value( $defaults[ $name ] ?? null );
		}

		$this->store_site_values( 'tableofcontents', $site );

		$rendered = $this->render_attributes( 'tableofcontents', $defaults );

		foreach ( $site as $name => $value ) {
			$this->assertSame( $value, $rendered[ $name ], $name );
		}
	}

	/**
	 * The title text, the toggle, the scrolling and the heading search describe one table, so no site value reaches them.
	 *
	 * @return void
	 */
	public function testStoredContentNeverReachesATable(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			'tableofcontents',
			[
				'titleColor'          => '#aa0000',
				'title'               => 'Site title',
				'enableTitle'         => false,
				'allowedHeaders'      => [ [ 'h1' => false ] ],
				'enableToggle'        => true,
				'toggleIcon'          => 'plus',
				'enableSmoothScroll'  => true,
				'enableDynamicSearch' => true,
			]
		);

		$this->assertSame(
			[
				'uniqueID'   => 'a',
				'titleColor' => '#aa0000',
			],
			$this->render_attributes( 'tableofcontents', [ 'uniqueID' => 'a' ] )
		);

		$excluded = Supported_Blocks::excluded_attributes( Kadence_Blocks_Tableofcontents_Block::get_instance() );

		foreach ( [ 'allowedHeaders', 'enableTitle', 'title', 'enableToggle', 'startClosed', 'toggleIcon', 'enableScrollSpy', 'enableSmoothScroll', 'smoothScrollOffset', 'enableDynamicSearch', 'enableTemplateSearch', 'enableTitleToggle', 'contentActiveColor', 'titleCollapseBorderColor' ] as $name ) {
			$this->assertContains( $name, $excluded, $name );
		}
	}

	/**
	 * The CSS a rendered table prints takes the site values, Tablet and Mobile in Kadence's media queries.
	 *
	 * @return void
	 */
	public function testTheRenderedCssTakesTheSiteValuesPerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			'tableofcontents',
			[
				'containerBackground' => '#eeeeee',
				'containerPadding'    => [ 40, 40, 40, 40 ],
				'titleColor'          => '#aa0000',
				'contentSize'         => [ 20, 18, 16 ],
			]
		);

		$css = $this->tester->rendered_block_css( '<!-- wp:kadence/tableofcontents {"uniqueID":"toc_body"} /-->', 'tableofcontents' );

		$this->assertStringContainsString( 'background-color:#eeeeee', $css );
		$this->assertStringContainsString( 'padding-top:40px', $css );
		$this->assertStringContainsString( 'color:#aa0000', $css );
		$this->assertStringContainsString( 'font-size:20px', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 1024px\)\{[^}]*font-size:18px/', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 767px\)\{[^}]*font-size:16px/', $css );
	}

	/**
	 * A table's own value wins in the CSS too, while the devices it leaves alone take the site value.
	 *
	 * @return void
	 */
	public function testATablesOwnSizeWinsAndTheOtherDevicesTakeTheSiteSize(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values( 'tableofcontents', [ 'contentSize' => [ 20, 18, 16 ] ] );

		$css = $this->tester->rendered_block_css( '<!-- wp:kadence/tableofcontents {"uniqueID":"toc_own","contentSize":["",30,""]} /-->', 'tableofcontents' );

		$this->assertStringContainsString( 'font-size:20px', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 1024px\)\{[^}]*font-size:30px/', $css );
		$this->assertMatchesRegularExpression( '/@media all and \(max-width: 767px\)\{[^}]*font-size:16px/', $css );
	}

	/**
	 * Every attribute of the table is a site value, core's, or explained here: the attributes older tables
	 * migrate from, and the Tablet and Mobile max widths, which the front end has never printed.
	 *
	 * @return void
	 */
	public function testEveryAttributeIsEitherASiteValueOrExplained(): void {
		$this->assertSame(
			[ 'containerBorder', 'containerBorderColor', 'mobileMaxWidth', 'tabletMaxWidth', 'titleBorder', 'titleBorderColor' ],
			$this->unaccounted_attributes( Kadence_Blocks_Tableofcontents_Block::get_instance() )
		);
	}

	/**
	 * Without stored site values FSE mode builds the same CSS as classic mode.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesBothModesBuildTheSameCss(): void {
		$markup  = '<!-- wp:kadence/tableofcontents {"uniqueID":"toc_same","titleColor":"#aa0000"} /-->';
		$classic = $this->tester->rendered_block_css( $markup, 'tableofcontents' );

		$this->tester->enable_fse_mode();

		$this->assertNotSame( '', $classic );
		$this->assertSame( $classic, $this->tester->rendered_block_css( $markup, 'tableofcontents' ) );
	}

	/**
	 * Classic mode ignores the stored values.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$this->store_site_values( 'tableofcontents', [ 'titleColor' => '#aa0000' ] );

		$this->assertSame( [ 'uniqueID' => 'a' ], $this->render_attributes( 'tableofcontents', [ 'uniqueID' => 'a' ] ) );
	}

	/**
	 * FSE mode gives the table core's text color only, without serialization, and points it at the list.
	 *
	 * @return void
	 */
	public function testFseModeAddsTheTextColorSupportAndTheListSelector(): void {
		$this->tester->enable_fse_mode();

		$metadata = apply_filters( 'block_type_metadata', [ 'name' => 'kadence/tableofcontents' ] );

		$this->assertTrue( $metadata['supports']['color']['text'] );
		$this->assertFalse( $metadata['supports']['color']['background'] );
		$this->assertTrue( $metadata['supports']['color']['__experimentalSkipSerialization'] );
		$this->assertSame( '.wp-block-kadence-tableofcontents .kb-table-of-content-list', $metadata['selectors']['color'] );
		$this->assertArrayNotHasKey( 'root', $metadata['selectors'] );
	}

	/**
	 * Core prints the site text color on the list, Tablet and Mobile included.
	 *
	 * @return void
	 */
	public function testCorePrintsTheSiteTextColorOnTheListPerDevice(): void {
		$this->tester->enable_fse_mode();
		$this->reregister_block( Kadence_Blocks_Tableofcontents_Block::get_instance() );
		$this->tester->store_user_global_styles(
			[
				'styles' => [
					'blocks' => [
						'kadence/tableofcontents' => [
							'color'   => [ 'text' => '#ff0000' ],
							'@mobile' => [ 'color' => [ 'text' => '#0000ff' ] ],
						],
					],
				],
			]
		);

		$css = wp_get_global_stylesheet();

		$this->assertMatchesRegularExpression( '/:root :where\(\.wp-block-kadence-tableofcontents \.kb-table-of-content-list\)\{color: ?#ff0000;/', $css );
		$this->assertMatchesRegularExpression( '/@media[^{]*767px[^{]*\{[^}]*kb-table-of-content-list[^}]*\{color: ?#0000ff;/', $css );
	}
}
