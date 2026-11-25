<?php
/**
 * Sanitizes Lottie animation data before it is stored or served.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Removes executable expressions from Lottie animation data.
 *
 * @since 3.8.1
 */
class Kadence_Blocks_Lottie_Sanitizer {

	/**
	 * Recursively removes expressions from decoded Lottie data.
	 *
	 * @since 3.8.1
	 * @since TBD Keeps `x` properties that are animated values, such as split position X and mask expansion.
	 *
	 * @param array<mixed>|object $data Decoded Lottie JSON.
	 *
	 * @return array<mixed>|object The data without expressions.
	 */
	public static function strip_expressions( $data ) {
		if ( is_object( $data ) ) {
			foreach ( get_object_vars( $data ) as $key => $value ) {
				if ( 'x' === $key && self::is_expression( $value ) ) {
					unset( $data->$key );
				} elseif ( is_array( $value ) || is_object( $value ) ) {
					$data->$key = self::strip_expressions( $value );
				}
			}

			return $data;
		}

		foreach ( $data as $key => $value ) {
			if ( 'x' === $key && self::is_expression( $value ) ) {
				unset( $data[ $key ] );
			} elseif ( is_array( $value ) || is_object( $value ) ) {
				$data[ $key ] = self::strip_expressions( $value );
			}
		}

		return $data;
	}

	/**
	 * Whether an `x` value is an expression. Lottie also uses `x` for animated properties (an object such as
	 * split position X or mask expansion) and for easing handles (numbers), and those are kept.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The value of an `x` key.
	 *
	 * @return bool
	 */
	private static function is_expression( $value ): bool {
		if ( is_object( $value ) || self::is_map( $value ) ) {
			return false;
		}

		return ! self::is_numeric_value( $value );
	}

	/**
	 * Whether a value is a decoded JSON object stored as an associative array.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The value to check.
	 *
	 * @return bool
	 */
	private static function is_map( $value ): bool {
		return is_array( $value ) && [] !== $value && array_keys( $value ) !== range( 0, count( $value ) - 1 );
	}

	/**
	 * Whether a value is a number or an array made only of numbers.
	 *
	 * @since 3.8.1
	 *
	 * @param mixed $value The value of an `x` key.
	 *
	 * @return bool
	 */
	private static function is_numeric_value( $value ): bool {
		if ( is_array( $value ) ) {
			foreach ( $value as $item ) {
				if ( ! self::is_numeric_value( $item ) ) {
					return false;
				}
			}

			return true;
		}

		return is_int( $value ) || is_float( $value );
	}
}
