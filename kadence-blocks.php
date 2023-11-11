<?php
/**
 * Plugin Name: Kadence Blocks – Gutenberg Blocks for Page Builder Features
 * Plugin URI: https://www.kadencewp.com/product/kadence-gutenberg-blocks/
 * Description: Advanced Page Building Blocks for Gutenberg. Create custom column layouts, backgrounds, dual buttons, icons etc.
 * Author: Kadence WP
 * Author URI: https://www.kadencewp.com
 * Version: 3.2.5
 * Requires PHP: 7.2
 * Text Domain: kadence-blocks
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KADENCE_BLOCKS_PATH', realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR );
define( 'KADENCE_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'KADENCE_BLOCKS_VERSION', '3.2.5' );

require_once plugin_dir_path( __FILE__ ) . 'vendor/vendor-prefixed/autoload.php';
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';


use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Core as Telemetry;
use KadenceWP\KadenceBlocks\Container;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Config as UplinkConfig;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Uplink;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Register;
/**
 * Add a check before redirecting
 */
function kadence_blocks_activate() {
	add_option( 'kadence_blocks_redirect_on_activation', true );
}
register_activation_hook( __FILE__, 'kadence_blocks_activate' );

/**
 * Load Plugin
 */
function kadence_blocks_init() {
	require_once KADENCE_BLOCKS_PATH . 'includes/init.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/form-ajax.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/helper-functions.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-schema-updater.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-prebuilt-library.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-google-fonts.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-helper.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-css.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-frontend.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-table-of-contents.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-abstract-block.php';

	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-row-layout-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-column-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-accordion-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advancedgallery-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advancedbtn-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-singlebtn-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advanced-heading-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-countdown-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-countup-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-form-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-googlemaps-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-icon-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-single-icon-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-icon-list-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-single-icon-list-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-infobox-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-image-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-lottie-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-posts-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-progress-bar-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-show-more-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-spacer-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-of-contents-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-tabs-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonials-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonial-block.php';

	require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-settings.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-posts-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-prebuilt-library-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-mailerlite-form-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-fluentcrm-form-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-get-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-post-rest-api.php';
	// Advanced Form.
	require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-init.php';
	// SVG render.
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-svg.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-local-gfonts.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-image-picker-rest.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-image-picker.php';

	/**
	 * Site Health
	 */
	require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-site-health.php';

	/**
	 * Telemetry.
	 */
	$telemetry_container = new Container();
	Config::set_container( $telemetry_container );
	Config::set_server_url( 'https://telemetry.stellarwp.com/api/v1' );
	Config::set_hook_prefix( 'kadence-blocks' );
	Config::set_stellar_slug( 'kadence-blocks' );
	Telemetry::instance()->init( __FILE__ );

	/**
	 * AI-specific analytics.
	 */
	require_once KADENCE_BLOCKS_PATH . 'includes/analytics/class-analytics.php';
	$analytics = new Analytics();
	$analytics->register();

	/**
	 * Uplink.
	 */
	$uplink_container = new Container();
	UplinkConfig::set_container( $uplink_container );
	UplinkConfig::set_hook_prefix( 'kadence-blocks' );
	UplinkConfig::set_token_auth_prefix( 'kadence' );
	Uplink::init();

	Register::plugin(
		'kadence-blocks',
		'Kadence Blocks',
		KADENCE_BLOCKS_VERSION,
		'kadence-blocks/kadence-blocks.php',
		Kadence_Blocks::class,
	);
}
add_action( 'plugins_loaded', 'kadence_blocks_init' );

/**
 * Load the plugin textdomain
 */
function kadence_blocks_lang() {
	load_plugin_textdomain( 'kadence-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'kadence_blocks_lang' );

/**
 * Beta Plugin Updates
 */
function kt_blocks_beta_updating() {
	if ( file_exists( KADENCE_BLOCKS_PATH . 'kadence-update-checker/kadence-update-checker.php' ) ) {
		require_once KADENCE_BLOCKS_PATH . 'kadence-update-checker/kadence-update-checker.php';
		$kadence_blocks_beta_update_checker = Kadence_Update_Checker::buildUpdateChecker(
			'https://kernl.us/api/v1/updates/639a3259e11b4fa99448e87f/',
			__FILE__,
			'kadence-blocks'
		);
	}
}
add_action( 'after_setup_theme', 'kt_blocks_beta_updating', 1 );

/**
 * Plugin Updated.
 */
function kt_blocks_updated( $upgrader_object, $options ): void {

	if ( $options['action'] !== 'update' || $options['type'] !== 'plugin' ) {
		return;
	}

	$plugin_path = plugin_basename(__FILE__);

	if ( ! isset($options['plugins']) || ! in_array( $plugin_path, $options['plugins'] ) ) {
		return;
	}

	if ( ! function_exists( 'get_plugin_data' ) ) {
		require_once ABSPATH . 'wp-admin/includes/plugin.php';
	}

	$current_plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin_path );
	$new_version         = $current_plugin_data['Version'];

	do_action( 'stellarwp/analytics/event', 'Plugin Updated', array(
		'product_name'             => $current_plugin_data['Name'],
		'previous_product_version' => get_option( 'my_plugin_previous_version' ),
		'new_version'              => $new_version,
	) );

	update_option( 'kadence_blocks_previous_version', $new_version );
}
add_action( 'upgrader_process_complete', 'kt_blocks_updated', 10, 2 );
