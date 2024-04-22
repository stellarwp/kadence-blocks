<?php
/**
 * Class to Build the Advanced Form Select Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Kadence_Blocks_Select_Block extends Kadence_Blocks_Advanced_Form_Input_Block {

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
	protected $block_name = 'select';


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
	 * @param array  $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$class_id = $this->class_id( $attributes );
		$css->set_style_id( 'kb-' . $this->block_name . $class_id );
		$css->set_selector( '.wp-block-kadence-advanced-form .kb-field' . $class_id );

		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width', 'maxWidthUnit' );
		$css->render_responsive_range( $attributes, 'minWidth', 'min-width', 'minWidthUnit' );

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
		$is_required = $this->is_required( $attributes, 'required', '' );
		$is_multiselect = ( isset( $attributes['multiSelect'] ) && $attributes['multiSelect'] === true ) ? 'multiple' : '';
		$class_id = $this->class_id( $attributes );
		$outer_classes = array( 'kb-adv-form-field', 'kb-adv-form-infield-type-input', 'kb-field' . $class_id );
		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$default_value = $this->get_default( $attributes );
		$show_placeholder = true;
		if ( isset( $attributes['options'] ) && is_array( $attributes['options'] ) ) {
			foreach ( $attributes['options'] as $option ) {
				$option_value = $this->get_option_value( $option );
				if ( $default_value === $option_value ) {
					$show_placeholder = false;
				}
			}
		}
		$inner_content  = '';

		$inner_content .= $this->field_label( $attributes );
		$inner_content .= $this->field_aria_label( $attributes );

		$name = $is_multiselect ? $this->field_name( $attributes ) . '[]' : $this->field_name( $attributes );

		$inner_content .= '<select ' . $is_multiselect . ' name="' . esc_attr( $name ) . '" id="' . esc_attr( $this->field_id( $attributes ) ) . '"' . $this->aria_described_by( $attributes ) . ' ' . $this->additional_field_attributes( $attributes ) . '>';
		if ( ! empty( $attributes['placeholder'] ) && $show_placeholder ) {
			$inner_content .= '<option value="" disabled selected>' . $attributes['placeholder'] . '</option>';
		}
		if ( isset( $attributes['options'] ) && is_array( $attributes['options'] ) ) {
			foreach ( $attributes['options'] as $option ) {
				$option_value = $this->get_option_value( $option );
				$is_selected_from_param = ! empty( $option_value ) && $option_value && in_array( $option_value, explode( ',', $default_value ) );
				$has_multiple_param_values = count( explode( ',', $default_value ) ) > 1;
				//if you have multiple values coming in from the default value, then this field must be a multi select to preselect options
				$selected = ( $has_multiple_param_values && $is_multiselect && $is_selected_from_param ) || ( ! $has_multiple_param_values && $is_selected_from_param );
				$inner_content .= '<option value="' . esc_attr( $option_value ) . '"' . ( $selected ? ' selected' : '' ) . '>' . $option['label'] . '</option>';
			}
		}
		$inner_content .= '</select>';

		$inner_content .= $this->field_help_text( $attributes );

		$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $inner_content );
		return $content;
	}
}

Kadence_Blocks_Select_Block::get_instance();
