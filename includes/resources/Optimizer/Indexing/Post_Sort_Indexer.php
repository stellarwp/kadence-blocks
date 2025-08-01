<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Indexing;

/**
 * Index optimization data in Post Meta so we'll be able to sort
 * the post list table by it.
 */
final class Post_Sort_Indexer {

	public const KEY = '_kb_has_optimizer_data';

	/**
	 * Determine if this post is indexed.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function get( int $post_id ): bool {
		return (bool) get_post_meta( $post_id, self::KEY, true );
	}

	/**
	 * Index the post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function set( int $post_id ): bool {
		return (bool) update_post_meta( $post_id, self::KEY, true );
	}

	/**
	 * Delete the indexer status.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool
	 */
	public function delete( int $post_id ): bool {
		return delete_post_meta( $post_id, self::KEY );
	}
}
