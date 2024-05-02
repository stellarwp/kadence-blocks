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
	 * Post type.
	 *
	 * @var string
	 */
	private $post_type = 'kadence_header';

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
		add_filter( 'user_has_cap', array( $this, 'filter_post_type_user_caps' ) );

	}

	/**
	 * Registers the header post type.
	 */
	public function register_post_type() {

		register_post_type(
			$this->post_type,
			array(
				'labels'                => array(
					'name'                  => _x( 'Kadence Header', 'post type general name', 'kadence-blocks' ),
					'singular_name'         => _x( 'Kadence Header', 'post type singular name', 'kadence-blocks' ),
					'add_new'               => __( 'Add New Kadence Header', 'kadence-blocks' ),
					'add_new_item'          => __( 'Add New Kadence Header', 'kadence-blocks' ),
					'new_item'              => __( 'New Kadence Header', 'kadence-blocks' ),
					'edit_item'             => __( 'Edit Kadence Header', 'kadence-blocks' ),
					'view_item'             => __( 'View Kadence Header', 'kadence-blocks' ),
					'all_items'             => __( 'Kadence Headers', 'kadence-blocks' ),
					'search_items'          => __( 'Search Kadence Headers', 'kadence-blocks' ),
					'parent_item_colon'     => __( 'Parent Kadence Header:', 'kadence-blocks' ),
					'not_found'             => __( 'No Kadence Header found.', 'kadence-blocks' ),
					'not_found_in_trash'    => __( 'No Kadence Header found in Trash.', 'kadence-blocks' ),
					'archives'              => __( 'Kadence Header archives', 'kadence-blocks' ),
					'insert_into_item'      => __( 'Insert into Kadence Header', 'kadence-blocks' ),
					'uploaded_to_this_item' => __( 'Uploaded to this Kadence Header', 'kadence-blocks' ),
					'filter_items_list'     => __( 'Filter Kadence Header list', 'kadence-blocks' ),
					'items_list_navigation' => __( 'Kadence Headers list navigation', 'kadence-blocks' ),
					'items_list'            => __( 'Kadence Headers list', 'kadence-blocks' ),
				),
				'description'           => __( 'Kadence Headers that can be inserted into your site.', 'kadence-blocks' ),
				'public'                => false,
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
				'rest_controller_class' => Kadence_Blocks_Header_CPT_Rest_Controller::class,
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
		return current_user_can( 'edit_kadence_header' );
	}

	/**
	 * Filters the capabilities of a user to conditionally grant them capabilities for managing headers.
	 *
	 * Any user who can 'edit_others_pages' will have access to manage headers.
	 *
	 * @param array $allcaps A user's capabilities.
	 *
	 * @return array Filtered $allcaps.
	 */
	public function filter_post_type_user_caps( $allcaps ) {
		if ( isset( $allcaps['edit_others_pages'] ) ) {
			$allcaps['edit_kadence_header']             = $allcaps['edit_others_pages'];
			$allcaps['edit_others_kadence_header']      = $allcaps['edit_others_pages'];
			$allcaps['edit_published_kadence_header']   = $allcaps['edit_others_pages'];
			$allcaps['edit_private_kadence_header']     = $allcaps['edit_others_pages'];
			$allcaps['delete_kadence_header']           = $allcaps['edit_others_pages'];
			$allcaps['delete_others_kadence_header']    = $allcaps['edit_others_pages'];
			$allcaps['delete_published_kadence_header'] = $allcaps['edit_others_pages'];
			$allcaps['delete_private_kadence_header']   = $allcaps['edit_others_pages'];
			$allcaps['publish_kadence_header']          = $allcaps['edit_others_pages'];
			$allcaps['read_private_kadence_header']     = $allcaps['edit_others_pages'];
		}

		return $allcaps;
	}

	public function register_meta() {
		$register_meta = array(
			array(
				'key' => '_kad_header_typography',
				'type'          => 'object',
				'default'       => array(
					'color'         => '',
					'size'          => array( '', '', '' ),
					'sizeType'      => 'px',
					'lineHeight'    => array( '', '', '' ),
					'lineType'      => '',
					'letterSpacing' => array( '', '', '' ),
					'letterType'    => 'px',
					'textTransform' => '',
					'family'        => '',
					'google'        => false,
					'style'         => '',
					'weight'        => '',
					'variant'       => '',
					'subset'        => '',
					'loadGoogle'    => true,
				),
				'properties' => array(
					'color'         => array( 'type' => 'string' ),
					'size'          => array( 'type' => 'array' ),
					'sizeType'      => array( 'type' => 'string' ),
					'lineHeight'    => array( 'type' => 'array' ),
					'lineType'      => array( 'type' => 'string' ),
					'letterSpacing' => array( 'type' => 'array' ),
					'letterType'    => array( 'type' => 'string' ),
					'textTransform' => array( 'type' => 'string' ),
					'family'        => array( 'type' => 'string' ),
					'google'        => array( 'type' => 'boolean' ),
					'style'         => array( 'type' => 'string' ),
					'weight'        => array( 'type' => 'string' ),
					'variant'       => array( 'type' => 'string' ),
					'subset'        => array( 'type' => 'string' ),
					'loadGoogle'    => array( 'type' => 'boolean' ),
				),
			),
			array(
				'key' => '_kad_header_border',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderHover',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderHoverTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderHoverMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key'           => '_kad_header_borderRadius',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusTablet',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusMobile',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_header_borderRadiusUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_header_borderRadiusHover',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusHoverTablet',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusHoverMobile',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_header_borderRadiusHoverUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key' => '_kad_header_borderTransparent',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderTransparentTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderTransparentMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderTransparentHover',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderTransparentHoverTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderTransparentHoverMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key'           => '_kad_header_borderRadiusTransparent',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusTransparentTablet',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusTransparentMobile',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_header_borderRadiusTransparentUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_header_borderRadiusTransparentHover',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusTransparentHoverTablet',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusTransparentHoverMobile',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_header_borderRadiusTransparentHoverUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key' => '_kad_header_borderSticky',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderStickyTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderStickyMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderStickyHover',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderStickyHoverTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_borderStickyHoverMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top'    => array( '', 'solid', '' ),
						'right'  => array( '', 'solid', '' ),
						'bottom' => array( '', 'solid', '' ),
						'left'   => array( '', 'solid', '' ),
						'unit'   => 'px',
					),
				),
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key'           => '_kad_header_borderRadiusSticky',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusStickyTablet',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusStickyMobile',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_header_borderRadiusStickyUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_header_borderRadiusStickyHover',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusStickyHoverTablet',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_borderRadiusStickyHoverMobile',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_header_borderRadiusStickyHoverUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key' => '_kad_header_background',
				'type'          => 'object',
				'default'       => array(
					'color'      => '',
					'image'      => '',
					'imageID'    => '',
					'position'   => 'center center',
					'size'       => 'cover',
					'repeat'     => 'no-repeat',
					'attachment' => 'scroll',
					'type'       => 'normal',
					'gradient'   => '',
				),
				'properties' => array(
					'color'      => array( 'type' => 'string' ),
					'image'      => array( 'type' => 'string' ),
					'imageID'    => array( 'type' => 'string' ),
					'position'   => array( 'type' => 'string' ),
					'size'       => array( 'type' => 'string' ),
					'repeat'     => array( 'type' => 'string' ),
					'attachment' => array( 'type' => 'string' ),
					'type'       => array( 'type' => 'string' ),
					'gradient'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_backgroundHover',
				'type'          => 'object',
				'default'       => array(
					'color'           => '',
					'image'           => '',
					'imageID'         => '',
					'imagePosition'   => 'center center',
					'imageSize'       => 'cover',
					'imageRepeat'     => 'no-repeat',
					'imageAttachment' => 'scroll',
					'type'            => 'normal',
					'gradient'        => '',
				),
				'properties' => array(
					'color'           => array( 'type' => 'string' ),
					'image'           => array( 'type' => 'string' ),
					'imageID'         => array( 'type' => 'string' ),
					'imagePosition'   => array( 'type' => 'string' ),
					'imageSize'       => array( 'type' => 'string' ),
					'imageRepeat'     => array( 'type' => 'string' ),
					'imageAttachment' => array( 'type' => 'string' ),
					'type'            => array( 'type' => 'string' ),
					'gradient'        => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_backgroundTransparent',
				'type'          => 'object',
				'default'       => array(
					'color'      => '',
					'image'      => '',
					'imageID'    => '',
					'position'   => 'center center',
					'size'       => 'cover',
					'repeat'     => 'no-repeat',
					'attachment' => 'scroll',
					'type'       => 'normal',
					'gradient'   => '',
				),
				'properties' => array(
					'color'      => array( 'type' => 'string' ),
					'image'      => array( 'type' => 'string' ),
					'imageID'    => array( 'type' => 'string' ),
					'position'   => array( 'type' => 'string' ),
					'size'       => array( 'type' => 'string' ),
					'repeat'     => array( 'type' => 'string' ),
					'attachment' => array( 'type' => 'string' ),
					'type'       => array( 'type' => 'string' ),
					'gradient'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_backgroundTransparentHover',
				'type'          => 'object',
				'default'       => array(
					'color'           => '',
					'image'           => '',
					'imageID'         => '',
					'imagePosition'   => 'center center',
					'imageSize'       => 'cover',
					'imageRepeat'     => 'no-repeat',
					'imageAttachment' => 'scroll',
					'type'            => 'normal',
					'gradient'        => '',
				),
				'properties' => array(
					'color'           => array( 'type' => 'string' ),
					'image'           => array( 'type' => 'string' ),
					'imageID'         => array( 'type' => 'string' ),
					'imagePosition'   => array( 'type' => 'string' ),
					'imageSize'       => array( 'type' => 'string' ),
					'imageRepeat'     => array( 'type' => 'string' ),
					'imageAttachment' => array( 'type' => 'string' ),
					'type'            => array( 'type' => 'string' ),
					'gradient'        => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_backgroundSticky',
				'type'          => 'object',
				'default'       => array(
					'color'      => '',
					'image'      => '',
					'imageID'    => '',
					'position'   => 'center center',
					'size'       => 'cover',
					'repeat'     => 'no-repeat',
					'attachment' => 'scroll',
					'type'       => 'normal',
					'gradient'   => '',
				),
				'properties' => array(
					'color'      => array( 'type' => 'string' ),
					'image'      => array( 'type' => 'string' ),
					'imageID'    => array( 'type' => 'string' ),
					'position'   => array( 'type' => 'string' ),
					'size'       => array( 'type' => 'string' ),
					'repeat'     => array( 'type' => 'string' ),
					'attachment' => array( 'type' => 'string' ),
					'type'       => array( 'type' => 'string' ),
					'gradient'   => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_backgroundStickyHover',
				'type'          => 'object',
				'default'       => array(
					'color'           => '',
					'image'           => '',
					'imageID'         => '',
					'imagePosition'   => 'center center',
					'imageSize'       => 'cover',
					'imageRepeat'     => 'no-repeat',
					'imageAttachment' => 'scroll',
					'type'            => 'normal',
					'gradient'        => '',
				),
				'properties' => array(
					'color'           => array( 'type' => 'string' ),
					'image'           => array( 'type' => 'string' ),
					'imageID'         => array( 'type' => 'string' ),
					'imagePosition'   => array( 'type' => 'string' ),
					'imageSize'       => array( 'type' => 'string' ),
					'imageRepeat'     => array( 'type' => 'string' ),
					'imageAttachment' => array( 'type' => 'string' ),
					'type'            => array( 'type' => 'string' ),
					'gradient'        => array( 'type' => 'string' ),
				),
			),
			array(
				'key' => '_kad_header_flex',
				'type'          => 'object',
				'default'       => array(
					'direction'         => array( '', '', '' ),
					'justifyContent'    => array( '', '', '' ),
					'verticalAlignment' => array( '', '', '' ),
				),
				'properties' => array(
					'direction'         => array( 'type' => 'array' ),
					'justifyContent'    => array( 'type' => 'array' ),
					'verticalAlignment' => array( 'type' => 'array' ),
				),
			),
			array(
				'key'     => '_kad_header_anchor',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_header_className',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_header_padding',
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_header_tabletPadding',
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_header_mobilePadding',
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_header_paddingUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_header_margin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_header_tabletMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_header_mobileMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_header_marginUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_header_linkColor',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_header_linkHoverColor',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_header_height',
				'default'       => array( '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_header_heightUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_header_width',
				'default'       => array( '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_header_widthUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_header_isSticky',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_isStickyTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_isStickyMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_isTransparent',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_isTransparentTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_isTransparentMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_autoTransparentSpacing',
				'default' => false,
				'type'    => 'boolean',
			),
			array(
				'key'     => '_kad_header_stickySection',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_stickySectionTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_stickySectionMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_shrinkMain',
				'default' => false,
				'type'    => 'boolean',
			),
			array(
				'key'     => '_kad_header_shrinkMainHeight',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_shrinkMainHeightTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_shrinkMainHeightMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_revealScrollUp',
				'default' => false,
				'type'    => 'boolean',
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

				if ( ! empty( $meta['properties'] ) ) {
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

Kadence_Blocks_Header_CPT_Controller::get_instance();
