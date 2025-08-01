<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use WP_Query;

/**
 * The sort strategy to use for when a column is sorted.
 */
interface Sort_Strategy {

	/**
	 * Modify WP_Query to sort by this column.
	 *
	 * @action pre_get_posts
	 *
	 * @param WP_Query $query
	 * @param Column   $column
	 *
	 * @return void
	 */
	public function sort( WP_Query $query, Column $column ): void;
}
