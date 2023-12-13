<?php
/**
 * Setup the Posts Block Rest Calls
 *
 * @since   2.0.0
 * @package Kadence Blocks
 */


/**
 * Class to setup new rest calls.
 */
class Kadence_Blocks_Post_Rest_Controller extends WP_REST_Controller {

	/**
	 * Query property name.
	 */
	const PROP_SOURCE = 'source';

	/**
	 * Type property name.
	 */
	const PROP_TYPE = 'type';

	/**
	 * Type property name.
	 */
	const PROP_TYPE_ARRAY = 'type_array';

	/**
	 * Query property name.
	 */
	const PROP_QUERY = 'query';
	/**
	 * Query property name.
	 */
	const PROP_MULTIPLE = 'multiple';

	/**
	 * Query property name.
	 */
	const PROP_ORDER_BY = 'order_by';

	/**
	 * Query property name.
	 */
	const PROP_ORDER = 'order';

	/**
	 * Query property name.
	 */
	const PROP_ALLOW_STICKY = 'allow_sticky';

	/**
	 * Query property name.
	 */
	const PROP_OFFSET = 'offset';

	/**
	 * Query property name.
	 */
	const PROP_TAX = 'tax';

	/**
	 * Query property name.
	 */
	const PROP_EXCLUDE = 'exclude';

	/**
	 * Query property name.
	 */
	const PROP_CUSTOM_TAX = 'custom_tax';
	/**
	 * Query property name.
	 */
	const PROP_TAGS = 'tags';
	/**
	 * Query property name.
	 */
	const PROP_CATEGORY = 'category';

	/**
	 * Query property name.
	 */
	const PROP_TAX_TYPE = 'tax_type';

	/**
	 * Search property name.
	 */
	const PROP_SEARCH = 'search';

	/**
	 * Include property name.
	 */
	const PROP_INCLUDE = 'include';

	/**
	 * Per page property name.
	 */
	const PROP_PER_PAGE = 'per_page';

	/**
	 * Per page property name.
	 */
	const PROP_POST_ID = 'post_id';

