/**
 * External dependencies
 */
import { get, filter, map, pick, includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { isBlobURL } from '@wordpress/blob';
import {
	ExternalLink,
	ResizableBox,
	SelectControl,
	Spinner,
	TextareaControl,
	RangeControl,
	TextControl,
	ToolbarButton,
	ToggleControl,
	Button,
} from '@wordpress/components';
import { useViewportMatch, usePrevious } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	BlockControls,
	InspectorControls,
	MediaUpload,
	InspectorAdvancedControls,
	RichText,
	MediaReplaceFlow,
	store as blockEditorStore,
	BlockAlignmentControl,
	__experimentalImageEditor as ImageEditor,
} from '@wordpress/block-editor';
import { useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { __, sprintf, isRTL } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { crop, upload, caption as captionIcon, update } from '@wordpress/icons';
import { store as noticesStore } from '@wordpress/notices';
import { store as coreStore } from '@wordpress/core-data';
/**
 * Internal dependencies
 */
import { createUpgradedEmbedBlock } from './helpers';
import useClientWidth from './use-client-width';
//import ImageEditor, { ImageEditingProvider } from './image-editing';
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	getFontSizeOptionOutput,
	getSpacingOptionOutput,
	getBorderStyle,
} from '@kadence/helpers';
import { isExternalImage } from './edit';
import metadata from './block.json';
/**
 * Module constants
 */
import { MIN_SIZE, ALLOWED_MEDIA_TYPES } from './constants';
const BLEND_OPTIONS = [
	{ value: 'normal', label: __('Normal', 'kadence-blocks') },
	{ value: 'multiply', label: __('Multiply', 'kadence-blocks') },
	{ value: 'screen', label: __('Screen', 'kadence-blocks') },
	{ value: 'overlay', label: __('Overlay', 'kadence-blocks') },
	{ value: 'darken', label: __('Darken', 'kadence-blocks') },
	{ value: 'lighten', label: __('Lighten', 'kadence-blocks') },
	{ value: 'color-dodge', label: __('Color Dodge', 'kadence-blocks') },
	{ value: 'color-burn', label: __('Color Burn', 'kadence-blocks') },
	{ value: 'difference', label: __('Difference', 'kadence-blocks') },
	{ value: 'exclusion', label: __('Exclusion', 'kadence-blocks') },
	{ value: 'hue', label: __('Hue', 'kadence-blocks') },
	{ value: 'saturation', label: __('Saturation', 'kadence-blocks') },
	{ value: 'color', label: __('Color', 'kadence-blocks') },
	{ value: 'luminosity', label: __('Luminosity', 'kadence-blocks') },
];
import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	KadencePanelBody,
	URLInputControl,
	KadenceImageURLInputUI,
	BoxShadowControl,
	KadenceImageControl,
	ResponsiveRangeControls,
	DropShadowControl,
	ImageSizeControl as KadenceImageSizeControl,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	ResponsiveBorderControl,
	SmallResponsiveControl,
	CopyPasteAttributes,
	GradientControl,
	BackgroundTypeControl,
	KadenceFocalPicker,
	KadenceWebfontLoader,
} from '@kadence/components';

