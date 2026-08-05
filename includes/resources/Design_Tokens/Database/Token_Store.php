<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\Database\Query;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * The sole gateway to the kb_design_tokens table.
 *
 * Stores the overrides-only DTCG document per token library. An empty (or absent)
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
	 * @var string Action fired after a save overwrites a library's existing document,
	 *             carrying the now-previous document so the history store can
	 *             archive it. Fires only on a successful write to a library that
	 *             already existed — first saves have no prior state to keep, and a
	 *             failed write throws before this is reached, so nothing is
	 *             archived for a save that did not happen.
	 *
	 * @since TBD
	 */
	private const SUPERSEDED_ACTION = 'kadence_blocks_design_tokens_superseded';

	/**
	 * @var string Action fired after a library's row is deleted, carrying the slug, so
	 *             consumers (the history store) can drop the library's related state.
	 *
	 * @since TBD
	 */
	private const DELETED_ACTION = 'kadence_blocks_design_tokens_deleted';

	/**
	 * @var string The default token library slug, the always-present canonical library.
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
	 * The action hook that fires after a save overwrites a library's existing document.
	 *
	 * Subscribers receive the slug plus the now-previous document and version, for
	 * callers (the history store) that archive state once a save has committed.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function superseded_action(): string {
		return self::SUPERSEDED_ACTION;
	}

	/**
	 * The action hook that fires after a library's row is deleted, for callers that need to drop a
	 * library's related state once it is gone.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function deleted_action(): string {
		return self::DELETED_ACTION;
	}

	/**
	 * The default token library slug.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function default_slug(): string {
		return self::DEFAULT_SLUG;
	}

	/**
	 * Read the raw overrides-only DTCG document for a token library.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string The raw DTCG JSON, or an empty string when no row exists
	 *                (caller should then render entirely from baseline).
	 */
	public function get_document( string $slug = self::DEFAULT_SLUG ): string {
		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		if ( ! is_array( $row ) ) {
			return '';
		}

		return (string) ( $row['document'] ?? '' );
	}

	/**
	 * Read the cache-busting version hash for a token library.
	 *
	 * Consumed by downstream caches (e.g. the projected-CSS string is keyed on
	 * this value) to know when a token library has changed.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string The stored version hash, or an empty string when no row
	 *                exists (i.e. the library renders from baseline).
	 */
	public function get_version( string $slug = self::DEFAULT_SLUG ): string {
		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		if ( ! is_array( $row ) ) {
			return '';
		}

		return (string) ( $row['version'] ?? '' );
	}

	/**
	 * Read the human-readable label for a token library.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string The stored title, or an empty string when no row exists or none was ever set.
	 */
	public function get_title( string $slug = self::DEFAULT_SLUG ): string {
		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		if ( ! is_array( $row ) ) {
			return '';
		}

		return (string) ( $row['title'] ?? '' );
	}

	/**
	 * Insert or update a token library's document, bump its version and signal change.
	 *
	 * @since TBD
	 *
	 * @param string $document The raw overrides-only DTCG JSON to persist.
	 * @param string $slug     The token library slug.
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
		// Capture the row before the upsert overwrites it, so its document can be
		// archived once the save succeeds. Only a pre-existing row has prior state
		// worth keeping — a first save has nothing to archive.
		$previous = $this->qb()
						->where( 'slug', $slug )
						->get( ARRAY_A );

		$data = $this->build_document_data( $document, $title, $slug );

		// upsert() is a non-atomic SELECT-then-INSERT/UPDATE, not an atomic
		// INSERT ... ON DUPLICATE KEY. Two concurrent first-writes for the same
		// slug can both miss the SELECT and race to INSERT; the UNIQUE KEY on
		// slug then makes the loser throw DatabaseQueryException. Fine for
		// admin-driven single-library saves in v1; revisit if writes become concurrent.
		$this->qb()->upsert( $data, [ 'slug' ] );

		// Everything below is reached only on a successful write — a failed upsert
		// throws above, so nothing is archived and no change is signalled for a
		// save that did not happen.
		if ( is_array( $previous ) ) {
			$this->superseded( $slug, (string) ( $previous['document'] ?? '' ), (string) ( $previous['version'] ?? '' ) );
		}

		$this->changed( $slug );
	}

	/**
	 * Write a document only when the stored version matches expected_version.
	 *
	 * First write: expected_version must be an empty string; the row must not yet exist.
	 * Subsequent writes: expected_version must match the current stored version.
	 *
	 * Returns true on success, false on version mismatch (caller maps to 409).
	 * Throws DatabaseQueryException on a real write failure.
	 *
	 * @since TBD
	 *
	 * @param string $document         The raw DTCG JSON to persist.
	 * @param string $expected_version The version the caller last read. Empty for first write.
	 * @param string $slug             The token library slug.
	 * @param string $title            Optional label; left untouched when empty.
	 *
	 * @return bool True on success; false when the version does not match.
	 *
	 * @throws DatabaseQueryException If the write fails.
	 */
	public function save_document_conditional(
		string $document,
		string $expected_version,
		string $slug = self::DEFAULT_SLUG,
		string $title = ''
	): bool {
		$previous = $this->qb()
						->where( 'slug', $slug )
						->get( ARRAY_A );

		if ( ! is_array( $previous ) ) {
			// First write — expected_version must be empty.
			if ( $expected_version !== '' ) {
				return false;
			}

			$data = $this->build_document_data( $document, $title, $slug );

			try {
				$this->qb()->insert( $data );
			} catch ( DatabaseQueryException $e ) {
				// Duplicate-key on concurrent first write → conflict, not 500.
				return false;
			}

			$this->changed( $slug );

			return true;
		}

		// Subsequent write — must match.
		if ( Cast::to_string( $previous['version'] ?? '' ) !== $expected_version ) {
			return false;
		}

		$data = $this->build_document_data( $document, $title );

		// Conditional UPDATE: WHERE slug = ? AND version = ? prevents a concurrent overwrite.
		$affected = $this->qb()
						->where( 'slug', $slug )
						->where( 'version', $expected_version )
						->update( $data );

		// Zero affected rows means the version changed concurrently.
		if ( (int) $affected === 0 ) {
			return false;
		}

		$this->superseded( $slug, (string) ( $previous['document'] ?? '' ), $expected_version );
		$this->changed( $slug );

		return true;
	}

	/**
	 * Write a token library's human-readable label, touching nothing else.
	 *
	 * A title is metadata: it appears in the library picker and nowhere in any projection, so
	 * renaming a library must not travel through the document write path. Doing so would re-validate
	 * and re-resolve the entire stored document to change a label — turning a rename into a failure
	 * for any library whose stored document does not currently validate, for reasons that have
	 * nothing to do with the new name.
	 *
	 * Neither the version hash nor the change action moves here, for the same reason: no projector
	 * output depends on a title, so bumping the version would invalidate the projected-CSS cache for
	 * a change no visitor can see.
	 *
	 * @since TBD
	 *
	 * @param string $slug  The token library slug.
	 * @param string $title The new label. An empty string is rejected rather than treated as
	 *                      "leave the stored title alone", which is what the document write path
	 *                      does with an empty title — here, clearing is simply not an operation.
	 *
	 * @return bool True when the title was written.
	 *
	 * @throws DatabaseQueryException If the update fails.
	 */
	public function save_title( string $slug, string $title ): bool {
		if ( $title === '' ) {
			return false;
		}

		$existing = $this->qb()
						->where( 'slug', $slug )
						->get( ARRAY_A );

		if ( ! is_array( $existing ) ) {
			// The default library has no row until something is written to it, so naming it is that
			// first write. The empty document stored alongside the title is not a change of content —
			// it is exactly what the library already resolved to, since no row means "render from
			// baseline". Every other slug is rejected by the caller before reaching this point.
			try {
				$this->qb()->insert( $this->build_document_data( '', $title, $slug ) );
			} catch ( DatabaseQueryException $e ) {
				// Duplicate-key on a concurrent first write → the row now exists and carries someone
				// else's title; report the miss rather than a fatal.
				return false;
			}

			return true;
		}

		$this->qb()
			->where( 'slug', $slug )
			->update(
				[
					'title'      => $title,
					'updated_at' => current_time( 'mysql', true ),
				]
			);

		// Deliberately not gated on the affected-row count: MySQL reports zero rows affected when an
		// UPDATE sets a column to the value it already holds, which is a no-op, not a failure. A real
		// write failure throws instead.
		return true;
	}

	/**
	 * Delete a named token library only when the stored version matches expected_version.
	 *
	 * The default library is never row-deleted; use save_document_conditional with an empty
	 * document to reset it instead.
	 *
	 * Returns true on success, false on version mismatch or if slug is the default library.
	 *
	 * @since TBD
	 *
	 * @param string $slug             The named library slug.
	 * @param string $expected_version The version the caller last read.
	 *
	 * @return bool True on success; false on mismatch or default-library attempt.
	 *
	 * @throws DatabaseQueryException If the delete fails.
	 */
	public function delete_document_conditional( string $slug, string $expected_version ): bool {
		if ( $slug === self::DEFAULT_SLUG ) {
			return false;
		}

		$previous = $this->qb()
						->where( 'slug', $slug )
						->get( ARRAY_A );

		if ( ! is_array( $previous ) ) {
			return false;
		}

		if ( (string) ( $previous['version'] ?? '' ) !== $expected_version ) {
			return false;
		}

		$affected = $this->qb()
						->where( 'slug', $slug )
						->where( 'version', $expected_version )
						->delete();

		// Zero affected rows means the version changed concurrently.
		if ( (int) $affected === 0 ) {
			return false;
		}

		$this->deleted( $slug );

		return true;
	}

	/**
	 * Re-hash a token library's version to bust caches without changing its document.
	 *
	 * No-op when the library does not exist — there is nothing cached to invalidate.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
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

		if ( ! is_array( $row ) ) {
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
	 * List every stored token library, as its slug, title and version.
	 *
	 * The default library is not synthesized here: a library appears only once it has a row, so a site
	 * that has never written the default returns an empty list. Callers that must always surface the
	 * default (the REST collection) layer that invariant on top.
	 *
	 * @since TBD
	 *
	 * @return array<int,array{slug:string,title:string,version:string}> The libraries, ordered by slug.
	 */
	public function list_stores(): array {
		$rows = $this->qb()
					->select( 'slug', 'title', 'version' )
					->orderBy( 'slug', 'ASC' )
					->getAll( ARRAY_A );

		if ( ! is_array( $rows ) ) {
			return [];
		}

		return array_map(
			static fn( array $row ): array => [
				'slug'    => Cast::to_string( $row['slug'] ?? '' ),
				'title'   => Cast::to_string( $row['title'] ?? '' ),
				'version' => Cast::to_string( $row['version'] ?? '' ),
			],
			$rows
		);
	}

	/**
	 * Whether a token library has a stored row.
	 *
	 * A library with no row renders entirely from baseline; the default library may legitimately have no
	 * row yet, so callers that treat the default as always-known must account for that themselves.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return bool
	 */
	public function exists( string $slug ): bool {
		return is_array(
			$this->qb()
				->where( 'slug', $slug )
				->get( ARRAY_A )
		);
	}

	/**
	 * Delete a token library.
	 *
	 * The default library is the always-present canonical library and is never physically removed:
	 * deleting it clears its overrides back to baseline (the row stays). Any other library's row is
	 * dropped outright, which signals its removal so related state (its history) can be dropped too.
	 * Removing a library that does not exist is a no-op — there is nothing to remove and nothing to
	 * signal. This guard is enforced here so every caller is protected, not just the REST surface.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return void
	 *
	 * @throws DatabaseQueryException If the write fails. The deleted action only fires on a successful
	 *                                removal, since a failed write throws before deleted() is reached.
	 */
	public function delete( string $slug = self::DEFAULT_SLUG ): void {
		// The canonical library cannot be removed; clearing its overrides is the strongest delete it supports.
		if ( $slug === self::DEFAULT_SLUG ) {
			$this->save_document( '', $slug );

			return;
		}

		$row = $this->qb()
					->where( 'slug', $slug )
					->get( ARRAY_A );

		if ( ! is_array( $row ) ) {
			return;
		}

		$this->qb()
			->where( 'slug', $slug )
			->delete();

		// Reached only on a successful delete — a failed delete throws above.
		$this->deleted( $slug );
	}

	/**
	 * Build the document/version/updated_at/title column data shared by every write path.
	 *
	 * @since TBD
	 *
	 * @param string      $document The raw DTCG JSON to persist.
	 * @param string      $title    Optional label. Omitted from the array (not just left
	 *                              empty) when blank, so a document-only write does not
	 *                              wipe an existing title.
	 * @param string|null $slug     The slug to include for an insert/upsert, or null to
	 *                              omit it for an UPDATE that is already scoped by a
	 *                              WHERE clause.
	 *
	 * @return array<string,string> The column data, ready for insert(), upsert(), or update().
	 */
	private function build_document_data( string $document, string $title, ?string $slug = null ): array {
		$data = [
			'document'   => $document,
			'version'    => $this->hash_document( $document ),
			'updated_at' => current_time( 'mysql', true ),
		];

		if ( $slug !== null ) {
			$data = [ 'slug' => $slug ] + $data;
		}

		if ( $title !== '' ) {
			$data['title'] = $title;
		}

		return $data;
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
	 * Signal that a token library changed so projectors and caches can react.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug that changed.
	 *
	 * @return void
	 */
	private function changed( string $slug ): void {
		/**
		 * Fires after a design token library is written.
		 *
		 * @param string $slug The token library slug that changed.
		 */
		do_action( self::CHANGED_ACTION, $slug );
	}

	/**
	 * Signal that a save overwrote a library's existing document, carrying its prior state.
	 *
	 * Fires after a successful upsert so a subscriber can archive the document
	 * that was just replaced (the history store), with the captured prior values.
	 *
	 * @since TBD
	 *
	 * @param string $slug     The token library slug that was overwritten.
	 * @param string $document The now-previous document that was replaced.
	 * @param string $version  The now-previous version hash.
	 *
	 * @return void
	 */
	private function superseded( string $slug, string $document, string $version ): void {
		/**
		 * Fires immediately after a design token library's existing document is overwritten.
		 *
		 * @param string $slug     The token library slug that was overwritten.
		 * @param string $document The now-previous document that was replaced.
		 * @param string $version  The now-previous version hash.
		 */
		do_action( self::SUPERSEDED_ACTION, $slug, $document, $version );
	}

	/**
	 * Signal that a token library's row was deleted so consumers can drop its related state.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug that was deleted.
	 *
	 * @return void
	 */
	private function deleted( string $slug ): void {
		/**
		 * Fires after a design token library's row is deleted.
		 *
		 * @param string $slug The token library slug that was deleted.
		 */
		do_action( self::DELETED_ACTION, $slug );
	}
}
