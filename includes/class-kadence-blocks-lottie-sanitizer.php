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
 * @since TBD
 */
class Kadence_Blocks_Lottie_Sanitizer {

	/**
	 * Recursively removes expression strings from decoded Lottie data.
	 *
	 * @since TBD
	 *
	 * @param array<mixed>|object $data Decoded Lottie JSON.
	 *
	 * @return array<mixed>|object The data without expression strings.
	 */
	public static function strip_expressions( $data ) {
		if ( is_object( $data ) ) {
			foreach ( get_object_vars( $data ) as $key => $value ) {
				if ( 'x' === $key && is_string( $value ) ) {
					unset( $data->$key );
				} elseif ( is_array( $value ) || is_object( $value ) ) {
					$data->$key = self::strip_expressions( $value );
				}
			}

			return $data;
		}

		foreach ( $data as $key => $value ) {
			if ( 'x' === $key && is_string( $value ) ) {
				unset( $data[ $key ] );
			} elseif ( is_array( $value ) || is_object( $value ) ) {
				$data[ $key ] = self::strip_expressions( $value );
			}
		}

		return $data;
	}
}
