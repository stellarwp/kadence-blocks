import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { BlockControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';
import { plus, columns } from '@wordpress/icons';

import {
	KadenceBlockDefaults,
	CopyPasteAttributes,
	KadenceInspectorControls,
	KadencePanelBody,
	InspectorControlTabs,
	SelectParentBlock,
} from '@kadence/components';
import { setBlockDefaults, getUniqueId, getPostOrFseId } from '@kadence/helpers';
import { createBlock } from '@wordpress/blocks';
import { flow } from 'lodash';
import classnames from 'classnames';
import { ToolbarDropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';

const DEFAULT_BLOCK = [['core/paragraph', {}]];
export function Edit(props) {
	const { attributes, setAttributes, className, clientId, context } = props;

	const { uniqueID } = attributes;

	const [activeTab, setActiveTab] = useState('general');

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const { insertBlock, updateBlockAttributes } = useDispatch('core/block-editor');

	const {
		isUniqueID,
		isUniqueBlock,
		parentData,
		index,
		parentTableClientId,
		parentColumns,
		columnPosition,
		siblingRows,
	} = useSelect(
		(select) => {
			const blockParents = select('core/block-editor').getBlockParents(clientId);
			const tableClientId = blockParents[0];
			const rowId = blockParents[1];
			const rowBlocks = select('core/block-editor').getBlockOrder(rowId);
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				index: select('core/block-editor').getBlockIndex(clientId),
				parentTableClientId: tableClientId,
				parentColumns: select('core/block-editor').getBlockAttributes(tableClientId).columns,
				currentRowClientId: rowId,
				columnPosition: rowBlocks.indexOf(clientId),
				siblingRows: select('core/block-editor').getBlocks(tableClientId),
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

	const classes = classnames(className, 'kb-table-data');
	const blockProps = useBlockProps({
		className: classes,
	});

	useEffect(() => {
		setBlockDefaults('kadence/table-data', attributes);

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

	const addRow = (position) => {
		let insertIndex;

		switch (position) {
			case 'before':
				insertIndex = index;
				break;
			case 'after':
				insertIndex = index + 1;
				break;
			case 'top':
				insertIndex = 0;
				break;
			case 'bottom':
				insertIndex = undefined;
				break;
			default:
				return;
		}

		const newRow = createBlock('kadence/table-row', {});
		insertBlock(newRow, insertIndex, parentTableClientId, false);
	};

	const addColumn = (position) => {
		const newColumnCount = parentColumns + 1;

		let insertIndex;
		switch (position) {
			case 'before':
				insertIndex = columnPosition;
				break;
			case 'after':
				insertIndex = columnPosition + 1;
				break;
			case 'start':
				insertIndex = 0;
				break;
			case 'end':
				insertIndex = parentColumns;
				break;
			default:
				return;
		}

		siblingRows.forEach((row) => {
			const newCells = [...row.innerBlocks];
			const newCell = createBlock('kadence/table-data', {});
			newCells.splice(insertIndex, 0, newCell);

			replaceInnerBlocks(row.clientId, newCells, false);
			updateBlockAttributes(parentTableClientId, { columns: newColumnCount });
		});
	};

	const rowControls = [
		{
			title: __('Add Row Before', 'kadence-blocks'),
			onClick: () => addRow('before'),
		},
		{
			title: __('Add Row After', 'kadence-blocks'),
			onClick: () => addRow('after'),
		},
		{
			title: __('Add Row at Top', 'kadence-blocks'),
			onClick: () => addRow('top'),
		},
		{
			title: __('Add Row at Bottom', 'kadence-blocks'),
			onClick: () => addRow('bottom'),
		},
	];

	const columnControls = [
		{
			title: __('Add Column Before', 'kadence-blocks'),
			onClick: () => addColumn('before'),
		},
		{
			title: __('Add Column After', 'kadence-blocks'),
			onClick: () => addColumn('after'),
		},
		{
			title: __('Add Column at Start', 'kadence-blocks'),
			onClick: () => addColumn('start'),
		},
		{
			title: __('Add Column at End', 'kadence-blocks'),
			onClick: () => addColumn('end'),
		},
	];

	const thisRowIsHeader = context['kadence/table/thisRowIsHeader'];
	const firstColumnIsHeader = context['kadence/table/isFirstColumnHeader'];
	const Tag = (index === 0 && firstColumnIsHeader) || thisRowIsHeader ? 'th' : 'td';

	return (
		<Tag {...blockProps}>
			<BlockControls>
				<ToolbarDropdownMenu icon={plus} label={__('Add Row', 'kadence-blocks')}>
					{({ onClose }) => (
						<>
							<MenuGroup>
								{rowControls.map((control) => (
									<MenuItem key={control.title} onClick={flow(onClose, control.onClick)}>
										{control.title}
									</MenuItem>
								))}
							</MenuGroup>
						</>
					)}
				</ToolbarDropdownMenu>

				<ToolbarDropdownMenu icon={columns} label={__('Add Column', 'kadence-blocks')}>
					{({ onClose }) => (
						<>
							<MenuGroup>
								{columnControls.map((control) => (
									<MenuItem key={control.title} onClick={flow(onClose, control.onClick)}>
										{control.title}
									</MenuItem>
								))}
							</MenuGroup>
						</>
					)}
				</ToolbarDropdownMenu>

				<CopyPasteAttributes
					attributes={attributes}
					setAttributes={setAttributes}
					blockName={'kadence/table-data'}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/table-data'}>
				<SelectParentBlock
					label={__('View Row Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/table-row'}
				/>
				<InspectorControlTabs
					panelName={'table-data'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<KadencePanelBody title={__('General', 'kadence-blocks')} initialOpen={true}>
						General settings
					</KadencePanelBody>
				)}
				{activeTab === 'advanced' && (
					<KadenceBlockDefaults
						blockSlug={'kadence/table-data'}
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				)}
			</KadenceInspectorControls>
			<InnerBlocks template={DEFAULT_BLOCK} renderAppender={false} templateLock={false} />
		</Tag>
	);
}

export default Edit;
