<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store;

use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;

/**
 * Meta Store for optimization data implementation.
 */
final class Meta_Store implements Store {

	public const KEY = '_kadence_blocks_optimizer';

	/**
	 * Get the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return array
	 */
	public function get( int $post_id ): array {
		$data = get_post_meta( $post_id, self::KEY, true );

		if ( ! $data ) {
			return [];
		}

		return (array) $data;
	}

	/**
	 * Set the optimization data for a post.
	 *
	 * @param int    $post_id The post ID to associate with the data.
	 * @param string $json The JSON optimization data to store.
	 *
	 * @return bool
	 */
	public function set( int $post_id, string $json ): bool {
		return (bool) update_post_meta(
			$post_id,
			self::KEY,
			json_decode( $json, true )
		);
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
