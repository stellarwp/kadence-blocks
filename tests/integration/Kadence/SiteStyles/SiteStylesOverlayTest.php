<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
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
