/**
 * External dependencies
 */
import classnames from 'classnames';
import { every, filter, forEach, debounce, map } from 'lodash';
import { Masonry } from 'react-masonry';

/**
 * Kadence Components.
 */
import {
	KadenceColorOutput,
	showSettings,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	getPreviewSize,
	uniqueIdHelper,
	getInQueryBlock,
	setBlockDefaults,
	isRTL,
	getFontSizeOptionOutput,
} from '@kadence/helpers';
import {
	PopColorControl,
	TypographyControls,
	KadencePanelBody,
	RangeControl,
	WebfontLoader,
	StepControls,
	ImageSizeControl,
	KadenceRadioButtons,
	DynamicLinkControl,
	KadenceMediaPlaceholder,
	DynamicGalleryControl,
	ResponsiveMeasurementControls,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveRangeControls,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	BoxShadowControl,
	ResponsiveFontSizeControl,
} from '@kadence/components';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { applyFilters } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';

/**
 * Import Icons
 */
import {
	topLeftIcon,
	topRightIcon,
	bottomLeftIcon,
	bottomRightIcon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	galleryMasonryIcon,
	galleryGridIcon,
	galleryCarouselIcon,
	galleryFluidIcon,
	gallerySliderIcon,
	galleryTilesIcon,
	galleryThumbSliderIcon,
	galleryMosaicIcon,
} from '@kadence/icons';

/**
 * WordPress dependencies
 */
