<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

/**
 * The DTCG alias micro-syntax: a value that is a single reference, e.g. "{primitive.color.brand.primary}".
 *
 * @since TBD
 */
final class Alias {

	/**
	 * A $value is an alias only when the whole string is a single {dot.path} reference.
	 */
	private const PATTERN = '/^\{([\w.-]+)\}$/';

	/**
	 * @param mixed $value
	 */
	public static function is_alias( $value ): bool {
		return is_string( $value ) && preg_match( self::PATTERN, $value ) === 1;
	}

	/**
	 * Extract the referenced dot-path from an alias string, or null when not an alias.
	 *
	 * @param mixed $value
	 */
	public static function path_of( $value ): ?string {
		if ( is_string( $value ) && preg_match( self::PATTERN, $value, $m ) === 1 ) {
			return $m[1];
		}

		return null;
	}
}
