<?php

declare( strict_types=1 );

// cspell:ignore tabletb

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the instance CSS of Tables with site-level styles: untouched tables take the site values, and a
 * table's own font, spacing or row backgrounds keep their whole group.
 */
final class SiteStylesTableTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Without site values, a Table's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider tableProvider
	 *
	 * @param array<string, mixed> $attributes The table's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->table_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->table_css( $attributes ) );
	}

	/**
	 * An untouched table takes every site value: the cell font, header alignment, cell padding, row
	 * backgrounds, borders and max width.
	 *
	 * @return void
	 */
	public function testAnUntouchedTableTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->table_css( [] );

		$this->assertStringContainsString( '.kb-table-containertb_test{font-size:18px;font-weight:700;color:#123456;max-width:600px;', $css );
		$this->assertStringContainsString( 'th{padding-top:9px;padding-right:9px;padding-bottom:9px;padding-left:9px;text-align:left;}', $css );
		$this->assertStringContainsString( 'tr:nth-of-type(even){background-color:#fff3cd;}', $css );
		$this->assertStringContainsString( 'tr:nth-of-type(odd){background-color:#eeeeee;}', $css );
		$this->assertStringContainsString( 'border-top:2px solid #ff00ff', $css );
	}

	/**
	 * A table with its own cell font keeps its whole font and takes none of the site cell font.
	 *
	 * @return void
	 */
	public function testAnOwnCellFontKeepsItsWholeFont(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->table_css( [ 'dataTypography' => [ self::font( [ 'size' => [ '14', '', '' ] ] ) ] ] );

		$this->assertStringContainsString( 'font-size:14px', $css );
		$this->assertStringNotContainsString( 'font-weight:700', $css );
		$this->assertStringNotContainsString( '#123456', $css );
		$this->assertStringContainsString( 'padding-top:9px', $css );
	}

	/**
	 * A table with its own cell padding keeps its own unit, and a table that turns its row backgrounds on
	 * keeps its own colors with them.
	 *
	 * @return void
	 */
	public function testOwnSpacingAndRowBackgroundsKeepTheirGroups(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$padding = $this->table_css(
			[
				'cellPadding'     => [ 1, 1, 1, 1 ],
				'cellPaddingType' => 'em',
			]
		);

		$this->assertStringContainsString( 'padding-top:1em', $padding );
		$this->assertStringNotContainsString( '9px', $padding );

		$rows = $this->table_css( [ 'backgroundColorEven' => '#000000' ] );

		$this->assertStringNotContainsString( '#fff3cd', $rows );
		$this->assertStringNotContainsString( '#eeeeee', $rows );
	}

	/**
	 * Stored structure, header, caption and per-column settings are never applied: they belong to each table.
	 *
	 * @return void
	 */
	public function testStoredStructureSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->table_css( [] );

		$this->store_site_values(
			[
				'columns'             => 4,
				'isFirstRowHeader'    => false,
				'isFirstColumnHeader' => true,
				'columnBackgrounds'   => [ '#ff0000' ],
				'enableCaption'       => true,
				'caption'             => 'Site caption',
				'maxHeight'           => [ 200, '', '' ],
			]
		);

		$this->assertSame( $expected, $this->table_css( [] ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->table_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->table_css( [] ) );
	}

	/**
	 * The site rules print nothing for Table, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->table_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/table' ) );
	}

	/**
	 * @return Generator
	 */
	public function tableProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own cell font' => [ 'attributes' => [ 'dataTypography' => [ self::font( [ 'size' => [ '14', '', '' ] ] ) ] ] ];
		yield 'own row backgrounds' => [
			'attributes' => [
				'evenOddBackground'   => true,
				'backgroundColorEven' => '#000000',
			],
		];
	}

	/**
	 * A cell font in the shape the typography control stores, starting from the block's defaults.
	 *
	 * @param array<string, mixed> $values The font values to set.
	 *
	 * @return array<string, mixed> The font.
	 */
	private static function font( array $values ): array {
		return array_merge(
			[
				'size'          => [ '', '', '' ],
				'sizeType'      => 'px',
				'lineHeight'    => [ '', '', '' ],
				'lineType'      => 'px',
				'letterSpacing' => '',
				'family'        => '',
				'google'        => false,
				'style'         => '',
				'weight'        => '',
				'variant'       => '',
				'subset'        => '',
				'loadGoogle'    => true,
				'textTransform' => '',
				'color'         => '',
			],
			$values
		);
	}

	/**
	 * Stores site values for the cell font, header alignment, cell padding, row backgrounds, borders and max
	 * width, plus any extra values.
	 *
	 * @param array<string, mixed> $extra Additional site values.
	 *
	 * @return void
	 */
	private function store_site_values( array $extra = [] ): void {
		$side = [ '#ff00ff', 'solid', 2 ];

		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'table' => array_merge(
								[
									'dataTypography'      => [
										self::font(
											[
												'size'   => [ '18', '', '' ],
												'weight' => '700',
												'color'  => '#123456',
											]
										),
									],
									'headerAlign'         => 'left',
									'cellPadding'         => [ 9, 9, 9, 9 ],
									'cellPaddingType'     => 'px',
									'evenOddBackground'   => true,
									'backgroundColorEven' => '#fff3cd',
									'backgroundColorOdd'  => '#eeeeee',
									'borderStyle'         => [
										[
											'top'    => $side,
											'right'  => $side,
											'bottom' => $side,
											'left'   => $side,
											'unit'   => 'px',
										],
									],
									'maxWidth'            => [ 600, '', '' ],
									'maxWidthUnit'        => 'px',
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
	 * Renders a two-column table with one row and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes The table's own attributes.
	 *
	 * @return string The CSS.
	 */
	private function table_css( array $attributes ): string {
		$attributes = array_merge(
			[
				'uniqueID' => 'tb_test',
				'columns'  => 2,
			],
			$attributes
		);
		$markup     = sprintf(
			'<!-- wp:kadence/table %s --><!-- wp:kadence/table-row {"uniqueID":"tr_1"} --><!-- wp:kadence/table-data {"uniqueID":"td_1"} --><!-- wp:paragraph --><p>A</p><!-- /wp:paragraph --><!-- /wp:kadence/table-data --><!-- /wp:kadence/table-row --><!-- /wp:kadence/table -->',
			wp_json_encode( $attributes )
		);

		return $this->tester->rendered_block_css( $markup, 'table' );
	}
}
