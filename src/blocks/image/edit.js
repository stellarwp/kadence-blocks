/**
 * External dependencies
 */
import classnames from 'classnames';
import { get, has, omit, pick, debounce } from 'lodash';

/**
 * WordPress dependencies
 */
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { compose } from '@wordpress/compose';
import { useSelect, withSelect, useDispatch } from '@wordpress/data';
import {
	BlockAlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { applyFilters } from '@wordpress/hooks';
import { withNotices } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { plusCircleFilled } from '@wordpress/icons';
import { KadenceMediaPlaceholder, KadencePanelBody, KadenceImageControl, SpacingVisualizer } from '@kadence/components';
import { imageIcon } from '@kadence/icons';

import {
	getPreviewSize,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	setBlockDefaults,
	uniqueIdHelper,
	getInQueryBlock,
	setDynamicState,
} from '@kadence/helpers';

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal dependencies
 */
import Image from './image';

/**
 * Module constants
 */
import {
	LINK_DESTINATION_ATTACHMENT,
	LINK_DESTINATION_CUSTOM,
	LINK_DESTINATION_MEDIA,
	LINK_DESTINATION_NONE,
	ALLOWED_MEDIA_TYPES,
} from './constants';

export const pickRelevantMediaFiles = (image, size) => {
	const imageProps = pick(image, ['alt', 'id', 'link', 'caption']);
	imageProps.url =
		get(image, ['sizes', size, 'url']) || get(image, ['media_details', 'sizes', size, 'source_url']) || image.url;
	return imageProps;
};

/**
 * Is the URL a temporary blob URL? A blob URL is one that is used temporarily
 * while the image is being uploaded and will not have an id yet allocated.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the URL a Blob URL
 */
const isTemporaryImage = (id, url) => !id && isBlobURL(url);

/**
 * Is the url for the image hosted externally. An externally hosted image has no
 * id and is not a blob url.
 *
 * @param {number=} id  The id of the image.
 * @param {string=} url The url of the image.
 *
 * @return {boolean} Is the url an externally hosted url?
 */
export const isExternalImage = (id, url) => url && !id && !isBlobURL(url);

/**
 * Checks if WP generated default image size. Size generation is skipped
 * when the image is smaller than the said size.
 *
 * @param {Object} image
 * @param {string} defaultSize
 *
 * @return {boolean} Whether or not it has default image size.
 */
function hasDefaultSize(image, defaultSize) {
	return (
		has(image, ['sizes', defaultSize, 'url']) || has(image, ['media_details', 'sizes', defaultSize, 'source_url'])
	);
}

export function ImageEdit(props) {
	const {
		attributes,
		setAttributes,
		isSelected,
		className,
		noticeUI,
		insertBlocksAfter,
		noticeOperations,
		onReplace,
		context,
		clientId,
	} = props;
	const {
		url = '',
		alt,
		caption,
		align,
		id,
		width,
		height,
		uniqueID,
		sizeSlug,
		imageFilter,
		useRatio,
		imgMaxWidth,
		zIndex,
		kadenceAnimation,
		kadenceAOSOptions,
		border,
		borderColor,
		borderStyle,
		borderWidthDesktop,
		mobileBorderStyle,
		borderWidthMobile,
		tabletBorderStyle,
		borderWidthTablet,
		marginDesktop,
		marginTablet,
		marginMobile,
		marginUnit,
		paddingDesktop,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		inQueryBlock,
		urlTransparent,
	} = attributes;

	const debouncedSetDynamicState = debounce(setDynamicState, 200);

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	uniqueIdHelper(props);

	useEffect(() => {
		setBlockDefaults('kadence/image', attributes);

		setAttributes({ inQueryBlock: getInQueryBlock(context, inQueryBlock) });

		// Update from old border settings.
		const tempBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.borderStyle
					? attributes.borderStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
						]
			)
		);
		let updateBorderStyle = false;
		if ('undefined' !== typeof borderColor && '' !== borderColor) {
			tempBorderStyle[0].top[0] = borderColor;
			tempBorderStyle[0].right[0] = borderColor;
			tempBorderStyle[0].bottom[0] = borderColor;
			tempBorderStyle[0].left[0] = borderColor;
			updateBorderStyle = true;
			setAttributes({ borderColor: '' });
		}
		if (
			'' !== borderWidthDesktop?.[0] ||
			'' !== borderWidthDesktop?.[1] ||
			'' !== borderWidthDesktop?.[2] ||
			'' !== borderWidthDesktop?.[3]
		) {
			tempBorderStyle[0].top[2] = borderWidthDesktop?.[0] || '';
			tempBorderStyle[0].right[2] = borderWidthDesktop?.[1] || '';
			tempBorderStyle[0].bottom[2] = borderWidthDesktop?.[2] || '';
			tempBorderStyle[0].left[2] = borderWidthDesktop?.[3] || '';
			updateBorderStyle = true;
			setAttributes({ borderWidthDesktop: ['', '', '', ''] });
		}
		if (updateBorderStyle) {
			setAttributes({ borderStyle: tempBorderStyle });
		}
		const tempTabBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.tabletBorderStyle
					? attributes.tabletBorderStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
						]
			)
		);
		if (
			'' !== borderWidthTablet?.[0] ||
			'' !== borderWidthTablet?.[1] ||
			'' !== borderWidthTablet?.[2] ||
			'' !== borderWidthTablet?.[3]
		) {
			tempTabBorderStyle[0].top[2] = borderWidthTablet?.[0] || '';
			tempTabBorderStyle[0].right[2] = borderWidthTablet?.[1] || '';
			tempTabBorderStyle[0].bottom[2] = borderWidthTablet?.[2] || '';
			tempTabBorderStyle[0].left[2] = borderWidthTablet?.[3] || '';
			const tempTabBorderWidth = JSON.parse(JSON.stringify(tempTabBorderStyle));
			setAttributes({ tabletBorderStyle: tempTabBorderWidth, borderWidthTablet: ['', '', '', ''] });
		}
		const tempMobileBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.mobileBorderStyle
					? attributes.mobileBorderStyle
					: [
							{
								top: ['', '', ''],
								right: ['', '', ''],
								bottom: ['', '', ''],
								left: ['', '', ''],
								unit: 'px',
							},
						]
			)
		);
		if (
			'' !== borderWidthMobile?.[0] ||
			'' !== borderWidthMobile?.[1] ||
			'' !== borderWidthMobile?.[2] ||
			'' !== borderWidthMobile?.[3]
		) {
			tempMobileBorderStyle[0].top[2] = borderWidthMobile?.[0] || '';
			tempMobileBorderStyle[0].right[2] = borderWidthMobile?.[1] || '';
			tempMobileBorderStyle[0].bottom[2] = borderWidthMobile?.[2] || '';
			tempMobileBorderStyle[0].left[2] = borderWidthMobile?.[3] || '';
			setAttributes({ mobileBorderStyle: tempMobileBorderStyle, borderWidthMobile: ['', '', '', ''] });
		}
	}, []);

	useEffect(() => {
		//when the attr url changes set the dynamic url. Also set the attr url if we didn't have one ( initialized with dynamic seetings )
		debouncedSetDynamicState(
			'kadence.dynamicImage',
			'',
			attributes,
			'url',
			setAttributes,
			context,
			setDynamicURL,
			url ? false : true
		);
	}, [url, context]);

	const marginMouseOver = mouseOverVisualizer();
	const paddingMouseOver = mouseOverVisualizer();
	const [temporaryURL, setTemporaryURL] = useState();
	const [dynamicURL, setDynamicURL] = useState();

	const altRef = useRef();
	useEffect(() => {
		altRef.current = alt;
	}, [alt]);

	const captionRef = useRef();
	useEffect(() => {
		captionRef.current = caption;
	}, [caption]);

	const ref = useRef();
	const { imageDefaultSize, mediaUpload } = useSelect(
		(select) => {
			const { getSettings } = select(blockEditorStore);
			const settings = pick(getSettings(), ['imageDefaultSize', 'mediaUpload']);
			return {
				...settings,
				imageDefaultSize: attributes.sizeSlug || settings.imageDefaultSize,
			};
		},
		[attributes.sizeSlug]
	);
	function onUploadError(message) {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	}

	function onSelectImage(media) {
		if (!media || !media.url) {
			setAttributes({
				url: undefined,
				alt: undefined,
				id: undefined,
				title: undefined,
				caption: undefined,
			});

			return;
		}

		if (isBlobURL(media.url)) {
			setTemporaryURL(media.url);
			return;
		}

		setTemporaryURL();

		let mediaAttributes = pickRelevantMediaFiles(media, imageDefaultSize);

		// If a caption text was meanwhile written by the user,
		// make sure the text is not overwritten by empty captions.
		if (captionRef.current && !get(mediaAttributes, ['caption'])) {
			mediaAttributes = omit(mediaAttributes, ['caption']);
		}

		let additionalAttributes;
		// Reset the dimension attributes if changing to a different image.
		if (!media.id || media.id !== id) {
			additionalAttributes = {
				width: undefined,
				height: undefined,
				// Fallback to size "full" if there's no default image size.
				// It means the image is smaller, and the block will use a full-size URL.
				sizeSlug: hasDefaultSize(media, imageDefaultSize) ? imageDefaultSize : 'full',
			};
		} else {
			// Keep the same url when selecting the same file, so "Image Size"
			// option is not changed.
			additionalAttributes = { url };
		}
		// Check if default link setting should be used.
		let linkDestination = attributes.linkDestination;
		if (!linkDestination) {
			// Use the WordPress option to determine the proper default.
			// The constants used in Gutenberg do not match WP options so a little more complicated than ideal.
			// TODO: fix this in a follow up PR, requires updating media-text and ui component.
			switch (wp?.media?.view?.settings?.defaultProps?.link || LINK_DESTINATION_NONE) {
				case 'file':
				case LINK_DESTINATION_MEDIA:
					linkDestination = LINK_DESTINATION_MEDIA;
					break;
				case 'post':
				case LINK_DESTINATION_ATTACHMENT:
					linkDestination = LINK_DESTINATION_ATTACHMENT;
					break;
				case LINK_DESTINATION_CUSTOM:
					linkDestination = LINK_DESTINATION_CUSTOM;
					break;
				case LINK_DESTINATION_NONE:
					linkDestination = LINK_DESTINATION_NONE;
					break;
			}
		}

		// Check if the image is linked to it's media.
		let href;
		switch (linkDestination) {
			case LINK_DESTINATION_MEDIA:
				href = media.url;
				break;
			case LINK_DESTINATION_ATTACHMENT:
				href = media.link;
				break;
		}
		mediaAttributes.link = href;

		setAttributes({
			...mediaAttributes,
			...additionalAttributes,
			linkDestination,
		});
	}

	function onSelectURL(newURL) {
		if (newURL !== url) {
			setAttributes({
				url: newURL,
				id: undefined,
				width: undefined,
				height: undefined,
				sizeSlug: imageDefaultSize,
			});
		}
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

	let isTemp = isTemporaryImage(id, url);

	// Upload a temporary image on mount.
	useEffect(() => {
		if (!isTemp) {
			return;
		}

		const file = getBlobByURL(url);

		if (file) {
			mediaUpload({
				filesList: [file],
				onFileChange: ([img]) => {
					onSelectImage(img);
				},
				allowedTypes: ALLOWED_MEDIA_TYPES,
				onError: (message) => {
					isTemp = false;
					noticeOperations.createErrorNotice(message);
					setAttributes({
						src: undefined,
						id: undefined,
						url: undefined,
					});
				},
			});
		}
	}, []);

	// If an image is temporary, revoke the Blob url when it is uploaded (and is
	// no longer temporary).
	useEffect(() => {
		if (isTemp) {
			setTemporaryURL(url);
			return;
		}
		revokeBlobURL(temporaryURL);
	}, [isTemp, url]);

	const isExternal = isExternalImage(id, url);
	const src = isExternal ? url : undefined;
	const mediaPreview = !!url && (
		<img
			alt={__('Edit image', 'kadence-blocks')}
			title={__('Edit image', 'kadence-blocks')}
			className={'edit-image-preview'}
			src={url}
		/>
	);
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
	const classes = classnames(className, {
		'is-transient': temporaryURL,
		'is-resized': !!width || !!height,
		'aos-animate': 'aos-animate',
		[`size-${sizeSlug}`]: sizeSlug,
		[`filter-${imageFilter}`]: imageFilter && imageFilter !== 'none',
		[`kb-image-is-ratio-size`]: useRatio,
		'image-is-svg': url && url.endsWith('.svg'),
		[`kadence-image${uniqueID}`]: uniqueID,
		'kb-image-max-width-set': imgMaxWidth,
		'has-transparent-img': urlTransparent,
	});

	// const blockProps = useBlockProps( {
	// 	ref,
	// 	className: classes,
	// } );
	const blockProps = useBlockProps({
		ref,
		className: classes,
		'data-align': 'center' === align ? align : undefined,
	});

	return (
		<figure
			data-aos={kadenceAnimation ? kadenceAnimation : undefined}
			data-aos-duration={
				kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].duration
					? kadenceAOSOptions[0].duration
					: undefined
			}
			data-aos-easing={
				kadenceAOSOptions && kadenceAOSOptions[0] && kadenceAOSOptions[0].easing
					? kadenceAOSOptions[0].easing
					: undefined
			}
			{...blockProps}
			style={{
				maxWidth: imgMaxWidth && (align === 'left' || align === 'right') ? imgMaxWidth + 'px' : undefined,
				zIndex: zIndex ? zIndex : undefined,
				marginTop: '' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginUnit) : undefined,
				marginRight:
					'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginUnit) : undefined,
				marginBottom:
					'' !== previewMarginBottom ? getSpacingOptionOutput(previewMarginBottom, marginUnit) : undefined,
				marginLeft:
					'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginUnit) : undefined,
				paddingTop:
					useRatio && '' !== previewPaddingTop
						? getSpacingOptionOutput(previewPaddingTop, paddingUnit)
						: undefined,
				paddingRight:
					useRatio && '' !== previewPaddingRight
						? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
						: undefined,
				paddingBottom:
					useRatio && '' !== previewPaddingBottom
						? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
						: undefined,
				paddingLeft:
					useRatio && '' !== previewPaddingLeft
						? getSpacingOptionOutput(previewPaddingLeft, paddingUnit)
						: undefined,
			}}
		>
			{(temporaryURL || url) && (
				<Image
					temporaryURL={temporaryURL}
					dynamicURL={dynamicURL}
					previewDevice={previewDevice}
					attributes={attributes}
					setAttributes={setAttributes}
					isSelected={isSelected}
					insertBlocksAfter={insertBlocksAfter}
					onReplace={onReplace}
					onSelectImage={onSelectImage}
					onSelectURL={onSelectURL}
					onUploadError={onUploadError}
					containerRef={ref}
					context={context}
					clientId={clientId}
					marginMouseOver={marginMouseOver}
					paddingMouseOver={paddingMouseOver}
				/>
			)}
			{!url && (
				<>
					<BlockControls group="block">
						<BlockAlignmentControl value={align} onChange={updateAlignment} />
					</BlockControls>
					<InspectorControls>
						<KadencePanelBody
							title={__('Image settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-image-settings-edit'}
						>
							<KadenceImageControl
								label={__('Image', 'kadence-blocks')}
								hasImage={url ? true : false}
								imageURL={url ? url : ''}
								imageID={id ? id : ''}
								onRemoveImage={() => {
									setAttributes({
										url: undefined,
										width: undefined,
										height: undefined,
										sizeSlug: undefined,
									});
								}}
								onSaveImage={onSelectImage}
								disableMediaButtons={url ? true : false}
								dynamicAttribute="url"
								isSelected={isSelected}
								attributes={attributes}
								setAttributes={setAttributes}
								name={'kadence/image'}
								clientId={clientId}
								context={context}
							/>
						</KadencePanelBody>
					</InspectorControls>
				</>
			)}
			<KadenceMediaPlaceholder
				labels={{ title: __('Advanced Image', 'kadence-blocks') }}
				icon={imageIcon}
				selectIcon={plusCircleFilled}
				selectLabel={__('Select Image', 'kadence-blocks')}
				onSelect={onSelectImage}
				onSelectURL={onSelectURL}
				accept="image/*"
				notices={noticeUI}
				onError={onUploadError}
				className={'kadence-image-upload'}
				allowedTypes={ALLOWED_MEDIA_TYPES}
				mediaPreview={mediaPreview}
				disableMediaButtons={temporaryURL || url}
			/>
			<SpacingVisualizer
				type="outside"
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, marginUnit),
					getSpacingOptionOutput(previewMarginRight, marginUnit),
					getSpacingOptionOutput(previewMarginBottom, marginUnit),
					getSpacingOptionOutput(previewMarginLeft, marginUnit),
				]}
			/>
			{useRatio && (
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
		</figure>
	);
}
export default compose([withNotices])(ImageEdit);
