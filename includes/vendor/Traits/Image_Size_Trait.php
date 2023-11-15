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
		$max        = 0;

		foreach ( $registered as $id => $data ) {
			$width  = $data['width'];
			$height = $data['height'];

			/** This filter is documented in wp-admin/includes/image.php */
			$threshold = (int) apply_filters( 'big_image_size_threshold', 2560, [ $width, $height ], '', 0 );

			// Make a scaled image size if above the threshold and the largest scaled image we have.
			if ( $threshold && ( $width > $threshold || $height > $threshold ) && max( $width, $height ) > $max ) {
				$max = max( $width, $height );

				$formatted[] = [
					'id'     => FileNameProcessor::SCALED_SIZE,
					'width'  => $threshold,
					'height' => $threshold,
					'crop'   => false,
				];

				continue;
			}

			// Add an id index.
			$formatted[] = array_merge( [
				'id' => $id,
			], $data );
		}

		// We should have at least one scaled image to act as the main image.
		if ( $max === 0 ) {
			/** This filter is documented in wp-admin/includes/image.php */
			$threshold = (int) apply_filters( 'big_image_size_threshold', 2560, [ 2560, 2560 ], '', 0 );

			if ( ! $threshold ) {
				$threshold = 2560;
			}

			$formatted[] = [
				'id'     => FileNameProcessor::SCALED_SIZE,
				'width'  => $threshold,
				'height' => $threshold,
				'crop'   => false,
			];
		} else {
			// Remove any duplicate scaled images.
			$formatted = array_reduce( $formatted, static function ( $carry, $size ) {
				$id = $size['id'];

				if ( ! isset( $carry['id'] ) ) {
					$carry[ $id ] = $size;
				}

				return $carry;
			}, [] );
		}

		// Sort by smallest to largest sizes.
		// Do not change this: It's important for Pexels image downloading, so we know the largest size.
		usort( $formatted, static function( $a, $b ) {
			$max_a = max( $a['width'], $a['height'] );
			$max_b = max( $b['width'], $b['height'] );

			return $max_a <=> $max_b;
		} );

		return $this->image_sizes_cache = $formatted;
	}

}
