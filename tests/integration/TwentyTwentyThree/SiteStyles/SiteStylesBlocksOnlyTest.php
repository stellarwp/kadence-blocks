<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree\SiteStyles;

use Codeception\TestCase\WPTestCase;
use WP_Theme_JSON_Resolver;

/**
 * Covers that site-level block styles change nothing for Kadence Blocks on
 * another block theme.
 */
final class SiteStylesBlocksOnlyTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testSingleButtonGetsNoColorSupport(): void {
		$metadata = [
			'name'     => 'kadence/singlebtn',
			'supports' => [ 'html' => false ],
		];

		$this->assertSame( $metadata, apply_filters( 'block_type_metadata', $metadata ) );
	}

	public function testTheOverlayLeavesTheAttributesAlone(): void {
		$this->tester->store_user_global_styles(
			[
				'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
			]
		);
		$attributes = [ 'uniqueID' => 'a' ];

		$this->assertSame( $attributes, apply_filters( 'kadence_blocks_singlebtn_render_block_attributes', $attributes ) );
	}

	public function testTheUserGlobalStylesAreUnchangedApartFromKadenceValues(): void {
		$core_data = [
			'settings' => [ 'color' => [ 'custom' => false ] ],
			'styles'   => [
				'color'  => [ 'background' => '#fafafa' ],
				'blocks' => [ 'core/button' => [ 'color' => [ 'background' => '#123456' ] ] ],
			],
		];
		$this->tester->store_user_global_styles(
			array_merge_recursive( $core_data, [ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ] ] )
		);

		$resolved = WP_Theme_JSON_Resolver::get_user_data()->get_raw_data();

		$this->assertArrayNotHasKey( 'kadence', $resolved['settings']['custom'] ?? [] );
		$this->assertSame( $core_data['settings']['color'], $resolved['settings']['color'] );
		$this->assertSame( $core_data['styles']['color'], $resolved['styles']['color'] );
		$this->assertSame( $core_data['styles']['blocks']['core/button'], $resolved['styles']['blocks']['core/button'] );
	}
}
