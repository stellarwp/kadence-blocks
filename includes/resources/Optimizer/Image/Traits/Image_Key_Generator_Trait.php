<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Image\Traits;

trait Image_Key_Generator_Trait {

	/**
	 * Generate a unique key for indexing image data.
	 *
	 * @param string|null|bool $src   The image source URL.
	 * @param string|null|bool $sizes The image sizes attribute.
	 *
	 * @return string|null A unique key or null if inputs are missing or non-string.
	 */
	private function generate_image_key( $src, $sizes ): ?string {
		// Only allow actual strings.
		if ( ! is_string( $src ) || ! is_string( $sizes ) ) {
			return null;
		}

		// Bypass empty attributes.
		if ( $src === '' || $sizes === '' ) {
			return null;
		}

		return md5( $src . '|' . $sizes );
	}
}
