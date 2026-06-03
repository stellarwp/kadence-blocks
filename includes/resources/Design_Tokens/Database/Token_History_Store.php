<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Database;

use KadenceWP\KadenceBlocks\Database\Query;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;

/**
 * The sole gateway to the kb_design_tokens_history table.
 *
 * Records the previous DTCG document for a token set on each save and reads it
 * back for the module's undo/audit surface. No component other than this store
 * should touch the table directly.
 *
 * It is wired to Token_Store's "saving" action by Provider, so every successful
 * document save (after the first, which has no prior state) leaves a snapshot
 * here. Writes append only — v1 keeps the full history and never prunes.
 *
 * @see Provider for the table binding and the saving-action subscription.
 * @see Token_Store::saving_action() for the signal this store reacts to.
 *
 * @since TBD
 */
final class Token_History_Store extends Query {

	/**
	 * The default token set slug, mirroring Token_Store's default.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function default_slug(): string {
		return Token_Store::default_slug();
	}

	/**
	 * Archive a previous document snapshot for a token set.
	 *
	 * Called once a save has overwritten the set's previous document, so the
	 * values passed are the ones that just left the live table, not the incoming
	 * save.
	 *
	 * @since TBD
	 *
	 * @param string $slug     The token set slug the snapshot belongs to.
	 * @param string $document The previous overrides-only DTCG JSON being archived.
	 * @param string $version  The version hash the snapshot had while it was current.
	 *
	 * @return void
	 *
	 * @throws DatabaseQueryException If the write fails.
	 */
	public function record( string $slug, string $document, string $version ): void {
		$this->qb()->insert(
			[
				'slug'       => $slug,
				'document'   => $document,
				'version'    => $version,
				'created_at' => current_time( 'mysql', true ),
			]
		);
	}

	/**
	 * The most recently archived snapshot for a token set, or null when none exist.
	 *
	 * This is the one-step-undo source: the document the set held immediately
	 * before its current value.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string,mixed>|null The snapshot row, or null when the set has
	 *                                  no history yet.
	 */
	public function latest( string $slug = '' ): ?array {
		$row = $this->qb()
					->where( 'slug', $slug === '' ? self::default_slug() : $slug )
					->orderBy( 'id', 'DESC' )
					->get( ARRAY_A );

		return is_array( $row ) ? $row : null;
	}

	/**
	 * A page of a token set's snapshots, newest first.
	 *
	 * @since TBD
	 *
	 * @param string $slug   The token set slug.
	 * @param int    $limit  Maximum rows to return.
	 * @param int    $offset Rows to skip, for pagination.
	 *
	 * @return array<int,array<string,mixed>> The snapshot rows, newest first.
	 */
	public function for_set( string $slug = '', int $limit = 50, int $offset = 0 ): array {
		$rows = $this->qb()
					->where( 'slug', $slug === '' ? self::default_slug() : $slug )
					->orderBy( 'id', 'DESC' )
					->limit( $limit )
					->offset( $offset )
					->getAll( ARRAY_A );

		return is_array( $rows ) ? $rows : [];
	}

	/**
	 * Count the snapshots stored for a token set.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return int
	 */
	public function count( string $slug = '' ): int {
		return (int) $this->qb()
						->where( 'slug', $slug === '' ? self::default_slug() : $slug )
						->count();
	}
}
