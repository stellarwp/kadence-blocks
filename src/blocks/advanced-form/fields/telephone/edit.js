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
import { getPreviewSize } from '@kadence/helpers';

import { ColumnWidth, GetHelpStyles, GetInputStyles, GetLabelStyles } from '../../components';


function FieldTelephone( { attributes, setAttributes, isSelected, name, previewDevice, context } ) {
	const { required, label, value, showLabel, helpText, ariaDescription, width, placeholder, textColor } = attributes;

	const parentFieldStyle = context['kadence/advanced-form/field-style'];
	const parentLabelStyle = context['kadence/advanced-form/label-style'];
	const parentHelpStyle = context['kadence/advanced-form/help-style'];

	const previewStyles = GetInputStyles( previewDevice, parentFieldStyle );
	const labelStyles = GetLabelStyles( previewDevice, parentLabelStyle );
	const helpStyles = GetHelpStyles( previewDevice, parentHelpStyle );

	const previewWidth = getPreviewSize( previewDevice, width[ 0 ], width[ 1 ], width[ 2 ] ) ;

	return (
		<div className={ 'kadence-blocks-form-field kb-input-size-standard' }>
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
			<div className={'kb-form-field-container'}>
				<div className={'kb-form-field'}>
				<FormFieldLabel
					required={ required }
					label={ label }
					showLabel={ showLabel }
					setAttributes={ setAttributes }
					isSelected={ isSelected }
					name={ name }
					textColor={ textColor }
					labelStyles={ labelStyles }
					fieldStyle={ parentFieldStyle }
				/>

				<input
					type={ 'phone' }
					className={'kb-field'}
					value={ value }
					placeholder={placeholder}
					onChange={( value ) => false}
					style={ {
						lineHeight: previewStyles.lineHeight,
						fontSize: previewStyles.fontSize,
						paddingTop: previewStyles.paddingTop,
						paddingRight: previewStyles.paddingRight,
						paddingBottom: previewStyles.paddingBottom,
						paddingLeft: previewStyles.paddingLeft,
						background: previewStyles.background,
						color: previewStyles.color,
						borderRadius: previewStyles.borderRadius,
						borderTopWidth: previewStyles.borderTopWidth,
						borderRightWidth: previewStyles.borderRightWidth,
						borderBottomWidth: previewStyles.borderBottomWidth,
						borderLeftWidth: previewStyles.borderLeftWidth,
						borderColor: previewStyles.borderColor,
						boxShadow: previewStyles.boxShadow,
						width: previewWidth + '%',
					} }
				/>
					{helpText && <span style={ helpStyles } className="kb-form-field-help">{helpText}</span>}
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
] )( FieldTelephone );
