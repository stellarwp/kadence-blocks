<?php
/**
 * REST API ActiveCampaign controller customized for Kadence Form
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * REST API controller class.
 *
 */
class Kadence_ActiveCampaign_REST_Controller extends WP_REST_Controller {

	/**
	 * Include property name.
	 */
	const PROP_END_POINT = 'endpoint';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-activecampaign/v1';
		$this->rest_base = 'get';
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
	}

	/**
	 * Checks if a given request has access to search content.
	 *
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has search access, WP_Error object otherwise.
	 */
	public function get_items_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error|Array Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$api_key   = get_option( 'kadence_blocks_activecampaign_api_key' );
		$api_base  = get_option( 'kadence_blocks_activecampaign_api_base' );
		$end_point = $request->get_param( self::PROP_END_POINT );

		$base_url = $api_base . '/api/3/' . $end_point;

		if ( empty( $api_key ) || empty( $api_base ) ) {
			return array();
		}

		$request_url = add_query_arg( array(
			'api_secret' => $api_key,
		), $base_url );

		$request_args = array(
			'headers' => array(
				'Api-Token' => $api_key,
			),
		);

		$response = wp_safe_remote_get( $request_url, $request_args );

		if ( is_wp_error( $response ) || 200 != (int) wp_remote_retrieve_response_code( $response ) ) {
			return array();
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( ! is_array( $body ) ) {
			return array();
		}

		return $body;
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params[ self::PROP_END_POINT ] = array(
			'description' => __( 'Actionable endpoint for api call.', 'kadence-blocks-pro' ),
			'type'        => 'string',
		);

		return $query_params;
	}
}
