<?php

class Kadence_Blocks_Form_CPT_Controller extends WP_REST_Posts_Controller {
	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		parent::register_routes();

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/auto-draft',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_auto_draft' ),
					'permission_callback' => [ $this, 'create_item_permissions_check' ],
				)
			) );
	}

	/**
	 * Creates an auto draft.
	 *
	 * @param WP_REST_Request $request
	 *
	 * @return WP_REST_Response
	 */
	public function create_auto_draft( $request ) {
		require_once ABSPATH . 'wp-admin/includes/post.php';

		unset( $_REQUEST['content'], $_REQUEST['excerpt'] );
		$post = get_default_post_to_edit( $this->post_type, true );

		$request->set_param( 'context', 'edit' );

		return $this->prepare_item_for_response( $post, $request );
	}

	public function get_items_permissions_check( $request ) {
		if ( ! current_user_can( get_post_type_object( $this->post_type )->cap->edit_posts ) ) {
			return new WP_Error( 'rest_cannot_view', __( 'You do not have permission to view these posts.', 'kadence-blocks' ) );
		}

		return parent::get_items_permissions_check( $request );
	}

	public function get_item_permissions_check( $request ) {
		if ( ! current_user_can( 'edit_post', $request['id'] ) ) {
			return new WP_Error( 'rest_cannot_view', __( 'You do not have permission to view these posts.', 'kadence-blocks' ) );
		}

		return parent::get_item_permissions_check( $request );
	}
}


