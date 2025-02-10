<?php
/**
 * Plugin Name: Kadence Blocks – Gutenberg Blocks for Page Builder Features
 * Plugin URI: https://www.kadencewp.com/product/kadence-gutenberg-blocks/
 * Description: Advanced Page Building Blocks for Gutenberg. Create custom column layouts, backgrounds, dual buttons, icons etc.
 * Author: Kadence WP
 * Author URI: https://www.kadencewp.com
 * Version: 3.4.9
 * Requires PHP: 7.4
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
define( 'KADENCE_BLOCKS_VERSION', '3.4.9' );

require_once plugin_dir_path( __FILE__ ) . 'vendor/vendor-prefixed/autoload.php';
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\ContainerAdapter;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Core as Telemetry;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Config as UplinkConfig;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Register;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Uplink;

/**
 * Add a check before redirecting.
 */
function kadence_blocks_activate(): void {
	add_option( 'kadence_blocks_redirect_on_activation', true );
}
register_activation_hook( __FILE__, 'kadence_blocks_activate' );

/**
 * Load Plugin.
 */
function kadence_blocks_init(): void {
	$container = new ContainerAdapter( new \KadenceWP\KadenceBlocks\lucatume\DI52\Container() );

	// The Kadence Blocks Application.
	App::instance( $container );

	require_once KADENCE_BLOCKS_PATH . 'includes/init.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/form-ajax.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/helper-functions.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-editor-assets.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-schema-updater.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-prebuilt-library.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-google-fonts.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-helper.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-css.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-frontend.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-table-of-contents.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-duplicate-post.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-cpt-import-export.php';
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
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-identity-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-posts-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-progress-bar-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-search-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-show-more-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-spacer-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-data-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-row-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-of-contents-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-tabs-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonials-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonial-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-navigation-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-navigation-link-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-header-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-videopopup-block.php';

	require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-settings.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-posts-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-prebuilt-library-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-mailerlite-form-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-fluentcrm-form-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-get-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-post-rest-api.php';
	// Advanced Form.
	require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-init.php';
	// Navigation
	require_once KADENCE_BLOCKS_PATH . 'includes/navigation/class-kadence-navigation-cpt.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/navigation/class-kadence-navigation-rest.php';
	// Header
	require_once KADENCE_BLOCKS_PATH . 'includes/header/class-kadence-header-cpt.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/header/class-kadence-header-rest.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-container-desktop-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-container-tablet-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-section-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-row-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-header-column-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-off-canvas-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/header/class-kadence-blocks-off-canvas-trigger-block.php';

	// SVG render.
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-svg.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-local-gfonts.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-image-picker-rest.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-image-picker.php';

	/**
	 * Site Health.
	 */
	require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-site-health.php';

	/**
	 * Telemetry.
	 */
	Config::set_container( $container );
	Config::set_server_url( 'https://telemetry.stellarwp.com/api/v1' );
	Config::set_hook_prefix( 'kadence-blocks' );
	Config::set_stellar_slug( 'kadence-blocks' );
	Telemetry::instance()->init( __FILE__ );
	/**
	 * AI-specific usage tracking. Only track if AI is opted in by user.
	 */
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-ai-events.php';
	$ai_events = new Kadence_Blocks_AI_Events();
	$ai_events->register();

	/**
	 * Uplink.
	 */
	UplinkConfig::set_container( $container );
	UplinkConfig::set_hook_prefix( 'kadence-blocks' );
	UplinkConfig::set_token_auth_prefix( 'kadence' );
	UplinkConfig::set_auth_cache_expiration( WEEK_IN_SECONDS );
	Uplink::init();

	Register::plugin(
		'kadence-blocks',
		'Kadence Blocks',
		KADENCE_BLOCKS_VERSION,
		'kadence-blocks/kadence-blocks.php',
		Kadence_Blocks::class
	);

	do_action( 'kadence_blocks_uplink_loaded' );

	add_filter( 'stellarwp/uplink/kadence-blocks/prevent_update_check', '__return_true' );
	add_filter(
		'stellarwp/uplink/kadence-blocks/api_get_base_url',
		static function () {
			return 'https://licensing.kadencewp.com';
		},
		10,
		0
	);
}
add_action( 'plugins_loaded', 'kadence_blocks_init', 1 );

/**
 * Load the plugin textdomain
 */
function kadence_blocks_lang(): void {
	load_plugin_textdomain( 'kadence-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'kadence_blocks_lang' );
