<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer;

use KadenceWP\KadenceBlocks\Detection\MobileDetect;
use KadenceWP\KadenceBlocks\Optimizer\Device_Resolver;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Support\Classes\OptimizerTestCase;

final class DeviceResolverTest extends OptimizerTestCase {

	/** @var MobileDetect&MockObject */
	private $detect;

	private Device_Resolver $resolver;

	protected function setUp(): void {
		parent::setUp();

		$this->detect   = $this->createMock( MobileDetect::class );
		$this->resolver = new Device_Resolver( $this->detect );
	}

	protected function tearDown(): void {
		unset( $_GET['kadence_is_mobile'] );

		parent::tearDown();
	}

	public function testItReturnsTrueWhenQueryVarKadenceIsMobileIsSet(): void {
		$_GET['kadence_is_mobile'] = '1';

		$this->detect->expects( $this->never() )->method( 'isMobile' );
		$this->detect->expects( $this->never() )->method( 'isTablet' );

		$this->assertTrue( $this->resolver->is_mobile() );
	}

	public function testItReturnsTrueWhenDetectSaysMobileAndNotTablet(): void {
		$this->detect->expects( $this->once() )->method( 'isMobile' )->willReturn( true );
		$this->detect->expects( $this->once() )->method( 'isTablet' )->willReturn( false );

		$this->assertTrue( $this->resolver->is_mobile() );
	}

	public function testItReturnsFalseWhenDetectSaysMobileButIsTablet(): void {
		$this->detect->expects( $this->once() )->method( 'isMobile' )->willReturn( true );
		$this->detect->expects( $this->once() )->method( 'isTablet' )->willReturn( true );

		$this->assertFalse( $this->resolver->is_mobile() );
	}

	public function testItReturnsFalseWhenDetectSaysNotMobile(): void {
		$this->detect->expects( $this->once() )->method( 'isMobile' )->willReturn( false );
		$this->detect->expects( $this->never() )->method( 'isTablet' );

		$this->assertFalse( $this->resolver->is_mobile() );
	}

	public function testItReturnsFalseWhenNoQueryVarAndDetectSaysNotMobile(): void {
		$this->detect->expects( $this->once() )->method( 'isMobile' )->willReturn( false );
		$this->detect->expects( $this->never() )->method( 'isTablet' );

		$this->assertFalse( $this->resolver->is_mobile() );
	}
}
