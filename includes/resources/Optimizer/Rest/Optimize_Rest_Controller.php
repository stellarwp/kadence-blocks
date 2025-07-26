<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Rest;

use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
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
 *
 * All endpoints require the user to have edit permissions for the specified post.
 */
final class Optimize_Rest_Controller extends WP_REST_Controller {

	public const ROUTE     = '/kb-optimizer/v1/optimize';
	public const POST_PATH = 'post_path';
	public const POST_ID   = 'post_id';
	public const RESULTS   = 'results';

	private Store $store;
	private Schema $schema_loader;

	public function __construct( Store $store, Schema $schema_loader ) {
		$this->namespace     = 'kb-optimizer/v1';
		$this->rest_base     = 'optimize';
		$this->store         = $store;
		$this->schema_loader = $schema_loader;
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

		$path = new Path( $post_path );

		if ( $this->store->set( $path, $analysis ) ) {
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

		$path = new Path( $post_path );

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

		$path = new Path( $post_path );

		if ( $this->store->delete( $path ) ) {
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
	 * Get the default arguments for most methods.
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
}
