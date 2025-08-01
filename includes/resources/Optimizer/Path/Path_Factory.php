<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Path;

use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;

/**
 * A path object to generate a unique key for each URL on a site.
 */
final class Path_Factory {

	/**
	 * Create a path object based on the current relative path.
	 *
	 * @throws \InvalidArgumentException If the path is empty.
	 *
	 * @return Path
	 */
	public function make(): Path {
		$uri = SG::get_server_var( 'REQUEST_URI' );

		$path = wp_parse_url( $uri, PHP_URL_PATH ) ?? '/';

		return new Path( $path );
	}
}
