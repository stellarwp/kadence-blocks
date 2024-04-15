<?php
/**
 * Class for pulling in library database and saving locally
 * Based on a package from the WPTT Team for local fonts.
 *
 * @package Kadence Blocks
 */

 if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class for pulling in template database and saving locally
 */
class Kadence_Blocks_Prebuilt_Library {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * API key for kadence
	 *
	 * @var null
	 */
	private $api_key = '';

	/**
	 * API email for kadence
	 *
	 * @var string
	 */
	private $api_email = '';

	/**
	 * API product for kadence
	 *
	 * @var string
	 */
	private $product_id = '';

	/**
	 * API email for kadence
	 *
	 * @var string
	 */
	private $package = 'section';

	/**
	 * Is a template for Kadence. 
	 *
	 * @var bool
	 */
	private $is_template = false;

	/**
	 * API email for kadence
	 *
	 * @var string
	 */
	private $url = '';

	/**
	 * Base URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $base_url;
	/**
	 * Base path.
	 *
	 * @access protected
	 * @var string
	 */
	protected $base_path;
	/**
	 * Subfolder name.
	 *
	 * @access protected
	 * @var string
	 */
	protected $subfolder_name;

	/**
	 * The starter templates folder.
	 *
	 * @access protected
	 * @var string
	 */
	protected $block_library_folder;
	/**
	 * The local stylesheet's path.
	 *
	 * @access protected
	 * @var string
	 */
	protected $local_template_data_path;
	/**
	 * The local stylesheet's path.
	 *
	 * @access protected
	 * @var string
	 */
	protected $local_pages_data_path;

