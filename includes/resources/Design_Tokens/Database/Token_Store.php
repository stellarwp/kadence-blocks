<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\Database\Query;

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
 */
final class Token_Store extends Query {

	/**
	 * Fires after any write so projectors and caches can react.
	 */
	public const CHANGED_ACTION = 'kadence_blocks_design_tokens_changed';

	/**
	 * The default token set slug. v1 ships a single set under this slug.
	 */
	public const DEFAULT_SLUG = 'default';

	/**
	 * Read the raw overrides-only DTCG document for a token set.
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
	 * @param string $document The raw overrides-only DTCG JSON to persist.
	 * @param string $slug     The token set slug.
	 * @param string $title    Optional human-readable label. Left untouched on
	 *                         update when an empty string is passed.
	 *
	 * @return bool True on a successful write, false if the write failed (in
	 *              which case the change action does NOT fire).
	 */
	public function save_document( string $document, string $slug = self::DEFAULT_SLUG, string $title = '' ): bool {
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
		// slug then makes the loser fail (caught by the === false guard below).
		// Fine for admin-driven single-set saves in v1; revisit if writes ever
		// become concurrent.
		$result = $this->qb()->upsert( $data, [ 'slug' ] );

		if ( $result === false ) {
			return false;
		}

		$this->changed( $slug );

		return true;
	}

	/**
	 * Re-hash a token set's version to bust caches without changing its document.
	 *
	 * No-op when the set does not exist — there is nothing cached to invalidate.
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return bool True when the version was bumped, false if the set does not
	 *              exist or the write failed (the change action does NOT fire).
	 */
	public function bump_version( string $slug = self::DEFAULT_SLUG ): bool {
		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		if ( $row === null ) {
			return false;
		}

		$result = $this->qb()
			->where( 'slug', $slug )
			->update(
				[
					'version'    => $this->hash_document( (string) $row['document'] ),
					'updated_at' => current_time( 'mysql', true ),
				]
			);

		if ( $result === false ) {
			return false;
		}

		$this->changed( $slug );

		return true;
	}

	/**
	 * Derive a content-based, cache-busting version hash.
	 *
	 * The microtime() salt guarantees the hash changes on every write, so repeated
	 * saves (and document-less version bumps) always invalidate downstream caches.
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
