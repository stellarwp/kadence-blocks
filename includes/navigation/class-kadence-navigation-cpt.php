<?php
/**
 * Class managing the navigation CPT registration.
 */
class Kadence_Blocks_Navigation_CPT_Controller {

	private $post_type = 'kadence_navigation';
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
		// Register the meta settings for from post.
		add_action( 'init', array( $this, 'register_meta' ), 20 );
	}

	/**
	 * Registers the form post type.
	 */
	public function register_post_type() {
		$navigation_post_edit_link = 'site-editor.php?' . build_query(
				array(
					'postId'   => '%s',
					'postType' => $this->post_type,
					'canvas'   => 'edit',
				)
			);

		register_post_type(
			$this->post_type,
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
				'rest_base'             => $this->post_type,
				'rest_controller_class' => Kadence_Blocks_Navigation_CPT_Rest_Controller::class,
				'supports'              => array(
					'title',
					'editor',
					'revisions',
					'custom-fields'
				),
			)
		);
	}

	/**
	 * Check that user can edit these.
	 */
	public function meta_auth_callback() {
		return current_user_can( 'edit_kadence_navigation' );
	}

	public function register_meta() {
		$register_meta = array(
			array(
				'key'     => '_kad_navigation_anchor',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_navigation_className',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'     		=> '_kad_navigation_padding',
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     		=> '_kad_navigation_tabletPadding',
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     		=> '_kad_navigation_mobilePadding',
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_navigation_paddingUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_navigation_margin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_navigation_tabletMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_navigation_mobileMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_navigation_marginUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_navigation_border',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_navigation_borderRadius',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_navigation_borderColor',
				'default'       => '',
				'type'          => 'string',
			),
			array(
				'key'     => '_kad_navigation_borderUnit',
				'default' => 'px',
				'type'    => 'string',
			),
		);

		foreach ( $register_meta as $meta ) {

			if ( 'string' === $meta['type'] ) {
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
				$this->post_type,
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

Kadence_Blocks_Navigation_CPT_Controller::get_instance();
