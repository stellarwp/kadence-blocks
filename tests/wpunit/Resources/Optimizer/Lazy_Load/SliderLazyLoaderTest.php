<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Slider_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\DeviceAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;
use Brain\Monkey;

final class SliderLazyLoaderTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Store $store;
	private Slider_Lazy_Loader $lazy_loader;
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

		$post_path = $this->get_post_path( $post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );

		$_SERVER['REQUEST_URI'] = '/test-post/';

		$this->store = $this->container->get( Store::class );

		// Create the registry for desktop testing.
		$path_factory   = $this->container->get( Path_Factory::class );
		$this->registry = new Analysis_Registry( $this->store, $path_factory, false );

		// Create a custom lazy loader with our test registry.
		$this->lazy_loader = new Slider_Lazy_Loader( $this->registry );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );

		$this->registry->flush();

		unset( $_SERVER['REQUEST_URI'] );

		parent::tearDown();
	}

	public function testItReturnsOriginalArgsWhenNoOptimizationForRowSlider(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image2.jpg' ],
			],
		];

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItAddsLazyLoadingClassWhenNoBackgroundSlider(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingClassWhenBackgroundSliderIsEmpty(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingClassWhenBackgroundSliderIsNull(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => null,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItReturnsOriginalArgsWhenAllSliderImagesAreAboveTheFold(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image2.jpg' ],
			],
		];

		$this->createTestAnalysis(
			[
				'http://wordpress.test/image1.jpg',
				'http://wordpress.test/image2.jpg',
			]
		);

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenAnySliderImageIsAboveTheFold(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image2.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image3.jpg' ],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image2.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItAddsLazyLoadingClassWhenNoSliderImagesAreAboveTheFold(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image2.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingClassWhenNoClassExists(): void {
		$args = [
			'id' => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingClassWhenClassIsEmpty(): void {
		$args = [
			'class' => '',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingClassWhenClassHasWhitespace(): void {
		$args = [
			'class' => '   kb-row-slider   ',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider    kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItPreservesOtherAttributesWhenAddingLazyLoadingClass(): void {
		$args = [
			'class'     => 'kb-row-slider',
			'id'        => 'test-slider',
			'style'     => 'height: 500px;',
			'data-test' => 'value',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class'     => 'kb-row-slider kb-lazy-bg-pending',
			'id'        => 'test-slider',
			'style'     => 'height: 500px;',
			'data-test' => 'value',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesSliderWithEmptyBgImg(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => '' ],
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesSliderWithMissingBgImg(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'otherAttr' => 'value' ],
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesSliderWithNullBgImg(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => null ],
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesCaseSensitiveSliderImageMatching(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/IMAGE.jpg' ],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesSpecialCharactersInSliderImageUrl(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image with spaces.jpg' ],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image with spaces.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		// Should not add lazy loading class since the image is in the above-the-fold list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesUnicodeCharactersInSliderImageUrl(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/🚀-image.jpg' ],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/🚀-image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		// Should not add lazy loading class since the image is in the above-the-fold list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesMultipleSliderImagesWithMixedAboveTheFoldStatus(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image2.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image3.jpg' ],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image2.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		// Should not add lazy loading class since one image is above the fold.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesEmptyBackgroundImagesArrayForRowSlider(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
				[ 'bgImg' => 'http://wordpress.test/image2.jpg' ],
			],
		];

		$this->createTestAnalysis( [] );

		$result = $this->lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMobileAnalysisForRowSlider(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis( [], [ 'http://wordpress.test/image1.jpg' ] );

		// Create mobile registry and lazy loader for this test.
		$path_factory       = $this->container->get( Path_Factory::class );
		$mobile_registry    = new Analysis_Registry( $this->store, $path_factory, true );
		$mobile_lazy_loader = new Slider_Lazy_Loader( $mobile_registry );

		$result = $mobile_lazy_loader->lazy_load_row_slider( $args, $attributes );

		// Should not add lazy loading class since the image is above the fold on mobile.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesMobileAnalysisForRowSliderWithLazyLoading(): void {
		$args = [
			'class' => 'kb-row-slider',
			'id'    => 'test-slider',
		];

		$attributes = [
			'backgroundSlider' => [
				[ 'bgImg' => 'http://wordpress.test/image1.jpg' ],
			],
		];

		$this->createTestAnalysis( [], [] );

		// Create mobile registry and lazy loader for this test.
		$path_factory       = $this->container->get( Path_Factory::class );
		$mobile_registry    = new Analysis_Registry( $this->store, $path_factory, true );
		$mobile_lazy_loader = new Slider_Lazy_Loader( $mobile_registry );

		$result = $mobile_lazy_loader->lazy_load_row_slider( $args, $attributes );

		$expected = [
			'class' => 'kb-row-slider kb-lazy-bg-pending',
			'id'    => 'test-slider',
		];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Create a test WebsiteAnalysis object.
	 *
	 * @param string[] $desktop_background_images Desktop background images.
	 * @param string[] $mobile_background_images Mobile background images.
	 */
	private function createTestAnalysis(
		array $desktop_background_images = [],
		array $mobile_background_images = []
	): void {
		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => $desktop_background_images,
				'sections'         => [],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => $mobile_background_images,
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
