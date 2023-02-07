/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, TextareaControl, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, InspectorAdvancedControls } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { KadencePanelBody, InspectorControlTabs } from '@kadence/components';
import {
	useEffect,
	useState,
} from '@wordpress/element';
import {
	getUniqueId,
} from '@kadence/helpers';
import { ColumnWidth } from '../../components';
import classNames from 'classnames';

function FieldText( { attributes, setAttributes, isSelected, clientId } ) {
	const { uniqueID, required, label, showLabel, defaultValue, helpText, ariaDescription, width, placeholder, auto, name } = attributes;
	const [ activeTab, setActiveTab ] = useState( 'general' );
	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );
	const classes = classNames( {
		'kb-adv-form-field': true,
	});

	return (
		<div className={ classes }>
			<InspectorControls>
				<InspectorControlTabs
					panelName={'advanced-form-text-general'}
					setActiveTab={ ( value ) => setActiveTab( value ) }
					activeTab={ activeTab }
					allowedTabs={ [ 'general', 'advanced' ] }
				/>
				{ ( activeTab === 'general' ) &&
					<>
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
							<TextControl
								label={__( 'Field Label', 'kadence-blocks' )}
								value={label}
								onChange={( value ) => setAttributes( { label: value } )}
							/>
							<ToggleControl
								label={__( 'Show Label', 'kadence-blocks' )}
								checked={showLabel}
								onChange={( value ) => setAttributes( { showLabel: value } )}
							/>
							<TextareaControl
								label={__( 'Description', 'kadence-blocks' )}
								help={ __( 'This will be displayed under the input and can be used to provide direction on how the field should be filled out.', 'kadence-blocks' )}
								value={helpText}
								onChange={( value ) => setAttributes( { helpText: value } )}
							/>
							<TextControl
								label={__( 'Field Placeholder', 'kadence-blocks' )}
								value={placeholder}
								onChange={( value ) => setAttributes( { placeholder: value } )}
							/>
							<TextControl
								label={__( 'Default Value', 'kadence-blocks' )}
								value={defaultValue}
								onChange={( value ) => setAttributes( { defaultValue: value } )}
							/>
							<SelectControl
								label={__( 'Field Auto Fill', 'kadence-blocks' )}
								value={ auto }
								options={[
									{ value: '', label: __( 'Default', 'kadence-blocks' ) },
									{ value: 'name', label: __( 'Name', 'kadence-blocks' ) },
									{ value: 'given-name', label: __( 'First Name', 'kadence-blocks' ) },
									{ value: 'family-name', label: __( 'Last Name', 'kadence-blocks' ) },
									{ value: 'email', label: __( 'Email', 'kadence-blocks' ) },
									{ value: 'organization', label: __( 'Organization', 'kadence-blocks' ) },
									{ value: 'street-address', label: __( 'Street Address', 'kadence-blocks' ) },
									{ value: 'address-line1', label: __( 'Address Line 1', 'kadence-blocks' ) },
									{ value: 'address-line2', label: __( 'Address Line 1', 'kadence-blocks' ) },
									{ value: 'country-name', label: __( 'Country Name', 'kadence-blocks' ) },
									{ value: 'postal-code', label: __( 'Postal Code', 'kadence-blocks' ) },
									{ value: 'tel', label: __( 'Telephone', 'kadence-blocks' ) },
									{ value: 'off', label: __( 'Off', 'kadence-blocks' ) },
								]}
								onChange={( value ) => setAttributes( { auto: value } )}
							/>
							<TextControl
								label={__( 'Input aria description', 'kadence-blocks' )}
								value={ariaDescription}
								onChange={( value ) => setAttributes( { ariaDescription: value } )}
							/>
						</KadencePanelBody>
					</>
				}
				{ ( activeTab === 'advanced' ) &&
					<>
						<KadencePanelBody
							title={__( 'Field Width', 'kadence-blocks' )}
							initialOpen={true}
							panelName={ 'kb-adv-form-text-width' }
						>

						</KadencePanelBody>
					</>
				}
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
					value={defaultValue}
					placeholder={placeholder}
					onChange={( value ) => false}
				/>
				{helpText && <span className="kb-adv-form-help">{helpText}</span>}
			</>
		</div>
	);
}

export default FieldText;
