import { __ } from '@wordpress/i18n';
import React, { useEffect, useMemo, useState, memo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { BlockControls, useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';
import { plus } from '@wordpress/icons';
import BackendStyles from './backend-styles';
import {
	CopyPasteAttributes,
	KadenceInspectorControls,
	KadencePanelBody,
	InspectorControlTabs,
	SelectParentBlock,
	ResponsiveMeasureRangeControl,
} from '@kadence/components';
import { uniqueIdHelper } from '@kadence/helpers';
import { createBlock } from '@wordpress/blocks';
import { flow } from 'lodash';
import classnames from 'classnames';
import { ToolbarDropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { TableControlsDropdown } from './table-controls';

const DEFAULT_BLOCK = [['core/paragraph', {}]];
export function Edit(props) {
	const { attributes, setAttributes, className, clientId, context } = props;

	const { uniqueID, column, padding, tabletPadding, mobilePadding, paddingType } = attributes;

	const [activeTab, setActiveTab] = useState('general');

	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const { insertBlock, updateBlockAttributes } = useDispatch('core/block-editor');

	const { index, parentTableClientId, parentColumns, columnPosition, siblingRows, hasInnerBlocks, previewDevice } =
		useSelect(
			(select) => {
				const blockParents = select('core/block-editor').getBlockParents(clientId);
				const tableClientId = blockParents[0];
				const rowId = blockParents[1];
				const rowBlocks = select('core/block-editor').getBlockOrder(rowId);
				return {
					index: select('core/block-editor').getBlockIndex(clientId),
					parentTableClientId: tableClientId,
					parentColumns: select('core/block-editor').getBlockAttributes(tableClientId).columns,
					currentRowClientId: rowId,
					columnPosition: rowBlocks.indexOf(clientId),
					siblingRows: select('core/block-editor').getBlocks(tableClientId),
					hasInnerBlocks: select('core/block-editor').getBlocks(clientId).length > 0,
					previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				};
			},
			[clientId]
		);

	useEffect(() => {
		if (columnPosition !== column) {
			setAttributes({ column: columnPosition });
		}
	}, [columnPosition]);

	useEffect(() => {
		if (!hasInnerBlocks) {
			const paragraph = createBlock('core/paragraph');
			replaceInnerBlocks(clientId, [paragraph], false);
		}
	}, [hasInnerBlocks]);

	const classes = useMemo(
		() =>
			classnames({
				className: true,
				[`kb-table-data${uniqueID}`]: uniqueID,
				'kb-table-data': true,
			}),
		[uniqueID]
	);

	const blockProps = useBlockProps({
		className: classes,
	});

	uniqueIdHelper(props);

	useEffect(() => {
		// Moved uniqueIdHelper outside of useEffect
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

	const Tag =
		(index === 0 && context['kadence/table/isFirstColumnHeader']) || context['kadence/table/thisRowIsHeader']
			? 'th'
			: 'td';

	return (
		<Tag {...blockProps}>
			<BackendStyles attributes={attributes} previewDevice={previewDevice} />
			<BlockControls>
				<TableControlsDropdown onAddRow={addRow} onAddColumn={addColumn} />
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
					allowedTabs={['general']}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<KadencePanelBody initialOpen={true}>
						<ResponsiveMeasureRangeControl
							label={__('Padding', 'kadence-blocks')}
							value={padding}
							tabletValue={tabletPadding}
							mobileValue={mobilePadding}
							onChange={(value) => setAttributes({ padding: value })}
							onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
							onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
							min={paddingType === 'em' || paddingType === 'rem' ? -25 : -999}
							max={paddingType === 'em' || paddingType === 'rem' ? 25 : 999}
							step={paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1}
							unit={paddingType}
							units={['px', 'em', 'rem', '%']}
							onUnit={(value) => setAttributes({ paddingType: value })}
						/>
					</KadencePanelBody>
				)}
			</KadenceInspectorControls>
			<InnerBlocks template={DEFAULT_BLOCK} renderAppender={false} templateLock={false} />
		</Tag>
	);
}

export default Edit;
