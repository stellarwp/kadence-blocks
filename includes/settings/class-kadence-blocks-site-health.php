<?php
/**
 * The following class Handles Site Health data.
 *
 * @package Kadence Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Kadence_Blocks_Site_Health' ) ) {
	/**
	 * Handles Site Health data.
	 *
	 * @since 4.4.1
	 */
	class Kadence_Blocks_Site_Health {
		private const SITE_HEALTH_KEY = 'kadence-blocks';

		/**
		 * Instance of this class.
		 *
		 * @since 4.4.1
		 *
		 * @var self|null
		 */
		private static $instance = null;

		/**
		 * Fields.
		 *
		 * @var array[]
		 */
		private $fields = array();

		/**
		 * Data Settings array
		 *
		 * @var array $data_settings
		 */
		protected $data_settings = array();

		/**
		* Data Settings Loaded
		*
		* @var boolean $data_settings_loaded
		*/
		protected $data_settings_loaded = false;

		/**
		 * Constructor.
		 *
		 * @since 4.4.1
		 *
		 * @return void
		 */
		private function __construct() {
			add_filter( 'debug_information', array( $this, 'add_site_health_info' ) );
			add_action( 'admin_init', array( $this, 'init_data_settings' ) );
		}
		/**
		 * Initialize the class.
		 *
		 * @since 4.4.1
		 *
		 * @return void
		 */
		public static function init(): void {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
			}
		}
		/**
		 * Verifies Kadence Blocks Debug info Data.
		 */
		public function init_data_settings() {
			if ( ( true !== $this->data_settings_loaded ) ) {
				$this->data_settings_loaded = true;

				$this->data_settings = get_option( 'kadenceblocks_data_settings', array() );

				$data_settings_changed = false;
				if ( ! isset( $this->data_settings['db_version'] ) ) {
					$this->data_settings['db_version'] = 0;
				}

				if ( ! isset( $this->data_settings['version_history'] ) ) {
					$this->data_settings['version_history'] = array();
				}

				if ( ! isset( $this->data_settings['prior_version'] ) ) {
					$this->data_settings['prior_version'] = '';
				}
				if ( empty( $this->data_settings['prior_version'] ) ) {
					if ( get_option( 'kadence_blocks_config_blocks' ) ) {
						// If we have a prior version of KB.
						$this->data_settings['prior_version'] = '0.0.0.0';
					} else {
						// Else we have a new install.
						$this->data_settings['prior_version'] = 'new';
					}
					$this->data_settings['version_history'][0] = $this->data_settings['prior_version'];
					$data_settings_changed          = true;
				}
				if ( ! isset( $this->data_settings['current_version'] ) ) {
					$this->data_settings['current_version'] = KADENCE_BLOCKS_VERSION;
				}
				if ( ! isset( $this->data_settings['current_version'] ) ) {
					$this->data_settings['current_version'] = 0;
				}
				if ( version_compare( KADENCE_BLOCKS_VERSION, $this->data_settings['current_version'], 'ne' ) ) {
					if ( ! empty( $this->data_settings['current_version'] ) ) {
						$this->data_settings['prior_version'] = $this->data_settings['current_version'];
						if ( ! isset( $this->data_settings['version_history'][0] ) ) {
							$this->data_settings['version_history'][0] = $this->data_settings['prior_version'];
						}
					}

					$this->data_settings['current_version']           = KADENCE_BLOCKS_VERSION;
					$this->data_settings['version_history'][ time() ] = KADENCE_BLOCKS_VERSION;
					$data_settings_changed                 = true;
				}

				if ( empty( $this->data_settings['version_history'] ) ) {
					$this->data_settings['version_history'][ time() ] = $this->data_settings['current_version'];
					$this->data_settings['version_history'][0]        = $this->data_settings['prior_version'];
					$data_settings_changed                 = true;
				}

				if ( true === $data_settings_changed ) {
					krsort( $this->data_settings['version_history'] );
					$this->data_settings['version_history'] = array_slice( $this->data_settings['version_history'], 0, 25, true );

					update_option( 'kadenceblocks_data_settings', $this->data_settings );
				}
			}
		}
		/**
		 * Add Telemetry info to Site Health.
		 *
		 * @since 4.4.1
		 *
		 * @param array $debug_info Info.
		 *
		 * @return array Debug info.
		 */
		public function add_site_health_info( array $debug_info ): array {
			$debug_info[ self::SITE_HEALTH_KEY ] = array(
				'label'  => __( 'Kadence Blocks', 'kadence-blocks' ),
				'fields' => $this->get_fields(),
			);

			return $debug_info;
		}

		/**
		 * Maps the telemetry data to the Site Health fields.
		 *
		 * @return array
		 */
		private function get_fields(): array {
			if ( ! empty( $this->fields ) ) {
				return $this->fields;
			}

			$this->fields = array_merge(
				$this->map_general_fields()
			);

			return $this->fields;
		}

		/**
		 * Maps general fields.
		 *
		 * @return array
		 */
		private function map_general_fields(): array {
			$last_updated     = array_keys( $this->get_data_settings( 'version_history' ) )[0] ?? 0;
			$block_defaults = get_option( 'kadence_blocks_config_blocks' );
			$block_visibility = get_option( 'kadence_blocks_settings_blocks' );
			$block_colors = get_option( 'kadence_blocks_colors' );
			$block_recaptcha = get_option( 'kadence_blocks_recaptcha_site_key' );
			$mailerlite = get_option( 'kadence_blocks_mailerlite_api' );
			$maps_api = get_option( 'kadence_blocks_google_maps_api' );
			$cloud_connect = get_option( 'kadence_blocks_cloud' );
			$unregistered_blocks = get_option( 'kt_blocks_unregistered_blocks', array() );
			$deactivated_blocks = '';
			if ( ! empty( $unregistered_blocks ) && is_array( $unregistered_blocks ) ) {
				$deactivated_blocks = implode( ',', $unregistered_blocks );
			}
			return array(
				'version'           => array(
					'label' => __( 'Version', 'kadence-blocks' ),
					'value' => KADENCE_BLOCKS_VERSION,
				),
				'last_updated'      => array(
					'label' => __( 'Last updated', 'kadence-blocks' ),
					'value' => $last_updated > 0 ? $this->adjust_date_time_display( $last_updated ) : __( 'Unknown', 'kadence-blocks' ),
					'debug' => $last_updated,
				),
				'previous_version'  => array(
					'label' => __( 'Previous version', 'kadence-blocks' ),
					'value' => $this->get_data_settings( 'prior_version' ),
				),
				'pro_active'  => array(
					'label' => __( 'Has Pro', 'kadence-blocks' ),
					'value' => ( class_exists( 'Kadence_Blocks_Pro' ) ? 'Yes' : 'No' ),
				),
				'deactivated_blocks'  => array(
					'label' => __( 'Deactivated Blocks', 'kadence-blocks' ),
					'value' => ( ! empty( $deactivated_blocks ) ? $deactivated_blocks : __( 'None', 'kadence-blocks' ) ),
				),
				'block_defaults'  => array(
					'label' => __( 'Has Block Defaults', 'kadence-blocks' ),
					'value' => $this->check_for_empty_json( $block_defaults ),
				),
				'block_visibility'  => array(
					'label' => __( 'Using Setting Visibility', 'kadence-blocks' ),
					'value' => $this->check_for_empty_json( $block_visibility ),
				),
				'custom_colors'  => array(
					'label' => __( 'Has Custom Colors', 'kadence-blocks' ),
					'value' => ( ! empty( $block_colors ) ? 'Yes' : 'No' ),
				),
				'recaptcha_key'  => array(
					'label' => __( 'Has reCAPTCHA key', 'kadence-blocks' ),
					'value' => ( ! empty( $block_recaptcha ) ? 'Yes' : 'No' ),
				),
				'maps_key'  => array(
					'label' => __( 'Has a maps API key', 'kadence-blocks' ),
					'value' => ( ! empty( $maps_api ) ? 'Yes' : 'No' ),
				),
				'mailerlite_key'  => array(
					'label' => __( 'Has MailerLite key', 'kadence-blocks' ),
					'value' => ( ! empty( $mailerlite ) ? 'Yes' : 'No' ),
				),
				'cloud_connect'  => array(
					'label' => __( 'Has Cloud Library', 'kadence-blocks' ),
					'value' => ( ! empty( $cloud_connect ) ? 'Yes' : 'No' ),
				),
			);
		}
		/**
		 * Get the LearnDash Settings array
		 *
		 * @since 2.6.0
		 *
		 * @param string $key optional to return only specific key value.
		 *
		 * @return mixed.
		 */
		public function get_data_settings( $key = '' ) {
			$this->init_data_settings( true );

			if ( ! empty( $key ) ) {
				if ( isset( $this->data_settings[ $key ] ) ) {
					return $this->data_settings[ $key ];
				}
			} else {
				return $this->data_settings;
			}
		}

		/**
		 * Converts a timestamp to local timezone adjusted display.
		 *
		 * @since 2.2.0
		 *
		 * @param int    $timestamp      Optional. The timestamp to display. Default 0.
		 * @param string $display_format Optional. The time display format. Default empty.
		 *
		 * @return string The adjusted date time display.
		 */
		public function adjust_date_time_display( $timestamp = 0, $display_format = '' ) {
			$date_time_display = '';

			if ( ! empty( $timestamp ) ) {
				if ( empty( $display_format ) ) {
					$date_format = get_option( 'date_format', 'Y-m-d' );
					if ( empty( $date_format ) ) {
						$date_format = 'Y-m-d';
					}

					$time_format = get_option( 'time_format', 'H:i:s' );
					if ( empty( $time_format ) ) {
						$time_format = 'H:i:s';
					}
				}

				// First we convert the timestamp to local Y-m-d H:i:s format.
				$date_time_display = get_date_from_gmt( date( 'Y-m-d H:i:s', $timestamp ), 'Y-m-d H:i:s' ); // phpcs:ignore WordPress.DateTime.RestrictedFunctions.date_date

				// Then we take that value and reconvert it to a timestamp and call date_i18n to translate the month, date name etc.
				$date_time_display = date_i18n( $display_format, strtotime( $date_time_display ) );
			}
			return $date_time_display;
		}
		/**
		 * Converts a string value to the "Yes" or "No" string.
		 *
		 * @param string $value Value.
		 *
		 * @return string
		 */
		private function check_for_empty_json( $value ) {
			if ( ! isset( $value ) ) {
				return __( 'No', 'kadence-blocks' );
			} elseif ( empty( $value ) ) {
				return __( 'No', 'kadence-blocks' );
			} elseif ( '{}' === $value ) {
				return __( 'No', 'kadence-blocks' );
			}
			return __( 'Yes', 'kadence-blocks' );
		}
		/**
		 * Converts a boolean value to the "On" or "Off" string.
		 *
		 * @param bool $value Value.
		 *
		 * @return string
		 */
		private function bool_to_on_off_string( bool $value ): string {
			return $value ? __( 'On', 'kadence-blocks' ) : __( 'Off', 'kadence-blocks' );
		}

		/**
		 * Converts a boolean value to the "Yes" or "No" string.
		 *
		 * @param bool $value Value.
		 *
		 * @return string
		 */
		private function bool_to_yes_no_string( bool $value ): string {
			return $value ? __( 'Yes', 'kadence-blocks' ) : __( 'No', 'kadence-blocks' );
		}
	}
}
Kadence_Blocks_Site_Health::init();
