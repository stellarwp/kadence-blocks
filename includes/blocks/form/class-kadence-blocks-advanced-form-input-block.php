<?php
/**
 * Class to Build the Advanced Form Block.
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
class Kadence_Blocks_Advanced_Form_Input_Block extends Kadence_Blocks_Abstract_Block {

	const HELP_CLASS_NAME = 'kb-adv-form-help';

	const REQUIRED_CLASS_NAME = 'kb-adv-form-required';

	const LABEL_CLASS_NAME = 'kb-adv-form-label';

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = '';

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
	 * On init startup register the block.
	 */
	public function on_init() {
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/advanced-form/fields/' . $this->block_name . '/block.json',
			array(
				'render_callback' => array( $this, 'render_css' ),
			)
		);
	}
	/**
	 * Add help text for given block to the response
	 *
	 * @param $attributes array
	 *
	 * @return void
	 */
	public function field_help_text( $attributes ) {
		if ( ! empty( $attributes['helpText'] ) ) {
			return '<div class="' . self::HELP_CLASS_NAME . '">' . $attributes['helpText'] . '</div>';
		}
		return '';
	}
	/**
	 * Add the label to the HTML response if it should be shown
	 *
	 * @param $attributes array
	 *
	 * @return void
	 */
	public function field_label( $attributes ) {
		$html = '';
		if ( ! empty( $this->get_label( $attributes ) ) ) {
			$html .= '<label class="' . self::LABEL_CLASS_NAME . '" for="' . $this->field_name( $attributes ) . '">' . $this->get_label( $attributes );

			if ( ! empty( $attributes['required'] ) && $attributes['required'] == 1 ) {
				$html .= '<span class="' . self::REQUIRED_CLASS_NAME . '">*</span>';
			}

			$html .= '</label>';
		}
		return $html;
	}
	/**
	 * Add the field name to the HTML response.
	 *
	 * @param $attributes array
	 *
	 * @return void
	 */
	public function field_name( $attributes ) {
		return ! empty( $attributes['name'] ) ? $attributes['name'] : 'field' . $attributes['uniqueID'];
	}
	/**
	 * Add the field name to the HTML response.
	 *
	 * @param $attributes array
	 *
	 * @return void
	 */
	public function field_id( $attributes ) {
		return ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : 'field' . $attributes['uniqueID'];
	}
	/**
	 * Generate the aria-describedby attribute
	 *
	 * @param $block
	 *
	 * @return string
	 */
	public function field_aria_label( $attributes ) {

		if ( ! empty( $attributes['ariaDescription'] ) ) {
			return '<span id="aria-describe' . $attributes['uniqueID'] . '" class="kb-form-aria-describe screen-reader-text">' . $attributes['ariaDescription'] . '</span>';
		}

		return '';
	}
	/**
	 * Generate the default attribute
	 *
	 * @param $block
	 *
	 * @return string
	 */
	public function get_default( $attributes ) {
		$default = '';
		if ( ! empty( $attributes['defaultValue'] ) ) {
			$default = $attributes['defaultValue'];
		}

		if ( ! empty( $attributes['defaultParameter'] ) ) {
			if ( isset( $_GET[ $attributes['defaultParameter'] ] ) ) {
				$default = sanitize_text_field( wc_clean( wp_unslash( $_GET[ $attributes['defaultParameter'] ] ) ) );
			}
		}

		return $default;
	}
	/**
	 * Generate the aria-describedby attribute
	 *
	 * @param $block
	 *
	 * @return string
	 */
	public function aria_described_by( $attributes ) {

		if ( ! empty( $attributes['ariaDescription'] ) ) {
			return ' aria-describedby="#aria-describe' . $attributes['uniqueID'] . '"';
		}

		return '';
	}

	/**
	 * Generate the aria-describedby attribute
	 *
	 * @param $block
	 *
	 * @return string
	 */
	public function get_auto_complete( $attributes ) {

		if ( ! empty( $attributes['auto'] ) ) {
			return ' autocomplete="' . $attributes['auto'] . '"';
		}

		return '';
	}

	/**
	 * @param $block array Attributes for a specific input field
	 * @param $true  string Text for HTML if field is required
	 * @param $false string Text for HTML if field is not required
	 *
	 * @return string
	 */
	public function is_required( $attributes, $true = 'yes', $false = 'no' ) {
		if ( ! empty( $attributes['required'] ) && $attributes['required'] === 1 ) {
			return $true;
		}

		return $false;
	}

	/**
	 * Get placeholder text for a given input field
	 *
	 * @param $block array Attributes for a specific input field
	 *
	 * @return string
	 */
	public function get_placeholder( $attributes ) {
		if ( isset( $attributes['placeholder'] ) ) {
			return $attributes['placeholder'];
		}

		return '';
	}

	/**
	 * Get label for field
	 *
	 * @param $block
	 *
	 * @return string
	 */
	public function get_label( $attributes ) {
		if ( isset( $attributes['label'] ) ) {
			return $attributes['label'];
		}

		return '';
	}
}

