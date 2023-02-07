/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, ToggleControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';

import { ColumnWidth } from '../../components';
import classNames from 'classnames';

function FieldTelephone( { attributes, setAttributes, isSelected, name } ) {
	const { required, label, value, showLabel, helpText, ariaDescription, width, placeholder } = attributes;

	const classes = classNames( {
		'kb-adv-form-field': true,
		[ `kb-field-desk-width-${width[0]}` ]: true,
		[ `kb-field-tablet-width-${width[1]}` ]: width[1] !== '',
		[ `kb-field-mobile-width-${width[2]}` ]: width[2] !== '',
	});

	return (
		<div className={ classes }>
			<InspectorControls>

				<PanelBody
					title={ __( 'Field Controls', 'kadence-blocks' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Required', 'kadence-blocks' ) }
						checked={ required }
						onChange={ ( value ) => setAttributes( { required: value } ) }
					/>

					<ToggleControl
						label={ __( 'Show Label', 'kadence-blocks' ) }
						checked={ showLabel }
						onChange={ ( value ) => setAttributes( { showLabel: value } ) }
					/>

					<TextControl
						label={ __( 'Field Placeholder', 'kadence-blocks' ) }
						value={ placeholder }
						onChange={ ( value ) => setAttributes( { placeholder: value } ) }
					/>

					<TextControl
						label={ __( 'Help Text', 'kadence-blocks' ) }
						value={ helpText }
						onChange={ ( value ) => setAttributes( { helpText: value } ) }
					/>

					<TextControl
						label={ __( 'Input aria description', 'kadence-blocks' ) }
						value={ ariaDescription }
						onChange={ ( value ) => setAttributes( { ariaDescription: value } ) }
					/>

					<ColumnWidth saveSubmit={ setAttributes } width={ width } />

				</PanelBody>
			</InspectorControls>
			<>
				<FormFieldLabel
					required={ required }
					label={ label }
					showLabel={ showLabel }
					setAttributes={ setAttributes }
					isSelected={ isSelected }
					name={ name }
				/>

				<input
					type={ 'tel' }
					className={'kb-field'}
					value={ value }
					placeholder={placeholder}
					onChange={( value ) => false}
				/>

				{helpText && <span className="kb-form-field-help">{helpText}</span>}
			</>
		</div>
	);
}

export default FieldTelephone;
