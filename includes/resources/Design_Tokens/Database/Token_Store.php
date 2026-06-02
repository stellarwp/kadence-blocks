<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\Database\Query;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;

/**
 * The sole gateway to the kb_design_tokens table.
 *
 * Stores the overrides-only DTCG document per token set. An empty (or absent)
 * row means the site renders entirely from baseline. No component other than
 * this store should touch the table directly.
 *
 * Validation (JSON Schema, Resolver dry-run) is deliberately NOT done here — it
 * belongs to the REST layer. This store only persists and signals change.
 *
 * @see Provider for the table binding.
 *
 * @since TBD
 */
final class Token_Store extends Query {

	/**
	 * @var string Action fired after any write so projectors and caches can react.
	 *
	 * @since TBD
	 */
	private const CHANGED_ACTION = 'kadence_blocks_design_tokens_changed';

	/**
	 * @var string The default token set slug. v1 ships a single set under this slug.
	 *
	 * @since TBD
	 */
	private const DEFAULT_SLUG = 'default';

	/**
	 * The action hook that fires after any write, for callers that need to react to changes.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function changed_action(): string {
		return self::CHANGED_ACTION;
	}

	/**
	 * The default token set slug.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function default_slug(): string {
		return self::DEFAULT_SLUG;
	}

	/**
	 * Read the raw overrides-only DTCG document for a token set.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return string The raw DTCG JSON, or an empty string when no row exists
	 *                (caller should then render entirely from baseline).
	 */
	public function get_document( string $slug = self::DEFAULT_SLUG ): string {
		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		return $row['document'] ?? '';
	}

	/**
	 * Read the cache-busting version hash for a token set.
	 *
	 * Consumed by downstream caches (e.g. the theme.json preset array is keyed on
	 * this value) to know when a token set has changed.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return string The stored version hash, or an empty string when no row
	 *                exists (i.e. the set renders from baseline).
	 */
	public function get_version( string $slug = self::DEFAULT_SLUG ): string {
		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		return $row['version'] ?? '';
	}

	/**
	 * Insert or update a token set's document, bump its version and signal change.
	 *
	 * @since TBD
	 *
	 * @param string $document The raw overrides-only DTCG JSON to persist.
	 * @param string $slug     The token set slug.
	 * @param string $title    Optional human-readable label. Left untouched on
	 *                         update when an empty string is passed.
	 *
	 * @return void
	 *
	 * @throws DatabaseQueryException If the write fails. The change action only
	 *                                fires on success, since a failed write
	 *                                throws before changed() is reached.
	 */
	public function save_document( string $document, string $slug = self::DEFAULT_SLUG, string $title = '' ): void {
		$data = [
			'slug'       => $slug,
			'document'   => $document,
			'version'    => $this->hash_document( $document ),
			'updated_at' => current_time( 'mysql', true ),
		];

		// Only write the title when provided, so a document-only save doesn't wipe it.
		if ( $title !== '' ) {
			$data['title'] = $title;
		}

		// upsert() is a non-atomic SELECT-then-INSERT/UPDATE, not an atomic
		// INSERT ... ON DUPLICATE KEY. Two concurrent first-writes for the same
		// slug can both miss the SELECT and race to INSERT; the UNIQUE KEY on
		// slug then makes the loser throw DatabaseQueryException. Fine for
		// admin-driven single-set saves in v1; revisit if writes become concurrent.
		$this->qb()->upsert( $data, [ 'slug' ] );

		// Reached only on a successful write — a failed write throws above.
		$this->changed( $slug );
	}

	/**
	 * Re-hash a token set's version to bust caches without changing its document.
	 *
	 * No-op when the set does not exist — there is nothing cached to invalidate.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return void
	 *
	 * @throws DatabaseQueryException If the write fails. The change action only
	 *                                fires on success, since a failed write
	 *                                throws before changed() is reached.
	 */
	public function bump_version( string $slug = self::DEFAULT_SLUG ): void {
		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		if ( $row === null ) {
			return;
		}

		$this->qb()
			->where( 'slug', $slug )
			->update(
				[
					'version'    => $this->hash_document( (string) $row['document'] ),
					'updated_at' => current_time( 'mysql', true ),
				]
			);

		// Reached only on a successful write — a failed write throws above.
		$this->changed( $slug );
	}

	/**
	 * Derive a content-based, cache-busting version hash.
	 *
	 * The microtime() salt guarantees the hash changes on every write, so repeated
	 * saves (and document-less version bumps) always invalidate downstream caches.
	 *
	 * @since TBD
	 *
	 * @param string $document The document the hash is derived from.
	 *
	 * @return string A 32-character hash.
	 */
	private function hash_document( string $document ): string {
		return md5( $document . microtime() );
	}

	/**
	 * Signal that a token set changed so projectors and caches can react.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug that changed.
	 *
	 * @return void
	 */
	private function changed( string $slug ): void {
		/**
		 * Fires after a design token set is written.
		 *
		 * @param string $slug The token set slug that changed.
		 */
		do_action( self::CHANGED_ACTION, $slug );
	}
}
