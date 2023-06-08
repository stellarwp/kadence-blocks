<?php
/**
 * Class managing the form CPT registration.
 */
class Kadence_Blocks_Form_CPT_Controller {
	const SLUG = 'kadence_form';
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
		// Build user permissions settings.
		add_filter( 'user_has_cap', array( $this, 'filter_post_type_user_caps' ) );
		// Register the meta settings for from post.
		add_action( 'init', array( $this, 'register_meta' ), 20 );
		// Define the form post gutenberg template.
		add_action( 'init', array( $this, 'form_gutenberg_template' ) );
		if ( is_admin() ) {
			// Filter Kadence Theme to give the correct admin editor layout.
			add_filter( 'kadence_post_layout', array( $this, 'single_form_layout' ), 99 );
		}
	}
	/**
	 * Registers the form post type.
	 */
	public function register_post_type() {
		$labels  = array(
			'name'               => _x( 'Forms', 'Post Type General Name', 'kadence_blocks' ),
			'singular_name'      => _x( 'Form', 'Post Type Singular Name', 'kadence_blocks' ),
			'menu_name'          => __( 'Forms', 'kadence_blocks' ),
			'menu_name'          => _x( 'Forms', 'Admin Menu text', 'kadence_blocks' ),
			'archives'           => __( 'Form Archives', 'kadence_blocks' ),
			'attributes'         => __( 'Form Attributes', 'kadence_blocks' ),
			'parent_item_colon'  => __( 'Parent Form:', 'kadence_blocks' ),
			'all_items'          => __( 'All Forms', 'kadence_blocks' ),
			'add_new_item'       => __( 'Add New Form', 'kadence_blocks' ),
			'new_item'           => __( 'New Form', 'kadence_blocks' ),
			'edit_item'          => __( 'Edit Form', 'kadence_blocks' ),
			'update_item'        => __( 'Update Form', 'kadence_blocks' ),
			'view_item'          => __( 'View Form', 'kadence_blocks' ),
			'view_items'         => __( 'View Forms', 'kadence_blocks' ),
			'search_items'       => __( 'Search Forms', 'kadence_blocks' ),
			'not_found'          => __( 'Not found', 'kadence_blocks' ),
			'not_found_in_trash' => __( 'Not found in Trash', 'kadence_blocks' ),
			'filter_items_list'  => __( 'Filter items list', 'kadence_blocks' ),
		);
		$rewrite = apply_filters( 'kadence_blocks_form_post_type_url_rewrite', array( 'slug' => 'kadence-form' ) );
		$args    = array(
			'labels'                => $labels,
			'description'           => __( 'Contact forms, subscribe forms and others for your site.', 'kadence_conversions' ),
			'public'                => false,
			'publicly_queryable'    => false,
			'has_archive'           => false,
			'exclude_from_search'   => true,
			'show_ui'               => true,
			'show_in_menu'          => 'kadence-blocks',
			'show_in_nav_menus'     => false,
			'show_in_admin_bar'     => false,
			'can_export'            => true,
			'show_in_rest'          => true,
			'rewrite'               => $rewrite,
			'rest_controller_class' => Kadence_Blocks_Form_CPT_Rest_Controller::class,
			'rest_base'             => 'kadence_form',
			'capability_type'       => array( 'kadence_form', 'kadence_forms' ),
			'map_meta_cap'          => true,
			'supports'              => array(
				'title',
				'editor',
				'author',
				'custom-fields',
				'revisions',
			),
		);
		register_post_type( self::SLUG, $args );
	}

	/**
	 * Renders the admin template.
	 *
	 * @param array $layout the layout array.
	 */
	public function single_form_layout( $layout ) {
		global $post;
		if ( is_singular( self::SLUG ) || ( is_admin() && is_object( $post ) && self::SLUG === $post->post_type ) ) {
			$layout = wp_parse_args(
				array(
					'layout'           => 'narrow',
					'boxed'            => 'unboxed',
					'feature'          => 'hide',
					'feature_position' => 'above',
					'comments'         => 'hide',
					'navigation'       => 'hide',
					'title'            => 'hide',
					'transparent'      => 'disable',
					'sidebar'          => 'disable',
					'vpadding'         => 'hide',
					'footer'           => 'disable',
					'header'           => 'disable',
					'content'          => 'enable',
				),
				$layout
			);
		}

		return $layout;
	}
	/**
	 * Add filters for element content output.
	 */
	public function form_gutenberg_template() {
		$post_type_object = get_post_type_object( self::SLUG );
		$post_type_object->template = array(
			array(
				'kadence/advanced-form',
			),
		);
		$post_type_object->template_lock = 'all';
	}
	/**
	 * Filters the capabilities of a user to conditionally grant them capabilities for managing forms.
	 *
	 * Any user who can 'edit_others_pages' will have access to manage forms.
	 *
	 * @param array $allcaps A user's capabilities.
	 * @return array Filtered $allcaps.
	 */
	public function filter_post_type_user_caps( $allcaps ) {
		if ( isset( $allcaps['edit_others_pages'] ) ) {
			$allcaps['edit_kadence_forms']             = $allcaps['edit_others_pages'];
			$allcaps['edit_others_kadence_forms']      = $allcaps['edit_others_pages'];
			$allcaps['edit_published_kadence_forms']   = $allcaps['edit_others_pages'];
			$allcaps['edit_private_kadence_forms']     = $allcaps['edit_others_pages'];
			$allcaps['delete_kadence_forms']           = $allcaps['edit_others_pages'];
			$allcaps['delete_others_kadence_forms']    = $allcaps['edit_others_pages'];
			$allcaps['delete_published_kadence_forms'] = $allcaps['edit_others_pages'];
			$allcaps['delete_private_kadence_forms']   = $allcaps['edit_others_pages'];
			$allcaps['publish_kadence_forms']          = $allcaps['edit_others_pages'];
			$allcaps['read_private_kadence_forms']     = $allcaps['edit_others_pages'];
		}
		return $allcaps;
	}
	/**
	 * Check that user can edit these.
	 */
	public function meta_auth_callback() {
		return current_user_can( 'edit_kadence_forms' );
	}
	/**
	 * Register Post Meta options
	 */
	public function register_meta() {
		register_post_meta(
			'kadence_form',
			'_kad_form_fields',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'array',
				'default'       => array(),
				'show_in_rest'  => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type'       => 'object',
							'properties' => array(
								'uniqueID' => array( 'type' => 'string' ),
								'name'     => array( 'type' => 'string' ),
								'label'    => array( 'type' => 'string' ),
								'type'     => array( 'type' => 'string' ),
							),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_email',
			array(
				'type'          => 'object',
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'default'       => array(
					'emailTo'   => '',
					'subject'   => '',
					'fromEmail' => '',
					'fromName'  => '',
					'replyTo'   => 'email_field',
					'cc'        => '',
					'bcc'       => '',
					'html'      => true
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'emailTo'   => array( 'type' => 'string' ),
							'subject'   => array( 'type' => 'string' ),
							'fromEmail' => array( 'type' => 'string' ),
							'fromName'  => array( 'type' => 'string' ),
							'replyTo'   => array( 'type' => 'string' ),
							'cc'        => array( 'type' => 'string' ),
							'bcc'       => array( 'type' => 'string' ),
							'html'      => array( 'type' => 'boolean' )
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_mailerlite',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'group' => array(),
					'map' => array(),
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'group' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'string' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'map'  => array(
								'type' => 'object',
								'additionalProperties' => array(
									'type' => 'string',
								),
							),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_fluentcrm',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array( "lists" => array(), "tags" => array(), "map" => array(), "doubleOptin" => false ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'lists'       => array( 'type' => 'array' ),
							'tags'        => array( 'type' => 'array' ),
							'map'  => array(
								'type' => 'object',
								'additionalProperties' => array(
									'type' => 'string',
								),
							),
							'doubleOptin' => array( 'type' => 'boolean' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_sendinblue',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'lists' => array(),
					'map' => array(),
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'lists' => array(
								'type' => 'array',
							),
							'map'  => array(
								'type' => 'object',
								'additionalProperties' => array(
									'type' => 'string',
								),
							),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_mailchimp',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'list' => array(),
					'map' => array(),
					'groups' => array(),
					'tags' => array(),
					'doubleOptin' => false,
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'list' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'string' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'map'  => array(
								'type' => 'object',
								'additionalProperties' => array(
									'type' => 'string',
								),
							),
							'groups'  => array( 'type' => 'array' ),
							'tags'  => array( 'type' => 'array' ),
							'doubleOptin'  => array( 'type' => 'boolean' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_convertkit',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array( 'form' => array(), 'sequence' => array(), 'tags' => array(), 'map' => array() ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'form'     => array( 'type' => 'array' ),
							'sequence' => array( 'type' => 'array' ),
							'tags'     => array( 'type' => 'array' ),
							'map'      => array( 'type' => 'array' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_activecampaign',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'list' => array(),
					'automation' => array(),
					'tags' => array(),
					'map' => array(),
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'list' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'string' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'automation' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'string' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'tags'  => array( 'type' => 'array' ),
							'map'   => array( 'type' => 'array' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_redirect',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'string',
				'default'       => ''
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_recaptcha',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'boolean',
				'default'       => false
			)
		);


		register_post_meta(
			'kadence_form',
			'_kad_form_recaptchaVersion',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'string',
				'default'       => 'v3'
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_submitLabel',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'string',
				'default'       => ''
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_submit',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"label"                  => "Submit",
					"width"                  => array(
						"100",
						"",
						""
					),
					"size"                   => "standard",
					"widthType"              => "auto",
					"fixedWidth"             => array(
						"",
						"",
						""
					),
					"align"                  => array(
						"",
						"",
						""
					),
					"deskPadding"            => array(
						"",
						"",
						"",
						""
					),
					"tabletPadding"          => array(
						"",
						"",
						"",
						""
					),
					"mobilePadding"          => array(
						"",
						"",
						"",
						""
					),
					"color"                  => "",
					"background"             => "",
					"border"                 => "",
					"backgroundOpacity"      => 1,
					"borderOpacity"          => 1,
					"borderRadius"           => "",
					"borderWidth"            => array(
						"",
						"",
						"",
						""
					),
					"colorHover"             => "",
					"backgroundHover"        => "",
					"borderHover"            => "",
					"backgroundHoverOpacity" => 1,
					"borderHoverOpacity"     => 1,
					"icon"                   => "",
					"iconSide"               => "right",
					"iconHover"              => false,
					"cssClass"               => "",
					"gradient"               => array(
						"#999999",
						1,
						0,
						100,
						"linear",
						180,
						"center center"
					),
					"gradientHover"          => array(
						"#777777",
						1,
						0,
						100,
						"linear",
						180,
						"center center"
					),
					"btnStyle"               => "basic",
					"btnSize"                => "standard",
					"backgroundType"         => "solid",
					"backgroundHoverType"    => "solid",
					"boxShadow"              => array(
						false,
						"#000000",
						0.2,
						1,
						1,
						2,
						0,
						false
					),
					"boxShadowHover"         => array(
						false,
						"#000000",
						0.4,
						2,
						2,
						3,
						0,
						false
					)
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							"label"                  => array( 'type' => 'string' ),
							"width"                  => array( 'type' => 'array' ),
							"size"                   => array( 'type' => 'string' ),
							"widthType"              => array( 'type' => 'string' ),
							"fixedWidth"             => array( 'type' => 'array' ),
							"align"                  => array( 'type' => 'array' ),
							"deskPadding"            => array( 'type' => 'array' ),
							"tabletPadding"          => array( 'type' => 'array' ),
							"mobilePadding"          => array( 'type' => 'array' ),
							"color"                  => array( 'type' => 'string' ),
							"background"             => array( 'type' => 'string' ),
							"border"                 => array( 'type' => 'string' ),
							"backgroundOpacity"      => array( 'type' => 'number' ),
							"borderOpacity"          => array( 'type' => 'number' ),
							"borderRadius"           => array( 'type' => 'string' ),
							"borderWidth"            => array( 'type' => 'array' ),
							"colorHover"             => array( 'type' => 'string' ),
							"backgroundHover"        => array( 'type' => 'string' ),
							"borderHover"            => array( 'type' => 'string' ),
							"backgroundHoverOpacity" => array( 'type' => 'number' ),
							"borderHoverOpacity"     => array( 'type' => 'number' ),
							"icon"                   => array( 'type' => 'string' ),
							"iconSide"               => array( 'type' => 'string' ),
							"iconHover"              => array( 'type' => 'boolean' ),
							"cssClass"               => array( 'type' => 'string' ),
							"gradient"               => array( 'type' => 'array' ),
							"gradientHover"          => array( 'type' => 'array' ),
							"btnStyle"               => array( 'type' => 'string' ),
							"btnSize"                => array( 'type' => 'string' ),
							"backgroundType"         => array( 'type' => 'string' ),
							"backgroundHoverType"    => array( 'type' => 'string' ),
							"boxShadow"              => array( 'type' => 'array' ),
							"boxShadowHover"         => array( 'type' => 'array' )
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_webhook',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array( "url" => '', "map" => array() ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'url' => array( 'type' => 'string' ),
							'map' => array( 'type' => 'array' )
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_autoEmail',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"emailTo"   => '',
					"subject"   => '',
					"message"   => '',
					"fromEmail" => '',
					"fromName"  => '',
					"replyTo"   => '',
					"cc"        => '',
					"bcc"       => '',
					"html"      => true
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'emailTo'   => array( 'type' => 'string' ),
							'subject'   => array( 'type' => 'string' ),
							'message'   => array( 'type' => 'string' ),
							'fromEmail' => array( 'type' => 'string' ),
							'fromName'  => array( 'type' => 'string' ),
							'replyTo'   => array( 'type' => 'string' ),
							'cc'        => array( 'type' => 'string' ),
							'bcc'       => array( 'type' => 'string' ),
							'html'      => array( 'type' => 'boolean' )
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_entry',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"formName"   => '',
					"userIP"     => true,
					"userDevice" => true,
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'formName'   => array( 'type' => 'string' ),
							'userIP'     => array( 'type' => 'boolean' ),
							'userDevice' => array( 'type' => 'boolean' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_fieldBorderRadius',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array( "", "", "" ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'array',
						'properties' => array( "", "", "" ),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_tabletFieldBorderRadius',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array( "", "", "" ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'array',
						'properties' => array( "", "", "" ),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_mobileFieldBorderRadius',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array( "", "", "" ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'array',
						'properties' => array( "", "", "" ),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_fieldBorderRadiusUnit',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => "px",
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'string',
						'properties' => "px",
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_fieldBorderStyle',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'top'    => array( 'type' => 'array' ),
							'right'  => array( 'type' => 'array' ),
							'bottom' => array( 'type' => 'array' ),
							'left'   => array( 'type' => 'array' ),
							'unit'   => array( 'type' => 'string' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_tabletFieldBorderStyle',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'top'    => array( 'type' => 'array' ),
							'right'  => array( 'type' => 'array' ),
							'bottom' => array( 'type' => 'array' ),
							'left'   => array( 'type' => 'array' ),
							'unit'   => array( 'type' => 'string' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_mobileFieldBorderStyle',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'top'    => array( 'type' => 'array' ),
							'right'  => array( 'type' => 'array' ),
							'bottom' => array( 'type' => 'array' ),
							'left'   => array( 'type' => 'array' ),
							'unit'   => array( 'type' => 'string' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_messages',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"success"        => '',
					"error"          => '',
					"required"       => '',
					"invalid"        => '',
					"recaptchaerror" => '',
					"preError"       => '',
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'success'        => array( 'type' => 'string' ),
							'error'          => array( 'type' => 'string' ),
							'required'       => array( 'type' => 'string' ),
							'invalid'        => array( 'type' => 'string' ),
							'recaptchaerror' => array( 'type' => 'string' ),
							'preError'       => array( 'type' => 'string' ),

						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_submitFont',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"size"          => array(
						"",
						"",
						""
					),
					"sizeType"      => "px",
					"lineHeight"    => array(
						"",
						"",
						""
					),
					"lineType"      => "px",
					"letterSpacing" => "",
					"textTransform" => "",
					"family"        => "",
					"google"        => "",
					"style"         => "",
					"weight"        => "",
					"variant"       => "",
					"subset"        => "",
					"loadGoogle"    => true
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'size'          => array( 'type' => 'array' ),
							'sizeType'      => array( 'type' => 'string' ),
							'lineHeight'    => array( 'type' => 'array' ),
							'lineType'      => array( 'type' => 'string' ),
							'letterSpacing' => array( 'type' => 'string' ),
							'textTransform' => array( 'type' => 'string' ),
							'family'        => array( 'type' => 'string' ),
							'google'        => array( 'type' => 'string' ),
							'style'         => array( 'type' => 'string' ),
							'weight'        => array( 'type' => 'string' ),
							'variant'       => array( 'type' => 'string' ),
							'subset'        => array( 'type' => 'string' ),
							'loadGoogle'    => array( 'type' => 'boolean' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_submitMargin',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"desk"    => array(
						"",
						"",
						"",
						""
					),
					"tablet"  => array(
						"",
						"",
						"",
						""
					),
					"mobile"  => array(
						"",
						"",
						"",
						""
					),
					"unit"    => "px",
					"control" => "linked"
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'desk'    => array( 'type' => 'array' ),
							'tablet'  => array( 'type' => 'array' ),
							'mobile'  => array( 'type' => 'array' ),
							'unit'    => array( 'type' => 'string' ),
							'control' => array( 'type' => 'string' ),

						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_inputFont',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"color"         => "",
					"colorActive"   => "",
					"size"          => array(
						"",
						"",
						""
					),
					"sizeType"      => "px",
					"lineHeight"    => array(
						"",
						"",
						""
					),
					"lineType"      => "px",
					"letterSpacing" => "",
					"textTransform" => "",
					"family"        => "",
					"google"        => "",
					"style"         => "",
					"weight"        => "",
					"variant"       => "",
					"subset"        => "",
					"loadGoogle"    => true,
					"padding"       => array(
						"",
						"",
						"",
						""
					),
					"margin"        => array(
						"",
						"",
						"",
						""
					)
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'color'         => array( 'type' => 'string' ),
							'colorActive'   => array( 'type' => 'string' ),
							'size'          => array( 'type' => 'array' ),
							'sizeType'      => array( 'type' => 'string' ),
							'lineHeight'    => array( 'type' => 'array' ),
							'lineType'      => array( 'type' => 'string' ),
							'letterSpacing' => array( 'type' => 'string' ),
							'textTransform' => array( 'type' => 'string' ),
							"family"        => array( 'type' => 'string' ),
							'google'        => array( 'type' => 'string' ),
							'style'         => array( 'type' => 'string' ),
							'weight'        => array( 'type' => 'string' ),
							'variant'       => array( 'type' => 'string' ),
							'subset'        => array( 'type' => 'string' ),
							'loadGoogle'    => array( 'type' => 'boolean' ),
							'padding'       => array( 'type' => 'array' ),
							'margin'        => array( 'type' => 'array' )
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_style',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"showRequired"            => true,
					"size"                    => "standard",
					"deskPadding"             => array(
						"",
						"",
						"",
						""
					),
					"tabletPadding"           => array(
						"",
						"",
						"",
						""
					),
					"mobilePadding"           => array(
						"",
						"",
						"",
						""
					),
					"color"                   => "",
					"requiredColor"           => "",
					"background"              => "",
					"backgroundOpacity"       => 1,
					"backgroundActive"        => "",
					"backgroundActiveOpacity" => 1,
					"placeholderColor"        => "",
					"gradient"                => "",
					"gradientActive"          => "",
					"backgroundType"          => "solid",
					"backgroundActiveType"    => "solid",
					"boxShadow"               => array(
						false,
						"#000000",
						0.2,
						1,
						1,
						2,
						0,
						false
					),
					"boxShadowActive"         => array(
						false,
						"#000000",
						0.4,
						2,
						2,
						3,
						0,
						false
					),
					"lineHeight"              => array(
						"",
						"",
						""
					),
					"lineType"                => "px",
					"rowGap"                  => "",
					"rowGapType"              => "px",
					"tabletRowGap"            => "",
					"mobileRowGap"            => "",
					"tabletGutter"            => "",
					"mobileGutter"            => ""
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'showRequired'            => array( 'type' => 'boolean' ),
							'size'                    => array( 'type' => 'string' ),
							'deskPadding'             => array( 'type' => 'array' ),
							'tabletPadding'           => array( 'type' => 'array' ),
							'mobilePadding'           => array( 'type' => 'array' ),
							'color'                   => array( 'type' => 'string' ),
							'requiredColor'           => array( 'type' => 'string' ),
							'background'              => array( 'type' => 'string' ),
							"border"                  => array( 'type' => 'string' ),
							'backgroundOpacity'       => array( 'type' => 'number' ),
							'borderOpacity'           => array( 'type' => 'number' ),
							'borderRadius'            => array( 'type' => 'string' ),
							'borderWidth'             => array( 'type' => 'array' ),
							'colorActive'             => array( 'type' => 'string' ),
							'backgroundActive'        => array( 'type' => 'string' ),
							'borderActive'            => array( 'type' => 'string' ),
							'backgroundActiveOpacity' => array( 'type' => 'number' ),
							'borderActiveOpacity'     => array( 'type' => 'number' ),
							'placeholderColor'        => array( 'type' => 'string' ),
							'gradient'                => array( 'type' => 'string' ),
							'gradientActive'          => array( 'type' => 'string' ),
							'backgroundType'          => array( 'type' => 'string' ),
							'backgroundActiveType'    => array( 'type' => 'string' ),
							'boxShadow'               => array( 'type' => 'array' ),
							'boxShadowActive'         => array( 'type' => 'array' ),
							'fontSize'                => array( 'type' => 'array' ),
							'fontSizeType'            => array( 'type' => 'string' ),
							'lineHeight'              => array( 'type' => 'array' ),
							'lineType'                => array( 'type' => 'string' ),
							'rowGap'                  => array( 'type' => 'string' ),
							'rowGapType'              => array( 'type' => 'string' ),
							'gutter'                  => array( 'type' => 'string' ),
							'gutterType'              => array( 'type' => 'string' ),
							'tabletRowGap'            => array( 'type' => 'string' ),
							'mobileRowGap'            => array( 'type' => 'string' ),
							'tabletGutter'            => array( 'type' => 'string' ),
							'mobileGutter'            => array( 'type' => 'string' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_labelFont',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"color"         => "",
					"size"          => array(
						"",
						"",
						""
					),
					"sizeType"      => "px",
					"lineHeight"    => array(
						"",
						"",
						""
					),
					"lineType"      => "px",
					"letterSpacing" => "",
					"textTransform" => "",
					"family"        => "",
					"google"        => "",
					"style"         => "",
					"weight"        => "",
					"variant"       => "",
					"subset"        => "",
					"loadGoogle"    => true,
					"padding"       => array(
						"",
						"",
						"",
						""
					),
					"margin"        => array(
						"",
						"",
						"",
						""
					)
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'color'         => array( 'type' => 'string' ),
							'size'          => array( 'type' => 'array' ),
							'sizeType'      => array( 'type' => 'string' ),
							'lineHeight'    => array( 'type' => 'array' ),
							'lineType'      => array( 'type' => 'string' ),
							'letterSpacing' => array( 'type' => 'string' ),
							'textTransform' => array( 'type' => 'string' ),
							"family"        => array( 'type' => 'string' ),
							'google'        => array( 'type' => 'string' ),
							'style'         => array( 'type' => 'string' ),
							'weight'        => array( 'type' => 'string' ),
							'variant'       => array( 'type' => 'string' ),
							'subset'        => array( 'type' => 'string' ),
							'loadGoogle'    => array( 'type' => 'boolean' ),
							'padding'       => array( 'type' => 'array' ),
							'margin'        => array( 'type' => 'array' )
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_helpFont',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					"color"         => "",
					"size"          => array(
						"",
						"",
						""
					),
					"sizeType"      => "px",
					"lineHeight"    => array(
						"",
						"",
						""
					),
					"lineType"      => "px",
					"letterSpacing" => "",
					"textTransform" => "",
					"family"        => "",
					"google"        => "",
					"style"         => "",
					"weight"        => "",
					"variant"       => "",
					"subset"        => "",
					"loadGoogle"    => true,
					"padding"       => array(
						"",
						"",
						"",
						""
					),
					"margin"        => array(
						"",
						"",
						"",
						""
					)
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'color'         => array( 'type' => 'string' ),
							'size'          => array( 'type' => 'array' ),
							'sizeType'      => array( 'type' => 'string' ),
							'lineHeight'    => array( 'type' => 'array' ),
							'lineType'      => array( 'type' => 'string' ),
							'letterSpacing' => array( 'type' => 'string' ),
							'textTransform' => array( 'type' => 'string' ),
							"family"        => array( 'type' => 'string' ),
							'google'        => array( 'type' => 'string' ),
							'style'         => array( 'type' => 'string' ),
							'weight'        => array( 'type' => 'string' ),
							'variant'       => array( 'type' => 'string' ),
							'subset'        => array( 'type' => 'string' ),
							'loadGoogle'    => array( 'type' => 'boolean' ),
							'padding'       => array( 'type' => 'array' ),
							'margin'        => array( 'type' => 'array' )
						),
					),
				),
			)
		);

		$register_meta = array(
			array(
				'key'           => '_kad_form_vAlign',
				'default'       => array( '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_hAlign',
				'default'       => array( '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_actions',
				'default'       => array(),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_padding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_tabletPadding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_mobilePadding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_form_paddingUnit',
				'default' => 'px',
				'type'    => 'string'
			),
			array(
				'key'           => '_kad_form_margin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_tabletMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_mobileMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_form_marginUnit',
				'default' => 'px',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_form_redirect',
				'default' => '',
				'type'    => 'string',
			),
			array(
				'key'           => '_kad_form_messageBorderRadius',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_tabletMessageBorderRadius',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_mobileMessageBorderRadius',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_form_messageBorderRadiusUnit',
				'default' => 'px',
				'type'    => 'string'
			),
			array(
				'key'           => '_kad_form_messagePadding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_tableMessagePadding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_mobileMessagePadding',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_form_messagePaddingUnit',
				'default' => 'px',
				'type'    => 'string'
			),
			array(
				'key'           => '_kad_form_messageMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_tabletMessageMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'           => '_kad_form_mobileMessageMargin',
				'default'       => array( '', '', '', '' ),
				'type'          => 'array',
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_form_messageMarginUnit',
				'default' => 'px',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_form_messageColor',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_form_messageBackground',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_form_messageColorError',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_form_messageBackgroundError',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'           => '_kad_form_messageBorderSuccess',
				'default'       => array( array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				) ),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				)
			),
			array(
				'key'           => '_kad_form_messageFont',
				'default'       => array( array(
					'size'    => array( '', '', '' ),
					'sizetype'  => 'px',
					'lineHeight' => array( '', '', '' ),
					'lineType'   => '',
					'letterSpacing'   => array( '', '', ''),
					'letterType' => 'px',
					'textTransform' => '',
					'family' => '',
					'google' => '',
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
					'google'   => array( 'type' => 'string' ),
					'style'   => array( 'type' => 'string' ),
					'weight'   => array( 'type' => 'string' ),
					'variant'   => array( 'type' => 'string' ),
					'subset'   => array( 'type' => 'string' ),
					'loadgoogle'   => array( 'type' => 'boolean' ),
				)
			),
			array(
				'key'           => '_kad_form_tabletMessageBorderSuccess',
				'default'       => array( array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				) ),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				)
			),
			array(
				'key'           => '_kad_form_mobileMessageBorderSuccess',
				'default'       => array( array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				) ),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				)
			),
			array(
				'key'           => '_kad_form_messageBorderError',
				'default'       => array( array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				) ),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				)
			),
			array(
				'key'           => '_kad_form_tabletMessageBorderError',
				'default'       => array( array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				) ),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				)
			),
			array(
				'key'           => '_kad_form_mobileMessageBorderError',
				'default'       => array( array(
					'top'    => array( '', '', '' ),
					'right'  => array( '', '', '' ),
					'bottom' => array( '', '', '' ),
					'left'   => array( '', '', '' ),
					'unit'   => ''
				) ),
				'type'          => 'array',
				'children_type' => 'object',
				'properties' => array(
					'top'    => array( 'type' => 'array' ),
					'right'  => array( 'type' => 'array' ),
					'bottom' => array( 'type' => 'array' ),
					'left'   => array( 'type' => 'array' ),
					'unit'   => array( 'type' => 'string' ),
				)
			),
			array(
				'key'     => '_kad_form_maxWidthUnit',
				'default' => 'px',
				'type'    => 'string'
			),
			array(
				'key'           => '_kad_form_maxWidth',
				'default'       => array( '', '', '' ),
				'type'          => 'array',
				'children_type' => 'integer'
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

Kadence_Blocks_Form_CPT_Controller::get_instance();

add_filter( 'default_content', function ( string $content, \WP_Post $post ) {
	if ( $post->post_type === 'kadence_form' ) {
		return serialize_block( [
			'blockName'    => 'kadence/advanced-form',
			'innerContent' => [],
			'attrs'        => [],
		] );
	}

	return $content;
}, 10, 2 );
