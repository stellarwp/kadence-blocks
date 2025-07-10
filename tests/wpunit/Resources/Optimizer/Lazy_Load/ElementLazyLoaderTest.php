<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Element_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Response\DeviceAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use Tests\Support\Classes\TestCase;
use Brain\Monkey;

final class ElementLazyLoaderTest extends TestCase {

	private Store $store;
	private Element_Lazy_Loader $lazy_loader;
	private int $post_id;

	protected function setUp(): void {
		Monkey\setUp();

		parent::setUp();

		$this->post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
			]
		);

		$this->store = $this->container->get( Store::class );

		// Set up global $post for testing.
		global $post;
		$post = get_post( $this->post_id );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->post_id );

		// Clean up global $post.
		global $post;
		$post = null;

		parent::tearDown();
	}

	public function testItReturnsOriginalArgsWhenNoPost(): void {
		global $post;
		$post = null;

		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoUniqueId(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [];

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenUniqueIdIsFalse(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => false,
		];

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoAnalysisData(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItBypassesLazyLoadingWhenExcludedClassIsPresent(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax' ] );

		$args = [
			'class' => 'kb-row-layout kt-jarallax',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItBypassesLazyLoadingWhenExcludedClassIsPresentWithOtherClasses(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax' ] );

		$args = [
			'class' => 'kb-row-layout kt-jarallax kb-row-layout-123',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItBypassesLazyLoadingWhenMultipleExcludedClassesArePresent(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax', 'no-lazy-load' ] );

		$args = [
			'class' => 'kb-row-layout no-lazy-load',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItDoesNotBypassLazyLoadingWhenExcludedClassIsNotPresent(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax' ] );

		$args = [
			'class' => 'kb-row-layout kb-row-layout-123',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout kb-row-layout-123',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItBypassesLazyLoadingWhenExcludedClassIsPartOfLargerClassName(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax' ] );

		$args = [
			'class' => 'kb-row-layout my-kt-jarallax-custom',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		// Should NOT bypass, so style should be added.
		$expected = [
			'class' => 'kb-row-layout my-kt-jarallax-custom',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItBypassesLazyLoadingWhenExcludedClassIsCaseSensitive(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax' ] );

		$args = [
			'class' => 'kb-row-layout KT-JARALLAX',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		// Should not bypass because str_contains is case-sensitive.
		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout KT-JARALLAX',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItBypassesLazyLoadingWhenExcludedClassHasWhitespace(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax' ] );

		$args = [
			'class' => 'kb-row-layout   kt-jarallax   ',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItBypassesLazyLoadingWhenNoClassesAndExcludedClassIsEmpty(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ '' ] );

		$args = [
			'id' => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		// Should NOT bypass, so style should be added.
		$expected = [
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItBypassesLazyLoadingWhenClassesIsFalseAndExcludedClassIsPresent(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [ 'kt-jarallax' ] );

		$args = [
			'class' => false,
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		// When class is false, it becomes an empty string, so no excluded class check applies.
		// The lazy loading should still work normally.
		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => false,
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsContentVisibilityStyleForBelowTheFoldSection(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsContentVisibilityStyleForBelowTheFoldSectionWithExistingStyle(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'background-color: red;',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;background-color: red;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItSkipsAboveTheFoldSections(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'above-fold-123',
		];

		$this->createTestAnalysisWithAboveFoldSection();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItSkipsSectionsWithZeroHeight(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'zero-height-123',
		];

		$this->createTestAnalysisWithZeroHeightSection();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItSkipsSectionsThatDoNotMatchUniqueId(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'non-matching-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItUsesMobileAnalysisWhenOnMobile(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'mobile-test-123',
		];

		$this->createTestAnalysisWithMobileSection();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( true );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 300px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItUsesDesktopAnalysisWhenOnDesktop(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItFlushesMemoizationCache(): void {
		$lazy_loader = new Element_Lazy_Loader( $this->store, [] );

		// First call to populate cache.
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-123',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		// Flush the cache.
		$lazy_loader->flush();

		// Second call should work the same way.
		$result = $lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Create a test WebsiteAnalysis object with a below-the-fold section.
	 */
	private function createTestAnalysis(): void {
		$section_data = [
			'id'            => 'section-test-123',
			'height'        => 500,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout test-123',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'lastModified' => new DateTimeImmutable( 'now', new DateTimeZone( 'UTC' ) ),
				'desktop'      => $desktop->toArray(),
				'mobile'       => $mobile->toArray(),
				'images'       => [],
			]
		);

		$this->store->set( $this->post_id, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with an above-the-fold section.
	 */
	private function createTestAnalysisWithAboveFoldSection(): void {
		$section_data = [
			'id'            => 'section-above-fold-123',
			'height'        => 500,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout above-fold-123',
			'path'          => 'test-path',
			'isAboveFold'   => true,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'lastModified' => new DateTimeImmutable( 'now', new DateTimeZone( 'UTC' ) ),
				'desktop'      => $desktop->toArray(),
				'mobile'       => $mobile->toArray(),
				'images'       => [],
			]
		);

		$this->store->set( $this->post_id, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with a zero-height section.
	 */
	private function createTestAnalysisWithZeroHeightSection(): void {
		$section_data = [
			'id'            => 'section-zero-height-123',
			'height'        => 0,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout zero-height-123',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'lastModified' => new DateTimeImmutable( 'now', new DateTimeZone( 'UTC' ) ),
				'desktop'      => $desktop->toArray(),
				'mobile'       => $mobile->toArray(),
				'images'       => [],
			]
		);

		$this->store->set( $this->post_id, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with a mobile section.
	 */
	private function createTestAnalysisWithMobileSection(): void {
		$desktop_section_data = [
			'id'            => 'section-desktop-test-123',
			'height'        => 500,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout test-123',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$mobile_section_data = [
			'id'            => 'section-mobile-test-123',
			'height'        => 300,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout mobile-test-123',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [ $desktop_section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [ $mobile_section_data ],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'lastModified' => new DateTimeImmutable( 'now', new DateTimeZone( 'UTC' ) ),
				'desktop'      => $desktop->toArray(),
				'mobile'       => $mobile->toArray(),
				'images'       => [],
			]
		);

		$this->store->set( $this->post_id, $analysis );
	}
}
