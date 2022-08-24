/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { InspectorControls, InspectorAdvancedControls } from '@wordpress/block-editor';
import { withSelect, withDispatch } from '@wordpress/data';
import { KadencePanelBody } from '@kadence/components';

import { ColumnWidth } from '../../components';
import classNames from 'classnames';

function FieldText( { attributes, setAttributes, isSelected } ) {
	const { required, label, showLabel, value, helpText, ariaDescription, width, placeholder, name } = attributes;

	const classes = classNames( {
		'kb-advanced-form-field': true,
		[ `kb-field-desk-width-${width[0]}` ]: true,
		[ `kb-field-tablet-width-${width[1]}` ]: width[1] !== '',
		[ `kb-field-mobile-width-${width[2]}` ]: width[2] !== '',
	});

	return (
		<div className={ classes }>
			<InspectorControls>

				<KadencePanelBody
					title={__( 'Field Controls', 'kadence-blocks' )}
					initialOpen={true}
					panelName={ 'kb-adv-form-text-controls' }
				>
					<ToggleControl
						label={__( 'Required', 'kadence-blocks' )}
						checked={required}
						onChange={( value ) => setAttributes( { required: value } )}
					/>

					<ToggleControl
						label={__( 'Show Label', 'kadence-blocks' )}
						checked={showLabel}
						onChange={( value ) => setAttributes( { showLabel: value } )}
					/>

					<TextControl
						label={__( 'Field Placeholder', 'kadence-blocks' )}
						value={placeholder}
						onChange={( value ) => setAttributes( { placeholder: value } )}
					/>

					<TextControl
						label={__( 'Default Value', 'kadence-blocks' )}
						value={value}
						onChange={( value ) => setAttributes( { value: value } )}
					/>

					<TextControl
						label={__( 'Help Text', 'kadence-blocks' )}
						value={helpText}
						onChange={( value ) => setAttributes( { helpText: value } )}
					/>

					<TextControl
						label={__( 'Input aria description', 'kadence-blocks' )}
						value={ariaDescription}
						onChange={( value ) => setAttributes( { ariaDescription: value } )}
					/>

					<ColumnWidth saveSubmit={setAttributes} width={width}/>

				</KadencePanelBody>

			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={__( 'Field Name', 'kadence-blocks' )}
					help={ __( 'This is the name attribute that is applied to the html input tag.', 'kadence-blocks' ) }
					value={name}
					onChange={( value ) => setAttributes( { name: value.replace(/[^a-z0-9-_]/gi, '') } ) }
				/>
			</InspectorAdvancedControls>
			<>
				<FormFieldLabel
					required={required}
					label={label}
					showLabel={showLabel}
					setAttributes={setAttributes}
					isSelected={isSelected}
					name={name}
				/>
				<input
					type={'text'}
					className={'kb-field'}
					value={value}
					placeholder={placeholder}
					onChange={( value ) => false}
				/>
				{helpText && <span className="kb-advanced-form-help">{helpText}</span>}
			</>
		</div>
	);
}

export default FieldText;
