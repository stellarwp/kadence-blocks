<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;

/**
 * Handles setting up the Kadence Row Layout Block for background image
 * lazy loading.
 */
final class Background_Lazy_Loader {

	private Asset $asset;
	private Analysis_Registry $registry;

	public function __construct(
		Asset $asset,
		Analysis_Registry $registry
	) {
		$this->asset    = $asset;
		$this->registry = $registry;
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
		$bg = $attributes['bgImg'] ?? '';

		if ( ! $bg ) {
			return $args;
		}

		$background_images = $this->registry->get_background_images();

		// Exclude above the fold background images.
		if ( in_array( $bg, $background_images, true ) ) {
			return $args;
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
