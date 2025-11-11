<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Enums;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use Tests\Support\Classes\OptimizerTestCase;

/**
 * Test the Viewport enum class.
 */
final class ViewportTest extends OptimizerTestCase {

	/**
	 * Test desktop viewport creation.
	 */
	public function testDesktopViewport(): void {
		$viewport = Viewport::desktop();

		$this->assertInstanceOf( Viewport::class, $viewport );
		$this->assertEquals( Viewport::DESKTOP, $viewport->value() );
		$this->assertEquals( 'desktop', (string) $viewport );
	}

	/**
	 * Test mobile viewport creation.
	 */
	public function testMobileViewport(): void {
		$viewport = Viewport::mobile();

		$this->assertInstanceOf( Viewport::class, $viewport );
		$this->assertEquals( Viewport::MOBILE, $viewport->value() );
		$this->assertEquals( 'mobile', (string) $viewport );
	}

	/**
	 * Test current viewport creation for mobile.
	 */
	public function testCurrentViewportForMobile(): void {
		$viewport = Viewport::current( true );

		$this->assertInstanceOf( Viewport::class, $viewport );
		$this->assertEquals( Viewport::MOBILE, $viewport->value() );
		$this->assertTrue( $viewport->equals( Viewport::mobile() ) );
	}

	/**
	 * Test current viewport creation for desktop.
	 */
	public function testCurrentViewportForDesktop(): void {
		$viewport = Viewport::current( false );

		$this->assertInstanceOf( Viewport::class, $viewport );
		$this->assertEquals( Viewport::DESKTOP, $viewport->value() );
		$this->assertTrue( $viewport->equals( Viewport::desktop() ) );
	}

	/**
	 * Test equals method with same viewport.
	 */
	public function testEqualsWithSameViewport(): void {
		$viewport1 = Viewport::desktop();
		$viewport2 = Viewport::desktop();

		$this->assertTrue( $viewport1->equals( $viewport2 ) );
		$this->assertTrue( $viewport2->equals( $viewport1 ) );
	}

	/**
	 * Test equals method with different viewports.
	 */
	public function testEqualsWithDifferentViewports(): void {
		$desktop = Viewport::desktop();
		$mobile  = Viewport::mobile();

		$this->assertFalse( $desktop->equals( $mobile ) );
		$this->assertFalse( $mobile->equals( $desktop ) );
	}

	/**
	 * Test value method returns correct string.
	 */
	public function testValueMethodReturnsCorrectString(): void {
		$desktop = Viewport::desktop();
		$mobile  = Viewport::mobile();

		$this->assertEquals( 'desktop', $desktop->value() );
		$this->assertEquals( 'mobile', $mobile->value() );
	}

	/**
	 * Test string conversion.
	 */
	public function testStringConversion(): void {
		$desktop = Viewport::desktop();
		$mobile  = Viewport::mobile();

		$this->assertEquals( 'desktop', (string) $desktop );
		$this->assertEquals( 'mobile', (string) $mobile );
	}

	/**
	 * Test constants are accessible.
	 */
	public function testConstantsAreAccessible(): void {
		$this->assertEquals( 'desktop', Viewport::DESKTOP );
		$this->assertEquals( 'mobile', Viewport::MOBILE );
	}

	/**
	 * Test that viewport instances are immutable.
	 */
	public function testViewportInstancesAreImmutable(): void {
		$viewport       = Viewport::desktop();
		$original_value = $viewport->value();

		// Verify the value doesn't change
		$this->assertEquals( $original_value, $viewport->value() );
		$this->assertEquals( $original_value, (string) $viewport );
	}
}
