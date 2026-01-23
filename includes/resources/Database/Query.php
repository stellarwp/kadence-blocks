<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Database;

use KadenceWP\KadenceBlocks\StellarWP\DB\DB;
use KadenceWP\KadenceBlocks\StellarWP\DB\QueryBuilder\QueryBuilder;

/**
 * A query wrapper for the StellarWP DB instance using a specific
 * table.
 *
 * This class should be extended and configured for a specific table
 * via a Provider.
 */
abstract class Query {

	/**
	 * The WordPress table name without a prefix.
	 *
	 * @var string
	 */
	protected string $table;

	/**
	 * @param string $table The WordPress table name without a prefix.
	 */
	public function __construct( string $table ) {
		$this->table = $table;
	}

	/**
	 * Get the current table being used.
	 *
	 * @return string
	 */
	public function table(): string {
		return $this->table;
	}

	/**
	 * Get the table name with prefix.
	 *
	 * @return string
	 */
	public function table_with_prefix(): string {
		global $wpdb;

		return $wpdb->prefix . $this->table;
	}

	/**
	 * Get the query builder for this table.
	 *
	 * @return QueryBuilder
	 */
	public function qb(): QueryBuilder {
		return DB::table( $this->table );
	}

	/**
	 * Wrapper for wpdb::get_var
	 *
	 * @see \wpdb::get_var()
	 *
	 * @param string|null $query Optional. SQL query. Defaults to null, use the result from the
	 *     previous query.
	 * @param int         $x Optional. Column of value to return. Indexed from 0. Default 0.
	 * @param int         $y Optional. Row of value to return. Indexed from 0. Default 0.
	 *
	 * @return string|null
	 */
	public function get_var( ?string $query = null, int $x = 0, int $y = 0 ): ?string {
		return DB::get_var( $query, $x, $y );
	}
}
