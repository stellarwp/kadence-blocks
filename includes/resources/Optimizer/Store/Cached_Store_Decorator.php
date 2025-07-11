<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

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
	 * Only return the optimization if the analysis data is newer than the post's last modified
	 * date.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( int $post_id ): ?WebsiteAnalysis {
		$cached = wp_cache_get( $this->get_key( $post_id ), self::GROUP );

		if ( $cached instanceof WebsiteAnalysis ) {
			return $cached;
		}

		$analysis = $this->store->get( $post_id );

		if ( $analysis ) {
			wp_cache_set( $this->get_key( $post_id ), $analysis, self::GROUP, self::TTL );
		}

		return $analysis;
	}

	/**
	 * Set the optimization data for a post.
	 *
	 * @param int             $post_id The post ID to associate with the data.
	 * @param WebsiteAnalysis $analysis The website analysis data.
	 *
	 * @return bool
	 */
	public function set( int $post_id, WebsiteAnalysis $analysis ): bool {
		$result = $this->store->set( $post_id, $analysis );

		if ( $result ) {
			wp_cache_set( $this->get_key( $post_id ), $analysis, self::GROUP, self::TTL );
		}

		return $result;
	}

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool {
		wp_cache_delete( $this->get_key( $post_id ), self::GROUP );

		return $this->store->delete( $post_id );
	}

	/**
	 * Build a cache key.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return string
	 */
	public function get_key( int $post_id ): string {
		return sprintf( 'kb_optimizer_post_%d', $post_id );
	}
}
