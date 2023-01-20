<?php
/**
 * Kadence Blocks Helper Functions
 *
 * @since   1.8.0
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Check if we are in AMP Mode.
 */
function kadence_blocks_is_not_amp() {
	$not_amp = true;
	if ( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ) {
		$not_amp = false;
	}
	return $not_amp;
}

/**
 * Check if we are in a rest api call.
 */
function kadence_blocks_is_rest() {
	$prefix = rest_get_url_prefix();
	if ( ( defined( 'REST_REQUEST' ) && REST_REQUEST ) || ( isset( $_GET['rest_route'] ) && strpos( $_GET['rest_route'], '/', 0 ) === 0 ) ) {
		return true;
	}
	// (#3).
	global $wp_rewrite;
	if ( $wp_rewrite === null ) {
		$wp_rewrite = new WP_Rewrite();
	}
	// (#4).
	$rest_url = wp_parse_url( trailingslashit( rest_url( ) ) );
	$current_url = wp_parse_url( add_query_arg( array() ) );

	if ( isset( $current_url['path'] ) && isset( $rest_url['path'] ) ) {
		return strpos( $current_url['path'], $rest_url['path'], 0 ) === 0;
	}
	return false;
}

/**
 * Hex to RGBA
 *
 * @param string $hex string hex code.
 * @param number $alpha alpha number.
 */
function kadence_blocks_hex2rgba( $hex, $alpha ) {
	if ( empty( $hex ) ) {
		return '';
	}
	if ( 'transparent' === $hex ) {
		return $hex;
	}
	$hex = str_replace( '#', '', $hex );
	if ( strlen( $hex ) == 3 ) {
		$r = hexdec( substr( $hex, 0, 1 ) . substr( $hex, 0, 1 ) );
		$g = hexdec( substr( $hex, 1, 1 ) . substr( $hex, 1, 1 ) );
		$b = hexdec( substr( $hex, 2, 1 ) . substr( $hex, 2, 1 ) );
	} else {
		$r = hexdec( substr( $hex, 0, 2 ) );
		$g = hexdec( substr( $hex, 2, 2 ) );
		$b = hexdec( substr( $hex, 4, 2 ) );
	}
	$rgba = 'rgba(' . $r . ', ' . $g . ', ' . $b . ', ' . $alpha . ')';
	return $rgba;
}

/**
 * Check to see if variable contains a number including 0.
 *
 * @access public
 *
 * @param  string $value - the css property.
 * @return boolean
 */
function kadence_blocks_is_number( &$value ) {
	return isset( $value ) && is_numeric( $value );
}

/**
 * Adds Animate on Scroll attributes to a wrapper args array, if animation attributes are present
 *
 * @param array $attributes The attributes.
 * @param array $wrapper_args The args array to apply aos data to.
 */
function kadence_apply_aos_wrapper_args( $attributes, &$wrapper_args ) {
	if ( isset( $attributes['kadenceAnimation'] ) && $attributes['kadenceAnimation'] ) {
		$wrapper_args['data-aos'] = $attributes['kadenceAnimation'];
		if ( isset( $attributes['kadenceAOSOptions'] ) && $attributes['kadenceAOSOptions'] && isset( $attributes['kadenceAOSOptions'][0] ) ) {
			$kadence_aos_options = $attributes['kadenceAOSOptions'][0];

			if ( isset( $kadence_aos_options['offset'] ) && $kadence_aos_options['offset'] ) {
				$wrapper_args['data-aos-offset'] = $kadence_aos_options['offset'];
			}
			if ( isset( $kadence_aos_options['duration'] ) && $kadence_aos_options['duration'] ) {
				$wrapper_args['data-aos-duration'] = $kadence_aos_options['duration'];
			}
			if ( isset( $kadence_aos_options['easing'] ) && $kadence_aos_options['easing'] ) {
				$wrapper_args['data-aos-easing'] = $kadence_aos_options['easing'];
			}
			if ( isset( $kadence_aos_options['delay'] ) && $kadence_aos_options['delay'] ) {
				$wrapper_args['data-aos-delay'] = $kadence_aos_options['delay'];
			}
			if ( isset( $kadence_aos_options['once'] ) && '' !== $kadence_aos_options['once'] ) {
				$wrapper_args['data-aos-once'] = $kadence_aos_options['once'];
			}
		}
	}

	return $wrapper_args;
}