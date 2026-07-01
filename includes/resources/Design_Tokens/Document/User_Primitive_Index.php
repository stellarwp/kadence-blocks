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
	 * @return array<string, array{label: string}>
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
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $id
	 * @param string               $label
	 *
	 * @return array<string, mixed>
	 */
	public function add( array $document, string $id, string $label ): array {
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

		$sec_data[ $id ]  = [ 'label' => $label ];
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
	 * Swap the old id for the new id, updating the label.
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
		$document = $this->remove( $document, $old_id );

		return $this->add( $document, $new_id, $new_label );
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
