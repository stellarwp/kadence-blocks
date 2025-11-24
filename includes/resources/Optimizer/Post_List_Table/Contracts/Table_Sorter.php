<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts;

use WP_Post;

/**
 * Sort a Post List Table by a custom table.
 *
 * @internal
 */
interface Table_Sorter {

	/**
	 * Reorder the posts for the Post List Table before they returned.
	 *
	 * @filter the_posts
	 *
	 * @param string    $order The sort order: ASC|DESC.
	 * @param WP_Post[] $posts The posts being listed.
	 *
	 * @return WP_Post[] The sorted posts, if applicable.
	 */
	public function sort( string $order, array $posts ): array;
}
