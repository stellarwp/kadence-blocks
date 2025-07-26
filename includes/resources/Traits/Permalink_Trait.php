<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Traits;

/**
 * Permalink related methods.
 */
trait Permalink_Trait {

	/**
	 * Get a post's path that would match up to $wp->request.
	 *
	 * @param int|\WP_Post $post The post object or ID.
	 *
	 * @return string
	 */
	private function get_post_path( $post ): string {
		$permalink = get_permalink( $post );

		// Page is set to front.
		if ( $permalink && $permalink === home_url( '/' ) ) {
			return '/';
		}

		$home_path = wp_parse_url( home_url(), PHP_URL_PATH );

		if ( ! empty( $home_path ) ) {
			$home_path = '/' . trim( $home_path, '/' );
		}

		$path = wp_parse_url( $permalink, PHP_URL_PATH );

		if ( ! empty( $home_path ) && str_starts_with( $path, $home_path ) ) {
			$path = substr( $path, strlen( $home_path ) );
		}

		return trim( $path, '/' );
	}
}
