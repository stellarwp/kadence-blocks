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
