<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load\Sections;

use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Sections\Section_Registry;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\DeviceAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\TestCase;
use Brain\Monkey;

final class SectionRegistryTest extends TestCase {

	use Permalink_Trait;

	private Store $store;
	private Path $path;
	private Section_Registry $registry;

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
		$this->registry = new Section_Registry( $this->store, $path_factory );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );

		unset( $_SERVER['REQUEST_URI'] );

		parent::tearDown();
	}

	public function testItReturnsEmptyArrayWhenNoPath(): void {
		$registry = new Section_Registry( $this->store, $this->container->get( Path_Factory::class ) );

		$result = $registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsEmptyArrayWhenNoAnalysisData(): void {
		$result = $this->registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItReturnsValidSectionsForDesktop(): void {
		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout test-123' => 500.0,
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItReturnsValidSectionsForMobile(): void {
		$this->createTestAnalysisWithMobileSection();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( true );

		$result = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout mobile-test-123' => 300.0,
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItSkipsSectionsWithZeroHeight(): void {
		$this->createTestAnalysisWithZeroHeightSection();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItSkipsAboveTheFoldSections(): void {
		$this->createTestAnalysisWithAboveFoldSection();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->registry->get_valid_sections();

		$this->assertEquals( [], $result );
	}

	public function testItFlushesMemoizationCache(): void {
		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout test-123' => 500.0,
			'kb-row-layout test-456' => 300.0,
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMixedValidAndInvalidSections(): void {
		$this->createTestAnalysisWithMixedSections();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->registry->get_valid_sections();

		$expected = [
			'kb-row-layout test-123' => 500.0,
			'kb-row-layout test-456' => 300.0,
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
}
