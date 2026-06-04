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
 * It is wired to Token_Store's "superseded" action by Provider, so every successful
 * document save (after the first, which has no prior state) leaves a snapshot
 * here. Each archive then prunes the set's trail to the most-recent N snapshots
 * (default 5), tunable per set via the kadence_blocks_design_tokens_history_limit
 * filter; a non-positive limit disables pruning and keeps the full trail.
 *
 * @see Provider for the table binding and the superseded-action subscription.
 * @see Token_Store::superseded_action() for the signal this store reacts to.
 *
 * @since TBD
 */
final class Token_History_Store extends Query {

	/**
	 * @var int The number of most-recent snapshots kept per token set before the
	 *          oldest are pruned. The shipped default; override via the
	 *          kadence_blocks_design_tokens_history_limit filter.
	 *
	 * @since TBD
	 */
	private const DEFAULT_HISTORY_LIMIT = 5;

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
	 * The shipped per-set history retention limit, before any filtering.
	 *
	 * @since TBD
	 *
	 * @return int
	 */
	public static function default_history_limit(): int {
		return self::DEFAULT_HISTORY_LIMIT;
	}

	/**
	 * Archive a previous document snapshot for a token set.
	 *
	 * Called once a save has overwritten the set's previous document, so the
	 * values passed are the ones that just left the live table, not the incoming
	 * save. After the snapshot is stored, the set's trail is pruned to its
	 * retention limit.
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

		$this->prune( $slug );
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

	/**
	 * Prune a token set's trail to its retention limit, deleting the oldest
	 * surplus snapshots so only the most-recent N remain.
	 *
	 * Done in two index-only queries against KEY(slug) — which InnoDB stores as
	 * (slug, id): first find the id of the Nth-newest row (the oldest snapshot we
	 * keep), then delete everything older for that slug. A single
	 * "DELETE ... LIMIT" can't express "all but the newest N" — MySQL's DELETE
	 * takes LIMIT count, not LIMIT offset, count — and a self-referencing subquery
	 * delete is rejected, so the boundary id is resolved first.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug to prune.
	 *
	 * @return void
	 *
	 * @throws DatabaseQueryException If the delete fails.
	 */
	private function prune( string $slug ): void {
		$limit = $this->history_limit( $slug );

		// A non-positive limit disables pruning — keep the full trail.
		if ( $limit < 1 ) {
			return;
		}

		// The oldest snapshot to keep: the Nth-newest row. With fewer than $limit
		// rows the offset overshoots and this returns null, so nothing is pruned.
		$cutoff = $this->qb()
						->select( 'id' )
						->where( 'slug', $slug )
						->orderBy( 'id', 'DESC' )
						->limit( 1 )
						->offset( $limit - 1 )
						->get( ARRAY_A );

		if ( ! is_array( $cutoff ) || ! isset( $cutoff['id'] ) ) {
			return;
		}

		$this->qb()
			->where( 'slug', $slug )
			->where( 'id', (int) $cutoff['id'], '<' )
			->delete();
	}

	/**
	 * The retention limit for a token set's history: how many of the most-recent
	 * snapshots to keep. A non-positive return disables pruning.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug the limit applies to.
	 *
	 * @return int
	 */
	private function history_limit( string $slug ): int {
		/**
		 * Filters how many design-token history snapshots are kept per token set.
		 *
		 * Return 0 or a negative number to disable pruning and keep the full trail.
		 *
		 * @since TBD
		 *
		 * @param int    $limit The number of most-recent snapshots to retain. Default 5.
		 * @param string $slug  The token set slug being pruned.
		 */
		return (int) apply_filters( 'kadence_blocks_design_tokens_history_limit', self::DEFAULT_HISTORY_LIMIT, $slug );
	}
}
