<?php
/**
 * Handles uninstalling the telemetry library.
 */

use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Table;
use KadenceWP\KadenceBlocks\Optimizer\Database\Viewport_Hash_Table;
use KadenceWP\KadenceBlocks\StellarWP\Schema\Register;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Uninstall;

require_once plugin_dir_path( __FILE__ ) . 'vendor/vendor-prefixed/autoload.php';
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

Uninstall::run( 'kadence-blocks' );

try {
	Register::remove_table( Viewport_Hash_Table::class );
	Register::remove_table( Optimizer_Table::class );
	// phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
} catch ( Throwable $e ) {
	// Do nothing.
}
