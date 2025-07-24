<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits;

use WP_Post;

/**
 * Provides validation logic for determining if a post can be optimized.
 */
trait Post_Validation_Trait {

	/**
	 * Validates and retrieves the current post if it can be optimized.
	 *
	 * We use get_queried_object() to automatically detect posts pages/archives etc.
	 *
	 * @return WP_Post|null The post object if optimizable, null otherwise.
	 */
	private function get_optimizable_post(): ?WP_Post {
		global $wp_query;

		if ( ! $wp_query->is_main_query() ) {
			return null;
		}

		// We can't optimize paginated URLs and loading it would make the main post outdated.
		if ( is_paged() ) {
			return null;
		}

		$post = get_queried_object();

		return $post instanceof WP_Post ? $post : null;
	}
}
