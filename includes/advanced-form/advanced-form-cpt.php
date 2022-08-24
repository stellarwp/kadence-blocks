<?php

class CPT_Controller extends WP_REST_Posts_Controller {
	public function register_routes() {
		parent::register_routes();

		register_rest_route( $this->namespace, '/' . $this->rest_base . '/auto-draft', [
			[
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'create_auto_draft' ],
				'permission_callback' => [ $this, 'create_item_permissions_check' ],
			]
		] );
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
	register_post_type( 'kadence_form', [
		'public'                => true,
		'show_ui'               => true,
		'show_in_rest'          => true,
		'rest_controller_class' => CPT_Controller::class,
		'menu_icon'             => 'dashicons-forms',
		'supports'              => [ 'title', 'editor', 'custom-fields', 'revisions' ],
		'taxonomies'            => [ 'post_tag' ],
		'template'              => [
			[ 'kadence/advanced-form' ]
		],
//		'template_lock'         => 'insert',
		'has_archive'           => true,
		'rewrite'               => [
			'slug' => 'kadence_form'
		],
		'label'                 => __( 'Kadence Forms', 'kadence_blocks' ),
		'labels'                => [
			'name'               => _x( 'Kadence Forms', 'Post Type General Name', 'kadence_blocks' ),
			'singular_name'      => _x( 'Kadence Form', 'Post Type Singular Name', 'kadence_blocks' ),
			'menu_name'          => __( 'Kadence Forms', 'kadence_blocks' ),
			'name_admin_bar'     => __( 'Kadence Form', 'kadence_blocks' ),
			'archives'           => __( 'Kadence Form Archives', 'kadence_blocks' ),
			'attributes'         => __( 'Kadence Form Attributes', 'kadence_blocks' ),
			'parent_item_colon'  => __( 'Parent Kadence Form:', 'kadence_blocks' ),
			'all_items'          => __( 'All Kadence Forms', 'kadence_blocks' ),
			'add_new_item'       => __( 'Add New Kadence Form', 'kadence_blocks' ),
			'add_new'            => __( 'Add New', 'kadence_blocks' ),
			'new_item'           => __( 'New Kadence Form', 'kadence_blocks' ),
			'edit_item'          => __( 'Edit Kadence Form', 'kadence_blocks' ),
			'update_item'        => __( 'Update Kadence Form', 'kadence_blocks' ),
			'view_item'          => __( 'View Kadence Form', 'kadence_blocks' ),
			'view_items'         => __( 'View Kadence Forms', 'kadence_blocks' ),
			'search_items'       => __( 'Search Kadence Forms', 'kadence_blocks' ),
			'not_found'          => __( 'Not found', 'kadence_blocks' ),
			'not_found_in_trash' => __( 'Not found in Trash', 'kadence_blocks' ),
			'insert_into_item'   => __( 'Insert into Kadence Form', 'kadence_blocks' ),
			'filter_items_list'  => __( 'Filter items list', 'kadence_blocks' ),
		]
	] );

