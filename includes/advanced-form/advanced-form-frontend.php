<?php

class AdvancedFormFrontend {

	const ADVANCED_FORM_BLOCK_PREFIX = 'kadence/advanced-form-';

	const HELP_CLASS_NAME = 'kb-form-field-help';

	const REQUIRED_CLASS_NAME = 'kb-advanced-form-required';

	const LABEL_CLASS_NAME = 'kb-advanced-form-label';

	public function __construct( $fields, $parentAttributes, $unique_id, $post_id ) {
		$this->fields           = $fields;
		$this->parentAttributes = $parentAttributes;
		$this->unique_id        = $unique_id;
		$this->post_id          = $post_id;
		$this->response         = '';
	}

	/**
	 * Generate the HTML for the form frontend
	 *
	 * @return string
	 */
	public function render() {
		$this->append_response( '<div class="wp-block-kadence-advanced-form wp-block-kadence-advanced-form' . $this->unique_id . '">' );
		$this->append_response( '<form method="post" class="kb-advanced-form">' );

		if ( is_numeric( $this->post_id ) && 0 !== $this->post_id ) {
			$this->append_response( '<input type="hidden" name="_kb_form_post_id" value="' . $this->post_id . '">' );
		}

		$this->append_response( '<input type="hidden" name="_kb_form_id" value="' . $this->unique_id . '">' );
		$this->append_response( '<input type="hidden" name="action" value="kb_process_advanced_form_submit">' );


		// Honeypot
		$this->append_response( '<input class="kadence-blocks-field verify" type="hidden" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />' );


		foreach ( $this->fields as $key => $block ) {

			if ( $this->is_form_input_block( $block ) ) {

				$field_type = str_replace( self::ADVANCED_FORM_BLOCK_PREFIX, '', $block['blockName'] );

				switch ( $field_type ) {
					case 'text':
					case 'telephone':
					case 'email':
					case 'number':
					case 'date':
					case 'time':
						$this->text_field( $block, $field_type );
						break;
					case 'radio':
						$this->radio_field( $block );
						break;
					case 'select':
						$this->select_field( $block );
						break;
					case 'file':
						$this->file_field( $block );
						break;
					case 'textarea':
						$this->textarea_field( $block );
						break;
					case 'accept':
						$this->accept_field( $block );
						break;
					case 'checkbox':
						$this->checkbox_field( $block );
						break;
					default:
						$this->append_response( '<p>' . $field_type . '</p>' );
						break;
				}
			} else {
				$this->append_response( render_block( $block ) );
			}

		}

		$this->submit_button();

		$this->append_response( '</form>' );
		$this->append_response( '</div>' );

		return $this->response;
	}

	/**
	 * @return void
	 */
	private function submit_button() {
		$label = empty( $this->parentAttributes['submit']['label'] ) ? 'Submit' : $this->parentAttributes['submit']['label'];

		$desktop_width = ! empty( $this->parentAttributes['submit']['width'][0] ) ? 'kb-field-desk-width-' . $this->parentAttributes['submit']['width'][0] : '';
		$tablet_width  = ! empty( $this->parentAttributes['submit']['width'][1] ) ? 'kb-field-tablet-width-' . $this->parentAttributes['submit']['width'][1] : '';
		$mobile_width  = ! empty( $this->parentAttributes['submit']['width'][2] ) ? 'kb-field-mobile-width-' . $this->parentAttributes['submit']['width'][2] : '';

		$width_classes = trim( $desktop_width . ' ' . $tablet_width . ' ' . $mobile_width );

		$this->append_response( '<div class="kb-advanced-form-submit-container ' . $width_classes . ' ">' );
		$this->append_response( '<input type="submit" value="' . $label . '" class="kb-advanced-form-submit-button">' );
		$this->append_response( '</div>' );
	}

