<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

/**
 * Centralizes the phase-1 user-primitive id shape: the `primitive.color.custom.*` namespace
 * prefix and the kebab-case slug rule for its terminal segment.
 *
 * @since TBD
 */
final class User_Primitive_Id {

	/**
	 * The canonical namespace prefix for phase-1 user primitives.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const NAMESPACE_PREFIX = 'primitive.color.custom.';

	/**
	 * The kebab-case pattern a terminal slug must match, without anchors or delimiters.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_PATTERN = '[a-z0-9]+(?:-[a-z0-9]+)*';

	/**
	 * The anchored, unescaped slug pattern, suitable for a REST `args` `pattern` entry.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_slug_pattern(): string {
		return '^' . self::SLUG_PATTERN . '$';
	}

	/**
	 * Build the canonical id for a terminal slug.
	 *
	 * @since TBD
	 *
	 * @param string $slug The terminal slug.
	 *
	 * @return string
	 */
	public static function canonical( string $slug ): string {
		return self::NAMESPACE_PREFIX . $slug;
	}

	/**
	 * Whether a terminal slug is valid kebab-case.
	 *
	 * @since TBD
	 *
	 * @param string $slug The terminal slug.
	 *
	 * @return bool
	 */
	public static function is_valid_slug( string $slug ): bool {
		return (bool) preg_match( '/' . self::get_slug_pattern() . '/', $slug );
	}

	/**
	 * Whether a full id is a canonical phase-1 user-primitive id.
	 *
	 * @since TBD
	 *
	 * @param string $id The candidate id.
	 *
	 * @return bool
	 */
	public static function is_valid_id( string $id ): bool {
		return (bool) preg_match( '/^' . preg_quote( self::NAMESPACE_PREFIX, '/' ) . self::SLUG_PATTERN . '$/', $id );
	}
}
