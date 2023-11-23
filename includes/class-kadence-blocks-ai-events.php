<?php
/**
 * Class responsible for sending events AI Events to Stellar Prophecy WP AI.
 */

use KadenceWP\KadenceBlocks\StellarWP\Uplink\Config as UplinkConfig;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Site\Data;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Auth\Token\Contracts\Token_Manager;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Class responsible for sending events AI Events to Stellar Prophecy WP AI.
 */
class Kadence_Blocks_AI_Events {

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

		// Only pass tracking events if AI has been activated through Opt in.
		$container     = UplinkConfig::get_container();
		$token_manager = $container->get( Token_Manager::class );
		$token         = $token_manager->get();
		$is_authorized = false;
		if ( $token ) {
			$is_authorized = is_authorized( $license_key, $token, $data->get_domain() );
		}
		if ( ! $is_authorized ) {
			return;
		}

		/**
		 * Filters the URL used to send events to.
		 *
		 * @param string The URL to use when sending events.
		 */
		$url = apply_filters( 'stellarwp/analytics/event_url', self::DOMAIN . self::ENDPOINT );

		wp_remote_post(
			$url,
			array(
				'timeout'  => 20,
				'blocking' => false,
				'headers'  => array(
					'X-Prophecy-Token' => $this->get_prophecy_token_header(),
					'Content-Type'     => 'application/json',
				),
				'body'     => wp_json_encode( [
					'name'    => $name,
					'context' => $context,
				] ),
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
		$container     = UplinkConfig::get_container();
		$data          = $container->get( Data::class );

		$site_url     = $data->get_domain();
		$site_name    = get_bloginfo( 'name' );
		$license_data = kadence_blocks_get_current_license_data();

		$defaults = [
			'domain'          => $site_url,
			'key'             => ! empty( $license_data['key'] ) ? $license_data['key'] : '',
			'email'           => ! empty( $license_data['email'] ) ? $license_data['email'] : '',
			'site_name'       => $site_name,
			'product_slug'    => apply_filters( 'kadence-blocks-auth-slug', 'kadence-blocks' ),
			'product_version' => KADENCE_BLOCKS_VERSION,
		];

		$parsed_args = wp_parse_args( $args, $defaults );

		return base64_encode( json_encode( $parsed_args ) );
	}
}
