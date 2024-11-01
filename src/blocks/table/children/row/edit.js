import { __ } from '@wordpress/i18n';
import React, { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, BlockControls, InnerBlocks, useInnerBlocksProps } from '@wordpress/block-editor';
import metadata from './block.json';

import {
	RangeControl,
	ToggleControl,
	TextControl,
	Modal,
	SelectControl,
	FormFileUpload,
	Button,
	Notice,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';

import {
	KadenceSelectPosts,
	KadencePanelBody,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	PopColorControl,
	SelectParentBlock,
	ResponsiveRangeControls,
} from '@kadence/components';

import {
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getUniqueId,
	getPostOrFseId,
	getPreviewSize,
} from '@kadence/helpers';

import classnames from 'classnames';
import BackendStyles from './backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	const {
		uniqueID,
		columns,
		backgroundColor,
		backgroundHoverColor,
		minHeight,
		tabletMinHeight,
		mobileMinHeight,
		minHeightUnit,
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
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

	const [activeTab, setActiveTab] = useState('style');
	const { getBlocks } = useSelect((select) => select('core/block-editor'));
	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const nonTransAttrs = [];

	// const classes = classnames(
	// 	{
	// 		'kb-table-row': true,
	// 		[`kb-table-row${uniqueID}`]: uniqueID,
	// 	},
	// 	className
	// );
	// const blockProps = useBlockProps({
	// 	className: classes,
	// });

	useEffect(() => {
		setBlockDefaults('kadence/table-row', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

	useEffect(() => {
		const innerBlocks = getBlocks(clientId);

		if (innerBlocks.length < columns) {
			// Add new blocks
			const newBlocks = [
				...innerBlocks,
				...Array(Math.max(1, columns - innerBlocks.length))
					.fill(null)
					.map(() => wp.blocks.createBlock('kadence/table-data', {})),
			];
			replaceInnerBlocks(clientId, newBlocks, false);
		} else if (innerBlocks.length > columns) {
			// Remove excess blocks
			const updatedBlocks = innerBlocks.slice(0, columns);
			replaceInnerBlocks(clientId, updatedBlocks, false);
		}
	}, [columns]);

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: classnames(
				{
					'kb-table-row': true,
					[`kb-table-row${uniqueID}`]: uniqueID,
				},
				className
			),
			style: {},
		},
		{
			allowedBlocks: ['kadence/table-data'],
			orientation: 'vertical',
			templateLock: 'all',
			renderAppender: false,
			templateInsertUpdatesSelection: true,
		}
	);

	return (
		<tr {...innerBlocksProps}>
			{/*<div {...blockProps}>*/}
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/table-row'}>
				<SelectParentBlock
					label={__('View Table Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/table'}
				/>
				<InspectorControlTabs
					panelName={'table-row'}
					allowedTabs={['general', 'advanced']}
					setActiveTab={setActiveTab}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Row Style', 'kadence-blocks')}
							initialOpen={true}
							panelName={'table-row-style'}
						>
							<PopColorControl
								label={__('Row Background', 'kadence-blocks')}
								value={backgroundColor ? backgroundColor : ''}
								default={''}
								onChange={(value) => setAttributes({ backgroundColor: value })}
							/>

							<PopColorControl
								label={__('Row Hover Background', 'kadence-blocks')}
								value={backgroundHoverColor ? backgroundHoverColor : ''}
								default={''}
								onChange={(value) => setAttributes({ backgroundHoverColor: value })}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Row Height', 'kadence-blocks')}
							initialOpen={true}
							panelName={'table-row-height'}
						>
							<ResponsiveRangeControls
								label={__('Height', 'kadence-blocks')}
								value={minHeight}
								onChange={(value) => setAttributes({ minHeight: value })}
								tabletValue={tabletMinHeight}
								onChangeTablet={(value) => setAttributes({ tabletMinHeight: value })}
								mobileValue={mobileMinHeight}
								onChangeMobile={(value) => setAttributes({ mobileMinHeight: value })}
								min={0}
								max={minHeightUnit === 'px' ? 600 : 100}
								step={1}
								unit={minHeightUnit}
								onUnit={(value) => {
									setAttributes({ minHeightUnit: value });
								}}
								units={['px', 'em', 'vh']}
								reset={() =>
									setAttributes({
										minHeight: null,
										tabletMinHeight: null,
										mobileMinHeight: null,
									})
								}
								showUnit={true}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && <>KadenceBlockDefaults</>}
			</KadenceInspectorControls>
			{children}
			<BackendStyles attributes={attributes} previewDevice={previewDevice} />
		</tr>
	);
}

export default Edit;
