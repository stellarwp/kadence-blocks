<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;

/**
 * A Store Decorator that caches the results of the underlying concrete
 * store using the object cache.
 */
final class Cached_Store_Decorator implements Contracts\Store {

	/**
	 * The cache group.
	 */
	public const GROUP = 'kb_optimizer';

	/**
	 * The cache time to live in seconds.
	 */
	public const TTL = 43200;

	/**
	 * The underlying store concrete.
	 *
	 * @var Store
	 */
	private Store $store;

	public function __construct( Store $store ) {
		$this->store = $store;
	}

	/**
	 * Whether a Path has optimization data.
	 *
	 * @param Path $path The path object.
	 *
	 * @return bool
	 */
	public function has( Path $path ): bool {
		$cached = wp_cache_get( $this->get_has_key( $path ), self::GROUP, false, $found );

		if ( $found ) {
			return $cached;
		}

		$has = $this->store->has( $path );

		wp_cache_set( $this->get_has_key( $path ), $has, self::GROUP, self::TTL );

		return $has;
	}

	/**
	 * Only return the optimization if the analysis data is newer than the post's last modified
	 * date.
	 *
	 * @param Path $path The path object associated with the stored data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( Path $path ): ?WebsiteAnalysis {
		$cached = wp_cache_get( $this->get_key( $path ), self::GROUP );

		if ( $cached instanceof WebsiteAnalysis ) {
			return $cached;
		}

		$analysis = $this->store->get( $path );

		if ( $analysis ) {
			wp_cache_set( $this->get_key( $path ), $analysis, self::GROUP, self::TTL );
			wp_cache_set( $this->get_has_key( $path ), true, self::GROUP, self::TTL );
		}

		return $analysis;
	}

	/**
	 * Set the optimization data for a post.
	 *
	 * @param Path            $path The path object associated with the stored data.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( Path $path, WebsiteAnalysis $analysis ): bool {
		$result = $this->store->set( $path, $analysis );

		if ( $result ) {
			wp_cache_set( $this->get_key( $path ), $analysis, self::GROUP, self::TTL );
		}

		return $result;
	}

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param Path $path The path object associated with the stored data.
	 *
	 * @return bool
	 */
	public function delete( Path $path ): bool {
		wp_cache_delete( $this->get_key( $path ), self::GROUP );
		wp_cache_delete( $this->get_has_key( $path ), self::GROUP );

		return $this->store->delete( $path );
	}

	/**
	 * Build a cache key.
	 *
	 * @param Path $path The path object.
	 *
	 * @return string
	 */
	public function get_key( Path $path ): string {
		return sprintf( 'kb_optimizer_url_%s', $path->hash() );
	}

	/**
	 * Get the cache key for if optimization data exists.
	 *
	 * @param Path $path The path object.
	 *
	 * @return string
	 */
	public function get_has_key( Path $path ): string {
		return sprintf( '%s_%s', $this->get_key( $path ), '_has' );
	}
}
