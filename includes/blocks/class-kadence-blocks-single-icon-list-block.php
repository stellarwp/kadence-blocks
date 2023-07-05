<?php
/**
 * Class to Build the Icon List Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Icon List Block.
 *
 * @category class
 */
class Kadence_Blocks_Listitem_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'listitem';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Block determines if styles need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
		$css->set_selector( '.kt-svg-icon-list-item-' . $unique_id . ' .kt-svg-icon-list-single' );

		if ( ! empty( $attributes['size'] ) ) {
			$css->add_property( 'font-size', $attributes['size'] . 'px !important' );
		}
		if ( ! empty( $attributes['color'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['color'] ) . ' !important' );
		}
		if ( ! empty( $attributes['background'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'background-color', $css->render_color( $attributes['background'] ) . '!important' );
		}
		if ( ! empty( $attributes['padding'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'padding', $attributes['padding'] . 'px !important' );
		}
		if ( ! empty( $attributes['border'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-color', $css->render_color( $attributes['border'] ) . ' !important' );
		}
		if ( ! empty( $attributes['borderWidth'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-width', $attributes['borderWidth'] . 'px !important'  );
		}
		if ( ! empty( $attributes['borderRadius'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-radius', $attributes['borderRadius'] . '% !important'  );
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
		if ( isset( $block_instance ) && is_object( $block_instance ) && isset( $block_instance->context['kadence/listIcon'] ) ) {
			$parent_default = $block_instance->context['kadence/listIcon'];

			$content = str_replace( 'USE_PARENT_DEFAULT_ICON', $parent_default, $content );
		}
		if ( isset( $block_instance ) && is_object( $block_instance ) && isset( $block_instance->context['kadence/listIconWidth'] ) ) {
			$parent_default_width = $block_instance->context['kadence/listIconWidth'];
			if ( empty( $parent_default_width ) ) {
				$parent_default_width = 2;
			}

			$content = str_replace( 'USE_PARENT_DEFAULT_WIDTH', $parent_default_width, $content );
		}
		return $content;
	}
}

Kadence_Blocks_Listitem_Block::get_instance();
