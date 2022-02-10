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
class Kadence_LottieAnimation_post_REST_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-lottieanimation/v1';
		$this->rest_base = 'animations';
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
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_animation' ),
					'permission_callback' => array( $this, 'create_animation_permission_check' ),
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
	public function create_animation_permission_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Create a lottie animation post from object
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return Array
	 */
	public function create_animation( $request ) {
		$jsonParams = $request->get_json_params();

		if ( empty( $jsonParams['lottieFile'] ) || ! is_array( $jsonParams['lottieFile'] ) || json_encode( $jsonParams['lottieFile'] ) === false ) {
			return new WP_Error( 'invalid_json', __( 'Lottie animation contains invalid JSON', 'kadence-blocks' ), array( 'status' => 200 ) );
		}

		if ( ! empty( trim( $jsonParams['title'] ) ) ) {
			$title = trim( $jsonParams['title'] );
		} else {
			return array( 'error' => true, 'message' => __( 'Please enter an animation title', 'kadence-blocks' ) );
		}

		// Create post object
		$my_post = array(
			'post_title'     => $title,
			'post_content'   => json_encode( $jsonParams['lottieFile'] ),
			'post_type'      => 'kadence_lottie',
			'post_status'    => 'publish',
			'post_mime_type' => 'application/json',
		);

		$insert = wp_insert_post( $my_post, true );

		if ( is_wp_error( $insert ) ) {
			return array( 'error' => true, 'message' => $insert->get_error_message());
		}

		return array( 'value' => $insert, 'label' => $title );
	}

}
