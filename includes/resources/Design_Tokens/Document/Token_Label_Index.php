<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads and writes the tokenLabels display-label override map — a flat { token id => label }
 * string map in the module's $extensions namespace. Authoring metadata only: the effective
 * document builder strips $extensions, so an override can never reach projected CSS.
 * Every mutating method returns the updated document; the original is not modified.
 *
 * @since TBD
 */
final class Token_Label_Index {

	/**
	 * All label overrides, keyed by canonical dot-path id. Read-side fail-soft: entries whose
	 * key or value is not a non-empty string are dropped rather than surfaced, so a
	 * hand-corrupted section degrades to "no override" instead of a type error downstream.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 *
	 * @return array<string, string>
	 */
	public function all( array $document ): array {
		$map = $this->read_map( $document );

		if ( ! is_array( $map ) ) {
			return [];
		}

		$labels = [];

		foreach ( $map as $id => $label ) {
			if ( is_string( $id ) && $id !== '' && is_string( $label ) && $label !== '' ) {
				$labels[ $id ] = $label;
			}
		}

		return $labels;
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
	 * @return string|null The override, or null when none is stored.
	 */
	public function label_for( array $document, string $id ): ?string {
		return $this->all( $document )[ $id ] ?? null;
	}

	/**
	 * Store an override. An empty label is refused at the API level — storing an empty label
	 * is impossible by construction, not merely validated against: clearing is remove(), never
	 * set( '' ). The controller trims and routes '' to the clear path before this is ever
	 * called; the throw guards future callers.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $id
	 * @param string               $label
	 *
	 * @throws InvalidArgumentException When the label is empty.
	 *
	 * @return array<string, mixed>
	 */
	public function set( array $document, string $id, string $label ): array {
		if ( $label === '' ) {
			throw new InvalidArgumentException( 'A token label override cannot be empty; use remove() to clear it.' );
		}

		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_token_labels();

		$document = $this->ensure_path( $document );

		/** @var array<string, mixed> $ext_data */
		$ext_data = $document[ $ext ];
		/** @var array<string, mixed> $ns_data */
		$ns_data = $ext_data[ $ns ];
		/** @var array<string, mixed> $sec_data */
		$sec_data = $ns_data[ $sec ];

		$sec_data[ $id ]  = $label;
		$ns_data[ $sec ]  = $sec_data;
		$ext_data[ $ns ]  = $ns_data;
		$document[ $ext ] = $ext_data;

		return $document;
	}

	/**
	 * Remove an override. A no-op (same document returned) when none is stored.
	 *
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
		$sec = Extensions::get_section_token_labels();

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

		return $ns_data[ Extensions::get_section_token_labels() ] ?? null;
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
		$sec = Extensions::get_section_token_labels();

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
