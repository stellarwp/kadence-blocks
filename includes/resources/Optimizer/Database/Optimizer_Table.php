<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Database;

use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use KadenceWP\KadenceBlocks\StellarWP\Schema\Tables\Contracts\Table;

/**
 * The optimizer database table to store optimizer data.
 */
final class Optimizer_Table extends Table {

	public const SCHEMA_VERSION = '2.0.4';

	/**
	 * @var string The base table name.
	 */
	protected static $base_table_name = 'kb_optimizer';

	/**
	 * @var string The organizational group this table belongs to.
	 */
	protected static $group = 'kb';

	/**
	 * @var string|null The slug used to identify the custom table.
	 */
	protected static $schema_slug = 'optimizer';

	/**
	 * @var string The field that uniquely identifies a row in the table.
	 */
	protected static $uid_column = 'path_hash';

	/**
	 * Overload the update method to first drop the database as this is a temporary table.
	 *
	 * @throws DatabaseQueryException If any of the queries fail.
	 *
	 * @return string[]
	 */
	public function update() {
		if ( $this->exists() ) {
			$this->drop();
		}

		return parent::update();
	}

	/**
	 * @inheritDoc
	 */
	protected function get_definition(): string {
		global $wpdb;
		$table_name      = self::table_name();
		$charset_collate = $wpdb->get_charset_collate();

		return "
			CREATE TABLE `$table_name` (
		    path_hash CHAR(64) PRIMARY KEY COMMENT 'SHA-256 hash of the relative path of the URL used as a unique key for fast lookups',
		    path TEXT NOT NULL COMMENT 'The relative path of the URL, stored for reference and debugging',
		    analysis LONGTEXT NOT NULL COMMENT 'Serialized or JSON-encoded analysis data associated with the path'
		) {$charset_collate};
		";
	}
}
