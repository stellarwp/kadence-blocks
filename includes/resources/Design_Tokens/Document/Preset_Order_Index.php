<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads and writes the presetOrder map — a per-block ordered preset-slug list — in the module's
 * $extensions namespace. Authoring metadata only; the effective document builder strips
 * $extensions, so order never affects rendering. Every mutating method returns the updated
 * document; the original is not modified.
 *
 * {@see Token_Order_Index}'s sibling, keyed per block rather than as one flat list: a preset slug
 * is only unique WITHIN its block (two different blocks can both define a "primary" preset), unlike
 * a token id, which is already a stable, globally unique dot-path. Storing slugs directly is safe
 * here for the same reason {@see Token_Order_Index} avoids storing a UI-schema group label: a
 * preset slug is a stable, locale-independent identifier, never a translated display string.
 *
 * @since TBD
 */
final class Preset_Order_Index {

	/**
	 * The stored order for one block. Read-side fail-soft: a section that is not a sequential list
	 * is dropped wholesale (degrades to declaration order), and non-string or empty entries inside
	 * an otherwise-valid list are filtered out, so a hand-corrupted section degrades to "no order"
	 * instead of a type error downstream.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 * @param string               $block    The block name.
	 *
	 * @return list<string>
	 */
	public function for_block( array $document, string $block ): array {
		$slugs = $this->read_block( $document, $block );

		if ( ! is_array( $slugs ) ) {
			return [];
		}

		// The `$slugs === []` check is required, not redundant: `range( 0, -1 )` returns
		// `[ 0, -1 ]` in PHP, not `[]`, so without this short-circuit an empty order list would be
		// misclassified as malformed rather than as a valid empty list.
		$is_list = $slugs === [] || array_keys( $slugs ) === range( 0, count( $slugs ) - 1 );

		if ( ! $is_list ) {
			return [];
		}

		return array_values( array_filter( $slugs, fn( $slug ) => is_string( $slug ) && $slug !== '' ) );
	}

	/**
	 * Store one block's order wholesale (the endpoint's PUT-replaces contract). Deduplicates the
	 * incoming slugs, keeping first occurrence.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 * @param string               $block    The block name.
	 * @param array<int, string>   $slugs    The block's new ordered preset-slug list.
	 *
	 * @return array<string, mixed>
	 */
	public function set_block( array $document, string $block, array $slugs ): array {
		return $this->write_block( $document, $block, array_values( array_unique( $slugs ) ) );
	}

	/**
	 * Remove one block's stored order — declaration order applies again for that block. No-op
	 * (the same document is returned) when the block has no order currently stored.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 * @param string               $block    The block name.
	 *
	 * @return array<string, mixed>
	 */
	public function remove_block( array $document, string $block ): array {
		$map = $this->read_map( $document );

		if ( ! isset( $map[ $block ] ) ) {
			return $document;
		}

		unset( $map[ $block ] );

		if ( $map === [] ) {
			return $this->unset_section( $document );
		}

		return $this->write_map( $document, $map );
	}

	/**
	 * The single ordering algorithm every read seam applies: stored-and-present slugs first, in
	 * stored order, then the remaining incoming names in their incoming order. Advisory — a stale
	 * stored slug that names no incoming preset is skipped silently, and a preset the store has
	 * never ordered simply appends. Any future listing seam of block presets must route through
	 * this method rather than reimplement the merge, so the controller, the resolver, and the
	 * admin feed can never disagree.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 * @param string               $block    The block name.
	 * @param array<int, string>   $names    The preset slugs in their unordered (declaration) order.
	 *
	 * @return list<string>
	 */
	public function apply( array $document, string $block, array $names ): array {
		$stored  = $this->for_block( $document, $block );
		$present = array_values( array_intersect( $stored, $names ) );
		$rest    = array_values( array_diff( $names, $present ) );

		return array_merge( $present, $rest );
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 * @param string               $block    The block name.
	 *
	 * @return mixed
	 */
	private function read_block( array $document, string $block ) {
		return $this->read_map( $document )[ $block ] ?? null;
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 *
	 * @return array<string, mixed>
	 */
	private function read_map( array $document ): array {
		$ext_data = $document[ Extensions::get_extensions_key() ] ?? null;

		if ( ! is_array( $ext_data ) ) {
			return [];
		}

		$ns_data = $ext_data[ Extensions::get_namespace() ] ?? null;

		if ( ! is_array( $ns_data ) ) {
			return [];
		}

		$map = $ns_data[ Extensions::get_section_preset_order() ] ?? null;

		return is_array( $map ) ? $map : [];
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 * @param string               $block    The block name.
	 * @param array<int, string>   $slugs    The block's ordered preset-slug list.
	 *
	 * @return array<string, mixed>
	 */
	private function write_block( array $document, string $block, array $slugs ): array {
		$map = $this->read_map( $document );

		$map[ $block ] = $slugs;

		return $this->write_map( $document, $map );
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 * @param array<string, mixed> $map      The full presetOrder map to store.
	 *
	 * @return array<string, mixed>
	 */
	private function write_map( array $document, array $map ): array {
		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_preset_order();

		/** @var array<string, mixed> $ext_data */
		$ext_data = isset( $document[ $ext ] ) && is_array( $document[ $ext ] ) ? $document[ $ext ] : [];
		/** @var array<string, mixed> $ns_data */
		$ns_data = isset( $ext_data[ $ns ] ) && is_array( $ext_data[ $ns ] ) ? $ext_data[ $ns ] : [];

		$ns_data[ $sec ]  = $map;
		$ext_data[ $ns ]  = $ns_data;
		$document[ $ext ] = $ext_data;

		return $document;
	}

	/**
	 * Remove the whole presetOrder section, pruning an emptied namespace/extensions node along
	 * with it so a fully-cleared order leaves no residue in the stored document.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded overrides document.
	 *
	 * @return array<string, mixed>
	 */
	private function unset_section( array $document ): array {
		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_preset_order();

		if ( ! isset( $document[ $ext ] ) || ! is_array( $document[ $ext ] ) ) {
			return $document;
		}

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];

		if ( ! isset( $ext_data[ $ns ] ) || ! is_array( $ext_data[ $ns ] ) ) {
			return $document;
		}

		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];
		unset( $ns_data[ $sec ] );

		if ( $ns_data === [] ) {
			unset( $ext_data[ $ns ] );
		} else {
			$ext_data[ $ns ] = $ns_data;
		}

		if ( $ext_data === [] ) {
			unset( $document[ $ext ] );
		} else {
			$document[ $ext ] = $ext_data;
		}

		return $document;
	}
}
