<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Banner;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Banner\Software_Packages_Banner;
use KadenceWP\KadenceBlocks\Nexcess\Banners\Registry;
use Tests\Support\Classes\TestCase;

final class SoftwarePackagesBannerTest extends TestCase {

	private ?string $plugin_page;

	protected function setUp(): void {
		parent::setUp();

		if ( ! function_exists( 'uopz_set_return' ) ) {
			$this->markTestSkipped( 'Needs uopz to freeze the clock and stand in for Harbor.' );
		}

		$this->plugin_page = $GLOBALS['plugin_page'] ?? null;

		unset( $GLOBALS['nx_banners'][ Software_Packages_Banner::ID ] );
		$this->container->get( Software_Packages_Banner::class )->register();

		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );
		$GLOBALS['plugin_page'] = 'kadence-blocks';
		set_current_screen( 'toplevel_page_kadence-blocks' );

		uopz_set_return( 'lw_harbor_is_product_license_active', true );
	}

	protected function tearDown(): void {
		if ( function_exists( 'uopz_unset_return' ) ) {
			uopz_unset_return( 'time' );
			uopz_unset_return( 'lw_harbor_is_product_license_active' );
		}

		$GLOBALS['plugin_page'] = $this->plugin_page;
		set_current_screen( 'front' );

		parent::tearDown();
	}

	public function test_it_registers_the_shared_banner(): void {
		$banner = ( new Registry() )->get( Software_Packages_Banner::ID );

		$this->assertSame( 'nexcess-software-packages-2026-10-14', $banner->id() );
		$this->assertSame( '1.0.0', $banner->version() );
		$this->assertSame( 'https://explore.nexcess.com/software-packages', $banner->fields()->ctaUrl );
	}

	public function test_it_hides_the_banner_before_it_starts(): void {
		$this->freeze_clock_at( '2026-10-14 11:59:59' );

		$this->assertSame( '', $this->render() );
	}

	public function test_it_shows_the_banner_once_it_starts(): void {
		$this->freeze_clock_at( '2026-10-14 12:00:00' );

		$output = $this->render();

		$this->assertStringContainsString( 'notice nx-banner', $output );
		$this->assertStringContainsString( 'Changes are coming to your plan at your next renewal.', $output );
		$this->assertStringContainsString( 'https://explore.nexcess.com/software-packages', $output );
		$this->assertStringContainsString( 'vendor/vendor-prefixed/stellarwp/banners/src/templates/banner.css', $output );
	}

	public function test_it_keeps_showing_the_banner(): void {
		$this->freeze_clock_at( '2036-10-14 12:00:00' );

		$this->assertStringContainsString( 'notice nx-banner', $this->render() );
	}

	public function test_it_hides_the_banner_without_a_license(): void {
		$this->freeze_clock_at( '2026-10-14 12:00:00' );
		uopz_set_return( 'lw_harbor_is_product_license_active', false );

		$this->assertSame( '', $this->render() );
	}

	public function test_it_shows_the_banner_on_admin_notices(): void {
		$this->freeze_clock_at( '2026-10-14 12:00:00' );

		ob_start();
		do_action( 'admin_notices' );
		$output = (string) ob_get_clean();

		$this->assertStringContainsString( 'notice nx-banner', $output );
	}

	private function freeze_clock_at( string $time ): void {
		uopz_set_return( 'time', ( new DateTimeImmutable( $time, new DateTimeZone( 'America/New_York' ) ) )->getTimestamp() );
	}

	private function render(): string {
		ob_start();
		$this->container->get( Software_Packages_Banner::class )->render();

		return (string) ob_get_clean();
	}
}
