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
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$title_font = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && is_array( $attributes['titleFont'][0] ) ? $attributes['titleFont'][0] : array() );
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
		} else {
			if ( class_exists( 'Kadence\Theme' ) && defined( 'KADENCE_VERSION' ) ) {
				if ( version_compare( KADENCE_VERSION, '1.0.16', '<' ) ) {
					$css->set_selector( '.wp-block-kadence-posts.kb-posts-id-' . $unique_id . ' .entry.loop-entry > .entry-content-wrap' );
					$css->add_property( 'padding', '2rem' );
				}
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
		$args      = array(
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
			$i          = 1;
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
				$i    = 1;
				foreach ( $attributes['tags'] as $key => $value ) {
					$tags[] = $value['value'];
				}
			} else {
				$tags = array();
			}
			if ( isset( $attributes['excludeTax'] ) && 'exclude' === $attributes['excludeTax'] ) {
				$args['category__not_in'] = $categories;
				$args['tag__not_in']      = $tags;
			} else {
				$args['category__in'] = $categories;
				$args['tag__in']      = $tags;
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

		return $output . $content;

	}

}

Kadence_Blocks_Posts_Block::get_instance();
