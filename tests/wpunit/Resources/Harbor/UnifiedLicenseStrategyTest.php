<?php declare( strict_types=1 );

// cspell:ignore NNCR

namespace Tests\wpunit\Resources\Harbor;

use KadenceWP\KadenceBlocks\Harbor\Licensing\Unified_License_Strategy;
use Tests\Support\Classes\TestCase;

final class UnifiedLicenseStrategyTest extends TestCase {

	protected function tearDown(): void {
		delete_option( 'lw_harbor_unified_license_key' );
		delete_option( 'lw_harbor_licensing_products_state' );

		parent::tearDown();
	}

	public function test_get_key_is_memoized_for_instance_lifetime(): void {
		update_option( 'lw_harbor_unified_license_key', 'LWSW-1234-5678-9101-1112-NNCR' );
		update_option(
			'lw_harbor_licensing_products_state',
			[
				'collection' => [
					[
						'product_slug'      => 'kadence',
						'validation_status' => 'valid',
						'expires'           => '2030-01-01',
						'activated_here'    => true,
					],
				],
			]
		);

		$strategy = new Unified_License_Strategy();
		$first    = $strategy->get_key();

		$this->assertSame( 'LWSW-1234-5678-9101-1112-NNCR', $first );
		$this->assertTrue( $strategy->is_active() );

		delete_option( 'lw_harbor_unified_license_key' );
		delete_option( 'lw_harbor_licensing_products_state' );

		// Same instance keeps the resolved key even after storage changes.
		$this->assertSame( $first, $strategy->get_key() );
		$this->assertTrue( $strategy->is_active() );

		// A fresh instance re-reads storage.
		$fresh = new Unified_License_Strategy();
		$this->assertSame( '', $fresh->get_key() );
		$this->assertFalse( $fresh->is_active() );
	}

	public function test_inactive_get_key_is_also_memoized(): void {
		delete_option( 'lw_harbor_unified_license_key' );
		delete_option( 'lw_harbor_licensing_products_state' );

		$strategy = new Unified_License_Strategy();
		$this->assertSame( '', $strategy->get_key() );

		update_option( 'lw_harbor_unified_license_key', 'LWSW-1234-5678-9101-1112-NNCR' );
		update_option(
			'lw_harbor_licensing_products_state',
			[
				'collection' => [
					[
						'product_slug'      => 'kadence',
						'validation_status' => 'valid',
						'expires'           => '2030-01-01',
						'activated_here'    => true,
					],
				],
			]
		);

		$this->assertSame( '', $strategy->get_key() );
		$this->assertSame( 'LWSW-1234-5678-9101-1112-NNCR', ( new Unified_License_Strategy() )->get_key() );
	}
}