	/**
	 * The local stylesheet's URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $local_template_data_url;
	/**
	 * The local stylesheet's URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $local_pages_data_url;
	/**
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_url = 'https://patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/get/';

	/**
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_pages_url = 'https://patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/pages/';

	/**
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_templates_url = 'https://api.startertemplatecloud.com/wp-json/kadence-starter/v1/get/';

	/**
	 * The final data.
	 *
	 * @access protected
	 * @var string
	 */
	protected $data;
	/**
	 * Cleanup routine frequency.
	 */
	const CLEANUP_FREQUENCY = 'monthly';

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		if ( is_admin() ) {
			// Ajax Calls.
			add_action( 'wp_ajax_kadence_import_get_prebuilt_data', array( $this, 'prebuilt_data_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_reload_prebuilt_data', array( $this, 'prebuilt_data_reload_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_get_new_connection_data', array( $this, 'prebuilt_connection_info_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_get_prebuilt_templates_data', array( $this, 'prebuilt_templates_data_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_reload_prebuilt_templates_data', array( $this, 'prebuilt_templates_data_reload_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_get_prebuilt_pages_data', array( $this, 'prebuilt_pages_data_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_reload_prebuilt_pages_data', array( $this, 'prebuilt_pages_data_reload_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_process_data', array( $this, 'process_data_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_process_image_data', array( $this, 'process_image_data_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_import_process_pattern', array( $this, 'process_pattern_ajax_callback' ) );
			add_action( 'wp_ajax_kadence_subscribe_process_data', array( $this, 'process_subscribe_ajax_callback' ) );
		}

		// Add a cleanup routine.
		$this->schedule_cleanup();
		add_filter( 'cron_schedules', array( $this, 'add_monthly_to_cron_schedule' ), 10, 1 );
		add_action( 'delete_block_library_folder', array( $this, 'delete_block_library_folder' ) );
	}
	/**
	 * Get the section data if available locally.
	 */
	public function get_section_prebuilt_data( $pro_data ) {
		$pro_key = ( isset( $pro_data['api_key'] ) && ! empty( $pro_data['api_key'] ) ? $pro_data['api_key'] : '' );
		$api_email = ( isset( $pro_data['api_email'] ) && ! empty( $pro_data['api_email'] ) ? $pro_data['api_email'] : '' );
		$product_id = ( isset( $pro_data['product_id'] ) && ! empty( $pro_data['product_id'] ) ? $pro_data['product_id'] : '' );
		if ( empty( $pro_key ) ) {
			$pro_key = ( isset( $pro_data['ithemes_key'] ) && ! empty( $pro_data['ithemes_key'] ) ? $pro_data['ithemes_key'] : '' );
			if ( $pro_key ) {
				$api_email = 'iThemes';
			}
		}
		$this->api_key       = $pro_key;
		$this->api_email     = $api_email;
		$this->product_id    = $product_id;
		$this->package       = 'section';
		$this->url           = $this->remote_url;
		$this->key           = 'section';
		// Do you have the data?
		$get_data = $this->get_only_local_template_data();
		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			return false;
		}
		return $get_data;
	}

	/**
	 * Get the section data if available locally.
	 */
	public function get_page_prebuilt_data( $pro_data ) {
		$pro_key = ( isset( $pro_data['api_key'] ) && ! empty( $pro_data['api_key'] ) ? $pro_data['api_key'] : '' );
		$api_email = ( isset( $pro_data['api_email'] ) && ! empty( $pro_data['api_email'] ) ? $pro_data['api_email'] : '' );
		$product_id = ( isset( $pro_data['product_id'] ) && ! empty( $pro_data['product_id'] ) ? $pro_data['product_id'] : '' );
		if ( empty( $pro_key ) ) {
			$pro_key = ( isset( $pro_data['ithemes_key'] ) && ! empty( $pro_data['ithemes_key'] ) ? $pro_data['ithemes_key'] : '' );
			if ( $pro_key ) {
				$api_email = 'iThemes';
			}
		}
		$this->api_key       = $pro_key;
		$this->api_email     = $api_email;
		$this->product_id    = $product_id;
		$this->package       = 'pages';
		$this->url           = $this->remote_pages_url;
		$this->key           = 'pages';
		// Do you have the data?
		$get_data = $this->get_only_local_template_data();
		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			return false;
		}
		return $get_data;
	}

	/**
	 * Get the local data file if there.
	 *
	 * @access public
	 * @return string
	 */
	public function get_only_local_template_data( $skip_local = false ) {
		// If the local file exists, return it's data.
		return file_exists( $this->get_local_template_data_path() )
			? $this->get_local_template_data_contents()
			: '';
	}
	/**
	 * Get the local data file if there, else query the api.
	 *
	 * @access public
	 * @return string
	 */
	public function get_template_data( $skip_local = false ) {
		if ( 'custom' === $this->package ) {
			return wp_json_encode( apply_filters( 'kadence_block_library_custom_array', array() ) );
		}
		// Check if the local data file exists. (true means the file doesn't exist).
		if ( $skip_local || $this->local_file_exists() ) {
			// Attempt to create the file.
			if ( $this->create_template_data_file( $skip_local ) ) {
				return $this->get_local_template_data_contents();
			}
		}
		// // If it's empty lets try to get the data.
		// if ( '[]' === $this->get_local_template_data_contents() ) {
		// 	if ( $this->create_template_data_file( $skip_local ) ) {
		// 		return $this->get_local_template_data_contents();
		// 	}
		// }
		// If it's a Kadence Pattern Hub connect, lets make sure it's within date.
		if ( 'templates' !== $this->package && 'pages' !== $this->package && 'section' !== $this->package && ! $this->is_template ) {
			$cloud_settings = json_decode( get_option( 'kadence_blocks_cloud' ), true );
			if ( isset( $cloud_settings['connections'] ) && isset( $cloud_settings['connections'][ $this->package ] ) && isset( $cloud_settings['connections'][ $this->package ]['expires'] ) && ! empty( $cloud_settings['connections'][ $this->package ]['expires'] ) ) {
				$expires = strtotime( get_date_from_gmt( $cloud_settings['connections'][ $this->package ]['expires'] ) );
				$now     = strtotime( get_date_from_gmt( current_time( 'Y-m-d H:i:s' ) ) );
				if ( $expires < $now ) {
					$refresh = ( isset( $cloud_settings['connections'][ $this->package ]['refresh'] ) && ! empty( $cloud_settings['connections'][ $this->package ]['refresh'] ) ? $cloud_settings['connections'][ $this->package ]['refresh'] : 'month' );
					if ( 'day' === $refresh ) {
						$expires_add = DAY_IN_SECONDS;
					} elseif ( 'week' === $refresh ) {
						$expires_add = WEEK_IN_SECONDS;
					} else {
						$expires_add = MONTH_IN_SECONDS;
					}
					$cloud_settings['connections'][ $this->package ]['expires'] = gmdate( 'Y-m-d H:i:s', strtotime( current_time() ) + $expires_add );
					update_option( 'kadence_blocks_cloud', json_encode( $cloud_settings ) );
					if ( $this->create_template_data_file( true ) ) {
						return $this->get_local_template_data_contents();
					}
				}
			}
		}
		// If the local file exists, return it's data.
		return file_exists( $this->get_local_template_data_path() )
			? $this->get_local_template_data_contents()
			: '';
	}
	/**
	 * Write the data to the filesystem.
	 *
	 * @access protected
	 * @return string|false Returns the absolute path of the file on success, or false on fail.
	 */
	protected function create_template_data_file( $skip_local ) {
		$file_path  = $this->get_local_template_data_path();
		$filesystem = $this->get_filesystem();

		// If the folder doesn't exist, create it.
		if ( ! file_exists( $this->get_block_library_folder() ) ) {
			$chmod_dir = ( 0755 & ~ umask() );
			if ( defined( 'FS_CHMOD_DIR' ) ) {
				$chmod_dir = FS_CHMOD_DIR;
			}
			$this->get_filesystem()->mkdir( $this->get_block_library_folder(), $chmod_dir );
		}

		// If the file doesn't exist, create it. Return false if it can not be created.
		if ( ! $filesystem->exists( $file_path ) && ! $filesystem->touch( $file_path ) ) {
			return false;
		}

		// If we got this far, we need to write the file.
		// Get the data.
		if ( $skip_local || ! $this->data ) {
			$this->get_data();
		}
		// Put the contents in the file. Return false if that fails.
		if ( ! $filesystem->put_contents( $file_path, $this->data ) ) {
			return false;
		}

		return $file_path;
	}
	/**
	 * Get data.
	 *
	 * @access public
	 * @return string
	 */
	public function get_data() {
		// Get the remote URL contents.
		$this->data = $this->get_remote_url_contents();

		return $this->data;
	}
	/**
	 * Get local data contents.
	 *
	 * @access public
	 * @return string|false Returns the data contents.
	 */
	public function get_local_template_data_contents() {
		$local_path = $this->get_local_template_data_path();

		// Check if the local exists. (true means the file doesn't exist).
		if ( $this->local_file_exists() ) {
			return false;
		}
		return file_get_contents( $local_path );
	}
	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_url_contents() {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = preg_replace( '/^https/', 'http', $site_url );
		$site_url = preg_replace( '|/$|', '', $site_url );
		$args = array(
			'key'  => $this->key,
			'site' => $site_url,
		);
		if ( 'templates' === $this->package || 'section' === $this->package || 'pages' === $this->package || $this->is_template ) {
			$args['api_email'] = $this->api_email;
			$args['api_key']   = $this->api_key;
			$args['product_id']   = $this->product_id;
			if ( 'iThemes' === $this->api_email ) {
				if ( is_callable( 'network_home_url' ) ) {
					$site_url = network_home_url( '', 'http' );
				} else {
					$site_url = get_bloginfo( 'url' );
				}
				$site_url = preg_replace( '/^https/', 'http', $site_url );
				$site_url = preg_replace( '|/$|', '', $site_url );
				$args['site_url'] = $site_url;
			}
		}
		if ( 'templates' === $this->package ) {
			$args['request'] = 'blocks';
		}
		// Get the response.
		$api_url  = add_query_arg( $args, $this->url );

		$response = wp_safe_remote_get(
			$api_url,
			array(
				'timeout' => 20,
			)
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return '';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );

		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return;
		}

		return $contents;
	}
	/**
	 * Check if the local file exists.
	 *
	 * @access public
	 * @return bool
	 */
	public function local_file_exists() {
		return ( ! file_exists( $this->get_local_template_data_path() ) );
	}
	/**
	 * Get the data path.
	 *
	 * @access public
	 * @return string
	 */
	public function get_local_template_data_path() {
		if ( ! $this->local_template_data_path ) {
			$this->local_template_data_path = $this->get_block_library_folder() . '/' . $this->get_local_template_data_filename() . '.json';
		}
		return $this->local_template_data_path;
	}
	/**
	 * Get the local data filename.
	 *
	 * This is a hash, generated from the site-URL, the wp-content path and the URL.
	 * This way we can avoid issues with sites changing their URL, or the wp-content path etc.
	 *
	 * @access public
	 * @return string
	 */
	public function get_local_template_data_filename() {
		$kb_api = 'free';
		if ( class_exists( 'Kadence_Blocks_Pro' ) ) {
			$kbp_data = kadence_blocks_get_current_license_key();
			if ( ! empty( $kbp_data ) ) {
				$kb_api = $kbp_data;
			}
		}
		if ( 'templates' !== $this->package && 'section' !== $this->package && ! $this->is_template && $this->key ) {
			$kb_api = $this->key;
		}
		return md5( $this->get_base_url() . $this->get_base_path() . $this->package . KADENCE_BLOCKS_VERSION . $kb_api );
	}
	/**
	 * Main AJAX callback function for:
	 * 1). get local data if there
	 * 2). query api for data if needed
	 * 3). import content
	 * 4). execute 'after content import' actions (before widget import WP action, widget import, customizer import, after import WP action)
	 */
	public function prebuilt_connection_info_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$this->local_template_data_path = '';
		$this->api_key       = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email     = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->package       = empty( $_POST['package'] ) ? 'section' : sanitize_text_field( $_POST['package'] );
		$this->url           = empty( $_POST['url'] ) ? '' : rtrim( sanitize_text_field( $_POST['url'] ), '/' ) . '/wp-json/kadence-cloud/v1/info/';
		$this->key           = empty( $_POST['key'] ) ? 'section' : sanitize_text_field( $_POST['key'] );
		// Do you have the data?
		$get_data = $this->get_connection_data();
		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No Connection data', 'kadence-blocks' ) );
		} else {
			// Sanitize the connection data.
			$temp_data  = json_decode( $get_data, true );
			$final_data = array();
			$final_data['name']    = ! empty( $temp_data['name'] ) ? sanitize_text_field( $temp_data['name'] ) : '';
			$final_data['slug']    = ! empty( $temp_data['slug'] ) ? sanitize_text_field( $temp_data['slug'] ) : '';
			$final_data['refresh'] = ! empty( $temp_data['refresh'] ) ? sanitize_text_field( $temp_data['refresh'] ) : '';
			$final_data['expires'] = ! empty( $temp_data['expires'] ) ? sanitize_text_field( $temp_data['expires'] ) : '';
			if ( ! empty( $final_data['name'] ) ) {
				wp_send_json( $final_data );
			}
			wp_send_json( esc_html__( 'No Connection data', 'kadence-blocks' ) );
		}
		die;
	}
	/**
	 * Get the local data file if there, else query the api.
	 *
	 * @access public
	 * @return string
	 */
	public function get_connection_data( $skip_local = false ) {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = preg_replace( '/^https/', 'http', $site_url );
		$site_url = preg_replace( '|/$|', '', $site_url );
		$args = array(
			'key'  => $this->key,
			'site' => $site_url,
		);
		// Get the response.
		$api_url  = add_query_arg( $args, $this->url );
		$response = wp_safe_remote_get(
			$api_url,
			array(
				'timeout' => 20,
			)
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return '';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );

		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return;
		}

		return $contents;
	}
	/**
	 * Main AJAX callback function for:
	 * 1). get local data if there
	 * 2). query api for data if needed
	 * 3). import content
	 * 4). execute 'after content import' actions (before widget import WP action, widget import, customizer import, after import WP action)
	 */
	public function prebuilt_data_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$this->local_template_data_path = '';
		$this->api_key       = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email     = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->product_id   = empty( $_POST['product_id'] ) ? '' : sanitize_text_field( $_POST['product_id'] );
		$this->package       = empty( $_POST['package'] ) ? 'section' : sanitize_text_field( $_POST['package'] );
		$this->url           = empty( $_POST['url'] ) ? $this->remote_url : rtrim( sanitize_text_field( $_POST['url'] ), '/' ) . '/wp-json/kadence-cloud/v1/get/';
		$this->key           = isset( $_POST['key'] ) && ! empty( $_POST['key'] ) ? sanitize_text_field( $_POST['key'] ) : 'section';
		$this->is_template   = isset( $_POST['is_template'] ) && ! empty( $_POST['is_template'] ) ? true : false;
		// Do you have the data?
		$get_data = $this->get_template_data();
		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No library data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}
	/**
	 * Main AJAX callback function for getting the prebuilt templates array.
	 */
	public function prebuilt_templates_data_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$this->local_template_data_path = '';
		$this->api_key       = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email     = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->product_id   = empty( $_POST['product_id'] ) ? '' : sanitize_text_field( $_POST['product_id'] );
		$this->package       = 'templates';
		$this->url           = $this->remote_templates_url;
		$this->key           = 'blocks';
		// Do you have the data?
		$get_data = $this->get_template_data();
		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No library data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}
	/**
	 * Main AJAX callback function for getting the prebuilt templates array.
	 */
	public function prebuilt_pages_data_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$this->local_pages_data_path = '';
		$this->api_key       = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email     = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->product_id   = empty( $_POST['product_id'] ) ? '' : sanitize_text_field( $_POST['product_id'] );
		$this->package       = 'pages';
		$this->url           = $this->remote_pages_url;
		$this->key           = 'pages';
		// Do you have the data?
		$get_data = $this->get_template_data();
		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No library data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}
	/**
	 * Main AJAX callback function for:
	 * 1). get local data if there
	 * 2). query api for data if needed
	 * 3). import content
	 * 4). execute 'after content import' actions (before widget import WP action, widget import, customizer import, after import WP action)
	 */
	public function prebuilt_templates_data_reload_ajax_callback() {

		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$this->local_template_data_path = '';
		$this->api_key   = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->product_id = empty( $_POST['product_id'] ) ? '' : sanitize_text_field( $_POST['product_id'] );
		$this->package       = 'templates';
		$this->url           = $this->remote_templates_url;
		$this->key           = 'blocks';

		//$removed = $this->delete_block_library_folder();
		// if ( ! $removed ) {
		// 	wp_send_json_error( 'failed_to_flush' );
		// }
		// Do you have the data?
		$get_data = $this->get_template_data( true );

		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No library data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}
	/**
	 * Main AJAX callback function for:
	 * 1). get local data if there
	 * 2). query api for data if needed
	 * 3). import content
	 * 4). execute 'after content import' actions (before widget import WP action, widget import, customizer import, after import WP action)
	 */
	public function prebuilt_pages_data_reload_ajax_callback() {

		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$this->local_pages_data_path = '';
		$this->api_key   = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->product_id = empty( $_POST['product_id'] ) ? '' : sanitize_text_field( $_POST['product_id'] );
		$this->package       = 'pages';
		$this->url           = $this->remote_pages_url;
		$this->key           = 'pages';

		//$removed = $this->delete_block_library_folder();
		// if ( ! $removed ) {
		// 	wp_send_json_error( 'failed_to_flush' );
		// }
		// Do you have the data?
		$get_data = $this->get_template_data( true );

		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No library data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}
	/**
	 * Ajax function for processing the import data.
	 */
	public function process_subscribe_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$email = empty( $_POST['email'] ) ? '' : sanitize_text_field( $_POST['email'] );
		// Do you have the data?
		if ( $email && is_email( $email ) && filter_var( $email, FILTER_VALIDATE_EMAIL ) ) {
			list( $user, $domain ) = explode( '@', $email );
			list( $pre_domain, $post_domain ) = explode( '.', $domain );
			$spell_issue_domains = array( 'gmaiil', 'gmai', 'gmaill' );
			$spell_issue_domain_ends = array( 'local', 'comm', 'orgg', 'cmm' );
			if ( in_array( $pre_domain, $spell_issue_domain_ends, true ) ) {
				return wp_send_json( 'emailDomainPreError' );
			}
			if ( in_array( $post_domain, $spell_issue_domain_ends, true ) ) {
				return wp_send_json( 'emailDomainPostError' );
			}
			$args = array(
				'email'  => $email,
				'tag'    => 'wire',
			);
			// Get the response.
			$api_url  = add_query_arg( $args, 'https://www.kadencewp.com/kadence-blocks/wp-json/kadence-subscribe/v1/subscribe/' );
			$response = wp_safe_remote_get(
				$api_url,
				array(
					'timeout' => 20,
				)
			);
			// Early exit if there was an error.
			if ( is_wp_error( $response ) ) {
				return wp_send_json( 'retryError' );
			}
			// Get the CSS from our response.
			$contents = wp_remote_retrieve_body( $response );
			// Early exit if there was an error.
			if ( is_wp_error( $contents ) ) {
				return wp_send_json( 'retryError' );
			}
			if ( ! $contents ) {
				// Send JSON Error response to the AJAX call.
				wp_send_json( 'retryError' );
			} else {
				wp_send_json( $contents );
			}
		}
		// Send JSON Error response to the AJAX call.
		wp_send_json( 'emailError' );
		die;
	}
	/**
	 * Ajax function for processing the import data.
	 */
	public function process_pattern_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$data = empty( $_POST['import_content'] ) ? '' : stripslashes( $_POST['import_content'] );
		$data = $this->process_pattern_content( $data );
		if ( ! $data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $data );
		}
		die;
	}
	public function process_image_data_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();

		$content        = empty( $_POST['import_content'] ) ? '' : stripslashes( $_POST['import_content'] );
		$image_library  = empty( $_POST['image_library'] ) ? '' : json_decode( $_POST['image_library'], true );
		$data           = $this->process_image_content( $content, $image_library );
		if ( ! $data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $data );
		}
		die;
	}
	/**
	 * Download and Replace images
	 *
	 * @param  string $content the import post content.
	 */
	public function process_image_content( $content = '', $image_library = '' ) {
		// error_log( print_r( $image_library, true ) );
		// Find all urls.
		preg_match_all( '/https?:\/\/[^\'" ]+/i', $content, $match );
		// preg_match_all( '#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#', $content, $match );
		$all_urls = array_unique( $match[0] );

		if ( empty( $all_urls ) ) {
			return $content;
		}

		$map_urls    = array();
		$image_urls  = array();
		// Find all the images.
		foreach ( $all_urls as $key => $link ) {
			if ( $this->check_for_image( $link ) ) {
				// Avoid srcset images.
				if (
					false === strpos( $link, '-150x' ) &&
					false === strpos( $link, '-300x' ) &&
					false === strpos( $link, '-1024x' )
				) {
					$image_urls[] = $link;
				}
			}
		}
		// Process images.
		if ( ! empty( $image_urls ) ) {
			foreach ( $image_urls as $key => $image_url ) {
				// Download remote image.
				$image            = array(
					'url' => $image_url,
					'id'  => 0,
				);
				if ( substr( $image_url, 0, strlen( 'https://images.pexels.com' ) ) === 'https://images.pexels.com' ) {
					$image_data = $this->get_image_info( $image_library, $image_url );
					if ( $image_data ) {
						$image['alt']  = $image_data['alt'];
						$image['photographer']  = $image_data['photographer'];
						$image['photographer_url']  = $image_data['photographer_url'];
						$image['alt']  = $image_data['alt'];
						$image['title'] = __( 'Photo by', 'kadence-blocks' ) . ' ' . $image_data['photographer'];
					}
				}
				$downloaded_image       = $this->import_image( $image );
				$map_urls[ $image_url ] = $downloaded_image['url'];
			}
		}
		// Replace images in content.
		foreach ( $map_urls as $old_url => $new_url ) {
			$content = str_replace( $old_url, $new_url, $content );
			// Replace the slashed URLs if any exist.
			$old_url = str_replace( '/', '/\\', $old_url );
			$new_url = str_replace( '/', '/\\', $new_url );
			$content = str_replace( $old_url, $new_url, $content );
		}
		return $content;
	}
	/**
	 * Ajax function for processing the import data.
	 */
	public function process_data_ajax_callback() {
		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$data           = empty( $_POST['import_content'] ) ? '' : stripslashes( $_POST['import_content'] );
		$import_library = empty( $_POST['import_library'] ) ? 'standard' : sanitize_text_field( $_POST['import_library'] );
		$import_type    = empty( $_POST['import_type'] ) ? 'pattern' : sanitize_text_field( $_POST['import_type'] );
		$import_id      = empty( $_POST['import_item_id'] ) ? '' : sanitize_text_field( $_POST['import_item_id'] );
		$import_style   = empty( $_POST['import_style'] ) ? 'normal' : sanitize_text_field( $_POST['import_style'] );
		$this->api_key       = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->package       = empty( $_POST['package'] ) ? 'section' : sanitize_text_field( $_POST['package'] );
		$this->url           = empty( $_POST['url'] ) ? $this->remote_url : rtrim( sanitize_text_field( $_POST['url'] ), '/' ) . '/wp-json/kadence-cloud/v1/get/';
		$this->key           = isset( $_POST['key'] ) && ! empty( $_POST['key'] ) ? sanitize_text_field( $_POST['key'] ) : 'section';
		$data = $this->process_content( $data, $import_library, $import_type, $import_id, $import_style );
		if ( ! $data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $data );
		}
		die;
	}
	/**
	 * Download and Replace images
	 *
	 * @param  string $content the import post content.
	 */
	public function process_pattern_content( $content = '' ) {
		// Find all urls.
		preg_match_all( '#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#', $content, $match );
		$all_urls = array_unique( $match[0] );

		if ( empty( $all_urls ) ) {
			return $content;
		}

		$map_urls    = array();
		$image_urls  = array();
		// Find all the images.
		foreach ( $all_urls as $key => $link ) {
			if ( $this->check_for_image( $link ) ) {
				// Avoid srcset images.
				if (
					false === strpos( $link, '-150x' ) &&
					false === strpos( $link, '-300x' ) &&
					false === strpos( $link, '-1024x' )
				) {
					$image_urls[] = $link;
				}
			}
		}
		// Process images.
		if ( ! empty( $image_urls ) ) {
			foreach ( $image_urls as $key => $image_url ) {
				// Download remote image.
				$image            = array(
					'url' => $image_url,
					'id'  => 0,
				);
				$downloaded_image       = $this->import_image( $image );
				$map_urls[ $image_url ] = $downloaded_image['url'];
			}
		}
		// Replace images in content.
		foreach ( $map_urls as $old_url => $new_url ) {
			$content = str_replace( $old_url, $new_url, $content );
			// Replace the slashed URLs if any exist.
			$old_url = str_replace( '/', '/\\', $old_url );
			$new_url = str_replace( '/', '/\\', $new_url );
			$content = str_replace( $old_url, $new_url, $content );
		}
		return $content;
	}
	/**
	 * Download and Replace images
	 *
	 * @param  string $content the import post content.
	 */
	public function process_content( $content = '', $import_library = '', $import_type = '', $import_id = '', $import_style = '' ) {
		$content = $this->process_individual_import( $content, $import_library, $import_type, $import_id, $import_style );
		// Find all urls.
		preg_match_all( '#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#', $content, $match );
		$all_urls = array_unique( $match[0] );

		if ( empty( $all_urls ) ) {
			return $content;
		}

		$map_urls    = array();
		$image_urls  = array();
		// Find all the images.
		foreach ( $all_urls as $key => $link ) {
			if ( $this->check_for_image( $link ) ) {
				// Avoid srcset images.
				if (
					false === strpos( $link, '-150x' ) &&
					false === strpos( $link, '-300x' ) &&
					false === strpos( $link, '-1024x' )
				) {
					$image_urls[] = $link;
				}
			}
		}
		// Process images.
		if ( ! empty( $image_urls ) ) {
			foreach ( $image_urls as $key => $image_url ) {
				// Download remote image.
				$image            = array(
					'url' => $image_url,
					'id'  => 0,
				);
				$downloaded_image       = $this->import_image( $image );
				$map_urls[ $image_url ] = $downloaded_image['url'];
			}
		}
		// Replace images in content.
		foreach ( $map_urls as $old_url => $new_url ) {
			$content = str_replace( $old_url, $new_url, $content );
			// Replace the slashed URLs if any exist.
			$old_url = str_replace( '/', '/\\', $old_url );
			$new_url = str_replace( '/', '/\\', $new_url );
			$content = str_replace( $old_url, $new_url, $content );
		}
		return $content;
	}
	/**
	 * Import an image.
	 *
	 * @param array $image_data the image data to import.
	 */
	public function import_image( $image_data ) {
		$local_image = $this->check_for_local_image( $image_data );
		if ( $local_image['status'] ) {
			return $local_image['image'];
		}
		$filename   = basename( $image_data['url'] );
		$image_path = $image_data['url'];
		// Check if the image is from Pexels and get the filename.
		if ( substr( $image_data['url'], 0, strlen( 'https://images.pexels.com' ) ) === 'https://images.pexels.com' ) {
			$image_path = parse_url( $image_data['url'], PHP_URL_PATH );
			$filename = basename( $image_path );
		}
		$info = wp_check_filetype( $image_path );
		$ext  = empty( $info['ext'] ) ? '' : $info['ext'];
		$type = empty( $info['type'] ) ? '' : $info['type'];
		// If we don't allow uploading the file type or ext, return.
		if ( ! $type || ! $ext ) {
			return $image_data;
		}

		$file_content = wp_remote_retrieve_body(
			wp_safe_remote_get(
				$image_data['url'],
				array(
					'timeout'   => '60',
					'sslverify' => false,
				)
			)
		);
		// Empty file content?
		if ( empty( $file_content ) ) {
			return $image_data;
		}
		$upload = wp_upload_bits( $filename, null, $file_content );
		$post = array(
			'post_title' => ( ! empty( $image_data['title'] ) ? $image_data['title'] : $filename ),
			'guid'       => $upload['url'],
		);

		$post['post_mime_type'] = $type;
		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			include( ABSPATH . 'wp-admin/includes/image.php' );
		}
		$post_id = wp_insert_attachment( $post, $upload['file'] );
		wp_update_attachment_metadata(
			$post_id,
			wp_generate_attachment_metadata( $post_id, $upload['file'] )
		);
		if ( ! empty( $image_data['alt'] ) ) {
			update_post_meta( $post_id, '_wp_attachment_image_alt', $image_data['alt'] );
		}
		if ( ! empty( $image_data['photographer'] ) ) {
			update_post_meta( $post_id, '_pexels_photographer', $image_data['photographer'] );
		}
		if ( ! empty( $image_data['photographer_url'] ) ) {
			update_post_meta( $post_id, '_pexels_photographer_url', $image_data['photographer_url'] );
		}
		update_post_meta( $post_id, '_kadence_blocks_image_hash', sha1( $image_data['url'] ) );

		return array(
			'id'  => $post_id,
			'url' => $upload['url'],
		);
	}

	/**
	 * Check if image is already imported.
	 *
	 * @param array $image_data the image data to import.
	 */
	public function check_for_local_image( $image_data ) {
		global $wpdb;

		// Thanks BrainstormForce for this idea.
		// Check if image is already local based on meta key and custom hex value.
		$image_id = $wpdb->get_var(
			$wpdb->prepare(
				'SELECT `post_id` FROM `' . $wpdb->postmeta . '`
					WHERE `meta_key` = \'_kadence_blocks_image_hash\'
						AND `meta_value` = %s
				;',
				sha1( $image_data['url'] )
			)
		);
		if ( $image_id ) {
			$local_image = array(
				'id'  => $image_id,
				'url' => wp_get_attachment_url( $image_id ),
			);
			return array(
				'status' => true,
				'image'  => $local_image,
			);
		}
		return array(
			'status' => false,
			'image'  => $image_data,
		);
	}
	/**
	 * Check if link is for an image.
	 *
	 * @param string $link url possibly to an image.
	 */
	public function check_for_image( $link = '' ) {
		if ( empty( $link ) ) {
			return false;
		}
		if ( substr( $link, 0, strlen( 'https://images.pexels.com' ) ) === 'https://images.pexels.com' ) {
			return true;
		}
		return preg_match( '/^((https?:\/\/)|(www\.))([a-z0-9-].?)+(:[0-9]+)?\/[\w\-]+\.(jpg|png|gif|webp|jpeg)\/?$/i', $link );
	}
	/**
	 * Get information for our image.
	 *
	 * @param array $images the image url.
	 * @param string $target_src the image url.
	 */
	public function get_image_info( $images, $target_src ) {
		foreach ( $images['data'] as $image_group ) {
			foreach ( $image_group['images'] as $image ) {
				foreach ( $image['sizes'] as $size ) {
					if ( $size['src'] === $target_src ) {
						return array(
							'alt' => $image['alt'],
							'photographer' => $image['photographer'],
							'photographer_url' => $image['photographer_url'],
						);
						break;
					}
				}
			}
		}
		return false;
	}
	/**
	 * Ajax function for processing the import data.
	 */
	public function process_individual_import( $content, $import_library, $import_type, $import_id, $import_style ) {
		if ( isset( $import_library ) && 'pattern' === $import_library ) {
			$args = array(
				'type'    => $import_type,
				'id'      => $import_id,
				'style'   => $import_style,
				'library' => $import_library,
				'key'     => $this->key,
			);
			// Get the response.
			$api_url  = add_query_arg( $args, 'https://patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/single/' );
			$response = wp_safe_remote_get(
				$api_url,
				array(
					'timeout' => 20,
				)
			);
			// Early exit if there was an error.
			if ( is_wp_error( $response ) ) {
				return $content;
			}
			// Get the CSS from our response.
			$contents = wp_remote_retrieve_body( $response );
			// Early exit if there was an error.
			if ( is_wp_error( $contents ) ) {
				return $content;
			}
			if ( ! $contents ) {
				// Send JSON Error response to the AJAX call.
				return $content;
			} else {
				return $contents;
			}
		}
		return $content;
	}
	/**
	 * Check if the AJAX call is valid.
	 */
	public static function verify_ajax_call() {
		check_ajax_referer( 'kadence-blocks-ajax-verification', 'security' );
		// Make sure we are working with a user that can edit posts.
		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_die( -1, 403 );
		}
	}
	/**
	 * Main AJAX callback function for:
	 * 1). get local data if there
	 * 2). query api for data if needed
	 * 3). import content
	 * 4). execute 'after content import' actions (before widget import WP action, widget import, customizer import, after import WP action)
	 */
	public function prebuilt_data_reload_ajax_callback() {

		// Verify if the AJAX call is valid (checks nonce and current_user_can).
		$this->verify_ajax_call();
		$this->local_template_data_path = '';
		$this->api_key   = empty( $_POST['api_key'] ) ? '' : sanitize_text_field( $_POST['api_key'] );
		$this->api_email = empty( $_POST['api_email'] ) ? '' : sanitize_text_field( $_POST['api_email'] );
		$this->product_id = empty( $_POST['product_id'] ) ? '' : sanitize_text_field( $_POST['product_id'] );
		$this->package   = empty( $_POST['package'] ) ? 'section' : sanitize_text_field( $_POST['package'] );
		$this->url       = empty( $_POST['url'] ) ? $this->remote_url : rtrim( sanitize_text_field( $_POST['url'] ), '/' ) . '/wp-json/kadence-cloud/v1/get/';
		$this->key       = empty( $_POST['key'] ) ? 'section' : sanitize_text_field( $_POST['key'] );

		// $removed = $this->delete_block_library_folder();
		// if ( ! $removed ) {
		// 	wp_send_json_error( 'failed_to_flush' );
		// }
		// Do you have the data?
		$get_data = $this->get_template_data( true );

		if ( ! $get_data ) {
			// Send JSON Error response to the AJAX call.
			wp_send_json( esc_html__( 'No library data', 'kadence-blocks' ) );
		} else {
			wp_send_json( $get_data );
		}
		die;
	}

	/**
	 * Get Importer Array.
	 *
	 * Used durning import to get information from the json.
	 *
	 * @access public
	 * @param string $slug the template slug.
	 * @param string $type the template type.
	 * @return array
	 */
	public function get_importer_files( $slug, $type ) {
		$this->package = $type;
		$get_data = $this->get_template_data();
		if ( ! $get_data ) {
			return array();
		}
		$data = json_decode( $get_data, true );
		if ( isset( $data[ $slug ] ) ) {
			return $data;
		}
		return array();
	}
	/**
	 * Schedule a cleanup.
	 *
	 * Deletes the templates files on a regular basis.
	 * This way templates get updated regularly.
	 *
	 * @access public
	 * @return void
	 */
	public function schedule_cleanup() {
		if ( ! is_multisite() || ( is_multisite() && is_main_site() ) ) {
			if ( ! wp_next_scheduled( 'delete_block_library_folder' ) && ! wp_installing() ) {
				wp_schedule_event( time(), self::CLEANUP_FREQUENCY, 'delete_block_library_folder' );
			}
		}
	}
	/**
	 * Add Monthly to Schedule.
	 *
	 * @param array $schedules the current schedules.
	 * @access public
	 */
	public function add_monthly_to_cron_schedule( $schedules ) {
		// Adds once monthly to the existing schedules.
		if ( ! isset( $schedules[ self::CLEANUP_FREQUENCY ] ) ) {
			$schedules[ self::CLEANUP_FREQUENCY ] = array(
				'interval' => MONTH_IN_SECONDS,
				'display' => __( 'Once Monthly', 'kadence-blocks' ),
			);
		}
		return $schedules;
	}
	/**
	 * Delete the fonts folder.
	 *
	 * This runs as part of a cleanup routine.
	 *
	 * @access public
	 * @return bool
	 */
	public function delete_block_library_folder() {
		if ( file_exists( $this->get_old_block_library_folder() ) ) {
			$this->get_filesystem()->delete( $this->get_old_block_library_folder(), true );
		}
		return $this->get_filesystem()->delete( $this->get_block_library_folder(), true );
	}
	/**
	 * Get the old folder for templates data.
	 *
	 * @access public
	 * @return string
	 */
	public function get_old_block_library_folder() {
		$old_block_library_folder = trailingslashit( $this->get_filesystem()->wp_content_dir() ) . 'kadence_blocks_library';
		return $old_block_library_folder;
	}
	/**
	 * Get the folder for templates data.
	 *
	 * @access public
	 * @return string
	 */
	public function get_block_library_folder() {
		if ( ! $this->block_library_folder ) {
			$this->block_library_folder = $this->get_base_path();
			if ( $this->get_subfolder_name() ) {
				$this->block_library_folder .= $this->get_subfolder_name();
			}
		}
		return $this->block_library_folder;
	}
	/**
	 * Get the subfolder name.
	 *
	 * @access public
	 * @return string
	 */
	public function get_subfolder_name() {
		if ( ! $this->subfolder_name ) {
			$this->subfolder_name = apply_filters( 'kadence_block_library_local_data_subfolder_name', 'kadence_blocks_library' );
		}
		return $this->subfolder_name;
	}
	/**
	 * Get the base path.
	 *
	 * @access public
	 * @return string
	 */
	public function get_base_path() {
		if ( ! $this->base_path ) {
			$upload_dir = wp_upload_dir();
			$this->base_path = apply_filters( 'kadence_block_library_local_data_base_path', trailingslashit( $upload_dir['basedir'] ) );
		}
		return $this->base_path;
	}
	/**
	 * Get the base URL.
	 *
	 * @access public
	 * @return string
	 */
	public function get_base_url() {
		if ( ! $this->base_url ) {
			$this->base_url = apply_filters( 'kadence_block_library_local_data_base_url', content_url() );
		}
		return $this->base_url;
	}
	/**
	 * Get the filesystem.
	 *
	 * @access protected
	 * @return WP_Filesystem
	 */
	protected function get_filesystem() {
		global $wp_filesystem;

		// If the filesystem has not been instantiated yet, do it here.
		if ( ! $wp_filesystem ) {
			if ( ! function_exists( 'WP_Filesystem' ) ) {
				require_once wp_normalize_path( ABSPATH . '/wp-admin/includes/file.php' );
			}
			$wpfs_creds = apply_filters( 'kadence_wpfs_credentials', false );
			WP_Filesystem( $wpfs_creds );
		}
		return $wp_filesystem;
	}
}
Kadence_Blocks_Prebuilt_Library::get_instance();
