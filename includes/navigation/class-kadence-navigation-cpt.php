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
		add_filter( 'user_has_cap', array( $this, 'filter_post_type_user_caps' ) );

		if( is_admin() ) {
			if ( class_exists( 'Cpt_To_Template' ) ) {
				new Cpt_To_Template( $this->post_type );
			}
		}
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
					'name'                  => _x( 'Kadence Navigation', 'post type general name', 'kadence-blocks' ),
					'singular_name'         => _x( 'Kadence Navigation', 'post type singular name', 'kadence-blocks' ),
					'add_new'               => __( 'Add New Kadence Navigation Menu', 'kadence-blocks' ),
					'add_new_item'          => __( 'Add New Kadence Navigation Menu', 'kadence-blocks' ),
					'new_item'              => __( 'New Kadence Navigation Menu', 'kadence-blocks' ),
					'edit_item'             => __( 'Edit Kadence Navigation Menu', 'kadence-blocks' ),
					'view_item'             => __( 'View Kadence Navigation Menu', 'kadence-blocks' ),
					'all_items'             => __( 'Kadence Navigation Menus', 'kadence-blocks' ),
					'search_items'          => __( 'Search Kadence Navigation Menus', 'kadence-blocks' ),
					'parent_item_colon'     => __( 'Parent Kadence Navigation Menu:', 'kadence-blocks' ),
					'not_found'             => __( 'No Kadence Navigation Menu found.', 'kadence-blocks' ),
					'not_found_in_trash'    => __( 'No Kadence Navigation Menu found in Trash.', 'kadence-blocks' ),
					'archives'              => __( 'Kadence Navigation Menu archives', 'kadence-blocks' ),
					'insert_into_item'      => __( 'Insert into Kadence Navigation Menu', 'kadence-blocks' ),
					'uploaded_to_this_item' => __( 'Uploaded to this Kadence Navigation Menu', 'kadence-blocks' ),
					'filter_items_list'     => __( 'Filter Kadence Navigation Menu list', 'kadence-blocks' ),
					'items_list_navigation' => __( 'Kadence Navigation Menus list navigation', 'kadence-blocks' ),
					'items_list'            => __( 'Kadence Navigation Menus list', 'kadence-blocks' ),
				),
				'description'           => __( 'Kadence Navigation menus that can be inserted into your site.', 'kadence-blocks' ),
				'public'                => false,
				'has_archive'           => false,
				'show_ui'               => true,
				'show_in_menu'          => true,
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
					'custom-fields',
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


	/**
	 * Filters the capabilities of a user to conditionally grant them capabilities for managing navigations.
	 *
	 * Any user who can 'edit_others_pages' will have access to manage navigations.
	 *
	 * @param array $allcaps A user's capabilities.
	 * @return array Filtered $allcaps.
	 */
	public function filter_post_type_user_caps( $allcaps ) {
		if ( isset( $allcaps['edit_others_pages'] ) ) {
			$allcaps['edit_kadence_navigation']             = $allcaps['edit_others_pages'];
			$allcaps['edit_others_kadence_navigation']      = $allcaps['edit_others_pages'];
			$allcaps['edit_published_kadence_navigation']   = $allcaps['edit_others_pages'];
			$allcaps['edit_private_kadence_navigation']     = $allcaps['edit_others_pages'];
			$allcaps['delete_kadence_navigation']           = $allcaps['edit_others_pages'];
			$allcaps['delete_others_kadence_navigation']    = $allcaps['edit_others_pages'];
			$allcaps['delete_published_kadence_navigation'] = $allcaps['edit_others_pages'];
			$allcaps['delete_private_kadence_navigation']   = $allcaps['edit_others_pages'];
			$allcaps['publish_kadence_navigation']          = $allcaps['edit_others_pages'];
			$allcaps['read_private_kadence_navigation']     = $allcaps['edit_others_pages'];
		}
		return $allcaps;
	}

	public function register_meta() {
		$register_meta = array(
			array(
				'key'     => '_kad_navigation_description',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_anchor',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_className',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_navigation_padding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_tabletPadding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_mobilePadding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
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
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_tabletMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_mobileMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_navigation_marginUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_navigation_paddingDropdown',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_tabletPaddingDropdown',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_mobilePaddingDropdown',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_navigation_paddingDropdownUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_navigation_marginDropdown',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_tabletMarginDropdown',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_mobileMarginDropdown',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_navigation_marginDropdownUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_orientation',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_orientationTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_orientationMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_spacing',
				'type' => 'array',
				'default' => array( '', '', '', '' ),
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_navigation_spacingTablet',
				'type' => 'array',
				'default' => array( '', '', '', '' ),
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_navigation_spacingMobile',
				'type' => 'array',
				'default' => array( '', '', '', '' ),
				'children_type' => 'string',
			),
			array(
				'key'     => '_kad_navigation_style',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_styleTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_styleMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_spacingUnit',
				'type' => 'string',
				'default' => 'em',
			),
			array(
				'key'     => '_kad_navigation_stretch',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_stretchTablet',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_stretchMobile',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_fillStretch',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_fillStretchTablet',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_fillStretchMobile',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_parentActive',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_parentActiveTablet',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_parentActiveMobile',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_collapseSubMenus',
				'type' => 'boolean',
				'default' => true,
			),
			array(
				'key'     => '_kad_navigation_collapseSubMenusTablet',
				'type' => 'boolean',
				'default' => true,
			),
			array(
				'key'     => '_kad_navigation_collapseSubMenusMobile',
				'type' => 'boolean',
				'default' => true,
			),
			array(
				'key'     => '_kad_navigation_parentTogglesMenus',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_parentTogglesMenusTablet',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_parentTogglesMenusMobile',
				'type' => 'boolean',
				'default' => false,
			),
			array(
				'key'     => '_kad_navigation_linkColor',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_background',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdown',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorDropdownActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdown',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundDropdownActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparent',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorTransparentActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparent',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundTransparentActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorSticky',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_linkColorStickyActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundSticky',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyHover',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyActive',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyHoverTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyActiveTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyHoverMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_backgroundStickyActiveMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_divider',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_dividerTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_dividerMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_dropdownDivider',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_dropdownDividerTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_dropdownDividerMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_transparentDivider',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_transparentDividerTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_transparentDividerMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_stickyDivider',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_stickyDividerTablet',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_stickyDividerMobile',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'top' => array( '', '', '' ),
						'right' => array( '', '', '' ),
						'bottom' => array( '', '', '' ),
						'left' => array( '', '', '' ),
						'unit' => 'px',
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
				'key'     => '_kad_navigation_typography',
				'default'       => array(
					array(
						'size'    => array( '', '', '' ),
						'sizetype'  => 'px',
						'lineHeight' => array( '', '', '' ),
						'lineType'   => '',
						'letterSpacing'   => array( '', '', '' ),
						'letterType' => 'px',
						'textTransform' => '',
						'family' => '',
						'google' => false,
						'style' => '',
						'weight' => '',
						'variant' => '',
						'subset' => '',
						'loadgoogle' => true,
					),
				),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'size'    => array( 'type' => 'array' ),
					'sizetype'  => array( 'type' => 'string' ),
					'lineHeight' => array( 'type' => 'array' ),
					'lineType'   => array( 'type' => 'string' ),
					'letterSpacing'   => array( 'type' => 'array' ),
					'letterType'   => array( 'type' => 'string' ),
					'textTransform'   => array( 'type' => 'string' ),
					'family'   => array( 'type' => 'string' ),
					'google'   => array( 'type' => 'boolean' ),
					'style'   => array( 'type' => 'string' ),
					'weight'   => array( 'type' => 'string' ),
					'variant'   => array( 'type' => 'string' ),
					'subset'   => array( 'type' => 'string' ),
					'loadgoogle'   => array( 'type' => 'boolean' ),
				),
			),
			array(
				'key'     => '_kad_navigation_dropdownTypography',
				'default'       => array(
					array(
						'size'    => array( '', '', '' ),
						'sizetype'  => 'px',
						'lineHeight' => array( '', '', '' ),
						'lineType'   => '',
						'letterSpacing'   => array( '', '', '' ),
						'letterType' => 'px',
						'textTransform' => '',
						'family' => '',
						'google' => false,
						'style' => '',
						'weight' => '',
						'variant' => '',
						'subset' => '',
						'loadgoogle' => true,
					),
				),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'size'    => array( 'type' => 'array' ),
					'sizetype'  => array( 'type' => 'string' ),
					'lineHeight' => array( 'type' => 'array' ),
					'lineType'   => array( 'type' => 'string' ),
					'letterSpacing'   => array( 'type' => 'array' ),
					'letterType'   => array( 'type' => 'string' ),
					'textTransform'   => array( 'type' => 'string' ),
					'family'   => array( 'type' => 'string' ),
					'google'   => array( 'type' => 'boolean' ),
					'style'   => array( 'type' => 'string' ),
					'weight'   => array( 'type' => 'string' ),
					'variant'   => array( 'type' => 'string' ),
					'subset'   => array( 'type' => 'string' ),
					'loadgoogle'   => array( 'type' => 'boolean' ),
				),
			),
			array(
				'key'     => '_kad_navigation_dropdownWidth',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownWidthTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownWidthMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownWidthUnit',
				'type' => 'string',
				'default' => 'px',
			),
			array(
				'key'     => '_kad_navigation_dropdownVerticalSpacing',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownVerticalSpacingTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownVerticalSpacingMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownVerticalSpacingUnit',
				'type' => 'string',
				'default' => 'em',
			),
			array(
				'key'     => '_kad_navigation_dropdownHorizontalAlignment',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownHorizontalAlignmentTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownHorizontalAlignmentMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key' => '_kad_navigation_dropdownShadow',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'enable' => false,
						'color' => '#000000',
						'opacity' => 0.2,
						'spread' => 0,
						'blur' => 2,
						'hOffset' => 1,
						'vOffset' => 1,
						'inset' => false,
					),
				),
				'properties' => array(
					'enable'    => array( 'type' => 'boolean' ),
					'color'    => array( 'type' => 'string' ),
					'opacity'  => array( 'type' => 'number' ),
					'spread'  => array( 'type' => 'number' ),
					'blur'  => array( 'type' => 'number' ),
					'hOffset'  => array( 'type' => 'number' ),
					'vOffset'  => array( 'type' => 'number' ),
					'inset'    => array( 'type' => 'boolean' ),
				),
			),
			array(
				'key'     => '_kad_navigation_dropdownReveal',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownRevealTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_navigation_dropdownRevealMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key' => '_kad_navigation_dropdownBorder',
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
				'key' => '_kad_navigation_dropdownBorderTablet',
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
				'key' => '_kad_navigation_dropdownBorderMobile',
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
				'key'           => '_kad_navigation_dropdownBorderRadius',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_navigation_dropdownBorderRadiusTablet',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_navigation_dropdownBorderRadiusMobile',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_navigation_dropdownBorderRadiusUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_backgroundType',
				'default' => 'normal',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_backgroundTypeHover',
				'default' => 'normal',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_backgroundTypeActive',
				'default' => 'normal',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_backgroundGradient',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_backgroundGradientHover',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_backgroundGradientActive',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key' => '_kad_navigation_border',
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
				'key' => '_kad_navigation_borderTablet',
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
				'key' => '_kad_navigation_borderMobile',
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
				'key' => '_kad_navigation_borderHover',
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
				'key' => '_kad_navigation_borderHoverTablet',
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
				'key' => '_kad_navigation_borderHoverMobile',
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
				'key' => '_kad_navigation_borderActive',
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
				'key' => '_kad_navigation_borderActiveTablet',
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
				'key' => '_kad_navigation_borderActiveMobile',
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
				'key'           => '_kad_navigation_borderRadius',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusTablet',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusMobile',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusHover',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusHoverTablet',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusHoverMobile',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusActive',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusActiveTablet',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'           => '_kad_navigation_borderRadiusActiveMobile',
				'default'       => array( '', '','', '' ),
				'type'          => 'array',
			),
			array(
				'key'     => '_kad_navigation_borderRadiusUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_borderRadiusUnitHover',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_navigation_borderRadiusUnitActive',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key' => '_kad_navigation_shadow',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'enable' => false,
						'color' => '#000000',
						'opacity' => 0.2,
						'spread' => 0,
						'blur' => 2,
						'hOffset' => 1,
						'vOffset' => 1,
						'inset' => false,
					),
				),
				'properties' => array(
					'enable'    => array( 'type' => 'boolean' ),
					'color'    => array( 'type' => 'string' ),
					'opacity'  => array( 'type' => 'number' ),
					'spread'  => array( 'type' => 'number' ),
					'blur'  => array( 'type' => 'number' ),
					'hOffset'  => array( 'type' => 'number' ),
					'vOffset'  => array( 'type' => 'number' ),
					'inset'    => array( 'type' => 'boolean' ),
				),
			),
			array(
				'key' => '_kad_navigation_shadowHover',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'enable' => false,
						'color' => '#000000',
						'opacity' => 0.2,
						'spread' => 0,
						'blur' => 2,
						'hOffset' => 1,
						'vOffset' => 1,
						'inset' => false,
					),
				),
				'properties' => array(
					'enable'    => array( 'type' => 'boolean' ),
					'color'    => array( 'type' => 'string' ),
					'opacity'  => array( 'type' => 'number' ),
					'spread'  => array( 'type' => 'number' ),
					'blur'  => array( 'type' => 'number' ),
					'hOffset'  => array( 'type' => 'number' ),
					'vOffset'  => array( 'type' => 'number' ),
					'inset'    => array( 'type' => 'boolean' ),
				),
			),
			array(
				'key' => '_kad_navigation_shadowActive',
				'type' => 'array',
				'children_type' => 'object',
				'default' => array(
					array(
						'enable' => false,
						'color' => '#000000',
						'opacity' => 0.2,
						'spread' => 0,
						'blur' => 2,
						'hOffset' => 1,
						'vOffset' => 1,
						'inset' => false,
					),
				),
				'properties' => array(
					'enable'    => array( 'type' => 'boolean' ),
					'color'    => array( 'type' => 'string' ),
					'opacity'  => array( 'type' => 'number' ),
					'spread'  => array( 'type' => 'number' ),
					'blur'  => array( 'type' => 'number' ),
					'hOffset'  => array( 'type' => 'number' ),
					'vOffset'  => array( 'type' => 'number' ),
					'inset'    => array( 'type' => 'boolean' ),
				),
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
							'type' => isset($meta['children_type']) ? $meta['children_type'] : ''
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
