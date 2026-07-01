<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Scans all alias locations in a stored overrides document for references to a given id.
 *
 * Every location is classified with a kind and whether the phase-1 cascade supports it.
 * Phase 1 supports only direct $value aliases in the semantic layer override.
 * All other locations produce unsupported references that block deletion.
 *
 * @since TBD
 */
final class Token_Reference_Policy {

	/**
	 * Find all references to $primitive_id in the document.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document     The decoded stored overrides document.
	 * @param string               $primitive_id The canonical dot-path of the target primitive.
	 *
	 * @return Token_Reference[]
	 */
	public function find( array $document, string $primitive_id ): array {
		$alias      = '{' . $primitive_id . '}';
		$references = [];

		$this->scan_token_layers( $document, $alias, $references );
		$this->scan_extensions( $document, $alias, $references );

		return $references;
	}

	/**
	 * Whether all found references are supported (i.e. deletion is safe to proceed).
	 *
	 * @since TBD
	 *
	 * @param Token_Reference[] $references
	 *
	 * @return bool
	 */
	public function all_supported( array $references ): bool {
		foreach ( $references as $ref ) {
			if ( ! $ref->supported ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Walk the primitive and semantic token layers for alias references.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $alias
	 * @param Token_Reference[]    $references
	 *
	 * @return void
	 */
	private function scan_token_layers( array $document, string $alias, array &$references ): void {
		foreach ( Layers::token_layers() as $layer ) {
			if ( ! isset( $document[ $layer ] ) || ! is_array( $document[ $layer ] ) ) {
				continue;
			}

			$is_semantic = $layer === 'semantic';
			$this->walk_node( $document[ $layer ], $layer, $alias, $is_semantic, $references );
		}
	}

	/**
	 * Walk one node, classifying every alias match.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node
	 * @param string               $prefix
	 * @param string               $alias
	 * @param bool                 $is_semantic
	 * @param Token_Reference[]    $references
	 *
	 * @return void
	 */
	private function walk_node( array $node, string $prefix, string $alias, bool $is_semantic, array &$references ): void {
		foreach ( $node as $key => $child ) {
			if ( is_string( $key ) && strncmp( $key, '$', 1 ) === 0 ) {
				continue;
			}

			if ( ! is_array( $child ) ) {
				continue;
			}

			$path = $prefix . '.' . $key;

			if ( ! array_key_exists( '$value', $child ) ) {
				$this->walk_node( $child, $path, $alias, $is_semantic, $references );

				continue;
			}

			$value = $child['$value'];

			if ( $value === $alias ) {
				$supported    = $is_semantic;
				$kind         = $is_semantic
					? Token_Reference::get_kind_semantic_override()
					: Token_Reference::get_kind_composite_field();
				$references[] = new Token_Reference( $kind, $path, $supported );

				continue;
			}

			$type   = $child[ Token_Type::get_type_key() ] ?? '';
			$fields = Token_Type::is_composite( (string) $type ) ? Token_Type::composite_fields( (string) $type ) : [];

			if ( is_array( $value ) && ! empty( $fields ) ) {
				foreach ( $fields as $field => $_ ) {
					if ( isset( $value[ $field ] ) && $value[ $field ] === $alias ) {
						$references[] = new Token_Reference(
							Token_Reference::get_kind_composite_field(),
							$path . '.$value.' . $field,
							false
						);
					}
				}
			}
		}
	}

	/**
	 * Scan $extensions for alias references.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $alias
	 * @param Token_Reference[]    $references
	 *
	 * @return void
	 */
	private function scan_extensions( array $document, string $alias, array &$references ): void {
		$ext_root = $document[ Extensions::get_extensions_key() ] ?? null;

		if ( ! is_array( $ext_root ) ) {
			return;
		}

		$ext = $ext_root[ Extensions::get_namespace() ] ?? null;

		if ( ! is_array( $ext ) ) {
			return;
		}

		foreach ( Extensions::get_sections() as $section ) {
			if ( ! isset( $ext[ $section ] ) || ! is_array( $ext[ $section ] ) ) {
				continue;
			}

			$base = Extensions::get_extensions_key() . '.' . Extensions::get_namespace() . '.' . $section;

			$this->scan_extension_section( $ext[ $section ], $base, $alias, $references );
		}
	}

	/**
	 * @since TBD
	 *
	 * @param array<string, mixed> $section
	 * @param string               $prefix
	 * @param string               $alias
	 * @param Token_Reference[]    $references
	 *
	 * @return void
	 */
	private function scan_extension_section( array $section, string $prefix, string $alias, array &$references ): void {
		foreach ( $section as $group => $preset_set ) {
			if ( ! is_array( $preset_set ) ) {
				continue;
			}

			foreach ( $preset_set as $preset_name => $preset ) {
				if ( $preset_name === Extensions::get_default_key() || ! is_array( $preset ) ) {
					continue;
				}

				$tokens = $preset[ Extensions::get_tokens_key() ] ?? null;

				if ( ! is_array( $tokens ) ) {
					continue;
				}

				foreach ( $tokens as $token_path => $value ) {
					if ( $value === $alias ) {
						$references[] = new Token_Reference(
							Token_Reference::get_kind_extension(),
							$prefix . '.' . $group . '.' . $preset_name . '.' . Extensions::get_tokens_key() . '.' . $token_path,
							false
						);
					}
				}
			}
		}
	}
}
