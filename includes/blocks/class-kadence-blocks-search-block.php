<?php
/**
 * Class to Build the Search Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Search Block.
 *
 * @category class
 */
class Kadence_Blocks_Search_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'search';

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
		$css->set_selector( '.kb-block-search-container' . $unique_id );

		/*
		 * Margin
		 */
		$css->render_measure_output( $attributes, 'margin', 'margin' );

		/*
		 * Padding
		 */
		$css->render_measure_output( $attributes, 'padding', 'padding' );



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

		$content .= $this->build_button( $attributes, $unique_id, $content );

		return $content;
	}

	private function build_button( $attributes, $unique_id, $content ) {
		$class_id = $unique_id;
		$outer_classes = array( 'kadence-search-button', 'wp-block-kadence-search-button', 'wp-block-kadence-search-button' . $unique_id );
		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
			'data-uniqueid' => $unique_id,
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$classes = array( 'kb-button', 'kt-button', 'button', 'kb-search-button', 'kb-btn' . $class_id );
		$classes[] = ! empty( $attributes['sizePreset'] ) ? 'kt-btn-size-' . $attributes['sizePreset'] : 'kt-btn-size-standard';
		$classes[] = ! empty( $attributes['widthType'] ) ? 'kt-btn-width-type-' . $attributes['widthType'] : 'kt-btn-width-type-auto';
		$classes[] = ! empty( $attributes['inheritStyles'] ) ? 'kb-btn-global-' . $attributes['inheritStyles'] : 'kb-btn-global-fill';
		$classes[] = ! empty( $attributes['text'] ) ? 'kt-btn-has-text-true' : 'kt-btn-has-text-false';
		$classes[] = ! empty( $attributes['icon'] ) ? 'kt-btn-has-svg-true' : 'kt-btn-has-svg-false';
		if ( ! empty( $attributes['inheritStyles'] ) && 'inherit' === $attributes['inheritStyles'] ) {
			$classes[] = 'wp-block-button__link';
		}
		$button_args = array(
			'class' => implode( ' ', $classes ),
		);
		if ( ! empty( $attributes['anchor'] ) ) {
			$button_args['id'] = $attributes['anchor'];
		}
		$button_args['type'] = 'submit';
		if ( ! empty( $attributes['label'] ) ) {
			$button_args['aria-label'] = $attributes['label'];
		}
		$button_wrap_attributes = array();
		foreach ( $button_args as $key => $value ) {
			$button_wrap_attributes[] = $key . '="' . esc_attr( $value ) . '"';
		}
		$button_wrapper_attributes = implode( ' ', $button_wrap_attributes );
		$text       = ! empty( $attributes['text'] ) ? '<span class="kt-btn-inner-text">' . $attributes['text'] . '</span>' : '';
		$svg_icon   = '';
		if ( ! empty( $attributes['icon'] ) ) {
			$type         = substr( $attributes['icon'], 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;

			if ( $line_icon ) {
				$stroke_width = 2;
			}
			$svg_icon = Kadence_Blocks_Svg_Render::render( $attributes['icon'], $fill, $stroke_width );
		}
		$icon_left  = ! empty( $svg_icon ) && ! empty( $attributes['iconSide'] ) && 'left' === $attributes['iconSide'] ? '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kt-btn-icon-side-left">' . $svg_icon . '</span>' : '';
		$icon_right = ! empty( $svg_icon ) && ! empty( $attributes['iconSide'] ) && 'right' === $attributes['iconSide'] ? '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kt-btn-icon-side-right">' . $svg_icon . '</span>' : '';
		$html_tag   = 'button';
		$content    = sprintf( '<%1$s %2$s>%3$s%4$s%5$s</%1$s>', $html_tag, $button_wrapper_attributes, $icon_left, $text, $icon_right );
		$content    = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
		return $content;
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

//		wp_register_script( 'kadence-blocks-search', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-search.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}

}

Kadence_Blocks_Search_Block::get_instance();
