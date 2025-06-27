import { __ } from '@wordpress/i18n';
import { useState, useEffect, useMemo, useCallback } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, BlockControls, BlockContextProvider, useInnerBlocksProps } from '@wordpress/block-editor';
import metadata from './block.json';
import { flow } from 'lodash';
import { ToolbarDropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';

import { plus } from '@wordpress/icons';

import {
	KadencePanelBody,
	InspectorControlTabs,
	KadenceInspectorControls,
	CopyPasteAttributes,
	PopColorControl,
	SelectParentBlock,
	ResponsiveRangeControls,
} from '@kadence/components';

import { setBlockDefaults, getUniqueId, getPostOrFseId } from '@kadence/helpers';

import classnames from 'classnames';
import BackendStyles from './backend-styles';

const createRowControls = (addRow) => [
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

const innerBlockProps = {};
const innerBlockPropOptions = {
	allowedBlocks: ['kadence/table-data'],
	renderAppender: false,
	templateInsertUpdatesSelection: true,
	templateLock: 'insert',
	orientation: 'horizontal',
};

export function Edit(props) {
	const { attributes, setAttributes, className, clientId, context } = props;

	const {
		uniqueID,
		backgroundColor,
		backgroundHoverColor,
		minHeight,
		tabletMinHeight,
		mobileMinHeight,
		minHeightType,
		row,
	} = attributes;

	const columns = context['kadence/table/columns'];
	const isFirstRowHeader = context['kadence/table/isFirstRowHeader'];

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { insertBlock } = useDispatch('core/block-editor');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData, index, parentClientId } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				parentClientId: select('core/block-editor').getBlockParentsByBlockName(clientId, 'kadence/table')[0],
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				index: select('core/block-editor').getBlockIndex(clientId),
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
		if (index !== row) {
			setAttributes({ row: index });
		}
	}, [index]);

	const addRow = useCallback(
		(position) => {
			const insertIndex = {
				before: index,
				after: index + 1,
				top: 0,
				bottom: undefined,
			}[position];

			if (insertIndex !== undefined) {
				const newRow = createBlock('kadence/table-row', {});
				insertBlock(newRow, insertIndex, parentClientId, false);
			}
		},
		[index, parentClientId, insertBlock]
	);

	const rowControls = useMemo(() => createRowControls(addRow), [addRow]);

	const [activeTab, setActiveTab] = useState('style');
	const { getBlocks } = useSelect((select) => select('core/block-editor'));
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const thisRowIsHeader = useMemo(
		() => ({
			'kadence/table/thisRowIsHeader': index === 0 && isFirstRowHeader,
		}),
		[index, isFirstRowHeader]
	);

	const nonTransAttrs = [];

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
			const newBlocks = [
				...innerBlocks,
				...Array(Math.max(1, columns - innerBlocks.length))
					.fill(null)
					.map(() => createBlock('kadence/table-data', {})),
			];
			replaceInnerBlocks(clientId, newBlocks, false);
		} else if (innerBlocks.length > columns) {
			// Remove excess blocks
			const updatedBlocks = innerBlocks.slice(0, columns);
			replaceInnerBlocks(clientId, updatedBlocks, false);
		}
	}, [columns]);

	const classNames = useMemo(
		() =>
			classnames({
				'kb-table-row': true,
				[`kb-table-row${uniqueID}`]: uniqueID,
			}),
		[uniqueID]
	);

	const blockProps = useBlockProps({
		className: classNames,
	});

	const { children } = useInnerBlocksProps(innerBlockProps, innerBlockPropOptions);

	return (
		<tr {...blockProps}>
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
					allowedTabs={['general']}
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
								max={minHeightType === 'px' ? 600 : 100}
								step={1}
								unit={minHeightType}
								onUnit={(value) => {
									setAttributes({ minHeightType: value });
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
			</KadenceInspectorControls>
			<BlockContextProvider value={thisRowIsHeader}>{children}</BlockContextProvider>
			<BackendStyles attributes={attributes} previewDevice={previewDevice} />
		</tr>
	);
}

export default Edit;
