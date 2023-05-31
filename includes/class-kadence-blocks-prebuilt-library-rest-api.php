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
	 * Library slug.
	 */
	const PROP_LIBRARY = 'library';
	/**
	 * Library URL.
	 */
	const PROP_LIBRARY_URL = 'library_url';

	/**
	 * Force reload.
	 */
	const PROP_FORCE_RELOAD = 'force_reload';
	/**
	 * Handle Library Key.
	 */
	const PROP_KEY = 'key';

	/**
	 * Handle API Key.
	 */
	const PROP_API_KEY = 'api_key';

	/**
	 * Handle API Key.
	 */
	const PROP_API_EMAIL = 'api_email';

	/**
	 * Handle API product Key.
	 */
	const PROP_API_PRODUCT = 'product_id';
	/**
	 * Handle pattern ID.
	 */
	const PROP_PATTERN_ID = 'pattern_id';

	/**
	 * Handle pattern type.
	 */
	const PROP_PATTERN_TYPE = 'pattern_type';
	/**
	 * Handle pattern style.
	 */
	const PROP_PATTERN_STYLE = 'pattern_style';

	/**
	 * Handle image Type.
	 */
	const PROP_IMAGE_TYPE = 'image_type';
	/**
	 * Handle image sizes.
	 */
	const PROP_IMAGE_SIZES = 'image_sizes';
	/**
	 * Handle image sizes.
	 */
	const PROP_INDUSTRY = 'industries';

	/**
	 * The library folder.
	 *
	 * @access protected
	 * @var string
	 */
	protected $block_library_folder;

	/**
	 * The library folder.
	 *
	 * @access protected
	 * @var string
	 */
	protected $block_ai_folder;
	/**
	 * Base URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $base_url;
	/**
	 * Base URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $library_url;
	/**
	 * Library Key.
	 *
	 * @access protected
	 * @var string
	 */
	protected $key;
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
	 * API product for kadence
	 *
	 * @var string
	 */
	private $product_id = '';

	/**
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_ai_url = 'https://content.startertemplatecloud.com/wp-json/prophecy/v1/';
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
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-design-library/v1';
		$this->rest_base = 'get';
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
			'/get_library',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_library' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/get_local_contexts',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_local_contexts' ),
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
			'/get_images',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_images_by_industry' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/get_image_collections',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_image_collections' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/get_pattern_content',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_pattern_content' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_collection_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/process_pattern',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'process_pattern' ),
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
	public function get_images_by_industry( $request ) {
		$industries = $request->get_param( self::PROP_INDUSTRY );
		$image_type = $request->get_param( self::PROP_IMAGE_TYPE );
		$image_sizes = $request->get_param( self::PROP_IMAGE_SIZES );
		$reload = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->api_key  = $request->get_param( self::PROP_API_KEY );
		if ( empty( $industries ) ) {
			return rest_ensure_response( 'error' );
		}
		if ( ! is_array( $industries ) ) {
			return rest_ensure_response( 'error' );
		}
		$identifier = 'imageCollection' . json_encode( $industries );
		if ( ! empty( $image_type ) ) {
			$identifier .= '_' . $image_type;
		}
		if ( ! empty( $image_sizes ) && is_array( $image_sizes ) ) {
			$identifier .= '_' . json_encode( $image_sizes );
		}
		if ( file_exists( $this->get_local_data_path( $identifier ) ) && ! $reload ) {
			return rest_ensure_response( $this->get_local_data_contents( $this->get_local_data_path( $identifier ) ) );
		} else {
			// Check if we have a remote file.
			$response = $this->get_remote_industry_images( $industries, $image_type, $image_sizes );
			$data = json_decode( $response, true );
			if ( $response === 'error' ) {
				return rest_ensure_response( 'error' );
			} else if ( ! isset( $data['data'][0]['collection_slug'] ) ) {
				return rest_ensure_response( 'error' );
			} else {
				$this->create_data_file( $response, $identifier );
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
	public function get_image_collections( $request ) {
		$context = $request->get_param( self::PROP_CONTEXT );
		$reload = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->api_key  = $request->get_param( self::PROP_API_KEY );
		if ( file_exists( $this->get_local_data_path( 'image_collections' ) ) && ! $reload ) {
			return rest_ensure_response( $this->get_local_data_contents( $this->get_local_data_path( 'image_collections' ) ) );
		} else {
			// Check if we have a remote file.
			$response = $this->get_remote_image_collections();
			$data = json_decode( $response, true );
			if ( $response === 'error' ) {
				return rest_ensure_response( 'error' );
			} else {
				$this->create_data_file( $response, 'image_collections' );
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
	public function get_industry_verticals( $request ) {
		$context = $request->get_param( self::PROP_CONTEXT );
		$reload = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->api_key  = $request->get_param( self::PROP_API_KEY );
		if ( file_exists( $this->get_local_data_path( 'industry_verticals' ) ) && ! $reload ) {
			return rest_ensure_response( $this->get_local_data_contents( $this->get_local_data_path( 'industry_verticals' ) ) );
		} else {
			// Check if we have a remote file.
			$response = $this->get_remote_industry_verticals();
			$data = json_decode( $response, true );
			if ( $response === 'error' ) {
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
	public function process_pattern( $request ) {
		$parameters = $request->get_json_params();
		if ( empty( $parameters['content'] ) ) {
			return rest_ensure_response( 'failed' );
		}
		$content = $parameters['content'];
		$image_library = $parameters['image_library'];
		//error_log( print_r( $image_library, true ) );
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
				if ( strpos( $image_url, 'prophecyimg.fly.dev' ) !== false ) {
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
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_pattern_content( $request ) {
		$this->api_key    = $request->get_param( self::PROP_API_KEY );
		$this->api_email  = $request->get_param( self::PROP_API_EMAIL );
		$this->product_id = $request->get_param( self::PROP_API_PRODUCT );
		$library          = $request->get_param( self::PROP_LIBRARY );
		$library_url      = $request->get_param( self::PROP_LIBRARY_URL );
		$key              = $request->get_param( self::PROP_KEY );
		$pattern_type     = $request->get_param( self::PROP_PATTERN_TYPE );
		$pattern_id       = $request->get_param( self::PROP_PATTERN_ID );
		$pattern_style    = $request->get_param( self::PROP_PATTERN_STYLE );
		if ( ! empty( $library_url ) ) {
			$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/single/';
		} else {
			$library_url = 'https://patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/single/';
		}
		if ( ! empty( $library ) ) {
			if ( is_callable( 'network_home_url' ) ) {
				$site_url = network_home_url( '', 'http' );
			} else {
				$site_url = get_bloginfo( 'url' );
			}
			$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
			$args = array(
				'type'    => ( ! empty( $pattern_type ) ? $pattern_type : 'pattern' ),
				'key'     => $key,
				'id'      => $pattern_id,
				'site'    => $site_url,
			);
			if ( ! empty( $pattern_style ) ) {
				$args['style'] = $pattern_style;
			}
			if ( 'templates' === $library || 'section' === $library || 'pages' === $library || 'template' === $library ) {
				$args['api_email']  = $this->api_email;
				$args['api_key']    = $this->api_key;
				$args['product_id'] = $this->product_id;
				if ( 'iThemes' === $this->api_email ) {
					$args['site_url'] = $site_url;
				}
			}
			// Get the response.
			$api_url  = add_query_arg( $args, $library_url );
			$response = wp_remote_get(
				$api_url,
				array(
					'timeout' => 20,
				)
			);
			// Early exit if there was an error.
			if ( is_wp_error( $response ) ) {
				return rest_ensure_response( 'error' );
			}
			// Get the CSS from our response.
			$contents = wp_remote_retrieve_body( $response );
			// Early exit if there was an error.
			if ( is_wp_error( $contents ) ) {
				return rest_ensure_response( 'error' );
			}
			if ( ! $contents ) {
				return rest_ensure_response( 'error' );
			} else {
				return rest_ensure_response( $contents );
			}
		}
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_library( $request ) {
		$reload           = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->api_key    = $request->get_param( self::PROP_API_KEY );
		$this->api_email  = $request->get_param( self::PROP_API_EMAIL );
		$this->product_id = $request->get_param( self::PROP_API_PRODUCT );
		$library          = $request->get_param( self::PROP_LIBRARY );
		$library_url      = $request->get_param( self::PROP_LIBRARY_URL );
		$key              = $request->get_param( self::PROP_KEY );
		if ( ! empty( $library_url ) ) {
			$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/get/';
		} elseif ( ! empty( $library ) && 'pages' === $library ) {
			$library_url = $this->remote_pages_url;
			$key = 'new-pages';
		} else {
			$library_url = $this->remote_url;
		}
		$identifier = 'library' . $library;
		if ( ! empty( $this->api_key ) ) {
			$identifier .= '_' . $this->api_key;
		}
		if ( ! empty( $key ) ) {
			$identifier .= '_' . $key;
		}
		if ( 'templates' !== $library && 'pages' !== $library && 'section' !== $library && 'template' !== $library ) {
			$cloud_settings = json_decode( get_option( 'kadence_blocks_cloud' ), true );
			if ( isset( $cloud_settings['connections'] ) && isset( $cloud_settings['connections'][ $library ] ) && isset( $cloud_settings['connections'][ $library ]['expires'] ) && ! empty( $cloud_settings['connections'][ $library ]['expires'] ) ) {
				$expires = strtotime( get_date_from_gmt( $cloud_settings['connections'][ $library ]['expires'] ) );
				$now     = strtotime( get_date_from_gmt( current_time( 'Y-m-d H:i:s' ) ) );
				if ( $expires < $now ) {
					$refresh = ( isset( $cloud_settings['connections'][ $library ]['refresh'] ) && ! empty( $cloud_settings['connections'][ $library ]['refresh'] ) ? $cloud_settings['connections'][ $library ]['refresh'] : 'month' );
					if ( 'day' === $refresh ) {
						$expires_add = DAY_IN_SECONDS;
					} elseif ( 'week' === $refresh ) {
						$expires_add = WEEK_IN_SECONDS;
					} else {
						$expires_add = MONTH_IN_SECONDS;
					}
					$cloud_settings['connections'][ $library ]['expires'] = gmdate( 'Y-m-d H:i:s', strtotime( current_time() ) + $expires_add );
					update_option( 'kadence_blocks_cloud', json_encode( $cloud_settings ) );
					$reload = true;
				}
			}
		}
		// Check if we have a local file.
		if ( ! $reload && file_exists( $this->get_local_data_path( $identifier ) ) ) {
			return wp_send_json( $this->get_local_data_contents( $this->get_local_data_path( $identifier ) ) );
		} else {
			if ( 'custom' === $library ) {
				return wp_json_encode( apply_filters( 'kadence_block_library_custom_array', array() ) );
			}
			// Access via remote.
			$response = $this->get_remote_library_contents( $library, $library_url, $key );
			if ( 'error' === $response ) {
				return wp_send_json( 'error' );
			} else {
				$this->create_data_file( $response, $identifier );
				return wp_send_json( $response );
			}
		}
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_local_contexts( $request ) {
		$available_prompts = get_option( 'kb_design_library_prompts', array() );
		if ( ! empty( $available_prompts && is_array( $available_prompts) ) ) {
			$contexts_available = array();
			foreach( $available_prompts as $key => $prompt ) {
				if ( ! empty( $prompt ) ) {
					$contexts_available[] = $key;
				}
			}
			if ( ! empty( $contexts_available ) ) {
				return rest_ensure_response( $contexts_available );
			} else {
				return rest_ensure_response( 'failed' );
			}
		} else {
			return rest_ensure_response( 'failed' );
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
		$available_prompts = get_option( 'kb_design_library_prompts', array() );

		// Check if we have captured prompt.
		if ( ! empty( $available_prompts[ $context ] ) && ! $reload ) {
			// Check if we have a local file.
			if ( file_exists( $this->get_local_data_path( $available_prompts[ $context ], 'ai' ) ) ) {
				return wp_send_json( $this->get_local_data_contents( $this->get_local_data_path( $available_prompts[ $context ], 'ai' ) ) );
			} else {
				// Check if we have a remote file.
				$response = $this->get_remote_contents( $available_prompts[ $context ] );
				$data = json_decode( $response, true );
				if ( $response === 'error' ) {
					$current_prompts = get_option( 'kb_design_library_prompts', array() );
					if ( isset( $current_prompts[ $context ] ) ) {
						unset( $current_prompts[ $context ] );
						update_option( 'kb_design_library_prompts', $current_prompts );
					}
					return wp_send_json( 'error' );
				} else if ( isset( $data['data']['status'] ) && 409 === $data['data']['status'] ) {
					return wp_send_json( 'processing' );
				} else if ( isset( $data['data']['status'] ) && 409 !== $data['data']['status'] ) {
					$current_prompts = get_option( 'kb_design_library_prompts', array() );
					if ( isset( $current_prompts[ $context ] ) ) {
						unset( $current_prompts[ $context ] );
						update_option( 'kb_design_library_prompts', $current_prompts );
					}
					return wp_send_json( 'error' );
				} else {
					$this->create_data_file( $response, $available_prompts[ $context ], 'ai' );
					return wp_send_json( $response );
				}
			}
		} else {
			// Create a job.
			$response = $this->get_new_remote_contents( $context );
			$data = json_decode( $response, true );
			if ( $response === 'error' ) {
				return wp_send_json( 'error' );
			} else if ( isset( $data['data']['job_id'] ) ) {
				$current_prompts = get_option( 'kb_design_library_prompts', array() );
				$current_prompts[ $context ] = $data['data']['job_id'];
				update_option( 'kb_design_library_prompts', $current_prompts );
				return wp_send_json( 'processing' );
			} else {
				return wp_send_json( 'error' );
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
	public function get_local_data_path( $prompt_data, $path_type = 'content' ) {
		return $this->get_block_library_folder( $path_type ) . '/' . $this->get_local_data_filename( $prompt_data ) . '.json';
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
	 * Get the subfolder name.
	 *
	 * @access public
	 * @return string
	 */
	public function get_ai_subfolder_name() {
		$subfolder_name = apply_filters( 'kadence_block_ai_local_data_subfolder_name', 'kadence_blocks_ai' );
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
	public function get_block_library_folder( $path_type = 'content' ) {
		if ( 'ai' === $path_type ) {
			if ( ! $this->block_ai_folder ) {
				$this->block_ai_folder = $this->get_base_path();
				$this->block_ai_folder .= $this->get_ai_subfolder_name();
			}
			return $this->block_ai_folder;

		} 
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
			'domain' => 'prep.local', //$site_url
			'key'    => $this->api_key,
		);
		$prophecy_data = json_decode( get_option( 'kadence_blocks_prophecy' ), true );
		// Get the response.
		$body = array(
			'context' => 'kadence',
		);
		$body['company'] = ! empty( $prophecy_data['companyName'] )	? $prophecy_data['companyName'] : '';
		if ( ! empty( $prophecy_data['industrySpecific'] ) && 'Other' !== $prophecy_data['industrySpecific'] ) {
			$body['industry'] = ! empty( $prophecy_data['industrySpecific'] ) ? $prophecy_data['industrySpecific'] : '';
		} elseif ( ! empty( $prophecy_data['industrySpecific'] ) && 'Other' === $prophecy_data['industrySpecific'] && ! empty( $prophecy_data['industryOther'] ) ) {
			$body['industry'] = ! empty( $prophecy_data['industryOther'] ) ? $prophecy_data['industryOther'] : '';
		} elseif ( ! empty( $prophecy_data['industry'] ) && 'Other' === $prophecy_data['industry'] && ! empty( $prophecy_data['industryOther'] ) ) {
			$body['industry'] = ! empty( $prophecy_data['industryOther'] ) ? $prophecy_data['industryOther'] : '';
		} else {
			$body['industry'] = ! empty( $prophecy_data['industry'] ) ? $prophecy_data['industry'] : '';
		}
		$body['location'] = ! empty( $prophecy_data['location'] ) ? $prophecy_data['location'] : '';
		$body['mission'] = ! empty( $prophecy_data['missionStatement'] ) ? $prophecy_data['missionStatement'] : '';
		$body['tone'] = ! empty( $prophecy_data['tone'] ) ? $prophecy_data['tone'] : '';
		$body['keywords'] = ! empty( $prophecy_data['keywords'] ) ? $prophecy_data['keywords'] : '';

		switch ( $context ) {
			case 'about':
				$body['prompts'] = array(
					'about',
					'about-hero',
					'about-columns',
					'about-list',
					'about-videos',
				);
				break;
			case 'achievements':
				$body['prompts'] = array(
					'achievements',
					'achievements-columns',
					'achievements-list',
					'achievements-videos',
				);
				break;
			case 'blog':
				$body['prompts'] = array(
					'blog-post-loop',
					'blog-table-contents',
				);
				break;
			case 'call-to-action':
				$body['prompts'] = array(
					'call-to-action',
					'call-to-action-columns',
					'call-to-action-list',
					'call-to-action-videos',
				);
				break;
			case 'careers':
				$body['prompts'] = array(
					'careers',
					'careers-hero',
					'careers-columns',
					'careers-list',
					'careers-videos',
				);
				break;
			case 'contact-form':
				$body['prompts'] = array(
					'contact-form',
				);
				break;
			case 'donate':
				$body['prompts'] = array(
					'donate',
					'donate-hero',
					'donate-columns',
					'donate-list',
					'donate-videos',
				);
				break;
			case 'events':
				$body['prompts'] = array(
					'events',
					'events-hero',
					'events-columns',
					'events-list',
					'events-videos',
				);
				break;
			case 'faq':
				$body['prompts'] = array(
					'faq-accordion',
				);
				break;
			case 'get-started':
				$body['prompts'] = array(
					'get-started',
					'get-started-accordion',
					'get-started-columns',
					'get-started-list',
				);
				break;
			case 'history':
				$body['prompts'] = array(
					'history',
					'history-columns',
					'history-list',
					'history-videos',
				);
				break;
			case 'industries':
				$body['prompts'] = array(
					'industries',
					'industries-accordion',
					'industries-list',
					'industries-columns',
					'industries-tabs',
				);
				break;
			case 'location':
				$body['prompts'] = array(
					'location',
					'location-columns',
					'location-tabs',
				);
				break;
			case 'mission':
				$body['prompts'] = array(
					'mission',
					'mission-columns',
					'mission-list',
					'mission-videos',
				);
				break;
			case 'news':
				$body['prompts'] = array(
					'news-post-loop',
				);
				break;
			case 'partners':
				$body['prompts'] = array(
					'partners',
					'partners-columns',
					'partners-list',
				);
				break;
			case 'podcast':
				$body['prompts'] = array(
					'podcast',
				);
				break;
			case 'pricing-table':
				$body['prompts'] = array(
					'pricing-pricing-table',
				);
				break;
			case 'product-details':
				$body['prompts'] = array(
					'product-details-accordion',
				);
				break;
			case 'products-services':
				$body['prompts'] = array(
					'products-services',
					'products-services-columns',
					'products-services-hero',
					'products-services-list',
					'products-services-single',
					'products-services-tabs',
					'products-services-videos',
				);
				break;
			case 'profile':
				$body['prompts'] = array(
					'profile',
					'profile-columns',
					'profile-list',
					'profile-videos',
				);
				break;
			case 'subscribe-form':
				$body['prompts'] = array(
					'subscribe-form',
				);
				break;
			case 'support':
				$body['prompts'] = array(
					'support',
					'support-columns',
					'support-list',
					'support-videos',
				);
				break;
			case 'team':
				$body['prompts'] = array(
					'team',
					'team-columns',
					'team-list',
					'team-people',
					'team-videos',
				);
				break;
			case 'testimonials':
				$body['prompts'] = array(
					'testimonials-testimonials',
				);
				break;
			case 'value-prop':
				$body['prompts'] = array(
					'value-prop',
					'value-prop-columns',
					'value-prop-hero',
					'value-prop-list',
					'value-prop-tabs',
					'value-prop-videos',
				);
				break;
			case 'volunteer':
				$body['prompts'] = array(
					'volunteer',
					'volunteer-hero',
					'volunteer-list',
					'volunteer-columns',
					'volunteer-videos',
				);
				break;
			case 'welcome':
				$body['prompts'] = array(
					'welcome',
					'welcome-hero',
					'welcome-list',
					'welcome-columns',
					'welcome-videos',
				);
				break;
			case 'work':
				$body['prompts'] = array(
					'work',
					'work-columns',
					'work-counter-stats',
					'work-list',
					'work-videos',
				);
				break;
		}
		//error_log( print_r( $body, true ));
		$response = wp_remote_post(
			$this->remote_ai_url . 'content/create',
			array(
				'timeout' => 20,
				'headers' => array(
					'X-Prophecy-Token' => base64_encode( json_encode( $auth ) ),
					'Content-Type' => 'application/json',
				),
				'body' => json_encode( $body ),
			)
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
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
	public function get_remote_contents( $job ) {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$auth = array(
			'domain' => 'prep.local', //$site_url
			'key'    => $this->api_key,
		);
		$api_url  = $this->remote_ai_url . 'content/job/' . $job;
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
	public function get_remote_library_contents( $library, $library_url, $key ) {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$args = array(
			'key'  => $key,
			'site' => $site_url,
		);
		if ( 'templates' === $library || 'section' === $library || 'pages' === $library || 'template' === $library ) {
			$args['api_email']  = $this->api_email;
			$args['api_key']    = $this->api_key;
			$args['product_id'] = $this->product_id;

			if ( 'iThemes' === $this->api_email ) {
				$args['site_url'] = $site_url;
			}
		}
		if ( 'templates' === $library ) {
			$args['request'] = 'blocks';
		}
		// Get the response.
		$api_url  = add_query_arg( $args, $library_url );
		$response = wp_remote_get(
			$api_url,
			array(
				'timeout' => 30,
			)
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
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
	public function get_remote_industry_images( $industries, $image_type = 'JPEG', $sizes = array() ) {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$auth = array(
			'domain' => 'prep.local', //$site_url,
			'key'    => $this->api_key,
		);
		if ( empty( $industries ) ) {
			return 'error';
		}
		if ( empty( $sizes ) ) {
			$sizes = array(
				array(
					"id" => "2048x2048",
					"width" => 2048,
					"height" => 2048,
					"crop" => false,
				),
			);
		}
		if ( empty( $image_type ) ) {
			$image_type = 'JPEG';
		}
		$body = array(
			'industries' => $industries,
			'image_type' => $image_type,
			'sizes' => $sizes,
		);
		$api_url  = add_query_arg( $body, $this->remote_ai_url . 'images/collections' );
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
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
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
	public function get_remote_image_collections() {
		if ( is_callable( 'network_home_url' ) ) {
			$site_url = network_home_url( '', 'http' );
		} else {
			$site_url = get_bloginfo( 'url' );
		}
		$site_url = str_replace( array( 'http://', 'https://', 'www.' ), array( '', '', '' ), $site_url );
		$auth = array(
			'domain' => 'prep.local', //$site_url
			'key'    => $this->api_key,
		);
		$api_url  = $this->remote_ai_url . 'images/collections';
		$response = wp_remote_get(
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
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
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
			'domain' => 'prep.local', //$site_url
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
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return 'error';
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
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
	protected function create_data_file( $content, $prompt_data, $path_type = 'content' ) {
		$file_path  = $this->get_local_data_path( $prompt_data, $path_type );
		$filesystem = $this->get_filesystem();

		// If the folder doesn't exist, create it.
		if ( ! file_exists( $this->get_block_library_folder( $path_type ) ) ) {
			$chmod_dir = ( 0755 & ~ umask() );
			if ( defined( 'FS_CHMOD_DIR' ) ) {
				$chmod_dir = FS_CHMOD_DIR;
			}
			$this->get_filesystem()->mkdir( $this->get_block_library_folder( $path_type ), $chmod_dir );
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
		$query_params[ self::PROP_LIBRARY ] = array(
			'description' => __( 'The requested library.', 'kadence-blocks' ),
			'type'        => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);
		$query_params[ self::PROP_LIBRARY_URL ] = array(
			'description' => __( 'The requested library URL.', 'kadence-blocks' ),
			'type'        => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);

		$query_params[ self::PROP_FORCE_RELOAD ] = array(
			'description' => __( 'Force a refresh of the context.', 'kadence-blocks' ),
			'type'        => 'boolean',
			'default'     => false,
		);
		$query_params[ self::PROP_KEY ] = array(
			'description'       => __( 'Library Key.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
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
		$query_params[ self::PROP_API_PRODUCT ] = array(
			'description'       => __( 'Kadence License Product ID.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);
		$query_params[ self::PROP_PATTERN_TYPE ] = array(
			'description'       => __( 'Pattern Type', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);
		$query_params[ self::PROP_PATTERN_STYLE ] = array(
			'description'       => __( 'Pattern Style', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);
		$query_params[ self::PROP_PATTERN_ID ] = array(
			'description'       => __( 'Pattern ID', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);
		$query_params[ self::PROP_IMAGE_TYPE ] = array(
			'description'       => __( 'The Image type to return', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		);
		$query_params[ self::PROP_INDUSTRY ] = array(
			'description'       => __( 'The industries to return', 'kadence-blocks' ),
			'type'              => 'array',
			'sanitize_callback' => array( $this, 'sanitize_industries_array' ),
		);
		$query_params[ self::PROP_IMAGE_SIZES ] = array(
			'description'       => __( 'The Image type to return', 'kadence-blocks' ),
			'type'              => 'array',
			'sanitize_callback' => array( $this, 'sanitize_image_sizes_array' ),
		);
		return $query_params;
	}
	/**
	 * Sanitizes an array of industries.
	 *
	 * @param array    $industries One or more size arrays.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_industries_array( $industries, $request ) {
		if ( ! empty( $industries ) && is_array( $industries ) ) {
			$new_industries = array();
			foreach ( $industries as $key => $value ) {
				$new_industries[] = sanitize_text_field( $value );
			}
			return $new_industries;
		}
		return array();
	}
	/**
	 * Sanitizes an array of sizes.
	 *
	 * @param array    $sizes One or more size arrays.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_image_sizes_array( $sizes, $request ) {
		if ( ! empty( $sizes ) && is_array( $sizes ) ) {
			$new_sizes = array();
			foreach ( $sizes as $key => $value ) {
				$new_sizes[] = array(
					'id'     => sanitize_text_field( $value['id'] ),
					'width'  => absint( $value['width'] ),
					'height' => absint( $value['height'] ),
					'crop'   => (bool) $value['crop'],
				);
			}
			return $new_sizes;
		}
		return array();
	}
	/**
	 * Sanitizes an array of sizes.
	 *
	 * @param array    $sizes One or more size arrays.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_block_content( $content, $request ) {
		if ( ! empty( $content ) ) {
			return $content;
		}
		return '';
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

		$filename = basename( $image_data['url'] );
		if ( strpos( $image_data['url'], 'prophecyimg.fly.dev' ) !== false ) {
			$filename = $this->get_name_from_url( $image_data['url'] ) . '.jpg';
		}
		$upload = wp_upload_bits( $filename, null, $file_content );
		$post = array(
			'post_title' => ( ! empty( $image_data['title'] ) ? $image_data['title'] : $filename ),
			'guid'       => $upload['url'],
		);
		$info = wp_check_filetype( $upload['file'] );
		if ( $info ) {
			$post['post_mime_type'] = $info['type'];
		} else {
			return $image_data;
		}
		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			include( ABSPATH . 'wp-admin/includes/image.php' );
		}
		$post_id = wp_insert_attachment( $post, $upload['file'] );
		wp_update_attachment_metadata(
			$post_id,
			wp_generate_attachment_metadata( $post_id, $upload['file'] )
		);
		if (  ! empty( $image_data['alt'] ) ) {
			update_post_meta( $post_id, '_wp_attachment_image_alt', $image_data['alt'] );
		}
		if (  ! empty( $image_data['photographer'] ) ) {
			update_post_meta( $post_id, '_pexels_photographer', $image_data['photographer'] );
		}
		if (  ! empty( $image_data['photographer_url'] ) ) {
			update_post_meta( $post_id, '_pexels_photographer_url', $image_data['photographer_url'] );
		}
		update_post_meta( $post_id, '_kadence_blocks_image_hash', sha1( $image_data['url'] ) );

		return array(
			'id'  => $post_id,
			'url' => $upload['url'],
		);
	}
	/**
	 * Get information for our image.
	 *
	 * @param array $images the image url.
	 * @param string $target_src the image url.
	 */
	public function get_image_info( $images, $target_src ) {
		foreach ($images['data'] as $image_group) {
			foreach ($image_group['images'] as $image) {
				foreach ($image['sizes'] as $size) {
					if ($size['src'] === $target_src) {
						return array(
							'alt' => $image['alt'],
							'photographer' => $image['photographer'],
							'photographer_url' => $image['photographer_url']
						);
						break;
					}
				}
			}
		}
		return false;
	}
	/**
	 * Get a name for our image.
	 *
	 * @param array $url the image url.
	 */
	public function get_name_from_url( $url ) {
		// Parse the URL and get the path.
		$parsed_url = parse_url( $url );
		$path = $parsed_url['path'];
		// Split the path on the '/' character.
		$parts = explode( '/', $path );
		// The second part is the key.
		if ( isset( $parts[1] ) ) {
			return $parts[1];
		} else {
			return wp_generate_password( 14, false );
		}
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
		if ( strpos( $link, 'prophecyimg.fly.dev' ) !== false ) {
			return true;
		}
		return preg_match( '/^((https?:\/\/)|(www\.))([a-z0-9-].?)+(:[0-9]+)?\/[\w\-]+\.(jpg|png|gif|webp|jpeg)\/?$/i', $link );
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
