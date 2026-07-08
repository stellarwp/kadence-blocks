<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

/**
 * Dot-path lookups within a decoded DTCG document.
 *
 * @since TBD
 */
final class Document_Path {

	/**
	 * Read the node at a dot-path within a decoded document.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The document to walk.
	 * @param string               $path     The dot-path to look up.
	 *
	 * @return array<string, mixed>|null
	 */
	public static function node_at( array $document, string $path ): ?array {
		$node = $document;

		foreach ( explode( '.', $path ) as $segment ) {
			if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
				return null;
			}

			$node = $node[ $segment ];
		}

		return is_array( $node ) ? $node : null;
	}
}
