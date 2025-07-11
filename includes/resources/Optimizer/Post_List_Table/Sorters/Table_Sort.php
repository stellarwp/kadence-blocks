<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Table_Sorter;
use WP_Query;

/**
 * The entry point to sort a Post List Table by a custom table that has some
 * guards before it passes it to the underlying Table Sorter to update
 * the SQL to sort by a custom database table.
 */
final class Table_Sort {

	/**
	 * The column to sort for.
	 *
	 * @var Column
	 */
	private Column $column;

	/**
	 * The Table Sorter strategy to use to sort/join.
	 *
	 * @var Table_Sorter
	 */
	private Table_Sorter $sorter;

	public function __construct( Column $column, Table_Sorter $sorter ) {
		$this->column = $column;
		$this->sorter = $sorter;
	}

	/**
	 * Use the Table Sorter Strategy to update the orderby SQL.
	 *
	 * @filter posts_orderby
	 *
	 * @param string   $order_by
	 * @param WP_Query $query
	 *
	 * @return string
	 */
	public function orderby( string $order_by, WP_Query $query ): string {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return $order_by;
		}

		if ( $query->get( 'orderby' ) !== $this->column->slug ) {
			return $order_by;
		}

		$order = strtoupper( $query->get( 'order' ) ) === 'DESC' ? 'DESC' : 'ASC';

		return $this->sorter->orderby( $order );
	}

	/**
	 * Use the Table Sorter Strategy to update the join SQL.
	 *
	 * @filter posts_join_paged
	 *
	 * @param string   $join
	 * @param WP_Query $query
	 *
	 * @return string
	 */
	public function join( string $join, WP_Query $query ): string {
		if ( ! is_admin() || ! $query->is_main_query() ) {
			return $join;
		}

		if ( $query->get( 'orderby' ) !== $this->column->slug ) {
			return $join;
		}

		return $this->sorter->join();
	}
}
