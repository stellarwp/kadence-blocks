<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Sort_Strategy;
use WP_Query;

/**
 * Sort by a meta key, including if the key does not or does exist.
 */
final class Meta_Sort_Exists implements Sort_Strategy {

	/**
	 * @var string[]
	 */
	private array $secondary_order_fields;

	/**
	 * @param string[] $secondary_order_fields The field names to order by after the meta value.
	 */
	public function __construct(
		array $secondary_order_fields = [
			'title',
		]
	) {
		$this->secondary_order_fields = $secondary_order_fields;
	}

	/**
	 * Sort a column by whether a meta key exists or not.
	 *
	 * @filter pre_get_posts
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

		// Ensure we don't filter out all posts that don't have the value.
		$query->set(
			'meta_query',
			[
				'relation' => 'OR',
				[
					'key'     => $column->meta_key,
					'compare' => 'NOT EXISTS',
				],
				[
					'key'     => $column->meta_key,
					'compare' => 'EXISTS',
				],
			]
		);

		// Order by meta_value and tack on any secondary fields.
		$query->set(
			'orderby',
			trim(
				sprintf(
					'meta_value %s',
					implode( ' ', $this->secondary_order_fields )
				)
			)
		);
	}
}
