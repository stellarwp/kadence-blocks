<?php
/**
 * Handles uninstalling the telemetry library.
 */

use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\lucatume\DI52\Container;
use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Table;
use KadenceWP\KadenceBlocks\Optimizer\Database\Viewport_Hash_Table;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\ContainerAdapter;
use KadenceWP\KadenceBlocks\StellarWP\Schema\Register;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Uninstall;

// Prevent direct file access.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	die;
}

require_once plugin_dir_path( __FILE__ ) . 'vendor/vendor-prefixed/autoload.php';
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

Uninstall::run( 'kadence-blocks' );

try {
	// Boot the Kadence application to set up all providers.
	$app = App::instance( new ContainerAdapter( new Container() ) );

	// Remove optimization tables.
	Register::remove_table( Viewport_Hash_Table::class );
	Register::remove_table( Optimizer_Table::class );
} catch ( Throwable $e ) {
	if ( function_exists( 'error_log' ) && defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		error_log( 'An error occurred when uninstalling Kadence Blocks: ' . $e->getMessage() );
	}
}