import {
	Button,
	ButtonGroup,
	Tooltip,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
	TabPanel,
	Placeholder,
	withNotices,
	ToolbarButton,
	BaseControl,
} from '@wordpress/components';
import {
	BlockControls,
	BlockIcon,
	MediaPlaceholder,
	MediaUpload,
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useEffect, useState, useRef, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { getBlobByURL, isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { withSelect, useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import GalleryImage from './gallery-image';
import { getRelevantMediaFiles } from './shared';

import { gallery, previous, plusCircleFilled } from '@wordpress/icons';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

const linkOptions = [
	{ value: 'attachment', label: __('Attachment Page', 'kadence-blocks') },
	{ value: 'media', label: __('Media File', 'kadence-blocks') },
	{ value: 'custom', label: __('Custom', 'kadence-blocks') },
	{ value: 'none', label: __('None', 'kadence-blocks') },
];
const typeOptions = [
	{ value: 'masonry', label: __('Masonry', 'kadence-blocks'), icon: galleryMasonryIcon, isDisabled: false },
	{ value: 'grid', label: __('Grid', 'kadence-blocks'), icon: galleryGridIcon, isDisabled: false },
	{ value: 'carousel', label: __('Carousel', 'kadence-blocks'), icon: galleryCarouselIcon, isDisabled: false },
	{
		value: 'fluidcarousel',
		label: __('Fluid Carousel', 'kadence-blocks'),
		icon: galleryFluidIcon,
		isDisabled: false,
	},
	{ value: 'slider', label: __('Slider', 'kadence-blocks'), icon: gallerySliderIcon, isDisabled: false },
	{
		value: 'thumbslider',
		label: __('Thumbnail Slider (Pro addon)', 'kadence-blocks'),
		icon: galleryThumbSliderIcon,
		isDisabled: true,
	},
	{ value: 'tiles', label: __('Tiles (Pro addon)', 'kadence-blocks'), icon: galleryTilesIcon, isDisabled: true },
	{ value: 'mosaic', label: __('Mosaic (Pro only)', 'kadence-blocks'), icon: galleryMosaicIcon, isDisabled: true },
];

const mosaicTypes = [
	{ value: 'first', label: __('First', 'kadence-blocks') },
	{ value: 'last', label: __('Last', 'kadence-blocks') },
];

const arrowPositionOptions = [
	{
		label: __('Center', 'kadence-blocks'),
		value: 'center',
	},
	{
		label: __('Bottom Left (Pro only)', 'kadence-blocks'),
		value: 'bottom-left',
		disabled: true,
	},
	{
		label: __('Bottom Right (Pro only)', 'kadence-blocks'),
		value: 'bottom-right',
		disabled: true,
	},
	{
		label: __('Top Left (Pro only)', 'kadence-blocks'),
		value: 'top-left',
		disabled: true,
	},
	{
		label: __('Top Right (Pro only)', 'kadence-blocks'),
		value: 'top-right',
		disabled: true,
	},
	{
		label: __('Outside Top (Pro only)', 'kadence-blocks'),
		value: 'outside-top',
		disabled: true,
	},
	{
		label: __('Outside Top Left (Pro only)', 'kadence-blocks'),
		value: 'outside-top-left',
		disabled: true,
	},
	{
		label: __('Outside Top Right (Pro only)', 'kadence-blocks'),
		value: 'outside-top-right',
		disabled: true,
	},
	{
		label: __('Outside Bottom (Pro only)', 'kadence-blocks'),
		value: 'outside-bottom-center',
		disabled: true,
	},
	{
		label: __('Outside Bottom Left (Pro only)', 'kadence-blocks'),
		value: 'outside-bottom-left',
		disabled: true,
	},
	{
		label: __('Outside Bottom Right (Pro only)', 'kadence-blocks'),
		value: 'outside-bottom-right',
		disabled: true,
	},
];

const arrowStyleOptions = [
	{
		label: __('White on Dark', 'kadence-blocks'),
		value: 'whiteondark',
	},
	{
		label: __('Black on Light', 'kadence-blocks'),
		value: 'blackonlight',
	},
	{
		label: __('Outline Black', 'kadence-blocks'),
		value: 'outlineblack',
	},
	{
		label: __('Outline White', 'kadence-blocks'),
		value: 'outlinewhite',
	},
	{
		label: __('Custom (Pro only)', 'kadence-blocks'),
		value: 'custom',
		disabled: true,
	},
	{
		label: __('None', 'kadence-blocks'),
		value: 'none',
	},
];

const dotStyleOptions = [
	{
		label: __('Dark', 'kadence-blocks'),
		value: 'dark',
	},
	{
		label: __('Light', 'kadence-blocks'),
		value: 'light',
	},
	{
		label: __('Outline Dark', 'kadence-blocks'),
		value: 'outlinedark',
	},
	{
		label: __('Outline Light', 'kadence-blocks'),
		value: 'outlinelight',
	},
	{
		label: __('Custom (Pro only)', 'kadence-blocks'),
		value: 'custom',
		disabled: true,
	},
	{
		label: __('None', 'kadence-blocks'),
		value: 'none',
	},
];

const ALLOWED_MEDIA_TYPES = ['image'];

export default function GalleryEdit(props) {
	// saveImageAttributes = debounce( saveImageAttributes.bind( this ), 1000 );
	// carouselSizeTrigger = debounce( carouselSizeTrigger.bind( this ), 250 );

	const { attributes, isSelected, className, noticeUI, context, clientId, setAttributes } = props;
	const {
		mosaicType,
		inQueryBlock,
		uniqueID,
		images,
		columns,
		linkTo,
		ids,
		columnControl,
		showCaption,
		captionStyles,
		lightbox,
		lightSize,
		type,
		imageRatio,
		captionStyle,
		gutter,
		thumbSize,
		autoPlay,
		autoSpeed,
		transSpeed,
		slidesScroll,
		arrowStyle,
		dotStyle,
		imageRadius,
		tabletImageRadius,
		mobileImageRadius,
		imageRadiusUnit,
		margin,
		marginUnit,
		displayShadow,
		shadow,
		shadowHover,
		carouselHeight,
		imageFilter,
		lightboxCaption,
		carouselAlign,
		thumbnailColumns,
		thumbnailControl,
		thumbnailRatio,
		mobileForceHover,
		kadenceDynamic,
		imagesDynamic,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		kbVersion,
		gutterUnit,
		lazyLoad,
		slideType,
		mosaicRowHeight,
		mosaicRowHeightUnit,
		arrowPosition,
		arrowMargin,
		tabletArrowMargin,
		mobileArrowMargin,
		arrowMarginUnit,
		arrowSize,
		arrowSizeUnit,
		overflow,
		arrowCustomColor,
		arrowCustomColorHover,
		arrowCustomColorActive,
		arrowCustomColorBackground,
		arrowCustomColorBackgroundHover,
		arrowCustomColorBackgroundActive,
		arrowCustomColorBorder,
		arrowCustomColorBorderHover,
		arrowCustomColorBorderActive,
		arrowCustomBorderWidth,
		dotCustomColor,
		dotCustomColorHover,
		dotCustomColorActive,
		dotCustomColorBorder,
		dotCustomColorBorderHover,
		dotCustomColorBorderActive,
		dotCustomBorderWidth,
		showPauseButton,
	} = attributes;
	const mainRef = useRef(null);
	const thumbsRef = useRef();
	const dynamicSource = kadenceDynamic && kadenceDynamic.images && kadenceDynamic.images.enable ? true : false;
	const { previewDevice, mediaUpload } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				mediaUpload: select(blockEditorStore).getSettings().mediaUpload,
			};
		},
		[clientId]
	);
	useEffect(() => {
		if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
			mainRef.current.sync(thumbsRef.current.splide);
		}
	}, [mainRef.current, thumbsRef.current]);

	useEffect(() => {
		setBlockDefaults('kadence/advancedgallery', attributes);

		setAttributes({ inQueryBlock: getInQueryBlock(context, inQueryBlock) });
		// Old Static Image source.
		if (images?.length && every(images, ({ url }) => isBlobURL(url))) {
			const filesList = map(images, ({ url }) => getBlobByURL(url));
			forEach(images, ({ url }) => revokeBlobURL(url));
			mediaUpload({
				filesList,
				onFileChange: (imgs) => onSelectImages(imgs, 2),
				allowedTypes: ['image'],
			});
		}

		if (!kbVersion || kbVersion < 2) {
			if (images && !dynamicSource) {
				const newImageData = [];
				forEach(images, (image) => {
					newImageData.push({
						url: image?.url || '',
						thumbUrl: image?.thumbUrl || '',
						lightUrl: image?.lightUrl || '',
						link: image?.link || '',
						customLink: image?.customLink || '',
						linkTarget: image?.linkTarget || '',
						width: image?.width || '',
						height: image?.height || '',
						alt: image?.alt || '',
						id: image?.id || '',
						caption: image?.caption || '',
						linkSponsored: image?.linkSponsored || '',
					});
				});
				setAttributes({
					imagesDynamic: newImageData,
				});
			}
			setAttributes({ kbVersion: 2 });
		}
	}, []);

	uniqueIdHelper(props);

	const previewPaddingUnit = undefined !== paddingUnit ? paddingUnit : 'px';
	const previewMarginUnit = undefined !== marginUnit ? marginUnit : 'px';
	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin[0].desk[0] ? margin[0].desk[0] : '',
		undefined !== margin[0].tablet[0] ? margin[0].tablet[0] : '',
		undefined !== margin[0].mobile[0] ? margin[0].mobile[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin[0].desk[0] ? margin[0].desk[1] : '',
		undefined !== margin[0].tablet[0] ? margin[0].tablet[1] : '',
		undefined !== margin[0].mobile[0] ? margin[0].mobile[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin[0].desk[0] ? margin[0].desk[2] : '',
		undefined !== margin[0].tablet[0] ? margin[0].tablet[2] : '',
		undefined !== margin[0].mobile[0] ? margin[0].mobile[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin[0].desk[0] ? margin[0].desk[3] : '',
		undefined !== margin[0].tablet[0] ? margin[0].tablet[3] : '',
		undefined !== margin[0].mobile[0] ? margin[0].mobile[3] : ''
	);

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0] : '',
		undefined !== tabletPadding ? tabletPadding[0] : '',
		undefined !== mobilePadding ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding && undefined !== padding[1] && '' !== padding[1] ? padding[1] : '',
		undefined !== tabletPadding ? tabletPadding[1] : '',
		undefined !== mobilePadding ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[2] : '',
		undefined !== tabletPadding ? tabletPadding[2] : '',
		undefined !== mobilePadding ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding && undefined !== padding[3] && '' !== padding[3] ? padding[3] : '',
		undefined !== tabletPadding ? tabletPadding[3] : '',
		undefined !== mobilePadding ? mobilePadding[3] : ''
	);

	const previewColumns = getPreviewSize(
		previewDevice,
		undefined !== columns[0] ? columns[0] : 3,
		undefined !== columns[3] ? columns[3] : '',
		undefined !== columns[5] ? columns[5] : ''
	);

	const previewThumbColumns = getPreviewSize(
		previewDevice,
		undefined !== thumbnailColumns[0] ? thumbnailColumns[0] : 4,
		undefined !== thumbnailColumns[3] ? thumbnailColumns[3] : '',
		undefined !== thumbnailColumns[5] ? thumbnailColumns[5] : ''
	);

	const previewGutter = getPreviewSize(
		previewDevice,
		undefined !== gutter[0] ? gutter[0] : '',
		undefined !== gutter[1] ? gutter[1] : '',
		undefined !== gutter[2] ? gutter[2] : ''
	);
	const previewGutterUnit = gutterUnit ? gutterUnit : 'px';

	const previewMosaicRowHeight = getPreviewSize(
		previewDevice,
		undefined !== mosaicRowHeight[0] ? mosaicRowHeight[0] : '',
		undefined !== mosaicRowHeight[1] ? mosaicRowHeight[1] : '',
		undefined !== mosaicRowHeight[2] ? mosaicRowHeight[2] : ''
	);
	const previewMosaicRowHeightUnit = mosaicRowHeightUnit ? mosaicRowHeightUnit : 'px';

	const previewHeight = getPreviewSize(
		previewDevice,
		undefined !== carouselHeight[0] ? carouselHeight[0] : '',
		undefined !== carouselHeight[1] ? carouselHeight[1] : '',
		undefined !== carouselHeight[2] ? carouselHeight[2] : ''
	);

	const previewImageRadius = getPreviewSize(
		previewDevice,
		undefined !== imageRadius ? imageRadius : '',
		undefined !== tabletImageRadius ? tabletImageRadius : '',
		undefined !== mobileImageRadius ? mobileImageRadius : ''
	);

	const blockProps = useBlockProps({
		className: `kb-gallery-container`,
	});

	const spacingSettings = {
		paddingLeft:
			undefined !== previewPaddingLeft
				? getSpacingOptionOutput(previewPaddingLeft, previewPaddingUnit)
				: undefined,
		paddingRight:
			undefined !== previewPaddingRight
				? getSpacingOptionOutput(previewPaddingRight, previewPaddingUnit)
				: undefined,
		paddingTop:
			undefined !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, previewPaddingUnit) : undefined,
		paddingBottom:
			undefined !== previewPaddingBottom
				? getSpacingOptionOutput(previewPaddingBottom, previewPaddingUnit)
				: undefined,
		marginLeft:
			undefined !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, previewMarginUnit) : undefined,
		marginRight:
			undefined !== previewMarginRight
				? getSpacingOptionOutput(previewMarginRight, previewMarginUnit)
				: undefined,
		marginTop:
			undefined !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, previewMarginUnit) : undefined,
		marginBottom:
			undefined !== previewMarginBottom
				? getSpacingOptionOutput(previewMarginBottom, previewMarginUnit)
				: undefined,
	};

	const [selectedImage, setSelectedImage] = useState(null);
	const [activeTab, setActiveTab] = useState('general');

	const setAttribs = (attribs) => {
		let newAttribs = attribs;

		if (newAttribs.ids) {
			throw new Error(
				'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes'
			);
		}

		if (newAttribs.imagesDynamic) {
			newAttribs = {
				...newAttribs,
				ids: map(newAttribs.imagesDynamic, 'id'),
			};
		}

		setAttributes(newAttribs);
	};

	const onSelectImage = (index) => {
		if (selectedImage !== index) {
			setSelectedImage(index);
		}
	};

	const onMove = (oldIndex, newIndex) => {
		const newImages = [...imagesDynamic];
		newImages.splice(newIndex, 1, imagesDynamic[oldIndex]);
		newImages.splice(oldIndex, 1, imagesDynamic[newIndex]);
		setSelectedImage(newIndex);
		setAttribs({ imagesDynamic: newImages });
	};

	const onMoveForward = (oldIndex) => {
		if (oldIndex === imagesDynamic.length - 1) {
			return;
		}
		onMove(oldIndex, oldIndex + 1);
	};

	const onMoveBackward = (oldIndex) => {
		if (oldIndex === 0) {
			return;
		}
		onMove(oldIndex, oldIndex - 1);
	};

	const onRemoveImage = (index) => {
		const newImages = filter(imagesDynamic, (img, i) => index !== i);
		setSelectedImage(null);
		setAttribs({
			imagesDynamic: newImages,
		});
	};

	//async
	async function onSelectImages(imgs, src = 9) {
		const updatingImages = await getRelevantMediaFiles(imgs, lightSize, thumbSize, imagesDynamic);
		setAttribs({
			imagesDynamic: updatingImages,
		});
	}

	const onUploadError = (message) => {
		const { noticeOperations } = props;
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice(message);
	};

	// async
	async function setCaptions() {
		const previousShowCaption = showCaption;
		setAttribs({ showCaption: !previousShowCaption });

		if (previousShowCaption) {
			if (imagesDynamic) {
				const updatingImages = await getRelevantMediaFiles(imagesDynamic, lightSize, thumbSize);

				setAttribs({
					imagesDynamic: updatingImages,
				});
			}
		}
	}

	// async
	const changeImageThumbSize = async (img) => {
		setAttributes({ thumbSize: img.slug });
		try {
			const updatingImages = await getRelevantMediaFiles(imagesDynamic, lightSize, img.slug);
			setAttribs({
				imagesDynamic: updatingImages,
			});
		} catch (error) {
			console.error(error);
		}
	};

	// async
	async function changeImageLightSize(img) {
		setAttributes({ lightSize: img.slug });

		const updatingImages = await getRelevantMediaFiles(imagesDynamic, img.slug, thumbSize);
		setAttribs({
			imagesDynamic: updatingImages,
		});
	}
	const saveImageAttributes = (id, attributes) => {
		const data = new window.FormData();
		forEach(attributes, (value, key) => data.append(key, value));
		apiFetch({
			path: '/wp/v2/media/' + id,
			body: data,
			method: 'POST',
		});
	};
	const setImageAttributes = (index, attributes) => {
		if (!imagesDynamic[index]) {
			return;
		}
		if (imagesDynamic[index].id) {
			saveImageAttributes(imagesDynamic[index].id, attributes);
		}
		setAttributes({
			imagesDynamic: [
				...imagesDynamic.slice(0, index),
				{
					...imagesDynamic[index],
					...attributes,
				},
				...imagesDynamic.slice(index + 1),
			],
		});
	};
	const setLinkAttributes = (index, attributes) => {
		if (!imagesDynamic[index]) {
			return;
		}
		setAttributes({
			imagesDynamic: [
				...imagesDynamic.slice(0, index),
				{
					...imagesDynamic[index],
					...attributes,
				},
				...imagesDynamic.slice(index + 1),
			],
		});
	};

	// const componentDidUpdate = ( prevProps ) => {
	// 	// Deselect images when deselecting the block
	// 	if ( !isSelected && prevProps.isSelected ) {
	// 		setSelectedImage( null );
	// 		setCaptionSelected( false );
	// 	}
	// };

	const galleryTypes = useMemo(() => applyFilters('kadence.galleryTypes', typeOptions), []);
	const galleryArrowsStyle = useMemo(() => applyFilters('kadence.galleryArrowsStyle', arrowStyleOptions), []);
	const galleryArrowsPosition = useMemo(
		() => applyFilters('kadence.galleryArrowsPosition', arrowPositionOptions),
		[]
	);
	const galleryArrowOptions = applyFilters('kadence.galleryArrowsBlockOptions', attributes, setAttributes);
	const previewArrowSize = getPreviewSize(
		previewDevice,
		undefined !== arrowSize ? arrowSize[0] : '',
		undefined !== arrowSize ? arrowSize[1] : '',
		undefined !== arrowSize ? arrowSize[2] : ''
	);
	const previewArrowSizeUnit = arrowSizeUnit ? arrowSizeUnit : 'px';
	const previewArrowMarginTop = getPreviewSize(
		previewDevice,
		undefined !== arrowMargin?.[0] && '' !== arrowMargin?.[0] ? arrowMargin[0] : '',
		undefined !== tabletArrowMargin?.[0] && '' !== tabletArrowMargin?.[0] ? tabletArrowMargin[0] : '',
		undefined !== mobileArrowMargin?.[0] && '' !== mobileArrowMargin?.[0] ? mobileArrowMargin[0] : ''
	);
	const previewArrowMarginRight = getPreviewSize(
		previewDevice,
		undefined !== arrowMargin?.[1] && '' !== arrowMargin?.[1] ? arrowMargin[1] : '',
		undefined !== tabletArrowMargin?.[1] && '' !== tabletArrowMargin?.[1] ? tabletArrowMargin[1] : '',
		undefined !== mobileArrowMargin?.[1] && '' !== mobileArrowMargin?.[1] ? mobileArrowMargin[1] : ''
	);
	const previewArrowMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== arrowMargin?.[2] && '' !== arrowMargin?.[2] ? arrowMargin[2] : '',
		undefined !== tabletArrowMargin?.[2] && '' !== tabletArrowMargin?.[2] ? tabletArrowMargin[2] : '',
		undefined !== mobileArrowMargin?.[2] && '' !== mobileArrowMargin?.[2] ? mobileArrowMargin[2] : ''
	);
	const previewArrowMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== arrowMargin?.[3] && '' !== arrowMargin?.[3] ? arrowMargin[3] : '',
		undefined !== tabletArrowMargin?.[3] && '' !== tabletArrowMargin?.[3] ? tabletArrowMargin[3] : '',
		undefined !== mobileArrowMargin?.[3] && '' !== mobileArrowMargin?.[3] ? mobileArrowMargin[3] : ''
	);
	const previewArrowMarginUnit = arrowMarginUnit ? arrowMarginUnit : 'px';

	const galleryDotStyle = useMemo(() => applyFilters('kadence.galleryDotStyle', dotStyleOptions), []);

	const theImages = imagesDynamic ?? [];
	const hasImages = !!theImages.length;
	const onColumnChange = (value) => {
		let columnArray = [];
		if (1 === value) {
			columnArray = [1, 1, 1, 1, 1, 1];
		} else if (2 === value) {
			columnArray = [2, 2, 2, 2, 1, 1];
		} else if (3 === value) {
			columnArray = [3, 3, 3, 2, 1, 1];
		} else if (4 === value) {
			columnArray = [4, 4, 4, 3, 2, 2];
		} else if (5 === value) {
			columnArray = [5, 5, 5, 4, 4, 3];
		} else if (6 === value) {
			columnArray = [6, 6, 6, 4, 4, 3];
		} else if (7 === value) {
			columnArray = [7, 7, 7, 5, 5, 4];
		} else if (8 === value) {
			columnArray = [8, 8, 8, 6, 4, 4];
		}
		setAttributes({ columns: columnArray });
	};
	const onThumbColumnChange = (value) => {
		let columnArray = [];
		if (1 === value) {
			columnArray = [1, 1, 1, 1, 1, 1];
		} else if (2 === value) {
			columnArray = [2, 2, 2, 2, 2, 2];
		} else if (3 === value) {
			columnArray = [3, 3, 3, 3, 3, 3];
		} else if (4 === value) {
			columnArray = [4, 4, 4, 4, 4, 4];
		} else if (5 === value) {
			columnArray = [5, 5, 5, 4, 4, 4];
		} else if (6 === value) {
			columnArray = [6, 6, 6, 4, 4, 4];
		} else if (7 === value) {
			columnArray = [7, 7, 7, 5, 5, 4];
		} else if (8 === value) {
			columnArray = [8, 8, 8, 6, 4, 4];
		} else if (9 === value) {
			columnArray = [9, 9, 9, 7, 5, 5];
		} else if (10 === value) {
			columnArray = [10, 10, 10, 8, 6, 6];
		}
		setAttributes({ thumbnailColumns: columnArray });
	};
	const saveShadow = (value) => {
		const newUpdate = shadow.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadow: newUpdate,
		});
	};
	const saveShadowHover = (value) => {
		const newUpdate = shadowHover.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			shadowHover: newUpdate,
		});
	};
	const saveMargin = (value) => {
		const newUpdate = margin.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			margin: newUpdate,
		});
	};

	const marginMouseOver = mouseOverVisualizer();
	const paddingMouseOver = mouseOverVisualizer();

	const marginMin = marginUnit === 'em' || marginUnit === 'rem' ? -25 : -999;
	const marginMax = marginUnit === 'em' || marginUnit === 'rem' ? 25 : 999;
	const marginStep = marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1;

	const columnControlTypes = [
		{ key: 'linked', name: __('Linked', 'kadence-blocks'), icon: __('Linked', 'kadence-blocks') },
		{ key: 'individual', name: __('Individual', 'kadence-blocks'), icon: __('Individual', 'kadence-blocks') },
	];
	const gconfig = {
		google: {
			families: [captionStyles[0].family + (captionStyles[0].variant ? ':' + captionStyles[0].variant : '')],
		},
	};
	const config = captionStyles[0].google ? gconfig : '';
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

	const carouselSettings = {
		type: 'slide',
		autoplay: autoPlay,
		rewind: true,
		pagination: dotStyle === 'none' ? false : true,
		arrows: arrowStyle === 'none' ? false : true,
		speed: transSpeed,
		drag: false,
		perPage: previewColumns,
		interval: autoSpeed,
		gap: previewGutter ? previewGutter + previewGutterUnit : '0',
		direction: isRTL ? 'rtl' : 'ltr',
	};

	if (carouselSettings.perPage === 1 || slidesScroll === '1') {
		carouselSettings.focus = 0;
		carouselSettings.perMove = 1;
		carouselSettings.type = 'loop';
	}

	const fluidCarouselSettings = {
		type: 'loop',
		autoplay: autoPlay,
		rewind: true,
		arrows: arrowStyle === 'none' ? false : true,
		perPage: 1,
		speed: transSpeed,
		interval: autoSpeed,
		autoWidth: true,
		drag: false,
		pagination: dotStyle === 'none' ? false : true,
		focus: carouselAlign === false ? 0 : 'center',
		gap: previewGutter ? previewGutter + previewGutterUnit : '0',
		direction: isRTL ? 'rtl' : 'ltr',
	};
	const sliderSettings = {
		type: slideType,
		dots: dotStyle === 'none' ? false : true,
		arrows: arrowStyle === 'none' ? false : true,
		rewind: true,
		perPage: 1,
		fade: true,
		clones: 0,
		speed: transSpeed,
		drag: false,
		interval: autoSpeed,
		autoplay: autoPlay,
		direction: isRTL ? 'rtl' : 'ltr',
	};
	const thumbsliderSettings = {
		type: slideType,
		dots: false,
		arrows: arrowStyle === 'none' ? false : true,
		rewind: true,
		fade: true,
		speed: transSpeed,
		drag: false,
		pagination: false,
		autoplaySpeed: autoSpeed,
		autoplay: autoPlay,
		slidesToShow: 1,
		slidesToScroll: 1,
		direction: isRTL ? 'rtl' : 'ltr',
	};
	const thumbsliderthumbsSettings = {
		focus: 0,
		height: '100%',
		perPage: previewThumbColumns,
		speed: transSpeed,
		gap: '' !== previewGutter ? previewGutter + previewGutterUnit : '4px',
		rewind: true,
		pagination: false,
		isNavigation: true,
		arrows: previewThumbColumns > theImages.length ? false : true,
		direction: isRTL ? 'rtl' : 'ltr',
	};
	const nonTransAttrs = ['images', 'imagesDynamic'];
	const controls = (
		<BlockControls>
			{hasImages && !dynamicSource && (
				<ToolbarGroup>
					<MediaUpload
						onSelect={(imgs) => onSelectImages(imgs, 3)}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						multiple
						gallery
						value={imagesDynamic.map((img) => img.id)}
						render={({ open }) => (
							<ToolbarButton
								className="components-toolbar__control"
								label={__('Edit/Add gallery images', 'kadence-blocks')}
								icon={gallery}
								onClick={open}
							/>
						)}
					/>
				</ToolbarGroup>
			)}
			<CopyPasteAttributes
				attributes={attributes}
				excludedAttrs={nonTransAttrs}
				defaultAttributes={metadata.attributes}
				blockSlug={metadata.name}
				onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
			/>
		</BlockControls>
	);
	const typeLabel = galleryTypes.filter((item) => item.value === type);
	const sidebarControls = (
		<>
			{showSettings('allSettings', 'kadence/advancedgallery') && (
				<InspectorControls>
					<InspectorControlTabs
						panelName={'advancedgallery'}
						setActiveTab={(value) => setActiveTab(value)}
						activeTab={activeTab}
					/>

					{activeTab === 'general' && (
						<>
							<KadencePanelBody panelName={'kb-gallery-settings'}>
								{kadence_blocks_params.dynamic_enabled && dynamicSource && (
									<DynamicGalleryControl dynamicAttribute="images" {...props} />
								)}
								<KadenceRadioButtons
									value={type}
									options={galleryTypes}
									wrap={true}
									hideLabel={true}
									label={
										__('Gallery Type:', 'kadence-blocks') +
										' ' +
										(undefined !== typeLabel && undefined !== typeLabel[0] && typeLabel[0].label
											? typeLabel[0].label
											: 'Masonry')
									}
									className={'kb-gallery-type-select'}
									onChange={(value) => {
										setAttributes({
											type: value,
										});
									}}
								/>
								{(type === 'grid' ||
									type === 'carousel' ||
									type === 'slider' ||
									type === 'thumbslider') && (
									<SelectControl
										label={__('Image ratio', 'kadence-blocks')}
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
											{
												label: __('Inherit', 'kadence-blocks'),
												value: 'inherit',
											},
										]}
										value={imageRatio}
										onChange={(value) => setAttributes({ imageRatio: value })}
									/>
								)}
								{type === 'thumbslider' && (
									<SelectControl
										label={__('Thumbnail Image ratio', 'kadence-blocks')}
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
											{
												label: __('Inherit', 'kadence-blocks'),
												value: 'inherit',
											},
										]}
										value={thumbnailRatio}
										onChange={(value) => setAttributes({ thumbnailRatio: value })}
									/>
								)}
								{type && (type === 'carousel' || type === 'grid' || type === 'masonry') && (
									<>
										<ButtonGroup
											className="kt-size-type-options kt-outline-control"
											aria-label={__('Column Control Type', 'kadence-blocks')}
										>
											{map(columnControlTypes, ({ name, key, icon }) => (
												<Tooltip text={name}>
													<Button
														key={key}
														className="kt-size-btn"
														isSmall
														isPrimary={columnControl === key}
														aria-pressed={columnControl === key}
														onClick={() => setAttributes({ columnControl: key })}
													>
														{icon}
													</Button>
												</Tooltip>
											))}
										</ButtonGroup>
										{columnControl !== 'individual' && (
											<StepControls
												label={__('Columns', 'kadence-blocks')}
												value={columns[2]}
												onChange={onColumnChange}
												min={1}
												max={8}
											/>
										)}
										{columnControl && columnControl === 'individual' && (
											<>
												<h4>{__('Columns', 'kadence-blocks')}</h4>
												<RangeControl
													label={__('Screen Above 1500px', 'kadence-blocks')}
													value={columns[0]}
													onChange={(value) =>
														setAttributes({
															columns: [
																value,
																columns[1],
																columns[2],
																columns[3],
																columns[4],
																columns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 1200px - 1499px', 'kadence-blocks')}
													value={columns[1]}
													onChange={(value) =>
														setAttributes({
															columns: [
																columns[0],
																value,
																columns[2],
																columns[3],
																columns[4],
																columns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 992px - 1199px', 'kadence-blocks')}
													value={columns[2]}
													onChange={(value) =>
														setAttributes({
															columns: [
																columns[0],
																columns[1],
																value,
																columns[3],
																columns[4],
																columns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 768px - 991px', 'kadence-blocks')}
													value={columns[3]}
													onChange={(value) =>
														setAttributes({
															columns: [
																columns[0],
																columns[1],
																columns[2],
																value,
																columns[4],
																columns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 544px - 767px', 'kadence-blocks')}
													value={columns[4]}
													onChange={(value) =>
														setAttributes({
															columns: [
																columns[0],
																columns[1],
																columns[2],
																columns[3],
																value,
																columns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen Below 543px', 'kadence-blocks')}
													value={columns[5]}
													onChange={(value) =>
														setAttributes({
															columns: [
																columns[0],
																columns[1],
																columns[2],
																columns[3],
																columns[4],
																value,
															],
														})
													}
													min={1}
													max={8}
												/>
											</>
										)}
									</>
								)}
								{type && type === 'thumbslider' && (
									<>
										<ButtonGroup
											className="kt-size-type-options kt-outline-control"
											aria-label={__('Thumb Column Control Type', 'kadence-blocks')}
										>
											{map(columnControlTypes, ({ name, key, icon }) => (
												<Tooltip text={name}>
													<Button
														key={key}
														className="kt-size-btn"
														isSmall
														isPrimary={thumbnailControl === key}
														aria-pressed={thumbnailControl === key}
														onClick={() => setAttributes({ thumbnailControl: key })}
													>
														{icon}
													</Button>
												</Tooltip>
											))}
										</ButtonGroup>
										{thumbnailControl !== 'individual' && (
											<RangeControl
												label={__('Thumbnail Columns', 'kadence-blocks')}
												value={thumbnailColumns[2]}
												onChange={onThumbColumnChange}
												min={1}
												max={10}
											/>
										)}
										{thumbnailControl && thumbnailControl === 'individual' && (
											<>
												<h4>{__('Columns', 'kadence-blocks')}</h4>
												<RangeControl
													label={__('Screen Above 1500px', 'kadence-blocks')}
													value={thumbnailColumns[0]}
													onChange={(value) =>
														setAttributes({
															thumbnailColumns: [
																value,
																thumbnailColumns[1],
																thumbnailColumns[2],
																thumbnailColumns[3],
																thumbnailColumns[4],
																thumbnailColumns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 1200px - 1499px', 'kadence-blocks')}
													value={thumbnailColumns[1]}
													onChange={(value) =>
														setAttributes({
															thumbnailColumns: [
																thumbnailColumns[0],
																value,
																thumbnailColumns[2],
																thumbnailColumns[3],
																thumbnailColumns[4],
																thumbnailColumns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 992px - 1199px', 'kadence-blocks')}
													value={thumbnailColumns[2]}
													onChange={(value) =>
														setAttributes({
															thumbnailColumns: [
																thumbnailColumns[0],
																thumbnailColumns[1],
																value,
																thumbnailColumns[3],
																thumbnailColumns[4],
																thumbnailColumns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 768px - 991px', 'kadence-blocks')}
													value={thumbnailColumns[3]}
													onChange={(value) =>
														setAttributes({
															thumbnailColumns: [
																thumbnailColumns[0],
																thumbnailColumns[1],
																thumbnailColumns[2],
																value,
																thumbnailColumns[4],
																thumbnailColumns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen 544px - 767px', 'kadence-blocks')}
													value={thumbnailColumns[4]}
													onChange={(value) =>
														setAttributes({
															thumbnailColumns: [
																thumbnailColumns[0],
																thumbnailColumns[1],
																thumbnailColumns[2],
																thumbnailColumns[3],
																value,
																thumbnailColumns[5],
															],
														})
													}
													min={1}
													max={8}
												/>
												<RangeControl
													label={__('Screen Below 543px', 'kadence-blocks')}
													value={thumbnailColumns[5]}
													onChange={(value) =>
														setAttributes({
															thumbnailColumns: [
																thumbnailColumns[0],
																thumbnailColumns[1],
																thumbnailColumns[2],
																thumbnailColumns[3],
																thumbnailColumns[4],
																value,
															],
														})
													}
													min={1}
													max={8}
												/>
											</>
										)}
									</>
								)}
								{type && type === 'mosaic' && (
									<ResponsiveRangeControls
										label={__('Mosaic Single Row Height', 'kadence-blocks')}
										value={'' !== mosaicRowHeight?.[0] ? mosaicRowHeight[0] : ''}
										onChange={(value) =>
											setAttributes({
												mosaicRowHeight: [
													value,
													'' !== mosaicRowHeight?.[1] ? mosaicRowHeight[1] : '',
													'' !== mosaicRowHeight?.[2] ? mosaicRowHeight[2] : '',
												],
											})
										}
										tabletValue={'' !== mosaicRowHeight?.[1] ? mosaicRowHeight[1] : ''}
										onChangeTablet={(value) =>
											setAttributes({
												mosaicRowHeight: [
													'' !== mosaicRowHeight?.[0] ? mosaicRowHeight[0] : '',
													value,
													'' !== mosaicRowHeight?.[2] ? mosaicRowHeight[2] : '',
												],
											})
										}
										mobileValue={'' !== mosaicRowHeight?.[2] ? mosaicRowHeight[2] : ''}
										onChangeMobile={(value) =>
											setAttributes({
												mosaicRowHeight: [
													'' !== mosaicRowHeight?.[0] ? mosaicRowHeight[0] : '',
													'' !== mosaicRowHeight?.[1] ? mosaicRowHeight[1] : '',
													value,
												],
											})
										}
										min={0}
										max={mosaicRowHeightUnit !== 'px' ? 50 : 500}
										step={mosaicRowHeightUnit !== 'px' ? 0.1 : 1}
										unit={mosaicRowHeightUnit}
										onUnit={(value) => setAttributes({ mosaicRowHeightUnit: value })}
										units={['px', 'em', 'rem']}
										reset={() => {
											switch (previewDevice) {
												case 'Desktop':
													setAttributes({
														mosaicRowHeight: [150, mosaicRowHeight[1], mosaicRowHeight[2]],
													});
													break;
												case 'Tablet':
													setAttributes({
														mosaicRowHeight: [mosaicRowHeight[0], '', mosaicRowHeight[2]],
													});
													break;
												case 'Mobile':
													setAttributes({
														mosaicRowHeight: [mosaicRowHeight[0], mosaicRowHeight[1], ''],
													});
													break;
											}
										}}
									/>
								)}
								{type !== 'slider' && showSettings('gutterSettings', 'kadence/advancedgallery') && (
									<>
										<ResponsiveRangeControls
											label={__('Gutter', 'kadence-blocks')}
											value={'' !== gutter?.[0] ? gutter[0] : ''}
											onChange={(value) =>
												setAttributes({
													gutter: [
														value,
														'' !== gutter?.[1] ? gutter[1] : '',
														'' !== gutter?.[2] ? gutter[2] : '',
													],
												})
											}
											tabletValue={'' !== gutter?.[1] ? gutter[1] : ''}
											onChangeTablet={(value) =>
												setAttributes({
													gutter: [
														'' !== gutter?.[0] ? gutter[0] : '',
														value,
														'' !== gutter?.[2] ? gutter[2] : '',
													],
												})
											}
											mobileValue={'' !== gutter?.[2] ? gutter[2] : ''}
											onChangeMobile={(value) =>
												setAttributes({
													gutter: [
														'' !== gutter?.[0] ? gutter[0] : '',
														'' !== gutter?.[1] ? gutter[1] : '',
														value,
													],
												})
											}
											min={0}
											max={gutterUnit !== 'px' ? 12 : 200}
											step={gutterUnit !== 'px' ? 0.1 : 1}
											unit={gutterUnit}
											onUnit={(value) => setAttributes({ gutterUnit: value })}
											units={['px', 'em', 'rem']}
										/>
									</>
								)}
								{(type === 'fluidcarousel' || type === 'tiles') && (
									<>
										<ResponsiveRangeControls
											label={
												type === 'tiles'
													? __('Row Height', 'kadence-blocks')
													: __('Carousel Height', 'kadence-blocks')
											}
											value={
												undefined !== carouselHeight && undefined !== carouselHeight[0]
													? carouselHeight[0]
													: ''
											}
											onChange={(value) =>
												setAttributes({
													carouselHeight: [
														value,
														undefined !== carouselHeight && undefined !== carouselHeight[1]
															? carouselHeight[1]
															: '',
														undefined !== carouselHeight && undefined !== carouselHeight[2]
															? carouselHeight[2]
															: '',
													],
												})
											}
											tabletValue={
												undefined !== carouselHeight && undefined !== carouselHeight[1]
													? carouselHeight[1]
													: ''
											}
											onChangeTablet={(value) =>
												setAttributes({
													carouselHeight: [
														undefined !== carouselHeight && undefined !== carouselHeight[0]
															? carouselHeight[0]
															: '',
														value,
														undefined !== carouselHeight && undefined !== carouselHeight[2]
															? carouselHeight[2]
															: '',
													],
												})
											}
											mobileValue={
												undefined !== carouselHeight && undefined !== carouselHeight[2]
													? carouselHeight[2]
													: ''
											}
											onChangeMobile={(value) =>
												setAttributes({
													carouselHeight: [
														undefined !== carouselHeight && undefined !== carouselHeight[0]
															? carouselHeight[0]
															: '',
														undefined !== carouselHeight && undefined !== carouselHeight[1]
															? carouselHeight[1]
															: '',
														value,
													],
												})
											}
											step={1}
											min={120}
											max={800}
											unit={'px'}
											showUnit={true}
											units={['px']}
										/>
										{type === 'fluidcarousel' && (
											<ToggleControl
												label={__('Carousel Center Mode', 'kadence-blocks')}
												checked={carouselAlign}
												onChange={(value) => setAttributes({ carouselAlign: value })}
											/>
										)}
									</>
								)}
								{ids && undefined !== ids[0] && !dynamicSource && (
									<BaseControl>
										<ImageSizeControl
											label={__('Thumbnail Image Sizes', 'kadence-blocks')}
											slug={thumbSize}
											id={ids[0]}
											fullSelection={true}
											selectByValue={false}
											onChange={(value) => changeImageThumbSize(value)}
										/>
									</BaseControl>
								)}
								{ids &&
									undefined !== ids[0] &&
									imagesDynamic &&
									imagesDynamic.length > 1 &&
									!dynamicSource && (
										<BaseControl __nextHasNoMarginBottom>
											<Button
												className="reverse-order"
												variant="secondary"
												text={__('Reverse Image Order', 'kadence-blocks')}
												icon={previous}
												onClick={() => {
													// Trigger an update.
													const tempImages = JSON.parse(
														JSON.stringify(imagesDynamic.reverse())
													);
													setAttributes({ imagesDynamic: tempImages });
												}}
											/>
										</BaseControl>
									)}
							</KadencePanelBody>
							{type &&
								(type === 'carousel' ||
									type === 'fluidcarousel' ||
									type === 'slider' ||
									type === 'thumbslider') && (
									<>
										{showSettings('carouselSettings', 'kadence/advancedgallery') && (
											<KadencePanelBody
												title={__('Carousel Settings', 'kadence-blocks')}
												initialOpen={false}
												panelName={'kb-gallery-carousel-settings'}
											>
												<ToggleControl
													label={__('Carousel Auto Play', 'kadence-blocks')}
													checked={autoPlay}
													onChange={(value) => setAttributes({ autoPlay: value })}
												/>
												{autoPlay && (
													<>
														<RangeControl
															label={__('Autoplay Speed', 'kadence-blocks')}
															value={autoSpeed}
															onChange={(value) => setAttributes({ autoSpeed: value })}
															min={0}
															max={15000}
															step={10}
														/>
														<ToggleControl
															label={__('Show Pause Button', 'kadence-blocks')}
															checked={showPauseButton}
															onChange={(value) =>
																setAttributes({ showPauseButton: value })
															}
															help={__(
																'Display a pause/play button in the bottom right corner.',
																'kadence-blocks'
															)}
														/>
													</>
												)}
												{(type === 'thumbslider' || type === 'slider') && (
													<SelectControl
														label={__('Transition Style', 'kadence-blocks')}
														options={[
															{
																label: __('Fade', 'kadence-blocks'),
																value: 'fade',
															},
															{
																label: __('Slide', 'kadence-blocks'),
																value: 'slide',
															},
														]}
														value={slideType ? slideType : 'fade'}
														onChange={(value) => setAttributes({ slideType: value })}
													/>
												)}
												<RangeControl
													label={__('Carousel Slide Transition Speed', 'kadence-blocks')}
													value={transSpeed}
													onChange={(value) => setAttributes({ transSpeed: value })}
													min={100}
													max={15000}
													step={10}
												/>
												{type === 'carousel' && (
													<SelectControl
														label={__('Slides to Scroll', 'kadence-blocks')}
														options={[
															{
																label: __('One', 'kadence-blocks'),
																value: '1',
															},
															{
																label: __('All', 'kadence-blocks'),
																value: 'all',
															},
														]}
														value={slidesScroll}
														onChange={(value) => setAttributes({ slidesScroll: value })}
													/>
												)}
												<ToggleControl
													label={__('Enable Image Lazy Load', 'kadence-blocks')}
													checked={lazyLoad}
													onChange={(value) => setAttributes({ lazyLoad: value })}
												/>
												{type === 'carousel' && (
													<ToggleControl
														label={__('Enable Carousel Overflow', 'kadence-blocks')}
														checked={overflow}
														onChange={(value) => setAttributes({ overflow: value })}
													/>
												)}
											</KadencePanelBody>
										)}
									</>
								)}
							<KadencePanelBody
								title={__('Link Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-gallery-link-settings'}
							>
								<SelectControl
									label={__('Link To', 'kadence-blocks')}
									value={linkTo}
									onChange={(value) => setAttributes({ linkTo: value })}
									options={linkOptions}
								/>
								{linkTo === 'custom' && dynamicSource && (
									<DynamicLinkControl dynamicAttribute="link" {...props} />
								)}
								{linkTo === 'media' && (
									<>
										{ids && undefined !== ids[0] && !dynamicSource && (
											<ImageSizeControl
												label={__('Link Image Size', 'kadence-blocks')}
												slug={lightSize}
												id={ids[0]}
												fullSelection={true}
												selectByValue={false}
												onChange={(value) => changeImageLightSize(value)}
											/>
										)}
										{showSettings('lightboxSettings', 'kadence/advancedgallery') && (
											<>
												<SelectControl
													label={__('Link Triggers?', 'kadence-blocks')}
													value={lightbox}
													onChange={(value) => setAttributes({ lightbox: value })}
													options={[
														{
															label: __('None', 'kadence-blocks'),
															value: 'none',
														},
														{
															label: __('Lightbox', 'kadence-blocks'),
															value: 'magnific',
														},
														{
															label: __('New Tab', 'kadence-blocks'),
															value: 'new_tab',
														},
													]}
												/>
												{lightbox && lightbox === 'magnific' && (
													<ToggleControl
														label={__('Show Caption in Lightbox', 'kadence-blocks')}
														checked={lightboxCaption}
														onChange={(value) => setAttributes({ lightboxCaption: value })}
													/>
												)}
											</>
										)}
									</>
								)}
							</KadencePanelBody>
							{showSettings('captionSettings', 'kadence/advancedgallery') && (
								<KadencePanelBody
									title={__('Caption Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-gallery-caption-settings'}
								>
									<ToggleControl
										label={__('Show Captions', 'kadence-blocks')}
										checked={showCaption}
										onChange={() => setCaptions()}
									/>
									{showCaption && (
										<>
											<SelectControl
												label={__('Caption Placement', 'kadence-blocks')}
												options={[
													{
														label: __('Bottom of Image - Show on Hover', 'kadence-blocks'),
														value: 'bottom-hover',
													},
													{
														label: __('Bottom of Image - Show always', 'kadence-blocks'),
														value: 'bottom',
													},
													{
														label: __('Below Image - Show always', 'kadence-blocks'),
														value: 'below',
													},
													{
														label: __('Cover Image - Show on Hover', 'kadence-blocks'),
														value: 'cover-hover',
													},
												]}
												value={captionStyle}
												onChange={(value) => setAttributes({ captionStyle: value })}
											/>
											{('cover-hover' === captionStyle || 'bottom-hover' === captionStyle) && (
												<ToggleControl
													label={__('Force hover effect always for mobile', 'kadence-blocks')}
													checked={mobileForceHover}
													onChange={(value) => setAttributes({ mobileForceHover: value })}
												/>
											)}
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
											<PopColorControl
												label={__('Caption Background', 'kadence-blocks')}
												value={
													captionStyles && captionStyles[0] && captionStyles[0].background
														? captionStyles[0].background
														: ''
												}
												default={'#000000'}
												onChange={(value) => saveCaptionFont({ background: value })}
												opacityValue={
													captionStyles &&
													captionStyles[0] &&
													undefined !== captionStyles[0].backgroundOpacity
														? captionStyles[0].backgroundOpacity
														: 0.5
												}
												onOpacityChange={(value) =>
													saveCaptionFont({ backgroundOpacity: value })
												}
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
							)}
						</>
					)}

					{activeTab === 'style' && (
						<>
							{showSettings('styleSettings', 'kadence/advancedgallery') && (
								<KadencePanelBody
									title={__('Image Style', 'kadence-blocks')}
									panelName={'kb-gallery-image-style'}
								>
									{!(type === 'carousel' && imageRatio === 'inherit') &&
										!(type === 'slider' && imageRatio === 'inherit') && (
											<ResponsiveMeasurementControls
												label={__('Border Radius', 'kadence-blocks')}
												value={imageRadius}
												tabletValue={tabletImageRadius}
												mobileValue={mobileImageRadius}
												onChange={(value) => setAttributes({ imageRadius: value })}
												onChangeTablet={(value) => setAttributes({ tabletImageRadius: value })}
												onChangeMobile={(value) => setAttributes({ mobileImageRadius: value })}
												unit={imageRadiusUnit}
												units={['px', 'em', 'rem', '%']}
												onUnit={(value) => setAttributes({ imageRadiusUnit: value })}
												max={imageRadiusUnit === 'em' || imageRadiusUnit === 'rem' ? 24 : 500}
												step={imageRadiusUnit === 'em' || imageRadiusUnit === 'rem' ? 0.1 : 1}
												min={0}
												isBorderRadius={true}
												allowEmpty={true}
											/>
										)}
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
							)}
							{showSettings('shadowSettings', 'kadence/advancedgallery') && type !== 'mosaic' && (
								<KadencePanelBody
									title={__('Image Shadow', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-gallery-image-shadow'}
								>
									<ToggleControl
										label={__('Enable Shadow', 'kadence-blocks')}
										checked={displayShadow}
										onChange={(value) => setAttributes({ displayShadow: value })}
										help={__(
											'Sliders and carousels will cut off shadows because of how items in a carousel are hidden.',
											'kadence-blocks'
										)}
									/>
									{displayShadow && (
										<TabPanel
											className="kt-inspect-tabs kt-hover-tabs"
											activeClass="active-tab"
											tabs={[
												{
													name: 'normal',
													title: __('Normal', 'kadence-blocks'),
													className: 'kt-normal-tab',
												},
												{
													name: 'hover',
													title: __('Hover', 'kadence-blocks'),
													className: 'kt-hover-tab',
												},
											]}
										>
											{(tab) => {
												let tabout;
												if (tab.name) {
													if ('hover' === tab.name) {
														tabout = (
															<>
																<BoxShadowControl
																	label={__('Hover Box Shadow', 'kadence-blocks')}
																	enable={true}
																	color={
																		shadowHover[0].color ? shadowHover[0].color : ''
																	}
																	colorDefault={'#000000'}
																	opacity={shadowHover[0].opacity}
																	hOffset={shadowHover[0].hOffset}
																	vOffset={shadowHover[0].vOffset}
																	blur={shadowHover[0].blur}
																	spread={shadowHover[0].spread}
																	onColorChange={(value) => {
																		saveShadowHover({ color: value });
																	}}
																	onOpacityChange={(value) => {
																		saveShadowHover({ opacity: value });
																	}}
																	onHOffsetChange={(value) => {
																		saveShadowHover({ hOffset: value });
																	}}
																	onVOffsetChange={(value) => {
																		saveShadowHover({ vOffset: value });
																	}}
																	onBlurChange={(value) => {
																		saveShadowHover({ blur: value });
																	}}
																	onSpreadChange={(value) => {
																		saveShadowHover({ spread: value });
																	}}
																/>
															</>
														);
													} else {
														tabout = (
															<>
																<BoxShadowControl
																	label={__('Box Shadow', 'kadence-blocks')}
																	enable={true}
																	color={shadow[0].color ? shadow[0].color : ''}
																	colorDefault={'#000000'}
																	opacity={shadow[0].opacity}
																	hOffset={shadow[0].hOffset}
																	vOffset={shadow[0].vOffset}
																	blur={shadow[0].blur}
																	spread={shadow[0].spread}
																	onColorChange={(value) => {
																		saveShadow({ color: value });
																	}}
																	onOpacityChange={(value) => {
																		saveShadow({ opacity: value });
																	}}
																	onHOffsetChange={(value) => {
																		saveShadow({ hOffset: value });
																	}}
																	onVOffsetChange={(value) => {
																		saveShadow({ vOffset: value });
																	}}
																	onBlurChange={(value) => {
																		saveShadow({ blur: value });
																	}}
																	onSpreadChange={(value) => {
																		saveShadow({ spread: value });
																	}}
																/>
															</>
														);
													}
												}
												return (
													<div className={tab.className} key={tab.className}>
														{tabout}
													</div>
												);
											}}
										</TabPanel>
									)}
								</KadencePanelBody>
							)}
							{(type === 'carousel' ||
								type === 'fluidcarousel' ||
								type === 'slider' ||
								type === 'thumbslider') && (
								<KadencePanelBody
									title={__('Arrow Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-gallery-carousel-settings'}
								>
									<SelectControl
										label={__('Arrow Style', 'kadence-blocks')}
										options={galleryArrowsStyle}
										value={arrowStyle}
										onChange={(value) => setAttributes({ arrowStyle: value })}
									/>
									{kadence_blocks_params.pro === 'true' && 'custom' === arrowStyle && (
										<>
											<PopColorControl
												label={__('Icon Color', 'kadence-blocks')}
												value={arrowCustomColor ? arrowCustomColor : ''}
												default={''}
												onChange={(value) => {
													setAttributes({ arrowCustomColor: value });
												}}
												swatchLabel2={__('Hover Color', 'kadence-blocks')}
												value2={arrowCustomColorHover ? arrowCustomColorHover : ''}
												default2={''}
												onChange2={(value) => {
													setAttributes({ arrowCustomColorHover: value });
												}}
												swatchLabel3={__('Active Color', 'kadence-blocks')}
												value3={arrowCustomColorActive ? arrowCustomColorActive : ''}
												default3={''}
												onChange3={(value) => {
													setAttributes({ arrowCustomColorActive: value });
												}}
											/>
											<PopColorControl
												label={__('Background Color', 'kadence-blocks')}
												value={arrowCustomColorBackground ? arrowCustomColorBackground : ''}
												default={''}
												onChange={(value) => {
													setAttributes({ arrowCustomColorBackground: value });
												}}
												swatchLabel2={__('Hover Color', 'kadence-blocks')}
												value2={
													arrowCustomColorBackgroundHover
														? arrowCustomColorBackgroundHover
														: ''
												}
												default2={''}
												onChange2={(value) => {
													setAttributes({
														arrowCustomColorBackgroundHover: value,
													});
												}}
												swatchLabel3={__('Active Color', 'kadence-blocks')}
												value3={
													arrowCustomColorBackgroundActive
														? arrowCustomColorBackgroundActive
														: ''
												}
												default3={''}
												onChange3={(value) => {
													setAttributes({
														arrowCustomColorBackgroundActive: value,
													});
												}}
											/>
											<PopColorControl
												label={__('Border Color', 'kadence-blocks')}
												value={arrowCustomColorBorder ? arrowCustomColorBorder : ''}
												default={''}
												onChange={(value) => {
													setAttributes({ arrowCustomColorBorder: value });
												}}
												swatchLabel2={__('Hover Color', 'kadence-blocks')}
												value2={arrowCustomColorBorderHover ? arrowCustomColorBorderHover : ''}
												default2={''}
												onChange2={(value) => {
													setAttributes({
														arrowCustomColorBorderHover: value,
													});
												}}
												swatchLabel3={__('Active Color', 'kadence-blocks')}
												value3={
													arrowCustomColorBorderActive ? arrowCustomColorBorderActive : ''
												}
												default3={''}
												onChange3={(value) => {
													setAttributes({
														arrowCustomColorBorderActive: value,
													});
												}}
											/>
											<RangeControl
												label={__('Border Width', 'kadence-blocks')}
												value={arrowCustomBorderWidth}
												onChange={(value) => setAttributes({ arrowCustomBorderWidth: value })}
												min={0}
												max={10}
												step={1}
											/>
										</>
									)}
									<SelectControl
										label={
											'thumbslider' === type
												? __('Main Arrow Position', 'kadence-blocks')
												: __('Arrow Position', 'kadence-blocks')
										}
										options={galleryArrowsPosition}
										value={arrowPosition}
										onChange={(value) => setAttributes({ arrowPosition: value })}
									/>
									{kadence_blocks_params.pro === 'true' && galleryArrowOptions}
									{type !== 'thumbslider' && (
										<SelectControl
											label={__('Dot Style', 'kadence-blocks')}
											options={galleryDotStyle}
											value={dotStyle}
											onChange={(value) => setAttributes({ dotStyle: value })}
										/>
									)}
									{kadence_blocks_params.pro === 'true' &&
										'custom' === dotStyle &&
										type !== 'thumbslider' && (
											<>
												<PopColorControl
													label={__('Dot Color', 'kadence-blocks')}
													value={dotCustomColor ? dotCustomColor : ''}
													default={''}
													onChange={(value) => {
														setAttributes({ dotCustomColor: value });
													}}
													swatchLabel2={__('Hover Color', 'kadence-blocks')}
													value2={dotCustomColorHover ? dotCustomColorHover : ''}
													default2={''}
													onChange2={(value) => {
														setAttributes({ dotCustomColorHover: value });
													}}
													swatchLabel3={__('Active Color', 'kadence-blocks')}
													value3={dotCustomColorActive ? dotCustomColorActive : ''}
													default3={''}
													onChange3={(value) => {
														setAttributes({ dotCustomColorActive: value });
													}}
												/>
												<PopColorControl
													label={__('Border Color', 'kadence-blocks')}
													value={dotCustomColorBorder ? dotCustomColorBorder : ''}
													default={''}
													onChange={(value) => {
														setAttributes({ dotCustomColorBorder: value });
													}}
													swatchLabel2={__('Hover Color', 'kadence-blocks')}
													value2={dotCustomColorBorderHover ? dotCustomColorBorderHover : ''}
													default2={''}
													onChange2={(value) => {
														setAttributes({ dotCustomColorBorderHover: value });
													}}
													swatchLabel3={__('Active Color', 'kadence-blocks')}
													value3={
														dotCustomColorBorderActive ? dotCustomColorBorderActive : ''
													}
													default3={''}
													onChange3={(value) => {
														setAttributes({ dotCustomColorBorderActive: value });
													}}
												/>
												<RangeControl
													label={__('Border Width', 'kadence-blocks')}
													value={dotCustomBorderWidth}
													onChange={(value) => setAttributes({ dotCustomBorderWidth: value })}
													min={0}
													max={10}
													step={1}
												/>
											</>
										)}
								</KadencePanelBody>
							)}
						</>
					)}

					{activeTab === 'advanced' && (
						<>
							{showSettings('spacingSettings', 'kadence/advancedgallery') && (
								<>
									<KadencePanelBody panelName={'kb-adv-gallery-spacing-settings'}>
										<ResponsiveMeasureRangeControl
											label={__('Padding', 'kadence-blocks')}
											value={padding}
											tabletValue={tabletPadding}
											mobileValue={mobilePadding}
											onChange={(value) => {
												setAttributes({ padding: value });
											}}
											onChangeTablet={(value) => {
												setAttributes({ tabletPadding: value });
											}}
											onChangeMobile={(value) => {
												setAttributes({ mobilePadding: value });
											}}
											min={0}
											max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 999}
											step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
											unit={paddingUnit}
											units={['px', 'em', 'rem', '%', 'vh', 'vw']}
											onUnit={(value) => setAttributes({ paddingUnit: value })}
											onMouseOver={paddingMouseOver.onMouseOver}
											onMouseOut={paddingMouseOver.onMouseOut}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Margin', 'kadence-blocks')}
											value={margin[0].desk}
											tabletValue={margin[0].tablet}
											mobileValue={margin[0].mobile}
											onChange={(value) => {
												saveMargin({ desk: value });
											}}
											onChangeTablet={(value) => {
												saveMargin({ tablet: value });
											}}
											onChangeMobile={(value) => {
												saveMargin({ mobile: value });
											}}
											min={marginMin}
											max={marginMax}
											step={marginStep}
											unit={marginUnit}
											units={['px', 'em', 'rem', '%', 'vh']}
											onUnit={(value) => setAttributes({ marginUnit: value })}
											onMouseOver={marginMouseOver.onMouseOver}
											onMouseOut={marginMouseOver.onMouseOut}
											allowAuto={true}
										/>
									</KadencePanelBody>

									<div className="kt-sidebar-settings-spacer"></div>
								</>
							)}

							<KadenceBlockDefaults
								attributes={attributes}
								defaultAttributes={metadata.attributes}
								blockSlug={'kadence/advancedgallery'}
								excludedAttrs={nonTransAttrs}
							/>
						</>
					)}
				</InspectorControls>
			)}
		</>
	);
	let instructions = '';
	let title = '';
	if (!hasImages) {
		title = __('Gallery', 'kadence-blocks');
		instructions = __('Drag images, upload new ones or select files from your library.', 'kadence-blocks');
	}
	const dynamicMediaPlaceholder = (
		<Placeholder
			label={__('Gallery', 'kadence-blocks')}
			instructions={__('Dynamic source failed to load array of images.', 'kadence-blocks')}
		>
			{kadence_blocks_params.dynamic_enabled ? (
				<DynamicGalleryControl dynamicAttribute="images" {...props} />
			) : undefined}
		</Placeholder>
	);
	const mediaPlaceholder = (
		<KadenceMediaPlaceholder
			labels={{
				title,
				instructions,
			}}
			selectIcon={plusCircleFilled}
			selectLabel={__('Select Images', 'kadence-blocks')}
			onSelect={(imgs) => onSelectImages(imgs, 4)}
			accept="image/*"
			multiple
			className={'kadence-image-upload'}
			allowedTypes={ALLOWED_MEDIA_TYPES}
			dynamicControl={
				kadence_blocks_params.dynamic_enabled ? (
					<DynamicGalleryControl dynamicAttribute="images" {...props} />
				) : undefined
			}
		/>
	);

	const addIcon = (
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path fill="none" d="M0 0h24v24H0V0z" />
			<g>
				<path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
			</g>
		</svg>
	);

	const addMediaPlaceholder = (
		<MediaPlaceholder
			addToGallery={hasImages}
			isAppender={hasImages}
			className={className}
			dropZoneUIOnly={hasImages && !isSelected}
			icon={!hasImages && <BlockIcon icon={addIcon} />}
			labels={{
				title: !hasImages && __('Gallery', 'kadence-blocks'),
				instructions:
					!hasImages &&
					__('Drag images, upload new ones or select files from your library.', 'kadence-blocks'),
			}}
			onSelect={(imgs) => onSelectImages(imgs, 5)}
			accept="image/*"
			allowedTypes={ALLOWED_MEDIA_TYPES}
			multiple
			value={hasImages ? images : undefined}
			onError={() => onUploadError}
			notices={hasImages ? undefined : noticeUI}
		/>
	);
	const buildCSS = (
		<style>
			{`
					.wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-${uniqueID}, .wp-block-kadence-advancedgallery .kb-gallery-type-grid.kb-gallery-id-${uniqueID}, .wp-block-kadence-advancedgallery .kb-gallery-type-masonry.kb-gallery-id-${uniqueID} {
						${previewGutter ? 'margin: -' + previewGutter / 2 + previewGutterUnit + ';' : ''}
					}
					.kb-gallery-id-${uniqueID}.kb-gallery-type-masonry .kadence-blocks-gallery-item, .kb-gallery-id-${uniqueID}.kb-gallery-type-grid .kadence-blocks-gallery-item, .kb-gallery-id-${uniqueID}.kb-gallery-type-tiles .kadence-blocks-gallery-item {
						${previewGutter ? 'padding:' + previewGutter / 2 + previewGutterUnit + ';' : ''}
					}
					.kb-gallery-id-${uniqueID}.kb-gallery-type-thumbslider .kt-blocks-carousel-main {
						${previewGutter ? 'margin-bottom:' + previewGutter + previewGutterUnit + ';' : ''}
					}
					${type === 'carousel' && overflow ? `.kb-gallery-id-${uniqueID} .splide__track { overflow: visible; }` : ``}
					${
						captionStyles && undefined !== captionStyles[0] && undefined !== captionStyles[0].background
							? `.kb-gallery-id-${uniqueID}.kb-gallery-main-contain .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption { background: linear-gradient( 0deg, ` +
								KadenceColorOutput(
									captionStyles[0].background ? captionStyles[0].background : '#000000',
									'' !== captionStyles[0].backgroundOpacity ? captionStyles[0].backgroundOpacity : 0.5
								) +
								' 0, ' +
								KadenceColorOutput(
									captionStyles[0].background ? captionStyles[0].background : '#000000',
									0
								) +
								' 100% );}'
							: ''
					}
					${
						captionStyles && undefined !== captionStyles[0] && undefined !== captionStyles[0].background
							? `.kb-gallery-id-${uniqueID}.kb-gallery-caption-style-cover-hover.kb-gallery-main-contain .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption, .kb-gallery-id-${uniqueID}.kb-gallery-caption-style-below.kb-gallery-main-contain .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption { background:` +
								KadenceColorOutput(
									captionStyles[0].background ? captionStyles[0].background : '#000000',
									'' !== captionStyles[0].backgroundOpacity ? captionStyles[0].backgroundOpacity : 0.5
								) +
								';}'
							: ''
					}
					${
						captionStyles &&
						undefined !== captionStyles[0] &&
						undefined !== captionStyles[0].color &&
						'' !== captionStyles[0].color
							? `.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner figcaption { color:` +
								KadenceColorOutput(captionStyles[0].color) +
								';}'
							: ''
					}
					.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kb-gal-image-radius { box-shadow:${
						displayShadow && type !== 'mosaic'
							? shadow[0].hOffset +
								'px ' +
								shadow[0].vOffset +
								'px ' +
								shadow[0].blur +
								'px ' +
								shadow[0].spread +
								'px ' +
								KadenceColorOutput(shadow[0].color, shadow[0].opacity)
							: 'none'
					}; }
					.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item:hover .kb-gal-image-radius { box-shadow:${
						displayShadow && type !== 'mosaic'
							? shadowHover[0].hOffset +
								'px ' +
								shadowHover[0].vOffset +
								'px ' +
								shadowHover[0].blur +
								'px ' +
								shadowHover[0].spread +
								'px ' +
								KadenceColorOutput(shadowHover[0].color, shadowHover[0].opacity)
							: 'none'
					}; }
					.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kb-gal-image-radius {
						${
							previewImageRadius
								? 'border-radius:' +
									previewImageRadius[0] +
									imageRadiusUnit +
									' ' +
									previewImageRadius[1] +
									imageRadiusUnit +
									' ' +
									previewImageRadius[2] +
									imageRadiusUnit +
									' ' +
									previewImageRadius[3] +
									imageRadiusUnit +
									';'
								: ''
						}
					}
					.kb-gallery-main-contain.kb-gallery-type-fluidcarousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .splide__list figure .kb-gal-image-radius, .kb-gallery-main-contain.kb-gallery-type-fluidcarousel.kb-gallery-id-${uniqueID} .kt-blocks-carousel .splide__list figure .kb-gal-image-radius img {
						${previewHeight ? 'height:' + previewHeight + 'px;' : ''}
					}
					.wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-${uniqueID} > .kadence-blocks-gallery-item, .wp-block-kadence-advancedgallery .kb-gallery-type-tiles.kb-gallery-id-${uniqueID} .kadence-blocks-gallery-item .kadence-blocks-gallery-item-inner img {
						${previewHeight ? 'height:' + previewHeight + 'px;' : ''}
					}
					.kb-gallery-id-${uniqueID} ${
						'center' !== arrowPosition &&
						'outside-top' !== arrowPosition &&
						'outside-bottom' !== arrowPosition
							? '.splide__arrows'
							: '.splide__arrows .splide__arrow'
					} {
						${
							previewArrowMarginTop
								? 'margin-top:' +
									getSpacingOptionOutput(previewArrowMarginTop, previewArrowMarginUnit) +
									';'
								: ''
						}
						${
							previewArrowMarginRight
								? 'margin-right:' +
									getSpacingOptionOutput(previewArrowMarginRight, previewArrowMarginUnit) +
									';'
								: ''
						}
						${
							previewArrowMarginBottom
								? 'margin-bottom:' +
									getSpacingOptionOutput(previewArrowMarginBottom, previewArrowMarginUnit) +
									';'
								: ''
						}
						${
							previewArrowMarginLeft
								? 'margin-left:' +
									getSpacingOptionOutput(previewArrowMarginLeft, previewArrowMarginUnit) +
									';'
								: ''
						}
					}
					${
						previewArrowSize
							? `.kb-gallery-id-${uniqueID} .splide__arrow { font-size:${getFontSizeOptionOutput(
									previewArrowSize,
									previewArrowSizeUnit
								)}; }`
							: ''
					}
					.block-editor-block-list__block[data-type="kadence/advancedgallery"] {
						overflow: visible;
						overflow-x: clip;
					}
					${
						arrowStyle === 'custom'
							? `
							.wp-block-kadence-advancedgallery .kb-gallery-id-${uniqueID} .splide .splide__arrow {
								${arrowCustomColor ? `color: ${KadenceColorOutput(arrowCustomColor)};` : ''}
								${arrowCustomColorBackground ? `background-color: ${KadenceColorOutput(arrowCustomColorBackground)};` : ''}
								${arrowCustomColorBorder ? `border-color: ${KadenceColorOutput(arrowCustomColorBorder)};` : ''}
								${arrowCustomBorderWidth ? `border-width: ${arrowCustomBorderWidth}px;` : ''}
							}
							.wp-block-kadence-advancedgallery .kb-gallery-id-${uniqueID} .splide .splide__arrow:hover {
								${arrowCustomColorHover ? `color: ${KadenceColorOutput(arrowCustomColorHover)};` : ''}
								${arrowCustomColorBackgroundHover ? `background-color: ${KadenceColorOutput(arrowCustomColorBackgroundHover)};` : ''}
								${arrowCustomColorBorderHover ? `border-color: ${KadenceColorOutput(arrowCustomColorBorderHover)};` : ''}
								${arrowCustomBorderWidth ? `border-width: ${arrowCustomBorderWidth}px;` : ''}
							}
							.wp-block-kadence-advancedgallery .kb-gallery-id-${uniqueID} .splide .splide__arrow:active {
								${arrowCustomColorActive ? `color: ${KadenceColorOutput(arrowCustomColorActive)};` : ''}
								${arrowCustomColorBackgroundActive ? `background-color: ${KadenceColorOutput(arrowCustomColorBackgroundActive)};` : ''}
								${arrowCustomColorBorderActive ? `border-color: ${KadenceColorOutput(arrowCustomColorBorderActive)};` : ''}
								${arrowCustomBorderWidth ? `border-width: ${arrowCustomBorderWidth}px;` : ''}
							}
							`
							: ''
					}
					${
						dotStyle === 'custom'
							? `
							.wp-block-kadence-advancedgallery .kb-gallery-id-${uniqueID} .splide .splide__pagination__page {
								${dotCustomColor ? `background-color: ${KadenceColorOutput(dotCustomColor)};` : ''}
								${dotCustomColorBorder ? `border-color: ${KadenceColorOutput(dotCustomColorBorder)};` : ''}
								${dotCustomColorBorder ? `border-width: ${dotCustomBorderWidth ?? '2'}px; border-style: solid;` : ''}
								opacity: unset;
							}
							.wp-block-kadence-advancedgallery .kb-gallery-id-${uniqueID} .splide .splide__pagination__page:hover {
								${dotCustomColorHover ? `background-color: ${KadenceColorOutput(dotCustomColorHover)};` : ''}
								${dotCustomColorBorderHover ? `border-color: ${KadenceColorOutput(dotCustomColorBorderHover)};` : ''}
								${dotCustomColorBorderHover ? `border-width: ${dotCustomBorderWidth ?? '2'}px; border-style: solid;` : ''}
								opacity: unset;
							}
							.wp-block-kadence-advancedgallery .kb-gallery-id-${uniqueID} .splide .splide__pagination__page.is-active {
								${dotCustomColorActive ? `background-color: ${KadenceColorOutput(dotCustomColorActive)};` : ''}
								${dotCustomColorBorderActive ? `border-color: ${KadenceColorOutput(dotCustomColorBorderActive)};` : ''}
								${dotCustomColorBorderActive ? `border-width: ${dotCustomBorderWidth ?? '2'}px; border-style: solid;` : ''}
								opacity: unset;
							}
							`
							: ''
					}
			`}
		</style>
	);
	if (!hasImages || theImages.constructor !== Array) {
		return (
			<div {...blockProps}>
				{controls}
				{sidebarControls}
				{theImages.constructor !== Array && dynamicSource ? dynamicMediaPlaceholder : mediaPlaceholder}
			</div>
		);
	}
	const galleryClassNames = classnames('kb-gallery-main-contain', {
		[`kb-gallery-type-${type}`]: type,
		[`kb-gallery-id-${uniqueID}`]: uniqueID,
		[`kb-gallery-caption-style-${captionStyle}`]: captionStyle,
		[`kb-gallery-filter-${imageFilter}`]: imageFilter,
		[`kb-gallery-preview-columns-${previewColumns}`]:
			(type === 'grid' || type === 'masonry' || type === 'carousel') && previewColumns,
	});
	const renderGalleryImages = (img, index, thumbnail = false) => {
		const ariaLabel = sprintf(
			/* translators: %1$d is the order number of the image, %2$d is the total number of images. */
			__('image %1$d of %2$d in gallery', 'kadence-blocks'),
			index + 1,
			theImages.length
		);
		const ratio = thumbnail ? thumbnailRatio : imageRatio;
		return (
			<div className="kadence-blocks-gallery-item-inner">
				<GalleryImage
					thumbUrl={img.thumbUrl}
					url={img.url}
					width={img.width}
					height={img.height}
					lightUrl={img.lightUrl}
					alt={img.alt}
					id={img.id}
					index={index}
					link={img.link}
					linkTo={linkTo}
					isFirstItem={index === 0}
					isLastItem={index + 1 === theImages.length}
					isSelected={isSelected && selectedImage === index}
					onMoveBackward={() => {
						onMoveBackward(index);
					}}
					onMoveForward={() => {
						onMoveForward(index);
					}}
					onRemove={() => {
						onRemoveImage(index);
					}}
					onSelect={(index) => {
						onSelectImage(index);
					}}
					setAttributes={(attrs) => {
						setImageAttributes(index, attrs);
					}}
					caption={img.caption}
					customLink={img.customLink}
					linkTarget={img.linkTarget}
					linkSponsored={img.linkSponsored}
					setLinkAttributes={(attrs) => {
						setLinkAttributes(index, attrs);
					}}
					showCaption={showCaption}
					captionStyles={captionStyles}
					captionStyle={captionStyle}
					aria-label={ariaLabel}
					imageRatio={ratio}
					type={type}
					thumbnail={thumbnail}
					dynamicSource={dynamicSource}
					previewDevice={previewDevice}
				/>
			</div>
		);
	};

	return (
		<div {...blockProps}>
			<SpacingVisualizer
				type="outsideVertical"
				//offset={ false }
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, previewMarginUnit),
					getSpacingOptionOutput(previewMarginRight, previewMarginUnit),
					getSpacingOptionOutput(previewMarginBottom, previewMarginUnit),
					getSpacingOptionOutput(previewMarginLeft, previewMarginUnit),
				]}
			/>
			<SpacingVisualizer
				style={{
					marginLeft:
						undefined !== previewMarginLeft
							? getSpacingOptionOutput(previewMarginLeft, previewMarginUnit)
							: undefined,
					marginRight:
						undefined !== previewMarginRight
							? getSpacingOptionOutput(previewMarginRight, previewMarginUnit)
							: undefined,
					//marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, previewMarginUnit ) : undefined ),
					//marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, previewMarginUnit ) : undefined ),
				}}
				type="inside"
				forceShow={paddingMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewPaddingTop, previewPaddingUnit),
					getSpacingOptionOutput(previewPaddingRight, previewPaddingUnit),
					getSpacingOptionOutput(previewPaddingBottom, previewPaddingUnit),
					getSpacingOptionOutput(previewPaddingLeft, previewPaddingUnit),
				]}
			/>
			{buildCSS}
			{controls}
			{sidebarControls}
			{noticeUI}
			{showCaption && captionStyles[0].google && <WebfontLoader config={config}></WebfontLoader>}
			{type && type === 'fluidcarousel' && (
				<div id={`kb-gallery-id-${uniqueID}`} style={spacingSettings} className={galleryClassNames}>
					<div
						className={`kt-blocks-carousel kt-blocks-fluid-carousel kt-carousel-container-dotstyle-${dotStyle}${
							carouselAlign === false ? ' kb-carousel-mode-align-left' : ''
						}`}
					>
						{theImages.length !== 1 && (
							<Splide
								options={fluidCarouselSettings}
								className={`splide kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle} kb-slider-group-${
									'center' !== arrowPosition &&
									'outside-top-center' !== arrowPosition &&
									'outside-bottom-center' !== arrowPosition
										? 'arrows'
										: 'arrow'
								} kb-slider-arrow-position-${arrowPosition}`}
							>
								{theImages.map((img, index) => {
									return (
										<SplideSlide className={'kadence-blocks-gallery-item'} key={img.id || img.url}>
											{renderGalleryImages(img, index)}
										</SplideSlide>
									);
								})}
							</Splide>
						)}
						{theImages.length === 1 &&
							theImages.map((img, index) => {
								return (
									<div className="kadence-blocks-gallery-item" key={img.id || img.url}>
										{renderGalleryImages(img, index)}
									</div>
								);
							})}
					</div>
					{autoPlay && showPauseButton && (
						<button
							className="kb-gallery-pause-button"
							style={{
								position: 'absolute',
								bottom: '10px',
								right: '10px',
								background: 'rgba(0, 0, 0, 0.5)',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								padding: '8px 12px',
								cursor: 'pointer',
								fontSize: '14px',
								zIndex: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClick={(e) => e.preventDefault()}
							aria-label={__('Pause carousel', 'kadence-blocks')}
						>
							<svg
								className="kb-gallery-pause-icon"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect x="6" y="4" width="4" height="16" fill="currentColor" />
								<rect x="14" y="4" width="4" height="16" fill="currentColor" />
							</svg>
						</button>
					)}
				</div>
			)}
			{type && type === 'slider' && (
				<div className={galleryClassNames} style={spacingSettings}>
					<div className={`kt-blocks-carousel kt-blocks-slider kt-carousel-container-dotstyle-${dotStyle}`}>
						{theImages.length !== 1 && (
							<Splide
								options={sliderSettings}
								className={`splide kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle} kb-slider-group-${
									'center' !== arrowPosition &&
									'outside-top-center' !== arrowPosition &&
									'outside-bottom-center' !== arrowPosition
										? 'arrows'
										: 'arrow'
								} kb-slider-arrow-position-${arrowPosition}`}
							>
								{theImages.map((img, index) => {
									return (
										<SplideSlide className={'kadence-blocks-gallery-item'} key={img.id || img.url}>
											{renderGalleryImages(img, index)}
										</SplideSlide>
									);
								})}
							</Splide>
						)}
						{theImages.length === 1 &&
							theImages.map((img, index) => {
								return (
									<div className="kadence-blocks-gallery-item" key={img.id || img.url}>
										{renderGalleryImages(img, index)}
									</div>
								);
							})}
					</div>
					{autoPlay && showPauseButton && (
						<button
							className="kb-gallery-pause-button"
							style={{
								position: 'absolute',
								bottom: '10px',
								right: '10px',
								background: 'rgba(0, 0, 0, 0.5)',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								padding: '8px 12px',
								cursor: 'pointer',
								fontSize: '14px',
								zIndex: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClick={(e) => e.preventDefault()}
							aria-label={__('Pause carousel', 'kadence-blocks')}
						>
							<svg
								className="kb-gallery-pause-icon"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect x="6" y="4" width="4" height="16" fill="currentColor" />
								<rect x="14" y="4" width="4" height="16" fill="currentColor" />
							</svg>
						</button>
					)}
				</div>
			)}
			{type && type === 'thumbslider' && (
				<div className={galleryClassNames} style={spacingSettings}>
					<div className={`kt-blocks-carousel kt-blocks-slider kt-carousel-container-dotstyle-${dotStyle}`}>
						{theImages.length !== 1 && (
							<>
								<Splide
									options={thumbsliderSettings}
									ref={mainRef}
									className={`splide kt-blocks-carousel-main kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle} kb-slider-group-${
										'center' !== arrowPosition &&
										'outside-top-center' !== arrowPosition &&
										'outside-bottom-center' !== arrowPosition
											? 'arrows'
											: 'arrow'
									} kb-slider-arrow-position-${arrowPosition}`}
								>
									{theImages.map((img, index) => {
										return (
											<SplideSlide
												className={'kadence-blocks-gallery-item'}
												key={img.id || img.url}
											>
												{renderGalleryImages(img, index)}
											</SplideSlide>
										);
									})}
								</Splide>
								<Splide
									options={thumbsliderthumbsSettings}
									ref={thumbsRef}
									className={`splide kt-carousel-arrowstyle-${arrowStyle} kt-blocks-carousel-thumbnails kb-cloned-${
										theImages.length < thumbnailColumns[0] ? 'hide' : 'show'
									} kt-carousel-dotstyle-none`}
								>
									{theImages.map((img, index) => {
										return (
											<SplideSlide
												className={'kadence-blocks-gallery-item'}
												key={img.id || img.url}
											>
												{renderGalleryImages(img, index, true)}
											</SplideSlide>
										);
									})}
								</Splide>
							</>
						)}
						{theImages.length === 1 &&
							theImages.map((img, index) => {
								return (
									<div className="kadence-blocks-gallery-item" key={img.id || img.url}>
										{renderGalleryImages(img, index)}
									</div>
								);
							})}
					</div>
					{autoPlay && showPauseButton && (
						<button
							className="kb-gallery-pause-button"
							style={{
								position: 'absolute',
								bottom: '10px',
								right: '10px',
								background: 'rgba(0, 0, 0, 0.5)',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								padding: '8px 12px',
								cursor: 'pointer',
								fontSize: '14px',
								zIndex: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClick={(e) => e.preventDefault()}
							aria-label={__('Pause carousel', 'kadence-blocks')}
						>
							<svg
								className="kb-gallery-pause-icon"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect x="6" y="4" width="4" height="16" fill="currentColor" />
								<rect x="14" y="4" width="4" height="16" fill="currentColor" />
							</svg>
						</button>
					)}
				</div>
			)}
			{type && type === 'carousel' && (
				<div
					className={galleryClassNames}
					style={spacingSettings}
					data-columns-xxl={columns[0]}
					data-columns-xl={columns[1]}
					data-columns-lg={columns[2]}
					data-columns-md={columns[3]}
					data-columns-sm={columns[4]}
					data-columns-xs={columns[5]}
				>
					<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle}`}>
						<Splide
							options={carouselSettings}
							ref={mainRef}
							className={`splide kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle} kb-slider-group-${
								'center' !== arrowPosition &&
								'outside-top-center' !== arrowPosition &&
								'outside-bottom-center' !== arrowPosition
									? 'arrows'
									: 'arrow'
							} kb-slider-arrow-position-${arrowPosition}`}
						>
							{theImages.map((img, index) => {
								return (
									<SplideSlide className={'kadence-blocks-gallery-item'} key={img.id || img.url}>
										{renderGalleryImages(img, index)}
									</SplideSlide>
								);
							})}
						</Splide>
					</div>
					{autoPlay && showPauseButton && (
						<button
							className="kb-gallery-pause-button"
							style={{
								position: 'absolute',
								bottom: '10px',
								right: '10px',
								background: 'rgba(0, 0, 0, 0.5)',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								padding: '8px 12px',
								cursor: 'pointer',
								fontSize: '14px',
								zIndex: 10,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onClick={(e) => e.preventDefault()}
							aria-label={__('Pause carousel', 'kadence-blocks')}
						>
							<svg
								className="kb-gallery-pause-icon"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect x="6" y="4" width="4" height="16" fill="currentColor" />
								<rect x="14" y="4" width="4" height="16" fill="currentColor" />
							</svg>
						</button>
					)}
				</div>
			)}
			{type &&
				type === 'masonry' &&
				// Workaround for known issue where Marsonry library sometimes fatal errors when 1 column and narrow viewport.
				// Issue: https://github.com/bogdanpetru/react-masonry/issues/48
				(previewColumns === 1 ? (
					<div
						style={spacingSettings}
						className={galleryClassNames}
						data-columns-xxl={columns[0]}
						data-columns-xl={columns[1]}
						data-columns-lg={columns[2]}
						data-columns-md={columns[3]}
						data-columns-sm={columns[4]}
						data-columns-xs={columns[5]}
					>
						{theImages.map((img, index) => {
							return (
								<div className="kadence-blocks-gallery-item" key={img.id || img.url}>
									{renderGalleryImages(img, index)}
								</div>
							);
						})}
					</div>
				) : (
					<Masonry style={spacingSettings} className={galleryClassNames}>
						{theImages.map((img, index) => {
							return (
								<div className="kadence-blocks-gallery-item" key={img.id || img.url}>
									{renderGalleryImages(img, index)}
								</div>
							);
						})}
					</Masonry>
				))}
			{type && type === 'grid' && (
				<ul
					style={spacingSettings}
					className={galleryClassNames}
					data-columns-xxl={columns[0]}
					data-columns-xl={columns[1]}
					data-columns-lg={columns[2]}
					data-columns-md={columns[3]}
					data-columns-sm={columns[4]}
					data-columns-xs={columns[5]}
				>
					{theImages.map((img, index) => {
						return (
							<li className="kadence-blocks-gallery-item" key={img.id || img.url}>
								{renderGalleryImages(img, index)}
							</li>
						);
					})}
				</ul>
			)}
			{type && type === 'tiles' && (
				<ul style={spacingSettings} className={galleryClassNames}>
					{theImages.map((img, index) => {
						return (
							<li className="kadence-blocks-gallery-item" key={img.id || img.url}>
								{renderGalleryImages(img, index)}
							</li>
						);
					})}
				</ul>
			)}
			{type && type === 'mosaic' && (
				<ul
					style={spacingSettings}
					className={`kb-gallery-id-${uniqueID} kb-gallery-main-contain kb-mosaic-gallery grid-pattern-gallery ${galleryClassNames}`}
				>
					<div
						className="grid-pattern-container"
						style={{
							gridGap: `${previewGutter}${previewGutterUnit}`,
							// For older browsers that might not support grid-gap
							gap: `${previewGutter}${previewGutterUnit}`,
							// Add the grid-auto-rows style for the mosaic layout
							gridAutoRows:
								type === 'mosaic'
									? `${previewMosaicRowHeight}${previewMosaicRowHeightUnit}`
									: undefined,
						}}
					>
						{theImages.map((img, index) => {
							// Determine which grid item pattern to use (patterns repeat every 8 images)
							const patternIndex = index % 8;

							// Define grid classes based on the pattern index.
							let gridClass = '';
							const isLastImage = index === theImages.length - 1;
							const isNextToLastImage = index === theImages.length - 2;

							switch (patternIndex) {
								case 0: // First image: 1 row, 2 columns
									gridClass = isLastImage ? 'grid-item-wide only-one' : 'grid-item-wide';
									break;
								case 1: // Second image: 2 columns, 2 rows
									gridClass = isLastImage ? 'grid-item-large only-two' : 'grid-item-large';
									break;
								case 2: // Third image: 2 rows, 1 column
									gridClass = 'grid-item-tall';
									gridClass = isLastImage ? 'grid-item-tall only-three' : gridClass;
									gridClass = isNextToLastImage ? 'grid-item-tall only-four' : gridClass;
									break;
								case 3: // Fourth image: 1 row, 1 column
									gridClass = 'grid-item-small';
									break;
								case 4: // Fifth image: 2 columns, 2 rows
									gridClass = isLastImage ? 'grid-item-large only-five' : 'grid-item-large';
									gridClass = isNextToLastImage ? 'grid-item-large only-six' : gridClass;
									break;
								case 5: // Sixth image: 1 row, 1
									gridClass = isNextToLastImage ? 'grid-item-small only-seven' : 'grid-item-small';
									break;
								case 6: // Seventh image: 1 row, 1 column
								case 7: // Eighth image: 1 row, 1 column
									gridClass = 'grid-item-small';
									break;
								default:
									gridClass = 'grid-item-small';
							}

							return (
								<div className={`kadence-blocks-gallery-item ${gridClass}`} key={img.id || img.url}>
									{renderGalleryImages(img, index)}
								</div>
							);
						})}
					</div>
				</ul>
			)}
		</div>
	);
}
