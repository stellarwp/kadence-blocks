<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the instance CSS of Count Up blocks with site-level styles: untouched blocks take the site values,
 * and a block's own font, alignment or spacing keeps its whole group.
 */
final class SiteStylesCountUpTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Without site values, a Count Up's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider countUpProvider
	 *
	 * @param array<string, mixed> $attributes The block's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->count_up_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->count_up_css( $attributes ) );
	}

	/**
	 * An untouched block takes every site value: the title and number fonts, colors, alignment, min height,
	 * padding and margin.
	 *
	 * @return void
	 */
	public function testAnUntouchedBlockTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->count_up_css( [] );

		$this->assertStringContainsString( 'color:#123456', $css );
		$this->assertStringContainsString( 'font-size:24px', $css );
		$this->assertStringContainsString( 'font-weight:700', $css );
		$this->assertStringContainsString( 'color:#cc0000', $css );
		$this->assertStringContainsString( 'font-size:4rem', $css );
		$this->assertStringContainsString( 'text-align:center', $css );
		$this->assertStringContainsString( 'padding-top:12px', $css );
		$this->assertStringContainsString( 'margin-bottom:2em', $css );
		$this->assertStringContainsString( 'min-height:90px', $css );
	}

	/**
	 * A block with its own number font keeps its own size and unit and takes none of the site number font,
	 * while the title still takes the site font.
	 *
	 * @return void
	 */
	public function testAnOwnNumberFontKeepsItsWholeFont(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->count_up_css( [ 'numberFont' => [ self::font( [ 'size' => [ '80', '', '' ] ] ) ] ] );

		$this->assertStringContainsString( 'font-size:80px', $css );
		$this->assertStringNotContainsString( '4rem', $css );
		$this->assertStringContainsString( 'font-size:24px', $css );
	}

	/**
	 * A block with its own title padding keeps its unit and takes no site title padding, while the number
	 * still takes the site margin.
	 *
	 * @return void
	 */
	public function testAnOwnPaddingKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->count_up_css( [ 'titlePadding' => [ 4, 4, 4, 4 ] ] );

		$this->assertStringContainsString( 'padding-top:4px', $css );
		$this->assertStringNotContainsString( 'padding-top:12px', $css );
		$this->assertStringContainsString( 'margin-bottom:2em', $css );
	}

	/**
	 * Stored content and behavior settings are never applied: the numbers, timing and title toggle belong to
	 * each block, so they stay out of an untouched block's attributes and a block's own values stay as they are.
	 *
	 * @return void
	 */
	public function testStoredContentSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->count_up_css( [] );
		$content  = [
			'start'        => 5,
			'end'          => 50,
			'duration'     => 9,
			'displayTitle' => false,
			'prefix'       => '$',
		];

		$this->store_site_values( $content );

		$this->assertSame( $expected, $this->count_up_css( [] ) );

		$untouched = apply_filters( 'kadence_blocks_countup_render_block_attributes', [ 'uniqueID' => 'cu_test' ] );
		foreach ( array_keys( $content ) as $attribute ) {
			$this->assertArrayNotHasKey( $attribute, $untouched );
		}

		$own = [
			'uniqueID'     => 'cu_test',
			'start'        => 1,
			'end'          => 10,
			'duration'     => 2,
			'displayTitle' => true,
			'prefix'       => '#',
		];
		$this->assertSame( $own, array_intersect_key( apply_filters( 'kadence_blocks_countup_render_block_attributes', $own ), $own ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->count_up_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->count_up_css( [] ) );
	}

	/**
	 * The CSS built in the page head reads raw attributes, and an untouched block takes the site values there.
	 *
	 * @return void
	 */
	public function testTheHeadPassTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$attributes = apply_filters( 'kadence_blocks_countup_render_block_attributes', [ 'uniqueID' => 'cu_test' ] );

		$this->assertSame( '#cc0000', $attributes['numberColor'] );
		$this->assertSame( 'rem', $attributes['numberFont'][0]['sizeType'] );
	}

	/**
	 * The site rules print nothing for Count Up, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->count_up_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/countup' ) );
	}

	/**
	 * @return Generator
	 */
	public function countUpProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own number font' => [ 'attributes' => [ 'numberFont' => [ self::font( [ 'size' => [ '80', '', '' ] ] ) ] ] ];
		yield 'own title color' => [ 'attributes' => [ 'titleColor' => '#00ff00' ] ];
	}

	/**
	 * A font in the shape the typography control stores, starting from the number font's defaults.
	 *
	 * @param array<string, mixed> $values The font values to set.
	 *
	 * @return array<string, mixed> The font.
	 */
	private static function font( array $values ): array {
		return array_merge(
			[
				'size'          => [ '50', '', '' ],
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
	 * Stores site values for the title and number fonts, colors, alignment, min height, padding and margin,
	 * plus any extra values.
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
							'countup' => array_merge(
								[
									'titleFont'        => [
										self::font(
											[
												'level'   => 4,
												'htmlTag' => 'div',
												'size'    => [ '24', '', '' ],
												'weight'  => '700',
											]
										),
									],
									'titleColor'       => '#123456',
									'titleAlign'       => [ 'center', '', '' ],
									'titlePadding'     => [ 12, 12, 12, 12 ],
									'titlePaddingType' => 'px',
									'numberFont'       => [
										self::font(
											[
												'size'     => [ '4', '', '' ],
												'sizeType' => 'rem',
											]
										),
									],
									'numberColor'      => '#cc0000',
									'numberMargin'     => [ '', '', 2, '' ],
									'numberMarginType' => 'em',
									'numberMinHeight'  => [ 90, '', '' ],
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
	 * Renders a Count Up block and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes The block's own attributes.
	 *
	 * @return string The CSS.
	 */
	private function count_up_css( array $attributes ): string {
		$attributes = array_merge(
			[
				'uniqueID' => 'cu_test',
				'title'    => 'Customers',
			],
			$attributes
		);
		$markup     = sprintf(
			'<!-- wp:kadence/countup %s --><div class="wp-block-kadence-countup kb-count-up-%s kb-count-up" data-start="0" data-end="100" data-duration="2.5"><div class="kb-count-up-process kb-count-up-number">100</div><div class="kb-count-up-title">Customers</div></div><!-- /wp:kadence/countup -->',
			wp_json_encode( $attributes ),
			$attributes['uniqueID']
		);

		return $this->tester->rendered_block_css( $markup, 'countup' );
	}
}
