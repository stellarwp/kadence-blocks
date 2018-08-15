<?php
/**
 * Plugin Name: Kadence Blocks - Gutenberg Page Builder Blocks
 * Plugin URI: https://www.kadencethemes.com/product/kadence-gutenberg-blocks/
 * Description: Advanced Page Building Blocks for Gutenberg. Create custom column layouts and backgrounds with the responsive Row / Layout Block.
 * Author: Kadence Themes
 * Author URI: https://www.kadencethemes.com
 * Version: 1.0.0
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

define( 'KT_BLOCKS_PATH', realpath( plugin_dir_path( __FILE__ ) ) . DIRECTORY_SEPARATOR );
define( 'KT_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'KT_BLOCKS_VERSION', '1.0.0' );

/**
 * Load Plugin
 */
function kadence_blocks_init() {
	require_once KT_BLOCKS_PATH . 'dist/init.php';
	require_once KT_BLOCKS_PATH . 'dist/settings/class-kadence-blocks-settings.php';
}
add_action( 'plugins_loaded', 'kadence_blocks_init' );

/**
 * Load the plugin textdomain
 */
function kadence_blocks_lang() {
	load_plugin_textdomain( 'kadence-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
}
add_action( 'init', 'kadence_blocks_lang' );