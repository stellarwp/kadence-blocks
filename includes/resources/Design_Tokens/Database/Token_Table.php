<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\StellarWP\Schema\Tables\Contracts\Table;

/**
 * The Design Tokens database table.
 *
 * Stores the overrides-only DTCG document per token set. An empty (or absent)
 * document means the site renders entirely from the baseline tokens.
 *
 * Unlike the Optimizer tables, this holds authored user data, so it must NOT
 * drop itself on a schema change — the base class migration is non-destructive.
 *
 * @since TBD
 */
final class Token_Table extends Table {

	/**
	 * @var string The table schema version, bumped when get_definition() changes.
	 *
	 * @since TBD
	 */
	public const SCHEMA_VERSION = '1.0.0';

	/**
	 * @var string The base table name.
	 *
	 * @since TBD
	 */
	protected static $base_table_name = 'kb_design_tokens';

	/**
	 * @var string The organizational group this table belongs to.
	 *
	 * @since TBD
	 */
	protected static $group = 'kb';

	/**
	 * @var string|null The slug used to identify the custom table.
	 *
	 * @since TBD
	 */
	protected static $schema_slug = 'design_tokens';

	/**
	 * @var string The field that uniquely identifies a row in the table.
	 *
	 * @since TBD
	 */
	protected static $uid_column = 'id';

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	protected function get_definition(): string {
		global $wpdb;
		$table_name      = self::table_name();
		$charset_collate = $wpdb->get_charset_collate();

		return "
			CREATE TABLE `$table_name` (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary key',
				slug VARCHAR(191) NOT NULL COMMENT 'Token set identifier, e.g. \"default\". Unique per set to allow future multi-brand support',
				title VARCHAR(191) NOT NULL DEFAULT '' COMMENT 'Human-readable label for the token set',
				document LONGTEXT NOT NULL COMMENT 'The overrides-only DTCG JSON document. Empty means render entirely from baseline',
				version VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'Per-write cache-busting hash, regenerated on every write',
				updated_at DATETIME NOT NULL COMMENT 'UTC timestamp of the last write',
				PRIMARY KEY  (id),
				UNIQUE KEY slug (slug)
			) {$charset_collate};
		";
	}
}
