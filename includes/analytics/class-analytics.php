<?php
/**
 * General Analytics class responsible for sending events to Prophecy WP.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * REST API Products controller class.
 */
class Analytics {

	/**
	 * The event endpoint.
	 */
	public const ENDPOINT = '/wp-json/prophecy/v1/analytics/event';

	/**
	 * The API domain.
	 */
	public const DOMAIN = 'https://content.startertemplatecloud.com';

	/**
	 * Registers all necessary hooks.
	 *
	 * @action plugins_loaded
	 *
	 * @return void
	 */
	public function register() {
		add_action( 'stellarwp/analytics/event', [ $this, 'handle_event' ], 10, 2 );
	}

	/**
	 * Sends events to Prophecy WP (if the user has installed and activated Kadence Blocks Pro).
	 *
	 * @return void
	 */
	public function handle_event( string $name, array $context ) {

		// Only track events when Kadence Blocks Pro is active.
		if ( ! class_exists( 'Kadence_Blocks_Pro' ) ) {
			return;
		}

		/**
		 * Filters the URL used to send events to.
		 *
		 * @param string The URL to use when sending events.
		 */
		$url = apply_filters( 'stellarwp/analytics/event_url', self::DOMAIN . self::ENDPOINT );

		$response = wp_remote_post(
			$url,
			array(
				'timeout' => 20,
				'headers' => array(
					'X-Prophecy-Token' => $this->get_prophecy_token_header(),
					'Content-Type' => 'application/json',
				),
				'body' => wp_json_encode( [
					'name'    => $name,
					'context' => $context,
				]),
			)
		);
	}

	/**
	 * Constructs a consistent X-Prophecy-Token header.
	 *
	 * @param array $args An array of arguments to include in the encoded header.
	 *
	 * @return string The base64 encoded string.
	 */
	public static function get_prophecy_token_header( $args = [] ) {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}

		$site_url     = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$current_user = wp_get_current_user();
		$site_name    = get_bloginfo( 'name' );

		$defaults = [
			'date_time'       => current_time( 'mysql' ),
			'domain'          => $site_url,
			'key'             => '',
			'user_id'         => $current_user->ID,
			'email'           => $current_user->email,
			'site_name'       => $site_name,
			'product_slug'    => 'kadence-blocks',
			'product_version' => KADENCE_BLOCKS_VERSION
		];

		$parsed_args = wp_parse_args( $args, $defaults );

		return base64_encode( json_encode( $parsed_args ) );
	}

}
