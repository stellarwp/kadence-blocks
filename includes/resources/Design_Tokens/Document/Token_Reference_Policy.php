<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;

/**
 * Scans all alias locations in a stored overrides document for references to a given id.
 *
 * Every location is classified with a kind and whether the phase-1 cascade supports it.
 * Phase 1 supports direct $value aliases in the primitive and semantic layers: `all_supported()`
 * reflects that, and gates the rename/delete cascades that rewrite or revert those locations.
 * All other locations (composite fields, extension presets) produce unsupported references
 * that block deletion or rename.
 *
 * A narrower question — whether a fresh write may introduce a reference from outside the
 * semantic layer — is answered by `all_semantic_overrides()` instead; a primitive-layer direct
 * alias is cascade-supported but not a legal location for a brand-new write to create.
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
	 * Whether every found reference is a direct $value alias in the semantic layer.
	 *
	 * Narrower than `all_supported()`: a primitive-layer direct alias is rewritable by the
	 * rename cascade (so it counts as "supported" there), but it is not a location a fresh
	 * write may use to introduce a reference into the reserved user-primitive namespace from
	 * outside the semantic layer. Write-time guards use this check instead of `all_supported()`
	 * for that reason.
	 *
	 * @since TBD
	 *
	 * @param Token_Reference[] $references
	 *
	 * @return bool
	 */
	public function all_semantic_overrides( array $references ): bool {
		foreach ( $references as $ref ) {
			if ( $ref->kind !== Token_Reference::get_kind_semantic_override() ) {
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
				$kind         = $is_semantic
					? Token_Reference::get_kind_semantic_override()
					: Token_Reference::get_kind_primitive_override();
				$references[] = new Token_Reference( $kind, $path, true );

				continue;
			}

			if ( is_array( $value ) ) {
				$this->scan_composite_value(
					$value,
					$path . '.$value',
					$alias,
					Token_Reference::get_kind_composite_field(),
					$references
				);
			}
		}
	}

	/**
	 * Recursively scan a composite $value structure for alias references at any nesting depth.
	 * Generic over shape so future composite/list sub-fields cannot silently bypass detection.
	 *
	 * @since TBD
	 *
	 * @param array<int|string, mixed> $value
	 * @param string                   $prefix
	 * @param string                   $alias
	 * @param string                   $kind
	 * @param Token_Reference[]        $references
	 *
	 * @return void
	 */
	private function scan_composite_value( array $value, string $prefix, string $alias, string $kind, array &$references ): void {
		foreach ( $value as $field => $sub_value ) {
			$path = $prefix . '.' . $field;

			if ( $sub_value === $alias ) {
				$references[] = new Token_Reference( $kind, $path, false );

				continue;
			}

			if ( is_array( $sub_value ) ) {
				$this->scan_composite_value( $sub_value, $path, $alias, $kind, $references );
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
					$path = $prefix . '.' . $group . '.' . $preset_name . '.' . Extensions::get_tokens_key() . '.' . $token_path;

					if ( $value === $alias ) {
						$references[] = new Token_Reference( Token_Reference::get_kind_extension(), $path, false );

						continue;
					}

					if ( is_array( $value ) ) {
						$this->scan_composite_value( $value, $path, $alias, Token_Reference::get_kind_extension(), $references );
					}
				}
			}
		}
	}
}
