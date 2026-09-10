<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads and writes the favoriteFonts list — the library's ordered favorite font families — in the
 * module's $extensions namespace. Authoring metadata only; the effective document builder strips
 * $extensions, so a favorite never reaches projected CSS. Every mutating method returns the
 * updated document; the original is not modified.
 *
 * A favorite is a plain catalog family name, never a token id and never an {alias}. It carries no
 * indirection: nothing resolves through it, no CSS variable is emitted for it, and re-pointing one
 * site-wide is not a capability that exists. Its only job is to pin a family to the top of a font
 * picker so a site is not searching a ~1,900-name catalog for the same face every time.
 *
 * Membership is a set, but the storage shape is an ordered list rather than a map because insertion
 * order is the display order every picker renders — the family a site added first sits first.
 * add() is therefore idempotent on an existing entry and never reorders it.
 *
 * Membership is decided case-insensitively, because a family name is a proper noun rather than an
 * identifier: `Inter` and `INTER` name one face, and the catalog gate the REST routes run in front of
 * this already accepts either spelling. Matching case-sensitively here would let those two spellings
 * both pass that gate and store two entries for one font — and neither picker would show the second,
 * since both collapse the list case-insensitively before rendering, leaving an entry no one can see
 * or remove. Only the comparison folds case; the stored name keeps whatever casing it arrived with,
 * which is what a picker displays.
 *
 * @since TBD
 */
final class Favorite_Font_Index {

	/**
	 * Every stored favorite family, in display order. Read-side fail-soft: a section that is not a
	 * sequential list is dropped wholesale (degrades to "no favorites"), and non-string or empty
	 * entries inside an otherwise-valid list are filtered out, so a hand-corrupted section degrades
	 * to an empty list instead of a type error downstream. Duplicates are collapsed case-insensitively,
	 * keeping first occurrence, so neither a hand-written repeat nor a pair of spellings can render the
	 * same family twice.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return list<string>
	 */
	public function all( array $document ): array {
		$families = $this->read_list( $document );

		if ( ! is_array( $families ) ) {
			return [];
		}

		// The `$families === []` check is required, not redundant: `range( 0, -1 )` returns
		// `[ 0, -1 ]` in PHP, not `[]`, so without this short-circuit an empty favorites list would
		// be misclassified as malformed rather than as a valid empty list.
		$is_list = $families === [] || array_keys( $families ) === range( 0, count( $families ) - 1 );

		if ( ! $is_list ) {
			return [];
		}

		$valid = array_filter( $families, fn( $family ) => is_string( $family ) && trim( $family ) !== '' );

		$seen   = [];
		$unique = [];

		foreach ( array_map( 'trim', $valid ) as $family ) {
			$key = $this->fold( $family );

			if ( isset( $seen[ $key ] ) ) {
				continue;
			}

			$seen[ $key ] = true;
			$unique[]     = $family;
		}

		return $unique;
	}

	/**
	 * Whether a family is already a favorite, matched case-insensitively.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $family The catalog family name.
	 *
	 * @return bool
	 */
	public function has( array $document, string $family ): bool {
		$key = $this->fold( trim( $family ) );

		foreach ( $this->all( $document ) as $stored ) {
			if ( $this->fold( $stored ) === $key ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Append a family to the end of the list. Idempotent: a family already in the list returns the
	 * same document, keeping its existing position rather than moving to the end — a picker's
	 * display order must not shuffle because a client replayed a write.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $family The catalog family name.
	 *
	 * @return array<string, mixed>
	 */
	public function add( array $document, string $family ): array {
		$family = trim( $family );

		if ( $family === '' || $this->has( $document, $family ) ) {
			return $document;
		}

		$families   = $this->all( $document );
		$families[] = $family;

		return $this->write_list( $document, $families );
	}

	/**
	 * Remove a family from the list, leaving every other favorite's relative order untouched. Matched
	 * case-insensitively, so a family can be cleared through the spelling a client has rather than only
	 * through the one that happens to be stored. No-op (the same document is returned) when the family
	 * is not in the list.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $family The catalog family name.
	 *
	 * @return array<string, mixed>
	 */
	public function remove( array $document, string $family ): array {
		$key     = $this->fold( trim( $family ) );
		$current = $this->all( $document );

		$remaining = array_values(
			array_filter( $current, fn( string $stored ) => $this->fold( $stored ) !== $key )
		);

		if ( $remaining === $current ) {
			return $document;
		}

		return $this->write_list( $document, $remaining );
	}

	/**
	 * The comparison key for a family name. ASCII lowercasing, matching both the `strcasecmp()` the
	 * REST catalog gate uses and the `toLowerCase()` both pickers collapse their lists with, so the
	 * three agree on what counts as the same font.
	 *
	 * @since TBD
	 *
	 * @param string $family The family name.
	 *
	 * @return string The comparison key.
	 */
	private function fold( string $family ): string {
		return strtolower( $family );
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

		return $ns_data[ Extensions::get_section_favorite_fonts() ] ?? null;
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param array<int, string>   $families
	 *
	 * @return array<string, mixed>
	 */
	private function write_list( array $document, array $families ): array {
		$document = $this->ensure_path( $document );

		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_favorite_fonts();

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];
		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];

		$ns_data[ $sec ]  = $families;
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
		$sec = Extensions::get_section_favorite_fonts();

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
