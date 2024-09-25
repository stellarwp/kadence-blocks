import metadata from './block.json';
import React, { useEffect, useState, useMemo, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreDataStore } from '@wordpress/core-data';
import {
	InspectorControlTabs,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	CopyPasteAttributes,
	KadencePanelBody,
	KadenceRadioButtons,
	ResponsiveRangeControls,
	ResponsiveMeasureRangeControl,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
} from '@kadence/components';
import { setBlockDefaults, getUniqueId, getPostOrFseId } from '@kadence/helpers';
import {
	useBlockProps,
	BlockControls,
	useInnerBlocksProps,
	BlockContextProvider,
	BlockAlignmentControl,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import classnames from 'classnames';
import { ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import './editor.scss';
import Icons from './icons.js';
import BackendStyles from './backend-styles';
export function Edit(props) {
	const { attributes, setAttributes, className, clientId } = props;
	const {
		uniqueID,
		showSiteTitle,
		showSiteTagline,
		layout,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth,
		containerMaxWidthType,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderStyles,
		tabletBorderStyles,
		mobileBorderStyles,
		linkToHomepage,
		link,
		align,
		textVerticalAlign,
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { replaceInnerBlocks } = useDispatch('core/block-editor');
	const { isUniqueID, isUniqueBlock, parentData, previewDevice, innerBlocks } = useSelect(
		(select) => ({
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
			innerBlocks: select('core/block-editor').getBlocks(clientId),
		}),
		[clientId]
	);

	const [activeTab, setActiveTab] = useState('general');

	const siteData = useSelect((select) => {
		return select(coreDataStore).getEntityRecord('root', 'site');
	}, []);

	const newTaglineBlock = createBlock('kadence/advancedheading', {
		metadata: { name: __('Site Tagline', 'kadence-blocks'), for: 'tagline' },
		className: 'kb-logo-tagline',
		fontSize: ['sm', '', ''],
		content: siteData?.description ? siteData.description : '',
	});

	const newTitleBlock = createBlock('kadence/advancedheading', {
		metadata: { name: __('Site Title', 'kadence-blocks'), for: 'title' },
		className: 'kb-logo-title',
		fontSize: ['lg', '', ''],
		content: siteData?.title ? siteData.title : '',
	});

	const siteUrl = siteData?.url ? siteData.url : '';

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
		if (['logo-right-stacked', 'logo-left-stacked'].includes(layout) && !showSiteTagline) {
			if (layout === 'logo-right-stacked') {
				setAttributes({ layout: 'logo-right' });
			} else {
				setAttributes({ layout: 'logo-left' });
			}
		}

		if (layout !== 'logo-only' && !showSiteTitle && !showSiteTagline) {
			setAttributes({ layout: 'logo-only' });
		} else if (layout === 'logo-only' && (showSiteTitle || showSiteTagline)) {
			setAttributes({ layout: showSiteTagline ? 'logo-left-stacked' : 'logo-left' });
		} else if (showSiteTagline && layout === 'logo-right') {
			setAttributes({ layout: 'logo-right-stacked' });
		} else if (showSiteTagline && layout === 'logo-left') {
			setAttributes({ layout: 'logo-left-stacked' });
		}

		updateInnerBlocks();
	}, [showSiteTitle, showSiteTagline, layout]);

	const iconSize = 125;
	const allItemsLayoutOptions = [
		{
			value: 'logo-left-stacked',
			label: __('Logo left, Title and Tagline stacked right', 'kadence-blocks'),
			icon: Icons.logoTitleTag,
			iconSize,
		},
		{
			value: 'logo-right-stacked',
			label: __('Logo right, Title and Tagline stacked left', 'kadence-blocks'),
			icon: Icons.titleTagLogo,
			iconSize,
		},
		{
			value: 'logo-top',
			label: __('Logo top, Title and Tagline below', 'kadence-blocks'),
			icon: Icons.topLogoTitleTag,
			iconSize,
		},
		{
			value: 'logo-bottom',
			label: __('Logo bottom, Title and Tagline above', 'kadence-blocks'),
			icon: Icons.topTitleTagLogo,
			iconSize,
		},
		{
			value: 'title-logo-tagline',
			label: __('Title top, Logo middle, Tagline bottom', 'kadence-blocks'),
			icon: Icons.topTitleLogoTag,
			iconSize,
		},
	];

	const logoAndTitleLayoutOptions = [
		{ value: 'logo-left', label: __('Logo left, Title right', 'kadence-blocks'), icon: Icons.logoTitle, iconSize },
		{ value: 'logo-right', label: __('Logo right, Title left', 'kadence-blocks'), icon: Icons.titleLogo, iconSize },
		{ value: 'logo-top', label: __('Logo top, Title below', 'kadence-blocks'), icon: Icons.topLogoTitle, iconSize },
		{
			value: 'logo-bottom',
			label: __('Logo bottom, Title above', 'kadence-blocks'),
			icon: Icons.topTitleLogo,
			iconSize,
		},
	];

	const updateInnerBlocks = () => {
		const findBlockByMetadata = (blocks, metadata) => {
			for (const block of blocks) {
				if (block.attributes.metadata?.for === metadata) return block;
				if (block.innerBlocks?.length > 0) {
					const foundBlock = findBlockByMetadata(block.innerBlocks, metadata);
					if (foundBlock) return foundBlock;
				}
			}
			return null;
		};

		const addBlock = (metadata, defaultBlock) => findBlockByMetadata(innerBlocks, metadata) || defaultBlock;

		const newInnerBlocks = [];
		const imageBlock =
			innerBlocks.find((block) => block.name === 'kadence/image') ||
			createBlock('kadence/image', { imgMaxWidth: 250, marginDesktop: ['', 'sm', '', ''] });
		newInnerBlocks.push(imageBlock);

		if (showSiteTitle || showSiteTagline) {
			let titleBlock, taglineBlock;

			if (showSiteTitle) titleBlock = addBlock('title', newTitleBlock);
			if (showSiteTagline) taglineBlock = addBlock('tagline', newTaglineBlock);

			const addBlocksInOrder = (...blocks) => blocks.forEach((block) => block && newInnerBlocks.push(block));

			if (['logo-right-stacked', 'logo-left-stacked'].includes(layout)) {
				const groupBlock = createBlock('core/group', {}, []);
				addBlocksInOrder(titleBlock, taglineBlock);
				groupBlock.innerBlocks.push(...newInnerBlocks.slice(1)); // Add title/tagline inside group
				newInnerBlocks.splice(1, newInnerBlocks.length, groupBlock); // Replace with group
			} else if (['logo-bottom'].includes(layout)) {
				addBlocksInOrder(taglineBlock, titleBlock);
			} else if (['title-logo-tagline'].includes(layout)) {
				newInnerBlocks.pop(); // Remove existing image block
				addBlocksInOrder(titleBlock, imageBlock, taglineBlock);
			} else {
				addBlocksInOrder(titleBlock, taglineBlock);
			}
		}

		replaceInnerBlocks(clientId, newInnerBlocks, false);
	};

	const layoutOptions = useMemo(() => {
		if (showSiteTitle && showSiteTagline) {
			return allItemsLayoutOptions;
		} else if (showSiteTitle) {
			return logoAndTitleLayoutOptions;
		}
		return [{ value: 'logo-only', label: __('Logo only', 'kadence-blocks'), icon: Icons.logo }];
	}, [showSiteTitle, showSiteTagline]);

	const blockProps = useBlockProps({
		className: classnames({
			className: true,
			[`align${align}`]: align,
			'kb-logo': true,
			[`kb-logo${uniqueID}`]: true,
		}),
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			templateLock: 'insert',
			renderAppender: false,
		}
	);

	return (
		<>
			<BlockControls group="block">
				<BlockAlignmentControl value={align} onChange={(value) => setAttributes({ align: value })} />
			</BlockControls>
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
					<>
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

							<KadenceRadioButtons
								value={layout}
								options={layoutOptions.slice(0, 2)}
								hideLabel={true}
								label={__('Layout', 'kadence-blocks')}
								onChange={(value) => {
									setAttributes({
										layout: value,
									});
								}}
							/>

							{layoutOptions.length > 2 && (
								<KadenceRadioButtons
									value={layout}
									options={layoutOptions.slice(2, 4)}
									hideLabel={true}
									onChange={(value) => {
										setAttributes({
											layout: value,
										});
									}}
								/>
							)}

							{layoutOptions.length > 4 && (
								<KadenceRadioButtons
									value={layout}
									options={layoutOptions.slice(4, 6)}
									hideLabel={true}
									onChange={(value) => {
										setAttributes({
											layout: value,
										});
									}}
								/>
							)}

							{(layout === 'logo-left' ||
								layout === 'logo-right' ||
								layout === 'logo-right-stacked' ||
								layout === 'logo-left-stacked') && (
								<SelectControl
									label={__('Text Vertical Alignment', 'kadence-blocks')}
									value={textVerticalAlign}
									options={[
										{ value: 'center', label: __('Center', 'kadence-blocks') },
										{ value: 'start', label: __('Top', 'kadence-blocks') },
										{ value: 'baseline', label: __('Bottom', 'kadence-blocks') },
									]}
									onChange={(value) => setAttributes({ textVerticalAlign: value })}
								/>
							)}
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Link Settings', 'kadence-blocks')}
							panelName={'logo-link'}
							initialOpen={true}
						>
							<ToggleControl
								label={__('Link to Homepage', 'kadence-blocks')}
								checked={linkToHomepage}
								onChange={(value) => setAttributes({ linkToHomepage: value, link: '' })}
							/>

							<TextControl
								label={__('Link URL', 'kadence-blocks')}
								value={link}
								placeholder={linkToHomepage ? siteUrl : ''}
								onChange={(value) =>
									setAttributes({
										link: value,
										linkToHomepage: value !== '' ? false : linkToHomepage,
									})
								}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'style' && (
					<KadencePanelBody panelName={'logo-style'} initialOpen={true}>
						<ResponsiveRangeControls
							label={__('Max Width', 'kadence-blocks')}
							value={containerMaxWidth}
							onChange={(value) => {
								setAttributes({ containerMaxWidth: value });
							}}
							tabletValue={tabletContainerMaxWidth ? tabletContainerMaxWidth : ''}
							onChangeTablet={(value) => setAttributes({ tabletContainerMaxWidth: value })}
							mobileValue={mobileContainerMaxWidth ? mobileContainerMaxWidth : ''}
							onChangeMobile={(value) => setAttributes({ mobileContainerMaxWidth: value })}
							min={100}
							max={1250}
							step={1}
							unit={'px'}
							units={['px']}
							showUnit={true}
							reset={() =>
								setAttributes({
									containerMaxWidth: '',
									tabletContainerMaxWidth: '',
									mobileContainerMaxWidth: '',
									containerMaxWidthType: 'px',
								})
							}
						/>

						<ResponsiveBorderControl
							label={__('Border', 'kadence-blocks')}
							value={borderStyles}
							tabletValue={tabletBorderStyles}
							mobileValue={mobileBorderStyles}
							onChange={(value) => setAttributes({ borderStyles: value })}
							onChangeTablet={(value) => setAttributes({ tabletBorderStyles: value })}
							onChangeMobile={(value) => setAttributes({ mobileBorderStyles: value })}
						/>
						<ResponsiveMeasurementControls
							label={__('Border Radius', 'kadence-blocks')}
							value={borderRadius}
							tabletValue={tabletBorderRadius}
							mobileValue={mobileBorderRadius}
							onChange={(value) => setAttributes({ borderRadius: value })}
							onChangeTablet={(value) => setAttributes({ tabletBorderRadius: value })}
							onChangeMobile={(value) => setAttributes({ mobileBorderRadius: value })}
							min={0}
							max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 100}
							step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
							unit={borderRadiusUnit}
							units={['px', 'em', 'rem', '%']}
							onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
							isBorderRadius={true}
							allowEmpty={true}
						/>
					</KadencePanelBody>
				)}
				{activeTab === 'advanced' && (
					<KadencePanelBody panelName={'logo-advanced'} initialOpen={true}>
						<ResponsiveMeasureRangeControl
							label={__('Padding', 'kadence-blocks')}
							value={padding}
							tabletValue={tabletPadding}
							mobileValue={mobilePadding}
							onChange={(value) => setAttributes({ padding: value })}
							onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
							onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
							min={0}
							max={paddingType === 'em' || paddingType === 'rem' ? 25 : paddingType === 'px' ? 400 : 100}
							step={paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1}
							unit={paddingType}
							units={['px', 'em', 'rem', '%']}
							onUnit={(value) => setAttributes({ paddingType: value })}
						/>

						<ResponsiveMeasureRangeControl
							label={__('Margin', 'kadence-blocks')}
							value={margin}
							tabletValue={tabletMargin}
							mobileValue={mobileMargin}
							onChange={(value) => setAttributes({ margin: value })}
							onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
							onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
							min={0}
							max={marginType === 'em' || marginType === 'rem' ? 25 : marginType === 'px' ? 400 : 100}
							step={marginType === 'em' || marginType === 'rem' ? 0.1 : 1}
							unit={marginType}
							units={['px', 'em', 'rem', '%']}
							onUnit={(value) => setAttributes({ marginType: value })}
						/>

						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={[]}
						/>
					</KadencePanelBody>
				)}
			</KadenceInspectorControls>
			<BackendStyles {...props} previewDevice={previewDevice} />
			<div {...blockProps}>
				<div className={'kb-logo-layout-container kb-logo-layout-' + layout}>
					<BlockContextProvider value={{ 'kadence/insideBlock': 'logo' }}>
						<Fragment {...innerBlocksProps} />
					</BlockContextProvider>
				</div>
			</div>
		</>
	);
}

export default Edit;
