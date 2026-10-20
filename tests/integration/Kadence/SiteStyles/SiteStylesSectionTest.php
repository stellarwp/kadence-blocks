<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the instance CSS of Sections with site-level styles: untouched Sections take the site values, and a
 * Section's own values keep their whole group.
 */
final class SiteStylesSectionTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Without site values, a Section's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param array<string, mixed> $attributes The Section's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->section_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->section_css( $attributes ) );
	}

	/**
	 * An untouched Section takes every site value: padding on each device, the min height, the background,
	 * the radius and the text and link colors.
	 *
	 * @return void
	 */
	public function testAnUntouchedSectionTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->section_css( [] );

		$this->assertStringContainsString( 'padding-top:2vw', $css );
		$this->assertStringContainsString( 'padding-top:1vw', $css );
		$this->assertStringContainsString( 'min-height:50vh', $css );
		$this->assertStringContainsString( 'background-color:#ff0000', $css );
		$this->assertStringContainsString( 'border-top-left-radius:6px', $css );
		$this->assertStringContainsString( 'color:#123456', $css );
		$this->assertStringContainsString( 'color:#00aa00', $css );
	}

	/**
	 * A Section with its own padding keeps its own unit and takes no site tablet padding, while the groups it
	 * doesn't set still take the site values.
	 *
	 * @return void
	 */
	public function testAnOwnPaddingKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->section_css( [ 'padding' => [ 20, 20, 20, 20 ] ] );

		$this->assertStringContainsString( 'padding-top:20px', $css );
		$this->assertStringNotContainsString( 'vw', $css );
		$this->assertStringContainsString( 'background-color:#ff0000', $css );
		$this->assertStringContainsString( 'min-height:50vh', $css );
	}

	/**
	 * A Section with its own background keeps its own opacity too.
	 *
	 * @return void
	 */
	public function testAnOwnBackgroundKeepsItsOpacity(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values( [ 'backgroundOpacity' => 0.5 ] );

		$css = $this->section_css( [ 'background' => '#0000ff' ] );

		$this->assertStringContainsString( 'background-color:#0000ff', $css );
		$this->assertStringNotContainsString( 'rgba(255, 0, 0', $css );
		$this->assertStringNotContainsString( '0.5', $css );
	}

	/**
	 * A Section saved before the padding arrays keeps its own padding numbers and unit: its older side numbers
	 * set the padding group, so it takes no site padding or padding unit.
	 *
	 * @return void
	 */
	public function testOlderPaddingNumbersKeepTheirOwnUnit(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->section_css( [ 'topPadding' => 10 ] );

		$this->assertStringContainsString( 'padding-top:10px', $css );
		$this->assertStringNotContainsString( 'vw', $css );
		$this->assertStringContainsString( 'background-color:#ff0000', $css );
	}

	/**
	 * A Section saved by the current editor takes the site border, while one saved before the border arrays
	 * keeps its own border and takes none.
	 *
	 * @return void
	 */
	public function testOnlySectionsWithoutOlderBordersTakeTheSiteBorder(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values( [ 'borderStyle' => [ self::site_border() ] ] );

		$this->assertStringContainsString( 'border-top:3px dashed #ff00ff', $this->section_css( [] ) );

		$older = $this->section_css(
			[
				'border'      => '#00ffff',
				'borderWidth' => [ 1, 1, 1, 1 ],
			]
		);

		$this->assertStringNotContainsString( '#ff00ff', $older );
		$this->assertStringContainsString( 'border-top-width:1px', $older );
	}

	/**
	 * A Section the current editor never saved renders its default old border widths, so it takes neither the
	 * site border nor the site hover border, while one the editor saved takes both.
	 *
	 * @return void
	 */
	public function testANeverSavedSectionTakesNoSiteHoverBorder(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			[
				'borderStyle'      => [ self::site_border() ],
				'borderHoverStyle' => [ self::site_border( '#00ff00' ) ],
			]
		);

		$never_saved = $this->section_css( [], false );

		$this->assertStringNotContainsString( '#ff00ff', $never_saved );
		$this->assertStringNotContainsString( '#00ff00', $never_saved );

		$saved = $this->section_css( [] );

		$this->assertStringContainsString( 'border-top:3px dashed #ff00ff', $saved );
		$this->assertStringContainsString( 'border-top:3px dashed #00ff00', $saved );
	}

	/**
	 * The CSS built in the page head reads raw attributes without the default old border widths, and still
	 * takes no site border for a Section the editor never saved, as the render pass does, while it takes the
	 * other site values.
	 *
	 * @return void
	 */
	public function testTheHeadPassTakesNoSiteBorderForANeverSavedSection(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values( [ 'borderStyle' => [ self::site_border() ] ] );

		$attributes = apply_filters( 'kadence_blocks_column_render_block_attributes', [ 'uniqueID' => 'col_test' ] );

		$this->assertArrayNotHasKey( 'borderStyle', $attributes );
		$this->assertSame( [ 2, 2, 2, 2 ], $attributes['padding'] );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->section_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->section_css( [] ) );
	}

	/**
	 * The site rules print nothing for Section, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->section_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/column' ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own padding' => [ 'attributes' => [ 'padding' => [ 20, 20, 20, 20 ] ] ];
		yield 'own background' => [ 'attributes' => [ 'background' => '#0000ff' ] ];
		yield 'older padding numbers' => [ 'attributes' => [ 'topPadding' => 10 ] ];
		yield 'older border' => [
			'attributes' => [
				'border'      => '#00ffff',
				'borderWidth' => [ 1, 1, 1, 1 ],
			],
		];
	}

	/**
	 * A site border of 3px dashed on every side, in the shape the border control stores.
	 *
	 * @param string $color The border color.
	 *
	 * @return array<string, mixed> The border.
	 */
	private static function site_border( string $color = '#ff00ff' ): array {
		$side = [ $color, 'dashed', 3 ];

		return [
			'top'    => $side,
			'right'  => $side,
			'bottom' => $side,
			'left'   => $side,
			'unit'   => 'px',
		];
	}

	/**
	 * Stores site values for the main Section groups, plus any extra values.
	 *
	 * @param array<string, mixed> $extra Additional site values.
	 *
	 * @return void
	 */
	private function store_site_values( array $extra = [] ): void {
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'column' => array_merge(
								[
									'padding'          => [ 2, 2, 2, 2 ],
									'tabletPadding'    => [ 1, 1, 1, 1 ],
									'paddingType'      => 'vw',
									'height'           => [ 50, '', '' ],
									'heightUnit'       => 'vh',
									'background'       => '#ff0000',
									'borderRadius'     => [ 6, 6, 6, 6 ],
									'borderRadiusUnit' => 'px',
									'textColor'        => '#123456',
									'linkColor'        => '#00aa00',
								],
								$extra
							),
						],
					],
				],
			]
		);
	}

	/**
	 * Renders a Section and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes      The Section's own attributes.
	 * @param bool                 $saved_by_editor Whether the current editor saved it, which stores blank border
	 *                                              widths in place of the default zeros.
	 *
	 * @return string The CSS.
	 */
	private function section_css( array $attributes, bool $saved_by_editor = true ): string {
		$attributes = array_merge(
			$saved_by_editor ? [ 'borderWidth' => [ '', '', '', '' ] ] : [],
			[
				'uniqueID'  => 'col_test',
				'kbVersion' => 2,
			],
			$attributes
		);
		$markup     = sprintf(
			'<!-- wp:kadence/column %s --><div class="wp-block-kadence-column kadence-column%s"><div class="kt-inside-inner-col"></div></div><!-- /wp:kadence/column -->',
			wp_json_encode( $attributes ),
			$attributes['uniqueID']
		);

		return $this->tester->rendered_block_css( $markup, 'column' );
	}
}
