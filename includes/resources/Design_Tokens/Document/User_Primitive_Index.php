<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads and writes the userPrimitives provenance map. Stores label metadata only.
 * $type and $value live exclusively in the primitive tree.
 * Every mutating method returns the updated document; the original is not modified.
 *
 * @since TBD
 */
final class User_Primitive_Index {

	/**
	 * All user-primitive entries, keyed by canonical dot-path id.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return array<string, array{label: string, group?: string}>
	 */
	public function all( array $document ): array {
		$map = $this->read_map( $document );

		return is_array( $map ) ? $map : [];
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $id Canonical dot-path id.
	 *
	 * @return bool
	 */
	public function has( array $document, string $id ): bool {
		return isset( $this->all( $document )[ $id ] );
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $id
	 *
	 * @return string|null
	 */
	public function label_for( array $document, string $id ): ?string {
		$entry = $this->all( $document )[ $id ] ?? null;

		return is_array( $entry ) ? $entry['label'] : null;
	}

	/**
	 * Write (or overwrite) an entry's label. The group is preserved by default — `null` (the
	 * default) keeps whatever group the existing entry already stores, so a caller with no group in
	 * its own request (the label endpoints) never resets one a create or rename request set. A
	 * string sets the group explicitly; `''` clears it, and an empty group is omitted from the
	 * entry so a document with no grouped custom tokens stays byte-identical to before this param
	 * existed.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $id
	 * @param string               $label
	 * @param string|null          $group Null preserves the existing entry's group; a string sets it.
	 *
	 * @return array<string, mixed>
	 */
	public function add( array $document, string $id, string $label, ?string $group = null ): array {
		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_user_primitives();

		$document = $this->ensure_path( $document );

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];
		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];
		/** @var array<string, mixed> $sec_data */
		$sec_data = $ns_data[ $sec ];

		if ( $group === null ) {
			$existing = $sec_data[ $id ] ?? null;
			$group    = is_array( $existing ) && is_string( $existing['group'] ?? null ) ? $existing['group'] : '';
		}

		$entry = [ 'label' => $label ];

		if ( $group !== '' ) {
			$entry['group'] = $group;
		}

		$sec_data[ $id ]  = $entry;
		$ns_data[ $sec ]  = $sec_data;
		$ext_data[ $ns ]  = $ns_data;
		$document[ $ext ] = $ext_data;

		return $document;
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $id
	 *
	 * @return array<string, mixed>
	 */
	public function remove( array $document, string $id ): array {
		if ( ! $this->has( $document, $id ) ) {
			return $document;
		}

		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_user_primitives();

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];
		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];
		/** @var array<string, mixed> $sec_data */
		$sec_data = $ns_data[ $sec ];

		unset( $sec_data[ $id ] );

		$ns_data[ $sec ]  = $sec_data;
		$ext_data[ $ns ]  = $ns_data;
		$document[ $ext ] = $ext_data;

		return $document;
	}

	/**
	 * Swap the old id for the new id, updating the label. The old entry's group carries to the new
	 * id explicitly — the old entry is gone by the time add() would look for it, so relying on
	 * add()'s own preserve-by-default lookup here would silently drop the group instead.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $old_id
	 * @param string               $new_id
	 * @param string               $new_label
	 *
	 * @return array<string, mixed>
	 */
	public function rename( array $document, string $old_id, string $new_id, string $new_label ): array {
		$old_entry = $this->all( $document )[ $old_id ] ?? null;
		$group     = is_array( $old_entry ) && is_string( $old_entry['group'] ?? null ) ? $old_entry['group'] : '';

		$document = $this->remove( $document, $old_id );

		return $this->add( $document, $new_id, $new_label, $group );
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

		return $ns_data[ Extensions::get_section_user_primitives() ] ?? null;
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
		$sec = Extensions::get_section_user_primitives();

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
