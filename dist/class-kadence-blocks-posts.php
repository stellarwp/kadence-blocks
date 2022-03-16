<?php
/**
 * Setup the Posts Block.
 *
 * @since   1.9.20
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Table of Contents.
 *
 * @category class
 */
class Kadence_Blocks_Posts {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Class Constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'on_init' ), 20 );
		add_action( 'enqueue_block_assets', array( $this, 'blocks_assets' ) );
		// add_filter( 'rest_post_collection_params', array( $this, 'rand_orderby_rest_post_collection_params' ) );
		// add_filter( 'rest_post_collection_params', array( $this, 'menu_order_orderby_rest_post_collection_params' ) );
		//add_action( 'rest_api_init', array( $this, 'register_rest_fields' ) );
	}
	/**
	 * Get image info for the rest field
	 *
	 * @param object $object Post Object.
	 * @param string $field_name Field name.
	 * @param object $request Request Object
	 */
	public function get_large_image_src( $object, $field_name, $request ) {
		$feat_img_array = array();
		if ( post_type_supports( $object['type'], 'thumbnail' ) ) {
			$feat_img_array = wp_get_attachment_image_src(
				$object['featured_media'],
				'large',
				false
			);
		}
		return $feat_img_array;
	}
	/**
	 * Get author info for the rest field
	 *
	 * @param object $object Post Object.
	 * @param string $field_name Field name.
	 * @param object $request Request Object.
	 */
	public function get_author_info( $object, $field_name, $request ) {
		$author_data = array();
		if ( post_type_supports( $object['type'], 'author' ) ) {
			// Get the author name.
			$author_data['display_name'] = get_the_author_meta( 'display_name', $object['author'] );

			// Get the author link.
			$author_data['author_link'] = get_author_posts_url( $object['author'] );
			// Get the author link.
			$author_data['author_image'] = get_avatar_url( $object['author'], 50 );
		}

		// Return the author data.
		return $author_data;
	}
	/**
	 * Get comment info for rest api.
	 *
	 * @param object $object Post Object.
	 * @param string $field_name Field name.
	 * @param object $request Request Object.
	 */
	public function get_comment_info( $object, $field_name, $request ) {
		// Get the comments count.
		$comments_count = wp_count_comments( $object['id'] );
		return $comments_count->total_comments;
	}
	/**
	 * Get category info for the rest field
	 *
	 * @param object $object Post Object.
	 * @param string $field_name Field name.
	 * @param object $request Request Object.
	 */
	public function get_category_info( $object, $field_name, $request ) {
		$category_array = get_the_category( $object['id'] );
		return $category_array;
	}
	/**
	 * Create API fields for additional info
	 */
	public function register_rest_fields() {
		// Add featured image source.
		$post_types = kadence_blocks_get_post_types();
		foreach ( $post_types as $key => $post_type ) {
			register_rest_field(
				$post_type['value'],
				'kb_featured_image_src_large',
				array(
					'get_callback'    => array( $this, 'get_large_image_src' ),
					'update_callback' => null,
					'schema'          => null,
				)
			);
			// Add author info.
			register_rest_field(
				$post_type['value'],
				'kb_author_info',
				array(
					'get_callback'    => array( $this, 'get_author_info' ),
					'update_callback' => null,
					'schema'          => null,
				)
			);
			// Add comment info.
			register_rest_field(
				$post_type['value'],
				'kb_comment_info',
				array(
					'get_callback'    => array( $this, 'get_comment_info' ),
					'update_callback' => null,
					'schema'          => null,
				)
			);
		}
		// Add category info.
		register_rest_field(
			'post',
			'kb_category_info',
			array(
				'get_callback'    => array( $this, 'get_category_info' ),
				'update_callback' => null,
				'schema'          => null,
			)
		);
	}

	/**
	 * Add `rand` as an option for orderby param in REST API.
	 * Hook to `rest_{$this->post_type}_collection_params` filter.
	 *
	 * @param array $query_params Accepted parameters.
	 * @return array
	 */
	public function rand_orderby_rest_post_collection_params( $query_params ) {
		$query_params['orderby']['enum'][] = 'rand';
		return $query_params;
	}
	/**
	 * Add `menu_order` as an option for orderby param in REST API.
	 * Hook to `rest_{$this->post_type}_collection_params` filter.
	 *
	 * @param array $query_params Accepted parameters.
	 * @return array
	 */
	public function menu_order_orderby_rest_post_collection_params( $query_params ) {
		$query_params['orderby']['enum'][] = 'menu_order';
		return $query_params;
	}
	/**
	 * Render Inline CSS helper function
	 *
	 * @param array  $css the css for each rendered block.
	 * @param string $style_id the unique id for the rendered style.
	 * @param bool   $in_content the bool for whether or not it should run in content.
	 */
	public function render_inline_css( $css, $style_id, $in_content = false ) {
		if ( ! is_admin() ) {
			wp_register_style( $style_id, false );
			wp_enqueue_style( $style_id );
			wp_add_inline_style( $style_id, $css );
			if ( 1 === did_action( 'wp_head' ) && $in_content ) {
				wp_print_styles( $style_id );
			}
		}
	}
	/**
	 *
	 * Register and Enqueue block assets
	 *
	 * @since 1.0.0
	 */
	public function blocks_assets() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		$this->register_scripts();
	}
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		// Lets register all the block styles.
		wp_register_style( 'kadence-blocks-posts', KADENCE_BLOCKS_URL . 'dist/blocks/posts.style.build.css', array(), KADENCE_BLOCKS_VERSION );
	}

	/**
	 * Registers and enqueue's styles.
	 *
	 * @param string  $handle the handle for the script.
	 */
	public function enqueue_style( $handle ) {
		if ( ! wp_style_is( $handle, 'registered' ) ) {
			$this->register_scripts();
		}
		wp_enqueue_style( $handle );
	}
	/**
	 * On init startup.
	 */
	public function on_init() {
		// Only load if Gutenberg is available.
		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}
		register_block_type(
			'kadence/posts',
			array(
				'render_callback' => array( $this, 'render_posts' ),
				'editor_script'   => 'kadence-blocks-js',
				'editor_style'    => 'kadence-blocks-editor-css',
			)
		);
	}
	/**
	 * Render Posts Block
	 *
	 * @param array $attributes the blocks attribtues.
	 */
	public function render_posts( $attributes, $content ) {
		if ( ! is_array( $attributes ) ) {
			return;
		}
		global $kadence_blocks_posts_not_in;
		if ( ! isset( $kadence_blocks_posts_not_in ) || ! is_array( $kadence_blocks_posts_not_in ) ) {
			$kadence_blocks_posts_not_in = array();
		}
		// CSS classes.
		$classes   = array();
		$classes[] = 'wp-block-kadence-posts';
		$classes[] = 'kb-posts';
		$classes[] = 'kb-posts-id-' . ( isset( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : '' );
		$classes[] = 'content-wrap';
		$classes[] = 'grid-cols';
		$classes[] = 'kb-posts-style-' . ( isset( $attributes['loopStyle'] ) ? $attributes['loopStyle'] : 'boxed' );
		if ( isset( $attributes['columns'] ) && ! empty( $attributes['columns'] ) ) {
			$columns = absint( $attributes['columns'] );
		} else {
			$columns = 3;
		}
		if ( 1 === $columns ) {
			$placement = ( isset( $attributes['alignImage'] ) && ! empty( $attributes['alignImage'] ) ? $attributes['alignImage'] : 'beside' );
			$classes[] = 'grid-sm-col-1';
			$classes[] = 'grid-lg-col-1';
			$classes[] = 'item-image-style-' . $placement;
		} elseif ( 2 === $columns ) {
			if ( isset( $attributes['tabletColumns'] ) && ! empty( $attributes['tabletColumns'] ) && 1 === $attributes['tabletColumns'] ) {
				$classes[] = 'grid-sm-col-1';
			} else {
				$classes[] = 'grid-sm-col-2';
			}
			$classes[] = 'grid-lg-col-2';
			$classes[] = 'item-image-style-above';
		} else {
			if ( isset( $attributes['tabletColumns'] ) && ! empty( $attributes['tabletColumns'] ) && 1 === $attributes['tabletColumns'] ) {
				$classes[] = 'grid-sm-col-1';
			} elseif ( isset( $attributes['tabletColumns'] ) && ! empty( $attributes['tabletColumns'] ) && 3 === $attributes['tabletColumns'] ) {
				$classes[] = 'grid-sm-col-3';
			} else {
				$classes[] = 'grid-sm-col-2';
			}
			$classes[] = 'grid-lg-col-3';
			$classes[] = 'item-image-style-above';
		}
		// Add custom CSS classes to class string.
		if ( isset( $attributes['className'] ) ) {
			$classes[] .= ' ' . $attributes['className'];
		}
		$classes = apply_filters( 'kadence_blocks_posts_container_classes', $classes );
		do_action( 'kadence_blocks_posts_before_query', $attributes );
		if ( apply_filters( 'kadence_blocks_posts_block_exclude_current', true ) && is_singular() ) {
			if ( ! in_array( get_the_ID(), $kadence_blocks_posts_not_in, true ) ) {
				$kadence_blocks_posts_not_in[] = get_the_ID();
			}
		}
		$post_type = ( isset( $attributes['postType'] ) && ! empty( $attributes['postType'] ) ? $attributes['postType'] : 'post' );
		$args = array(
			'post_type'           => $post_type,
			'posts_per_page'      => ( isset( $attributes['postsToShow'] ) && ! empty( $attributes['postsToShow'] ) ? $attributes['postsToShow'] : 6 ),
			'post_status'         => 'publish',
			'order'               => ( isset( $attributes['order'] ) && ! empty( $attributes['order'] ) ? $attributes['order'] : 'desc' ),
			'orderby'             => ( isset( $attributes['orderBy'] ) && ! empty( $attributes['orderBy'] ) ? $attributes['orderBy'] : 'date' ),
			'ignore_sticky_posts' => ( isset( $attributes['allowSticky'] ) && $attributes['allowSticky'] ? 0 : 1 ),
			'post__not_in'        => ( isset( $kadence_blocks_posts_not_in ) && is_array( $kadence_blocks_posts_not_in ) ? $kadence_blocks_posts_not_in : array() ),
		);
		if ( isset( $attributes['offsetQuery'] ) && ! empty( $attributes['offsetQuery'] ) ) {
			$args['offset'] = $attributes['offsetQuery'];
		}
		if ( isset( $attributes['categories'] ) && ! empty( $attributes['categories'] ) && is_array( $attributes['categories'] ) ) {
			$categories = array();
			$i = 1;
			foreach ( $attributes['categories'] as $key => $value ) {
				$categories[] = $value['value'];
			}
		} else {
			$categories = array();
		}
		if ( 'post' !== $post_type || ( isset( $attributes['postTax'] ) && true === $attributes['postTax'] ) ) {
			if ( isset( $attributes['taxType'] ) && ! empty( $attributes['taxType'] ) ) {
				$args['tax_query'][] = array(
					'taxonomy' => ( isset( $attributes['taxType'] ) ) ? $attributes['taxType'] : 'category',
					'field'    => 'id',
					'terms'    => $categories,
					'operator' => ( isset( $attributes['excludeTax'] ) && 'exclude' === $attributes['excludeTax'] ? 'NOT IN' : 'IN' ),
				);
			}
		} else {
			if ( isset( $attributes['tags'] ) && ! empty( $attributes['tags'] ) && is_array( $attributes['tags'] ) ) {
				$tags = array();
				$i = 1;
				foreach ( $attributes['tags'] as $key => $value ) {
					$tags[] = $value['value'];
				}
			} else {
				$tags = array();
			}
			if ( isset( $attributes['excludeTax'] ) && 'exclude' === $attributes['excludeTax'] ) {
				$args['category__not_in'] = $categories;
				$args['tag__not_in'] = $tags;
			} else {
				$args['category__in'] = $categories;
				$args['tag__in'] = $tags;
			}
		}
		$args = apply_filters( 'kadence_blocks_posts_query_args', $args );
		$loop = new WP_Query( $args );
		ob_start();
		do_action( 'kadence_blocks_posts_query_start', $attributes, $loop );
		if ( $loop->have_posts() ) {
			echo '<div class="' . esc_attr( esc_attr( implode( ' ', $classes ) ) ) . '">';
			while ( $loop->have_posts() ) {
				$loop->the_post();
				if ( isset( $attributes['showUnique'] ) && true === $attributes['showUnique'] ) {
					$kadence_blocks_posts_not_in[] = get_the_ID();
				}
				kadence_blocks_get_template( 'entry.php', array( 'attributes' => $attributes ) );
			}
			echo '</div>';
		} else {
			echo wp_kses_post( apply_filters( 'kadence_blocks_posts_empty_query', '<p>' . esc_html__( 'No posts', 'kadence-blocks' ) . '</p>' ) );
		}
		wp_reset_postdata();
		do_action( 'kadence_blocks_posts_query_end', $attributes, $loop );
		do_action( 'kadence_blocks_posts_after_query', $attributes );
		$output = ob_get_contents();
		ob_end_clean();
		$content = $output . $content;
		if ( ! class_exists( 'Kadence\Theme' ) && ! wp_style_is( 'kadence-blocks-posts', 'enqueued' ) ) {
			wp_enqueue_style( 'kadence-blocks-posts' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kb-posts' . esc_attr( $unique_id );
			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'posts', $unique_id ) ) {
				if ( ! doing_filter( 'the_content' ) ) {
					if ( ! class_exists( 'Kadence\Theme' ) && ! wp_style_is( 'kadence-blocks-posts', 'done' ) ) {
						wp_print_styles( 'kadence-blocks-posts' );
					}
				} else {
					if ( ! class_exists( 'Kadence\Theme' ) && ! wp_style_is( 'kadence-blocks-posts', 'done' ) ) {
						ob_start();
						wp_print_styles( 'kadence-blocks-posts' );
						$content = ob_get_clean() . $content;
					}
				}
				$css = $this->output_css( $attributes, $unique_id );
				if ( ! empty( $css ) ) {
					if ( doing_filter( 'the_content' ) ) {
						$content = '<style id="' . $style_id . '">' . $css . '</style>' . $content;
					} else {
						$this->render_inline_css( $css, $style_id, true );
					}
				}
			}
		}
		return $content;
	}
	/**
	 * Output CSS styling for Table of Contents Block
	 *
	 * @param string $color the output color.
	 */
	public function output_css( $attributes, $unique_id ) {
		$css                    = new Kadence_Blocks_CSS();
		$media_query            = array();
		$media_query['mobile']  = apply_filters( 'kadence_mobile_media_query', '(max-width: 767px)' );
		$media_query['tablet']  = apply_filters( 'kadence_tablet_media_query', '(max-width: 1024px)' );
		$media_query['desktop'] = apply_filters( 'kadence_tablet_media_query', '(min-width: 1025px)' );
		$title_font = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) ? $attributes['titleFont'][0] : array() );
		$css->set_selector( '.kb-posts-id-' . $unique_id . ' .entry.loop-entry .entry-header .entry-title' );
		if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && isset( $title_font['size'][0] ) && ! empty( $title_font['size'][0] ) ) {
			$css->add_property( 'font-size', $title_font['size'][0] . ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) );
		}
		if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && isset( $title_font['lineHeight'][0] ) && ! empty( $title_font['lineHeight'][0] ) ) {
			$css->add_property( 'line-height', $title_font['lineHeight'][0] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
		}
		if ( isset( $title_font['letterSpacing'] ) && is_array( $title_font['letterSpacing'] ) && isset( $title_font['letterSpacing'][0] ) && ! empty( $title_font['letterSpacing'][0] ) ) {
			$css->add_property( 'letter-spacing', $title_font['letterSpacing'][0] . ( ! isset( $title_font['letterType'] ) ? 'px' : $title_font['letterType'] ) );
		}
		if ( isset( $title_font['textTransform'] ) && ! empty( $title_font['textTransform'] ) ) {
			$css->add_property( 'text-transform', $title_font['textTransform'] );
		}
		if ( isset( $attributes['loopStyle'] ) && 'unboxed' === $attributes['loopStyle'] ) {
			if ( class_exists( 'Kadence\Theme' ) ) {
				$css->set_selector( '.kb-posts-id-' . $unique_id . ' .loop-entry' );
				$css->add_property( 'background', 'transparent' );
				$css->add_property( 'box-shadow', 'none' );
				$css->set_selector( '.kb-posts-id-' . $unique_id . ' .loop-entry > .entry-content-wrap' );
				$css->add_property( 'padding', '0px' );
				$css->set_selector( '.kb-posts-id-' . $unique_id . ' .loop-entry .post-thumbnail' );
				$css->add_property( 'margin-bottom', '1em' );
			}
		} else {
			if ( class_exists( 'Kadence\Theme' ) && defined( 'KADENCE_VERSION' ) ) {
				if ( version_compare( KADENCE_VERSION, '1.0.16', '<' ) ) {
					$css->set_selector( '.wp-block-kadence-posts.kb-posts-id-' . $unique_id . ' .entry.loop-entry > .entry-content-wrap' );
					$css->add_property( 'padding', '2rem' );
				}
			}
		}
		$css->start_media_query( $media_query['tablet'] );
		$css->set_selector( '.kb-posts-id-' . $unique_id . ' .entry.loop-entry .entry-header .entry-title' );
		if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && isset( $title_font['size'][1] ) && ! empty( $title_font['size'][1] ) ) {
			$css->add_property( 'font-size', $title_font['size'][1] . ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) );
		}
		if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && isset( $title_font['lineHeight'][1] ) && ! empty( $title_font['lineHeight'][1] ) ) {
			$css->add_property( 'line-height', $title_font['lineHeight'][1] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
		}
		if ( isset( $title_font['letterSpacing'] ) && is_array( $title_font['letterSpacing'] ) && isset( $title_font['letterSpacing'][1] ) && ! empty( $title_font['letterSpacing'][1] ) ) {
			$css->add_property( 'letter-spacing', $title_font['letterSpacing'][1] . ( ! isset( $title_font['letterType'] ) ? 'px' : $title_font['letterType'] ) );
		}
		$css->stop_media_query();
		$css->start_media_query( $media_query['mobile'] );
		$css->set_selector( '.kb-posts-id-' . $unique_id . ' .entry.loop-entry .entry-header .entry-title' );
		if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && isset( $title_font['size'][2] ) && ! empty( $title_font['size'][2] ) ) {
			$css->add_property( 'font-size', $title_font['size'][2] . ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) );
		}
		if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && isset( $title_font['lineHeight'][2] ) && ! empty( $title_font['lineHeight'][2] ) ) {
			$css->add_property( 'line-height', $title_font['lineHeight'][2] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
		}
		if ( isset( $title_font['letterSpacing'] ) && is_array( $title_font['letterSpacing'] ) && isset( $title_font['letterSpacing'][2] ) && ! empty( $title_font['letterSpacing'][2] ) ) {
			$css->add_property( 'letter-spacing', $title_font['letterSpacing'][2] . ( ! isset( $title_font['letterType'] ) ? 'px' : $title_font['letterType'] ) );
		}
		$css->stop_media_query();
		return $css->css_output();
	}
	/**
	 * Adds var to color output if needed.
	 *
	 * @param string $color the output color.
	 */
	public function kadence_color_output( $color, $opacity = null ) {
		if ( strpos( $color, 'palette' ) === 0 ) {
			$color = 'var(--global-' . $color . ')';
		} else if ( isset( $opacity ) && is_numeric( $opacity ) ) {
			$color = $this->hex2rgba( $color, $opacity );
		}
		return $color;
	}
}
Kadence_Blocks_Posts::get_instance();
