/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import {
	TextControl,
	TextareaControl,
	ToggleControl,
	PanelBody,
	RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	InspectorControls
} from '@wordpress/block-editor';
import {
	useEffect,
} from '@wordpress/element';

import { ColumnWidth } from '../../components';
import classNames from 'classnames';

function FieldText( { attributes, setAttributes, isSelected, name } ) {
	const { required, label, showLabel, value, helpText, ariaDescription, width, placeholder, rows } = attributes;

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
					title={__( 'Field Controls', 'kadence-blocks' )}
					initialOpen={true}
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

					<RangeControl
						label={__( 'Rows' )}
						value={rows}
						onChange={( value ) => setAttributes( { rows: parseInt( value ) } )}
						min={2}
						max={50}
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

				</PanelBody>
			</InspectorControls>
			<>
				<FormFieldLabel
					required={required}
					label={label}
					showLabel={showLabel}
					setAttributes={setAttributes}
					isSelected={isSelected}
					name={name}
				/>
				<textarea
					className={'kb-field'}
					value={value}
					placeholder={placeholder}
					onChange={() => false}
					rows={rows}
				></textarea>
				{helpText && <span className="kb-adv-form-help">{helpText}</span>}
			</>
		</div>
	);
}

export default FieldText;

