/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, ToggleControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText } from '@wordpress/block-editor';
import classNames from 'classnames';

function FieldAccept( props ) {
	const { attributes, setAttributes, isSelected, name } = props;
	const { required, label, showLabel, value, width, terms, helpText, ariaDescription } = attributes;

	const classes = classNames( {
		'kb-advanced-form-field': true,
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

					<ToggleControl
						label={__( 'Default Checked', 'kadence-blocks' )}
						checked={value}
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

				</PanelBody>
			</InspectorControls>
			<div className={'kb-form-multi'}>

				<FormFieldLabel
					required={required}
					label={label}
					showLabel={showLabel}
					setAttributes={setAttributes}
					isSelected={isSelected}
					name={name}
				/>

				<input
					type={'checkbox'}
					checked={value}
					name={ 'kb_accept' }
					className={ 'kb-sub-field kb-checkbox-style' }
					onChange={( value ) => false }
				/>
				<RichText
					className={'kadence-field-label__input'}
					onChange={( value ) => {
						setAttributes( { terms: value } );
					}}
					placeholder={__( 'Opt me in!', 'kadence-blocks' )}
					allowedFormats={ [ 'core/bold', 'core/italic', 'core/link', 'core/underline' ] }
					tagName="label"
					value={terms}
					multiline={ false }
				/>

				{helpText && <div className="kb-form-field-help">{helpText}</div>}
			</div>
		</div>
	);
}

export default FieldAccept;
