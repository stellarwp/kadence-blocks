<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Path;

use InvalidArgumentException;

/**
 * The Path Data Transfer Object.
 *
 * Represents a URL path and optionally its associated post ID.
 * The post_id is optional but recommended for reliable status synchronization.
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
	 * Optional post ID associated with this path.
	 *
	 * @var int|null
	 */
	private ?int $post_id;

	/**
	 * @param string   $path    The path from $wp->request.
	 * @param int|null $post_id Optional post ID for status synchronization.
	 *
	 * @throws InvalidArgumentException If the path is empty.
	 */
	public function __construct( string $path, ?int $post_id = null ) {
		if ( ! $path ) {
			throw new InvalidArgumentException( 'Cannot hash an empty path. Verify you are using this after the wp hook fired.' );
		}

		$this->path    = $path;
		$this->post_id = $post_id;
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

	/**
	 * Get the associated post ID if available.
	 *
	 * @return int|null
	 */
	public function post_id(): ?int {
		return $this->post_id;
	}

	/**
	 * Create a new Path with post ID attached (immutable).
	 *
	 * Useful for adding post context to an existing Path object.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return self
	 */
	public function with_post_id( int $post_id ): self {
		return new self( $this->path, $post_id );
	}
}
