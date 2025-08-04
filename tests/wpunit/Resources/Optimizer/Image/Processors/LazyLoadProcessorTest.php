<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Processors\Lazy_Load_Processor;
use Tests\Support\Classes\TestCase;
use WP_HTML_Tag_Processor;

final class LazyLoadProcessorTest extends TestCase {

	private Lazy_Load_Processor $processor;

	protected function setUp(): void {
		parent::setUp();

		$this->processor = new Lazy_Load_Processor();
	}

	public function testItRemovesLazyLoadingFromCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/critical-image.jpg" loading="lazy" alt="Critical image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertNull( $p->get_attribute( 'loading' ) );
	}

	public function testItAddsLazyLoadingToNonCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg" alt="Below fold image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItRemovesHighFetchPriorityFromNonCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg" fetchpriority="high" alt="Below fold image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertNull( $p->get_attribute( 'fetchpriority' ) );
		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItPreservesExistingLazyLoadingOnNonCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg" loading="lazy" alt="Below fold image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesImagesWithoutSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img alt="Image without src"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		// Should not throw an error.
		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesEmptyCriticalImagesArray(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/any-image.jpg" alt="Any image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesIndexOutOfBoundsForCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/image.jpg" alt="Image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		// Should not throw an error even though the image is not in critical images.
		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesNullSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src alt="Image with null src"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesEmptySrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="" alt="Image with empty src"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesMultipleImagesWithDifferentCriticalStatus(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/critical-image.jpg" loading="lazy" alt="Critical image"><img src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg" alt="Below fold image"><img src="http://wordpress.test/wp-content/uploads/another-image.jpg" fetchpriority="high" alt="Another image"></body></html>';

		$p               = new WP_HTML_Tag_Processor( $html );
		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		// Process all images in sequence
		while ( $p->next_tag( 'img' ) ) {
			$this->processor->process( $p, $critical_images, $images );
		}

		$updated_html = $p->get_updated_html();

		// Critical image should not have lazy loading.
		$this->assertStringNotContainsString( 'src="http://wordpress.test/wp-content/uploads/critical-image.jpg" loading="lazy"', $updated_html );

		// Below fold images should have lazy loading.
		$this->assertStringContainsString( 'loading="lazy" src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg"', $updated_html );
		$this->assertStringContainsString( 'loading="lazy" src="http://wordpress.test/wp-content/uploads/another-image.jpg"', $updated_html );

		// Below fold images should not have fetchpriority.
		$this->assertStringNotContainsString( 'fetchpriority="high"', $updated_html );
	}

	public function testItHandlesImagesWithDifferentLoadingAttributes(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/image.jpg" loading="eager" alt="Image with eager loading"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		// Should change eager to lazy for non-critical images.
		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesImagesWithDifferentFetchPriorityValues(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/image.jpg" fetchpriority="low" alt="Image with low fetch priority"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images );

		// Should only remove 'high' fetchpriority, not 'low'.
		$this->assertEquals( 'low', $p->get_attribute( 'fetchpriority' ) );
		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}
}