add_action( 'init', function () {
	register_post_type( 'kadence_form', array(
		'public'                => false,
		'show_in_menu'          => 'kadence-blocks',
		'show_ui'               => true,
		'show_in_rest'          => true,
		'rest_controller_class' => Kadence_Blocks_Form_CPT_Controller::class,
		'supports'              => array( 'title', 'editor', 'author', 'custom-fields', 'revisions' ),
		'taxonomies'            => array( 'post_tag' ),
		'template'              => array(
			array( 'kadence/advanced-form' )
		),
//		'template_lock'         => 'insert',
		'has_archive'           => false,
		'can_export'            => true,
		'show_in_nav_menus'     => false,
		'show_in_admin_bar'     => false,
		'labels'                => array(
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
		)
	) );

	/* Register Meta Attributes */

	$margin_padding_keys = array(
		'_kad_form_marginDesktop',
		'_kad_form_marginTablet',
		'_kad_form_marginMobile',
		'_kad_form_paddingDesktop',
		'_kad_form_paddingTablet',
		'_kad_form_paddingMobile',
	);

	foreach ( $margin_padding_keys as $key ) {
		register_post_meta(
			'kadence_form',
			$key,
			array(
				'type'          => 'array',
				'default'       => array( '', '', '', '' ),
				'auth_callback' => '__return_true',
				'single'        => true,
				'show_in_rest'  => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type' => 'string',
						),
					),
				),
			)
		);
	}

	register_post_meta(
		'kadence_form',
		'_kad_form_marginUnit',
		array(
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => '__return_true',
			'type'          => 'string',
			'default'       => 'px'
		)
	);

	register_post_meta(
		'kadence_form',
		'_kad_form_paddingUnit',
		array(
			'show_in_rest'  => true,
			'auth_callback' => '__return_true',
			'single'        => true,
			'type'          => 'string',
			'default'       => 'px'
		)
	);

	register_post_meta(
		'kadence_form',
		'_kad_form_email',
		array(
			'type'          => 'object',
			'single'        => true,
			'auth_callback' => '__return_true',
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
		'_kad_form_actions',
		array(
			'single'        => true,
			'auth_callback' => '__return_true',
			'type'          => 'array',
			'default'       => array(),
			'show_in_rest'  => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array(
						'type' => 'string',
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
			'auth_callback' => '__return_true',
			'type'          => 'object',
			'default'       => array( "group" => array(), "map" => array() ),
			'show_in_rest'  => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'group' => array( 'type' => 'array' ),
						'map'   => array( 'type' => 'array' ),
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
			'auth_callback' => '__return_true',
			'type'          => 'object',
			'default'       => array( "lists" => array(), "tags" => array(), "map" => array(), "doubleOptin" => false ),
			'show_in_rest'  => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'lists'       => array( 'type' => 'array' ),
						'tags'        => array( 'type' => 'array' ),
						'map'         => array( 'type' => 'array' ),
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
			'auth_callback' => '__return_true',
			'type'          => 'object',
			'default'       => array( "lists" => array(), "map" => array() ),
			'show_in_rest'  => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'lists' => array( 'type' => 'array' ),
						'map'   => array( 'type' => 'array' )
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
			'auth_callback' => '__return_true',
			'type'          => 'object',
			'default'       => array( "list" => array(), "map" => array() ),
			'show_in_rest'  => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'list' => array( 'type' => 'array' ),
						'map'  => array( 'type' => 'array' )
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
			'auth_callback' => '__return_true',
			'type'          => 'object',
			'default'       => array( "form" => array(), "sequence" => array(), "tags" => array(), "map" => array() ),
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
			'auth_callback' => '__return_true',
			'type'          => 'object',
			'default'       => array( "lists" => array(), "map" => array() ),
			'show_in_rest'  => array(
				'schema' => array(
					'type'       => 'object',
					'properties' => array(
						'lists' => array( 'type' => 'array' ),
						'map'   => array( 'type' => 'array' )
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
			'auth_callback' => '__return_true',
			'type'          => 'string',
			'default'       => ''
		)
	);


	register_post_meta(
		'kadence_form',
		'_kad_form_honeyPot',
		array(
			'show_in_rest'  => true,
			'single'        => true,
			'auth_callback' => '__return_true',
			'type'          => 'boolean',
			'default'       => false
		)
	);


	register_post_meta(
		'kadence_form',
		'_kad_form_single',
		array(
			'show_in_rest'  => true,
			'single'        => true,
			'auth_callback' => '__return_true',
			'type'          => 'boolean',
			'default'       => true
		)
	);

	register_post_meta(
		'kadence_form',
		'_kad_form_recaptcha',
		array(
			'show_in_rest'  => true,
			'single'        => true,
			'auth_callback' => '__return_true',
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
			'auth_callback' => '__return_true',
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
			'auth_callback' => '__return_true',
			'type'          => 'string',
			'default'       => ''
		)
	);

	register_post_meta(
		'kadence_form',
		'_kad_form_submit',
		array(
			'single'        => true,
			'auth_callback' => '__return_true',
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
			'auth_callback' => '__return_true',
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
			'auth_callback' => '__return_true',
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
			'auth_callback' => '__return_true',
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
		'_kad_form_messages',
		array(
			'single'        => true,
			'auth_callback' => '__return_true',
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
		'_kad_form_messageFont',
		array(
			'single'        => true,
			'auth_callback' => '__return_true',
			'type'          => 'object',
			'default'       => array(),
			'show_in_rest'  => array(
				'schema' => array(
					'type' => 'object',
				),
			),
		)
	);

	register_post_meta(
		'kadence_form',
		'_kad_form_submitFont',
		array(
			'single'        => true,
			'auth_callback' => '__return_true',
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
			'auth_callback' => '__return_true',
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
		'_kad_form_style',
		array(
			'single'        => true,
			'auth_callback' => '__return_true',
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
				"border"                  => "",
				"backgroundOpacity"       => 1,
				"borderOpacity"           => 1,
				"borderRadius"            => "",
				"borderWidth"             => array(
					"",
					"",
					"",
					""
				),
				"colorActive"             => "",
				"backgroundActive"        => "",
				"borderActive"            => "",
				"backgroundActiveOpacity" => 1,
				"borderActiveOpacity"     => 1,
				"placeholderColor"        => "",
				"gradient"                => array(
					"#999999",
					1,
					0,
					100,
					"linear",
					180,
					"center center"
				),
				"gradientActive"          => array(
					"#777777",
					1,
					0,
					100,
					"linear",
					180,
					"center center"
				),
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
				"fontSize"                => array(
					"",
					"",
					""
				),
				"fontSizeType"            => "px",
				"lineHeight"              => array(
					"",
					"",
					""
				),
				"lineType"                => "px",
				"rowGap"                  => "",
				"rowGapType"              => "px",
				"gutter"                  => "",
				"gutterType"              => "px",
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
						'gradient'                => array( 'type' => 'array' ),
						'gradientActive'          => array( 'type' => 'array' ),
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
			'auth_callback' => '__return_true',
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
			'auth_callback' => '__return_true',
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

} );

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
