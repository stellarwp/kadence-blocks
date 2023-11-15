<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits;

use KadenceWP\KadenceBlocks\Image_Downloader\Image_Editor;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\FileNameProcessor;

/**
 * @mixin \Kadence_Blocks_Image_Picker
 * @mixin Image_Editor
 */
trait Image_Size_Trait {

	/**
	 * Memoization cache for image sizes.
	 *
	 * @var array<array{id: string, width: int, height: int, crop: bool}>
	 */
	protected $image_sizes_cache;


	/**
	 * Get all available WordPress thumbnail sizes, format and sort them
	 * by smallest to largest.
	 *
	 * @return array<array{id: string, width: int, height: int, crop: bool}>
	 */
	protected function get_image_sizes(): array {
		if ( isset( $this->image_sizes_cache ) ) {
			return $this->image_sizes_cache;
		}

		$registered = wp_get_registered_image_subsizes();
		$formatted  = [];

		foreach ( $registered as $id => $data ) {
			// Add an id index.
			$formatted[] = array_merge( [
				'id' => $id,
			], $data );
		}

		/**
		 * We should have at least one scaled image to act as the main image, even if the user disabled
		 * it as we don't store a super high resolution image.
		 *
		 * This filter is documented in wp-admin/includes/image.php
		 */
		$threshold = (int) apply_filters( 'big_image_size_threshold', 2560, [ 2561, 2561 ], '', 0 );

		if ( ! $threshold ) {
			$threshold = 2560;
		}

		$formatted[] = [
			'id'     => FileNameProcessor::SCALED_SIZE,
			'width'  => $threshold,
			'height' => $threshold,
			'crop'   => false,
		];

		// Sort by smallest to largest sizes.
		// Do not change this: It's important for Pexels image downloading, so we know the largest size.
		usort( $formatted, static function( array $a, array $b ) {
			$max_a = max( $a['width'], $a['height'] );
			$max_b = max( $b['width'], $b['height'] );

			return $max_a <=> $max_b;
		} );

		return $this->image_sizes_cache = $formatted;
	}

}
