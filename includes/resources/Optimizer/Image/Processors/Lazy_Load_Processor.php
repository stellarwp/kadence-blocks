<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Contracts\Processor;
use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;
use WP_HTML_Tag_Processor;

final class Lazy_Load_Processor implements Processor {

	/**
	 * A queue of URLs that are above the fold.
	 *
	 * @var string[]|null
	 */
	private ?array $critical_image_queue = null;

	/**
	 * Add or remove the appropriate lazy loading attributes. It's important to note that WordPress
	 * may have already added a loading=lazy attribute to an image that shouldn't have it.
	 *
	 * @param WP_HTML_Tag_Processor        $p The HTML Tag Processor, set on the current image it's processing.
	 * @param string[]                     $critical_images The list of the above the fold image URLs.
	 * @param array<string, ImageAnalysis> $images The array of all collected images indexed by a unique key.
	 *
	 * @return void
	 */
	public function process( WP_HTML_Tag_Processor $p, array $critical_images, array $images ): void {
		$src = (string) $p->get_attribute( 'src' );

		// Don't lazy load data URLs.
		if ( str_starts_with( $src, 'data:' ) ) {
			return;
		}

		// Initialize the queue on first run.
		if ( ! isset( $this->critical_image_queue ) ) {
			$this->critical_image_queue = $critical_images;
		}

		// Check if this image is next in our critical queue.
		if ( $this->critical_image_queue ) {
			$queue_index = array_search( $src, $this->critical_image_queue, true );

			if ( $queue_index !== false ) {
				// Remove lazy loading for critical image.
				if ( 'lazy' === $p->get_attribute( 'loading' ) ) {
					$p->remove_attribute( 'loading' );
				}

				// Remove this occurrence from the queue.
				unset( $this->critical_image_queue[ $queue_index ] );

				return;
			}
		}

		// Below the fold logic (or after all critical images processed).
		$p->set_attribute( 'loading', 'lazy' );

		// If WordPress somehow added a high fetch priority, remove it.
		if ( 'high' === $p->get_attribute( 'fetchpriority' ) ) {
			$p->remove_attribute( 'fetchpriority' );
		}
	}
}
