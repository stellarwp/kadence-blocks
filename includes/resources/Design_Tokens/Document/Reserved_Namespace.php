<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * The single source of truth for the user-primitive reserved namespace: primitive.<type>.custom.*.
 *
 * Every write surface that must recognize this namespace (the user-primitive document invariant, the
 * user-primitives controller's id validation, and the generic documents controller's write guards)
 * defers to this class instead of re-deriving the shape on its own, so the set of reserved <type>
 * segments cannot drift between call sites. The <type> segment is validated against every registered
 * Token_Type rather than hardcoding "color", so a future custom primitive under an existing $type (e.g.
 * a gap or radius primitive, both "dimension") is guarded automatically.
 *
 * @since TBD
 */
final class Reserved_Namespace {

	/**
	 * The token layer the reserved namespace lives under.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LAYER = 'primitive';

	/**
	 * The tree segment, directly under the reserved $type, that holds user-created primitives.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SEGMENT = 'custom';

	/**
	 * Whether a canonical dot-path id names a user-primitive leaf: primitive.<type>.custom.<slug>.
	 *
	 * @since TBD
	 *
	 * @param string $id The canonical dot-path id.
	 *
	 * @return bool
	 */
	public static function is_reserved_id( string $id ): bool {
		$types = array_map(
			static fn( string $type ): string => preg_quote( $type, '/' ),
			Token_Type::all()
		);

		return (bool) preg_match(
			'/^' . self::LAYER . '\.(?:' . implode( '|', $types ) . ')\.' . self::SEGMENT . '\.[a-z0-9]+(?:-[a-z0-9]+)*$/',
			$id
		);
	}

	/**
	 * Whether a dot-path addresses the reserved namespace itself or anything nested below it.
	 *
	 * Unlike is_reserved_id(), this also matches a path deeper than a single custom-primitive leaf (e.g. a
	 * sub-field of a composite value), so a write cannot reach into the namespace at any depth.
	 *
	 * @since TBD
	 *
	 * @param string $path The dot-path to test.
	 *
	 * @return bool
	 */
	public static function contains_reserved_path( string $path ): bool {
		$segments = explode( '.', $path );

		return count( $segments ) >= 3
			&& $segments[0] === self::LAYER
			&& in_array( $segments[1], Token_Type::all(), true )
			&& $segments[2] === self::SEGMENT;
	}

	/**
	 * Walk a primitive-layer subtree and collect every path at or below the reserved namespace.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node   The node to walk, e.g. a decoded document's "primitive" subtree.
	 * @param string               $prefix The dot-path prefix of $node, e.g. "primitive".
	 *
	 * @return string[]
	 */
	public static function find_in( array $node, string $prefix ): array {
		if ( self::contains_reserved_path( $prefix ) ) {
			return [ $prefix ];
		}

		$found = [];

		foreach ( $node as $key => $child ) {
			if ( is_string( $key ) && strncmp( $key, '$', 1 ) === 0 ) {
				continue;
			}

			if ( is_array( $child ) ) {
				/** @var array<string, mixed> $child */
				$found = array_merge( $found, self::find_in( $child, $prefix . '.' . $key ) );
			}
		}

		return $found;
	}
}
