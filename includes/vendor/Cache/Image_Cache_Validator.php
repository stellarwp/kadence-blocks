<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Cache;

use KadenceWP\KadenceBlocks\Traits\Image_Size_Trait;

final class Image_Cache_Validator {

	use Image_Size_Trait;

	/**
	 * Read a cached API response and validate we still have
	 * matching thumbnail sizes, otherwise downloaded images
	 * would become out of sync.
	 *
	 * @param string $content The cached file JSON string.
	 *
	 * @return bool
	 */
	public function is_valid( string $content ): bool {
		$data = json_decode( $content, true );

		// Check for industry collections or search results.
		$first_image = $data['data'][0]['images'][0] ?? $data['data']['images'][0] ?? false;

		// This isn't an image API response.
		if ( ! isset( $first_image['sizes'] ) ) {
			return true;
		}

		$sizes          = array_column( $first_image['sizes'], 'name' );
		$existing_sizes = array_column( $this->get_image_sizes(), 'id' );
		$count          = count( $sizes );

		if ( $count > 0 && $count !== count( $existing_sizes ) ) {
			return false;
		}

		// Ensure all thumbnail sizes match.
		for ( $i = 0; $i < $count; $i ++ ) {
			$cached_size   = $sizes[ $i ];
			$existing_size = $existing_sizes[ $i ];

			if ( $cached_size !== $existing_size ) {
				return false;
			}
		}

		return true;
	}

}
