<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;

final class Slider_Lazy_Loader {

	private Analysis_Registry $registry;

	public function __construct( Analysis_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Lazy load the row slider background image.
	 *
	 * @filter kadence_blocks_row_slider_attrs
	 *
	 * @param array<string, mixed> $attrs The HTML attributes.
	 * @param array<string, mixed> $attributes The row block's attributes.
	 *
	 * @return array<string, mixed>
	 */
	public function lazy_load_row_slider( array $attrs, array $attributes ): array {
		if ( ! $this->registry->is_optimized() ) {
			return $attrs;
		}

		$sliders = $attributes['backgroundSlider'] ?? [];

		// Exclude sliders with above the fold background images.
		if ( $sliders ) {
			$background_images = $this->registry->get_background_images();

			if ( $background_images ) {
				$lookup = array_flip( $background_images );

				foreach ( $sliders as $slide ) {
					$bg = $slide['bgImg'] ?? '';

					if ( $bg && isset( $lookup[ $bg ] ) ) {
						return $attrs;
					}
				}
			}
		}

		$attrs['class'] = trim( ( $attrs['class'] ?? '' ) . ' kb-lazy-bg-pending' );

		return $attrs;
	}
}
