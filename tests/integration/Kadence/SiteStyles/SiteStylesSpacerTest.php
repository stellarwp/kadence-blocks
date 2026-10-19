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
 * spacer's own values keep their whole group, and a stripe divider takes only its height and width.
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
