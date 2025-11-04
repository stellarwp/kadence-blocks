/**
 * BLOCK: Kadence TOC
 */

/**
 * Import External
 */
import { isEqual } from 'lodash';
import classnames from 'classnames';
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	getBorderStyle,
	uniqueIdHelper,
} from '@kadence/helpers';
import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	MeasurementControls,
	RangeControl,
	ResponsiveBorderControl,
	BoxShadowControl,
	KadenceIconPicker,
	ResponsiveRangeControls,
	KadencePanelBody,
	KadenceWebfontLoader,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
} from '@kadence/components';

/**
 * Import Icons
 */
import {
	noneIcon,
	oneColumnIcon,
	threeColumnIcon,
	twoColumnIcon,
	bulletsIcon,
	numberedIcon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	topLeftIcon,
	topRightIcon,
	bottomLeftIcon,
	bottomRightIcon,
} from '@kadence/icons';
import metadata from './block.json';

/**
 * Internal dependencies
 */
import TableOfContentsList from './list';
import { getHeadingsFromContent, linearToNestedHeadingList } from './utils';

import { ENTER } from '@wordpress/keycodes';
import { withSelect, useSelect, useDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import { Fragment, useState, useEffect, useLayoutEffect } from '@wordpress/element';

import { RichText, BlockControls, useBlockProps } from '@wordpress/block-editor';

import { ToolbarGroup, ToggleControl, ToolbarDropdownMenu, SelectControl } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

/**
 * Build the TOC edit
 */
function KadenceTableOfContents(props) {
	const { attributes, setAttributes, clientId, className, isSelected, pageIndex, postContent, blockOrder, isTyping } =
		props;
	const {
		uniqueID,
		allowedHeaders,
		columns,
		listStyle,
		listGap,
		title,
		enableTitle,
		titleColor,
		titleSize,
		titleSizeType,
		titleLineHeight,
		titleLineType,
		titleLetterSpacing,
		titleTypography,
		titleGoogleFont,
		titleLoadGoogleFont,
		titleFontSubset,
		titleFontVariant,
		titleFontWeight,
		titleFontStyle,
		titlePadding,
		titleBorder,
		titleBorderColor,
		titleCollapseBorderColor,
		titleTextTransform,
		contentColor,
		contentHoverColor,
		contentSize,
		contentSizeType,
		contentLineHeight,
		contentLineType,
		contentLetterSpacing,
		contentTypography,
		contentGoogleFont,
		contentLoadGoogleFont,
		contentFontSubset,
		contentFontVariant,
		contentFontWeight,
		contentFontStyle,
		contentMargin,
		contentTextTransform,
		containerPadding,
		tabletContainerPadding,
		mobileContainerPadding,
		containerPaddingUnit,
		containerBorder,
		containerBorderColor,
		containerBackground,
		enableToggle,
		startClosed,
		toggleIcon,
		linkStyle,
		borderRadius,
		shadow,
		displayShadow,
		maxWidth,
		tabletMaxWidth,
		mobileMaxWidth,
		maxWidthType,
		smoothScrollOffset,
		enableSmoothScroll,
		containerMobileMargin,
		containerTabletMargin,
		containerMargin,
		enableScrollSpy,
		contentActiveColor,
		enableDynamicSearch,
		enableTitleToggle,
		containerMarginUnit,
		enableTemplateSearch,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderStyle,
		mobileBorderStyle,
		tabletBorderStyle,
		tabletContentMargin,
		mobileContentMargin,
		contentMarginType,
		titleBorderStyle,
		mobileTitleBorderStyle,
		tabletTitleBorderStyle,
		tabletTitlePadding,
		mobileTitlePadding,
		titlePaddingType,
	} = attributes;

	const [activeTab, setActiveTab] = useState('general');
	const [headings, setHeadings] = useState([]);
	const [showContent, setShowContent] = useState(true);

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);
	const marginMouseOver = mouseOverVisualizer();
	const paddingMouseOver = mouseOverVisualizer();
	const titleMouseOver = mouseOverVisualizer();
	const contentMouseOver = mouseOverVisualizer();

	useEffect(() => {
		if (undefined !== startClosed && startClosed) {
			setShowContent(false);
		}
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
		if ('' !== containerBorderColor) {
			tempBorderStyle[0].top[0] = containerBorderColor;
			tempBorderStyle[0].right[0] = containerBorderColor;
			tempBorderStyle[0].bottom[0] = containerBorderColor;
			tempBorderStyle[0].left[0] = containerBorderColor;
			updateBorderStyle = true;
			setAttributes({ containerBorderColor: '' });
		}
		if (
			'' !== containerBorder?.[0] ||
			'' !== containerBorder?.[1] ||
			'' !== containerBorder?.[2] ||
			'' !== containerBorder?.[3]
		) {
			tempBorderStyle[0].top[2] = containerBorder?.[0] || '';
			tempBorderStyle[0].right[2] = containerBorder?.[1] || '';
			tempBorderStyle[0].bottom[2] = containerBorder?.[2] || '';
			tempBorderStyle[0].left[2] = containerBorder?.[3] || '';
			updateBorderStyle = true;
			if ('' === tempBorderStyle[0].top[0]) {
				tempBorderStyle[0].top[0] = 'currentColor';
				tempBorderStyle[0].right[0] = 'currentColor';
				tempBorderStyle[0].bottom[0] = 'currentColor';
				tempBorderStyle[0].left[0] = 'currentColor';
			}
			setAttributes({ containerBorder: ['', '', '', ''] });
		}
		if (updateBorderStyle) {
			setAttributes({ borderStyle: JSON.parse(JSON.stringify(tempBorderStyle)) });
		}
		// Update from old title border settings.
		const tempTitleBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.titleBorderStyle
					? attributes.titleBorderStyle
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
		let updateTitleBorderStyle = false;
		if ('' !== titleBorderColor) {
			tempTitleBorderStyle[0].top[0] = titleBorderColor;
			tempTitleBorderStyle[0].right[0] = titleBorderColor;
			tempTitleBorderStyle[0].bottom[0] = titleBorderColor;
			tempTitleBorderStyle[0].left[0] = titleBorderColor;
			updateTitleBorderStyle = true;
			setAttributes({ titleBorderColor: '' });
		}
		if ('' !== titleBorder?.[0] || '' !== titleBorder?.[1] || '' !== titleBorder?.[2] || '' !== titleBorder?.[3]) {
			tempTitleBorderStyle[0].top[2] = titleBorder?.[0] || '';
			tempTitleBorderStyle[0].right[2] = titleBorder?.[1] || '';
			tempTitleBorderStyle[0].bottom[2] = titleBorder?.[2] || '';
			tempTitleBorderStyle[0].left[2] = titleBorder?.[3] || '';
			updateTitleBorderStyle = true;
			setAttributes({ titleBorder: ['', '', '', ''] });
		}
		if (updateTitleBorderStyle) {
			setAttributes({ titleBorderStyle: tempTitleBorderStyle });
		}
	}, []);

	uniqueIdHelper(props);

	useLayoutEffect(() => {
		let latestHeadings;
		const onlyIncludeCurrentPage = true;
		if (onlyIncludeCurrentPage) {
			const pagesOfContent = postContent.split('<!--nextpage-->');
			latestHeadings = getHeadingsFromContent(pagesOfContent[pageIndex - 1], attributes);
		} else {
			latestHeadings = getHeadingsFromContent(postContent, attributes);
		}
		if (!isEqual(headings, latestHeadings)) {
			setHeadings(latestHeadings);
		}
	}, [isTyping, blockOrder, allowedHeaders]);

	const saveShadow = (value) => {
		const newItems = shadow.map((item, thisIndex) => {
			if (0 === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			shadow: newItems,
		});
	};

	const onToggle = () => {
		if (enableToggle) {
			setShowContent(!showContent);
		}
	};
	const tableOfContentIconSet = [];
	tableOfContentIconSet.arrow = (
		<Fragment>
			<g fill="#444">
				<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z" />
				<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z" />
			</g>
			<g fill="#444">
				<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z" />
				<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z" />
			</g>
		</Fragment>
	);
	tableOfContentIconSet.arrowcircle = (
		<Fragment>
			<circle cx="83.723" cy="50" r="50" fill="#444" />
			<circle cx="322.768" cy="50" r="50" fill="#444" />
			<g fill="#fff">
				<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z" />
				<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z" />
			</g>
			<g fill="#fff">
				<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z" />
				<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z" />
			</g>
		</Fragment>
	);
	tableOfContentIconSet.basic = (
		<Fragment>
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
		</Fragment>
	);
	tableOfContentIconSet.basiccircle = (
		<Fragment>
			<circle cx="83.723" cy="50" r="50" fill="#444" />
			<circle cx="322.768" cy="50" r="50" fill="#444" />
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
		</Fragment>
	);
	tableOfContentIconSet.xclose = (
		<Fragment>
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" />
			<path d="M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z" fill="#444" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
			<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#444" />
		</Fragment>
	);
	tableOfContentIconSet.xclosecircle = (
		<Fragment>
			<circle cx="83.723" cy="50" r="50" fill="#444" />
			<circle cx="322.768" cy="50" r="50" fill="#444" />
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" />
			<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#fff" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
			<path d="M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z" fill="#fff" />
		</Fragment>
	);

	const renderIconSet = (svg) => (
		<svg
			className="accord-icon"
			viewBox="0 0 400 100"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
			fillRule="evenodd"
			clipRule="evenodd"
			strokeLinejoin="round"
			strokeMiterlimit="1.414"
			style={{ fill: '#000000' }}
		>
			{tableOfContentIconSet[svg]}
		</svg>
	);
	const saveAllowedHeaders = (value) => {
		const newUpdate = allowedHeaders.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			allowedHeaders: newUpdate,
		});
	};
	const columnOptions = [
		[
			{
				icon: oneColumnIcon,
				title: __('One Column', 'kadence-blocks'),
				isActive: 1 === columns ? true : false,
				onClick: () => setAttributes({ columns: 1 }),
			},
		],
		[
			{
				icon: twoColumnIcon,
				title: __('Two columns', 'kadence-blocks'),
				isActive: 2 === columns ? true : false,
				onClick: () => setAttributes({ columns: 2 }),
			},
		],
		[
			{
				icon: threeColumnIcon,
				title: __('Three Columns', 'kadence-blocks'),
				isActive: 3 === columns ? true : false,
				onClick: () => setAttributes({ columns: 3 }),
			},
		],
	];
	const columnOptionsIcon = 1 === columns ? oneColumnIcon : twoColumnIcon;
	const listOptions = [
		[
			{
				icon: bulletsIcon,
				title: __('Bullets', 'kadence-blocks'),
				isActive: 'disc' === listStyle ? true : false,
				onClick: () => setAttributes({ listStyle: 'disc' }),
			},
		],
		[
			{
				icon: numberedIcon,
				title: __('Numbered', 'kadence-blocks'),
				isActive: 'numbered' === listStyle ? true : false,
				onClick: () => setAttributes({ listStyle: 'numbered' }),
			},
		],
		[
			{
				icon: noneIcon,
				title: __('None', 'kadence-blocks'),
				isActive: 'none' === listStyle ? true : false,
				onClick: () => setAttributes({ listStyle: 'none' }),
			},
		],
	];
	const listOptionsIcon = 'numbered' === listStyle ? numberedIcon : bulletsIcon;
	const isKadenceT = typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.isKadenceT ? true : false;
	const previewContentSize = getPreviewSize(
		previewDevice,
		undefined !== contentSize && undefined !== contentSize[0] ? contentSize[0] : '',
		undefined !== contentSize && undefined !== contentSize[1] ? contentSize[1] : '',
		undefined !== contentSize && undefined !== contentSize[2] ? contentSize[2] : ''
	);
	const previewContentHeight = getPreviewSize(
		previewDevice,
		undefined !== contentLineHeight && undefined !== contentLineHeight[0] ? contentLineHeight[0] : '',
		undefined !== contentLineHeight && undefined !== contentLineHeight[1] ? contentLineHeight[1] : '',
		undefined !== contentLineHeight && undefined !== contentLineHeight[2] ? contentLineHeight[2] : ''
	);

	const previewTitleSize = getPreviewSize(
		previewDevice,
		undefined !== titleSize?.[0] ? titleSize[0] : '',
		undefined !== titleSize?.[1] ? titleSize[1] : '',
		undefined !== titleSize?.[2] ? titleSize[2] : ''
	);
	const previewTitleHeight = getPreviewSize(
		previewDevice,
		undefined !== titleLineHeight?.[0] ? titleLineHeight[0] : '',
		undefined !== titleLineHeight?.[1] ? titleLineHeight[1] : '',
		undefined !== titleLineHeight?.[2] ? titleLineHeight[2] : ''
	);

	const previewListGap = getPreviewSize(
		previewDevice,
		undefined !== listGap?.[0] ? listGap[0] : '',
		undefined !== listGap?.[1] ? listGap[1] : '',
		undefined !== listGap?.[2] ? listGap[2] : ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== maxWidth ? maxWidth : '',
		undefined !== tabletMaxWidth ? tabletMaxWidth : '',
		undefined !== mobileMaxWidth ? mobileMaxWidth : ''
	);

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== containerMargin?.[0] ? containerMargin[0] : '',
		undefined !== containerTabletMargin?.[0] ? containerTabletMargin[0] : '',
		undefined !== containerMobileMargin?.[0] ? containerMobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== containerMargin?.[1] ? containerMargin[1] : '',
		undefined !== containerTabletMargin?.[1] ? containerTabletMargin[1] : '',
		undefined !== containerMobileMargin?.[1] ? containerMobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== containerMargin?.[2] ? containerMargin[2] : '',
		undefined !== containerTabletMargin?.[2] ? containerTabletMargin[2] : '',
		undefined !== containerMobileMargin?.[2] ? containerMobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== containerMargin?.[3] ? containerMargin[3] : '',
		undefined !== containerTabletMargin?.[3] ? containerTabletMargin[3] : '',
		undefined !== containerMobileMargin?.[3] ? containerMobileMargin[3] : ''
	);
	const previewMarginUnit = containerMarginUnit ? containerMarginUnit : 'px';
	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== containerPadding?.[0] ? containerPadding[0] : '',
		undefined !== tabletContainerPadding?.[0] ? tabletContainerPadding[0] : '',
		undefined !== mobileContainerPadding?.[0] ? mobileContainerPadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== containerPadding?.[1] ? containerPadding[1] : '',
		undefined !== tabletContainerPadding?.[1] ? tabletContainerPadding[1] : '',
		undefined !== mobileContainerPadding?.[1] ? mobileContainerPadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== containerPadding?.[2] ? containerPadding[2] : '',
		undefined !== tabletContainerPadding?.[2] ? tabletContainerPadding[2] : '',
		undefined !== mobileContainerPadding?.[2] ? mobileContainerPadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== containerPadding?.[3] ? containerPadding[3] : '',
		undefined !== tabletContainerPadding?.[3] ? tabletContainerPadding[3] : '',
		undefined !== mobileContainerPadding?.[3] ? mobileContainerPadding[3] : ''
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

	const previewTitlePaddingTop = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[0] ? titlePadding[0] : '',
		undefined !== tabletTitlePadding && undefined !== tabletTitlePadding[0] ? tabletTitlePadding[0] : '',
		undefined !== mobileTitlePadding && undefined !== mobileTitlePadding[0] ? mobileTitlePadding[0] : ''
	);
	const previewTitlePaddingRight = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[1] ? titlePadding[1] : '',
		undefined !== tabletTitlePadding && undefined !== tabletTitlePadding[1] ? tabletTitlePadding[1] : '',
		undefined !== mobileTitlePadding && undefined !== mobileTitlePadding[1] ? mobileTitlePadding[1] : ''
	);
	const previewTitlePaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[2] ? titlePadding[2] : '',
		undefined !== tabletTitlePadding && undefined !== tabletTitlePadding[2] ? tabletTitlePadding[2] : '',
		undefined !== mobileTitlePadding && undefined !== mobileTitlePadding[2] ? mobileTitlePadding[2] : ''
	);
	const previewTitlePaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== titlePadding && undefined !== titlePadding[3] ? titlePadding[3] : '',
		undefined !== tabletTitlePadding && undefined !== tabletTitlePadding[3] ? tabletTitlePadding[3] : '',
		undefined !== mobileTitlePadding && undefined !== mobileTitlePadding[3] ? mobileTitlePadding[3] : ''
	);

	const previewContentMarginTop = getPreviewSize(
		previewDevice,
		undefined !== contentMargin?.[0] ? contentMargin[0] : '',
		undefined !== tabletContentMargin?.[0] ? tabletContentMargin[0] : '',
		undefined !== mobileContentMargin?.[0] ? mobileContentMargin[0] : ''
	);
	const previewContentMarginRight = getPreviewSize(
		previewDevice,
		undefined !== contentMargin?.[1] ? contentMargin[1] : '',
		undefined !== tabletContentMargin?.[1] ? tabletContentMargin[1] : '',
		undefined !== mobileContentMargin?.[1] ? mobileContentMargin[1] : ''
	);
	const previewContentMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== contentMargin?.[2] ? contentMargin[2] : '',
		undefined !== tabletContentMargin?.[2] ? tabletContentMargin[2] : '',
		undefined !== mobileContentMargin?.[2] ? mobileContentMargin[2] : ''
	);
	const previewContentMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== contentMargin?.[3] ? contentMargin[3] : '',
		undefined !== tabletContentMargin?.[3] ? tabletContentMargin[3] : '',
		undefined !== mobileContentMargin?.[3] ? mobileContentMargin[3] : ''
	);

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

	const previewTitleBorderTopStyle = getBorderStyle(
		previewDevice,
		'top',
		titleBorderStyle,
		tabletTitleBorderStyle,
		mobileTitleBorderStyle
	);
	const previewTitleBorderRightStyle = getBorderStyle(
		previewDevice,
		'right',
		titleBorderStyle,
		tabletTitleBorderStyle,
		mobileTitleBorderStyle
	);
	const previewTitleBorderBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		titleBorderStyle,
		tabletTitleBorderStyle,
		mobileTitleBorderStyle
	);
	const previewTitleBorderLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		titleBorderStyle,
		tabletTitleBorderStyle,
		mobileTitleBorderStyle
	);

	const classes = classnames(className, `kb-table-of-content-nav kb-table-of-content-id${uniqueID}`);
	const blockProps = useBlockProps({
		className: classes,
	});
	const renderCSS = (
		<style>
			{`.kb-table-of-content-id${uniqueID} .kb-table-of-content-list li {
					margin-bottom: ${previewListGap ? previewListGap + 'px' : 'auto'};
				}
				.kb-table-of-content-id${uniqueID} .kb-table-of-content-list li .kb-table-of-contents-list-sub {
					margin-top: ${previewListGap ? previewListGap + 'px' : 'auto'};
				}
				.kb-table-of-content-id${uniqueID} .kb-table-of-contents__entry:hover {
					color: ${KadenceColorOutput(contentHoverColor)} !important;
				}
				.kb-table-of-content-id${uniqueID} .kb-table-of-contents-title-wrap.kb-toc-toggle-hidden {
					border-color: ${KadenceColorOutput(titleCollapseBorderColor)} !important;
				}
				.kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-basiccircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-arrowcircle .kb-table-of-contents-icon-trigger:before, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:after, .kb-table-of-content-id${uniqueID} .kb-toggle-icon-style-xclosecircle .kb-table-of-contents-icon-trigger:before {
					background-color: ${KadenceColorOutput(containerBackground)} !important;
				}`}
		</style>
	);
	const blockControls = (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarDropdownMenu
					icon={columns == 3 ? threeColumnIcon : columnOptionsIcon}
					label={__('Select List Columns', 'kadence-blocks')}
					controls={columnOptions}
				/>
			</ToolbarGroup>
			<ToolbarGroup>
				<ToolbarDropdownMenu
					icon={'none' === listStyle ? noneIcon : listOptionsIcon}
					label={__('Select List Style', 'kadence-blocks')}
					controls={listOptions}
				/>
			</ToolbarGroup>
			<CopyPasteAttributes
				attributes={attributes}
				defaultAttributes={metadata.attributes}
				blockSlug={metadata.name}
				onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
			/>
		</BlockControls>
	);
	const inspectorControls = (
		<>
			<KadenceInspectorControls blockSlug={'kadence/tableofcontents'}>
				<InspectorControlTabs
					panelName={'tableofcontents'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Allowed Headers', 'kadence-blocks')}
							initialOpen={true}
							panelName={'allowedHeaders'}
							blockSlug={'kadence/tableofcontents'}
						>
							<ToggleControl
								label={'h1'}
								checked={
									undefined !== allowedHeaders &&
									undefined !== allowedHeaders[0] &&
									undefined !== allowedHeaders[0].h1
										? allowedHeaders[0].h1
										: true
								}
								onChange={(value) => saveAllowedHeaders({ h1: value })}
							/>
							<ToggleControl
								label={'h2'}
								checked={
									undefined !== allowedHeaders &&
									undefined !== allowedHeaders[0] &&
									undefined !== allowedHeaders[0].h2
										? allowedHeaders[0].h2
										: true
								}
								onChange={(value) => saveAllowedHeaders({ h2: value })}
							/>
							<ToggleControl
								label={'h3'}
								checked={
									undefined !== allowedHeaders &&
									undefined !== allowedHeaders[0] &&
									undefined !== allowedHeaders[0].h3
										? allowedHeaders[0].h3
										: true
								}
								onChange={(value) => saveAllowedHeaders({ h3: value })}
							/>
							<ToggleControl
								label={'h4'}
								checked={
									undefined !== allowedHeaders &&
									undefined !== allowedHeaders[0] &&
									undefined !== allowedHeaders[0].h4
										? allowedHeaders[0].h4
										: true
								}
								onChange={(value) => saveAllowedHeaders({ h4: value })}
							/>
							<ToggleControl
								label={'h5'}
								checked={
									undefined !== allowedHeaders &&
									undefined !== allowedHeaders[0] &&
									undefined !== allowedHeaders[0].h5
										? allowedHeaders[0].h5
										: true
								}
								onChange={(value) => saveAllowedHeaders({ h5: value })}
							/>
							<ToggleControl
								label={'h6'}
								checked={
									undefined !== allowedHeaders &&
									undefined !== allowedHeaders[0] &&
									undefined !== allowedHeaders[0].h6
										? allowedHeaders[0].h6
										: true
								}
								onChange={(value) => saveAllowedHeaders({ h6: value })}
							/>
						</KadencePanelBody>

						<Fragment>
							{enableTitle && (
								<KadencePanelBody
									title={__('Collapsible Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'collapsibleSettings'}
									blockSlug={'kadence/tableofcontents'}
								>
									<ToggleControl
										label={__('Enable Collapsible Content', 'kadence-blocks')}
										checked={enableToggle}
										onChange={(value) => setAttributes({ enableToggle: value })}
									/>
									{enableTitle && (
										<Fragment>
											<ToggleControl
												label={__('Start Collapsed', 'kadence-blocks')}
												checked={startClosed}
												onChange={(value) => setAttributes({ startClosed: value })}
											/>
											<h2>{__('Icon Style', 'kadence-blocks')}</h2>
											<KadenceIconPicker
												icons={[
													'arrow',
													'arrowcircle',
													'basic',
													'basiccircle',
													'xclose',
													'xclosecircle',
												]}
												value={toggleIcon}
												onChange={(value) => setAttributes({ toggleIcon: value })}
												renderFunc={renderIconSet}
												theme="dividers"
												showSearch={false}
												placeholder={__('Select Icon Set', 'kadence-blocks')}
											/>
											<ToggleControl
												label={__('Enable title to toggle as well as icon', 'kadence-blocks')}
												checked={enableTitleToggle}
												onChange={(value) => setAttributes({ enableTitleToggle: value })}
											/>
										</Fragment>
									)}
								</KadencePanelBody>
							)}
						</Fragment>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-toc-spacing-settings'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={containerPadding}
								onChange={(value) => setAttributes({ containerPadding: value })}
								tabletValue={tabletContainerPadding}
								onChangeTablet={(value) => setAttributes({ tabletContainerPadding: value })}
								mobileValue={mobileContainerPadding}
								onChangeMobile={(value) => setAttributes({ mobileContainerPadding: value })}
								min={containerPaddingUnit === 'em' || containerPaddingUnit === 'rem' ? -25 : -999}
								max={containerPaddingUnit === 'em' || containerPaddingUnit === 'rem' ? 25 : 999}
								step={containerPaddingUnit === 'em' || containerPaddingUnit === 'rem' ? 0.1 : 1}
								unit={containerPaddingUnit}
								units={['px', 'em', 'rem']}
								onUnit={(value) => setAttributes({ containerPaddingUnit: value })}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={containerMargin}
								onChange={(value) => setAttributes({ containerMargin: value })}
								tabletValue={containerTabletMargin}
								onChangeTablet={(value) => setAttributes({ containerTabletMargin: value })}
								mobileValue={containerMobileMargin}
								onChangeMobile={(value) => setAttributes({ containerMobileMargin: value })}
								min={containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? -25 : -999}
								max={containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 25 : 999}
								step={containerMarginUnit === 'em' || containerMarginUnit === 'rem' ? 0.1 : 1}
								unit={containerMarginUnit}
								units={['px', 'em', 'rem']}
								onUnit={(value) => setAttributes({ containerMarginUnit: value })}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowAuto={true}
							/>
							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								value={maxWidth ? maxWidth : ''}
								onChange={(value) => setAttributes({ maxWidth: value })}
								tabletValue={tabletMaxWidth ? tabletMaxWidth : ''}
								onChangeTablet={(value) => setAttributes({ tabletMaxWidth: value })}
								mobileValue={mobileMaxWidth ? mobileMaxWidth : ''}
								onChangeMobile={(value) => setAttributes({ mobileMaxWidth: value })}
								min={0}
								max={maxWidthType === 'px' ? 2000 : 100}
								step={1}
								unit={maxWidthType ? maxWidthType : 'px'}
								onUnit={(value) => {
									setAttributes({ maxWidthType: value });
								}}
								units={['px', '%', 'vw']}
							/>
						</KadencePanelBody>

						<div className="kt-sidebar-settings-spacer"></div>

						<KadencePanelBody
							title={__('Non static content', 'kadence-blocks')}
							panelName={'nonStaticContent'}
							initialOpen={false}
							blockSlug={'kadence/tableofcontents'}
						>
							<ToggleControl
								label={__('Search for Headings in Non static post content?', 'kadence-blocks')}
								checked={enableDynamicSearch}
								onChange={(value) => setAttributes({ enableDynamicSearch: value })}
							/>
							{isKadenceT && enableDynamicSearch && (
								<ToggleControl
									label={__('Search for Headings in Template?', 'kadence-blocks')}
									help={__(
										'Expands heading search to use dynamic template from elements.',
										'kadence-blocks'
									)}
									checked={enableTemplateSearch}
									onChange={(value) => setAttributes({ enableTemplateSearch: value })}
								/>
							)}
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Scroll Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'scrollSettings'}
							blockSlug={'kadence/tableofcontents'}
						>
							<ToggleControl
								label={__('Enable Smooth Scroll to ID', 'kadence-blocks')}
								checked={enableSmoothScroll}
								onChange={(value) => setAttributes({ enableSmoothScroll: value })}
							/>
							{enableSmoothScroll && (
								<RangeControl
									label={__('Scroll Offset', 'kadence-blocks')}
									value={smoothScrollOffset ? smoothScrollOffset : ''}
									onChange={(value) => setAttributes({ smoothScrollOffset: value })}
									min={0}
									max={400}
									step={1}
								/>
							)}
							<ToggleControl
								label={__(
									'Enable Highlighting Heading when scrolling in active area.',
									'kadence-blocks'
								)}
								checked={enableScrollSpy}
								onChange={(value) => setAttributes({ enableScrollSpy: value })}
							/>
							{enableScrollSpy && (
								<PopColorControl
									label={__('List Items Active Color', 'kadence-blocks')}
									value={contentActiveColor ? contentActiveColor : ''}
									default={''}
									onChange={(value) => setAttributes({ contentActiveColor: value })}
								/>
							)}
						</KadencePanelBody>

						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
						/>
					</>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody
							title={__('Title Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'titleSettings'}
							blockSlug={'kadence/tableofcontents'}
						>
							<ToggleControl
								label={__('Enable Title', 'kadence-blocks')}
								checked={enableTitle}
								onChange={(value) => setAttributes({ enableTitle: value })}
							/>
							{enableTitle && (
								<Fragment>
									<PopColorControl
										label={__('Title Color', 'kadence-blocks')}
										value={titleColor ? titleColor : ''}
										default={''}
										onChange={(value) => setAttributes({ titleColor: value })}
									/>
									<TypographyControls
										fontGroup={'body'}
										fontSize={titleSize}
										onFontSize={(value) => setAttributes({ titleSize: value })}
										fontSizeType={titleSizeType}
										onFontSizeType={(value) => setAttributes({ titleSizeType: value })}
										lineHeight={titleLineHeight}
										onLineHeight={(value) => setAttributes({ titleLineHeight: value })}
										lineHeightType={titleLineType}
										onLineHeightType={(value) => setAttributes({ titleLineType: value })}
										letterSpacing={titleLetterSpacing}
										onLetterSpacing={(value) => setAttributes({ titleLetterSpacing: value })}
										fontFamily={titleTypography}
										onFontFamily={(value) => setAttributes({ titleTypography: value })}
										onFontChange={(select) => {
											setAttributes({
												titleTypography: select.value,
												titleGoogleFont: select.google,
											});
										}}
										googleFont={titleGoogleFont}
										onGoogleFont={(value) => setAttributes({ titleGoogleFont: value })}
										loadGoogleFont={titleLoadGoogleFont}
										onLoadGoogleFont={(value) => setAttributes({ titleLoadGoogleFont: value })}
										fontVariant={titleFontVariant}
										onFontVariant={(value) => setAttributes({ titleFontVariant: value })}
										fontWeight={titleFontWeight}
										onFontWeight={(value) => setAttributes({ titleFontWeight: value })}
										fontStyle={titleFontStyle}
										onFontStyle={(value) => setAttributes({ titleFontStyle: value })}
										fontSubset={titleFontSubset}
										onFontSubset={(value) => setAttributes({ titleFontSubset: value })}
										textTransform={titleTextTransform}
										onTextTransform={(value) => setAttributes({ titleTextTransform: value })}
									/>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={titlePadding}
										onChange={(value) => setAttributes({ titlePadding: value })}
										tabletValue={tabletTitlePadding}
										onChangeTablet={(value) => setAttributes({ mobileTitlePadding: value })}
										mobileValue={mobileTitlePadding}
										onChangeMobile={(value) => setAttributes({ mobileTitlePadding: value })}
										min={titlePaddingType === 'em' || titlePaddingType === 'rem' ? 0 : 0}
										max={titlePaddingType === 'em' || titlePaddingType === 'rem' ? 12 : 999}
										step={titlePaddingType === 'em' || titlePaddingType === 'rem' ? 0.1 : 1}
										unit={titlePaddingType}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ titlePaddingType: value })}
										onMouseOver={titleMouseOver.onMouseOver}
										onMouseOut={titleMouseOver.onMouseOut}
									/>
									<ResponsiveBorderControl
										label={__('Border', 'kadence-blocks')}
										value={titleBorderStyle}
										tabletValue={tabletTitleBorderStyle}
										mobileValue={mobileTitleBorderStyle}
										onChange={(value) => setAttributes({ titleBorderStyle: value })}
										onChangeTablet={(value) => setAttributes({ tabletTitleBorderStyle: value })}
										onChangeMobile={(value) => setAttributes({ mobileTitleBorderStyle: value })}
									/>
								</Fragment>
							)}
						</KadencePanelBody>

						<KadencePanelBody
							title={__('List Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'listSettings'}
							blockSlug={'kadence/tableofcontents'}
						>
							<ResponsiveRangeControls
								label={__('List Item Gap', 'kadence-blocks')}
								value={listGap?.[0] ? listGap[0] : ''}
								mobileValue={listGap?.[2] ? listGap[2] : ''}
								tabletValue={listGap?.[1] ? listGap[1] : ''}
								onChange={(value) =>
									setAttributes({
										listGap: [
											value,
											listGap?.[1] ? listGap[1] : '',
											listGap?.[2] ? listGap[2] : '',
										],
									})
								}
								onChangeTablet={(value) =>
									setAttributes({
										listGap: [
											listGap?.[0] ? listGap[0] : '',
											value,
											listGap?.[2] ? listGap[2] : '',
										],
									})
								}
								onChangeMobile={(value) =>
									setAttributes({
										listGap: [
											listGap?.[0] ? listGap[0] : '',
											listGap?.[1] ? listGap[1] : '',
											value,
										],
									})
								}
								min={0}
								max={60}
								step={1}
								unit={'px'}
								units={['px']}
								showUnit={true}
							/>
							<PopColorControl
								label={__('List Items Color', 'kadence-blocks')}
								swatchLabel={__('Normal Color', 'kadence-blocks')}
								value={contentColor ? contentColor : ''}
								default={''}
								onChange={(value) => setAttributes({ contentColor: value })}
								swatchLabel2={__('Hover Color', 'kadence-blocks')}
								value2={contentHoverColor ? contentHoverColor : ''}
								default2={''}
								onChange2={(value) => setAttributes({ contentHoverColor: value })}
							/>
							<SelectControl
								label={__('List Link Style', 'kadence-blocks')}
								value={linkStyle}
								options={[
									{ value: 'underline', label: __('Underline', 'kadence-blocks') },
									{ value: 'underline_hover', label: __('Underline on Hover', 'kadence-blocks') },
									{ value: 'plain', label: __('No underline', 'kadence-blocks') },
								]}
								onChange={(value) => setAttributes({ linkStyle: value })}
							/>
							<TypographyControls
								fontGroup={'body'}
								fontSize={contentSize}
								onFontSize={(value) => setAttributes({ contentSize: value })}
								fontSizeType={contentSizeType}
								onFontSizeType={(value) => setAttributes({ contentSizeType: value })}
								lineHeight={contentLineHeight}
								onLineHeight={(value) => setAttributes({ contentLineHeight: value })}
								lineHeightType={contentLineType}
								onLineHeightType={(value) => setAttributes({ contentLineType: value })}
								letterSpacing={contentLetterSpacing}
								onLetterSpacing={(value) => setAttributes({ contentLetterSpacing: value })}
								fontFamily={contentTypography}
								onFontFamily={(value) => setAttributes({ contentTypography: value })}
								onFontChange={(select) => {
									setAttributes({
										contentTypography: select.value,
										contentGoogleFont: select.google,
									});
								}}
								googleFont={contentGoogleFont}
								onGoogleFont={(value) => setAttributes({ contentGoogleFont: value })}
								loadGoogleFont={contentLoadGoogleFont}
								onLoadGoogleFont={(value) => setAttributes({ contentLoadGoogleFont: value })}
								fontVariant={contentFontVariant}
								onFontVariant={(value) => setAttributes({ contentFontVariant: value })}
								fontWeight={contentFontWeight}
								onFontWeight={(value) => setAttributes({ contentFontWeight: value })}
								fontStyle={contentFontStyle}
								onFontStyle={(value) => setAttributes({ contentFontStyle: value })}
								fontSubset={contentFontSubset}
								onFontSubset={(value) => setAttributes({ contentFontSubset: value })}
								textTransform={contentTextTransform}
								onTextTransform={(value) => setAttributes({ contentTextTransform: value })}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={contentMargin}
								onChange={(value) => setAttributes({ contentMargin: value })}
								tabletValue={tabletContentMargin}
								onChangeTablet={(value) => setAttributes({ tabletContentMargin: value })}
								mobileValue={mobileContentMargin}
								onChangeMobile={(value) => setAttributes({ mobileContentMargin: value })}
								min={contentMarginType === 'em' || contentMarginType === 'rem' ? -2 : -999}
								max={contentMarginType === 'em' || contentMarginType === 'rem' ? 12 : 999}
								step={contentMarginType === 'em' || contentMarginType === 'rem' ? 0.1 : 1}
								unit={contentMarginType}
								units={['px', 'em', 'rem']}
								onUnit={(value) => setAttributes({ contentMarginType: value })}
								onMouseOver={contentMouseOver.onMouseOver}
								onMouseOut={contentMouseOver.onMouseOut}
								allowAuto={true}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Container Settings', 'kadence-blocks')}
							panelName={'containerSettings'}
							initialOpen={false}
							blockSlug={'kadence/tableofcontents'}
						>
							<PopColorControl
								label={__('Background', 'kadence-blocks')}
								value={containerBackground ? containerBackground : ''}
								default={''}
								onChange={(value) => setAttributes({ containerBackground: value })}
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
								unit={borderRadiusUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
								max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 500}
								step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
								min={0}
								isBorderRadius={true}
								allowEmpty={true}
							/>
							<BoxShadowControl
								label={__('Box Shadow', 'kadence-blocks')}
								enable={undefined !== displayShadow ? displayShadow : false}
								color={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].color
										? shadow[0].color
										: '#000000'
								}
								colorDefault={'#000000'}
								onArrayChange={(color, opacity) => saveShadow({ color, opacity })}
								opacity={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].opacity
										? shadow[0].opacity
										: 0.2
								}
								hOffset={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].hOffset
										? shadow[0].hOffset
										: 0
								}
								vOffset={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].vOffset
										? shadow[0].vOffset
										: 0
								}
								blur={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].blur
										? shadow[0].blur
										: 14
								}
								spread={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].spread
										? shadow[0].spread
										: 0
								}
								inset={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].inset
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
						</KadencePanelBody>
					</>
				)}
			</KadenceInspectorControls>
		</>
	);
	const ListTag = listStyle === 'numbered' ? 'ol' : 'ul';
	// if ( headings.length === 0 || headings[0].content === '' ) {
	// 	return (
	// 		<div className={ classes } >
	// 			{ blockControls }
	// 			{ inspectorControls }
	// 			<Placeholder
	// 				className="kb-table-of-content-wrap"
	// 				icon={ icons.block }
	// 				label={ __( 'Table of Contents', 'kadence-blocks' ) }
	// 				instructions={ __( 'Start adding Heading blocks to create a table of contents.', 'kadence-blocks' ) }
	// 			/>
	// 		</div>
	// 	);
	// }
	return (
		<>
			{renderCSS}
			{blockControls}
			{inspectorControls}
			<nav {...blockProps}>
				<div
					className="kb-table-of-content-wrap"
					style={{
						paddingTop: previewPaddingTop
							? getSpacingOptionOutput(previewPaddingTop, containerPaddingUnit)
							: undefined,
						paddingRight: previewPaddingRight
							? getSpacingOptionOutput(previewPaddingRight, containerPaddingUnit)
							: undefined,
						paddingBottom: previewPaddingBottom
							? getSpacingOptionOutput(previewPaddingBottom, containerPaddingUnit)
							: undefined,
						paddingLeft: previewPaddingLeft
							? getSpacingOptionOutput(previewPaddingLeft, containerPaddingUnit)
							: undefined,
						marginTop: previewMarginTop
							? getSpacingOptionOutput(previewMarginTop, previewMarginUnit)
							: undefined,
						marginRight: previewMarginRight
							? getSpacingOptionOutput(previewMarginRight, previewMarginUnit)
							: undefined,
						marginBottom: previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, previewMarginUnit)
							: undefined,
						marginLeft: previewMarginLeft
							? getSpacingOptionOutput(previewMarginLeft, previewMarginUnit)
							: undefined,
						borderTop: previewBorderTopStyle ? previewBorderTopStyle : undefined,
						borderRight: previewBorderRightStyle ? previewBorderRightStyle : undefined,
						borderBottom: previewBorderBottomStyle ? previewBorderBottomStyle : undefined,
						borderLeft: previewBorderLeftStyle ? previewBorderLeftStyle : undefined,
						backgroundColor: KadenceColorOutput(containerBackground),
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
						boxShadow:
							undefined !== displayShadow &&
							displayShadow &&
							undefined !== shadow &&
							undefined !== shadow[0] &&
							undefined !== shadow[0].color
								? (undefined !== shadow[0].inset && shadow[0].inset ? 'inset ' : '') +
									(undefined !== shadow[0].hOffset ? shadow[0].hOffset : 0) +
									'px ' +
									(undefined !== shadow[0].vOffset ? shadow[0].vOffset : 0) +
									'px ' +
									(undefined !== shadow[0].blur ? shadow[0].blur : 14) +
									'px ' +
									(undefined !== shadow[0].spread ? shadow[0].spread : 0) +
									'px ' +
									KadenceColorOutput(
										undefined !== shadow[0].color ? shadow[0].color : '#000000',
										undefined !== shadow[0].opacity ? shadow[0].opacity : 1
									)
								: undefined,
						maxWidth: previewMaxWidth ? previewMaxWidth + maxWidthType : undefined,
					}}
				>
					{enableTitle && (
						<div
							className={`kb-table-of-contents-title-wrap kb-toggle-icon-style-${
								enableToggle && toggleIcon ? toggleIcon : 'none'
							} kb-toc-toggle-${showContent ? 'active' : 'hidden'}`}
							style={{
								borderTop: previewTitleBorderTopStyle ? previewTitleBorderTopStyle : undefined,
								borderRight: previewTitleBorderRightStyle ? previewTitleBorderRightStyle : undefined,
								borderBottom: previewTitleBorderBottomStyle ? previewTitleBorderBottomStyle : undefined,
								borderLeft: previewTitleBorderLeftStyle ? previewTitleBorderLeftStyle : undefined,
								color: titleColor ? KadenceColorOutput(titleColor) : undefined,
								paddingTop: previewTitlePaddingTop
									? getSpacingOptionOutput(previewTitlePaddingTop, titlePaddingType)
									: undefined,
								paddingRight: previewTitlePaddingRight
									? getSpacingOptionOutput(previewTitlePaddingRight, titlePaddingType)
									: undefined,
								paddingBottom: previewTitlePaddingBottom
									? getSpacingOptionOutput(previewTitlePaddingBottom, titlePaddingType)
									: undefined,
								paddingLeft: previewTitlePaddingLeft
									? getSpacingOptionOutput(previewTitlePaddingLeft, titlePaddingType)
									: undefined,
							}}
						>
							<SpacingVisualizer
								type="inside"
								forceShow={titleMouseOver.isMouseOver}
								spacing={[
									getSpacingOptionOutput(previewTitlePaddingTop, titlePaddingType),
									getSpacingOptionOutput(previewTitlePaddingRight, titlePaddingType),
									getSpacingOptionOutput(previewTitlePaddingBottom, titlePaddingType),
									getSpacingOptionOutput(previewTitlePaddingLeft, titlePaddingType),
								]}
							/>
							{titleGoogleFont && titleTypography && (
								<KadenceWebfontLoader
									typography={[
										{ family: titleTypography, variant: titleFontVariant ? titleFontVariant : '' },
									]}
									clientId={clientId}
									id={'titleTOC'}
								/>
							)}
							<RichText
								tagName="div"
								placeholder={__('Optional Title', 'kadence-blocks')}
								format="string"
								value={title}
								onChange={(value) => {
									setAttributes({ title: value });
								}}
								allowedFormats={applyFilters('kadence.whitelist_richtext_formats', [
									'kadence/insert-dynamic',
									'core/bold',
									'core/italic',
									'core/strikethrough',
									'toolset/inline-field',
								])}
								className={'kb-table-of-contents-title'}
								style={{
									color: 'inherit',
									fontWeight: titleFontWeight,
									fontStyle: titleFontStyle,
									fontSize: previewTitleSize
										? getFontSizeOptionOutput(previewTitleSize, titleSizeType)
										: undefined,
									lineHeight: previewTitleHeight ? previewTitleHeight + titleLineType : undefined,
									letterSpacing: titleLetterSpacing ? titleLetterSpacing + 'px' : undefined,
									textTransform: titleTextTransform ? titleTextTransform : undefined,
									fontFamily: titleTypography ? titleTypography : '',
								}}
								keepPlaceholderOnFocus
							/>
							{enableToggle && (
								<div
									className="kb-table-of-contents-icon-trigger"
									onClick={() => onToggle()}
									role="button"
									tabIndex="0"
									onKeyDown={(event) => {
										const { keyCode } = event;
										if (keyCode === ENTER) {
											onToggle();
										}
									}}
								></div>
							)}
						</div>
					)}
					{headings.length === 0 && (
						<div className="kb-table-of-content-placeholder">
							<p>{__('Start adding Heading blocks to create a table of contents.', 'kadence-blocks')}</p>
						</div>
					)}
					{((enableToggle && showContent) || !enableToggle) && (
						<ListTag
							className={`kb-table-of-content-list kb-table-of-content-list-columns-${columns} kb-table-of-content-list-style-${listStyle} kb-table-of-content-link-style-${linkStyle}`}
							style={{
								color: contentColor ? KadenceColorOutput(contentColor) : undefined,
								fontWeight: contentFontWeight,
								fontStyle: contentFontStyle,
								fontSize: previewContentSize
									? getFontSizeOptionOutput(previewContentSize, contentSizeType)
									: undefined,
								lineHeight: previewContentHeight ? previewContentHeight + contentLineType : undefined,
								letterSpacing: contentLetterSpacing ? contentLetterSpacing + 'px' : undefined,
								textTransform: contentTextTransform ? contentTextTransform : undefined,
								fontFamily: contentTypography ? contentTypography : '',
								marginTop: previewContentMarginTop
									? getSpacingOptionOutput(previewContentMarginTop, contentMarginType)
									: undefined,
								marginRight: previewContentMarginRight
									? getSpacingOptionOutput(previewContentMarginRight, contentMarginType)
									: undefined,
								marginBottom: previewContentMarginBottom
									? getSpacingOptionOutput(previewContentMarginBottom, contentMarginType)
									: undefined,
								marginLeft: previewContentMarginLeft
									? getSpacingOptionOutput(previewContentMarginLeft, contentMarginType)
									: undefined,
							}}
						>
							<SpacingVisualizer
								type="outside"
								forceShow={contentMouseOver.isMouseOver}
								spacing={[
									getSpacingOptionOutput(previewContentMarginTop, contentMarginType),
									getSpacingOptionOutput(previewContentMarginRight, contentMarginType),
									getSpacingOptionOutput(previewContentMarginBottom, contentMarginType),
									getSpacingOptionOutput(previewContentMarginLeft, contentMarginType),
								]}
							/>
							{contentGoogleFont && contentTypography && (
								<KadenceWebfontLoader
									typography={[
										{
											family: contentTypography,
											variant: contentFontVariant ? contentFontVariant : '',
										},
									]}
									clientId={clientId}
									id={'contentTOC'}
								/>
							)}
							{headings.length !== 0 && (
								<TableOfContentsList
									nestedHeadingList={linearToNestedHeadingList(headings)}
									listTag={ListTag}
								/>
							)}
						</ListTag>
					)}
				</div>
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
						marginTop:
							undefined !== previewMarginTop
								? getSpacingOptionOutput(previewMarginTop, previewMarginUnit)
								: undefined,
						marginBottom:
							undefined !== previewMarginBottom
								? getSpacingOptionOutput(previewMarginBottom, previewMarginUnit)
								: undefined,
					}}
					type="inside"
					forceShow={paddingMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewPaddingTop, containerPaddingUnit),
						getSpacingOptionOutput(previewPaddingRight, containerPaddingUnit),
						getSpacingOptionOutput(previewPaddingBottom, containerPaddingUnit),
						getSpacingOptionOutput(previewPaddingLeft, containerPaddingUnit),
					]}
				/>
				<SpacingVisualizer
					type="outsideVertical"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewMarginTop, previewMarginUnit),
						getSpacingOptionOutput(previewMarginRight, previewMarginUnit),
						getSpacingOptionOutput(previewMarginBottom, previewMarginUnit),
						getSpacingOptionOutput(previewMarginLeft, previewMarginUnit),
					]}
				/>
			</nav>
		</>
	);
}
export default compose([
	withSelect((select, ownProps) => {
		const { clientId } = ownProps;
		const { getBlockIndex, getBlockName, getBlockOrder } = select('core/block-editor');
		const postContent = select('core/editor') ? select('core/editor').getEditedPostContent() : '';
		const blockIndex = getBlockIndex(clientId);
		const blockOrder = getBlockOrder();

		// Calculate which page the block will appear in on the front-end by
		// counting how many core/nextpage blocks precede it.
		// Unfortunately, this does not account for <!--nextpage--> tags in
		// other blocks, so in certain edge cases, this will calculate the
		// wrong page number. Thankfully, this issue only affects the editor
		// implementation.
		let page = 1;
		for (let i = 0; i < blockIndex; i++) {
			if (getBlockName(blockOrder[i]) === 'core/nextpage') {
				page++;
			}
		}
		return {
			pageIndex: page,
			postContent,
			blockOrder,
			isTyping: select('core/block-editor').isTyping(),
		};
	}),
])(KadenceTableOfContents);
