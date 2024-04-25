/**
 * BLOCK: Kadence Off Canvas block
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { getUniqueId, getPostOrFseId, useEditorElement } from '@kadence/helpers';
import {
	SelectParentBlock,
	KadenceRadioButtons,
	KadencePanelBody,
	PopColorControl,
	InspectorControlTabs,
	ResponsiveMeasureRangeControl,
	ResponsiveRangeControls,
} from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, useMemo, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import BackendStyles from './components/backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const [previewActive, setPreviewActive] = useState(false);
	const [activeTab, setActiveTab] = useState('general');

	const {
		uniqueID,
		slideFrom,
		backgroundColor,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		widthType,
		maxWidth,
		maxWidthTablet,
		maxWidthMobile,
		maxWidthUnit,
		pageBackgroundColor,
		containerMaxWidth,
		containerMaxWidthTablet,
		containerMaxWidthMobile,
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { selectBlock } = useDispatch(blockEditorStore);

	const { isUniqueID, isUniqueBlock, parentData, previewDevice, parentClientId } = useSelect(
		(select) => {
			const { getBlockParents, getBlockParentsByBlockName } = select(blockEditorStore);
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
				parentClientId: select('core/block-editor').getBlockParents(clientId)[0],
			};
		},
		[clientId]
	);

	useEffect(() => {
		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueId, clientId);
		}
	}, []);

	const selfOrChildSelected = () => {
		const childSelected = useSelect((select) => select('core/block-editor').hasSelectedInnerBlock(clientId, true));
		return isSelected || childSelected;
	};

	const ref = useRef();

	const handleModalClick = (e) => {
		console.log(1, e.target);
		if (e.target.classList.contains('wp-block-kadence-off-canvas')) {
			setPreviewActive(false);
			selectBlock(parentClientId);
		}
		console.log(2);
	};

	const editorElement = useEditorElement(ref, [selfOrChildSelected, previewActive]);

	const classes = classnames('wp-block-kadence-off-canvas', `off-canvas-side-${slideFrom}`, {
		active: selfOrChildSelected() || previewActive,
		[`wp-block-kadence-off-canvas${uniqueID}`]: uniqueID,
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	const innerNavClasses = classnames('kb-off-canvas-inner');

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerNavClasses,
		},
		{
			templateLock: false,
			template: [['core/paragraph', { placeholder: __('Create Awesome', 'kadence-blocks') }]],
		}
	);

	const overlayClasses = classnames('kb-off-canvas-overlay', {
		[`kb-off-canvas-overlay${uniqueID}`]: uniqueID,
	});

	return (
		<>
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header'}
				/>

				<InspectorControlTabs panelName={'off-canvas'} setActiveTab={setActiveTab} activeTab={activeTab} />
				{activeTab === 'general' && (
					<>
						<KadencePanelBody>
							<KadenceRadioButtons
								label={__('Show Off cavnas content in editor when not selected', 'kadence-blocks')}
								value={previewActive}
								options={[
									{ value: true, label: __('Show', 'kadence-blocks') },
									{ value: false, label: __('Hide', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setPreviewActive(value);
								}}
							/>
						</KadencePanelBody>
						<KadencePanelBody title={__('Display Settings', 'kadence-blocks')} initialOpen={true}>
							<KadenceRadioButtons
								label={__('Slide Content from', 'kadence-blocks')}
								value={slideFrom}
								options={[
									{ value: 'left', label: __('Left', 'kadence-blocks') },
									{ value: 'right', label: __('Right', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setAttributes({ slideFrom: value });
								}}
							/>

							<KadenceRadioButtons
								label={__('Content Width', 'kadence-blocks')}
								value={widthType}
								options={[
									{ value: 'partial', label: __('Partial', 'kadence-blocks') },
									{ value: 'full', label: __('Full', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setAttributes({ widthType: value });
								}}
							/>

							{widthType === 'partial' && (
								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={maxWidth !== 0 ? maxWidth : ''}
									onChange={(value) => setAttributes({ maxWidth: value })}
									tabletValue={maxWidthTablet ? maxWidthTablet : ''}
									onChangeTablet={(value) => setAttributes({ maxWidthTablet: value })}
									mobileValue={maxWidthMobile ? maxWidthMobile : ''}
									onChangeMobile={(value) => setAttributes({ maxWidthMobile: value })}
									min={100}
									max={1500}
									step={1}
									unit={'px'}
									showUnit={true}
									units={['px']}
									reset={() =>
										setAttributes({ maxWidth: '', maxWidthTablet: '', maxWidthMobile: '' })
									}
								/>
							)}

							<ResponsiveRangeControls
								label={__('Container Max Width', 'kadence-blocks')}
								value={containerMaxWidth ? containerMaxWidth : ''}
								onChange={(value) => setAttributes({ containerMaxWidth: value })}
								tabletValue={containerMaxWidthTablet ? containerMaxWidthTablet : ''}
								onChangeTablet={(value) => setAttributes({ containerMaxWidthTablet: value })}
								mobileValue={containerMaxWidthMobile ? containerMaxWidthMobile : ''}
								onChangeMobile={(value) => setAttributes({ containerMaxWidthMobile: value })}
								min={100}
								max={1500}
								step={1}
								unit={'px'}
								showUnit={true}
								units={['px']}
								reset={() =>
									setAttributes({
										containerMaxWidth: '',
										containerMaxWidthTablet: '',
										containerMaxWidthMobile: '',
									})
								}
							/>

							<PopColorControl
								label={__('Background Color', 'kadence-blocks')}
								value={backgroundColor ? backgroundColor : ''}
								default={''}
								onChange={(value) => setAttributes({ backgroundColor: value })}
							/>

							{widthType === 'partial' && (
								<PopColorControl
									label={__('Page Background Color', 'kadence-blocks')}
									value={pageBackgroundColor}
									onChange={(value) => setAttributes({ pageBackgroundColor: value })}
								/>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && <>Style</>}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								tabletValue={tabletPadding}
								mobileValue={mobilePadding}
								onChange={(value) => {
									setAttributes({ padding: value });
								}}
								onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
								onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
								min={paddingUnit === 'em' || paddingUnit === 'rem' ? -12 : -999}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 999}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
								allowAuto={true}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<BackendStyles {...props} previewDevice={previewDevice} editorElement={editorElement} />
			<div {...blockProps} onClick={(e) => handleModalClick(e)} ref={ref}>
				{/* <div className="kb-off-canvas-label">{__('Off Canvas Content', 'kadence-blocks')}</div> */}
				<div {...innerBlocksProps} />
			</div>
			<div className={overlayClasses}></div>
		</>
	);
}

export default Edit;
