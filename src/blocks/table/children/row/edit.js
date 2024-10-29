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
	SelectParentBlock,
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

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	const { uniqueID, columns } = attributes;

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

	const [activeTab, setActiveTab] = useState('general');
	const { getBlocks } = useSelect((select) => select('core/block-editor'));
	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const nonTransAttrs = [];

	const classes = classnames(className, 'kb-table-row');
	const blockProps = useBlockProps({
		className: classes,
	});

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

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: '',
			style: {},
		},
		{
			allowedBlocks: ['kadence/table-data'],
			templateLock: true,
			renderAppender: false,
			templateInsertUpdatesSelection: true,
		}
	);

	return (
		<>
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
					setActiveTab={setActiveTab}
					allowedTabs={['general', 'advanced']}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Row Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'rowSettings'}
							blockSlug={'kadence/table-row'}
						>
							Settings
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && <>KadenceBlockDefaults</>}
			</KadenceInspectorControls>
			<tr {...innerBlocksProps} />
		</>
	);
}

export default Edit;
