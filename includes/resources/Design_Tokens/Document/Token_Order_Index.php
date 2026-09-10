<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads and writes the tokenOrder list — a single flat ordered token id list — in the module's
 * $extensions namespace. Authoring metadata only; the effective document builder strips
 * $extensions, so order never affects rendering. Every mutating method returns the updated
 * document; the original is not modified.
 *
 * The list is keyed by token id, never by group, even though every write route is per-group (see
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Documents_Controller::GROUP_ROUTE}): a
 * token id is a stable, locale-independent dot-path, while the group segment on that route is a
 * translated UI-schema label that exists only to address and validate the request. Persisting
 * under the group label would reproduce the exact locale-dependency this storage shape exists to
 * remove — a stored order would silently stop matching its group the moment the site language
 * changed. `set_group()` / `remove_group()` therefore take the caller-supplied set of ids
 * belonging to the target group, so they can isolate that group's slice of the flat list without
 * ever storing the group name itself.
 *
 * @since TBD
 */
final class Token_Order_Index {

	/**
	 * The full stored order. Read-side fail-soft: a section that is not a sequential list is
	 * dropped wholesale (degrades to declaration order everywhere), and non-string or empty
	 * entries inside an otherwise-valid list are filtered out, so a hand-corrupted section
	 * degrades to "no order" instead of a type error downstream.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return list<string>
	 */
	public function all( array $document ): array {
		$ids = $this->read_list( $document );

		if ( ! is_array( $ids ) ) {
			return [];
		}

		// The `$ids === []` check is required, not redundant: `range( 0, -1 )` returns
		// `[ 0, -1 ]` in PHP, not `[]`, so without this short-circuit an empty order list would be
		// misclassified as malformed rather than as a valid empty list.
		$is_list = $ids === [] || array_keys( $ids ) === range( 0, count( $ids ) - 1 );

		if ( ! $is_list ) {
			return [];
		}

		return array_values( array_filter( $ids, fn( $id ) => is_string( $id ) && $id !== '' ) );
	}

	/**
	 * Store one group's order wholesale (the endpoint's PUT-replaces contract): the target
	 * group's own ids are removed from the flat list and the new sequence is re-appended, leaving
	 * every other group's relative order untouched, since only relative position within a group is
	 * ever read. Deduplicates the incoming ids, keeping first occurrence.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param array<int, string>   $group_ids The full set of token ids registered in the target group,
	 *                                         used to isolate that group's entries within the flat list.
	 * @param array<int, string>   $ids       The group's new ordered id list.
	 *
	 * @return array<string, mixed>
	 */
	public function set_group( array $document, array $group_ids, array $ids ): array {
		$ids = array_values( array_unique( $ids ) );

		$remaining = array_values( array_diff( $this->all( $document ), $group_ids ) );

		return $this->write_list( $document, array_merge( $remaining, $ids ) );
	}

	/**
	 * Remove one group's ids from the stored order — declaration order applies again for that
	 * group. No-op (the same document is returned) when the group has no ids currently stored.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param array<int, string>   $group_ids The full set of token ids registered in the target group.
	 *
	 * @return array<string, mixed>
	 */
	public function remove_group( array $document, array $group_ids ): array {
		$current   = $this->all( $document );
		$remaining = array_values( array_diff( $current, $group_ids ) );

		if ( $remaining === $current ) {
			return $document;
		}

		return $this->write_list( $document, $remaining );
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return mixed
	 */
	private function read_list( array $document ) {
		$ext_data = $document[ Extensions::get_extensions_key() ] ?? null;

		if ( ! is_array( $ext_data ) ) {
			return null;
		}

		$ns_data = $ext_data[ Extensions::get_namespace() ] ?? null;

		if ( ! is_array( $ns_data ) ) {
			return null;
		}

		return $ns_data[ Extensions::get_section_token_order() ] ?? null;
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param array<int, string>   $ids
	 *
	 * @return array<string, mixed>
	 */
	private function write_list( array $document, array $ids ): array {
		$document = $this->ensure_path( $document );

		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_token_order();

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];
		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];

		$ns_data[ $sec ]  = $ids;
		$ext_data[ $ns ]  = $ns_data;
		$document[ $ext ] = $ext_data;

		return $document;
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return array<string, mixed>
	 */
	private function ensure_path( array $document ): array {
		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_token_order();

		if ( ! isset( $document[ $ext ] ) || ! is_array( $document[ $ext ] ) ) {
			$document[ $ext ] = [];
		}

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];

		if ( ! isset( $ext_data[ $ns ] ) || ! is_array( $ext_data[ $ns ] ) ) {
			$ext_data[ $ns ]  = [];
			$document[ $ext ] = $ext_data;
		}

		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];

		if ( ! isset( $ns_data[ $sec ] ) || ! is_array( $ns_data[ $sec ] ) ) {
			$ns_data[ $sec ]  = [];
			$ext_data[ $ns ]  = $ns_data;
			$document[ $ext ] = $ext_data;
		}

		return $document;
	}
}
