<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence;

use Codeception\TestCase\WPTestCase;
use Kadence\FSE\Mode;

/**
 * Pins the environment this suite relies on: the Kadence theme is booted,
 * and its Full Site Editing mode can be switched within a test.
 */
final class HarnessTest extends WPTestCase {

	public function testKadenceIsTheActiveTheme(): void {
		$this->assertSame( 'kadence', get_stylesheet() );
		$this->assertTrue( class_exists( 'Kadence\Theme' ) );
	}

	public function testKadenceBlocksIsActive(): void {
		$this->assertTrue( is_plugin_active( 'kadence-blocks/kadence-blocks.php' ) );
		$this->assertTrue( defined( 'KADENCE_BLOCKS_VERSION' ) );
	}

	public function testWordPressSupportsFseMode(): void {
		$this->assertTrue( Mode::is_supported(), 'The suite needs WordPress ' . Mode::minimum_wp_version() . ' or later.' );
	}

	public function testFseModeIsOffByDefault(): void {
		$this->assertFalse( \Kadence\is_fse_mode() );
	}

	public function testFseModeSwitchesWithinATest(): void {
		Mode::enable();

		$this->assertTrue( \Kadence\is_fse_mode() );

		Mode::disable();

		$this->assertFalse( \Kadence\is_fse_mode() );
	}
}
