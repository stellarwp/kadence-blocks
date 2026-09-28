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

	public function testReturnsTheCustomValuesAndTheCoreColors(): void {
		$radius = [ 20, 20, 20, 20 ];
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[
				'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => $radius ] ] ] ],
				'styles'   => [
					'blocks' => [
						'kadence/singlebtn' => [
							'color' => [
								'background' => '#cc0000',
								'text'       => '#ffffff',
							],
						],
					],
				],
			]
		);

		$this->assertSame(
			[
				'borderRadius' => $radius,
				'background'   => '#cc0000',
				'color'        => '#ffffff',
			],
			$this->store()->attributes( 'kadence/singlebtn' )
		);
	}

	public function testMissingPathsGiveNoValues(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles( [ 'settings' => [ 'color' => [ 'custom' => true ] ] ] );

		$this->assertSame( [], $this->store()->attributes( 'kadence/singlebtn' ) );
	}

	/**
	 * @return array<string, array{string, string}>
	 */
	public function colorProvider(): array {
		return [
			'palette reference'         => [ 'var:preset|color|theme-palette1', 'palette1' ],
			'palette rewritten by KSES' => [ 'var(--wp--preset--color--theme-palette13)', 'palette13' ],
			'another preset'            => [ 'var:preset|color|vivid-red', 'var(--wp--preset--color--vivid-red)' ],
			'custom color'              => [ '#cc0000', '#cc0000' ],
		];
	}

	/**
	 * @dataProvider colorProvider
	 */
	public function testCoreColorsBecomeKadenceColorValues( string $stored, string $expected ): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles(
			[ 'styles' => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => $stored ] ] ] ] ]
		);

		$this->assertSame( [ 'background' => $expected ], $this->store()->attributes( 'kadence/singlebtn' ) );
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
