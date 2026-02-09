<?php
/**
 * REST API GetResponse controller customized for Kadence Form
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * REST API controller class.
 *
 */
class Kadence_GetResponse_REST_Controller extends WP_REST_Controller {

	/**
	 * Include property name.
	 */
	const PROP_END_POINT = 'endpoint';

	/**
	 * Allowed endpoint values to prevent SSRF (only these paths are requested from the configured API base).
	 *
	 * @var string[]
	 */
	const ALLOWED_ENDPOINTS = array( 'campaigns', 'tags', 'custom-fields' );


	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-getresponse/v1';
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
	 * Checks if a given request has access to proxy GetResponse API calls.
	 * Requires manage_options so only admins (who can configure the API key) can trigger server-side requests.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True if the request has access, WP_Error object otherwise.
	 */
	public function get_items_permission_check( $request ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'rest_forbidden',
				__( 'You do not have permission to access GetResponse API data.', 'kadence-blocks' ),
				array( 'status' => 403 )
			);
		}
		return true;
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error|Array Response object on success, or WP_Error object on failure.
	 */
	public function get_items( $request ) {
		$api_key   = get_option( 'kadence_blocks_getresponse_api_key' );
		$api_base  = get_option( 'kadence_blocks_getresponse_api_endpoint' );
		$end_point = $request->get_param( self::PROP_END_POINT );

		// Restrict to whitelisted endpoints to prevent SSRF (e.g. requesting arbitrary URLs that echo back auth headers or server IP).
		if ( empty( $end_point ) || ! in_array( $end_point, self::ALLOWED_ENDPOINTS, true ) ) {
			return new WP_Error(
				'rest_invalid_endpoint',
				__( 'Invalid or disallowed endpoint.', 'kadence-blocks' ),
				array( 'status' => 400 )
			);
		}

		if ( empty( $api_key ) || empty( $api_base ) ) {
			return rest_ensure_response( array() );
		}

		$request_url = rtrim( $api_base, '/' ) . '/' . $end_point;

		$request_args = array(
			'headers' => array(
				'X-Auth-Token' => 'api-key ' . $api_key,
			),
			'timeout' => 10,
		);
		$response = wp_safe_remote_get( $request_url, $request_args );

		if ( is_wp_error( $response ) || 200 != (int) wp_remote_retrieve_response_code( $response ) ) {
			return new WP_Error( 'getresponse_error', __( 'Error fetching data from GetResponse', 'kadence-blocks' ) );
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( ! is_array( $body ) ) {
			return new WP_Error( 'getresponse_error', __( 'Empty data from GetResponse', 'kadence-blocks' ) );
		}

		return rest_ensure_response( $body );
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params = parent::get_collection_params();

		$query_params[ self::PROP_END_POINT ] = array(
			'description' => __( 'Actionable endpoint for api call.', 'kadence-blocks' ),
			'type'        => 'string',
		);

		return $query_params;
	}
}
