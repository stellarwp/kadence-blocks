<?php
/**
 * Handles uninstalling the telemetry library.
 */

use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Uninstall;

require_once plugin_dir_path( __FILE__ ) . 'vendor/vendor-prefixed/autoload.php';
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

Uninstall::run( 'kadence-blocks' );
