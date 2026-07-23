<?php declare( strict_types=1 );

// phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound
// cspell:ignore NNCR SHORTKEY

namespace Tests\wpunit\Resources\Harbor;

use KadenceWP\KadenceBlocks\Harbor\Licensing\Abstract_License_Strategy;
use Tests\Support\Classes\TestCase;

final class TestableLicenseStrategy extends Abstract_License_Strategy {

	public function is_active(): bool {
		return false;
	}

	public function get_type(): string {
		return 'test';
	}

	public function get_key(): string {
		return '';
	}

	public function get_ui_status(): array {
		return $this->empty_ui_status();
	}

	public function public_mask_key( string $key ): string {
		return $this->mask_key( $key );
	}

	public function public_empty_ui_status(): array {
		return $this->empty_ui_status();
	}
}

final class AbstractLicenseStrategyTest extends TestCase {

	private TestableLicenseStrategy $strategy;

	protected function setUp(): void {
		parent::setUp();
		$this->strategy = new TestableLicenseStrategy();
	}

	public function test_empty_ui_status_structure(): void {
		$status = $this->strategy->public_empty_ui_status();

		$this->assertSame( 'none', $status['type'] );
		$this->assertSame( '', $status['maskedKey'] );
		$this->assertSame( '', $status['fullKey'] );
		$this->assertSame( '', $status['expires'] );
		$this->assertSame( '', $status['manageUrl'] );
	}

	public function test_mask_key_with_empty_string(): void {
		$this->assertSame( '', $this->strategy->public_mask_key( '' ) );
	}

	public function test_mask_key_with_dashed_format(): void {
		$masked = $this->strategy->public_mask_key( 'LWSW-1234-5678-9101-1112-NNCR' );
		$this->assertSame( 'LWSW-••••••••••••-NNCR', $masked );
	}

	public function test_mask_key_with_short_key(): void {
		$masked = $this->strategy->public_mask_key( 'SHORTKEY' );
		$this->assertSame( '••••••••', $masked );
	}

	public function test_mask_key_with_long_undashed_key(): void {
		$masked = $this->strategy->public_mask_key( '1234567890123456' );
		$this->assertSame( '1234••••••••3456', $masked );
	}
}
