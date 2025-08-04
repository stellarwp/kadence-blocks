<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image\Processors;

use KadenceWP\KadenceBlocks\Optimizer\Image\Contracts\Processor;
use KadenceWP\KadenceBlocks\Optimizer\Image\Traits\Image_Key_Generator_Trait;
use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;
use WP_HTML_Tag_Processor;

final class Sizes_Attribute_Processor implements Processor {

	use Image_Key_Generator_Trait;

	/**
	 * Set the optimal sizes attribute for the image.
	 *
	 * @param WP_HTML_Tag_Processor        $p The HTML Tag Processor, set on the current image it's processing.
	 * @param string[]                     $critical_images The array of critical image src's.
	 * @param array<string, ImageAnalysis> $images The array of all collected images indexed by a unique key.
	 *
	 * @return void
	 */
	public function process( WP_HTML_Tag_Processor $p, array $critical_images, array $images ): void {
		// The analyzer doesn't collect images without a srcset.
		$srcset = $p->get_attribute( 'srcset' );

		if ( ! $srcset ) {
			return;
		}

		$src   = $p->get_attribute( 'src' );
		$sizes = $p->get_attribute( 'sizes' );

		$key = $this->generate_image_key( $src, $sizes );

		if ( null === $key ) {
			return;
		}

		$image = $images[ $key ] ?? false;

		if ( ! $image instanceof ImageAnalysis ) {
			return;
		}

		// Update the sizes attribute with our optimal sizes.
		if ( $image->optimalSizes ) {
			$p->set_attribute( 'sizes', $image->optimalSizes );
		}
	}
}
