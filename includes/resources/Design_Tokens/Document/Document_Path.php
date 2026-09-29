<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;

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

	/**
	 * Whether a decoded document stores its own concrete value at a dot-path.
	 *
	 * A reset sentinel (`"$value": null`) and a disable sentinel carry no value of their own, so neither
	 * counts: the token still shows the shipped value.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The document to walk.
	 * @param string               $path     The dot-path to look up.
	 *
	 * @return bool
	 */
	public static function has_value( array $document, string $path ): bool {
		$node = self::node_at( $document, $path );

		return $node !== null && ( $node[ Sentinels::get_value_key() ] ?? null ) !== null;
	}
}
