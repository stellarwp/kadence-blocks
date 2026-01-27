<?php
/**
 * REST API for Kadence prebuilt library.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Cache\Ai_Cache;
use KadenceWP\KadenceBlocks\Cache\Block_Library_Cache;
use KadenceWP\KadenceBlocks\Image_Downloader\Image_Downloader;
use KadenceWP\KadenceBlocks\Image_Downloader\Cache_Primer;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\ImageDownloader\Exceptions\ImageDownloadException;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Storage\Exceptions\NotFoundException;
use KadenceWP\KadenceBlocks\Traits\Rest\Image_Trait;

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_original_domain;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * REST API prebuilt library.
 */
class Kadence_Blocks_Prebuilt_Library_REST_Controller extends WP_REST_Controller {

	use Image_Trait;

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
	 * Handle image Industry.
	 */
	const PROP_INDUSTRIES = 'industries';
	/**
	 * Handle image Industry.
	 */
	const PROP_INDUSTRY = 'industry';
	/**
	 * Handle image Industry.
	 */
	const PROP_META = 'meta';
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
	 * API product for kadence
	 *
	 * @var string
	 */
	private $product_slug = '';

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
	protected $remote_credits_url = 'https://content.startertemplatecloud.com/wp-json/kadence-credits/v1/';

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
	protected $remote_cat_url = 'https://patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/categories/';

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
	protected $remote_pages_cat_url = 'https://patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/pages-categories/';

	/**
	 * The remote URL.
	 *
	 * @access protected
	 * @var string
	 */
	protected $remote_templates_url = 'https://api.startertemplatecloud.com/wp-json/kadence-starter/v1/get/';

	/**
	 * The library folder.
	 *
	 * @access protected
	 * @var string
	 */
	protected $initial_contexts = [
		'about',
		'achievements',
		// 'blog',
		'call-to-action',
		// 'careers',
		'contact-form',
		'donate',
		'events',
		'faq',
		'get-started',
		// 'history',
		'industries',
		'location',
		'mission',
		// 'news',
		// 'partners',
		// 'podcast',
		'pricing-table',
		'product-details',
		'products-services',
		// 'profile',
		'subscribe-form',
		// 'support',
		'team',
		'testimonials',
		'value-prop',
		// 'volunteer',
		'welcome',
		'work',
	];
	/**
	 * The library folder.
	 *
	 * @access protected
	 * @var string
	 */
	protected $all_contexts = [
		'about',
		'achievements',
		'blog',
		'call-to-action',
		'careers',
		'contact-form',
		'donate',
		'events',
		'faq',
		'get-started',
		'history',
		'industries',
		'location',
		'mission',
		'news',
		'partners',
		// 'podcast',
		'pricing-table',
		// 'product-details',
		'products-services',
		'profile',
		'subscribe-form',
		'support',
		'team',
		'testimonials',
		'value-prop',
		'volunteer',
		'welcome',
		'work',
	];
	/**
	 * Blocks that are based on CPT
	 *
	 * @var array
	 */
	private $kadence_cpt_blocks = [
		'kadence/header',
		'kadence/navigation',
		'kadence/query',
		'kadence/query-card',
		'kadence/advanced-form',
	];
	/**
	 * The environment.
	 *
	 * @access protected
	 * @var string
	 */
	public $env = '';
	/**
	 * @var Block_Library_Cache
	 */
	protected $block_library_cache;

	/**
	 * @var Ai_Cache
	 */
	protected $ai_cache;

