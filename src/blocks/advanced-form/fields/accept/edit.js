/**
 * Internal dependencies
 */
import FormFieldLabel from '../../label';

/**
 * WordPress dependencies
 */
import { TextControl, TextareaControl, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, RichText } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { KadencePanelBody, InspectorControlTabs, ResponsiveRangeControls, FormInputControl } from '@kadence/components';
import {
	useEffect,
	useState,
	useMemo,
} from '@wordpress/element';
import {
	getUniqueId,
	getPreviewSize,
} from '@kadence/helpers';
import classNames from 'classnames';
import { DuplicateField, FieldBlockAppender, FieldName } from '../../components';

function FieldAccept( { attributes, setAttributes, isSelected, clientId, context, name } ) {
	const {
		uniqueID,
		required,
		label,
		showLabel,
		defaultValue,
		helpText,
		ariaDescription,
		maxWidth,
		maxWidthUnit,
		minWidth,
		minWidthUnit,
		defaultParameter,
		placeholder,
		inputName,
		description,
		requiredMessage,
		kadenceDynamic,
	} = attributes;
	const [ activeTab, setActiveTab ] = useState( 'general' );
	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID   : ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ],
	);

	useEffect( () => {
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );
	const previewMaxWidth = getPreviewSize( previewDevice, ( maxWidth && maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), ( maxWidth && maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( maxWidth && maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) );
	const previewMinWidth = getPreviewSize( previewDevice, ( minWidth && minWidth[ 0 ] ? minWidth[ 0 ] : '' ), ( minWidth && minWidth[ 1 ] ? minWidth[ 1 ] : '' ), ( minWidth && minWidth[ 2 ] ? minWidth[ 2 ] : '' ) );
	const classes = classNames( {
		'kb-adv-form-field': true,
	} );
	const blockProps = useBlockProps( {
		className: classes,
		style    : {
			maxWidth: '' !== previewMaxWidth ? previewMaxWidth + ( maxWidthUnit ? maxWidthUnit : '%' ) : undefined,
			minWidth: '' !== previewMinWidth ? previewMinWidth + ( minWidthUnit ? minWidthUnit : 'px' ) : undefined,
		},
	} );
	const defaultPreview = useMemo( () => {
		if ( undefined !== kadenceDynamic && undefined !== kadenceDynamic[ 'defaultValue' ] && undefined !== kadenceDynamic[ 'defaultValue' ]?.enable && '' !== kadenceDynamic[ 'defaultValue' ].enable && true === kadenceDynamic[ 'defaultValue' ].enable ) {
			return kadenceDynamic?.[ 'defaultValue' ]?.field ? '{' + kadenceDynamic[ 'defaultValue' ].field + '}' : '';
		}
		return attributes?.defaultValue ? attributes.defaultValue : '';
	}, [ kadenceDynamic, defaultValue ] );

	return (
		<>
			<style>
				{ isSelected && (
					<>
						{ `.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }` };
					</>
				)}
			</style>
			<div {...blockProps}>
				<DuplicateField
					clientId={ clientId }
					name={name}
					attributes={ attributes }
				/>
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
								<FormInputControl
									label={__( 'Default Value', 'kadence-blocks' )}
									value={defaultValue}
									preview={ defaultPreview }
									onChange={( value ) => setAttributes( { defaultValue: value } )}
									dynamicAttribute={'defaultValue'}
									allowClear={true}
									isSelected={ isSelected }
									attributes={ attributes }
									setAttributes={ setAttributes }
									name={ name }
									clientId={ clientId }
									context={ context }
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
								<ResponsiveRangeControls
									label={__( 'Max Width', 'kadence-blocks' )}
									value={( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' )}
									onChange={value => {
										setAttributes( { maxWidth: [ value, ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
									}}
									tabletValue={( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' )}
									onChangeTablet={( value ) => {
										setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), value, ( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' ) ] } );
									}}
									mobileValue={( undefined !== maxWidth && undefined !== maxWidth[ 2 ] ? maxWidth[ 2 ] : '' )}
									onChangeMobile={( value ) => {
										setAttributes( { maxWidth: [ ( undefined !== maxWidth && undefined !== maxWidth[ 0 ] ? maxWidth[ 0 ] : '' ), ( undefined !== maxWidth && undefined !== maxWidth[ 1 ] ? maxWidth[ 1 ] : '' ), value ] } );
									}}
									min={0}
									max={( maxWidthUnit === 'px' ? 2000 : 100 )}
									step={1}
									unit={maxWidthUnit ? maxWidthUnit : '%'}
									onUnit={( value ) => {
										setAttributes( { maxWidthUnit: value } );
									}}
									units={[ 'px', '%', 'vw' ]}
								/>
								<ResponsiveRangeControls
									label={__( 'Min Width', 'kadence-blocks' )}
									value={( undefined !== minWidth && undefined !== minWidth[ 0 ] ? minWidth[ 0 ] : '' )}
									onChange={value => {
										setAttributes( { minWidth: [ value, ( undefined !== minWidth && undefined !== minWidth[ 1 ] ? minWidth[ 1 ] : '' ), ( undefined !== minWidth && undefined !== minWidth[ 2 ] ? minWidth[ 2 ] : '' ) ] } );
									}}
									tabletValue={( undefined !== minWidth && undefined !== minWidth[ 1 ] ? minWidth[ 1 ] : '' )}
									onChangeTablet={( value ) => {
										setAttributes( { minWidth: [ ( undefined !== minWidth && undefined !== minWidth[ 0 ] ? minWidth[ 0 ] : '' ), value, ( undefined !== minWidth && undefined !== minWidth[ 2 ] ? minWidth[ 2 ] : '' ) ] } );
									}}
									mobileValue={( undefined !== minWidth && undefined !== minWidth[ 2 ] ? minWidth[ 2 ] : '' )}
									onChangeMobile={( value ) => {
										setAttributes( { minWidth: [ ( undefined !== minWidth && undefined !== minWidth[ 0 ] ? minWidth[ 0 ] : '' ), ( undefined !== minWidth && undefined !== minWidth[ 1 ] ? minWidth[ 1 ] : '' ), value ] } );
									}}
									min={0}
									max={( minWidthUnit === 'px' ? 2000 : 100 )}
									step={1}
									unit={minWidthUnit ? minWidthUnit : 'px'}
									onUnit={( value ) => {
										setAttributes( { minWidthUnit: value } );
									}}
									units={[ 'px', '%', 'vw' ]}
								/>
							</KadencePanelBody>
							<KadencePanelBody
								title={__( 'Extra Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={ 'kb-adv-form-text-extra-settings' }
							>
								<FieldName
									value={inputName}
									uniqueID={uniqueID}
									onChange={( value ) => setAttributes( { inputName: value.replace(/[^a-z0-9-_]/gi, '') } ) }
								/>
								<TextControl
									label={__( 'Input aria description', 'kadence-blocks' )}
									value={ariaDescription}
									onChange={( value ) => setAttributes( { ariaDescription: value } )}
								/>
								{ required && (
									<TextControl
										label={__( 'Field error message when required', 'kadence-blocks' )}
										value={requiredMessage}
										onChange={( value ) => setAttributes( { requiredMessage: value } )}
										placeholder={( undefined !== label ? label : '' ) + ' ' + __( 'is required', 'kadence-blocks' )}
									/>
								)}
								<TextControl
									label={__( 'Populate with Parameter', 'kadence-blocks' )}
									help={ __( 'Enter a parameter that can be used in the page url to dynamically populate the field.', 'kadence-blocks' ) }
									value={defaultParameter}
									onChange={( value ) => setAttributes( { defaultParameter: value } )}
								/>
							</KadencePanelBody>
						</>
					}
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

					<div>
						<input
							type={'checkbox'}
							className={'kb-field'}
							value={ defaultPreview }
							placeholder={placeholder}
							onChange={( value ) => false}
						/>{ ' ' }
						<RichText
							className={'kadence-field-label__input'}
							onChange={( value ) => {
								setAttributes( { description: value } );
							}}
							placeholder={__( 'Opt me in!', 'kadence-blocks' )}
							allowedFormats={[ 'core/bold', 'core/italic', 'core/link', 'core/underline' ]}
							tagName="span"
							value={description}
							multiline={false}
						/>
					</div>

					{helpText && <span className="kb-adv-form-help">{helpText}</span>}
				</>
				<FieldBlockAppender inline={ true } className="kb-custom-inbetween-inserter" getRoot={ clientId } />
			</div>
		</>
	);
}

export default FieldAccept;
