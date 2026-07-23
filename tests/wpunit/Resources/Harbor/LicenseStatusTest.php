<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Harbor;

use KadenceWP\KadenceBlocks\Harbor\License_Status;
use KadenceWP\KadenceBlocks\Harbor\Licensing\Legacy_License_Strategy;
use KadenceWP\KadenceBlocks\Harbor\Licensing\Unified_License_Strategy;
use Tests\Support\Classes\TestCase;

final class LicenseStatusTest extends TestCase {

	protected function tearDown(): void {
		delete_option( 'lw_harbor_unified_license_key' );
		delete_option( 'lw_harbor_licensing_products_state' );

		parent::tearDown();
	}

	public function test_resolves_unified_by_default_when_no_license_is_active(): void {
		delete_option( 'lw_harbor_unified_license_key' );
		delete_option( 'lw_harbor_licensing_products_state' );

		$status = new License_Status( new Legacy_License_Strategy(), new Unified_License_Strategy() );

		$resolved = $status->resolve();

		$this->assertInstanceOf( Unified_License_Strategy::class, $resolved );
		$this->assertSame( 'none', $status->get_ui_status()['type'] );
		$this->assertSame( '', $status->get_unified_key() );
	}

	public function test_resolves_unified_and_reports_key_when_unified_license_is_active(): void {
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

		$status = new License_Status( new Legacy_License_Strategy(), new Unified_License_Strategy() );

		$resolved = $status->resolve();
		$ui       = $status->get_ui_status();

		$this->assertInstanceOf( Unified_License_Strategy::class, $resolved );
		$this->assertSame( 'unified', $ui['type'] );
		$this->assertSame( 'LWSW-••••••••••••-NNCR', $ui['maskedKey'] );
		$this->assertSame( 'LWSW-1234-5678-9101-1112-NNCR', $ui['fullKey'] );
		$this->assertSame( 'LWSW-1234-5678-9101-1112-NNCR', $status->get_unified_key() );
	}

	public function test_unified_expires_label_reflects_stored_product_state(): void {
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

		$status = new License_Status( new Legacy_License_Strategy(), new Unified_License_Strategy() );

		$this->assertSame( 'Expires on January 1, 2030', $status->get_ui_status()['expires'] );
	}
}
