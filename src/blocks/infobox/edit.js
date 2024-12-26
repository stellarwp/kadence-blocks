/**
 * BLOCK: Kadence Info Block
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
	infoLeftIcon,
	infoStartIcon,
	infoBasicIcon,
	infoLeftAboveIcon,
	infoTopOverlayIcon,
	infoLeftOverlayIcon,
} from '@kadence/icons';
import classnames from 'classnames';

import { store as noticesStore } from '@wordpress/notices';

import { debounce, map, get, has, isEmpty } from 'lodash';
import {
	PopColorControl,
	TypographyControls,
	RangeControl,
	KadencePanelBody,
	KadenceIconPicker,
	IconRender,
	URLInputControl,
	WebfontLoader,
	BoxShadowControl,
	KadenceImageControl,
	KadenceMediaPlaceholder,
	ImageSizeControl,
	MeasurementControls,
	ResponsiveRangeControls,
	InspectorControlTabs,
	ResponsiveAlignControls,
	ResponsiveControl,
	SmallResponsiveControl,
	ResponsiveBorderControl,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	ResponsiveMeasurementControls,
	SpacingVisualizer,
	HoverToggleControl,
	ColorGroup,
	CopyPasteAttributes,
} from '@kadence/components';

import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	ConvertColor,
	getBorderStyle,
	setBlockDefaults,
	getUniqueId,
	getInQueryBlock,
	getFontSizeOptionOutput,
	getPostOrFseId,
} from '@kadence/helpers';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, Fragment } from '@wordpress/element';

import { store as coreStore } from '@wordpress/core-data';

import {
	MediaUpload,
	RichText,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	Dropdown,
	ButtonGroup,
	TabPanel,
	Dashicon,
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	ToggleControl,
	SelectControl,
	TextareaControl,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

import { image, starFilled, plusCircleFilled } from '@wordpress/icons';

import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Build the overlay edit
 */

