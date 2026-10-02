<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Covers merging Single Button site-level values into instance attributes.
 */
final class SiteStylesOverlayTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testTheRenderFilterMergesTheStoredValues(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
			]
		);

		$default_button  = apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', [ 'uniqueID' => 'a' ] );
		$coloured_button = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[
				'uniqueID'   => 'b',
				'background' => '#00aa00',
			]
		);

		$this->assertSame( '#cc0000', $default_button['background'] );
		$this->assertSame( [ 20, 20, 20, 20 ], $default_button['borderRadius'] );
		$this->assertSame( '#00aa00', $coloured_button['background'] );
		$this->assertSame( [ 20, 20, 20, 20 ], $coloured_button['borderRadius'] );
	}

	public function testEachButtonStyleTakesItsSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'singlebtn' => [
								'borderRadius'  => [ 20, 20, 20, 20 ],
								'displayShadow' => true,
							],
						],
					],
				],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
			]
		);

		$render = static fn( array $attributes ): array => apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', $attributes );

		$default = $render( [ 'uniqueID' => 'a' ] );
		$fill    = $render(
			[
				'uniqueID'      => 'b',
				'inheritStyles' => 'fill',
			]
		);
		$outline = $render(
			[
				'uniqueID'      => 'c',
				'inheritStyles' => 'outline',
			]
		);

		foreach ( [ $default, $fill ] as $button ) {
			$this->assertSame( '#cc0000', $button['background'] );
			$this->assertSame( [ 20, 20, 20, 20 ], $button['borderRadius'] );
			$this->assertTrue( $button['displayShadow'] );
		}
		$this->assertSame( [ 20, 20, 20, 20 ], $outline['borderRadius'] );
		$this->assertArrayNotHasKey( 'background', $outline );
		$this->assertArrayNotHasKey( 'displayShadow', $outline );

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
