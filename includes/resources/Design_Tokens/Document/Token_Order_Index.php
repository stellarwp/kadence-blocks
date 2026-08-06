<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads and writes the tokenOrder map — { group => ordered token id list } in the module's
 * $extensions namespace. Authoring metadata only; the effective document builder strips
 * $extensions, so order never affects rendering. Every mutating method returns the updated
 * document; the original is not modified.
 *
 * @since TBD
 */
final class Token_Order_Index {

	/**
	 * All stored group orders. Read-side fail-soft: a group entry that is not a sequential list of
	 * non-empty strings is dropped (degrades to declaration order), and non-string ids inside an
	 * otherwise-valid list are filtered out, so a hand-corrupted section degrades to "no order"
	 * instead of a type error downstream.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return array<string, list<string>>
	 */
	public function all( array $document ): array {
		$map = $this->read_map( $document );

		if ( ! is_array( $map ) ) {
			return [];
		}

		$orders = [];

		foreach ( $map as $group => $ids ) {
			if ( ! is_string( $group ) || $group === '' || ! is_array( $ids ) ) {
				continue;
			}

			// The `$ids === []` check is required, not redundant: `range( 0, -1 )` returns
			// `[ 0, -1 ]` in PHP, not `[]`, so without this short-circuit an empty order list
			// would be misclassified as malformed rather than as a valid empty list.
			$is_list = $ids === [] || array_keys( $ids ) === range( 0, count( $ids ) - 1 );

			if ( ! $is_list ) {
				continue;
			}

			$ids = array_values( array_filter( $ids, fn( $id ) => is_string( $id ) && $id !== '' ) );

			$orders[ $group ] = $ids;
		}

		return $orders;
	}

	/**
	 * The stored order for one group, [] when none is stored.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $group
	 *
	 * @return list<string>
	 */
	public function for_group( array $document, string $group ): array {
		return $this->all( $document )[ $group ] ?? [];
	}

	/**
	 * Store a group's order wholesale (the endpoint's PUT-replaces contract). Deduplicates keeping
	 * first occurrence. An empty id list is legal and distinct from remove_group() only in that it
	 * round-trips as an explicit entry — the controller normalizes that case to remove_group() so
	 * "no preference" has one spelling.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $group
	 * @param array<int, string>   $ids
	 *
	 * @return array<string, mixed>
	 */
	public function set_group( array $document, string $group, array $ids ): array {
		$ids = array_values( array_unique( $ids ) );

		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_token_order();

		$document = $this->ensure_path( $document );

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];
		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];
		/** @var array<string, mixed> $sec_data */
		$sec_data = $ns_data[ $sec ];

		$sec_data[ $group ] = $ids;
		$ns_data[ $sec ]    = $sec_data;
		$ext_data[ $ns ]    = $ns_data;
		$document[ $ext ]   = $ext_data;

		return $document;
	}

	/**
	 * Remove a group's stored order — declaration order applies again. No-op when absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $group
	 *
	 * @return array<string, mixed>
	 */
	public function remove_group( array $document, string $group ): array {
		if ( ! isset( $this->all( $document )[ $group ] ) ) {
			return $document;
		}

		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_token_order();

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];
		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];
		/** @var array<string, mixed> $sec_data */
		$sec_data = $ns_data[ $sec ];

		unset( $sec_data[ $group ] );

		$ns_data[ $sec ]  = $sec_data;
		$ext_data[ $ns ]  = $ns_data;
		$document[ $ext ] = $ext_data;

		return $document;
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return mixed
	 */
	private function read_map( array $document ) {
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
