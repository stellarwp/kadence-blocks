<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;

/**
 * Handles setting up the Kadence Row Layout Block for background image
 * lazy loading.
 */
final class Background_Lazy_Loader {

	use Viewport_Trait;

	private Store $store;
	private Asset $asset;
	private Path_Factory $path_factory;

	public function __construct(
		Store $store,
		Asset $asset,
		Path_Factory $path_factory
	) {
		$this->store        = $store;
		$this->asset        = $asset;
		$this->path_factory = $path_factory;
	}

	/**
	 * Add lazy loading attributes to the row layout block's wrapper div.
	 *
	 * @filter kadence_blocks_row_wrapper_args
	 *
	 * @param array<string, mixed> $args The wrapper div HTML attributes.
	 * @param array<string, mixed> $attributes The current block attributes.
	 *
	 * @return array<string, mixed>
	 */
	public function modify_row_layout_block_wrapper_args( array $args, array $attributes ): array {
		try {
			$path = $this->path_factory->make();
		} catch ( InvalidArgumentException $e ) {
			return $args;
		}

		$bg        = $attributes['bgImg'] ?? '';
		$class     = $args['class'] ?? '';
		$is_slider = is_string( $class ) && str_contains( $class, 'kb-blocks-has-slider' );

		if ( ! $bg && ! $is_slider ) {
			return $args;
		}

		$analysis = $this->store->get( $path );

		if ( ! $analysis ) {
			return $args;
		}

		if ( $bg ) {
			$background_images = $this->is_mobile() ? $analysis->mobile->backgroundImages : $analysis->desktop->backgroundImages;

			// Exclude above the fold background images.
			if ( in_array( $bg, $background_images, true ) ) {
				return $args;
			}
		}

		// Lazy load row sliders.
		if ( $is_slider ) {
			$id = $attributes['uniqueID'] ?? '';

			if ( ! $id ) {
				return $args;
			}

			$sections      = $this->is_mobile() ? $analysis->mobile->sections : $analysis->desktop->sections;
			$class_to_find = sprintf( 'kb-row-layout-id%s', $id );

			// Find the matching section and check if it's below the fold.
			$should_lazy_load_slider = false;

			foreach ( $sections as $section ) {
				if ( str_contains( $section->className, $class_to_find ) ) {
					// Found our section, check if it's below the fold.
					$should_lazy_load_slider = ! $section->isAboveFold;

					break;
				}
			}

			if ( ! $should_lazy_load_slider ) {
				return $args;
			}
		}

		$classes   = $args['class'] ?? '';
		$is_inline = $attributes['backgroundInline'] ?? false;

		// Add lazy loading data attributes for CSS backgrounds.
		if ( $classes ) {
			$args['data-kadence-lazy-class']   = $classes;
			$args['data-kadence-lazy-trigger'] = 'viewport';
			$args['data-kadence-lazy-attrs']   = 'class';
			unset( $args['class'] );
		}

		// Add lazy loading data attributes for inline style background images.
		if ( $is_inline ) {
			$args['data-kadence-lazy-style']     = $args['style'] ?? '';
			$args['data-kadence-lazy-trigger'] ??= 'viewport';

			if ( ! empty( $args['data-kadence-lazy-attrs'] ) ) {
				$args['data-kadence-lazy-attrs'] .= ',style';
			} else {
				$args['data-kadence-lazy-attrs'] = 'style';
			}

			unset( $args['style'] );
		}

		// Enqueue the lazy loader script if we found a bg.
		$this->asset->enqueue_script( 'lazy-loader', 'dist/lazy-loader' );

		return $args;
	}
}
