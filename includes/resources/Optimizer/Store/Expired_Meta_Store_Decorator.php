<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;

/**
 * A Meta Store Decorator that checks if the data is expired before
 * returning it.
 */
final class Expired_Meta_Store_Decorator implements Contracts\Store {

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
	 * Only return the optimization if the analysis data is newer than the post's last modified date.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( int $post_id ): ?WebsiteAnalysis {
		$analysis = $this->store->get( $post_id );

		if ( ! $analysis ) {
			return null;
		}

		$post_last_modified = get_post_datetime( $post_id, 'modified', 'gmt' );

		return $post_last_modified > $analysis->lastModified ? null : $analysis;
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
		return $this->store->set( $post_id, $analysis );
	}

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool {
		return $this->store->delete( $post_id );
	}
}
