<?php
/**
 * Handles all methods related to rendering the Opt-In template.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 *
 * @license GPL-2.0-or-later
 * Modified by kadencewp on 30-January-2023 using Strauss.
 * @see https://github.com/BrianHenryIE/strauss
 */

namespace KadenceWP\KadenceBlocks\StellarWP\Telemetry\Opt_In;

use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Admin\Resources;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Contracts\Template_Interface;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Core;

/**
 * Handles all methods related to rendering the Opt-In template.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 */
class Opt_In_Template implements Template_Interface {
	protected const YES = '1';
	protected const NO  = '-1';

	/**
	 * The opt-in status object.
	 *
	 * @since 1.0.0
	 *
	 * @var Status
	 */
	protected $opt_in_status;

	/**
	 * The Telemetry constructor
	 *
	 * @param Status $opt_in_status The opt-in status object.
	 */
	public function __construct( Status $opt_in_status ) {
		$this->opt_in_status = $opt_in_status;
	}

	/**
	 * @inheritDoc
	 *
	 * @return void
	 */
	public function enqueue(): void {
		// TODO: Once FE template is done, enqueue it here.
	}

	/**
	 * Gets the arguments for configuring how the Opt-In modal is rendered.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	protected function get_args() {

		$optin_args = [
			'plugin_logo'           => Resources::get_asset_path() . 'resources/images/stellar-logo.svg',
			'plugin_logo_width'     => 151,
			'plugin_logo_height'    => 32,
			'plugin_logo_alt'       => 'StellarWP Logo',
			'plugin_name'           => 'StellarWP',
			'plugin_slug'           => Config::get_stellar_slug(),
			'user_name'             => wp_get_current_user()->display_name,
			'permissions_url'       => '#',
			'tos_url'               => '#',
			'privacy_url'           => 'https://stellarwp.com/privacy-policy/',
			'opted_in_plugins_text' => __( 'See which plugins you have opted in to tracking for', 'stellarwp-telemetry' ),
		];

		$optin_args['opted_in_plugins'] = $this->get_opted_in_plugin_names();

		$optin_args['heading'] = sprintf(
			// Translators: The plugin name.
			__( 'We hope you love %s.', 'stellarwp-telemetry' ),
			$optin_args['plugin_name']
		);
		$optin_args['intro'] = sprintf(
			// Translators: The user name and the plugin name.
			__(
				'Hi, %1$s! This is an invitation to help our StellarWP community.
				If you opt-in, some data about your usage of %2$s and future StellarWP Products will be shared with our teams (so they can work their butts off to improve).
				We will also share some helpful info on WordPress, and our products from time to time.
				And if you skip this, that’s okay! Our products still work just fine.',
				'stellarwp-telemetry'
			),
			$optin_args['user_name'],
			$optin_args['plugin_name']
		);

		/**
		 * Filters the arguments for rendering the Opt-In modal.
		 *
		 * @since 1.0.0
		 *
		 * @param array $optin_args
		 */
		return apply_filters( 'stellarwp/telemetry/' . Config::get_stellar_slug() . '/optin_args', $optin_args );
	}

	/**
	 * @inheritDoc
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function render() {
		load_template( dirname( dirname( __DIR__ ) ) . '/views/optin.php', true, $this->get_args() );
	}

	/**
	 * Gets the option that determines if the modal should be rendered.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_option_name() {
		/**
		 * Filters the name of the option stored in the options table.
		 *
		 * @since 1.0.0
		 *
		 * @param string $show_optin_option_name
		 */
		return apply_filters(
			'stellarwp/telemetry/' . Config::get_hook_prefix() . 'show_optin_option_name',
			'stellarwp_telemetry_' . Config::get_stellar_slug() . '_show_optin'
		);
	}

	/**
	 * Helper function to determine if the modal should be rendered.
	 *
	 * @since 1.0.0
	 *
	 * @return boolean
	 */
	public function should_render() {
		return (bool) get_option( $this->get_option_name(), false );
	}

	/**
	 * Renders the modal if it should be rendered.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function maybe_render() {
		if ( $this->should_render() ) {
			$this->render();
		}
	}

	/**
	 * Gets an array of opted-in plugin names.
	 *
	 * @since 1.0.0
	 *
	 * @return string[]
	 */
	public function get_opted_in_plugin_names() {
		$option           = Config::get_container()->get( Status::class )->get_option();
		$site_plugins_dir = Config::get_container()->get( Core::SITE_PLUGIN_DIR );
		$opted_in_plugins = [];

		foreach ( $option['plugins'] as $plugin ) {
			$plugin_data = get_plugin_data( trailingslashit( $site_plugins_dir ) . $plugin['wp_slug'] );
			if ( true === $plugin['optin'] ) {
				$opted_in_plugins[] = $plugin_data['Name'];
			}
		}

		return $opted_in_plugins;
	}
}
