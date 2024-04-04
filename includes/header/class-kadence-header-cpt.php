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
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', 'solid', '' ),
					'right'  => array( '', 'solid', '' ),
					'bottom' => array( '', 'solid', '' ),
					'left'   => array( '', 'solid', '' ),
					'unit'   => 'px',
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
				'key' => '_kad_header_hoverBorder',
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', 'solid', '' ),
					'right'  => array( '', 'solid', '' ),
					'bottom' => array( '', 'solid', '' ),
					'left'   => array( '', 'solid', '' ),
					'unit'   => 'px',
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
				'key' => '_kad_header_tabletHoverBorder',
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => 'px',
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
				'key' => '_kad_header_mobileHoverBorder',
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => 'px',
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
				'key' => '_kad_form_tabletBorder',
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => 'px',
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
				'key' => '_kad_form_mobileBorder',
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => 'px',
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
				'key'           => '_kad_header_borderRadius',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_tabletBorderRadius',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_mobileBorderRadius',
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
				'key'           => '_kad_header_borderHoverRadius',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_tabletBorderHoverRadius',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'           => '_kad_header_mobileBorderHoverRadius',
				'default'       => array( 0, 0, 0, 0 ),
				'type'          => 'array',
				'children_type' => 'integer',
			),
			array(
				'key'     => '_kad_header_borderHoverRadiusUnit',
				'default' => 'px',
				'type'    => 'string',
			),
			array(
				'key'     => '_kad_header_textColor',
				'default' => '',
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
				'key'     => '_kad_header_style',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_styleTablet',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_styleMobile',
				'type' => 'string',
				'default' => '',
			),
			array(
				'key'     => '_kad_header_autoTransparentSpacing',
				'default' => true,
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
