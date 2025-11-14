<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Rest;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Status\Status;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use WP_Error;
use WP_Http;
use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST API controller for managing Kadence Blocks optimizer data.
 *
 * This controller provides endpoints for storing, retrieving, and deleting
 * performance optimization analysis data for posts. It handles website analysis
 * results that can be used to optimize page performance.
 *
 * Endpoints:
 * - POST   /kb-optimizer/v1/optimize - Store optimizer data for a post
 * - GET    /kb-optimizer/v1/optimize - Retrieve optimizer data for a post
 * - DELETE /kb-optimizer/v1/optimize - Delete optimizer data for a post
 * - POST   /kb-optimizer/v1/optimize/posts-metadata - Get metadata for multiple posts
 * - DELETE /kb-optimizer/v1/optimize/bulk/delete - Delete optimizer data for multiple posts
 *
 * All endpoints require the user to have edit permissions for the specified post.
 */
final class Optimize_Rest_Controller extends WP_REST_Controller {

	use Permalink_Trait;

	public const ROUTE      = '/kb-optimizer/v1/optimize';
	public const POST_PATH  = 'post_path';
	public const POST_ID    = 'post_id';
	public const POST_IDS   = 'post_ids';
	public const POST_PATHS = 'post_paths';
	public const RESULTS    = 'results';

	private Store $store;
	private Schema $schema_loader;
	private Status $status;

