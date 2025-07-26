<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Path;

use InvalidArgumentException;

/**
 * The Path Data Transfer Object.
 *
 * @see Path_Factory
 */
final class Path {

	/**
	 * The path from $wp->request.
	 *
	 * @var string
	 */
	private string $path;

	/**
	 * @param string $path The path from $wp->request.
	 *
	 * @throws InvalidArgumentException If the path is empty.
	 */
	public function __construct( string $path ) {
		if ( ! $path ) {
			throw new InvalidArgumentException( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );
		}

		$this->path = $path;
	}

	/**
	 * Get the raw path.
	 *
	 * @return string
	 */
	public function path(): string {
		return $this->path;
	}

	/**
	 * Create a sha256 hash for the path.
	 *
	 * @return string
	 */
	public function hash(): string {
		return hash( 'sha256', $this->path );
	}
}