	/**
	 * @param $block array
	 * @param $type  string
	 *
	 * @return void
	 */
	private function text_field( $block, $type ) {
		$is_required = $this->is_required( $block );

		$this->append_response( '<div class="kb-advanced-form-field" class="' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		$this->append_response( '<input name="kb_field_1" id="kb_field__04ea80-5f_1" ' . $this->aria_described_by( $block ) . ' data-label="' . $this->get_label( $block ) . '" type="' . $type . '" placeholder="' . $this->get_placeholder( $block ) . '" value="" data-type="' . $type . '" class="kb-field kb-' . $type . '-field" data-required="' . $is_required . '" />' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	/**
	 * @param $block array
	 *
	 * @return void
	 */
	private function checkbox_field( $block ) {
		$is_required = $this->is_required( $block, 'required', '' );
		$name        = str_replace( ' ', '', strip_tags( $this->get_label( $block ) ) );

		$this->append_response( '<div class="kb-advanced-form-field" class="' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		foreach ( $block['attrs']['options'] as $key => $option ) {
			$id = $name . '_' . $key;
			$is_checked = !empty( $option['selected'] );

			$this->append_response( '<div>' );
			$this->append_response( '<input class="kb-radio-style" type="checkbox" ' . $this->aria_described_by( $block ) . ' id="' . $id . '" name="' . $name . '" '. ($is_checked ? "checked" : "") .' value="' . $this->get_option_value( $option ) . '" ' . $is_required . '>' );
			$this->append_response( '<label for="' . $id . '">' . $option['label'] . '</label>' );
			$this->append_response( '</div>' );
		}

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	/**
	 * @param $block array
	 *
	 * @return void
	 */
	private function radio_field( $block ) {
		$is_required = $this->is_required( $block, 'required', '' );
		$name        = str_replace( ' ', '', strip_tags( $this->get_label( $block ) ) );

		$this->append_response( '<div class="kb-advanced-form-field" class="' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		foreach ( $block['attrs']['options'] as $key => $option ) {
			$id = $name . '_' . $key;
			$is_checked = !empty( $option['selected'] );

			$this->append_response( '<div>' );
			$this->append_response( '<input class="kb-radio-style" type="radio" ' . $this->aria_described_by( $block ) . ' ' . ( $is_checked ? 'checked' : '') . ' id="' . $id . '" name="' . $name . '" value="' . $this->get_option_value( $option ) . '" ' . $is_required . '>' );
			$this->append_response( '<label for="' . $id . '">' . $option['label'] . '</label>' );
			$this->append_response( '</div>' );
		}

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	/**
	 * @param $block array
	 *
	 * @return void
	 */
	private function select_field( $block ) {
		$is_required    = $this->is_required( $block, 'required', '' );
		$is_multiselect = ( isset( $block['attrs']['multiSelect'] ) && $block['attrs']['multiSelect'] === true ) ? 'multiple' : '';

		$this->append_response( '<div class="kb-advanced-form-field" class="' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		$this->append_response( '<select class="' . $this->field_width_classes( $block ) . '" ' . $is_multiselect . ' ' . $this->aria_described_by( $block ) . ' ' . $is_required . '>' );

		foreach ( $block['attrs']['options'] as $option ) {
			$this->append_response( '<option value="' . $this->get_option_value( $option ) . '">' . $option['label'] . '</option>' );
		}

		$this->append_response( '</select>' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	/**
	 * @param $block array
	 *
	 * @return void
	 */
	private function file_field( $block ) {
		$is_required = $this->is_required( $block );

		$this->append_response( '<div class="kb-advanced-form-field" class="' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		$this->append_response( '<input class="' . $this->field_width_classes( $block ) . '" name="kb_field_1" id="kb_field__04ea80-5f_1" ' . $this->aria_described_by( $block ) . ' data-label="' . $this->get_label( $block ) . '" type="file" data-type="file" data-required="' . $is_required . '" />' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	/**
	 * @param $block array
	 *
	 * @return void
	 */
	private function textarea_field( $block ) {
		$is_required = $this->is_required( $block );
		$rows        = empty( $block['attrs']['rows'] ) || ! is_numeric( $block['attrs']['rows'] ) ? '3' : $block['attrs']['rows'];

		$this->append_response( '<div class="kb-advanced-form-field" class="' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		$this->append_response( '<textarea rows="' . $rows . '" class="' . $this->field_width_classes( $block ) . '" ' . $this->aria_described_by( $block ) . ' placeholder="' . $this->get_placeholder( $block ) . '" name="kb_field_1" id="kb_field__04ea80-5f_1" data-label="' . $this->get_label( $block ) . '" data-required="' . $is_required . '"></textarea>' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	/**
	 * @param $block array
	 *
	 * @return void
	 */
	private function accept_field( $block ) {
		$is_required = $this->is_required( $block, 'required', '' );
		$is_checked  = isset( $block['attrs']['value'] ) && $block['attrs']['value'] == 1 ? 'checked' : '';

		$this->append_response( '<div class="kb-advanced-form-field" class="' . $this->field_width_classes( $block ) . '">' );

		$this->append_response( '<input type="checkbox" ' . $this->aria_described_by( $block ) . ' value="' . $this->get_option_value( $block['attrs'] ) . '" ' . $is_checked . ' ' . $is_required . '>' );

		$this->field_label( $block );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	/**
	 * Append the label to the HTML response if it should be shown
	 *
	 * @param $block array
	 *
	 * @return void
	 */
	private function field_label( $block ) {

		if ( ! empty( $this->get_label( $block ) ) ) {
			$this->append_response( '<label class="' . self::LABEL_CLASS_NAME . '" for="kb_field__04ea80-5f_1">' . $this->get_label( $block ) );

			if ( $this->show_required() && ! empty( $block['attrs']['required'] ) && $block['attrs']['required'] == 1 ) {
				$this->append_response( '<span class="' . self::REQUIRED_CLASS_NAME . '">*</span>' );
			}

			$this->append_response( '</label>' );
		}

	}

	/**
	 * Append help text for given block to the response
	 *
	 * @param $block array
	 *
	 * @return void
	 */
	private function field_help_text( $block ) {
		if ( ! empty( $block['attrs']['helpText'] ) ) {
			$this->append_response( '<div class="' . self::HELP_CLASS_NAME . '">' . $block['attrs']['helpText'] . '</div>' );
		}
	}

	/**
	 * Generate the responsive width classes for an input field
	 *
	 * @param $block array
	 *
	 * @return string
	 */
	private function field_width_classes( $block ) {
		$classes = '';

		// Desktop
		if ( ! empty( $block['attrs']['width'][0] ) && ( is_numeric( $block['attrs']['width'][0] ) || $block['attrs']['width'][0] === 'unset' ) ) {
			$classes .= 'kb-field-desk-width-' . $block['attrs']['width'][0];
		} elseif ( empty( $block['attrs']['width'][0] ) ) {
			$classes .= 'kb-field-desk-width-100';
		}

		// Tablet
		if ( ! empty( $block['attrs']['width'][1] ) && ( is_numeric( $block['attrs']['width'][1] ) || $block['attrs']['width'][1] === 'unset' ) ) {

			// Skip if value matches desktop value
			if ( $block['attrs']['width'][0] !== $block['attrs']['width'][1] ) {
				$classes .= ' kb-field-desk-width-' . $block['attrs']['width'][1];
			}
		}

		// Mobile
		if ( ! empty( $block['attrs']['width'][2] ) && ( is_numeric( $block['attrs']['width'][2] ) || $block['attrs']['width'][2] === 'unset' ) ) {
			$classes .= ' kb-field-desk-width-' . $block['attrs']['width'][2];
		}

		return $classes;
	}

	/**
	 * Generate the aria-describedby attribute
	 *
	 * @param $block
	 *
	 * @return string
	 */
	private function aria_described_by( $block ) {

		if ( ! empty( $block['attrs']['ariaDescription'] ) ) {
			return 'aria-describedby="' . $block['attrs']['ariaDescription'] . '"';
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
	private function is_required( $block, $true = 'yes', $false = 'no' ) {
		if ( ! empty( $block['attrs']['required'] ) && $block['attrs']['required'] === 1 ) {
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
	private function get_placeholder( $block ) {
		if ( isset( $block['attrs']['placeholder'] ) ) {
			return $block['attrs']['placeholder'];
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
	private function get_option_value( $attrs ) {
		if ( isset( $attrs['value'] ) && $attrs['value'] !== '' ) {
			return $attrs['value'];
		}

		return $attrs['label'];
	}

	/**
	 * Get label for field
	 *
	 * @param $block
	 *
	 * @return string
	 */
	private function get_label( $block ) {
		if ( isset( $block['attrs']['label'] ) ) {
			return $block['attrs']['label'];
		}

		return '';
	}

	/**
	 * Is the required asterisk enabled
	 *
	 * @return bool
	 */
	private function show_required() {
		return empty( $this->parentAttributes['style']['showRequired'] ) ? true : $this->parentAttributes['style']['showRequired'];
	}

	/**
	 * Helper to append html to the response
	 *
	 * @return void
	 */
	protected function append_response( $html ) {
		$this->response .= $html;
	}

	/**
	 * Is the innerBlock that's passed a form input
	 *
	 * @param $block
	 *
	 * @return bool
	 */
	private function is_form_input_block( $block ) {
		return strpos( $block['blockName'], self::ADVANCED_FORM_BLOCK_PREFIX ) === 0;
	}
}

