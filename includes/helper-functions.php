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

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_key;

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
 * Get the asset file produced by wp scripts.
 *
 * @param string $filepath the file path.
 * @return array
 */
function kadence_blocks_get_asset_file( $filepath ) {
	$asset_path = KADENCE_BLOCKS_PATH . $filepath . '.asset.php';
	return file_exists( $asset_path )
		? include $asset_path
		: [
			'dependencies' => [ 'lodash', 'react', 'react-dom', 'wp-block-editor', 'wp-blocks', 'wp-data', 'wp-element', 'wp-i18n', 'wp-polyfill', 'wp-primitives', 'wp-api' ],
			'version'      => KADENCE_BLOCKS_VERSION,
		];
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
	$rest_url    = wp_parse_url( trailingslashit( rest_url() ) );
	$current_url = wp_parse_url( add_query_arg( [] ) );

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
	return 'rgba(' . $r . ', ' . $g . ', ' . $b . ', ' . $alpha . ')';
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

/**
 * Clone of WooCommerce wc_clean function.
 *
 * @param $var
 *
 * @return array|mixed
 */
function kadence_blocks_wc_clean( $var ) {
	if ( is_array( $var ) ) {
		return array_map( 'kadence_blocks_wc_clean', $var );
	} else {
		return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
	}
}
/**
 * Get the current license key for the plugin.
 */
function kadence_blocks_get_current_license_key() {
	$blocks_pro_key = class_exists( 'Kadence_Blocks_Pro' ) ? get_license_key( 'kadence-blocks-pro' ) : '';
	if ( ! empty( $blocks_pro_key ) ) {
		return $blocks_pro_key;
	}
	$creative_kit_key = class_exists( 'KadenceWP\CreativeKit\Core' ) ? get_license_key( 'kadence-creative-kit' ) : '';
	if ( ! empty( $creative_kit_key ) ) {
		return $creative_kit_key;
	}
	return get_license_key( 'kadence-blocks' );
}

/**
 * Get the current license key for the plugin.
 */
function kadence_blocks_get_current_product_slug() {
	$blocks_pro_key = class_exists( 'Kadence_Blocks_Pro' ) ? get_license_key( 'kadence-blocks-pro' ) : '';
	if ( ! empty( $blocks_pro_key ) ) {
		return 'kadence-blocks-pro';
	}
	$creative_kit_key = class_exists( 'KadenceWP\CreativeKit\Core' ) ? get_license_key( 'kadence-creative-kit' ) : '';
	if ( ! empty( $creative_kit_key ) ) {
		return 'kadence-creative-kit';
	}
	return 'kadence-blocks';
}

/**
 * Get the current license key for the plugin.
 */
function kadence_blocks_get_current_license_email() {
	if ( ! empty( get_license_key( 'kadence-blocks-pro' ) ) ) {
		return '';
	} else {
		$license_data = kadence_blocks_get_deprecated_pro_license_data();
		if ( $license_data && ! empty( $license_data['api_email'] ) ) {
			return $license_data['api_email'];
		}
	}

	return '';
}

/**
 * Get the current environment.
 */
function kadence_blocks_get_current_env() {
	if ( defined( 'STELLARWP_UPLINK_API_BASE_URL' ) ) {
		switch ( STELLARWP_UPLINK_API_BASE_URL ) {
			case 'https://licensing-dev.stellarwp.com':
				return 'dev';
			case 'https://licensing-staging.stellarwp.com':
				return 'staging';
				
		}
	}
	return '';
}

/**
 * Get the current license key for the plugin.
 *
 * @return array{key: string, email: string, product: string}
 */
function kadence_blocks_get_current_license_data(): array {
	static $cache;

	if ( is_array( $cache ) ) {
		return $cache;
	}

	$license_data = [
		'key'     => kadence_blocks_get_current_license_key(),
		'email'   => kadence_blocks_get_current_license_email(),
		'product' => kadence_blocks_get_current_product_slug(),
		'env'     => kadence_blocks_get_current_env(),
	];

	return $cache = $license_data;
}

/**
 * Check if ai is enabled.
 */
function kadence_blocks_is_ai_disabled() {
	if ( defined( 'KADENCE_BLOCKS_AI_DISABLED' ) && KADENCE_BLOCKS_AI_DISABLED ) {
		return true;
	}
	return false;
}

/**
 * Check if network activation is enabled.
 */
function kadence_blocks_is_network_authorize_enabled() {
	if ( ! is_multisite() ) {
		return false;
	}
	$network_enabled = ! apply_filters( 'kadence_activation_individual_multisites', true );
	if ( ! $network_enabled && defined( 'KADENCE_ACTIVATION_NETWORK_ENABLED' ) && KADENCE_ACTIVATION_NETWORK_ENABLED ) {
		$network_enabled = true;
	}
	return $network_enabled;
}
/**
 * Get the license information.
 *
 * @return array
 */
function kadence_blocks_get_deprecated_pro_license_data() {
	$data                   = false;
	$current_theme          = wp_get_theme();
	$current_theme_name     = $current_theme->get( 'Name' );
	$current_theme_template = $current_theme->get( 'Template' );
	// Check for a classic theme license.
	if ( 'Pinnacle Premium' == $current_theme_name || 'pinnacle_premium' == $current_theme_template || 'Ascend - Premium' == $current_theme_name || 'ascend_premium' == $current_theme_template || 'Virtue - Premium' == $current_theme_name || 'virtue_premium' == $current_theme_template ) {
		$pro_data = get_option( 'kt_api_manager' );
		if ( $pro_data ) {
			$data['ithemes']  = '';
			$data['username'] = '';
			if ( 'Pinnacle Premium' == $current_theme_name || 'pinnacle_premium' == $current_theme_template ) {
				$data['product_id'] = 'pinnacle_premium';
			} elseif ( 'Ascend - Premium' == $current_theme_name || 'ascend_premium' == $current_theme_template ) {
				$data['product_id'] = 'ascend_premium';
			} elseif ( 'Virtue - Premium' == $current_theme_name || 'virtue_premium' == $current_theme_template ) {
				$data['product_id'] = 'virtue_premium';
			}
			$data['api_key']   = $pro_data['kt_api_key'];
			$data['api_email'] = $pro_data['activation_email'];
		}
	} elseif ( is_multisite() && kadence_blocks_is_network_authorize_enabled() ) {
			$data = get_site_option( 'kt_api_manager_kadence_gutenberg_pro_data' );
	} else {
		$data = get_option( 'kt_api_manager_kadence_gutenberg_pro_data' );
	}
	return $data;
}
