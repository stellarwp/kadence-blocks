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
	TypographyControls,
	ImageSizeControl as KadenceImageSizeControl,
	KadenceImageControl,
} from '@kadence/components';
import { setBlockDefaults, getUniqueId, getPostOrFseId } from '@kadence/helpers';
import { useBlockProps, BlockControls, useInnerBlocksProps, BlockAlignmentControl } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import classnames from 'classnames';
import { ToggleControl, TextControl, SelectControl } from '@wordpress/components';
import './editor.scss';
import Icons from './icons.js';
import BackendStyles from './backend-styles';
export function Edit(props) {
	const { attributes, setAttributes, context, isSelected, clientId } = props;
	const {
		uniqueID,
		showSiteTitle,
		showSiteTagline,
		layout,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
		linkToHomepage,
		link,
		align,
		textVerticalAlign,
		titleTypography,
		taglineTypography,
		urlTransparent,
		idTransparent,
		urlSticky,
		idSticky,
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

	const newTaglineBlock = createBlock('core/site-tagline', {
		level: 0,
	});

	const newTitleBlock = createBlock('core/site-title', {
		level: 0,
		isLink: false,
	});

	const siteUrl = siteData?.url ? siteData.url : '';

	useEffect(() => {
		setBlockDefaults('kadence/identity', attributes);

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

	const findBlockByName = (blocks, name) => {
		for (const block of blocks) {
			if (block.name === name) return block;
			if (block.innerBlocks?.length > 0) {
				const foundBlock = findBlockByName(block.innerBlocks, name);
				if (foundBlock) return foundBlock;
			}
		}
		return null;
	};

	const saveTitleFont = (value) => {
		const newUpdate = titleTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			titleTypography: newUpdate,
		});
	};

	const saveTaglineFont = (value) => {
		const newUpdate = taglineTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			taglineTypography: newUpdate,
		});
	};

	function onUpdateSelectImageSticky(mediaUpdate) {
		setAttributes({
			urlSticky: mediaUpdate.url,
			idSticky: mediaUpdate.id ? mediaUpdate.id : undefined,
			sizeSlugSticky: undefined,
		});
	}
	function clearImageSticky() {
		setAttributes({
			urlSticky: undefined,
			idSticky: undefined,
			sizeSlugSticky: undefined,
		});
	}
	function changeImageStickySize(imgData) {
		setAttributes({
			urlSticky: imgData.value,
			sizeSlugSticky: imgData.slug,
		});
	}

	function onUpdateSelectImageTransparent(mediaUpdate) {
		setAttributes({
			urlTransparent: mediaUpdate.url,
			idTransparent: mediaUpdate.id ? mediaUpdate.id : undefined,
			sizeSlugTransparent: undefined,
		});
	}
	function clearImageTransparent() {
		setAttributes({
			urlTransparent: undefined,
			idTransparent: undefined,
			sizeSlugTransparent: undefined,
		});
	}
	function changeImageTransparentSize(imgData) {
		setAttributes({
			urlTransparent: imgData.value,
			sizeSlugTransparent: imgData.slug,
		});
	}

	const updateInnerBlocks = () => {
		const addBlock = (name, defaultBlock) => findBlockByName(innerBlocks, name) || defaultBlock;

		const newInnerBlocks = [];
		const imageBlock =
			innerBlocks.find((block) => block.name === 'core/site-logo') ||
			createBlock('core/site-logo', {
				isLink: false,
				width: 75,
				style: {
					spacing: {
						margin: {
							right: 'var:preset|spacing|40',
						},
					},
				},
			});
		newInnerBlocks.push(imageBlock);

		if (showSiteTitle || showSiteTagline) {
			let titleBlock, taglineBlock;

			if (showSiteTitle) titleBlock = addBlock('core/site-title', newTitleBlock);
			if (showSiteTagline) taglineBlock = addBlock('core/site-tagline', newTaglineBlock);

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
			'kb-identity': true,
			[`kb-identity${uniqueID}`]: true,
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
			<KadenceInspectorControls blockSlug={'kadence/identity'}>
				<InspectorControlTabs
					panelName={'kadence-identity'}
					setActiveTab={setActiveTab}
					activeTab={activeTab}
				/>
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
						{context?.['kadence/headerIsSticky'] == '1' && (
							<KadencePanelBody
								title={__('Sticky Image settings', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-image-sticky-settings'}
							>
								<KadenceImageControl
									label={__('Image', 'kadence-blocks')}
									hasImage={!!urlSticky}
									imageURL={urlSticky ? urlSticky : ''}
									imageID={idSticky}
									onRemoveImage={clearImageSticky}
									onSaveImage={onUpdateSelectImageSticky}
									disableMediaButtons={!!urlSticky}
									dynamicAttribute="urlSticky"
									isSelected={isSelected}
									attributes={attributes}
									setAttributes={setAttributes}
									name={'kadence/image'}
									clientId={clientId}
									context={context}
								/>
								{idSticky && (
									<KadenceImageSizeControl
										label={__('Image File Size', 'kadence-blocks')}
										id={idSticky}
										url={urlSticky}
										fullSelection={true}
										selectByValue={true}
										onChange={changeImageStickySize}
									/>
								)}
							</KadencePanelBody>
						)}
						{context?.['kadence/headerIsTransparent'] == '1' && (
							<KadencePanelBody
								title={__('Transparent Image settings', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-image-transparent-settings'}
							>
								<KadenceImageControl
									label={__('Image', 'kadence-blocks')}
									hasImage={!!urlTransparent}
									imageURL={urlTransparent ? urlTransparent : ''}
									imageID={idTransparent}
									onRemoveImage={clearImageTransparent}
									onSaveImage={onUpdateSelectImageTransparent}
									disableMediaButtons={!!urlTransparent}
									dynamicAttribute="urlTransparent"
									isSelected={isSelected}
									attributes={attributes}
									setAttributes={setAttributes}
									name={'kadence/image'}
									clientId={clientId}
									context={context}
								/>
								{idTransparent && (
									<KadenceImageSizeControl
										label={__('Image File Size', 'kadence-blocks')}
										id={idTransparent}
										url={urlTransparent}
										fullSelection={true}
										selectByValue={true}
										onChange={changeImageTransparentSize}
									/>
								)}
							</KadencePanelBody>
						)}
					</>
				)}
				{activeTab === 'style' && (
					<>
						{showSiteTitle && (
							<KadencePanelBody
								title={__('Title Typography', 'kadence-blocks')}
								panelName={'title-typography'}
								initialOpen={true}
							>
								<TypographyControls
									fontFamily={titleTypography[0].family}
									onFontFamily={(value) => saveTitleFont({ family: value })}
									onFontChange={(select) => {
										saveTitleFont({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveTitleFont(values)}
									googleFont={titleTypography[0].google}
									onGoogleFont={(value) => saveTitleFont({ google: value })}
									loadGoogleFont={titleTypography[0].loadGoogle}
									onLoadGoogleFont={(value) => saveTitleFont({ loadGoogle: value })}
									fontVariant={titleTypography[0].variant}
									onFontVariant={(value) => saveTitleFont({ variant: value })}
									fontWeight={titleTypography[0].weight}
									onFontWeight={(value) => saveTitleFont({ weight: value })}
									fontStyle={titleTypography[0].style}
									onFontStyle={(value) => saveTitleFont({ style: value })}
									fontSubset={titleTypography[0].subset}
									onFontSubset={(value) => saveTitleFont({ subset: value })}
								/>
							</KadencePanelBody>
						)}

						{showSiteTagline && (
							<KadencePanelBody
								title={__('Tagline Typography', 'kadence-blocks')}
								panelName={'tagline-typography'}
								initialOpen={false}
							>
								<TypographyControls
									fontFamily={taglineTypography[0].family}
									onFontFamily={(value) => saveTaglineFont({ family: value })}
									onFontChange={(select) => {
										saveTaglineFont({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveTaglineFont(values)}
									googleFont={taglineTypography[0].google}
									onGoogleFont={(value) => saveTaglineFont({ google: value })}
									loadGoogleFont={taglineTypography[0].loadGoogle}
									onLoadGoogleFont={(value) => saveTaglineFont({ loadGoogle: value })}
									fontVariant={taglineTypography[0].variant}
									onFontVariant={(value) => saveTaglineFont({ variant: value })}
									fontWeight={taglineTypography[0].weight}
									onFontWeight={(value) => saveTaglineFont({ weight: value })}
									fontStyle={taglineTypography[0].style}
									onFontStyle={(value) => saveTaglineFont({ style: value })}
									fontSubset={taglineTypography[0].subset}
									onFontSubset={(value) => saveTaglineFont({ subset: value })}
								/>
							</KadencePanelBody>
						)}
					</>
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
				<div className={'kb-identity-layout-container kb-identity-layout-' + layout}>
					<Fragment {...innerBlocksProps} />
				</div>
			</div>
		</>
	);
}

export default Edit;
