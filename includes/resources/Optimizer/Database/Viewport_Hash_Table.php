<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Database;

use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use KadenceWP\KadenceBlocks\StellarWP\Schema\Tables\Contracts\Table;

/**
 * Database table to store viewport-specific HTML hashes for each URL path.
 */
final class Viewport_Hash_Table extends Table {

	public const SCHEMA_VERSION = '1.0.4';

	/**
	 * @var string The base table name.
	 */
	protected static $base_table_name = 'kb_optimizer_viewport_hashes';

	/**
	 * @var string The organizational group this table belongs to.
	 */
	protected static $group = 'kb';

	/**
	 * @var string|null The slug used to identify the custom table.
	 */
	protected static $schema_slug = 'viewport_hashes';

	/**
	 * @var string[] The fields that uniquely identify a row in the table (composite key).
	 */
	protected static $uid_column = 'path_hash';

	/**
	 * Overload the update method to drop the database first (optional, like your Optimizer_Table).
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

		// Build a 'desktop', 'mobile' ENUM input.
		$enum_values = sprintf( "'%s', '%s'", Viewport::desktop()->value(), Viewport::mobile()->value() );

		return "
			CREATE TABLE `$table_name` (
				path_hash CHAR(64) NOT NULL COMMENT 'SHA-256 hash of the path (via \$wp->request), identifies the URL',
				viewport ENUM($enum_values) NOT NULL COMMENT 'The viewport/device identifier',
				html_hash VARCHAR(512) NOT NULL COMMENT 'A composite of hashes separated by | in a key\:SHA-256 value of the HTML markup for this viewport',
				PRIMARY KEY (path_hash, viewport),
				KEY idx_html_hash (html_hash)
			) {$charset_collate};
		";
	}
}
