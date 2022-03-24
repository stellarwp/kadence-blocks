<?php
/**
 * REST API Lottie Animation controller
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * REST API Products controller class.
 */
class Kadence_LottieAnimation_get_REST_Controller extends WP_REST_Controller {

	/**
	 * Include property name.
	 */
	const PROP_END_POINT = 'id';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-lottieanimation/v1';
		$this->rest_base = 'animations/(?P<id>[\a-zA-Z0-9]+)';
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
					'callback'            => array( $this, 'get_animation' ),
					'permission_callback' => '__return_true',
				),
			)
		);
	}

	/**
	 * Retrieves Lottie Animation JSON from post
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_animation( $request ) {
		$post_id = $request->get_param( self::PROP_END_POINT );

		$post = get_post( $post_id );

		if( !$post || $post->post_type !== 'kadence_lottie' || $post->post_status !== 'publish' ) {
			return new WP_Error( 'not_found', __('Lottie animation not found'), array( 'status' => 404 ) );
		}

		if( json_decode($post->post_content) === null ) {
			return new WP_Error( 'invalid_json', __('Lottie animation file contains invalid json'), array( 'status' => 404 ) );
		}

		return json_decode($post->post_content);
	}

}
