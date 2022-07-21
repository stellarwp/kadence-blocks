/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { isEmpty, has, unset } from 'lodash';

const FormFieldLabel = ( { setAttributes, label, resetFocus, fieldStyle, showLabel, labelStyles, required } ) => {

	let showRequired = true;

	if( !showLabel ){
		return (
			<></>
		);
	}

	let requiredColorCss = {};

	if( !isEmpty(fieldStyle, 'requiredColor') ){
		requiredColorCss = {
			color: fieldStyle.requiredColor
		}
	}

	return (
		<div className={'kadence-label'} style={ labelStyles }>
				<RichText
					className={'kadence-field-label__input'}
					onChange={( value ) => {
						if ( resetFocus ) {
							resetFocus();
						}
						setAttributes( { label: value } );
					}}
					placeholder={__( 'Field label', 'kadence-blocks' )}
					tagName="label"
					value={label}
					multiline={ false }
				/>
				{ showRequired && required && <span style={ requiredColorCss }>*</span>}
		</div>
	);
};

export default FormFieldLabel;
