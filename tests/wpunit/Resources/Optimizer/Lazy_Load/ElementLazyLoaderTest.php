<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Element_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections\Lazy_Render_Decider;
use Tests\Support\Classes\TestCase;
use Brain\Monkey;

final class ElementLazyLoaderTest extends TestCase {

	private Lazy_Render_Decider $decider;

	protected function setUp(): void {
		Monkey\setUp();

		parent::setUp();

		$this->decider = $this->createMock( Lazy_Render_Decider::class );
	}

	public function testItReturnsOriginalArgsWhenNoUniqueId(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [];

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenUniqueIdIsFalse(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => false,
		];

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenDeciderReturnsFalse(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => 'kb-row-layout kt-jarallax',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->decider->expects( $this->once() )
						->method( 'should_lazy_render' )
						->with( [ 'kb-row-layout', 'kt-jarallax' ] )
						->willReturn( false );

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenHeightIsZero(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->decider->expects( $this->once() )
						->method( 'should_lazy_render' )
						->with( [ 'kb-row-layout' ] )
						->willReturn( true );

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_unique_id' )
						->with( 'test-123' )
						->willReturn( 0.0 );

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItAddsContentVisibilityStyleForValidSection(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->decider->expects( $this->once() )
						->method( 'should_lazy_render' )
						->with( [ 'kb-row-layout' ] )
						->willReturn( true );

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_unique_id' )
						->with( 'test-123' )
						->willReturn( 500.0 );

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsContentVisibilityStyleForValidSectionWithExistingStyle(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'background-color: red;',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->decider->expects( $this->once() )
						->method( 'should_lazy_render' )
						->with( [ 'kb-row-layout' ] )
						->willReturn( true );

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_unique_id' )
						->with( 'test-123' )
						->willReturn( 500.0 );

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;background-color: red;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesEmptyClassString(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => '',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->decider->expects( $this->once() )
						->method( 'should_lazy_render' )
						->with( [] )
						->willReturn( true );

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_unique_id' )
						->with( 'test-123' )
						->willReturn( 500.0 );

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$expected = [
			'class' => '',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesFalseClassValue(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => false,
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->decider->expects( $this->once() )
						->method( 'should_lazy_render' )
						->with( [] )
						->willReturn( true );

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_unique_id' )
						->with( 'test-123' )
						->willReturn( 500.0 );

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$expected = [
			'class' => false,
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMultipleSpacesBetweenClasses(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$args = [
			'class' => 'kb-row-layout    kt-jarallax    kb-row-layout-123',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->decider->expects( $this->once() )
						->method( 'should_lazy_render' )
						->with( [ 'kb-row-layout', 'kt-jarallax', 'kb-row-layout-123' ] )
						->willReturn( false );

		$result = $lazy_loader->set_content_visibility_for_row( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalColumnHtmlWhenNoKadenceColumnClass(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$html = '<div class="some-other-class">Column content</div>';

		$result = $lazy_loader->modify_column_html( $html );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalColumnHtmlWhenNoClassAttribute(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$html = '<div>Column content</div>';

		$result = $lazy_loader->modify_column_html( $html );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalColumnHtmlWhenHeightIsZero(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$html = '<div class="wp-block-kadence-column kb-column-test-123">Column content</div>';

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_class_attr' )
						->with( 'wp-block-kadence-column kb-column-test-123' )
						->willReturn( 0.0 );

		$result = $lazy_loader->modify_column_html( $html );

		$this->assertEquals( $html, $result );
	}

	public function testItAddsContentVisibilityStyleToColumnWithMatchingClass(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$html = '<div class="wp-block-kadence-column kb-column-test-123">Column content</div>';

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_class_attr' )
						->with( 'wp-block-kadence-column kb-column-test-123' )
						->willReturn( 400.0 );

		$result = $lazy_loader->modify_column_html( $html );

		$expected = '<div style="content-visibility: auto;contain-intrinsic-size: auto 400px;" class="wp-block-kadence-column kb-column-test-123">Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsContentVisibilityStyleToColumnWithExistingStyle(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$html = '<div class="wp-block-kadence-column kb-column-test-123" style="background-color: blue;">Column content</div>';

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_class_attr' )
						->with( 'wp-block-kadence-column kb-column-test-123' )
						->willReturn( 400.0 );

		$result = $lazy_loader->modify_column_html( $html );

		$expected = '<div class="wp-block-kadence-column kb-column-test-123" style="content-visibility: auto;contain-intrinsic-size: auto 400px;background-color: blue;">Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesComplexColumnHtmlStructure(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->decider );

		$html = '<div class="wp-block-kadence-column kb-column-test-123" data-test="value">
			<div class="inner-content">
				<p>Some content</p>
			</div>
		</div>';

		$this->decider->expects( $this->once() )
						->method( 'get_section_height_by_class_attr' )
						->with( 'wp-block-kadence-column kb-column-test-123' )
						->willReturn( 400.0 );

		$result = $lazy_loader->modify_column_html( $html );

		$expected = '<div style="content-visibility: auto;contain-intrinsic-size: auto 400px;" class="wp-block-kadence-column kb-column-test-123" data-test="value">
			<div class="inner-content">
				<p>Some content</p>
			</div>
		</div>';

		$this->assertEquals( $expected, $result );
	}
}
