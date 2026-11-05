<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the instance CSS of Countdowns with site-level styles: untouched countdowns take the site values,
 * and a countdown's own spacing, border or font keeps its whole group.
 */
final class SiteStylesCountdownTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Without site values, a Countdown's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider countdownProvider
	 *
	 * @param array<string, mixed> $attributes The countdown's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->countdown_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->countdown_css( $attributes ) );
	}

	/**
	 * An untouched countdown takes every site value: the container background, border, radius and padding,
	 * the item background and padding, and the number and label colors.
	 *
	 * @return void
	 */
	public function testAnUntouchedCountdownTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->countdown_css( [] );

		$this->assertStringContainsString( '.kb-countdown-container-cd_test{background:#fff3cd;border-color:#ff00ff;border-top-left-radius:8px;', $css );
		$this->assertStringContainsString( 'border-top-width:3px', $css );
		$this->assertStringContainsString( 'padding-top:2rem', $css );
		$this->assertStringContainsString( 'background:#123456', $css );
		$this->assertStringContainsString( 'padding-top:5px', $css );
		$this->assertStringContainsString( '.kb-countdown-number{color:#cc0000;}', $css );
		$this->assertStringContainsString( '.kb-countdown-label{color:#00aa00;}', $css );
	}

	/**
	 * A countdown with its own container padding keeps its own unit, while the groups it doesn't set still take
	 * the site values.
	 *
	 * @return void
	 */
	public function testAnOwnPaddingKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->countdown_css( [ 'containerPadding' => [ 20, 20, 20, 20 ] ] );

		$this->assertStringContainsString( 'padding-top:20px', $css );
		$this->assertStringNotContainsString( '2rem', $css );
		$this->assertStringContainsString( 'background:#fff3cd', $css );
	}

	/**
	 * A countdown with its own border width keeps its own border and takes none of the site border color.
	 *
	 * @return void
	 */
	public function testAnOwnBorderKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->countdown_css( [ 'borderWidth' => [ 1, 1, 1, 1 ] ] );

		$this->assertStringContainsString( 'border-top-width:1px', $css );
		$this->assertStringNotContainsString( '#ff00ff', $css );
	}

	/**
	 * Stored timing, content and layout settings are never applied: they belong to each countdown.
	 *
	 * @return void
	 */
	public function testStoredBehaviorSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->countdown_css( [] );

		$this->store_site_values(
			[
				'timerLayout'      => 'inline',
				'countdownDivider' => true,
				'enableTimer'      => false,
				'preLabel'         => 'Sale ends',
				'preLabelColor'    => '#ff0000',
				'counterAlign'     => [ 'left', '', '' ],
				'vsdesk'           => true,
			]
		);

		$this->assertSame( $expected, $this->countdown_css( [] ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->countdown_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->countdown_css( [] ) );
	}

	/**
	 * The CSS built in the page head reads raw attributes, and an untouched countdown takes the site values
	 * there.
	 *
	 * @return void
	 */
	public function testTheHeadPassTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$attributes = apply_filters( 'kadence_blocks_countdown_render_block_attributes', [ 'uniqueID' => 'cd_test' ] );

		$this->assertSame( '#fff3cd', $attributes['background'] );
		$this->assertSame( 'rem', $attributes['paddingType'] );
	}

	/**
	 * The site rules print nothing for Countdown, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->countdown_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/countdown' ) );
	}

	/**
	 * @return Generator
	 */
	public function countdownProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own padding' => [ 'attributes' => [ 'containerPadding' => [ 20, 20, 20, 20 ] ] ];
		yield 'own border' => [ 'attributes' => [ 'borderWidth' => [ 1, 1, 1, 1 ] ] ];
	}

	/**
	 * Stores site values for the container, the count items and the number and label colors, plus any extra
	 * values.
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
							'countdown' => array_merge(
								[
									'background'       => '#fff3cd',
									'border'           => '#ff00ff',
									'borderWidth'      => [ 3, 3, 3, 3 ],
									'borderRadius'     => [ 8, 8, 8, 8 ],
									'containerPadding' => [ 2, 2, 2, 2 ],
									'paddingType'      => 'rem',
									'itemBackground'   => '#123456',
									'itemPadding'      => [ 5, 5, 5, 5 ],
									'numberColor'      => '#cc0000',
									'labelColor'       => '#00aa00',
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
	 * Renders a Countdown and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes The countdown's own attributes.
	 *
	 * @return string The CSS.
	 */
	private function countdown_css( array $attributes ): string {
		$attributes = array_merge(
			[
				'uniqueID'  => 'cd_test',
				'timestamp' => 1893456000000,
				'date'      => '2030-01-01T00:00:00',
			],
			$attributes
		);
		$markup     = sprintf(
			'<!-- wp:kadence/countdown %s --><div class="wp-block-kadence-countdown kb-countdown-container kb-countdown-container-cd_test" data-id="cd_test"><!-- wp:kadence/countdown-timer {"uniqueID":"cd_test_t"} --><div class="wp-block-kadence-countdown-timer kb-countdown-timer-cd_test_t kb-countdown-timer" id="kb-timer-cd_test"></div><!-- /wp:kadence/countdown-timer --></div><!-- /wp:kadence/countdown -->',
			wp_json_encode( $attributes )
		);

		return $this->tester->rendered_block_css( $markup, 'countdown' );
	}
}
