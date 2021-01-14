<?php
/**
 * REST API Fluent CRM controller customized for Kadence Form
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * REST API Products controller class.
 *
 * @package WooCommerce/API
 */
class Kadence_FluentCRM_REST_Controller extends WP_REST_Controller {

	/**
	 * Include property name.
	 */
	const PROP_END_POINT = 'endpoint';


	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-fluentcrm/v1';
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
	public function get_items( $request ) {
		$end_point = $request->get_param( self::PROP_END_POINT );
		if ( ! function_exists( 'FluentCrmApi' ) ) {
			return array();
		}
		if ( empty( $end_point ) ) {
			return array();
		}
		if ( 'lists' === $end_point ) {
			$list_api = FluentCrmApi( 'lists' );
			return $list_api->all();
		} elseif ( 'tags' === $end_point ) {
			$tag_api = FluentCrmApi( 'tags' );
			return $tag_api->all();
		} elseif ( 'fields' === $end_point ) {
			$fields = array(
				array(
					'key' => 'first_name',
					'title' => __( 'First Name', 'kadence-blocks' ),
				),
				array(
					'key' => 'last_name',
					'title' => __( 'Last Name', 'kadence-blocks' ),
				),
			);
			return apply_filters( 'kadence_blocks_form_fluentcrm_fields', $fields );
		} else {
			return array();
		}
	}
	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_collection_params() {
		$query_params  = parent::get_collection_params();

		$query_params[ self::PROP_END_POINT ] = array(
			'description' => __( 'Actionable endpoint for api call.', 'kadence-blocks-pro' ),
			'type'        => 'string',
		);

		return $query_params;
	}
}
