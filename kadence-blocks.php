<?php
/**
 * Plugin Name: Kadence Blocks - Gutenberg Page Builder Blocks
 * Plugin URI: https://www.kadencethemes.com
 * Description: Custom Blocks for for Gutenberg
 * Author: Kadence Themes
 * Author URI: https://www.kadencethemes.com
 * Version: 0.2.0
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
define( 'KT_BLOCKS_VERSION', '0.2.0' );

/**
 * Block Initializer.
 */
require_once KT_BLOCKS_PATH . 'dist/init.php';
