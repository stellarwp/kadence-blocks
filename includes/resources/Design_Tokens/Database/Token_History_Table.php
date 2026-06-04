<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\StellarWP\Schema\Tables\Contracts\Table;

/**
 * The Design Tokens history database table.
 *
 * Records the previous DTCG document for a token set each time it is saved, so
 * the module owns its own undo/audit trail of UI- and MCP-authored changes
 * rather than relying on WordPress revisions (which several managed hosts
 * disable). Each row is a point-in-time snapshot of the document that was about
 * to be overwritten — written by Token_History_Store in response to the
 * Token_Store "superseded" action.
 *
 * Like Token_Table, this holds authored user data, so it must NOT drop itself on
 * a schema change — the base class migration is non-destructive.
 *
 * @since TBD
 */
final class Token_History_Table extends Table {

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
	protected static $base_table_name = 'kb_design_tokens_history';

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
	protected static $schema_slug = 'design_tokens_history';

	/**
	 * @var string The field that uniquely identifies a row in the table.
	 *
	 * @since TBD
	 */
	protected static $uid_column = 'id';

	/**
	 * @inheritDoc
	 *
	 * The `slug` index is all that listing needs: in InnoDB a secondary index
	 * implicitly carries the primary key, so KEY(slug) is physically (slug, id).
	 * A "WHERE slug = ? ORDER BY id DESC" newest-first lookup is therefore served
	 * straight from that index with no extra sort. `id` is monotonic, so ordering
	 * by it is true insertion order — more reliable than created_at, which only
	 * has one-second resolution and can tie on rapid successive saves.
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
				slug VARCHAR(191) NOT NULL COMMENT 'Token set this snapshot belongs to, matching kb_design_tokens.slug',
				document LONGTEXT NOT NULL COMMENT 'The previous overrides-only DTCG JSON document, captured before it was overwritten',
				version VARCHAR(64) NOT NULL DEFAULT '' COMMENT 'The cache-busting version hash the snapshot had when it was current',
				created_at DATETIME NOT NULL COMMENT 'UTC timestamp the snapshot was archived (i.e. when the superseding save happened)',
				PRIMARY KEY  (id),
				KEY slug (slug)
			) {$charset_collate};
		";
	}
}
