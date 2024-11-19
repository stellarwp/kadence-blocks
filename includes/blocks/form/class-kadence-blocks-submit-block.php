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
	 * @param array    $attributes The block attributes.
	 * @param string   $unique_id The block unique id.
	 * @param string   $content The block content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$class_id = $this->class_id( $attributes );
		$outer_classes = array( 'kb-adv-form-field', 'kb-submit-field', 'kb-field' . $class_id );
		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$classes = array( 'kb-button', 'kt-button', 'button', 'kb-adv-form-submit-button', 'kb-btn' . $class_id );
		$classes[] = ! empty( $attributes['sizePreset'] ) ? 'kt-btn-size-' . $attributes['sizePreset'] : 'kt-btn-size-standard';
		$classes[] = ! empty( $attributes['widthType'] ) ? 'kt-btn-width-type-' . $attributes['widthType'] : 'kt-btn-width-type-auto';
		$classes[] = ! empty( $attributes['inheritStyles'] ) ? 'kb-btn-global-' . $attributes['inheritStyles'] : 'kb-btn-global-fill';
		$classes[] = ! empty( $attributes['text'] ) ? 'kt-btn-has-text-true' : 'kt-btn-has-text-false';
		$classes[] = ! empty( $attributes['icon'] ) ? 'kt-btn-has-svg-true' : 'kt-btn-has-svg-false';
		if ( ! empty( $attributes['inheritStyles'] ) && 'inherit' === $attributes['inheritStyles'] ) {
			$classes[] = 'wp-block-button__link';
		}
		if ( ! empty( $attributes['className'] ) ) {
			$wrapper_attributes = str_replace( ' ' . $attributes['className'], '', $wrapper_attributes );
			$classes[] = $attributes['className'];
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
	 * Builds CSS for block.
	 *
	 * @param array  $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$class_id = $this->class_id( $attributes );
		$css->set_style_id( 'kb-' . $this->block_name . $class_id );

		$width_type = ! empty( $attributes['widthType'] ) ? $attributes['widthType'] : 'auto';
		if ( 'fixed' === $width_type ) {
			$css->set_selector( '.kb-submit-field .kb-btn' . $class_id . '.kb-button, ul.menu .kb-submit-field .kb-btn' . $class_id . '.kb-button' );
			$css->render_responsive_range( $attributes, 'width', 'width', 'widthUnit' );
		} else {
			$css->set_selector( 'ul.menu .kb-submit-field .kb-btn' . $class_id . '.kb-button' );
			$css->add_property( 'width', 'initial' );
		}
		$css->set_selector( '.kb-submit-field .kb-btn' . $class_id . '.kb-button' );
		$bg_type = ! empty( $attributes['backgroundType'] ) ? $attributes['backgroundType'] : 'normal';
		$bg_hover_type = ! empty( $attributes['backgroundHoverType'] ) ? $attributes['backgroundHoverType'] : 'normal';
		if ( ! empty( $attributes['color'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['color'] ) );
		}
		if ( 'normal' === $bg_type && ! empty( $attributes['background'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['background'] ) . ( 'gradient' === $bg_hover_type ? ' !important' : '' ) );
		}
		if ( 'gradient' === $bg_type && ! empty( $attributes['gradient'] ) ) {
			$css->add_property( 'background', $attributes['gradient'] . ' !important' );
		}
		$css->render_typography( $attributes, 'typography' );
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array(
			'unit_key'=>'borderRadiusUnit'
		) );
		$css->render_border_styles( $attributes, 'borderStyle', true );
		$css->render_measure_output( $attributes, 'padding', 'padding', [ 'unit_key' => 'paddingUnit' ] );
		$css->render_measure_output( $attributes, 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] );
		if ( isset( $attributes['displayShadow'] ) && true === $attributes['displayShadow'] ) {
			if ( isset( $attributes['shadow'] ) && is_array( $attributes['shadow'] ) && isset( $attributes['shadow'][0] ) && is_array( $attributes['shadow'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadow'][0]['inset'] ) && true === $attributes['shadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadow'][0]['hOffset'] ) && is_numeric( $attributes['shadow'][0]['hOffset'] ) ? $attributes['shadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['vOffset'] ) && is_numeric( $attributes['shadow'][0]['vOffset'] ) ? $attributes['shadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadow'][0]['blur'] ) && is_numeric( $attributes['shadow'][0]['blur'] ) ? $attributes['shadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadow'][0]['spread'] ) && is_numeric( $attributes['shadow'][0]['spread'] ) ? $attributes['shadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadow'][0]['color'] ) && ! empty( $attributes['shadow'][0]['color'] ) ? $attributes['shadow'][0]['color'] : '#000000' ), ( isset( $attributes['shadow'][0]['opacity'] ) && is_numeric( $attributes['shadow'][0]['opacity'] ) ? $attributes['shadow'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '1px 1px 2px 0px rgba(0, 0, 0, 0.2)' );
			}
		}
		// Icon.
		$css->set_selector( '.kb-btn' . $class_id . '.kb-button .kb-svg-icon-wrap' );
		if ( ! empty( $attributes['iconColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['iconColor'] ) );
		}
		$css->render_measure_output( $attributes, 'iconPadding', 'padding', array( 'unit_key' => 'iconPaddingUnit' ) );
		$css->render_responsive_range( $attributes, 'iconSize', 'font-size', 'iconSizeUnit' );
		// Icon Hover.
		$css->set_selector( '.kb-btn' . $class_id . '.kb-button:hover .kb-svg-icon-wrap, .kb-btn' . $class_id . '.kb-button:focus .kb-svg-icon-wrap' );
		if ( ! empty( $attributes['iconColorHover'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['iconColorHover'] ) );
		}
		// Hover.
		$css->set_selector( '.kb-submit-field .kb-btn' . $class_id . '.kb-button:hover, .kb-submit-field .kb-btn' . $class_id . '.kb-button:focus' );
		if ( ! empty( $attributes['colorHover'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['colorHover'] ) );
		}
		if ( 'gradient' !== $bg_type && 'normal' === $bg_hover_type && ! empty( $attributes['backgroundHover'] ) ) {
			$css->add_property( 'background', $css->render_color( $attributes['backgroundHover'] ) );
		}
		$css->render_measure_output( $attributes, 'borderHoverRadius', 'border-radius' );
		$css->render_border_styles( $attributes, 'borderHoverStyle', true );
		if ( isset( $attributes['displayHoverShadow'] ) && true === $attributes['displayHoverShadow'] ) {
			if ( ( 'gradient' === $bg_type || 'gradient' === $bg_hover_type ) && isset( $attributes['shadowHover'][0]['inset'] ) && true === $attributes['shadowHover'][0]['inset'] ) {
				$css->add_property( 'box-shadow', '0px 0px 0px 0px rgba(0, 0, 0, 0)' );
				$css->set_selector( '.kb-btn' . $class_id . '.kb-button:hover::before' );
			}
			if ( isset( $attributes['shadowHover'] ) && is_array( $attributes['shadowHover'] ) && isset( $attributes['shadowHover'][0] ) && is_array( $attributes['shadowHover'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['shadowHover'][0]['inset'] ) && true === $attributes['shadowHover'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['shadowHover'][0]['hOffset'] ) && is_numeric( $attributes['shadowHover'][0]['hOffset'] ) ? $attributes['shadowHover'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['vOffset'] ) && is_numeric( $attributes['shadowHover'][0]['vOffset'] ) ? $attributes['shadowHover'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['blur'] ) && is_numeric( $attributes['shadowHover'][0]['blur'] ) ? $attributes['shadowHover'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['shadowHover'][0]['spread'] ) && is_numeric( $attributes['shadowHover'][0]['spread'] ) ? $attributes['shadowHover'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['shadowHover'][0]['color'] ) && ! empty( $attributes['shadowHover'][0]['color'] ) ? $attributes['shadowHover'][0]['color'] : '#000000' ), ( isset( $attributes['shadowHover'][0]['opacity'] ) && is_numeric( $attributes['shadowHover'][0]['opacity'] ) ? $attributes['shadowHover'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', '2px 2px 3px 0px rgba(0, 0, 0, 0.4)' );
			}
		}
		// Hover before.
		if ( 'gradient' === $bg_type && 'normal' === $bg_hover_type && ! empty( $attributes['backgroundHover'] ) ) {
			$css->set_selector( '.kb-btn' . $class_id . '.kb-button:hover::before' );
			$css->add_property( 'background', $css->render_color( $attributes['backgroundHover'] ) );
			$css->set_selector( '.kb-btn' . $class_id . '.kb-button::before' );
			$css->add_property( 'transition', 'opacity .3s ease-in-out' );
		}
		if ( 'gradient' === $bg_hover_type && ! empty( $attributes['gradientHover'] ) ) {
			$css->set_selector( '.kb-btn' . $class_id . '.kb-button:hover::before, .kb-btn' . $class_id . '.kb-button:focus::before' );
			$css->add_property( 'background', $attributes['gradientHover'] );
			$css->set_selector( '.kb-btn' . $class_id . '.kb-button::before' );
			$css->add_property( 'transition', 'opacity .3s ease-in-out' );
		}
		// Only Icon.
		if ( isset( $attributes['onlyIcon'][0] ) && '' !== $attributes['onlyIcon'][0] && true == $attributes['onlyIcon'][0] ) {
			$css->set_selector( '.kb-btn' . $class_id . '.kb-button .kt-btn-inner-text' );
			$css->add_property( 'display', 'none' );
		}
		if ( isset( $attributes['onlyIcon'][1] ) && '' !== $attributes['onlyIcon'][1] ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-btn' . $class_id . '.kb-button .kt-btn-inner-text' );
			if ( true == $attributes['onlyIcon'][1] ) {
				$css->add_property( 'display', 'none' );
			} elseif ( false == $attributes['onlyIcon'][1] ) {
				$css->add_property( 'display', 'block' );
			}
		}
		if ( isset( $attributes['onlyIcon'][2] ) && '' !== $attributes['onlyIcon'][2] ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( '.kb-btn' . $class_id . '.kb-button .kt-btn-inner-text' );
			if ( true == $attributes['onlyIcon'][2] ) {
				$css->add_property( 'display', 'none' );
			} elseif ( false == $attributes['onlyIcon'][2] ) {
				$css->add_property( 'display', 'block' );
			}
		}
		$css->set_media_state( 'desktop' );
		$css->set_selector( '.kb-submit-field.kb-field' . $class_id );
		$hAlignKeys = array( 'hAlign' => 'desktop', 'thAlign' => 'tablet', 'mhAlign' => 'mobile' );
		foreach( $hAlignKeys as $alignKey => $device ) {
			if ( ! empty( $attributes[$alignKey]) ) {
				$css->set_media_state( $device );
				switch ( $attributes[$alignKey] ) {
					case 'left':
						$css->add_property( 'justify-content', 'flex-start' );
						break;
					case 'center':
						$css->add_property( 'justify-content', 'center' );
						break;
					case 'right':
						$css->add_property( 'justify-content', 'flex-end' );
						break;
				}

				$css->set_media_state( 'desktop' );
			}
		}

		return $css->css_output();
	}
}

Kadence_Blocks_Submit_Block::get_instance();