	register_post_meta( 'kadence_form', 'kadence_form_attrs', array(
			'single'       => true,
			'type'         => 'object',
			'default'      => [
				'marginDesktop'    => [ '', '', '', '' ],
				'marginTablet'     => [ '', '', '', '' ],
				'marginMobile'     => [ '', '', '', '' ],
				'marginUnit'       => 'px',
				'paddingDesktop'   => [ '', '', '', '' ],
				'paddingTablet'    => [ '', '', '', '' ],
				'paddingMobile'    => [ '', '', '', '' ],
				'paddingUnit'      => 'px',
				'actions'          => [],
				'email'            => json_decode( '{
				      "emailTo": "",
				      "subject": "",
				      "fromEmail": "",
				      "fromName": "",
				      "replyTo": "email_field",
				      "cc": "",
				      "bcc": "",
				      "html": true
			    }' ),
				'mailerlite'       => json_decode( '{
			      "group": [],
			      "map": []
			    }' ),
				'fluentcrm'        => json_decode( '{
			      "lists": [],
			      "tags": [],
			      "map": [],
			      "doubleOptin": false
			    }' ),
				'sendinblue'       => json_decode( '{
					"list": [],
			        "map": []
			    }' ),
				'mailchimp'        => json_decode( '{
					"list": [],
			        "map": []
			    }' ),
				'convertkit'       => json_decode( '{
					"form": [],
			        "sequence": [],
			        "tags": [],
			        "map": []
			    }' ),
				'activecampaign'   => json_decode( '{
					"list": [],
			      "map": []
			    }' ),
				'redirect'         => '',
				'honeyPot'         => false,
				'recaptcha'        => false,
				'recaptchaVersion' => 'v3',
				"submit"           => json_decode( '{
					"label": "Submit",
			        "width": [
						"100",
						"",
						""
					],
				      "size": "standard",
				      "widthType": "auto",
				      "fixedWidth": [
							"",
							"",
							""
						],
				      "align": [
							"",
							"",
							""
						],
				      "deskPadding": [
							"",
							"",
							"",
							""
						],
				      "tabletPadding": [
							"",
							"",
							"",
							""
						],
				      "mobilePadding": [
							"",
							"",
							"",
							""
						],
				      "color": "",
				      "background": "",
				      "border": "",
				      "backgroundOpacity": 1,
				      "borderOpacity": 1,
				      "borderRadius": "",
				      "borderWidth": [
							"",
							"",
							"",
							""
						],
				      "colorHover": "",
				      "backgroundHover": "",
				      "borderHover": "",
				      "backgroundHoverOpacity": 1,
				      "borderHoverOpacity": 1,
				      "icon": "",
				      "iconSide": "right",
				      "iconHover": false,
				      "cssClass": "",
				      "gradient": [
							"#999999",
							1,
							0,
							100,
							"linear",
							180,
							"center center"
						],
				      "gradientHover": [
							"#777777",
							1,
							0,
							100,
							"linear",
							180,
							"center center"
						],
				      "btnStyle": "basic",
				      "btnSize": "standard",
				      "backgroundType": "solid",
				      "backgroundHoverType": "solid",
				      "boxShadow": [
							false,
							"#000000",
							0.2,
							1,
							1,
							2,
							0,
							false
						],
				      "boxShadowHover": [
							false,
							"#000000",
							0.4,
							2,
							2,
							3,
							0,
							false
						]
			        }' ),
				'submitFont'       => json_decode( '{
					    "size": [
					      "",
					      "",
					      ""
					    ],
					    "sizeType": "px",
					    "lineHeight": [
					      "",
					      "",
					      ""
					    ],
					    "lineType": "px",
					    "letterSpacing": "",
					    "textTransform": "",
					    "family": "",
					    "google": "",
					    "style": "",
					    "weight": "",
					    "variant": "",
					    "subset": "",
					    "loadGoogle": true
				      }' ),
				'submitMargin'     => json_decode( '{
				        "desk": [
				          "",
				          "",
				          "",
				          ""
				        ],
				        "tablet": [
				          "",
				          "",
				          "",
				          ""
				        ],
				        "mobile": [
				          "",
				          "",
				          "",
				          ""
				        ],
				        "unit": "px",
				        "control": "linked"
			      }' ),
				'submitLabel'      => '',
				'style'            => json_decode( '{
				      "showRequired": true,
				      "size": "standard",
				      "deskPadding": [
				        "",
				        "",
				        "",
				        ""
				      ],
				      "tabletPadding": [
				        "",
				        "",
				        "",
				        ""
				      ],
				      "mobilePadding": [
				        "",
				        "",
				        "",
				        ""
				      ],
				      "color": "",
				      "requiredColor": "",
				      "background": "",
				      "border": "",
				      "backgroundOpacity": 1,
				      "borderOpacity": 1,
				      "borderRadius": "",
				      "borderWidth": [
				        "",
				        "",
				        "",
				        ""
				      ],
				      "colorActive": "",
				      "backgroundActive": "",
				      "borderActive": "",
				      "backgroundActiveOpacity": 1,
				      "borderActiveOpacity": 1,
				      "gradient": [
				        "#999999",
				        1,
				        0,
				        100,
				        "linear",
				        180,
				        "center center"
				      ],
				      "gradientActive": [
				        "#777777",
				        1,
				        0,
				        100,
				        "linear",
				        180,
				        "center center"
				      ],
				      "backgroundType": "solid",
				      "backgroundActiveType": "solid",
				      "boxShadow": [
				        false,
				        "#000000",
				        0.2,
				        1,
				        1,
				        2,
				        0,
				        false
				      ],
				      "boxShadowActive": [
				        false,
				        "#000000",
				        0.4,
				        2,
				        2,
				        3,
				        0,
				        false
				      ],
				      "fontSize": [
				        "",
				        "",
				        ""
				      ],
				      "fontSizeType": "px",
				      "lineHeight": [
				        "",
				        "",
				        ""
				      ],
				      "lineType": "px",
				      "rowGap": "",
				      "rowGapType": "px",
				      "gutter": "",
				      "gutterType": "px",
				      "tabletRowGap": "",
				      "mobileRowGap": "",
				      "tabletGutter": "",
				      "mobileGutter": ""
			    }' ),
				'labelFont'        => json_decode( '{
				      "color": "",
				      "size": [
				        "",
				        "",
				        ""
				      ],
				      "sizeType": "px",
				      "lineHeight": [
				        "",
				        "",
				        ""
				      ],
				      "lineType": "px",
				      "letterSpacing": "",
				      "textTransform": "",
				      "family": "",
				      "google": "",
				      "style": "",
				      "weight": "",
				      "variant": "",
				      "subset": "",
				      "loadGoogle": true,
				      "padding": [
				        "",
				        "",
				        "",
				        ""
				      ],
				      "margin": [
				        "",
				        "",
				        "",
				        ""
				      ]
			    }' ),
				'helpFont'         => json_decode( '{
					"color": "",
				      "size": [
							"",
							"",
							""
						],
				      "sizeType": "px",
				      "lineHeight": [
							"",
							"",
							""
						],
				      "lineType": "px",
				      "letterSpacing": "",
				      "textTransform": "",
				      "family": "",
				      "google": "",
				      "style": "",
				      "weight": "",
				      "variant": "",
				      "subset": "",
				      "loadGoogle": true,
				      "padding": [
							"",
							"",
							"",
							""
						],
				      "margin": [
							"",
							"",
							"",
							""
						]
				    }' ),
				'webhook'          => json_decode( '{
						"url": "",
						"map": []
				  }' ),
				'autoEmail'        => json_decode( '{
					"emailTo": "",
					"subject": "",
					"message": "",
					"fromEmail": "",
					"fromName": "",
					"replyTo": "",
					"cc": "",
					"bcc": "",
					"html": true
			    }' ),
				'entry'            => json_decode( '{
					"formName": "",
					"userIP": true,
					"userDevice": true
				  }' ),
				'messages'         => json_decode( '{
					  "success": "",
					  "error": "",
					  "required": "",
					  "invalid": "",
					  "recaptchaerror": "",
					  "preError": ""
					}' ),
				'messageFont' => json_decode( '' )
			],
			'show_in_rest' => [
				'schema' => [
					'type'       => 'object',
					'properties' => [
						'marginDesktop'    => [ 'type' => 'array' ],
						'marginTablet'     => [ 'type' => 'array' ],
						'marginMobile'     => [ 'type' => 'array' ],
						'marginUnit'       => [ 'type' => 'string' ],
						'paddingDesktop'   => [ 'type' => 'array' ],
						'paddingTablet'    => [ 'type' => 'array' ],
						'paddingMobile'    => [ 'type' => 'array' ],
						'paddingUnit'      => [ 'type' => 'string' ],
						'actions'          => [ 'type' => 'array' ],
						'email'            => [ 'type' => ' object' ],
						'mailerlite'       => [ 'type' => ' object' ],
						'fluentcrm'        => [ 'type' => ' object' ],
						'sendinblue'       => [ 'type' => ' object' ],
						'mailchimp'        => [ 'type' => ' object' ],
						'convertkit'       => [ 'type' => ' object' ],
						'activecampaign'   => [ 'type' => ' object' ],
						'redirect'         => [ 'type' => 'string' ],
						'honeyPot'         => [ 'type' => 'boolean' ],
						'recaptcha'        => [ 'type' => 'boolean' ],
						'recaptchaVersion' => [ 'type' => 'string' ],
						'submit'           => [ 'type' => ' object' ],
						'submitFont'       => [ 'type' => ' object' ],
						'submitMargin'     => [ 'type' => ' object' ],
						'submitLabel'      => [ 'type' => 'string ' ],
						'style'            => [ 'type' => ' object' ],
						'labelFont'        => [ 'type' => ' object' ],
						'helpFont'         => [ 'type' => ' object' ],
						'webhook'          => [ 'type' => ' object' ],
						'autoEmail'        => [ 'type' => ' object ' ],
						'entry'            => [ 'type' => ' object' ],
						'messages'         => [ 'type' => ' object' ],
						'messageFont'      => [ 'type' => ' object' ]
					]
				],
			]
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