	public function __construct(
		Store $store,
		Schema $schema_loader,
		Status $status
	) {
		$this->namespace     = 'kb-optimizer/v1';
		$this->rest_base     = 'optimize';
		$this->store         = $store;
		$this->schema_loader = $schema_loader;
		$this->status        = $status;
	}

	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			"/$this->rest_base",
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_item' ],
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
					'args'                => $this->get_create_params(),
				],
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_default_params(),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_default_params(),
				],
				'schema' => [ $this->schema_loader, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			"/$this->rest_base/posts-metadata",
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'get_posts_metadata' ],
					'permission_callback' => [ $this, 'get_posts_metadata_permissions_check' ],
					'args'                => $this->get_posts_metadata_params(),
				],
			]
		);

		register_rest_route(
			$this->namespace,
			"/$this->rest_base/bulk/delete",
			[
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'bulk_delete_items' ],
					'permission_callback' => [ $this, 'bulk_delete_items_permissions_check' ],
					'args'                => $this->get_bulk_delete_params(),
				],
			]
		);
	}

	/**
	 * Save optimizer data for a post.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function create_item( $request ) {
		$post_id   = $request->get_param( self::POST_ID );
		$post_path = $request->get_param( self::POST_PATH );
		$results   = $request->get_param( self::RESULTS );
		$analysis  = WebsiteAnalysis::from( $results );

		if ( $this->status->is_excluded( $post_id ) ) {
			return new WP_Error(
				'rest_kb_optimizer_create_failed_excluded',
				__( 'This post is excluded from optimization.', 'kadence-blocks' ),
				[
					'status'    => WP_Http::INTERNAL_SERVER_ERROR,
					'post_id'   => $post_id,
					'post_path' => $post_path,
				]
			);
		}

		if ( get_post_status( $post_id ) !== 'publish' ) {
			return new WP_Error(
				'rest_kb_optimizer_create_failed_not_published',
				__( 'The post must be published to be optimized.', 'kadence-blocks' ),
				[
					'status'    => WP_Http::INTERNAL_SERVER_ERROR,
					'post_id'   => $post_id,
					'post_path' => $post_path,
				]
			);
		}

		$path = new Path( $post_path, $post_id );

		if ( $this->store->set( $path, $analysis ) ) {
			$ref = wp_get_referer();

			// If we're coming from the edit post page, don't double update the post.
			if ( $ref && ! str_contains( $ref, 'post.php' ) ) {
				$this->update_post( $post_id );
			}

			return new WP_REST_Response(
				[
					'data' => [
						'success'   => true,
						'post_id'   => $post_id,
						'post_path' => $post_path,
					],
				],
				WP_Http::CREATED
			);
		}

		return new WP_Error(
			'rest_kb_optimizer_create_failed',
			__( 'Failed to store optimizer data.', 'kadence-blocks' ),
			[
				'status'    => WP_Http::INTERNAL_SERVER_ERROR,
				'post_id'   => $post_id,
				'post_path' => $post_path,
			]
		);
	}

	/**
	 * Get optimizer data for a post.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_item( $request ) {
		$post_path = $request->get_param( self::POST_PATH );
		$post_id   = $request->get_param( self::POST_ID );

		$path = new Path( $post_path, $post_id );

		$analysis = $this->store->get( $path );

		if ( ! $analysis ) {
			return new WP_Error(
				'rest_kb_optimizer_read_not_found',
				__( 'Sorry, we couldn\'t find optimizer data.', 'kadence-blocks' ),
				[
					'status'    => WP_Http::NOT_FOUND,
					'post_path' => $post_path,
				]
			);
		}

		return new WP_REST_Response(
			[
				'data' => $analysis->toArray(),
			],
			WP_Http::OK
		);
	}

	/**
	 * Delete optimizer data for a post.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function delete_item( $request ) {
		$post_id   = $request->get_param( self::POST_ID );
		$post_path = $request->get_param( self::POST_PATH );

		// Include post_id in Path for reliable status synchronization.
		$path = new Path( $post_path, $post_id );

		if ( $this->store->delete( $path ) ) {
			// Run wp_update post to signal to caching plugins to update their cache.
			$this->update_post( $post_id );

			return new WP_REST_Response(
				[
					'data' => [
						'success'   => true,
						'post_id'   => $post_id,
						'post_path' => $post_path,
					],
				],
				WP_Http::OK
			);
		}

		return new WP_Error(
			'rest_kb_optimizer_delete_failed',
			__( 'Failed to delete optimizer data.', 'kadence-blocks' ),
			[
				'status'    => WP_Http::INTERNAL_SERVER_ERROR,
				'post_id'   => $post_id,
				'post_path' => $post_path,
			]
		);
	}

	/**
	 * Get metadata for multiple posts to prepare for bulk optimization.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_posts_metadata( WP_REST_Request $request ): WP_REST_Response {
		$post_ids = $request->get_param( self::POST_IDS );

		$posts_data = [];
		$errors     = [];

		foreach ( $post_ids as $post_id ) {
			$post = get_post( $post_id );

			if ( ! $post ) {
				$errors[] = [
					'post_id' => $post_id,
					'message' => __( 'Post not found.', 'kadence-blocks' ),
				];
				continue;
			}

			$post_url  = get_permalink( $post_id );
			$post_path = $this->get_post_path( $post_id );

			// Skip posts without pretty permalinks.
			if ( ! $post_url || empty( $post_path ) || str_contains( $post_path, '?' ) ) {
				$errors[] = [
					'post_id' => $post_id,
					'message' => __( 'Post has no rewrite rules or is not public.', 'kadence-blocks' ),
				];
				continue;
			}

			$posts_data[] = [
				'post_id'   => $post_id,
				'url'       => $post_url,
				'post_path' => $post_path,
			];
		}

		return new WP_REST_Response(
			[
				'data'   => $posts_data,
				'errors' => $errors,
			],
			WP_Http::OK
		);
	}

	/**
	 * Delete optimizer data for multiple posts at once.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function bulk_delete_items( WP_REST_Request $request ): WP_REST_Response {
		$post_ids   = $request->get_param( self::POST_IDS );
		$post_paths = $request->get_param( self::POST_PATHS );

		$results = [
			'successful' => [],
			'failed'     => [],
		];

		foreach ( $post_ids as $index => $post_id ) {
			$post_path = $post_paths[ $index ] ?? null;

			if ( ! $post_path ) {
				$results['failed'][] = [
					'post_id' => $post_id,
					'message' => __( 'Missing post path.', 'kadence-blocks' ),
				];

				continue;
			}

			$path = new Path( $post_path, $post_id );

			// Check if optimization data exists.
			if ( ! $this->store->has( $path ) ) {
				// No data to delete - consider this a success.
				$this->store->delete( $path );

				$results['successful'][] = $post_id;

				continue;
			}

			if ( $this->store->delete( $path ) ) {
				// Run wp_update_post to signal to caching plugins to update their cache.
				$this->update_post( $post_id );

				$results['successful'][] = $post_id;
			} else {
				$results['failed'][] = [
					'post_id' => $post_id,
					'message' => __( 'Failed to delete optimizer data.', 'kadence-blocks' ),
				];
			}
		}

		return new WP_REST_Response(
			[
				'data' => $results,
			],
			WP_Http::OK
		);
	}

	/**
	 * Checks if a given request has access to create items.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has access to create items, WP_Error object
	 *     otherwise.
	 */
	public function create_item_permissions_check( $request ) {
		$post_id = $request->get_param( self::POST_ID );

		if ( $post_id && current_user_can( 'edit_post', $post_id ) ) {
			return true;
		}

		$post = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error(
				'rest_kb_optimizer_post_does_not_exist',
				__( 'Sorry, we could not find that post_id.', 'kadence-blocks' ),
				[
					'status'  => WP_Http::NOT_FOUND,
					'post_id' => $post_id,
				]
			);
		}

		return new WP_Error(
			'rest_kb_optimizer_create_forbidden',
			__( 'Sorry, you are not allowed to store optimizer data.', 'kadence-blocks' ),
			[
				'status'  => rest_authorization_required_code(),
				'post_id' => $post_id,
			]
		);
	}

	/**
	 * Checks if a given request has access to get a specific item.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has read access, WP_Error object otherwise.
	 */
	public function get_item_permissions_check( $request ) {
		$post_id = $request->get_param( self::POST_ID );

		if ( $post_id && current_user_can( 'edit_post', $post_id ) ) {
			return true;
		}

		$post = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error(
				'rest_kb_optimizer_post_does_not_exist',
				__( 'Sorry, we could not find that post_id.', 'kadence-blocks' ),
				[
					'status'  => WP_Http::NOT_FOUND,
					'post_id' => $post_id,
				]
			);
		}

		return new WP_Error(
			'rest_kb_optimizer_read_forbidden',
			__( 'Sorry, you are not allowed to access optimizer data.', 'kadence-blocks' ),
			[
				'status'  => rest_authorization_required_code(),
				'post_id' => $post_id,
			]
		);
	}

	/**
	 * Checks if a given request has access to delete optimization data.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has access to delete the item, WP_Error object
	 *     otherwise.
	 */
	public function delete_item_permissions_check( $request ) {
		$post_id = $request->get_param( self::POST_ID );

		if ( $post_id && current_user_can( 'delete_post', $post_id ) ) {
			return true;
		}

		$post = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error(
				'rest_kb_optimizer_post_does_not_exist',
				__( 'Sorry, we could not find that post_id.', 'kadence-blocks' ),
				[
					'status'  => WP_Http::NOT_FOUND,
					'post_id' => $post_id,
				]
			);
		}

		return new WP_Error(
			'rest_kb_optimizer_delete_forbidden',
			__( 'Sorry, you do not have permission to delete data for this post.', 'kadence-blocks' ),
			[
				'status'  => rest_authorization_required_code(),
				'post_id' => $post_id,
			]
		);
	}

	/**
	 * Checks if a given request has access to get posts metadata.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has access, WP_Error object otherwise.
	 */
	public function get_posts_metadata_permissions_check( $request ) {
		$post_ids = $request->get_param( self::POST_IDS );

		// Admins and editors can edit all posts - skip individual checks.
		if ( current_user_can( 'edit_others_posts' ) ) {
			return true;
		}

		// For contributors/authors, verify they can edit each post.
		foreach ( $post_ids as $post_id ) {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return new WP_Error(
					'rest_kb_optimizer_bulk_forbidden',
					__( 'Sorry, you are not allowed to access optimizer data for all selected posts.', 'kadence-blocks' ),
					[
						'status'  => rest_authorization_required_code(),
						'post_id' => $post_id,
					]
				);
			}
		}

		return true;
	}

	/**
	 * Checks if a given request has access to bulk delete optimization data.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has access, WP_Error object otherwise.
	 */
	public function bulk_delete_items_permissions_check( WP_REST_Request $request ) {
		$post_ids = $request->get_param( self::POST_IDS );

		// Admins and editors can delete all posts - skip individual checks.
		if ( current_user_can( 'edit_others_posts' ) ) {
			return true;
		}

		// For contributors/authors, verify they can delete each post.
		foreach ( $post_ids as $post_id ) {
			if ( ! current_user_can( 'delete_post', $post_id ) ) {
				return new WP_Error(
					'rest_kb_optimizer_bulk_delete_forbidden',
					__( 'Sorry, you are not allowed to delete optimizer data for all selected posts.', 'kadence-blocks' ),
					[
						'status'  => rest_authorization_required_code(),
						'post_id' => $post_id,
					]
				);
			}
		}

		return true;
	}

	/**
	 * Get the default arguments for write methods (POST, DELETE).
	 *
	 * Requires both post_path and post_id for reliable status synchronization.
	 *
	 * @return array<string, array{
	 *  type:              string,
	 *  description:       string,
	 *  minimum:           positive-int,
	 *  required:          true,
	 *  sanitize_callback: callable,
	 *  }>
	 */
	private function get_default_params(): array {
		return [
			self::POST_PATH => [
				'type'              => 'string',
				'description'       => __( 'The relative post path', 'kadence-blocks' ),
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
			],
			self::POST_ID   => [
				'type'              => 'integer',
				'description'       => __( 'The post ID associated with the optimization data.', 'kadence-blocks' ),
				'minimum'           => 1,
				'required'          => true,
				'sanitize_callback' => static fn( $value ) => (int) $value,
			],
		];
	}

	/**
	 * Get the arguments for the create method.
	 *
	 * @return array<string, array{
	 *   type:              string,
	 *   description:       string,
	 *   minimum:           positive-int,
	 *   required:          true,
	 *   sanitize_callback: callable,
	 *   properties: array<string, mixed>
	 *   }>
	 */
	private function get_create_params(): array {
		$params = $this->get_default_params();

		$params[ self::RESULTS ] = [
			'type'       => 'object',
			'properties' => rest_get_endpoint_args_for_schema( $this->schema_loader->get_item_schema() ),
		];

		return $params;
	}

	/**
	 * Get the arguments for the posts metadata endpoint.
	 *
	 * @return array<string, array{
	 *   type:              string,
	 *   description:       string,
	 *   required:          true,
	 *   items:             array<string, mixed>,
	 *   sanitize_callback: callable
	 *   }>
	 */
	private function get_posts_metadata_params(): array {
		return [
			self::POST_IDS => [
				'type'              => 'array',
				'description'       => __( 'Array of post IDs to get metadata for.', 'kadence-blocks' ),
				'required'          => true,
				'items'             => [
					'type'    => 'integer',
					'minimum' => 1,
				],
				'sanitize_callback' => static fn( $value ) => array_map( 'intval', $value ),
			],
		];
	}

	/**
	 * Get the arguments for the bulk delete endpoint.
	 *
	 * @return array<string, array{
	 *   type:              string,
	 *   description:       string,
	 *   required:          true,
	 *   items:             array<string, mixed>,
	 *   sanitize_callback: callable
	 *   }>
	 */
	private function get_bulk_delete_params(): array {
		return [
			self::POST_IDS   => [
				'type'              => 'array',
				'description'       => __( 'Array of post IDs to delete optimization data for.', 'kadence-blocks' ),
				'required'          => true,
				'items'             => [
					'type'    => 'integer',
					'minimum' => 1,
				],
				'sanitize_callback' => static fn( $value ) => array_map( 'intval', $value ),
			],
			self::POST_PATHS => [
				'type'              => 'array',
				'description'       => __( 'Array of post paths corresponding to the post IDs.', 'kadence-blocks' ),
				'required'          => true,
				'items'             => [
					'type' => 'string',
				],
				'sanitize_callback' => static fn( $value ) => array_map( 'sanitize_text_field', $value ),
			],
		];
	}

	/**
	 * Update a post to hopefully force caching plugins to refresh their cache.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return int|WP_Error
	 */
	private function update_post( int $post_id ) {
		$post = get_post( $post_id );

		if ( ! $post ) {
			return new WP_Error(
				'rest_kb_optimizer_update_post_failed',
				__( 'Unable to find post to update', 'kadence-blocks' ),
				[
					'status'  => WP_Http::INTERNAL_SERVER_ERROR,
					'post_id' => $post_id,
				]
			);
		}

		return wp_update_post( $post );
	}
}
