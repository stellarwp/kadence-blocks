<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;

/**
 * Covers the instance CSS of Show More blocks with site-level styles: untouched blocks take the site values,
 * a block's own values keep their whole group, and the expand behavior stays per block.
 */
final class SiteStylesShowMoreTest extends WPTestCase {
	/**
	 * The suite actor.
	 *
	 * @since TBD
	 *
	 * @var \IntegrationTester
	 */
	protected \IntegrationTester $tester;

	/**
	 * Without site values, a Show More block's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider showMoreProvider
	 *
	 * @param array<string, mixed> $attributes The block's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->show_more_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->show_more_css( $attributes ) );
	}

	/**
	 * An untouched block takes every site value: the collapsed height on each device, the fade, the padding
	 * and the margin.
	 *
	 * @return void
	 */
	public function testAnUntouchedBlockTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->show_more_css( [] );

		$this->assertStringContainsString( 'max-height:20rem', $css );
		$this->assertStringContainsString( 'max-height:10rem', $css );
		$this->assertStringContainsString( 'mask-image:linear-gradient(to bottom, black 70%, transparent 100%)', $css );
		$this->assertStringContainsString( 'padding-top:12px', $css );
		$this->assertStringContainsString( 'margin-bottom:3em', $css );
	}

	/**
	 * A block with its own height keeps its own unit and takes no site tablet height, while the groups it
	 * doesn't set still take the site values.
	 *
	 * @return void
	 */
	public function testAnOwnHeightKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->show_more_css( [ 'heightDesktop' => 400 ] );

		$this->assertStringContainsString( 'max-height:400px', $css );
		$this->assertStringNotContainsString( 'rem', $css );
		$this->assertStringContainsString( 'padding-top:12px', $css );
		$this->assertStringContainsString( 'black 70%', $css );
	}

	/**
	 * A block with its own fade size owns the fade, so a site that turns the fade on doesn't fade it.
	 *
	 * @return void
	 */
	public function testAnOwnFadeSizeKeepsTheBlocksOwnFade(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->show_more_css( [ 'fadeOutSize' => 20 ] );

		$this->assertStringNotContainsString( 'mask-image:linear-gradient', $css );
		$this->assertStringContainsString( 'max-height:20rem', $css );
	}

	/**
	 * Stored expand settings are never applied: they belong to each block.
	 *
	 * @return void
	 */
	public function testStoredExpandSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$expected = $this->show_more_css( [] );

		$this->store_site_values(
			[
				'showHideMore'           => false,
				'defaultExpandedDesktop' => true,
				'defaultExpandedTablet'  => true,
				'defaultExpandedMobile'  => true,
			]
		);

		$this->assertSame( $expected, $this->show_more_css( [] ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->show_more_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->show_more_css( [] ) );
	}

	/**
	 * The site rules print nothing for Show More, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->show_more_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/show-more' ) );
	}

	/**
	 * The CSS built in the page head fires the attributes filter under the block's hyphenated slug, and it
	 * merges the site values too.
	 *
	 * @return void
	 */
	public function testTheHeadPassFilterTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$attributes = apply_filters( 'kadence_blocks_show-more_render_block_attributes', [ 'uniqueID' => 'sm_test' ] );

		$this->assertSame( 20, $attributes['heightDesktop'] );
		$this->assertSame( 'rem', $attributes['heightType'] );
	}

	/**
	 * @return Generator
	 */
	public function showMoreProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own height' => [ 'attributes' => [ 'heightDesktop' => 400 ] ];
		yield 'own fade' => [
			'attributes' => [
				'enableFadeOut' => true,
				'fadeOutSize'   => 30,
			],
		];
	}

	/**
	 * Stores site values for every Show More group, plus any extra values.
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
							'show-more' => array_merge(
								[
									'heightDesktop'  => 20,
									'heightTablet'   => 10,
									'heightType'     => 'rem',
									'enableFadeOut'  => true,
									'fadeOutSize'    => 30,
									'paddingDesktop' => [ 12, 12, 12, 12 ],
									'paddingUnit'    => 'px',
									'marginDesktop'  => [ '', '', 3, '' ],
									'marginUnit'     => 'em',
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
	 * Renders a Show More block and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes The block's own attributes.
	 *
	 * @return string The CSS.
	 */
	private function show_more_css( array $attributes ): string {
		$attributes = array_merge( [ 'uniqueID' => 'sm_test' ], $attributes );
		$markup     = sprintf(
			'<!-- wp:kadence/show-more %s --><div class="wp-block-kadence-show-more kb-block-show-more-container kb-block-show-more-container%s"></div><!-- /wp:kadence/show-more -->',
			wp_json_encode( $attributes ),
			$attributes['uniqueID']
		);

		return $this->tester->rendered_block_css( $markup, 'show-more' );
	}
}
