<?php
/**
 * Handles all methods for determining when to send telemetry data.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 *
 * @license GPL-2.0-or-later
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\Telemetry\Last_Send;

use DateTimeImmutable;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;

/**
 * Handles all methods for determining when to send telemetry data.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 */
class Last_Send {

	public const OPTION_NAME = 'stellarwp_telemetry_last_send';

	/**
	 * Initially sets the _last_send option in the options table.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function initialize_option() {
		if ( get_option( self::OPTION_NAME ) === false ) {
			update_option( self::OPTION_NAME, '' );
		}
	}

	/**
	 * Checks whether the last send timestamp is expired or not.
	 *
	 * If the timestamp is >= 1 week, the last send is expired.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function is_expired() {

		$last_send = $this->get_timestamp();

		// No timestamp exists, we'll assume that telemetry data needs to be sent.
		if ( '' === $last_send ) {
			return true;
		}

		/**
		 * Filters the amount of seconds the last send timestamp is valid before it expires.
		 *
		 * @since 1.0.0
		 *
		 * @param integer $expire_seconds
		 */
		$expire_seconds = apply_filters( 'stellarwp/telemetry/' . Config::get_hook_prefix() . 'last_send_expire_seconds', 7 * DAY_IN_SECONDS );

		$last_run_time = new DateTimeImmutable( $last_send );
		$next_run_time = $last_run_time->add( new \DateInterval( "PT{$expire_seconds}S" ) );
		return $next_run_time <= new DateTimeImmutable();
	}

	/**
	 * Sets a new timestamp for the last_send option.
	 *
	 * @param DateTimeImmutable $time The time to use for the timestamp.
	 *
	 * @return int Number of rows affected.
	 */
	public function set_new_timestamp( DateTimeImmutable $time ) {
		global $wpdb;

		$timestamp         = $time->format( 'Y-m-d H:i:s' );
		$option_name       = self::OPTION_NAME;
		$current_timestamp = $this->get_timestamp();

		/**
		 * Update the timestamp and use the current timestamp to make sure it
		 * is only updated a single time.
		 */
		$result = $wpdb->update( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->options,
			[
				'option_name'  => $option_name,
				'option_value' => $timestamp,
			],
			[
				'option_name'  => $option_name,
				'option_value' => $current_timestamp,
			]
		);

		if ( false === $result ) {
			return 0;
		}

		return $result;
	}

	/**
	 * Queries the database directly to get the timestamp.
	 *
	 * This avoids any filters being applied than are necessary.
	 *
	 * @since 1.0.0
	 *
	 * @return string The timestamp of the last send.
	 */
	public function get_timestamp() {
		global $wpdb;

		$result = $wpdb->get_var( // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching
			$wpdb->prepare(
				"SELECT option_value FROM {$wpdb->options} WHERE option_name = %s",
				self::OPTION_NAME
			)
		);

		if ( is_null( $result ) ) {
			return '';
		}

		return $result;
	}

}
