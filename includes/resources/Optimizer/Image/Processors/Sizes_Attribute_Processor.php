<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Contracts\Processor;
use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;
use WP_HTML_Tag_Processor;

final class Sizes_Attribute_Processor implements Processor {

	/**
	 * Set the optimal sizes attribute for the image.
	 *
	 * @param WP_HTML_Tag_Processor $p The HTML Tag Processor, set on the current image it's processing.
	 * @param string[]              $critical_images The array of critical image src's.
	 * @param ImageAnalysis[]       $images The array of all collected images.
	 * @param int                   $index The current index of the image being processed.
	 *
	 * @return void
	 */
	public function process( WP_HTML_Tag_Processor $p, array $critical_images, array $images, int $index ): void {
		$image = $images[ $index ] ?? false;

		$src = $p->get_attribute( 'src' );

		// Update the sizes attribute with our optimal sizes.
		if ( $image && $image->optimalSizes && $image->src === $src ) {
			$p->set_attribute( 'sizes', $image->optimalSizes );
		}
	}
}
