<?php
/**
 * REST API for Kadence prebuilt library.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * REST API prebuilt library.
 */
class Kadence_Blocks_Prebuilt_Library_REST_Controller extends WP_REST_Controller {

	/**
	 * Include ai prompt.
	 */
	const PROP_CONTEXT = 'context';

	/**
	 * Force reload.
	 */
	const PROP_FORCE_RELOAD = 'force_reload';

	/**
	 * Handle API Key.
	 */
	const PROP_API_KEY = 'api_key';

	/**
	 * Handle API Email.
	 */
	const PROP_API_EMAIL = 'api_email';

	/**
	 * The library folder.
	 *
	 * @access protected
	 * @var string
	 */
	protected $block_library_folder;
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
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_ai_url = 'https://content.startertemplatecloud.com/wp-json/prophecy/v1/';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-design-library/v1';
		$this->rest_base = 'get';
		$this->reset = 'reset';
		$this->reset = 'reset';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/get_verticals',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_industry_verticals' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->reset,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'reset_items' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
	}
	/**
	 * Checks if a given request has access to search content.
	 *
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has search access, WP_Error object otherwise.
	 */
	public function get_items_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_industry_verticals( $request ) {
		$context = $request->get_param( self::PROP_CONTEXT );
		$reload = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->api_key  = $request->get_param( self::PROP_API_KEY );
		$this->api_email  = $request->get_param( self::PROP_API_EMAIL );
		$available_prompts = get_option( 'kb_design_library_image', array() );
		if ( file_exists( $this->get_local_data_path( 'industry_verticals' ) ) && ! $reload ) {
			return rest_ensure_response( $this->get_local_data_contents( $this->get_local_data_path( 'industry_verticals' ) ) );
		} else {
			// Check if we have a remote file.
			$response = $this->get_remote_industry_verticals();
			$data = json_decode( $response, true );
			if ( $data === 'error' ) {
				return rest_ensure_response( 'error' );
			} else {
				$this->create_data_file( $response, 'industry_verticals' );
				return rest_ensure_response( $response );
			}
		}
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$context = $request->get_param( self::PROP_CONTEXT );
		$reload = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->api_key  = $request->get_param( self::PROP_API_KEY );
		$this->api_email  = $request->get_param( self::PROP_API_EMAIL );
		$available_prompts = get_option( 'kb_design_library_prompts', array() );

		// Check if we have captured prompt.
		if ( ! empty( $available_prompts[ $context ] ) && ! $reload ) {
			// Check if we have a local file.
			if ( file_exists( $this->get_local_data_path( $available_prompts[ $context ] ) ) ) {
				return rest_ensure_response( $this->get_local_data_contents( $this->get_local_data_path( $available_prompts[ $context ] ) ) );
			} else {
				// Check if we have a remote file.
				$response = $this->get_remote_contents( $available_prompts[ $context ] );
				$data = json_decode( $response, true );
				if ( $data === 'error' ) {
					return rest_ensure_response( 'error' );
				} else if ( isset( $data['data']['status'] ) ) {
					return rest_ensure_response( 'processing' );
				} else {
					$this->create_data_file( $response, $available_prompts[ $context ] );
					return rest_ensure_response( $response );
				}
			}
		} else {
			// Create a job.
			$response = $this->get_new_remote_contents( $context );
			$data = json_decode( $response, true );
			error_log( print_r( $data, true ) );
			if ( isset( $data['data']['job_id'] ) ) {
				$current_prompts = get_option( 'kb_design_library_prompts', array() );
				$current_prompts[ $context ] = $data['data']['job_id'];
				update_option( 'kb_design_library_prompts', $current_prompts );
				error_log( print_r( 'HERE?', true ) );
				return rest_ensure_response( 'processing' );
			} else {
				return rest_ensure_response( 'failed' );
			}
		}
	}
	/**
	 * Retrieves the path to the local data file.
	 * 
	 * @param array $prompt_data The prompt data.
	 *
	 * @return string of the path to local data file.
	 */
	public function get_local_data_path( $prompt_data ) {
		return $this->get_block_library_folder() . '/' . $this->get_local_data_filename( $prompt_data ) . '.json';
	}
	/**
	 * Get the local data filename.
	 *
	 * This is a hash, generated from the current site url, the wp-content path, the prompt data.
	 * This way we can avoid issues with sites changing their URL, or the wp-content path etc.
	 *
	 * @param array $prompt_data The prompt data.
	 *
	 * @return string
	 */
	public function get_local_data_filename( $prompt_data ) {
		return md5( $this->get_base_url() . $this->get_base_path() . $prompt_data );
	}
	/**
	 * Get the subfolder name.
	 *
	 * @access public
	 * @return string
	 */
	public function get_subfolder_name() {
		$subfolder_name = apply_filters( 'kadence_block_library_local_data_subfolder_name', 'kadence_blocks_library' );
		return $subfolder_name;
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
	 * Get the folder for templates data.
	 *
	 * @access public
	 * @return string
	 */
	public function get_block_library_folder() {
		if ( ! $this->block_library_folder ) {
			$this->block_library_folder = $this->get_base_path();
			$this->block_library_folder .= $this->get_subfolder_name();
		}
		return $this->block_library_folder;
	}
	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_new_remote_contents( $context ) {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$auth = array(
			'domain' => $site_url,
			'key'    => $this->api_key,
		);
		$prophecy_data = json_decode( get_option( 'kadence_blocks_prophecy' ), true );
		// Get the response.
		$body = array(
			'context' => 'kadence',
		);
		$body['company'] = ! empty( $prophecy_data['company'] )	? $prophecy_data['company'] : '';
		$body['industry'] = ! empty( $prophecy_data['industry'] ) ? $prophecy_data['industry'] : '';
		$body['location'] = ! empty( $prophecy_data['location'] ) ? $prophecy_data['location'] : '';
		$body['mission'] = ! empty( $prophecy_data['mission'] ) ? $prophecy_data['mission'] : '';
		$body['tone'] = ! empty( $prophecy_data['tone'] ) ? $prophecy_data['tone'] : '';
		$body['keywords'] = ! empty( $prophecy_data['keywords'] ) ? $prophecy_data['keywords'] : '';

		// Use test data.
		$body = array(
			'context' => 'kadence',
			'company' => 'Pinnacle Foods',
			'industry' => 'Food',
			'location' => "United States",
			'mission' => "The best days are filled with moments when you are fully engaged in the present, thriving in the adventure. These precious moments so often involve great food. At Pinnacle Foods we create gourmet freeze-dried meals that are easy to pack and prepare so you can focus on the adventure at hand and enjoy the experience fully.",
			'tone' => 'PASSIONATE',
			'keywords'=> array(
				'Backpacking Meals',
				'Freeze-Dried Food',
				'Adventure Food',
				'gourmet packaged meals',
			),
			'prompts' => array(
				// 'accordion-faq',
				// 'accordion-get-started',
				// 'cards-location',
				// 'cards-products-services',
				'columns-about',
				// 'columns-profile',
				// 'counter-stats-work',
				// 'forms-subscribe',
				// 'gallery-work',
				// 'hero-about',
				// 'hero-value-prop',
				// 'image-mission',
				// 'media-text-about',
				// 'media-text-donate', 
				// 'people-team',
				// 'pricing-table-plans',
				// 'testimonials-testimonials',
			),
		);
		switch ( $context ) {
			case 'about':
				$body['prompts'] = array(
					'columns-about',
					'hero-about',
					'media-text-about',
				);
				break;
			case 'faq':
				$body['prompts'] = array(
					'accordion-faq',
				);
				break;
		}
		$api_url  = add_query_arg( $body, $this->remote_ai_url . 'content/create' );
		$response = wp_remote_post(
			$api_url,
			array(
				'timeout' => 20,
				'headers' => array(
					'X-Prophecy-Token' => base64_encode( json_encode( $auth ) ),
				),
			)
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return 'Error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
		error_log( print_r( $contents, true ) );
		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return 'Error';
		}

		return $contents;
	}
	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_contents( $job ) {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$auth = array(
			'domain' => $site_url,
			'key'    => $this->api_key,
		);
		$api_url  = $this->remote_ai_url . 'content/job/' . $job;
		// error_log( print_r( $api_url, true ) );
		$response = wp_remote_get(
			$api_url,
			array(
				'timeout' => 20,
				'headers' => array(
					'X-Prophecy-Token' => base64_encode( json_encode( $auth ) ),
				),
			)
		);
		// error_log( print_r( $response, true ) );
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
		error_log( print_r( $contents, true ) );
		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return 'error';
		}

		return $contents;
	}
	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_industry_verticals() {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$auth = array(
			'domain' => $site_url,
			'key'    => $this->api_key,
		);
		$api_url  = $this->remote_ai_url . 'verticals';
		$response = wp_remote_get(
			$api_url,
			array(
				'timeout' => 20,
				'headers' => array(
					'X-Prophecy-Token' => base64_encode( json_encode( $auth ) ),
				),
			)
		);
		// error_log( print_r( $response, true ) );
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
		error_log( print_r( $contents, true ) );
		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return 'error';
		}

		return $contents;
	}
	/**
	 * Write the data to the filesystem.
	 *
	 * @access protected
	 * @return string|false Returns the absolute path of the file on success, or false on fail.
	 */
	protected function create_data_file( $content, $prompt_data ) {
		$file_path  = $this->get_local_data_path( $prompt_data );
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

		// Put the contents in the file. Return false if that fails.
		if ( ! $filesystem->put_contents( $file_path, $content ) ) {
			return false;
		}

		return $file_path;
	}
	/**
	 * Get local data contents.
	 *
	 * @access public
	 * @return string|false Returns the data contents.
	 */
	public function get_local_data_contents( $file_path ) {
		// Check if the file path is set.
		if ( empty( $file_path ) ) {
			return false;
		}
		ob_start();
		include $file_path;
		return ob_get_clean();
	}
	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params  = parent::get_collection_params();

		$query_params[ self::PROP_CONTEXT ] = array(
			'description' => __( 'The requested ai context.', 'kadence-blocks' ),
			'type'        => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);

		$query_params[ self::PROP_FORCE_RELOAD ] = array(
			'description' => __( 'Force a refresh of the context.', 'kadence-blocks' ),
			'type'        => 'boolean',
			'default'     => false,
		);

		$query_params[ self::PROP_API_KEY ] = array(
			'description'       => __( 'Kadence License Key.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);

		$query_params[ self::PROP_API_EMAIL ] = array(
			'description'       => __( 'Kadence License Email.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);

		return $query_params;
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
			WP_Filesystem();
		}
		return $wp_filesystem;
	}
}
