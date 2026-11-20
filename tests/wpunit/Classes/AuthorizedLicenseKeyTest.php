<?php declare( strict_types=1 );

namespace Tests\wpunit\Classes;

use Tests\Support\Classes\TestCase;

/**
 * Tests which Harbor licenses make kadence_blocks_get_authorized_license_key() return the unified key.
 */
final class AuthorizedLicenseKeyTest extends TestCase {

	private const UNIFIED_KEY = 'LWSW-0000000000000000000000';

	protected function setUp(): void {
		parent::setUp();

		if ( ! function_exists( 'uopz_set_return' ) ) {
			$this->markTestSkipped( 'Needs uopz to stand in for Harbor.' );
		}

		uopz_set_return( 'lw_harbor_get_unified_license_key', self::UNIFIED_KEY );
	}

	protected function tearDown(): void {
		if ( function_exists( 'uopz_unset_return' ) ) {
			uopz_unset_return( 'lw_harbor_is_product_license_active' );
			uopz_unset_return( 'lw_harbor_get_unified_license_key' );
		}

		parent::tearDown();
	}

	public function test_it_returns_the_unified_key_for_a_kadence_license(): void {
		$this->activate_harbor_products( [ 'kadence' ] );

		$this->assertSame( self::UNIFIED_KEY, kadence_blocks_get_authorized_license_key() );
	}

	public function test_it_returns_the_unified_key_for_a_nexcess_plugin_stack_license(): void {
		$this->activate_harbor_products( [ 'nexcess-plugin-stack' ] );

		$this->assertSame( self::UNIFIED_KEY, kadence_blocks_get_authorized_license_key() );
	}

	public function test_it_returns_no_key_for_an_unrelated_license(): void {
		$this->activate_harbor_products( [ 'give' ] );

		$this->assertSame( '', kadence_blocks_get_authorized_license_key() );
	}

	public function test_it_returns_no_key_without_a_license(): void {
		$this->activate_harbor_products( [] );

		$this->assertSame( '', kadence_blocks_get_authorized_license_key() );
	}

	/**
	 * @param string[] $slugs Harbor product slugs reported as active.
	 */
	private function activate_harbor_products( array $slugs ): void {
		uopz_set_return(
			'lw_harbor_is_product_license_active',
			static fn ( string $product ): bool => in_array( $product, $slugs, true ),
			true
		);
	}
}
