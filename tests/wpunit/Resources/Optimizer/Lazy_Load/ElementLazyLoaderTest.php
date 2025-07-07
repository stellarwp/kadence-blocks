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

		$this->store       = $this->container->get( Store::class );
		$this->lazy_loader = $this->container->get( Element_Lazy_Loader::class );

		// Set up global $post for testing.
		global $post;
		$post = get_post( $this->post_id );
	}

	protected function tearDown(): void {
		$this->lazy_loader->flush();
		$this->store->delete( $this->post_id );

		// Clean up global $post.
		global $post;
		$post = null;

		parent::tearDown();
	}

	public function testItReturnsOriginalArgsWhenNoGlobalPost(): void {
		global $post;
		$post = null;

		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoUniqueId(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [];

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenUniqueIdIsFalse(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => false,
		];

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenUniqueIdIsEmpty(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => '',
		];

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoAnalysisData(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoSections(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalWithZeroHeightSection(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis( [ 'test-unique-id' ], false, [], false, 0 );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenAllSectionsAreAboveTheFold(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis( [ 'test-unique-id' ], true );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenUniqueIdNotInSectionClassName(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'different-unique-id',
		];

		$this->createTestAnalysis( [ 'test-unique-id' ] );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItAddsContentVisibilityStyleForDesktopSection(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis( [ 'test-unique-id' ] );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsContentVisibilityStyleForMobileSection(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis( [], false, [ 'test-unique-id' ] );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( true );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItPreservesExistingStyleWhenAddingContentVisibility(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'background-color: red;',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis( [ 'test-unique-id' ], false );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;background-color: red;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMultipleSectionsWithDifferentUniqueIds(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'second-unique-id',
		];

		$this->createTestAnalysis( [ 'first-unique-id', 'second-unique-id' ] );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesEmptySectionsArray(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis( [], false );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItHandlesCaseSensitiveUniqueIdMatching(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'TEST-UNIQUE-ID',
		];

		$this->createTestAnalysis( [ 'test-unique-id' ], false );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItHandlesSpecialCharactersInUniqueId(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id with spaces',
		];

		$this->createTestAnalysis( [ 'test-unique-id with spaces' ], false );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesUnicodeCharactersInUniqueId(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id-🚀',
		];

		$this->createTestAnalysis( [ 'test-unique-id-🚀' ], false );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 500px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesDifferentSectionHeights(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		$this->createTestAnalysis( [ 'test-unique-id' ], false, [], false, 750.5 );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 750.5px;',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMixedAboveAndBelowFoldSections(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'uniqueID' => 'test-unique-id',
		];

		// Create analysis with both above and below fold sections.
		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => [
					[
						'id'            => 'section1',
						'height'        => 500,
						'tagName'       => 'div',
						'className'     => 'kb-row-layout-wrap kb-row-layout-test-unique-id',
						'path'          => 'test-path-1',
						'isAboveFold'   => true,
						'hasImages'     => false,
						'hasBackground' => false,
					],
					[
						'id'            => 'section2',
						'height'        => 300,
						'tagName'       => 'div',
						'className'     => 'kb-row-layout-wrap kb-row-layout-test-unique-id',
						'path'          => 'test-path-2',
						'isAboveFold'   => false,
						'hasImages'     => false,
						'hasBackground' => false,
					],
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
				'lastModified' => new DateTimeImmutable( 'now', new DateTimeZone( 'UTC' ) ),
				'desktop'      => $desktop->toArray(),
				'mobile'       => $mobile->toArray(),
				'images'       => [],
			]
		);

		$this->store->set( $this->post_id, $analysis );

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		// Should apply the below fold section's height.
		$expected = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
			'style' => 'content-visibility: auto;contain-intrinsic-size: auto 300px;',
		];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Create a test WebsiteAnalysis object.
	 *
	 * @param string[] $desktop_unique_ids Desktop section unique IDs.
	 * @param bool     $desktop_above_fold Whether desktop sections are above fold.
	 * @param string[] $mobile_unique_ids  Mobile section unique IDs.
	 * @param bool     $mobile_above_fold  Whether mobile sections are above fold.
	 * @param float    $height             Section height.
	 */
	private function createTestAnalysis(
		array $desktop_unique_ids = [],
		bool $desktop_above_fold = false,
		array $mobile_unique_ids = [],
		bool $mobile_above_fold = false,
		float $height = 500.0
	): void {
		$desktop_sections = [];
		foreach ( $desktop_unique_ids as $unique_id ) {
			$desktop_sections[] = [
				'id'            => 'section-' . $unique_id,
				'height'        => $height,
				'tagName'       => 'div',
				'className'     => "kb-row-layout-wrap kb-row-layout-id{$unique_id} alignfull has-theme-palette9-background-color kt-row-has-bg wp-block-kadence-rowlayout",
				'path'          => "test-path-{$unique_id}",
				'isAboveFold'   => $desktop_above_fold,
				'hasImages'     => false,
				'hasBackground' => false,
			];
		}

		$mobile_sections = [];
		foreach ( $mobile_unique_ids as $unique_id ) {
			$mobile_sections[] = [
				'id'            => 'section-' . $unique_id,
				'height'        => $height,
				'tagName'       => 'div',
				'className'     => "kb-row-layout-wrap kb-row-layout-id{$unique_id} alignfull has-theme-palette9-background-color kt-row-has-bg wp-block-kadence-rowlayout",
				'path'          => "test-path-{$unique_id}",
				'isAboveFold'   => $mobile_above_fold,
				'hasImages'     => false,
				'hasBackground' => false,
			];
		}

		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => $desktop_sections,
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => [],
				'sections'         => $mobile_sections,
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
