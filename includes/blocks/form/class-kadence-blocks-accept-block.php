<?php
/**
 * Class to Build the Advanced Form Accept Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Kadence_Blocks_Accept_Block extends Kadence_Blocks_Advanced_Form_Input_Block {

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
	protected $block_name = 'accept';


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
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.wp-block-kadence-advanced-form .kb-field' . $unique_style_id );

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
		$type = 'checkbox';
		$is_required = $this->is_required( $attributes );
		$outer_classes = array( 'kb-adv-form-field', 'kb-field' . $unique_id );
		if ( ! empty( $attributes['className'] ) ) {
			$outer_classes[] = $attributes['className'];
		}
		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$inner_content  = '';
		$inner_content .= $this->field_label( $attributes );
		$inner_content .= $this->field_aria_label( $attributes );
		$is_checked = isset( $attributes['isChecked'] ) && true === $attributes['isChecked'] ? true : false;
		$inner_content .= '<div class="kb-radio-check-item">';
		$inner_content .= '<input name="' . $this->field_name( $attributes ) . '" id="' . $this->field_id( $attributes ) . '"' . $this->aria_described_by( $attributes ) . ' data-label="' . esc_attr( $this->get_label( $attributes ) ) . '"' . $this->get_auto_complete( $attributes ) . ' type="' . $type . '" value="' . esc_attr( $this->get_accept_default( $attributes ) ) . '"' . ( $is_checked ? ' checked' : '' ) . ' data-type="accept" class="kb-field kb-accept-field kb-' . $type . '-field" data-required="' . $is_required . '" ' . $this->a11y_helpers( $attributes ) . '/>';
		$inner_content .= '<label for="' . $this->field_name( $attributes ) . '">' . $attributes['description'];
		if ( ! empty( $attributes['required'] ) && $attributes['required'] && ( empty( $attributes['label'] ) || ( isset( $attributes['showLabel'] ) && ! $attributes['showLabel'] ) ) ) {
			$inner_content .= '<span class="' . self::REQUIRED_CLASS_NAME . '">*</span>';
		}
		$inner_content .= '</label>';

		$inner_content .= '</div>';

		$inner_content .= $this->field_help_text( $attributes );

		$content = sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $inner_content );
		return $content;
	}
}

Kadence_Blocks_Accept_Block::get_instance();
