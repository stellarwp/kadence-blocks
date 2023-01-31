<?php
/**
 * Handles hooking into the WordPress request lifecycle.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 *
 * @license GPL-2.0-or-later
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\Telemetry\Telemetry;

use DateTimeImmutable;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Contracts\Abstract_Subscriber;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Last_Send\Last_Send;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In\Status;

/**
 * Class Telemetry_Subscriber
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 */
class Telemetry_Subscriber extends Abstract_Subscriber {

	/**
	 * @inheritDoc
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'shutdown', [ $this, 'send_async_request' ] );
		add_action( 'wp_ajax_' . Telemetry::AJAX_ACTION, [ $this, 'send_telemetry_data' ], 10, 1 );
		add_action( 'wp_ajax_nopriv_' . Telemetry::AJAX_ACTION, [ $this, 'send_telemetry_data' ], 10, 1 );
	}

	/**
	 * Sends an async request during the 'shutdown' action.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function send_async_request() {

		if ( ! $this->container->get( Status::class )->is_active() ) {
			return;
		}

		$last_send = $this->container->get( Last_Send::class );

		// Bail if last send timestamp is not expired.
		if ( ! $last_send->is_expired() ) {
			return;
		}

		// The last send is expired, set a new timestamp.
		$timestamp     = new DateTimeImmutable();
		$rows_affected = $last_send->set_new_timestamp( $timestamp );

		// We weren't able to update the timestamp, another process may have updated it first.
		if ( 0 === $rows_affected ) {
			return;
		}

		$url = admin_url( 'admin-ajax.php' );

		wp_remote_post(
			$url,
			[
				'blocking'  => false,
				'sslverify' => false,
				'body'      => [
					'action' => Telemetry::AJAX_ACTION,
				],
			]
		);
	}

	/**
	 * Sends telemetry data to the server.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function send_telemetry_data() {
		$this->container->get( Telemetry::class )->send_data();
		exit();
	}
}
