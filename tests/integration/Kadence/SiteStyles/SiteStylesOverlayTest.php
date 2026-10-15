<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;

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
								'borderRadius'     => [ 20, 20, 20, 20 ],
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
		$this->assertSame( [ 20, 20, 20, 20 ], $labelled['borderRadius'] );
		$this->assertSame(
			[
				'uniqueID'     => 'b',
				'borderRadius' => [ 20, 20, 20, 20 ],
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
}
