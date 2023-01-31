<?php
/**
 * Handles the Opt-in status for the site.
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

use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Config;
use KadenceWP\KadenceBlocks\StellarWP\Telemetry\Core;

/**
 * Class for handling the Opt-in status for the site.
 *
 * @since 1.0.0
 *
 * @package StellarWP\Telemetry
 */
class Status {
	public const OPTION_NAME     = 'stellarwp_telemetry';
	public const STATUS_ACTIVE   = 1;
	public const STATUS_INACTIVE = 2;
	public const STATUS_MIXED    = 3;

	/**
	 * Gets the option name used to store the opt-in status.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_option_name() {
		/**
		 * Filters the option name used to store the opt-in status.
		 *
		 * @since 1.0.0
		 *
		 * @param string $option_name
		 */
		return apply_filters( 'stellarwp/telemetry/' . Config::get_hook_prefix() . 'option_name', self::OPTION_NAME );
	}

	/**
	 * Gets the current opt-in status.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_option() {
		return get_option( $this->get_option_name(), [] );
	}

	/**
	 * Gets the current Opt-in status.
	 *
	 * The status is stored as an integer because there are multiple possible statuses:
	 * 1 = Active
	 * 2 = Inactive
	 * 3 = Mixed
	 *
	 * @since 1.0.0
	 *
	 * @return integer The status value.
	 */
	public function get() {
		$status = self::STATUS_ACTIVE;
		$option = $this->get_option();

		// If the status option is not an option, default to inactive.
		if ( ! isset( $option['plugins'] ) ) {
			return self::STATUS_INACTIVE;
		}

		foreach ( $option['plugins'] as $plugin ) {

			// If a plugin's status is false, we set the status as inactive.
			if ( false === (bool) $plugin['optin'] ) {
				$status = self::STATUS_INACTIVE;
				continue;
			}

			// If another plugin's status is true and the status is already inactive, we set the status as mixed.
			if ( true === $plugin['optin'] && self::STATUS_INACTIVE === $status ) {
				$status = self::STATUS_MIXED;
				break;
			}
		}

		/**
		 * Filters the opt-in status value.
		 *
		 * @since 1.0.0
		 *
		 * @param integer $status The opt-in status value.
		 */
		return apply_filters( 'stellarwp/telemetry/' . Config::get_hook_prefix() . 'optin_status', $status );
	}

	/**
	 * Gets the site auth token.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_token() {
		$option = $this->get_option();

		/**
		 * Filters the site auth token.
		 *
		 * @since 1.0.0
		 *
		 * @param string $token The site's auth token.
		 */
		return apply_filters( 'stellarwp/telemetry/' . Config::get_hook_prefix() . 'token', $option['token'] ?? '' );
	}

	/**
	 * Determines if the plugin slug exists in the opt-in option array.
	 *
	 * @since 1.0.0
	 *
	 * @param string $stellar_slug The plugin's unique slug.
	 *
	 * @return boolean
	 */
	public function plugin_exists( string $stellar_slug ) {
		$option  = $this->get_option();
		$plugins = $option['plugins'] ?? [];

		return array_key_exists( $stellar_slug, $plugins );
	}

	/**
	 * Adds a plugin slug to the opt-in option array.
	 *
	 * @since 1.0.0
	 *
	 * @param string  $stellar_slug The unique slug identifier for the plugin.
	 * @param boolean $status       The opt-in status for the plugin.
	 *
	 * @return boolean
	 */
	public function add_plugin( string $stellar_slug, bool $status = false ) {
		$option = $this->get_option();

		$option['plugins'][ $stellar_slug ] = [
			'wp_slug' => Config::get_container()->get( Core::PLUGIN_BASENAME ),
			'optin'   => $status,
		];

		return update_option( $this->get_option_name(), $option );
	}

	/**
	 * Removes a plugin slug from the opt-in option array.
	 *
	 * @since 1.0.0
	 *
	 * @param string $stellar_slug The slug to remove from the option.
	 *
	 * @return boolean
	 */
	public function remove_plugin( string $stellar_slug ) {
		$option = $this->get_option();

		// Bail early if the slug does not exist in the option.
		if ( ! isset( $option['plugins'][ $stellar_slug ] ) ) {
			return false;
		}

		unset( $option['plugins'][ $stellar_slug ] );

		return update_option( $this->get_option_name(), $option );
	}

	/**
	 * Get an array of opted-in plugins.
	 *
	 * @since 1.0.0
	 *
	 * @return array<int, array<string, string>>
	 */
	public function get_opted_in_plugins() {
		$option           = $this->get_option();
		$site_plugins_dir = Config::get_container()->get( Core::SITE_PLUGIN_DIR );
		$opted_in_plugins = [];

		// If the status option is not an option, return early.
		if ( ! isset( $option['plugins'] ) ) {
			return $opted_in_plugins;
		}

		foreach ( $option['plugins'] as $stellar_slug => $plugin ) {
			$plugin_data = get_plugin_data( trailingslashit( $site_plugins_dir ) . $plugin['wp_slug'] );

			if ( true === $plugin['optin'] ) {
				$opted_in_plugins[] = [
					'slug'    => $stellar_slug,
					'version' => $plugin_data['Version'],
				];
			}
		}

		return $opted_in_plugins;
	}

	/**
	 * Sets the opt-in status option for the site.
	 *
	 * @since 1.0.0
	 *
	 * @param boolean $status The status to set (Active = 1, Inactive = 2, Mixed = 3).
	 *
	 * @return boolean
	 */
	public function set_status( bool $status ) {
		$option = $this->get_option();

		$option['plugins'][ Config::get_stellar_slug() ]['optin'] = $status;

		return update_option( $this->get_option_name(), $option );
	}

	/**
	 * Gets the site's opt-in status label.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_status() {
		$optin_label = '';

		switch ( $this->get() ) {
			case self::STATUS_ACTIVE:
				$optin_label = __( 'Active', 'stellarwp-telemetry-starter' );
				break;
			case self::STATUS_INACTIVE:
				$optin_label = __( 'Inactive', 'stellarwp-telemetry-starter' );
				break;
			case self::STATUS_MIXED:
				$optin_label = __( 'Mixed', 'stellarwp-telemetry-starter' );
				break;
		}

		/**
		 * Filters the opt-in status label.
		 *
		 * @since 1.0.0
		 *
		 * @param string $optin-Label
		 */
		return apply_filters( 'stellarwp/telemetry/' . Config::get_hook_prefix() . 'optin_status_label', $optin_label );
	}

	/**
	 * Determines if the opt-in status is active.
	 *
	 * @since 1.0.0
	 *
	 * @return boolean
	 */
	public function is_active(): bool {
		return $this->get() === self::STATUS_ACTIVE;
	}
}
