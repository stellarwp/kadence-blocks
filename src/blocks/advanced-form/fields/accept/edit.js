/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, ToggleControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import { withSelect, withDispatch } from '@wordpress/data';

import { GetInputStyles, GetLabelStyles } from '../../components';

function FieldAccept( props ) {
	const { attributes, setAttributes, isSelected, name, previewDevice, context } = props;
	const { required, label, showLabel, value, helpText, ariaDescription, textColor } = attributes;

	const parentFieldStyle = context['kadence/advanced-form/field-style'];
	const parentLabelStyle = context['kadence/advanced-form/label-style'];
	const parentHelpStyle = context['kadence/advanced-form/help-style'];

	const previewStyles = GetInputStyles( previewDevice, parentFieldStyle );
	const labelStyles = GetLabelStyles( previewDevice, parentLabelStyle );

	return (
		<div className={'kadence-blocks-form-field kb-input-size-standard'}>
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
			<div className={'kb-form-field-container'}>
				<div className={'kb-form-field-inline'}>
					<input
						type={'checkbox'}
						checked={value}
						onChange={( value ) => false }
						style={ {
							borderColor: previewStyles.borderColor,
						} }
					/>

					<FormFieldLabel
						required={required}
						label={label}
						showLabel={showLabel}
						setAttributes={setAttributes}
						isSelected={isSelected}
						name={name}
						textColor={textColor}
						labelStyles={ labelStyles }
						fieldStyle={ parentFieldStyle }
					/>
				</div>
				{helpText && <div style={ labelStyles } className="kb-form-field-help">{helpText}</div>}
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
] )( FieldAccept );
