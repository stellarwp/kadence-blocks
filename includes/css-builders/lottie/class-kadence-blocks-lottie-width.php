<?php
/**
 * Lottie width.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * Works out the maximum width of the animation.
 *
 * @since TBD
 */
final class Kadence_Blocks_Lottie_Width {

	/**
	 * The maximum width: automatic when none is saved or it is zero, otherwise in pixels.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 *
	 * @return string
	 */
	public static function resolve( $attributes ) {
		return ( ! isset( $attributes['width'] ) || '0' === $attributes['width'] ) ? 'auto' : $attributes['width'] . 'px';
	}
}
