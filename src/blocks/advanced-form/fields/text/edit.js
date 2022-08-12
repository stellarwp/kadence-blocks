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
import { getPreviewSize } from '@kadence/helpers';
import { KadencePanelBody } from '@kadence/components';

import { ColumnWidth, GetInputStyles, GetLabelStyles, GetHelpStyles } from '../../components';

function FieldText( { attributes, setAttributes, isSelected, previewDevice, context } ) {
	const { required, label, showLabel, value, helpText, ariaDescription, width, placeholder, name } = attributes;

	let fieldStyle = context[ 'kadence/advanced-form/field-style' ];

	const previewStyles = GetInputStyles( previewDevice, fieldStyle );
	const labelStyles = GetLabelStyles( previewDevice, context[ 'kadence/advanced-form/label-style' ] );
	const helpStyles = GetHelpStyles( previewDevice, context[ 'kadence/advanced-form/help-style' ] );

	const previewWidth = getPreviewSize( previewDevice, width[ 0 ], width[ 1 ], width[ 2 ] );

	return (
		<div className={'kadence-blocks-form-field kb-input-size-standard'}>
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
			<div className={'kb-form-field-container'}>
				<div className={'kb-form-field'}>
					<FormFieldLabel
						required={required}
						label={label}
						showLabel={showLabel}
						setAttributes={setAttributes}
						isSelected={isSelected}
						name={name}
						labelStyles={labelStyles}
						fieldStyle={fieldStyle}
					/>
					<input
						type={'text'}
						className={'kb-field'}
						value={value}
						placeholder={placeholder}
						onChange={( value ) => false}
						style={{
							lineHeight       : previewStyles.lineHeight,
							fontSize         : previewStyles.fontSize,
							paddingTop       : previewStyles.paddingTop,
							paddingRight     : previewStyles.paddingRight,
							paddingBottom    : previewStyles.paddingBottom,
							paddingLeft      : previewStyles.paddingLeft,
							background       : previewStyles.background,
							color            : previewStyles.color,
							borderRadius     : previewStyles.borderRadius,
							borderTopWidth   : previewStyles.borderTopWidth,
							borderRightWidth : previewStyles.borderRightWidth,
							borderBottomWidth: previewStyles.borderBottomWidth,
							borderLeftWidth  : previewStyles.borderLeftWidth,
							borderColor      : previewStyles.borderColor,
							boxShadow        : previewStyles.boxShadow,
							width            : previewWidth + '%',
						}}
					/>

					{helpText && <span style={helpStyles} className="kb-form-field-help">{helpText}</span>}
				</div>
			</div>
		</div>
	);
}

export default compose( [
	withSelect( ( select ) => {
		return {
			previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
	withDispatch( ( dispatch ) => ( {
		addUniqueID: ( value, clientID ) => dispatch( 'kadenceblocks/data' ).addUniqueID( value, clientID ),
	} ) ),
] )( FieldText );
