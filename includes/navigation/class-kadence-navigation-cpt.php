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
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_tabletPadding',
				'default'       => array( '20', '20', '20', '20' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_mobilePadding',
				'default'       => array( '20', '20', '20', '20' ),
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
				'key'           => '_kad_navigation_border',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
			),
			array(
				'key'           => '_kad_navigation_borderRadius',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string',
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
				'key'     => '_kad_navigation_typography',
				'default'       => array( array(
					'size'    => array( '', '', '' ),
					'sizetype'  => 'px',
					'lineHeight' => array( '', '', '' ),
					'lineType'   => '',
					'letterSpacing'   => array( '', '', ''),
					'letterType' => 'px',
					'textTransform' => '',
					'family' => '',
					'google' => false,
					'style' => '',
					'weight' => '',
					'variant' => '',
					'subset' => '',
					'loadgoogle' => true
				) ),
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