	/**
	 * @var Cache_Primer
	 */
	protected $cache_primer;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace           = 'kb-design-library/v1';
		$this->rest_base           = 'get';
		$this->reset               = 'reset';
		$this->block_library_cache = kadence_blocks()->get( Block_Library_Cache::class );
		$this->ai_cache            = kadence_blocks()->get( Ai_Cache::class );
		$this->cache_primer        = kadence_blocks()->get( Cache_Primer::class );
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
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_all_items',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_all_items' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get-all-ai',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_all_ai_items' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_remaining_jobs',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_remaining_jobs' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_library',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_library' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_library_categories',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_library_categories' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_connection',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_connection' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_local_contexts',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_local_contexts' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_verticals',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_industry_verticals' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_keywords',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'get_keyword_suggestions' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_initial_jobs',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_initial_jobs' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_search_query',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'get_image_search_query' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_images',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_images_by_industry' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_image_collections',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_image_collections' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_pattern_content',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_pattern_content' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/process_pattern',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'process_pattern' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/process_images',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'process_images' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/get_remaining_credits',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_remaining_credits' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->reset,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'reset_items' ],
					'permission_callback' => [ $this, 'get_items_permission_check' ],
					'args'                => $this->get_collection_params(),
				],
			]
		);
	}
	/**
	 * Checks if a given request has access to search content.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has search access, WP_Error object otherwise.
	 */
	public function get_items_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Retrieves all the currently available AI content.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_all_ai_items( $request ) {
		$this->get_license_keys();
		$reload            = $request->get_param( self::PROP_FORCE_RELOAD );
		$available_prompts = get_option( 'kb_design_library_prompts', [] );
		$contexts          = $reload ? $this->initial_contexts : $this->all_contexts;
		$return_data       = [];
		$has_error         = false;
		$ready             = true;
		if ( ! empty( $contexts ) && is_array( $contexts ) ) {
			foreach ( $contexts as $key => $context ) {
				if ( ! isset( $available_prompts[ $context ] ) ) {
					continue;
				}

				// Check local cache.
				try {
					$return_data[ $context ] = json_decode( $this->ai_cache->get( $available_prompts[ $context ] ), true );
				} catch ( NotFoundException $e ) {
					// Check if we have a remote file.
					$response = $this->get_remote_contents( $available_prompts[ $context ] );
					$body     = wp_remote_retrieve_body( $response );

					if ( $this->is_response_code_error( $response ) ) {
						// The remote job hasn't started, is still processing or is retrying.
						if ( $this->is_ai_job_processing( $response ) ) {
							$ready = false;
						} else {
							$has_error = true;
						}

						continue;
					}

					$this->ai_cache->cache( $available_prompts[ $context ], $body );

					$return_data[ $context ] = json_decode( $body, true );
				}
			}
		}

		if ( $has_error ) {
			return rest_ensure_response( 'error' );
		}

		if ( $ready ) {
			return rest_ensure_response( $return_data );
		}

		return rest_ensure_response( 'loading' );
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 *
	 * @throws InvalidArgumentException
	 */
	public function get_images_by_industry( WP_REST_Request $request ) {
		$this->get_license_keys();
		$industries   = $request->get_param( self::PROP_INDUSTRIES );
		$search_query = $request->get_param( self::PROP_INDUSTRY );
		$image_type   = $request->get_param( self::PROP_IMAGE_TYPE );
		$image_sizes  = $request->get_param( self::PROP_IMAGE_SIZES );
		$reload       = $request->get_param( self::PROP_FORCE_RELOAD );

		if ( empty( $industries ) || ! is_array( $industries ) ) {
			return rest_ensure_response( 'error' );
		}

		$identifier = 'imageCollection' . json_encode( $industries ) . KADENCE_BLOCKS_VERSION;

		if ( ! empty( $image_type ) ) {
			$identifier .= '_' . $image_type;
		}

		if ( ! empty( $image_sizes ) && is_array( $image_sizes ) ) {
			$identifier .= '_' . json_encode( $image_sizes );
		}

		if ( ! empty( $search_query ) ) {
			$identifier .= '_' . $search_query;
		}

		// Whether this request will get saved to cache.
		$store = false;

		// Try to get results from the cache.
		if ( ! $reload ) {
			try {
				$response = $this->block_library_cache->get( $identifier );
			} catch ( NotFoundException $e ) {

			}
		}

		// No cache, fetch live.
		if ( ! isset( $response ) ) {
			$store = true;

			if ( ! empty( $search_query ) && in_array( 'aiGenerated', $industries, true ) ) {
				// Fetch search image data.
				$response = $this->get_remote_search_images( $search_query, $image_type, $image_sizes );
			} else {
				// Fetch industry image data.
				$response = $this->get_remote_industry_images( $industries, $image_type, $image_sizes );
			}
		}

		if ( $response === 'error' ) {
			return rest_ensure_response( 'error' );
		}

		$data = json_decode( $response, true );

		if ( ! isset( $data['data'] ) ) {
			return rest_ensure_response( 'error' );
		}

		if ( $store ) {
			// Create a cache file.
			$this->block_library_cache->cache( $identifier, $response );
		}

		// Prime the cache for all image sizes for potential download.
		$this->cache_primer->init( $data['data'] );

		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_image_collections( WP_REST_Request $request ) {
		$reload = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->get_license_keys();
		$identifier = 'image_collections';

		if ( ! $reload ) {
			try {
				return rest_ensure_response( $this->block_library_cache->get( $identifier ) );
			} catch ( NotFoundException $e ) {
			}
		}

		// Check if we have a remote file.
		$response = $this->get_remote_image_collections();

		if ( $response === 'error' ) {
			return rest_ensure_response( 'error' );
		}

		$this->block_library_cache->cache( $identifier, $response );

		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves remaining credits.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_remaining_credits( WP_REST_Request $request ) {
		$this->get_license_keys();
		// Check if we have a remote file.
		$response = $this->get_remote_remaining_credits();

		if ( $response === 'error' ) {
			return rest_ensure_response( 'error' );
		}

		return rest_ensure_response( $response );
	}
	/**
	 * Get the license data for submitting Ai calls.
	 */
	public function get_license_keys() {
		$data = kadence_blocks_get_current_license_data();
		if ( ! empty( $data['key'] ) ) {
			$this->api_key = $data['key'];
		}
		if ( ! empty( $data['email'] ) ) {
			$this->api_email = $data['email'];
		}
		if ( ! empty( $data['product'] ) ) {
			$this->product_slug = $data['product'];
		}
		if ( ! empty( $data['env'] ) ) {
			$this->env = $data['env'];
		}
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_industry_verticals( WP_REST_Request $request ) {
		$reload     = $request->get_param( self::PROP_FORCE_RELOAD );
		$identifier = 'industry_verticals' . KADENCE_BLOCKS_VERSION;

		if ( ! $reload ) {
			try {
				return rest_ensure_response( $this->block_library_cache->get( $identifier ) );
			} catch ( NotFoundException $e ) {
			}
		}

		// Check if we have a remote file.
		$response = $this->get_remote_industry_verticals();

		if ( $response === 'error' ) {
			return rest_ensure_response( 'error' );
		}

		$this->block_library_cache->cache( $identifier, $response );

		return rest_ensure_response( $response );
	}

	/**
	 * Imports a collection of images.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return array<array{id: int, url: string}> A list of local or pexels images, where the ID is an attachment_id or pexels_id.
	 * @throws InvalidArgumentException
	 * @throws Throwable
	 * @throws ImageDownloadException
	 */
	public function process_images( WP_REST_Request $request ): array {
		$parameters = (array) $request->get_json_params();

		return kadence_blocks()->get( Image_Downloader::class )->download( $parameters );
	}
	/**
	 * Creates the forms if needed.
	 *
	 * @param string $content The content to process.
	 */
	public function process_cpt( $content, $cpt_blocks, $style ) {
		$valid_cpt_block_names = [
			'kadence/header',
			'kadence/navigation',
			'kadence/advanced-form',
			'kadence/query',
			'kadence/query-card',
		];
		$valid_cpt_block_post_types = [
			'kadence_header',
			'kadence_navigation',
			'kadence_form',
			'kadence_query',
			'kadence_query_card',
		];


		foreach ( $cpt_blocks as $cpt_block_name => $cpt_block_content ) {
			if ( in_array( $cpt_block_name, $valid_cpt_block_names ) ) {
				foreach ( $cpt_block_content as $cpt_key => $cpt_data ) {
					if ( in_array( $cpt_data['post_type'], $valid_cpt_block_post_types ) ) {
						$old_id = $cpt_data['ID'];
						$id_map = [];
						if ( ! empty( $cpt_data['inner_posts'] ) && is_array( $cpt_data['inner_posts'] ) ) {
							foreach ( $cpt_data['inner_posts'] as $inner_post_key => $inner_post ) {
								$temp_old_id = $inner_post['ID'];
								$temp_id     = $this->install_inner_posts_cpt( $inner_post, [], $style );
								if ( $temp_id ) {
									$id_map[ $temp_old_id ] = $temp_id;
								}
							}
						}
						$id = $this->install_single_cpt( $cpt_data, $id_map, $style );
						if ( $id ) {
							$new_id_map            = [];
							$new_id_map[ $old_id ] = $id;
							$content               = $this->update_block_ids( $content, $new_id_map );
						}
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Install CPT.
	 *
	 * @param array  $cpt_data The cpt data.
	 * @param string $style The style.
	 * @return int The cpt id.
	 */
	public function install_inner_posts_cpt( $cpt_data, $id_map = [], $style = 'light' ) {
		$inner_id_map = [];
		if ( ! empty( $cpt_data['inner_posts'] ) && is_array( $cpt_data['inner_posts'] ) ) {
			foreach ( $cpt_data['inner_posts'] as $inner_post_key => $inner_post ) {
				$temp_old_id = $inner_post['ID'];
				$temp_id     = $this->install_inner_posts_cpt( $inner_post, [], $style );
				if ( $temp_id ) {
					$inner_id_map[ $temp_old_id ] = $temp_id;
				}
			}
		}
		return $this->install_single_cpt( $cpt_data, $inner_id_map, $style );
	}
	/**
	 * Install CPT.
	 *
	 * @param array  $cpt_data The cpt data.
	 * @param string $style The style.
	 * @return int The cpt id.
	 */
	public function install_single_cpt( $cpt_data, $id_map = [], $style = 'light' ) {
		// Check if the post already exists.
		$title       = ! empty( $style ) && 'light' !== $style ? $cpt_data['post_title'] . ' ' . ucfirst( $style ) : $cpt_data['post_title'];
		$post_exists = get_posts(
			[
				'post_type' => $cpt_data['post_type'],
				'title'     => $title,
			] 
		);
		if ( $post_exists ) {
			return $post_exists[0]->ID;
		}
		$temp_content = $cpt_data['post_content'];
		$new_post_id  = wp_insert_post(
			[
				'post_type'    => $cpt_data['post_type'],
				'post_title'   => $title,
				'post_content' => '',
				'post_status'  => current_user_can( 'publish_posts' ) ? 'publish' : 'pending',
			],
			true
		);

		if ( ! is_wp_error( $new_post_id ) ) {
			if ( ! empty( $cpt_data['meta'] ) ) {
				foreach ( $cpt_data['meta'] as $meta_key => $meta_values ) {
					foreach ( $meta_values as $meta_value ) {
						if ( ! empty( $style ) && 'light' !== $style ) {
							$meta_value = $this->cpt_switch_meta_color( $meta_value, $meta_key, $style );
						}
						add_post_meta( $new_post_id, $meta_key, $meta_value );
					}
				}
			}
			if ( ! empty( $id_map ) ) {
				$temp_content = $this->update_block_ids( $temp_content, $id_map );
			}
			if ( ! empty( $style ) && 'light' !== $style ) {
				$temp_content = $this->cpt_switch_color( $temp_content, $style );
			}
			wp_update_post(
				[
					'ID'           => $new_post_id,
					'post_content' => $temp_content,
				]
			);

			return $new_post_id;
		}
		return false;
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param string $content The content to search.
	 * @param string $style The style to search for.
	 * @return string The content with the style replaced.
	 */
	public function cpt_switch_meta_color( $meta_value, $meta_key, $style ) {
		$temp_meta_value = wp_json_encode( $meta_value );
		if ( $style === 'highlight' ) {
			$temp_meta_value = str_replace( 'palette1', 'placeholder-kb-pal9', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette2', 'placeholder-kb-pal8', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette3', 'placeholder-kb-pal9', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette4', 'placeholder-kb-pal9', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette5', 'placeholder-kb-pal8', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette6', 'placeholder-kb-pal7', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette7', 'placeholder-kb-pal2', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette8', 'placeholder-kb-pal2', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette9', 'placeholder-kb-pal1', $temp_meta_value );
		} else {
			$temp_meta_value = str_replace( 'palette3', 'placeholder-kb-pal9', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette4', 'placeholder-kb-pal8', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette5', 'placeholder-kb-pal7', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette6', 'placeholder-kb-pal7', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette7', 'placeholder-kb-pal3', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette8', 'placeholder-kb-pal3', $temp_meta_value );
			$temp_meta_value = str_replace( 'palette9', 'placeholder-kb-pal4', $temp_meta_value );
		}
		$temp_meta_value = str_replace( 'placeholder-kb-pal1', 'palette1', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal2', 'palette2', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal3', 'palette3', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal4', 'palette4', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal5', 'palette5', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal6', 'palette6', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal7', 'palette7', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal8', 'palette8', $temp_meta_value );
		$temp_meta_value = str_replace( 'placeholder-kb-pal9', 'palette9', $temp_meta_value );

		return json_decode( $temp_meta_value, true );
	}
	/**
	 * Retrieves a collection of objects.
	 */
	public function cpt_switch_color( $content, $style ) {
		$content = str_replace( 'Logo-ploaceholder.png', 'Logo-ploaceholder-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-1.png', 'Logo-ploaceholder-1-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-2.png', 'Logo-ploaceholder-2-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-3.png', 'Logo-ploaceholder-3-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-4.png', 'Logo-ploaceholder-4-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-5.png', 'Logo-ploaceholder-5-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-6.png', 'Logo-ploaceholder-6-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-7.png', 'Logo-ploaceholder-7-white.png', $content );
		$content = str_replace( 'Logo-ploaceholder-8.png', 'Logo-ploaceholder-8-white.png', $content );

		$content = str_replace( 'logo-placeholder.png', 'logo-placeholder-white.png', $content );
		$content = str_replace( 'logo-placeholder-1.png', 'logo-placeholder-1-white.png', $content );
		$content = str_replace( 'logo-placeholder-2.png', 'logo-placeholder-2-white.png', $content );
		$content = str_replace( 'logo-placeholder-3.png', 'logo-placeholder-3-white.png', $content );
		$content = str_replace( 'logo-placeholder-4.png', 'logo-placeholder-4-white.png', $content );
		$content = str_replace( 'logo-placeholder-5.png', 'logo-placeholder-5-white.png', $content );
		$content = str_replace( 'logo-placeholder-6.png', 'logo-placeholder-6-white.png', $content );
		$content = str_replace( 'logo-placeholder-7.png', 'logo-placeholder-7-white.png', $content );
		$content = str_replace( 'logo-placeholder-8.png', 'logo-placeholder-8-white.png', $content );
		$content = str_replace( 'logo-placeholder-9.png', 'logo-placeholder-9-white.png', $content );
		$content = str_replace( 'logo-placeholder-10.png', 'logo-placeholder-10-white.png', $content );
		
		if ( $style === 'highlight' ) {
			$form_content = $this->get_string_inbetween( $content, '"submit":[{', ']}', 'wp:kadence/form' );
			if ( $form_content ) {
				$form_content_org = $form_content;
				$form_content     = str_replace( '"color":""', '"color":"placeholder-kb-pal9"', $form_content );
				$form_content     = str_replace( '"background":""', '"background":"placeholder-kb-pal3"', $form_content );
				$form_content     = str_replace( '"colorHover":""', '"colorHover":"placeholder-kb-pal9"', $form_content );
				$form_content     = str_replace( '"backgroundHover":""', '"backgroundHover":"placeholder-kb-pal4"', $form_content );
				$content          = str_replace( $form_content_org, $form_content, $content );
			}
			$content = str_replace( '"inheritStyles":"inherit"', '"color":"placeholder-kb-pal9","background":"placeholder-kb-pal3","colorHover":"placeholder-kb-pal9","backgroundHover":"placeholder-kb-pal4","inheritStyles":"inherit"', $content );

			$content = str_replace( 'has-theme-palette-1', 'placeholder-kb-class9', $content );
			$content = str_replace( 'has-theme-palette-2', 'placeholder-kb-class8', $content );
			$content = str_replace( 'has-theme-palette-3', 'placeholder-kb-class9', $content );
			$content = str_replace( 'has-theme-palette-4', 'placeholder-kb-class9', $content );
			$content = str_replace( 'has-theme-palette-5', 'placeholder-kb-class8', $content );
			$content = str_replace( 'has-theme-palette-6', 'placeholder-kb-class7', $content );
			$content = str_replace( 'has-theme-palette-7', 'placeholder-kb-class2', $content );
			$content = str_replace( 'has-theme-palette-8', 'placeholder-kb-class2', $content );
			$content = str_replace( 'has-theme-palette-9', 'placeholder-kb-class1', $content );

			$content = str_replace( 'theme-palette1', 'placeholder-class-pal9', $content );
			$content = str_replace( 'theme-palette2', 'placeholder-class-pal8', $content );
			$content = str_replace( 'theme-palette3', 'placeholder-class-pal9', $content );
			$content = str_replace( 'theme-palette4', 'placeholder-class-pal9', $content );
			$content = str_replace( 'theme-palette5', 'placeholder-class-pal8', $content );
			$content = str_replace( 'theme-palette6', 'placeholder-class-pal7', $content );
			$content = str_replace( 'theme-palette7', 'placeholder-class-pal2', $content );
			$content = str_replace( 'theme-palette8', 'placeholder-class-pal2', $content );
			$content = str_replace( 'theme-palette9', 'placeholder-class-pal1', $content );

			$content = str_replace( 'palette1', 'placeholder-kb-pal9', $content );
			$content = str_replace( 'palette2', 'placeholder-kb-pal8', $content );
			$content = str_replace( 'palette3', 'placeholder-kb-pal9', $content );
			$content = str_replace( 'palette4', 'placeholder-kb-pal9', $content );
			$content = str_replace( 'palette5', 'placeholder-kb-pal8', $content );
			$content = str_replace( 'palette6', 'placeholder-kb-pal7', $content );
			$content = str_replace( 'palette7', 'placeholder-kb-pal2', $content );
			$content = str_replace( 'palette8', 'placeholder-kb-pal2', $content );
			$content = str_replace( 'palette9', 'placeholder-kb-pal1', $content );

		} else {
			$white_text_content = $this->get_string_inbetween_when( $content, '<!-- wp:kadence/column', 'kt-inside-inner-col', 'kb-pattern-light-color', 0 );
			if ( $white_text_content ) {
				$white_text_content_org = $white_text_content;
				$white_text_content     = str_replace( '"textColor":"palette9"', '"textColor":"placeholder-kb-pal9"', $white_text_content );
				$white_text_content     = str_replace( '"linkColor":"palette9"', '"linkColor":"placeholder-kb-pal9"', $white_text_content );
				$white_text_content     = str_replace( '"linkHoverColor":"palette9"', '"linkHoverColor":"placeholder-kb-pal9"', $white_text_content );
				$content                = str_replace( $white_text_content_org, $white_text_content, $content );
			}
			$content = str_replace( 'has-theme-palette-3', 'placeholder-kb-class9', $content );
			$content = str_replace( 'has-theme-palette-4', 'placeholder-kb-class8', $content );
			$content = str_replace( 'has-theme-palette-5', 'placeholder-kb-class7', $content );
			$content = str_replace( 'has-theme-palette-6', 'placeholder-kb-class7', $content );
			$content = str_replace( 'has-theme-palette-7', 'placeholder-kb-class3', $content );
			$content = str_replace( 'has-theme-palette-8', 'placeholder-kb-class3', $content );
			$content = str_replace( 'has-theme-palette-9', 'placeholder-kb-class4', $content );

			$content = str_replace( 'theme-palette3', 'placeholder-class-pal9', $content );
			$content = str_replace( 'theme-palette4', 'placeholder-class-pal8', $content );
			$content = str_replace( 'theme-palette5', 'placeholder-class-pal7', $content );
			$content = str_replace( 'theme-palette6', 'placeholder-class-pal7', $content );
			$content = str_replace( 'theme-palette7', 'placeholder-class-pal3', $content );
			$content = str_replace( 'theme-palette8', 'placeholder-class-pal3', $content );
			$content = str_replace( 'theme-palette9', 'placeholder-class-pal4', $content );

			$content = str_replace( 'palette3', 'placeholder-kb-pal9', $content );
			$content = str_replace( 'palette4', 'placeholder-kb-pal8', $content );
			$content = str_replace( 'palette5', 'placeholder-kb-pal7', $content );
			$content = str_replace( 'palette6', 'placeholder-kb-pal7', $content );
			$content = str_replace( 'palette7', 'placeholder-kb-pal3', $content );
			$content = str_replace( 'palette8', 'placeholder-kb-pal3', $content );
			$content = str_replace( 'palette9', 'placeholder-kb-pal4', $content );
		}
		$content = str_replace( 'placeholder-kb-class1', 'has-theme-palette-1', $content );
		$content = str_replace( 'placeholder-kb-class2', 'has-theme-palette-2', $content );
		$content = str_replace( 'placeholder-kb-class3', 'has-theme-palette-3', $content );
		$content = str_replace( 'placeholder-kb-class4', 'has-theme-palette-4', $content );
		$content = str_replace( 'placeholder-kb-class5', 'has-theme-palette-5', $content );
		$content = str_replace( 'placeholder-kb-class6', 'has-theme-palette-6', $content );
		$content = str_replace( 'placeholder-kb-class7', 'has-theme-palette-7', $content );
		$content = str_replace( 'placeholder-kb-class8', 'has-theme-palette-8', $content );
		$content = str_replace( 'placeholder-kb-class9', 'has-theme-palette-9', $content );

		$content = str_replace( 'placeholder-class-pal1', 'theme-palette1', $content );
		$content = str_replace( 'placeholder-class-pal2', 'theme-palette2', $content );
		$content = str_replace( 'placeholder-class-pal3', 'theme-palette3', $content );
		$content = str_replace( 'placeholder-class-pal4', 'theme-palette4', $content );
		$content = str_replace( 'placeholder-class-pal5', 'theme-palette5', $content );
		$content = str_replace( 'placeholder-class-pal6', 'theme-palette6', $content );
		$content = str_replace( 'placeholder-class-pal7', 'theme-palette7', $content );
		$content = str_replace( 'placeholder-class-pal8', 'theme-palette8', $content );
		$content = str_replace( 'placeholder-class-pal9', 'theme-palette9', $content );

		$content = str_replace( 'placeholder-kb-pal1', 'palette1', $content );
		$content = str_replace( 'placeholder-kb-pal2', 'palette2', $content );
		$content = str_replace( 'placeholder-kb-pal3', 'palette3', $content );
		$content = str_replace( 'placeholder-kb-pal4', 'palette4', $content );
		$content = str_replace( 'placeholder-kb-pal5', 'palette5', $content );
		$content = str_replace( 'placeholder-kb-pal6', 'palette6', $content );
		$content = str_replace( 'placeholder-kb-pal7', 'palette7', $content );
		$content = str_replace( 'placeholder-kb-pal8', 'palette8', $content );
		$content = str_replace( 'placeholder-kb-pal9', 'palette9', $content );
		return $content;
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param string $string The string to search.
	 * @param string $start The start of the string.
	 * @param string $end The end of the string.
	 * @param string $verify The string to verify.
	 * @return string The string in between the start and end.
	 */
	public function get_string_inbetween( $string, $start, $end, $verify ) {
		if ( strpos( $string, $verify ) == 0 ) {
			return '';
		}
		$ini = strpos( $string, $start );
		if ( $ini == 0 ) {
			return '';
		}
		$ini += strlen( $start );
		$len  = strpos( $string, $end, $ini ) - $ini;
		return substr( $string, $ini, $len );
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param string $string The string to search.
	 * @param string $start The start of the string.
	 * @param string $end The end of the string.
	 * @param string $verify The string to verify.
	 * @param int    $from The position to start searching from.
	 * @return string The string in between the start and end.
	 */
	public function get_string_inbetween_when( $string, $start, $end, $verify, $from ) {
		$ini = strpos( $string, $start, $from );
		if ( $ini == 0 ) {
			return '';
		}
		$ini       += strlen( $start );
		$len        = strpos( $string, $end, $ini ) - $ini;
		$sub_string = substr( $string, $ini, $len );
		if ( strpos( $sub_string, $verify ) == 0 ) {
			return $this->get_string_inbetween_when( $string, $start, $end, $verify, $ini );
		}
		return $sub_string;
	}
	/**
	 * Update block ID in content with new ID
	 */
	private function update_block_ids( $content, $id_map ) {
		$blocks = parse_blocks( $content );

		foreach ( $blocks as &$block ) {
			if ( in_array( $block['blockName'], $this->kadence_cpt_blocks )
				&& ! empty( $block['attrs']['id'] )
				&& isset( $id_map[ $block['attrs']['id'] ] ) ) {
				$block['attrs']['id'] = $id_map[ $block['attrs']['id'] ];
			}

			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_content         = serialize_blocks( $block['innerBlocks'] );
				$updated_inner_content = $this->update_block_ids( $inner_content, $id_map );
				$block['innerBlocks']  = parse_blocks( $updated_inner_content );
			}
		}

		return serialize_blocks( $blocks );
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function process_pattern( WP_REST_Request $request ) {
		$parameters = $request->get_json_params();
		if ( empty( $parameters['content'] ) ) {
			return rest_ensure_response( 'failed' );
		}
		$content       = $parameters['content'];
		$cpt_blocks    = $parameters['cpt_blocks'] ?? [];
		$style         = $parameters['style'] ?? '';
		$image_library = $parameters['image_library'];
		if ( ! empty( $cpt_blocks ) ) {
			$content = $this->process_cpt( $content, $cpt_blocks, $style );
		}
		// Find all urls.
		preg_match_all( '/https?:\/\/[^\'" ]+/i', $content, $match );
		// preg_match_all( '#\bhttps?://[^,\s()<>]+(?:\([\w\d]+\)|([^,[:punct:]\s]|/))#', $content, $match );
		$all_urls = array_unique( $match[0] );

		if ( empty( $all_urls ) ) {
			return $content;
		}
		$map_urls   = [];
		$image_urls = [];
		// Find all the images.
		foreach ( $all_urls as $key => $link ) {
			if ( $this->check_for_image( $link ) ) {
				// Avoid srcset images.
				if (
					false === strpos( $link, '-150x' ) &&
					false === strpos( $link, '-300x' )
				) {
					$image_urls[] = $link;
				}
			}
		}
		// Process images.
		if ( ! empty( $image_urls ) ) {
			foreach ( $image_urls as $key => $image_url ) {
				// Download remote image.
				$image = [
					'url' => $image_url,
					'id'  => 0,
				];
				// If it's a pexels image, get the data.
				if ( substr( $image_url, 0, strlen( 'https://images.pexels.com' ) ) === 'https://images.pexels.com' ) {
					$image_data = $this->get_image_info( $image_library, $image_url );
					if ( $image_data ) {
						$alt                       = ! empty( $image_data['alt'] ) ? $image_data['alt'] : '';
						$image['filename']         = ! empty( $image_data['filename'] ) ? $image_data['filename'] : $this->create_filename_from_alt( $alt );
						$image['photographer']     = ! empty( $image_data['photographer'] ) ? $image_data['photographer'] : '';
						$image['photographer_url'] = ! empty( $image_data['photographer_url'] ) ? $image_data['photographer_url'] : '';
						$image['photograph_url']   = ! empty( $image_data['url'] ) ? $image_data['url'] : '';
						$image['alt']              = $alt;
						$image['title']            = __( 'Photo by', 'kadence-blocks' ) . ' ' . $image['photographer'];
					}
				}
				$downloaded_image       = $this->import_image( $image );
				$map_urls[ $image_url ] = [
					'url' => $downloaded_image['url'],
					'id'  => $downloaded_image['id'],
				];
			}
		}
		// Regex to find wp:kadence/image blocks with id and src.
		$pattern = '/<!-- wp:kadence\/image\b[^>]*?(?:"id":(\d+)),.*?"uniqueID":"[^"]+".*?-->(.*?)<img src="([^"]+)".*?<!-- \/wp:kadence\/image -->/s';

		// Use preg_match_all to find all matches
		if ( preg_match_all( $pattern, $content, $block_matches, PREG_SET_ORDER ) ) {
			foreach ( $block_matches as $block_match ) {
				// $block_match[0] is the entire block
				// $block_match[1] is the id
				// $block_match[2] is the content before <img src
				// $block_match[3] is the src
				$old_id            = ( $block_match[1] ?? '' );
				$old_src           = ( $block_match[3] ?? '' );
				$block_replacement = ( $block_match[0] ?? '' );
				// Replace old id if it exists in the map
				if ( isset( $map_urls[ $old_src ]['id'] ) ) {
					$new_id            = $map_urls[ $old_src ]['id'];
					$block_replacement = preg_replace( '/"id":' . $old_id . '/', '"id":' . $new_id, $block_replacement );
					$block_replacement = str_replace( 'wp-image-' . strval( $old_id ), 'wp-image-' . strval( $new_id ), $block_replacement );
				}
				// Replace old src with new one if it exists in the map.
				if ( isset( $map_urls[ $old_src ]['url'] ) ) {
					$new_src           = $map_urls[ $old_src ]['url'];
					$block_replacement = str_replace( $old_src, $new_src, $block_replacement );
				}

				// Replace the old block with the new one.
				$content = str_replace( $block_match[0], $block_replacement, $content );
			}
		}
		// Replace the rest of images in content.
		foreach ( $map_urls as $old_url => $new_image ) {
			$content = str_replace( $old_url, $new_image['url'], $content );
			// Replace the slashed URLs if any exist.
			$old_url          = str_replace( '/', '/\\', $old_url );
			$new_image['url'] = str_replace( '/', '/\\', $new_image['url'] );
			$content          = str_replace( $old_url, $new_image['url'], $content );
		}
		return $content;
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_pattern_content( WP_REST_Request $request ) {
		$this->get_license_keys();
		$this->product_id = $request->get_param( self::PROP_API_PRODUCT );
		$library          = $request->get_param( self::PROP_LIBRARY );
		$library_url      = $request->get_param( self::PROP_LIBRARY_URL );
		$key              = $request->get_param( self::PROP_KEY );
		$pattern_type     = $request->get_param( self::PROP_PATTERN_TYPE );
		$pattern_id       = $request->get_param( self::PROP_PATTERN_ID );
		$pattern_style    = $request->get_param( self::PROP_PATTERN_STYLE );
		$extra            = '';

		if ( ! empty( $library_url ) ) {
			if ( 'page' === $pattern_type ) {
				$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/page/';
				$extra       = 'page-item';
			} else {
				$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/single/';
			}
		} else {
			$library_url = 'https://patterns.startertemplatecloud.com/wp-json/kadence-cloud/v1/single/';
		}

		if ( ! empty( $library ) ) {
			$args = [
				'type' => ( ! empty( $pattern_type ) ? $pattern_type : 'pattern' ),
				'key'  => $key,
				'site' => get_original_domain(),
			];
			if ( ! empty( $extra ) && 'page-item' === $extra ) {
				$args['page-item'] = $pattern_id;
			} else {
				$args['id'] = $pattern_id;
			}
			if ( ! empty( $pattern_style ) ) {
				$args['style'] = $pattern_style;
			}
			if ( 'templates' !== $library && 'pages' !== $library && 'template' !== $library ) {
				$args['data'] = 'true';
			}
			if ( 'templates' === $library || 'section' === $library || 'pages' === $library || 'template' === $library ) {
				$args['api_key'] = $this->api_key;
				if ( ! empty( $this->api_email ) ) {
					// Send in case we need to verify with old api.
					$args['email'] = $this->api_email;
				}
				if ( ! empty( $this->product_slug ) ) {
					$args['product'] = $this->product_slug;
				}
				if ( 'iThemes' === $this->api_email ) {
					$args['site_url'] = $args['site'];
				}
				if ( ! empty( $this->env ) ) {
					$args['env'] = $this->env;
				}
			}
			// Get the response.
			$api_url  = add_query_arg( $args, $library_url );
			$response = wp_safe_remote_get(
				$api_url,
				[
					'timeout' => 20,
				]
			);
			// Early exit if there was an error.
			if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
				$contents = wp_remote_retrieve_body( $response );
				if ( ! empty( $contents ) ) {
					$contents = json_decode( $contents, true );
				}
				if ( ! empty( $contents['code'] ) && $contents['code'] === 'invalid_access' ) {
					return rest_ensure_response( new WP_Error( 'invalid_access', __( 'Invalid Request, Incorrect Access Key', 'kadence-blocks' ), [ 'status' => 401 ] ) );
				}
				return rest_ensure_response( new WP_Error( 'invalid_access', __( 'Invalid Request, Connection Error', 'kadence-blocks' ), [ 'status' => 401 ] ) );
			}
			// Get the CSS from our response.
			$contents = wp_remote_retrieve_body( $response );
			// Early exit if there was an error.
			if ( is_wp_error( $contents ) ) {
				return rest_ensure_response( new WP_Error( 'invalid_content', __( 'Invalid Content, content body error', 'kadence-blocks' ), [ 'status' => 401 ] ) );
			}
			if ( ! $contents ) {
				return rest_ensure_response( new WP_Error( 'invalid_content', __( 'Invalid Content, Empty Content', 'kadence-blocks' ), [ 'status' => 401 ] ) );
			} else {
				return rest_ensure_response( $contents );
			}
		}

		return rest_ensure_response( 'error' );
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_connection( WP_REST_Request $request ) {
		$library     = $request->get_param( self::PROP_LIBRARY );
		$library_url = $request->get_param( self::PROP_LIBRARY_URL );
		$key         = $request->get_param( self::PROP_KEY );
		if ( empty( $library_url ) || empty( $key ) ) {
			return rest_ensure_response( new WP_Error( 'invalid_request', __( 'Invalid Request, Incorrect Access Key', 'kadence-blocks' ), [ 'status' => 401 ] ) );
		}
		$url = empty( $library_url ) ? '' : rtrim( sanitize_text_field( $library_url ), '/' ) . '/wp-json/kadence-cloud/v1/info/';
		// Do you have the data?
		$site_url = get_original_domain();
		$args     = [
			'key'  => $key,
			'site' => $site_url,
		];
		// Get the response.
		$api_url  = add_query_arg( $args, $url );
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 20,
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			// Return the error.
			return rest_ensure_response( new WP_Error( 'invalid_request', __( 'Invalid Response', 'kadence-blocks' ), [ 'status' => 401 ] ) );
		}
		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );

		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return rest_ensure_response( new WP_Error( 'invalid_request', __( 'Invalid Response Content', 'kadence-blocks' ), [ 'status' => 401 ] ) );
		}
		$contents = json_decode( $contents, true );
		if ( isset( $contents['error'] ) && $contents['error'] ) {
			return rest_ensure_response( new WP_Error( 'invalid_request', __( 'Invalid Response Content: Error', 'kadence-blocks' ), [ 'status' => 401 ] ) );
		} else {
			if ( ! is_array( $contents ) ) {
				return rest_ensure_response( new WP_Error( 'invalid_request', __( 'Invalid Response Content: Missing Data', 'kadence-blocks' ), [ 'status' => 401 ] ) );
			}
			$final_data            = [];
			$final_data['name']    = ! empty( $contents['name'] ) ? sanitize_text_field( $contents['name'] ) : '';
			$final_data['slug']    = ! empty( $contents['slug'] ) ? sanitize_text_field( $contents['slug'] ) : '';
			$final_data['refresh'] = ! empty( $contents['refresh'] ) ? sanitize_text_field( $contents['refresh'] ) : '';
			$final_data['expires'] = ! empty( $contents['expires'] ) ? sanitize_text_field( $contents['expires'] ) : '';
			$final_data['pages']   = ! empty( $contents['pages'] ) ? sanitize_text_field( $contents['pages'] ) : '';
			return rest_ensure_response( $final_data );
		}
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_library_categories( WP_REST_Request $request ) {
		$this->get_license_keys();
		$reload      = $request->get_param( self::PROP_FORCE_RELOAD );
		$library     = $request->get_param( self::PROP_LIBRARY );
		$library_url = $request->get_param( self::PROP_LIBRARY_URL );
		$key         = $request->get_param( self::PROP_KEY );
		$meta        = $request->get_param( self::PROP_META );

		if ( ! empty( $library_url ) ) {
			if ( ! empty( $meta ) && 'pages' === $meta ) {
				$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/page-categories/';
			} else {
				$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/categories/';
			}
		} elseif ( ! empty( $library ) && 'pages' === $library ) {
			$library_url = $this->remote_pages_cat_url;
			$key         = 'new-pages';
		} else {
			$library_url = $this->remote_cat_url;
		}

		$identifier = 'library-categories' . $library;

		if ( ! empty( $this->api_key ) ) {
			$identifier .= '_' . $this->api_key;
		}

		if ( ! empty( $key ) ) {
			$identifier .= '_' . $key;
		}

		if ( 'templates' !== $library && 'pages' !== $library && 'section' !== $library && 'template' !== $library ) {
			$cloud_settings = json_decode( get_option( 'kadence_blocks_cloud' ), true );
			if ( ! empty( $cloud_settings['connections'][ $library ]['expires'] ) ) {
				$expires = strtotime( get_date_from_gmt( $cloud_settings['connections'][ $library ]['expires'] ) );
				$now     = strtotime( get_date_from_gmt( current_time( 'Y-m-d H:i:s' ) ) );

				if ( $expires < $now ) {
					$refresh = ( ! empty( $cloud_settings['connections'][ $library ]['refresh'] ) ? $cloud_settings['connections'][ $library ]['refresh'] : 'month' );
					if ( 'day' === $refresh ) {
						$expires_add = DAY_IN_SECONDS;
					} elseif ( 'week' === $refresh ) {
						$expires_add = WEEK_IN_SECONDS;
					} else {
						$expires_add = MONTH_IN_SECONDS;
					}
					$cloud_settings['connections'][ $library ]['expires'] = gmdate( 'Y-m-d H:i:s', strtotime( current_time( 'mysql' ) ) + $expires_add );
					update_option( 'kadence_blocks_cloud', json_encode( $cloud_settings ) );
					$reload = true;
				}
			}
		}

		// Check if we have a local file.
		if ( ! $reload ) {
			try {
				return rest_ensure_response( $this->block_library_cache->get( $identifier ) );
			} catch ( NotFoundException $e ) {
			}
		}

		// Access via remote.
		$response = $this->get_remote_library_categories( $library, $library_url, $key );

		if ( 'error' === $response ) {
			return rest_ensure_response( 'error' );
		}

		$this->block_library_cache->cache( $identifier, $response );

		return rest_ensure_response( $response );
	}
	/**
	 * Get the section data if available locally.
	 */
	public function get_local_library_data( $type = '' ) {
		$this->get_license_keys();
		$reload      = false;
		$library     = 'section';
		$library_url = $this->remote_url;
		$key         = 'section';

		$identifier = 'library' . $library;
		if ( 'section' === $library ) {
			$identifier .= '_' . KADENCE_BLOCKS_VERSION;
		}
		if ( ! empty( $type ) ) {
			$identifier .= '_' . $type;
		}
		if ( ! empty( $this->api_key ) ) {
			$identifier .= '_' . $this->api_key;
		}

		if ( ! empty( $key ) ) {
			$identifier .= '_' . $key;
		}

		try {
			return $this->block_library_cache->get( $identifier );
		} catch ( NotFoundException $e ) {
		}
		return [];
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response Response object on success, or WP_Error object on failure.
	 */
	public function get_library( WP_REST_Request $request ) {
		$this->get_license_keys();
		$reload      = $request->get_param( self::PROP_FORCE_RELOAD );
		$library     = $request->get_param( self::PROP_LIBRARY );
		$library_url = $request->get_param( self::PROP_LIBRARY_URL );
		$key         = $request->get_param( self::PROP_KEY );
		$meta        = $request->get_param( self::PROP_META );

		if ( ! empty( $library_url ) ) {
			if ( ! empty( $meta ) && 'pages' === $meta ) {
				$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/pages/';
			} else {
				$library_url = rtrim( $library_url, '/' ) . '/wp-json/kadence-cloud/v1/get/';
			}
		} elseif ( ! empty( $library ) && 'pages' === $library ) {
			$library_url = $this->remote_pages_url;
			$key         = 'new-pages';
		} else {
			$library_url = $this->remote_url;
		}

		$identifier = 'library' . $library;
		if ( 'section' === $library ) {
			$identifier .= '_' . KADENCE_BLOCKS_VERSION;
		}
		if ( ! empty( $meta ) ) {
			$identifier .= '_' . $meta;
		}
		if ( ! empty( $this->api_key ) ) {
			$identifier .= '_' . $this->api_key;
		}

		if ( ! empty( $key ) ) {
			$identifier .= '_' . $key;
		}

		if ( 'templates' !== $library && 'pages' !== $library && 'section' !== $library && 'template' !== $library ) {
			$cloud_settings = json_decode( get_option( 'kadence_blocks_cloud' ), true );
			if ( ! empty( $cloud_settings['connections'][ $library ]['expires'] ) ) {
				$expires = strtotime( get_date_from_gmt( $cloud_settings['connections'][ $library ]['expires'] ) );
				$now     = strtotime( get_date_from_gmt( current_time( 'Y-m-d H:i:s' ) ) );

				if ( $expires < $now ) {
					$refresh = ( ! empty( $cloud_settings['connections'][ $library ]['refresh'] ) ? $cloud_settings['connections'][ $library ]['refresh'] : 'month' );
					if ( 'day' === $refresh ) {
						$expires_add = DAY_IN_SECONDS;
					} elseif ( 'week' === $refresh ) {
						$expires_add = WEEK_IN_SECONDS;
					} else {
						$expires_add = MONTH_IN_SECONDS;
					}
					$cloud_settings['connections'][ $library ]['expires'] = gmdate( 'Y-m-d H:i:s', strtotime( current_time( 'mysql' ) ) + $expires_add );
					update_option( 'kadence_blocks_cloud', json_encode( $cloud_settings ) );
					$reload = true;
				}
			}
		}

		// Check if we have a local file.
		if ( ! $reload ) {
			try {
				return rest_ensure_response( $this->block_library_cache->get( $identifier ) );
			} catch ( NotFoundException $e ) {
			}
		}

		if ( 'custom' === $library ) {
			wp_json_encode( apply_filters( 'kadence_block_library_custom_array', [] ) );
		}
		// Access via remote.
		$response = $this->get_remote_library_contents( $library, $library_url, $key, $meta );

		if ( is_wp_error( $response ) ) {
			return rest_ensure_response( $response );
		}

		$this->block_library_cache->cache( $identifier, $response );

		return rest_ensure_response( $response );
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_local_contexts( WP_REST_Request $request ) {
		$available_prompts = get_option( 'kb_design_library_prompts', [] );
		if ( ! empty( $available_prompts && is_array( $available_prompts ) ) ) {
			$contexts_available = [];
			foreach ( $available_prompts as $key => $prompt ) {
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
	 * Retrieves all the currently available AI content.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_all_items( WP_REST_Request $request ) {
		$available_prompts = get_option( 'kb_design_library_prompts', [] );
		$return_data       = [];

		if ( ! empty( $available_prompts ) && is_array( $available_prompts ) ) {
			foreach ( $available_prompts as $context => $prompt ) {
				// Check local cache.
				try {
					$return_data[ $context ] = json_decode( $this->ai_cache->get( $prompt ), true );
				} catch ( NotFoundException $e ) {
					// Check if we have a remote file.
					$response = $this->get_remote_contents( $prompt );
					$body     = wp_remote_retrieve_body( $response );

					// TODO: Should verify later that we shouldn't actually wait for jobs to complete.
					if ( $this->is_response_code_error( $response ) ) {
						continue;
					}

					$this->ai_cache->cache( $prompt, $body );

					$return_data[ $context ] = json_decode( $body, true );
				}
			}
		}

		return rest_ensure_response( $return_data ?: 'empty' );
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$context           = $request->get_param( self::PROP_CONTEXT );
		$reload            = $request->get_param( self::PROP_FORCE_RELOAD );
		$available_prompts = get_option( 'kb_design_library_prompts', [] );
		// Check if we have captured prompt.
		if ( ! empty( $available_prompts[ $context ] ) && ! $reload ) {

			// Check if we have a local file.
			try {
				return rest_ensure_response( $this->ai_cache->get( $available_prompts[ $context ] ) );
			} catch ( NotFoundException $e ) {
			}

			// Log event for context generation request.
			do_action(
				'kadenceblocks/ai/event',
				'Context Generation Requested',
				[
					'context_name'    => $context,
					'is_regeneration' => true,
				] 
			);

			// Check if we have a remote file.
			$response = $this->get_remote_contents( $available_prompts[ $context ] );
			$body     = wp_remote_retrieve_body( $response );
			if ( is_wp_error( $response ) ) {
				$current_prompts = get_option( 'kb_design_library_prompts', [] );
				if ( isset( $current_prompts[ $context ] ) ) {
					unset( $current_prompts[ $context ] );
					update_option( 'kb_design_library_prompts', $current_prompts );
				}
				// Log event for failed context generation.
				do_action(
					'kadenceblocks/ai/event',
					'Context Generation Failed',
					[
						'context_name'    => $context,
						'is_regeneration' => true,
						'errors'          => $response->get_error_messages(),
					] 
				);

				return rest_ensure_response( 'error' );
			}

			// Server returned an error response code.
			if ( $this->is_response_code_error( $response ) ) {
				// The remote job hasn't started, is still processing or is retrying.
				if ( $this->is_ai_job_processing( $response ) ) {
					return rest_ensure_response( 'processing' );
				}

				// The remote job failed.
				$current_prompts = get_option( 'kb_design_library_prompts', [] );

				if ( isset( $current_prompts[ $context ] ) ) {
					unset( $current_prompts[ $context ] );
					update_option( 'kb_design_library_prompts', $current_prompts );
				}

				// Note: This event is logged on an external server.
				return rest_ensure_response( 'error' );
			}
			if ( empty( $body ) ) {
				return rest_ensure_response( 'error' );
			}
			if ( 'error' === $body ) {
				return rest_ensure_response( 'error' );
			}
			// Cache the AI content.
			$this->ai_cache->cache( $available_prompts[ $context ], $body );

			// Log event for successful context generation.
			do_action(
				'kadenceblocks/ai/event',
				'Context Generation Completed',
				[
					'context_name'    => $context,
					'credits_after'   => $this->get_remote_remaining_credits(),
					'is_regeneration' => true,
				] 
			);

			return rest_ensure_response( $body );
		} else {
			// Create a job.
			$response = $this->get_new_remote_contents( $context );
			$data     = json_decode( $response, true );
			if ( $response === 'error' || $response === 'credits' ) {
				return rest_ensure_response( $response );
			} elseif ( isset( $data['data']['job_id'] ) ) {
				$current_prompts             = get_option( 'kb_design_library_prompts', [] );
				$current_prompts[ $context ] = $data['data']['job_id'];
				update_option( 'kb_design_library_prompts', $current_prompts );

				return rest_ensure_response( 'processing' );
			}

			return rest_ensure_response( 'error' );
		}
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_initial_jobs( WP_REST_Request $request ) {
		update_option( 'kb_design_library_prompts', [] );
		$contexts           = $this->initial_contexts;
		$available_prompts  = [];
		$contexts_available = [];
		$has_error          = false;
		foreach ( $contexts as $context ) {
			// Check if we have captured prompt.
			if ( empty( $available_prompts[ $context ] ) ) {
				// Create a job.
				$response = $this->get_new_remote_contents( $context );
				$data     = json_decode( $response, true );
				if ( $response === 'error' ) {
					$has_error = true;
				} elseif ( isset( $data['data']['job_id'] ) ) {
					$available_prompts[ $context ] = $data['data']['job_id'];
					$contexts_available[]          = $context;
				} else {
					$has_error = true;
				}
			}
		}
		update_option( 'kb_design_library_prompts', $available_prompts );
		if ( ! empty( $contexts_available ) && ! $has_error ) {
			return rest_ensure_response( $contexts_available );
		} elseif ( ! empty( $contexts_available ) && $has_error ) {
			return rest_ensure_response( 'error' );
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
	public function get_remaining_jobs( WP_REST_Request $request ) {
		$reload = $request->get_param( self::PROP_FORCE_RELOAD );
		$this->get_license_keys();
		$available_prompts  = get_option( 'kb_design_library_prompts', [] );
		$contexts           = [
			'about',
			'achievements',
			'blog',
			'call-to-action',
			'careers',
			'contact-form',
			'donate',
			'events',
			'faq',
			'get-started',
			'history',
			'industries',
			'location',
			'mission',
			'news',
			'partners',
			// 'podcast',
			'pricing-table',
			// 'product-details',
			'products-services',
			'profile',
			'subscribe-form',
			'support',
			'team',
			'testimonials',
			'value-prop',
			'volunteer',
			'welcome',
			'work',
		];
		$contexts_available = [];
		$has_error          = false;
		foreach ( $contexts as $context ) {
			// Check if we have captured prompt.
			if ( empty( $available_prompts[ $context ] ) || $reload ) {
				// Create a job.
				$response = $this->get_new_remote_contents( $context );
				$data     = json_decode( $response, true );
				if ( $response === 'error' ) {
					$has_error = true;
				} elseif ( isset( $data['data']['job_id'] ) ) {
					$available_prompts[ $context ] = $data['data']['job_id'];
					$contexts_available[]          = $context;
				} else {
					$has_error = true;
				}
			}
		}
		update_option( 'kb_design_library_prompts', $available_prompts );
		if ( ! empty( $contexts_available && ! $has_error ) ) {
			return rest_ensure_response( $contexts_available );
		} elseif ( ! empty( $contexts_available && $has_error ) ) {
			return rest_ensure_response(
				[
					'context' => $contexts_available,
					'error'   => true,
				] 
			);
		} else {
			return rest_ensure_response( 'failed' );
		}
	}
	/**
	 * Converts a string into a slug.
	 *
	 * @param string $str The prompt data.
	 *
	 * @return string of the slug.
	 */
	public function sanitize_industry_name( $str ) {
		if ( empty( $str ) ) {
			return 'other';
		}
		$str = strtolower( $str ); // converts all uppercase letters to lowercase.
		$str = str_replace( '&', 'and', $str ); // replaces all '&' with 'and'.
		$str = str_replace( ' ', '-', $str ); // replaces all spaces with '-'.

		return $str;
	}

	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_new_remote_contents( $context ) {
		$prophecy_data = json_decode( get_option( 'kadence_blocks_prophecy' ), true );
		// Get the response.
		$body            = [
			'context' => 'kadence',
		];
		$body['company'] = ! empty( $prophecy_data['companyName'] ) ? $prophecy_data['companyName'] : '';
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
		$body['mission']  = ! empty( $prophecy_data['missionStatement'] ) ? $prophecy_data['missionStatement'] : '';
		$body['tone']     = ! empty( $prophecy_data['tone'] ) ? $prophecy_data['tone'] : '';
		$body['keywords'] = ! empty( $prophecy_data['keywords'] ) ? $prophecy_data['keywords'] : '';
		$body['lang']     = ! empty( $prophecy_data['lang'] ) ? $prophecy_data['lang'] : '';
		switch ( $context ) {
			case 'about':
				$body['prompts'] = [
					'about',
					'about-hero',
					'about-columns',
					'about-list',
					'about-videos',
				];
				break;
			case 'achievements':
				$body['prompts'] = [
					'achievements',
					'achievements-columns',
					'achievements-list',
					'achievements-videos',
				];
				break;
			case 'blog':
				$body['prompts'] = [
					'blog-post-loop',
					'blog-table-contents',
				];
				break;
			case 'call-to-action':
				$body['prompts'] = [
					'call-to-action',
					'call-to-action-columns',
					'call-to-action-list',
					'call-to-action-videos',
				];
				break;
			case 'careers':
				$body['prompts'] = [
					'careers',
					'careers-hero',
					'careers-columns',
					'careers-list',
					'careers-videos',
				];
				break;
			case 'contact-form':
				$body['prompts'] = [
					'contact-form',
				];
				break;
			case 'donate':
				$body['prompts'] = [
					'donate',
					'donate-hero',
					'donate-columns',
					'donate-list',
					'donate-videos',
				];
				break;
			case 'events':
				$body['prompts'] = [
					'events',
					'events-hero',
					'events-columns',
					'events-list',
					'events-videos',
				];
				break;
			case 'faq':
				$body['prompts'] = [
					'faq-accordion',
				];
				break;
			case 'get-started':
				$body['prompts'] = [
					'get-started',
					'get-started-accordion',
					'get-started-columns',
					'get-started-list',
				];
				break;
			case 'history':
				$body['prompts'] = [
					'history',
					'history-columns',
					'history-list',
					'history-videos',
				];
				break;
			case 'industries':
				$body['prompts'] = [
					'industries',
					'industries-accordion',
					'industries-list',
					'industries-columns',
					'industries-tabs',
				];
				break;
			case 'location':
				$body['prompts'] = [
					'location',
					'location-columns',
					'location-tabs',
				];
				break;
			case 'mission':
				$body['prompts'] = [
					'mission',
					'mission-columns',
					'mission-list',
					'mission-videos',
				];
				break;
			case 'news':
				$body['prompts'] = [
					'news-post-loop',
				];
				break;
			case 'partners':
				$body['prompts'] = [
					'partners',
					'partners-columns',
					'partners-list',
				];
				break;
			case 'podcast':
				$body['prompts'] = [
					'podcast',
				];
				break;
			case 'pricing-table':
				$body['prompts'] = [
					'pricing-pricing-table',
				];
				break;
			case 'product-details':
				$body['prompts'] = [
					'product-details-accordion',
				];
				break;
			case 'products-services':
				$body['prompts'] = [
					'products-services',
					'products-services-columns',
					'products-services-hero',
					'products-services-list',
					'products-services-single',
					'products-services-tabs',
					'products-services-videos',
					'product-details-accordion',
				];
				break;
			case 'profile':
				$body['prompts'] = [
					'profile',
					'profile-columns',
					'profile-list',
					'profile-videos',
				];
				break;
			case 'subscribe-form':
				$body['prompts'] = [
					'subscribe-form',
				];
				break;
			case 'support':
				$body['prompts'] = [
					'support',
					'support-columns',
					'support-list',
					'support-videos',
				];
				break;
			case 'team':
				$body['prompts'] = [
					'team',
					'team-columns',
					'team-list',
					'team-people',
					'team-videos',
				];
				break;
			case 'testimonials':
				$body['prompts'] = [
					'testimonials-testimonials',
				];
				break;
			case 'value-prop':
				$body['prompts'] = [
					'value-prop',
					'value-prop-columns',
					'value-prop-hero',
					'value-prop-list',
					'value-prop-tabs',
					'value-prop-videos',
				];
				break;
			case 'volunteer':
				$body['prompts'] = [
					'volunteer',
					'volunteer-hero',
					'volunteer-list',
					'volunteer-columns',
					'volunteer-videos',
				];
				break;
			case 'welcome':
				$body['prompts'] = [
					'welcome',
					'welcome-hero',
					'welcome-list',
					'welcome-columns',
					'welcome-videos',
				];
				break;
			case 'work':
				$body['prompts'] = [
					'work',
					'work-columns',
					'work-counter-stats',
					'work-list',
					'work-videos',
				];
				break;
		}
		$response = wp_remote_post(
			$this->remote_ai_url . 'content/create',
			[
				'timeout' => 20,
				'headers' => [
					'X-Prophecy-Token' => $this->get_token_header(),
					'Content-Type'     => 'application/json',
				],
				'body'    => json_encode( $body ),
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
			$contents = wp_remote_retrieve_body( $response );
			if ( ! empty( $contents ) && is_string( $contents ) && json_decode( $contents, true ) ) {
				$error_message = json_decode( $contents, true );
				if ( ! empty( $error_message['detail'] ) && 'Failed, unable to use credits.' === $error_message['detail'] ) {
					return 'credits';
				}
			}
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
	 * Check if a response code is an error.
	 *
	 * @param array $response
	 *
	 * @return bool
	 */
	public function is_response_code_error( $response ) {
		$response_code = (int) wp_remote_retrieve_response_code( $response );

		return $response_code >= 400;
	}

	/**
	 * Checks if an AI job is complete and returns the AI JSON content.
	 *
	 * @note If the remote job is still processing or retrying, you'll receive a 409 (Conflict) HTTP status code.
	 *
	 * @param int $job The job ID.
	 *
	 * @return \WP_Error|array{headers: array, body: string, response: array{code: int, message: string}, cookies: \WP_HTTP_Cookie[]} Return the job response.
	 */
	public function get_remote_contents( $job ) {
		$api_url = $this->remote_ai_url . 'content/job/' . $job;

		return wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 20,
				'headers' => [
					'X-Prophecy-Token' => $this->get_token_header(),
				],
			]
		);
	}

	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_library_contents( $library, $library_url, $key, $meta ) {
		$site_url = get_original_domain();
		$args     = [
			'key'  => $key,
			'site' => $site_url,
		];
		if ( 'templates' === $library || 'section' === $library || 'pages' === $library || 'template' === $library ) {
			$args['api_email']  = $this->api_email;
			$args['api_key']    = $this->api_key;
			$args['product_id'] = $this->product_id;
			if ( ! empty( $this->env ) ) {
				$args['env'] = $this->env;
			}
			if ( 'iThemes' === $this->api_email ) {
				$args['site_url'] = $site_url;
			}
		}
		if ( 'templates' === $library ) {
			$args['request'] = 'blocks';
		}
		if ( ! empty( $meta ) ) {
			$args['meta'] = $meta;
		}
		// Get the response.
		$api_url  = add_query_arg( $args, $library_url );
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 30,
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		if ( $this->is_response_code_error( $response ) ) {
			$response_code = wp_remote_retrieve_response_code( $response );
			return new WP_Error( 'error', sprintf( esc_html__( 'Response Code Error: %s', 'kadence-blocks' ), $response_code ), [ 'status' => 400 ] );
		}

		// Get the CSS from our response.
		$contents = wp_remote_retrieve_body( $response );
		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return $contents;
		}

		return $contents;
	}

	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_library_categories( $library, $library_url, $key ) {
		$site_url = get_original_domain();
		$args     = [
			'key'  => $key,
			'site' => $site_url,
		];
		if ( 'templates' === $library || 'section' === $library || 'pages' === $library || 'template' === $library ) {
			$args['api_email']  = $this->api_email;
			$args['api_key']    = $this->api_key;
			$args['product_id'] = $this->product_id;
			if ( ! empty( $this->env ) ) {
				$args['env'] = $this->env;
			}
			if ( 'iThemes' === $this->api_email ) {
				$args['site_url'] = $site_url;
			}
		}
		if ( 'templates' === $library ) {
			$args['request'] = 'blocks';
		}
		// Get the response.
		$api_url  = add_query_arg( $args, $library_url );
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 30,
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
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
	public function get_remote_search_images( $search_query, $image_type = 'JPEG', $sizes = [] ) {
		if ( empty( $search_query ) ) {
			return 'error';
		}
		if ( empty( $sizes ) ) {
			$sizes = [
				[
					'id'     => '2048x2048',
					'width'  => 2048,
					'height' => 2048,
					'crop'   => false,
				],
			];
		}
		if ( empty( $image_type ) ) {
			$image_type = 'JPEG';
		}
		$body     = [
			'query'      => $search_query,
			'image_type' => $image_type,
			'sizes'      => $sizes,
			'page'       => 1,
			'per_page'   => 24,
		];
		$response = wp_remote_post(
			$this->remote_ai_url . 'images/search',
			[
				'timeout' => 20,
				'headers' => [
					'X-Prophecy-Token' => $this->get_token_header(),
					'Content-Type'     => 'application/json',
				],
				'body'    => json_encode( $body ),
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
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
	 * Get the Pexels industry image JSON definitions.
	 *
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_industry_images( $industries, $image_type = 'JPEG', $sizes = [] ) {
		if ( empty( $industries ) ) {
			return 'error';
		}

		if ( empty( $sizes ) ) {
			$sizes = [
				[
					'id'     => '2048x2048',
					'width'  => 2048,
					'height' => 2048,
					'crop'   => false,
				],
			];
		}

		if ( empty( $image_type ) ) {
			$image_type = 'JPEG';
		}

		$body = [
			'industries' => $industries,
			'image_type' => $image_type,
			'sizes'      => $sizes,
		];

		$response = wp_remote_post(
			$this->remote_ai_url . 'images/collections',
			[
				'timeout' => 20,
				'headers' => [
					'X-Prophecy-Token' => $this->get_token_header(),
					'Content-Type'     => 'application/json',
				],
				'body'    => json_encode( $body ),
			]
		);

		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
			return 'error';
		}

		// Get the image JSON from our response.
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
	public function get_remote_remaining_credits() {
		$product_slug = ( ! empty( $this->product_slug ) && $this->product_slug === 'kadence-blocks-pro' ? 'kadence-blocks-pro' : 'kadence-blocks' );
		$args         = [
			'site'        => get_license_domain(),
			'key'         => $this->api_key,
			'plugin_slug' => apply_filters( 'kadence-blocks-auth-slug', $product_slug ),
		];
		if ( ! empty( $this->api_email ) ) {
			// Send in case we need to verify with old api.
			$args['email'] = $this->api_email;
		}
		if ( ! empty( $this->env ) ) {
			$args['env'] = $this->env;
		}
		$api_url  = add_query_arg( $args, $this->remote_credits_url . 'get-remaining' );
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 20,
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
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
		$api_url  = $this->remote_ai_url . 'images/collections';
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 20,
				'headers' => [
					'X-Prophecy-Token' => $this->get_token_header(),
				],
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
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
	 * Get image search query.
	 *
	 * @access public
	 * @return WP_REST_Response Returns the remote URL contents.
	 */
	public function get_image_search_query( $request ) {
		$parameters = $request->get_json_params();
		if ( empty( $parameters['name'] ) || empty( $parameters['entity_type'] ) || empty( $parameters['industry'] ) || empty( $parameters['location'] ) || empty( $parameters['description'] ) ) {
			return new WP_REST_Response( [ 'error' => 'Missing parameters' ], 400 );
		}
		$api_url  = $this->remote_ai_url . 'proxy/intake/search-query';
		$body     = [
			'name'        => $parameters['name'],
			'entity_type' => $parameters['entity_type'],
			'industry'    => $parameters['industry'],
			'location'    => $parameters['location'],
			'description' => $parameters['description'],
		];
		$response = wp_remote_post(
			$api_url,
			[
				'timeout' => 20,
				'headers' => [
					'X-Prophecy-Token' => $this->get_token_header(),
					'Content-Type'     => 'application/json',
				],
				'body'    => json_encode( $body ),
			]
		);
		$contents = wp_remote_retrieve_body( $response );
		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return rest_ensure_response( 'error' );
		}

		return rest_ensure_response( $contents );
	}
	/**
	 * Get keyword suggestions.
	 *
	 * @access public
	 * @return WP_REST_Response Returns the remote URL contents.
	 */
	public function get_keyword_suggestions( WP_REST_Request $request ) {
		$parameters = $request->get_json_params();
		if ( empty( $parameters['name'] ) || empty( $parameters['entity_type'] ) || empty( $parameters['industry'] ) || empty( $parameters['location'] ) || empty( $parameters['description'] ) ) {
			return new WP_REST_Response( [ 'error' => 'Missing parameters' ], 400 );
		}
		$api_url  = $this->remote_ai_url . 'proxy/intake/suggest-keywords';
		$body     = [
			'name'        => $parameters['name'],
			'entity_type' => $parameters['entity_type'],
			'industry'    => $parameters['industry'],
			'location'    => $parameters['location'],
			'description' => $parameters['description'],
			'lang'        => ! empty( $parameters['lang'] ) ? $parameters['lang'] : '',
			'count'       => $parameters['count'],
		];
		$response = wp_remote_post(
			$api_url,
			[
				'timeout' => 20,
				'headers' => [
					'X-Prophecy-Token' => $this->get_token_header(),
					'Content-Type'     => 'application/json',
				],
				'body'    => json_encode( $body ),
			]
		);

		$contents = wp_remote_retrieve_body( $response );
		// Early exit if there was an error.
		if ( is_wp_error( $contents ) ) {
			return rest_ensure_response( 'error' );
		}

		return rest_ensure_response( $contents );
	}
	/**
	 * Get remote file contents.
	 *
	 * @access public
	 * @return string Returns the remote URL contents.
	 */
	public function get_remote_industry_verticals() {
		$api_url  = $this->remote_ai_url . 'verticals';
		$response = wp_safe_remote_get(
			$api_url,
			[
				'timeout' => 20,
			]
		);
		// Early exit if there was an error.
		if ( is_wp_error( $response ) || $this->is_response_code_error( $response ) ) {
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
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params[ self::PROP_CONTEXT ]     = [
			'description'       => __( 'The requested ai context.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_LIBRARY ]     = [
			'description'       => __( 'The requested library.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_LIBRARY_URL ] = [
			'description'       => __( 'The requested library URL.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];

		$query_params[ self::PROP_FORCE_RELOAD ]  = [
			'description' => __( 'Force a refresh of the context.', 'kadence-blocks' ),
			'type'        => 'boolean',
			'default'     => false,
		];
		$query_params[ self::PROP_KEY ]           = [
			'description'       => __( 'Library Key.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_API_KEY ]       = [
			'description'       => __( 'Kadence License Key.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_API_EMAIL ]     = [
			'description'       => __( 'Kadence License Email.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_API_PRODUCT ]   = [
			'description'       => __( 'Kadence License Product ID.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_PATTERN_TYPE ]  = [
			'description'       => __( 'Pattern Type', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_PATTERN_STYLE ] = [
			'description'       => __( 'Pattern Style', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_PATTERN_ID ]    = [
			'description'       => __( 'Pattern ID', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_INDUSTRY ]      = [
			'description'       => __( 'The selected Industry', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_IMAGE_TYPE ]    = [
			'description'       => __( 'The Image type to return', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		$query_params[ self::PROP_INDUSTRIES ]    = [
			'description'       => __( 'The industries to return', 'kadence-blocks' ),
			'type'              => 'array',
			'sanitize_callback' => [ $this, 'sanitize_industries_array' ],
		];
		$query_params[ self::PROP_IMAGE_SIZES ]   = [
			'description'       => __( 'The Image type to return', 'kadence-blocks' ),
			'type'              => 'array',
			'sanitize_callback' => [ $this, 'sanitize_image_sizes_array' ],
		];
		$query_params[ self::PROP_META ]          = [
			'description'       => __( 'The meta to return', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		];
		return $query_params;
	}
	/**
	 * Sanitizes an array of industries.
	 *
	 * @param array           $industries One or more size arrays.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_industries_array( $industries, $request ) {
		if ( ! empty( $industries ) && is_array( $industries ) ) {
			$new_industries = [];
			foreach ( $industries as $key => $value ) {
				$new_industries[] = sanitize_text_field( $value );
			}
			return $new_industries;
		}
		return [];
	}

	/**
	 * Sanitizes a string for a filename.
	 *
	 * @param string $filename The filename.
	 * @return string a sanitized filename.
	 */
	public function sanitize_filename( $filename, $ext ) {
		return sanitize_file_name( $filename ) . '.' . $ext;
	}
	/**
	 * Create a filename from alt text.
	 */
	public function create_filename_from_alt( $alt ) {
		if ( empty( $alt ) ) {
			return '';
		}
		// Split the string into words.
		$words = explode( ' ', strtolower( $alt ) );
		// Limit to the first 7 words.
		$limited_words = array_slice( $words, 0, 7 );
		// Join the words with dashes.
		return implode( '-', $limited_words );
	}

	/**
	 * Import an image for the design library/patterns.
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
			$filename   = basename( $image_path );
		}
		$info = wp_check_filetype( $image_path );
		$ext  = empty( $info['ext'] ) ? '' : $info['ext'];
		$type = empty( $info['type'] ) ? '' : $info['type'];
		// If we don't allow uploading the file type or ext, return.
		if ( ! $type || ! $ext ) {
			return $image_data;
		}
		// Custom filename if passed as data.
		$filename = ! empty( $image_data['filename'] ) ? $this->sanitize_filename( $image_data['filename'], $ext ) : $filename;
		// Get the file content.
		$file_content = wp_remote_retrieve_body(
			wp_safe_remote_get(
				$image_data['url'],
				[
					'timeout'   => '60',
					'sslverify' => false,
				]
			)
		);
		// Empty file content?
		if ( empty( $file_content ) ) {
			return $image_data;
		}

		$upload                 = wp_upload_bits( $filename, null, $file_content );
		$post                   = [
			'post_title' => ( ! empty( $image_data['title'] ) ? $image_data['title'] : $filename ),
			'guid'       => $upload['url'],
		];
		$post['post_mime_type'] = $type;
		if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
			include ABSPATH . 'wp-admin/includes/image.php';
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
		if ( ! empty( $image_data['photograph_url'] ) ) {
			update_post_meta( $post_id, '_pexels_photograph_url', $image_data['photograph_url'] );
		}
		update_post_meta( $post_id, '_kadence_blocks_image_hash', sha1( $image_data['url'] ) );

		return [
			'id'  => $post_id,
			'url' => $upload['url'],
		];
	}
	/**
	 * Gets a src url from an array of image data for a certain size.
	 *
	 * @param array  $image_data An object passed from the fronted that contains image data and sizes.
	 * @param string $size_name The name of the size to return.
	 * @return string The download url or empty if no url found.
	 */
	public function get_src_from_image_data( $image_data, $size_name = 'download' ) {
		$download_url = '';
		if ( $image_data && isset( $image_data['sizes'] ) && ! empty( $image_data['sizes'] ) ) {
			foreach ( $image_data['sizes'] as $size ) {
				if ( $size['name'] == $size_name ) {
					$download_url = $size['src'] ? $size['src'] : '';
				}
			}
		}
		return $download_url;
	}
	/**
	 * Get information for our image.
	 *
	 * @param array  $images the image url.
	 * @param string $target_src the image url.
	 */
	public function get_image_info( $images, $target_src ) {
		if ( isset( $images['data'] ) && is_array( $images['data'] ) ) {
			foreach ( $images['data'] as $image_group ) {
				foreach ( $image_group['images'] as $image ) {
					foreach ( $image['sizes'] as $size ) {
						if ( $size['src'] === $target_src ) {
							return [
								'alt'              => ! empty( $image['alt'] ) ? $image['alt'] : '',
								'photographer'     => ! empty( $image['photographer'] ) ? $image['photographer'] : '',
								'url'              => ! empty( $image['url'] ) ? $image['url'] : '',
								'photographer_url' => ! empty( $image['photographer_url'] ) ? $image['photographer_url'] : '',
							];
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * Check if image is already imported.
	 *
	 * @param array $image_data the image data to import.
	 */
	public function check_for_local_image( $image_data ) {
		global $wpdb;
		$image_id = '';
		if ( ! empty( $image_data['url'] ) && strpos( $image_data['url'], get_site_url() ) !== false ) {
			$image_id = attachment_url_to_postid( $image_data['url'] );
			if ( empty( $image_id ) ) {
				// Get unsized version use Regular expression to find the pattern -numberxnumber
				$pattern = '/-\d+x\d+/';
				// Replace the pattern with an empty string.
				$cleaned_url = preg_replace( $pattern, '', $image_data['url'] );
				if ( $cleaned_url !== $image_data['url'] ) {
					$image_id = attachment_url_to_postid( $cleaned_url );
					if ( empty( $image_id ) ) {
						$scaled_url = preg_replace( $pattern, '-scaled', $image_data['url'] );
						$image_id   = attachment_url_to_postid( $scaled_url );
					}
				}
			}
		}
		if ( empty( $image_id ) ) {
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
		}
		if ( ! empty( $image_id ) ) {
			$local_image = [
				'id'  => $image_id,
				'url' => ( ! empty( $image_data['url'] ) && strpos( $image_data['url'], get_site_url() ) !== false ) ? $image_data['url'] : wp_get_attachment_url( $image_id ),
			];
			return [
				'status' => true,
				'image'  => $local_image,
			];
		}
		return [
			'status' => false,
			'image'  => $image_data,
		];
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
	 * Constructs a consistent Token header.
	 *
	 * @param array $args An array of arguments to include in the encoded header.
	 *
	 * @return string The base64 encoded string.
	 */
	public function get_token_header( $args = [] ) {

		$site_url     = get_original_domain();
		$site_name    = get_bloginfo( 'name' );
		$license_data = kadence_blocks_get_current_license_data();
		$product_slug = ( ! empty( $license_data['product'] ) && $license_data['product'] === 'kadence-blocks-pro' ? 'kadence-blocks-pro' : 'kadence-blocks' );
		$defaults     = [
			'domain'          => $site_url,
			'key'             => ! empty( $license_data['key'] ) ? $license_data['key'] : '',
			'site_name'       => sanitize_title( $site_name ),
			'product_slug'    => apply_filters( 'kadence-blocks-auth-slug', $product_slug ),
			'product_version' => KADENCE_BLOCKS_VERSION,
		];
		if ( ! empty( $license_data['env'] ) ) {
			$defaults['env'] = $license_data['env'];
		}

		$parsed_args = wp_parse_args( $args, $defaults );

		return base64_encode( json_encode( $parsed_args ) );
	}

	/**
	 * Checks if an AI content job is still generating the content. When checking jobs, any 409 (Conflict) HTTP status
	 * code means it's still trying to generate the content.
	 *
	 * @param array{headers: array, body: string, response: array{code: int, message: string}, cookies: \WP_HTTP_Cookie[]} $response
	 *
	 * @return bool
	 */
	private function is_ai_job_processing( array $response ): bool {
		if ( ! isset( $response['response']['code'] ) ) {
			return false;
		}

		$status = (int) $response['response']['code'];

		return $status === WP_Http::CONFLICT;
	}
}
