<?php
/**
 * Class managing the navigation CPT registration.
 */
class Kadence_Blocks_Navigation_CPT_Controller {

	/**
	 * Instance Control
	 *
	 * @var null
	 */
	private static $instance = null;
	/**
	 * Instance Control.
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor function.
	 */
	public function __construct() {
		// Register the post type.
		add_action( 'init', array( $this, 'register_post_type' ), 2 );
	}

	/**
	 * Registers the form post type.
	 */
	public function register_post_type() {
		$navigation_post_edit_link = 'site-editor.php?' . build_query(
				array(
					'postId'   => '%s',
					'postType' => 'kb_navigation',
					'canvas'   => 'edit',
				)
			);

		register_post_type(
			'kb_navigation',
			array(
				'labels'                => array(
					'name'                  => _x( 'Kadence Navigation Menus', 'post type general name' ),
					'singular_name'         => _x( 'Kadence Navigation Menu', 'post type singular name' ),
					'add_new'               => __( 'Add New Kadence Navigation Menu' ),
					'add_new_item'          => __( 'Add New Kadence Navigation Menu' ),
					'new_item'              => __( 'New Kadence Navigation Menu' ),
					'edit_item'             => __( 'Edit Kadence Navigation Menu' ),
					'view_item'             => __( 'View Kadence Navigation Menu' ),
					'all_items'             => __( 'Kadence Navigation Menus' ),
					'search_items'          => __( 'Search Kadence Navigation Menus' ),
					'parent_item_colon'     => __( 'Parent Kadence Navigation Menu:' ),
					'not_found'             => __( 'No Kadence Navigation Menu found.' ),
					'not_found_in_trash'    => __( 'No Kadence Navigation Menu found in Trash.' ),
					'archives'              => __( 'Kadence Navigation Menu archives' ),
					'insert_into_item'      => __( 'Insert into Kadence Navigation Menu' ),
					'uploaded_to_this_item' => __( 'Uploaded to this Kadence Navigation Menu' ),
					'filter_items_list'     => __( 'Filter Kadence Navigation Menu list' ),
					'items_list_navigation' => __( 'Kadence Navigation Menus list navigation' ),
					'items_list'            => __( 'Kadence Navigation Menus list' ),
				),
				'description'           => __( 'Kadence Navigation menus that can be inserted into your site.' ),
				'public'                => false,
				'_builtin'              => true, /* internal use only. don't use this when registering your own post type. */
				'_edit_link'            => $navigation_post_edit_link, /* internal use only. don't use this when registering your own post type. */
				'has_archive'           => false,
				'show_ui'               => true,
				'show_in_menu'          => false,
				'show_in_admin_bar'     => false,
				'show_in_rest'          => true,
				'rewrite'               => false,
				'map_meta_cap'          => true,
				'capabilities'          => array(
					'edit_others_posts'      => 'edit_theme_options',
					'delete_posts'           => 'edit_theme_options',
					'publish_posts'          => 'edit_theme_options',
					'create_posts'           => 'edit_theme_options',
					'read_private_posts'     => 'edit_theme_options',
					'delete_private_posts'   => 'edit_theme_options',
					'delete_published_posts' => 'edit_theme_options',
					'delete_others_posts'    => 'edit_theme_options',
					'edit_private_posts'     => 'edit_theme_options',
					'edit_published_posts'   => 'edit_theme_options',
					'edit_posts'             => 'edit_theme_options',
				),
				'rest_base'             => 'kb_navigation',
				'rest_controller_class' => 'WP_REST_Posts_Controller',
				'supports'              => array(
					'title',
					'editor',
					'revisions',
				),
			)
		);
	}
}

Kadence_Blocks_Navigation_CPT_Controller::get_instance();
