<?php

declare( strict_types=1 );

namespace Tests\integration\TwentyTwentyThree;

use Codeception\TestCase\WPTestCase;

/**
 * Pins the environment this suite relies on: a block theme is booted and no
 * Kadence theme code is loaded.
 */
final class HarnessTest extends WPTestCase {

	public function testTwentyTwentyThreeIsTheActiveTheme(): void {
		$this->assertSame( 'twentytwentythree', get_stylesheet() );
	}

	public function testNoKadenceThemeCodeIsLoaded(): void {
		$this->assertFalse( class_exists( 'Kadence\\Theme' ) );
		$this->assertFalse( function_exists( 'Kadence\\is_fse_mode' ) );
	}

	public function testKadenceBlocksIsActive(): void {
		$this->assertTrue( is_plugin_active( 'kadence-blocks/kadence-blocks.php' ) );
		$this->assertTrue( defined( 'KADENCE_BLOCKS_VERSION' ) );
	}
}
