<?php
/**
 * Class to Build the Single Icon Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Single Icon Block.
 *
 * @category class
 */
class Kadence_Blocks_Single_Icon_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'single-icon';

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
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		if ( isset( $attributes ) && is_array( $attributes ) ) {
			$css->set_selector( '.kt-svg-item-' . $unique_id . ' .kb-svg-icon-wrap, .kt-svg-style-stacked.kt-svg-item-' . $unique_id . ' .kb-svg-icon-wrap' );
			$css->render_color_output( $attributes, 'color', 'color' );

			// Match icon default size if not set.
			if ( ! isset( $attributes['size'] ) ) {
				$attributes['size'] = 50;
			}

			$css->render_responsive_size(
				$attributes,
				array(
					'size',
					'tabletSize',
					'mobileSize',
				),
				'font-size'
			);

			$css->render_measure_output( $attributes, 'margin', 'margin', array( 'unit_key' => 'marginUnit' ) );

			if ( isset( $attributes['style'] ) && 'stacked' === $attributes['style'] ) {
				$css->render_color_output( $attributes, 'background', 'background' );
				$css->render_color_output( $attributes, 'border', 'border-color' );
				$css->render_range( $attributes, 'borderWidth', 'border-width' );
				$css->render_range( $attributes, 'borderRadius', 'border-radius', '%' );
				$css->render_measure_output( $attributes, 'padding', 'padding', array( 'unit_key' => 'paddingUnit' ) );
				$css->set_selector( '.kt-svg-item-' . $unique_id . ':hover .kb-svg-icon-wrap' );
				$css->render_color_output( $attributes, 'hBackground', 'background' );
				$css->render_color_output( $attributes, 'hBorder', 'border-color' );
			}
			// Hover.
			$css->set_selector( '.kt-svg-item-' . $unique_id . ':hover .kb-svg-icon-wrap' );
			$css->render_color_output( $attributes, 'hColor', 'color' );
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
		if ( strpos( $content, 'kb-tooltip-hidden-content') !== false ) {
			$this->enqueue_script( 'kadence-blocks-tippy' );
		}

		return $content;
	}
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS or JS file.

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_script( 'kadence-blocks-popper', KADENCE_BLOCKS_URL . 'includes/assets/js/popper.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-tippy', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-tippy.min.js', array( 'kadence-blocks-popper' ), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Single_Icon_Block::get_instance();
