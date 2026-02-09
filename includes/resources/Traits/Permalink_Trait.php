<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits;

/**
 * Permalink related methods.
 */
trait Permalink_Trait {

	/**
	 * Get a post's path relative to the site root.
	 *
	 * @param int|\WP_Post $post The post object or ID.
	 *
	 * @return string
	 */
	private function get_post_path( $post ): string {
		$permalink = get_permalink( $post );

		if ( $permalink === false ) {
			return '';
		}

		return trailingslashit( wp_parse_url( $permalink, PHP_URL_PATH ) ?? '/' );
	}
}
