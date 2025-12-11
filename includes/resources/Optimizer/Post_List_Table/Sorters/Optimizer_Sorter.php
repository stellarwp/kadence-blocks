<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Sort_Strategy;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use WP_Query;

/**
 * Custom column sorting strategy for the Kadence Optimizer.
 */
final class Optimizer_Sorter implements Sort_Strategy {

	/**
	 * Custom column sorter for the Kadence Optimizer.
	 *
	 * Uses integer status values that sort naturally:
	 * - ASC:  Excluded (-1) > Not Optimized (0) > Optimized (1) > Stale (2)
	 * - DESC: Stale (2) > Optimized (1) > Not Optimized (0) > Excluded (-1)
	 *
	 * @filter pre_get_posts
	 *
	 * @see Status
	 *
	 * @param WP_Query $query
	 * @param Column   $column
	 *
	 * @return void
	 */
	public function sort( WP_Query $query, Column $column ): void {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return;
		}

		if ( $query->get( 'orderby' ) !== $column->slug ) {
			return;
		}

		$order = strtoupper( (string) $query->get( 'order' ) ?: 'DESC' );

		// Only published posts can be worked with, so hide the rest when sorting.
		$query->set( 'post_status', 'publish' );

		add_filter(
			'posts_clauses',
			static function ( array $clauses ) use ( $order, $column ): array {
				global $wpdb;

				// Join optimizer status meta - single meta key for all states.
				$clauses['join'] .= $wpdb->prepare(
					" LEFT JOIN $wpdb->postmeta AS pm_optimizer_status
					ON ($wpdb->posts.ID = pm_optimizer_status.post_id AND pm_optimizer_status.meta_key = %s)",
					$column->meta_key
				);

				// Sort by status value (defaults to 0 for unoptimized posts).
				$clauses['orderby'] = sprintf(
					'CAST(IFNULL(pm_optimizer_status.meta_value, 0) AS SIGNED) %s',
					$order
				);

				$clauses['distinct'] = 'DISTINCT';

				return $clauses;
			}
		);
	}
}
