<?php
/**
 * Class to Build the Logo Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Logo Block.
 *
 * @category class
 */
class Kadence_Blocks_Logo_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'logo';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Block determines in scripts need to be loaded for block.
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
	 * @param string $unique_style_id the blocks alternate ID for queries.¸
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.kb-logo' . $unique_id );


		$css->render_measure_output( $attributes, 'padding', 'padding' );
		$css->render_measure_output( $attributes, 'margin', 'margin' );
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius' );
		$css->render_border_styles( $attributes, 'borderStyles' );

		$css->set_selector( '.kb-logo' . $unique_id  .' a');
		$css->add_property('text-decoration', 'inherit');
		$css->add_property('color', 'inherit');

		return $css->css_output();
	}

	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param array    $attributes    The block attributes.
	 * @param string   $unique_id     The unique ID for the block.
	 * @param string   $content       The block inner content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$layout = isset( $attributes['layout'] ) ? $attributes['layout'] : 'logo-title';
		$layout_class = 'kb-logo-layout-container kb-logo-layout-' . $layout;

		$outer_classes = array( 'kb-logo', 'kb-logo' . $unique_id );
		$outer_classes[] = ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : 'alignnone';

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $outer_classes ) ) );

		if( !empty( $attributes['linkToHomepage']) || !empty( $attributes['linkToCustomURL']) ) {
			$url = !empty( $attributes['linkToCustomURL']) ? esc_url( $attributes['linkToCustomURL'] ) : esc_url( home_url( '/' ) );
			$content = sprintf( '<a href="%1$s" class="%2$s">%3$s</a>', $url, $layout_class, $content );
		} else {
			$content = sprintf( '<div class="%1$s">%2$s</div>', $layout_class, $content );
		}

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
	}

}

Kadence_Blocks_Logo_Block::get_instance();
