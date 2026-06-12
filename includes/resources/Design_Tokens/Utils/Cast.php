<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Utils;

/**
 * Safe type-casting utilities for Design Token values.
 *
 * @since TBD
 */
final class Cast {

	/**
	 * Safely casts a value to a string; returns "" for non-scalar values.
	 *
	 * @since TBD
	 *
	 * @param mixed $value
	 *
	 * @return string
	 */
	public static function to_string( $value ): string {
		if ( is_string( $value ) ) {
			return $value;
		}

		if ( ! is_scalar( $value ) ) {
			return '';
		}

		return strval( $value );
	}
}