export default function Image({
	temporaryURL,
	dynamicURL,
	attributes,
	setAttributes,
	isSelected,
	insertBlocksAfter,
	onReplace,
	onSelectImage,
	onSelectURL,
	onUploadError,
	containerRef,
	context,
	clientId,
	previewDevice,
	marginMouseOver,
	paddingMouseOver,
}) {
	const {
		url = '',
		alt,
		caption,
		align,
		id,
		title,
		width,
		height,
		sizeSlug,
		useRatio,
		ratio,
		imgMaxWidth,
		imgMaxWidthTablet,
		imgMaxWidthMobile,
		uniqueID,
		marginDesktop,
		marginTablet,
		marginMobile,
		marginUnit,
		paddingDesktop,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		backgroundColor,
		borderColor,
		borderRadius,
		borderWidthUnit,
		borderRadiusUnit,
		borderWidthDesktop,
		borderWidthTablet,
		borderWidthMobile,
		displayBoxShadow,
		boxShadow,
		displayDropShadow,
		dropShadow,
		imageFilter,
		showCaption,
		captionStyles,
		maskSvg,
		maskSize,
		maskPosition,
		maskRepeat,
		maskUrl,
		link,
		linkTarget,
		linkNoFollow,
		linkSponsored,
		linkDestination,
		linkTitle,
		zIndex,
		tabletBorderRadius,
		mobileBorderRadius,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		preventLazyLoad,
		overlayType,
		overlay,
		overlayGradient,
		overlayOpacity,
		overlayBlendMode,
		globalAlt,
		imagePosition,
		tooltip,
		tooltipPlacement,
		tooltipDash,
	} = attributes;

	const previewURL = dynamicURL ? dynamicURL : url;
	const [updateImageStore, setImageStore] = useState(false);
	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[0] : '',
		undefined !== marginTablet ? marginTablet[0] : '',
		undefined !== marginMobile ? marginMobile[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[1] : '',
		undefined !== marginTablet ? marginTablet[1] : '',
		undefined !== marginMobile ? marginMobile[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[2] : '',
		undefined !== marginTablet ? marginTablet[2] : '',
		undefined !== marginMobile ? marginMobile[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[3] : '',
		undefined !== marginTablet ? marginTablet[3] : '',
		undefined !== marginMobile ? marginMobile[3] : ''
	);

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[0] : '',
		undefined !== paddingTablet ? paddingTablet[0] : '',
		undefined !== paddingMobile ? paddingMobile[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[1] : '',
		undefined !== paddingTablet ? paddingTablet[1] : '',
		undefined !== paddingMobile ? paddingMobile[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[2] : '',
		undefined !== paddingTablet ? paddingTablet[2] : '',
		undefined !== paddingMobile ? paddingMobile[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[3] : '',
		undefined !== paddingTablet ? paddingTablet[3] : '',
		undefined !== paddingMobile ? paddingMobile[3] : ''
	);

	// Border.
	const previewBorderTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[0] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[0] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[0] : ''
	);
	const previewRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[1] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[1] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[1] : ''
	);
	const previewRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[2] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[2] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[2] : ''
	);
	const previewRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[3] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[3] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[3] : ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== imgMaxWidth ? imgMaxWidth : '',
		undefined !== imgMaxWidthTablet ? imgMaxWidthTablet : '',
		undefined !== imgMaxWidthMobile ? imgMaxWidthMobile : ''
	);

	const previewCaptionFontSizeUnit = captionStyles[0].sizeType !== undefined ? captionStyles[0].sizeType : 'px';
	const previewCaptionFontSize = getPreviewSize(
		previewDevice,
		undefined !== captionStyles[0].size[0] ? captionStyles[0].size[0] : 'inherit',
		undefined !== captionStyles[0].size[1] ? captionStyles[0].size[1] : 'inherit',
		undefined !== captionStyles[0].size[2] ? captionStyles[0].size[2] : 'inherit'
	);

	const previewCaptionLineHeightUnit = captionStyles[0].lineType !== undefined ? captionStyles[0].lineType : 'px';
	const previewCaptionLineHeight = getPreviewSize(
		previewDevice,
		undefined !== captionStyles[0].lineHeight[0]
			? captionStyles[0].lineHeight[0] + previewCaptionLineHeightUnit
			: 'normal',
		undefined !== captionStyles[0].lineHeight[1]
			? captionStyles[0].lineHeight[1] + previewCaptionLineHeightUnit
			: 'normal',
		undefined !== captionStyles[0].lineHeight[2] + previewCaptionLineHeightUnit
			? captionStyles[0].lineHeight[2]
			: 'normal'
	);

	const prevCaption = usePrevious(caption);
	const [stateShowCaption, setStateShowCaption] = useState(!!caption);
	const { allowResize = true } = context;
	function saveDropShadow(value) {
		const newItems = dropShadow.map((item, thisIndex) => {
			if (0 === thisIndex) {
				item = { ...item, ...value };
			}
			return item;
		});

		setAttributes({
			dropShadow: newItems,
		});
	}
	function saveBoxShadow(value) {
		const newItems = boxShadow.map((item, thisIndex) => {
			if (0 === thisIndex) {
				item = { ...item, ...value };
			}
			return item;
		});

		setAttributes({
			boxShadow: newItems,
		});
	}
	const saveCaptionFont = (value) => {
		const newUpdate = captionStyles.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			captionStyles: newUpdate,
		});
	};
	const { image } = useSelect(
		(select) => {
			const { getMedia } = select(coreStore);
			return {
				image: id && isSelected ? getMedia(id, { context: 'view' }) : null,
			};
		},
		[id, isSelected]
	);
	const { replaceBlocks, toggleSelection } = useDispatch(blockEditorStore);
	const { createErrorNotice, createSuccessNotice } = useDispatch(noticesStore);

	const isLargeViewport = useViewportMatch('medium');
	const isWideAligned = includes(['wide', 'full'], align);
	const [{ naturalWidth, naturalHeight }, setNaturalSize] = useState({});
	const [isEditingImage, setIsEditingImage] = useState(false);
	const [activeTab, setActiveTab] = useState('general');
	const [externalBlob, setExternalBlob] = useState();
	const clientWidth = useClientWidth(containerRef, [align]);
	const isSVG = previewURL && previewURL.endsWith('.svg') ? true : false;
	const isResizable = allowResize && !(isWideAligned && isLargeViewport) && !(isSVG && !previewMaxWidth);
	const showMaxWidth = allowResize && !isWideAligned;
	const { imageEditing, imageSizes, maxWidth, mediaUpload } = useSelect(
		(select) => {
			const { getSettings } = select(blockEditorStore);

			const settings = pick(getSettings(), ['imageEditing', 'imageSizes', 'maxWidth', 'mediaUpload']);

			return {
				...settings,
			};
		},
		[clientId]
	);
	// const imageSizeOptions = map(
	// 	filter( imageSizes, ( { slug } ) =>
	// 		get( image, [ 'media_details', 'sizes', slug, 'source_url' ] )
	// 	),
	// 	( { name, slug } ) => ( { value: slug, label: name } )
	// );
	// If an image is externally hosted, try to fetch the image data. This may
	// fail if the image host doesn't allow CORS with the domain. If it works,
	// we can enable a button in the toolbar to upload the image.
	useEffect(() => {
		if (!isExternalImage(id, url) || !isSelected || externalBlob) {
			return;
		}

		window
			.fetch(url)
			.then((response) => response.blob())
			.then((blob) => setExternalBlob(blob))
			// Do nothing, cannot upload.
			.catch(() => {});
	}, [id, url, isSelected, externalBlob]);

	// We need to show the caption when changes come from
	// history navigation(undo/redo).
	useEffect(() => {
		if (caption && !prevCaption) {
			setStateShowCaption(true);
		}
	}, [caption, prevCaption]);

	// Focus the caption when we click to add one.
	const captionRef = useCallback(
		(node) => {
			if (node && !caption) {
				node.focus();
			}
		},
		[caption]
	);

	function onResizeStart() {
		toggleSelection(false);
	}

	function onResizeStop() {
		toggleSelection(true);
	}

	function onImageError() {
		// Check if there's an embed block that handles this URL.
		const embedBlock = createUpgradedEmbedBlock({ attributes: { url } });
		if (undefined !== embedBlock) {
			onReplace(embedBlock);
		}
	}

	function onSetLink(props) {
		setAttributes(props);
	}

	function onSetTitle(value) {
		// This is the HTML title attribute, separate from the media object
		// title.
		setAttributes({ title: value });
	}

	function updateAlt(newAlt) {
		setAttributes({ alt: newAlt });
	}

	function onUpdateSelectImage(mediaUpdate) {
		setAttributes({
			url: mediaUpdate.url,
			id: mediaUpdate.id ? mediaUpdate.id : undefined,
			alt: mediaUpdate?.alt ? mediaUpdate.alt : undefined,
			width: undefined,
			height: undefined,
			sizeSlug: undefined,
		});
		if (mediaUpdate?.alt && image?.alt_text) {
			image.alt_text = mediaUpdate.alt;
		}
	}
	function clearImage() {
		setAttributes({
			url: undefined,
			id: undefined,
			width: undefined,
			height: undefined,
			sizeSlug: undefined,
		});
	}
	function changeImageSize(imgData) {
		setAttributes({
			url: imgData.value,
			width: undefined,
			height: undefined,
			sizeSlug: imgData.slug,
			imgMaxWidth: undefined,
			imgMaxWidthTablet: undefined,
			imgMaxWidthMobile: undefined,
		});
	}
	function uploadExternal() {
		mediaUpload({
			filesList: [externalBlob],
			onFileChange([img]) {
				onSelectImage(img);

				if (isBlobURL(img.url)) {
					return;
				}

				setExternalBlob();
				createSuccessNotice(__('Image uploaded.', 'kadence-blocks'), {
					type: 'snackbar',
				});
			},
			allowedTypes: ALLOWED_MEDIA_TYPES,
			onError(message) {
				createErrorNotice(message, { type: 'snackbar' });
			},
		});
	}

	function updateAlignment(nextAlign) {
		const extraUpdatedAttributes = ['wide', 'full'].includes(nextAlign)
			? { width: undefined, height: undefined }
			: {};
		setAttributes({
			...extraUpdatedAttributes,
			align: nextAlign,
		});
	}

	useEffect(() => {
		if (!isSelected) {
			setIsEditingImage(false);
			if (!caption) {
				setStateShowCaption(false);
			}
		}
	}, [isSelected, caption]);
	const isDynamic =
		attributes.kadenceDynamic && attributes.kadenceDynamic.url && attributes.kadenceDynamic.url.enable
			? true
			: false;
	const isDynamicLink =
		attributes.kadenceDynamic && attributes.kadenceDynamic.link && attributes.kadenceDynamic.link.enable
			? true
			: false;
	const canEditImage = id && naturalWidth && naturalHeight && imageEditing && !isDynamic && !isSVG;
	const allowCrop = canEditImage && !isEditingImage;
	const nonTransAttrs = ['url', 'id', 'caption', 'alt'];
	const previewOverlay = overlayType === 'gradient' ? overlayGradient : KadenceColorOutput(overlay);

	const controls = (
		<>
			<BlockControls group="block">
				<BlockAlignmentControl value={align} onChange={updateAlignment} />
				{showCaption && (
					<ToolbarButton
						onClick={() => {
							setStateShowCaption(!stateShowCaption);
							if (stateShowCaption && caption) {
								setAttributes({ caption: undefined });
							}
						}}
						icon={captionIcon}
						isPressed={stateShowCaption}
						label={stateShowCaption ? __('Remove caption', 'kadence-blocks') : __('Add caption', 'kadence-blocks')}
					/>
				)}
				{!isEditingImage && !isDynamic && !isDynamicLink && (
					<KadenceImageURLInputUI
						url={link || ''}
						onChangeUrl={(value) => setAttributes({ link: value })}
						linkDestination={linkDestination}
						mediaUrl={(image && image.source_url) || url}
						mediaLink={image && image.link}
						onChangeLinkDestination={(value) => setAttributes({ linkDestination: value })}
						onChangeAttribute={(value) => setAttributes(value)}
						additionalControls={true}
						opensInNewTab={undefined !== linkTarget ? linkTarget : false}
						onChangeTarget={(value) => setAttributes({ linkTarget: value })}
						linkNoFollow={undefined !== linkNoFollow ? linkNoFollow : false}
						onChangeFollow={(value) => setAttributes({ linkNoFollow: value })}
						linkSponsored={undefined !== linkSponsored ? linkSponsored : false}
						onChangeSponsored={(value) => setAttributes({ linkSponsored: value })}
						allowClear={true}
						dynamicAttribute={'link'}
						isSelected={isSelected}
						attributes={attributes}
						setAttributes={setAttributes}
						name={'kadence/image'}
						clientId={clientId}
						context={context}
					/>
				)}
				{allowCrop && <ToolbarButton onClick={() => setIsEditingImage(true)} icon={crop} label={__('Crop', 'kadence-blocks')} />}
				{externalBlob && !isDynamic && (
					<ToolbarButton
						onClick={uploadExternal}
						icon={upload}
						label={__('Upload external image', 'kadence-blocks')}
					/>
				)}
			</BlockControls>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			{!isEditingImage && !isDynamic && (
				<BlockControls group="other">
					<MediaReplaceFlow
						mediaId={id}
						mediaURL={url}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						accept="image/*"
						onSelect={onSelectImage}
						onSelectURL={onSelectURL}
						onError={onUploadError}
					/>
				</BlockControls>
			)}
			<InspectorControls>
				<InspectorControlTabs panelName={'image'} setActiveTab={setActiveTab} activeTab={activeTab} />

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Image settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-image-settings'}
						>
							<KadenceImageControl
								label={__('Image', 'kadence-blocks')}
								hasImage={url ? true : false}
								imageURL={url ? url : ''}
								imageID={id}
								onRemoveImage={clearImage}
								onSaveImage={onUpdateSelectImage}
								disableMediaButtons={url ? true : false}
								dynamicAttribute="url"
								isSelected={isSelected}
								attributes={attributes}
								setAttributes={setAttributes}
								name={'kadence/image'}
								clientId={clientId}
								context={context}
							/>
							{id && (
								<KadenceImageSizeControl
									label={__('Image File Size', 'kadence-blocks')}
									id={id}
									url={url}
									fullSelection={true}
									selectByValue={true}
									onChange={changeImageSize}
								/>
							)}
							<ToggleControl
								label={__('Use fixed ratio instead of image ratio', 'kadence-blocks')}
								checked={useRatio}
								onChange={(value) => setAttributes({ useRatio: value })}
							/>
							{useRatio && (
								<>
									<SelectControl
										label={__('Size Ratio', 'kadence-blocks')}
										value={ratio}
										options={[
											{
												label: __('Landscape 4:3', 'kadence-blocks'),
												value: 'land43',
											},
											{
												label: __('Landscape 3:2', 'kadence-blocks'),
												value: 'land32',
											},
											{
												label: __('Landscape 16:9', 'kadence-blocks'),
												value: 'land169',
											},
											{
												label: __('Landscape 2:1', 'kadence-blocks'),
												value: 'land21',
											},
											{
												label: __('Landscape 3:1', 'kadence-blocks'),
												value: 'land31',
											},
											{
												label: __('Landscape 4:1', 'kadence-blocks'),
												value: 'land41',
											},
											{
												label: __('Portrait 3:4', 'kadence-blocks'),
												value: 'port34',
											},
											{
												label: __('Portrait 2:3', 'kadence-blocks'),
												value: 'port23',
											},
											{
												label: __('Square 1:1', 'kadence-blocks'),
												value: 'square',
											},
										]}
										onChange={(value) => setAttributes({ ratio: value })}
									/>

									<KadenceFocalPicker
										url={url ? url : ''}
										value={imagePosition ? imagePosition : 'center center'}
										onChange={(value) => setAttributes({ imagePosition: value })}
									/>
								</>
							)}
							{showMaxWidth && (
								<ResponsiveRangeControls
									label={__('Max Image Width', 'kadence-blocks')}
									value={imgMaxWidth ? imgMaxWidth : ''}
									onChange={(value) => setAttributes({ imgMaxWidth: value })}
									tabletValue={imgMaxWidthTablet ? imgMaxWidthTablet : ''}
									onChangeTablet={(value) => setAttributes({ imgMaxWidthTablet: value })}
									mobileValue={imgMaxWidthMobile ? imgMaxWidthMobile : ''}
									onChangeMobile={(value) => setAttributes({ imgMaxWidthMobile: value })}
									min={5}
									max={3000}
									step={1}
									unit={'px'}
									showUnit={true}
									units={['px']}
									reset={() =>
										setAttributes({
											imgMaxWidth: '',
											imgMaxWidthTablet: '',
											imgMaxWidthMobile: '',
										})
									}
								/>
							)}
							{(!globalAlt || !image) && (
								<TextareaControl
									label={__('Alt text (alternative text)', 'kadence-blocks')}
									value={alt}
									onChange={updateAlt}
									help={
										<>
											<ExternalLink href="https://www.w3.org/WAI/tutorials/images/decision-tree">
												{__('Describe the purpose of the image', 'kadence-blocks')}
											</ExternalLink>
											{__('Leave empty if the image is purely decorative.', 'kadence-blocks')}
										</>
									}
								/>
							)}
							{globalAlt && image && (
								<div className="components-base-control">
									<TextareaControl
										label={__('Alt text (alternative text)', 'kadence-blocks')}
										value={image?.alt_text ? image.alt_text : ''}
										onChange={(value) => console.log(value)}
										disabled={true}
										className={'mb-0'}
									/>
									<MediaUpload
										onSelect={onUpdateSelectImage}
										type="image"
										value={id ? id : ''}
										render={({ open }) => (
											<Button
												text={__('Edit Image Alt Text', 'kadence-blocks')}
												variant={'link'}
												onClick={open}
											/>
										)}
									/>
								</div>
							)}
							<ToggleControl
								label={__('Dynamic Alt Text', 'kadence-blocks')}
								help={__(
									'This makes it so alt text changed in the media library automatically updates on your website without needing to update this block.',
									'kadence-blocks'
								)}
								checked={globalAlt}
								onChange={(value) => setAttributes({ globalAlt: value })}
							/>
							<TextControl
								label={__('Title attribute', 'kadence-blocks')}
								value={title || ''}
								onChange={onSetTitle}
								help={
									<>
										{__('Describe the role of this image on the page.', 'kadence-blocks')}
										<ExternalLink href="https://www.w3.org/TR/html52/dom.html#the-title-attribute">
											{__(
												'(Note: many devices and browsers do not display this text.)',
												'kadence-blocks'
											)}
										</ExternalLink>
									</>
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Link Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-image-link-settings'}
						>
							<URLInputControl
								label={__('Image Link', 'kadence-blocks')}
								url={link}
								onChangeUrl={(value) => setAttributes({ link: value })}
								additionalControls={true}
								opensInNewTab={undefined !== linkTarget ? linkTarget : false}
								onChangeTarget={(value) => setAttributes({ linkTarget: value })}
								linkNoFollow={undefined !== linkNoFollow ? linkNoFollow : false}
								onChangeFollow={(value) => setAttributes({ linkNoFollow: value })}
								linkSponsored={undefined !== linkSponsored ? linkSponsored : false}
								onChangeSponsored={(value) => setAttributes({ linkSponsored: value })}
								allowClear={true}
								linkTitle={linkTitle}
								onChangeTitle={(value) => {
									setAttributes({ linkTitle: value });
								}}
								dynamicAttribute={'link'}
								isSelected={isSelected}
								attributes={attributes}
								setAttributes={setAttributes}
								name={'kadence/image'}
								clientId={clientId}
								context={context}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'style' && (
					<>
						<KadencePanelBody panelName={'kb-image-border-settings'}>
							<PopColorControl
								label={__('Background Color', 'kadence-blocks')}
								value={backgroundColor ? backgroundColor : ''}
								default={''}
								onChange={(value) => {
									setAttributes({ backgroundColor: value });
								}}
							/>
							<ResponsiveBorderControl
								label={__('Border', 'kadence-blocks')}
								value={borderStyle}
								tabletValue={tabletBorderStyle}
								mobileValue={mobileBorderStyle}
								onChange={(value) => setAttributes({ borderStyle: value })}
								onChangeTablet={(value) => setAttributes({ tabletBorderStyle: value })}
								onChangeMobile={(value) => setAttributes({ mobileBorderStyle: value })}
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
								max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 200}
								step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
								unit={borderRadiusUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
								isBorderRadius={true}
								allowEmpty={true}
							/>
							<BoxShadowControl
								label={__('Box Shadow', 'kadence-blocks')}
								enable={undefined !== displayBoxShadow ? displayBoxShadow : false}
								color={
									undefined !== boxShadow &&
									undefined !== boxShadow[0] &&
									undefined !== boxShadow[0].color
										? boxShadow[0].color
										: '#000000'
								}
								colorDefault={'#000000'}
								onArrayChange={(color, opacity) => saveBoxShadow({ color, opacity })}
								opacity={
									undefined !== boxShadow &&
									undefined !== boxShadow[0] &&
									undefined !== boxShadow[0].opacity
										? boxShadow[0].opacity
										: 0.2
								}
								hOffset={
									undefined !== boxShadow &&
									undefined !== boxShadow[0] &&
									undefined !== boxShadow[0].hOffset
										? boxShadow[0].hOffset
										: 0
								}
								vOffset={
									undefined !== boxShadow &&
									undefined !== boxShadow[0] &&
									undefined !== boxShadow[0].vOffset
										? boxShadow[0].vOffset
										: 0
								}
								blur={
									undefined !== boxShadow &&
									undefined !== boxShadow[0] &&
									undefined !== boxShadow[0].blur
										? boxShadow[0].blur
										: 14
								}
								spread={
									undefined !== boxShadow &&
									undefined !== boxShadow[0] &&
									undefined !== boxShadow[0].spread
										? boxShadow[0].spread
										: 0
								}
								inset={
									undefined !== boxShadow &&
									undefined !== boxShadow[0] &&
									undefined !== boxShadow[0].inset
										? boxShadow[0].inset
										: false
								}
								onEnableChange={(value) => {
									setAttributes({
										displayBoxShadow: value,
									});
								}}
								onColorChange={(value) => {
									saveBoxShadow({ color: value });
								}}
								onOpacityChange={(value) => {
									saveBoxShadow({ opacity: value });
								}}
								onHOffsetChange={(value) => {
									saveBoxShadow({ hOffset: value });
								}}
								onVOffsetChange={(value) => {
									saveBoxShadow({ vOffset: value });
								}}
								onBlurChange={(value) => {
									saveBoxShadow({ blur: value });
								}}
								onSpreadChange={(value) => {
									saveBoxShadow({ spread: value });
								}}
								onInsetChange={(value) => {
									saveBoxShadow({ inset: value });
								}}
							/>
							<DropShadowControl
								label={__('Drop Shadow', 'kadence-blocks')}
								enable={undefined !== displayDropShadow ? displayDropShadow : false}
								color={
									undefined !== dropShadow &&
									undefined !== dropShadow[0] &&
									undefined !== dropShadow[0].color
										? dropShadow[0].color
										: '#000000'
								}
								colorDefault={'#000000'}
								onArrayChange={(color, opacity) => saveDropShadow({ color, opacity })}
								opacity={
									undefined !== dropShadow &&
									undefined !== dropShadow[0] &&
									undefined !== dropShadow[0].opacity
										? dropShadow[0].opacity
										: 0.2
								}
								hOffset={
									undefined !== dropShadow &&
									undefined !== dropShadow[0] &&
									undefined !== dropShadow[0].hOffset
										? dropShadow[0].hOffset
										: 0
								}
								vOffset={
									undefined !== dropShadow &&
									undefined !== dropShadow[0] &&
									undefined !== dropShadow[0].vOffset
										? dropShadow[0].vOffset
										: 0
								}
								blur={
									undefined !== dropShadow &&
									undefined !== dropShadow[0] &&
									undefined !== dropShadow[0].blur
										? dropShadow[0].blur
										: 14
								}
								onEnableChange={(value) => {
									setAttributes({
										displayDropShadow: value,
									});
								}}
								onColorChange={(value) => {
									saveDropShadow({ color: value });
								}}
								onOpacityChange={(value) => {
									saveDropShadow({ opacity: value });
								}}
								onHOffsetChange={(value) => {
									saveDropShadow({ hOffset: value });
								}}
								onVOffsetChange={(value) => {
									saveDropShadow({ vOffset: value });
								}}
								onBlurChange={(value) => {
									saveDropShadow({ blur: value });
								}}
							/>
							<p className="kb-sidebar-help">
								{__('Learn about the differences:', 'kadence-blocks')}
								<br></br>
								<ExternalLink href="https://css-tricks.com/breaking-css-box-shadow-vs-drop-shadow/">
									{__('Box Shadow vs. Drop Shadow', 'kadence-blocks')}
								</ExternalLink>
							</p>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Mask Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-image-mask-settings'}
						>
							<SelectControl
								label={__('Mask Shape', 'kadence-blocks')}
								options={[
									{
										label: __('None', 'kadence-blocks'),
										value: 'none',
									},
									{
										label: __('Circle', 'kadence-blocks'),
										value: 'circle',
									},
									{
										label: __('Diamond', 'kadence-blocks'),
										value: 'diamond',
									},
									{
										label: __('Hexagon', 'kadence-blocks'),
										value: 'hexagon',
									},
									{
										label: __('Rounded', 'kadence-blocks'),
										value: 'rounded',
									},
									{
										label: __('Blob 1', 'kadence-blocks'),
										value: 'blob1',
									},
									{
										label: __('Blob 2', 'kadence-blocks'),
										value: 'blob2',
									},
									{
										label: __('Blob 3', 'kadence-blocks'),
										value: 'blob3',
									},
									{
										label: __('Custom', 'kadence-blocks'),
										value: 'custom',
									},
								]}
								value={maskSvg}
								onChange={(value) => setAttributes({ maskSvg: value })}
							/>
							{maskSvg === 'custom' && (
								<>
									<KadenceImageControl
										label={__('Custom Mask Image', 'kadence-blocks')}
										hasImage={maskUrl ? true : false}
										imageURL={maskUrl ? maskUrl : ''}
										imageID={''}
										onRemoveImage={() => {
											setAttributes({
												maskUrl: undefined,
											});
										}}
										onSaveImage={(image) => {
											setAttributes({
												maskUrl: image.url,
											});
										}}
										disableMediaButtons={maskUrl ? true : false}
									/>
									<SelectControl
										label={__('Mask Size', 'kadence-blocks')}
										options={[
											{
												label: __('Auto', 'kadence-blocks'),
												value: 'auto',
											},
											{
												label: __('Contain', 'kadence-blocks'),
												value: 'contain',
											},
											{
												label: __('Cover', 'kadence-blocks'),
												value: 'cover',
											},
										]}
										value={maskSize}
										onChange={(value) => setAttributes({ maskSize: value })}
									/>
									<SelectControl
										label={__('Mask Position', 'kadence-blocks')}
										options={[
											{ value: 'center top', label: __('Center Top', 'kadence-blocks') },
											{ value: 'center center', label: __('Center Center', 'kadence-blocks') },
											{ value: 'center bottom', label: __('Center Bottom', 'kadence-blocks') },
											{ value: 'left top', label: __('Left Top', 'kadence-blocks') },
											{ value: 'left center', label: __('Left Center', 'kadence-blocks') },
											{ value: 'left bottom', label: __('Left Bottom', 'kadence-blocks') },
											{ value: 'right top', label: __('Right Top', 'kadence-blocks') },
											{ value: 'right center', label: __('Right Center', 'kadence-blocks') },
											{ value: 'right bottom', label: __('Right Bottom', 'kadence-blocks') },
										]}
										value={maskPosition}
										onChange={(value) => setAttributes({ maskPosition: value })}
									/>
									<SelectControl
										label={__('Mask Repeat', 'kadence-blocks')}
										options={[
											{ value: 'no-repeat', label: __('No Repeat', 'kadence-blocks') },
											{ value: 'repeat', label: __('Repeat', 'kadence-blocks') },
											{ value: 'repeat-x', label: __('Repeat-x', 'kadence-blocks') },
											{ value: 'repeat-y', label: __('Repeat-y', 'kadence-blocks') },
										]}
										value={maskRepeat}
										onChange={(value) => setAttributes({ maskRepeat: value })}
									/>
								</>
							)}
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Caption Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-image-caption-settings'}
						>
							<ToggleControl
								label={__('Enable Caption', 'kadence-blocks')}
								checked={showCaption}
								onChange={(value) => setAttributes({ showCaption: value })}
							/>
							{showCaption && (
								<>
									<PopColorControl
										label={__('Caption Color', 'kadence-blocks')}
										value={
											captionStyles && captionStyles[0] && captionStyles[0].color
												? captionStyles[0].color
												: ''
										}
										default={''}
										onChange={(value) => saveCaptionFont({ color: value })}
									/>
									<TypographyControls
										fontGroup={'body'}
										fontSize={captionStyles[0].size}
										onFontSize={(value) => saveCaptionFont({ size: value })}
										fontSizeType={captionStyles[0].sizeType}
										onFontSizeType={(value) => saveCaptionFont({ sizeType: value })}
										lineHeight={captionStyles[0].lineHeight}
										onLineHeight={(value) => saveCaptionFont({ lineHeight: value })}
										lineHeightType={captionStyles[0].lineType}
										onLineHeightType={(value) => saveCaptionFont({ lineType: value })}
										letterSpacing={captionStyles[0].letterSpacing}
										onLetterSpacing={(value) => saveCaptionFont({ letterSpacing: value })}
										textTransform={captionStyles[0].textTransform}
										onTextTransform={(value) => saveCaptionFont({ textTransform: value })}
										fontFamily={captionStyles[0].family}
										onFontFamily={(value) => saveCaptionFont({ family: value })}
										onFontChange={(select) => {
											saveCaptionFont({
												family: select.value,
												google: select.google,
											});
										}}
										onFontArrayChange={(values) => saveCaptionFont(values)}
										googleFont={captionStyles[0].google}
										onGoogleFont={(value) => saveCaptionFont({ google: value })}
										loadGoogleFont={captionStyles[0].loadGoogle}
										onLoadGoogleFont={(value) => saveCaptionFont({ loadGoogle: value })}
										fontVariant={captionStyles[0].variant}
										onFontVariant={(value) => saveCaptionFont({ variant: value })}
										fontWeight={captionStyles[0].weight}
										onFontWeight={(value) => saveCaptionFont({ weight: value })}
										fontStyle={captionStyles[0].style}
										onFontStyle={(value) => saveCaptionFont({ style: value })}
										fontSubset={captionStyles[0].subset}
										onFontSubset={(value) => saveCaptionFont({ subset: value })}
									/>
								</>
							)}
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Image Filter', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-image-filter'}
						>
							<SelectControl
								label={__('Image Filter', 'kadence-blocks')}
								help={__('Not supported in Internet Explorer', 'kadence-blocks')}
								options={[
									{
										label: __('None', 'kadence-blocks'),
										value: 'none',
									},
									{
										label: __('Grayscale', 'kadence-blocks'),
										value: 'grayscale',
									},
									{
										label: __('Sepia', 'kadence-blocks'),
										value: 'sepia',
									},
									{
										label: __('Saturation', 'kadence-blocks'),
										value: 'saturation',
									},
									{
										label: __('Vintage', 'kadence-blocks'),
										value: 'vintage',
									},
									{
										label: __('Earlybird', 'kadence-blocks'),
										value: 'earlybird',
									},
									{
										label: __('Toaster', 'kadence-blocks'),
										value: 'toaster',
									},
									{
										label: __('Mayfair', 'kadence-blocks'),
										value: 'mayfair',
									},
								]}
								value={imageFilter}
								onChange={(value) => setAttributes({ imageFilter: value })}
							/>
						</KadencePanelBody>
						{showSettings('overlay', 'kadence/image') && (
							<KadencePanelBody
								title={__('Overlay Color', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-image-overlay-settings'}
							>
								<BackgroundTypeControl
									label={__('Type', 'kadence-blocks')}
									type={overlayType ? overlayType : 'normal'}
									onChange={(value) => setAttributes({ overlayType: value })}
									allowedTypes={['normal', 'gradient']}
								/>
								<RangeControl
									label={__('Overlay Opacity', 'kadence-blocks')}
									value={overlayOpacity}
									onChange={(value) => {
										setAttributes({
											overlayOpacity: value,
										});
									}}
									step={0.01}
									min={0}
									max={1}
								/>
								{'gradient' === overlayType && (
									<GradientControl
										value={overlayGradient}
										onChange={(value) => setAttributes({ overlayGradient: value })}
										gradients={[]}
									/>
								)}
								{'gradient' !== overlayType && (
									<>
										<PopColorControl
											label={__('Color', 'kadence-blocks')}
											value={overlay ? overlay : ''}
											default={''}
											onChange={(value) => setAttributes({ overlay: value })}
										/>
									</>
								)}
								<SelectControl
									label={__('Blend Mode', 'kadence-blocks')}
									value={overlayBlendMode ? overlayBlendMode : 'none'}
									options={BLEND_OPTIONS}
									onChange={(value) => setAttributes({ overlayBlendMode: value })}
								/>
								<p>{__('Notice: Blend Mode not supported in all browsers', 'kadence-blocks')}</p>
							</KadencePanelBody>
						)}
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={paddingDesktop}
								tabletValue={paddingTablet}
								mobileValue={paddingMobile}
								onChange={(value) => setAttributes({ paddingDesktop: value })}
								onChangeTablet={(value) => setAttributes({ paddingTablet: value })}
								onChangeMobile={(value) => setAttributes({ paddingMobile: value })}
								min={0}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 999}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={marginDesktop}
								tabletValue={marginTablet}
								mobileValue={marginMobile}
								onChange={(value) => {
									setAttributes({ marginDesktop: value });
								}}
								onChangeTablet={(value) => setAttributes({ marginTablet: value })}
								onChangeMobile={(value) => setAttributes({ marginMobile: value })}
								min={marginUnit === 'em' || marginUnit === 'rem' ? -12 : -999}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : 999}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setAttributes({ marginUnit: value })}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowAuto={true}
							/>
						</KadencePanelBody>

						<div className="kt-sidebar-settings-spacer"></div>
						<KadencePanelBody
							title={__('Tooltip', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-image-tooltip-settings'}
						>
							<TextareaControl
								label={__('Tooltip Content', 'kadence-blocks')}
								value={tooltip}
								onChange={(newValue) => setAttributes({ tooltip: newValue })}
							/>
							<SelectControl
								label={__('Tooltip Placement', 'kadence-blocks')}
								value={tooltipPlacement || 'top'}
								options={[
									{ label: __('Top', 'kadence-blocks'), value: 'top' },
									{ label: __('Top Start', 'kadence-blocks'), value: 'top-start' },
									{ label: __('Top End', 'kadence-blocks'), value: 'top-end' },
									{ label: __('Right', 'kadence-blocks'), value: 'right' },
									{ label: __('Right Start', 'kadence-blocks'), value: 'right-start' },
									{ label: __('Right End', 'kadence-blocks'), value: 'right-end' },
									{ label: __('Bottom', 'kadence-blocks'), value: 'bottom' },
									{ label: __('Bottom Start', 'kadence-blocks'), value: 'bottom-start' },
									{ label: __('Bottom End', 'kadence-blocks'), value: 'bottom-end' },
									{ label: __('Left', 'kadence-blocks'), value: 'left' },
									{ label: __('Left Start', 'kadence-blocks'), value: 'left-start' },
									{ label: __('Left End', 'kadence-blocks'), value: 'left-end' },
									{ label: __('Auto', 'kadence-blocks'), value: 'auto' },
									{ label: __('Auto Start', 'kadence-blocks'), value: 'auto-start' },
									{ label: __('Auto End', 'kadence-blocks'), value: 'auto-end' },
								]}
								onChange={(val) => {
									setAttributes({ tooltipPlacement: val });
								}}
							/>
							<ToggleControl
								label={__('Show indicator underline', 'kadence-blocks')}
								checked={tooltipDash}
								onChange={(value) => {
									setAttributes({ tooltipDash: value });
								}}
							/>
						</KadencePanelBody>
						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={nonTransAttrs}
						/>
					</>
				)}
			</InspectorControls>
			<InspectorAdvancedControls>
				<ToggleControl
					label={__('Prevent Lazy Load', 'kadence-blocks')}
					help={__(
						'This adds a class to tell lazy load plugins to skip this image for lazy load.',
						'kadence-blocks'
					)}
					checked={preventLazyLoad}
					onChange={(value) => setAttributes({ preventLazyLoad: value })}
				/>
				<RangeControl
					label={__('Z-Index Control', 'kadence-blocks')}
					value={zIndex}
					onChange={(value) => {
						setAttributes({
							zIndex: value,
						});
					}}
					min={-200}
					max={2000}
					allowReset={true}
				/>
			</InspectorAdvancedControls>
		</>
	);
	let useOverlay = false;
	if (overlayOpacity && overlay && overlayType && overlayType !== 'gradient') {
		useOverlay = true;
	} else if (overlayOpacity && overlayGradient && overlayType && overlayType === 'gradient') {
		useOverlay = true;
	}
	const getFilename = (url) => {
		let filename;
		try {
			filename = new URL(url, 'http://example.com').pathname.split('/').pop();
		} catch (error) {}

		if (filename) {
			return filename;
		}
	};

	const filename = getFilename(url); // 'Screen-Shot-2021-11-04-at-9.53.09-AM.png';
	let defaultedAlt;

	if (alt) {
		defaultedAlt = alt;
	} else if (filename) {
		defaultedAlt = sprintf(
			/* translators: %s: file name */
			__('This image has an empty alt attribute; its file name is %s', 'kadence-blocks'),
			filename
		);
	} else {
		defaultedAlt = __('This image has an empty alt attribute', 'kadence-blocks');
	}
	let hasMask = false;
	let theMaskRepeat = 'no-repeat';
	let theMaskSize = 'auto';
	let theMaskPosition = 'center center';
	if (maskSvg === 'custom') {
		if (maskUrl) {
			hasMask = true;
			theMaskRepeat = maskRepeat ? maskRepeat : 'no-repeat';
			theMaskSize = maskSize ? maskSize : 'auto';
			theMaskPosition = maskPosition ? maskPosition : 'center center';
		}
	} else if (maskSvg !== 'none') {
		hasMask = true;
	}
	let img = (
		// Disable reason: Image itself is not meant to be interactive, but
		// should direct focus to block.
		/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
		<div className={`${!useRatio && useOverlay ? 'kb-image-has-overlay' : ''}`}>
			<img
				src={temporaryURL || previewURL}
				alt={defaultedAlt}
				width={
					undefined !== naturalWidth && naturalWidth && isSVG && !previewMaxWidth ? naturalWidth : undefined
				}
				height={
					undefined !== naturalHeight && naturalHeight && isSVG && !previewMaxWidth
						? naturalHeight
						: undefined
				}
				style={{
					WebkitMaskImage: hasMask
						? 'url(' +
						  (maskSvg === 'custom' ? maskUrl : kadence_blocks_params.svgMaskPath + maskSvg + '.svg') +
						  ')'
						: undefined,
					WebkitMaskRepeat: hasMask ? theMaskRepeat : undefined,
					WebkitMaskSize: hasMask ? theMaskSize : undefined,
					WebkitMaskPosition: hasMask ? theMaskPosition : undefined,

					maskImage: hasMask
						? 'url(' +
						  (maskSvg === 'custom' ? maskUrl : kadence_blocks_params.svgMaskPath + maskSvg + '.svg') +
						  ')'
						: undefined,
					maskRepeat: hasMask ? theMaskRepeat : undefined,
					maskSize: hasMask ? theMaskSize : undefined,
					maskPosition: hasMask ? theMaskPosition : undefined,

					paddingTop:
						!useRatio && '' !== previewPaddingTop
							? getSpacingOptionOutput(previewPaddingTop, paddingUnit)
							: undefined,
					paddingRight:
						!useRatio && '' !== previewPaddingRight
							? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
							: undefined,
					paddingBottom:
						!useRatio && '' !== previewPaddingBottom
							? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
							: undefined,
					paddingLeft:
						!useRatio && '' !== previewPaddingLeft
							? getSpacingOptionOutput(previewPaddingLeft, paddingUnit)
							: undefined,

					borderTop: previewBorderTopStyle ? previewBorderTopStyle : undefined,
					borderRight: previewBorderRightStyle ? previewBorderRightStyle : undefined,
					borderBottom: previewBorderBottomStyle ? previewBorderBottomStyle : undefined,
					borderLeft: previewBorderLeftStyle ? previewBorderLeftStyle : undefined,
					borderTopLeftRadius:
						'' !== previewRadiusTop
							? previewRadiusTop + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,
					borderTopRightRadius:
						'' !== previewRadiusRight
							? previewRadiusRight + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,
					borderBottomRightRadius:
						'' !== previewRadiusBottom
							? previewRadiusBottom + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,
					borderBottomLeftRadius:
						'' !== previewRadiusLeft
							? previewRadiusLeft + (borderRadiusUnit ? borderRadiusUnit : 'px')
							: undefined,

					backgroundColor: '' !== backgroundColor ? KadenceColorOutput(backgroundColor) : undefined,

					boxShadow:
						undefined !== displayBoxShadow &&
						displayBoxShadow &&
						undefined !== boxShadow &&
						undefined !== boxShadow[0] &&
						undefined !== boxShadow[0].color
							? (undefined !== boxShadow[0].inset && boxShadow[0].inset ? 'inset ' : '') +
							  (undefined !== boxShadow[0].hOffset ? boxShadow[0].hOffset : 0) +
							  'px ' +
							  (undefined !== boxShadow[0].vOffset ? boxShadow[0].vOffset : 0) +
							  'px ' +
							  (undefined !== boxShadow[0].blur ? boxShadow[0].blur : 14) +
							  'px ' +
							  (undefined !== boxShadow[0].spread ? boxShadow[0].spread : 0) +
							  'px ' +
							  KadenceColorOutput(
									undefined !== boxShadow[0].color ? boxShadow[0].color : '#000000',
									undefined !== boxShadow[0].opacity ? boxShadow[0].opacity : 0.2
							  )
							: undefined,
					filter:
						undefined !== displayDropShadow && displayDropShadow
							? 'drop-shadow(' +
							  (undefined !== displayDropShadow &&
							  displayDropShadow &&
							  undefined !== dropShadow &&
							  undefined !== dropShadow[0] &&
							  undefined !== dropShadow[0].color
									? (undefined !== dropShadow[0].hOffset ? dropShadow[0].hOffset : 0) +
									  'px ' +
									  (undefined !== dropShadow[0].vOffset ? dropShadow[0].vOffset : 0) +
									  'px ' +
									  (undefined !== dropShadow[0].blur ? dropShadow[0].blur : 14) +
									  'px ' +
									  KadenceColorOutput(
											undefined !== dropShadow[0].color ? dropShadow[0].color : '#000000',
											undefined !== dropShadow[0].opacity ? dropShadow[0].opacity : 0.2
									  )
									: undefined) +
							  ')'
							: undefined,
					objectPosition: imagePosition ? imagePosition : undefined,
				}}
				onError={() => onImageError()}
				onLoad={(event) => {
					setNaturalSize(pick(event.target, ['naturalWidth', 'naturalHeight']));
				}}
				className={`kb-img ${tooltipDash && tooltip ? ' kb-image-tooltip-border' : ''}`}
			/>
			{temporaryURL && <Spinner />}
			{!useRatio && (
				<SpacingVisualizer
					type="inside"
					forceShow={paddingMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewPaddingTop, paddingUnit),
						getSpacingOptionOutput(previewPaddingRight, paddingUnit),
						getSpacingOptionOutput(previewPaddingBottom, paddingUnit),
						getSpacingOptionOutput(previewPaddingLeft, paddingUnit),
					]}
				/>
			)}
		</div>
		/* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */
	);
	if (useRatio) {
		img = (
			<div
				className={`kb-is-ratio-image kb-image-ratio-${ratio ? ratio : 'land43'}${
					useOverlay ? ' kb-image-has-overlay' : ''
				}`}
			>
				{img}
			</div>
		);
	}
	let imageWidthWithinContainer;
	let imageHeightWithinContainer;

	if (clientWidth && naturalWidth && naturalHeight) {
		const exceedMaxWidth = naturalWidth > clientWidth;
		const imgRatio = naturalHeight / naturalWidth;
		imageWidthWithinContainer = exceedMaxWidth ? clientWidth : naturalWidth;
		imageHeightWithinContainer = exceedMaxWidth ? clientWidth * imgRatio : naturalHeight;
	}

	if (canEditImage && isEditingImage) {
		img = (
			<ImageEditor
				id={id}
				url={previewURL}
				width={width}
				height={height}
				clientWidth={clientWidth}
				naturalHeight={naturalHeight}
				naturalWidth={naturalWidth}
				onSaveImage={(imageAttributes) => setAttributes(imageAttributes)}
				onFinishEditing={() => {
					setIsEditingImage(false);
				}}
			/>
		);
	} else if (!isResizable || !imageWidthWithinContainer || 'Desktop' !== previewDevice) {
		img = (
			<div
				className={`kb-image-wrap`}
				style={{
					maxWidth: previewMaxWidth || width,
					width: previewMaxWidth ? '100%' : undefined,
				}}
			>
				{img}
			</div>
		);
	} else {
		const backupWidth = useRatio ? '100%' : 'auto';
		const currentWidth = previewMaxWidth || width || imageWidthWithinContainer;
		const currentHeight = height || imageHeightWithinContainer;
		let imgRatio = naturalWidth / naturalHeight;
		if (useRatio) {
			switch (ratio) {
				case 'land43':
					imgRatio = 4 / 3;
					break;
				case 'land32':
					imgRatio = 3 / 2;
					break;
				case 'land169':
					imgRatio = 16 / 9;
					break;
				case 'land21':
					imgRatio = 2 / 1;
					break;
				case 'land31':
					imgRatio = 3 / 1;
					break;
				case 'land41':
					imgRatio = 4 / 1;
					break;
				case 'port34':
					imgRatio = 3 / 4;
					break;
				case 'port23':
					imgRatio = 2 / 3;
					break;
				case 'port916':
					imgRatio = 9 / 16;
					break;
				case 'square':
					imgRatio = 1 / 1;
					break;
			}
		}
		const minWidth = naturalWidth < naturalHeight ? MIN_SIZE : MIN_SIZE * imgRatio;
		const minHeight = naturalHeight < naturalWidth ? MIN_SIZE : MIN_SIZE / imgRatio;

		// With the current implementation of ResizableBox, an image needs an
		// explicit pixel value for the max-width. In absence of being able to
		// set the content-width, this max-width is currently dictated by the
		// vanilla editor style. The following variable adds a buffer to this
		// vanilla style, so 3rd party themes have some wiggleroom. This does,
		// in most cases, allow you to scale the image beyond the width of the
		// main column, though not infinitely.
		// @todo It would be good to revisit this once a content-width variable
		// becomes available.
		const maxWidthBuffer = maxWidth * 2.5;

		let showRightHandle = false;
		let showLeftHandle = false;

		/* eslint-disable no-lonely-if */
		// See https://github.com/WordPress/gutenberg/issues/7584.
		if (align === 'center') {
			// When the image is centered, show both handles.
			showRightHandle = true;
			showLeftHandle = true;
		} else if (isRTL()) {
			// In RTL mode the image is on the right by default.
			// Show the right handle and hide the left handle only when it is
			// aligned left. Otherwise always show the left handle.
			if (align === 'left') {
				showRightHandle = true;
			} else {
				showLeftHandle = true;
			}
		} else {
			// Show the left handle and hide the right handle only when the
			// image is aligned right. Otherwise always show the right handle.
			if (align === 'right') {
				showLeftHandle = true;
			} else {
				showRightHandle = true;
			}
		}
		/* eslint-enable no-lonely-if */
		img = (
			<ResizableBox
				size={{
					width: previewMaxWidth && '' !== previewMaxWidth ? previewMaxWidth : backupWidth,
					height: 'auto',
				}}
				showHandle={isSelected}
				minWidth={minWidth}
				maxWidth={maxWidthBuffer}
				minHeight={minHeight}
				maxHeight={maxWidthBuffer / imgRatio}
				lockAspectRatio
				enable={{
					top: false,
					right: showRightHandle,
					bottom: false,
					left: showLeftHandle,
				}}
				onResizeStart={onResizeStart}
				onResizeStop={(event, direction, elt, delta) => {
					onResizeStop();
					setAttributes({
						imgMaxWidth: parseInt(currentWidth + delta.width, 10),
					});
				}}
				style={{
					margin: align === 'center' ? '0 auto' : undefined,
				}}
			>
				{img}
			</ResizableBox>
		);
	}

	return (
		<>
			<style>
				{overlayOpacity !== undefined && overlayOpacity !== ''
					? `.kadence-image${uniqueID} .kb-image-has-overlay:after { opacity: ${overlayOpacity} }`
					: ''}
				{overlayBlendMode
					? `.kadence-image${uniqueID} .kb-image-has-overlay:after { mix-blend-mode: ${overlayBlendMode}; }`
					: ''}
				{previewOverlay
					? `.kadence-image${uniqueID} .kb-image-has-overlay:after { background:${previewOverlay}; }`
					: ''}
				{previewOverlay && previewRadiusTop
					? `.kadence-image${uniqueID} .kb-image-has-overlay:after { border-top-left-radius:${previewRadiusTop}${borderRadiusUnit}; }`
					: ''}
				{previewOverlay && previewRadiusRight
					? `.kadence-image${uniqueID} .kb-image-has-overlay:after { border-top-right-radius:${previewRadiusRight}${borderRadiusUnit}; }`
					: ''}
				{previewOverlay && previewRadiusBottom
					? `.kadence-image${uniqueID} .kb-image-has-overlay:after { border-bottom-right-radius:${previewRadiusBottom}${borderRadiusUnit}; }`
					: ''}
				{previewOverlay && previewRadiusLeft
					? `.kadence-image${uniqueID} .kb-image-has-overlay:after { border-bottom-left-radius:${previewRadiusLeft}${borderRadiusUnit}; }`
					: ''}
				{previewMaxWidth
					? `.kadence-inner-column-inner:where(.section-is-flex) > .kadence-image${uniqueID} { max-width: ${previewMaxWidth}px; }`
					: ''}
			</style>
			{/* Hide controls during upload to avoid component remount,
				which causes duplicated image upload. */}
			{!temporaryURL && controls}
			{img}
			{(!RichText.isEmpty(caption) || isSelected) && stateShowCaption && showCaption !== false && (
				<RichText
					ref={captionRef}
					tagName="figcaption"
					aria-label={__('Image caption text', 'kadence-blocks')}
					placeholder={__('Add caption', 'kadence-blocks')}
					value={caption}
					onChange={(value) => setAttributes({ caption: value })}
					style={{
						//background: ( captionStyles && undefined !== captionStyles[ 0 ] && undefined !== captionStyles[ 0 ].background ? KadenceColorOutput( captionStyles[ 0 ].background ) : undefined ),
						color:
							captionStyles && undefined !== captionStyles[0] && undefined !== captionStyles[0].color
								? KadenceColorOutput(captionStyles[0].color)
								: undefined,
						fontFamily:
							captionStyles && undefined !== captionStyles[0] && undefined !== captionStyles[0].family
								? captionStyles[0].family
								: undefined,
						fontStyle:
							captionStyles && undefined !== captionStyles[0] && undefined !== captionStyles[0].style
								? captionStyles[0].style
								: undefined,
						fontWeight:
							captionStyles && undefined !== captionStyles[0] && undefined !== captionStyles[0].weight
								? captionStyles[0].weight
								: undefined,
						textTransform:
							captionStyles &&
							undefined !== captionStyles[0] &&
							undefined !== captionStyles[0].textTransform
								? captionStyles[0].textTransform
								: undefined,
						letterSpacing:
							captionStyles &&
							undefined !== captionStyles[0] &&
							undefined !== captionStyles[0].letterSpacing
								? captionStyles[0].letterSpacing
								: undefined,
						lineHeight: previewCaptionLineHeight,
						fontSize: getFontSizeOptionOutput(previewCaptionFontSize, previewCaptionFontSizeUnit),
					}}
					inlineToolbar
					__unstableOnSplitAtEnd={() => insertBlocksAfter(createBlock('core/paragraph'))}
				/>
			)}
			{captionStyles[0].google && captionStyles[0].family && (
				<KadenceWebfontLoader
					typography={[
						{
							family: captionStyles[0].family,
							variant: captionStyles[0].variant ? captionStyles[0].variant : '',
						},
					]}
					clientId={clientId}
					id={'advancedImage'}
				/>
			)}
		</>
	);
}
