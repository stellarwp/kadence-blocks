/**
 * BLOCK: Kadence Testimonials
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';
/**
 * Import Icons
 */
import {
	testimonialBubbleIcon,
	alignTopIcon,
	alignMiddleIcon,
	alignBottomIcon,
	testimonialBasicIcon,
	testimonialCardIcon,
	testimonialInLineIcon,
} from '@kadence/icons';

/**
 * Import External
 */
import { Splide, SplideTrack } from '@splidejs/react-splide';
import { map, isEqual, has } from 'lodash';
/**
 * Import Components
 */

import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
	ResponsiveRangeControls,
	KadencePanelBody,
	WebfontLoader,
	KadenceIconPicker,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	CopyPasteAttributes,
	BoxShadowControl,
} from '@kadence/components';

import {
	getPreviewSize,
	KadenceColorOutput,
	showSettings,
	setBlockDefaults,
	mouseOverVisualizer,
	getGapSizeOptionOutput,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	getBorderStyle,
	isRTL,
	uniqueIdHelper,
} from '@kadence/helpers';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import { useEffect, Fragment, useState, useRef } from '@wordpress/element';

import {
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
	useBlockProps,
	InnerBlocks,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch, withDispatch, withSelect } from '@wordpress/data';

import {
	Button,
	ButtonGroup,
	RangeControl,
	ToggleControl,
	SelectControl,
	ToolbarButton,
	ToolbarGroup,
	Tooltip,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { plusCircle } from '@wordpress/icons';

import classnames from 'classnames';
import { migrateToInnerblocks } from './utils';

/**
 * Build the overlay edit
 */
function KadenceTestimonials(props) {
	const {
		attributes,
		setAttributes,
		className,
		clientId,
		isSelected,
		context,
		testimonialBlock,
		insertTestimonial,
		insertTestimonialItems,
		onDelete,
	} = props;

	const {
		uniqueID,
		testimonials,
		style,
		hAlign,
		layout,
		containerBackground,
		containerBorder,
		containerBorderWidth,
		containerBorderRadius,
		containerPadding,
		tabletContainerPadding,
		mobileContainerPadding,
		containerPaddingType,
		mediaStyles,
		displayTitle,
		titleFont,
		titleMinHeight,
		containerMinHeight,
		containerVAlign,
		contentMinHeight,
		displayContent,
		contentFont,
		displayName,
		displayMedia,
		nameFont,
		displayShadow,
		shadow,
		displayRating,
		ratingStyles,
		displayOccupation,
		occupationFont,
		containerBackgroundOpacity,
		containerBorderOpacity,
		containerMaxWidth,
		columnGap,
		autoPlay,
		autoSpeed,
		transSpeed,
		slidesScroll,
		arrowStyle,
		dotStyle,
		columns,
		columnControl,
		displayIcon,
		iconStyles,
		wrapperPaddingType,
		wrapperPadding,
		wrapperTabletPadding,
		wrapperMobilePadding,
		inQueryBlock,
		gap,
		gapUnit,
		kbVersion,
		responsiveContainerBorderRadius,
		tabletContainerBorderRadius,
		mobileContainerBorderRadius,
		containerBorderRadiusUnit,
		iconBorderRadius,
		tabletIconBorderRadius,
		mobileIconBorderRadius,
		iconBorderRadiusUnit,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		iconBorderStyle,
		tabletIconBorderStyle,
		mobileIconBorderStyle,
		mediaBorderRadius,
		tabletMediaBorderRadius,
		mobileMediaBorderRadius,
		mediaBorderRadiusUnit,
		mediaBorderStyle,
		tabletMediaBorderStyle,
		mobileMediaBorderStyle,
		iconMargin,
		tabletIconMargin,
		mobileIconMargin,
		iconMarginUnit,
		iconPadding,
		tabletIconPadding,
		mobileIconPadding,
		iconPaddingUnit,
		titleMargin,
		tabletTitleMargin,
		mobileTitleMargin,
		titleMarginUnit,
		titlePadding,
		tabletTitlePadding,
		mobileTitlePadding,
		titlePaddingUnit,
		ratingMargin,
		tabletRatingMargin,
		mobileRatingMargin,
		ratingMarginUnit,
		ratingPadding,
		tabletRatingPadding,
		mobileRatingPadding,
		ratingPaddingUnit,
		mediaMargin,
		tabletMediaMargin,
		mobileMediaMargin,
		mediaMarginUnit,
		mediaPadding,
		tabletMediaPadding,
		mobileMediaPadding,
		mediaPaddingUnit,
		wrapperMargin,
		tabletWrapperMargin,
		mobileWrapperMargin,
		wrapperMarginUnit,
		carouselType,
	} = attributes;

	const [activeTab, setActiveTab] = useState('general');
	const [showPreset, setShowPreset] = useState(false);
	const carouselRef = useRef(null);
	const paddingMouseOver = mouseOverVisualizer();

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const savemediaStyles = (value) => {
		const newUpdate = mediaStyles.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaStyles: newUpdate,
		});
	};

	const saveIconStyles = (value) => {
		const newUpdate = iconStyles.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			iconStyles: newUpdate,
		});
	};

	const saveTitleFont = (value) => {
		const newUpdate = titleFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			titleFont: newUpdate,
		});
	};

	const saveRatingStyles = (value) => {
		const newUpdate = ratingStyles.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			ratingStyles: newUpdate,
		});
	};

	uniqueIdHelper(props);

	useEffect(() => {
		setBlockDefaults(metadata.name, attributes);

		// Update from old gutter settings.
		if (columnGap !== '') {
			setAttributes({ gap: [columnGap, '', ''], columnGap: '' });
		}

		if (!kbVersion || kbVersion < 2) {
			setAttributes({ kbVersion: 2 });
		}
		if (context && context.queryId && context.postId) {
			if (context.queryId !== inQueryBlock) {
				setAttributes({
					inQueryBlock: context.queryId,
				});
			}
		} else if (inQueryBlock) {
			setAttributes({
				inQueryBlock: false,
			});
		}

		// Update old non-responsive settings.
		if (containerBorderRadius !== '') {
			setAttributes({
				responsiveContainerBorderRadius: [
					containerBorderRadius,
					containerBorderRadius,
					containerBorderRadius,
					containerBorderRadius,
				],
				containerBorderRadius: '',
			});
		}

		if (iconStyles[0].borderRadius !== '') {
			setAttributes({
				iconBorderRadius: [
					iconStyles[0].borderRadius,
					iconStyles[0].borderRadius,
					iconStyles[0].borderRadius,
					iconStyles[0].borderRadius,
				],
			});

			const newUpdate = iconStyles.map((item, index) => {
				if (0 === index) {
					item = { ...item, borderRadius: '' };
				}
				return item;
			});
			setAttributes({
				iconStyles: newUpdate,
			});

			saveIconStyles({ borderRadius: '' });
		}

		if (
			containerBorderWidth[0] !== '' ||
			containerBorderWidth[1] !== '' ||
			containerBorderWidth[2] !== '' ||
			containerBorderWidth[3] !== ''
		) {
			const tmpBorderColor = KadenceColorOutput(
				containerBorder,
				undefined !== containerBorderOpacity ? containerBorderOpacity : 1
			);

			setAttributes({
				borderStyle: [
					{
						top: [tmpBorderColor, '', containerBorderWidth[0]],
						right: [tmpBorderColor, '', containerBorderWidth[1]],
						bottom: [tmpBorderColor, '', containerBorderWidth[2]],
						left: [tmpBorderColor, '', containerBorderWidth[3]],
						unit: 'px',
					},
				],
				containerBorderWidth: ['', '', '', ''],
			});
		}

		if (
			iconStyles[0].borderWidth[0] !== '' ||
			iconStyles[0].borderWidth[1] !== '' ||
			iconStyles[0].borderWidth[2] !== '' ||
			iconStyles[0].borderWidth[3] !== ''
		) {
			const tmpIconBorderColor = KadenceColorOutput(
				iconStyles[0].border,
				undefined !== iconStyles[0].borderOpacity ? iconStyles[0].borderOpacity : 1
			);

			setAttributes({
				iconBorderStyle: [
					{
						top: [tmpIconBorderColor, '', iconStyles[0].borderWidth[0]],
						right: [tmpIconBorderColor, '', iconStyles[0].borderWidth[1]],
						bottom: [tmpIconBorderColor, '', iconStyles[0].borderWidth[2]],
						left: [tmpIconBorderColor, '', iconStyles[0].borderWidth[3]],
						unit: 'px',
					},
				],
			});

			const newUpdate = iconStyles.map((item, index) => {
				if (0 === index) {
					item = { ...item, borderWidth: ['', '', '', ''] };
				}
				return item;
			});
			setAttributes({
				iconStyles: newUpdate,
			});
		}

		if (
			mediaStyles[0].borderWidth[0] !== '' ||
			mediaStyles[0].borderWidth[1] !== '' ||
			mediaStyles[0].borderWidth[2] !== '' ||
			mediaStyles[0].borderWidth[3] !== ''
		) {
			const tmpMediaBorderColor = KadenceColorOutput(
				mediaStyles[0].border,
				undefined !== mediaStyles[0].borderOpacity ? mediaStyles[0].borderOpacity : 1
			);

			setAttributes({
				mediaBorderStyle: [
					{
						top: [tmpMediaBorderColor, '', mediaStyles[0].borderWidth[0]],
						right: [tmpMediaBorderColor, '', mediaStyles[0].borderWidth[1]],
						bottom: [tmpMediaBorderColor, '', mediaStyles[0].borderWidth[2]],
						left: [tmpMediaBorderColor, '', mediaStyles[0].borderWidth[3]],
						unit: 'px',
					},
				],
			});

			const newUpdate = mediaStyles.map((item, index) => {
				if (0 === index) {
					item = { ...item, borderWidth: ['', '', '', ''] };
				}
				return item;
			});
			setAttributes({
				mediaStyles: newUpdate,
			});
		}

		if (mediaStyles[0].borderRadius !== '') {
			setAttributes({
				mediaBorderRadius: [
					mediaStyles[0].borderRadius,
					mediaStyles[0].borderRadius,
					mediaStyles[0].borderRadius,
					mediaStyles[0].borderRadius,
				],
			});

			const newUpdate = mediaStyles.map((item, index) => {
				if (0 === index) {
					item = { ...item, borderRadius: '' };
				}
				return item;
			});
			setAttributes({
				mediaStyles: newUpdate,
			});
		}

		if (
			iconStyles[0].padding[0] !== '' ||
			iconStyles[0].padding[1] !== '' ||
			iconStyles[0].padding[2] !== '' ||
			iconStyles[0].padding[3] !== ''
		) {
			setAttributes({
				iconPadding: [
					iconStyles[0].padding[0],
					iconStyles[0].padding[1],
					iconStyles[0].padding[2],
					iconStyles[0].padding[3],
				],
			});

			saveIconStyles({ padding: ['', '', '', ''] });
		}

		if (
			iconStyles[0].margin[0] !== '' ||
			iconStyles[0].margin[1] !== '' ||
			iconStyles[0].margin[2] !== '' ||
			iconStyles[0].margin[3] !== ''
		) {
			setAttributes({
				iconMargin: [
					iconStyles[0].margin[0],
					iconStyles[0].margin[1],
					iconStyles[0].margin[2],
					iconStyles[0].margin[3],
				],
			});

			saveIconStyles({ margin: ['', '', '', ''] });
		}

		if (
			titleFont[0].padding[0] !== '' ||
			titleFont[0].padding[1] !== '' ||
			titleFont[0].padding[2] !== '' ||
			titleFont[0].padding[3] !== ''
		) {
			setAttributes({
				titleFont: [
					titleFont[0].padding[0],
					titleFont[0].padding[1],
					titleFont[0].padding[2],
					titleFont[0].padding[3],
				],
			});

			saveTitleFont({ padding: ['', '', '', ''] });
		}

		if (
			titleFont[0].margin[0] !== '' ||
			titleFont[0].margin[1] !== '' ||
			titleFont[0].margin[2] !== '' ||
			titleFont[0].margin[3] !== ''
		) {
			setAttributes({
				titleFont: [
					titleFont[0].margin[0],
					titleFont[0].margin[1],
					titleFont[0].margin[2],
					titleFont[0].margin[3],
				],
			});

			saveTitleFont({ margin: ['', '', '', ''] });
		}

		if (
			mediaStyles[0].margin[0] !== '' ||
			mediaStyles[0].margin[1] !== '' ||
			mediaStyles[0].margin[2] !== '' ||
			mediaStyles[0].margin[3] !== ''
		) {
			setAttributes({
				mediaMargin: [
					mediaStyles[0].margin[0],
					mediaStyles[0].margin[1],
					mediaStyles[0].margin[2],
					mediaStyles[0].margin[3],
				],
			});

			savemediaStyles({ margin: ['', '', '', ''] });
		}

		if (
			mediaStyles[0].padding[0] !== '' ||
			mediaStyles[0].padding[1] !== '' ||
			mediaStyles[0].padding[2] !== '' ||
			mediaStyles[0].padding[3] !== ''
		) {
			setAttributes({
				mediaPadding: [
					mediaStyles[0].padding[0],
					mediaStyles[0].padding[1],
					mediaStyles[0].padding[2],
					mediaStyles[0].padding[3],
				],
			});

			savemediaStyles({ padding: ['', '', '', ''] });
		}

		if (
			ratingStyles[0].margin[0] !== '' ||
			ratingStyles[0].margin[1] !== '' ||
			ratingStyles[0].margin[2] !== '' ||
			ratingStyles[0].margin[3] !== ''
		) {
			setAttributes({
				ratingMargin: [
					mediaStyles[0].margin[0],
					mediaStyles[0].margin[1],
					mediaStyles[0].margin[2],
					mediaStyles[0].margin[3],
				],
			});

			saveRatingStyles({ margin: ['', '', '', ''] });
		}
	}, []);

	const innerBlockLength = testimonialBlock?.innerBlocks ? testimonialBlock.innerBlocks.length : 0;

	useEffect(() => {
		if (uniqueID && !innerBlockLength) {
			if (
				testimonials?.length &&
				testimonials.length &&
				undefined !== metadata?.attributes?.testimonials?.default &&
				!isEqual(metadata.attributes.testimonials.default, testimonials)
			) {
				const migrateUpdate = migrateToInnerblocks(attributes);
				setAttributes(migrateUpdate[0]);
				insertTestimonialItems(migrateUpdate[1]);
			} else {
				// Delete if no inner blocks.
				onDelete();
			}
		}
	}, [innerBlockLength]);

	const previewTitleFont = getPreviewSize(
		previewDevice,
		undefined !== titleFont[0].size && undefined !== titleFont[0].size[0] && '' !== titleFont[0].size[0]
			? titleFont[0].size[0]
			: '',
		undefined !== titleFont[0].size && undefined !== titleFont[0].size[1] && '' !== titleFont[0].size[1]
			? titleFont[0].size[1]
			: '',
		undefined !== titleFont[0].size && undefined !== titleFont[0].size[2] && '' !== titleFont[0].size[2]
			? titleFont[0].size[2]
			: ''
	);
	const previewTitleFontSizeType =
		undefined !== titleFont?.[0]?.sizeType && '' !== titleFont?.[0]?.sizeType ? titleFont?.[0]?.sizeType : 'px';

	const previewTitleLineHeight = getPreviewSize(
		previewDevice,
		undefined !== titleFont[0].lineHeight &&
			undefined !== titleFont[0].lineHeight[0] &&
			'' !== titleFont[0].lineHeight[0]
			? titleFont[0].lineHeight[0]
			: '',
		undefined !== titleFont[0].lineHeight &&
			undefined !== titleFont[0].lineHeight[1] &&
			'' !== titleFont[0].lineHeight[1]
			? titleFont[0].lineHeight[1]
			: '',
		undefined !== titleFont[0].lineHeight &&
			undefined !== titleFont[0].lineHeight[2] &&
			'' !== titleFont[0].lineHeight[2]
			? titleFont[0].lineHeight[2]
			: ''
	);
	const previewTitleLineHeightLineType =
		undefined !== titleFont?.[0]?.lineType && '' !== titleFont?.[0]?.lineType ? titleFont?.[0]?.lineType : 'px';
	const previewTitleMinHeight = getPreviewSize(
		previewDevice,
		undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '',
		undefined !== titleMinHeight && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '',
		undefined !== titleMinHeight && undefined !== titleMinHeight[2] ? titleMinHeight[2] : ''
	);
	const previewContentMinHeight = getPreviewSize(
		previewDevice,
		undefined !== contentMinHeight && undefined !== contentMinHeight[0] ? contentMinHeight[0] : '',
		undefined !== contentMinHeight && undefined !== contentMinHeight[1] ? contentMinHeight[1] : '',
		undefined !== contentMinHeight && undefined !== contentMinHeight[2] ? contentMinHeight[2] : ''
	);

	const previewContainerPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[0] ? containerPadding[0] : '',
		undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[0]
			? tabletContainerPadding[0]
			: '',
		undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[0] ? mobileContainerPadding[0] : ''
	);
	const previewContainerPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[1] ? containerPadding[1] : '',
		undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[1]
			? tabletContainerPadding[1]
			: '',
		undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[1] ? mobileContainerPadding[1] : ''
	);
	const previewContainerPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[2] ? containerPadding[2] : '',
		undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[2]
			? tabletContainerPadding[2]
			: '',
		undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[2] ? mobileContainerPadding[2] : ''
	);
	const previewContainerPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[3] ? containerPadding[3] : '',
		undefined !== tabletContainerPadding && undefined !== tabletContainerPadding[3]
			? tabletContainerPadding[3]
			: '',
		undefined !== mobileContainerPadding && undefined !== mobileContainerPadding[3] ? mobileContainerPadding[3] : ''
	);
	const previewContainerMinHeight = getPreviewSize(
		previewDevice,
		undefined !== containerMinHeight && undefined !== containerMinHeight[0] ? containerMinHeight[0] : '',
		undefined !== containerMinHeight && undefined !== containerMinHeight[1] ? containerMinHeight[1] : '',
		undefined !== containerMinHeight && undefined !== containerMinHeight[2] ? containerMinHeight[2] : ''
	);

	const previewContentFont = getPreviewSize(
		previewDevice,
		undefined !== contentFont[0].size && undefined !== contentFont[0].size[0] && '' !== contentFont[0].size[0]
			? contentFont[0].size[0]
			: '',
		undefined !== contentFont[0].size && undefined !== contentFont[0].size[1] && '' !== contentFont[0].size[1]
			? contentFont[0].size[1]
			: '',
		undefined !== contentFont[0].size && undefined !== contentFont[0].size[2] && '' !== contentFont[0].size[2]
			? contentFont[0].size[2]
			: ''
	);
	const previewContentFontSizeType = undefined !== contentFont[0].sizeType ? contentFont[0].sizeType : 'px';
	const previewContentLineHeight = getPreviewSize(
		previewDevice,
		undefined !== contentFont[0].lineHeight &&
			undefined !== contentFont[0].lineHeight[0] &&
			'' !== contentFont[0].lineHeight[0]
			? contentFont[0].lineHeight[0]
			: '',
		undefined !== contentFont[0].lineHeight &&
			undefined !== contentFont[0].lineHeight[1] &&
			'' !== contentFont[0].lineHeight[1]
			? contentFont[0].lineHeight[1]
			: '',
		undefined !== contentFont[0].lineHeight &&
			undefined !== contentFont[0].lineHeight[2] &&
			'' !== contentFont[0].lineHeight[2]
			? contentFont[0].lineHeight[2]
			: ''
	);
	const previewContentLineHeightLineType = undefined !== contentFont[0].lineType ? contentFont[0].lineType : 'px';

	const previewOccupationFont = getPreviewSize(
		previewDevice,
		undefined !== occupationFont[0].size &&
			undefined !== occupationFont[0].size[0] &&
			'' !== occupationFont[0].size[0]
			? occupationFont[0].size[0]
			: '',
		undefined !== occupationFont[0].size &&
			undefined !== occupationFont[0].size[1] &&
			'' !== occupationFont[0].size[1]
			? occupationFont[0].size[1]
			: '',
		undefined !== occupationFont[0].size &&
			undefined !== occupationFont[0].size[2] &&
			'' !== occupationFont[0].size[2]
			? occupationFont[0].size[2]
			: ''
	);
	const previewOccupationFontSizeType = undefined !== occupationFont[0].sizeType ? occupationFont[0].sizeType : 'px';
	const previewOccupationLineHeight = getPreviewSize(
		previewDevice,
		undefined !== occupationFont[0].lineHeight &&
			undefined !== occupationFont[0].lineHeight[0] &&
			'' !== occupationFont[0].lineHeight[0]
			? occupationFont[0].lineHeight[0]
			: '',
		undefined !== occupationFont[0].lineHeight &&
			undefined !== occupationFont[0].lineHeight[1] &&
			'' !== occupationFont[0].lineHeight[1]
			? occupationFont[0].lineHeight[1]
			: '',
		undefined !== occupationFont[0].lineHeight &&
			undefined !== occupationFont[0].lineHeight[2] &&
			'' !== occupationFont[0].lineHeight[2]
			? occupationFont[0].lineHeight[2]
			: ''
	);
	const previewOccupationLineHeightLineType =
		undefined !== occupationFont[0].lineType ? occupationFont[0].lineType : 'px';

	const previewNameFont = getPreviewSize(
		previewDevice,
		undefined !== nameFont[0].size && undefined !== nameFont[0].size[0] && '' !== nameFont[0].size[0]
			? nameFont[0].size[0]
			: '',
		undefined !== nameFont[0].size && undefined !== nameFont[0].size[1] && '' !== nameFont[0].size[1]
			? nameFont[0].size[1]
			: '',
		undefined !== nameFont[0].size && undefined !== nameFont[0].size[2] && '' !== nameFont[0].size[2]
			? nameFont[0].size[2]
			: ''
	);
	const previewNameLineHeight = getPreviewSize(
		previewDevice,
		undefined !== nameFont[0].lineHeight &&
			undefined !== nameFont[0].lineHeight[0] &&
			'' !== nameFont[0].lineHeight[0]
			? nameFont[0].lineHeight[0]
			: '',
		undefined !== nameFont[0].lineHeight &&
			undefined !== nameFont[0].lineHeight[1] &&
			'' !== nameFont[0].lineHeight[1]
			? nameFont[0].lineHeight[1]
			: '',
		undefined !== nameFont[0].lineHeight &&
			undefined !== nameFont[0].lineHeight[2] &&
			'' !== nameFont[0].lineHeight[2]
			? nameFont[0].lineHeight[2]
			: ''
	);
	const previewNameLineHeightType = undefined !== nameFont[0].lineType ? nameFont[0].lineType : 'px';
	const previewNameFontType = undefined !== nameFont[0].sizeType ? nameFont[0].sizeType : 'px';

	const previewContainerRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== responsiveContainerBorderRadius?.[0] ? responsiveContainerBorderRadius[0] : '',
		undefined !== tabletContainerBorderRadius ? tabletContainerBorderRadius[0] : '',
		undefined !== mobileContainerBorderRadius ? mobileContainerBorderRadius[0] : ''
	);
	const previewContainerRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== responsiveContainerBorderRadius ? responsiveContainerBorderRadius[1] : '',
		undefined !== tabletContainerBorderRadius ? tabletContainerBorderRadius[1] : '',
		undefined !== mobileContainerBorderRadius ? mobileContainerBorderRadius[1] : ''
	);
	const previewContainerRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== responsiveContainerBorderRadius ? responsiveContainerBorderRadius[2] : '',
		undefined !== tabletContainerBorderRadius ? tabletContainerBorderRadius[2] : '',
		undefined !== mobileContainerBorderRadius ? mobileContainerBorderRadius[2] : ''
	);
	const previewContainerRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== responsiveContainerBorderRadius ? responsiveContainerBorderRadius[3] : '',
		undefined !== tabletContainerBorderRadius ? tabletContainerBorderRadius[3] : '',
		undefined !== mobileContainerBorderRadius ? mobileContainerBorderRadius[3] : ''
	);

	const previewContainerBorderTop = getBorderStyle(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewContainerBorderRight = getBorderStyle(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewContainerBorderBottom = getBorderStyle(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewContainerBorderLeft = getBorderStyle(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);

	const previewIconBorderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== iconBorderRadius ? iconBorderRadius[0] : '',
		undefined !== tabletIconBorderRadius ? tabletIconBorderRadius[0] : '',
		undefined !== mobileIconBorderRadius ? mobileIconBorderRadius[0] : ''
	);
	const previewIconBorderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== iconBorderRadius ? iconBorderRadius[1] : '',
		undefined !== tabletIconBorderRadius ? tabletIconBorderRadius[1] : '',
		undefined !== mobileIconBorderRadius ? mobileIconBorderRadius[1] : ''
	);
	const previewIconBorderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== iconBorderRadius ? iconBorderRadius[2] : '',
		undefined !== tabletIconBorderRadius ? tabletIconBorderRadius[2] : '',
		undefined !== mobileIconBorderRadius ? mobileIconBorderRadius[2] : ''
	);
	const previewIconBorderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== iconBorderRadius ? iconBorderRadius[3] : '',
		undefined !== tabletIconBorderRadius ? tabletIconBorderRadius[3] : '',
		undefined !== mobileIconBorderRadius ? mobileIconBorderRadius[3] : ''
	);
	const previewIconBorderTop = getBorderStyle(
		previewDevice,
		'top',
		iconBorderStyle,
		tabletIconBorderStyle,
		mobileIconBorderStyle
	);
	const previewIconBorderRight = getBorderStyle(
		previewDevice,
		'right',
		iconBorderStyle,
		tabletIconBorderStyle,
		mobileIconBorderStyle
	);
	const previewIconBorderBottom = getBorderStyle(
		previewDevice,
		'bottom',
		iconBorderStyle,
		tabletIconBorderStyle,
		mobileIconBorderStyle
	);
	const previewIconBorderLeft = getBorderStyle(
		previewDevice,
		'left',
		iconBorderStyle,
		tabletIconBorderStyle,
		mobileIconBorderStyle
	);

	const previewMediaBorderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== mediaBorderRadius ? mediaBorderRadius[0] : '',
		undefined !== tabletMediaBorderRadius ? tabletMediaBorderRadius[0] : '',
		undefined !== mobileMediaBorderRadius ? mobileMediaBorderRadius[0] : ''
	);
	const previewMediaBorderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== mediaBorderRadius ? mediaBorderRadius[1] : '',
		undefined !== tabletMediaBorderRadius ? tabletMediaBorderRadius[1] : '',
		undefined !== mobileMediaBorderRadius ? mobileMediaBorderRadius[1] : ''
	);
	const previewMediaBorderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== mediaBorderRadius ? mediaBorderRadius[2] : '',
		undefined !== tabletMediaBorderRadius ? tabletMediaBorderRadius[2] : '',
		undefined !== mobileMediaBorderRadius ? mobileMediaBorderRadius[2] : ''
	);
	const previewMediaBorderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== mediaBorderRadius ? mediaBorderRadius[3] : '',
		undefined !== tabletMediaBorderRadius ? tabletMediaBorderRadius[3] : '',
		undefined !== mobileMediaBorderRadius ? mobileMediaBorderRadius[3] : ''
	);
	const previewMediaBorderTop = getBorderStyle(
		previewDevice,
		'top',
		mediaBorderStyle,
		tabletMediaBorderStyle,
		mobileMediaBorderStyle
	);
	const previewMediaBorderRight = getBorderStyle(
		previewDevice,
		'right',
		mediaBorderStyle,
		tabletMediaBorderStyle,
		mobileMediaBorderStyle
	);
	const previewMediaBorderBottom = getBorderStyle(
		previewDevice,
		'bottom',
		mediaBorderStyle,
		tabletMediaBorderStyle,
		mobileMediaBorderStyle
	);
	const previewMediaBorderLeft = getBorderStyle(
		previewDevice,
		'left',
		mediaBorderStyle,
		tabletMediaBorderStyle,
		mobileMediaBorderStyle
	);

	const previewColumns = getPreviewSize(
		previewDevice,
		undefined !== columns[0] ? columns[0] : 3,
		undefined !== columns[3] ? columns[3] : '',
		undefined !== columns[5] ? columns[5] : ''
	);

	const previewGap = getPreviewSize(
		previewDevice,
		undefined !== gap?.[0] ? gap[0] : '',
		undefined !== gap?.[1] ? gap[1] : '',
		undefined !== gap?.[2] ? gap[2] : ''
	);

	const previewIconMarginTop = getPreviewSize(
		previewDevice,
		undefined !== iconMargin?.[0] ? iconMargin[0] : '',
		undefined !== tabletIconMargin?.[0] ? tabletIconMargin[0] : '',
		undefined !== mobileIconMargin?.[0] ? mobileIconMargin[0] : ''
	);
	const previewIconMarginRight = getPreviewSize(
		previewDevice,
		undefined !== iconMargin?.[1] ? iconMargin[1] : '',
		undefined !== tabletIconMargin?.[1] ? tabletIconMargin[1] : '',
		undefined !== mobileIconMargin?.[1] ? mobileIconMargin[1] : ''
	);
	const previewIconMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== iconMargin?.[2] ? iconMargin[2] : '',
		undefined !== tabletIconMargin?.[2] ? tabletIconMargin[2] : '',
		undefined !== mobileIconMargin?.[2] ? mobileIconMargin[2] : ''
	);
	const previewIconMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== iconMargin?.[3] ? iconMargin[3] : '',
		undefined !== tabletIconMargin?.[3] ? tabletIconMargin[3] : '',
		undefined !== mobileIconMargin?.[3] ? mobileIconMargin[3] : ''
	);
	const previewIconPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[0] ? iconPadding[0] : '',
		undefined !== tabletIconPadding?.[0] ? tabletIconPadding[0] : '',
		undefined !== mobileIconPadding?.[0] ? mobileIconPadding[0] : ''
	);
	const previewIconPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[1] ? iconPadding[1] : '',
		undefined !== tabletIconPadding?.[1] ? tabletIconPadding[1] : '',
		undefined !== mobileIconPadding?.[1] ? mobileIconPadding[1] : ''
	);
	const previewIconPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[2] ? iconPadding[2] : '',
		undefined !== tabletIconPadding?.[2] ? tabletIconPadding[2] : '',
		undefined !== mobileIconPadding?.[2] ? mobileIconPadding[2] : ''
	);
	const previewIconPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== iconPadding?.[3] ? iconPadding[3] : '',
		undefined !== tabletIconPadding?.[3] ? tabletIconPadding[3] : '',
		undefined !== mobileIconPadding?.[3] ? mobileIconPadding[3] : ''
	);

	const previewTitleMarginTop = getPreviewSize(
		previewDevice,
		undefined !== titleMargin?.[0] ? titleMargin[0] : '',
		undefined !== tabletTitleMargin?.[0] ? tabletTitleMargin[0] : '',
		undefined !== mobileTitleMargin?.[0] ? mobileTitleMargin[0] : ''
	);
	const previewTitleMarginRight = getPreviewSize(
		previewDevice,
		undefined !== titleMargin?.[1] ? titleMargin[1] : '',
		undefined !== tabletTitleMargin?.[1] ? tabletTitleMargin[1] : '',
		undefined !== mobileTitleMargin?.[1] ? mobileTitleMargin[1] : ''
	);
	const previewTitleMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== titleMargin?.[2] ? titleMargin[2] : '',
		undefined !== tabletTitleMargin?.[2] ? tabletTitleMargin[2] : '',
		undefined !== mobileTitleMargin?.[2] ? mobileTitleMargin[2] : ''
	);
	const previewTitleMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== titleMargin?.[3] ? titleMargin[3] : '',
		undefined !== tabletTitleMargin?.[3] ? tabletTitleMargin[3] : '',
		undefined !== mobileTitleMargin?.[3] ? mobileTitleMargin[3] : ''
	);
	const previewTitlePaddingTop = getPreviewSize(
		previewDevice,
		undefined !== titlePadding?.[0] ? titlePadding[0] : '',
		undefined !== tabletTitlePadding?.[0] ? tabletTitlePadding[0] : '',
		undefined !== mobileTitlePadding?.[0] ? mobileTitlePadding[0] : ''
	);
	const previewTitlePaddingRight = getPreviewSize(
		previewDevice,
		undefined !== titlePadding?.[1] ? titlePadding[1] : '',
		undefined !== tabletTitlePadding?.[1] ? tabletTitlePadding[1] : '',
		undefined !== mobileTitlePadding?.[1] ? mobileTitlePadding[1] : ''
	);
	const previewTitlePaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== titlePadding?.[2] ? titlePadding[2] : '',
		undefined !== tabletTitlePadding?.[2] ? tabletTitlePadding[2] : '',
		undefined !== mobileTitlePadding?.[2] ? mobileTitlePadding[2] : ''
	);
	const previewTitlePaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== titlePadding?.[3] ? titlePadding[3] : '',
		undefined !== tabletTitlePadding?.[3] ? tabletTitlePadding[3] : '',
		undefined !== mobileTitlePadding?.[3] ? mobileTitlePadding[3] : ''
	);

	// Rating
	const previewRatingMarginTop = getPreviewSize(
		previewDevice,
		undefined !== ratingMargin?.[0] ? ratingMargin[0] : '',
		undefined !== tabletRatingMargin?.[0] ? tabletRatingMargin[0] : '',
		undefined !== mobileRatingMargin?.[0] ? mobileRatingMargin[0] : ''
	);
	const previewRatingMarginRight = getPreviewSize(
		previewDevice,
		undefined !== ratingMargin?.[1] ? ratingMargin[1] : '',
		undefined !== tabletRatingMargin?.[1] ? tabletRatingMargin[1] : '',
		undefined !== mobileRatingMargin?.[1] ? mobileRatingMargin[1] : ''
	);
	const previewRatingMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== ratingMargin?.[2] ? ratingMargin[2] : '',
		undefined !== tabletRatingMargin?.[2] ? tabletRatingMargin[2] : '',
		undefined !== mobileRatingMargin?.[2] ? mobileRatingMargin[2] : ''
	);
	const previewRatingMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== ratingMargin?.[3] ? ratingMargin[3] : '',
		undefined !== tabletRatingMargin?.[3] ? tabletRatingMargin[3] : '',
		undefined !== mobileRatingMargin?.[3] ? mobileRatingMargin[3] : ''
	);
	const previewRatingPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== ratingPadding?.[0] ? ratingPadding[0] : '',
		undefined !== tabletRatingPadding?.[0] ? tabletRatingPadding[0] : '',
		undefined !== mobileRatingPadding?.[0] ? mobileRatingPadding[0] : ''
	);
	const previewRatingPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== ratingPadding?.[1] ? ratingPadding[1] : '',
		undefined !== tabletRatingPadding?.[1] ? tabletRatingPadding[1] : '',
		undefined !== mobileRatingPadding?.[1] ? mobileRatingPadding[1] : ''
	);
	const previewRatingPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== ratingPadding?.[2] ? ratingPadding[2] : '',
		undefined !== tabletRatingPadding?.[2] ? tabletRatingPadding[2] : '',
		undefined !== mobileRatingPadding?.[2] ? mobileRatingPadding[2] : ''
	);
	const previewRatingPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== ratingPadding?.[3] ? ratingPadding[3] : '',
		undefined !== tabletRatingPadding?.[3] ? tabletRatingPadding[3] : '',
		undefined !== mobileRatingPadding?.[3] ? mobileRatingPadding[3] : ''
	);

	// Media
	const previewMediaMarginTop = getPreviewSize(
		previewDevice,
		undefined !== mediaMargin?.[0] ? mediaMargin[0] : '',
		undefined !== tabletMediaMargin?.[0] ? tabletMediaMargin[0] : '',
		undefined !== mobileMediaMargin?.[0] ? mobileMediaMargin[0] : ''
	);
	const previewMediaMarginRight = getPreviewSize(
		previewDevice,
		undefined !== mediaMargin?.[1] ? mediaMargin[1] : '',
		undefined !== tabletMediaMargin?.[1] ? tabletMediaMargin[1] : '',
		undefined !== mobileMediaMargin?.[1] ? mobileMediaMargin[1] : ''
	);
	const previewMediaMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== mediaMargin?.[2] ? mediaMargin[2] : '',
		undefined !== tabletMediaMargin?.[2] ? tabletMediaMargin[2] : '',
		undefined !== mobileMediaMargin?.[2] ? mobileMediaMargin[2] : ''
	);
	const previewMediaMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== mediaMargin?.[3] ? mediaMargin[3] : '',
		undefined !== tabletMediaMargin?.[3] ? tabletMediaMargin[3] : '',
		undefined !== mobileMediaMargin?.[3] ? mobileMediaMargin[3] : ''
	);
	const previewMediaPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== mediaPadding?.[0] ? mediaPadding[0] : '',
		undefined !== tabletMediaPadding?.[0] ? tabletMediaPadding[0] : '',
		undefined !== mobileMediaPadding?.[0] ? mobileMediaPadding[0] : ''
	);
	const previewMediaPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== mediaPadding?.[1] ? mediaPadding[1] : '',
		undefined !== tabletMediaPadding?.[1] ? tabletMediaPadding[1] : '',
		undefined !== mobileMediaPadding?.[1] ? mobileMediaPadding[1] : ''
	);
	const previewMediaPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== mediaPadding?.[2] ? mediaPadding[2] : '',
		undefined !== tabletMediaPadding?.[2] ? tabletMediaPadding[2] : '',
		undefined !== mobileMediaPadding?.[2] ? mobileMediaPadding[2] : ''
	);
	const previewMediaPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== mediaPadding?.[3] ? mediaPadding[3] : '',
		undefined !== tabletMediaPadding?.[3] ? tabletMediaPadding[3] : '',
		undefined !== mobileMediaPadding?.[3] ? mobileMediaPadding[3] : ''
	);

	// Wrapper
	const previewWrapperMarginTop = getPreviewSize(
		previewDevice,
		undefined !== wrapperMargin?.[0] ? wrapperMargin[0] : '',
		undefined !== tabletWrapperMargin?.[0] ? tabletWrapperMargin[0] : '',
		undefined !== mobileWrapperMargin?.[0] ? mobileWrapperMargin[0] : ''
	);
	const previewWrapperMarginRight = getPreviewSize(
		previewDevice,
		undefined !== wrapperMargin?.[1] ? wrapperMargin[1] : '',
		undefined !== tabletWrapperMargin?.[1] ? tabletWrapperMargin[1] : '',
		undefined !== mobileWrapperMargin?.[1] ? mobileWrapperMargin[1] : ''
	);
	const previewWrapperMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== wrapperMargin?.[2] ? wrapperMargin[2] : '',
		undefined !== tabletWrapperMargin?.[2] ? tabletWrapperMargin[2] : '',
		undefined !== mobileWrapperMargin?.[2] ? mobileWrapperMargin[2] : ''
	);
	const previewWrapperMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== wrapperMargin?.[3] ? wrapperMargin[3] : '',
		undefined !== tabletWrapperMargin?.[3] ? tabletWrapperMargin[3] : '',
		undefined !== mobileWrapperMargin?.[3] ? mobileWrapperMargin[3] : ''
	);
	const previewWrapperPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== wrapperPadding && undefined !== wrapperPadding?.[0] ? wrapperPadding[0] : '',
		undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding?.[0] ? wrapperTabletPadding[0] : '',
		undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding?.[0] ? wrapperMobilePadding[0] : ''
	);
	const previewWrapperPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== wrapperPadding && undefined !== wrapperPadding?.[1] ? wrapperPadding[1] : '',
		undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding?.[1] ? wrapperTabletPadding[1] : '',
		undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding?.[1] ? wrapperMobilePadding[1] : ''
	);
	const previewWrapperPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== wrapperPadding && undefined !== wrapperPadding?.[2] ? wrapperPadding[2] : '',
		undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding?.[2] ? wrapperTabletPadding[2] : '',
		undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding?.[2] ? wrapperMobilePadding[2] : ''
	);
	const previewWrapperPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== wrapperPadding && undefined !== wrapperPadding?.[3] ? wrapperPadding[3] : '',
		undefined !== wrapperTabletPadding && undefined !== wrapperTabletPadding?.[3] ? wrapperTabletPadding[3] : '',
		undefined !== wrapperMobilePadding && undefined !== wrapperMobilePadding?.[3] ? wrapperMobilePadding[3] : ''
	);

	// let iconPadding = (displayIcon && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && (iconStyles[0].margin[0] < 0) ? Math.abs(iconStyles[0].margin[0]) + 'px' : undefined);
	// if (iconPadding === undefined && iconStyles[0].icon && iconStyles[0].margin && iconStyles[0].margin[0] && (iconStyles[0].margin[0] >= 0)) {
	//     iconPadding = '0px';
	// }

	const onColumnChange = (value) => {
		let columnarray = [];
		if (1 === value) {
			columnarray = [1, 1, 1, 1, 1, 1];
		} else if (2 === value) {
			columnarray = [2, 2, 2, 2, 1, 1];
		} else if (3 === value) {
			columnarray = [3, 3, 3, 2, 1, 1];
		} else if (4 === value) {
			columnarray = [4, 4, 4, 3, 2, 2];
		} else if (5 === value) {
			columnarray = [5, 5, 5, 4, 4, 3];
		}
		setAttributes({ columns: columnarray });
	};
	const setInitalLayout = (key) => {
		if ('skip' === key) {
		} else if ('basic' === key) {
			setAttributes({ style: 'basic' });
		} else if ('card' === key) {
			setAttributes({ style: 'card' });
		} else if ('bubble' === key) {
			setAttributes({ style: 'bubble' });
		} else if ('inlineimage' === key) {
			setAttributes({ style: 'inlineimage' });
		}
	};
	const styleOptions = [
		{ key: 'basic', name: __('Basic', 'kadence-blocks'), icon: testimonialBasicIcon },
		{ key: 'card', name: __('Card', 'kadence-blocks'), icon: testimonialCardIcon },
		{ key: 'bubble', name: __('Bubble', 'kadence-blocks'), icon: testimonialBubbleIcon },
		{ key: 'inlineimage', name: __('Image In Content', 'kadence-blocks'), icon: testimonialInLineIcon },
	];
	const startlayoutOptions = [
		{ key: 'skip', name: __('Skip', 'kadence-blocks'), icon: __('Skip', 'kadence-blocks') },
		{ key: 'basic', name: __('Basic', 'kadence-blocks'), icon: testimonialBasicIcon },
		{ key: 'card', name: __('Card', 'kadence-blocks'), icon: testimonialCardIcon },
		{ key: 'bubble', name: __('Bubble', 'kadence-blocks'), icon: testimonialBubbleIcon },
		{ key: 'inlineimage', name: __('Image In Content', 'kadence-blocks'), icon: testimonialInLineIcon },
	];
	const columnControlTypes = [
		{ key: 'linked', name: __('Linked', 'kadence-blocks'), icon: __('Linked', 'kadence-blocks') },
		{ key: 'individual', name: __('Individual', 'kadence-blocks'), icon: __('Individual', 'kadence-blocks') },
	];
	const VAlignOptions = [
		{ key: 'top', name: __('Top', 'kadence-blocks'), icon: alignTopIcon },
		{ key: 'middle', name: __('Middle', 'kadence-blocks'), icon: alignMiddleIcon },
		{ key: 'bottom', name: __('Bottom', 'kadence-blocks'), icon: alignBottomIcon },
	];

	const containerStyles = () => {
		let applyTo = '.kt-testimonial-item-wrap';

		if (style === 'bubble' || style === 'inlineimage') {
			applyTo = '.kt-testimonial-text-wrap';
		}
		const shadowCarousel = displayShadow && layout && layout === 'carousel';
		const wrapperPaddingTopBottomApplyTo = shadowCarousel
			? '.kt-blocks-testimonials-wrap' + uniqueID + ' .splide__slide'
			: '.kt-blocks-testimonials-wrap' + uniqueID;

		return (
			<style>
				{`
                    /* Container */
                    .kt-blocks-testimonials-wrap${uniqueID} ${applyTo} {
                        ${
							displayShadow
								? 'box-shadow: ' +
								  shadow[0].hOffset +
								  'px ' +
								  shadow[0].vOffset +
								  'px ' +
								  shadow[0].blur +
								  'px ' +
								  shadow[0].spread +
								  'px ' +
								  KadenceColorOutput(
										undefined !== shadow[0].color && '' !== shadow[0].color
											? shadow[0].color
											: '#000000',
										shadow[0].opacity ? shadow[0].opacity : 0.2
								  ) +
								  ';'
								: ''
						}
                        ${
							containerBackground
								? 'background: ' +
								  KadenceColorOutput(
										containerBackground,
										undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
								  ) +
								  ';'
								: ''
						}
                        ${
							previewContainerRadiusTop
								? 'border-top-left-radius:' +
								  previewContainerRadiusTop +
								  containerBorderRadiusUnit +
								  ';'
								: ''
						}
                        ${
							previewContainerRadiusRight
								? 'border-top-right-radius:' +
								  previewContainerRadiusRight +
								  containerBorderRadiusUnit +
								  ';'
								: ''
						}
                        ${
							previewContainerRadiusBottom
								? 'border-bottom-right-radius:' +
								  previewContainerRadiusBottom +
								  containerBorderRadiusUnit +
								  ';'
								: ''
						}
                        ${
							previewContainerRadiusLeft
								? 'border-bottom-left-radius:' +
								  previewContainerRadiusLeft +
								  containerBorderRadiusUnit +
								  ';'
								: ''
						}
                        ${previewContainerBorderTop ? 'border-top: ' + previewContainerBorderTop + ';' : ''}
                        ${previewContainerBorderRight ? 'border-right: ' + previewContainerBorderRight + ';' : ''}
                        ${previewContainerBorderBottom ? 'border-bottom: ' + previewContainerBorderBottom + ';' : ''}
                        ${previewContainerBorderLeft ? 'border-left: ' + previewContainerBorderLeft + ';' : ''}
                        ${
							previewContainerPaddingTop
								? 'padding-top: ' +
								  getSpacingOptionOutput(
										previewContainerPaddingTop,
										containerPaddingType ? containerPaddingType : 'px'
								  ) +
								  ';'
								: ''
						}
                        ${
							previewContainerPaddingRight
								? 'padding-right: ' +
								  getSpacingOptionOutput(
										previewContainerPaddingRight,
										containerPaddingType ? containerPaddingType : 'px'
								  ) +
								  ';'
								: ''
						}
                        ${
							previewContainerPaddingBottom
								? 'padding-bottom: ' +
								  getSpacingOptionOutput(
										previewContainerPaddingBottom,
										containerPaddingType ? containerPaddingType : 'px'
								  ) +
								  ';'
								: ''
						}
                        ${
							previewContainerPaddingLeft
								? 'padding-left: ' +
								  getSpacingOptionOutput(
										previewContainerPaddingLeft,
										containerPaddingType ? containerPaddingType : 'px'
								  ) +
								  ';'
								: ''
						}
                        ${
							'bubble' === style || 'inlineimage' === style
								? ''
								: 'max-width: ' + containerMaxWidth + 'px;'
						}
                        ${
							'bubble' === style || 'inlineimage' === style || !previewContainerMinHeight
								? ''
								: 'min-height: ' + previewContainerMinHeight + 'px;'
						}
					}
                    ${wrapperPaddingTopBottomApplyTo} {
						${
							previewWrapperPaddingTop
								? 'padding-top: ' +
								  getSpacingOptionOutput(previewWrapperPaddingTop, wrapperPaddingType) +
								  ';'
								: shadowCarousel
								? 'padding-top: .5rem;'
								: ''
						}
						${
							previewWrapperPaddingBottom
								? 'padding-bottom: ' +
								  getSpacingOptionOutput(previewWrapperPaddingBottom, wrapperPaddingType) +
								  ';'
								: shadowCarousel
								? 'padding-bottom: .5rem;'
								: ''
						}
                    }
					.kt-blocks-testimonials-wrap${uniqueID} {
						${
							previewWrapperPaddingRight
								? 'padding-right: ' +
								  getSpacingOptionOutput(previewWrapperPaddingRight, wrapperPaddingType) +
								  ';'
								: ''
						}
						${
							previewWrapperPaddingLeft
								? 'padding-left: ' +
								  getSpacingOptionOutput(previewWrapperPaddingLeft, wrapperPaddingType) +
								  ';'
								: ''
						}
                        ${
							previewWrapperMarginTop
								? 'margin-top: ' +
								  getSpacingOptionOutput(previewWrapperMarginTop, wrapperMarginUnit) +
								  ';'
								: ''
						}
						${
							previewWrapperMarginRight
								? 'margin-right: ' +
								  getSpacingOptionOutput(previewWrapperMarginRight, wrapperMarginUnit) +
								  ';'
								: ''
						}
						${
							previewWrapperMarginBottom
								? 'margin-bottom: ' +
								  getSpacingOptionOutput(previewWrapperMarginBottom, wrapperMarginUnit) +
								  ';'
								: ''
						}
						${
							previewWrapperMarginLeft
								? 'margin-left: ' +
								  getSpacingOptionOutput(previewWrapperMarginLeft, wrapperMarginUnit) +
								  ';'
								: ''
						}
                    }

                    ${
						containerVAlign !== ''
							? `.kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-item-wrap {
                            display: flex;
                            flex-direction: column;
                            justify-content: ${
								containerVAlign === 'middle'
									? 'center'
									: containerVAlign === 'top'
									? 'flex-start'
									: 'flex-end'
							};
                        }`
							: ''
					}

                    ${`.kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-item-wrap {
						${containerMaxWidth ? 'max-width: ' + containerMaxWidth + 'px;' : ''}
                        ${previewContainerMinHeight ? 'min-height: ' + previewContainerMinHeight + 'px;' : ''}
                        ${
							undefined !== iconPadding?.[0] && '' !== iconPadding?.[0]
								? 'padding-top: ' + iconPadding[0] + ';'
								: ''
						}
                    }`}

                    /* Title */
                    .kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-title-wrap .kt-testimonial-title {
						${titleFont[0].weight ? 'font-weight: ' + titleFont[0].weight + ';' : ''}
						${titleFont[0].style ? 'font-style: ' + titleFont[0].style + ';' : ''}
						${titleFont[0].color ? 'color: ' + KadenceColorOutput(titleFont[0].color) + ';' : ''}
						${previewTitleFont ? 'font-size: ' + getFontSizeOptionOutput(previewTitleFont, previewTitleFontSizeType) + ';' : ''}
						${previewTitleLineHeight ? 'line-height: ' + previewTitleLineHeight + previewTitleLineHeightLineType + ';' : ''}
						${titleFont[0].letterSpacing ? 'letter-spacing: ' + titleFont[0].letterSpacing + 'px;' : ''}
						${titleFont[0].textTransform ? 'text-transform: ' + titleFont[0].textTransform + ';' : ''}
						${titleFont[0].family ? 'font-family: ' + titleFont[0].family + ';' : ''}
						${
							previewTitlePaddingTop
								? 'padding-top: ' +
								  getSpacingOptionOutput(previewTitlePaddingTop, titlePaddingUnit) +
								  ';'
								: ''
						}
						${
							previewTitlePaddingRight
								? 'padding-right: ' +
								  getSpacingOptionOutput(previewTitlePaddingRight, titlePaddingUnit) +
								  ';'
								: ''
						}
						${
							previewTitlePaddingBottom
								? 'padding-bottom: ' +
								  getSpacingOptionOutput(previewTitlePaddingBottom, titlePaddingUnit) +
								  ';'
								: ''
						}
						${
							previewTitlePaddingLeft
								? 'padding-left: ' +
								  getSpacingOptionOutput(previewTitlePaddingLeft, titlePaddingUnit) +
								  ';'
								: ''
						}
						${previewTitleMarginTop ? 'margin-top: ' + getSpacingOptionOutput(previewTitleMarginTop, titleMarginUnit) + ';' : ''}
						${
							previewTitleMarginRight
								? 'margin-right: ' +
								  getSpacingOptionOutput(previewTitleMarginRight, titleMarginUnit) +
								  ';'
								: ''
						}
						${
							previewTitleMarginBottom
								? 'margin-bottom: ' +
								  getSpacingOptionOutput(previewTitleMarginBottom, titleMarginUnit) +
								  ';'
								: ''
						}
						${previewTitleMarginLeft ? 'margin-left: ' + getSpacingOptionOutput(previewTitleMarginLeft, titleMarginUnit) + ';' : ''}
                    }

                    .kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-title-wrap {
                        ${previewTitleMinHeight ? 'min-height: ' + previewTitleMinHeight + 'px;' : ''}
                    }

                    /* Content */
                    .kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-content-wrap .kt-testimonial-content {
                        ${contentFont[0].weight ? 'font-weight: ' + contentFont[0].weight + ';' : ''}
                        ${contentFont[0].style ? 'font-style: ' + contentFont[0].style + ';' : ''}
                        ${contentFont[0].color ? 'color: ' + KadenceColorOutput(contentFont[0].color) + ';' : ''}
                        ${
							previewContentFont
								? 'font-size: ' +
								  getFontSizeOptionOutput(previewContentFont, previewContentFontSizeType) +
								  ';'
								: ''
						}
                        ${
							previewContentLineHeight
								? 'line-height: ' + previewContentLineHeight + previewContentLineHeightLineType + ';'
								: ''
						}
                        ${contentFont[0].textTransform ? 'text-transform: ' + contentFont[0].textTransform + ';' : ''}
                        ${contentFont[0].letterSpacing ? 'letter-spacing: ' + contentFont[0].letterSpacing + 'px;' : ''}
                        ${contentFont[0].family ? 'font-family: ' + contentFont[0].family + ';' : ''}
                    }

                    .kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-content-wrap {
                        ${previewContentMinHeight ? 'min-height: ' + previewContentMinHeight + 'px;' : ''}
                    }

                    /* Occupation */
                    .kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-occupation-wrap .kt-testimonial-occupation {
                        ${occupationFont[0].weight ? 'font-weight: ' + occupationFont[0].weight + ';' : ''}
                        ${occupationFont[0].style ? 'font-style: ' + occupationFont[0].style + ';' : ''}
                        ${occupationFont[0].color ? 'color: ' + KadenceColorOutput(occupationFont[0].color) + ';' : ''}
                        ${
							previewOccupationFont
								? 'font-size: ' +
								  getFontSizeOptionOutput(previewOccupationFont, previewOccupationFontSizeType) +
								  ';'
								: ''
						}
                        ${
							previewOccupationLineHeight
								? 'line-height: ' +
								  previewOccupationLineHeight +
								  previewOccupationLineHeightLineType +
								  ';'
								: ''
						}
                        ${
							occupationFont[0].textTransform
								? 'text-transform: ' + occupationFont[0].textTransform + ';'
								: ''
						}
                        ${
							occupationFont[0].letterSpacing
								? 'letter-spacing: ' + occupationFont[0].letterSpacing + 'px;'
								: ''
						}
                        ${occupationFont[0].family ? 'font-family: ' + occupationFont[0].family + ';' : ''}
                    }

                    /* Media */
                    .kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-media-inner-wrap {
                        ${'card' !== style ? 'width: ' + mediaStyles[0].width + 'px;' : ''}
                        ${
							mediaStyles[0].border
								? 'border-color: ' + KadenceColorOutput(mediaStyles[0].border) + ';'
								: ''
						}
                        ${
							mediaStyles[0].background
								? 'background-color: ' +
								  KadenceColorOutput(
										mediaStyles[0].background,
										undefined !== mediaStyles[0].backgroundOpacity
											? mediaStyles[0].backgroundOpacity
											: 1
								  ) +
								  ';'
								: ''
						}
						${previewMediaBorderTop ? 'border-top: ' + previewMediaBorderTop + ';' : ''}
						${previewMediaBorderRight ? 'border-right: ' + previewMediaBorderRight + ';' : ''}
						${previewMediaBorderBottom ? 'border-bottom: ' + previewMediaBorderBottom + ';' : ''}
						${previewMediaBorderLeft ? 'border-left: ' + previewMediaBorderLeft + ';' : ''}
						${
							'' !== previewMediaBorderRadiusTop
								? 'border-top-left-radius: ' + previewMediaBorderRadiusTop + mediaBorderRadiusUnit + ';'
								: ''
						}
						${
							'' !== previewMediaBorderRadiusRight
								? 'border-top-right-radius: ' +
								  previewMediaBorderRadiusRight +
								  mediaBorderRadiusUnit +
								  ';'
								: ''
						}
						${
							'' !== previewMediaBorderRadiusBottom
								? 'border-bottom-right-radius: ' +
								  previewMediaBorderRadiusBottom +
								  mediaBorderRadiusUnit +
								  ';'
								: ''
						}
						${
							'' !== previewMediaBorderRadiusLeft
								? 'border-bottom-left-radius: ' +
								  previewMediaBorderRadiusLeft +
								  mediaBorderRadiusUnit +
								  ';'
								: ''
						}
						${previewMediaMarginTop ? 'margin-top: ' + getSpacingOptionOutput(previewMediaMarginTop, mediaMarginUnit) + ';' : ''}
						${
							previewMediaMarginRight
								? 'margin-right: ' +
								  getSpacingOptionOutput(previewMediaMarginRight, mediaMarginUnit) +
								  ';'
								: ''
						}
						${
							previewMediaMarginBottom
								? 'margin-bottom: ' +
								  getSpacingOptionOutput(previewMediaMarginBottom, mediaMarginUnit) +
								  ';'
								: ''
						}
						${previewMediaMarginLeft ? 'margin-left: ' + getSpacingOptionOutput(previewMediaMarginLeft, mediaMarginUnit) + ';' : ''}
						${
							previewMediaPaddingTop
								? 'padding-top: ' +
								  getSpacingOptionOutput(previewMediaPaddingTop, mediaPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewMediaPaddingRight
								? 'padding-right: ' +
								  getSpacingOptionOutput(previewMediaPaddingRight, mediaPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewMediaPaddingBottom
								? 'padding-bottom: ' +
								  getSpacingOptionOutput(previewMediaPaddingBottom, mediaPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewMediaPaddingLeft
								? 'padding-left: ' +
								  getSpacingOptionOutput(previewMediaPaddingLeft, mediaPaddingUnit) +
								  ';'
								: ''
						}
                    }

                    .kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-media-inner-wrap .kadence-testimonial-image-intrisic {
                        ${
							'card' === style && (undefined !== mediaStyles[0].ratio || '' !== mediaStyles[0].ratio)
								? 'padding-bottom: ' + mediaStyles[0].ratio + '%;'
								: ''
						}
                    }

                    /* Name */
                    .kt-blocks-testimonials-wrap${uniqueID}  .kt-testimonial-name-wrap .kt-testimonial-name {
                        ${nameFont[0].weight ? 'font-weight: ' + nameFont[0].weight + ';' : ''}
                        ${nameFont[0].style ? 'font-style: ' + nameFont[0].style + ';' : ''}
                        ${nameFont[0].color ? 'color: ' + KadenceColorOutput(nameFont[0].color) + ';' : ''}
                        ${
							previewNameFont
								? 'font-size: ' + getFontSizeOptionOutput(previewNameFont, previewNameFontType) + ';'
								: ''
						}
                        ${
							previewNameLineHeight
								? 'line-height: ' + previewNameLineHeight + previewNameLineHeightType + ';'
								: ''
						}
                        ${nameFont[0].textTransform ? 'text-transform: ' + nameFont[0].textTransform + ';' : ''}
                        ${nameFont[0].letterSpacing ? 'letter-spacing: ' + nameFont[0].letterSpacing + 'px;' : ''}
                        ${nameFont[0].family ? 'font-family: ' + nameFont[0].family + ';' : ''}
                    }

					/* Icon */
					.kt-blocks-testimonials-wrap${uniqueID} .kt-svg-testimonial-global-icon-wrap {
						${previewIconMarginTop ? 'margin-top: ' + getSpacingOptionOutput(previewIconMarginTop, iconMarginUnit) + ';' : ''}
						${previewIconMarginRight ? 'margin-right: ' + getSpacingOptionOutput(previewIconMarginRight, iconMarginUnit) + ';' : ''}
						${
							previewIconMarginBottom
								? 'margin-bottom: ' +
								  getSpacingOptionOutput(previewIconMarginBottom, iconMarginUnit) +
								  ';'
								: ''
						}
						${previewIconMarginLeft ? 'margin-left: ' + getSpacingOptionOutput(previewIconMarginLeft, iconMarginUnit) + ';' : ''}
					}


					.kt-blocks-testimonials-wrap${uniqueID} .kt-svg-testimonial-global-icon-wrap .kt-svg-testimonial-global-icon {
						${previewIconBorderTop ? 'border-top: ' + previewIconBorderTop + ';' : ''}
						${previewIconBorderRight ? 'border-right: ' + previewIconBorderRight + ';' : ''}
						${previewIconBorderBottom ? 'border-bottom: ' + previewIconBorderBottom + ';' : ''}
						${previewIconBorderLeft ? 'border-left: ' + previewIconBorderLeft + ';' : ''}
						${
							previewIconBorderRadiusTop
								? 'border-top-left-radius: ' + previewIconBorderRadiusTop + iconBorderRadiusUnit + ';'
								: ''
						}
						${
							previewIconBorderRadiusRight
								? 'border-top-right-radius: ' +
								  previewIconBorderRadiusRight +
								  iconBorderRadiusUnit +
								  ';'
								: ''
						}
						${
							previewIconBorderRadiusBottom
								? 'border-bottom-right-radius: ' +
								  previewIconBorderRadiusBottom +
								  iconBorderRadiusUnit +
								  ';'
								: ''
						}
						${
							previewIconBorderRadiusLeft
								? 'border-bottom-left-radius: ' +
								  previewIconBorderRadiusLeft +
								  iconBorderRadiusUnit +
								  ';'
								: ''
						}
						${previewIconPaddingTop ? 'padding-top: ' + getSpacingOptionOutput(previewIconPaddingTop, iconPaddingUnit) + ';' : ''}
						${
							previewIconPaddingRight
								? 'padding-right: ' +
								  getSpacingOptionOutput(previewIconPaddingRight, iconPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewIconPaddingBottom
								? 'padding-bottom: ' +
								  getSpacingOptionOutput(previewIconPaddingBottom, iconPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewIconPaddingLeft
								? 'padding-left: ' +
								  getSpacingOptionOutput(previewIconPaddingLeft, iconPaddingUnit) +
								  ';'
								: ''
						}
					}

					/* Rating */
					.kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-rating-wrap {
						${previewRatingMarginTop ? 'margin-top: ' + getSpacingOptionOutput(previewRatingMarginTop, ratingMarginUnit) + ';' : ''}
						${
							previewRatingMarginRight
								? 'margin-right: ' +
								  getSpacingOptionOutput(previewRatingMarginRight, ratingMarginUnit) +
								  ';'
								: ''
						}
						${
							previewRatingMarginBottom
								? 'margin-bottom: ' +
								  getSpacingOptionOutput(previewRatingMarginBottom, ratingMarginUnit) +
								  ';'
								: ''
						}
						${
							previewRatingMarginLeft
								? 'margin-left: ' +
								  getSpacingOptionOutput(previewRatingMarginLeft, ratingMarginUnit) +
								  ';'
								: ''
						}
						${
							previewRatingPaddingTop
								? 'padding-top: ' +
								  getSpacingOptionOutput(previewRatingPaddingTop, ratingPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewRatingPaddingRight
								? 'padding-right: ' +
								  getSpacingOptionOutput(previewRatingPaddingRight, ratingPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewRatingPaddingBottom
								? 'padding-bottom: ' +
								  getSpacingOptionOutput(previewRatingPaddingBottom, ratingPaddingUnit) +
								  ';'
								: ''
						}
						${
							previewRatingPaddingLeft
								? 'padding-left: ' +
								  getSpacingOptionOutput(previewRatingPaddingLeft, ratingPaddingUnit) +
								  ';'
								: ''
						}
					}
                `}
			</style>
		);
	};

	const ref = useRef();

	const blockProps = useBlockProps({
		ref,
		className: classnames({
			[`kt-testimonial-halign-${hAlign}`]: true,
			[`kt-testimonial-style-${style}`]: true,
			[`kt-testimonials-media-${displayMedia ? 'on' : 'off'}`]: true,
			[`kt-testimonials-icon-${displayIcon ? 'on' : 'off'}`]: true,
			[`kt-testimonial-columns-${previewColumns}`]: true,
			[`kt-blocks-testimonials-wrap${uniqueID}`]: uniqueID,
			[`kt-t-xxl-col-${columns[0]}`]: true,
			[`kt-t-xl-col-${columns[1]}`]: true,
			[`kt-t-lg-col-${columns[2]}`]: true,
			[`kt-t-md-col-${columns[3]}`]: true,
			[`kt-t-sm-col-${columns[4]}`]: true,
			[`kt-t-xs-col-${columns[5]}`]: true,
		}),
	});

	const columnControls = (
		<Fragment>
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
			{columnControl && columnControl !== 'individual' && (
				<RangeControl
					label={__('Columns', 'kadence-blocks')}
					value={columns[2]}
					onChange={onColumnChange}
					min={1}
					max={5}
				/>
			)}
			{columnControl && columnControl === 'individual' && (
				<Fragment>
					<h4>{__('Columns', 'kadence-blocks')}</h4>
					<RangeControl
						label={__('Screen Above 1500px', 'kadence-blocks')}
						value={columns[0]}
						onChange={(value) =>
							setAttributes({
								columns: [value, columns[1], columns[2], columns[3], columns[4], columns[5]],
							})
						}
						min={1}
						max={5}
					/>
					<RangeControl
						label={__('Screen 1200px - 1499px', 'kadence-blocks')}
						value={columns[1]}
						onChange={(value) =>
							setAttributes({
								columns: [columns[0], value, columns[2], columns[3], columns[4], columns[5]],
							})
						}
						min={1}
						max={5}
					/>
					<RangeControl
						label={__('Screen 992px - 1199px', 'kadence-blocks')}
						value={columns[2]}
						onChange={(value) =>
							setAttributes({
								columns: [columns[0], columns[1], value, columns[3], columns[4], columns[5]],
							})
						}
						min={1}
						max={5}
					/>
					<RangeControl
						label={__('Screen 768px - 991px', 'kadence-blocks')}
						value={columns[3]}
						onChange={(value) =>
							setAttributes({
								columns: [columns[0], columns[1], columns[2], value, columns[4], columns[5]],
							})
						}
						min={1}
						max={5}
					/>
					<RangeControl
						label={__('Screen 544px - 767px', 'kadence-blocks')}
						value={columns[4]}
						onChange={(value) =>
							setAttributes({
								columns: [columns[0], columns[1], columns[2], columns[3], value, columns[5]],
							})
						}
						min={1}
						max={5}
					/>
					<RangeControl
						label={__('Screen Below 543px', 'kadence-blocks')}
						value={columns[5]}
						onChange={(value) =>
							setAttributes({
								columns: [columns[0], columns[1], columns[2], columns[3], columns[4], value],
							})
						}
						min={1}
						max={5}
					/>
				</Fragment>
			)}
		</Fragment>
	);

	const gconfig = {
		google: {
			families: [titleFont[0].family + (titleFont[0].variant ? ':' + titleFont[0].variant : '')],
		},
	};
	const tgconfig = {
		google: {
			families: [contentFont[0].family + (contentFont[0].variant ? ':' + contentFont[0].variant : '')],
		},
	};
	const lgconfig = {
		google: {
			families: [nameFont[0].family + (nameFont[0].variant ? ':' + nameFont[0].variant : '')],
		},
	};
	const ogconfig = {
		google: {
			families: [occupationFont[0].family + (occupationFont[0].variant ? ':' + occupationFont[0].variant : '')],
		},
	};

	const config = titleFont[0].google ? gconfig : '';
	const tconfig = contentFont[0].google ? tgconfig : '';
	const lconfig = nameFont[0].google ? lgconfig : '';
	const oconfig = occupationFont[0].google ? ogconfig : '';

	const saveContentFont = (value) => {
		const newUpdate = contentFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			contentFont: newUpdate,
		});
	};
	const saveNameFont = (value) => {
		const newUpdate = nameFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			nameFont: newUpdate,
		});
	};
	const saveOccupationFont = (value) => {
		const newUpdate = occupationFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			occupationFont: newUpdate,
		});
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

	const carouselSettings = {
		type: 'slide',
		rewind: true,
		pagination: dotStyle === 'none' ? false : true,
		arrows: arrowStyle === 'none' ? false : true,
		speed: transSpeed,
		drag: false,
		focus: 0,
		perPage: previewColumns,
		interval: autoSpeed,
		autoplay: autoPlay,
		perMove: slidesScroll === 'all' ? previewColumns : 1,
		gap: getGapSizeOptionOutput(previewGap, gapUnit ? gapUnit : 'px'),
		direction: isRTL ? 'rtl' : 'ltr',
	};
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'testimonial-inner-block-wrap',
		},
		{
			orientation: 'horizontal',
			templateLock: false,
			templateInsertUpdatesSelection: true,
			template: [['kadence/testimonial']],
			allowedBlocks: ['kadence/testimonial'],
		}
	);

	const nonTransAttrs = ['itemsCount'];

	return (
		<div {...blockProps}>
			{containerStyles()}
			<style>
				{style === 'bubble' || style === 'inlineimage'
					? `.kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-text-wrap:after { margin-top: ${
							has(borderStyle, [0, 'bottom', 2]) ? borderStyle[0].bottom[2] : '1'
					  }${has(borderStyle, [0, 'unit']) ? borderStyle[0].unit : 'px'}; }`
					: ''}
				{style === 'bubble' || style === 'inlineimage'
					? `.kt-blocks-testimonials-wrap${uniqueID} .kt-testimonial-text-wrap:after { border-top-color: ${
							has(borderStyle, [0, 'bottom', 0])
								? KadenceColorOutput(
										borderStyle[0].bottom[0],
										undefined !== containerBorderOpacity ? containerBorderOpacity : 1
								  )
								: KadenceColorOutput(
										'#eeeeee',
										undefined !== containerBorderOpacity ? containerBorderOpacity : 1
								  )
					  } }`
					: ''}
				{layout === 'grid' &&
					`.kt-testimonial-grid-wrap .block-editor-inner-blocks .block-editor-block-list__layout {
                        gap: ${getGapSizeOptionOutput(previewGap, gapUnit ? gapUnit : 'px')};
                    }`}
			</style>
			{showSettings('allSettings') && (
				<Fragment>
					<BlockControls key="controls">
						<AlignmentToolbar value={hAlign} onChange={(value) => setAttributes({ hAlign: value })} />
						<CopyPasteAttributes
							attributes={attributes}
							excludedAttrs={nonTransAttrs}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
							preventMultiple={['testimonials']}
						/>
						<ToolbarGroup>
							<ToolbarButton
								className="kb-icons-add-icon"
								icon={plusCircle}
								onClick={() => {
									const newBlock = createBlock('kadence/testimonial');
									insertTestimonial(newBlock);
								}}
								label={__('Add Testimonial', 'kadence-blocks')}
								showTooltip={true}
							/>
						</ToolbarGroup>
					</BlockControls>
					<InspectorControls>
						<InspectorControlTabs
							panelName={'testimonials'}
							setActiveTab={(value) => setActiveTab(value)}
							activeTab={activeTab}
						/>

						{activeTab === 'general' && (
							<>
								<KadencePanelBody panelName={'kb-testimonials-settings'}>
									{showSettings('layoutSettings', 'kadence/testimonials') && (
										<SelectControl
											label={__('Layout', 'kadence-blocks')}
											value={layout}
											options={[
												{ value: 'grid', label: __('Grid', 'kadence-blocks') },
												{ value: 'carousel', label: __('Carousel', 'kadence-blocks') },
											]}
											onChange={(value) => setAttributes({ layout: value })}
										/>
									)}
									{showSettings('styleSettings', 'kadence/testimonials') && (
										<Fragment>
											<p className="components-base-control__label">
												{__('Testimonial Style', 'kadence-blocks')}
											</p>
											<ButtonGroup
												className="kt-style-btn-group"
												aria-label={__('Testimonial Style', 'kadence-blocks')}
											>
												{map(styleOptions, ({ name, key, icon }) => (
													<Tooltip text={name}>
														<Button
															key={key}
															className="kt-style-btn"
															isSmall
															isPrimary={style === key}
															aria-pressed={style === key}
															onClick={() => setAttributes({ style: key })}
														>
															{icon}
														</Button>
													</Tooltip>
												))}
											</ButtonGroup>
										</Fragment>
									)}

									{/* Add item */}

									{showSettings('columnSettings', 'kadence/testimonials') && (
										<Fragment>
											{columnControls}
											<ResponsiveRangeControls
												label={__('Column Gutter', 'kadence-blocks')}
												value={undefined !== gap?.[0] ? gap[0] : ''}
												onChange={(value) =>
													setAttributes({
														gap: [
															value,
															'' !== gap?.[1] ? gap[1] : '',
															'' !== gap?.[2] ? gap[2] : '',
														],
													})
												}
												tabletValue={undefined !== gap?.[1] ? gap[1] : ''}
												onChangeTablet={(value) =>
													setAttributes({
														gap: [
															'' !== gap?.[0] ? gap[0] : '',
															value,
															'' !== gap?.[2] ? gap[2] : '',
														],
													})
												}
												mobileValue={undefined !== gap?.[2] ? gap[2] : ''}
												onChangeMobile={(value) =>
													setAttributes({
														gap: [
															'' !== gap?.[0] ? gap[0] : '',
															'' !== gap?.[1] ? gap[1] : '',
															value,
														],
													})
												}
												min={0}
												max={gapUnit !== 'px' ? 12 : 200}
												step={gapUnit !== 'px' ? 0.1 : 1}
												unit={gapUnit}
												onUnit={(value) => setAttributes({ gapUnit: value })}
												units={['px', 'em', 'rem']}
											/>
										</Fragment>
									)}
								</KadencePanelBody>

								{layout && layout === 'carousel' && (
									<Fragment>
										{showSettings('carouselSettings', 'kadence/testimonials') && (
											<KadencePanelBody
												title={__('Carousel Settings', 'kadence-blocks')}
												initialOpen={false}
												panelName={'kb-testimonials-carousel'}
											>
												<SelectControl
													label={__('Carousel Type', 'kadence-blocks')}
													options={[
														{
															label: __('Infinite Loop', 'kadence-blocks'),
															value: 'loop',
														},
														{
															label: __('Rewind', 'kadence-blocks'),
															value: 'rewind',
														},
													]}
													value={carouselType}
													onChange={(value) => setAttributes({ carouselType: value })}
												/>
												<ToggleControl
													label={__('Carousel Auto Play', 'kadence-blocks')}
													checked={autoPlay}
													onChange={(value) => setAttributes({ autoPlay: value })}
												/>
												{autoPlay && (
													<RangeControl
														label={__('Autoplay Speed', 'kadence-blocks')}
														value={autoSpeed}
														onChange={(value) => setAttributes({ autoSpeed: value })}
														min={0}
														max={15000}
														step={10}
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
												<SelectControl
													label={__('Arrow Style', 'kadence-blocks')}
													options={[
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
															label: __('None', 'kadence-blocks'),
															value: 'none',
														},
													]}
													value={arrowStyle}
													onChange={(value) => setAttributes({ arrowStyle: value })}
												/>
												<SelectControl
													label={__('Dot Style', 'kadence-blocks')}
													options={[
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
															label: __('None', 'kadence-blocks'),
															value: 'none',
														},
													]}
													value={dotStyle}
													onChange={(value) => setAttributes({ dotStyle: value })}
												/>
											</KadencePanelBody>
										)}
									</Fragment>
								)}
							</>
						)}

						{activeTab === 'style' && (
							<>
								{showSettings('containerSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Container Settings', 'kadence-blocks')}
										panelName={'kb-testimonials-container-settings'}
									>
										<div className="kt-spacer-sidebar-15"></div>
										<PopColorControl
											label={__('Background', 'kadence-blocks')}
											value={containerBackground ? containerBackground : ''}
											default={''}
											onChange={(value) => {
												setAttributes({ containerBackground: value });
											}}
											opacityValue={containerBackgroundOpacity}
											onOpacityChange={(value) =>
												setAttributes({ containerBackgroundOpacity: value })
											}
											onArrayChange={(color, opacity) =>
												setAttributes({
													containerBackground: color,
													containerBackgroundOpacity: opacity,
												})
											}
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
											value={responsiveContainerBorderRadius}
											tabletValue={tabletContainerBorderRadius}
											mobileValue={mobileContainerBorderRadius}
											onChange={(value) =>
												setAttributes({ responsiveContainerBorderRadius: value })
											}
											onChangeTablet={(value) =>
												setAttributes({ tabletContainerBorderRadius: value })
											}
											onChangeMobile={(value) =>
												setAttributes({ mobileContainerBorderRadius: value })
											}
											min={0}
											max={
												containerBorderRadiusUnit === 'em' ||
												containerBorderRadiusUnit === 'rem'
													? 24
													: 100
											}
											step={
												containerBorderRadiusUnit === 'em' ||
												containerBorderRadiusUnit === 'rem'
													? 0.1
													: 1
											}
											unit={containerBorderRadiusUnit}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setAttributes({ containerBorderRadiusUnit: value })}
											isBorderRadius={true}
											allowEmpty={true}
										/>
										{showSettings('shadowSettings', 'kadence/testimonials') && (
											<>
												<BoxShadowControl
													label={__('Box Shadow', 'kadence-blocks')}
													enable={displayShadow ? displayShadow : false}
													color={shadow[0].color ? shadow[0].color : ''}
													colorDefault={'#000000'}
													opacity={shadow[0].opacity}
													hOffset={shadow[0].hOffset}
													vOffset={shadow[0].vOffset}
													blur={shadow[0].blur}
													spread={shadow[0].spread}
													onEnableChange={(value) => {
														setAttributes({ displayShadow: value });
													}}
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
										)}
									</KadencePanelBody>
								)}

								{showSettings('iconSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Icon Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonials-icon-settings'}
									>
										<ToggleControl
											label={__('Show Top Icon', 'kadence-blocks')}
											checked={displayIcon}
											onChange={(value) => setAttributes({ displayIcon: value })}
										/>
										{displayIcon && (
											<Fragment>
												<KadenceIconPicker
													value={iconStyles[0].icon}
													onChange={(value) => {
														saveIconStyles({ icon: value });
													}}
												/>
												<RangeControl
													label={__('Icon Size', 'kadence-blocks')}
													value={iconStyles[0].size}
													onChange={(value) => saveIconStyles({ size: value })}
													step={1}
													min={1}
													max={120}
												/>
												{iconStyles[0].icon && 'fe' === iconStyles[0].icon.substring(0, 2) && (
													<RangeControl
														label={__('Line Width', 'kadence-blocks')}
														value={iconStyles[0].stroke}
														onChange={(value) => {
															saveIconStyles({ stroke: value });
														}}
														step={0.5}
														min={0.5}
														max={4}
													/>
												)}
												<PopColorControl
													label={__('Color', 'kadence-blocks')}
													value={iconStyles[0].color ? iconStyles[0].color : ''}
													default={''}
													onChange={(value) => saveIconStyles({ color: value })}
												/>
												<div className="kt-spacer-sidebar-15"></div>
												<ResponsiveBorderControl
													label={__('Icon Border', 'kadence-blocks')}
													value={iconBorderStyle}
													tabletValue={tabletIconBorderStyle}
													mobileValue={mobileIconBorderStyle}
													onChange={(value) => setAttributes({ iconBorderStyle: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletIconBorderStyle: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileIconBorderStyle: value })
													}
												/>
												<ResponsiveMeasurementControls
													label={__('Icon Border Radius', 'kadence-blocks')}
													value={iconBorderRadius}
													tabletValue={tabletIconBorderRadius}
													mobileValue={mobileIconBorderRadius}
													onChange={(value) => setAttributes({ iconBorderRadius: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletIconBorderRadius: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileIconBorderRadius: value })
													}
													min={0}
													max={
														iconBorderRadiusUnit === 'em' || iconBorderRadiusUnit === 'rem'
															? 24
															: 100
													}
													step={
														iconBorderRadiusUnit === 'em' || iconBorderRadiusUnit === 'rem'
															? 0.1
															: 1
													}
													unit={iconBorderRadiusUnit}
													units={['px', 'em', 'rem', '%']}
													onUnit={(value) => setAttributes({ iconBorderRadiusUnit: value })}
													isBorderRadius={true}
													allowEmpty={true}
												/>
												<PopColorControl
													label={__('Icon Background', 'kadence-blocks')}
													value={iconStyles[0].background ? iconStyles[0].background : ''}
													default={''}
													onChange={(value) => saveIconStyles({ background: value })}
													opacityValue={iconStyles[0].backgroundOpacity}
													onOpacityChange={(value) =>
														saveIconStyles({ backgroundOpacity: value })
													}
													onArrayChange={(color, opacity) =>
														saveIconStyles({
															background: color,
															backgroundOpacity: opacity,
														})
													}
												/>
												<div className="kt-spacer-sidebar-15"></div>
												<ResponsiveMeasureRangeControl
													label={__('Icon Padding', 'kadence-blocks')}
													value={iconPadding}
													onChange={(value) => setAttributes({ iconPadding: value })}
													tabletValue={tabletIconPadding}
													onChangeTablet={(value) =>
														setAttributes({ tabletIconPadding: value })
													}
													mobileValue={mobileIconPadding}
													onChangeMobile={(value) =>
														setAttributes({ mobileIconPadding: value })
													}
													min={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 0 : 0}
													max={
														iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 12 : 999
													}
													step={
														iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 0.1 : 1
													}
													unit={iconPaddingUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ iconPaddingUnit: value })}
												/>
												<ResponsiveMeasureRangeControl
													label={__('Icon Margin', 'kadence-blocks')}
													value={iconMargin}
													onChange={(value) => setAttributes({ iconMargin: value })}
													tabletValue={tabletIconMargin}
													onChangeTablet={(value) =>
														setAttributes({ tabletIconMargin: value })
													}
													mobileValue={mobileIconMargin}
													onChangeMobile={(value) =>
														setAttributes({ mobileIconMargin: value })
													}
													min={
														iconMarginUnit === 'em' || iconMarginUnit === 'rem' ? -2 : -999
													}
													max={iconMarginUnit === 'em' || iconMarginUnit === 'rem' ? 12 : 999}
													step={iconMarginUnit === 'em' || iconMarginUnit === 'rem' ? 0.1 : 1}
													unit={iconMarginUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ iconMarginUnit: value })}
													allowAuto={true}
												/>
											</Fragment>
										)}
									</KadencePanelBody>
								)}
								{showSettings('titleSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Title Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonials-title-settings'}
									>
										<ToggleControl
											label={__('Show Title', 'kadence-blocks')}
											checked={displayTitle}
											onChange={(value) => setAttributes({ displayTitle: value })}
										/>
										{displayTitle && (
											<Fragment>
												<PopColorControl
													label={__('Color Settings', 'kadence-blocks')}
													value={titleFont[0].color ? titleFont[0].color : ''}
													default={''}
													onChange={(value) => saveTitleFont({ color: value })}
												/>
												<TypographyControls
													fontGroup={'heading'}
													tagLevel={titleFont[0].level}
													tagLowLevel={2}
													onTagLevel={(value) => saveTitleFont({ level: value })}
													fontSize={titleFont[0].size}
													onFontSize={(value) => saveTitleFont({ size: value })}
													fontSizeType={titleFont[0].sizeType}
													onFontSizeType={(value) => saveTitleFont({ sizeType: value })}
													lineHeight={titleFont[0].lineHeight}
													onLineHeight={(value) => saveTitleFont({ lineHeight: value })}
													lineHeightType={titleFont[0].lineType}
													onLineHeightType={(value) => saveTitleFont({ lineType: value })}
													letterSpacing={titleFont[0].letterSpacing}
													onLetterSpacing={(value) => saveTitleFont({ letterSpacing: value })}
													textTransform={titleFont[0].textTransform}
													onTextTransform={(value) => saveTitleFont({ textTransform: value })}
													fontFamily={titleFont[0].family}
													onFontFamily={(value) => saveTitleFont({ family: value })}
													onFontChange={(select) => {
														saveTitleFont({
															family: select.value,
															google: select.google,
														});
													}}
													onFontArrayChange={(values) => saveTitleFont(values)}
													googleFont={titleFont[0].google}
													onGoogleFont={(value) => saveTitleFont({ google: value })}
													loadGoogleFont={titleFont[0].loadGoogle}
													onLoadGoogleFont={(value) => saveTitleFont({ loadGoogle: value })}
													fontVariant={titleFont[0].variant}
													onFontVariant={(value) => saveTitleFont({ variant: value })}
													fontWeight={titleFont[0].weight}
													onFontWeight={(value) => saveTitleFont({ weight: value })}
													fontStyle={titleFont[0].style}
													onFontStyle={(value) => saveTitleFont({ style: value })}
													fontSubset={titleFont[0].subset}
													onFontSubset={(value) => saveTitleFont({ subset: value })}
												/>
												<ResponsiveMeasureRangeControl
													label={__('Padding', 'kadence-blocks')}
													value={titlePadding}
													onChange={(value) => setAttributes({ titlePadding: value })}
													tabletValue={tabletTitlePadding}
													onChangeTablet={(value) =>
														setAttributes({ tabletTitlePadding: value })
													}
													mobileValue={mobileTitlePadding}
													onChangeMobile={(value) =>
														setAttributes({ mobileTitlePadding: value })
													}
													min={
														titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 0 : 0
													}
													max={
														titlePaddingUnit === 'em' || titlePaddingUnit === 'rem'
															? 12
															: 999
													}
													step={
														titlePaddingUnit === 'em' || titlePaddingUnit === 'rem'
															? 0.1
															: 1
													}
													unit={titlePaddingUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ titlePaddingUnit: value })}
												/>
												<ResponsiveMeasureRangeControl
													label={__('Margin', 'kadence-blocks')}
													value={titleMargin}
													onChange={(value) => setAttributes({ titleMargin: value })}
													tabletValue={tabletTitleMargin}
													onChangeTablet={(value) =>
														setAttributes({ tabletTitleMargin: value })
													}
													mobileValue={mobileTitleMargin}
													onChangeMobile={(value) =>
														setAttributes({ mobileTitleMargin: value })
													}
													min={
														titleMarginUnit === 'em' || titleMarginUnit === 'rem'
															? -2
															: -999
													}
													max={
														titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 12 : 999
													}
													step={
														titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 0.1 : 1
													}
													unit={titleMarginUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ titleMarginUnit: value })}
													allowAuto={true}
												/>
												<ResponsiveRangeControls
													label={__('Title Min Height', 'kadence-blocks')}
													value={
														titleMinHeight && undefined !== titleMinHeight[0]
															? titleMinHeight[0]
															: ''
													}
													onChange={(value) =>
														setAttributes({
															titleMinHeight: [
																value,
																titleMinHeight && undefined !== titleMinHeight[1]
																	? titleMinHeight[1]
																	: '',
																titleMinHeight && undefined !== titleMinHeight[2]
																	? titleMinHeight[2]
																	: '',
															],
														})
													}
													tabletValue={
														titleMinHeight && undefined !== titleMinHeight[1]
															? titleMinHeight[1]
															: ''
													}
													onChangeTablet={(value) =>
														setAttributes({
															titleMinHeight: [
																titleMinHeight && undefined !== titleMinHeight[0]
																	? titleMinHeight[0]
																	: '',
																value,
																titleMinHeight && undefined !== titleMinHeight[2]
																	? titleMinHeight[2]
																	: '',
															],
														})
													}
													mobileValue={
														titleMinHeight && undefined !== titleMinHeight[2]
															? titleMinHeight[2]
															: ''
													}
													onChangeMobile={(value) =>
														setAttributes({
															titleMinHeight: [
																titleMinHeight && undefined !== titleMinHeight[0]
																	? titleMinHeight[0]
																	: '',
																titleMinHeight && undefined !== titleMinHeight[1]
																	? titleMinHeight[1]
																	: '',
																value,
															],
														})
													}
													min={0}
													max={200}
													step={1}
													unit={'px'}
													showUnit={true}
													units={['px']}
												/>
											</Fragment>
										)}
									</KadencePanelBody>
								)}
								{showSettings('ratingSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Rating Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonials-rating-settings'}
									>
										<ToggleControl
											label={__('Show Rating', 'kadence-blocks')}
											checked={displayRating}
											onChange={(value) => setAttributes({ displayRating: value })}
										/>
										{displayRating && (
											<Fragment>
												<PopColorControl
													label={__('Color', 'kadence-blocks')}
													value={ratingStyles[0].color ? ratingStyles[0].color : ''}
													default={''}
													onChange={(value) => saveRatingStyles({ color: value })}
												/>
												<RangeControl
													label={__('Icon Size', 'kadence-blocks')}
													value={ratingStyles[0].size}
													onChange={(value) => saveRatingStyles({ size: value })}
													step={1}
													min={1}
													max={120}
												/>
												<ResponsiveMeasureRangeControl
													label={__('Rating Padding', 'kadence-blocks')}
													value={ratingPadding}
													onChange={(value) => setAttributes({ ratingPadding: value })}
													tabletValue={tabletRatingPadding}
													onChangeTablet={(value) =>
														setAttributes({ tabletRatingPadding: value })
													}
													mobileValue={mobileRatingPadding}
													onChangeMobile={(value) =>
														setAttributes({ mobileRatingPadding: value })
													}
													min={
														ratingPaddingUnit === 'em' || ratingPaddingUnit === 'rem'
															? 0
															: 0
													}
													max={
														ratingPaddingUnit === 'em' || ratingPaddingUnit === 'rem'
															? 12
															: 999
													}
													step={
														ratingPaddingUnit === 'em' || ratingPaddingUnit === 'rem'
															? 0.1
															: 1
													}
													unit={ratingPaddingUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ ratingPaddingUnit: value })}
												/>
												<ResponsiveMeasureRangeControl
													label={__('Rating Margin', 'kadence-blocks')}
													value={ratingMargin}
													onChange={(value) => setAttributes({ ratingMargin: value })}
													tabletValue={tabletRatingMargin}
													onChangeTablet={(value) =>
														setAttributes({ tabletRatingMargin: value })
													}
													mobileValue={mobileRatingMargin}
													onChangeMobile={(value) =>
														setAttributes({ mobileRatingMargin: value })
													}
													min={
														ratingMarginUnit === 'em' || ratingMarginUnit === 'rem'
															? -2
															: -999
													}
													max={
														ratingMarginUnit === 'em' || ratingMarginUnit === 'rem'
															? 12
															: 999
													}
													step={
														ratingMarginUnit === 'em' || ratingMarginUnit === 'rem'
															? 0.1
															: 1
													}
													unit={ratingMarginUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ ratingMarginUnit: value })}
													allowAuto={true}
												/>
											</Fragment>
										)}
									</KadencePanelBody>
								)}

								{showSettings('contentSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Content Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonials-content-settings'}
									>
										<ToggleControl
											label={__('Show Content', 'kadence-blocks')}
											checked={displayContent}
											onChange={(value) => setAttributes({ displayContent: value })}
										/>
										{displayContent && (
											<Fragment>
												<PopColorControl
													label={__('Color', 'kadence-blocks')}
													value={contentFont[0].color ? contentFont[0].color : ''}
													default={''}
													onChange={(value) => saveContentFont({ color: value })}
												/>
												<TypographyControls
													fontGroup={'body'}
													fontSize={contentFont[0].size}
													onFontSize={(value) => saveContentFont({ size: value })}
													fontSizeType={contentFont[0].sizeType}
													onFontSizeType={(value) => saveContentFont({ sizeType: value })}
													lineHeight={contentFont[0].lineHeight}
													onLineHeight={(value) => saveContentFont({ lineHeight: value })}
													lineHeightType={contentFont[0].lineType}
													onLineHeightType={(value) => saveContentFont({ lineType: value })}
													letterSpacing={contentFont[0].letterSpacing}
													onLetterSpacing={(value) =>
														saveContentFont({ letterSpacing: value })
													}
													textTransform={contentFont[0].textTransform}
													onTextTransform={(value) =>
														saveContentFont({ textTransform: value })
													}
													fontFamily={contentFont[0].family}
													onFontFamily={(value) => saveContentFont({ family: value })}
													onFontChange={(select) => {
														saveContentFont({
															family: select.value,
															google: select.google,
														});
													}}
													onFontArrayChange={(values) => saveContentFont(values)}
													googleFont={contentFont[0].google}
													onGoogleFont={(value) => saveContentFont({ google: value })}
													loadGoogleFont={contentFont[0].loadGoogle}
													onLoadGoogleFont={(value) => saveContentFont({ loadGoogle: value })}
													fontVariant={contentFont[0].variant}
													onFontVariant={(value) => saveContentFont({ variant: value })}
													fontWeight={contentFont[0].weight}
													onFontWeight={(value) => saveContentFont({ weight: value })}
													fontStyle={contentFont[0].style}
													onFontStyle={(value) => saveContentFont({ style: value })}
													fontSubset={contentFont[0].subset}
													onFontSubset={(value) => saveContentFont({ subset: value })}
												/>
												<ResponsiveRangeControls
													label={__('Content Min Height', 'kadence-blocks')}
													value={
														contentMinHeight && undefined !== contentMinHeight[0]
															? contentMinHeight[0]
															: ''
													}
													onChange={(value) =>
														setAttributes({
															contentMinHeight: [
																value,
																contentMinHeight && undefined !== contentMinHeight[1]
																	? contentMinHeight[1]
																	: '',
																contentMinHeight && undefined !== contentMinHeight[2]
																	? contentMinHeight[2]
																	: '',
															],
														})
													}
													tabletValue={
														contentMinHeight && undefined !== contentMinHeight[1]
															? contentMinHeight[1]
															: ''
													}
													onChangeTablet={(value) =>
														setAttributes({
															contentMinHeight: [
																contentMinHeight && undefined !== contentMinHeight[0]
																	? contentMinHeight[0]
																	: '',
																value,
																contentMinHeight && undefined !== contentMinHeight[2]
																	? contentMinHeight[2]
																	: '',
															],
														})
													}
													mobileValue={
														contentMinHeight && undefined !== contentMinHeight[2]
															? contentMinHeight[2]
															: ''
													}
													onChangeMobile={(value) =>
														setAttributes({
															contentMinHeight: [
																contentMinHeight && undefined !== contentMinHeight[0]
																	? contentMinHeight[0]
																	: '',
																contentMinHeight && undefined !== contentMinHeight[1]
																	? contentMinHeight[1]
																	: '',
																value,
															],
														})
													}
													min={0}
													max={400}
													step={1}
													unit={'px'}
													showUnit={true}
													units={['px']}
												/>
											</Fragment>
										)}
									</KadencePanelBody>
								)}
								{showSettings('mediaSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Media Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonials-media-settings'}
									>
										<ToggleControl
											label={__('Show Media', 'kadence-blocks')}
											checked={displayMedia}
											onChange={(value) => setAttributes({ displayMedia: value })}
										/>
										{displayMedia && (
											<Fragment>
												{'card' !== style && (
													<RangeControl
														label={__('Media Max Size', 'kadence-blocks')}
														value={mediaStyles[0].width}
														onChange={(value) => savemediaStyles({ width: value })}
														step={1}
														min={2}
														max={800}
													/>
												)}
												<ResponsiveBorderControl
													label={__('Media Border', 'kadence-blocks')}
													value={mediaBorderStyle}
													tabletValue={tabletMediaBorderStyle}
													mobileValue={mobileMediaBorderStyle}
													onChange={(value) => setAttributes({ mediaBorderStyle: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletMediaBorderStyle: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileMediaBorderStyle: value })
													}
												/>
												<ResponsiveMeasurementControls
													label={__('Media Border Radius', 'kadence-blocks')}
													value={mediaBorderRadius}
													tabletValue={tabletMediaBorderRadius}
													mobileValue={mobileMediaBorderRadius}
													onChange={(value) => setAttributes({ mediaBorderRadius: value })}
													onChangeTablet={(value) =>
														setAttributes({ tabletMediaBorderRadius: value })
													}
													onChangeMobile={(value) =>
														setAttributes({ mobileMediaBorderRadius: value })
													}
													min={0}
													max={
														mediaBorderRadiusUnit === 'em' ||
														mediaBorderRadiusUnit === 'rem'
															? 24
															: 100
													}
													step={
														mediaBorderRadiusUnit === 'em' ||
														mediaBorderRadiusUnit === 'rem'
															? 0.1
															: 1
													}
													unit={mediaBorderRadiusUnit}
													units={['px', 'em', 'rem', '%']}
													onUnit={(value) => setAttributes({ mediaBorderRadiusUnit: value })}
													isBorderRadius={true}
													allowEmpty={true}
												/>
												<PopColorControl
													label={__('Media Background', 'kadence-blocks')}
													value={mediaStyles[0].background ? mediaStyles[0].background : ''}
													default={''}
													onChange={(value) => savemediaStyles({ background: value })}
													opacityValue={mediaStyles[0].backgroundOpacity}
													onOpacityChange={(value) =>
														savemediaStyles({ backgroundOpacity: value })
													}
													onArrayChange={(color, opacity) =>
														savemediaStyles({
															background: color,
															backgroundOpacity: opacity,
														})
													}
												/>

												<div className="kt-spacer-sidebar-15"></div>
												<ResponsiveMeasureRangeControl
													label={__('Media Padding', 'kadence-blocks')}
													value={mediaPadding}
													onChange={(value) => setAttributes({ mediaPadding: value })}
													tabletValue={tabletMediaPadding}
													onChangeTablet={(value) =>
														setAttributes({ tabletMediaPadding: value })
													}
													mobileValue={mobileMediaPadding}
													onChangeMobile={(value) =>
														setAttributes({ mobileMediaPadding: value })
													}
													min={
														mediaPaddingUnit === 'em' || mediaPaddingUnit === 'rem' ? 0 : 0
													}
													max={
														mediaPaddingUnit === 'em' || mediaPaddingUnit === 'rem'
															? 12
															: 999
													}
													step={
														mediaPaddingUnit === 'em' || mediaPaddingUnit === 'rem'
															? 0.1
															: 1
													}
													unit={mediaPaddingUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ mediaPaddingUnit: value })}
												/>
												<ResponsiveMeasureRangeControl
													label={__('Media Margin', 'kadence-blocks')}
													value={mediaMargin}
													onChange={(value) => setAttributes({ mediaMargin: value })}
													tabletValue={tabletMediaMargin}
													onChangeTablet={(value) =>
														setAttributes({ tabletMediaMargin: value })
													}
													mobileValue={mobileMediaMargin}
													onChangeMobile={(value) =>
														setAttributes({ mobileMediaMargin: value })
													}
													min={
														mediaMarginUnit === 'em' || mediaMarginUnit === 'rem'
															? -2
															: -999
													}
													max={
														mediaMarginUnit === 'em' || mediaMarginUnit === 'rem' ? 12 : 999
													}
													step={
														mediaMarginUnit === 'em' || mediaMarginUnit === 'rem' ? 0.1 : 1
													}
													unit={mediaMarginUnit}
													units={['px', 'em', 'rem']}
													onUnit={(value) => setAttributes({ mediaMarginUnit: value })}
													allowAuto={true}
												/>
												{'card' === style && (
													<Fragment>
														<SelectControl
															label={__('Image Size', 'kadence-blocks')}
															options={[
																{
																	label: __('Cover', 'kadence-blocks'),
																	value: 'cover',
																},
																{
																	label: __('Contain', 'kadence-blocks'),
																	value: 'Contain',
																},
																{
																	label: __('Auto', 'kadence-blocks'),
																	value: 'auto',
																},
															]}
															value={mediaStyles[0].backgroundSize}
															onChange={(value) =>
																savemediaStyles({ backgroundSize: value })
															}
														/>
														<SelectControl
															label={__('Image Ratio', 'kadence-blocks')}
															options={[
																{
																	label: __('Landscape 4:2', 'kadence-blocks'),
																	value: '50',
																},
																{
																	label: __('Landscape 3:2', 'kadence-blocks'),
																	value: '66.67',
																},
																{
																	label: __('Landscape 4:3', 'kadence-blocks'),
																	value: '75',
																},
																{
																	label: __('Portrait 3:4', 'kadence-blocks'),
																	value: '133.33',
																},
																{
																	label: __('Portrait 2:3', 'kadence-blocks'),
																	value: '150',
																},
																{
																	label: __('Square 1:1', 'kadence-blocks'),
																	value: '100',
																},
															]}
															value={
																undefined === mediaStyles[0].ratio ||
																'' === mediaStyles[0].ratio
																	? '50'
																	: mediaStyles[0].ratio
															}
															onChange={(value) => savemediaStyles({ ratio: value })}
														/>
													</Fragment>
												)}
											</Fragment>
										)}
									</KadencePanelBody>
								)}
								{showSettings('nameSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Name Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonials-name-settings'}
									>
										<ToggleControl
											label={__('Show Name', 'kadence-blocks')}
											checked={displayName}
											onChange={(value) => setAttributes({ displayName: value })}
										/>
										{displayName && (
											<Fragment>
												<PopColorControl
													label={__('Color', 'kadence-blocks')}
													value={nameFont[0].color ? nameFont[0].color : ''}
													default={''}
													onChange={(value) => saveNameFont({ color: value })}
												/>
												<TypographyControls
													fontGroup={'body'}
													fontSize={nameFont[0].size}
													onFontSize={(value) => saveNameFont({ size: value })}
													fontSizeType={nameFont[0].sizeType}
													onFontSizeType={(value) => saveNameFont({ sizeType: value })}
													lineHeight={nameFont[0].lineHeight}
													onLineHeight={(value) => saveNameFont({ lineHeight: value })}
													lineHeightType={nameFont[0].lineType}
													onLineHeightType={(value) => saveNameFont({ lineType: value })}
													letterSpacing={nameFont[0].letterSpacing}
													onLetterSpacing={(value) => saveNameFont({ letterSpacing: value })}
													textTransform={nameFont[0].textTransform}
													onTextTransform={(value) => saveNameFont({ textTransform: value })}
													fontFamily={nameFont[0].family}
													onFontFamily={(value) => saveNameFont({ family: value })}
													onFontChange={(select) => {
														saveNameFont({
															family: select.value,
															google: select.google,
														});
													}}
													onFontArrayChange={(values) => saveNameFont(values)}
													googleFont={nameFont[0].google}
													onGoogleFont={(value) => saveNameFont({ google: value })}
													loadGoogleFont={nameFont[0].loadGoogle}
													onLoadGoogleFont={(value) => saveNameFont({ loadGoogle: value })}
													fontVariant={nameFont[0].variant}
													onFontVariant={(value) => saveNameFont({ variant: value })}
													fontWeight={nameFont[0].weight}
													onFontWeight={(value) => saveNameFont({ weight: value })}
													fontStyle={nameFont[0].style}
													onFontStyle={(value) => saveNameFont({ style: value })}
													fontSubset={nameFont[0].subset}
													onFontSubset={(value) => saveNameFont({ subset: value })}
												/>
											</Fragment>
										)}
									</KadencePanelBody>
								)}
								{showSettings('occupationSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Occupation Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonails-occupation-settings'}
									>
										<ToggleControl
											label={__('Show Occupation', 'kadence-blocks')}
											checked={displayOccupation}
											onChange={(value) => setAttributes({ displayOccupation: value })}
										/>
										{displayOccupation && (
											<Fragment>
												<PopColorControl
													label={__('Color', 'kadence-blocks')}
													value={occupationFont[0].color ? occupationFont[0].color : ''}
													default={''}
													onChange={(value) => saveOccupationFont({ color: value })}
												/>
												<TypographyControls
													fontGroup={'body'}
													fontSize={occupationFont[0].size}
													onFontSize={(value) => saveOccupationFont({ size: value })}
													fontSizeType={occupationFont[0].sizeType}
													onFontSizeType={(value) => saveOccupationFont({ sizeType: value })}
													lineHeight={occupationFont[0].lineHeight}
													onLineHeight={(value) => saveOccupationFont({ lineHeight: value })}
													lineHeightType={occupationFont[0].lineType}
													onLineHeightType={(value) =>
														saveOccupationFont({ lineType: value })
													}
													textTransform={occupationFont[0].textTransform}
													onTextTransform={(value) =>
														saveOccupationFont({ textTransform: value })
													}
													letterSpacing={occupationFont[0].letterSpacing}
													onLetterSpacing={(value) =>
														saveOccupationFont({ letterSpacing: value })
													}
													fontFamily={occupationFont[0].family}
													onFontFamily={(value) => saveOccupationFont({ family: value })}
													onFontChange={(select) => {
														saveOccupationFont({
															family: select.value,
															google: select.google,
														});
													}}
													onFontArrayChange={(values) => saveOccupationFont(values)}
													googleFont={occupationFont[0].google}
													onGoogleFont={(value) => saveOccupationFont({ google: value })}
													loadGoogleFont={occupationFont[0].loadGoogle}
													onLoadGoogleFont={(value) =>
														saveOccupationFont({ loadGoogle: value })
													}
													fontVariant={occupationFont[0].variant}
													onFontVariant={(value) => saveOccupationFont({ variant: value })}
													fontWeight={occupationFont[0].weight}
													onFontWeight={(value) => saveOccupationFont({ weight: value })}
													fontStyle={occupationFont[0].style}
													onFontStyle={(value) => saveOccupationFont({ style: value })}
													fontSubset={occupationFont[0].subset}
													onFontSubset={(value) => saveOccupationFont({ subset: value })}
												/>
											</Fragment>
										)}
									</KadencePanelBody>
								)}
							</>
						)}

						{activeTab === 'advanced' && (
							<>
								<KadencePanelBody panelName={'kb-testimonials-spacings-settings'}>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={containerPadding}
										tabletValue={tabletContainerPadding}
										mobileValue={mobileContainerPadding}
										onChange={(value) => setAttributes({ containerPadding: value })}
										onChangeTablet={(value) => setAttributes({ tabletContainerPadding: value })}
										onChangeMobile={(value) => setAttributes({ mobileContainerPadding: value })}
										min={0}
										max={containerPaddingType === 'em' || containerPaddingType === 'rem' ? 12 : 999}
										step={containerPaddingType === 'em' || containerPaddingType === 'rem' ? 0.1 : 1}
										unit={containerPaddingType ? containerPaddingType : 'px'}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ containerPaddingType: value })}
										onMouseOver={paddingMouseOver.onMouseOver}
										onMouseOut={paddingMouseOver.onMouseOut}
									/>
									<RangeControl
										label={__('Container Max Width (px)', 'kadence-blocks')}
										value={containerMaxWidth}
										onChange={(value) => setAttributes({ containerMaxWidth: value })}
										step={5}
										min={50}
										max={2000}
									/>
									<ResponsiveRangeControls
										label={__('Container Min Height', 'kadence-blocks')}
										value={
											containerMinHeight && undefined !== containerMinHeight[0]
												? containerMinHeight[0]
												: ''
										}
										onChange={(value) =>
											setAttributes({
												containerMinHeight: [
													value,
													containerMinHeight && undefined !== containerMinHeight[1]
														? containerMinHeight[1]
														: '',
													containerMinHeight && undefined !== containerMinHeight[2]
														? containerMinHeight[2]
														: '',
												],
											})
										}
										tabletValue={
											containerMinHeight && undefined !== containerMinHeight[1]
												? containerMinHeight[1]
												: ''
										}
										onChangeTablet={(value) =>
											setAttributes({
												containerMinHeight: [
													containerMinHeight && undefined !== containerMinHeight[0]
														? containerMinHeight[0]
														: '',
													value,
													containerMinHeight && undefined !== containerMinHeight[2]
														? containerMinHeight[2]
														: '',
												],
											})
										}
										mobileValue={
											containerMinHeight && undefined !== containerMinHeight[2]
												? containerMinHeight[2]
												: ''
										}
										onChangeMobile={(value) =>
											setAttributes({
												containerMinHeight: [
													containerMinHeight && undefined !== containerMinHeight[0]
														? containerMinHeight[0]
														: '',
													containerMinHeight && undefined !== containerMinHeight[1]
														? containerMinHeight[1]
														: '',
													value,
												],
											})
										}
										min={0}
										max={600}
										step={1}
										unit={'px'}
										showUnit={true}
										units={['px']}
									/>
									{containerMinHeight &&
										(containerMinHeight[0] || containerMinHeight[1] || containerMinHeight[2]) && (
											<>
												<div className="kt-btn-size-settings-container">
													<h2 className="kt-beside-btn-group">
														{__('Inner Content Align', 'kadence-blocks')}
													</h2>
													<ButtonGroup
														className="kt-button-size-type-options"
														aria-label={__('Inner Content Align', 'kadence-blocks')}
													>
														{map(VAlignOptions, ({ name, icon, key }) => (
															<Tooltip text={name}>
																<Button
																	key={key}
																	className="kt-btn-size-btn"
																	isSmall
																	isPrimary={containerVAlign === key}
																	aria-pressed={containerVAlign === key}
																	onClick={() => {
																		if (containerVAlign === key) {
																			setAttributes({ containerVAlign: '' });
																		} else {
																			setAttributes({ containerVAlign: key });
																		}
																	}}
																>
																	{icon}
																</Button>
															</Tooltip>
														))}
													</ButtonGroup>
												</div>
											</>
										)}
								</KadencePanelBody>
								{showSettings('wrapperSettings', 'kadence/testimonials') && (
									<KadencePanelBody
										title={__('Wrapper', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-testimonials-wrapper-padding'}
									>
										<ResponsiveMeasureRangeControl
											label={__('Padding', 'kadence-blocks')}
											value={wrapperPadding}
											onChange={(value) => setAttributes({ wrapperPadding: value })}
											tabletValue={wrapperTabletPadding}
											onChangeTablet={(value) => setAttributes({ wrapperTabletPadding: value })}
											mobileValue={wrapperMobilePadding}
											onChangeMobile={(value) => setAttributes({ wrapperMobilePadding: value })}
											min={0}
											max={wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 25 : 999}
											step={wrapperPaddingType === 'em' || wrapperPaddingType === 'rem' ? 0.1 : 1}
											unit={wrapperPaddingType}
											units={['px', 'em', 'rem']}
											onUnit={(value) => setAttributes({ wrapperPaddingType: value })}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Margin', 'kadence-blocks')}
											value={wrapperMargin}
											onChange={(value) => setAttributes({ wrapperMargin: value })}
											tabletValue={tabletWrapperMargin}
											onChangeTablet={(value) => setAttributes({ tabletWrapperMargin: value })}
											mobileValue={mobileWrapperMargin}
											onChangeMobile={(value) => setAttributes({ mobileWrapperMargin: value })}
											min={wrapperMarginUnit === 'em' || wrapperMarginUnit === 'rem' ? -25 : -999}
											max={wrapperMarginUnit === 'em' || wrapperMarginUnit === 'rem' ? 25 : 999}
											step={wrapperMarginUnit === 'em' || wrapperMarginUnit === 'rem' ? 0.1 : 1}
											unit={wrapperMarginUnit}
											units={['px', 'em', 'rem']}
											onUnit={(value) => setAttributes({ wrapperMarginUnit: value })}
											allowAuto={true}
										/>
									</KadencePanelBody>
								)}

								<div className="kt-sidebar-settings-spacer"></div>

								<KadenceBlockDefaults
									attributes={attributes}
									defaultAttributes={metadata.attributes}
									blockSlug={metadata.name}
									excludedAttrs={nonTransAttrs}
									preventMultiple={['testimonials']}
								/>
							</>
						)}
					</InspectorControls>
				</Fragment>
			)}
			{showPreset && (
				<div className="kt-select-starter-style-tabs kt-select-starter-style-infobox">
					<div className="kt-select-starter-style-tabs-title">
						{__('Select Initial Style', 'kadence-blocks')}
					</div>
					<ButtonGroup className="kt-init-tabs-btn-group" aria-label={__('Initial Style', 'kadence-blocks')}>
						{map(startlayoutOptions, ({ name, key, icon }) => (
							<Button
								key={key}
								className="kt-inital-tabs-style-btn"
								isSmall
								onClick={() => {
									setInitalLayout(key);
									setShowPreset(false);
								}}
							>
								{icon}
							</Button>
						))}
					</ButtonGroup>
				</div>
			)}
			{!showPreset && (
				<>
					{layout && layout === 'carousel' && (
						<Splide
							options={carouselSettings}
							ref={carouselRef}
							aria-label={__('Testimonial Carousel', 'kadence-blocks')}
							className={`splide kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`}
							hasTrack={false}
						>
							<SplideTrack {...innerBlocksProps}></SplideTrack>
						</Splide>
					)}
					{layout && layout === 'grid' && (
						<div
							className={'kt-testimonial-grid-wrap'}
							style={{
								'grid-row-gap': columnGap + 'px',
								'grid-column-gap': columnGap + 'px',
							}}
						>
							<InnerBlocks
								template={[['kadence/testimonial']]}
								templateLock={false}
								templateInsertUpdatesSelection={true}
								allowedBlocks={['kadence/testimonial']}
							/>
						</div>
					)}

					{displayTitle && titleFont[0].google && <WebfontLoader config={config}></WebfontLoader>}
					{displayContent && contentFont[0].google && <WebfontLoader config={tconfig}></WebfontLoader>}
					{displayName && nameFont[0].google && <WebfontLoader config={lconfig}></WebfontLoader>}
					{displayOccupation && occupationFont[0].google && <WebfontLoader config={oconfig}></WebfontLoader>}
				</>
			)}
		</div>
	);
}

