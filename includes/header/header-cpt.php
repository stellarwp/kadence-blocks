<?php
/**
 * Class managing the header CPT registration.
 */
class Kadence_Blocks_Header_CPT_Controller {

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
		add_action( 'init', array( $this, 'register_meta' ), 20 );
	}

	/**
	 * Registers the form post type.
	 */
	public function register_post_type() {
		$navigation_post_edit_link = 'site-editor.php?' . build_query(
				array(
					'postId'   => '%s',
					'postType' => 'kadence_header',
					'canvas'   => 'edit',
				)
			);

		register_post_type(
			'kadence_header',
			array(
				'labels'                => array(
					'name'                  => _x( 'Kadence Header', 'post type general name' ),
					'singular_name'         => _x( 'Kadence Header', 'post type singular name' ),
					'add_new'               => __( 'Add New Kadence Header' ),
					'add_new_item'          => __( 'Add New Kadence Header' ),
					'new_item'              => __( 'New Kadence Header' ),
					'edit_item'             => __( 'Edit Kadence Header' ),
					'view_item'             => __( 'View Kadence Header' ),
					'all_items'             => __( 'Kadence Headers' ),
					'search_items'          => __( 'Search Kadence Headers' ),
					'parent_item_colon'     => __( 'Parent Kadence Header:' ),
					'not_found'             => __( 'No Kadence Header found.' ),
					'not_found_in_trash'    => __( 'No Kadence Header found in Trash.' ),
					'archives'              => __( 'Kadence Header archives' ),
					'insert_into_item'      => __( 'Insert into Kadence Header' ),
					'uploaded_to_this_item' => __( 'Uploaded to this Kadence Header' ),
					'filter_items_list'     => __( 'Filter Kadence Header list' ),
					'items_list_navigation' => __( 'Kadence Headers list navigation' ),
					'items_list'            => __( 'Kadence Headers list' ),
				),
				'description'           => __( 'Kadence Headers that can be inserted into your site.' ),
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
				'rest_base'             => 'kadence_header',
				'rest_controller_class' => Kadence_Blocks_Header_CPT_Rest_Controller::class,
				'supports'              => array(
					'title',
					'editor',
					'revisions',
				),
			)
		);
	}

	public function register_meta() {

		$register_meta = array(
			array(
				'key'     => '_kad_header_anchor',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_header_className',
				'default' => '',
				'type'    => 'string'
			),
		);

		foreach ( $register_meta as $meta ) {

			if ( $meta['type'] === 'string' ) {
				$show_in_rest = true;
			} elseif ( $meta['type'] === 'array' ) {
				$show_in_rest = array(
					'schema' => array(
						'type'  => $meta['type'],
						'items' => array(
							'type' => $meta['children_type']
						),
					),
				);

				if( !empty( $meta['properties']) ) {
					$show_in_rest = array_merge_recursive( $show_in_rest, array(
						'schema' => array(
							'items' => array(
								'properties' => $meta['properties']
							)
						)
					) );
				}
			} elseif ( $meta['type'] === 'object' ) {
				$show_in_rest = array(
					'schema' => array(
						'type'       => $meta['type'],
						'properties' => $meta['properties']
					),
				);
			}

			register_post_meta(
				'kadence_form',
				$meta['key'],
				array(
					'single'        => true,
					'auth_callback' => array( $this, 'meta_auth_callback' ),
					'type'          => $meta['type'],
					'default'       => $meta['default'],
					'show_in_rest'  => $show_in_rest,
				)
			);
		}

	}
}

Kadence_Blocks_Header_CPT_Controller::get_instance();
