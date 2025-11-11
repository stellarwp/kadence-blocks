<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Sizes_Attribute_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;
use Tests\Support\Classes\OptimizerTestCase;
use WP_HTML_Tag_Processor;

final class SizesAttributeProcessorTest extends OptimizerTestCase {

	private Sizes_Attribute_Processor $processor;

	protected function setUp(): void {
		parent::setUp();

		$this->processor = new Sizes_Attribute_Processor();
	}

	public function testItSetsOptimalSizesForMatchingImageWithSrcset(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px', $p->get_attribute( 'sizes' ) );
	}

	public function testItDoesNotProcessImagesWithoutSrcset(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItDoesNotSetSizesForNonMatchingImage(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/different-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Different image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		// Should preserve original sizes since the key doesn't match.
		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItDoesNotSetSizesWhenImageAnalysisIsMissing(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		// Should preserve original sizes since no matching image analysis.
		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItDoesNotSetSizesWhenOptimalSizesIsEmpty(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
					'optimalSizes'  => '',
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesImagesWithoutSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Image without src"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		// Should not throw an error.
		$this->processor->process( $p, $critical_images, $images );

		// Should preserve original sizes since src is null.
		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesNullSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Image with null src"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		// Should preserve original sizes since src is null/empty.
		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesEmptySrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Image with empty src"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		// Should preserve original sizes since src is empty.
		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesMissingClassAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img src="http://wordpress.test/wp-content/uploads/test-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Image with no classes"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$image_analysis  = ImageAnalysis::from(
			[
				'path'          => 'div.header > img.logo',
				'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
				'alt'           => 'Test image',
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
			]
		);

		$this->assertSame( '', $image_analysis->className );
		$this->assertSame( '', $image_analysis->toArray()['class'] );

		$images = [ md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => $image_analysis ];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertNull( $p->get_attribute( 'class' ) );
	}

	public function testItHandlesMultipleImagesWithDifferentSizes(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="hero-section"><img class="hero-image" src="http://wordpress.test/wp-content/uploads/hero-image.jpg" srcset="hero-300w.jpg 300w, hero-600w.jpg 600w" sizes="100vw" alt="Hero image"></div><p>Some content here with text and links.</p><div class="content-section"><h2>Article Title</h2><p>More content with <a href="#">links</a> and <strong>bold text</strong>.</p><img class="content-image" src="http://wordpress.test/wp-content/uploads/content-image.jpg" srcset="content-300w.jpg 300w, content-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Content image"></div><footer><img class="footer-image" src="http://wordpress.test/wp-content/uploads/footer-image.jpg" srcset="footer-300w.jpg 300w, footer-600w.jpg 600w" sizes="(max-width: 600px) 100vw, 300px" alt="Footer image"></footer></body></html>';

		$p               = new WP_HTML_Tag_Processor( $html );
		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/hero-image.jpg|100vw' )                              => ImageAnalysis::from(
				[
					'path'          => 'div.hero-section > img.hero-image',
					'src'           => 'http://wordpress.test/wp-content/uploads/hero-image.jpg',
					'srcset'        => [
						[
							'url'   => 'hero-300w.jpg',
							'width' => 300,
						],
						[
							'url'   => 'hero-600w.jpg',
							'width' => 600,
						],
					],
					'width'         => 1200,
					'height'        => 600,
					'widthAttr'     => '1200',
					'heightAttr'    => '600',
					'naturalWidth'  => 1200,
					'naturalHeight' => 600,
					'aspectRatio'   => 2.0,
					'alt'           => 'Hero image',
					'class'         => '',
					'loading'       => 'lazy',
					'decoding'      => 'async',
					'sizes'         => '100vw',
					'computedStyle' => [
						'width'          => '100%',
						'height'         => 'auto',
						'objectFit'      => 'cover',
						'objectPosition' => 'center',
					],
					'optimalSizes'  => '100vw',
				]
			),
			md5( 'http://wordpress.test/wp-content/uploads/content-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.content-section > img.content-image',
					'src'           => 'http://wordpress.test/wp-content/uploads/content-image.jpg',
					'srcset'        => [
						[
							'url'   => 'content-300w.jpg',
							'width' => 300,
						],
						[
							'url'   => 'content-600w.jpg',
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
					'alt'           => 'Content image',
					'class'         => '',
					'loading'       => 'lazy',
					'decoding'      => 'async',
					'sizes'         => '(max-width: 600px) 100vw, 300px',
					'computedStyle' => [
						'width'          => '50%',
						'height'         => 'auto',
						'objectFit'      => 'cover',
						'objectPosition' => 'center',
					],
					'optimalSizes'  => '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px',
				]
			),
			md5( 'http://wordpress.test/wp-content/uploads/footer-image.jpg|(max-width: 600px) 100vw, 300px' )  => ImageAnalysis::from(
				[
					'path'          => 'footer > img.footer-image',
					'src'           => 'http://wordpress.test/wp-content/uploads/footer-image.jpg',
					'srcset'        => [
						[
							'url'   => 'footer-300w.jpg',
							'width' => 300,
						],
						[
							'url'   => 'footer-600w.jpg',
							'width' => 600,
						],
					],
					'width'         => 400,
					'height'        => 300,
					'widthAttr'     => '400',
					'heightAttr'    => '300',
					'naturalWidth'  => 400,
					'naturalHeight' => 300,
					'aspectRatio'   => 1.33,
					'alt'           => 'Footer image',
					'class'         => '',
					'loading'       => 'lazy',
					'decoding'      => 'async',
					'sizes'         => '(max-width: 600px) 100vw, 300px',
					'computedStyle' => [
						'width'          => '25%',
						'height'         => 'auto',
						'objectFit'      => 'cover',
						'objectPosition' => 'center',
					],
					'optimalSizes'  => '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px',
				]
			),
		];

		// Process all images in sequence.
		while ( $p->next_tag( 'img' ) ) {
			$this->processor->process( $p, $critical_images, $images );
		}

		$updated_html = $p->get_updated_html();

		// Verify each image has the correct sizes attribute
		$this->assertMatchesRegularExpression(
			'/<img[^>]*(src="http:\/\/wordpress\.test\/wp-content\/uploads\/hero-image\.jpg"[^>]*sizes="100vw"|sizes="100vw"[^>]*src="http:\/\/wordpress\.test\/wp-content\/uploads\/hero-image\.jpg")[^>]*>/i',
			$updated_html
		);
		$this->assertMatchesRegularExpression(
			'/<img[^>]*(src="http:\/\/wordpress\.test\/wp-content\/uploads\/content-image\.jpg"[^>]*sizes="\(max-width: 480px\) 120px, \(max-width: 900px\) 240px, 240px"|sizes="\(max-width: 480px\) 120px, \(max-width: 900px\) 240px, 240px"[^>]*src="http:\/\/wordpress\.test\/wp-content\/uploads\/content-image\.jpg")[^>]*>/i',
			$updated_html
		);
		$this->assertMatchesRegularExpression(
			'/<img[^>]*(src="http:\/\/wordpress\.test\/wp-content\/uploads\/footer-image\.jpg"[^>]*sizes="\(max-width: 480px\) 120px, \(max-width: 900px\) 240px, 240px"|sizes="\(max-width: 480px\) 120px, \(max-width: 900px\) 240px, 240px"[^>]*src="http:\/\/wordpress\.test\/wp-content\/uploads\/footer-image\.jpg")[^>]*>/i',
			$updated_html
		);
	}

	public function testItPreservesExistingSizesAttributeWhenNoMatch(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" sizes="(max-width: 600px) 100vw, 300px" src="http://wordpress.test/wp-content/uploads/test-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/different-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/different-image.jpg',
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
					'alt'           => 'Different image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItOverwritesExistingSizesAttributeWhenMatch(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" sizes="(max-width: 600px) 100vw, 300px" src="http://wordpress.test/wp-content/uploads/test-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|(max-width: 600px) 100vw, 300px' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px', $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesNullSizesAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" srcset="test-300w.jpg 300w, test-600w.jpg 600w" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			md5( 'http://wordpress.test/wp-content/uploads/test-image.jpg|' ) => ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
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
					'alt'           => 'Test image',
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
				]
			),
		];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}
}
