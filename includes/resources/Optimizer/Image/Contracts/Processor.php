<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image\Contracts;

use KadenceWP\KadenceBlocks\Optimizer\Response\ImageAnalysis;
use WP_HTML_Tag_Processor;

/**
 * Process an img tag to manipulate its markup before the HTML is send back
 * to the browser.
 */
interface Processor {

	/**
	 * Manipulates img tags.
	 *
	 * @param WP_HTML_Tag_Processor        $p The HTML Tag Processor, set on the current image it's processing.
	 * @param string[]                     $critical_images The array of critical image src's.
	 * @param array<string, ImageAnalysis> $images The array of all collected images indexed by a unique key.
	 *
	 * @return void
	 */
	public function process( WP_HTML_Tag_Processor $p, array $critical_images, array $images ): void;
}
