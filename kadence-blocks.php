<?php
/**
 * Plugin Name: Kadence Blocks – Gutenberg Blocks for Page Builder Features
 * Plugin URI: https://www.kadencewp.com/product/kadence-gutenberg-blocks/
 * Description: Advanced Page Building Blocks for Gutenberg. Create custom column layouts, backgrounds, dual buttons, icons etc.
 * Author: Kadence WP
 * Author URI: https://www.kadencewp.com
 * Version: 1.9.3
 * Text Domain: kadence-blocks
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'KADENCE_BLOCKS_PATH', realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR );
define( 'KADENCE_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'KADENCE_BLOCKS_VERSION', '1.9.3' );

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
	require_once KADENCE_BLOCKS_PATH . 'dist/init.php';
	require_once KADENCE_BLOCKS_PATH . 'dist/form-ajax.php';
	require_once KADENCE_BLOCKS_PATH . 'dist/helper-functions.php';
	require_once KADENCE_BLOCKS_PATH . 'dist/class-kadence-blocks-css.php';
	require_once KADENCE_BLOCKS_PATH . 'dist/class-kadence-blocks-frontend.php';
	require_once KADENCE_BLOCKS_PATH . 'dist/class-kadence-blocks-table-of-contents.php';
	require_once KADENCE_BLOCKS_PATH . 'dist/settings/class-kadence-blocks-settings.php';
}
add_action( 'plugins_loaded', 'kadence_blocks_init' );

/**
 * Load the plugin textdomain
 */
function kadence_blocks_lang() {
	load_plugin_textdomain( 'kadence-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'kadence_blocks_lang' );
