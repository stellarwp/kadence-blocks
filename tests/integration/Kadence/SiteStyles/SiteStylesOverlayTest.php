<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Overlay;
use KadenceWP\KadenceBlocks\Site_Styles\Store;
use KadenceWP\KadenceBlocks\Site_Styles\Supported_Blocks;

/**
 * Covers merging Single Button's overlay-listed site values into instance
 * attributes. Core's Global Styles and the site rules render the rest.
 */
final class SiteStylesOverlayTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testTheRenderFilterMergesOnlyTheOverlayAttributes(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'singlebtn' => [
								'sizePreset'   => 'large',
								'borderRadius' => [ 20, 20, 20, 20 ],
							],
						],
					],
				],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
			]
		);

		$default_button = apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', [ 'uniqueID' => 'a' ] );
		$small_button   = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[
				'uniqueID'   => 'b',
				'sizePreset' => 'small',
			]
		);

		$this->assertSame( 'large', $default_button['sizePreset'] );
		$this->assertArrayNotHasKey( 'borderRadius', $default_button );
		$this->assertArrayNotHasKey( 'background', $default_button );
		$this->assertSame( 'small', $small_button['sizePreset'] );
	}

	public function testEachButtonStyleTakesItsSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'sizePreset' => 'large' ] ] ] ] ]
		);

		$render = static fn( array $attributes ): array => apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', $attributes );

		foreach ( [ 'fill', 'outline' ] as $style ) {
			$button = $render(
				[
					'uniqueID'      => 'b',
					'inheritStyles' => $style,
				]
			);

			$this->assertSame( 'large', $button['sizePreset'], $style );
		}

		foreach ( [ 'inherit', 'inherit-secondary' ] as $style ) {
			$attributes = [
				'uniqueID'      => 'd',
				'inheritStyles' => $style,
			];

			$this->assertSame( $attributes, $render( $attributes ) );
		}
	}

	/**
	 * The site's box values reach a button with none of its own, and a padding the button sets keeps the site's narrower-device values off it.
	 *
	 * @return void
	 */
	public function testSiteBoxValuesReachTheButtonUnlessItsOwnValueCoversTheDevice(): void {
		$this->tester->enable_fse_mode();
		$site = $this->tester->store_single_button_box_values();

		$untouched = apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', [ 'uniqueID' => 'a' ] );
		$own       = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[
				'uniqueID' => 'b',
				'padding'  => [ 2, 10, 2, 10 ],
			]
		);

		foreach ( $site as $name => $value ) {
			$this->assertSame( $value, $untouched[ $name ], $name );
		}

		$this->assertSame( [ 2, 10, 2, 10 ], $own['padding'] );
		$this->assertArrayNotHasKey( 'mobilePadding', $own );
		$this->assertSame( $site['margin'], $own['margin'] );
		$this->assertSame( $site['mobileMargin'], $own['mobileMargin'] );
		$this->assertSame( $site['shadowHover'], $own['shadowHover'] );
	}

	/**
	 * A button's own padding stays in its own unit: when the site pads in another unit, none of the site's padding reaches the button, so its values are never shown in the site's unit.
	 *
	 * @dataProvider siteUnitProvider
	 *
	 * @param array{paddingUnit: string, padding?: list<int|float>, mobilePadding?: list<int|float>} $site The site's padding settings.
	 *
	 * @return void
	 */
	public function testAnOwnPaddingIsNotShownInTheSitesUnit( array $site ): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => $site ] ] ] ] );

		$own = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[
				'uniqueID' => 'a',
				'padding'  => [ 20, 20, 20, 20 ],
			]
		);

		$this->assertSame( [ 20, 20, 20, 20 ], $own['padding'] );
		$this->assertArrayNotHasKey( 'paddingUnit', $own );
		$this->assertArrayNotHasKey( 'mobilePadding', $own );
	}

	/**
	 * The site settings for a padding in a unit other than the button's default.
	 *
	 * @return Generator
	 */
	public function siteUnitProvider(): Generator {
		yield 'values and a unit' => [
			'site' => [
				'paddingUnit'   => 'em',
				'padding'       => [ 1, 2, 1, 2 ],
				'mobilePadding' => [ 0.5, 1, 0.5, 1 ],
			],
		];

		yield 'a unit alone' => [
			'site' => [ 'paddingUnit' => 'em' ],
		];
	}

	/**
	 * A button with no padding of its own, shown with the block's defaults as the render fills them in, takes the site's padding in the site's unit.
	 *
	 * @return void
	 */
	public function testAButtonWithNoPaddingTakesTheSitesUnit(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'singlebtn' => [
								'paddingUnit' => 'em',
								'padding'     => [ 1, 2, 1, 2 ],
							],
						],
					],
				],
			]
		);

		$blank  = [ '', '', '', '' ];
		$button = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[
				'uniqueID'      => 'a',
				'paddingUnit'   => 'px',
				'padding'       => $blank,
				'tabletPadding' => $blank,
				'mobilePadding' => $blank,
			]
		);

		$this->assertSame( 'em', $button['paddingUnit'] );
		$this->assertSame( [ 1, 2, 1, 2 ], $button['padding'] );
	}

	/**
	 * Outline takes the site's spacing but not its shadows, and the theme's button styles take none of the box values.
	 *
	 * @return void
	 */
	public function testOutlineTakesTheSiteSpacingButNotItsShadows(): void {
		$this->tester->enable_fse_mode();
		$site = $this->tester->store_single_button_box_values();

		$outline = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[
				'uniqueID'      => 'c',
				'inheritStyles' => 'outline',
			]
		);
		$base    = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[
				'uniqueID'      => 'd',
				'inheritStyles' => 'inherit',
			]
		);

		$this->assertSame( $site['padding'], $outline['padding'] );
		$this->assertSame( $site['mobileMargin'], $outline['mobileMargin'] );
		$this->assertArrayNotHasKey( 'displayShadow', $outline );
		$this->assertArrayNotHasKey( 'shadowHover', $outline );
		$this->assertArrayNotHasKey( 'padding', $base );
		$this->assertArrayNotHasKey( 'displayShadow', $base );
	}

	public function testStoredContentValuesAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'singlebtn' => [
								'sizePreset'       => 'large',
								'label'            => 'Site label',
								'buttonRole'       => true,
								'iconTitle'        => 'Site icon title',
								'tooltip'          => 'Site tooltip',
								'tooltipPlacement' => 'bottom',
								'isSubmit'         => true,
								'uniqueID'         => 'site',
							],
						],
					],
				],
			]
		);

		$render = static fn( array $attributes ): array => apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', $attributes );

		$labelled = $render(
			[
				'uniqueID' => 'a',
				'label'    => 'Own label',
			]
		);
		$plain    = $render( [ 'uniqueID' => 'b' ] );

		$this->assertSame( 'Own label', $labelled['label'] );
		$this->assertSame( 'large', $labelled['sizePreset'] );
		$this->assertSame(
			[
				'uniqueID'   => 'b',
				'sizePreset' => 'large',
			],
			$plain
		);
		foreach ( [ 'buttonRole', 'iconTitle', 'tooltip', 'tooltipPlacement', 'isSubmit' ] as $content ) {
			$this->assertArrayNotHasKey( $content, $labelled );
		}
	}

	public function testClassicModeLeavesTheAttributesAlone(): void {
		$this->tester->store_user_global_styles(
			[ 'styles' => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ] ]
		);

		$attributes = [ 'uniqueID' => 'a' ];

		$this->assertSame( $attributes, apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', $attributes ) );
	}

	/**
	 * A block with groups renders a group the instance sets itself without the group's site values, and still
	 * takes the site values outside its groups.
	 *
	 * @return void
	 */
	public function testAGroupTheInstanceSetsTakesNoSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'spacer' => [
								'tabletSpacerHeight' => 30,
								'spacerHeightUnits'  => 'rem',
								'dividerWidth'       => 50,
							],
						],
					],
				],
			]
		);
		$blocks  = new Supported_Blocks( [ $this->grouped_spacer() ] );
		$overlay = new Overlay( new Store( $blocks ), $blocks );

		$untouched = $overlay->apply( 'kadence/spacer', [ 'uniqueID' => 'a' ] );
		$own       = $overlay->apply(
			'kadence/spacer',
			[
				'uniqueID'     => 'b',
				'spacerHeight' => 120,
			]
		);

		$this->assertSame( 'rem', $untouched['spacerHeightUnits'] );
		$this->assertSame( 30, $untouched['tabletSpacerHeight'] );
		$this->assertSame( 50, $untouched['dividerWidth'] );
		$this->assertSame( 120, $own['spacerHeight'] );
		$this->assertArrayNotHasKey( 'spacerHeightUnits', $own );
		$this->assertArrayNotHasKey( 'tabletSpacerHeight', $own );
		$this->assertSame( 50, $own['dividerWidth'] );

		// An instance that carries the block's defaults doesn't set the group, so it still takes the site values.
		$defaults = $overlay->apply(
			'kadence/spacer',
			[
				'uniqueID'           => 'c',
				'spacerHeight'       => 60,
				'tabletSpacerHeight' => '',
				'spacerHeightUnits'  => 'px',
			]
		);

		$this->assertSame( 'rem', $defaults['spacerHeightUnits'] );
		$this->assertSame( 30, $defaults['tabletSpacerHeight'] );
	}


	/**
	 * The Block Defaults filter runs only for an instance with a value of its own: an untouched instance
	 * measures every site value against the registered defaults alone.
	 *
	 * @return void
	 */
	public function testTheBlockDefaultsFilterRunsOnlyForAnInstanceWithItsOwnValue(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => [ 'spacer' => [ 'spacerHeight' => 40 ] ] ] ] ] );
		$before = did_filter( 'kadence_blocks_block_default_attributes' );

		$untouched = apply_filters( 'kadence_blocks_spacer_render_block_attributes', [ 'uniqueID' => 'sp_a' ] );

		$this->assertSame( 40, $untouched['spacerHeight'] );
		$this->assertSame( $before, did_filter( 'kadence_blocks_block_default_attributes' ) );

		apply_filters(
			'kadence_blocks_spacer_render_block_attributes',
			[
				'uniqueID'     => 'sp_b',
				'spacerHeight' => 120,
			]
		);

		$this->assertSame( $before + 1, did_filter( 'kadence_blocks_block_default_attributes' ) );
	}

	/**
	 * A Spacer stand-in that groups its heights with their unit, and also takes a site divider width.
	 *
	 * @return Supports_Site_Styles The block.
	 */
	private function grouped_spacer(): Supports_Site_Styles {
		return new class() implements Supports_Site_Styles, Groups_Site_Styles {

			public function get_name(): string {
				return 'kadence/spacer';
			}

			public function get_slug(): string {
				return 'spacer';
			}

			public function site_styles_overlay_attributes(): array {
				return [ 'spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits', 'dividerWidth' ];
			}

			public function site_styles_attributes_map(): array {
				return [];
			}

			public function site_styles_supports(): array {
				return [];
			}

			public function site_styles_selectors(): array {
				return [];
			}

			public function site_styles_attribute_groups(): array {
				return [ [ 'spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits' ] ];
			}
		};
	}
}
