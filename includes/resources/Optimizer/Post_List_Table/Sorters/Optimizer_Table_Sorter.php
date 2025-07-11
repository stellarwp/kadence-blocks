<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Query;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Table_Sorter;

/**
 * Order the admin Post List Table by the Kadence Optimizer column.
 */
final class Optimizer_Table_Sorter implements Table_Sorter {

	private Optimizer_Query $query;

	public function __construct( Optimizer_Query $query ) {
		$this->query = $query;
	}

	/**
	 * Order by if the post_id exists or not in the optimizer table if
	 * it was requested that we order by that column.
	 *
	 * @filter posts_orderby
	 *
	 * @param string $order The requested sort order: ASC|DESC.
	 *
	 * @throws InvalidArgumentException If an invalid sort order is passed.
	 *
	 * @return string
	 */
	public function orderby( string $order ): string {
		if ( $order !== 'ASC' && $order !== 'DESC' ) {
			throw new InvalidArgumentException(
				sprintf( 'Invalid sort order: %s. Must be either ASC or DESC.', $order )
			);
		}

		return "(optimizer.post_id IS NULL) {$order}";
	}

	/**
	 * Join the posts list table query on our optimizer query if it was requested
	 * that we order by that column.
	 *
	 * @filter posts_join_paged
	 */
	public function join(): string {
		global $wpdb;

		return sprintf(
			"LEFT JOIN `%s` optimizer ON optimizer.post_id = {$wpdb->posts}.ID",
			esc_sql( $this->query->table_with_prefix() )
		);
	}
}
