<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Video_Poster_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\DeviceAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\TestCase;
use Brain\Monkey;

final class VideoPosterLazyLoaderTest extends TestCase {

	use Permalink_Trait;

	private Store $store;
	private Video_Poster_Lazy_Loader $lazy_loader;
	private Path $path;
	private Analysis_Registry $registry;
	private Asset $asset;

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
		$this->asset = $this->container->get( Asset::class );

		// Create the registry for desktop testing.
		$path_factory   = $this->container->get( Path_Factory::class );
		$this->registry = new Analysis_Registry( $this->store, $path_factory, false );

		// Create a custom lazy loader with our test registry.
		$this->lazy_loader = new Video_Poster_Lazy_Loader( $this->asset, $this->registry );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );

		$this->registry->flush();

		unset( $_SERVER['REQUEST_URI'] );

		parent::tearDown();
	}

	public function testItReturnsOriginalArgsWhenNoPoster(): void {
		$args = [
			'src' => 'http://wordpress.test/video.mp4',
			'id'  => 'test-video',
		];

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenPosterIsEmpty(): void {
		$args = [
			'poster' => '',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenPosterIsNull(): void {
		$args = [
			'poster' => null,
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoOptimization(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenPosterIsAboveTheFold(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/poster.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$this->assertEquals( $args, $result );
	}

	public function testItAddsLazyLoadingAttributesWhenPosterIsNotAboveTheFold(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItPreservesOtherAttributesWhenAddingLazyLoading(): void {
		$args = [
			'poster'    => 'http://wordpress.test/poster.jpg',
			'src'       => 'http://wordpress.test/video.mp4',
			'id'        => 'test-video',
			'controls'  => 'controls',
			'autoplay'  => 'autoplay',
			'data-test' => 'value',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'controls'                  => 'controls',
			'autoplay'                  => 'autoplay',
			'data-test'                 => 'value',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMultipleCriticalImages(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis(
			[
				'http://wordpress.test/other-image.jpg',
				'http://wordpress.test/another-image.jpg',
			] 
		);

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesEmptyCriticalImagesArray(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [] );

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesCaseSensitivePosterMatching(): void {
		$args = [
			'poster' => 'http://wordpress.test/POSTER.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/poster.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/POSTER.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesSpecialCharactersInPosterUrl(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster with spaces.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/poster with spaces.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		// Should not add lazy loading attributes since the poster is in the critical images list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesUnicodeCharactersInPosterUrl(): void {
		$args = [
			'poster' => 'http://wordpress.test/🚀-poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/🚀-poster.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		// Should not add lazy loading attributes since the poster is in the critical images list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesMobileAnalysis(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [], [ 'http://wordpress.test/poster.jpg' ] );

		// Create mobile registry and lazy loader for this test.
		$path_factory       = $this->container->get( Path_Factory::class );
		$mobile_registry    = new Analysis_Registry( $this->store, $path_factory, true );
		$mobile_lazy_loader = new Video_Poster_Lazy_Loader( $this->asset, $mobile_registry );

		$result = $mobile_lazy_loader->lazy_load_row_video_poster( $args );

		// Should not add lazy loading attributes since the poster is above the fold on mobile.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesMobileAnalysisWithLazyLoading(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [], [] );

		// Create mobile registry and lazy loader for this test.
		$path_factory       = $this->container->get( Path_Factory::class );
		$mobile_registry    = new Analysis_Registry( $this->store, $path_factory, true );
		$mobile_lazy_loader = new Video_Poster_Lazy_Loader( $this->asset, $mobile_registry );

		$result = $mobile_lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesComplexVideoAttributes(): void {
		$args = [
			'poster'      => 'http://wordpress.test/poster.jpg',
			'src'         => 'http://wordpress.test/video.mp4',
			'id'          => 'test-video',
			'width'       => '640',
			'height'      => '360',
			'controls'    => 'controls',
			'preload'     => 'metadata',
			'loop'        => 'loop',
			'muted'       => 'muted',
			'playsinline' => 'playsinline',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'width'                     => '640',
			'height'                    => '360',
			'controls'                  => 'controls',
			'preload'                   => 'metadata',
			'loop'                      => 'loop',
			'muted'                     => 'muted',
			'playsinline'               => 'playsinline',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesPosterWithQueryParameters(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg?v=123&w=800',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/poster.jpg?v=123&w=800' ] );

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		// Should not add lazy loading attributes since the poster is in the critical images list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesPosterWithDifferentQueryParameters(): void {
		$args = [
			'poster' => 'http://wordpress.test/poster.jpg?v=123&w=800',
			'src'    => 'http://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/poster.jpg?v=456&w=600' ] );

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'http://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => 'http://wordpress.test/poster.jpg?v=123&w=800',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesHttpsPosterUrl(): void {
		$args = [
			'poster' => 'https://wordpress.test/poster.jpg',
			'src'    => 'https://wordpress.test/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => 'https://wordpress.test/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => 'https://wordpress.test/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesRelativePosterUrl(): void {
		$args = [
			'poster' => '/wp-content/uploads/poster.jpg',
			'src'    => '/wp-content/uploads/video.mp4',
			'id'     => 'test-video',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_video_poster( $args );

		$expected = [
			'src'                       => '/wp-content/uploads/video.mp4',
			'id'                        => 'test-video',
			'data-kadence-lazy-poster'  => '/wp-content/uploads/poster.jpg',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'poster',
		];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Create a test WebsiteAnalysis object.
	 *
	 * @param string[] $desktop_critical_images Desktop critical images.
	 * @param string[] $mobile_critical_images Mobile critical images.
	 */
	private function createTestAnalysis(
		array $desktop_critical_images = [],
		array $mobile_critical_images = []
	): void {
		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => $desktop_critical_images,
				'backgroundImages' => [],
				'sections'         => [],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => $mobile_critical_images,
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
