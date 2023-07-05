/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { KadencePanelBody, InspectorControlTabs, FormInputControl } from '@kadence/components';
import {
	useEffect,
	useState,
	useMemo,
} from '@wordpress/element';
import { getUniqueId } from '@kadence/helpers';
import classNames from 'classnames';
import { DuplicateField, FieldBlockAppender, FieldName } from '../../components';

function FieldHidden( { attributes, setAttributes, isSelected, clientId, context, name } ) {
	const { uniqueID, label, defaultValue, defaultParameter, inputName, kadenceDynamic } = attributes;
	const [ activeTab, setActiveTab ] = useState( 'general' );
	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId, inputName ]
	);

	useEffect( () => {
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );
	const classes = classNames( {
		'kb-adv-form-field': true,
	});
	const blockProps = useBlockProps( {
		className: classes
	} );
	const defaultPreview = useMemo( () => {
		if ( undefined !== kadenceDynamic && undefined !== kadenceDynamic['defaultValue'] && undefined !== kadenceDynamic['defaultValue']?.enable && '' !== kadenceDynamic['defaultValue'].enable && true === kadenceDynamic['defaultValue'].enable ) {
			return kadenceDynamic?.['defaultValue']?.field ? '{' + kadenceDynamic['defaultValue'].field + '}' : '';
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
						panelName={'advanced-form-hidden-general'}
						setActiveTab={ ( value ) => setActiveTab( value ) }
						activeTab={ activeTab }
						allowedTabs={ [ 'general', 'advanced' ] }
					/>
					{ ( activeTab === 'general' ) &&
						<>
							<KadencePanelBody
								title={__( 'Field Controls', 'kadence-blocks' )}
								initialOpen={true}
								panelName={ 'kb-adv-form-hidden-controls' }
							>
								<TextControl
									label={__( 'Field Label', 'kadence-blocks' )}
									value={label}
									onChange={( value ) => setAttributes( { label: value } )}
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
								title={__( 'Extra Settings', 'kadence-blocks' )}
								initialOpen={false}
								panelName={ 'kb-adv-form-hidden-extra-settings' }
							>
								<FieldName
									value={inputName}
									uniqueID={uniqueID}
									onChange={( value ) => setAttributes( { inputName: value.replace(/[^a-z0-9-_]/gi, '') } ) }
								/>
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
					{label === '' ? <em>Hidden Field</em> : <em>Hidden Field: {label}</em>}
				</>
				<FieldBlockAppender inline={ true } className="kb-custom-inbetween-inserter" getRoot={ clientId } />
			</div>
		</>
	);
}

export default FieldHidden;
