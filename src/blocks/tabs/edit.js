/**
 * BLOCK: Kadence Tabs
 */

/**
 * Import Icons
 */
import {
	accordionIcon,
	tabsBoldIcon,
	tabsCenterIcon,
	tabsIcon,
	tabsSimpleIcon,
	tabsVerticalIcon,
	vTabsIcon,
} from '@kadence/icons';

/**
 * Import External
 */
import classnames from 'classnames';
import memoize from 'memize';
import { times, filter, map } from 'lodash';
import {
	KadenceColorOutput,
	showSettings,
	getSpacingOptionOutput,
	getPreviewSize,
	getFontSizeOptionOutput,
	getBorderStyle,
	setBlockDefaults,
	getUniqueId,
	getPostOrFseId,
} from '@kadence/helpers';
import {
	PopColorControl,
	TypographyControls,
	WebfontLoader,
	KadenceIconPicker,
	IconRender,
	KadencePanelBody,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	InspectorControlTabs,
	CopyPasteAttributes,
	SmallResponsiveControl,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
	ResponsiveRangeControls,
} from '@kadence/components';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

import { createBlock } from '@wordpress/blocks';
import { withSelect, withDispatch, useDispatch, useSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { useState, Fragment, useRef, useEffect } from '@wordpress/element';
import {
	InnerBlocks,
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	Dashicon,
	RangeControl,
	ToggleControl,
	SelectControl,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';
import { plusCircle } from '@wordpress/icons';
/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
import Select from 'react-select';

const ALLOWED_BLOCKS = ['kadence/tab'];

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getPanesTemplate = memoize((panes) => {
	return times(panes, (n) => ['kadence/tab', { id: n + 1 }]);
});
/**
 * Build the row edit
 */
function KadenceTabs(props) {
	const {
		attributes,
		clientId,
		className,
		isSelected,
		setAttributes,
		tabsBlock,
		realTabsCount,
		tabsInner,
		resetOrder,
		moveTab,
		insertTab,
		removeTab,
		previewDevice,
	} = props;
	const {
		uniqueID,
		showPresets,
		tabCount,
		blockAlignment,
		mobileLayout,
		currentTab,
		tabletLayout,
		layout,
		innerPadding,
		tabletInnerPadding,
		mobileInnerPadding,
		innerPaddingType,
		minHeight,
		tabletMinHeight,
		mobileMinHeight,
		maxWidth,
		tabletMaxWidth,
		mobileMaxWidth,
		titles,
		titleColor,
		titleColorHover,
		titleColorActive,
		titleBg,
		titleBgHover,
		titleBgActive,
		size,
		sizeType,
		lineType,
		lineHeight,
		tabLineHeight,
		tabSize,
		mobileSize,
		mobileLineHeight,
		letterSpacing,
		titleBorderWidth,
		tabletTitleBorderWidth,
		mobileTitleBorderWidth,
		titleBorderWidthUnit,
		titleBorderControl,
		titleBorder,
		titleBorderHover,
		titleBorderActive,
		typography,
		fontVariant,
		fontWeight,
		fontStyle,
		fontSubset,
		googleFont,
		loadGoogleFont,
		contentBorder,
		contentBorderColor,
		titlePadding,
		tabletTitlePadding,
		mobileTitlePadding,
		titlePaddingUnit,
		titleMargin,
		tabletTitleMargin,
		mobileTitleMargin,
		titleMarginUnit,
		contentBgColor,
		tabAlignment,
		titleBorderRadius,
		tabletTitleBorderRadius,
		mobileTitleBorderRadius,
		titleBorderRadiusUnit,
		iSize,
		tabletISize,
		mobileISize,
		startTab,
		enableSubtitle,
		subtitleFont,
		tabWidth,
		gutter,
		widthType,
		textTransform,
		contentBorderRadius,
		tabletContentBorderRadius,
		mobileContentBorderRadius,
		contentBorderRadiusUnit,
		contentBorderStyles,
		tabletContentBorderStyles,
		mobileContentBorderStyles,
		verticalTabWidth,
		verticalTabWidthUnit,
		linkPaneCollapse,
	} = attributes;

	const [showPreset, setShowPreset] = useState(false);
	const [activeTab, setActiveTab] = useState('general');

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData } = useSelect(
		(select) => {
			return {
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
			};
		},
		[clientId]
	);

	useEffect(() => {
		if (!uniqueID) {
			const blockConfigObject = kadence_blocks_params.configuration
				? JSON.parse(kadence_blocks_params.configuration)
				: [];
			if (
				blockConfigObject['kadence/tabs'] !== undefined &&
				typeof blockConfigObject['kadence/tabs'] === 'object'
			) {
				setBlockDefaults('kadence/tabs', attributes);
			} else {
				setShowPreset(true);
			}
		}

		if (contentBorder[0] !== '' || contentBorder[1] !== '' || contentBorder[2] !== '' || contentBorder[3] !== '') {
			const tmpContentBorderColor = contentBorderColor ? contentBorderColor : '#dee2e6';

			setAttributes({
				contentBorderStyles: [
					{
						top: [tmpContentBorderColor, '', contentBorder[0]],
						right: [tmpContentBorderColor, '', contentBorder[1]],
						bottom: [tmpContentBorderColor, '', contentBorder[2]],
						left: [tmpContentBorderColor, '', contentBorder[3]],
						unit: 'px',
					},
				],
				contentBorder: ['', '', '', ''],
			});
		}

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

	const previewInnerPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== innerPadding ? innerPadding[0] : '',
		undefined !== tabletInnerPadding ? tabletInnerPadding[0] : '',
		undefined !== mobileInnerPadding ? mobileInnerPadding[0] : ''
	);
	const previewInnerPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== innerPadding ? innerPadding[1] : '',
		undefined !== tabletInnerPadding ? tabletInnerPadding[1] : '',
		undefined !== mobileInnerPadding ? mobileInnerPadding[1] : ''
	);
	const previewInnerPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== innerPadding ? innerPadding[2] : '',
		undefined !== tabletInnerPadding ? tabletInnerPadding[2] : '',
		undefined !== mobileInnerPadding ? mobileInnerPadding[2] : ''
	);
	const previewInnerPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== innerPadding ? innerPadding[3] : '',
		undefined !== tabletInnerPadding ? tabletInnerPadding[3] : '',
		undefined !== mobileInnerPadding ? mobileInnerPadding[3] : ''
	);

	const previewSubFontSize = getPreviewSize(
		previewDevice,
		undefined !== subtitleFont[0].size && undefined !== subtitleFont[0].size[0] ? subtitleFont[0].size[0] : '',
		undefined !== subtitleFont[0].size && undefined !== subtitleFont[0].size[1] ? subtitleFont[0].size[1] : '',
		undefined !== subtitleFont[0].size && undefined !== subtitleFont[0].size[2] ? subtitleFont[0].size[2] : ''
	);
	const previewSubLineHeight = getPreviewSize(
		previewDevice,
		undefined !== subtitleFont[0].lineHeight && undefined !== subtitleFont[0].lineHeight[0]
			? subtitleFont[0].lineHeight[0]
			: '',
		undefined !== subtitleFont[0].lineHeight && undefined !== subtitleFont[0].lineHeight[1]
			? subtitleFont[0].lineHeight[1]
			: '',
		undefined !== subtitleFont[0].lineHeight && undefined !== subtitleFont[0].lineHeight[2]
			? subtitleFont[0].lineHeight[2]
			: ''
	);

	const previewFontSize = getPreviewSize(
		previewDevice,
		undefined !== size ? size : '',
		undefined !== tabSize ? tabSize : '',
		undefined !== mobileSize ? mobileSize : ''
	);
	const previewLineHeight = getPreviewSize(
		previewDevice,
		undefined !== lineHeight ? lineHeight : '',
		undefined !== tabLineHeight ? tabLineHeight : '',
		undefined !== mobileLineHeight ? mobileLineHeight : ''
	);

	const previewContentRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== contentBorderRadius?.[0] ? contentBorderRadius[0] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[0] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[0] : ''
	);
	const previewContentRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== contentBorderRadius ? contentBorderRadius[1] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[1] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[1] : ''
	);
	const previewContentRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== contentBorderRadius ? contentBorderRadius[2] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[2] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[2] : ''
	);
	const previewContentRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== contentBorderRadius ? contentBorderRadius[3] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[3] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[3] : ''
	);

	const previewContentBorderTop = getBorderStyle(
		previewDevice,
		'top',
		contentBorderStyles,
		tabletContentBorderStyles,
		mobileContentBorderStyles
	);
	const previewContentBorderRight = getBorderStyle(
		previewDevice,
		'right',
		contentBorderStyles,
		tabletContentBorderStyles,
		mobileContentBorderStyles
	);
	const previewContentBorderBottom = getBorderStyle(
		previewDevice,
		'bottom',
		contentBorderStyles,
		tabletContentBorderStyles,
		mobileContentBorderStyles
	);
	const previewContentBorderLeft = getBorderStyle(
		previewDevice,
		'left',
		contentBorderStyles,
		tabletContentBorderStyles,
		mobileContentBorderStyles
	);

	const previewIconSize = getPreviewSize(previewDevice, iSize, tabletISize, mobileISize);

	const previewTitleRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== titleBorderRadius?.[0] ? titleBorderRadius[0] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[0] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[0] : ''
	);
	const previewTitleRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== titleBorderRadius ? titleBorderRadius[1] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[1] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[1] : ''
	);
	const previewTitleRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== titleBorderRadius ? titleBorderRadius[2] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[2] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[2] : ''
	);
	const previewTitleRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== titleBorderRadius ? titleBorderRadius[3] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[3] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[3] : ''
	);
	const previewTitleMarginTop = getPreviewSize(
		previewDevice,
		titleMargin && undefined !== titleMargin[0] ? titleMargin[0] : '',
		tabletTitleMargin && undefined !== tabletTitleMargin[0] ? tabletTitleMargin[0] : '',
		mobileTitleMargin && undefined !== mobileTitleMargin[0] ? mobileTitleMargin[0] : ''
	);
	const previewTitleMarginRight = getPreviewSize(
		previewDevice,
		titleMargin && undefined !== titleMargin[1] ? titleMargin[1] : '',
		tabletTitleMargin && undefined !== tabletTitleMargin[1] ? tabletTitleMargin[1] : '',
		mobileTitleMargin && undefined !== mobileTitleMargin[1] ? mobileTitleMargin[1] : ''
	);
	const previewTitleMarginBottom = getPreviewSize(
		previewDevice,
		titleMargin && undefined !== titleMargin[2] ? titleMargin[2] : '',
		tabletTitleMargin && undefined !== tabletTitleMargin[2] ? tabletTitleMargin[2] : '',
		mobileTitleMargin && undefined !== mobileTitleMargin[2] ? mobileTitleMargin[2] : ''
	);
	const previewTitleMarginLeft = getPreviewSize(
		previewDevice,
		titleMargin && undefined !== titleMargin[3] ? titleMargin[3] : '',
		tabletTitleMargin && undefined !== tabletTitleMargin[3] ? tabletTitleMargin[3] : '',
		mobileTitleMargin && undefined !== mobileTitleMargin[3] ? mobileTitleMargin[3] : ''
	);
	const previewTitlePaddingTop = getPreviewSize(
		previewDevice,
		titlePadding && undefined !== titlePadding[0] ? titlePadding[0] : '',
		tabletTitlePadding && undefined !== tabletTitlePadding[0] ? tabletTitlePadding[0] : '',
		mobileTitlePadding && undefined !== mobileTitlePadding[0] ? mobileTitlePadding[0] : ''
	);
	const previewTitlePaddingRight = getPreviewSize(
		previewDevice,
		titlePadding && undefined !== titlePadding[1] ? titlePadding[1] : '',
		tabletTitlePadding && undefined !== tabletTitlePadding[1] ? tabletTitlePadding[1] : '',
		mobileTitlePadding && undefined !== mobileTitlePadding[1] ? mobileTitlePadding[1] : ''
	);
	const previewTitlePaddingBottom = getPreviewSize(
		previewDevice,
		titlePadding && undefined !== titlePadding[2] ? titlePadding[2] : '',
		tabletTitlePadding && undefined !== tabletTitlePadding[2] ? tabletTitlePadding[2] : '',
		mobileTitlePadding && undefined !== mobileTitlePadding[2] ? mobileTitlePadding[2] : ''
	);
	const previewTitlePaddingLeft = getPreviewSize(
		previewDevice,
		titlePadding && undefined !== titlePadding[3] ? titlePadding[3] : '',
		tabletTitlePadding && undefined !== tabletTitlePadding[3] ? tabletTitlePadding[3] : '',
		mobileTitlePadding && undefined !== mobileTitlePadding[3] ? mobileTitlePadding[3] : ''
	);
	const previewTitleMarginUnit = titleMarginUnit ? titleMarginUnit : 'px';
	const previewTitlePaddingUnit = titlePaddingUnit ? titlePaddingUnit : 'px';

	const previewTitleBorderWidthTop = getPreviewSize(
		previewDevice,
		undefined !== titleBorderWidth?.[0] ? titleBorderWidth[0] : '',
		undefined !== tabletTitleBorderWidth?.[0] ? tabletTitleBorderWidth[0] : '',
		undefined !== mobileTitleBorderWidth?.[0] ? mobileTitleBorderWidth[0] : ''
	);
	const previewTitleBorderWidthRight = getPreviewSize(
		previewDevice,
		undefined !== titleBorderWidth?.[1] ? titleBorderWidth[1] : '',
		undefined !== tabletTitleBorderWidth?.[1] ? tabletTitleBorderWidth[1] : '',
		undefined !== mobileTitleBorderWidth?.[1] ? mobileTitleBorderWidth[1] : ''
	);
	const previewTitleBorderWidthBottom = getPreviewSize(
		previewDevice,
		undefined !== titleBorderWidth?.[2] ? titleBorderWidth[2] : '',
		undefined !== tabletTitleBorderWidth?.[2] ? tabletTitleBorderWidth[2] : '',
		undefined !== mobileTitleBorderWidth?.[2] ? mobileTitleBorderWidth[2] : ''
	);
	const previewTitleBorderWidthLeft = getPreviewSize(
		previewDevice,
		undefined !== titleBorderWidth?.[3] ? titleBorderWidth[3] : '',
		undefined !== tabletTitleBorderWidth?.[3] ? tabletTitleBorderWidth[3] : '',
		undefined !== mobileTitleBorderWidth?.[3] ? mobileTitleBorderWidth[3] : ''
	);
	const previewMaxWidth = getPreviewSize(previewDevice, maxWidth, tabletMaxWidth, mobileMaxWidth);
	const previewMinHeight = getPreviewSize(previewDevice, minHeight, tabletMinHeight, mobileMinHeight);
	const previewTitleBorderWidthUnit = titleBorderWidthUnit ? titleBorderWidthUnit : 'px';

	const previewTitleBorderRadiusUnit = titleBorderRadiusUnit ? titleBorderRadiusUnit : 'px';

	const previewLayout = getPreviewSize(
		previewDevice,
		undefined !== layout ? layout : 'tabs',
		undefined !== tabletLayout && '' !== tabletLayout && 'inherit' !== tabletLayout ? tabletLayout : '',
		undefined !== mobileLayout && '' !== mobileLayout && 'inherit' !== mobileLayout ? mobileLayout : ''
	);
	const previewTabWidth = getPreviewSize(
		previewDevice,
		tabWidth && tabWidth[0] ? tabWidth[0] : '',
		tabWidth && tabWidth[1] ? tabWidth[1] : '',
		tabWidth && tabWidth[2] ? tabWidth[2] : ''
	);
	const previewVerticalTabWidth = getPreviewSize(
		previewDevice,
		verticalTabWidth && verticalTabWidth[0] ? verticalTabWidth[0] : '',
		verticalTabWidth && verticalTabWidth[1] ? verticalTabWidth[1] : '',
		verticalTabWidth && verticalTabWidth[2] ? verticalTabWidth[2] : ''
	);
	const previewVerticalTabWidthUnit = verticalTabWidthUnit ? verticalTabWidthUnit : 'px';

	const saveArrayUpdate = (value, index) => {
		const newItems = titles.map((item, thisIndex) => {
			if (index === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			titles: newItems,
		});
	};

	const onMove = (oldIndex, newIndex) => {
		const newTitles = [...titles];
		newTitles.splice(newIndex, 1, titles[oldIndex]);
		newTitles.splice(oldIndex, 1, titles[newIndex]);
		setAttributes({ titles: newTitles, currentTab: parseInt(newIndex + 1) });
		if (startTab === oldIndex + 1) {
			setAttributes({ startTab: newIndex + 1 });
		} else if (startTab === newIndex + 1) {
			setAttributes({ startTab: oldIndex + 1 });
		}
		//moveTab( tabsBlock.innerBlocks[ oldIndex ].clientId, newIndex );
		moveTab(oldIndex, newIndex);
		resetOrder();
		setAttributes({ currentTab: parseInt(newIndex + 1) });
	};

	const onMoveForward = (oldIndex) => {
		return () => {
			if (oldIndex === realTabsCount - 1) {
				return;
			}
			onMove(oldIndex, oldIndex + 1);
		};
	};

	const onMoveBack = (oldIndex) => {
		return () => {
			if (oldIndex === 0) {
				return;
			}
			onMove(oldIndex, oldIndex - 1);
		};
	};

	const layoutClass = !layout ? 'tabs' : layout;
	const gconfig = {
		google: {
			families: [typography + (fontVariant ? ':' + fontVariant : '')],
		},
	};
	const sgconfig = {
		google: {
			families: [
				(subtitleFont && subtitleFont[0] && subtitleFont[0].family ? subtitleFont[0].family : '') +
					(subtitleFont && subtitleFont[0] && subtitleFont[0].variant ? ':' + subtitleFont[0].variant : ''),
			],
		},
	};
	const sconfig = subtitleFont && subtitleFont[0] && subtitleFont[0].google ? sgconfig : '';
	const saveSubtitleFont = (value) => {
		let tempSubFont;
		if (undefined === subtitleFont || (undefined !== subtitleFont && undefined === subtitleFont[0])) {
			tempSubFont = [
				{
					size: ['', '', ''],
					sizeType: 'px',
					lineHeight: ['', '', ''],
					lineType: 'px',
					letterSpacing: '',
					textTransform: '',
					family: '',
					google: false,
					style: '',
					weight: '',
					variant: '',
					subset: '',
					loadGoogle: true,
					padding: [0, 0, 0, 0],
					paddingControl: 'linked',
					margin: [0, 0, 0, 0],
					marginControl: 'linked',
				},
			];
		} else {
			tempSubFont = subtitleFont;
		}
		const newUpdate = tempSubFont.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			subtitleFont: newUpdate,
		});
	};
	const startlayoutOptions = [
		{ key: 'skip', name: __('Skip', 'kadence-blocks'), icon: __('Skip', 'kadence-blocks') },
		{ key: 'simple', name: __('Simple', 'kadence-blocks'), icon: tabsSimpleIcon },
		{ key: 'boldbg', name: __('Boldbg', 'kadence-blocks'), icon: tabsBoldIcon },
		{ key: 'center', name: __('Center', 'kadence-blocks'), icon: tabsCenterIcon },
		{ key: 'vertical', name: __('Vertical', 'kadence-blocks'), icon: tabsVerticalIcon },
	];
	const setInitalLayout = (key) => {
		if ('skip' === key) {
		} else if ('simple' === key) {
			setAttributes({
				layout: 'tabs',
				tabAlignment: 'left',
				size: 1.1,
				sizeType: 'em',
				lineHeight: 1.4,
				lineType: 'em',
				titleBorderWidth: [1, 1, 0, 1],
				titleBorderRadius: [4, 4, 0, 0],
				titlePadding: [8, 20, 8, 20],
				titleMargin: [0, 8, -1, 0],
				titleColor: 'var(--global-palette5, #444444)',
				titleColorHover: 'var(--global-palette5, #444444)',
				titleColorActive: 'var(--global-palette5, #444444)',
				titleBg: 'var(--global-palette9, #ffffff)',
				titleBgHover: 'var(--global-palette9, #ffffff)',
				titleBgActive: 'var(--global-palette9, #ffffff)',
				titleBorder: 'var(--global-palette7, #eeeeee)',
				titleBorderHover: 'var(--global-palette8, #F7FAFC)',
				titleBorderActive: '#bcbcbc',
				contentBgColor: 'var(--global-palette9, #ffffff)',
				contentBorderStyles: [
					{
						top: ['#bcbcbc', '', 1],
						right: ['#bcbcbc', '', 1],
						bottom: ['#bcbcbc', '', 1],
						left: ['#bcbcbc', '', 1],
						unit: 'px',
					},
				],
			});
		} else if ('boldbg' === key) {
			setAttributes({
				layout: 'tabs',
				tabAlignment: 'left',
				size: 1.1,
				sizeType: 'em',
				lineHeight: 1.4,
				lineType: 'em',
				titleBorderWidth: [0, 0, 0, 0],
				titleBorderRadius: [4, 4, 0, 0],
				titlePadding: [8, 20, 8, 20],
				titleMargin: [0, 8, 0, 0],
				titleColor: 'var(--global-palette4, #2D3748)',
				titleColorHover: 'var(--global-palette3, #1A202C)',
				titleColorActive: '#ffffff',
				titleBg: 'var(--global-palette7, #eeeeee)',
				titleBgHover: 'var(--global-palette8, #F7FAFC)',
				titleBgActive: '#0a6689',
				titleBorder: 'var(--global-palette7, #eeeeee)',
				titleBorderHover: 'var(--global-palette7, #eeeeee)',
				titleBorderActive: 'var(--global-palette7, #eeeeee)',
				contentBgColor: 'var(--global-palette9, #ffffff)',
				contentBorderStyles: [
					{
						top: ['#0a6689', '', 3],
						right: ['#0a6689', '', 0],
						bottom: ['#0a6689', '', 0],
						left: ['#0a6689', '', 0],
						unit: 'px',
					},
				],
			});
		} else if ('center' === key) {
			setAttributes({
				layout: 'tabs',
				tabAlignment: 'center',
				size: 1.1,
				sizeType: 'em',
				lineHeight: 1.4,
				lineType: 'em',
				titleBorderWidth: [0, 0, 4, 0],
				titleBorderRadius: [4, 4, 0, 0],
				titlePadding: [8, 20, 8, 20],
				titleMargin: [0, 8, 0, 0],
				titleColor: 'var(--global-palette5, #444444)',
				titleColorHover: 'var(--global-palette5, #444444)',
				titleColorActive: '#0a6689',
				titleBg: 'var(--global-palette9, #ffffff)',
				titleBgHover: 'var(--global-palette9, #ffffff)',
				titleBgActive: 'var(--global-palette9, #ffffff)',
				titleBorder: 'var(--global-palette9, #ffffff)',
				titleBorderHover: 'var(--global-palette7, #eeeeee)',
				titleBorderActive: '#0a6689',
				contentBgColor: 'var(--global-palette9, #ffffff)',
				contentBorderStyles: [
					{
						top: ['var(--global-palette7, #eeeeee)', '', 1],
						right: ['var(--global-palette7, #eeeeee)', '', 0],
						bottom: ['var(--global-palette7, #eeeeee)', '', 0],
						left: ['var(--global-palette7, #eeeeee)', '', 0],
						unit: 'px',
					},
				],
			});
		} else if ('vertical' === key) {
			setAttributes({
				layout: 'vtabs',
				mobileLayout: 'accordion',
				tabAlignment: 'left',
				size: 1.1,
				sizeType: 'em',
				lineHeight: 1.4,
				lineType: 'em',
				titleBorderWidth: [4, 0, 4, 4],
				titleBorderRadius: [10, 0, 0, 10],
				titlePadding: [12, 8, 12, 20],
				titleMargin: [0, -4, 10, 0],
				titleColor: 'var(--global-palette5, #444444)',
				titleColorHover: 'var(--global-palette5, #444444)',
				titleColorActive: 'var(--global-palette5, #444444)',
				titleBg: 'var(--global-palette7, #eeeeee)',
				titleBgHover: 'var(--global-palette8, #F7FAFC)',
				titleBgActive: 'var(--global-palette9, #ffffff)',
				titleBorder: 'var(--global-palette7, #eeeeee)',
				titleBorderHover: 'var(--global-palette8, #F7FAFC)',
				titleBorderActive: 'var(--global-palette7, #eeeeee)',
				contentBgColor: 'var(--global-palette9, #ffffff)',
				contentBorderStyles: [
					{
						top: ['var(--global-palette7, #eeeeee)', '', 4],
						right: ['var(--global-palette7, #eeeeee)', '', 4],
						bottom: ['var(--global-palette7, #eeeeee)', '', 4],
						left: ['var(--global-palette7, #eeeeee)', '', 4],
						unit: 'px',
					},
				],
				minHeight: 400,
			});
		}
	};
	const config = googleFont ? gconfig : '';
	const tabLayoutClass = !tabletLayout ? 'inherit' : tabletLayout;
	const mobileLayoutClass = !mobileLayout ? 'inherit' : mobileLayout;

	const classes = classnames(
		className,
		`wp-block-kadence-tabs kt-tabs-wrap kt-tabs-id${uniqueID} kt-tabs-has-${tabCount}-tabs kt-active-tab-${currentTab} kt-tabs-layout-${layoutClass} kt-tabs-block kt-tabs-tablet-layout-${tabLayoutClass} kt-tabs-mobile-layout-${mobileLayoutClass} kt-tab-alignment-${tabAlignment}`
	);

	const nonTransAttrs = ['currentTab', 'tabCount', 'titles'];

	const isAccordionPreview =
		(previewDevice == 'Tablet' && tabletLayout == 'accordion') ||
		(previewDevice == 'Mobile' && mobileLayout == 'accordion');

	const mLayoutOptions = [
		{ value: 'tabs', label: __('Tabs', 'kadence-blocks'), icon: tabsIcon },
		{ value: 'vtabs', label: __('Vertical Tabs', 'kadence-blocks'), icon: vTabsIcon },
		{ value: 'accordion', label: __('Accordion', 'kadence-blocks'), icon: accordionIcon },
	];
	const layoutOptions = [
		{ value: 'tabs', label: __('Tabs', 'kadence-blocks'), icon: tabsIcon },
		{ value: 'vtabs', label: __('Vertical Tabs', 'kadence-blocks'), icon: vTabsIcon },
	];

	const initialTabOptions = times(titles.length, (n) => {
		return { value: n + 1, label: titles[n].text };
	});

	const mobileControls = (
		<ButtonGroup className={'kb-tab-block-layout-select'} aria-label={__('Mobile Layout', 'kadence-blocks')}>
			{map(mLayoutOptions, ({ label, value, icon }) => (
				<Button
					key={value}
					className="kb-tab-block-layout-item"
					isSmall
					label={label}
					isPrimary={mobileLayout === value}
					aria-pressed={mobileLayout === value}
					onClick={() => setAttributes({ mobileLayout: value })}
				>
					{icon}
				</Button>
			))}
		</ButtonGroup>
	);
	const tabletControls = (
		<ButtonGroup className={'kb-tab-block-layout-select'} aria-label={__('Tablet Layout', 'kadence-blocks')}>
			{map(mLayoutOptions, ({ label, value, icon }) => (
				<Button
					key={value}
					className="kb-tab-block-layout-item"
					isSmall
					label={label}
					isPrimary={tabletLayout === value}
					aria-pressed={tabletLayout === value}
					onClick={() => setAttributes({ tabletLayout: value })}
				>
					{icon}
				</Button>
			))}
		</ButtonGroup>
	);
	const deskControls = (
		<>
			<ButtonGroup className={'kb-tab-block-layout-select'} aria-label={__('Layout', 'kadence-blocks')}>
				{map(layoutOptions, ({ label, value, icon }) => (
					<Button
						key={value}
						className="kb-tab-block-layout-item"
						isPrimary={layout === value}
						aria-pressed={layout === value}
						label={label}
						onClick={() => {
							setAttributes({
								layout: value,
							});
						}}
					>
						{icon}
					</Button>
				))}
			</ButtonGroup>
			<p className="kadence-control-title" style={{ marginTop: '24px', marginBottom: '5px' }}>
				{__('Set initial Open Tab', 'kadence-blocks')}
			</p>
			<Select
				value={initialTabOptions.filter(function (option) {
					return option.value === startTab;
				})}
				onChange={(selection) => {
					setAttributes({ startTab: selection.value });
				}}
				options={initialTabOptions}
				maxMenuHeight={300}
				placeholder={__('Select an initial tab', 'kadence-blocks')}
			/>
		</>
	);

	const saveFontSize = (key, value) => {
		const ucKey = key.charAt(0).toUpperCase() + key.slice(1);

		setAttributes({
			[key]: String(value[0]),
			['tab' + ucKey]: String(value[1]),
			['mobile' + ucKey]: String(value[2]),
		});
	};

	const saveFontAttribute = (key, value) => {
		const ucKey = key.charAt(0).toUpperCase() + key.slice(1);

		setAttributes({
			[key]: value[0],
			['tab' + ucKey]: value[1],
			['mobile' + ucKey]: value[2],
		});
	};

	const renderTitles = (index, isLast = false) => {
		const subFont =
			subtitleFont && subtitleFont[0] && undefined !== subtitleFont[0].sizeType
				? subtitleFont
				: [
						{
							size: ['', '', ''],
							sizeType: 'px',
							lineHeight: ['', '', ''],
							lineType: 'px',
							letterSpacing: '',
							textTransform: '',
							family: '',
							google: false,
							style: '',
							weight: '',
							variant: '',
							subset: '',
							loadGoogle: true,
							padding: [0, 0, 0, 0],
							paddingControl: 'linked',
							margin: [0, 0, 0, 0],
							marginControl: 'linked',
						},
				  ];
		return (
			<Fragment>
				<li
					className={`kt-title-item kt-title-item-${index} kt-tabs-svg-show-${
						titles[index] && titles[index].onlyIcon ? 'only' : 'always'
					} kt-tabs-icon-side-${
						titles[index] && titles[index].iconSide ? titles[index].iconSide : 'right'
					} kt-tabs-has-icon-${titles[index] && titles[index].icon ? 'true' : 'false'} kt-tab-title-${
						1 + index === currentTab ? 'active' : 'inactive'
					}${enableSubtitle ? ' kb-tabs-have-subtitle' : ''}`}
					style={{
						marginTop:
							'' !== previewTitleMarginTop
								? getSpacingOptionOutput(previewTitleMarginTop, previewTitleMarginUnit)
								: '',
						marginRight:
							(isLast && 'vtabs' !== layout) || ('tabs' === layout && widthType === 'percent')
								? '0px'
								: '' !== previewTitleMarginRight
								? getSpacingOptionOutput(previewTitleMarginRight, previewTitleMarginUnit)
								: '',
						marginBottom:
							'' !== previewTitleMarginBottom
								? getSpacingOptionOutput(previewTitleMarginBottom, previewTitleMarginUnit)
								: '',
						marginLeft:
							'tabs' === layout && widthType === 'percent'
								? '0px'
								: '' !== previewTitleMarginLeft
								? getSpacingOptionOutput(previewTitleMarginLeft, previewTitleMarginUnit)
								: '',
					}}
				>
					<div
						className={`kt-tab-title kt-tab-title-${1 + index}`}
						style={{
							backgroundColor: KadenceColorOutput(titleBg),
							color: KadenceColorOutput(titleColor),
							fontSize: previewFontSize ? getFontSizeOptionOutput(previewFontSize, sizeType) : undefined,
							lineHeight: previewLineHeight ? previewLineHeight + lineType : undefined,
							fontWeight,
							fontStyle,
							letterSpacing: letterSpacing + 'px',
							textTransform: textTransform ? textTransform : undefined,
							fontFamily: typography ? typography : '',
							borderTopWidth: previewTitleBorderWidthTop + previewTitleBorderWidthUnit,
							borderRightWidth: previewTitleBorderWidthRight + previewTitleBorderWidthUnit,
							borderBottomWidth: previewTitleBorderWidthBottom + previewTitleBorderWidthUnit,
							borderLeftWidth: previewTitleBorderWidthLeft + previewTitleBorderWidthUnit,
							borderTopLeftRadius: previewTitleRadiusTop + previewTitleBorderRadiusUnit,
							borderTopRightRadius: previewTitleRadiusRight + previewTitleBorderRadiusUnit,
							borderBottomRightRadius: previewTitleRadiusBottom + previewTitleBorderRadiusUnit,
							borderBottomLeftRadius: previewTitleRadiusLeft + previewTitleBorderRadiusUnit,
							paddingTop:
								'' !== previewTitlePaddingTop
									? getSpacingOptionOutput(previewTitlePaddingTop, previewTitlePaddingUnit)
									: undefined,
							paddingRight:
								'' !== previewTitlePaddingRight
									? getSpacingOptionOutput(previewTitlePaddingRight, previewTitlePaddingUnit)
									: undefined,
							paddingBottom:
								'' !== previewTitlePaddingBottom
									? getSpacingOptionOutput(previewTitlePaddingBottom, previewTitlePaddingUnit)
									: undefined,
							paddingLeft:
								'' !== previewTitlePaddingLeft
									? getSpacingOptionOutput(previewTitlePaddingLeft, previewTitlePaddingUnit)
									: undefined,
							borderColor: KadenceColorOutput(titleBorder),
							marginRight: 'tabs' === layout && widthType === 'percent' ? gutter[0] + 'px' : undefined,
						}}
						onClick={() => setAttributes({ currentTab: 1 + index })}
						onKeyPress={() => setAttributes({ currentTab: 1 + index })}
						tabIndex="0"
						role="button"
					>
						{titles[index] && titles[index].icon && 'right' !== titles[index].iconSide && (
							<IconRender
								className={`kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`}
								name={titles[index].icon}
								size={!previewIconSize ? '14' : previewIconSize}
								htmltag="span"
							/>
						)}
						{(undefined === enableSubtitle || !enableSubtitle) && (
							<RichText
								tagName="div"
								placeholder={__('Tab Title', 'kadence-blocks')}
								value={titles[index] && titles[index].text ? titles[index].text : ''}
								unstableOnFocus={() => setAttributes({ currentTab: 1 + index })}
								onChange={(value) => {
									saveArrayUpdate({ text: value }, index);
								}}
								allowedFormats={applyFilters('kadence.whitelist_richtext_formats', [
									'kadence/insert-dynamic',
									'core/bold',
									'core/italic',
									'core/strikethrough',
									'toolset/inline-field',
								])}
								className={'kt-title-text'}
								style={{
									lineHeight: lineHeight + lineType,
								}}
								keepPlaceholderOnFocus
							/>
						)}
						{enableSubtitle && (
							<div className="kb-tab-titles-wrap">
								<RichText
									tagName="div"
									placeholder={__('Tab Title', 'kadence-blocks')}
									value={titles[index] && titles[index].text ? titles[index].text : ''}
									unstableOnFocus={() => setAttributes({ currentTab: 1 + index })}
									onChange={(value) => {
										saveArrayUpdate({ text: value }, index);
									}}
									allowedFormats={applyFilters('kadence.whitelist_richtext_formats', [
										'kadence/insert-dynamic',
										'core/bold',
										'core/italic',
										'core/strikethrough',
										'toolset/inline-field',
									])}
									className={'kt-title-text'}
									style={{
										lineHeight: lineHeight + lineType,
									}}
									keepPlaceholderOnFocus
								/>
								<RichText
									tagName="div"
									placeholder={__('Tab subtitle', 'kadence-blocks')}
									value={
										undefined !== titles[index] && undefined !== titles[index].subText
											? titles[index].subText
											: ''
									}
									unstableOnFocus={() => setAttributes({ currentTab: 1 + index })}
									onChange={(value) => {
										saveArrayUpdate({ subText: value }, index);
									}}
									allowedFormats={applyFilters('kadence.whitelist_richtext_formats', [
										'kadence/insert-dynamic',
										'core/bold',
										'core/italic',
										'core/strikethrough',
										'toolset/inline-field',
									])}
									className={'kt-title-sub-text'}
									style={{
										fontWeight: subFont[0].weight,
										fontStyle: subFont[0].style,
										fontSize: previewSubFontSize
											? getFontSizeOptionOutput(previewSubFontSize, subFont[0].sizeType)
											: undefined,
										lineHeight: previewSubLineHeight
											? previewSubLineHeight + subFont[0].lineType
											: undefined,
										textTransform: subFont[0].textTransform ? subFont[0].textTransform : undefined,
										letterSpacing: subFont[0].letterSpacing + 'px',
										fontFamily: subFont[0].family ? subFont[0].family : '',
										padding: subFont[0].padding
											? subFont[0].padding[0] +
											  'px ' +
											  subFont[0].padding[1] +
											  'px ' +
											  subFont[0].padding[2] +
											  'px ' +
											  subFont[0].padding[3] +
											  'px'
											: '',
										margin: subFont[0].margin
											? subFont[0].margin[0] +
											  'px ' +
											  subFont[0].margin[1] +
											  'px ' +
											  subFont[0].margin[2] +
											  'px ' +
											  subFont[0].margin[3] +
											  'px'
											: '',
									}}
									keepPlaceholderOnFocus
								/>
							</div>
						)}
						{titles[index] && titles[index].icon && 'right' === titles[index].iconSide && (
							<IconRender
								className={`kt-tab-svg-icon kt-tab-svg-icon-${titles[index].icon} kt-title-svg-side-${titles[index].iconSide}`}
								name={titles[index].icon}
								size={!previewIconSize ? '14' : previewIconSize}
								htmltag="span"
							/>
						)}
					</div>
					{isSelected && (
						<div className="kadence-blocks-tab-item__control-menu">
							{index !== 0 && (
								<Button
									icon={'vtabs' === layout ? 'arrow-up' : 'arrow-left'}
									onClick={index === 0 ? undefined : onMoveBack(index)}
									className="kadence-blocks-tab-item__move-back"
									label={
										'vtabs' === layout
											? __('Move Item Up', 'kadence-blocks')
											: __('Move Item Back', 'kadence-blocks')
									}
									aria-disabled={index === 0}
									disabled={index === 0}
								/>
							)}
							{index + 1 !== tabCount && (
								<Button
									icon={'vtabs' === layout ? 'arrow-down' : 'arrow-right'}
									onClick={index + 1 === tabCount ? undefined : onMoveForward(index)}
									className="kadence-blocks-tab-item__move-forward"
									label={
										'vtabs' === layout
											? __('Move Item Down', 'kadence-blocks')
											: __('Move Item Forward', 'kadence-blocks')
									}
									aria-disabled={index + 1 === tabCount}
									disabled={index + 1 === tabCount}
								/>
							)}
							{tabCount > 1 && (
								<Button
									icon="no-alt"
									onClick={() => {
										const currentItems = filter(titles, (item, i) => index !== i);
										const newCount = tabCount - 1;
										let newStartTab;
										if (startTab === index + 1) {
											newStartTab = '';
										} else if (startTab > index + 1) {
											newStartTab = startTab - 1;
										} else {
											newStartTab = startTab;
										}
										removeTab(index);
										setAttributes({
											titles: currentItems,
											tabCount: newCount,
											currentTab: index === 0 ? 1 : index,
											startTab: newStartTab,
										});
										resetOrder();
									}}
									className="kadence-blocks-tab-item__remove"
									label={__('Remove Item', 'kadence-blocks')}
									disabled={!currentTab === index + 1}
								/>
							)}
						</div>
					)}
				</li>
			</Fragment>
		);
	};
	const renderPreviewArray = <Fragment>{times(tabCount, (n) => renderTitles(n, tabCount - 1 === n))}</Fragment>;
	const renderAnchorSettings = (index) => {
		return (
			<KadencePanelBody
				title={__('Tab', 'kadence-blocks') + ' ' + (index + 1) + ' ' + __('Anchor', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-tab-anchor-' + index}
			>
				<TextControl
					label={__('HTML Anchor', 'kadence-blocks')}
					help={__('Anchors lets you link directly to a tab.', 'kadence-blocks')}
					value={titles[index] && titles[index].anchor ? titles[index].anchor : ''}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						saveArrayUpdate({ anchor: nextValue }, index);
					}}
				/>
			</KadencePanelBody>
		);
	};
	const renderTitleSettings = (index) => {
		return (
			<KadencePanelBody
				title={__('Tab', 'kadence-blocks') + ' ' + (index + 1) + ' ' + __('Icon', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-tab-icon-' + index}
			>
				<KadenceIconPicker
					value={titles[index] && titles[index].icon ? titles[index].icon : ''}
					allowClear={true}
					onChange={(value) => {
						saveArrayUpdate({ icon: value }, index);
					}}
				/>
				<SelectControl
					label={__('Icon Location', 'kadence-blocks')}
					value={titles[index] && titles[index].iconSide ? titles[index].iconSide : 'right'}
					options={[
						{ value: 'right', label: __('Right', 'kadence-blocks') },
						{ value: 'left', label: __('Left', 'kadence-blocks') },
						{ value: 'top', label: __('Top', 'kadence-blocks') },
					]}
					onChange={(value) => {
						saveArrayUpdate({ iconSide: value }, index);
					}}
				/>
				<ToggleControl
					label={__('Show Only Icon?', 'kadence-blocks')}
					checked={titles[index] && titles[index].onlyIcon ? titles[index].onlyIcon : false}
					onChange={(value) => {
						saveArrayUpdate({ onlyIcon: value }, index);
					}}
				/>
			</KadencePanelBody>
		);
	};
	const normalSettings = (
		<Fragment>
			<PopColorControl
				label={__('Title Color', 'kadence-blocks')}
				value={titleColor ? titleColor : ''}
				default={''}
				onChange={(value) => setAttributes({ titleColor: value })}
			/>
			<PopColorControl
				label={__('Title Background', 'kadence-blocks')}
				value={titleBg ? titleBg : ''}
				default={''}
				onChange={(value) => setAttributes({ titleBg: value })}
			/>
			<PopColorControl
				label={__('Title Border Color', 'kadence-blocks')}
				value={titleBorder ? titleBorder : ''}
				default={''}
				onChange={(value) => setAttributes({ titleBorder: value })}
			/>
		</Fragment>
	);
	const hoverSettings = (
		<Fragment>
			<PopColorControl
				label={__('Hover Color', 'kadence-blocks')}
				value={titleColorHover ? titleColorHover : ''}
				default={''}
				onChange={(value) => setAttributes({ titleColorHover: value })}
			/>
			<PopColorControl
				label={__('Hover Background', 'kadence-blocks')}
				value={titleBgHover ? titleBgHover : ''}
				default={''}
				onChange={(value) => setAttributes({ titleBgHover: value })}
			/>
			<PopColorControl
				label={__('Hover Border Color', 'kadence-blocks')}
				value={titleBorderHover ? titleBorderHover : ''}
				default={''}
				onChange={(value) => setAttributes({ titleBorderHover: value })}
			/>
		</Fragment>
	);
	const activeSettings = (
		<Fragment>
			<PopColorControl
				label={__('Active Color', 'kadence-blocks')}
				value={titleColorActive ? titleColorActive : ''}
				default={''}
				onChange={(value) => setAttributes({ titleColorActive: value })}
			/>
			<PopColorControl
				label={__('Active Background', 'kadence-blocks')}
				value={titleBgActive ? titleBgActive : ''}
				default={'#ffffff'}
				onChange={(value) => setAttributes({ titleBgActive: value })}
			/>
			<PopColorControl
				label={__('Active Border Color', 'kadence-blocks')}
				value={titleBorderActive ? titleBorderActive : ''}
				default={'#dee2e6'}
				onChange={(value) => setAttributes({ titleBorderActive: value })}
			/>
		</Fragment>
	);

	const percentDesktopContent = (
		<Fragment>
			<RangeControl
				label={__('Columns', 'kadence-blocks')}
				value={tabWidth && undefined !== tabWidth[0] ? tabWidth[0] : ''}
				onChange={(value) => setAttributes({ tabWidth: [value, tabWidth[1], tabWidth[2]] })}
				min={1}
				max={8}
				step={1}
			/>
			<RangeControl
				label={__('Gutter', 'kadence-blocks')}
				value={gutter && undefined !== gutter[0] ? gutter[0] : ''}
				onChange={(value) => setAttributes({ gutter: [value, gutter[1], gutter[2]] })}
				min={0}
				max={50}
				step={1}
			/>
		</Fragment>
	);
	const percentTabletContent = (
		<Fragment>
			<RangeControl
				label={__('Tablet Columns', 'kadence-blocks')}
				value={tabWidth && undefined !== tabWidth[1] ? tabWidth[1] : ''}
				onChange={(value) => setAttributes({ tabWidth: [tabWidth[0], value, tabWidth[2]] })}
				min={1}
				max={8}
				step={1}
			/>
			<RangeControl
				label={__('Tablet Gutter', 'kadence-blocks')}
				value={gutter && undefined !== gutter[1] ? gutter[1] : ''}
				onChange={(value) => setAttributes({ gutter: [gutter[0], value, gutter[2]] })}
				min={0}
				max={50}
				step={1}
			/>
		</Fragment>
	);
	const percentMobileContent = (
		<Fragment>
			<RangeControl
				label={__('Mobile Columns', 'kadence-blocks')}
				value={tabWidth && undefined !== tabWidth[2] ? tabWidth[2] : ''}
				onChange={(value) => setAttributes({ tabWidth: [tabWidth[0], tabWidth[1], value] })}
				min={1}
				max={8}
				step={1}
			/>
			<RangeControl
				label={__('Mobile Gutter', 'kadence-blocks')}
				value={gutter && undefined !== gutter[2] ? gutter[2] : ''}
				onChange={(value) => setAttributes({ gutter: [gutter[0], gutter[1], value] })}
				min={0}
				max={50}
				step={1}
			/>
		</Fragment>
	);

	//generate accordion ordering for tab title and content elements
	let accordionOrderStyle = '';
	if (isAccordionPreview) {
		times(tabCount, (n) => {
			const output = `
					.kt-title-item-${n} {
						order: ${2 * n}
					}
					.kt-inner-tab-${n + 1} {
						order: ${2 * n + 1}
					}
				`;
			accordionOrderStyle += output;
		});
	}

	const renderCSS = (
		<style>
			{`.kt-tabs-id${uniqueID} .kt-title-item:hover .kt-tab-title {
					${titleColorHover ? 'color:' + KadenceColorOutput(titleColorHover) + '!important;' : ''}
					${titleBorderHover ? 'border-color:' + KadenceColorOutput(titleBorderHover) + '!important;' : ''}
					${titleBgHover ? 'background-color:' + KadenceColorOutput(titleBgHover) + '!important;' : ''}
				}
				.kt-tabs-id${uniqueID} .kt-title-item.kt-tab-title-active .kt-tab-title, .kt-tabs-id${uniqueID} .kt-title-item.kt-tab-title-active:hover .kt-tab-title {
					${titleColorActive ? 'color:' + KadenceColorOutput(titleColorActive) + '!important;' : ''}
					${titleBorderActive ? 'border-color:' + KadenceColorOutput(titleBorderActive) + '!important;' : ''}
					${titleBgActive ? 'background-color:' + KadenceColorOutput(titleBgActive) + '!important;' : ''}
				}
				.kt-tabs-id${uniqueID} > .kt-tabs-wrap > .kt-tabs-content-wrap > .block-editor-inner-blocks > .block-editor-block-list__layout > [data-tab="${currentTab}"] {
					display: block;
				}
				${accordionOrderStyle}
				`}
		</style>
	);

	const ref = useRef();
	const blockProps = useBlockProps({
		ref,
		className: 'wp-block-kadence-tabs',
	});

	return (
		<div {...blockProps}>
			{renderCSS}
			<BlockControls>
				<BlockAlignmentToolbar
					value={blockAlignment}
					controls={['center', 'wide', 'full']}
					onChange={(value) => setAttributes({ blockAlignment: value })}
				/>
				<AlignmentToolbar
					value={tabAlignment}
					onChange={(nextAlign) => {
						setAttributes({ tabAlignment: nextAlign });
					}}
				/>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				<ToolbarGroup group="add-block">
					<ToolbarButton
						className="kb-icons-add-icon"
						icon={plusCircle}
						onClick={() => {
							const newBlock = createBlock('kadence/tab', { id: tabCount + 1 });
							insertTab(newBlock);
							//wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, clientId );
							const newtabs = titles;
							// Translators: %d is the tab number.
							newtabs.push({
								text: sprintf(__('Tab %d', 'kadence-blocks'), tabCount + 1),
								icon: titles[0].icon,
								iconSide: titles[0].iconSide,
								onlyIcon: titles[0].onlyIcon,
								subText: '',
							});
							setAttributes({ titles: newtabs, tabCount: tabCount + 1 });
							saveArrayUpdate({ iconSide: titles[0].iconSide }, 0);
						}}
						label={__('Add Tab', 'kadence-blocks')}
						showTooltip={true}
					/>
				</ToolbarGroup>
			</BlockControls>
			{showSettings('allSettings', 'kadence/tabs') && (
				<InspectorControls>
					<InspectorControlTabs
						panelName={'tabs'}
						setActiveTab={(value) => setActiveTab(value)}
						activeTab={activeTab}
					/>

					{activeTab === 'general' && (
						<>
							{showSettings('tabLayout', 'kadence/tabs') && (
								<KadencePanelBody panelName={'kb-tab-layout-select'}>
									<SmallResponsiveControl
										label={__('Layout', 'kadence-blocks')}
										desktopChildren={deskControls}
										tabletChildren={tabletControls}
										mobileChildren={mobileControls}
									></SmallResponsiveControl>
									{previewLayout == 'accordion' && (
										<ToggleControl
											label={__('Accordions close when another opens', 'kadence-blocks')}
											checked={linkPaneCollapse}
											onChange={(value) => setAttributes({ linkPaneCollapse: value })}
										/>
									)}
								</KadencePanelBody>
							)}
							{!showSettings('tabLayout', 'kadence/tabs') && (
								<KadencePanelBody panelName={'kb-tab-layout'}>
									<h2>{__('Set Initial Open Tab', 'kadence-blocks')}</h2>
									<ButtonGroup aria-label={__('Initial Open Tab', 'kadence-blocks')}>
										{times(tabCount, (n) => (
											<Button
												key={n + 1}
												className="kt-init-open-tab"
												isSmall
												isPrimary={startTab === n + 1}
												aria-pressed={startTab === n + 1}
												onClick={() => setAttributes({ startTab: n + 1 })}
											>
												{__('Tab') + ' ' + (n + 1)}
											</Button>
										))}
									</ButtonGroup>
								</KadencePanelBody>
							)}
							{showSettings('tabContent', 'kadence/tabs') && (
								<KadencePanelBody
									title={__('Content Settings', 'kadence-blocks')}
									panelName={'kb-tab-content-settings'}
								>
									<PopColorControl
										label={__('Content Background', 'kadence-blocks')}
										value={contentBgColor ? contentBgColor : ''}
										default={''}
										onChange={(value) => setAttributes({ contentBgColor: value })}
									/>

									<ResponsiveBorderControl
										label={__('Border', 'kadence-blocks')}
										value={contentBorderStyles}
										tabletValue={tabletContentBorderStyles}
										mobileValue={mobileContentBorderStyles}
										onChange={(value) => setAttributes({ contentBorderStyles: value })}
										onChangeTablet={(value) => setAttributes({ tabletContentBorderStyles: value })}
										onChangeMobile={(value) => setAttributes({ mobileContentBorderStyles: value })}
									/>
									<ResponsiveMeasurementControls
										label={__('Border Radius', 'kadence-blocks')}
										value={contentBorderRadius}
										tabletValue={tabletContentBorderRadius}
										mobileValue={mobileContentBorderRadius}
										onChange={(value) => setAttributes({ contentBorderRadius: value })}
										onChangeTablet={(value) => setAttributes({ tabletContentBorderRadius: value })}
										onChangeMobile={(value) => setAttributes({ mobileContentBorderRadius: value })}
										min={0}
										max={
											contentBorderRadiusUnit === 'em' || contentBorderRadiusUnit === 'rem'
												? 24
												: 100
										}
										step={
											contentBorderRadiusUnit === 'em' || contentBorderRadiusUnit === 'rem'
												? 0.1
												: 1
										}
										unit={contentBorderRadiusUnit}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => setAttributes({ contentBorderRadiusUnit: value })}
										isBorderRadius={true}
										allowEmpty={true}
									/>
								</KadencePanelBody>
							)}
						</>
					)}

					{activeTab === 'style' && (
						<>
							{showSettings('titleColor', 'kadence/tabs') && (
								<KadencePanelBody
									title={__('Tab Title Color Settings', 'kadence-blocks')}
									panelName={'kb-tab-title-color'}
								>
									<TabPanel
										className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
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
											{
												name: 'active',
												title: __('Active', 'kadence-blocks'),
												className: 'kt-active-tab',
											},
										]}
									>
										{(tab) => {
											let tabout;
											if (tab.name) {
												if ('hover' === tab.name) {
													tabout = hoverSettings;
												} else if ('active' === tab.name) {
													tabout = activeSettings;
												} else {
													tabout = normalSettings;
												}
											}
											return (
												<div className={tab.className} key={tab.className}>
													{tabout}
												</div>
											);
										}}
									</TabPanel>
								</KadencePanelBody>
							)}
							{showSettings('titleSpacing', 'kadence/tabs') && (
								<KadencePanelBody
									title={__('Tab Title Width/Spacing/Border', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-tab-title-spacing'}
								>
									{'vtabs' === previewLayout && (
										<ResponsiveRangeControls
											label={__('Tab Title Width', 'kadence-blocks')}
											value={
												undefined !== verticalTabWidth && undefined !== verticalTabWidth[0]
													? verticalTabWidth[0]
													: ''
											}
											onChange={(value) => {
												setAttributes({
													verticalTabWidth: [
														value,
														undefined !== verticalTabWidth &&
														undefined !== verticalTabWidth[1]
															? verticalTabWidth[1]
															: '',
														undefined !== verticalTabWidth &&
														undefined !== verticalTabWidth[2]
															? verticalTabWidth[2]
															: '',
													],
												});
											}}
											tabletValue={
												undefined !== verticalTabWidth && undefined !== verticalTabWidth[1]
													? verticalTabWidth[1]
													: ''
											}
											onChangeTablet={(value) => {
												setAttributes({
													verticalTabWidth: [
														undefined !== verticalTabWidth &&
														undefined !== verticalTabWidth[0]
															? verticalTabWidth[0]
															: '',
														value,
														undefined !== verticalTabWidth &&
														undefined !== verticalTabWidth[2]
															? verticalTabWidth[2]
															: '',
													],
												});
											}}
											mobileValue={
												undefined !== verticalTabWidth && undefined !== verticalTabWidth[2]
													? verticalTabWidth[2]
													: ''
											}
											onChangeMobile={(value) => {
												setAttributes({
													verticalTabWidth: [
														undefined !== verticalTabWidth &&
														undefined !== verticalTabWidth[0]
															? verticalTabWidth[0]
															: '',
														undefined !== verticalTabWidth &&
														undefined !== verticalTabWidth[1]
															? verticalTabWidth[1]
															: '',
														value,
													],
												});
											}}
											min={0}
											max={verticalTabWidthUnit === 'px' ? 2000 : 100}
											step={1}
											unit={verticalTabWidthUnit ? verticalTabWidthUnit : '%'}
											onUnit={(value) => {
												setAttributes({ verticalTabWidthUnit: value });
											}}
											units={['px', '%', 'vw']}
										/>
									)}
									{'tabs' === layout && (
										<Fragment>
											<h2>{__('Tab Title Width', 'kadence-blocks')}</h2>
											<TabPanel
												className="kt-inspect-tabs kt-hover-tabs"
												activeClass="active-tab"
												initialTabName={widthType}
												onSelect={(value) => {
													if (value !== widthType) {
														setAttributes({ widthType: value });
													}
												}}
												tabs={[
													{
														name: 'normal',
														title: __('Normal', 'kadence-blocks'),
														className: 'kt-normal-tab',
													},
													{
														name: 'percent',
														title: __('% Width', 'kadence-blocks'),
														className: 'kt-hover-tab',
													},
												]}
											>
												{(tab) => {
													let tabout;
													if (tab.name) {
														if ('percent' === tab.name) {
															tabout = (
																<Fragment>
																	<SmallResponsiveControl
																		desktopChildren={percentDesktopContent}
																		tabletChildren={percentTabletContent}
																		mobileChildren={percentMobileContent}
																	></SmallResponsiveControl>

																	<ResponsiveMeasureRangeControl
																		label={__('Title Padding', 'kadence-blocks')}
																		value={titlePadding}
																		onChange={(value) =>
																			setAttributes({ titlePadding: value })
																		}
																		tabletValue={tabletTitlePadding}
																		onChangeTablet={(value) =>
																			setAttributes({ tabletTitlePadding: value })
																		}
																		mobileValue={mobileTitlePadding}
																		onChangeMobile={(value) =>
																			setAttributes({ mobileTitlePadding: value })
																		}
																		min={
																			titlePaddingUnit === 'em' ||
																			titlePaddingUnit === 'rem'
																				? 0
																				: 0
																		}
																		max={
																			titlePaddingUnit === 'em' ||
																			titlePaddingUnit === 'rem'
																				? 12
																				: 999
																		}
																		step={
																			titlePaddingUnit === 'em' ||
																			titlePaddingUnit === 'rem'
																				? 0.1
																				: 1
																		}
																		unit={titlePaddingUnit}
																		units={['px', 'em', 'rem']}
																		onUnit={(value) =>
																			setAttributes({ titlePaddingUnit: value })
																		}
																	/>
																	<ResponsiveMeasureRangeControl
																		label={__('Title Margin', 'kadence-blocks')}
																		value={titleMargin}
																		onChange={(value) =>
																			setAttributes({ titleMargin: value })
																		}
																		tabletValue={tabletTitleMargin}
																		onChangeTablet={(value) =>
																			setAttributes({ tabletTitleMargin: value })
																		}
																		mobileValue={mobileTitleMargin}
																		onChangeMobile={(value) =>
																			setAttributes({ mobileTitleMargin: value })
																		}
																		min={
																			titleMarginUnit === 'em' ||
																			titleMarginUnit === 'rem'
																				? -2
																				: -999
																		}
																		max={
																			titleMarginUnit === 'em' ||
																			titleMarginUnit === 'rem'
																				? 12
																				: 999
																		}
																		step={
																			titleMarginUnit === 'em' ||
																			titleMarginUnit === 'rem'
																				? 0.1
																				: 1
																		}
																		unit={titleMarginUnit}
																		units={['px', 'em', 'rem']}
																		onUnit={(value) =>
																			setAttributes({ titleMarginUnit: value })
																		}
																		allowAuto={true}
																	/>
																	{__(
																		'Left & right title margins are ignored in % width tabs',
																		'kadence-blocks'
																	)}

																	<br />
																	<br />
																</Fragment>
															);
														} else {
															tabout = (
																<Fragment>
																	<ResponsiveMeasureRangeControl
																		label={__('Title Padding', 'kadence-blocks')}
																		value={titlePadding}
																		onChange={(value) =>
																			setAttributes({ titlePadding: value })
																		}
																		tabletValue={tabletTitlePadding}
																		onChangeTablet={(value) =>
																			setAttributes({ tabletTitlePadding: value })
																		}
																		mobileValue={mobileTitlePadding}
																		onChangeMobile={(value) =>
																			setAttributes({ mobileTitlePadding: value })
																		}
																		min={
																			titlePaddingUnit === 'em' ||
																			titlePaddingUnit === 'rem'
																				? -2
																				: -999
																		}
																		max={
																			titlePaddingUnit === 'em' ||
																			titlePaddingUnit === 'rem'
																				? 12
																				: 999
																		}
																		step={
																			titlePaddingUnit === 'em' ||
																			titlePaddingUnit === 'rem'
																				? 0.1
																				: 1
																		}
																		unit={titlePaddingUnit}
																		units={['px', 'em', 'rem']}
																		onUnit={(value) =>
																			setAttributes({ titlePaddingUnit: value })
																		}
																	/>
																	<ResponsiveMeasureRangeControl
																		label={__('Title Margin', 'kadence-blocks')}
																		value={titleMargin}
																		onChange={(value) =>
																			setAttributes({ titleMargin: value })
																		}
																		tabletValue={tabletTitleMargin}
																		onChangeTablet={(value) =>
																			setAttributes({ tabletTitleMargin: value })
																		}
																		mobileValue={mobileTitleMargin}
																		onChangeMobile={(value) =>
																			setAttributes({ mobileTitleMargin: value })
																		}
																		min={
																			titleMarginUnit === 'em' ||
																			titleMarginUnit === 'rem'
																				? -2
																				: -999
																		}
																		max={
																			titleMarginUnit === 'em' ||
																			titleMarginUnit === 'rem'
																				? 12
																				: 999
																		}
																		step={
																			titleMarginUnit === 'em' ||
																			titleMarginUnit === 'rem'
																				? 0.1
																				: 1
																		}
																		unit={titleMarginUnit}
																		units={['px', 'em', 'rem']}
																		onUnit={(value) =>
																			setAttributes({ titleMarginUnit: value })
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
										</Fragment>
									)}
									{'tabs' !== layout && (
										<Fragment>
											<ResponsiveMeasureRangeControl
												label={__('Title Padding', 'kadence-blocks')}
												value={titlePadding}
												onChange={(value) => setAttributes({ titlePadding: value })}
												tabletValue={tabletTitlePadding}
												onChangeTablet={(value) => setAttributes({ tabletTitlePadding: value })}
												mobileValue={mobileTitlePadding}
												onChangeMobile={(value) => setAttributes({ mobileTitlePadding: value })}
												min={titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 0 : 0}
												max={titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 12 : 999}
												step={titlePaddingUnit === 'em' || titlePaddingUnit === 'rem' ? 0.1 : 1}
												unit={titlePaddingUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ titlePaddingUnit: value })}
											/>
											<ResponsiveMeasureRangeControl
												label={__('Title Margin', 'kadence-blocks')}
												value={titleMargin}
												onChange={(value) => setAttributes({ titleMargin: value })}
												tabletValue={tabletTitleMargin}
												onChangeTablet={(value) => setAttributes({ tabletTitleMargin: value })}
												mobileValue={mobileTitleMargin}
												onChangeMobile={(value) => setAttributes({ mobileTitleMargin: value })}
												min={titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? -2 : -999}
												max={titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 12 : 999}
												step={titleMarginUnit === 'em' || titleMarginUnit === 'rem' ? 0.1 : 1}
												unit={titleMarginUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ titleMarginUnit: value })}
												allowAuto={true}
											/>
										</Fragment>
									)}
									<ResponsiveMeasurementControls
										label={__('Title Border Width', 'kadence-blocks')}
										value={titleBorderWidth}
										tabletValue={tabletTitleBorderWidth}
										mobileValue={mobileTitleBorderWidth}
										onChange={(value) => setAttributes({ titleBorderWidth: value })}
										onChangeTablet={(value) => setAttributes({ tabletTitleBorderWidth: value })}
										onChangeMobile={(value) => setAttributes({ mobileTitleBorderWidth: value })}
										min={0}
										max={titleBorderWidthUnit === 'em' || titleBorderWidthUnit === 'rem' ? 24 : 100}
										step={titleBorderWidthUnit === 'em' || titleBorderWidthUnit === 'rem' ? 0.1 : 1}
										unit={titleBorderWidthUnit}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ titleBorderWidthUnit: value })}
										allowEmpty={true}
									/>
									<ResponsiveMeasurementControls
										label={__('Title Border Radius', 'kadence-blocks')}
										value={titleBorderRadius}
										tabletValue={tabletTitleBorderRadius}
										mobileValue={mobileTitleBorderRadius}
										onChange={(value) => setAttributes({ titleBorderRadius: value })}
										onChangeTablet={(value) => setAttributes({ tabletTitleBorderRadius: value })}
										onChangeMobile={(value) => setAttributes({ mobileTitleBorderRadius: value })}
										min={0}
										max={
											titleBorderRadiusUnit === 'em' || titleBorderRadiusUnit === 'rem' ? 24 : 100
										}
										step={
											titleBorderRadiusUnit === 'em' || titleBorderRadiusUnit === 'rem' ? 0.1 : 1
										}
										unit={titleBorderRadiusUnit}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => setAttributes({ titleBorderRadiusUnit: value })}
										isBorderRadius={true}
										allowEmpty={true}
									/>
								</KadencePanelBody>
							)}
							{showSettings('titleFont', 'kadence/tabs') && (
								<KadencePanelBody
									title={__('Tab Title Font Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-tab-title-font'}
								>
									<TypographyControls
										fontGroup={'body'}
										fontSize={[size, tabSize, mobileSize]}
										onFontSize={(value) => saveFontSize('size', value)}
										fontSizeType={sizeType ? sizeType : 'px'}
										onFontSizeType={(value) => setAttributes({ sizeType: value })}
										lineHeight={[lineHeight, tabLineHeight, mobileLineHeight]}
										onLineHeight={(value) => saveFontAttribute('lineHeight', value)}
										lineHeightType={lineType ? lineType : 'px'}
										onLineHeightType={(value) => setAttributes({ lineType: value })}
										fontFamily={typography}
										onFontFamily={(value) => setAttributes({ typography: value })}
										googleFont={googleFont}
										onFontChange={(select) => {
											setAttributes({
												typography: select.value,
												googleFont: select.google,
											});
										}}
										onGoogleFont={(value) => setAttributes({ googleFont: value })}
										loadGoogleFont={loadGoogleFont}
										onLoadGoogleFont={(value) => setAttributes({ loadGoogleFont: value })}
										fontVariant={fontVariant}
										onFontVariant={(value) => setAttributes({ fontVariant: value })}
										fontWeight={fontWeight}
										onFontWeight={(value) => setAttributes({ fontWeight: value })}
										fontStyle={fontStyle}
										onFontStyle={(value) => setAttributes({ fontStyle: value })}
										fontSubset={fontSubset}
										onFontSubset={(value) => setAttributes({ fontSubset: value })}
										textTransform={textTransform}
										onTextTransform={(value) => setAttributes({ textTransform: value })}
										letterSpacing={letterSpacing ? letterSpacing : ''}
										onLetterSpacing={(value) => setAttributes({ letterSpacing: value })}
									/>
								</KadencePanelBody>
							)}
							{showSettings('titleIcon', 'kadence/tabs') && (
								<KadencePanelBody
									title={__('Tab Title Icon Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-tab-title-icon'}
								>
									<ResponsiveRangeControls
										label={__('Icon Size', 'kadence-blocks')}
										value={undefined !== iSize ? iSize : ''}
										onChange={(value) => setAttributes({ iSize: value })}
										tabletValue={undefined !== tabletISize ? tabletISize : ''}
										onChangeTablet={(value) => setAttributes({ tabletISize: value })}
										mobileValue={undefined !== mobileISize ? mobileISize : ''}
										onChangeMobile={(value) => setAttributes({ mobileISize: value })}
										min={2}
										max={120}
										step={1}
										unit={'px'}
										showUnit={true}
										units={['px']}
									/>
									{times(tabCount, (n) => renderTitleSettings(n))}
								</KadencePanelBody>
							)}
							{showSettings('subtitle', 'kadence/tabs') && (
								<KadencePanelBody
									title={__('Tab Subtitle Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-tab-subtitle-settings'}
								>
									<ToggleControl
										label={__('Show Subtitles?', 'kadence-blocks')}
										checked={undefined !== enableSubtitle ? enableSubtitle : false}
										onChange={(value) => {
											setAttributes({ enableSubtitle: value });
										}}
									/>
									{enableSubtitle && (
										<TypographyControls
											fontGroup={'body'}
											fontSize={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].size
													? subtitleFont[0].size
													: ['', '', '']
											}
											onFontSize={(value) => saveSubtitleFont({ size: value })}
											fontSizeType={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].sizeType
													? subtitleFont[0].sizeType
													: 'px'
											}
											onFontSizeType={(value) => saveSubtitleFont({ sizeType: value })}
											lineHeight={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].lineHeight
													? subtitleFont[0].lineHeight
													: ['', '', '']
											}
											onLineHeight={(value) => saveSubtitleFont({ lineHeight: value })}
											lineHeightType={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].lineType
													? subtitleFont[0].lineType
													: 'px'
											}
											onLineHeightType={(value) => saveSubtitleFont({ lineType: value })}
											letterSpacing={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].letterSpacing
													? subtitleFont[0].letterSpacing
													: ''
											}
											onLetterSpacing={(value) => saveSubtitleFont({ letterSpacing: value })}
											fontFamily={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].family
													? subtitleFont[0].family
													: ''
											}
											onFontFamily={(value) => saveSubtitleFont({ family: value })}
											onFontChange={(select) => {
												saveSubtitleFont({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveSubtitleFont(values)}
											googleFont={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].google
													? subtitleFont[0].google
													: false
											}
											onGoogleFont={(value) => saveSubtitleFont({ google: value })}
											loadGoogleFont={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].loadGoogle
													? subtitleFont[0].loadGoogle
													: true
											}
											onLoadGoogleFont={(value) => saveSubtitleFont({ loadGoogle: value })}
											fontVariant={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].variant
													? subtitleFont[0].variant
													: ''
											}
											onFontVariant={(value) => saveSubtitleFont({ variant: value })}
											fontWeight={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].weight
													? subtitleFont[0].weight
													: ''
											}
											onFontWeight={(value) => saveSubtitleFont({ weight: value })}
											fontStyle={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].style
													? subtitleFont[0].style
													: ''
											}
											onFontStyle={(value) => saveSubtitleFont({ style: value })}
											fontSubset={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].subset
													? subtitleFont[0].subset
													: ''
											}
											onFontSubset={(value) => saveSubtitleFont({ subset: value })}
											textTransform={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].textTransform
													? subtitleFont[0].textTransform
													: ''
											}
											onTextTransform={(value) => saveSubtitleFont({ textTransform: value })}
											padding={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].padding
													? subtitleFont[0].padding
													: [0, 0, 0, 0]
											}
											onPadding={(value) => saveSubtitleFont({ padding: value })}
											paddingControl={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].paddingControl
													? subtitleFont[0].paddingControl
													: 'linked'
											}
											onPaddingControl={(value) => saveSubtitleFont({ paddingControl: value })}
											margin={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].margin
													? subtitleFont[0].margin
													: [0, 0, 0, 0]
											}
											onMargin={(value) => saveSubtitleFont({ margin: value })}
											marginControl={
												subtitleFont &&
												undefined !== subtitleFont[0] &&
												undefined !== subtitleFont[0].marginControl
													? subtitleFont[0].marginControl
													: 'linked'
											}
											onMarginControl={(value) => saveSubtitleFont({ marginControl: value })}
										/>
									)}
								</KadencePanelBody>
							)}
							{showSettings('titleAnchor', 'kadence/tabs') && (
								<KadencePanelBody
									title={__('Tab Anchor Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-tab-anchor-settings'}
								>
									{times(tabCount, (n) => renderAnchorSettings(n))}
								</KadencePanelBody>
							)}
						</>
					)}

					{activeTab === 'advanced' && (
						<>
							<KadencePanelBody panelName={'kb-tabs-spacing-settings'}>
								<ResponsiveMeasureRangeControl
									label={__('Padding', 'kadence-blocks')}
									value={innerPadding}
									onChange={(value) => setAttributes({ innerPadding: value })}
									tabletValue={tabletInnerPadding}
									onChangeTablet={(value) => setAttributes({ tabletInnerPadding: value })}
									mobileValue={mobileInnerPadding}
									onChangeMobile={(value) => setAttributes({ mobileInnerPadding: value })}
									min={0}
									max={innerPaddingType === 'em' || innerPaddingType === 'rem' ? 25 : 999}
									step={innerPaddingType === 'em' || innerPaddingType === 'rem' ? 0.1 : 1}
									unit={innerPaddingType}
									units={['px', 'em', 'rem']}
									onUnit={(value) => setAttributes({ innerPaddingType: value })}
								/>

								{showSettings('structure', 'kadence/tabs') && (
									<>
										<ResponsiveRangeControls
											label={__('Content Minimum Height', 'kadence-blocks')}
											value={minHeight}
											onChange={(value) => setAttributes({ minHeight: value })}
											tabletValue={tabletMinHeight}
											onChangeTablet={(value) => setAttributes({ tabletMinHeight: value })}
											mobileValue={mobileMinHeight}
											onChangeMobile={(value) => setAttributes({ mobileMinHeight: value })}
											min={0}
											max={1000}
											step={1}
											unit={'px'}
											showUnit={true}
											units={['px']}
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
											max={2000}
											step={1}
											unit={'px'}
											showUnit={true}
											units={['px']}
										/>
									</>
								)}
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
			<div className={classes}>
				{showPreset && (
					<div className="kt-select-starter-style-tabs">
						<div className="kt-select-starter-style-tabs-title">{__('Select Initial Style', 'kadence-blocks')}</div>
						<ButtonGroup
							className="kt-init-tabs-btn-group"
							aria-label={__('Initial Style', 'kadence-blocks')}
						>
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
					<div
						className="kt-tabs-wrap"
						style={{
							maxWidth: previewMaxWidth + 'px',
						}}
					>
						{/* <div className="kb-add-new-tab-contain">
								<Button
									className="kt-tab-add"
									isPrimary={ true }
									onClick={ () => {
										const newBlock = createBlock( 'kadence/tab', { id: tabCount + 1 } );
										setAttributes( { tabCount: tabCount + 1 } );
										insertTab( newBlock );
										//wp.data.dispatch( 'core/block-editor' ).insertBlock( newBlock, clientId );
										const newtabs = titles;
										newtabs.push( {
											text: sprintf( __( 'Tab %d', 'kadence-blocks' ), tabCount + 1 ),
											icon: titles[ 0 ].icon,
											iconSide: titles[ 0 ].iconSide,
											onlyIcon: titles[ 0 ].onlyIcon,
											subText: '',
										} );
										setAttributes( { titles: newtabs } );
										saveArrayUpdate( { iconSide: titles[ 0 ].iconSide }, 0 );
									} }
								>
									<Dashicon icon="plus" />
									{ __( 'Add Tab', 'kadence-blocks' ) }
								</Button>
							</div> */}
						<ul
							className={`kt-tabs-title-list${
								'tabs' === layout && widthType === 'percent'
									? ' kb-tabs-list-columns kb-tab-title-columns-' + previewTabWidth
									: ''
							}`}
							style={{
								width:
									'vtabs' === previewLayout
										? previewVerticalTabWidth + previewVerticalTabWidthUnit
										: undefined,
								marginRight:
									'tabs' === layout && widthType === 'percent' ? -gutter[0] + 'px' : undefined,
							}}
						>
							{renderPreviewArray}
						</ul>
						{googleFont && <WebfontLoader config={config}></WebfontLoader>}
						{enableSubtitle && subtitleFont && subtitleFont[0] && subtitleFont[0].google && (
							<WebfontLoader config={sconfig}></WebfontLoader>
						)}
						<div
							className="kt-tabs-content-wrap"
							style={{
								paddingTop: getSpacingOptionOutput(previewInnerPaddingTop, innerPaddingType),
								paddingBottom: getSpacingOptionOutput(previewInnerPaddingBottom, innerPaddingType),
								paddingLeft: getSpacingOptionOutput(previewInnerPaddingLeft, innerPaddingType),
								paddingRight: getSpacingOptionOutput(previewInnerPaddingRight, innerPaddingType),
								borderTopLeftRadius: previewContentRadiusTop + contentBorderRadiusUnit,
								borderTopRightRadius: previewContentRadiusRight + contentBorderRadiusUnit,
								borderBottomRightRadius: previewContentRadiusBottom + contentBorderRadiusUnit,
								borderBottomLeftRadius: previewContentRadiusLeft + contentBorderRadiusUnit,
								minHeight: previewMinHeight + 'px',
								backgroundColor: KadenceColorOutput(contentBgColor),
								borderTop: previewContentBorderTop ? previewContentBorderTop : undefined,
								borderRight: previewContentBorderRight ? previewContentBorderRight : undefined,
								borderBottom: previewContentBorderBottom ? previewContentBorderBottom : undefined,
								borderLeft: previewContentBorderLeft ? previewContentBorderLeft : undefined,
							}}
						>
							<InnerBlocks
								template={getPanesTemplate(tabCount)}
								templateLock="all"
								allowedBlocks={ALLOWED_BLOCKS}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
export default compose([
	withSelect((select, ownProps) => {
		const { clientId } = ownProps;
		const { getBlock, getBlockOrder } = select('core/block-editor');
		const block = getBlock(clientId);
		return {
			tabsBlock: block,
			realTabsCount: block.innerBlocks.length,
			tabsInner: getBlockOrder(clientId),
			previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}),
	withDispatch((dispatch, { clientId }, { select }) => {
		const { getBlock, getBlocks } = select('core/block-editor');
		const { moveBlockToPosition, updateBlockAttributes, insertBlock, replaceInnerBlocks } =
			dispatch('core/block-editor');
		const block = getBlock(clientId);
		const innerBlocks = getBlocks(clientId);
		return {
			resetOrder() {
				times(block.innerBlocks.length, (n) => {
					updateBlockAttributes(block.innerBlocks[n].clientId, {
						id: n + 1,
					});
				});
			},
			moveTab(tabId, newIndex) {
				innerBlocks.splice(newIndex, 0, innerBlocks.splice(tabId, 1)[0]);
				replaceInnerBlocks(clientId, innerBlocks);
			},
			insertTab(newBlock) {
				insertBlock(newBlock, parseInt(block.innerBlocks.length), clientId);
			},
			removeTab(tabId) {
				innerBlocks.splice(tabId, 1);
				replaceInnerBlocks(clientId, innerBlocks);
			},
		};
	}),
])(KadenceTabs);
