<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Path;

use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;
use WP;

/**
 * A path object to generate a unique key for each URL on a site.
 *
 * @note The WP object is not properly set up until the `parse_request` action is fired, which is
 *       AFTER `init`.
 *
 * @action parse_request
 */
final class Path_Factory {

	private WP $wp;

	public function __construct( WP $wp ) {
		$this->wp = $wp;
	}

	/**
	 * Create a path object based on the current WP request.
	 *
	 * @throws \InvalidArgumentException If the path is empty.
	 *
	 * @return Path
	 */
	public function make(): Path {
		$query_string = SG::get_server_var( 'QUERY_STRING' ) ?? '';

		$path = trim( $this->wp->request ?: $query_string, '/' );

		return new Path( $path );
	}
}
