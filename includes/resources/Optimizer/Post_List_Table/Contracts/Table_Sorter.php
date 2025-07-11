<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts;

use InvalidArgumentException;

/**
 * Sort a Post List Table by a custom table.
 */
interface Table_Sorter {

	/**
	 * Get the order by SQL for a custom table.
	 *
	 * @filter posts_orderby
	 *
	 * @param string $order The requested sort order: ASC|DESC.
	 *
	 * @throws InvalidArgumentException If an invalid sort order is passed.
	 *
	 * @return string
	 */
	public function orderby( string $order ): string;

	/**
	 * Get the join SQL or a custom table.
	 *
	 * @filter posts_join_paged
	 *
	 * @return string
	 */
	public function join(): string;
}
