<?php
/**
 * Class to Build the Advanced Form Textarea Input Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Kadence_Blocks_Textarea_Input_Block extends Kadence_Blocks_Advanced_Form_Input_Block {

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
	protected $block_name = 'textarea';


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
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
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
		$type        = 'textarea';
		$is_required = $this->is_required( $attributes );
		$class_id    = $this->class_id( $attributes );
		$rows        = ! empty( $attributes['rows'] ) ? $attributes['rows'] : 3;

		$outer_classes      = [ 'kb-adv-form-field', 'kb-adv-form-text-type-input', 'kb-adv-form-infield-type-input', 'kb-field' . $class_id ];
		$wrapper_args       = [
			'class' => implode( ' ', $outer_classes ),
		];
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$inner_content      = '';
		$inner_content     .= $this->field_label( $attributes );
		$inner_content     .= $this->field_aria_label( $attributes );

		$inner_content .= '<textarea name="' . esc_attr( $this->field_name( $attributes ) ) . '" id="' . esc_attr( $this->field_id( $attributes ) ) . '" rows="' . esc_attr( $rows ) . '" ' . $this->aria_described_by( $attributes ) . ' data-label="' . esc_attr( $this->get_label( $attributes ) ) . '"' . $this->get_auto_complete( $attributes ) . ' placeholder="' . esc_attr( $this->get_placeholder( $attributes ) ) . '" data-type="' . esc_attr( $type ) . '" class="kb-field kb-' . esc_attr( $type ) . '-field" data-required="' . esc_attr( $is_required ) . '" ' . $this->additional_field_attributes( $attributes ) . '>';
		$inner_content .= esc_attr( $this->get_default( $attributes ) );
		$inner_content .= '</textarea>';

		$inner_content .= $this->field_help_text( $attributes );

		$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $inner_content );
		return $content;
	}
}

Kadence_Blocks_Textarea_Input_Block::get_instance();
