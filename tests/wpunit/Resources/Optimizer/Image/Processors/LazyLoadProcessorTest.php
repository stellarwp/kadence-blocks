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

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'loading' ) );
	}

	public function testItAddsLazyLoadingToNonCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg" alt="Below fold image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItRemovesHighFetchPriorityFromNonCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg" fetchpriority="high" alt="Below fold image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertNull( $p->get_attribute( 'fetchpriority' ) );
		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItPreservesExistingLazyLoadingOnNonCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/below-fold-image.jpg" loading="lazy" alt="Below fold image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesImagesWithoutSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img alt="Image without src"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		// Should not throw an error.
		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesEmptyCriticalImagesArray(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/any-image.jpg" alt="Any image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesIndexOutOfBoundsForCriticalImages(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/image.jpg" alt="Image"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		// Index 1 is out of bounds for array with 1 element.
		$this->processor->process( $p, $critical_images, $images, 1 );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesNullSrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src alt="Image with null src"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesEmptySrcAttribute(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="" alt="Image with empty src"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesMultipleImagesWithDifferentCriticalStatus(): void {
		$html = '<!DOCTYPE html><html><head></head><body><div class="hero-section"><img src="http://wordpress.test/wp-content/uploads/critical1.jpg" loading="lazy" alt="Hero image"></div><p>Some content here with text and links.</p><div class="content-section"><h2>Article Title</h2><p>More content with <a href="#">links</a> and <strong>bold text</strong>.</p><img src="http://wordpress.test/wp-content/uploads/non-critical.jpg" alt="Content image"></div><footer><img src="http://wordpress.test/wp-content/uploads/critical2.jpg" loading="lazy" alt="Footer image"></footer></body></html>';

		$p = new WP_HTML_Tag_Processor( $html );

		$critical_images = [
			'http://wordpress.test/wp-content/uploads/critical1.jpg',
			false,
			'http://wordpress.test/wp-content/uploads/critical2.jpg',
		];

		$images = [];

		// Process all images in sequence
		$index = 0;
		while ( $p->next_tag( 'img' ) ) {
			$this->processor->process( $p, $critical_images, $images, $index );
			++$index;
		}

		$updated_html = $p->get_updated_html();

		// Verify critical images have loading removed
		$this->assertStringNotContainsString( 'src="http://wordpress.test/wp-content/uploads/critical1.jpg" loading="lazy"', $updated_html );
		$this->assertStringNotContainsString( 'src="http://wordpress.test/wp-content/uploads/critical2.jpg" loading="lazy"', $updated_html );

		// Verify non-critical image has lazy loading
		$this->assertMatchesRegularExpression(
			'/<img[^>]*loading="lazy"[^>]*src="http:\/\/wordpress\.test\/wp-content\/uploads\/non-critical\.jpg"[^>]*>/i',
			$updated_html
		);
	}

	public function testItHandlesImagesWithDifferentLoadingAttributes(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/image.jpg" loading="eager" alt="Image with eager loading"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		// Should change eager to lazy for non-critical images.
		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}

	public function testItHandlesImagesWithDifferentFetchPriorityValues(): void {
		$html = '<!DOCTYPE html><html><head></head><body><img src="http://wordpress.test/wp-content/uploads/image.jpg" fetchpriority="low" alt="Image with low priority"></body></html>';
		$p    = new WP_HTML_Tag_Processor( $html );
		$p->next_tag( 'img' );

		$critical_images = [ 'http://wordpress.test/wp-content/uploads/critical-image.jpg' ];
		$images          = [];

		$this->processor->process( $p, $critical_images, $images, 0 );

		// Should only remove 'high' fetchpriority, not 'low'.
		$this->assertEquals( 'low', $p->get_attribute( 'fetchpriority' ) );
		$this->assertEquals( 'lazy', $p->get_attribute( 'loading' ) );
	}
}
