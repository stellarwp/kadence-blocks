<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Response\Section;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;
use WP_Post;

/**
 * Process section Optimization data to set content visibility on the Kadence row layout block.
 */
final class Element_Lazy_Loader {

	use Viewport_Trait;

	/**
	 * Sections cache for this request.
	 *
	 * @var array<int, Section>
	 */
	private ?array $sections;

	private Store $store;

	public function __construct( Store $store ) {
		$this->store = $store;
	}

	/**
	 * Add content-visibility CSS to below the fold Kadence row elements.
	 *
	 * @filter kadence_blocks_row_wrapper_args
	 *
	 * @param array<string, mixed> $args The wrapper div HTML attributes.
	 * @param array<string, mixed> $attributes The current block attributes.
	 *
	 * @return array<string, mixed>
	 */
	public function modify_row_layout_block_wrapper_args( array $args, array $attributes ): array {
		global $post;

		if ( ! $post instanceof WP_Post ) {
			return $args;
		}

		$unique_id = $attributes['uniqueID'] ?? false;

		if ( ! $unique_id ) {
			return $args;
		}

		$analysis = $this->store->get( $post->ID );

		if ( ! $analysis ) {
			return $args;
		}

		$sections = $this->sections ??= $this->is_mobile() ? $analysis->mobile->sections : $analysis->desktop->sections;

		foreach ( $sections as $key => $section ) {
			// Skip above the fold sections.
			if ( $section->isAboveFold ) {
				unset( $this->sections[ $key ] );

				continue;
			}

			// Search for the unique ID in the class attribute.
			if ( ! str_contains( $section->className, $unique_id ) ) {
				continue;
			}

			if ( $section->height <= 0 ) {
				continue;
			}

			$current_style = $args['style'] ?? '';

			$args['style'] = "content-visibility: auto;contain-intrinsic-size: auto {$section->height}px;" . $current_style;

			unset( $this->sections[ $key ] );
		}

		return $args;
	}

	/**
	 * Flush the memoization cache.
	 *
	 * @return void
	 */
	public function flush(): void {
		unset( $this->sections );
	}
}
