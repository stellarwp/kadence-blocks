<?php
/**
 * Class to Build the Posts Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Posts Block.
 *
 * @category class
 */
class Kadence_Blocks_Posts_Block extends Kadence_Blocks_Abstract_Block {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'posts';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

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
	 * Builds CSS for block.
	 *
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string             $unique_id the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$title_font = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) ? $attributes['titleFont'][0] : [] );
		$css->set_selector( '.kb-posts-id-' . $unique_id . ' .entry.loop-entry .entry-header .entry-title' );
		if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && isset( $title_font['size'][0] ) && ! empty( $title_font['size'][0] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $title_font['size'][0], ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) ) );
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
		} elseif ( class_exists( 'Kadence\Theme' ) && defined( 'KADENCE_VERSION' ) ) {
			if ( version_compare( KADENCE_VERSION, '1.0.16', '<' ) ) {
				$css->set_selector( '.wp-block-kadence-posts.kb-posts-id-' . $unique_id . ' .entry.loop-entry > .entry-content-wrap' );
				$css->add_property( 'padding', '2rem' );
			}
		}
		$css->set_media_state( 'tablet' );
		$css->set_selector( '.kb-posts-id-' . $unique_id . ' .entry.loop-entry .entry-header .entry-title' );
		if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && ! empty( $title_font['size'][1] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $title_font['size'][1], ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) ) );
		}
		if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && ! empty( $title_font['lineHeight'][1] ) ) {
			$css->add_property( 'line-height', $title_font['lineHeight'][1] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
		}
		if ( isset( $title_font['letterSpacing'] ) && is_array( $title_font['letterSpacing'] ) && isset( $title_font['letterSpacing'][1] ) && ! empty( $title_font['letterSpacing'][1] ) ) {
			$css->add_property( 'letter-spacing', $title_font['letterSpacing'][1] . ( ! isset( $title_font['letterType'] ) ? 'px' : $title_font['letterType'] ) );
		}
		$css->set_media_state( 'desktop' );

		$css->set_media_state( 'mobile' );
		$css->set_selector( '.kb-posts-id-' . $unique_id . ' .entry.loop-entry .entry-header .entry-title' );
		if ( isset( $title_font['size'] ) && is_array( $title_font['size'] ) && isset( $title_font['size'][2] ) && ! empty( $title_font['size'][2] ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $title_font['size'][2], ( ! isset( $title_font['sizeType'] ) ? 'px' : $title_font['sizeType'] ) ) );
		}
		if ( isset( $title_font['lineHeight'] ) && is_array( $title_font['lineHeight'] ) && isset( $title_font['lineHeight'][2] ) && ! empty( $title_font['lineHeight'][2] ) ) {
			$css->add_property( 'line-height', $title_font['lineHeight'][2] . ( ! isset( $title_font['lineType'] ) ? 'px' : $title_font['lineType'] ) );
		}
		if ( isset( $title_font['letterSpacing'] ) && is_array( $title_font['letterSpacing'] ) && isset( $title_font['letterSpacing'][2] ) && ! empty( $title_font['letterSpacing'][2] ) ) {
			$css->add_property( 'letter-spacing', $title_font['letterSpacing'][2] . ( ! isset( $title_font['letterType'] ) ? 'px' : $title_font['letterType'] ) );
		}
		$css->set_media_state( 'desktop' );

		$css->set_selector( '.kb-posts-id-' . $unique_id . ' .kb-post-list-item' );
		$css->add_property( 'display', 'grid' );

		return $css->css_output();
	}
	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		if ( ! is_array( $attributes ) ) {
			return;
		}
		global $kadence_blocks_posts_not_in;
		$kadence_blocks_posts_not_in_local = [];
		if ( ! isset( $kadence_blocks_posts_not_in ) || ! is_array( $kadence_blocks_posts_not_in ) ) {
			$kadence_blocks_posts_not_in = [];
		}
		// CSS classes.
		$classes   = [];
		$classes[] = 'wp-block-kadence-posts';
		$classes[] = 'kb-posts';
		$classes[] = 'kadence-posts-list';
		$classes[] = 'kb-posts-id-' . ( $attributes['uniqueID'] ?? '' );
		$classes[] = 'content-wrap';
		$classes[] = 'grid-cols';
		$classes[] = 'kb-posts-style-' . ( $attributes['loopStyle'] ?? 'boxed' );
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
		} elseif ( 4 === $columns ) {
			if ( isset( $attributes['tabletColumns'] ) && ! empty( $attributes['tabletColumns'] ) && 1 === $attributes['tabletColumns'] ) {
				$classes[] = 'grid-sm-col-1';
			} elseif ( isset( $attributes['tabletColumns'] ) && ! empty( $attributes['tabletColumns'] ) && 3 === $attributes['tabletColumns'] ) {
				$classes[] = 'grid-sm-col-3';
			} elseif ( isset( $attributes['tabletColumns'] ) && ! empty( $attributes['tabletColumns'] ) && 4 === $attributes['tabletColumns'] ) {
				$classes[] = 'grid-sm-col-4';
			} else {
				$classes[] = 'grid-sm-col-2';
			}
			$classes[] = 'grid-lg-col-4';
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
			$kadence_blocks_posts_not_in_local[] = get_the_ID();
		}

		$final_posts_not_in = isset( $kadence_blocks_posts_not_in ) && is_array( $kadence_blocks_posts_not_in ) ? array_merge( $kadence_blocks_posts_not_in, $kadence_blocks_posts_not_in_local ) : $kadence_blocks_posts_not_in_local;

		$post_type = ( isset( $attributes['postType'] ) && ! empty( $attributes['postType'] ) ? $attributes['postType'] : 'post' );
		$args      = [
			'post_type'           => $post_type,
			'posts_per_page'      => ( isset( $attributes['postsToShow'] ) && ! empty( $attributes['postsToShow'] ) ? $attributes['postsToShow'] : 6 ),
			'post_status'         => 'publish',
			'order'               => ( isset( $attributes['order'] ) && ! empty( $attributes['order'] ) ? $attributes['order'] : 'desc' ),
			'orderby'             => ( isset( $attributes['orderBy'] ) && ! empty( $attributes['orderBy'] ) ? $attributes['orderBy'] : 'date' ),
			'ignore_sticky_posts' => ( isset( $attributes['allowSticky'] ) && $attributes['allowSticky'] ? 0 : 1 ),
			'post__not_in'        => $final_posts_not_in,
		];
		if ( isset( $attributes['offsetQuery'] ) && ! empty( $attributes['offsetQuery'] ) ) {
			$args['offset'] = $attributes['offsetQuery'];
		}
		if ( isset( $attributes['categories'] ) && ! empty( $attributes['categories'] ) && is_array( $attributes['categories'] ) ) {
			$categories = [];
			$i          = 1;
			foreach ( $attributes['categories'] as $key => $value ) {
				$categories[] = $value['value'];
			}
		} else {
			$categories = [];
		}
		if ( 'post' !== $post_type || ( isset( $attributes['postTax'] ) && true === $attributes['postTax'] ) ) {
			if ( isset( $attributes['taxType'] ) && ! empty( $attributes['taxType'] ) ) {
				$args['tax_query'][] = [
					'taxonomy' => ( isset( $attributes['taxType'] ) ) ? $attributes['taxType'] : 'category',
					'field'    => 'id',
					'terms'    => $categories,
					'operator' => ( isset( $attributes['excludeTax'] ) && 'exclude' === $attributes['excludeTax'] ? 'NOT IN' : 'IN' ),
				];
			}
		} else {
			if ( isset( $attributes['tags'] ) && ! empty( $attributes['tags'] ) && is_array( $attributes['tags'] ) ) {
				$tags = [];
				$i    = 1;
				foreach ( $attributes['tags'] as $key => $value ) {
					$tags[] = $value['value'];
				}
			} else {
				$tags = [];
			}
			if ( isset( $attributes['excludeTax'] ) && 'exclude' === $attributes['excludeTax'] ) {
				$args['category__not_in'] = $categories;
				$args['tag__not_in']      = $tags;
			} else {
				$args['category__in'] = $categories;
				$args['tag__in']      = $tags;
			}
		}
		/**
		 * Filter the query arguments before executing the WP_Query.
		 *
		 * This filter allows developers to completely take over or modify the query arguments
		 * that are used to fetch posts for the Kadence Posts block. By hooking into this filter,
		 * you can override any default query parameters, add custom tax_query conditions,
		 * modify post_type, posts_per_page, order, orderby, or any other WP_Query parameter.
		 *
		 * @since 1.9.19
		 *
		 * @param array $args The array of query arguments that will be passed to WP_Query.
		 *                    Default arguments include:
		 *                    - post_type: The post type to query (default: 'post' or from attributes)
		 *                    - posts_per_page: Number of posts to show (default: 6 or from attributes)
		 *                    - post_status: Post status (default: 'publish')
		 *                    - order: Sort order (default: 'desc' or from attributes)
		 *                    - orderby: Sort by field (default: 'date' or from attributes)
		 *                    - ignore_sticky_posts: Whether to ignore sticky posts
		 *                    - post__not_in: Array of post IDs to exclude
		 *                    - offset: Number of posts to skip (if offsetQuery is set)
		 *                    - tax_query: Taxonomy query conditions (if applicable)
		 *                    - category__in/category__not_in: Category filters (if applicable)
		 *                    - tag__in/tag__not_in: Tag filters (if applicable)
		 * @param array $attributes The block attributes array containing all block settings.
		 *
		 * @return array Modified query arguments array.
		 *
		 * @example
		 * // Modify posts per page
		 * add_filter( 'kadence_blocks_posts_query_args', function( $args ) {
		 *     $args['posts_per_page'] = 12;
		 *     return $args;
		 * } );
		 *
		 * @example
		 * // Add custom meta query
		 * add_filter( 'kadence_blocks_posts_query_args', function( $args ) {
		 *     $args['meta_query'] = array(
		 *         array(
		 *             'key'     => 'featured_post',
		 *             'value'   => 'yes',
		 *             'compare' => '='
		 *         )
		 *     );
		 *     return $args;
		 * } );
		 *
		 * @example
		 * // Completely override query arguments
		 * add_filter( 'kadence_blocks_posts_query_args', function( $args ) {
		 *     return array(
		 *         'post_type'      => 'custom_post_type',
		 *         'posts_per_page' => 5,
		 *         'post_status'    => 'publish',
		 *         'orderby'        => 'title',
		 *         'order'          => 'ASC',
		 *     );
		 * } );
		 */
		$args = apply_filters( 'kadence_blocks_posts_query_args', $args );
		$loop = new WP_Query( $args );
		ob_start();

		do_action( 'kadence_blocks_posts_query_start', $attributes, $loop );
		if ( $loop->have_posts() ) {
			echo '<ul class="' . esc_attr( esc_attr( implode( ' ', $classes ) ) ) . '">';
			while ( $loop->have_posts() ) {
				$loop->the_post();
				if ( isset( $attributes['showUnique'] ) && true === $attributes['showUnique'] ) {
					$kadence_blocks_posts_not_in[] = get_the_ID();
				}
				kadence_blocks_get_template( 'entry.php', [ 'attributes' => $attributes ] );
			}
			echo '</ul>';
		} else {
			echo wp_kses_post( apply_filters( 'kadence_blocks_posts_empty_query', '<p>' . esc_html__( 'No posts', 'kadence-blocks' ) . '</p>' ) );
		}
		wp_reset_postdata();
		do_action( 'kadence_blocks_posts_query_end', $attributes, $loop );
		do_action( 'kadence_blocks_posts_after_query', $attributes );
		$output = ob_get_contents();
		ob_end_clean();

		return $output . $content;
	}
	/**
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		// Don't need to enqueue styles for this block if Kadence theme is active and it's newer than 1.3.0
		$has_kadence_theme = class_exists( 'Kadence\Theme' );
		if ( $has_kadence_theme && defined( 'KADENCE_VERSION' ) && version_compare( KADENCE_VERSION, '1.3.0', '>=' ) ) {
			$has_kadence_theme = true;
		} else {
			$has_kadence_theme = false;
		}
		if ( ! $has_kadence_theme || apply_filters( 'kadence_blocks_post_block_style_force_output', false ) ) {
			if ( ! wp_style_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_style( 'kadence-blocks-' . $this->block_name );
				if ( $inline ) {
					$this->should_render_inline_stylesheet( 'kadence-blocks-' . $this->block_name );
				}
			}
		}
	}
}

Kadence_Blocks_Posts_Block::get_instance();
