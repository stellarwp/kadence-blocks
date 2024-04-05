<?php
/**
 * Class to Build the Advanced Form Hidden Input Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Kadence_Blocks_Hidden_Input_Block extends Kadence_Blocks_Advanced_Form_Input_Block {

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
	protected $block_name = 'hidden';


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
		$type = 'hidden';

		$content = '<input name="' . esc_attr( $this->field_name( $attributes ) ) . '" id="' . esc_attr( $this->field_id( $attributes ) ) . '"' . $this->aria_described_by( $attributes ) . ' data-label="' . esc_attr( $this->get_label( $attributes ) ) . '"' . $this->get_auto_complete( $attributes ) . ' type="' . esc_attr( $type ) . '" placeholder="' . esc_attr( $this->get_placeholder( $attributes ) ) . '" value="' . esc_attr( $this->get_default( $attributes ) ) . '" data-type="' . esc_attr( $type ) . '" class="kb-field kb-' . esc_attr( $type ) . '-field" />';

		return $content;
	}
}

Kadence_Blocks_Hidden_Input_Block::get_instance();
