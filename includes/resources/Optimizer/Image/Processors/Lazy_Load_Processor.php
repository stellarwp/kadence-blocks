<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Contracts\Processor;
use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;

use WP_HTML_Tag_Processor;

final class Lazy_Load_Processor implements Processor {

	/**
	 * Add or remove the appropriate lazy loading attributes.
	 *
	 * @param WP_HTML_Tag_Processor $p The HTML Tag Processor, set on the current image it's processing.
	 * @param string[]              $critical_images The list of the above the fold image URLs.
	 * @param ImageAnalysis[]       $images The array of all collected images.
	 * @param int                   $index The current index of the image being processed.
	 *
	 * @return void
	 */
	public function process( WP_HTML_Tag_Processor $p, array $critical_images, array $images, int $index ): void {
		$src = $p->get_attribute( 'src' );

		$critical_source = $critical_images[ $index ] ?? false;

		// Ensure above the fold images do not have a lazy loading attribute.
		if ( $src === $critical_source ) {
			if ( 'lazy' === $p->get_attribute( 'loading' ) ) {
				$p->remove_attribute( 'loading' );
			}
		} else {
			$is_slider_image = $p->get_attribute( 'data-splide-lazy' );

			// Ensure below the fold images have native lazy loading.
			if ( ! $is_slider_image ) {
				$p->set_attribute( 'loading', 'lazy' );
			}

			// If WordPress somehow added a high fetch priority, remove it.
			if ( 'high' === $p->get_attribute( 'fetchpriority' ) ) {
				$p->remove_attribute( 'fetchpriority' );
			}
		}
	}
}
