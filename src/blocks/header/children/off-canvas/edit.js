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
import { useBlockProps, InnerBlocks, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';

import {
	getUniqueId,
	getPostOrFseId,
	KadenceColorOutput,
	getPreviewSize,
	getSpacingOptionOutput,
} from '@kadence/helpers';
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
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function Edit(props) {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const [previewActive, setPreviewActive] = useState(isSelected);
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
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData, previewDevice } = useSelect(
		(select) => {
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

	const innerBlockClasses = classnames({
		'wp-block-kadence-off-canvas': true,
	});
	const innerBlocksProps = useInnerBlocksProps({
		className: innerBlockClasses,
	});

	const handleModalClick = (e) => {
		if (e.target.classList.contains('kb-off-canvas-modal')) {
			setPreviewActive(false);
		}
	};

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0] : '',
		undefined !== tabletPadding ? tabletPadding[0] : '',
		undefined !== mobilePadding ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[1] : '',
		undefined !== tabletPadding ? tabletPadding[1] : '',
		undefined !== mobilePadding ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[2] : '',
		undefined !== tabletPadding ? tabletPadding[2] : '',
		undefined !== mobilePadding ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[3] : '',
		undefined !== tabletPadding ? tabletPadding[3] : '',
		undefined !== mobilePadding ? mobilePadding[3] : ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== maxWidth ? maxWidth : '',
		undefined !== maxWidthTablet ? maxWidthTablet : '',
		undefined !== maxWidthMobile ? maxWidthMobile : ''
	);

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
									value={maxWidth ? maxWidth : ''}
									onChange={(value) => setAttributes({ maxWidth: value })}
									tabletValue={maxWidthTablet ? maxWidthTablet : ''}
									onChangeTablet={(value) => setAttributes({ maxWidthTablet: value })}
									mobileValue={maxWidthMobile ? maxWidthMobile : ''}
									onChangeMobile={(value) => setAttributes({ maxWidthMobile: value })}
									min={5}
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
			<div
				className={`kb-off-canvas-modal off-canvas-side-${slideFrom}  ${
					selfOrChildSelected() || previewActive ? 'preview-active' : ''
				}`}
				onClick={(e) => handleModalClick(e)}
				style={{
					backgroundColor: pageBackgroundColor
						? KadenceColorOutput(pageBackgroundColor)
						: KadenceColorOutput('rgba(0, 0, 0, 0.6)'),
				}}
			>
				<style>
					{`.components-popover.block-editor-block-popover {
								z-index: 100000;
							}`}
				</style>
				<span className="kb-off-canvas-label">{__('Off Canvas Content', 'kadence-blocks')}</span>
				<div
					className={`kb-off-canvas-modal-popup`}
					style={{
						background: backgroundColor ? KadenceColorOutput(backgroundColor) : '#FFF',
						width: widthType === 'full' ? '100%' : '',
						maxWidth: previewMaxWidth + maxWidthUnit,
						paddingTop:
							'' !== previewPaddingTop
								? getSpacingOptionOutput(previewPaddingTop, paddingUnit)
								: undefined,
						paddingRight:
							'' !== previewPaddingRight
								? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
								: undefined,
						paddingBottom:
							'' !== previewPaddingBottom
								? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
								: undefined,
						paddingLeft:
							'' !== previewPaddingLeft
								? getSpacingOptionOutput(previewPaddingLeft, paddingUnit)
								: undefined,
					}}
				>
					{/*<button*/}
					{/*	className={'kb-off-canvas-modal-close'}*/}
					{/*	aria-label={__('Close off canvas content editor', 'kadence-blocks')}*/}
					{/*	onClick={() => setPreviewActive(false)}*/}
					{/*>*/}
					{/*	<svg*/}
					{/*		viewBox="0 0 24 24"*/}
					{/*		fill="none"*/}
					{/*		width={'50px'}*/}
					{/*		height={'50px'}*/}
					{/*		stroke="currentColor"*/}
					{/*		xmlns="http://www.w3.org/2000/svg"*/}
					{/*		strokeWidth="2"*/}
					{/*		strokeLinecap="round"*/}
					{/*		strokeLinejoin="round"*/}
					{/*	>*/}
					{/*		<line x1="18" y1="6" x2="6" y2="18"></line>*/}
					{/*		<line x1="6" y1="6" x2="18" y2="18"></line>*/}
					{/*	</svg>*/}
					{/*</button>*/}
					<InnerBlocks
						templateLock={false}
						template={[['core/paragraph', { placeholder: __('Create Awesome', 'kadence-blocks-pro') }]]}
					/>
				</div>
			</div>
		</>
	);
}

export default Edit;
