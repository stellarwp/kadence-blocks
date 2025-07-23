/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps, store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	KadencePanelBody,
	InspectorControlTabs,
	DynamicTextInputControl,
	SelectParentBlock,
} from '@kadence/components';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { getUniqueId } from '@kadence/helpers';
import classNames from 'classnames';
import { DuplicateField, FieldBlockAppender, FieldName, getUniqueFieldId } from '../../components';

function FieldHidden(props) {
	const { attributes, setAttributes, isSelected, clientId, context, name } = props;
	const { uniqueID, label, defaultValue, defaultParameter, inputName, kadenceDynamic } = attributes;
	const [activeTab, setActiveTab] = useState('general');
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	useEffect(() => {
		// Doesn't worry about if a filed is duplicated. Duplicated fields get a custom ID through the watch at the form level.
		const uniqueId = getUniqueFieldId(uniqueID, clientId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
		}
	}, []);
	const classes = classNames({
		'kb-adv-form-field': true,
	});
	const blockProps = useBlockProps({
		className: classes,
	});
	const defaultPreview = useMemo(() => {
		if (
			undefined !== kadenceDynamic &&
			undefined !== kadenceDynamic.defaultValue &&
			undefined !== kadenceDynamic.defaultValue?.enable &&
			'' !== kadenceDynamic.defaultValue.enable &&
			true === kadenceDynamic.defaultValue.enable
		) {
			return kadenceDynamic?.defaultValue?.field ? '{' + kadenceDynamic.defaultValue.field + '}' : '';
		}
		return attributes?.defaultValue ? attributes.defaultValue : '';
	}, [kadenceDynamic, defaultValue]);

	return (
		<>
			<style>
				{isSelected && (
					<>
						{`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }`}
						;
					</>
				)}
			</style>
			<div {...blockProps}>
				<DuplicateField clientId={clientId} name={name} attributes={attributes} />
				<InspectorControls>
					<SelectParentBlock
						label={__('View Form Settings', 'kadence-blocks')}
						clientId={clientId}
						parentSlug={'kadence/advanced-form'}
					/>
					<InspectorControlTabs
						panelName={'advanced-form-hidden'}
						setActiveTab={setActiveTab}
						activeTab={activeTab}
						allowedTabs={['general', 'advanced']}
					/>
					{activeTab === 'general' && (
						<>
							<KadencePanelBody
								title={__('Field Controls', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-adv-form-hidden-controls'}
							>
								<TextControl
									label={__('Field Label', 'kadence-blocks')}
									value={label}
									onChange={(value) => setAttributes({ label: value })}
								/>
								<DynamicTextInputControl
									label={__('Default Value', 'kadence-blocks')}
									value={defaultValue}
									preview={defaultPreview}
									onChange={(value) => setAttributes({ defaultValue: value })}
									dynamicAttribute={'defaultValue'}
									allowClear={true}
									isSelected={isSelected}
									attributes={attributes}
									setAttributes={setAttributes}
									name={name}
									clientId={clientId}
									context={context}
								/>
							</KadencePanelBody>
						</>
					)}
					{activeTab === 'advanced' && (
						<>
							<KadencePanelBody
								title={__('Extra Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-form-hidden-extra-settings'}
							>
								<FieldName
									value={inputName}
									uniqueID={uniqueID}
									onChange={(value) =>
										setAttributes({ inputName: value.replace(/[^a-z0-9-_]/gi, '') })
									}
								/>
								<TextControl
									label={__('Populate with Parameter', 'kadence-blocks')}
									help={__(
										'Enter a parameter that can be used in the page url to dynamically populate the field.',
										'kadence-blocks'
									)}
									value={defaultParameter}
									onChange={(value) => setAttributes({ defaultParameter: value })}
								/>
							</KadencePanelBody>
						</>
					)}
				</InspectorControls>
				<>
					{label === '' ? (
						<em className="kb-hidden-field-label">Hidden Field</em>
					) : (
						<em className="kb-hidden-field-label">Hidden Field: {label}</em>
					)}
				</>
				<FieldBlockAppender inline={true} className="kb-custom-inbetween-inserter" getRoot={clientId} />
			</div>
		</>
	);
}

export default FieldHidden;
