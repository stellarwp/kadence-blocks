<?php

class AdvancedFormFrontend {

	const ADVANCED_FORM_BLOCK_PREFIX = 'kadence/advanced-form-';

	const HELP_CLASS_NAME = 'kb-form-field-help';

	const REQUIRED_CLASS_NAME = 'required';

	public function __construct( $fields, $parentAttributes, $unique_id, $post_id ) {
		$this->fields           = $fields;
		$this->parentAttributes = $parentAttributes;

		$this->field_attributes =  empty( $parentAttributes['style'] ) ? array() : $parentAttributes['style'];

		$this->actions = empty( $parentAttributes['actions'] ) ? array() : $parentAttributes['actions'];

		$this->unique_id = $unique_id;
		$this->post_id   = $post_id;
		$this->response  = '';
	}

	/**
	 * Generate the HTML for the form frontend
	 *
	 * @return string
	 */
	public function render() {
		$this->append_response( '<div class="wp-block-kadence-advanced-form kadence-advanced-form' . $this->unique_id . '">' );
		$this->append_response( '<form class="kb-advanced-form" action="" method="post">' );

		if ( is_numeric( $this->post_id ) && 0 !== $this->post_id ) {
			$this->append_response( '<input type="hidden" name="_kb_form_post_id" value="' . $this->post_id . '">' );
		}

		$this->append_response( '<input type="hidden" name="_kb_form_id" value="' . $this->unique_id . '">' );
		$this->append_response( '<input type="hidden" name="action" value="kb_process_advanced_form_submit">' );


		// Honeypot
		$this->append_response( '<input class="kadence-blocks-field verify" type="text" name="_kb_verify_email" autoComplete="off" placeholder="Email" tabIndex="-1" />' );


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
					default:
						$this->append_response( '<p>' . $field_type . '</p>' );
						break;
				}
			}

		}

		$this->submit_button();

		$this->append_response( '</form>' );
		$this->append_response( '</div>' );

		return $this->response;
	}

	private function submit_button() {
		$label = empty( $this->parentAttributes['submit']['label'] ) ? 'Submit' : $this->parentAttributes['submit']['label'];

		$this->append_response( '<div class="kb-advanced-form-submit">' );
		$this->append_response( '<input type="submit" value="' . $label . '" class="kb-advanced-forms-submit">' );
		$this->append_response( '</div>' );
	}

	private function text_field( $block, $type ) {
		$is_required = $this->is_required( $block );

		$this->append_response( '<div class="kadence-blocks-advanced-form-field">' );

		$this->field_label( $block );

		$this->append_response( '<input name="kb_field_1" class="' . $this->field_width_classes( $block ) . '" id="kb_field__04ea80-5f_1" aria-describedby="' . $this->aria_described_by( $block ) . '" data-label="' . $this->get_label( $block ) . '" type="' . $type . '" placeholder="' . $this->get_placeholder( $block ) . '" value="" data-type="' . $type . '" class="kb-field kb-' . $type . '-field" data-required="' . $is_required . '" />' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function radio_field( $block ) {
		$is_required = $this->is_required( $block );

		$this->append_response( '<div class="kb-radio-style-field ' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		foreach ( $block['attrs']['options'] as $option ) {
			$this->append_response( '<div class="kb-radio-field">' );
			$this->append_response( '<input class="kb-radio-style" type="radio" aria-describedby="' . $this->aria_described_by( $block ) . '" name="' . str_replace( ' ', '', $this->get_label( $block ) ) . '" value="' . $option['value'] . '">' );
			$this->append_response( '<label for="' . $option['value'] . '">' . $option['label'] . '</label>' );
			$this->append_response( '</div>' );
		}

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function select_field( $block ) {
		$is_required    = $this->is_required( $block );
		$is_multiselect = ( $block['attrs']['multiSelect'] === true ) ? 'multiple' : '';

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );

		$this->field_label( $block );

		$this->append_response( '<select class="' . $this->field_width_classes( $block ) . '" ' . $is_multiselect . ' aria-describedby="' . $this->aria_described_by( $block ) . '">' );

		foreach ( $block['attrs']['options'] as $option ) {
			$this->append_response( '<option value="' . $option['value'] . '">' . $option['label'] . '</option>' );
		}

		$this->append_response( '</select>' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function file_field( $block ) {
		$is_required = $this->is_required( $block );

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );

		$this->field_label( $block );

		$this->append_response( '<input class="' . $this->field_width_classes( $block ) . '" name="kb_field_1" id="kb_field__04ea80-5f_1" aria-describedby="' . $this->aria_described_by( $block ) . '" data-label="' . $this->get_label( $block ) . '" type="file" data-type="file" data-required="' . $is_required . '" />' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function textarea_field( $block ) {
		$is_required = $this->is_required( $block );
		$rows        = empty( $block['attrs']['rows'] ) || ! is_numeric( $block['attrs']['rows'] ) ? '3' : $block['attrs']['rows'];

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );

		$this->field_label( $block );

		$this->append_response( '<textarea rows="' . $rows . '" class="' . $this->field_width_classes( $block ) . '" aria-describedby="' . $this->aria_described_by( $block ) . '" placeholder="' . $this->get_placeholder( $block ) . '" name="kb_field_1" id="kb_field__04ea80-5f_1" data-label="' . $this->get_label( $block ) . '" data-required="' . $is_required . '"></textarea>' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function accept_field( $block ) {
		$is_required = $this->is_required( $block, 'required', '' );
		$is_checked  = $block['attrs']['value'] == 1 ? 'checked' : '';
		$rows        = empty( $block['attrs']['rows'] ) || ! is_numeric( $block['attrs']['rows'] ) ? '3' : $block['attrs']['rows'];

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );


		$this->append_response( '<input type="checkbox" aria-describedby="' . $this->aria_described_by( $block ) . '" value="' . $block['attrs']['value'] . '" ' . $is_checked . ' ' . $is_required . '>' );

		$this->field_label( $block );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}


	/**
	 * Get a unique list of field types that are included in the form
	 * Primarily used to prevent CSS generation for unneeded field types
	 *
	 * Ex: [ text, radio, textarea ]
	 *
	 * @return string[]
	 */
	public function getfieldTypes() {
		$fieldTypes = [];

		foreach ( $this->fields as $block ) {
			if ( $this->is_form_input_block( $block ) ) {
				$field_type                = str_replace( self::ADVANCED_FORM_BLOCK_PREFIX, '', $block['blockName'] );
				$fieldTypes[ $field_type ] = '';
			}
		}

		return array_keys( $fieldTypes );
	}

	private function field_label( $block ) {

		if ( ! empty( $this->get_label( $block ) ) ) {
			$this->append_response( '<label for="kb_field__04ea80-5f_1">' . $this->get_label( $block ) );

			if ( $this->show_required() && ! empty( $block['attrs']['required'] ) && $block['attrs']['required'] === 1 ) {
				$this->append_response( '<span class="' . self::REQUIRED_CLASS_NAME . '">*</span>' );
			}

			$this->append_response( '</label>' );
		}

	}

	private function field_help_text( $block ) {
		if ( ! empty( $block['attrs']['helpText'] ) ) {
			$this->append_response( '<div class="' . self::HELP_CLASS_NAME . '">' . $block['attrs']['helpText'] . '</div>' );
		}
	}

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

	private function aria_described_by( $block ) {

		if ( ! empty( $block['attrs']['ariaDescription'] ) ) {
			return $block['attrs']['ariaDescription'];
		}

		return 'undefined';
	}

	private function is_required( $block, $true = 'yes', $false = 'no' ) {
		if ( ! empty( $block['attrs']['required'] ) && $block['attrs']['required'] === 1 ) {
			return $true;
		}

		return $false;
	}

	private function get_placeholder( $block ) {
		if ( isset( $block['attrs']['placeholder'] ) ) {
			return $block['attrs']['placeholder'];
		}

		return '';
	}

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
		return empty(  $this->field_attributes['showRequired'] ) ? true :  $this->field_attributes['showRequired'];
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

