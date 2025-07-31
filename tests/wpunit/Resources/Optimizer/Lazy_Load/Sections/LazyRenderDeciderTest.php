<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load\Sections;

use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections\Lazy_Render_Decider;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections\Section_Registry;
use Tests\Support\Classes\TestCase;

final class LazyRenderDeciderTest extends TestCase {

	private Section_Registry $registry;
	private Lazy_Render_Decider $decider;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = $this->createMock( Section_Registry::class );
		$this->decider  = new Lazy_Render_Decider( $this->registry, [] );
	}

	public function testItReturnsTrueWhenNoExcludedClasses(): void {
		$class_list = [ 'kb-row-layout', 'kt-jarallax' ];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertTrue( $result );
	}

	public function testItReturnsFalseWhenExcludedClassIsPresent(): void {
		$this->decider = new Lazy_Render_Decider( $this->registry, [ 'kt-jarallax' ] );

		$class_list = [ 'kb-row-layout', 'kt-jarallax' ];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertFalse( $result );
	}

	public function testItReturnsTrueWhenExcludedClassIsNotPresent(): void {
		$this->decider = new Lazy_Render_Decider( $this->registry, [ 'kt-jarallax' ] );

		$class_list = [ 'kb-row-layout', 'some-other-class' ];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertTrue( $result );
	}

	public function testItReturnsFalseWhenMultipleExcludedClassesArePresent(): void {
		$this->decider = new Lazy_Render_Decider(
			$this->registry,
			[
				'kt-jarallax',
				'no-lazy-load',
			] 
		);

		$class_list = [ 'kb-row-layout', 'no-lazy-load' ];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertFalse( $result );
	}

	public function testItReturnsTrueWhenExcludedClassIsPartOfLargerClassName(): void {
		$this->decider = new Lazy_Render_Decider( $this->registry, [ 'kt-jarallax' ] );

		$class_list = [ 'kb-row-layout', 'my-kt-jarallax-custom' ];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertTrue( $result );
	}

	public function testItReturnsFalseWhenExcludedClassIsCaseSensitive(): void {
		$this->decider = new Lazy_Render_Decider( $this->registry, [ 'kt-jarallax' ] );

		$class_list = [ 'kb-row-layout', 'KT-JARALLAX' ];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertTrue( $result );
	}

	public function testItReturnsTrueWhenExcludedClassIsEmpty(): void {
		$this->decider = new Lazy_Render_Decider( $this->registry, [ '' ] );

		$class_list = [ 'kb-row-layout' ];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertTrue( $result );
	}

	public function testItReturnsTrueWhenClassListIsEmpty(): void {
		$this->decider = new Lazy_Render_Decider( $this->registry, [ 'kt-jarallax' ] );

		$class_list = [];

		$result = $this->decider->should_lazy_render( $class_list );

		$this->assertTrue( $result );
	}

	public function testItGetsSectionHeightByUniqueId(): void {
		$this->registry->expects( $this->once() )
						->method( 'get_valid_sections' )
						->willReturn(
							[
								'kb-row-layout test-123' => 500.0,
								'kb-row-layout test-456' => 300.0,
							] 
						);

		$result = $this->decider->get_section_height_by_unique_id( 'test-123' );

		$this->assertEquals( 500.0, $result );
	}

	public function testItReturnsZeroWhenUniqueIdNotFound(): void {
		$this->registry->expects( $this->once() )
						->method( 'get_valid_sections' )
						->willReturn(
							[
								'kb-row-layout test-123' => 500.0,
							] 
						);

		$result = $this->decider->get_section_height_by_unique_id( 'test-456' );

		$this->assertEquals( 0.0, $result );
	}

	public function testItReturnsZeroWhenNoValidSections(): void {
		$this->registry->expects( $this->once() )
						->method( 'get_valid_sections' )
						->willReturn( [] );

		$result = $this->decider->get_section_height_by_unique_id( 'test-123' );

		$this->assertEquals( 0.0, $result );
	}

	public function testItGetsSectionHeightByClassAttr(): void {
		$this->registry->expects( $this->once() )
						->method( 'get_valid_sections' )
						->willReturn(
							[
								'wp-block-kadence-column kb-column-test-123' => 400.0,
							] 
						);

		$result = $this->decider->get_section_height_by_class_attr( 'wp-block-kadence-column kb-column-test-123' );

		$this->assertEquals( 400.0, $result );
	}

	public function testItReturnsZeroWhenClassAttrNotFound(): void {
		$this->registry->expects( $this->once() )
						->method( 'get_valid_sections' )
						->willReturn(
							[
								'wp-block-kadence-column kb-column-test-123' => 400.0,
							] 
						);

		$result = $this->decider->get_section_height_by_class_attr( 'wp-block-kadence-column kb-column-different' );

		$this->assertEquals( 0.0, $result );
	}

	public function testItReturnsZeroWhenNoValidSectionsForClassAttr(): void {
		$this->registry->expects( $this->once() )
						->method( 'get_valid_sections' )
						->willReturn( [] );

		$result = $this->decider->get_section_height_by_class_attr( 'wp-block-kadence-column kb-column-test-123' );

		$this->assertEquals( 0.0, $result );
	}
}
