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
			$slug = self::SLUG;
			add_filter(
				"manage_{$slug}_posts_columns",
				function( array $columns ) : array {
					return $this->filter_post_type_columns( $columns );
				}
			);
			add_action(
				"manage_{$slug}_posts_custom_column",
				function( string $column_name, int $post_id ) {
					$this->render_post_type_column( $column_name, $post_id );
				},
				10,
				2
			);
			if ( class_exists( 'Kadence_Blocks_Duplicate_Form' ) ) {
				new Kadence_Blocks_Duplicate_Form( self::SLUG );
			}
		}
	}
	/**
	 * Filters the block area post type columns in the admin list table.
	 *
	 * @since 0.1.0
	 *
	 * @param array $columns Columns to display.
	 * @return array Filtered $columns.
	 */
	private function filter_post_type_columns( array $columns ) : array {

		$add = array(
			'description'  => esc_html__( 'Description', 'kadence-blocks' ),
		);
		if ( class_exists( 'Kadence_Blocks_Pro' ) ) {
			$add['entries'] = esc_html__( 'Entries', 'kadence-blocks' );
		} else {
			$add['entries'] = esc_html__( 'Entries (Pro Only)', 'kadence-blocks' );
		}

		$new_columns = array();
		foreach ( $columns as $key => $label ) {
			$new_columns[ $key ] = $label;
			if ( 'title' == $key ) {
				$new_columns = array_merge( $new_columns, $add );
			}
		}

		return $new_columns;
	}
	/**
	 * Renders column content for the block area post type list table.
	 *
	 * @param string $column_name Column name to render.
	 * @param int    $post_id     Post ID.
	 */
	private function render_post_type_column( string $column_name, int $post_id ) {
		if ( 'entries' !== $column_name && 'description' !== $column_name ) {
			return;
		}
		//$post = get_post( $post_id );
		if ( 'description' === $column_name ) {
			$description = get_post_meta( $post_id, '_kad_form_description', true );
			echo '<div class="kadence-form-description">' . esc_html( $description ) . '</div>';
		}
		if ( 'entries' === $column_name ) {
			if ( class_exists( 'Kadence_Blocks_Pro' ) && class_exists( 'KBP\Queries\Entry' ) ) {
				$entries = new KBP\Queries\Entry();
				$args = array(
					'status' => 'publish',
					'number' => null,
					'form_id' => $post_id,
				);
				$results = $entries->query( $args );
				$url = add_query_arg(
					array(
						'form_id'  => $post_id,
					),
					get_admin_url( null, 'admin.php?page=kadence-blocks-entries' )
				);
				echo '<a href="' . esc_url( $url ) . '">' . count( $results ) . '</a>';
			}
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
			'all_items'          => __( 'Forms', 'kadence_blocks' ),
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
					'html'      => true,
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
			'_kad_form_getresponse',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'automation' => array(),
					'tags' => array(),
					'map' => array(),
					'listMulti' => array(),
					'doubleOptin' => false,
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'automation' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'string' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'tags'  => array( 'type' => 'array' ),
							'map'  => array(
								'type' => 'object',
								'additionalProperties' => array(
									'type' => 'string',
								),
							),
							'listMulti'  => array( 'type' => 'array' ),
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
				'default'       => array(
					'form' => array(),
					'sequence' => array(),
					'tags' => array(),
					'map' => array(),
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'form' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'number' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'sequence' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'number' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'tags'     => array( 'type' => 'array' ),
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
					'listMulti' => array(),
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
							'automation' => array(
								'type' => 'object',
								'properties' => array(
									'value' => array( 'type' => 'string' ),
									'label' => array( 'type' => 'string' ),
								),
							),
							'tags'  => array( 'type' => 'array' ),
							'map'  => array(
								'type' => 'object',
								'additionalProperties' => array(
									'type' => 'string',
								),
							),
							'listMulti'  => array( 'type' => 'array' ),
							'doubleOptin'  => array( 'type' => 'boolean' ),
						),
					),
				),
			)
		);

		register_post_meta(
			'kadence_form',
			'_kad_form_browserValidation',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'boolean',
				'default'       => true,
			)
		);
		register_post_meta(
			'kadence_form',
			'_kad_form_enableAnalytics',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'boolean',
				'default'       => false,
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
				'default'       => '',
			)
		);
		register_post_meta(
			'kadence_form',
			'_kad_form_submitHide',
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
			'_kad_form_webhook',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'url' => '',
					'map' => array(),
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'url' => array( 'type' => 'string' ),
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
					'userIP'     => true,
					'userDevice' => true,
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
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
				'default'       => array( '', '', '', '' ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'array',
						'properties' => array( '', '', '', '' ),
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
				'default'       => array( '', '', '', '' ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'array',
						'properties' => array( '', '', '', '' ),
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
				'default'       => array( '', '', '', '' ),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'array',
						'properties' => array( '', '', '', '' ),
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
			'_kad_form_description',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'string',
				'default'       => '',
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'string'
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
					"lineType"      => "",
					"letterSpacing" => array(
						"",
						"",
						""
					),
					"letterType" => "",
					"textTransform" => "",
					"family"        => "",
					"google"        => false,
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
							'letterSpacing' => array( 'type' => 'array' ),
							'letterType'    => array( 'type' => 'string' ),
							'textTransform' => array( 'type' => 'string' ),
							"family"        => array( 'type' => 'string' ),
							'google'        => array( 'type' => 'boolean' ),
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
					'showRequired'         => true,
					'size'                 => 'standard',
					'padding'              => array( '', '', '', '' ),
					'tabletPadding'        => array( '', '', '', '' ),
					'mobilePadding'        => array( '', '', '', '' ),
					'paddingUnit'          => 'px',
					'requiredColor'        => '',
					'background'           => '',
					'backgroundActive'     => '',
					'borderActive'         => '',
					'placeholderColor'     => '',
					'gradient'             => '',
					'gradientActive'       => '',
					'backgroundType'       => 'normal',
					'backgroundActiveType' => 'normal',
					'boxShadow'            => array( false, '#000000', 0.2, 1, 1, 2, 0, false ),
					'boxShadowActive'      => array( false, '#000000', 0.4, 2, 2, 3, 0, false ),
					'gap'                  => array( '', '', '' ),
					'gapUnit'              => 'px',
					'labelStyle'           => 'normal',
					'basicStyles'          => true,
					'isDark'               => false,
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'showRequired'            => array( 'type' => 'boolean' ),
							'size'                    => array( 'type' => 'string' ),
							'padding'                 => array( 'type' => 'array' ),
							'tabletPadding'           => array( 'type' => 'array' ),
							'mobilePadding'           => array( 'type' => 'array' ),
							'paddingUnit'             => array( 'type' => 'string' ),
							'requiredColor'           => array( 'type' => 'string' ),
							'background'              => array( 'type' => 'string' ),
							'backgroundActive'        => array( 'type' => 'string' ),
							'borderActive'            => array( 'type' => 'string' ),
							'placeholderColor'        => array( 'type' => 'string' ),
							'gradient'                => array( 'type' => 'string' ),
							'gradientActive'          => array( 'type' => 'string' ),
							'backgroundType'          => array( 'type' => 'string' ),
							'backgroundActiveType'    => array( 'type' => 'string' ),
							'boxShadow'               => array( 'type' => 'array' ),
							'boxShadowActive'         => array( 'type' => 'array' ),
							'gap'                     => array( 'type' => 'array' ),
							'gapUnit'                 => array( 'type' => 'string' ),
							'labelStyle'              => array( 'type' => 'string' ),
							'basicStyles'             => array( 'type' => 'boolean' ),
							'isDark'                  => array( 'type' => 'boolean' ),
						),
					),
				),
			)
		);
		register_post_meta(
			'kadence_form',
			'_kad_form_background',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
				'type'          => 'object',
				'default'       => array(
					'background'           => '',
					'gradient'             => '',
					'backgroundType'       => 'normal',
				),
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'background'              => array( 'type' => 'string' ),
							'gradient'                => array( 'type' => 'string' ),
							'backgroundType'          => array( 'type' => 'string' ),
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
					"lineType"      => "",
					"letterSpacing" => array(
						"",
						"",
						""
					),
					"letterType"    => "px",
					"textTransform" => "",
					"family"        => "",
					"google"        => false,
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
							'letterSpacing' => array( 'type' => 'array' ),
							'letterType'    => array( 'type' => 'string' ),
							'textTransform' => array( 'type' => 'string' ),
							"family"        => array( 'type' => 'string' ),
							'google'        => array( 'type' => 'boolean' ),
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
			'_kad_form_radioLabelFont',
			array(
				'single'        => true,
				'auth_callback' => array( $this, 'meta_auth_callback' ),
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
				'show_in_rest'  => array(
					'schema' => array(
						'type'       => 'object',
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
					"lineType"      => "",
					"letterSpacing" => array( "", "", ""),
					"letterType"    => "px",
					"textTransform" => "",
					"family"        => "",
					"google"        => false,
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
							'letterSpacing' => array( 'type' => 'array' ),
							'letterType'    => array( 'type' => 'string' ),
							'textTransform' => array( 'type' => 'string' ),
							"family"        => array( 'type' => 'string' ),
							'google'        => array( 'type' => 'boolean' ),
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
				'key'     => '_kad_form_anchor',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'     => '_kad_form_className',
				'default' => '',
				'type'    => 'string'
			),
			array(
				'key'           => '_kad_form_actions',
				'default'       => array( 'email' ),
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
				'children_type' => 'string'
			),
			array(
				'key'     => '_kad_form_importId',
				'default' => '',
				'type'    => 'string'
			),
		);
		register_post_meta(
			'kadence_form',
			'_kad_form_messageBorderSuccess',
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
			'_kad_form_tabletMessageBorderSuccess',
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
			'_kad_form_mobileMessageBorderSuccess',
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
			'_kad_form_messageBorderError',
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
			'_kad_form_tabletMessageBorderError',
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
			'_kad_form_mobileMessageBorderError',
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

add_filter( 'default_content', function ( $content, $post ) {
	if ( $post->post_type === 'kadence_form' ) {
		return serialize_block( [
			'blockName'    => 'kadence/advanced-form',
			'innerContent' => [],
			'attrs'        => [],
		] );
	}

	return $content;
}, 10, 2 );
