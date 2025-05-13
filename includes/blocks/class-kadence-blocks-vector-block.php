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
	 * Placeholder SVG
	 * 
	 * @var string
	 */
	private $placeholder_svg = '<svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 496.016 496.016" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#1C769B;" d="M0.008,248c0,98.16,57.04,183,139.768,223.184L21.472,147.072C7.728,177.904,0.008,212.04,0.008,248 z"></path> <path style="fill:#1C769B;" d="M252.36,269.688l-74.416,216.224c22.232,6.536,45.712,10.104,70.064,10.104 c28.872,0,56.576-4.992,82.352-14.056c-0.656-1.072-1.272-2.184-1.768-3.416L252.36,269.688z"></path> <path style="fill:#1C769B;" d="M415.432,235.496c0-30.664-11.024-51.88-20.448-68.392c-12.584-20.456-24.376-37.752-24.376-58.168 c0-22.808,17.288-44.032,41.648-44.032c1.104,0,2.144,0.152,3.2,0.208C371.368,24.68,312.568,0,248.008,0 c-86.656,0-162.864,44.456-207.2,111.776c5.824,0.184,11.304,0.304,15.952,0.304c25.928,0,66.104-3.152,66.104-3.152 c13.36-0.8,14.928,18.856,1.568,20.424c0,0-13.432,1.584-28.384,2.376l90.312,268.616l54.28-162.768l-38.616-105.848 c-13.376-0.792-26.032-2.376-26.032-2.376c-13.36-0.792-11.8-21.216,1.584-20.424c0,0,40.952,3.152,65.32,3.152 c25.936,0,66.096-3.152,66.096-3.152c13.376-0.8,14.944,18.856,1.576,20.424c0,0-13.448,1.584-28.376,2.376l89.624,266.576 l24.76-82.648C407.256,281.336,415.432,256.712,415.432,235.496z"></path> <path style="fill:#1C769B;" d="M467.312,154.52c0,25.16-4.704,53.448-18.872,88.832l-75.744,219 c73.728-42.976,123.312-122.864,123.312-214.344c0-43.128-11.016-83.664-30.376-118.992 C466.712,136.92,467.312,145.384,467.312,154.52z"></path> </g> <path style="fill:#2795B7;" d="M370.616,108.928c0-22.808,17.288-44.032,41.648-44.032c1.104,0,2.144,0.152,3.2,0.208 C371.368,24.68,312.568,0,248.008,0c-86.656,0-162.864,44.456-207.2,111.776c5.824,0.184,11.304,0.304,15.952,0.304 c25.928,0,66.104-3.152,66.104-3.152c13.36-0.8,14.928,18.856,1.568,20.424c0,0-13.432,1.584-28.384,2.376l34.44,102.432 c23.432,8.272,48.816,12.824,75.328,12.824c11.032,0,21.872-0.792,32.472-2.304l2.36-7.096l-38.616-105.848 C188.656,130.944,176,129.36,176,129.36c-13.36-0.792-11.8-21.216,1.584-20.424c0,0,40.952,3.152,65.32,3.152 c25.936,0,66.096-3.152,66.096-3.152c13.376-0.8,14.944,18.856,1.576,20.424c0,0-13.448,1.584-28.376,2.376l29.84,88.768 c30.288-16.288,55.952-39.288,74.664-66.88C377.688,138.656,370.616,124.72,370.616,108.928z"></path> <path style="fill:#3FB5D1;" d="M248.008,0c-77.816,0-147.128,35.92-192.6,91.984c39.912,8.296,83.744,12.896,129.744,12.896 c87.104,0,166.464-16.456,226.136-43.448C367.672,23.216,310.56,0,248.008,0z"></path> </g></svg>';

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
		
		// Center the SVG when alignment is not set
		if ( empty( $attributes['align'] ) ) {
			$css->add_property( 'display', 'flex' );
			$css->add_property( 'justify-content', 'center' );
		}

		$css->set_selector( '.kb-vector-container' . $unique_id . ' svg' );
		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width', 'maxWidthUnit' );

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
		$classes = [
			'kb-vector-container',
			'kb-vector-container' . esc_attr( $unique_id ),
		];

		if ( ! empty( $attributes['align'] ) ) {
			$classes[] = 'align' . esc_attr( $attributes['align'] );
		}

		$wrapper_attributes = get_block_wrapper_attributes( [
			'class' => implode( ' ', $classes ),
			'id' => !empty( $attributes['anchor'] ) ? esc_attr( $attributes['anchor'] ) : '',
		] );

		$svg = $this->get_vector_svg( $attributes );		

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $svg );
	}

	/**
	 * Get the SVG content
	 *
	 * @param array $attributes Block attributes.
	 * @return string
	 */
	private function get_vector_svg( $attributes ) {
		$svg_content = $this->placeholder_svg;

		if ( isset( $attributes['id'] ) && ! empty( $attributes['id'] ) ) {
			$post_id = $attributes['id'];
			if ( ! empty( $post_id ) ) {
				$post = get_post( $post_id );
				if ( $post && 'kadence_vector' === $post->post_type ) {
					$svg_content = $post->post_content;
				}
			}
		}

		return $svg_content;
	}
} 

Kadence_Blocks_Vector_Block::get_instance();