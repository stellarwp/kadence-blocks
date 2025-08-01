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
			[
				'render_callback' => [ $this, 'render_css' ],
			]
		);
	}

	/**
	 * Add Class name to list of blocks to render in header.
	 *
	 * @param array $block_class_array the blocks that are registered to be rendered.
	 */
	public function add_block_to_post_generate_css( $block_class_array ) {
		if ( $this->should_register() ) {
			if ( ! isset( $block_class_array[ $this->namespace . '/advanced-form-' . $this->block_name ] ) ) {
				$has_input = in_array( $this->block_name, [ 'text', 'email', 'date', 'number', 'telephone', 'time', 'textarea', 'hidden' ], true );
				$block_class_array[ $this->namespace . '/advanced-form-' . $this->block_name ] = 'Kadence_Blocks_' . str_replace( ' ', '_', ucwords( str_replace( '-', ' ', $this->block_name ) ) ) . ( $has_input ? '_Input' : '' ) . '_Block';
			}
		}

		return $block_class_array;
	}

	/**
	 * Get default attributes for a block.
	 *
	 * @return array
	 */
	protected function get_block_default_attributes() {
		$block_name = 'kadence/advanced-form-' . $this->block_name;
		if ( ! isset( $this->default_attributes_cache[ $block_name ] ) ) {
			$registry           = WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
			$default_attributes = [];

			if ( $registry && property_exists( $registry, 'attributes' ) && ! empty( $registry->attributes ) ) {
				foreach ( $registry->attributes as $key => $value ) {
					if ( isset( $value['default'] ) ) {
						$default_attributes[ $key ] = $value['default'];
					}
				}
			}

			$this->default_attributes_cache[ $block_name ] = $default_attributes;
		}

		return $this->default_attributes_cache[ $block_name ];
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
			$form_id = ! empty( $attributes['formID'] ) ? $attributes['formID'] : '';
			return '<div class="' . self::HELP_CLASS_NAME . '"' . ( empty( $attributes['ariaDescription'] ) ? ' id="aria-describe' . esc_attr( $form_id ) . esc_attr( $attributes['uniqueID'] ) . '"' : '' ) . '>' . esc_html( $attributes['helpText'] ) . '</div>';
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
			$html .= '<label class="' . self::LABEL_CLASS_NAME . '" for="' . esc_attr( $this->field_id( $attributes ) ) . '">' . $this->get_label( $attributes );

			if ( ! empty( $attributes['required'] ) && $attributes['required'] ) {
				$html .= '<span class="' . self::REQUIRED_CLASS_NAME . '">*</span>';
			}

			$html .= '</label>';
		}
		return $html;
	}
	/**
	 * Add the label to the HTML response if it should be shown
	 *
	 * @param $attributes array
	 *
	 * @return void
	 */
	public function field_legend( $attributes ) {
		$html = '';
		if ( ! empty( $this->get_label( $attributes ) ) && ( ! isset( $attributes['showLabel'] ) || ( isset( $attributes['showLabel'] ) && $attributes['showLabel'] ) ) ) {
			$html .= '<legend class="' . self::LABEL_CLASS_NAME . '">' . $this->get_label( $attributes );

			if ( ! empty( $attributes['required'] ) && $attributes['required'] ) {
				$html .= '<span class="' . self::REQUIRED_CLASS_NAME . '">*</span>';
			}

			$html .= '</legend>';
		} elseif ( ! empty( $this->get_label( $attributes ) ) ) {
			$html .= '<legend class="screen-reader-text">' . $this->get_label( $attributes ) . '</legend>';
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
		$form_id = ! empty( $attributes['formID'] ) ? $attributes['formID'] : '';
		return ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : 'field' . $form_id . $attributes['uniqueID'];
	}
	/**
	 * Add the field wrapper class ID.
	 *
	 * @param $attributes array
	 *
	 * @return void
	 */
	public function class_id( $attributes ) {
		$form_id = ! empty( $attributes['formID'] ) ? $attributes['formID'] : '';
		return $form_id . $attributes['uniqueID'];
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
			$form_id = ! empty( $attributes['formID'] ) ? $attributes['formID'] : '';
			return '<span id="aria-describe' . esc_attr( $form_id ) . esc_attr( $attributes['uniqueID'] ) . '" class="kb-form-aria-describe screen-reader-text">' . $attributes['ariaDescription'] . '</span>';
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
		if ( isset( $attributes['defaultValue'] ) && $attributes['defaultValue'] !== '' ) {
			$default = do_shortcode( $attributes['defaultValue'] );
		}

		if ( ! empty( $attributes['defaultParameter'] ) ) {
			if ( isset( $_GET[ $attributes['defaultParameter'] ] ) ) {
				$default = sanitize_text_field( kadence_blocks_wc_clean( wp_unslash( $_GET[ $attributes['defaultParameter'] ] ) ) );
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
			$form_id = ! empty( $attributes['formID'] ) ? $attributes['formID'] : '';
			return ' aria-describedby="aria-describe' . esc_attr( $form_id ) . esc_attr( $attributes['uniqueID'] ) . '"';
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
			$value = $attributes['auto'] === 'custom' ? ( ! empty( $attributes['autoCustom'] ) ? $attributes['autoCustom'] : '' ) : $attributes['auto'];
			return ' autocomplete="' . esc_attr( $value ) . '"';
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
			$response .= 'required aria-required="true"';
		}

		// if label is hidden and not empty, add as aria-label to input.
		if ( isset( $attributes['showLabel'] ) && ! $attributes['showLabel'] && ! empty( $attributes['label'] ) ) {
			if ( ! empty( $response ) ) {
				$response .= ' ';
			}
			$response .= 'aria-label="' . esc_attr( $attributes['label'] ) . '"';
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

		return $attributes['label'] ?? '';
	}

	/**
	 * Get any additional attributes to be applied to the form <input /> element
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string
	 */
	public function additional_field_attributes( $attributes ) {
		$additional_attributes  = '';
		$additional_attributes .= $this->a11y_helpers( $attributes );
		$additional_attributes .= $this->custom_required_message( $attributes );

		return apply_filters( 'kadence_advanced_form_input_attributes', $additional_attributes, $attributes );
	}
	/**
	 * Get any additional attributes to be applied to the form <fieldset /> element
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string
	 */
	public function additional_fieldset_attributes( $attributes ) {
		$additional_attributes  = '';
		$additional_attributes .= $this->custom_required_message( $attributes );

		return apply_filters( 'kadence_advanced_form_input_attributes', $additional_attributes, $attributes );
	}
	/**
	 * Generates data attribute for the users custom "required" error message
	 *
	 * @param $attributes
	 *
	 * @return string
	 */
	public function custom_required_message( $attributes ) {
		if ( ! empty( $attributes['requiredMessage'] ) ) {
			return ' data-kb-required-message="' . esc_attr( $attributes['requiredMessage'] ) . '" ';
		}

		return '';
	}
}
