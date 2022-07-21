<?php

class AdvancedFormFrontend {

	const FORM_ACTION = 'options.php';

	const ADVANCED_FORM_BLOCK_PREFIX = 'kadence/advanced-form-';

	const HELP_CLASS_NAME = 'kb-form-field-help';

	const REQUIRED_CLASS_NAME = 'required';

	public function __construct( $fields, $parentAttributes, $unique_id ) {
		$this->fields           = $fields;
		$this->parentAttributes = $parentAttributes;

		$this->label_attributes = $parentAttributes['labelFont'];
		$this->help_attributes  = $parentAttributes['helpFont'];
		$this->field_attributes = $parentAttributes['style'];

		$this->actions = $parentAttributes['actions'];

		$this->unique_id = $unique_id;
		$this->response  = '';
	}

	/**
	 * Generate the HTML for the form frontend
	 *
	 * @return string
	 */
	public function render() {
		$this->append_response( '<div class="wp-block-kadence-advanced-form kadence-advanced-form' . $this->unique_id . '">' );
		$this->append_response( '<form class="kb-advanced-form" action="' . $this->get_form_action() . '" method="post">' );

		foreach ( $this->fields as $key => $block ) {

			if ( $this->is_form_input_block( $block ) ) {

				$field_type = str_replace( 'kadence/advanced-form-', '', $block['blockName'] );

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
		$this->append_response( '<div class="kb-advanced-form-submit">' );
		$this->append_response( '<input type="submit" value="' . $this->parentAttributes['submit']['label'] . '" class="kb-advanced-form-submit-button">' );
		$this->append_response( '</div>' );
	}

	private function text_field( $block, $type ) {
		$is_required = $block['attrs']['required'] == 1 ? 'yes' : 'no';

		$this->append_response( '<div class="kadence-blocks-advanced-form-field">' );

		$this->field_label( $block );

		$this->append_response( '<input name="kb_field_1" class="' . $this->field_width_classes( $block ) . '" id="kb_field__04ea80-5f_1" data-label="' . $block['attrs']['label'] . '" type="' . $type . '" placeholder="' . $block['attrs']['placeholder'] . '" value="" data-type="' . $type . '" class="kb-field kb-' . $type . '-field" data-required="' . $is_required . '" />' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function radio_field( $block ) {
		$is_required = $block['attrs']['required'] == 1 ? 'yes' : 'no';

		$this->append_response( '<div class="kb-radio-style-field ' . $this->field_width_classes( $block ) . '">' );

		$this->field_label( $block );

		foreach ( $block['attrs']['options'] as $option ) {
			$this->append_response( '<div class="kb-radio-field">' );
			$this->append_response( '<input class="kb-radio-style" type="radio" name="' . str_replace( ' ', '', $block['attrs']['label'] ) . '" value="' . $option['value'] . '">' );
			$this->append_response( '<label for="' . $option['value'] . '">' . $option['label'] . '</label>' );
			$this->append_response( '</div>' );
		}

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function select_field( $block ) {
		$is_required    = $block['attrs']['required'] == 1 ? 'yes' : 'no';
		$is_multiselect = ( $block['attrs']['multiSelect'] === true ) ? 'multiple' : '';

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );

		$this->field_label( $block );

		$this->append_response( '<select class="' . $this->field_width_classes( $block ) . '" ' . $is_multiselect . '>' );

		foreach ( $block['attrs']['options'] as $option ) {
			$this->append_response( '<option value="' . $option['value'] . '">' . $option['label'] . '</option>' );
		}

		$this->append_response( '</select>' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function file_field( $block ) {
		$is_required = $block['attrs']['required'] == 1 ? 'yes' : 'no';

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );

		$this->field_label( $block );

		$this->append_response( '<input class="' . $this->field_width_classes( $block ) . '" name="kb_field_1" id="kb_field__04ea80-5f_1" data-label="' . $block['attrs']['label'] . '" type="file" data-type="file" data-required="' . $is_required . '" />' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function textarea_field( $block ) {
		$is_required = $block['attrs']['required'] == 1 ? 'yes' : 'no';
		$rows = empty( $block['attrs']['rows'] ) || !is_numeric( $block['attrs']['rows'] ) ? '3' : $block['attrs']['rows'];

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );

		$this->field_label( $block );

		$this->append_response( '<textarea rows="' . $rows . '" class="' . $this->field_width_classes( $block ) . '" placeholder="' . $block['attrs']['placeholder'] . '" name="kb_field_1" id="kb_field__04ea80-5f_1" data-label="' . $block['attrs']['label'] . '" data-required="' . $is_required . '"></textarea>' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

	}

	private function accept_field( $block ) {
		$is_required = $block['attrs']['required'] == 1 ? 'yes' : 'no';
		$rows = empty( $block['attrs']['rows'] ) || !is_numeric( $block['attrs']['rows'] ) ? '3' : $block['attrs']['rows'];

		$this->append_response( '<div class="kadence-blocks-advanced-form-field kb-field-desk-width-100 kb-input-size-standard">' );

		$this->field_label( $block );

		$this->append_response( '<input type="checkbox" value="' . $block['attrs']['value'] . '">' );

		$this->field_help_text( $block );

		$this->append_response( '</div>' );

		echo '<pre>';
		print_r($block);
		die();
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
				$field_type                = str_replace( 'kadence/advanced-form-', '', $block['blockName'] );
				$fieldTypes[ $field_type ] = '';
			}
		}

		return array_keys( $fieldTypes );
	}

	private function field_label( $block ) {

		if ( ! empty( $block['attrs']['label'] ) ) {
			$this->append_response( '<label for="kb_field__04ea80-5f_1">' . $block['attrs']['label'] );

			if ( $this->show_required() && $block['attrs']['required'] == 1 ) {
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
		if ( ! empty( $block['attrs']['width'][0] ) && is_numeric( $block['attrs']['width'][0] ) || $block['attrs']['width'][0] === 'unset' ) {
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

	public function get_form_action() {
		return self::FORM_ACTION;
	}

	/**
	 * Is the required asterisk enabled
	 *
	 * @return bool
	 */
	private function show_required() {
		return $this->field_attributes['showRequired'];
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

