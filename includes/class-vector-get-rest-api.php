<?php
/**
 * REST API Vector Graphic GET controller
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * REST API Vector controller class.
 */
class Kadence_Vector_get_REST_Controller extends WP_REST_Controller {

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kb-vector/v1';
		$this->rest_base = 'vectors';
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
					'callback'            => array( $this, 'get_vector_list' ),
					'permission_callback' => array( $this, 'get_vector_permissions_check' ),
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
	public function get_vector_permissions_check( $request ) {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_vector_list( $request ) {
		$posts_data = array();

		$query_args = array(
			'post_type'      => 'kadence_vector',
			'post_status'    => 'publish',
			'order'          => 'DESC',
			'orderby'        => 'date',
			'posts_per_page' => 200,
		);

		$posts = get_posts( $query_args );

		foreach ( $posts as $post ) {
			$posts_data[] = array(
				'value' => $post->ID,
				'label' => $post->post_title,
			);
		}

		return new WP_REST_Response( $posts_data, 200 );
	}
} 