import { __ } from '@wordpress/i18n';
import React, { useState, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	useBlockProps,
	BlockControls,
	BlockContextProvider,
	useInnerBlocksProps,
	InnerBlocks,
} from '@wordpress/block-editor';
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

export function Edit(props) {
	const { attributes, setAttributes, className, clientId, context } = props;

	const {
		uniqueID,
		backgroundColor,
		backgroundHoverColor,
		minHeight,
		tabletMinHeight,
		mobileMinHeight,
		minHeightUnit,
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
				parentClientId: select('core/block-editor').getBlockParents(clientId)[0],
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
		insertBlock(newRow, insertIndex, parentClientId, false);
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

	const [activeTab, setActiveTab] = useState('style');
	const { getBlocks } = useSelect((select) => select('core/block-editor'));
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const thisRowIsHeader = useMemo(() => {
		return index === 0 && isFirstRowHeader
			? { 'kadence/table/thisRowIsHeader': true }
			: { 'kadence/table/thisRowIsHeader': false };
	}, [index, isFirstRowHeader]);

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

	const blockProps = useBlockProps({
		className: classnames(
			{
				'kb-table-row': true,
				[`kb-table-row${uniqueID}`]: uniqueID,
			},
			className
		),
	});

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: '',
		},
		{
			allowedBlocks: ['kadence/table-data'],
			renderAppender: false,
			templateInsertUpdatesSelection: true,
		}
	);

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
			<BlockContextProvider value={thisRowIsHeader}>{children}</BlockContextProvider>
			<BackendStyles attributes={attributes} previewDevice={previewDevice} />
		</tr>
	);
}

export default Edit;
