import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, BlockControls, InnerBlocks } from '@wordpress/block-editor';
import classnames from 'classnames';
import metadata from './block.json';
import './editor.scss';
import { createBlock } from '@wordpress/blocks';

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
} from '@kadence/components';

import {
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getUniqueId,
	getPostOrFseId,
	getPreviewSize,
} from '@kadence/helpers';

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;

	const { uniqueID, rows, columns } = attributes;

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

	const { replaceInnerBlocks } = useDispatch('core/block-editor');

	const [activeTab, setActiveTab] = useState('general');

	const nonTransAttrs = [];

	const classes = classnames(
		{
			'wp-block-kadence-table': true,
			[`wp-block-kadence-table${uniqueID}`]: uniqueID,
		},
		className
	);
	const blockProps = useBlockProps({
		className: classes,
	});

	useEffect(() => {
		setBlockDefaults('kadence/table', attributes);

		if (uniqueID === undefined) {
			updateRowsColumns(rows, columns);
		}

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

	const updateRowsColumns = (newRows, newColumns) => {
		console.log(newRows, newColumns);
		const currentBlocks = wp.data.select('core/block-editor').getBlocks(clientId);

		let newRowBlocks = [...currentBlocks];

		if (newRows > rows && newRows !== 0) {
			const additionalRows = Array(Math.max(1, newRows - currentBlocks.length))
				.fill()
				.map(() => {
					return createBlock(
						'kadence/table-row',
						{ columns: newColumns },
						Array(newColumns)
							.fill()
							.map(() => createBlock('kadence/table-data', {}))
					);
				});
			newRowBlocks = [...newRowBlocks, ...additionalRows];
		} else if (newRows < rows && newRows !== 0) {
			newRowBlocks = newRowBlocks.slice(0, newRows);
		}

		if (newColumns !== columns) {
			newRowBlocks = newRowBlocks.map((rowBlock) => {
				if (rowBlock.attributes.columns === newColumns) {
					return rowBlock;
				}
				return {
					...rowBlock,
					attributes: { ...rowBlock.attributes, columns: newColumns },
				};
			});
		}

		replaceInnerBlocks(clientId, newRowBlocks, false);
		setAttributes({ rows: newRows, columns: newColumns });
	};

	return (
		<div {...blockProps}>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/lottie'}>
				<InspectorControlTabs
					panelName={'lottie'}
					setActiveTab={setActiveTab}
					allowedTabs={['general', 'advanced']}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Table Structure', 'kadence-blocks')}
							initialOpen={true}
							panelName={'tableStructure'}
							blockSlug={'kadence/table'}
						>
							<NumberControl
								label={__('Number of Rows', 'kadence-blocks')}
								value={rows}
								onChange={(newRows) => updateRowsColumns(newRows, columns)}
								min={1}
								max={50}
							/>
							<NumberControl
								label={__('Number of Columns', 'kadence-blocks')}
								value={columns}
								onChange={(newColumns) => updateRowsColumns(rows, newColumns)}
								min={1}
								max={20}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Source File', 'kadence-blocks')}
							initialOpen={true}
							panelName={'sourceFile'}
							blockSlug={'kadence/lottie'}
						></KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={nonTransAttrs}
						/>
					</>
				)}
			</KadenceInspectorControls>
			<table>
				<InnerBlocks
					template={[
						['kadence/table-row', { columns: 2 }],
						['kadence/table-row', { columns: 2 }],
					]}
				/>
			</table>
		</div>
	);
}

export default Edit;
