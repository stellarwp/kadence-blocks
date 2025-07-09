<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Sizes_Attribute_Processor;
use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;
use Tests\Support\Classes\TestCase;
use WP_HTML_Tag_Processor;

final class SizesAttributeProcessorTest extends TestCase {

	private Sizes_Attribute_Processor $processor;

	protected function setUp(): void {
		parent::setUp();

		$this->processor = new Sizes_Attribute_Processor();
	}

	public function testItSetsOptimalSizesForMatchingImage(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px', $p->get_attribute( 'sizes' ) );
	}

	public function testItDoesNotSetSizesForNonMatchingImage(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/different-image.jpg" alt="Different image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItDoesNotSetSizesWhenImageAnalysisIsMissing(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItDoesNotSetSizesWhenOptimalSizesIsEmpty(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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
					'optimalSizes'  => '',
				] 
			),
		];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesIndexOutOfBoundsForImagesArray(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="http://wordpress.test/wp-content/uploads/test-image.jpg" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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

		// Index 1 is out of bounds for array with 1 element.
		$this->processor->process( $p, $critical_images, $images, 1 );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesImagesWithoutSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" alt="Image without src"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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

		// Should not throw an error.
		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesNullSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src alt="Image with null src"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesEmptySrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" src="" alt="Image with empty src"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'sizes' ) );
	}

	public function testItHandlesMultipleImagesWithDifferentSizes(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="hero-section"><img class="hero-image" src="http://wordpress.test/wp-content/uploads/hero-image.jpg" alt="Hero image"></div><p>Some content here with text and links.</p><div class="content-section"><h2>Article Title</h2><p>More content with <a href="#">links</a> and <strong>bold text</strong>.</p><img class="content-image" src="http://wordpress.test/wp-content/uploads/content-image.jpg" alt="Content image"></div><footer><img class="footer-image" src="http://wordpress.test/wp-content/uploads/footer-image.jpg" alt="Footer image"></footer></body></html>';

		$p               = new WP_HTML_Tag_Processor( $html );
		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.hero-section > img.hero-image',
					'src'           => 'http://wordpress.test/wp-content/uploads/hero-image.jpg',
					'srcset'        => [],
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
					'sizes'         => null,
					'computedStyle' => [
						'width'          => '100%',
						'height'         => 'auto',
						'objectFit'      => 'cover',
						'objectPosition' => 'center',
					],
					'optimalSizes'  => '100vw',
				] 
			),
			ImageAnalysis::from(
				[
					'path'          => 'div.content-section > img.content-image',
					'src'           => 'http://wordpress.test/wp-content/uploads/content-image.jpg',
					'srcset'        => [],
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
					'sizes'         => null,
					'computedStyle' => [
						'width'          => '50%',
						'height'         => 'auto',
						'objectFit'      => 'cover',
						'objectPosition' => 'center',
					],
					'optimalSizes'  => '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px',
				] 
			),
			ImageAnalysis::from(
				[
					'path'          => 'footer > img.footer-image',
					'src'           => 'http://wordpress.test/wp-content/uploads/footer-image.jpg',
					'srcset'        => [],
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
					'sizes'         => null,
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

		// Process all images in sequence
		$index = 0;
		while ( $p->next_tag( 'img' ) ) {
			$this->processor->process( $p, $critical_images, $images, $index );
			++$index;
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
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" sizes="(max-width: 600px) 100vw, 300px" src="http://wordpress.test/wp-content/uploads/test-image.jpg" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/different-image.jpg',
					'srcset'        => [],
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

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( '(max-width: 600px) 100vw, 300px', $p->get_attribute( 'sizes' ) );
	}

	public function testItOverwritesExistingSizesAttributeWhenMatch(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="header"><img class="logo" sizes="(max-width: 600px) 100vw, 300px" src="http://wordpress.test/wp-content/uploads/test-image.jpg" alt="Test image"></div></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [
			ImageAnalysis::from(
				[
					'path'          => 'div.header > img.logo',
					'src'           => 'http://wordpress.test/wp-content/uploads/test-image.jpg',
					'srcset'        => [],
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

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( '(max-width: 480px) 120px, (max-width: 900px) 240px, 240px', $p->get_attribute( 'sizes' ) );
	}
}
