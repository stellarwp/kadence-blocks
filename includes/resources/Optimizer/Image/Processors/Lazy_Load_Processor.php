<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Contracts\Processor;
use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;

use WP_HTML_Tag_Processor;

final class Lazy_Load_Processor implements Processor {

	/**
	 * Count how many above the fold images we've found.
	 *
	 * @var int
	 */
	private int $found = 0;

	/**
	 * Add or remove the appropriate lazy loading attributes.
	 *
	 * @param WP_HTML_Tag_Processor        $p The HTML Tag Processor, set on the current image it's processing.
	 * @param string[]                     $critical_images The list of the above the fold image URLs.
	 * @param array<string, ImageAnalysis> $images The array of all collected images indexed by a unique key.
	 *
	 * @return void
	 */
	public function process( WP_HTML_Tag_Processor $p, array $critical_images, array $images ): void {
		$src = $p->get_attribute( 'src' );

		// Don't lazy load data URLs.
		if ( is_string( $src ) && str_starts_with( $src, 'data:' ) ) {
			return;
		}

		$critical_image_count          = count( $critical_images );
		$processed_all_critical_images = $this->found >= $critical_image_count;

		// If the critical images haven't been processed, check if this image is above the fold.
		if ( ! $processed_all_critical_images ) {
			$is_above_the_fold = in_array( $src, $critical_images, true );

			// Ensure above the fold images do not have a lazy loading attribute.
			if ( $is_above_the_fold ) {
				if ( 'lazy' === $p->get_attribute( 'loading' ) ) {
					$p->remove_attribute( 'loading' );
				}

				++$this->found;

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
