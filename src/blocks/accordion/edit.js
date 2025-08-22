/**
 * BLOCK: Kadence Accordion
 */

/**
 * Import Icons
 */
import {
	accord1Icon,
	accord2Icon,
	accord3Icon,
	accord4Icon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	topRightIcon,
	topLeftIcon,
	bottomLeftIcon,
	bottomRightIcon,
	rowIcon,
	twoColIcon,
	threeColIcon,
} from '@kadence/icons';

/**
 * Import External
 */
import classnames from 'classnames';
import memoize from 'memize';
import { times, map } from 'lodash';

import {
	PopColorControl,
	TypographyControls,
	MeasurementControls,
	KadencePanelBody,
	ResponsiveBorderControl,
	KadenceWebfontLoader,
	RangeControl,
	KadenceIconPicker,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	CopyPasteAttributes,
	ResponsiveMeasurementControls,
	ColorGroup,
	SmallResponsiveControl,
	KadenceRadioButtons,
	ResponsiveGapSizeControl,
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	showSettings,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	uniqueIdHelper,
	getBorderColor,
	getBorderStyle,
	getGapSizeOptionOutput,
} from '@kadence/helpers';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

import { createBlock } from '@wordpress/blocks';
import { useEffect, useState } from '@wordpress/element';
import {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	useInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';

import { TabPanel, Button, ButtonGroup, ToggleControl, SelectControl } from '@wordpress/components';

import { withSelect, withDispatch, useSelect, useDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

import { plus, reset } from '@wordpress/icons';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

const ALLOWED_BLOCKS = ['kadence/pane'];
/**
 * Returns the layouts configuration for a given number of panes.
 *
 * @param {number} panes Number of panes.
 *
 * @return {Object[]} Panes layout configuration.
 */
const getPanesTemplate = memoize((panes) => {
	return times(panes, (n) => ['kadence/pane', { id: n + 1 }]);
});

/**
 * Build the row edit
 */
function KadenceAccordionComponent(props) {
	const {
		attributes,
		className,
		setAttributes,
		clientId,
		realPaneCount,
		isSelected,
		accordionBlock,
		removePane,
		updatePaneTag,
		insertPane,
		getPreviewDevice,
	} = props;
	const {
		uniqueID,
		paneCount,
		align,
		openPane,
		titleStyles,
		contentPadding,
		contentTabletPadding,
		contentMobilePadding,
		contentPaddingType,
		minHeight,
		maxWidth,
		contentBorder,
		contentBorderColor,
		contentBorderRadius,
		contentBgColor,
		titleAlignment,
		startCollapsed,
		faqSchema,
		linkPaneCollapse,
		showIcon,
		iconStyle,
		iconSide,
		iconColor,
		showPresets,
		titleBorder,
		tabletTitleBorder,
		titleBorderActive,
		mobileTitleBorder,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		titleBorderRadius,
		tabletTitleBorderRadius,
		mobileTitleBorderRadius,
		titleBorderRadiusUnit,
		contentBorderStyle,
		tabletContentBorderStyle,
		mobileContentBorderStyle,
		tabletContentBorderRadius,
		mobileContentBorderRadius,
		contentBorderRadiusUnit,
		textColor,
		linkColor,
		linkHoverColor,
		columnLayout,
		columnGap,
		columnGapUnit,
	} = attributes;

	const [titleTag, setTitleTag] = useState('div');
	const [showPreset, setShowPreset] = useState(false);
	const [activeTab, setActiveTab] = useState('general');

	useEffect(() => {
		// This runs when we switch from desktop to tablet.
		if (!uniqueID) {
			const blockConfigObject = kadence_blocks_params.configuration
				? JSON.parse(kadence_blocks_params.configuration)
				: [];
			if (
				blockConfigObject['kadence/accordion'] !== undefined &&
				typeof blockConfigObject['kadence/accordion'] === 'object'
			) {
				Object.keys(blockConfigObject['kadence/accordion']).map((attribute) => {
					if ('titleTag' === attribute) {
						const accordionBlock = wp.data.select('core/block-editor').getBlocksByClientId(clientId);
						const realPaneCount = accordionBlock[0]
							? accordionBlock[0].innerBlocks.length
							: accordionBlock.innerBlocks.length;
						if (accordionBlock[0]) {
							times(realPaneCount, (n) => {
								wp.data
									.dispatch('core/block-editor')
									.updateBlockAttributes(accordionBlock[0].innerBlocks[n].clientId, {
										titleTag: blockConfigObject['kadence/accordion'][attribute],
									});
							});
						} else {
							times(realPaneCount, (n) => {
								wp.data
									.dispatch('core/block-editor')
									.updateBlockAttributes(accordionBlock.innerBlocks[n].clientId, {
										titleTag: blockConfigObject['kadence/accordion'][attribute],
									});
							});
						}
						setTitleTag(blockConfigObject['kadence/accordion'][attribute]);
					}
				});
			} else {
				setShowPreset(true);
			}
			if (
				blockConfigObject['kadence/pane'] !== undefined &&
				typeof blockConfigObject['kadence/pane'] === 'object'
			) {
				if (blockConfigObject['kadence/pane'].titleTag !== undefined) {
					setTitleTag(blockConfigObject['kadence/pane'].titleTag);
				}
			}
		}

		if (
			accordionBlock &&
			accordionBlock[0] &&
			accordionBlock[0].innerBlocks[0] &&
			accordionBlock[0].innerBlocks[0].attributes &&
			accordionBlock[0].innerBlocks[0].attributes.titleTag
		) {
			setTitleTag(accordionBlock[0].innerBlocks[0].attributes.titleTag);
		}
		if (
			accordionBlock &&
			accordionBlock.innerBlocks[0] &&
			accordionBlock.innerBlocks[0].attributes &&
			accordionBlock.innerBlocks[0].attributes.titleTag
		) {
			setTitleTag(accordionBlock.innerBlocks[0].attributes.titleTag);
		}
		// Update from old border settings.
		const tempContentBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.contentBorderStyle
					? attributes.contentBorderStyle
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
		let updateContentBorderStyle = false;
		if ('' !== contentBorderColor) {
			tempContentBorderStyle[0].top[0] = contentBorderColor;
			tempContentBorderStyle[0].right[0] = contentBorderColor;
			tempContentBorderStyle[0].bottom[0] = contentBorderColor;
			tempContentBorderStyle[0].left[0] = contentBorderColor;
			updateContentBorderStyle = true;
			setAttributes({ contentBorderColor: '' });
		}
		if (
			'' !== contentBorder?.[0] ||
			'' !== contentBorder?.[1] ||
			'' !== contentBorder?.[2] ||
			'' !== contentBorder?.[3]
		) {
			tempContentBorderStyle[0].top[2] = '' !== contentBorder?.[0] ? contentBorder[0] : '';
			tempContentBorderStyle[0].right[2] = '' !== contentBorder?.[1] ? contentBorder[1] : '';
			tempContentBorderStyle[0].bottom[2] = '' !== contentBorder?.[2] ? contentBorder[2] : '';
			tempContentBorderStyle[0].left[2] = '' !== contentBorder?.[3] ? contentBorder[3] : '';
			updateContentBorderStyle = true;
			setAttributes({ contentBorder: ['', '', '', ''] });
		}
		if (updateContentBorderStyle) {
			setAttributes({ contentBorderStyle: tempContentBorderStyle });
		}
		// Update from old border settings.
		const tempBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.titleBorder
					? attributes.titleBorder
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
		// Update from old border settings.
		const tempBorderHoverStyle = JSON.parse(
			JSON.stringify(
				attributes.titleBorderHover
					? attributes.titleBorderHover
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
		// Update from old border settings.
		const tempBorderActiveStyle = JSON.parse(
			JSON.stringify(
				attributes.titleBorderActive
					? attributes.titleBorderActive
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
		let updateTitleStyle = false;
		let updateBorderStyle = false;
		let updateBorderHoverStyle = false;
		let updateBorderActiveStyle = false;
		if (
			undefined !== titleStyles?.[0]?.border?.[0] &&
			('' !== titleStyles?.[0]?.border?.[0] ||
				'' !== titleStyles?.[0]?.border?.[1] ||
				'' !== titleStyles?.[0]?.border?.[2] ||
				'' !== titleStyles?.[0]?.border?.[3])
		) {
			tempBorderStyle[0].top[0] = titleStyles[0].border[0];
			tempBorderStyle[0].right[0] = titleStyles[0].border[1];
			tempBorderStyle[0].bottom[0] = titleStyles[0].border[2];
			tempBorderStyle[0].left[0] = titleStyles[0].border[3];
			updateBorderStyle = true;
			updateTitleStyle = true;
		}
		if (
			undefined !== titleStyles?.[0]?.borderHover?.[0] &&
			('' !== titleStyles?.[0]?.borderHover?.[0] ||
				'' !== titleStyles?.[0]?.borderHover?.[1] ||
				'' !== titleStyles?.[0]?.borderHover?.[2] ||
				'' !== titleStyles?.[0]?.borderHover?.[3])
		) {
			tempBorderHoverStyle[0].top[0] = titleStyles[0].borderHover[0];
			tempBorderHoverStyle[0].right[0] = titleStyles[0].borderHover[1];
			tempBorderHoverStyle[0].bottom[0] = titleStyles[0].borderHover[2];
			tempBorderHoverStyle[0].left[0] = titleStyles[0].borderHover[3];
			updateBorderHoverStyle = true;
			updateTitleStyle = true;
		}
		if (
			undefined !== titleStyles?.[0]?.borderActive?.[0] &&
			('' !== titleStyles?.[0]?.borderActive?.[0] ||
				'' !== titleStyles?.[0]?.borderActive?.[1] ||
				'' !== titleStyles?.[0]?.borderActive?.[2] ||
				'' !== titleStyles?.[0]?.borderActive?.[3])
		) {
			tempBorderActiveStyle[0].top[0] = titleStyles[0].borderActive[0];
			tempBorderActiveStyle[0].right[0] = titleStyles[0].borderActive[1];
			tempBorderActiveStyle[0].bottom[0] = titleStyles[0].borderActive[2];
			tempBorderActiveStyle[0].left[0] = titleStyles[0].borderActive[3];
			updateBorderHoverStyle = true;
			updateTitleStyle = true;
		}
		if (
			undefined !== titleStyles?.[0]?.borderWidth?.[0] &&
			('' !== titleStyles?.[0]?.borderWidth?.[0] ||
				'' !== titleStyles?.[0]?.borderWidth?.[1] ||
				'' !== titleStyles?.[0]?.borderWidth?.[2] ||
				'' !== titleStyles?.[0]?.borderWidth?.[3])
		) {
			tempBorderStyle[0].top[2] = titleStyles[0].borderWidth[0] || '';
			tempBorderStyle[0].right[2] = titleStyles[0].borderWidth[1] || '';
			tempBorderStyle[0].bottom[2] = titleStyles[0].borderWidth[2] || '';
			tempBorderStyle[0].left[2] = titleStyles[0].borderWidth[3] || '';

			tempBorderHoverStyle[0].top[2] = titleStyles[0].borderWidth[0] || '';
			tempBorderHoverStyle[0].right[2] = titleStyles[0].borderWidth[1] || '';
			tempBorderHoverStyle[0].bottom[2] = titleStyles[0].borderWidth[2] || '';
			tempBorderHoverStyle[0].left[2] = titleStyles[0].borderWidth[3] || '';

			tempBorderActiveStyle[0].top[2] = titleStyles[0].borderWidth[0] || '';
			tempBorderActiveStyle[0].right[2] = titleStyles[0].borderWidth[1] || '';
			tempBorderActiveStyle[0].bottom[2] = titleStyles[0].borderWidth[2] || '';
			tempBorderActiveStyle[0].left[2] = titleStyles[0].borderWidth[3] || '';

			updateBorderStyle = true;
			updateBorderHoverStyle = true;
			updateBorderActiveStyle = true;
			updateTitleStyle = true;
		}
		if (updateBorderStyle) {
			setAttributes({ titleBorder: tempBorderStyle });
		}
		if (updateBorderHoverStyle) {
			setAttributes({ titleBorderHover: tempBorderHoverStyle });
		}
		if (updateBorderActiveStyle) {
			setAttributes({ titleBorderActive: tempBorderActiveStyle });
		}
		if (
			'' !== titleStyles[0].borderRadius[0] ||
			'' !== titleStyles[0].borderRadius[1] ||
			'' !== titleStyles[0].borderRadius[2] ||
			'' !== titleStyles[0].borderRadius[3]
		) {
			updateTitleStyle = true;
			setAttributes({
				titleBorderRadius: [
					titleStyles[0].borderRadius[0],
					titleStyles[0].borderRadius[1],
					titleStyles[0].borderRadius[2],
					titleStyles[0].borderRadius[3],
				],
			});
		}
		if (updateTitleStyle) {
			saveTitleStyles({
				borderHover: ['', '', '', ''],
				borderActive: ['', '', '', ''],
				borderWidth: ['', '', '', ''],
				border: ['', '', '', ''],
				borderRadius: ['', '', '', ''],
			});
		}
	}, []);

	uniqueIdHelper(props);

	const startlayoutOptions = [
		{ key: 'skip', name: __('Skip', 'kadence-blocks'), icon: __('Skip', 'kadence-blocks') },
		{ key: 'base', name: __('Base', 'kadence-blocks'), icon: accord1Icon },
		{ key: 'highlight', name: __('Highlight', 'kadence-blocks'), icon: accord2Icon },
		{ key: 'subtle', name: __('Subtle', 'kadence-blocks'), icon: accord3Icon },
		{ key: 'bottom', name: __('Bottom Border', 'kadence-blocks'), icon: accord4Icon },
	];
	const layoutOptions = [
		{ value: 'row', label: __('One Row', 'kadence-blocks'), icon: rowIcon },
		{ value: 'two-column', label: __('Two Columns', 'kadence-blocks'), icon: twoColIcon },
		{ value: 'three-column', label: __('Three Columns', 'kadence-blocks'), icon: threeColIcon },
	];
	const previewPaddingType = undefined !== contentPaddingType ? contentPaddingType : 'px';
	const paddingMin = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0 : 0;
	const paddingMax = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 12 : 999;
	const paddingStep = previewPaddingType === 'em' || previewPaddingType === 'rem' ? 0.1 : 1;
	const previewContentPaddingTop = getPreviewSize(
		getPreviewDevice,
		undefined !== contentPadding && undefined !== contentPadding[0] ? contentPadding[0] : '',
		undefined !== contentTabletPadding && undefined !== contentTabletPadding[0] ? contentTabletPadding[0] : '',
		undefined !== contentMobilePadding && undefined !== contentMobilePadding[0] ? contentMobilePadding[0] : ''
	);
	const previewContentPaddingRight = getPreviewSize(
		getPreviewDevice,
		undefined !== contentPadding && undefined !== contentPadding[1] ? contentPadding[1] : '',
		undefined !== contentTabletPadding && undefined !== contentTabletPadding[1] ? contentTabletPadding[1] : '',
		undefined !== contentMobilePadding && undefined !== contentMobilePadding[1] ? contentMobilePadding[1] : ''
	);
	const previewContentPaddingBottom = getPreviewSize(
		getPreviewDevice,
		undefined !== contentPadding && undefined !== contentPadding[2] ? contentPadding[2] : '',
		undefined !== contentTabletPadding && undefined !== contentTabletPadding[2] ? contentTabletPadding[2] : '',
		undefined !== contentMobilePadding && undefined !== contentMobilePadding[2] ? contentMobilePadding[2] : ''
	);
	const previewContentPaddingLeft = getPreviewSize(
		getPreviewDevice,
		undefined !== contentPadding && undefined !== contentPadding[3] ? contentPadding[3] : '',
		undefined !== contentTabletPadding && undefined !== contentTabletPadding[3] ? contentTabletPadding[3] : '',
		undefined !== contentMobilePadding && undefined !== contentMobilePadding[3] ? contentMobilePadding[3] : ''
	);
	const previewTitlePaddingType =
		undefined !== titleStyles[0].paddingType && '' !== titleStyles[0].paddingType
			? titleStyles[0].paddingType
			: 'px';
	const titlePaddingMin = previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 0 : 0;
	const titlePaddingMax = previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 12 : 999;
	const titlePaddingStep = previewTitlePaddingType === 'em' || previewTitlePaddingType === 'rem' ? 0.1 : 1;
	const previewTitlePaddingTop = getPreviewSize(
		getPreviewDevice,
		undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[0]
			? titleStyles[0].padding[0]
			: '',
		undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[0]
			? titleStyles[0].paddingTablet[0]
			: '',
		undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[0]
			? titleStyles[0].paddingMobile[0]
			: ''
	);
	const previewTitlePaddingRight = getPreviewSize(
		getPreviewDevice,
		undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[1]
			? titleStyles[0].padding[1]
			: '',
		undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[1]
			? titleStyles[0].paddingTablet[1]
			: '',
		undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[1]
			? titleStyles[0].paddingMobile[1]
			: ''
	);
	const previewTitlePaddingBottom = getPreviewSize(
		getPreviewDevice,
		undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[2]
			? titleStyles[0].padding[2]
			: '',
		undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[2]
			? titleStyles[0].paddingTablet[2]
			: '',
		undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[2]
			? titleStyles[0].paddingMobile[2]
			: ''
	);
	const previewTitlePaddingLeft = getPreviewSize(
		getPreviewDevice,
		undefined !== titleStyles[0].padding && undefined !== titleStyles[0].padding[3]
			? titleStyles[0].padding[3]
			: '',
		undefined !== titleStyles[0].paddingTablet && undefined !== titleStyles[0].paddingTablet[3]
			? titleStyles[0].paddingTablet[3]
			: '',
		undefined !== titleStyles[0].paddingMobile && undefined !== titleStyles[0].paddingMobile[3]
			? titleStyles[0].paddingMobile[3]
			: ''
	);

	// Content Border
	const previewContentBorderTop = getBorderStyle(
		getPreviewDevice,
		'top',
		contentBorderStyle,
		tabletContentBorderStyle,
		mobileContentBorderStyle
	);
	const previewContentBorderRight = getBorderStyle(
		getPreviewDevice,
		'right',
		contentBorderStyle,
		tabletContentBorderStyle,
		mobileContentBorderStyle
	);
	const previewContentBorderBottom = getBorderStyle(
		getPreviewDevice,
		'bottom',
		contentBorderStyle,
		tabletContentBorderStyle,
		mobileContentBorderStyle
	);
	const previewContentBorderLeft = getBorderStyle(
		getPreviewDevice,
		'left',
		contentBorderStyle,
		tabletContentBorderStyle,
		mobileContentBorderStyle
	);
	// Border Radius
	const previewContentRadiusTop = getPreviewSize(
		getPreviewDevice,
		undefined !== contentBorderRadius?.[0] ? contentBorderRadius[0] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[0] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[0] : ''
	);
	const previewContentRadiusRight = getPreviewSize(
		getPreviewDevice,
		undefined !== contentBorderRadius ? contentBorderRadius[1] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[1] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[1] : ''
	);
	const previewContentRadiusBottom = getPreviewSize(
		getPreviewDevice,
		undefined !== contentBorderRadius ? contentBorderRadius[2] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[2] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[2] : ''
	);
	const previewContentRadiusLeft = getPreviewSize(
		getPreviewDevice,
		undefined !== contentBorderRadius ? contentBorderRadius[3] : '',
		undefined !== tabletContentBorderRadius ? tabletContentBorderRadius[3] : '',
		undefined !== mobileContentBorderRadius ? mobileContentBorderRadius[3] : ''
	);

	// Title Font size.
	const previewTitleSize = getPreviewSize(
		getPreviewDevice,
		undefined !== titleStyles?.[0]?.size?.[0] ? titleStyles[0].size[0] : '',
		undefined !== titleStyles?.[0]?.size?.[1] ? titleStyles[0].size[1] : '',
		undefined !== titleStyles?.[0]?.size?.[2] ? titleStyles[0].size[2] : ''
	);
	const previewTitleHeight = getPreviewSize(
		getPreviewDevice,
		undefined !== titleStyles?.[0]?.lineHeight?.[0] ? titleStyles[0].lineHeight[0] : '',
		undefined !== titleStyles?.[0]?.lineHeight?.[1] ? titleStyles[0].lineHeight[1] : '',
		undefined !== titleStyles?.[0]?.lineHeight?.[2] ? titleStyles[0].lineHeight[2] : ''
	);
	// Title Border
	const previewTitleBorderTop = getBorderStyle(
		getPreviewDevice,
		'top',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);
	const previewTitleBorderRight = getBorderStyle(
		getPreviewDevice,
		'right',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);
	const previewTitleBorderBottom = getBorderStyle(
		getPreviewDevice,
		'bottom',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);
	const previewTitleBorderLeft = getBorderStyle(
		getPreviewDevice,
		'left',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);
	const previewTitleBorderColorTop = getBorderColor(
		getPreviewDevice,
		'top',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);
	const previewTitleBorderColorRight = getBorderColor(
		getPreviewDevice,
		'right',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);
	const previewTitleBorderColorBottom = getBorderColor(
		getPreviewDevice,
		'bottom',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);
	const previewTitleBorderColorLeft = getBorderColor(
		getPreviewDevice,
		'left',
		titleBorder,
		tabletTitleBorder,
		mobileTitleBorder
	);

	// Title Border Radius
	const previewTitleRadiusTop = getPreviewSize(
		getPreviewDevice,
		undefined !== titleBorderRadius ? titleBorderRadius[0] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[0] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[0] : ''
	);
	const previewTitleRadiusRight = getPreviewSize(
		getPreviewDevice,
		undefined !== titleBorderRadius ? titleBorderRadius[1] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[1] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[1] : ''
	);
	const previewTitleRadiusBottom = getPreviewSize(
		getPreviewDevice,
		undefined !== titleBorderRadius ? titleBorderRadius[2] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[2] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[2] : ''
	);
	const previewTitleRadiusLeft = getPreviewSize(
		getPreviewDevice,
		undefined !== titleBorderRadius ? titleBorderRadius[3] : '',
		undefined !== tabletTitleBorderRadius ? tabletTitleBorderRadius[3] : '',
		undefined !== mobileTitleBorderRadius ? mobileTitleBorderRadius[3] : ''
	);
	const layoutPreview = getPreviewSize(
		getPreviewDevice,
		columnLayout?.[0] ? columnLayout[0] : 'row',
		columnLayout?.[1] ? columnLayout[1] : '',
		columnLayout?.[2] ? columnLayout[2] : 'row'
	);
	const hasColumns = layoutPreview && layoutPreview !== 'row' ? true : false;
	const previewGap = getPreviewSize(
		getPreviewDevice,
		columnGap?.[0] ? columnGap[0] : 'md',
		columnGap?.[1] ? columnGap[1] : '',
		columnGap?.[2] ? columnGap[2] : ''
	);
	const inheritBorder = [titleBorder, tabletTitleBorder, mobileTitleBorder];

	// Title Hover Border
	const previewTitleBorderHoverTop = getBorderStyle(
		getPreviewDevice,
		'top',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);
	const previewTitleBorderHoverRight = getBorderStyle(
		getPreviewDevice,
		'right',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);
	const previewTitleBorderHoverBottom = getBorderStyle(
		getPreviewDevice,
		'bottom',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);
	const previewTitleBorderHoverLeft = getBorderStyle(
		getPreviewDevice,
		'left',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);
	const previewTitleBorderColorHoverTop = getBorderColor(
		getPreviewDevice,
		'top',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);
	const previewTitleBorderColorHoverRight = getBorderColor(
		getPreviewDevice,
		'right',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);
	const previewTitleBorderColorHoverBottom = getBorderColor(
		getPreviewDevice,
		'bottom',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);
	const previewTitleBorderColorHoverLeft = getBorderColor(
		getPreviewDevice,
		'left',
		titleBorderHover,
		tabletTitleBorderHover,
		mobileTitleBorderHover,
		inheritBorder
	);

	// Title Active Border
	const previewTitleBorderActiveTop = getBorderStyle(
		getPreviewDevice,
		'top',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);
	const previewTitleBorderActiveRight = getBorderStyle(
		getPreviewDevice,
		'right',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);
	const previewTitleBorderActiveBottom = getBorderStyle(
		getPreviewDevice,
		'bottom',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);
	const previewTitleBorderActiveLeft = getBorderStyle(
		getPreviewDevice,
		'left',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);
	const previewTitleBorderColorActiveTop = getBorderColor(
		getPreviewDevice,
		'top',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);
	const previewTitleBorderColorActiveRight = getBorderColor(
		getPreviewDevice,
		'right',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);
	const previewTitleBorderColorActiveBottom = getBorderColor(
		getPreviewDevice,
		'bottom',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);
	const previewTitleBorderColorActiveLeft = getBorderColor(
		getPreviewDevice,
		'left',
		titleBorderActive,
		tabletTitleBorderActive,
		mobileTitleBorderActive,
		inheritBorder
	);

	const setInitalLayout = (key) => {
		if ('skip' === key) {
		} else if ('base' === key) {
			setAttributes({
				contentBorderStyle: [
					{
						top: ['', '', 0],
						right: ['', '', 0],
						bottom: ['', '', 0],
						left: ['', '', 0],
						unit: 'px',
					},
				],
				titleAlignment: 'left',
				showIcon: true,
				iconStyle: 'basic',
				iconSide: 'right',
				titleStyles: [
					{
						size: titleStyles[0].size,
						sizeType: titleStyles[0].sizeType,
						lineHeight: titleStyles[0].lineHeight,
						lineType: titleStyles[0].lineType,
						letterSpacing: titleStyles[0].letterSpacing,
						family: titleStyles[0].family,
						google: titleStyles[0].google,
						style: titleStyles[0].style,
						weight: titleStyles[0].weight,
						variant: titleStyles[0].variant,
						subset: titleStyles[0].subset,
						loadGoogle: titleStyles[0].loadGoogle,
						padding: [10, 14, 10, 14],
						marginTop: 0,
						color: '#555555',
						background: '#f2f2f2',
						border: ['', '', '', ''],
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						colorHover: '#444444',
						backgroundHover: '#eeeeee',
						borderHover: ['', '', '', ''],
						colorActive: '#ffffff',
						backgroundActive: '#444444',
						borderActive: ['', '', '', ''],
						textTransform: titleStyles[0].textTransform,
					},
				],
				titleBorderRadius: [0, 0, 0, 0],
				titleBorder: [
					{
						top: ['#f2f2f2', '', 0],
						right: ['#f2f2f2', '', 0],
						bottom: ['#f2f2f2', '', 0],
						left: ['#f2f2f2', '', 0],
						unit: 'px',
					},
				],
				titleBorderHover: [
					{
						top: ['#eeeeee', '', ''],
						right: ['#eeeeee', '', ''],
						bottom: ['#eeeeee', '', ''],
						left: ['#eeeeee', '', ''],
						unit: 'px',
					},
				],
				titleBorderActive: [
					{
						top: ['#444444', '', ''],
						right: ['#444444', '', ''],
						bottom: ['#444444', '', ''],
						left: ['#444444', '', ''],
						unit: 'px',
					},
				],
			});
		} else if ('highlight' === key) {
			setAttributes({
				contentBorderStyle: [
					{
						top: ['', '', 0],
						right: ['', '', 0],
						bottom: ['', '', 0],
						left: ['', '', 0],
						unit: 'px',
					},
				],
				contentBgColor: '#ffffff',
				titleAlignment: 'left',
				showIcon: true,
				iconStyle: 'basic',
				iconSide: 'right',
				titleStyles: [
					{
						size: titleStyles[0].size,
						sizeType: titleStyles[0].sizeType,
						lineHeight: titleStyles[0].lineHeight,
						lineType: titleStyles[0].lineType,
						letterSpacing: titleStyles[0].letterSpacing,
						family: titleStyles[0].family,
						google: titleStyles[0].google,
						style: titleStyles[0].style,
						weight: titleStyles[0].weight,
						variant: titleStyles[0].variant,
						subset: titleStyles[0].subset,
						loadGoogle: titleStyles[0].loadGoogle,
						padding: [14, 16, 14, 16],
						marginTop: 10,
						color: '#555555',
						background: '#f2f2f2',
						border: ['', '', '', ''],
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						colorHover: '#444444',
						backgroundHover: '#eeeeee',
						borderHover: ['', '', '', ''],
						colorActive: '#ffffff',
						backgroundActive: '#BE530B',
						borderActive: ['', '', '', ''],
						textTransform: titleStyles[0].textTransform,
					},
				],
				titleBorderRadius: [6, 6, 6, 6],
				titleBorder: [
					{
						top: ['#f2f2f2', '', 0],
						right: ['#f2f2f2', '', 0],
						bottom: ['#f2f2f2', '', 0],
						left: ['#f2f2f2', '', 0],
						unit: 'px',
					},
				],
				titleBorderHover: [
					{
						top: ['#eeeeee', '', ''],
						right: ['#eeeeee', '', ''],
						bottom: ['#eeeeee', '', ''],
						left: ['#eeeeee', '', ''],
						unit: 'px',
					},
				],
				titleBorderActive: [
					{
						top: ['#BE530B', '', ''],
						right: ['#BE530B', '', ''],
						bottom: ['#BE530B', '', ''],
						left: ['#BE530B', '', ''],
						unit: 'px',
					},
				],
			});
		} else if ('subtle' === key) {
			setAttributes({
				contentBorderStyle: [
					{
						top: ['', '', 0],
						right: ['', '', 1],
						bottom: ['', '', 1],
						left: ['', '', 1],
						unit: 'px',
					},
				],
				contentBgColor: '#ffffff',
				titleAlignment: 'left',
				showIcon: true,
				iconStyle: 'arrow',
				iconSide: 'right',
				titleStyles: [
					{
						size: titleStyles[0].size,
						sizeType: titleStyles[0].sizeType,
						lineHeight: titleStyles[0].lineHeight,
						lineType: titleStyles[0].lineType,
						letterSpacing: titleStyles[0].letterSpacing,
						family: titleStyles[0].family,
						google: titleStyles[0].google,
						style: titleStyles[0].style,
						weight: titleStyles[0].weight,
						variant: titleStyles[0].variant,
						subset: titleStyles[0].subset,
						loadGoogle: titleStyles[0].loadGoogle,
						padding: [14, 16, 14, 16],
						marginTop: 10,
						color: '#444444',
						background: '#ffffff',
						border: ['', '', '', ''],
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						colorHover: '#444444',
						backgroundHover: '#ffffff',
						borderHover: ['', '', '', ''],
						colorActive: '#444444',
						backgroundActive: '#ffffff',
						borderActive: ['', '', '', ''],
						textTransform: titleStyles[0].textTransform,
					},
				],
				titleBorderRadius: [0, 0, 0, 0],
				titleBorder: [
					{
						top: ['#eeeeee', '', 1],
						right: ['#eeeeee', '', 1],
						bottom: ['#eeeeee', '', 1],
						left: ['#eeeeee', '', 2],
						unit: 'px',
					},
				],
				titleBorderHover: [
					{
						top: ['#d4d4d4', '', ''],
						right: ['#d4d4d4', '', ''],
						bottom: ['#d4d4d4', '', ''],
						left: ['#d4d4d4', '', ''],
						unit: 'px',
					},
				],
				titleBorderActive: [
					{
						top: ['#eeeeee', '', ''],
						right: ['#eeeeee', '', ''],
						bottom: ['#eeeeee', '', ''],
						left: ['#0e9cd1', '', ''],
						unit: 'px',
					},
				],
			});
		} else if ('bottom' === key) {
			setAttributes({
				contentBorderStyle: [
					{
						top: ['', '', 0],
						right: ['', '', 0],
						bottom: ['', '', 0],
						left: ['', '', 0],
						unit: 'px',
					},
				],
				contentBgColor: '#ffffff',
				titleAlignment: 'left',
				showIcon: false,
				iconStyle: 'arrow',
				iconSide: 'right',
				titleStyles: [
					{
						size: titleStyles[0].size,
						sizeType: titleStyles[0].sizeType,
						lineHeight: titleStyles[0].lineHeight,
						lineType: titleStyles[0].lineType,
						letterSpacing: titleStyles[0].letterSpacing,
						family: titleStyles[0].family,
						google: titleStyles[0].google,
						style: titleStyles[0].style,
						weight: titleStyles[0].weight,
						variant: titleStyles[0].variant,
						subset: titleStyles[0].subset,
						loadGoogle: titleStyles[0].loadGoogle,
						padding: [14, 10, 6, 16],
						marginTop: 8,
						color: '#444444',
						background: '#ffffff',
						border: ['', '', '', ''],
						borderRadius: ['', '', '', ''],
						borderWidth: ['', '', '', ''],
						colorHover: '#444444',
						backgroundHover: '#ffffff',
						borderHover: ['', '', '', ''],
						colorActive: '#333333',
						backgroundActive: '#ffffff',
						borderActive: ['', '', '', ''],
						textTransform: titleStyles[0].textTransform,
					},
				],
				titleBorderRadius: [0, 0, 0, 0],
				titleBorder: [
					{
						top: ['#f2f2f2', '', 0],
						right: ['#f2f2f2', '', 0],
						bottom: ['#f2f2f2', '', 4],
						left: ['#f2f2f2', '', 0],
						unit: 'px',
					},
				],
				titleBorderHover: [
					{
						top: ['#eeeeee', '', ''],
						right: ['#eeeeee', '', ''],
						bottom: ['#eeeeee', '', ''],
						left: ['#eeeeee', '', ''],
						unit: 'px',
					},
				],
				titleBorderActive: [
					{
						top: ['#0e9cd1', '', ''],
						right: ['#0e9cd1', '', ''],
						bottom: ['#0e9cd1', '', ''],
						left: ['#0e9cd1', '', ''],
						unit: 'px',
					},
				],
			});
		}
	};
	const saveTitleStyles = (value) => {
		const newUpdate = titleStyles.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			titleStyles: newUpdate,
		});
	};
	const classes = classnames(
		className,
		`kt-accordion-wrap kt-accordion-id${uniqueID} kt-accordion-has-${paneCount}-panes kt-accordion-block kt-pane-header-alignment-${titleAlignment}`
	);
	const accordionIconSet = [];
	accordionIconSet.basic = (
		<>
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
		</>
	);
	accordionIconSet.basiccircle = (
		<>
			<circle cx="83.723" cy="50" r="50" fill="#444" />
			<circle cx="322.768" cy="50" r="50" fill="#444" />
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
			<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
		</>
	);
	accordionIconSet.xclose = (
		<>
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" />
			<path d="M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z" fill="#444" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" />
			<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#444" />
		</>
	);
	accordionIconSet.xclosecircle = (
		<>
			<circle cx="83.723" cy="50" r="50" fill="#444" />
			<circle cx="322.768" cy="50" r="50" fill="#444" />
			<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" />
			<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#fff" />
			<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" />
			<path d="M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z" fill="#fff" />
		</>
	);
	accordionIconSet.arrow = (
		<>
			<g fill="#444">
				<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z" />
				<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z" />
			</g>
			<g fill="#444">
				<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z" />
				<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z" />
			</g>
		</>
	);
	accordionIconSet.arrowcircle = (
		<>
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
		</>
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
			{accordionIconSet[svg]}
		</svg>
	);
	const renderCSS = (
		<style>
			{`
			.kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner, .kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner .kt-svg-icon-list-item-wrap, .kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner p, .kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner h1, .kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner h2, .kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner h3, .kt-accordion-${uniqueID} .kt-accordion-panel-inner h4, .kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner h5, .kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner h6 {
				${textColor ? `color: ${KadenceColorOutput(textColor)};` : ''}
			}
			.kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner a  {
				${linkColor ? 'color:' + KadenceColorOutput(linkColor) : ''}
			}
			.kt-accordion-${uniqueID} .kt-accordion-panel .kt-accordion-panel-inner a:hover  {
				${linkHoverColor ? 'color:' + KadenceColorOutput(linkHoverColor) : ''}
			}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header {
					${titleStyles?.[0]?.color ? 'color:' + KadenceColorOutput(titleStyles[0].color) : ''};
					${previewTitleBorderTop ? 'border-top:' + previewTitleBorderTop : ''};
					${previewTitleBorderRight ? 'border-right:' + previewTitleBorderRight : ''};
					${previewTitleBorderBottom ? 'border-bottom:' + previewTitleBorderBottom : ''};
					${previewTitleBorderLeft ? 'border-left:' + previewTitleBorderLeft : ''};
					${!previewTitleBorderTop && previewTitleBorderColorTop ? 'border-top-color:' + previewTitleBorderColorTop : ''};
					${!previewTitleBorderRight && previewTitleBorderColorRight ? 'border-right-color:' + previewTitleBorderColorRight : ''};
					${
						!previewTitleBorderBottom && previewTitleBorderColorBottom
							? 'border-bottom-color:' + previewTitleBorderColorBottom
							: ''
					};
					${!previewTitleBorderLeft && previewTitleBorderColorLeft ? 'border-left-color:' + previewTitleBorderColorLeft : ''};
					${previewTitleRadiusTop ? 'border-top-left-radius:' + previewTitleRadiusTop + titleBorderRadiusUnit : ''};
					${previewTitleRadiusRight ? 'border-top-right-radius:' + previewTitleRadiusRight + titleBorderRadiusUnit : ''};
					${previewTitleRadiusBottom ? 'border-bottom-right-radius:' + previewTitleRadiusBottom + titleBorderRadiusUnit : ''};
					${previewTitleRadiusLeft ? 'border-bottom-left-radius:' + previewTitleRadiusLeft + titleBorderRadiusUnit : ''};
					${titleStyles?.[0]?.background ? 'background-color:' + KadenceColorOutput(titleStyles[0].background) : ''};
					${
						'' !== previewTitlePaddingTop
							? `padding-top:${getSpacingOptionOutput(previewTitlePaddingTop, previewTitlePaddingType)};`
							: ''
					}
					${
						'' !== previewTitlePaddingRight
							? `padding-right:${getSpacingOptionOutput(
									previewTitlePaddingRight,
									previewTitlePaddingType
								)};`
							: ''
					}
					${
						'' !== previewTitlePaddingBottom
							? `padding-bottom:${getSpacingOptionOutput(
									previewTitlePaddingBottom,
									previewTitlePaddingType
								)};`
							: ''
					}
					${
						'' !== previewTitlePaddingLeft
							? `padding-left:${getSpacingOptionOutput(
									previewTitlePaddingLeft,
									previewTitlePaddingType
								)};`
							: ''
					}
					${previewTitleSize ? 'font-size:' + getFontSizeOptionOutput(previewTitleSize, titleStyles[0].sizeType) : ''};
					${previewTitleHeight ? 'line-height:' + previewTitleHeight + titleStyles[0].lineType : ''};
					${titleStyles?.[0]?.letterSpacing ? 'letter-spacing:' + titleStyles[0].letterSpacing + 'px' : ''};
					${titleStyles?.[0]?.textTransform ? 'text-transform:' + titleStyles[0].textTransform : ''};
					${titleStyles?.[0]?.family ? 'font-family:' + titleStyles[0].family : ''};
					${titleStyles?.[0]?.style ? 'font-style:' + titleStyles[0].style : ''};
					${titleStyles?.[0]?.weight ? 'font-weight:' + titleStyles[0].weight : ''};
				}
				.kt-accordion-${uniqueID} .wp-block-kadence-pane {
					margin-top:${titleStyles?.[0]?.marginTop ? titleStyles[0].marginTop : 0}px${hasColumns ? ' !important' : ''};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header .kt-blocks-accordion-title {
					${previewTitleHeight ? 'line-height:' + previewTitleHeight + titleStyles[0].lineType : ''};
				}
				.kt-accordion-${uniqueID} .kt-accordion-panel-inner {
					${
						'' !== previewContentPaddingTop
							? `padding-top:${getSpacingOptionOutput(previewContentPaddingTop, previewPaddingType)};`
							: ''
					}
					${
						'' !== previewContentPaddingRight
							? `padding-right:${getSpacingOptionOutput(previewContentPaddingRight, previewPaddingType)};`
							: ''
					}
					${
						'' !== previewContentPaddingBottom
							? `padding-bottom:${getSpacingOptionOutput(
									previewContentPaddingBottom,
									previewPaddingType
								)};`
							: ''
					}
					${
						'' !== previewContentPaddingLeft
							? `padding-left:${getSpacingOptionOutput(previewContentPaddingLeft, previewPaddingType)};`
							: ''
					}
					${contentBgColor ? 'background-color:' + KadenceColorOutput(contentBgColor) : ''};
					${previewContentBorderTop ? 'border-top:' + previewContentBorderTop : ''};
					${previewContentBorderRight ? 'border-right:' + previewContentBorderRight : ''};
					${previewContentBorderBottom ? 'border-bottom:' + previewContentBorderBottom : ''};
					${previewContentBorderLeft ? 'border-left:' + previewContentBorderLeft : ''};
					${previewContentRadiusTop ? 'border-top-left-radius:' + previewContentRadiusTop + contentBorderRadiusUnit : ''};
					${previewContentRadiusRight ? 'border-top-right-radius:' + previewContentRadiusRight + contentBorderRadiusUnit : ''};
					${
						previewContentRadiusBottom
							? 'border-bottom-right-radius:' + previewContentRadiusBottom + contentBorderRadiusUnit
							: ''
					};
					${previewContentRadiusLeft ? 'border-bottom-left-radius:' + previewContentRadiusLeft + contentBorderRadiusUnit : ''};
					min-height:${minHeight ? minHeight + 'px' : '0'};
				}
				.kt-accordion-${uniqueID} .kt-accordion-panel-inner p:last-of-type{
					margin-bottom: 0;
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before,
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${
						'' !== iconColor.standard
							? KadenceColorOutput(iconColor.standard)
							: KadenceColorOutput(titleStyles[0].color)
					};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:before,
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger:after {
					background-color: ${KadenceColorOutput(titleStyles[0].background)};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header .kt-blocks-accordion-icon-trigger {
					background-color: ${
						'' !== iconColor.standard
							? KadenceColorOutput(iconColor.standard)
							: KadenceColorOutput(titleStyles[0].color)
					};
				}
				.kt-accordion-${uniqueID} .kt-blocks-accordion-header:hover {
					${titleStyles?.[0]?.colorHover ? 'color:' + KadenceColorOutput(titleStyles[0].colorHover) : ''};
					${previewTitleBorderHoverTop ? 'border-top:' + previewTitleBorderHoverTop : ''};
					${previewTitleBorderHoverRight ? 'border-right:' + previewTitleBorderHoverRight : ''};
					${previewTitleBorderHoverBottom ? 'border-bottom:' + previewTitleBorderHoverBottom : ''};
					${previewTitleBorderHoverLeft ? 'border-left:' + previewTitleBorderHoverLeft : ''};
					${
						!previewTitleBorderHoverTop && previewTitleBorderColorHoverTop
							? 'border-top-color:' + previewTitleBorderColorHoverTop
							: ''
					};
					${
						!previewTitleBorderHoverRight && previewTitleBorderColorHoverRight
							? 'border-right-color:' + previewTitleBorderColorHoverRight
							: ''
					};
					${
						!previewTitleBorderHoverBottom && previewTitleBorderColorHoverBottom
							? 'border-bottom-color:' + previewTitleBorderColorHoverBottom
							: ''
					};
					${
						!previewTitleBorderHoverLeft && previewTitleBorderColorHoverLeft
							? 'border-left-color:' + previewTitleBorderColorHoverLeft
							: ''
					};
					${titleStyles?.[0]?.backgroundHover ? 'background-color:' + KadenceColorOutput(titleStyles[0].backgroundHover) : ''};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane:not(.kt-accordion-panel-active) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before,
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-pane:not(.kt-accordion-panel-active) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${
						'' !== iconColor.hover
							? KadenceColorOutput(iconColor.hover)
							: KadenceColorOutput(titleStyles[0].colorHover)
					};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane:not(.kt-accordion-panel-active) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before,
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane:not(.kt-accordion-panel-active) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after {
					background-color: ${
						'' !== iconColor.hover
							? KadenceColorOutput(iconColor.hover)
							: KadenceColorOutput(titleStyles[0].backgroundHover)
					};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-pane:not(.kt-accordion-panel-active) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger {
					background-color: ${
						'' !== iconColor.hover
							? KadenceColorOutput(iconColor.hover)
							: KadenceColorOutput(titleStyles[0].colorHover)
					};
				}
				.kt-accordion-${uniqueID} .kt-accordion-panel-active .kt-blocks-accordion-header {
					${titleStyles?.[0]?.colorActive ? 'color:' + KadenceColorOutput(titleStyles[0].colorActive) : ''};
					${previewTitleBorderActiveTop ? 'border-top:' + previewTitleBorderActiveTop : ''};
					${previewTitleBorderActiveRight ? 'border-right:' + previewTitleBorderActiveRight : ''};
					${previewTitleBorderActiveBottom ? 'border-bottom:' + previewTitleBorderActiveBottom : ''};
					${previewTitleBorderActiveLeft ? 'border-left:' + previewTitleBorderActiveLeft : ''};
					${
						!previewTitleBorderActiveTop && previewTitleBorderColorActiveTop
							? 'border-top-color:' + previewTitleBorderColorActiveTop
							: ''
					};
					${
						!previewTitleBorderActiveRight && previewTitleBorderColorActiveRight
							? 'border-right-color:' + previewTitleBorderColorActiveRight
							: ''
					};
					${
						!previewTitleBorderActiveBottom && previewTitleBorderColorActiveBottom
							? 'border-bottom-color:' + previewTitleBorderColorActiveBottom
							: ''
					};
					${
						!previewTitleBorderActiveLeft && previewTitleBorderColorActiveLeft
							? 'border-left-color:' + previewTitleBorderColorActiveLeft
							: ''
					};
					${titleStyles?.[0]?.backgroundActive ? 'background-color:' + KadenceColorOutput(titleStyles[0].backgroundActive) : ''};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before,
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after {
					background-color: ${
						'' !== iconColor.active
							? KadenceColorOutput(iconColor.active)
							: KadenceColorOutput(titleStyles[0].colorActive)
					};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before,
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after {
					background-color: ${KadenceColorOutput(titleStyles[0].backgroundActive)};
				}
				.kt-accordion-${uniqueID}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-panel-active .kt-blocks-accordion-icon-trigger {
					background-color: ${KadenceColorOutput(titleStyles[0].colorActive)};
				}

				`}
		</style>
	);

	const blockProps = useBlockProps({
		'data-align': 'full' === align || 'wide' === align || 'center' === align ? align : undefined,
	});
	const innerClasses = classnames({
		'kt-accordion-inner-wrap': true,
		[`kt-accordion-${uniqueID}`]: uniqueID,
		[`kt-start-active-pane-${openPane + 1}`]: true,
		[`kt-accodion-icon-style-${iconStyle && showIcon ? iconStyle : 'none'}`]: true,
		[`kt-accodion-icon-side-${iconSide ? iconSide : 'right'}`]: true,
		[`kt-accordion-layout-${layoutPreview}`]: layoutPreview,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerClasses,
			style: {
				columnGap:
					'' !== previewGap
						? getGapSizeOptionOutput(previewGap, columnGapUnit ? columnGapUnit : 'px')
						: undefined,
			},
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			templateLock: false,
			template: getPanesTemplate(0 === realPaneCount ? paneCount : realPaneCount),
		}
	);
	return (
		<div {...blockProps}>
			{renderCSS}
			<BlockControls>
				<BlockAlignmentToolbar
					value={align}
					controls={['center', 'wide', 'full']}
					onChange={(value) => setAttributes({ align: value })}
				/>
				<AlignmentToolbar
					value={titleAlignment}
					onChange={(nextAlign) => {
						setAttributes({ titleAlignment: nextAlign });
					}}
				/>
				<CopyPasteAttributes
					attributes={attributes}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			{showSettings('allSettings', 'kadence/accordion') && (
				<InspectorControls>
					<InspectorControlTabs
						panelName={'accordion'}
						setActiveTab={(value) => setActiveTab(value)}
						activeTab={activeTab}
					/>
					{activeTab === 'general' && (
						<>
							<KadencePanelBody panelName={'kb-accordion-all'}>
								{showSettings('paneControl', 'kadence/accordion') && (
									<>
										<ToggleControl
											label={__('Panes close when another opens', 'kadence-blocks')}
											checked={linkPaneCollapse}
											onChange={(value) => setAttributes({ linkPaneCollapse: value })}
										/>
										<ToggleControl
											label={__('Start with all panes collapsed', 'kadence-blocks')}
											checked={startCollapsed}
											onChange={(value) => setAttributes({ startCollapsed: value })}
										/>
										<SmallResponsiveControl
											label={__('Column Layout', 'kadence-blocks')}
											desktopChildren={
												<KadenceRadioButtons
													value={columnLayout?.[0] ? columnLayout[0] : 'row'}
													options={layoutOptions}
													wrap={false}
													hideLabel={true}
													className={
														'kadence-row-layout-radio-btns kb-acccordion-column-layout'
													}
													onChange={(value) => {
														setAttributes({
															columnLayout: [
																value,
																columnLayout?.[1] ? columnLayout[1] : '',
																columnLayout?.[2] ? columnLayout[2] : '',
															],
														});
													}}
												/>
											}
											tabletChildren={
												<KadenceRadioButtons
													value={columnLayout?.[1] ? columnLayout[1] : ''}
													options={layoutOptions}
													wrap={false}
													className={
														'kadence-row-layout-radio-btns kb-acccordion-column-layout'
													}
													hideLabel={true}
													onChange={(value) => {
														if (columnLayout?.[1] && columnLayout[1] === value) {
															setAttributes({
																columnLayout: [
																	columnLayout?.[0] ? columnLayout[0] : '',
																	'',
																	columnLayout?.[2] ? columnLayout[2] : '',
																],
															});
														} else {
															setAttributes({
																columnLayout: [
																	columnLayout?.[0] ? columnLayout[0] : '',
																	value,
																	columnLayout?.[2] ? columnLayout[2] : '',
																],
															});
														}
													}}
												/>
											}
											mobileChildren={
												<KadenceRadioButtons
													value={columnLayout?.[2] ? columnLayout[2] : 'row'}
													options={layoutOptions}
													wrap={false}
													className={
														'kadence-row-layout-radio-btns kb-acccordion-column-layout'
													}
													hideLabel={true}
													onChange={(value) => {
														setAttributes({
															columnLayout: [
																columnLayout?.[0] ? columnLayout[0] : '',
																columnLayout?.[1] ? columnLayout[1] : '',
																value,
															],
														});
													}}
												/>
											}
										/>
										{hasColumns && (
											<ResponsiveGapSizeControl
												label={__('Column Gap', 'kadence-blocks')}
												value={undefined !== columnGap?.[0] ? columnGap[0] : ''}
												onChange={(value) =>
													setAttributes({
														columnGap: [
															value,
															undefined !== columnGap?.[1] ? columnGap[1] : '',
															undefined !== columnGap?.[2] ? columnGap[2] : '',
														],
													})
												}
												tabletValue={undefined !== columnGap?.[1] ? columnGap[1] : ''}
												onChangeTablet={(value) =>
													setAttributes({
														columnGap: [
															undefined !== columnGap?.[0] ? columnGap[0] : '',
															value,
															undefined !== columnGap?.[2] ? columnGap[2] : '',
														],
													})
												}
												mobileValue={undefined !== columnGap?.[2] ? columnGap[2] : ''}
												onChangeMobile={(value) =>
													setAttributes({
														columnGap: [
															undefined !== columnGap?.[0] ? columnGap[0] : '',
															undefined !== columnGap?.[1] ? columnGap[1] : '',
															value,
														],
													})
												}
												min={0}
												max={columnGapUnit === 'px' ? 200 : 12}
												step={columnGapUnit === 'px' ? 1 : 0.1}
												unit={columnGapUnit ? columnGapUnit : 'px'}
												onUnit={(value) => {
													setAttributes({ columnGapUnit: value });
												}}
												units={['px', 'em', 'rem']}
											/>
										)}
										{!startCollapsed && (
											<>
												<h2>{__('Initial Open Accordion', 'kadence-blocks')}</h2>
												<ButtonGroup
													aria-label={__('Initial Open Accordion', 'kadence-blocks')}
												>
													{accordionBlock &&
														accordionBlock[0] &&
														accordionBlock[0].innerBlocks && (
															<>
																{map(
																	accordionBlock[0].innerBlocks,
																	({ attributes }) => (
																		<Button
																			key={attributes.id - 1}
																			className="kt-init-open-pane"
																			isSmall
																			isPrimary={openPane === attributes.id - 1}
																			aria-pressed={
																				openPane === attributes.id - 1
																			}
																			onClick={() =>
																				setAttributes({
																					openPane: attributes.id - 1,
																				})
																			}
																		>
																			{__('Accordion Pane', 'kadence-blocks') +
																				' ' +
																				attributes.id}
																		</Button>
																	)
																)}
															</>
														)}
													{accordionBlock && accordionBlock.innerBlocks && (
														<>
															{map(accordionBlock.innerBlocks, ({ attributes }) => (
																<Button
																	key={attributes.id - 1}
																	className="kt-init-open-pane"
																	isSmall
																	isPrimary={openPane === attributes.id - 1}
																	aria-pressed={openPane === attributes.id - 1}
																	onClick={() =>
																		setAttributes({ openPane: attributes.id - 1 })
																	}
																>
																	{__('Accordion Pane', 'kadence-blocks') +
																		' ' +
																		attributes.id}
																</Button>
															))}
														</>
													)}
												</ButtonGroup>
											</>
										)}
									</>
								)}
							</KadencePanelBody>
							{showSettings('titleIcon', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Pane Title Trigger Icon', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-acordion-panel-title-trigger-icon'}
								>
									<ToggleControl
										label={__('Show Icon', 'kadence-blocks')}
										checked={showIcon}
										onChange={(value) => setAttributes({ showIcon: value })}
									/>
									<h2>{__('Icon Style', 'kadence-blocks')}</h2>
									<KadenceIconPicker
										icons={[
											'basic',
											'basiccircle',
											'xclose',
											'xclosecircle',
											'arrow',
											'arrowcircle',
										]}
										value={iconStyle}
										onChange={(value) => setAttributes({ iconStyle: value })}
										showSearch={false}
										renderFunc={renderIconSet}
										theme="dividers"
										allowClear={true}
										placeholder={__('Select Icon Set', 'kadence-blocks')}
									/>
									<SelectControl
										label={__('Icon Side', 'kadence-blocks')}
										value={iconSide}
										options={[
											{ value: 'right', label: __('Right', 'kadence-blocks') },
											{ value: 'left', label: __('Left', 'kadence-blocks') },
										]}
										onChange={(value) => setAttributes({ iconSide: value })}
									/>

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
											if (tab.name) {
												if ('hover' === tab.name) {
													return (
														<div className={tab.className} key={tab.className}>
															<PopColorControl
																label={__('Hover Icon Color', 'kadence-blocks')}
																value={iconColor.hover ? iconColor.hover : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({
																		iconColor: { ...iconColor, hover: value },
																	})
																}
															/>
														</div>
													);
												} else if ('active' === tab.name) {
													return (
														<div className={tab.className} key={tab.className}>
															<PopColorControl
																label={__('Active Icon Color', 'kadence-blocks')}
																value={iconColor.active ? iconColor.active : ''}
																default={''}
																onChange={(value) =>
																	setAttributes({
																		iconColor: { ...iconColor, active: value },
																	})
																}
															/>
														</div>
													);
												}
												return (
													<div className={tab.className} key={tab.className}>
														<PopColorControl
															label={__('Icon Color', 'kadence-blocks')}
															value={iconColor.standard ? iconColor.standard : ''}
															default={''}
															onChange={(value) =>
																setAttributes({
																	iconColor: { ...iconColor, standard: value },
																})
															}
														/>
													</div>
												);
											}
										}}
									</TabPanel>
								</KadencePanelBody>
							)}
						</>
					)}
					{activeTab === 'style' && (
						<>
							{showSettings('titleColors', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Pane Title Colors', 'kadence-blocks')}
									initialOpen={true}
									panelName={'kb-accordion-pane-title-color-settings'}
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
											if (tab.name) {
												if ('hover' === tab.name) {
													return (
														<div className={tab.className} key={tab.className}>
															<PopColorControl
																label={__('Hover Color', 'kadence-blocks')}
																value={
																	titleStyles[0].colorHover
																		? titleStyles[0].colorHover
																		: ''
																}
																onChange={(value) =>
																	saveTitleStyles({ colorHover: value })
																}
															/>
															<PopColorControl
																label={__('Hover Background', 'kadence-blocks')}
																value={
																	titleStyles[0].backgroundHover
																		? titleStyles[0].backgroundHover
																		: ''
																}
																onChange={(value) =>
																	saveTitleStyles({ backgroundHover: value })
																}
															/>
														</div>
													);
												} else if ('active' === tab.name) {
													return (
														<div className={tab.className} key={tab.className}>
															<PopColorControl
																label={__('Active Color', 'kadence-blocks')}
																value={
																	titleStyles[0].colorActive
																		? titleStyles[0].colorActive
																		: ''
																}
																onChange={(value) =>
																	saveTitleStyles({ colorActive: value })
																}
															/>
															<PopColorControl
																label={__('Active Background', 'kadence-blocks')}
																value={
																	titleStyles[0].backgroundActive
																		? titleStyles[0].backgroundActive
																		: ''
																}
																onChange={(value) =>
																	saveTitleStyles({ backgroundActive: value })
																}
															/>
														</div>
													);
												}
												return (
													<div className={tab.className} key={tab.className}>
														<PopColorControl
															label={__('Title Color', 'kadence-blocks')}
															value={titleStyles[0].color ? titleStyles[0].color : ''}
															onChange={(value) => saveTitleStyles({ color: value })}
														/>
														<PopColorControl
															label={__('Title Background', 'kadence-blocks')}
															value={
																titleStyles[0].background
																	? titleStyles[0].background
																	: ''
															}
															onChange={(value) => saveTitleStyles({ background: value })}
														/>
													</div>
												);
											}
										}}
									</TabPanel>
								</KadencePanelBody>
							)}
							{showSettings('titleBorder', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Pane Title Border', 'kadence-blocks')}
									initialOpen={true}
									panelName={'kb-accordion-pane-title-border'}
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
											if (tab.name) {
												if ('hover' === tab.name) {
													return (
														<div className={tab.className} key={tab.className}>
															<ResponsiveBorderControl
																label={__('Hover Border', 'kadence-blocks')}
																value={titleBorderHover}
																tabletValue={tabletTitleBorderHover}
																mobileValue={mobileTitleBorderHover}
																onChange={(value) =>
																	setAttributes({ titleBorderHover: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({ tabletTitleBorderHover: value })
																}
																onChangeMobile={(value) =>
																	setAttributes({ mobileTitleBorderHover: value })
																}
															/>
														</div>
													);
												} else if ('active' === tab.name) {
													return (
														<div className={tab.className} key={tab.className}>
															<ResponsiveBorderControl
																label={__('Active Border', 'kadence-blocks')}
																value={titleBorderActive}
																tabletValue={tabletTitleBorderActive}
																mobileValue={mobileTitleBorderActive}
																onChange={(value) =>
																	setAttributes({ titleBorderActive: value })
																}
																onChangeTablet={(value) =>
																	setAttributes({ tabletTitleBorderActive: value })
																}
																onChangeMobile={(value) =>
																	setAttributes({ mobileTitleBorderActive: value })
																}
															/>
														</div>
													);
												}
												return (
													<div className={tab.className} key={tab.className}>
														<ResponsiveBorderControl
															label={__('Border', 'kadence-blocks')}
															value={titleBorder}
															tabletValue={tabletTitleBorder}
															mobileValue={mobileTitleBorder}
															onChange={(value) => setAttributes({ titleBorder: value })}
															onChangeTablet={(value) =>
																setAttributes({ tabletTitleBorder: value })
															}
															onChangeMobile={(value) =>
																setAttributes({ mobileTitleBorder: value })
															}
														/>
													</div>
												);
											}
										}}
									</TabPanel>

									<hr />
									<ResponsiveMeasurementControls
										label={__('Border Radius', 'kadence-blocks')}
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
							{showSettings('titleFont', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Pane Title Font Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-accordion-pane-title-font-settings'}
								>
									<TypographyControls
										fontGroup={'heading'}
										fontSize={titleStyles[0].size}
										onFontSize={(value) => saveTitleStyles({ size: value })}
										fontSizeType={titleStyles[0].sizeType}
										onFontSizeType={(value) => saveTitleStyles({ sizeType: value })}
										lineHeight={titleStyles[0].lineHeight}
										onLineHeight={(value) => saveTitleStyles({ lineHeight: value })}
										lineHeightType={titleStyles[0].lineType}
										onLineHeightType={(value) => saveTitleStyles({ lineType: value })}
										letterSpacing={titleStyles[0].letterSpacing}
										onLetterSpacing={(value) => saveTitleStyles({ letterSpacing: value })}
										textTransform={titleStyles[0].textTransform}
										onTextTransform={(value) => saveTitleStyles({ textTransform: value })}
										fontFamily={titleStyles[0].family}
										onFontFamily={(value) => saveTitleStyles({ family: value })}
										onFontChange={(select) => {
											saveTitleStyles({
												family: select.value,
												google: select.google,
											});
										}}
										onFontArrayChange={(values) => saveTitleStyles(values)}
										googleFont={titleStyles[0].google}
										onGoogleFont={(value) => saveTitleStyles({ google: value })}
										loadGoogleFont={titleStyles[0].loadGoogle}
										onLoadGoogleFont={(value) => saveTitleStyles({ loadGoogle: value })}
										fontVariant={titleStyles[0].variant}
										onFontVariant={(value) => saveTitleStyles({ variant: value })}
										fontWeight={titleStyles[0].weight}
										onFontWeight={(value) => saveTitleStyles({ weight: value })}
										fontStyle={titleStyles[0].style}
										onFontStyle={(value) => saveTitleStyles({ style: value })}
										fontSubset={titleStyles[0].subset}
										onFontSubset={(value) => saveTitleStyles({ subset: value })}
									/>
								</KadencePanelBody>
							)}
							{showSettings('paneContent', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Inner Content Styling', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-accordion-inner-content-settings'}
								>
									<ColorGroup>
										<PopColorControl
											label={__('Text Color', 'kadence-blocks')}
											value={textColor ? textColor : ''}
											default={''}
											onChange={(value) => setAttributes({ textColor: value })}
										/>
										<PopColorControl
											label={__('Text Link Color', 'kadence-blocks')}
											value={linkColor ? linkColor : ''}
											default={''}
											onChange={(value) => setAttributes({ linkColor: value })}
										/>
										<PopColorControl
											label={__('Text Link Hover Color', 'kadence-blocks')}
											value={linkHoverColor ? linkHoverColor : ''}
											default={''}
											onChange={(value) => setAttributes({ linkHoverColor: value })}
										/>
									</ColorGroup>
									<PopColorControl
										label={__('Background', 'kadence-blocks')}
										value={contentBgColor ? contentBgColor : ''}
										default={''}
										onChange={(value) => setAttributes({ contentBgColor: value })}
									/>
									<ResponsiveBorderControl
										label={__('Border', 'kadence-blocks')}
										value={contentBorderStyle}
										tabletValue={tabletContentBorderStyle}
										mobileValue={mobileContentBorderStyle}
										onChange={(value) => setAttributes({ contentBorderStyle: value })}
										onChangeTablet={(value) => setAttributes({ tabletContentBorderStyle: value })}
										onChangeMobile={(value) => setAttributes({ mobileContentBorderStyle: value })}
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
					{activeTab === 'advanced' && (
						<>
							{showSettings('titleSpacing', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Pane Title Sizing', 'kadence-blocks')}
									panelName={'kb-accordion-pane-title-spacing'}
									initialOpen={true}
								>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={titleStyles[0].padding}
										tabletValue={
											undefined !== titleStyles[0].paddingTablet
												? titleStyles[0].paddingTablet
												: ['', '', '', '']
										}
										mobileValue={
											undefined !== titleStyles[0].paddingMobile
												? titleStyles[0].paddingMobile
												: ['', '', '', '']
										}
										onChange={(value) => {
											saveTitleStyles({ padding: value });
										}}
										onChangeTablet={(value) => {
											saveTitleStyles({ paddingTablet: value });
										}}
										onChangeMobile={(value) => {
											saveTitleStyles({ paddingMobile: value });
										}}
										min={titlePaddingMin}
										max={titlePaddingMax}
										step={titlePaddingStep}
										unit={contentPaddingType}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => saveTitleStyles({ paddingType: value })}
									/>
									<RangeControl
										label={__('Pane Space Between', 'kadence-blocks')}
										value={titleStyles[0].marginTop}
										onChange={(value) => saveTitleStyles({ marginTop: value })}
										min={0}
										max={120}
										units={['px']}
										unit={'px'}
										showUnit={true}
									/>
								</KadencePanelBody>
							)}
							{showSettings('paneContent', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Inner Content Padding', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-accordion-inner-padding-settings'}
								>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={contentPadding}
										tabletValue={contentTabletPadding}
										mobileValue={contentMobilePadding}
										onChange={(value) => {
											setAttributes({ contentPadding: value });
										}}
										onChangeTablet={(value) => {
											setAttributes({ contentTabletPadding: value });
										}}
										onChangeMobile={(value) => {
											setAttributes({ contentMobilePadding: value });
										}}
										min={paddingMin}
										max={paddingMax}
										step={paddingStep}
										unit={contentPaddingType}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => setAttributes({ contentPaddingType: value })}
									/>
								</KadencePanelBody>
							)}
							{showSettings('titleTag', 'kadence/accordion') && (
								<KadencePanelBody
									title={__('Title Tag Settings', 'kadence-blocks')}
									panelName={'kb-accordion-title-tag-settings'}
									initialOpen={false}
								>
									<SelectControl
										label={__('Title Tag', 'kadence-blocks')}
										value={titleTag}
										options={[
											{ value: 'div', label: __('div') },
											{ value: 'h2', label: __('h2') },
											{ value: 'h3', label: __('h3') },
											{ value: 'h4', label: __('h4') },
											{ value: 'h5', label: __('h5') },
											{ value: 'h6', label: __('h6') },
										]}
										onChange={(value) => {
											updatePaneTag(value);
											setTitleTag(value);
										}}
									/>
								</KadencePanelBody>
							)}
							{showSettings('structure', 'kadence/accordion') && (
								<>
									<KadencePanelBody
										title={__('Structure Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-accordion-structure-settings'}
									>
										<RangeControl
											label={__('Content Minimum Height', 'kadence-blocks')}
											value={minHeight}
											onChange={(value) => {
												setAttributes({
													minHeight: value,
												});
											}}
											min={0}
											max={1000}
										/>
										<RangeControl
											label={__('Max Width', 'kadence-blocks')}
											value={maxWidth}
											onChange={(value) => {
												setAttributes({
													maxWidth: value,
												});
											}}
											min={0}
											max={2000}
										/>
									</KadencePanelBody>
									<KadencePanelBody
										title={__('FAQ Schema', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-accordion-faq-settings'}
									>
										<ToggleControl
											label={__('Enable FAQ Schema', 'kadence-blocks')}
											checked={faqSchema}
											onChange={(value) => {
												setAttributes({ faqSchema: value });
											}}
										/>
									</KadencePanelBody>
								</>
							)}

							<KadenceBlockDefaults
								attributes={attributes}
								defaultAttributes={metadata.attributes}
								blockSlug={metadata.name}
							/>
						</>
					)}
				</InspectorControls>
			)}
			<div className={classes}>
				{showPreset && (
					<div className="kt-select-starter-style-tabs">
						<div className="kt-select-starter-style-tabs-title">
							{__('Select Initial Style', 'kadence-blocks')}
						</div>
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
					<>
						<div
							className="kt-accordion-wrap"
							style={{
								maxWidth: maxWidth + 'px',
							}}
						>
							{titleStyles && titleStyles[0] && titleStyles[0].google && (
								<KadenceWebfontLoader typography={titleStyles} clientId={clientId} id={'titleStyles'} />
							)}
							<div {...innerBlocksProps} />
						</div>
						{isSelected && (
							<div className="kt-accordion-add-selecter">
								<Button
									className="kt-accordion-add"
									variant="primary"
									icon={plus}
									iconPosition="left"
									iconSize={16}
									onClick={() => {
										const newBlock = createBlock('kadence/pane', {
											id: paneCount + 1,
											titleTag,
										});
										setAttributes({ paneCount: paneCount + 1 });
										insertPane(newBlock);
									}}
								>
									{__('Add Accordion Item', 'kadence-blocks')}
								</Button>
								{realPaneCount > 1 && (
									<Button
										className="kt-accordion-remove"
										label={__('Remove Accordion Item', 'kadence-blocks')}
										icon={reset}
										onClick={() => {
											const removeClientId = accordionBlock[0]
												? accordionBlock[0].innerBlocks[realPaneCount - 1].clientId
												: accordionBlock.innerBlocks[realPaneCount - 1].clientId;
											removePane(removeClientId);
										}}
									/>
								)}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}

export default compose([
	withSelect((select, ownProps) => {
		const { clientId } = ownProps;
		const { getBlock } = select('core/block-editor');
		const block = getBlock(clientId);
		return {
			accordionBlock: block,
			realPaneCount: block.innerBlocks.length,
			getPreviewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
		};
	}),
	withDispatch((dispatch, { clientId }, { select }) => {
		const { getBlock } = select('core/block-editor');
		const { removeBlock, updateBlockAttributes, insertBlock } = dispatch('core/block-editor');
		const block = getBlock(clientId);
		return {
			updatePaneTag(value) {
				times(block.innerBlocks.length, (n) => {
					updateBlockAttributes(block.innerBlocks[n].clientId, {
						titleTag: value,
					});
				});
			},
			insertPane(newBlock) {
				insertBlock(newBlock, parseInt(block.innerBlocks.length), clientId);
			},
			removePane(paneId) {
				removeBlock(paneId);
			},
		};
	}),
])(KadenceAccordionComponent);
