<?php
/**
 * Class to Build the Advanced Navigation Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Advanced Navigation Block.
 *
 * @category class
 */
class Kadence_Blocks_Advancednavigation_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'advancednavigation';

	/**
	 * Block determines if scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Block determines if a style sheet needs to be loaded for block.
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
	 * Builds the dynamic CSS for this block.
	 *
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string             $unique_id the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_selector( '.wp-block-kadence-advancednavigation' . $unique_id );

		$css->render_measure_output(
			$attributes,
			'padding',
			'padding',
		);
		$css->render_measure_output(
			$attributes,
			'margin',
			'margin',
		);
		return $css->css_output();
	}

	/**
	 * Builds the dynamic HTML for this block
	 *
	 * @param array    $attributes The block attributes.
	 * @param string   $unique_id The unique id.
	 * @param string   $content The content saved to db (usually from save function).
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$unique_id    = ( ! empty( $attributes['uniqueID'] ) ? $attributes['uniqueID'] : 'dynamic' );

		$outer_classes = array( 'wp-block-kadence-advancednavigation' . $unique_id );

		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);

		if ( ! empty( $attributes['anchor'] ) ) {
			$wrapper_args['id'] = $attributes['anchor'];
		}
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$content = 'Frontend Block Content';

		$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );

		return $content;
	}
}

Kadence_Blocks_Advancednavigation_Block::get_instance();
