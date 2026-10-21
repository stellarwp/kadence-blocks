<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Store;

/**
 * Covers reading Single Button's site-level values from the user Global Styles.
 */
final class SiteStylesStoreTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testReturnsTheCustomValuesAndLeavesTheCoreColorsToCore(): void {
		$radius = [ 20, 20, 20, 20 ];
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => $radius ] ] ] ],
				'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
			]
		);

		$this->assertSame( [ 'borderRadius' => $radius ], $this->store()->attributes( 'kadence/singlebtn' ) );
	}

	/**
	 * A test that stores nothing reads no values, whatever an earlier test stored and read.
	 *
	 * @return void
	 */
	public function testNoRecordGivesNoValuesAfterAnotherTestsRead(): void {
		$this->tester->enable_fse_mode();

		$this->assertSame( [], $this->store()->attributes( 'kadence/singlebtn' ) );
	}

	/**
	 * Storing new values replaces the ones read before them in the same request.
	 *
	 * @return void
	 */
	public function testANewlyStoredValueReplacesTheOneReadBefore(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ] ] );
		$this->store()->attributes( 'kadence/singlebtn' );

		$this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 5, 5, 5, 5 ] ] ] ] ] ] );

		$this->assertSame( [ 'borderRadius' => [ 5, 5, 5, 5 ] ], $this->store()->attributes( 'kadence/singlebtn' ) );
	}

	/**
	 * Deleting the user Global Styles after a read leaves no values to read.
	 *
	 * @return void
	 */
	public function testADeletedRecordGivesNoValues(): void {
		$this->tester->enable_fse_mode();
		$post_id = $this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ] ] );
		$this->store()->attributes( 'kadence/singlebtn' );

		wp_delete_post( $post_id, true );

		$this->assertSame( [], $this->store()->attributes( 'kadence/singlebtn' ) );
	}

	public function testMissingPathsGiveNoValues(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles( [ 'settings' => [ 'color' => [ 'custom' => true ] ] ] );

		$this->assertSame( [], $this->store()->attributes( 'kadence/singlebtn' ) );
	}

	public function testClassicModeGivesNoValues(): void {
		$this->tester->store_user_global_styles(
			[ 'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ] ]
		);

		$this->assertSame( [], $this->store()->attributes( 'kadence/singlebtn' ) );
	}

	public function testAnUnsupportedBlockGivesNoValues(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[ 'settings' => [ 'custom' => [ 'kadence' => [ 'infobox' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ] ]
		);

		$this->assertSame( [], $this->store()->attributes( 'kadence/infobox' ) );
	}

	private function store(): Store {
		return App::instance()->container()->get( Store::class );
	}
}
