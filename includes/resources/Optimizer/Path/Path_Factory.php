<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Path;

use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;
use WP_Post;

/**
 * A path object to generate a unique key for each URL on a site.
 */
final class Path_Factory {

	/**
	 * Create a path object based on the current relative path and $post global.
	 *
	 * @throws \InvalidArgumentException If the path is empty.
	 *
	 * @return Path
	 */
	public function make(): Path {
		$uri = SG::get_server_var( 'REQUEST_URI', '' );

		// Normalize leading slashes BEFORE wp_parse_url to prevent // being treated as protocol-relative URL.
		$uri = preg_replace( '#^/+#', '/', $uri );

		if ( $uri === null ) {
			return new Path( '' );
		}

		$path = wp_parse_url( $uri, PHP_URL_PATH ) ?: '';

		// Normalize multiple slashes within the path.
		$normalized = preg_replace( '#/{2,}#', '/', $path );

		if ( $normalized === null || $normalized === '' ) {
			return new Path( '' );
		}

		// Ensure the path starts with a slash.
		if ( ! str_starts_with( $normalized, '/' ) ) {
			$normalized = '/' . $normalized;
		}

		// This will get the proper front/posts page ID.
		$current_post = get_queried_object();

		if ( ! $current_post instanceof WP_Post ) {
			return new Path( $normalized, null );
		}

		return new Path( $normalized, $current_post->ID );
	}
}