function KadenceInfoBox(props) {
	const { attributes, className, setAttributes, isSelected, context, clientId, name } = props;
	const {
		uniqueID,
		link,
		linkProperty,
		target,
		hAlign,
		containerBackground,
		containerHoverBackground,
		containerBorder,
		containerHoverBorder,
		containerBorderWidth,
		containerBorderRadius,
		containerPadding,
		containerPaddingType,
		containerMobilePadding,
		containerTabletPadding,
		mediaType,
		mediaImage,
		mediaIcon,
		mediaStyle,
		mediaAlign,
		displayTitle,
		title,
		titleColor,
		titleHoverColor,
		titleFont,
		displayText,
		contentText,
		textColor,
		textHoverColor,
		textFont,
		textSpacing,
		displayLearnMore,
		learnMore,
		learnMoreStyles,
		displayShadow,
		shadow,
		shadowHover,
		containerHoverBackgroundOpacity,
		containerBackgroundOpacity,
		containerHoverBorderOpacity,
		containerBorderOpacity,
		textMinHeight,
		textMinHeightUnit,
		titleMinHeight,
		titleMinHeightUnit,
		maxWidthUnit,
		maxWidthTabletUnit,
		maxWidthMobileUnit,
		maxWidth,
		mediaVAlign,
		mediaAlignMobile,
		mediaAlignTablet,
		hAlignMobile,
		hAlignTablet,
		containerMargin,
		tabletContainerMargin,
		mobileContainerMargin,
		containerMarginUnit,
		linkNoFollow,
		linkSponsored,
		number,
		mediaNumber,
		imageRatio,
		linkTitle,
		kadenceDynamic,
		inQueryBlock,
		borderStyle,
		borderRadius,
		borderRadiusUnit,
		tabletBorderStyle,
		tabletBorderRadius,
		mobileBorderStyle,
		mobileBorderRadius,
		borderHoverRadius,
		borderHoverStyle,
		borderHoverRadiusUnit,
		tabletBorderHoverStyle,
		tabletBorderHoverRadius,
		mobileBorderHoverStyle,
		mobileBorderHoverRadius,
		tabletMaxWidth,
		mobileMaxWidth,
		kbVersion,
		titleTagType,
		fullHeight,
	} = attributes;
	const [mediaBorderControl, setMediaBorderControl] = useState('linked');
	const [mediaPaddingControl, setMediaPaddingControl] = useState('linked');
	const [mediaMarginControl, setMediaMarginControl] = useState('linked');
	const [activeTab, setActiveTab] = useState('general');

	const { createSuccessNotice } = useDispatch(noticesStore);

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();
	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
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
			};
		},
		[clientId]
	);
	useEffect(() => {
		setBlockDefaults('kadence/infobox', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}

		setAttributes({ inQueryBlock: getInQueryBlock(context, inQueryBlock) });
		if (!kbVersion || kbVersion < 2) {
			setAttributes({ kbVersion: 2 });
		}
		debounce(getDynamic.bind(this), 200);
	}, []);
	useEffect(() => {
		if (
			mediaStyle[0].borderWidth[0] === mediaStyle[0].borderWidth[1] &&
			mediaStyle[0].borderWidth[0] === mediaStyle[0].borderWidth[2] &&
			mediaStyle[0].borderWidth[0] === mediaStyle[0].borderWidth[3]
		) {
			setMediaBorderControl('linked');
		} else {
			setMediaBorderControl('individual');
		}
		if (
			mediaStyle[0].padding[0] === mediaStyle[0].padding[1] &&
			mediaStyle[0].padding[0] === mediaStyle[0].padding[2] &&
			mediaStyle[0].padding[0] === mediaStyle[0].padding[3]
		) {
			setMediaPaddingControl('linked');
		} else {
			setMediaPaddingControl('individual');
		}
		if (
			mediaStyle[0].margin[0] === mediaStyle[0].margin[1] &&
			mediaStyle[0].margin[0] === mediaStyle[0].margin[2] &&
			mediaStyle[0].margin[0] === mediaStyle[0].margin[3]
		) {
			setMediaMarginControl('linked');
		} else {
			setMediaMarginControl('individual');
		}
		// Update from old border settings.
		if ('' !== containerBorderRadius) {
			setAttributes({
				borderRadius: [
					containerBorderRadius,
					containerBorderRadius,
					containerBorderRadius,
					containerBorderRadius,
				],
				containerBorderRadius: '',
			});
		}
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
		if ('' !== containerBorder) {
			tempBorderStyle[0].top[0] = ConvertColor(
				containerBorder,
				undefined !== containerBorderOpacity ? containerBorderOpacity : 1
			);
			tempBorderStyle[0].right[0] = ConvertColor(
				containerBorder,
				undefined !== containerBorderOpacity ? containerBorderOpacity : 1
			);
			tempBorderStyle[0].bottom[0] = ConvertColor(
				containerBorder,
				undefined !== containerBorderOpacity ? containerBorderOpacity : 1
			);
			tempBorderStyle[0].left[0] = ConvertColor(
				containerBorder,
				undefined !== containerBorderOpacity ? containerBorderOpacity : 1
			);
			updateBorderStyle = true;
			setAttributes({ containerBorder: '' });
		}
		if (
			'' !== containerBorderWidth?.[0] ||
			'' !== containerBorderWidth?.[1] ||
			'' !== containerBorderWidth?.[2] ||
			'' !== containerBorderWidth?.[3]
		) {
			tempBorderStyle[0].top[2] = containerBorderWidth?.[0] || '';
			tempBorderStyle[0].right[2] = containerBorderWidth?.[1] || '';
			tempBorderStyle[0].bottom[2] = containerBorderWidth?.[2] || '';
			tempBorderStyle[0].left[2] = containerBorderWidth?.[3] || '';
			updateBorderStyle = true;
			setAttributes({ containerBorderWidth: ['', '', '', ''] });
		}
		if (updateBorderStyle) {
			setAttributes({ borderStyle: tempBorderStyle });
		}
		const tempBorderHoverStyle = JSON.parse(
			JSON.stringify(
				attributes.borderHoverStyle
					? attributes.borderHoverStyle
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
		if ('' !== containerHoverBorder) {
			tempBorderHoverStyle[0].top[0] = ConvertColor(
				containerHoverBorder,
				undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1
			);
			tempBorderHoverStyle[0].right[0] = ConvertColor(
				containerHoverBorder,
				undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1
			);
			tempBorderHoverStyle[0].bottom[0] = ConvertColor(
				containerHoverBorder,
				undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1
			);
			tempBorderHoverStyle[0].left[0] = ConvertColor(
				containerHoverBorder,
				undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1
			);
			setAttributes({ containerHoverBorder: '', borderHoverStyle: tempBorderHoverStyle });
		}
		if ('' !== containerBackgroundOpacity && 1 !== containerBackgroundOpacity && containerBackground) {
			setAttributes({
				containerBackground: ConvertColor(
					containerBackground,
					undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1
				),
				containerBackgroundOpacity: '',
			});
		}
		if (
			'' !== containerHoverBackgroundOpacity &&
			1 !== containerHoverBackgroundOpacity &&
			containerHoverBackground
		) {
			setAttributes({
				containerHoverBackground: ConvertColor(
					containerHoverBackground,
					undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1
				),
				containerHoverBackgroundOpacity: '',
			});
		}
	}, []);

	const getDynamic = () => {
		let contextPost = null;
		if (context && context.queryId && context.postId) {
			contextPost = context.postId;
		}
		if (kadenceDynamic && kadenceDynamic['mediaImage:0:url'] && kadenceDynamic['mediaImage:0:url'].enable) {
			applyFilters('kadence.dynamicImage', '', attributes, setAttributes, 'mediaImage:0:url', context);
		}
	};
	const previewPaddingType = undefined !== containerPaddingType ? containerPaddingType : 'px';
	const paddingMin = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0 : 0;
	const paddingMax = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 25 : 999;
	const paddingStep = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0.1 : 1;
	const previewContainerPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[0] ? containerPadding[0] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[0]
			? containerTabletPadding[0]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[0] ? containerMobilePadding[0] : ''
	);
	const previewContainerPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[1] ? containerPadding[1] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[1]
			? containerTabletPadding[1]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[1] ? containerMobilePadding[1] : ''
	);
	const previewContainerPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[2] ? containerPadding[2] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[2]
			? containerTabletPadding[2]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[2] ? containerMobilePadding[2] : ''
	);
	const previewContainerPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== containerPadding && undefined !== containerPadding[3] ? containerPadding[3] : '',
		undefined !== containerTabletPadding && undefined !== containerTabletPadding[3]
			? containerTabletPadding[3]
			: '',
		undefined !== containerMobilePadding && undefined !== containerMobilePadding[3] ? containerMobilePadding[3] : ''
	);

	const previewContainerMarginTop = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[0] ? containerMargin[0] : '',
		undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[0] ? tabletContainerMargin[0] : '',
		undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[0] ? mobileContainerMargin[0] : ''
	);
	const previewContainerMarginRight = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[1] ? containerMargin[1] : '',
		undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[1] ? tabletContainerMargin[1] : '',
		undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[1] ? mobileContainerMargin[1] : ''
	);
	const previewContainerMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[2] ? containerMargin[2] : '',
		undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[2] ? tabletContainerMargin[2] : '',
		undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[2] ? mobileContainerMargin[2] : ''
	);
	const previewContainerMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== containerMargin && undefined !== containerMargin[3] ? containerMargin[3] : '',
		undefined !== tabletContainerMargin && undefined !== tabletContainerMargin[3] ? tabletContainerMargin[3] : '',
		undefined !== mobileContainerMargin && undefined !== mobileContainerMargin[3] ? mobileContainerMargin[3] : ''
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
	const previewLearnMoreMarginUnit = learnMoreStyles[0]?.marginUnit ? learnMoreStyles[0].marginUnit : 'px';
	const previewLearnMorePaddingUnit = learnMoreStyles[0]?.paddingUnit ? learnMoreStyles[0].paddingUnit : 'px';
	// Hover Border
	const previewBorderHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewBorderHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewBorderHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewBorderHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle
	);
	const previewHoverRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[0] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[0] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[0] : ''
	);
	const previewHoverRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[1] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[1] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[1] : ''
	);
	const previewHoverRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[2] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[2] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[2] : ''
	);
	const previewHoverRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[3] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[3] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[3] : ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		'' !== maxWidth ? maxWidth : '',
		'' !== tabletMaxWidth ? tabletMaxWidth : '',
		'' !== mobileMaxWidth ? mobileMaxWidth : ''
	);
	const previewMaxWidthUnit = getPreviewSize(
		previewDevice,
		maxWidthUnit ? maxWidthUnit : 'px',
		maxWidthTabletUnit ? maxWidthTabletUnit : '',
		maxWidthMobileUnit ? maxWidthMobileUnit : ''
	);

	const previewTitleFontSize = getPreviewSize(
		previewDevice,
		undefined !== titleFont[0].size && undefined !== titleFont[0].size[0] ? titleFont[0].size[0] : '',
		undefined !== titleFont[0].size && undefined !== titleFont[0].size[1] ? titleFont[0].size[1] : '',
		undefined !== titleFont[0].size && undefined !== titleFont[0].size[2] ? titleFont[0].size[2] : ''
	);
	const previewTitleLineHeight = getPreviewSize(
		previewDevice,
		undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[0]
			? titleFont[0].lineHeight[0]
			: '',
		undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[1]
			? titleFont[0].lineHeight[1]
			: '',
		undefined !== titleFont[0].lineHeight && undefined !== titleFont[0].lineHeight[2]
			? titleFont[0].lineHeight[2]
			: ''
	);
	const previewTitleMinHeight = getPreviewSize(
		previewDevice,
		undefined !== titleMinHeight && undefined !== titleMinHeight[0] ? titleMinHeight[0] : '',
		undefined !== titleMinHeight[1] && undefined !== titleMinHeight[1] ? titleMinHeight[1] : '',
		undefined !== titleMinHeight[2] && undefined !== titleMinHeight[2] ? titleMinHeight[2] : ''
	);

	const previewTextFontSize = getPreviewSize(
		previewDevice,
		undefined !== textFont[0].size && undefined !== textFont[0].size[0] ? textFont[0].size[0] : '',
		undefined !== textFont[0].size && undefined !== textFont[0].size[1] ? textFont[0].size[1] : '',
		undefined !== textFont[0].size && undefined !== textFont[0].size[2] ? textFont[0].size[2] : ''
	);
	const previewTextLineHeight = getPreviewSize(
		previewDevice,
		undefined !== textFont[0].lineHeight && undefined !== textFont[0].lineHeight[0]
			? textFont[0].lineHeight[0]
			: '',
		undefined !== textFont[0].lineHeight && undefined !== textFont[0].lineHeight[1]
			? textFont[0].lineHeight[1]
			: '',
		undefined !== textFont[0].lineHeight && undefined !== textFont[0].lineHeight[2] ? textFont[0].lineHeight[2] : ''
	);
	const previewTextMinHeight = getPreviewSize(
		previewDevice,
		undefined !== textMinHeight && undefined !== textMinHeight[0] ? textMinHeight[0] : '',
		undefined !== textMinHeight[1] && undefined !== textMinHeight[1] ? textMinHeight[1] : '',
		undefined !== textMinHeight[2] && undefined !== textMinHeight[2] ? textMinHeight[2] : ''
	);

	const previewLearnMoreFontSize = getPreviewSize(
		previewDevice,
		undefined !== learnMoreStyles[0].size && undefined !== learnMoreStyles[0].size[0]
			? learnMoreStyles[0].size[0]
			: '',
		undefined !== learnMoreStyles[0].size && undefined !== learnMoreStyles[0].size[1]
			? learnMoreStyles[0].size[1]
			: '',
		undefined !== learnMoreStyles[0].size && undefined !== learnMoreStyles[0].size[2]
			? learnMoreStyles[0].size[2]
			: ''
	);
	const previewLearnMoreLineHeight = getPreviewSize(
		previewDevice,
		undefined !== learnMoreStyles[0].lineHeight && undefined !== learnMoreStyles[0].lineHeight[0]
			? learnMoreStyles[0].lineHeight[0]
			: '',
		undefined !== learnMoreStyles[0].lineHeight && undefined !== learnMoreStyles[0].lineHeight[1]
			? learnMoreStyles[0].lineHeight[1]
			: '',
		undefined !== learnMoreStyles[0].lineHeight && undefined !== learnMoreStyles[0].lineHeight[2]
			? learnMoreStyles[0].lineHeight[2]
			: ''
	);

	const previewMediaIconSize = getPreviewSize(
		previewDevice,
		undefined !== mediaIcon[0] && undefined !== mediaIcon[0].size ? mediaIcon[0].size : '14',
		undefined !== mediaIcon[0].tabletSize && undefined !== mediaIcon[0].tabletSize ? mediaIcon[0].tabletSize : '',
		undefined !== mediaIcon[0].mobileSize && undefined !== mediaIcon[0].mobileSize ? mediaIcon[0].mobileSize : ''
	);

	const previewhAlign = getPreviewSize(
		previewDevice,
		'' !== hAlign ? hAlign : 'center',
		'' !== hAlignTablet ? hAlignTablet : '',
		'' !== hAlignMobile ? hAlignMobile : ''
	);
	const previewMediaAlign = getPreviewSize(
		previewDevice,
		'' !== mediaAlign ? mediaAlign : 'top',
		'' !== mediaAlignTablet ? mediaAlignTablet : '',
		'' !== mediaAlignMobile ? mediaAlignMobile : ''
	);

	const marginMin = containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? -25 : -999;
	const marginMax = containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 25 : 999;
	const marginStep = containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 0.1 : 1;

	const layoutPresetOptions = [
		{ key: 'simple', name: __('Basic', 'kadence-blocks'), icon: infoStartIcon },
		{ key: 'basic', name: __('Basic', 'kadence-blocks'), icon: infoBasicIcon },
		{ key: 'leftabove', name: __('Left Above', 'kadence-blocks'), icon: infoLeftAboveIcon },
		{ key: 'left', name: __('Left', 'kadence-blocks'), icon: infoLeftIcon },
		{ key: 'overlay', name: __('Overlay', 'kadence-blocks'), icon: infoTopOverlayIcon },
		{ key: 'overlayleft', name: __('Overlay Left', 'kadence-blocks'), icon: infoLeftOverlayIcon },
	];
	const setPresetLayout = (key) => {
		if ('simple' === key) {
			setAttributes({
				hAlign: 'center',
				containerBackground: '#ffffff' === containerBackground ? '' : containerBackground,
				containerHoverBackground,
				borderStyle: [
					{
						top: ['', '', ''],
						right: ['', '', ''],
						bottom: ['', '', ''],
						left: ['', '', ''],
						unit: 'px',
					},
				],
				borderRadius: ['', '', '', ''],
				containerPadding: ['xs', 'xs', 'xs', 'xs'],
				containerMargin: ['', '', '', ''],
				tabletContainerMargin: ['', '', '', ''],
				mobileContainerMargin: ['', '', '', ''],
				containerMarginUnit: 'px',
				mediaAlign: 'top',
				mediaIcon: [
					{
						icon: mediaIcon[0].icon,
						size: 50,
						width: mediaIcon[0].width,
						title: mediaIcon[0].title,
						color: mediaIcon[0].color,
						hoverColor: mediaIcon[0].hoverColor,
						hoverAnimation: mediaIcon[0].hoverAnimation,
						flipIcon: mediaIcon[0].flipIcon,
					},
				],
				mediaStyle: [
					{
						background:
							'var(--global-palette7, #eeeeee)' === mediaStyle[0].background ||
							'#eeeeee' === mediaStyle[0].background
								? ''
								: mediaStyle[0].background,
						hoverBackground: mediaStyle[0].hoverBackground,
						border: mediaStyle[0].border,
						hoverBorder: mediaStyle[0].hoverBorder,
						borderRadius: 0,
						borderWidth: [0, 0, 0, 0],
						padding: [10, 10, 10, 10],
						margin: [0, 15, 0, 15],
					},
				],
				titleFont: [
					{
						level: titleFont[0].level,
						size: titleFont[0].size,
						sizeType: titleFont[0].sizeType,
						lineHeight: titleFont[0].lineHeight,
						lineType: titleFont[0].lineType,
						letterSpacing: titleFont[0].letterSpacing,
						textTransform: titleFont[0].textTransform,
						family: titleFont[0].family,
						google: titleFont[0].google,
						style: titleFont[0].style,
						weight: titleFont[0].weight,
						variant: titleFont[0].variant,
						subset: titleFont[0].subset,
						loadGoogle: titleFont[0].loadGoogle,
						padding: [0, 0, 0, 0],
						paddingControl: 'linked',
						margin: [5, 0, 10, 0],
						marginControl: 'individual',
					},
				],
			});
		} else if ('basic' === key) {
			setAttributes({
				hAlign: 'center',
				containerBackground: '' === containerBackground ? '#ffffff' : containerBackground,
				containerHoverBackground,
				borderStyle: [
					{
						top: ['var(--global-palette7, #eeeeee)', '', 5],
						right: ['var(--global-palette7, #eeeeee)', '', 5],
						bottom: ['var(--global-palette7, #eeeeee)', '', 5],
						left: ['var(--global-palette7, #eeeeee)', '', 5],
						unit: 'px',
					},
				],
				borderRadius: [30, 30, 30, 30],
				containerPadding: ['xs', 'xs', 'xs', 'xs'],
				containerMargin: ['', '', '', ''],
				tabletContainerMargin: ['', '', '', ''],
				mobileContainerMargin: ['', '', '', ''],
				containerMarginUnit: 'px',
				mediaAlign: 'top',
				mediaIcon: [
					{
						icon: mediaIcon[0].icon,
						size: 50,
						width: mediaIcon[0].width,
						title: mediaIcon[0].title,
						color: mediaIcon[0].color,
						hoverColor: mediaIcon[0].hoverColor,
						hoverAnimation: mediaIcon[0].hoverAnimation,
						flipIcon: mediaIcon[0].flipIcon,
					},
				],
				mediaStyle: [
					{
						background:
							'' === mediaStyle[0].background || '#ffffff' === mediaStyle[0].background
								? 'var(--global-palette7, #eeeeee)'
								: mediaStyle[0].background,
						hoverBackground: mediaStyle[0].hoverBackground,
						border: mediaStyle[0].border,
						hoverBorder: mediaStyle[0].hoverBorder,
						borderRadius: 200,
						borderWidth: [0, 0, 0, 0],
						padding: 'icon' === mediaType || 'number' === mediaType ? [20, 20, 20, 20] : [0, 0, 0, 0],
						margin: [0, 15, 10, 15],
					},
				],
				mediaImage: [
					{
						url: mediaImage[0].url,
						id: mediaImage[0].id,
						alt: mediaImage[0].alt,
						width: mediaImage[0].width,
						height: mediaImage[0].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[0].hoverAnimation,
						flipUrl: mediaImage[0].flipUrl,
						flipId: mediaImage[0].flipId,
						flipAlt: mediaImage[0].flipAlt,
						flipWidth: mediaImage[0].flipWidth,
						flipHeight: mediaImage[0].flipHeight,
						subtype: mediaImage[0].subtype,
						flipSubtype: mediaImage[0].flipSubtype,
					},
				],
				titleFont: [
					{
						level: titleFont[0].level,
						size: titleFont[0].size,
						sizeType: titleFont[0].sizeType,
						lineHeight: titleFont[0].lineHeight,
						lineType: titleFont[0].lineType,
						letterSpacing: titleFont[0].letterSpacing,
						textTransform: titleFont[0].textTransform,
						family: titleFont[0].family,
						google: titleFont[0].google,
						style: titleFont[0].style,
						weight: titleFont[0].weight,
						variant: titleFont[0].variant,
						subset: titleFont[0].subset,
						loadGoogle: titleFont[0].loadGoogle,
						padding: [0, 0, 0, 0],
						paddingControl: 'linked',
						margin: [5, 0, 10, 0],
						marginControl: 'individual',
					},
				],
			});
		} else if ('leftabove' === key) {
			setAttributes({
				hAlign: 'left',
				containerBackground: '' === containerBackground ? '#ffffff' : containerBackground,
				containerHoverBackground,
				borderStyle: [
					{
						top: ['var(--global-palette7, #eeeeee)', '', 5],
						right: ['var(--global-palette7, #eeeeee)', '', 5],
						bottom: ['var(--global-palette7, #eeeeee)', '', 5],
						left: ['var(--global-palette7, #eeeeee)', '', 5],
						unit: 'px',
					},
				],
				borderRadius: ['', '', '', ''],
				containerPadding: ['sm', 'sm', 'sm', 'sm'],
				containerMargin: ['', '', '', ''],
				tabletContainerMargin: ['', '', '', ''],
				mobileContainerMargin: ['', '', '', ''],
				containerMarginUnit: 'px',
				mediaAlign: 'top',
				mediaIcon: [
					{
						icon: mediaIcon[0].icon,
						size: 50,
						width: mediaIcon[0].width,
						title: mediaIcon[0].title,
						color: mediaIcon[0].color,
						hoverColor: mediaIcon[0].hoverColor,
						hoverAnimation: mediaIcon[0].hoverAnimation,
						flipIcon: mediaIcon[0].flipIcon,
					},
				],
				mediaStyle: [
					{
						background:
							'' === mediaStyle[0].background || '#ffffff' === mediaStyle[0].background
								? 'var(--global-palette7, #eeeeee)'
								: mediaStyle[0].background,
						hoverBackground: mediaStyle[0].hoverBackground,
						border: mediaStyle[0].border,
						hoverBorder: mediaStyle[0].hoverBorder,
						borderRadius: 0,
						borderWidth: [0, 0, 0, 0],
						padding: 'icon' === mediaType || 'number' === mediaType ? [20, 20, 20, 20] : [0, 0, 0, 0],
						margin: [0, 0, 16, 0],
					},
				],
				mediaImage: [
					{
						url: mediaImage[0].url,
						id: mediaImage[0].id,
						alt: mediaImage[0].alt,
						width: mediaImage[0].width,
						height: mediaImage[0].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[0].hoverAnimation,
						flipUrl: mediaImage[0].flipUrl,
						flipId: mediaImage[0].flipId,
						flipAlt: mediaImage[0].flipAlt,
						flipWidth: mediaImage[0].flipWidth,
						flipHeight: mediaImage[0].flipHeight,
						subtype: mediaImage[0].subtype,
						flipSubtype: mediaImage[0].flipSubtype,
					},
				],
				titleFont: [
					{
						level: titleFont[0].level,
						size: titleFont[0].size,
						sizeType: titleFont[0].sizeType,
						lineHeight: titleFont[0].lineHeight,
						lineType: titleFont[0].lineType,
						letterSpacing: titleFont[0].letterSpacing,
						textTransform: titleFont[0].textTransform,
						family: titleFont[0].family,
						google: titleFont[0].google,
						style: titleFont[0].style,
						weight: titleFont[0].weight,
						variant: titleFont[0].variant,
						subset: titleFont[0].subset,
						loadGoogle: titleFont[0].loadGoogle,
						padding: [0, 0, 0, 0],
						paddingControl: 'linked',
						margin: [5, 0, 10, 0],
						marginControl: 'individual',
					},
				],
			});
		} else if ('left' === key) {
			setAttributes({
				hAlign: 'left',
				containerBackground: '' === containerBackground ? '#ffffff' : containerBackground,
				containerHoverBackground,
				borderStyle: [
					{
						top: ['var(--global-palette7, #eeeeee)', '', 5],
						right: ['var(--global-palette7, #eeeeee)', '', 5],
						bottom: ['var(--global-palette7, #eeeeee)', '', 5],
						left: ['var(--global-palette7, #eeeeee)', '', 5],
						unit: 'px',
					},
				],
				borderRadius: [30, 30, 30, 30],
				containerPadding: ['xs', 'xs', 'xs', 'xs'],
				containerMargin: ['', '', '', ''],
				tabletContainerMargin: ['', '', '', ''],
				mobileContainerMargin: ['', '', '', ''],
				containerMarginUnit: 'px',
				mediaAlign: 'left',
				mediaIcon: [
					{
						icon: mediaIcon[0].icon,
						size: 50,
						width: mediaIcon[0].width,
						title: mediaIcon[0].title,
						color: mediaIcon[0].color,
						hoverColor: mediaIcon[0].hoverColor,
						hoverAnimation: mediaIcon[0].hoverAnimation,
						flipIcon: mediaIcon[0].flipIcon,
					},
				],
				mediaStyle: [
					{
						background:
							'var(--global-palette7, #eeeeee)' === mediaStyle[0].background ||
							'#eeeeee' === mediaStyle[0].background ||
							'#ffffff' === mediaStyle[0].background
								? ''
								: mediaStyle[0].background,
						hoverBackground: mediaStyle[0].hoverBackground,
						border: mediaStyle[0].border,
						hoverBorder: mediaStyle[0].hoverBorder,
						borderRadius: 200,
						borderWidth: [0, 0, 0, 0],
						padding: 'icon' === mediaType || 'number' === mediaType ? [20, 20, 20, 20] : [0, 0, 0, 0],
						margin: [0, 20, 0, 0],
					},
				],
				mediaImage: [
					{
						url: mediaImage[0].url,
						id: mediaImage[0].id,
						alt: mediaImage[0].alt,
						width: mediaImage[0].width,
						height: mediaImage[0].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[0].hoverAnimation,
						flipUrl: mediaImage[0].flipUrl,
						flipId: mediaImage[0].flipId,
						flipAlt: mediaImage[0].flipAlt,
						flipWidth: mediaImage[0].flipWidth,
						flipHeight: mediaImage[0].flipHeight,
						subtype: mediaImage[0].subtype,
						flipSubtype: mediaImage[0].flipSubtype,
					},
				],
				titleFont: [
					{
						level: titleFont[0].level,
						size: titleFont[0].size,
						sizeType: titleFont[0].sizeType,
						lineHeight: titleFont[0].lineHeight,
						lineType: titleFont[0].lineType,
						letterSpacing: titleFont[0].letterSpacing,
						textTransform: titleFont[0].textTransform,
						family: titleFont[0].family,
						google: titleFont[0].google,
						style: titleFont[0].style,
						weight: titleFont[0].weight,
						variant: titleFont[0].variant,
						subset: titleFont[0].subset,
						loadGoogle: titleFont[0].loadGoogle,
						padding: [0, 0, 0, 0],
						paddingControl: 'linked',
						margin: [5, 0, 10, 0],
						marginControl: 'individual',
					},
				],
			});
		} else if ('overlay' === key) {
			setAttributes({
				hAlign: 'center',
				containerBackground: '' === containerBackground ? '#ffffff' : containerBackground,
				containerHoverBackground,
				borderStyle: [
					{
						top: ['var(--global-palette7, #eeeeee)', '', 5],
						right: ['var(--global-palette7, #eeeeee)', '', 5],
						bottom: ['var(--global-palette7, #eeeeee)', '', 5],
						left: ['var(--global-palette7, #eeeeee)', '', 5],
						unit: 'px',
					},
				],
				borderRadius: [20, 20, 20, 20],
				containerPadding: ['sm', 'sm', 'sm', 'sm'],
				containerMargin: [50, '', '', ''],
				containerMarginUnit: 'px',
				mediaAlign: 'top',
				mediaIcon: [
					{
						icon: mediaIcon[0].icon,
						size: 50,
						width: mediaIcon[0].width,
						title: mediaIcon[0].title,
						color: mediaIcon[0].color,
						hoverColor: mediaIcon[0].hoverColor,
						hoverAnimation: mediaIcon[0].hoverAnimation,
						flipIcon: mediaIcon[0].flipIcon,
					},
				],
				mediaStyle: [
					{
						background:
							'var(--global-palette7, #eeeeee)' === mediaStyle[0].background ||
							'#eeeeee' === mediaStyle[0].background ||
							'' === mediaStyle[0].background
								? '#ffffff'
								: mediaStyle[0].background,
						hoverBackground: mediaStyle[0].hoverBackground,
						border: '' === mediaStyle[0].border ? 'var(--global-palette7, #eeeeee)' : mediaStyle[0].border,
						hoverBorder: mediaStyle[0].hoverBorder,
						borderRadius: 200,
						borderWidth: [5, 5, 5, 5],
						padding: 'icon' === mediaType ? [20, 20, 20, 20] : [0, 0, 0, 0],
						margin: [-75, 0, 20, 0],
					},
				],
				mediaImage: [
					{
						url: mediaImage[0].url,
						id: mediaImage[0].id,
						alt: mediaImage[0].alt,
						width: mediaImage[0].width,
						height: mediaImage[0].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[0].hoverAnimation,
						flipUrl: mediaImage[0].flipUrl,
						flipId: mediaImage[0].flipId,
						flipAlt: mediaImage[0].flipAlt,
						flipWidth: mediaImage[0].flipWidth,
						flipHeight: mediaImage[0].flipHeight,
						subtype: mediaImage[0].subtype,
						flipSubtype: mediaImage[0].flipSubtype,
					},
				],
				titleFont: [
					{
						level: titleFont[0].level,
						size: titleFont[0].size,
						sizeType: titleFont[0].sizeType,
						lineHeight: titleFont[0].lineHeight,
						lineType: titleFont[0].lineType,
						letterSpacing: titleFont[0].letterSpacing,
						textTransform: titleFont[0].textTransform,
						family: titleFont[0].family,
						google: titleFont[0].google,
						style: titleFont[0].style,
						weight: titleFont[0].weight,
						variant: titleFont[0].variant,
						subset: titleFont[0].subset,
						loadGoogle: titleFont[0].loadGoogle,
						padding: [0, 0, 0, 0],
						paddingControl: 'linked',
						margin: [5, 0, 10, 0],
						marginControl: 'individual',
					},
				],
			});
		} else if ('overlayleft' === key) {
			setAttributes({
				hAlign: 'left',
				containerBackground: '' === containerBackground ? '#ffffff' : containerBackground,
				containerHoverBackground,
				borderStyle: [
					{
						top: ['var(--global-palette7, #eeeeee)', '', 5],
						right: ['var(--global-palette7, #eeeeee)', '', 5],
						bottom: ['var(--global-palette7, #eeeeee)', '', 5],
						left: ['var(--global-palette7, #eeeeee)', '', 5],
						unit: 'px',
					},
				],
				borderRadius: ['', '', '', ''],
				containerPadding: ['sm', 'sm', 'sm', 'sm'],
				containerMargin: [50, '', '', ''],
				containerMarginUnit: 'px',
				mediaAlign: 'top',
				mediaIcon: [
					{
						icon: mediaIcon[0].icon,
						size: 50,
						width: mediaIcon[0].width,
						title: mediaIcon[0].title,
						color: mediaIcon[0].color,
						hoverColor: mediaIcon[0].hoverColor,
						hoverAnimation: mediaIcon[0].hoverAnimation,
						flipIcon: mediaIcon[0].flipIcon,
					},
				],
				mediaStyle: [
					{
						background:
							'var(--global-palette7, #eeeeee)' === mediaStyle[0].background ||
							'#eeeeee' === mediaStyle[0].background ||
							'' === mediaStyle[0].background
								? '#ffffff'
								: mediaStyle[0].background,
						hoverBackground: mediaStyle[0].hoverBackground,
						border: '' === mediaStyle[0].border ? 'var(--global-palette7, #eeeeee)' : mediaStyle[0].border,
						hoverBorder: mediaStyle[0].hoverBorder,
						borderRadius: 0,
						borderWidth: [5, 5, 5, 5],
						padding: 'icon' === mediaType || 'number' === mediaType ? [20, 20, 20, 20] : [0, 0, 0, 0],
						margin: [-75, 0, 20, 0],
					},
				],
				mediaImage: [
					{
						url: mediaImage[0].url,
						id: mediaImage[0].id,
						alt: mediaImage[0].alt,
						width: mediaImage[0].width,
						height: mediaImage[0].height,
						maxWidth: 100,
						hoverAnimation: mediaImage[0].hoverAnimation,
						flipUrl: mediaImage[0].flipUrl,
						flipId: mediaImage[0].flipId,
						flipAlt: mediaImage[0].flipAlt,
						flipWidth: mediaImage[0].flipWidth,
						flipHeight: mediaImage[0].flipHeight,
						subtype: mediaImage[0].subtype,
						flipSubtype: mediaImage[0].flipSubtype,
					},
				],
				titleFont: [
					{
						level: titleFont[0].level,
						size: titleFont[0].size,
						sizeType: titleFont[0].sizeType,
						lineHeight: titleFont[0].lineHeight,
						lineType: titleFont[0].lineType,
						letterSpacing: titleFont[0].letterSpacing,
						textTransform: titleFont[0].textTransform,
						family: titleFont[0].family,
						google: titleFont[0].google,
						style: titleFont[0].style,
						weight: titleFont[0].weight,
						variant: titleFont[0].variant,
						subset: titleFont[0].subset,
						loadGoogle: titleFont[0].loadGoogle,
						padding: [0, 0, 0, 0],
						paddingControl: 'linked',
						margin: [5, 0, 10, 0],
						marginControl: 'individual',
					},
				],
			});
		}
	};
	const onChangeTitle = (value) => {
		setAttributes({ title: value });
	};
	const onChangeNumber = (value) => {
		setAttributes({ number: value });
	};
	const gconfig = {
		google: {
			families: [titleFont[0].family + (titleFont[0].variant ? ':' + titleFont[0].variant : '')],
		},
	};
	const tgconfig = {
		google: {
			families: [textFont[0].family + (textFont[0].variant ? ':' + textFont[0].variant : '')],
		},
	};
	const lgconfig = {
		google: {
			families: [
				learnMoreStyles[0].family + (learnMoreStyles[0].variant ? ':' + learnMoreStyles[0].variant : ''),
			],
		},
	};
	const ngconfig = {
		google: {
			families: [
				(mediaNumber && mediaNumber[0] && mediaNumber[0].family ? mediaNumber[0].family : ' ') +
					(mediaNumber && mediaNumber[0] && mediaNumber[0].variant ? ':' + mediaNumber[0].variant : ''),
			],
		},
	};
	const config = titleFont[0].google ? gconfig : '';
	const tconfig = textFont[0].google ? tgconfig : '';
	const lconfig = learnMoreStyles[0].google ? lgconfig : '';
	const nconfig = mediaNumber && mediaNumber[0] && mediaNumber[0].google ? ngconfig : '';
	const titleTagName = titleTagType !== 'heading' ? titleTagType : 'h' + titleFont[0].level;
	const ALLOWED_MEDIA_TYPES = ['image'];
	const onSelectImage = (media) => {
		let url;
		let itemSize;
		if (mediaImage[0] && mediaImage[0].width && mediaImage[0].height) {
			const sizes = undefined !== media.sizes ? media.sizes : [];
			const imgSizes = Object.keys(sizes).map((item) => {
				return { slug: item, name: item };
			});
			map(imgSizes, ({ name, slug }) => {
				const type = get(media, ['mime_type']);
				if ('image/svg+xml' === type) {
					return null;
				}
				const sizeUrl = get(media, ['sizes', slug, 'url']);
				if (!sizeUrl) {
					return null;
				}
				const sizeWidth = get(media, ['sizes', slug, 'width']);
				if (!sizeWidth) {
					return null;
				}
				const sizeHeight = get(media, ['sizes', slug, 'height']);
				if (!sizeHeight) {
					return null;
				}
				if (sizeHeight === mediaImage[0].height && sizeWidth === mediaImage[0].width) {
					itemSize = slug;
					return null;
				}
			});
		}
		const size = itemSize && '' !== itemSize ? itemSize : 'full';
		if (size !== 'full') {
			url = get(media, ['sizes', size, 'url']) || get(media, ['media_details', 'sizes', size, 'source_url']);
		}
		const width =
			get(media, ['sizes', size, 'width']) ||
			get(media, ['media_details', 'sizes', size, 'width']) ||
			get(media, ['width']) ||
			get(media, ['media_details', 'width']);
		const height =
			get(media, ['sizes', size, 'height']) ||
			get(media, ['media_details', 'sizes', size, 'height']) ||
			get(media, ['height']) ||
			get(media, ['media_details', 'height']);
		const maxwidth = mediaImage[0] && mediaImage[0].maxWidth ? mediaImage[0].maxWidth : media.width;
		saveMediaImage({
			id: media.id,
			url: url || media.url,
			alt: media.alt,
			width,
			height,
			maxWidth: maxwidth ? maxwidth : 50,
			subtype: media.subtype,
		});
	};
	const changeImageSize = (img) => {
		saveMediaImage({
			url: img.value,
			width: img.width,
			height: img.height,
		});
	};
	const clearImage = () => {
		saveMediaImage({
			id: '',
			url: '',
			alt: '',
			width: '',
			height: '',
			maxWidth: '',
			subtype: '',
		});
	};
	const onSelectFlipImage = (media) => {
		const width = get(media, ['width']) || get(media, ['media_details', 'width']);
		const height = get(media, ['height']) || get(media, ['media_details', 'height']);
		saveMediaImage({
			flipId: media.id,
			flipUrl: media.url,
			flipAlt: media.alt,
			flipWidth: width,
			flipHeight: height,
			flipSubtype: media.subtype,
		});
	};
	const clearFlipImage = () => {
		saveMediaImage({
			flipId: '',
			flipUrl: '',
			flipAlt: '',
			flipWidth: '',
			flipHeight: '',
			flipSubtype: '',
		});
	};
	const changeFlipImageSize = (img) => {
		saveMediaImage({
			flipUrl: img.value,
			flipWidth: img.width,
			flipHeight: img.height,
		});
	};
	const isSelectedClass = isSelected ? 'is-selected' : 'not-selected';
	const saveMediaImage = (value) => {
		const newUpdate = mediaImage.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaImage: newUpdate,
		});
	};
	const saveMediaIcon = (value) => {
		const newUpdate = mediaIcon.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaIcon: newUpdate,
		});
	};
	const saveMediaStyle = (value) => {
		const newUpdate = mediaStyle.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaStyle: newUpdate,
		});
	};
	const saveMediaNumber = (value) => {
		const newMediaNumber = mediaNumber
			? mediaNumber
			: [
					{
						family: '',
						google: false,
						hoverAnimation: 'none',
						style: '',
						weight: '',
						variant: '',
						subset: '',
						loadGoogle: true,
					},
			  ];
		const newNumberUpdate = newMediaNumber.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			mediaNumber: newNumberUpdate,
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
	const saveTextFont = (value) => {
		const newUpdate = textFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			textFont: newUpdate,
		});
	};
	const saveTextSpacing = (value) => {
		let tSpacing;
		if (undefined === textSpacing || (undefined !== textSpacing && undefined === textSpacing[0])) {
			tSpacing = [
				{
					padding: ['', '', '', ''],
					paddingControl: 'linked',
					margin: ['', '', '', ''],
					marginControl: 'linked',
				},
			];
		} else {
			tSpacing = textSpacing;
		}
		const newUpdate = tSpacing.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			textSpacing: newUpdate,
		});
	};
	const saveLearnMoreStyles = (value) => {
		const newUpdate = learnMoreStyles.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			learnMoreStyles: newUpdate,
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
	const saveHoverShadow = (value) => {
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
	const onPaste = (attributesToPaste) => {
		if (attributesToPaste) {
			if (attributesToPaste.mediaImage && has(attributesToPaste, ['mediaIcon', '0'])) {
				delete attributesToPaste.mediaImage[0].url;
				delete attributesToPaste.mediaImage[0].id;
				delete attributesToPaste.mediaImage[0].alt;
				delete attributesToPaste.mediaImage[0].flipUrl;
				delete attributesToPaste.mediaImage[0].flipId;
				delete attributesToPaste.mediaImage[0].flipAlt;

				saveMediaImage(attributesToPaste.mediaImage[0]);
				delete attributesToPaste.mediaImage;
			}
			if (attributesToPaste.mediaIcon && has(attributesToPaste, ['mediaIcon', '0'])) {
				delete attributesToPaste.mediaIcon[0].icon;
				delete attributesToPaste.mediaIcon[0].title;
				delete attributesToPaste.mediaIcon[0].flipIcon;
				saveMediaIcon(attributesToPaste.mediaIcon[0]);
				delete attributesToPaste.mediaIcon;
			}

			setAttributes(attributesToPaste);
		}
	};
	const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);

	const { mediaImageRecord, mediaImageFlipRecord } = useSelect((select) => {
		let rec, flipRec;

		if (mediaImage[0] && mediaImage[0].id) {
			rec = select(coreStore).getEntityRecord('postType', 'attachment', mediaImage[0].id);
		}

		if (mediaImage[0] && mediaImage[0].flipId) {
			flipRec = select(coreStore).getEntityRecord('postType', 'attachment', mediaImage[0].flipId);
		}

		return {
			mediaImageRecord: rec,
			mediaImageFlipRecord: flipRec,
		};
	});

	const updateMediaImageAlt = (alt, id) => {
		if (id) {
			editEntityRecord('postType', 'attachment', id, { alt_text: alt }).catch(() => {
				console.log('error');
			});

			saveEditedEntityRecord('postType', 'attachment', id).then(() => {
				createSuccessNotice(__('Media default alt text updated.', 'kadence-blocks'), {
					type: 'snackbar',
				});
			});
		}
	};
	const learnMoreHasAlign =
		displayLearnMore && previewMediaAlign === 'top' && fullHeight ? 'learn-more-has-align' : '';
	const mediaImagedraw =
		'drawborder' === mediaImage[0].hoverAnimation || 'grayscale-border-draw' === mediaImage[0].hoverAnimation
			? true
			: false;
	const renderCSS = (
		<style>
			{previewMaxWidth
				? `.kadence-inner-column-direction-horizontal > .kb-info-box-wrap${uniqueID} {max-width:${
						previewMaxWidth + previewMaxWidthUnit
				  } !important;}
				  .kadence-inner-column-direction-horizontal > .kb-info-box-wrap${uniqueID} > .kt-blocks-info-box-link-wrap {max-width:none !important;}`
				: ''}
			{fullHeight
				? `.kb-info-box-wrap${uniqueID} { height: 100%; } .kadence-inner-column-direction-horizontal > .kb-info-box-wrap${uniqueID} { height: auto; align-self: stretch; }`
				: ''}
			{mediaIcon[0].hoverColor
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-info-svg-icon, .kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-number { color: ${KadenceColorOutput(
						mediaIcon[0].hoverColor
				  )} !important; }`
				: ''}
			{mediaStyle[0].borderRadius && mediaStyle[0].padding.some((number) => number > 0)
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media .kadence-info-box-image-intrisic img, .kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media .block-editor-media-placeholder { border-radius: ${mediaStyle[0].borderRadius}px !important; }`
				: ''}
			{titleHoverColor
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-title { color: ${KadenceColorOutput(
						titleHoverColor
				  )} !important; }`
				: ''}
			{textHoverColor
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-text { color: ${KadenceColorOutput(
						textHoverColor
				  )} !important; }`
				: ''}
			{learnMoreStyles[0].colorHover
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { color: ${KadenceColorOutput(
						learnMoreStyles[0].colorHover
				  )} !important; }`
				: ''}
			{learnMoreStyles[0].borderHover
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { border-color: ${KadenceColorOutput(
						learnMoreStyles[0].borderHover
				  )} !important; }`
				: ''}
			{learnMoreStyles[0].backgroundHover
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-learnmore { background-color: ${KadenceColorOutput(
						learnMoreStyles[0].backgroundHover
				  )} !important; }`
				: ''}
			{previewBorderHoverTopStyle
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-top:${previewBorderHoverTopStyle} !important; }`
				: ''}
			{previewBorderHoverRightStyle
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-right:${previewBorderHoverRightStyle} !important; }`
				: ''}
			{previewBorderHoverBottomStyle
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-bottom:${previewBorderHoverBottomStyle} !important; }`
				: ''}
			{previewBorderHoverLeftStyle
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-left:${previewBorderHoverLeftStyle} !important; }`
				: ''}
			{'' !== previewHoverRadiusTop
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-top-left-radius:${
						previewHoverRadiusTop + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
				  } !important; }`
				: ''}
			{'' !== previewHoverRadiusRight
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-top-right-radius:${
						previewHoverRadiusRight + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
				  } !important; }`
				: ''}
			{'' !== previewHoverRadiusBottom
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-bottom-right-radius:${
						previewHoverRadiusBottom + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
				  } !important; }`
				: ''}
			{'' !== previewHoverRadiusLeft
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { border-bottom-left-radius:${
						previewHoverRadiusLeft + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
				  } !important; }`
				: ''}
			{containerHoverBackground
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { background:${KadenceColorOutput(
						containerHoverBackground
				  )} !important; }`
				: ''}
			{displayShadow
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover { box-shadow: ${
						shadowHover[0].hOffset +
						'px ' +
						shadowHover[0].vOffset +
						'px ' +
						shadowHover[0].blur +
						'px ' +
						shadowHover[0].spread +
						'px ' +
						KadenceColorOutput(shadowHover[0].color, shadowHover[0].opacity)
				  } !important; }`
				: ''}
			{mediaStyle[0].hoverBackground
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { background: ${KadenceColorOutput(
						mediaStyle[0].hoverBackground
				  )} !important; }`
				: ''}
			{mediaStyle[0].hoverBorder && 'icon' === mediaType && 'drawborder' !== mediaIcon[0].hoverAnimation
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${KadenceColorOutput(
						mediaStyle[0].hoverBorder
				  )} !important; }`
				: ''}
			{mediaStyle[0].hoverBorder &&
			'number' === mediaType &&
			mediaNumber[0].hoverAnimation &&
			'drawborder' !== mediaNumber[0].hoverAnimation
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${KadenceColorOutput(
						mediaStyle[0].hoverBorder
				  )} !important; }`
				: ''}
			{mediaStyle[0].hoverBorder && 'image' === mediaType && true !== mediaImagedraw
				? `.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media { border-color: ${KadenceColorOutput(
						mediaStyle[0].hoverBorder
				  )} !important; }`
				: ''}
			{'icon' === mediaType &&
				'drawborder' === mediaIcon[0].hoverAnimation &&
				`.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${
					mediaStyle[0].borderWidth[0]
				}px ${KadenceColorOutput(mediaStyle[0].border)}; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, .kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${
					mediaStyle[0].borderRadius
				}px; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${
					mediaStyle[0].borderWidth[0]
				}px; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)} ; border-right-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)}; border-bottom-color: ${KadenceColorOutput(mediaStyle[0].hoverBorder)} }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)}; border-right-width: ${mediaStyle[0].borderWidth[0]}px; border-bottom-width: ${
					mediaStyle[0].borderWidth[0]
				}px; border-top-width: ${mediaStyle[0].borderWidth[0]}px; }`}
			{'number' === mediaType &&
				mediaNumber &&
				mediaNumber[0] &&
				mediaNumber[0].hoverAnimation &&
				'drawborder' === mediaNumber[0].hoverAnimation &&
				`.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${
					mediaStyle[0].borderWidth[0]
				}px ${mediaStyle[0].border}; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, .kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${
					mediaStyle[0].borderRadius
				}px; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${
					mediaStyle[0].borderWidth[0]
				}px; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)} ; border-right-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)}; border-bottom-color: ${KadenceColorOutput(mediaStyle[0].hoverBorder)} }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)}; border-right-width: ${mediaStyle[0].borderWidth[0]}px; border-bottom-width: ${
					mediaStyle[0].borderWidth[0]
				}px; border-top-width: ${mediaStyle[0].borderWidth[0]}px; }`}
			{'image' === mediaType &&
				true === mediaImagedraw &&
				`.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media { border-width:0 !important; box-shadow: inset 0 0 0 ${
					mediaStyle[0].borderWidth[0]
				}px ${mediaStyle[0].border}; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before, .kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-radius: ${
					mediaStyle[0].borderRadius
				}px; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:before { border-width: ${
					mediaStyle[0].borderWidth[0]
				}px; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap .kt-blocks-info-box-media:after { border-width: 0; }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:before { border-top-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)} ; border-right-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)}; border-bottom-color: ${KadenceColorOutput(mediaStyle[0].hoverBorder)} }
					.kb-info-box-wrap${uniqueID} .kt-blocks-info-box-link-wrap:hover .kt-blocks-info-box-media:after{ border-right-color: ${KadenceColorOutput(
					mediaStyle[0].hoverBorder
				)}; border-right-width: ${mediaStyle[0].borderWidth[0]}px; border-bottom-width: ${
					mediaStyle[0].borderWidth[0]
				}px; border-top-width: ${mediaStyle[0].borderWidth[0]}px; }`}
		</style>
	);
	let imageRatioPadding = isNaN(mediaImage[0].height)
		? undefined
		: (mediaImage[0].height / mediaImage[0].width) * 100 + '%';
	let imageRatioHeight = isNaN(mediaImage[0].height) ? undefined : 0;
	let hasRatio = false;
	if (imageRatio && 'inherit' !== imageRatio) {
		hasRatio = true;
		imageRatioHeight = 0;
		switch (imageRatio) {
			case 'land43':
				imageRatioPadding = '75%';
				break;
			case 'land32':
				imageRatioPadding = '66.67%';
				break;
			case 'land169':
				imageRatioPadding = '56.25%';
				break;
			case 'land21':
				imageRatioPadding = '50%';
				break;
			case 'land31':
				imageRatioPadding = '33%';
				break;
			case 'land41':
				imageRatioPadding = '25%';
				break;
			case 'port34':
				imageRatioPadding = '133.33%';
				break;
			case 'port23':
				imageRatioPadding = '150%';
				break;
			default:
				imageRatioPadding = '100%';
				break;
		}
	}
	let showImageToolbar = 'image' === mediaType && mediaImage[0].url ? true : false;
	if (
		showImageToolbar &&
		kadenceDynamic &&
		kadenceDynamic['mediaImage:0:url'] &&
		kadenceDynamic['mediaImage:0:url'].enable
	) {
		showImageToolbar = false;
	}

	const mediaSettingsMobile = (
		<>
			<SelectControl
				value={mediaAlignMobile ? mediaAlignMobile : mediaAlign}
				options={[
					{ value: 'top', label: __('Top', 'kadence-blocks') },
					{ value: 'left', label: __('Left', 'kadence-blocks') },
					{ value: 'right', label: __('Right', 'kadence-blocks') },
				]}
				onChange={(value) => setAttributes({ mediaAlignMobile: value })}
			/>
		</>
	);

	const mediaSettingsTablet = (
		<>
			<SelectControl
				value={mediaAlignTablet ? mediaAlignTablet : mediaAlign}
				options={[
					{ value: 'top', label: __('Top', 'kadence-blocks') },
					{ value: 'left', label: __('Left', 'kadence-blocks') },
					{ value: 'right', label: __('Right', 'kadence-blocks') },
				]}
				onChange={(value) => setAttributes({ mediaAlignTablet: value })}
			/>
		</>
	);

	const mediaSettingsDesktop = (
		<>
			<SelectControl
				value={mediaAlign}
				options={[
					{ value: 'top', label: __('Top', 'kadence-blocks') },
					{ value: 'left', label: __('Left', 'kadence-blocks') },
					{ value: 'right', label: __('Right', 'kadence-blocks') },
				]}
				onChange={(value) => setAttributes({ mediaAlign: value })}
			/>
		</>
	);

	const nonTransAttrs = ['link', 'linkTitle', 'title', 'contentText', 'mediaType'];

	const blockProps = useBlockProps({
		className: classnames(className, {
			[`kb-info-box-wrap${uniqueID}`]: true,
		}),
	});

	return (
		<div {...blockProps}>
			{renderCSS}
			<BlockControls key="controls">
				{showImageToolbar && (
					<ToolbarGroup group="change-image">
						<MediaUpload
							onSelect={onSelectImage}
							type="image"
							value={mediaImage[0].id}
							allowedTypes={ALLOWED_MEDIA_TYPES}
							render={({ open }) => (
								<Button
									className="components-toolbar__control"
									label={__('Edit Media', 'kadence-blocks')}
									icon={image}
									onClick={open}
								/>
							)}
						/>
					</ToolbarGroup>
				)}
				{'icon' === mediaType && (
					<Dropdown
						className="kb-popover-inline-icon-container components-dropdown-menu components-toolbar"
						contentClassName="kb-popover-inline-icon"
						placement="top"
						renderToggle={({ isOpen, onToggle }) => (
							<ToolbarButton
								className="components-dropdown-menu__toggle kb-inline-icon-toolbar-icon"
								label={__('Icon Settings', 'kadence-blocks')}
								icon={starFilled}
								onClick={onToggle}
								aria-expanded={isOpen}
							/>
						)}
						renderContent={() => (
							<>
								<div className="kb-inline-icon-control">
									<KadenceIconPicker
										value={mediaIcon[0].icon}
										onChange={(value) => saveMediaIcon({ icon: value })}
									/>
									<RangeControl
										label={__('Icon Size', 'kadence-blocks')}
										value={mediaIcon[0].size}
										onChange={(value) => saveMediaIcon({ size: value })}
										min={5}
										max={250}
										step={1}
									/>
								</div>
							</>
						)}
					/>
				)}
				<AlignmentToolbar value={hAlign} onChange={(value) => setAttributes({ hAlign: value })} />
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => onPaste(attributesToPaste)}
				/>
			</BlockControls>
			{showSettings('allSettings', 'kadence/infobox') && (
				<InspectorControls>
					<InspectorControlTabs
						panelName={'infobox'}
						setActiveTab={(value) => setActiveTab(value)}
						activeTab={activeTab}
					/>

					{activeTab === 'general' && (
						<>
							<KadencePanelBody panelName={'kb-info-all-settings'}>
								<>
									<h2>{__('InfoBox Quick Layout Presets', 'kadence-blocks')}</h2>
									<ButtonGroup
										className="kt-style-btn-group kb-info-layouts"
										aria-label={__('InfoBox Style', 'kadence-blocks')}
									>
										{map(layoutPresetOptions, ({ name, key, icon }) => (
											<Button
												key={key}
												className="kt-style-btn"
												isSmall
												isPrimary={false}
												aria-pressed={false}
												onClick={() => {
													setPresetLayout(key);
												}}
											>
												{icon}
											</Button>
										))}
									</ButtonGroup>
								</>
								<URLInputControl
									label={__('Link', 'kadence-blocks')}
									url={link}
									onChangeUrl={(value) => setAttributes({ link: value })}
									additionalControls={true}
									opensInNewTab={target && '_blank' == target ? true : false}
									onChangeTarget={(value) => {
										if (value) {
											setAttributes({ target: '_blank' });
										} else {
											setAttributes({ target: '_self' });
										}
									}}
									linkNoFollow={undefined !== linkNoFollow ? linkNoFollow : false}
									onChangeFollow={(value) => setAttributes({ linkNoFollow: value })}
									linkSponsored={undefined !== linkSponsored ? linkSponsored : false}
									onChangeSponsored={(value) => setAttributes({ linkSponsored: value })}
									linkTitle={linkTitle}
									onChangeTitle={(value) => {
										setAttributes({ linkTitle: value });
									}}
									dynamicAttribute={'link'}
									allowClear={true}
									isSelected={isSelected}
									attributes={attributes}
									setAttributes={setAttributes}
									name={name}
									clientId={clientId}
									context={context}
								/>
								<SelectControl
									label={__('Link Content', 'kadence-blocks')}
									value={linkProperty}
									options={[
										{ value: 'box', label: __('Entire Box', 'kadence-blocks') },
										{ value: 'learnmore', label: __('Only Learn More Text', 'kadence-blocks') },
									]}
									onChange={(value) => setAttributes({ linkProperty: value })}
								/>
								<h2 className="kt-heading-size-title">{__('Content Align', 'kadence-blocks')}</h2>
								<ResponsiveAlignControls
									label={__('Text Alignment', 'kadence-blocks')}
									value={hAlign}
									mobileValue={hAlignMobile}
									tabletValue={hAlignTablet}
									onChange={(nextAlign) => setAttributes({ hAlign: nextAlign })}
									onChangeTablet={(nextAlign) => setAttributes({ hAlignTablet: nextAlign })}
									onChangeMobile={(nextAlign) => setAttributes({ hAlignMobile: nextAlign })}
								/>
							</KadencePanelBody>
						</>
					)}

					{activeTab === 'style' && (
						<>
							{showSettings('containerSettings', 'kadence/infobox') && (
								<>
									<KadencePanelBody
										title={__('Container Settings', 'kadence-blocks')}
										initialOpen={true}
										panelName={'kb-info-container-settings'}
									>
										<HoverToggleControl
											hover={
												<>
													<PopColorControl
														label={__('Hover Background', 'kadence-blocks')}
														value={containerHoverBackground ? containerHoverBackground : ''}
														default={''}
														onChange={(value) =>
															setAttributes({ containerHoverBackground: value })
														}
													/>
													<ResponsiveBorderControl
														label={__('Border', 'kadence-blocks')}
														value={borderHoverStyle}
														tabletValue={tabletBorderHoverStyle}
														mobileValue={mobileBorderHoverStyle}
														onChange={(value) => setAttributes({ borderHoverStyle: value })}
														onChangeTablet={(value) =>
															setAttributes({ tabletBorderHoverStyle: value })
														}
														onChangeMobile={(value) =>
															setAttributes({ mobileBorderHoverStyle: value })
														}
													/>
													<ResponsiveMeasurementControls
														label={__('Border Radius', 'kadence-blocks')}
														value={borderHoverRadius}
														tabletValue={tabletBorderHoverRadius}
														mobileValue={mobileBorderHoverRadius}
														onChange={(value) =>
															setAttributes({ borderHoverRadius: value })
														}
														onChangeTablet={(value) =>
															setAttributes({ tabletBorderHoverRadius: value })
														}
														onChangeMobile={(value) =>
															setAttributes({ mobileBorderHoverRadius: value })
														}
														unit={borderHoverRadiusUnit}
														units={['px', 'em', 'rem', '%']}
														onUnit={(value) =>
															setAttributes({ borderHoverRadiusUnit: value })
														}
														max={
															borderHoverRadiusUnit === 'em' ||
															borderHoverRadiusUnit === 'rem'
																? 24
																: 500
														}
														step={
															borderHoverRadiusUnit === 'em' ||
															borderHoverRadiusUnit === 'rem'
																? 0.1
																: 1
														}
														min={0}
														isBorderRadius={true}
														allowEmpty={true}
													/>
													{showSettings('shadowSettings', 'kadence/infobox') && (
														<BoxShadowControl
															label={__('Box Shadow', 'kadence-blocks')}
															enable={undefined !== displayShadow ? displayShadow : false}
															color={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].color
																	? shadowHover[0].color
																	: '#000000'
															}
															colorDefault={'#000000'}
															onArrayChange={(color, opacity) => {
																saveHoverShadow({ color, opacity });
															}}
															opacity={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].opacity
																	? shadowHover[0].opacity
																	: 0.2
															}
															hOffset={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].hOffset
																	? shadowHover[0].hOffset
																	: 0
															}
															vOffset={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].vOffset
																	? shadowHover[0].vOffset
																	: 0
															}
															blur={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].blur
																	? shadowHover[0].blur
																	: 14
															}
															spread={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].spread
																	? shadowHover[0].spread
																	: 0
															}
															inset={
																undefined !== shadowHover &&
																undefined !== shadowHover[0] &&
																undefined !== shadowHover[0].inset
																	? shadowHover[0].inset
																	: false
															}
															onEnableChange={(value) => {
																setAttributes({
																	displayShadow: value,
																});
															}}
															onColorChange={(value) => {
																saveHoverShadow({ color: value });
															}}
															onOpacityChange={(value) => {
																saveHoverShadow({ opacity: value });
															}}
															onHOffsetChange={(value) => {
																saveHoverShadow({ hOffset: value });
															}}
															onVOffsetChange={(value) => {
																saveHoverShadow({ vOffset: value });
															}}
															onBlurChange={(value) => {
																saveHoverShadow({ blur: value });
															}}
															onSpreadChange={(value) => {
																saveHoverShadow({ spread: value });
															}}
															onInsetChange={(value) => {
																saveHoverShadow({ inset: value });
															}}
														/>
													)}
												</>
											}
											normal={
												<>
													<PopColorControl
														label={__('Background', 'kadence-blocks')}
														value={containerBackground ? containerBackground : ''}
														default={''}
														onChange={(value) =>
															setAttributes({ containerBackground: value })
														}
													/>
													<ResponsiveBorderControl
														label={__('Border', 'kadence-blocks')}
														value={borderStyle}
														tabletValue={tabletBorderStyle}
														mobileValue={mobileBorderStyle}
														onChange={(value) => setAttributes({ borderStyle: value })}
														onChangeTablet={(value) =>
															setAttributes({ tabletBorderStyle: value })
														}
														onChangeMobile={(value) =>
															setAttributes({ mobileBorderStyle: value })
														}
													/>
													<ResponsiveMeasurementControls
														label={__('Border Radius', 'kadence-blocks')}
														value={borderRadius}
														tabletValue={tabletBorderRadius}
														mobileValue={mobileBorderRadius}
														onChange={(value) => setAttributes({ borderRadius: value })}
														onChangeTablet={(value) =>
															setAttributes({ tabletBorderRadius: value })
														}
														onChangeMobile={(value) =>
															setAttributes({ mobileBorderRadius: value })
														}
														unit={borderRadiusUnit}
														units={['px', 'em', 'rem', '%']}
														onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
														max={
															borderRadiusUnit === 'em' || borderRadiusUnit === 'rem'
																? 24
																: 500
														}
														step={
															borderRadiusUnit === 'em' || borderRadiusUnit === 'rem'
																? 0.1
																: 1
														}
														min={0}
														isBorderRadius={true}
														allowEmpty={true}
													/>
													{showSettings('shadowSettings', 'kadence/infobox') && (
														<BoxShadowControl
															label={__('Box Shadow', 'kadence-blocks')}
															enable={undefined !== displayShadow ? displayShadow : false}
															color={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].color
																	? shadow[0].color
																	: '#000000'
															}
															colorDefault={'#000000'}
															onArrayChange={(color, opacity) => {
																saveShadow({ color, opacity });
															}}
															opacity={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].opacity
																	? shadow[0].opacity
																	: 0.2
															}
															hOffset={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].hOffset
																	? shadow[0].hOffset
																	: 0
															}
															vOffset={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].vOffset
																	? shadow[0].vOffset
																	: 0
															}
															blur={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].blur
																	? shadow[0].blur
																	: 14
															}
															spread={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].spread
																	? shadow[0].spread
																	: 0
															}
															inset={
																undefined !== shadow &&
																undefined !== shadow[0] &&
																undefined !== shadow[0].inset
																	? shadow[0].inset
																	: false
															}
															onEnableChange={(value) => {
																setAttributes({
																	displayShadow: value,
																});
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
															onInsetChange={(value) => {
																saveShadow({ inset: value });
															}}
														/>
													)}
												</>
											}
										/>
									</KadencePanelBody>
								</>
							)}
							{showSettings('mediaSettings', 'kadence/infobox') && (
								<KadencePanelBody
									title={__('Media Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-info-media-settings'}
								>
									<SmallResponsiveControl
										label={__('Media Align', 'kadence-blocks')}
										desktopChildren={mediaSettingsDesktop}
										tabletChildren={mediaSettingsTablet}
										mobileChildren={mediaSettingsMobile}
									/>

									{mediaAlign !== 'top' && (
										<>
											<SelectControl
												label={__('Media Vertical Align', 'kadence-blocks')}
												value={mediaVAlign}
												options={[
													{ value: 'top', label: __('Top', 'kadence-blocks') },
													{ value: 'middle', label: __('Middle', 'kadence-blocks') },
													{ value: 'bottom', label: __('Bottom', 'kadence-blocks') },
												]}
												onChange={(value) => setAttributes({ mediaVAlign: value })}
											/>
										</>
									)}
									<SelectControl
										label={__('Media Type', 'kadence-blocks')}
										value={mediaType}
										options={[
											{ value: 'icon', label: __('Icon', 'kadence-blocks') },
											{ value: 'image', label: __('Image', 'kadence-blocks') },
											{ value: 'number', label: __('Number', 'kadence-blocks') },
											{ value: 'none', label: __('None', 'kadence-blocks') },
										]}
										onChange={(value) => setAttributes({ mediaType: value })}
									/>
									{'image' === mediaType && (
										<>
											<KadenceImageControl
												label={__('Image', 'kadence-blocks')}
												hasImage={
													mediaImage && mediaImage[0] && mediaImage[0].url ? true : false
												}
												imageURL={
													mediaImage && mediaImage[0] && mediaImage[0].url
														? mediaImage[0].url
														: ''
												}
												imageID={
													mediaImage && mediaImage[0] && mediaImage[0].id
														? mediaImage[0].id
														: ''
												}
												onRemoveImage={clearImage}
												onSaveImage={onSelectImage}
												disableMediaButtons={mediaImage[0].url ? true : false}
												dynamicAttribute="mediaImage:0:url"
												isSelected={isSelected}
												attributes={attributes}
												setAttributes={setAttributes}
												name={name}
												clientId={clientId}
												context={context}
											/>
											{mediaImage[0].id && 'svg+xml' !== mediaImage[0].subtype && (
												<ImageSizeControl
													label={__('Image File Size', 'kadence-blocks')}
													id={mediaImage[0].id}
													url={mediaImage[0].url}
													onChange={changeImageSize}
												/>
											)}
											<RangeControl
												label={__('Max Image Width', 'kadence-blocks')}
												value={mediaImage[0].maxWidth}
												onChange={(value) => saveMediaImage({ maxWidth: value })}
												min={5}
												max={800}
												step={1}
												reset={() => {
													//empty value does not re-render component, so doing it this way to force a re-render
													saveMediaImage({ maxWidth: 4000 });
													setTimeout(() => {
														saveMediaImage({ maxWidth: '' });
													}, 20);
												}}
											/>
											<div className="components-base-control">
												<TextareaControl
													label={__('Alt text', 'kadence-blocks')}
													value={
														mediaImage && mediaImage[0] && mediaImage[0].alt
															? mediaImage[0].alt
															: ''
													}
													onChange={(value) => saveMediaImage({ alt: value })}
													className={'mb-0'}
												/>
												<Button
													text={__("Use as this image's default alt text", 'kadence-blocks')}
													variant={'link'}
													onClick={() => {
														updateMediaImageAlt(
															mediaImage && mediaImage[0] && mediaImage[0].alt
																? mediaImage[0].alt
																: '',
															mediaImage[0].id
														);
													}}
													disabled={isEmpty(mediaImageRecord)}
												/>
											</div>
											<SelectControl
												label={__('Image ratio', 'kadence-blocks')}
												options={[
													{
														label: __('Inherit', 'kadence-blocks'),
														value: 'inherit',
													},
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
												value={imageRatio}
												onChange={(value) => setAttributes({ imageRatio: value })}
											/>
											<SelectControl
												label={__('Image Hover Animation', 'kadence-blocks')}
												value={mediaImage[0].hoverAnimation}
												options={[
													{ value: 'none', label: __('None', 'kadence-blocks') },
													{
														value: 'grayscale',
														label: __('Grayscale to Color', 'kadence-blocks'),
													},
													{
														value: 'drawborder',
														label: __('Border Spin In', 'kadence-blocks'),
													},
													{
														value: 'grayscale-border-draw',
														label: __(
															'Grayscale to Color & Border Spin In',
															'kadence-blocks'
														),
													},
													{
														value: 'flip',
														label: __('Flip to Another Image', 'kadence-blocks'),
													},
												]}
												onChange={(value) => saveMediaImage({ hoverAnimation: value })}
											/>
											{'flip' === mediaImage[0].hoverAnimation && (
												<>
													<h2>
														{__(
															'Flip Image (Use same size as start image',
															'kadence-blocks'
														)}
													</h2>
													<KadenceImageControl
														label={__('Image', 'kadence-blocks')}
														hasImage={
															mediaImage && mediaImage[0] && mediaImage[0].flipUrl
																? true
																: false
														}
														imageURL={
															mediaImage && mediaImage[0] && mediaImage[0].flipUrl
																? mediaImage[0].flipUrl
																: ''
														}
														imageID={
															mediaImage && mediaImage[0] && mediaImage[0].flipId
																? mediaImage[0].flipId
																: ''
														}
														onRemoveImage={clearFlipImage}
														onSaveImage={onSelectFlipImage}
														disableMediaButtons={
															mediaImage && mediaImage[0] && mediaImage[0].flipUrl
																? true
																: false
														}
														setAttributes={setAttributes}
														{...attributes}
													/>
													{mediaImage[0].flipId &&
														'svg+xml' !== mediaImage[0].flipSubtype && (
															<ImageSizeControl
																label={__('Image File Size', 'kadence-blocks')}
																id={mediaImage[0].flipId}
																url={mediaImage[0].flipUrl}
																onChange={changeFlipImageSize}
															/>
														)}
													<div className="components-base-control">
														<TextareaControl
															label={__('Alt text', 'kadence-blocks')}
															value={
																mediaImage && mediaImage[0] && mediaImage[0].flipAlt
																	? mediaImage[0].flipAlt
																	: ''
															}
															onChange={(value) => saveMediaImage({ flipAlt: value })}
															className={'mb-0'}
														/>
														<Button
															text={__(
																"Use as this image's default alt text",
																'kadence-blocks'
															)}
															variant={'link'}
															onClick={() => {
																updateMediaImageAlt(
																	mediaImage && mediaImage[0] && mediaImage[0].flipAlt
																		? mediaImage[0].flipAlt
																		: '',
																	mediaImage[0].flipId
																);
															}}
															disabled={isEmpty(mediaImageFlipRecord)}
														/>
													</div>
												</>
											)}
											<MeasurementControls
												label={__('Image Border', 'kadence-blocks')}
												measurement={mediaStyle[0].borderWidth}
												control={mediaBorderControl}
												onChange={(value) => saveMediaStyle({ borderWidth: value })}
												onControl={(value) => setMediaBorderControl(value)}
												min={0}
												max={40}
												step={1}
											/>
											<RangeControl
												label={__('Image Border Radius (px)', 'kadence-blocks')}
												value={mediaStyle[0].borderRadius}
												onChange={(value) => saveMediaStyle({ borderRadius: value })}
												step={1}
												min={0}
												max={200}
											/>
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
																	{mediaImage[0].subtype &&
																		'svg+xml' === mediaImage[0].subtype && (
																			<>
																				<PopColorControl
																					label={__(
																						'SVG Hover Color',
																						'kadence-blocks'
																					)}
																					value={
																						mediaIcon[0].hoverColor
																							? mediaIcon[0].hoverColor
																							: '#444444'
																					}
																					default={'#444444'}
																					onChange={(value) =>
																						saveMediaIcon({
																							hoverColor: value,
																						})
																					}
																				/>
																				<small>
																					{__(
																						'*you must force inline svg for this to have effect.',
																						'kadence-blocks'
																					)}
																				</small>
																			</>
																		)}
																	<PopColorControl
																		label={__(
																			'Image Hover Background',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].hoverBackground
																				? mediaStyle[0].hoverBackground
																				: ''
																		}
																		default={'transparent'}
																		onChange={(value) =>
																			saveMediaStyle({ hoverBackground: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Image Hover Border',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].hoverBorder
																				? mediaStyle[0].hoverBorder
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaStyle({ hoverBorder: value })
																		}
																	/>
																</>
															);
														} else {
															tabout = (
																<>
																	{mediaImage[0].subtype &&
																		'svg+xml' === mediaImage[0].subtype && (
																			<>
																				<PopColorControl
																					label={__(
																						'SVG Color',
																						'kadence-blocks'
																					)}
																					value={
																						mediaIcon[0].color
																							? mediaIcon[0].color
																							: '#444444'
																					}
																					default={'#444444'}
																					onChange={(value) =>
																						saveMediaIcon({ color: value })
																					}
																				/>
																				<small>
																					{__(
																						'*you must force inline svg for this to have effect.',
																						'kadence-blocks'
																					)}
																				</small>
																			</>
																		)}
																	<PopColorControl
																		label={__('Image Background', 'kadence-blocks')}
																		value={
																			mediaStyle[0].background
																				? mediaStyle[0].background
																				: ''
																		}
																		default={'transparent'}
																		onChange={(value) =>
																			saveMediaStyle({ background: value })
																		}
																	/>
																	<PopColorControl
																		label={__('Image Border', 'kadence-blocks')}
																		value={
																			mediaStyle[0].border
																				? mediaStyle[0].border
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaStyle({ border: value })
																		}
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
										</>
									)}
									{'icon' === mediaType && (
										<>
											<KadenceIconPicker
												value={mediaIcon[0].icon}
												onChange={(value) => saveMediaIcon({ icon: value })}
											/>
											<ResponsiveRangeControls
												label={__('Icon Size', 'kadence-blocks')}
												value={mediaIcon[0].size}
												mobileValue={mediaIcon[0].mobileSize ? mediaIcon[0].mobileSize : ''}
												tabletValue={mediaIcon[0].tabletSize ? mediaIcon[0].tabletSize : ''}
												onChange={(value) => saveMediaIcon({ size: value })}
												onChangeTablet={(value) => saveMediaIcon({ tabletSize: value })}
												onChangeMobile={(value) => saveMediaIcon({ mobileSize: value })}
												min={['em', 'rem'].includes(mediaIcon[0].unit) ? 1 : 5}
												max={['em', 'rem'].includes(mediaIcon[0].unit) ? 12 : 250}
												step={1}
												showUnit={true}
												onUnit={(value) => saveMediaIcon({ unit: value })}
												units={['px', 'em', 'rem']}
												unit={mediaIcon[0].unit ? mediaIcon[0].unit : 'px'}
											/>
											{mediaIcon[0].icon && 'fe' === mediaIcon[0].icon.substring(0, 2) && (
												<RangeControl
													label={__('Icon Line Width', 'kadence-blocks')}
													value={mediaIcon[0].width}
													onChange={(value) => saveMediaIcon({ width: value })}
													step={0.5}
													min={0.5}
													max={4}
												/>
											)}
											<MeasurementControls
												label={__('Icon Border', 'kadence-blocks')}
												measurement={mediaStyle[0].borderWidth}
												control={mediaBorderControl}
												onChange={(value) => saveMediaStyle({ borderWidth: value })}
												onControl={(value) => setMediaBorderControl(value)}
												min={0}
												max={40}
												step={1}
											/>
											<RangeControl
												label={__('Icon Border Radius (px)', 'kadence-blocks')}
												value={mediaStyle[0].borderRadius}
												onChange={(value) => saveMediaStyle({ borderRadius: value })}
												step={1}
												min={0}
												max={200}
											/>
											<SelectControl
												label={__('Icon Hover Animation', 'kadence-blocks')}
												value={mediaIcon[0].hoverAnimation}
												options={[
													{ value: 'none', label: __('None', 'kadence-blocks') },
													{
														value: 'drawborder',
														label: __('Border Spin In', 'kadence-blocks'),
													},
													{
														value: 'flip',
														label: __('Flip to Another Icon', 'kadence-blocks'),
													},
												]}
												onChange={(value) => saveMediaIcon({ hoverAnimation: value })}
											/>
											{mediaIcon[0].hoverAnimation === 'flip' && (
												<KadenceIconPicker
													value={mediaIcon[0].flipIcon}
													onChange={(value) => saveMediaIcon({ flipIcon: value })}
												/>
											)}
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
																	<PopColorControl
																		label={__('Icon Hover Color', 'kadence-blocks')}
																		value={
																			mediaIcon[0].hoverColor
																				? mediaIcon[0].hoverColor
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaIcon({ hoverColor: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Icon Hover Background',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].hoverBackground
																				? mediaStyle[0].hoverBackground
																				: ''
																		}
																		default={'transparent'}
																		onChange={(value) =>
																			saveMediaStyle({ hoverBackground: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Icon Hover Border',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].hoverBorder
																				? mediaStyle[0].hoverBorder
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaStyle({ hoverBorder: value })
																		}
																	/>
																</>
															);
														} else {
															tabout = (
																<>
																	<PopColorControl
																		label={__('Icon Color', 'kadence-blocks')}
																		value={
																			mediaIcon[0].color
																				? mediaIcon[0].color
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaIcon({ color: value })
																		}
																	/>
																	<PopColorControl
																		label={__('Icon Background', 'kadence-blocks')}
																		value={
																			mediaStyle[0].background
																				? mediaStyle[0].background
																				: ''
																		}
																		default={'transparent'}
																		onChange={(value) =>
																			saveMediaStyle({ background: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Icon Border Color',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].border
																				? mediaStyle[0].border
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaStyle({ border: value })
																		}
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
											<TextControl
												label={__('Title for screen readers', 'kadence-blocks')}
												help={__(
													'If no title added screen readers will ignore, good if the icon is purely decorative.',
													'kadence-blocks'
												)}
												value={mediaIcon[0].title}
												onChange={(value) => saveMediaIcon({ title: value })}
											/>
										</>
									)}
									{'number' === mediaType && (
										<>
											<ResponsiveRangeControls
												label={__('Size', 'kadence-blocks')}
												value={mediaIcon[0].size}
												mobileValue={mediaIcon[0].mobileSize ? mediaIcon[0].mobileSize : ''}
												tabletValue={mediaIcon[0].tabletSize ? mediaIcon[0].tabletSize : ''}
												onChange={(value) => saveMediaIcon({ size: value })}
												onChangeTablet={(value) => saveMediaIcon({ tabletSize: value })}
												onChangeMobile={(value) => saveMediaIcon({ mobileSize: value })}
												min={5}
												max={250}
												step={1}
											/>
											<TypographyControls
												fontGroup={'body'}
												fontFamily={
													mediaNumber[0] && mediaNumber[0].family ? mediaNumber[0].family : ''
												}
												onFontFamily={(value) => saveMediaNumber({ family: value })}
												onFontChange={(select) => {
													saveMediaNumber({
														family: select.value,
														google: select.google,
													});
												}}
												onFontArrayChange={(values) => saveMediaNumber(values)}
												googleFont={
													undefined !== mediaNumber[0].google ? mediaNumber[0].google : false
												}
												onGoogleFont={(value) => saveMediaNumber({ google: value })}
												loadGoogleFont={
													undefined !== mediaNumber[0].loadGoogle
														? mediaNumber[0].loadGoogle
														: true
												}
												onLoadGoogleFont={(value) => saveMediaNumber({ loadGoogle: value })}
												fontVariant={mediaNumber[0].variant ? mediaNumber[0].variant : ''}
												onFontVariant={(value) => saveMediaNumber({ variant: value })}
												fontWeight={mediaNumber[0].weight ? mediaNumber[0].weight : ''}
												onFontWeight={(value) => saveMediaNumber({ weight: value })}
												fontStyle={mediaNumber[0].style ? mediaNumber[0].style : ''}
												onFontStyle={(value) => saveMediaNumber({ style: value })}
												fontSubset={mediaNumber[0].subset ? mediaNumber[0].subset : ''}
												onFontSubset={(value) => saveMediaNumber({ subset: value })}
											/>
											<MeasurementControls
												label={__('Number Border', 'kadence-blocks')}
												measurement={mediaStyle[0].borderWidth}
												control={mediaBorderControl}
												onChange={(value) => saveMediaStyle({ borderWidth: value })}
												onControl={(value) => setMediaBorderControl(value)}
												min={0}
												max={40}
												step={1}
											/>
											<RangeControl
												label={__('Number Border Radius (px)', 'kadence-blocks')}
												value={mediaStyle[0].borderRadius}
												onChange={(value) => saveMediaStyle({ borderRadius: value })}
												step={1}
												min={0}
												max={200}
											/>
											<SelectControl
												label={__('Number Hover Animation', 'kadence-blocks')}
												value={
													mediaNumber[0].hoverAnimation
														? mediaNumber[0].hoverAnimation
														: 'none'
												}
												options={[
													{ value: 'none', label: __('None', 'kadence-blocks') },
													{
														value: 'drawborder',
														label: __('Border Spin In', 'kadence-blocks'),
													},
												]}
												onChange={(value) => saveMediaNumber({ hoverAnimation: value })}
											/>
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
																<Fragment>
																	<PopColorControl
																		label={__(
																			'Number Hover Color',
																			'kadence-blocks'
																		)}
																		value={
																			mediaIcon[0].hoverColor
																				? mediaIcon[0].hoverColor
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaIcon({ hoverColor: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Number Hover Background',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].hoverBackground
																				? mediaStyle[0].hoverBackground
																				: ''
																		}
																		default={'transparent'}
																		onChange={(value) =>
																			saveMediaStyle({ hoverBackground: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Number Hover Border',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].hoverBorder
																				? mediaStyle[0].hoverBorder
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaStyle({ hoverBorder: value })
																		}
																	/>
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<PopColorControl
																		label={__('Number Color', 'kadence-blocks')}
																		value={
																			mediaIcon[0].color
																				? mediaIcon[0].color
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaIcon({ color: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Number Background',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].background
																				? mediaStyle[0].background
																				: ''
																		}
																		default={'transparent'}
																		onChange={(value) =>
																			saveMediaStyle({ background: value })
																		}
																	/>
																	<PopColorControl
																		label={__(
																			'Number Border Color',
																			'kadence-blocks'
																		)}
																		value={
																			mediaStyle[0].border
																				? mediaStyle[0].border
																				: '#444444'
																		}
																		default={'#444444'}
																		onChange={(value) =>
																			saveMediaStyle({ border: value })
																		}
																	/>
																</Fragment>
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
										</>
									)}
									<MeasurementControls
										label={__('Media Padding', 'kadence-blocks')}
										measurement={mediaStyle[0].padding}
										control={mediaPaddingControl}
										onChange={(value) => saveMediaStyle({ padding: value })}
										onControl={(value) => setMediaPaddingControl(value)}
										min={0}
										max={['em', 'rem'].includes(mediaStyle[0].paddingUnit) ? 12 : 100}
										step={1}
										onUnit={(value) => saveMediaStyle({ paddingUnit: value })}
										units={['px', 'em', 'rem']}
										unit={mediaStyle[0].paddingUnit ? mediaStyle[0].paddingUnit : 'px'}
										showUnit={true}
									/>
									<MeasurementControls
										label={__('Media Margin', 'kadence-blocks')}
										measurement={mediaStyle[0].margin}
										control={mediaMarginControl}
										onChange={(value) => saveMediaStyle({ margin: value })}
										onControl={(value) => setMediaMarginControl(value)}
										min={['em', 'rem'].includes(mediaStyle[0].marginUnit) ? -12 : -200}
										max={['em', 'rem'].includes(mediaStyle[0].marginUnit) ? 12 : 200}
										step={1}
										onUnit={(value) => saveMediaStyle({ marginUnit: value })}
										units={['px', 'em', 'rem']}
										unit={mediaStyle[0].marginUnit ? mediaStyle[0].marginUnit : 'px'}
										showUnit={true}
									/>
								</KadencePanelBody>
							)}
							{showSettings('titleSettings', 'kadence/infobox') && (
								<KadencePanelBody
									title={__('Title Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-info-title-settings'}
								>
									<ToggleControl
										label={__('Show Title', 'kadence-blocks')}
										checked={displayTitle}
										onChange={(value) => setAttributes({ displayTitle: value })}
									/>
									{displayTitle && (
										<Fragment>
											<PopColorControl
												label={__('Title Color', 'kadence-blocks')}
												value={titleColor ? titleColor : ''}
												default={''}
												onChange={(value) => setAttributes({ titleColor: value })}
												swatchLabel2={__('Hover', 'kadence-blocks')}
												value2={titleHoverColor ? titleHoverColor : ''}
												default2={''}
												onChange2={(value) => setAttributes({ titleHoverColor: value })}
											/>
											<TypographyControls
												fontGroup={'heading'}
												tagLevel={titleFont[0].level}
												htmlTag={titleTagType}
												onTagLevelHTML={(value, tag) => {
													saveTitleFont({ level: value });
													setAttributes({ titleTagType: tag });
												}}
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
												textTransform={titleFont[0].textTransform}
												onTextTransform={(value) => saveTitleFont({ textTransform: value })}
												fontVariant={titleFont[0].variant}
												onFontVariant={(value) => saveTitleFont({ variant: value })}
												fontWeight={titleFont[0].weight}
												onFontWeight={(value) => saveTitleFont({ weight: value })}
												fontStyle={titleFont[0].style}
												onFontStyle={(value) => saveTitleFont({ style: value })}
												fontSubset={titleFont[0].subset}
												onFontSubset={(value) => saveTitleFont({ subset: value })}
												padding={titleFont[0].padding}
												onPadding={(value) => saveTitleFont({ padding: value })}
												paddingControl={titleFont[0].paddingControl}
												onPaddingControl={(value) => saveTitleFont({ paddingControl: value })}
												margin={titleFont[0].margin}
												onMargin={(value) => saveTitleFont({ margin: value })}
												marginControl={titleFont[0].marginControl}
												onMarginControl={(value) => saveTitleFont({ marginControl: value })}
											/>
											<ResponsiveRangeControls
												label={__('Min Height', 'kadence-blocks')}
												value={
													undefined !== titleMinHeight && undefined !== titleMinHeight[0]
														? titleMinHeight[0]
														: ''
												}
												onChange={(value) =>
													setAttributes({
														titleMinHeight: [
															value,
															undefined !== titleMinHeight &&
															undefined !== titleMinHeight[1]
																? titleMinHeight[1]
																: '',
															undefined !== titleMinHeight &&
															undefined !== titleMinHeight[2]
																? titleMinHeight[2]
																: '',
														],
													})
												}
												tabletValue={
													undefined !== titleMinHeight && undefined !== titleMinHeight[1]
														? titleMinHeight[1]
														: ''
												}
												onChangeTablet={(value) =>
													setAttributes({
														titleMinHeight: [
															undefined !== titleMinHeight &&
															undefined !== titleMinHeight[0]
																? titleMinHeight[0]
																: '',
															value,
															undefined !== titleMinHeight &&
															undefined !== titleMinHeight[2]
																? titleMinHeight[2]
																: '',
														],
													})
												}
												mobileValue={
													undefined !== titleMinHeight && undefined !== titleMinHeight[2]
														? titleMinHeight[2]
														: ''
												}
												onChangeMobile={(value) =>
													setAttributes({
														titleMinHeight: [
															undefined !== titleMinHeight &&
															undefined !== titleMinHeight[0]
																? titleMinHeight[0]
																: '',
															undefined !== titleMinHeight &&
															undefined !== titleMinHeight[1]
																? titleMinHeight[1]
																: '',
															value,
														],
													})
												}
												step={1}
												min={0}
												max={['em', 'rem'].includes(titleMinHeightUnit) ? 12 : 600}
												unit={titleMinHeightUnit ? titleMinHeightUnit : 'px'}
												units={['px', 'em', 'rem']}
												showUnit={true}
												onUnit={(value) => {
													setAttributes({ titleMinHeightUnit: value });
												}}
												reset={() => {
													//empty value does not re-render component. Need to pass 0.
													setAttributes({
														titleMinHeight: ['0', '0', '0'],
													});
													setTimeout(() => {
														setAttributes({
															titleMinHeight: ['', '', ''],
														});
													}, 20);
												}}
											/>
										</Fragment>
									)}
								</KadencePanelBody>
							)}
							{showSettings('textSettings', 'kadence/infobox') && (
								<KadencePanelBody
									title={__('Text Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-info-text-settings'}
								>
									<ToggleControl
										label={__('Show Text', 'kadence-blocks')}
										checked={displayText}
										onChange={(value) => setAttributes({ displayText: value })}
									/>
									{displayText && (
										<Fragment>
											<PopColorControl
												label={__('Text Color', 'kadence-blocks')}
												value={textColor ? textColor : ''}
												default={''}
												onChange={(value) => setAttributes({ textColor: value })}
												swatchLabel2={__('Hover', 'kadence-blocks')}
												value2={textHoverColor ? textHoverColor : ''}
												default2={''}
												onChange2={(value) => setAttributes({ textHoverColor: value })}
											/>
											<TypographyControls
												fontGroup={'body'}
												fontSize={textFont[0].size}
												onFontSize={(value) => saveTextFont({ size: value })}
												fontSizeType={textFont[0].sizeType}
												onFontSizeType={(value) => saveTextFont({ sizeType: value })}
												lineHeight={textFont[0].lineHeight}
												onLineHeight={(value) => saveTextFont({ lineHeight: value })}
												lineHeightType={textFont[0].lineType}
												onLineHeightType={(value) => saveTextFont({ lineType: value })}
												letterSpacing={textFont[0].letterSpacing}
												onLetterSpacing={(value) => saveTextFont({ letterSpacing: value })}
												fontFamily={textFont[0].family}
												onFontFamily={(value) => saveTextFont({ family: value })}
												onFontChange={(select) => {
													saveTextFont({
														family: select.value,
														google: select.google,
													});
												}}
												onFontArrayChange={(values) => saveTextFont(values)}
												googleFont={textFont[0].google}
												onGoogleFont={(value) => saveTextFont({ google: value })}
												loadGoogleFont={textFont[0].loadGoogle}
												onLoadGoogleFont={(value) => saveTextFont({ loadGoogle: value })}
												fontVariant={textFont[0].variant}
												onFontVariant={(value) => saveTextFont({ variant: value })}
												fontWeight={textFont[0].weight}
												onFontWeight={(value) => saveTextFont({ weight: value })}
												fontStyle={textFont[0].style}
												onFontStyle={(value) => saveTextFont({ style: value })}
												fontSubset={textFont[0].subset}
												onFontSubset={(value) => saveTextFont({ subset: value })}
												textTransform={
													undefined !== textFont[0].textTransform
														? textFont[0].textTransform
														: ''
												}
												onTextTransform={(value) => saveTextFont({ textTransform: value })}
											/>
											<TypographyControls
												padding={
													undefined !== textSpacing &&
													undefined !== textSpacing[0] &&
													textSpacing[0].padding
														? textSpacing[0].padding
														: ['', '', '', '']
												}
												onPadding={(value) => saveTextSpacing({ padding: value })}
												paddingControl={
													undefined !== textSpacing &&
													undefined !== textSpacing[0] &&
													textSpacing[0].paddingControl
														? textSpacing[0].paddingControl
														: 'linked'
												}
												onPaddingControl={(value) => saveTextSpacing({ paddingControl: value })}
												margin={
													undefined !== textSpacing &&
													undefined !== textSpacing[0] &&
													textSpacing[0].margin
														? textSpacing[0].margin
														: ['', '', '', '']
												}
												onMargin={(value) => saveTextSpacing({ margin: value })}
												marginControl={
													undefined !== textSpacing &&
													undefined !== textSpacing[0] &&
													textSpacing[0].marginControl
														? textSpacing[0].marginControl
														: 'linked'
												}
												onMarginControl={(value) => saveTextSpacing({ marginControl: value })}
											/>
											<ResponsiveRangeControls
												label={__('Min Height', 'kadence-blocks')}
												value={
													undefined !== textMinHeight && undefined !== textMinHeight[0]
														? textMinHeight[0]
														: ''
												}
												onChange={(value) =>
													setAttributes({
														textMinHeight: [
															value,
															undefined !== textMinHeight &&
															undefined !== textMinHeight[1]
																? textMinHeight[1]
																: '',
															undefined !== textMinHeight &&
															undefined !== textMinHeight[2]
																? textMinHeight[2]
																: '',
														],
													})
												}
												tabletValue={
													undefined !== textMinHeight && undefined !== textMinHeight[1]
														? textMinHeight[1]
														: ''
												}
												onChangeTablet={(value) =>
													setAttributes({
														textMinHeight: [
															undefined !== textMinHeight &&
															undefined !== textMinHeight[0]
																? textMinHeight[0]
																: '',
															value,
															undefined !== textMinHeight &&
															undefined !== textMinHeight[2]
																? textMinHeight[2]
																: '',
														],
													})
												}
												mobileValue={
													undefined !== textMinHeight && undefined !== textMinHeight[2]
														? textMinHeight[2]
														: ''
												}
												onChangeMobile={(value) =>
													setAttributes({
														textMinHeight: [
															undefined !== textMinHeight &&
															undefined !== textMinHeight[0]
																? textMinHeight[0]
																: '',
															undefined !== textMinHeight &&
															undefined !== textMinHeight[1]
																? textMinHeight[1]
																: '',
															value,
														],
													})
												}
												step={1}
												min={0}
												max={['em', 'rem'].includes(textMinHeightUnit) ? 12 : 600}
												unit={titleMinHeightUnit ? textMinHeightUnit : 'px'}
												units={['px', 'em', 'rem']}
												showUnit={true}
												onUnit={(value) => {
													setAttributes({ textMinHeightUnit: value });
												}}
											/>
										</Fragment>
									)}
								</KadencePanelBody>
							)}

							{showSettings('learnMoreSettings', 'kadence/infobox') && (
								<KadencePanelBody
									title={__('Learn More Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-info-learn-more'}
								>
									<ToggleControl
										label={__('Show Learn More', 'kadence-blocks')}
										checked={displayLearnMore}
										onChange={(value) => setAttributes({ displayLearnMore: value })}
									/>
									{displayLearnMore && (
										<>
											<ColorGroup>
												<PopColorControl
													label={__('Text Color', 'kadence-blocks')}
													value={learnMoreStyles[0].color ? learnMoreStyles[0].color : ''}
													default={''}
													onChange={(value) => saveLearnMoreStyles({ color: value })}
													swatchLabel2={__('Hover', 'kadence-blocks')}
													value2={
														learnMoreStyles[0].colorHover
															? learnMoreStyles[0].colorHover
															: ''
													}
													default2={''}
													onChange2={(value) => saveLearnMoreStyles({ colorHover: value })}
												/>
												<PopColorControl
													label={__('Background', 'kadence-blocks')}
													value={
														learnMoreStyles[0].background
															? learnMoreStyles[0].background
															: ''
													}
													default={''}
													onChange={(value) => saveLearnMoreStyles({ background: value })}
													value2={
														learnMoreStyles[0].backgroundHover
															? learnMoreStyles[0].backgroundHover
															: ''
													}
													default2={''}
													onChange2={(value) =>
														saveLearnMoreStyles({ backgroundHover: value })
													}
												/>
												<PopColorControl
													label={__('Border Color', 'kadence-blocks')}
													value={learnMoreStyles[0].border ? learnMoreStyles[0].border : ''}
													default={''}
													onChange={(value) => saveLearnMoreStyles({ border: value })}
													value2={
														learnMoreStyles[0].borderHover
															? learnMoreStyles[0].borderHover
															: ''
													}
													default2={''}
													onChange2={(value) => saveLearnMoreStyles({ borderHover: value })}
												/>
											</ColorGroup>
											<MeasurementControls
												label={__('Learn More Border Width (px)', 'kadence-blocks')}
												measurement={learnMoreStyles[0].borderWidth}
												control={learnMoreStyles[0].borderControl}
												onChange={(value) => saveLearnMoreStyles({ borderWidth: value })}
												onControl={(value) => saveLearnMoreStyles({ borderControl: value })}
												min={0}
												max={40}
												step={1}
											/>
											<RangeControl
												label={__('Learn More Border Radius (px)', 'kadence-blocks')}
												value={learnMoreStyles[0].borderRadius}
												onChange={(value) => saveLearnMoreStyles({ borderRadius: value })}
												step={1}
												min={0}
												max={200}
											/>
											<TypographyControls
												fontGroup={'body'}
												fontSize={learnMoreStyles[0].size}
												onFontSize={(value) => saveLearnMoreStyles({ size: value })}
												fontSizeType={learnMoreStyles[0].sizeType}
												onFontSizeType={(value) => saveLearnMoreStyles({ sizeType: value })}
												lineHeight={learnMoreStyles[0].lineHeight}
												onLineHeight={(value) => saveLearnMoreStyles({ lineHeight: value })}
												lineHeightType={learnMoreStyles[0].lineType}
												onLineHeightType={(value) => saveLearnMoreStyles({ lineType: value })}
												letterSpacing={learnMoreStyles[0].letterSpacing}
												onLetterSpacing={(value) =>
													saveLearnMoreStyles({ letterSpacing: value })
												}
												fontFamily={learnMoreStyles[0].family}
												onFontFamily={(value) => saveLearnMoreStyles({ family: value })}
												onFontChange={(select) => {
													saveLearnMoreStyles({
														family: select.value,
														google: select.google,
													});
												}}
												onFontArrayChange={(values) => saveLearnMoreStyles(values)}
												googleFont={learnMoreStyles[0].google}
												onGoogleFont={(value) => saveLearnMoreStyles({ google: value })}
												loadGoogleFont={learnMoreStyles[0].loadGoogle}
												onLoadGoogleFont={(value) => saveLearnMoreStyles({ loadGoogle: value })}
												textTransform={
													undefined !== learnMoreStyles[0].textTransform
														? learnMoreStyles[0].textTransform
														: ''
												}
												onTextTransform={(value) =>
													saveLearnMoreStyles({ textTransform: value })
												}
												fontVariant={learnMoreStyles[0].variant}
												onFontVariant={(value) => saveLearnMoreStyles({ variant: value })}
												fontWeight={learnMoreStyles[0].weight}
												onFontWeight={(value) => saveLearnMoreStyles({ weight: value })}
												fontStyle={learnMoreStyles[0].style}
												onFontStyle={(value) => saveLearnMoreStyles({ style: value })}
												fontSubset={learnMoreStyles[0].subset}
												onFontSubset={(value) => saveLearnMoreStyles({ subset: value })}
											/>
											<MeasurementControls
												label={__('Padding', 'kadence-blocks')}
												reset={true}
												measurement={learnMoreStyles[0].padding}
												control={learnMoreStyles[0].paddingControl}
												onChange={(value) => saveLearnMoreStyles({ padding: value })}
												onControl={(value) => saveLearnMoreStyles({ paddingControl: value })}
												min={0}
												max={
													learnMoreStyles[0]?.paddingUnit === 'em' ||
													learnMoreStyles[0]?.paddingUnit === 'rem'
														? 12
														: 999
												}
												step={
													learnMoreStyles[0]?.paddingUnit === 'em' ||
													learnMoreStyles[0]?.paddingUnit === 'rem'
														? 0.1
														: 1
												}
												units={['px', 'em', 'rem']}
												unit={
													learnMoreStyles[0]?.paddingUnit
														? learnMoreStyles[0]?.paddingUnit
														: 'px'
												}
												onUnit={(value) => saveLearnMoreStyles({ paddingUnit: value })}
											/>
											<MeasurementControls
												label={__('Margin', 'kadence-blocks')}
												measurement={learnMoreStyles[0].margin}
												control={learnMoreStyles[0].marginControl}
												onChange={(value) => saveLearnMoreStyles({ margin: value })}
												reset={true}
												onControl={(value) => saveLearnMoreStyles({ marginControl: value })}
												min={
													learnMoreStyles[0]?.marginUnit === 'em' ||
													learnMoreStyles[0]?.marginUnit === 'rem'
														? -2
														: -999
												}
												max={
													learnMoreStyles[0]?.marginUnit === 'em' ||
													learnMoreStyles[0]?.marginUnit === 'rem'
														? 12
														: 999
												}
												step={
													learnMoreStyles[0]?.marginUnit === 'em' ||
													learnMoreStyles[0]?.marginUnit === 'rem'
														? 0.1
														: 1
												}
												units={['px', 'em', 'rem']}
												unit={
													learnMoreStyles[0]?.marginUnit
														? learnMoreStyles[0]?.marginUnit
														: 'px'
												}
												onUnit={(value) => saveLearnMoreStyles({ marginUnit: value })}
											/>
										</>
									)}
								</KadencePanelBody>
							)}
						</>
					)}
					{activeTab === 'advanced' && (
						<>
							<KadencePanelBody panelName={'kb-infobox-spacing-settings'}>
								<ResponsiveMeasureRangeControl
									label={__('Padding', 'kadence-blocks')}
									value={containerPadding}
									tabletValue={containerTabletPadding}
									mobileValue={containerMobilePadding}
									onChange={(value) => {
										setAttributes({ containerPadding: value });
									}}
									onChangeTablet={(value) => {
										setAttributes({ containerTabletPadding: value });
									}}
									onChangeMobile={(value) => {
										setAttributes({ containerMobilePadding: value });
									}}
									min={paddingMin}
									max={paddingMax}
									step={paddingStep}
									unit={containerPaddingType}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ containerPaddingType: value })}
									onMouseOver={paddingMouseOver.onMouseOver}
									onMouseOut={paddingMouseOver.onMouseOut}
								/>
								<ResponsiveMeasureRangeControl
									label={__('Margin', 'kadence-blocks')}
									value={containerMargin}
									tabletValue={tabletContainerMargin}
									mobileValue={mobileContainerMargin}
									onChange={(value) => {
										setAttributes({ containerMargin: value });
									}}
									onChangeTablet={(value) => {
										setAttributes({ tabletContainerMargin: value });
									}}
									onChangeMobile={(value) => {
										setAttributes({ mobileContainerMargin: value });
									}}
									min={marginMin}
									max={marginMax}
									step={marginStep}
									unit={containerMarginUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ containerMarginUnit: value })}
									onMouseOver={marginMouseOver.onMouseOver}
									onMouseOut={marginMouseOver.onMouseOut}
									allowAuto={true}
								/>
								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={maxWidth}
									onChange={(value) => setAttributes({ maxWidth: value })}
									tabletValue={tabletMaxWidth}
									onChangeTablet={(value) => setAttributes({ tabletMaxWidth: value })}
									mobileValue={mobileMaxWidth}
									onChangeMobile={(value) => setAttributes({ mobileMaxWidth: value })}
									min={0}
									max={previewMaxWidthUnit === 'px' ? 2000 : 100}
									step={1}
									unit={previewMaxWidthUnit}
									allowResponsiveUnitChange={true}
									onUnit={(value) => {
										const device = 'Desktop' === previewDevice ? '' : previewDevice;
										setAttributes({ ['maxWidth' + device + 'Unit']: value });
									}}
									units={['px', '%', 'vw']}
									reset={() => {
										setAttributes({ maxWidth: '', tabletMaxWidth: '', mobileMaxWidth: '' });
									}}
								/>
								<ToggleControl
									label={__('Set Height 100%', 'kadence-blocks')}
									help={__(
										'This will only work if the parent container is set to a height or you are in a row layout with 100% inner block height.',
										'kadence-blocks'
									)}
									checked={undefined !== fullHeight ? fullHeight : false}
									onChange={(value) => setAttributes({ fullHeight: value })}
								/>
							</KadencePanelBody>

							<div className="kt-sidebar-settings-spacer"></div>

							<KadenceBlockDefaults
								attributes={attributes}
								defaultAttributes={metadata.attributes}
								blockSlug={metadata.name}
								excludedAttrs={nonTransAttrs}
							/>
						</>
					)}
				</InspectorControls>
			)}
			<div
				className={`kt-blocks-info-box-link-wrap kt-blocks-info-box-media-align-${previewMediaAlign} ${isSelectedClass} kt-info-halign-${previewhAlign} kb-info-box-vertical-media-align-${mediaVAlign} ${learnMoreHasAlign}`}
				style={{
					boxShadow: displayShadow
						? shadow[0].hOffset +
						  'px ' +
						  shadow[0].vOffset +
						  'px ' +
						  shadow[0].blur +
						  'px ' +
						  shadow[0].spread +
						  'px ' +
						  KadenceColorOutput(shadow[0].color, shadow[0].opacity)
						: undefined,
					background: containerBackground ? KadenceColorOutput(containerBackground) : undefined,
					borderTop: previewBorderTopStyle ? previewBorderTopStyle : undefined,
					borderRight: previewBorderRightStyle ? previewBorderRightStyle : undefined,
					borderBottom: previewBorderBottomStyle ? previewBorderBottomStyle : undefined,
					borderLeft: previewBorderLeftStyle ? previewBorderLeftStyle : undefined,
					borderTopLeftRadius: previewRadiusTop
						? previewRadiusTop + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					borderTopRightRadius: previewRadiusRight
						? previewRadiusRight + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					borderBottomRightRadius: previewRadiusBottom
						? previewRadiusBottom + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					borderBottomLeftRadius: previewRadiusLeft
						? previewRadiusLeft + (borderRadiusUnit ? borderRadiusUnit : 'px')
						: undefined,
					paddingTop:
						'' !== previewContainerPaddingTop
							? getSpacingOptionOutput(previewContainerPaddingTop, previewPaddingType)
							: undefined,
					paddingRight:
						'' !== previewContainerPaddingRight
							? getSpacingOptionOutput(previewContainerPaddingRight, previewPaddingType)
							: undefined,
					paddingBottom:
						'' !== previewContainerPaddingBottom
							? getSpacingOptionOutput(previewContainerPaddingBottom, previewPaddingType)
							: undefined,
					paddingLeft:
						'' !== previewContainerPaddingLeft
							? getSpacingOptionOutput(previewContainerPaddingLeft, previewPaddingType)
							: undefined,
					maxWidth: previewMaxWidth ? previewMaxWidth + previewMaxWidthUnit : undefined,
					marginTop:
						'' !== previewContainerMarginTop
							? getSpacingOptionOutput(previewContainerMarginTop, containerMarginUnit)
							: undefined,
					marginRight:
						'' !== previewContainerMarginRight
							? getSpacingOptionOutput(previewContainerMarginRight, containerMarginUnit)
							: undefined,
					marginBottom:
						'' !== previewContainerMarginBottom
							? getSpacingOptionOutput(previewContainerMarginBottom, containerMarginUnit)
							: undefined,
					marginLeft:
						'' !== previewContainerMarginLeft
							? getSpacingOptionOutput(previewContainerMarginLeft, containerMarginUnit)
							: undefined,
					height: fullHeight ? '100%' : undefined,
				}}
			>
				{'none' !== mediaType && (
					<div
						className={'kt-blocks-info-box-media-container'}
						style={{
							margin: mediaStyle[0].margin
								? mediaStyle[0].margin[0] +
								  (mediaStyle[0].marginUnit ? mediaStyle[0].marginUnit + ' ' : 'px ') +
								  mediaStyle[0].margin[1] +
								  (mediaStyle[0].marginUnit ? mediaStyle[0].marginUnit + ' ' : 'px ') +
								  mediaStyle[0].margin[2] +
								  (mediaStyle[0].marginUnit ? mediaStyle[0].marginUnit + ' ' : 'px ') +
								  mediaStyle[0].margin[3] +
								  (mediaStyle[0].marginUnit ? mediaStyle[0].marginUnit : 'px')
								: '',
						}}
					>
						<div
							className={`kt-blocks-info-box-media ${
								'number' === mediaType ? 'kt-info-media-animate-' + mediaNumber[0].hoverAnimation : ''
							}${'image' === mediaType ? 'kt-info-media-animate-' + mediaImage[0].hoverAnimation : ''}${
								'icon' === mediaType ? 'kt-info-media-animate-' + mediaIcon[0].hoverAnimation : ''
							}`}
							style={{
								borderColor: KadenceColorOutput(mediaStyle[0].border),
								backgroundColor: KadenceColorOutput(mediaStyle[0].background),
								borderRadius: mediaStyle[0].borderRadius + 'px',
								borderWidth: mediaStyle[0].borderWidth
									? mediaStyle[0].borderWidth[0] +
									  'px ' +
									  mediaStyle[0].borderWidth[1] +
									  'px ' +
									  mediaStyle[0].borderWidth[2] +
									  'px ' +
									  mediaStyle[0].borderWidth[3] +
									  'px'
									: '',
								padding: mediaStyle[0].padding
									? mediaStyle[0].padding[0] +
									  (mediaStyle[0].paddingUnit ? mediaStyle[0].paddingUnit + ' ' : 'px ') +
									  mediaStyle[0].padding[1] +
									  (mediaStyle[0].paddingUnit ? mediaStyle[0].paddingUnit + ' ' : 'px ') +
									  mediaStyle[0].padding[2] +
									  (mediaStyle[0].paddingUnit ? mediaStyle[0].paddingUnit + ' ' : 'px ') +
									  mediaStyle[0].padding[3] +
									  (mediaStyle[0].paddingUnit ? mediaStyle[0].paddingUnit : 'px')
									: '',
							}}
						>
							{!mediaImage[0].url && 'image' === mediaType && (
								<Fragment>
									<KadenceMediaPlaceholder
										labels={''}
										selectIcon={plusCircleFilled}
										selectLabel={__('Select Image', 'kadence-blocks')}
										onSelect={onSelectImage}
										accept="image/*"
										className={'kadence-image-upload'}
										allowedTypes={ALLOWED_MEDIA_TYPES}
										disableMediaButtons={false}
									/>
								</Fragment>
							)}
							{mediaImage[0].url && 'image' === mediaType && (
								<div
									className="kadence-info-box-image-inner-intrisic-container"
									style={{
										maxWidth: mediaImage[0].maxWidth + 'px',
									}}
								>
									<div
										className={`kadence-info-box-image-intrisic kt-info-animate-${
											mediaImage[0].hoverAnimation
										}${'svg+xml' === mediaImage[0].subtype ? ' kb-info-box-image-type-svg' : ''}${
											hasRatio
												? ' kb-info-box-image-ratio kb-info-box-image-ratio-' + imageRatio
												: ''
										}`}
										style={{
											paddingBottom: imageRatioPadding,
											height: imageRatioHeight,
											width: isNaN(mediaImage[0].width) ? undefined : mediaImage[0].width + 'px',
											maxWidth: '100%',
										}}
									>
										<div className="kadence-info-box-image-inner-intrisic">
											<img
												src={mediaImage[0].url}
												alt={mediaImage[0].alt ? mediaImage[0].alt : mediaImage[0].alt}
												width={
													mediaImage[0].subtype && 'svg+xml' === mediaImage[0].subtype
														? mediaImage[0].maxWidth
														: mediaImage[0].width
												}
												height={mediaImage[0].height}
												className={`${
													mediaImage[0].id
														? `kt-info-box-image wp-image-${mediaImage[0].id}`
														: 'kt-info-box-image wp-image-offsite'
												} ${
													mediaImage[0].subtype && 'svg+xml' === mediaImage[0].subtype
														? ' kt-info-svg-image'
														: ''
												}`}
											/>
											{mediaImage[0].flipUrl && 'flip' === mediaImage[0].hoverAnimation && (
												<img
													src={mediaImage[0].flipUrl}
													alt={
														mediaImage[0].flipAlt
															? mediaImage[0].flipAlt
															: mediaImage[0].flipAlt
													}
													width={
														mediaImage[0].flipSubtype &&
														'svg+xml' === mediaImage[0].flipSubtype
															? mediaImage[0].maxWidth
															: mediaImage[0].flipWidth
													}
													height={mediaImage[0].flipHeight}
													className={`${
														mediaImage[0].flipId
															? `kt-info-box-image-flip wp-image-${mediaImage[0].flipId}`
															: 'kt-info-box-image-flip wp-image-offsite'
													} ${
														mediaImage[0].flipSubtype &&
														'svg+xml' === mediaImage[0].flipSubtype
															? ' kt-info-svg-image'
															: ''
													}`}
												/>
											)}
										</div>
									</div>
								</div>
							)}
							{'icon' === mediaType && (
								<div
									className={`kadence-info-box-icon-container kt-info-icon-animate-${mediaIcon[0].hoverAnimation}`}
								>
									<div className={'kadence-info-box-icon-inner-container'}>
										<IconRender
											className={`kt-info-svg-icon kt-info-svg-icon-${mediaIcon[0].icon}`}
											name={mediaIcon[0].icon}
											size={previewMediaIconSize}
											unit={mediaIcon[0].unit ? mediaIcon[0].unit : ''}
											htmltag="span"
											strokeWidth={
												'fe' === mediaIcon[0].icon.substring(0, 2)
													? mediaIcon[0].width
													: undefined
											}
											style={{
												display: 'flex',
												color: mediaIcon[0].color
													? KadenceColorOutput(mediaIcon[0].color)
													: undefined,
											}}
										/>
										{mediaIcon[0].flipIcon && 'flip' === mediaIcon[0].hoverAnimation && (
											<IconRender
												className={`kt-info-svg-icon-flip kt-info-svg-icon-${mediaIcon[0].flipIcon}`}
												name={mediaIcon[0].flipIcon}
												size={previewMediaIconSize}
												htmltag="span"
												strokeWidth={
													'fe' === mediaIcon[0].flipIcon.substring(0, 2)
														? mediaIcon[0].width
														: undefined
												}
												style={{
													display: 'flex',
													color: mediaIcon[0].hoverColor
														? KadenceColorOutput(mediaIcon[0].hoverColor)
														: undefined,
												}}
											/>
										)}
									</div>
								</div>
							)}
							{'number' === mediaType && (
								<div
									className={`kadence-info-box-number-container kt-info-number-animate-${
										mediaNumber && mediaNumber[0] && mediaNumber[0].hoverAnimation
											? mediaNumber[0].hoverAnimation
											: 'none'
									}`}
								>
									<div
										className={'kadence-info-box-number-inner-container'}
										style={{
											fontWeight: mediaNumber[0].weight,
											fontStyle: mediaNumber[0].style,
											color: mediaIcon[0].color
												? KadenceColorOutput(mediaIcon[0].color)
												: undefined,
											fontSize:
												mediaIcon[0].size + (mediaIcon[0].unit ? mediaIcon[0].unit : 'px'),
											fontFamily: mediaNumber[0].family ? mediaNumber[0].family : undefined,
										}}
									>
										<RichText
											className="kt-blocks-info-box-number"
											allowedFormats={
												linkProperty === 'learnmore'
													? applyFilters('kadence.whitelist_richtext_formats', [
															'kadence/insert-dynamic',
															'core/bold',
															'core/italic',
															'core/link',
															'toolset/inline-field',
													  ])
													: applyFilters('kadence.whitelist_richtext_formats', [
															'kadence/insert-dynamic',
															'core/bold',
															'core/italic',
															'toolset/inline-field',
													  ])
											}
											tagName={'div'}
											placeholder={'1'}
											onChange={onChangeNumber}
											value={number}
										/>
									</div>
									{mediaNumber[0].google && <WebfontLoader config={nconfig}></WebfontLoader>}
								</div>
							)}
						</div>
					</div>
				)}
				<div className={'kt-infobox-textcontent'}>
					{displayTitle && titleFont[0].google && <WebfontLoader config={config}></WebfontLoader>}
					{displayTitle && (
						<RichText
							className="kt-blocks-info-box-title"
							allowedFormats={
								linkProperty === 'learnmore'
									? applyFilters('kadence.whitelist_richtext_formats', [
											'kadence/insert-dynamic',
											'core/bold',
											'core/italic',
											'core/link',
											'toolset/inline-field',
									  ])
									: applyFilters('kadence.whitelist_richtext_formats', [
											'kadence/insert-dynamic',
											'core/bold',
											'core/italic',
											'toolset/inline-field',
									  ])
							}
							tagName={titleTagName}
							placeholder={__('Title', 'kadence-blocks')}
							onChange={onChangeTitle}
							value={title}
							style={{
								fontWeight: titleFont[0].weight,
								fontStyle: titleFont[0].style,
								textTransform: titleFont[0].textTransform ? titleFont[0].textTransform : undefined,
								color: KadenceColorOutput(titleColor),
								fontSize: getFontSizeOptionOutput(previewTitleFontSize, titleFont[0].sizeType),
								lineHeight: previewTitleLineHeight + titleFont[0].lineType,
								letterSpacing: titleFont[0].letterSpacing + 'px',
								fontFamily: titleFont[0].family ? titleFont[0].family : '',
								padding: titleFont[0].padding
									? titleFont[0].padding[0] +
									  'px ' +
									  titleFont[0].padding[1] +
									  'px ' +
									  titleFont[0].padding[2] +
									  'px ' +
									  titleFont[0].padding[3] +
									  'px'
									: '',
								margin: titleFont[0].margin
									? titleFont[0].margin[0] +
									  'px ' +
									  titleFont[0].margin[1] +
									  'px ' +
									  titleFont[0].margin[2] +
									  'px ' +
									  titleFont[0].margin[3] +
									  'px'
									: '',
								minHeight: previewTitleMinHeight + (titleMinHeightUnit ? titleMinHeightUnit : 'px'),
							}}
							keepPlaceholderOnFocus
						/>
					)}
					{displayText && textFont[0].google && <WebfontLoader config={tconfig}></WebfontLoader>}
					{displayText && (
						<RichText
							className="kt-blocks-info-box-text"
							allowedFormats={
								linkProperty === 'learnmore'
									? applyFilters('kadence.whitelist_richtext_formats', [
											'kadence/insert-dynamic',
											'core/bold',
											'core/italic',
											'core/link',
											'toolset/inline-field',
									  ])
									: applyFilters('kadence.whitelist_richtext_formats', [
											'kadence/insert-dynamic',
											'core/bold',
											'core/italic',
											'toolset/inline-field',
									  ])
							}
							tagName={'p'}
							placeholder={__(
								'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam dolor, accumsan sed rutrum vel, dapibus et leo.',
								'kadence-blocks'
							)}
							onChange={(value) => setAttributes({ contentText: value })}
							value={contentText}
							style={{
								fontWeight: textFont[0].weight,
								fontStyle: textFont[0].style,
								color: KadenceColorOutput(textColor),
								fontSize: getFontSizeOptionOutput(previewTextFontSize, textFont[0].sizeType),
								lineHeight: previewTextLineHeight + textFont[0].lineType,
								letterSpacing: textFont[0].letterSpacing + 'px',
								textTransform:
									undefined !== textFont[0].textTransform && textFont[0].textTransform
										? textFont[0].textTransform
										: undefined,
								fontFamily: textFont[0].family ? textFont[0].family : '',
								padding:
									undefined !== textSpacing && undefined !== textSpacing[0] && textSpacing[0].padding
										? textSpacing[0].padding[0] +
										  'px ' +
										  textSpacing[0].padding[1] +
										  'px ' +
										  textSpacing[0].padding[2] +
										  'px ' +
										  textSpacing[0].padding[3] +
										  'px'
										: '',
								margin:
									undefined !== textSpacing && undefined !== textSpacing[0] && textSpacing[0].margin
										? textSpacing[0].margin[0] +
										  'px ' +
										  textSpacing[0].margin[1] +
										  'px ' +
										  textSpacing[0].margin[2] +
										  'px ' +
										  textSpacing[0].margin[3] +
										  'px'
										: '',
								minHeight: previewTextMinHeight + (textMinHeightUnit ? textMinHeightUnit : 'px'),
							}}
							keepPlaceholderOnFocus
						/>
					)}
					{displayLearnMore && learnMoreStyles[0].google && <WebfontLoader config={lconfig}></WebfontLoader>}
					{displayLearnMore && (
						<div className="kt-blocks-info-box-learnmore-wrap">
							<RichText
								allowedFormats={applyFilters('kadence.whitelist_richtext_formats', [
									'kadence/insert-dynamic',
									'core/bold',
									'core/italic',
									'toolset/inline-field',
								])}
								className="kt-blocks-info-box-learnmore"
								tagName={'div'}
								placeholder={__('Learn More', 'kadence-blocks')}
								onChange={(value) => setAttributes({ learnMore: value })}
								value={learnMore}
								style={{
									fontWeight: learnMoreStyles[0].weight,
									fontStyle: learnMoreStyles[0].style,
									color: KadenceColorOutput(learnMoreStyles[0].color),
									borderRadius: learnMoreStyles[0].borderRadius + 'px',
									background: KadenceColorOutput(learnMoreStyles[0].background),
									borderColor: KadenceColorOutput(learnMoreStyles[0].border),
									fontSize: getFontSizeOptionOutput(
										previewLearnMoreFontSize,
										learnMoreStyles[0].sizeType
									),
									lineHeight: previewLearnMoreLineHeight + learnMoreStyles[0].lineType,
									letterSpacing: learnMoreStyles[0].letterSpacing + 'px',
									textTransform:
										undefined !== learnMoreStyles[0].textTransform &&
										learnMoreStyles[0].textTransform
											? learnMoreStyles[0].textTransform
											: undefined,
									fontFamily: learnMoreStyles[0].family ? learnMoreStyles[0].family : '',
									borderWidth: learnMoreStyles[0].borderWidth
										? learnMoreStyles[0].borderWidth[0] +
										  'px ' +
										  learnMoreStyles[0].borderWidth[1] +
										  'px ' +
										  learnMoreStyles[0].borderWidth[2] +
										  'px ' +
										  learnMoreStyles[0].borderWidth[3] +
										  'px'
										: '',
									paddingTop:
										undefined !== learnMoreStyles?.[0]?.padding?.[0] &&
										'' !== learnMoreStyles?.[0]?.padding?.[0]
											? learnMoreStyles[0].padding[0] + previewLearnMorePaddingUnit
											: undefined,
									paddingRight:
										undefined !== learnMoreStyles?.[0]?.padding?.[1] &&
										'' !== learnMoreStyles?.[0]?.padding?.[1]
											? learnMoreStyles[0].padding[1] + previewLearnMorePaddingUnit
											: undefined,
									paddingBottom:
										undefined !== learnMoreStyles?.[0]?.padding?.[2] &&
										'' !== learnMoreStyles?.[0]?.padding?.[2]
											? learnMoreStyles[0].padding[2] + previewLearnMorePaddingUnit
											: undefined,
									paddingLeft:
										undefined !== learnMoreStyles?.[0]?.padding?.[3] &&
										'' !== learnMoreStyles?.[0]?.padding?.[3]
											? learnMoreStyles[0].padding[3] + previewLearnMorePaddingUnit
											: undefined,
									marginTop:
										undefined !== learnMoreStyles?.[0]?.margin?.[0] &&
										'' !== learnMoreStyles?.[0]?.margin?.[0]
											? learnMoreStyles[0].margin[0] + previewLearnMoreMarginUnit
											: undefined,
									marginRight:
										undefined !== learnMoreStyles?.[0]?.margin?.[1] &&
										'' !== learnMoreStyles?.[0]?.margin?.[1]
											? learnMoreStyles[0].margin[1] + previewLearnMoreMarginUnit
											: undefined,
									marginBottom:
										undefined !== learnMoreStyles?.[0]?.margin?.[2] &&
										'' !== learnMoreStyles?.[0]?.margin?.[2]
											? learnMoreStyles[0].margin[2] + previewLearnMoreMarginUnit
											: undefined,
									marginLeft:
										undefined !== learnMoreStyles?.[0]?.margin?.[3] &&
										'' !== learnMoreStyles?.[0]?.margin?.[3]
											? learnMoreStyles[0].margin[3] + previewLearnMoreMarginUnit
											: undefined,
								}}
								keepPlaceholderOnFocus
							/>
						</div>
					)}
				</div>
				<SpacingVisualizer
					style={{
						marginLeft:
							undefined !== previewContainerMarginLeft
								? getSpacingOptionOutput(previewContainerMarginLeft, containerMarginUnit)
								: undefined,
						marginRight:
							undefined !== previewContainerMarginRight
								? getSpacingOptionOutput(previewContainerMarginRight, containerMarginUnit)
								: undefined,
						marginTop:
							undefined !== previewContainerMarginTop
								? getSpacingOptionOutput(previewContainerMarginTop, containerMarginUnit)
								: undefined,
						marginBottom:
							undefined !== previewContainerMarginBottom
								? getSpacingOptionOutput(previewContainerMarginBottom, containerMarginUnit)
								: undefined,
					}}
					type="inside"
					forceShow={paddingMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewContainerPaddingTop, previewPaddingType),
						getSpacingOptionOutput(previewContainerPaddingRight, previewPaddingType),
						getSpacingOptionOutput(previewContainerPaddingBottom, previewPaddingType),
						getSpacingOptionOutput(previewContainerPaddingLeft, previewPaddingType),
					]}
				/>
				<SpacingVisualizer
					type="outsideVertical"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewContainerMarginTop, containerMarginUnit),
						getSpacingOptionOutput(previewContainerMarginRight, containerMarginUnit),
						getSpacingOptionOutput(previewContainerMarginBottom, containerMarginUnit),
						getSpacingOptionOutput(previewContainerMarginLeft, containerMarginUnit),
					]}
				/>
			</div>
		</div>
	);
}

export default KadenceInfoBox;
