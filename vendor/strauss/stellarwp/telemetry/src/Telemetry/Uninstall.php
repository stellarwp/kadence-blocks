<?php
/**
 * Registers methods used for uninstalling the current instance of the library.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 *
 * @license GPL-2.0-or-later
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\Telemetry;

use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Status;

/**
 * Uninstall class used for uninstalling the current instance of the library.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 */
class Uninstall {

	/**
	 * Removes necessary items from the options table.
	 *
	 * @since 1.0.0
	 *
	 * @param string $stellar_slug The slug for the plugin being deleted.
	 *
	 * @return void
	 */
	public static function run( string $stellar_slug ) {
		$opt_in_status = new Status();

		if ( $opt_in_status->plugin_exists( $stellar_slug ) ) {
			$opt_in_status->remove_plugin( $stellar_slug );
		}

		$optin_option_name = 'stellarwp_telemetry_' . $stellar_slug . '_show_optin';

		if ( get_option( $optin_option_name ) !== false ) {
			delete_option( $optin_option_name );
		}

		// If this is the last plugin in the optin option, let's remove the option entirely.
		self::maybe_remove_optin_option();
	}

	/**
	 * Removes the main telemetry option if the current plugin is the last one to use it.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public static function maybe_remove_optin_option() {
		$optin = get_option( 'stellarwp_telemetry' );

		// Bail if option has more than 'token' in the array.
		if ( count( $optin ) > 1 ) {
			return;
		}

		// All plugins have been removed, the token should be the only item in the array.
		if ( array_key_exists( 'token', $optin ) ) {
			delete_option( 'stellarwp_telemetry' );
			delete_option( 'stellarwp_telemetry_last_send' );
		}
	}
}
