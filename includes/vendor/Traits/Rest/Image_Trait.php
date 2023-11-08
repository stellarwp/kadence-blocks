<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits\Rest;

/**
 * Shared image related functionality for REST controllers.
 *
 * @mixin \WP_REST_Controller
 */
trait Image_Trait {

	/**
	 * Sanitizes an array of Pexels image sizes.
	 *
	 * @param mixed|array<int, array{id: int, width: int, height: int, crop: bool}> $sizes One or more size arrays.
	 *
	 * @return array|array<int, array{id: int, width: int, height: int, crop: bool}>
	 */
	public function sanitize_image_sizes_array( $sizes ): array {
		$new_sizes = [];

		if ( ! empty( $sizes ) || ! is_array( $sizes ) ) {
			foreach ( $sizes as $value ) {
				$new_sizes[] = [
					'id'     => sanitize_text_field( $value['id'] ),
					'width'  => absint( $value['width'] ),
					'height' => absint( $value['height'] ),
					'crop'   => filter_var( $value['crop'], FILTER_VALIDATE_BOOLEAN ),
				];
			}
		}

		return $new_sizes;
	}

}
