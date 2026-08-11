<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits\Rest;

/**
 * Shared image related functionality for REST controllers.
 *
 * @mixin \WP_REST_Controller
 *
 * cSpell:ignore absint
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
		if ( ! is_array( $sizes ) ) {
			return array();
		}

		$sizes = array_slice( $sizes, 0, 50 );
		$new_sizes = array();

		foreach ( $sizes as $value ) {
			if ( ! is_array( $value ) ) {
				continue;
			}

			$new_sizes[] = array(
				'id'     => isset( $value['id'] ) ? sanitize_text_field( $value['id'] ) : '',
				'width'  => isset( $value['width'] ) ? absint( $value['width'] ) : 0,
				'height' => isset( $value['height'] ) ? absint( $value['height'] ) : 0,
				'crop'   => isset( $value['crop'] ) ? filter_var( $value['crop'], FILTER_VALIDATE_BOOLEAN ) : false,
			);
		}

		return $new_sizes;
	}

}
