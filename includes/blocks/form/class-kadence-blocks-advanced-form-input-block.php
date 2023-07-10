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
			return '<div class="' . self::HELP_CLASS_NAME . '"' . ( empty( $attributes['ariaDescription'] ) ? ' id="aria-describe' . $attributes['uniqueID'] . '"' : '' ) . '>' . esc_html( $attributes['helpText'] ) . '</div>';
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
		if ( ! empty( $this->get_label( $attributes ) ) && ( ! isset( $attributes['showLabel'] ) || ( isset( $attributes['showLabel'] ) && $attributes['showLabel'] ) ) ) {
			$html .= '<label class="' . self::LABEL_CLASS_NAME . '" for="' . $this->field_name( $attributes ) . '">' . $this->get_label( $attributes );

			if ( ! empty( $attributes['required'] ) && $attributes['required'] ) {
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
		return ! empty( $attributes['inputName'] ) ? $attributes['inputName'] : 'field' . $attributes['uniqueID'];
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
	public function get_accept_default( $attributes ) {
		$default = $this->get_default( $attributes );
		if ( empty( $default ) ) {
			return 'accept';
		}
		if ( ! empty( $default ) && ( 'true' === $default || true === $default ) ) {
			return 'accept';
		}

		return $default;
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
			$default = do_shortcode( $attributes['defaultValue'] );
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

		if ( ! empty( $attributes['ariaDescription'] ) || ! empty( $attributes['helpText'] ) ) {
			return ' aria-describedby="#aria-describe' . $attributes['uniqueID'] . '"';
		}

		return '';
	}

	/**
	 * Get the auto complete value
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
		if ( ! empty( $attributes['required'] ) && $attributes['required'] ) {
			return $true;
		}

		return $false;
	}

	/**
	 * @param $attributes
	 *
	 * @return string
	 */
	public function a11y_helpers( $attributes ) {
		$response = '';

		$is_required_bool = $this->is_required( $attributes, true, false );
		if ( $is_required_bool ) {
			$response .= 'required aria-required="true" ';
		}

		// if label is hidden and not empty, add as aria-label to input.
		if ( isset( $attributes['showLabel'] ) && ! $attributes['showLabel'] && ! empty( $attributes['label'] ) ) {
			$response .= 'aria-label="' . $attributes['label'] . '" ';
		}

		return $response;
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

	/**
	 * Get Option value given attributes for an input field
	 *
	 * @param $attrs array Attributes for a specific input field
	 *
	 * @return string
	 */
	public function get_option_value( $attributes ) {
		if ( isset( $attributes['value'] ) && $attributes['value'] !== '' ) {
			return $attributes['value'];
		}

		return isset( $attributes['label'] ) ? $attributes['label'] : '';
	}
}

