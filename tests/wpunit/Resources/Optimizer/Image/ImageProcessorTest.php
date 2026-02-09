<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Image;

use KadenceWP\KadenceBlocks\Optimizer\Image\Image_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;

final class ImageProcessorTest extends OptimizerTestCase {

	use Permalink_Trait;

	private int $post_id;
	private Image_Processor $processor;
	private Store $store;
	private Path $path;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		$this->post_id = $this->factory()->post->create(
			[
				'post_title'   => 'Test Post',
				'post_content' => 'Test content',
				'post_status'  => 'publish',
			]
		);

		$post_path = $this->get_post_path( $this->post_id );

		$this->assertNotEmpty( $post_path );

		$this->path      = new Path( $post_path );
		$this->store     = $this->container->get( Store::class );
		$this->processor = $this->container->get( Image_Processor::class );
	}

	protected function tearDown(): void {
		// Clean up test data
		$this->store->delete( $this->path );

		wp_delete_post( $this->post_id, true );
		parent::tearDown();
	}

	public function testItAddsKbOptimizedClassToBody(): void {
		// Create analysis data to enable processing
		$analysis = $this->create_test_analysis();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><img src="test.jpg" alt="Test"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		$this->assertStringContainsString( '<body class="kb-optimized"', $result );
	}

	public function testItProcessesImagesWithLazyLoading(): void {
		// Create analysis data to enable processing.
		$analysis = $this->create_test_analysis_with_srcset();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><img loading="lazy" src="http://wordpress.test/wp-content/uploads/image1.jpg" alt="Above the fold"><img src="http://wordpress.test/wp-content/uploads/image2.jpg" alt="Below the fold"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		$this->assertStringNotContainsString( '<img loading="lazy" src="http://wordpress.test/wp-content/uploads/image1.jpg"', $result );
		$this->assertStringContainsString( '<img loading="lazy" src="http://wordpress.test/wp-content/uploads/image2.jpg"', $result );
	}

	public function testItHandlesMultipleImages(): void {
		// Create analysis data to enable processing.
		$analysis = $this->create_test_analysis();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><img src="test1.jpg" alt="Test 1"><img src="test2.jpg" alt="Test 2"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should have lazy loading on both images.
		$this->assertStringContainsString( '<img loading="lazy" src="test1.jpg', $result );
		$this->assertStringContainsString( '<img loading="lazy" src="test2.jpg', $result );
	}

	public function testItSkipsProcessingWhenNoAnalysis(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="test.jpg" alt="Test"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should return original HTML unchanged when no analysis exists.
		$this->assertEquals( $html, $result );
	}

	public function testItHandlesImagesWithoutSrcsetForSizesProcessor(): void {
		// Create analysis data to enable processing.
		$analysis = $this->create_test_analysis();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><img src="test.jpg" alt="Test"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should still process lazy loading even without srcset, but not sizes.
		$this->assertStringContainsString( '<img loading="lazy" src="test.jpg"', $result );
		$this->assertStringNotContainsString( 'sizes="', $result );
	}

	public function testItProcessesImagesWithSrcset(): void {
		// Create analysis data to enable processing.
		$analysis = $this->create_test_analysis_with_srcset();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><img src="test.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Test"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should have both lazy loading and sizes attribute since current sizes matches analysis sizes.
		$this->assertStringContainsString( 'loading="lazy" src="test.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 480px) 120px, (max-width: 900px) 240px, 240px"', $result );
	}

	public function testItDoesNotUpdateSizesWhenCurrentSizesDoesNotMatchAnalysisSizes(): void {
		// Create analysis data to enable processing.
		$analysis = $this->create_test_analysis_with_srcset_and_different_sizes();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><img src="test.jpg" sizes="(max-width: 600px) 100vw, 300px" srcset="test-300w.jpg 300w, test-600w.jpg 600w" alt="Test"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should have lazy loading but preserve original sizes since current sizes doesn't match analysis sizes.
		// The analysis has sizes="(max-width: 500px) 100vw, 400px" but the HTML has "(max-width: 600px) 100vw, 300px",
		// so they don't match and the processor should preserve the original sizes.
		$this->assertStringContainsString( 'sizes="(max-width: 600px) 100vw, 300px"', $result );
	}

	public function testItUpdatesSizesWhenCurrentSizesMatchesAnalysisSizes(): void {
		// Create analysis data to enable processing.
		$analysis = $this->create_test_analysis_with_srcset_and_matching_sizes();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><img src="test.jpg" sizes="(max-width: 600px) 100vw, 300px" srcset="test-300w.jpg 300w, test-600w.jpg 600w" alt="Test"></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should have lazy loading and updated sizes since current sizes matches analysis sizes.
		$this->assertStringContainsString( 'sizes="(max-width: 480px) 120px, (max-width: 900px) 240px, 240px"', $result );
	}

	public function testItHandlesEmptyHtml(): void {
		$html = '';

		$result = $this->processor->process_images( $html, $this->path );

		$this->assertEquals( '', $result );
	}

	public function testItHandlesHtmlWithoutBody(): void {
		$html = '<!DOCTYPE html><html><head></head></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should return original HTML unchanged.
		$this->assertEquals( $html, $result );
	}

	public function testItHandlesHtmlWithoutImages(): void {
		// Create analysis data to enable processing.
		$analysis = $this->create_test_analysis();
		$this->store->set( $this->path, $analysis );

		$html = '<!DOCTYPE html><html><head></head><body><p>No images here</p></body></html>';

		$result = $this->processor->process_images( $html, $this->path );

		// Should add kb-optimized class but not process any images
		$this->assertStringContainsString( '<body class="kb-optimized"', $result );
		$this->assertStringNotContainsString( 'loading="lazy"', $result );
	}

	/**
	 * Create a test WebsiteAnalysis object.
	 *
	 * @return WebsiteAnalysis
	 */
	private function create_test_analysis(): WebsiteAnalysis {
		return WebsiteAnalysis::from(
			[
				'hash'         => null,
				'lastModified' => 'now',
				'desktop'      => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image1.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg1.jpg' ],
					'sections'         => [
						[
							'id'            => 'section1',
							'height'        => 100.0,
							'tagName'       => 'div',
							'className'     => 'test-class',
							'path'          => 'body > div',
							'isAboveFold'   => true,
							'hasImages'     => true,
							'hasBackground' => false,
						],
					],
				],
				'mobile'       => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image2.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg2.jpg' ],
					'sections'         => [
						[
							'id'            => 'section2',
							'height'        => 200.0,
							'tagName'       => 'div',
							'className'     => 'test-class-mobile',
							'path'          => 'body > div',
							'isAboveFold'   => false,
							'hasImages'     => false,
							'hasBackground' => true,
						],
					],
				],
				'images'       => [
					[
						'path'          => 'body > img',
						'src'           => 'test.jpg',
						'srcset'        => [],
						'width'         => 800,
						'height'        => 600,
						'widthAttr'     => '800',
						'heightAttr'    => '600',
						'naturalWidth'  => 800,
						'naturalHeight' => 600,
						'aspectRatio'   => 1.33,
						'alt'           => 'Test',
						'class'         => '',
						'loading'       => 'lazy',
						'decoding'      => 'async',
						'sizes'         => null,
						'computedStyle' => [
							'width'          => '100%',
							'height'         => 'auto',
							'objectFit'      => 'cover',
							'objectPosition' => 'center',
						],
						'optimalSizes'  => '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px',
					],
				],
			]
		);
	}

	/**
	 * Create a test WebsiteAnalysis object with srcset image data.
	 *
	 * @return WebsiteAnalysis
	 */
	private function create_test_analysis_with_srcset(): WebsiteAnalysis {
		return WebsiteAnalysis::from(
			[
				'hash'         => null,
				'lastModified' => 'now',
				'desktop'      => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image1.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg1.jpg' ],
					'sections'         => [
						[
							'id'            => 'section1',
							'height'        => 100.0,
							'tagName'       => 'div',
							'className'     => 'test-class',
							'path'          => 'body > div',
							'isAboveFold'   => true,
							'hasImages'     => true,
							'hasBackground' => false,
						],
					],
				],
				'mobile'       => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image2.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg2.jpg' ],
					'sections'         => [
						[
							'id'            => 'section2',
							'height'        => 200.0,
							'tagName'       => 'div',
							'className'     => 'test-class-mobile',
							'path'          => 'body > div',
							'isAboveFold'   => false,
							'hasImages'     => false,
							'hasBackground' => true,
						],
					],
				],
				'images'       => [
					[
						'path'          => 'body > img',
						'src'           => 'test.jpg',
						'srcset'        => [
							[
								'url'   => 'test-300w.jpg',
								'width' => 300,
							],
							[
								'url'   => 'test-600w.jpg',
								'width' => 600,
							],
						],
						'width'         => 800,
						'height'        => 600,
						'widthAttr'     => '800',
						'heightAttr'    => '600',
						'naturalWidth'  => 800,
						'naturalHeight' => 600,
						'aspectRatio'   => 1.33,
						'alt'           => 'Test',
						'class'         => '',
						'loading'       => 'lazy',
						'decoding'      => 'async',
						'sizes'         => '(max-width: 600px) 100vw, 300px',
						'computedStyle' => [
							'width'          => '100%',
							'height'         => 'auto',
							'objectFit'      => 'cover',
							'objectPosition' => 'center',
						],
						'optimalSizes'  => '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px',
					],
				],
			]
		);
	}

	/**
	 * Create a test WebsiteAnalysis object with srcset image data and different sizes.
	 *
	 * @return WebsiteAnalysis
	 */
	private function create_test_analysis_with_srcset_and_different_sizes(): WebsiteAnalysis {
		return WebsiteAnalysis::from(
			[
				'hash'         => null,
				'lastModified' => 'now',
				'desktop'      => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image1.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg1.jpg' ],
					'sections'         => [
						[
							'id'            => 'section1',
							'height'        => 100.0,
							'tagName'       => 'div',
							'className'     => 'test-class',
							'path'          => 'body > div',
							'isAboveFold'   => true,
							'hasImages'     => true,
							'hasBackground' => false,
						],
					],
				],
				'mobile'       => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image2.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg2.jpg' ],
					'sections'         => [
						[
							'id'            => 'section2',
							'height'        => 200.0,
							'tagName'       => 'div',
							'className'     => 'test-class-mobile',
							'path'          => 'body > div',
							'isAboveFold'   => false,
							'hasImages'     => false,
							'hasBackground' => true,
						],
					],
				],
				'images'       => [
					[
						'path'          => 'body > img',
						'src'           => 'test.jpg',
						'srcset'        => [
							[
								'url'   => 'test-300w.jpg',
								'width' => 300,
							],
							[
								'url'   => 'test-600w.jpg',
								'width' => 600,
							],
						],
						'width'         => 800,
						'height'        => 600,
						'widthAttr'     => '800',
						'heightAttr'    => '600',
						'naturalWidth'  => 800,
						'naturalHeight' => 600,
						'aspectRatio'   => 1.33,
						'alt'           => 'Test',
						'class'         => '',
						'loading'       => 'lazy',
						'decoding'      => 'async',
						'sizes'         => '(max-width: 500px) 100vw, 400px',
						// Different from HTML sizes
						'computedStyle' => [
							'width'          => '100%',
							'height'         => 'auto',
							'objectFit'      => 'cover',
							'objectPosition' => 'center',
						],
						'optimalSizes'  => '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px',
					],
				],
			]
		);
	}

	/**
	 * Create a test WebsiteAnalysis object with srcset image data and matching sizes.
	 *
	 * @return WebsiteAnalysis
	 */
	private function create_test_analysis_with_srcset_and_matching_sizes(): WebsiteAnalysis {
		return WebsiteAnalysis::from(
			[
				'hash'         => null,
				'lastModified' => 'now',
				'desktop'      => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image1.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg1.jpg' ],
					'sections'         => [
						[
							'id'            => 'section1',
							'height'        => 100.0,
							'tagName'       => 'div',
							'className'     => 'test-class',
							'path'          => 'body > div',
							'isAboveFold'   => true,
							'hasImages'     => true,
							'hasBackground' => false,
						],
					],
				],
				'mobile'       => [
					'criticalImages'   => [ 'http://wordpress.test/wp-content/uploads/image2.jpg' ],
					'backgroundImages' => [ 'http://wordpress.test/wp-content/uploads/bg2.jpg' ],
					'sections'         => [
						[
							'id'            => 'section2',
							'height'        => 200.0,
							'tagName'       => 'div',
							'className'     => 'test-class-mobile',
							'path'          => 'body > div',
							'isAboveFold'   => false,
							'hasImages'     => false,
							'hasBackground' => true,
						],
					],
				],
				'images'       => [
					[
						'path'          => 'body > img',
						'src'           => 'test.jpg',
						'srcset'        => [
							[
								'url'   => 'test-300w.jpg',
								'width' => 300,
							],
							[
								'url'   => 'test-600w.jpg',
								'width' => 600,
							],
						],
						'width'         => 800,
						'height'        => 600,
						'widthAttr'     => '800',
						'heightAttr'    => '600',
						'naturalWidth'  => 800,
						'naturalHeight' => 600,
						'aspectRatio'   => 1.33,
						'alt'           => 'Test',
						'class'         => '',
						'loading'       => 'lazy',
						'decoding'      => 'async',
						'sizes'         => '(max-width: 600px) 100vw, 300px',
						'computedStyle' => [
							'width'          => '100%',
							'height'         => 'auto',
							'objectFit'      => 'cover',
							'objectPosition' => 'center',
						],
						'optimalSizes'  => '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px',
					],
				],
			]
		);
	}
}
