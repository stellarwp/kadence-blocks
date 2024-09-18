import metadata from './block.json';
import React, { useEffect, useState, useMemo, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	InspectorControlTabs,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	CopyPasteAttributes,
	KadencePanelBody,
} from '@kadence/components';
import { setBlockDefaults, getUniqueId, getPostOrFseId } from '@kadence/helpers';
import { useBlockProps, BlockControls, useInnerBlocksProps, BlockContextProvider } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import classnames from 'classnames';
import { ToggleControl, SelectControl } from '@wordpress/components';
import './editor.scss';

const newTaglineBlock = createBlock('kadence/advancedheading', {
	metadata: { name: __('Site Tagline', 'kadence-blocks'), for: 'tagline' },
	className: 'kb-logo-tagline',
});

const newTitleBlock = createBlock('kadence/advancedheading', {
	metadata: { name: __('Site Title', 'kadence-blocks'), for: 'title' },
	className: 'kb-logo-title',
});

export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;
	const { uniqueID, showSiteTitle, showSiteTagline, layout } = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const { isUniqueID, isUniqueBlock, parentData, innerBlocks } = useSelect(
		(select) => ({
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
			innerBlocks: select('core/block-editor').getBlocks(clientId),
		}),
		[clientId]
	);

	const [activeTab, setActiveTab] = useState('general');

	useEffect(() => {
		setBlockDefaults('kadence/logo', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

	useEffect(() => {
		updateInnerBlocks();
	}, [showSiteTitle, showSiteTagline, layout]);

	const updateInnerBlocks = () => {
		const findBlockByMetadata = (blocks, metadata) => {
			for (const block of blocks) {
				if (block.attributes.metadata?.for === metadata) {
					return block;
				}
				if (block.innerBlocks && block.innerBlocks.length > 0) {
					const foundBlock = findBlockByMetadata(block.innerBlocks, metadata);
					if (foundBlock) {
						return foundBlock;
					}
				}
			}
			return null;
		};

		const newInnerBlocks = [];
		const imageBlock =
			innerBlocks.find((block) => block.name === 'kadence/image') || createBlock('kadence/image', {});
		newInnerBlocks.push(imageBlock);

		if (showSiteTitle || showSiteTagline) {
			if (['logo-right-stacked', 'logo-left-stacked'].includes(layout)) {
				const groupBlock = createBlock('core/group', {}, []);

				if (showSiteTitle) {
					const titleBlock = findBlockByMetadata(innerBlocks, 'title') || newTitleBlock;
					groupBlock.innerBlocks.push(titleBlock);
				}

				if (showSiteTagline) {
					const taglineBlock = findBlockByMetadata(innerBlocks, 'tagline') || newTaglineBlock;
					groupBlock.innerBlocks.push(taglineBlock);
				}

				newInnerBlocks.push(groupBlock);
			} else if (showSiteTitle && showSiteTagline && ['logo-bottom'].includes(layout)) {
				if (showSiteTagline) {
					const taglineBlock = findBlockByMetadata(innerBlocks, 'tagline') || newTaglineBlock;
					newInnerBlocks.push(taglineBlock);
				}

				if (showSiteTitle) {
					const titleBlock = findBlockByMetadata(innerBlocks, 'title') || newTitleBlock;
					newInnerBlocks.push(titleBlock);
				}
			} else if (['title-logo-tagline'].includes(layout)) {
				newInnerBlocks.pop(); // Remove existing image block so we can re-add in order

				if (showSiteTitle) {
					const titleBlock = findBlockByMetadata(innerBlocks, 'title') || newTitleBlock;
					newInnerBlocks.push(titleBlock);
				}

				newInnerBlocks.push(imageBlock);

				if (showSiteTagline) {
					const taglineBlock = findBlockByMetadata(innerBlocks, 'tagline') || newTaglineBlock;
					newInnerBlocks.push(taglineBlock);
				}
			} else {
				if (showSiteTitle) {
					const titleBlock = findBlockByMetadata(innerBlocks, 'title') || newTitleBlock;
					newInnerBlocks.push(titleBlock);
				}

				if (showSiteTagline) {
					const taglineBlock = findBlockByMetadata(innerBlocks, 'tagline') || newTaglineBlock;
					newInnerBlocks.push(taglineBlock);
				}
			}
		}

		replaceInnerBlocks(clientId, newInnerBlocks, false);
	};

	const layoutOptions = useMemo(() => {
		if (showSiteTitle && showSiteTagline) {
			return [
				{
					value: 'logo-left-stacked',
					label: __('Logo left, Title and Tagline stacked right', 'kadence-blocks'),
				},
				{
					value: 'logo-right-stacked',
					label: __('Logo right, Title and Tagline stacked left', 'kadence-blocks'),
				},
				{ value: 'logo-top', label: __('Logo top, Title and Tagline below', 'kadence-blocks') },
				{ value: 'logo-bottom', label: __('Logo bottom, Title and Tagline above', 'kadence-blocks') },
				{ value: 'title-logo-tagline', label: __('Title top, Logo middle, Tagline bottom', 'kadence-blocks') },
			];
		} else if (showSiteTitle) {
			return [
				{ value: 'logo-left', label: __('Logo left, Title right', 'kadence-blocks') },
				{ value: 'logo-right', label: __('Logo right, Title left', 'kadence-blocks') },
				{ value: 'logo-top', label: __('Logo top, Title below', 'kadence-blocks') },
				{ value: 'logo-bottom', label: __('Logo bottom, Title above', 'kadence-blocks') },
			];
		}
		return [{ value: 'logo-only', label: __('Logo only', 'kadence-blocks') }];
	}, [showSiteTitle, showSiteTagline]);

	const blockProps = useBlockProps({
		className: classnames(className, `kb-logo`, `kb-logo-${uniqueID}`, `kb-logo-layout-${layout}`),
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			templateLock: 'insert',
			renderAppender: false,
			// template: [
			// 	['kadence/image', {}],
			// 	['kadence/advancedheading', { metadata: { name: __('Site Title', 'kadence-blocks'), for: 'title' } }],
			// ],
		}
	);

	return (
		<>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/logo'}>
				<InspectorControlTabs panelName={'kadence-logo'} setActiveTab={setActiveTab} activeTab={activeTab} />
				{activeTab === 'general' && (
					<KadencePanelBody panelName={'logo-general'} initialOpen={true}>
						<ToggleControl
							label={__('Show Site Title', 'kadence-blocks')}
							checked={showSiteTitle}
							onChange={(value) =>
								setAttributes({
									showSiteTitle: value,
									showSiteTagline: false,
								})
							}
						/>
						{showSiteTitle && (
							<ToggleControl
								label={__('Show Site Tagline', 'kadence-blocks')}
								checked={showSiteTagline}
								onChange={(value) => setAttributes({ showSiteTagline: value })}
							/>
						)}
						<SelectControl
							label={__('Layout', 'kadence-blocks')}
							value={layout}
							options={layoutOptions}
							onChange={(value) => setAttributes({ layout: value })}
						/>
					</KadencePanelBody>
				)}
				{activeTab === 'style' && (
					<KadencePanelBody panelName={'logo-style'} initialOpen={true}>
						Style Options
					</KadencePanelBody>
				)}
				{activeTab === 'advanced' && (
					<KadencePanelBody panelName={'logo-advanced'} initialOpen={true}>
						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={[]}
						/>
					</KadencePanelBody>
				)}
			</KadenceInspectorControls>
			<div {...blockProps}>
				<BlockContextProvider value={{ 'kadence/insideBlock': 'logo' }}>
					<Fragment {...innerBlocksProps} />
				</BlockContextProvider>
			</div>
		</>
	);
}

export default Edit;
