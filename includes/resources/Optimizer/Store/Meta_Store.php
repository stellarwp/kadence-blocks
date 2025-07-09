<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;

/**
 * Meta Store for optimization data implementation.
 */
final class Meta_Store implements Store {

	public const KEY = '_kb_optimizer';

	/**
	 * Get the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return WebsiteAnalysis|null
	 */
	public function get( int $post_id ): ?WebsiteAnalysis {
		$analysis = get_post_meta( $post_id, self::KEY, true );

		if ( ! $analysis ) {
			return null;
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
		$result = update_post_meta(
			$post_id,
			self::KEY,
			$analysis
		);

		// Don't return false if the value is the same.
		if ( false === $result ) {
			$current = $this->get( $post_id );


			return $current && $current->toArray() === $analysis->toArray();
		}

		return (bool) $result;
	}

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool {
		return delete_post_meta( $post_id, self::KEY );
	}
}
