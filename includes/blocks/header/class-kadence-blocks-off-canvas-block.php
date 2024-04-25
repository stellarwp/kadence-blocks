<?php
/**
 * Class to Build the Off Canvas block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Off Canvas block.
 *
 * @category class
 */
class Kadence_Blocks_Off_Canvas_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'off-canvas';

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
	 * On init startup register the block.
	 */
	public function on_init() {
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/header/children/' . $this->block_name . '/block.json',
			array(
				'render_callback' => array( $this, 'render_css' ),
			)
		);
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

		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id );

		// Background Color.
		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColor'] ) );
		}

		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . ' .kb-off-canvas-inner');
		$css->render_measure_output( $attributes, 'padding', 'padding');


		// Active / Opens state
		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . '.active' );

		if( !empty( $attributes['widthType'] ) && $attributes['widthType'] === 'full') {
			$css->add_property( 'width', '100%' );
		} else {
			$css->add_property( 'width', 'unset' );
			$css->add_property( 'min-width', '100px' );

			$max_width_unit = !empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px';
			if( !empty( $attributes['maxWidth']) ) {
				$css->add_property( 'max-width', $attributes['maxWidth'] . $max_width_unit );
			}
			if( !empty( $attributes['maxWidthTablet']) ) {
				$css->set_media_state('tablet');
				$css->add_property( 'max-width', $attributes['maxWidthTablet'] . $max_width_unit );
				$css->set_media_state('desktop');
			}
			if( !empty( $attributes['maxWidthMobile']) ) {
				$css->set_media_state('mobile');
				$css->add_property( 'max-width', $attributes['maxWidthMobile'] . $max_width_unit );
				$css->set_media_state('desktop');
			}
		}

		$css->set_selector( '.wp-block-kadence-off-canvas' . $unique_id . '.active .kb-off-canvas-inner' );
		$css->add_property( 'width', '100%' );

		if( empty( $attributes['widthType'] ) || ( isset( $attributes['widthType'] ) &&  $attributes['widthType'] === 'partial') ) {
			$max_width_unit = !empty( $attributes['containerMaxWidthUnit'] ) ? $attributes['containerMaxWidthUnit'] : 'px';
			if( !empty( $attributes['containerMaxWidth']) ) {
				$css->add_property( 'max-width', $attributes['containerMaxWidth'] . $max_width_unit );
			}
			if( !empty( $attributes['containerMaxWidthTablet']) ) {
				$css->set_media_state('tablet');
				$css->add_property( 'max-width', $attributes['containerMaxWidthTablet'] . $max_width_unit );
				$css->set_media_state('desktop');
			}
			if( !empty( $attributes['containerMaxWidthMobile']) ) {
				$css->set_media_state('mobile');
				$css->add_property( 'max-width', $attributes['containerMaxWidthMobile'] . $max_width_unit );
				$css->set_media_state('desktop');
			}
		}


		// Overlay background
		$css->set_selector( '.kb-off-canvas-overlay' . $unique_id );
		if ( ! empty( $attributes['pageBackgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $attributes['pageBackgroundColor'] ) );
		} else {
			$css->add_property( 'background-color', 'rgba(0,0,0,0.5)' );
		}

		return $css->css_output();
	}
	/**
	 * The innerblocks are stored on the $content variable. We just wrap with our data, if needed
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$html = '';

		$open_side = !empty( $attributes['slideFrom'] ) ? $attributes['slideFrom'] : 'left';
		$classes = array(
			'wp-block-kadence-off-canvas',
			'wp-block-kadence-off-canvas' . $unique_id,
			'open-' . $open_side,
		);

		$overlay_classes = array(
			'kb-off-canvas-overlay',
			'kb-off-canvas-overlay' . $unique_id,
		);

		$html .= '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';
		$html .= '<div class="kb-off-canvas-inner">';
		$html .= $content;
		$html .= '</div>';
		$html .= '</div>';

		if ( empty( $attributes['widthType'] ) || $attributes['widthType'] === 'partial' ) {
			$html .= '<div data-unique-id="' . esc_attr( $unique_id ) . '" class="' . esc_attr( implode( ' ', $overlay_classes ) ) . '"></div>';
		}

		return $html;
	}
}

Kadence_Blocks_Off_Canvas_Block::get_instance();