	/**
	 * Page property name.
	 */
	const PROP_PAGE = 'page';

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->namespace = 'kbp/v1';
		$this->query_base = 'post-query';
		$this->taxonomies_select = 'taxonomies-select';
		$this->term_select = 'term-select';
	}

	/**
	 * Registers the routes for the objects of the controller.
	 *
	 * @see register_rest_route()
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/' . $this->query_base,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_query_items' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_query_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->taxonomies_select,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_taxonomies_content' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_tax_select_params(),
				),
			)
		);
		register_rest_route(
			$this->namespace,
			'/' . $this->term_select,
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_term_content' ),
					'permission_callback' => array( $this, 'get_items_permission_check' ),
					'args'                => $this->get_tax_select_params(),
				),
			)
		);
	}

	/**
	 * Checks if a given request has access to view content.
	 *
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return true|WP_Error True if the request has search access, WP_Error object otherwise.
	 */
	public function get_items_permission_check( $request ) {
		//$post_type->cap->edit_posts
		// The post type has to be public so it's readable to anyone, no need to check that here, This checks to make sure the user is logged in with permission to edit so it's not a public api call.
		return current_user_can( 'edit_posts' );
	}
	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_query_items( $request ) {
		$prop_type      = $request->get_param( self::PROP_TYPE );
		$query_type     = $request->get_param( self::PROP_QUERY );
		$allow_multiple = $request->get_param( self::PROP_MULTIPLE );
		$prop_array     = $request->get_param( self::PROP_TYPE_ARRAY );
		$tax_type       = $request->get_param( self::PROP_TAX_TYPE );
		$exclude        = $request->get_param( self::PROP_EXCLUDE );
		$categories     = ( $request->get_param( self::PROP_CATEGORY ) ? wp_parse_list( $request->get_param( self::PROP_CATEGORY ) ) : array() );

		if ( empty( $query_type ) ) {
			return array();
		}

		$query_args = array(
			'post_type' => $allow_multiple ? $prop_array : $prop_type,
		);
		if ( 'individual' === $query_type ) {
			$query_args['post__in']            = $request->get_param( self::PROP_INCLUDE );
			$query_args['orderby']             = 'post__in';
			$query_args['posts_per_page']      = -1;
			$query_args['ignore_sticky_posts'] = 1;
		} else {
			$query_args['posts_per_page']      = $request->get_param( self::PROP_PER_PAGE );
			$query_args['tax_query']           = array();
			$query_args['orderby']             = $request->get_param( self::PROP_ORDER_BY );
			$query_args['order']               = $request->get_param( self::PROP_ORDER );
			$query_args['offset']              = $request->get_param( self::PROP_OFFSET );
			$query_args['post_status']         = 'publish';
			$query_args['ignore_sticky_posts'] = $request->get_param( self::PROP_ALLOW_STICKY );
			$current_post_id                   = $request->get_param( self::PROP_POST_ID );
			if( !empty( $request->get_param( self::PROP_INCLUDE ) ) ) {
				$query_args['post__in']            = $request->get_param( self::PROP_INCLUDE );
			}
			if ( ! empty( $current_post_id ) ) {
				$query_args['post__not_in']        = array( $current_post_id );
			}
			if ( 'post' !== $prop_type || $request->get_param( self::PROP_CUSTOM_TAX ) ) {
				if ( $tax_type ) {
					$query_args['tax_query'][] = array(
						'taxonomy' => ( isset( $tax_type ) ) ? $tax_type : 'category',
						'field'    => 'id',
						'terms'    => $categories,
						'operator' => ( isset( $exclude ) && 'exclude' === $exclude ? 'NOT IN' : 'IN' ),
					);
				}
			} else {
				$tags = ( $request->get_param( self::PROP_TAGS ) ? wp_parse_list( $request->get_param( self::PROP_TAGS ) ) : array() );
				if ( isset( $exclude ) && 'exclude' === $exclude ) {
					$query_args['category__not_in'] = $categories;
					$query_args['tag__not_in']      = $tags;
				} else {
					$query_args['category__in'] = $categories;
					$query_args['tag__in']      = $tags;
				}
			}
		}
		$query = new WP_Query( $query_args );
		$posts = array();

		foreach ( $query->posts as $post ) {
			$posts[] = $this->prepare_query_item_for_response( $post, $request );
		}

		return rest_ensure_response( $posts );
	}

	/**
	 * Retrieves a collection of objects.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_taxonomies_content( $request ) {
		$source        = $request->get_param( self::PROP_SOURCE );
		if ( 'all' === $source ) {
			$post_types = kadence_blocks_get_post_types();
		} else if ( gettype( $source ) == 'string' && ! is_numeric( $source ) ) {
			$post_types = array(
				array(
					'value' => $source,
					'label' => $source,
				),
			);
		} else {
			$type = get_post_type( $source );
			if ( empty( $type ) ) {
				return '';
			}
			$post_types = array(
				array(
					'value' => $type,
					'label' => $type,
				),
			);
		}
		$taxs = array();
		foreach ( $post_types as $key => $post_type ) {
			$taxonomies = get_object_taxonomies( $post_type['value'], 'objects' );
			foreach ( $taxonomies as $term_slug => $term ) {
				if ( ! $term->public || ! $term->show_ui ) {
					continue;
				}
				$taxs[] = array(
					'value' => $term_slug,
					'label' => $term->label,
				);
			}
		}
		return rest_ensure_response( $taxs );
	}

	/**
	 * Retrieves terms for a given taxonomy source.
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 * @return WP_REST_Response|WP_Error Response object on success, or WP_Error object on failure.
	 */
	public function get_term_content( $request ) {
		$source = $request->get_param( self::PROP_SOURCE );
		$page = $request->get_param( self::PROP_PAGE );
		$number = $request->get_param( self::PROP_PER_PAGE );
		if ( empty( $source ) ) {
			return '';
		}
		$terms = get_terms( $source );
		$term_items = array();
		if ( ! empty( $terms ) ) {
			foreach ( $terms as $term_key => $term_item ) {
				$term_items[] = array(
					'value' => $source . '|' . $term_item->term_id,
					'label' => $term_item->name,
				);
			}
		}
		return rest_ensure_response( $term_items );
	}

	/**
	 * Prepares a single result for response.
	 *
	 * @param int             $id      ID of the item to prepare.
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response Response object.
	 */
	public function prepare_query_item_for_response( $post, $request ) {
		$data = array(
			'id' => $post->ID,
			'date' => $this->prepare_date_response( $post->post_date_gmt, $post->post_date ),
			'date_gmt' => $this->prepare_date_response( $post->post_date_gmt ),
			'modified' => $this->prepare_date_response( $post->post_modified_gmt, $post->post_modified ),
			'modified_gmt' => $this->prepare_date_response( $post->post_modified_gmt ),
			'title' => array(
				'raw'      => $post->post_title,
				'rendered' => get_the_title( $post->ID ),
			),
			'excerpt' => array(
				'raw'      => $post->post_excerpt,
				'rendered' => get_the_excerpt( $post->ID ),
			),
			'type' => $post->post_type,
			'slug' => $post->post_name,
			'status' => $post->post_status,
			'link' => get_permalink( $post->ID ),
			'author' => absint( $post->post_author ),
			'featured_media' => has_post_thumbnail( $post ) ? get_post_thumbnail_id( $post ) : '',
		);
		if ( post_type_supports( $post->post_type, 'thumbnail' ) && has_post_thumbnail( $post ) ) {
			$data['featured_image_src_large'] = wp_get_attachment_image_src(
				get_post_thumbnail_id( $post ),
				'large',
				false
			);
		}
		$author_data = array();
		if ( post_type_supports( $post->post_type, 'author' ) ) {
			// Get the author name.
			$author_data['display_name'] = get_the_author_meta( 'display_name', absint( $post->post_author ) );
			// Get the author link.
			$author_data['author_link'] = get_author_posts_url( absint( $post->post_author ) );
		}
		$data['author_info'] = $author_data;
		if ( post_type_supports( $post->post_type, 'comments' ) ) {
			$comments_count = wp_count_comments( $post->ID );
			$data['comment_info'] = $comments_count->total_comments;
		}
		if ( 'post' === $post->post_type ) {
			$data['category_info'] = get_the_category( $post->ID );
			$data['tag_info']      = get_the_tags( $post->ID );
		}
		$taxonomies = get_object_taxonomies( $post->post_type, 'objects' );
		$taxs = array();
		foreach ( $taxonomies as $term_slug => $term ) {
			if ( ! $term->public || ! $term->show_ui ) {
				continue;
			}
			$terms = get_the_terms( $post->ID, $term_slug );
			$term_items = array();
			if ( ! empty( $terms ) ) {
				foreach ( $terms as $term_key => $term_item ) {
					$term_items[] = array(
						'value' => $term_item->term_id,
						'label' => $term_item->name,
					);
				}
				$taxs[ $term_slug ] = $term_items;
			}
		}
		$data['taxonomy_info'] = $taxs;

		return $data;
	}
	/**
	 * Checks the post_date_gmt or modified_gmt and prepare any post or
	 * modified date for single post output.
	 *
	 * @param string      $date_gmt GMT publication time.
	 * @param string|null $date     Optional. Local publication time. Default null.
	 * @return string|null ISO8601/RFC3339 formatted datetime.
	 */
	protected function prepare_date_response( $date_gmt, $date = null ) {
		// Use the date if passed.
		if ( isset( $date ) ) {
			return mysql2date( 'Y-m-d\TH:i:s', $date, false );
		}

		// Return null if $date_gmt is empty/zeros.
		if ( '0000-00-00 00:00:00' === $date_gmt ) {
			return null;
		}

		// Return the formatted datetime.
		return mysql2date( 'Y-m-d\TH:i:s', $date_gmt, false );
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_query_params() {
		$query_params  = parent::get_collection_params();

		$query_params[ self::PROP_TYPE ] = array(
			'description' => __( 'Limit results to items of a specific post type.', 'kadence-blocks' ),
			'type'        => 'string',
			'sanitize_callback' => array( $this, 'sanitize_post_type_string' ),
			'validate_callback' => array( $this, 'validate_post_type_string' ),
		);
		// $query_params[ self::PROP_MULTIPLE ] = array(
		// 	'description'       => __( 'Allow Multiple Post Types.', 'kadence-blocks' ),
		// 	'type'              => 'boolean',
		// 	'sanitize_callback' => array( $this, 'sanitize_allow_sticky' ),
		// );
		// $query_params[ self::PROP_TYPE ] = array(
		// 	'description' => __( 'Limit results to items of an object type.', 'kadence-blocks' ),
		// 	'type'        => 'array',
		// 	'items'       => array(
		// 		'type' => 'string',
		// 	),
		// 	'sanitize_callback' => array( $this, 'sanitize_post_types' ),
		// );
		$query_params[ self::PROP_INCLUDE ] = array(
			'description' => __( 'Include posts by ID.', 'kadence-blocks' ),
			'type'        => 'array',
			'validate_callback' => array( $this, 'validate_post_ids' ),
			'sanitize_callback' => array( $this, 'sanitize_post_ids' ),
		);
		$query_params[ self::PROP_PER_PAGE ] = array(
			'description' => __( 'Number of results to return.', 'kadence-blocks' ),
			'type'        => 'number',
			'sanitize_callback' => array( $this, 'sanitize_post_perpage' ),
			'default' => 25,
		);
		$query_params[ self::PROP_QUERY ] = array(
			'description' => __( 'Define Type of Query.', 'kadence-blocks' ),
			'type'        => 'string',
		);
		$query_params[ self::PROP_ORDER ] = array(
			'description' => __( 'Define Query Order.', 'kadence-blocks' ),
			'type'        => 'string',
		);
		$query_params[ self::PROP_ORDER_BY ] = array(
			'description' => __( 'Define Query Order By.', 'kadence-blocks' ),
			'type'        => 'string',
		);
		$query_params[ self::PROP_ALLOW_STICKY ] = array(
			'description'       => __( 'Allow Sticky in Query.', 'kadence-blocks' ),
			'type'              => 'boolean',
			'sanitize_callback' => array( $this, 'sanitize_allow_sticky' ),
		);
		$query_params[ self::PROP_EXCLUDE ] = array(
			'description' => __( 'Exclude Category.', 'kadence-blocks' ),
			'type'        => 'string',
		);
		$query_params[ self::PROP_OFFSET ] = array(
			'description' => __( 'Number of items to offset in query.', 'kadence-blocks' ),
			'type'        => 'number',
			'sanitize_callback' => array( $this, 'sanitize_results_page_number' ),
			'default' => 0,
		);
		$query_params[ self::PROP_POST_ID ] = array(
			'description' => __( 'The Current Post ID.', 'kadence-blocks' ),
			'type'        => 'number',
		);
		$query_params[ self::PROP_CUSTOM_TAX ] = array(
			'description' => __( 'Check if using a custom Taxonomy', 'kadence-blocks' ),
			'type'              => 'boolean',
			'sanitize_callback' => array( $this, 'sanitize_allow_sticky' ),
		);
		$query_params[ self::PROP_TAX_TYPE ] = array(
			'description' => __( 'Define Query Order By.', 'kadence-blocks' ),
			'type'        => 'string',
		);
		$query_params[ self::PROP_CATEGORY ] = array(
			'description' => __( 'Include posts category.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'wp_parse_id_list',
		);
		$query_params[ self::PROP_TAGS ] = array(
			'description' => __( 'Include posts tags.', 'kadence-blocks' ),
			'type'              => 'string',
			'sanitize_callback' => 'wp_parse_id_list',
		);
		return $query_params;
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_term_params() {
		$query_params  = parent::get_collection_params();
		$query_params[ self::PROP_TAX_TYPE ] = array(
			'description' => __( 'Taxonomy Type.', 'kadence-blocks-pro' ),
			'type'        => 'string',
		);
		$query_params[ self::PROP_SOURCE ] = array(
			'description' => __( 'The source of the content.', 'kadence-blocks-pro' ),
			'type'        => 'string',
			'default'     => 'current',
		);
		return $query_params;
	}

	/**
	 * Retrieves the query params for the search results collection.
	 *
	 * @return array Collection parameters.
	 */
	public function get_tax_select_params() {
		$query_params  = parent::get_collection_params();

		$query_params[ self::PROP_SOURCE ] = array(
			'description' => __( 'The source of the content.', 'kadence-blocks-pro' ),
			'type'        => 'string',
			'default'     => '',
			'sanitize_callback' => array( $this, 'sanitize_post_source_string' ),
			'validate_callback' => array( $this, 'validate_post_source_string' ),
		);
		$query_params[ self::PROP_PER_PAGE ] = array(
			'description' => __( 'Number of results to return.', 'kadence-blocks-pro' ),
			'type'        => 'number',
			'sanitize_callback' => array( $this, 'sanitize_post_perpage' ),
			'default' => 25,
		);
		$query_params[ self::PROP_PAGE ] = array(
			'description' => __( 'Page of results to return.', 'kadence-blocks-pro' ),
			'type'        => 'number',
			'sanitize_callback' => array( $this, 'sanitize_results_page_number' ),
			'default' => 1,
		);
		return $query_params;
	}

	/**
	 * Sanitizes the list of subtypes, to ensure only subtypes of the passed type are included.
	 *
	 * @param array    $post_types  One or more post types.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_post_types( $post_types, $request ) {
		$allowed_types = $this->get_allowed_post_types();
		return array_unique( array_intersect( $post_types, $allowed_types ) );
	}

	/**
	 * Sanitizes the post type string, to ensure only the allowed post types are included.
	 *
	 * @param string   $post_type  One post type.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_post_type_string( $post_type, $request ) {
		return sanitize_text_field( $post_type );
	}
	/**
	 * Validates the post type, to ensure it's a string.
	 *
	 * @param array    $value  One or more subtypes.
	 * @return bool    true or false.
	 */
	public function validate_post_type_string( $value ) {
		$allowed_types = $this->get_allowed_post_types();
		return in_array( $value, $allowed_types );
	}
	/**
	 * Validates the list of subtypes, to ensure it's an array.
	 *
	 * @param array    $value  One or more subtypes.
	 * @return bool    true or false.
	 */
	public function validate_post_types( $value ) {
		return is_array( $value );
	}
	/**
	 * Sanitizes the post type string, to ensure only the allowed post types are included.
	 *
	 * @param string   $post_type  One post type.
	 * @param WP_REST_Request $request   Full details about the request.
	 * @param string          $parameter Parameter name.
	 * @return array|WP_Error List of valid subtypes, or WP_Error object on failure.
	 */
	public function sanitize_post_source_string( $source, $request ) {
		return sanitize_text_field( $source );
	}
	/**
	 * Validates the post type, to ensure it's a string.
	 *
	 * @param array    $value  One or more subtypes.
	 * @return bool    true or false.
	 */
	public function validate_post_source_string( $value ) {
		if ( '' !== $value ) {
			return true;
		}
		return false;
	}

	/**
	 * Sanitizes the list of ids, to ensure it's only numbers.
	 *
	 * @param array    $ids  One or more post ids.
	 * @return array   array of numbers
	 */
	public function sanitize_post_ids( $ids ) {
		return array_map( 'absint', $ids );
	}

	/**
	 * Validates the list of ids, to ensure it's not empty.
	 *
	 * @param array    $ids  One or more post ids.
	 * @return bool    true or false.
	 */
	public function validate_post_ids( $ids ) {
		return count( $ids ) > 0;
	}

	/**
	 * Sanitizes the perpage, to ensure it's only a number.
	 *
	 * @param integer  $val number page page.
	 * @return integer a number
	 */
	public function sanitize_post_perpage( $val ) {
		return min( absint( $val ), 100 );
	}


	/**
	 * Sanitizes the perpage, to ensure it's only a number.
	 *
	 * @param integer  $val number page page.
	 * @return integer a number
	 */
	public function sanitize_allow_sticky( $val ) {
		return $val ? 0 : 1;
	}

	/**
	 * Sanitizes the page number, to ensure it's only a number.
	 *
	 * @param integer  $val number page page.
	 * @return integer a number
	 */
	public function sanitize_results_page_number( $val ) {
		return absint( $val );
	}

	/**
	 * Get allowed post types.
	 *
	 * By default this is only post types that have show_in_rest set to true.
	 * You can filter this to support more post types if required.
	 *
	 * @return array
	 */
	public function get_allowed_post_types() {
		$allowed_types = array_values(
			get_post_types(
				array(
					'show_in_rest'       => true,
					'public'             => true,
				)
			)
		);

		$key = array_search( 'attachment', $allowed_types, true );

		if ( false !== $key ) {
			unset( $allowed_types[ $key ] );
		}

		/**
		 * Filter the allowed post types.
		 *
		 * Note that if you allow this for posts that are not otherwise public,
		 * this data will be accessible using this endpoint for any logged in user with the edit_post capability.
		 */
		return apply_filters( 'kadence_blocks_allowed_post_types', $allowed_types );
	}

	/**
	 * Get allowed tax filters.
	 *
	 * @return array
	 */
	public function get_allowed_tax_filters() {
		$taxonomies = array();

		foreach ( $this->get_allowed_post_types() as $post_type ) {
			$taxonomies = array_merge(
				$taxonomies,
				wp_list_filter( get_object_taxonomies( $post_type, 'objects' ), array( 'show_in_rest' => true ) )
			);
		}

		return $taxonomies;
	}
}
