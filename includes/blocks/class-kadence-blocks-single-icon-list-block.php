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
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );
		$css->set_selector( '.kt-svg-icon-list-item-' . $unique_id . ' .kt-svg-icon-list-single' );
		if ( ! empty( $attributes['size'] ) ) {
			$css->add_property( 'font-size', $attributes['size'] . 'px' );
		}
		if ( ! empty( $attributes['color'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['color'] ) );
		}
		if ( ! empty( $attributes['background'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'font-size', $css->render_color( $attributes['background'] ) );
		}
		if ( ! empty( $attributes['padding'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'padding', $attributes['padding'] . 'px' );
		}
		if ( ! empty( $attributes['border'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-color', $css->render_color( $attributes['border'] ) );
		}
		if ( ! empty( $attributes['borderWidth'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-width', $attributes['borderWidth'] . 'px'  );
		}
		if ( ! empty( $attributes['borderRadius'] ) && ! empty( $attributes['style'] ) && 'default' !== $attributes['style'] ) {
			$css->add_property( 'border-radius', $attributes['borderRadius'] . '%'  );
		}
		return $css->css_output();
	}

}

Kadence_Blocks_Listitem_Block::get_instance();
