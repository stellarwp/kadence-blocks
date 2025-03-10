<?php
/**
 * Class to Build the Vector Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Vector Block.
 *
 * @category class
 */
class Kadence_Blocks_Vector_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'vector';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Block determines if style needs to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = true;

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
		$css->set_selector( '.kb-vector-container' . $unique_id );

		$css->render_measure_output( $attributes, 'margin', 'margin');
		$css->render_measure_output( $attributes, 'padding', 'padding' );
		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width' );
		
		// Center the SVG when alignment is not set
		if ( empty( $attributes['align'] ) ) {
			$css->add_property( 'margin-left', 'auto' );
			$css->add_property( 'margin-right', 'auto' );
			$css->add_property( 'display', 'flex' );
			$css->add_property( 'justify-content', 'center' );
		}

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
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id = $attributes['uniqueID'];
			$style_id = 'kb-vector' . esc_attr( $unique_id );

			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'vector', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_vector_render_block_attributes', $attributes );
			}

			$classes = array(
				'kb-vector-container',
				'kb-vector-container' . esc_attr( $unique_id ),
			);

			if ( ! empty( $attributes['align'] ) ) {
				$classes[] = 'align' . $attributes['align'];
			}

			// Add custom CSS classes to class string.
			if ( isset( $attributes['className'] ) ) {
				$classes[] = $attributes['className'];
			}

			$content = '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';
			
			if ( ! empty( $attributes['id'] ) ) {
				// Get the SVG content directly and render it inline
				$svg_content = $this->get_vector_svg( $attributes );
				if ( ! empty( $svg_content ) ) {
					$content .= $svg_content;
				}
			} else {
				$content .= '';
			}

			$content .= '</div>';
		}

		return $content;
	}

	/**
	 * Get the SVG content
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	public function get_vector_svg( $attributes ) {
		$svg_content = '';

		if ( isset( $attributes['id'] ) && ! empty( $attributes['id'] ) ) {
			$post_id = $attributes['id'];
			if ( ! empty( $post_id ) ) {
				$post = get_post( $post_id );
				if ( $post && 'kadence_vector' === $post->post_type ) {
					$svg_content = $post->post_content;
				}
			}
		}

		$svg_content = $this->sanitize_svg_content( $svg_content );

		return $svg_content;
	}

	/**
	 * Sanitize SVG content
	 *
	 * @param string $svg_content The SVG content.
	 * @return string Sanitized SVG content.
	 */
	private function sanitize_svg_content( $svg_content ) {
		// Simple sanitization - strip script tags and event handlers
		$svg_content = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $svg_content);
		$svg_content = preg_replace('/on\w+="[^"]*"/is', '', $svg_content);
		$svg_content = preg_replace('/on\w+=\'[^\']*\'/is', '', $svg_content);
		
		return $svg_content;
	}
} 

Kadence_Blocks_Vector_Block::get_instance();