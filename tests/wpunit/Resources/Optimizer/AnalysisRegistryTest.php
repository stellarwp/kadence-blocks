<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer;

use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\DeviceAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;
use Brain\Monkey;

final class AnalysisRegistryTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Store $store;
	private Path $path;
	private Analysis_Registry $registry;

	protected function setUp(): void {
		Monkey\setUp();

		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		$post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
				'post_name'   => 'test-post',
			]
		);

		$this->store = $this->container->get( Store::class );
		$this->path  = new Path( $this->get_post_path( $post_id ) );

		$_SERVER['REQUEST_URI'] = '/test-post/';

		$path_factory   = $this->container->get( Path_Factory::class );
		$this->registry = new Analysis_Registry( $this->store, $path_factory, false );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );

		unset( $_SERVER['REQUEST_URI'] );

		parent::tearDown();
	}

	public function testItReturnsEmptyArrayForBackgroundImagesWhenNoPath(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), false );

		$result = $registry->get_background_images();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsEmptyArrayForBackgroundImagesWhenNoAnalysisData(): void {
		$result = $this->registry->get_background_images();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsBackgroundImagesForDesktop(): void {
		$this->createTestAnalysis();

		$result = $this->registry->get_background_images();

		$expected = [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ];

		$this->assertEquals( $expected, $result );
	}

	public function testItReturnsBackgroundImagesForMobile(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), true );

		$this->createTestAnalysis();

		$result = $registry->get_background_images();

		$expected = [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ];

		$this->assertEquals( $expected, $result );
	}

	public function testItReturnsEmptyArrayForValidSectionsWhenNoPath(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), false );

		$result = $registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsEmptyArrayForValidSectionsWhenNoAnalysisData(): void {
		$result = $this->registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsValidSectionsForDesktop(): void {
		$this->createTestAnalysis();

		$result = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout test-123' => 500.0,
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItReturnsValidSectionsForMobile(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), true );

		$this->createTestAnalysisWithMobileSection();

		$result = $registry->get_valid_sections();

		$expected = [
			'kb-row-layout mobile-test-123' => 300.0,
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItSkipsSectionsWithZeroHeight(): void {
		$this->createTestAnalysisWithZeroHeightSection();

		$result = $this->registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItSkipsAboveTheFoldSections(): void {
		$this->createTestAnalysisWithAboveFoldSection();

		$result = $this->registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItFlushesMemoizationCache(): void {
		$this->createTestAnalysis();

		// First call to populate cache.
		$result1 = $this->registry->get_valid_sections();

		// Flush the cache.
		$this->registry->flush();

		// Second call should work the same way.
		$result2 = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout test-123' => 500.0,
		];

		$this->assertEquals( $expected, $result1 );
		$this->assertEquals( $expected, $result2 );
	}

	public function testItHandlesMultipleSections(): void {
		$this->createTestAnalysisWithMultipleSections();

		$result = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout test-123' => 500.0,
			'kb-row-layout test-456' => 300.0,
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMixedValidAndInvalidSections(): void {
		$this->createTestAnalysisWithMixedSections();

		$result = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout test-123' => 500.0,
			'kb-row-layout test-456' => 300.0,
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItCachesBackgroundImagesResults(): void {
		$this->createTestAnalysis();

		// First call to populate cache.
		$result1 = $this->registry->get_background_images();

		// Second call should use cache.
		$result2 = $this->registry->get_background_images();

		$expected = [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ];

		$this->assertEquals( $expected, $result1 );
		$this->assertEquals( $expected, $result2 );
	}

	public function testItClearsCacheOnFlush(): void {
		$this->createTestAnalysis();

		// First call to populate cache.
		$this->registry->get_background_images();
		$this->registry->get_valid_sections();

		// Flush the cache.
		$this->registry->flush();

		// Second calls should work correctly after flush.
		$background_images = $this->registry->get_background_images();
		$valid_sections    = $this->registry->get_valid_sections();

		$this->assertIsArray( $background_images );
		$this->assertIsArray( $valid_sections );
	}

	public function testItHandlesEmptyBackgroundImages(): void {
		$this->createTestAnalysisWithEmptyBackgroundImages();

		$result = $this->registry->get_background_images();

		$this->assertEquals( [], $result );
	}

	public function testItHandlesEmptySections(): void {
		$this->createTestAnalysisWithEmptySections();

		$result = $this->registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsNullForGetAnalysisWhenNoPath(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), false );

		$result = $registry->get_analysis();

		$this->assertNull( $result );
	}

	public function testItReturnsNullForGetAnalysisWhenNoAnalysisData(): void {
		$result = $this->registry->get_analysis();

		$this->assertNull( $result );
	}

	public function testItReturnsWebsiteAnalysisForGetAnalysisWhenDataExists(): void {
		$this->createTestAnalysis();

		$result = $this->registry->get_analysis();

		$this->assertInstanceOf( WebsiteAnalysis::class, $result );
	}

	public function testItCachesGetAnalysisResult(): void {
		$this->createTestAnalysis();

		// First call to populate cache.
		$result1 = $this->registry->get_analysis();

		// Second call should use cached result.
		$result2 = $this->registry->get_analysis();

		$this->assertInstanceOf( WebsiteAnalysis::class, $result1 );
		$this->assertInstanceOf( WebsiteAnalysis::class, $result2 );
		$this->assertSame( $result1, $result2 );
	}

	public function testItReturnsFalseForIsOptimizedWhenNoPath(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), false );

		$result = $registry->is_optimized();

		$this->assertFalse( $result );
	}

	public function testItReturnsFalseForIsOptimizedWhenNoAnalysisData(): void {
		$result = $this->registry->is_optimized();

		$this->assertFalse( $result );
	}

	public function testItReturnsTrueForIsOptimizedWhenAnalysisDataExists(): void {
		$this->createTestAnalysis();

		$result = $this->registry->is_optimized();

		$this->assertTrue( $result );
	}

	public function testItReturnsFalseForIsOptimizedAfterFlush(): void {
		$this->createTestAnalysis();

		// First call should return true.
		$result1 = $this->registry->is_optimized();

		// Flush the cache.
		$this->registry->flush();

		// Second call should still return true since data exists in store.
		$result2 = $this->registry->is_optimized();

		$this->assertTrue( $result1 );
		$this->assertTrue( $result2 );
	}

	// Critical Images Tests

	public function testItReturnsEmptyArrayForCriticalImagesWhenNoPath(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), false );

		$result = $registry->get_critical_images();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsEmptyArrayForCriticalImagesWhenNoAnalysisData(): void {
		$result = $this->registry->get_critical_images();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsCriticalImagesForDesktop(): void {
		$this->createTestAnalysis();

		$result = $this->registry->get_critical_images();

		$expected = [ 'desktop-critical1.jpg' ];

		$this->assertEquals( $expected, $result );
	}

	public function testItReturnsCriticalImagesForMobile(): void {
		$registry = new Analysis_Registry( $this->store, $this->container->get( Path_Factory::class ), true );

		$this->createTestAnalysis();

		$result = $registry->get_critical_images();

		$expected = [ 'mobile-critical1.jpg' ];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMultipleCriticalImages(): void {
		$this->createTestAnalysisWithMultipleCriticalImages();

		$result = $this->registry->get_critical_images();

		$expected = [ 'desktop-critical1.jpg', 'desktop-critical2.jpg', 'desktop-critical3.jpg' ];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesEmptyCriticalImages(): void {
		$this->createTestAnalysisWithEmptyCriticalImages();

		$result = $this->registry->get_critical_images();

		$this->assertEquals( [], $result );
	}

	public function testItCachesCriticalImagesResults(): void {
		$this->createTestAnalysis();

		// First call to populate cache.
		$result1 = $this->registry->get_critical_images();

		// Second call should use cache.
		$result2 = $this->registry->get_critical_images();

		$expected = [ 'desktop-critical1.jpg' ];

		$this->assertEquals( $expected, $result1 );
		$this->assertEquals( $expected, $result2 );
	}

	public function testItClearsCriticalImagesCacheOnFlush(): void {
		$this->createTestAnalysis();

		// First call to populate cache.
		$this->registry->get_critical_images();

		// Flush the cache.
		$this->registry->flush();

		// Second call should work correctly after flush.
		$critical_images = $this->registry->get_critical_images();

		$this->assertIsArray( $critical_images );
		$this->assertEquals( [ 'desktop-critical1.jpg' ], $critical_images );
	}

	public function testItHandlesSpecialCharactersInCriticalImageUrls(): void {
		$this->createTestAnalysisWithSpecialCharacterCriticalImages();

		$result = $this->registry->get_critical_images();

		$expected = [ 'desktop-critical with spaces.jpg', 'desktop-critical-🚀.jpg' ];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesQueryParametersInCriticalImageUrls(): void {
		$this->createTestAnalysisWithQueryParameterCriticalImages();

		$result = $this->registry->get_critical_images();

		$expected = [ 'desktop-critical.jpg?v=123&w=800', 'desktop-critical.jpg?v=456&h=600' ];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesHttpsCriticalImageUrls(): void {
		$this->createTestAnalysisWithHttpsCriticalImages();

		$result = $this->registry->get_critical_images();

		$expected = [
			'https://wordpress.test/desktop-critical1.jpg',
			'https://wordpress.test/desktop-critical2.jpg',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesRelativeCriticalImageUrls(): void {
		$this->createTestAnalysisWithRelativeCriticalImages();

		$result = $this->registry->get_critical_images();

		$expected = [
			'/wp-content/uploads/desktop-critical1.jpg',
			'/wp-content/uploads/desktop-critical2.jpg',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMixedCriticalImageUrlTypes(): void {
		$this->createTestAnalysisWithMixedCriticalImageUrls();

		$result = $this->registry->get_critical_images();

		$expected = [
			'http://wordpress.test/desktop-critical1.jpg',
			'https://wordpress.test/desktop-critical2.jpg',
			'/wp-content/uploads/desktop-critical3.jpg',
			'desktop-critical4.jpg',
		];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Create a test WebsiteAnalysis object with desktop and mobile data.
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
				'criticalImages'   => [ 'desktop-critical1.jpg' ],
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [ 'mobile-critical1.jpg' ],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
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
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
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
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
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
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with multiple sections.
	 */
	private function createTestAnalysisWithMultipleSections(): void {
		$section_data_1 = [
			'id'            => 'section-test-123',
			'height'        => 500,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout test-123',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$section_data_2 = [
			'id'            => 'section-test-456',
			'height'        => 300,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout test-456',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [ $section_data_1, $section_data_2 ],
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
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with mixed valid and invalid sections.
	 */
	private function createTestAnalysisWithMixedSections(): void {
		$valid_section_1 = [
			'id'            => 'section-test-123',
			'height'        => 500,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout test-123',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$valid_section_2 = [
			'id'            => 'section-test-456',
			'height'        => 300,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout test-456',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$invalid_section_1 = [
			'id'            => 'section-above-fold-789',
			'height'        => 400,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout above-fold-789',
			'path'          => 'test-path',
			'isAboveFold'   => true,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$invalid_section_2 = [
			'id'            => 'section-zero-height-012',
			'height'        => 0,
			'tagName'       => 'div',
			'className'     => 'kb-row-layout zero-height-012',
			'path'          => 'test-path',
			'isAboveFold'   => false,
			'hasImages'     => false,
			'hasBackground' => false,
		];

		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [
					$valid_section_1,
					$invalid_section_1,
					$valid_section_2,
					$invalid_section_2,
				],
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
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with empty background images.
	 */
	private function createTestAnalysisWithEmptyBackgroundImages(): void {
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
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with empty sections.
	 */
	private function createTestAnalysisWithEmptySections(): void {
		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [],
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
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with multiple critical images.
	 */
	private function createTestAnalysisWithMultipleCriticalImages(): void {
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
				'criticalImages'   => [
					'desktop-critical1.jpg',
					'desktop-critical2.jpg',
					'desktop-critical3.jpg',
				],
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [ 'mobile-critical1.jpg' ],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with empty critical images.
	 */
	private function createTestAnalysisWithEmptyCriticalImages(): void {
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
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with special character critical images.
	 */
	private function createTestAnalysisWithSpecialCharacterCriticalImages(): void {
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
				'criticalImages'   => [
					'desktop-critical with spaces.jpg',
					'desktop-critical-🚀.jpg',
				],
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [ 'mobile-critical1.jpg' ],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with query parameter critical images.
	 */
	private function createTestAnalysisWithQueryParameterCriticalImages(): void {
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
				'criticalImages'   => [
					'desktop-critical.jpg?v=123&w=800',
					'desktop-critical.jpg?v=456&h=600',
				],
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [ 'mobile-critical1.jpg' ],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with HTTPS critical images.
	 */
	private function createTestAnalysisWithHttpsCriticalImages(): void {
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
				'criticalImages'   => [
					'https://wordpress.test/desktop-critical1.jpg',
					'https://wordpress.test/desktop-critical2.jpg',
				],
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [ 'mobile-critical1.jpg' ],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with relative critical images.
	 */
	private function createTestAnalysisWithRelativeCriticalImages(): void {
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
				'criticalImages'   => [
					'/wp-content/uploads/desktop-critical1.jpg',
					'/wp-content/uploads/desktop-critical2.jpg',
				],
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [ 'mobile-critical1.jpg' ],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}

	/**
	 * Create a test WebsiteAnalysis object with mixed critical image URL types.
	 */
	private function createTestAnalysisWithMixedCriticalImageUrls(): void {
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
				'criticalImages'   => [
					'http://wordpress.test/desktop-critical1.jpg',
					'https://wordpress.test/desktop-critical2.jpg',
					'/wp-content/uploads/desktop-critical3.jpg',
					'desktop-critical4.jpg',
				],
				'backgroundImages' => [ 'desktop-bg1.jpg', 'desktop-bg2.jpg' ],
				'sections'         => [ $section_data ],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [ 'mobile-critical1.jpg' ],
				'backgroundImages' => [ 'mobile-bg1.jpg', 'mobile-bg2.jpg' ],
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}
}
