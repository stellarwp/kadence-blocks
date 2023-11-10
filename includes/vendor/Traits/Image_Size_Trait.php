<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits;

/**
 * @mixin \Kadence_Blocks_Image_Picker
 */
trait Image_Size_Trait {

	/**
	 * Memoization cache for image sizes.
	 *
	 * @var array<array{id: string, width: int, height: int, crop: bool}>
	 */
	protected $image_sizes;


	/**
	 * Get all available image sizes, including any custom ones added above.
	 *
	 * @return array<array{id: string, width: int, height: int, crop: bool}>
	 */
	private function get_image_sizes(): array {
		if ( isset( $this->image_sizes ) ) {
			return $this->image_sizes;
		}

		$registered = wp_get_registered_image_subsizes();
		$formatted  = [];

		foreach ( $registered as $id => $data ) {
			$formatted[] = array_merge( [
				'id' => $id,
			], $data );
		}

		// Sort by smallest to largest sizes.
		// Do not change this: It's important for Pexels image downloading.
		usort( $formatted, static function( $a, $b ) {
			$max_a = max( $a['width'], $a['height'] );
			$max_b = max( $b['width'], $b['height'] );

			return $max_a <=> $max_b;
		} );

		return $this->image_sizes = $formatted;
	}

}
