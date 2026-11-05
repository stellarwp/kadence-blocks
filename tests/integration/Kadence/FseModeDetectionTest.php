<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence;

use Codeception\TestCase\WPTestCase;

/**
 * Covers `kadence_blocks_is_fse_mode()` with the Kadence theme active.
 */
final class FseModeDetectionTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testIsOffByDefault(): void {
		$this->assertFalse( kadence_blocks_is_fse_mode() );
	}

	public function testFollowsTheThemeMode(): void {
		$this->tester->enable_fse_mode();

		$this->assertTrue( kadence_blocks_is_fse_mode() );
	}

	public function testReflectsAModeChangeWithinTheRequest(): void {
		$this->tester->enable_fse_mode();
		$before = kadence_blocks_is_fse_mode();

		$this->tester->disable_fse_mode();

		$this->assertTrue( $before );
		$this->assertFalse( kadence_blocks_is_fse_mode() );
	}

	public function testFilterOverridesTheThemeMode(): void {
		$this->tester->enable_fse_mode();
		add_filter( 'kadence_blocks_is_fse_mode', '__return_false' );

		$this->assertFalse( kadence_blocks_is_fse_mode() );
	}
}
