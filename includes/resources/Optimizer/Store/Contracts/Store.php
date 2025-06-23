<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Store\Contracts;

interface Store {

	/**
	 * Get the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return array
	 */
	public function get( int $post_id ): array;

	/**
	 * Set the optimization data for a post.
	 *
	 * @param int    $post_id The post ID to associate with the data.
	 * @param string $json The JSON optimization data to store.
	 *
	 * @return bool
	 */
	public function set( int $post_id, string $json ): bool;

	/**
	 * Delete the optimization data for a post.
	 *
	 * @param int $post_id The post ID associated with the data.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool;
}