//export default KadenceTestimonials;
const KadenceTestimonialsWrapper = withDispatch((dispatch, ownProps, registry) => ({
	insertTestimonial(newBlock) {
		const { clientId } = ownProps;
		const { insertBlock } = dispatch(blockEditorStore);
		const { getBlock } = registry.select(blockEditorStore);
		const block = getBlock(clientId);
		insertBlock(newBlock, parseInt(block.innerBlocks.length), clientId);
	},
	insertTestimonialItems(newBlocks) {
		const { clientId } = ownProps;
		const { replaceInnerBlocks } = dispatch(blockEditorStore);

		replaceInnerBlocks(clientId, newBlocks);
	},
	onDelete() {
		const { clientId } = ownProps;
		const { removeBlock } = dispatch(blockEditorStore);
		removeBlock(clientId, true);
	},
}))(KadenceTestimonials);
const KadenceTestimonialsEdit = (props) => {
	const { clientId } = props;
	const { testimonialBlock } = useSelect(
		(select) => {
			const { getBlock } = select('core/block-editor');
			const block = getBlock(clientId);
			return {
				testimonialBlock: block,
			};
		},
		[clientId]
	);
	return <KadenceTestimonialsWrapper testimonialBlock={testimonialBlock} {...props} />;
};
export default KadenceTestimonialsEdit;
