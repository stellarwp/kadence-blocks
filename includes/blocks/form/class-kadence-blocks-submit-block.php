<?php
/**
 * Class to Build the Advanced Form Text Input Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Accordion Block.
 *
 * @category class
 */
class Kadence_Blocks_Submit_Block extends Kadence_Blocks_Advanced_Form_Input_Block {

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
	protected $block_name = 'submit';

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
		$outer_classes = array( 'kb-adv-form-field', 'kb-submit-field', 'kb-field' . $unique_id );
		if ( ! empty( $attributes['className'] ) ) {
			$outer_classes[] = $attributes['className'];
		}
		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$classes = array( 'kb-button', 'kt-button', 'button', 'kb-adv-form-submit-button', 'kb-btn' . $unique_id );
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
}

Kadence_Blocks_Submit_Block::get_instance();
