<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree;

use Codeception\TestCase\WPTestCase;

/**
 * Covers `kadence_blocks_is_fse_mode()` without the Kadence theme.
 */
final class FseModeDetectionTest extends WPTestCase {

	public function testIsOffWithoutTheKadenceTheme(): void {
		$this->assertFalse( kadence_blocks_is_fse_mode() );
	}

	public function testALeftoverModeSettingDoesNotTurnItOn(): void {
		// What switching away from the Kadence theme with FSE mode on leaves behind.
		update_option( 'kadence_fse_mode', 'enabled' );

		$this->assertFalse( kadence_blocks_is_fse_mode() );
	}

	public function testFilterOverridesTheResult(): void {
		add_filter( 'kadence_blocks_is_fse_mode', '__return_true' );

		$this->assertTrue( kadence_blocks_is_fse_mode() );
	}
}
