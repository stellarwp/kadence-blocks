<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

/**
 * Applies a library's stored tokenOrder to a set of token rows.
 *
 * The permutation every surface that lists tokens shares: rows whose id appears in the flat stored
 * list come first, sorted by their position in it; every remaining row follows in the order it was
 * handed over (declaration / registry order). Unmentioned ids append rather than sort last, so a
 * token added after the order was saved — a later release, a freshly minted user primitive — is
 * never silently pushed out of view, and the result of every branch is the same row set the caller
 * passed in: a reorder can never hide a token.
 *
 * Callers apply this one group at a time. An id belonging to a different group simply never matches
 * one of this group's rows, so cross-group entries in the flat list are ignored naturally and no
 * filtering by group is needed here.
 *
 * Reading the raw document out of the store stays with the caller; this class only walks an
 * already-decoded document (through {@see Token_Order_Index}) and permutes arrays, so it stays free
 * of WordPress calls and I/O.
 *
 * @since TBD
 */
final class Token_Sorter {

	/**
	 * The reader for the stored flat token id list.
	 *
	 * @since TBD
	 *
	 * @var Token_Order_Index
	 */
	private Token_Order_Index $order_index;

	/**
	 * @since TBD
	 *
	 * @param Token_Order_Index $order_index The reader for the stored flat token id list.
	 */
	public function __construct( Token_Order_Index $order_index ) {
		$this->order_index = $order_index;
	}

	/**
	 * The flat ordered token id list stored on a decoded library document, empty when it carries none.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded library document.
	 *
	 * @return list<string> The flat ordered token id list.
	 */
	public function order_for( array $document ): array {
		return $this->order_index->all( $document );
	}

	/**
	 * Permute one group's rows by the stored flat order.
	 *
	 * An empty order returns the rows untouched (declaration order), so removing the stored order
	 * restores declaration order with no other code path involved.
	 *
	 * @since TBD
	 *
	 * @template TRow of array<string, mixed>
	 *
	 * @param array<int, TRow>   $rows  The group's rows, each carrying an `id` key.
	 * @param array<int, string> $order The flat ordered token id list.
	 *
	 * @return array<int, TRow> The same rows, permuted.
	 */
	public function sort( array $rows, array $order ): array {
		if ( $order === [] ) {
			return $rows;
		}

		$positions = array_flip( $order );
		$ordered   = [];
		$unordered = [];

		foreach ( $rows as $row ) {
			if ( isset( $positions[ $row['id'] ] ) ) {
				$ordered[] = $row;
			} else {
				$unordered[] = $row; // Not in the stored order — declaration order, appended after.
			}
		}

		usort( $ordered, fn( array $a, array $b ): int => $positions[ $a['id'] ] <=> $positions[ $b['id'] ] );

		return array_merge( $ordered, $unordered );
	}
}
