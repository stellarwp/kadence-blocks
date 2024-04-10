<?php
/**
 * Class to Build the off canvas trigger.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Off Canvas Trigger.
 *
 * @category class
 */
class Kadence_Blocks_Off_Canvas_Trigger_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'off-canvas-trigger';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;
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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$css->set_selector( '.wp-block-kadence-off-canvas-trigger' . $unique_id );
		$css->render_measure_output( $attributes, 'padding', 'padding');
		$css->render_measure_output( $attributes, 'margin', 'margin');

		// SVG
		$css->set_selector( '.wp-block-kadence-off-canvas-trigger' . $unique_id . ' svg' );

		if ( ! empty( $attributes['iconSize'] ) ) {
			$css->add_property( 'width', $attributes['iconSize'] . 'px' );
			$css->add_property( 'height', $attributes['iconSize'] . 'px' );
		}
		if ( ! empty( $attributes['iconSizeTablet'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->add_property( 'width', $attributes['iconSizeTablet'] . 'px' );
			$css->add_property( 'height', $attributes['iconSizeTablet'] . 'px' );
			$css->set_media_state( 'desktop' );
		}
		if ( ! empty( $attributes['iconSizeMobile'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->add_property( 'width', $attributes['iconSizeMobile'] . 'px' );
			$css->add_property( 'height', $attributes['iconSizeMobile'] . 'px' );
			$css->set_media_state( 'desktop' );
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

		$classes = array(
			'wp-block-kadence-off-canvas-trigger',
			'wp-block-kadence-off-canvas-trigger' . $unique_id,
		);

		if ( ! empty( $attributes['icon'] ) ) {
			$content = Kadence_Blocks_Svg_Render::render( $attributes['icon'], 'currentColor', false, '', false );
		}

		$attributes = array(
			'aria-label'    => __( 'Toggle Off Canvas', 'kadence-blocks' ),
			'aria-expanded' => 'false',
			'class'         => implode( ' ', $classes ),
			'id'            => 'kadence-off-canvas-trigger' . $unique_id,
		);

		foreach ( $attributes as $key => $value ) {
			$wrap_attributes[] = $key . '="' . esc_attr( $value ) . '"';
		}
		$wrap_attributes = implode( ' ', $wrap_attributes );

		$html .= sprintf( '<button %1$s>%2$s</button>', $wrap_attributes, $content );

		return $html;
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {
		parent::register_scripts();
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-off-canvas-trigger.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Off_Canvas_Trigger_Block::get_instance();
