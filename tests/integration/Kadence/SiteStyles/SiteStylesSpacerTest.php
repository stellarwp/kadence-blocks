<?php

declare( strict_types=1 );

// cspell:ignore aligncenter halign

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the instance CSS of Spacers with site-level styles: untouched spacers take the site values, a
 * spacer's own values keep their whole group, and a stripe divider takes only its height and width and keeps
 * its own band heights.
 */
final class SiteStylesSpacerTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Without site values, a spacer's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider spacerProvider
	 *
	 * @param array<string, mixed> $attributes The spacer's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->spacer_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->spacer_css( $attributes ) );
	}

	/**
	 * An untouched spacer takes every site value, its tablet height included.
	 *
	 * @return void
	 */
	public function testAnUntouchedSpacerTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->spacer_css( [] );

		$this->assertStringContainsString( 'height:40rem', $css );
		$this->assertStringContainsString( 'height:20rem!important', $css );
		$this->assertStringContainsString( 'border-top-width:8px', $css );
		$this->assertStringContainsString( 'border-top-color:#ff0000', $css );
		$this->assertStringContainsString( 'width:50%', $css );
	}

	/**
	 * A spacer with its own height keeps its own unit and takes no site tablet height, while the groups it
	 * doesn't set still take the site values.
	 *
	 * @return void
	 */
	public function testAnOwnHeightKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->spacer_css( [ 'spacerHeight' => 120 ] );

		$this->assertStringContainsString( 'height:120px', $css );
		$this->assertStringNotContainsString( 'rem', $css );
		$this->assertStringNotContainsString( '!important', $css );
		$this->assertStringContainsString( 'border-top-color:#ff0000', $css );
	}

	/**
	 * A stripe divider takes the site spacer height and divider width, but not the divider height it uses as
	 * its band height.
	 *
	 * @return void
	 */
	public function testAStripeTakesOnlyTheHeightAndWidth(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->spacer_css( [ 'dividerStyle' => 'stripe' ] );

		$this->assertStringContainsString( 'height:40rem', $css );
		$this->assertStringContainsString( 'width:50%', $css );
		$this->assertStringNotContainsString( 'height:8px', $css );
	}

	/**
	 * In FSE mode a stripe's tablet and mobile band heights are its own divider heights, as the editor shows
	 * them, not the site's tablet and mobile spacer heights.
	 *
	 * @return void
	 */
	public function testAStripeBandTakesItsOwnTabletAndMobileHeights(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->spacer_css(
			[
				'dividerStyle'        => 'stripe',
				'tabletDividerHeight' => 25,
				'mobileDividerHeight' => 15,
			]
		);

		$this->assertSame( '25px !important', $this->stripe_band_height( $css, '(max-width: 1024px)' ) );
		$this->assertSame( '15px !important', $this->stripe_band_height( $css, '(max-width: 767px)' ) );
	}

	/**
	 * In classic mode a stripe's tablet and mobile band heights still print from its spacer heights.
	 *
	 * @return void
	 */
	public function testClassicModeKeepsAStripeBandOnItsSpacerHeights(): void {
		$css = $this->spacer_css(
			[
				'dividerStyle'        => 'stripe',
				'tabletSpacerHeight'  => 30,
				'mobileSpacerHeight'  => 35,
				'tabletDividerHeight' => 25,
				'mobileDividerHeight' => 15,
			]
		);

		$this->assertSame( '30px !important', $this->stripe_band_height( $css, '(max-width: 1024px)' ) );
		$this->assertSame( '35px !important', $this->stripe_band_height( $css, '(max-width: 767px)' ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->spacer_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->spacer_css( [] ) );
	}

	/**
	 * The site rules print nothing for Spacer, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->spacer_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/spacer' ) );
	}

	/**
	 * @return Generator
	 */
	public function spacerProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own height' => [ 'attributes' => [ 'spacerHeight' => 120 ] ];
		yield 'stripe' => [ 'attributes' => [ 'dividerStyle' => 'stripe' ] ];
	}

	/**
	 * Stores site values for every Spacer group, and a divider width outside the height groups.
	 *
	 * @return void
	 */
	private function store_site_values(): void {
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'spacer' => [
								'spacerHeight'       => 40,
								'tabletSpacerHeight' => 20,
								'mobileSpacerHeight' => 10,
								'spacerHeightUnits'  => 'rem',
								'dividerHeight'      => 8,
								'dividerColor'       => '#ff0000',
								'dividerWidth'       => 50,
							],
						],
					],
				],
			]
		);
	}

	/**
	 * The height a stripe's band gets inside one media query.
	 *
	 * @param string $css   The CSS.
	 * @param string $query The media query, e.g. `(max-width: 1024px)`.
	 *
	 * @return string|null The height, null when the media query sets none.
	 */
	private function stripe_band_height( string $css, string $query ): ?string {
		preg_match_all( '/@media all and ' . preg_quote( $query, '/' ) . '\{((?:[^{}]+\{[^}]*\})*)\}/', $css, $blocks );

		foreach ( $blocks[1] as $block ) {
			if ( preg_match( '/\.kt-divider-stripe\{[^}]*height:([^;}]+)/', $block, $match ) ) {
				return $match[1];
			}
		}

		return null;
	}

	/**
	 * Renders a spacer and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes The spacer's own attributes.
	 *
	 * @return string The CSS.
	 */
	private function spacer_css( array $attributes ): string {
		$attributes = array_merge( [ 'uniqueID' => 'sp_test' ], $attributes );
		$markup     = sprintf(
			'<!-- wp:kadence/spacer %s --><div class="wp-block-kadence-spacer aligncenter kt-block-spacer-sp_test"><div class="kt-block-spacer kt-block-spacer-halign-center"><hr class="kt-divider"/></div></div><!-- /wp:kadence/spacer -->',
			wp_json_encode( $attributes )
		);

		return $this->tester->rendered_block_css( $markup, 'spacer' );
	}
}
