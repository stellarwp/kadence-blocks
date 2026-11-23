<?php

declare( strict_types=1 );

// cspell:ignore boxib textcontent

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the instance CSS of Info Boxes with site-level styles: untouched boxes take the site values, a
 * box's own values keep their whole group, and boxes saved with the older border attributes keep them.
 */
final class SiteStylesInfoBoxTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Without site values, an Info Box's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider infoBoxProvider
	 *
	 * @param array<string, mixed> $attributes The box's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->info_box_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->info_box_css( $attributes ) );
	}

	/**
	 * An untouched box takes every site value: the background, border, radius and padding, the title color,
	 * font and min height, and the text color.
	 *
	 * @return void
	 */
	public function testAnUntouchedBoxTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->info_box_css( [] );

		$this->assertStringContainsString( 'border-top:3px solid #ff00ff', $css );
		$this->assertStringContainsString( 'border-top-left-radius:8px', $css );
		$this->assertStringContainsString( 'background:#fff3cd', $css );
		$this->assertStringContainsString( 'padding-top:2rem', $css );
		$this->assertStringContainsString( 'h2.kt-blocks-info-box-title{color:#123456;font-size:30px;font-weight:700;}', $css );
		$this->assertStringContainsString( 'h2.kt-blocks-info-box-title{min-height:60px;}', $css );
		$this->assertStringContainsString( '.kt-blocks-info-box-text{color:#654321;}', $css );
	}

	/**
	 * A box with its own padding keeps its own unit, while the groups it doesn't set still take the site
	 * values.
	 *
	 * @return void
	 */
	public function testAnOwnPaddingKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->info_box_css( [ 'containerPadding' => [ 20, 20, 20, 20 ] ] );

		$this->assertStringContainsString( 'padding-top:20px', $css );
		$this->assertStringNotContainsString( '2rem', $css );
		$this->assertStringContainsString( 'background:#fff3cd', $css );
	}

	/**
	 * A box with its own title font keeps its whole font and takes none of the site title font, while it
	 * still takes the site title color.
	 *
	 * @return void
	 */
	public function testAnOwnTitleFontKeepsItsWholeFont(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->info_box_css( [ 'titleFont' => [ self::title_font( [ 'size' => [ '18', '', '' ] ] ) ] ] );

		$this->assertStringContainsString( 'h2.kt-blocks-info-box-title{color:#123456;font-size:18px;}', $css );
		$this->assertStringNotContainsString( 'font-weight:700', $css );
	}

	/**
	 * A box saved with the older border color, width or radius, or with an older background opacity, renders
	 * those instead of the arrays, so its group takes none of the site values: its CSS stays as it was.
	 *
	 * @dataProvider olderAttributeProvider
	 *
	 * @param array<string, mixed> $attributes The box's older attributes.
	 * @param array<string, mixed> $site       Site values for the groups they stand in for.
	 *
	 * @return void
	 */
	public function testOlderAttributesKeepTheirGroup( array $attributes, array $site ): void {
		$expected = $this->info_box_css( $attributes );
		$this->tester->enable_fse_mode();
		$this->store_site_values( $site, false );

		$this->assertSame( $expected, $this->info_box_css( $attributes ) );
	}

	/**
	 * Each older attribute keeps the groups it stands in for whole in the page head, where attributes are raw.
	 *
	 * @dataProvider olderAttributeNameProvider
	 *
	 * @param string   $name   The older attribute.
	 * @param mixed    $value  A value it holds.
	 * @param string[] $absent The site values that must not come back.
	 *
	 * @return void
	 */
	public function testTheHeadPassKeepsEachOlderAttributesGroupsWhole( string $name, $value, array $absent ): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$attributes = apply_filters(
			'kadence_blocks_infobox_render_block_attributes',
			[
				'uniqueID'  => 'ib_test',
				'kbVersion' => 2,
				$name       => $value,
			]
		);

		foreach ( $absent as $site ) {
			$this->assertArrayNotHasKey( $site, $attributes );
		}
		$this->assertSame( '#123456', $attributes['titleColor'] );
	}

	/**
	 * Stored content, markup and layout settings are never applied: they belong to each box.
	 *
	 * @return void
	 */
	public function testStoredContentSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->info_box_css( [] );

		$this->store_site_values(
			[
				'hAlign'       => 'left',
				'mediaAlign'   => 'left',
				'fullHeight'   => true,
				'kbVersion'    => 1,
				'titleTagType' => 'p',
				'mediaIcon'    => [ [ 'size' => 99 ] ],
			]
		);

		$this->assertSame( $expected, $this->info_box_css( [] ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->info_box_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->info_box_css( [] ) );
	}

	/**
	 * The site rules print nothing for Info Box, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->info_box_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/infobox' ) );
	}

	/**
	 * @return Generator
	 */
	public function infoBoxProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own padding' => [ 'attributes' => [ 'containerPadding' => [ 20, 20, 20, 20 ] ] ];
		yield 'own title font' => [ 'attributes' => [ 'titleFont' => [ self::title_font( [ 'size' => [ '18', '', '' ] ] ) ] ] ];
		yield 'older border' => [
			'attributes' => [
				'containerBorder'      => '#00ffff',
				'containerBorderWidth' => [ 1, 1, 1, 1 ],
			],
		];
	}

	/**
	 * @return Generator
	 */
	public function olderAttributeProvider(): Generator {
		$border     = [
			'borderStyle'  => [ self::site_border() ],
			'borderRadius' => [ 8, 8, 8, 8 ],
		];
		$background = [ 'containerBackground' => '#fff3cd' ];

		yield 'border color' => [
			'attributes' => [ 'containerBorder' => '#00ffff' ],
			'site'       => $border,
		];
		yield 'border width' => [
			'attributes' => [ 'containerBorderWidth' => [ 2, 2, 2, 2 ] ],
			'site'       => $border,
		];
		yield 'border radius' => [
			'attributes' => [ 'containerBorderRadius' => 12 ],
			'site'       => $border,
		];
		yield 'background opacity' => [
			'attributes' => [ 'containerBackgroundOpacity' => 0.5 ],
			'site'       => $background,
		];
	}

	/**
	 * @return Generator
	 */
	public function olderAttributeNameProvider(): Generator {
		yield 'border color' => [
			'name'   => 'containerBorder',
			'value'  => '#00ffff',
			'absent' => [ 'borderStyle', 'borderRadius' ],
		];
		yield 'border width' => [
			'name'   => 'containerBorderWidth',
			'value'  => [ 2, '', '', '' ],
			'absent' => [ 'borderStyle', 'borderRadius', 'borderHoverStyle' ],
		];
		yield 'border radius' => [
			'name'   => 'containerBorderRadius',
			'value'  => 12,
			'absent' => [ 'borderStyle', 'borderRadius', 'borderHoverRadius' ],
		];
		yield 'hover border color' => [
			'name'   => 'containerHoverBorder',
			'value'  => '#00ffff',
			'absent' => [ 'borderHoverStyle', 'borderHoverRadius' ],
		];
		yield 'background opacity' => [
			'name'   => 'containerBackgroundOpacity',
			'value'  => 0.5,
			'absent' => [ 'containerBackground' ],
		];
		yield 'hover background opacity' => [
			'name'   => 'containerHoverBackgroundOpacity',
			'value'  => 0.5,
			'absent' => [ 'containerHoverBackground' ],
		];
	}

	/**
	 * A site border of 3px solid magenta on every side, in the shape the border control stores.
	 *
	 * @return array<string, mixed> The border.
	 */
	private static function site_border(): array {
		$side = [ '#ff00ff', 'solid', 3 ];

		return [
			'top'    => $side,
			'right'  => $side,
			'bottom' => $side,
			'left'   => $side,
			'unit'   => 'px',
		];
	}

	/**
	 * A title font in the shape the typography control stores, starting from the block's defaults.
	 *
	 * @param array<string, mixed> $values The font values to set.
	 *
	 * @return array<string, mixed> The font.
	 */
	private static function title_font( array $values ): array {
		return array_merge(
			[
				'level'         => 2,
				'size'          => [ '', '', '' ],
				'sizeType'      => 'px',
				'lineHeight'    => [ '', '', '' ],
				'lineType'      => 'px',
				'letterSpacing' => '',
				'textTransform' => '',
				'family'        => '',
				'google'        => false,
				'style'         => '',
				'weight'        => '',
				'variant'       => '',
				'subset'        => '',
				'loadGoogle'    => true,
			],
			$values
		);
	}

	/**
	 * Stores site values for the container, the title and the text, or only the given values.
	 *
	 * @param array<string, mixed> $values      Site values to add, or to store on their own.
	 * @param bool                 $with_others Whether to store the values for every group as well.
	 *
	 * @return void
	 */
	private function store_site_values( array $values = [], bool $with_others = true ): void {
		$others = [
			'containerBackground'  => '#fff3cd',
			'borderStyle'          => [ self::site_border() ],
			'borderRadius'         => [ 8, 8, 8, 8 ],
			'containerPadding'     => [ 2, 2, 2, 2 ],
			'containerPaddingType' => 'rem',
			'titleColor'           => '#123456',
			'titleFont'            => [
				self::title_font(
					[
						'size'   => [ '30', '', '' ],
						'weight' => '700',
					]
				),
			],
			'titleMinHeight'       => [ 60, '', '' ],
			'textColor'            => '#654321',
		];

		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'infobox' => $with_others ? array_merge( $others, $values ) : $values,
						],
					],
				],
			]
		);
	}

	/**
	 * Renders an Info Box and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes The box's own attributes.
	 *
	 * @return string The CSS.
	 */
	private function info_box_css( array $attributes ): string {
		$attributes = array_merge(
			[
				'uniqueID'  => 'ib_test',
				'kbVersion' => 2,
			],
			$attributes
		);
		$markup     = sprintf(
			'<!-- wp:kadence/infobox %s --><div class="wp-block-kadence-infobox kt-info-box%s"><div class="kt-blocks-info-box-link-wrap"><div class="kt-infobox-textcontent"><h2 class="kt-blocks-info-box-title">Title</h2><p class="kt-blocks-info-box-text">Text</p></div></div></div><!-- /wp:kadence/infobox -->',
			wp_json_encode( $attributes ),
			$attributes['uniqueID']
		);

		return $this->tester->rendered_block_css( $markup, 'infobox' );
	}
}
