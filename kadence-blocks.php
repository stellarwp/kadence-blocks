<?php
/**
 * Plugin Name: Kadence Blocks – Gutenberg Blocks for Page Builder Features
 * Plugin URI: https://www.kadencewp.com/product/kadence-gutenberg-blocks/
 * Description: Advanced Page Building Blocks for Gutenberg. Create custom column layouts, backgrounds, dual buttons, icons etc.
 * Author: Kadence WP
 * Author URI: https://www.kadencewp.com
 * Version: 3.0.2
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
define( 'KADENCE_BLOCKS_VERSION', '3.0.2' );
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
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-prebuilt-library.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-google-fonts.php';
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
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-show-more-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-spacer-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-table-of-contents-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-tabs-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonials-block.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-testimonial-block.php';

	require_once KADENCE_BLOCKS_PATH . 'includes/settings/class-kadence-blocks-settings.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-posts-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-mailerlite-form-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-fluentcrm-form-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-get-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/class-lottieanimation-post-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/convertkit-rest-api.php';
	require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/activecampaign-rest-api.php';
	if ( apply_filters( 'enable_kadence_advanced_form_block', false ) ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/blocks/class-kadence-blocks-advanced-form-block.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form/advanced-form-cpt.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/advanced-form-ajax.php';
	}
	require_once KADENCE_BLOCKS_PATH . 'includes/class-kadence-blocks-svg.php';
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
 * Plugin Updates
 */
function kadence_blocks_beta_updating() {
	require_once KADENCE_BLOCKS_PATH . 'includes/kadence-update-checker/kadence-update-checker.php';
	$Kadence_Blocks_Beta_Update_Checker = Kadence_Update_Checker::buildUpdateChecker(
		'https://kernl.us/api/v1/updates/639a3259e11b4fa99448e87f/',
		__FILE__,
		'kadence-blocks'
	);
}
add_action( 'after_setup_theme', 'kadence_blocks_beta_updating', 1 );
