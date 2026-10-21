<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use Kadence_Blocks_CSS;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers Progress Bars with site-level styles: an untouched bar takes the site colors, thickness and text
 * styles in its CSS and its drawn bar, a mask bar keeps its own thickness, and a bar's own color or font keeps
 * its whole group.
 */
final class SiteStylesProgressBarTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Draws bars as static SVG, so the markup carries the colors and thickness the progress script would use.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		add_filter( 'kadence-blocks-progress-bar-static', '__return_true' );
	}

	/**
	 * Removes the static SVG filter and empties the CSS a test built.
	 *
	 * @return void
	 */
	public function tearDown(): void {
		remove_filter( 'kadence-blocks-progress-bar-static', '__return_true' );
		Kadence_Blocks_CSS::$styles = [];
		parent::tearDown();
	}

	/**
	 * Without site values, a Progress Bar's CSS and markup in FSE mode are the same as in classic mode.
	 *
	 * @dataProvider progressBarProvider
	 *
	 * @param array<string, mixed> $attributes The bar's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheOutputMatchesClassicMode( array $attributes ): void {
		$classic = $this->render( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->render( $attributes ) );
	}

	/**
	 * An untouched bar takes the site colors, thickness and radius in its drawn bar and CSS, and the site label
	 * font, alignment and max width.
	 *
	 * @return void
	 */
	public function testAnUntouchedBarTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		[ 'css' => $css, 'html' => $html ] = $this->render( [] );

		$this->assertStringContainsString( 'stroke="#ff0000"', $html );
		$this->assertStringContainsString( 'stroke="#00ff00"', $html );
		$this->assertStringContainsString( 'stroke-width="4"', $html );
		$this->assertStringContainsString( 'border-radius:5px', $css );
		$this->assertStringContainsString( 'font-size:20px', $css );
		$this->assertStringContainsString( 'color:#123456', $css );
		$this->assertStringContainsString( 'justify-content:center', $css );
		$this->assertStringContainsString( 'width:300px', $css );
	}

	/**
	 * A mask bar uses the thickness as its shape height, so it keeps its own thickness and shape size while it
	 * still takes the site colors and label font.
	 *
	 * @return void
	 */
	public function testAMaskBarKeepsItsOwnThickness(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		[ 'css' => $css, 'html' => $html ] = $this->render( [ 'barType' => 'line-mask' ] );

		$this->assertStringContainsString( 'height:23px', $css );
		$this->assertStringNotContainsString( 'height:46px', $css );
		$this->assertStringContainsString( 'stroke-width="2"', $html );
		$this->assertStringContainsString( 'stroke="#ff0000"', $html );
		$this->assertStringContainsString( 'color:#123456', $css );
	}

	/**
	 * A bar with its own progress color keeps its own opacity too, so the site opacity doesn't fade it.
	 *
	 * @return void
	 */
	public function testAnOwnColorKeepsItsOpacity(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values( [ 'progressOpacity' => 0.5 ] );

		[ 'html' => $html ] = $this->render( [ 'progressColor' => '#0000ff' ] );

		$this->assertStringContainsString( 'stroke="#0000ff"', $html );
		$this->assertStringContainsString( 'stroke="#00ff00"', $html );
	}

	/**
	 * A bar with any label font value of its own keeps its whole font, so the site label color doesn't reach
	 * it, while it still takes the site bar colors.
	 *
	 * @return void
	 */
	public function testAnOwnLabelFontKeepsTheWholeFont(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		[ 'css' => $css, 'html' => $html ] = $this->render(
			[
				'labelFont' => [
					'size'     => [ '14', '', '' ],
					'sizeType' => 'px',
				],
			]
		);

		$this->assertStringContainsString( 'font-size:14px', $css );
		$this->assertStringNotContainsString( 'color:#123456', $css );
		$this->assertStringContainsString( 'stroke="#ff0000"', $html );
	}

	/**
	 * An untouched bar's number takes the site label line height with its unit, as the editor shows it.
	 *
	 * @return void
	 */
	public function testAnUntouchedNumberTakesTheSiteLabelLineHeightWithItsUnit(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values(
			[
				'labelFont' => [
					'lineHeight' => [ '24', '', '' ],
					'lineType'   => 'px',
				],
			]
		);

		[ 'css' => $css ] = $this->render( [] );

		$this->assertMatchesRegularExpression( '/\.kt-progress-percent\{[^}]*?line-height:24px/', $css );
	}

	/**
	 * Stored type, content, number and animation settings are never applied: they belong to each bar.
	 *
	 * @return void
	 */
	public function testStoredContentAndBehaviorSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->render( [] );

		$this->store_site_values(
			[
				'barType'          => 'circle',
				'label'            => 'Site label',
				'labelPosition'    => 'below',
				'labelLayout'      => 'pl',
				'progressAmount'   => 10,
				'displayPercent'   => false,
				'numberSuffix'     => 'pts',
				'duration'         => 5,
				'delayUntilInView' => false,
			]
		);

		$this->assertSame( $expected, $this->render( [] ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->render( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->render( [] ) );
	}

	/**
	 * The CSS built in the page head reads raw attributes, and an untouched bar takes the site values there,
	 * while a mask bar takes none of the site thickness.
	 *
	 * @return void
	 */
	public function testTheHeadPassTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$line = apply_filters( 'kadence_blocks_progress-bar_render_block_attributes', [ 'uniqueID' => 'pb_test' ] );
		$mask = apply_filters(
			'kadence_blocks_progress-bar_render_block_attributes',
			[
				'uniqueID' => 'pb_test',
				'barType'  => 'line-mask',
			]
		);

		$this->assertSame( [ 5, '', '' ], $line['progressBorderRadius'] );
		$this->assertSame( 4, $line['progressWidth'] );
		$this->assertArrayNotHasKey( 'progressWidth', $mask );
		$this->assertSame( '#ff0000', $mask['progressColor'] );
	}

	/**
	 * The site rules print nothing for Progress Bar, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->render( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/progress-bar' ) );
	}

	/**
	 * @return Generator
	 */
	public function progressBarProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own color' => [ 'attributes' => [ 'progressColor' => '#0000ff' ] ];
		yield 'mask' => [ 'attributes' => [ 'barType' => 'line-mask' ] ];
	}

	/**
	 * Stores site values for the bar colors, thickness and radius, the label font, the alignment and the max
	 * width, plus any extra values.
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
							'progress-bar' => array_merge(
								[
									'progressColor'        => '#ff0000',
									'barBackground'        => '#00ff00',
									'progressWidth'        => 4,
									'progressBorderRadius' => [ 5, '', '' ],
									'labelFont'            => [
										'color'    => '#123456',
										'size'     => [ '20', '', '' ],
										'sizeType' => 'px',
									],
									'hAlign'               => 'center',
									'containerMaxWidth'    => 300,
									'containerMaxWidthUnits' => 'px',
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
	 * Renders a Progress Bar and returns its instance CSS and its markup.
	 *
	 * @param array<string, mixed> $attributes The bar's own attributes.
	 *
	 * @return array{css: string, html: string} The CSS and the markup.
	 */
	private function render( array $attributes ): array {
		Kadence_Blocks_CSS::$styles = [];
		$html                       = do_blocks(
			sprintf(
				'<!-- wp:kadence/progress-bar %s /-->',
				wp_json_encode(
					array_merge(
						[
							'uniqueID' => 'pb_test',
							'label'    => 'Skill',
						],
						$attributes
					)
				)
			)
		);
		$css                        = '';
		foreach ( Kadence_Blocks_CSS::$styles as $style_id => $style ) {
			if ( str_starts_with( $style_id, 'kb-progress-bar' ) ) {
				$css .= $style;
			}
		}

		return [
			'css'  => $css,
			'html' => (string) preg_replace( '/<style[^>]*>.*?<\/style>/s', '', $html ),
		];
	}
}
