/**
 * BLOCK: Kadence Advanced Heading
 *
 */

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import {
	PopColorControl,
	TextShadowControl,
	ResponsiveShadowControl,
	TypographyControls,
	InlineTypographyControls,
	ResponsiveMeasurementControls,
	ResponsiveRangeControls,
	KadencePanelBody,
	URLInputControl,
	KadenceWebfontLoader,
	HeadingLevelIcon,
	InlinePopColorControl,
	ResponsiveAlignControls,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	ResponsiveUnitControl,
	TwoColumn,
	ColorGroup,
	ResponsiveFontSizeControl,
	KadenceRadioButtons,
	TagSelect,
	ResponsiveBorderControl,
	CopyPasteAttributes,
	KadenceIconPicker,
	IconRender,
	DynamicTextControl,
	DynamicInlineReplaceControl,
	GradientControl,
	ResponsiveKadenceRadioButtons,
} from '@kadence/components';

import {
	dynamicIcon,
	horizontalTextOrientationIcon,
	stackedTextOrientationIcon,
	sidewaysDownTextOrientationIcon,
	sidewaysUpTextOrientationIcon,
} from '@kadence/icons';

import {
	KadenceColorOutput,
	showSettings,
	getPreviewSize,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	getFontSizeOptionOutput,
	getBorderStyle,
	getBorderColor,
	getUniqueId,
	getInQueryBlock,
	setBlockDefaults,
	getPostOrFseId,
} from '@kadence/helpers';

/**
 * Block dependencies
 */
import './formats/markformat';
import './formats/typed-text';
import './formats/tooltips';
import AIText from './ai-text/ai-text.js';

import Typed from 'typed.js';

/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
	RichText,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEffect, useState, useRef } from '@wordpress/element';

import {
	ToolbarGroup,
	Spinner,
	SelectControl,
	ToolbarDropdownMenu,
	TextControl,
	ToggleControl,
	TextareaControl,
	Tooltip,
} from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';
import { get } from 'lodash';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

function KadenceAdvancedHeading(props) {
	const { attributes, className, isSelected, setAttributes, mergeBlocks, onReplace, clientId, context } = props;
	const {
		inQueryBlock,
		uniqueID,
		align,
		level,
		content,
		color,
		colorClass,
		enableTextShadow,
		textShadow,
		textShadowTablet,
		textShadowMobile,
		textOrientation,
		tabletTextOrientation,
		mobileTextOrientation,
		mobileAlign,
		tabletAlign,
		size,
		sizeType,
		lineType,
		lineHeight,
		tabLineHeight,
		tabSize,
		mobileSize,
		mobileLineHeight,
		letterSpacing,
		typography,
		fontVariant,
		fontWeight,
		fontStyle,
		fontSubset,
		googleFont,
		loadGoogleFont,
		marginType,
		topMargin,
		bottomMargin,
		markSize,
		markSizeType,
		markLineHeight,
		markLineType,
		markLetterSpacing,
		markTypography,
		markGoogleFont,
		markLoadGoogleFont,
		markFontSubset,
		markFontVariant,
		markFontWeight,
		markFontStyle,
		markPadding,
		markColor,
		markBG,
		markBGOpacity,
		markBorder,
		markBorderWidth,
		markBorderOpacity,
		markBorderStyle,
		anchor,
		textTransform,
		markTextTransform,
		kadenceAnimation,
		kadenceAOSOptions,
		htmlTag,
		leftMargin,
		rightMargin,
		tabletMargin,
		mobileMargin,
		margin,
		padding,
		tabletPadding,
		mobilePadding,
		paddingType,
		markMobilePadding,
		markTabPadding,
		loadItalic,
		kadenceDynamic,
		link,
		linkTarget,
		linkNoFollow,
		linkSponsored,
		background,
		backgroundColorClass,
		linkStyle,
		linkColor,
		linkHoverColor,
		fontSize,
		fontHeight,
		fontHeightType,
		letterSpacingType,
		tabletLetterSpacing,
		mobileLetterSpacing,
		markLetterSpacingType,
		markPaddingType,
		tabletMarkLetterSpacing,
		mobileMarkLetterSpacing,
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles,
		maxWidthType,
		maxWidth,
		maxHeightType,
		maxHeight,
		beforeIcon,
		afterIcon,
		icon,
		iconTitle,
		iconColor,
		iconColorHover,
		iconSide,
		iconVerticalAlign,
		iconPadding,
		tabletIconPadding,
		mobileIconPadding,
		iconSize,
		iconSizeUnit,
		iconPaddingUnit,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		markBorderRadius,
		tabletMarkBorderRadius,
		mobileMarkBorderRadius,
		markBorderRadiusUnit,
		altTitle,
		iconTooltipPlacement,
		iconTooltipDash,
		iconTooltip,
		textGradient,
		enableTextGradient,
		enableMarkGradient,
		enableMarkBackgroundGradient,
		markGradient,
		markBackgroundGradient,
	} = attributes;

	const [activeTab, setActiveTab] = useState('style');
	const [contentRef, setContentRef] = useState();

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData, allowedFormats } = useSelect(
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
				allowedFormats: select('core/rich-text').getFormatTypes(),
			};
		},
		[clientId]
	);

	const { replaceBlocks } = useDispatch('core/block-editor');
	const handlePaste = (event) => {
		const pastedText = event.clipboardData.getData('text/plain');

		const containsBlocks = pastedText && (pastedText.includes('<!-- wp:') || pastedText.includes('wp-block-'));

		if (containsBlocks) {
			const rawBlocks = wp.blocks.rawHandler({ HTML: pastedText });
			replaceBlocks(clientId, rawBlocks);
			event.preventDefault();
		} else if (pastedText && isDefaultEditorBlock) {
			const paragraphs = pastedText.split(/\n\s*\n/).flatMap(paragraph => paragraph.split(/\r\s*/));

			const newBlocks = paragraphs
				.map((paragraph) => {
					const trimmedParagraph = paragraph.trim();
					if (!trimmedParagraph) {
						return null;
					}

					const newAttributes = attributes;
					delete newAttributes.uniqueID;

					return wp.blocks.createBlock('kadence/advancedheading', {
						...newAttributes,
						content: trimmedParagraph,
					});
				})
				.filter(Boolean);

			if (newBlocks.length > 0 && isDefaultEditorBlock) {
				replaceBlocks(clientId, newBlocks);
				event.preventDefault();
			}
		} else if (pastedText && !isDefaultEditorBlock) {
			const rawBlocks = wp.blocks.rawHandler({ HTML: pastedText });
			replaceBlocks(clientId, rawBlocks);
		}
	};

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();
	const config = get(kadence_blocks_params, 'globalSettings') ? JSON.parse(kadence_blocks_params.globalSettings) : {};
	const isDefaultEditorBlock =
		undefined !== config.adv_text_is_default_editor_block && config.adv_text_is_default_editor_block;

	useEffect(() => {
		setBlockDefaults('kadence/advancedheading', attributes);

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

		// Update Old Styles
		if ('' !== topMargin || '' !== rightMargin || '' !== bottomMargin || '' !== leftMargin) {
			setAttributes({
				margin: [topMargin, rightMargin, bottomMargin, leftMargin],
				topMargin: '',
				rightMargin: '',
				bottomMargin: '',
				leftMargin: '',
			});
		}
		// Update Old font Styles
		if (size || tabSize || mobileSize) {
			setAttributes({ fontSize: [size, tabSize, mobileSize], size: '', tabSize: '', mobileSize: '' });
		}
		// Update Old Line height Styles
		if (lineHeight || tabLineHeight || mobileLineHeight) {
			setAttributes({
				fontHeight: [lineHeight, tabLineHeight, mobileLineHeight],
				fontHeightType: lineType,
				lineHeight: '',
				tabLineHeight: '',
				mobileLineHeight: '',
			});
		}

		// Update "regular" to Normal font weight
		if ('regular' === fontWeight) {
			setAttributes({ fontWeight: 'normal' });
		}

		// Update from old border settings.
		const tempBorderStyle = JSON.parse(
			JSON.stringify(
				attributes.markBorderStyles
					? attributes.markBorderStyles
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
		if ('' !== markBorder) {
			tempBorderStyle[0].top[0] = KadenceColorOutput(markBorder, markBorderOpacity);
			tempBorderStyle[0].right[0] = KadenceColorOutput(markBorder, markBorderOpacity);
			tempBorderStyle[0].bottom[0] = KadenceColorOutput(markBorder, markBorderOpacity);
			tempBorderStyle[0].left[0] = KadenceColorOutput(markBorder, markBorderOpacity);
			updateBorderStyle = true;
			setAttributes({ markBorder: '' });
		}
		if ('' !== markBorderWidth && 0 !== markBorderWidth) {
			tempBorderStyle[0].top[2] = markBorderWidth;
			tempBorderStyle[0].right[2] = markBorderWidth;
			tempBorderStyle[0].bottom[2] = markBorderWidth;
			tempBorderStyle[0].left[2] = markBorderWidth;
			updateBorderStyle = true;
			setAttributes({ markBorderWidth: 0 });
		}
		if ('' !== markBorderStyle && 'solid' !== markBorderStyle) {
			tempBorderStyle[0].top[1] = markBorderStyle;
			tempBorderStyle[0].right[1] = markBorderStyle;
			tempBorderStyle[0].bottom[1] = markBorderStyle;
			tempBorderStyle[0].left[1] = markBorderStyle;
			updateBorderStyle = true;
			setAttributes({ markBorderStyle: 'solid' });
		}
		if (updateBorderStyle) {
			setAttributes({ markBorderStyles: tempBorderStyle });
			setAttributes({ tabletMarkBorderStyles: tempBorderStyle });
			setAttributes({ mobileMarkBorderStyles: tempBorderStyle });
		}

		// update enableTextShadow if textShadow[0].enable is true for previous unresponsive setting
		if (!enableTextShadow && textShadow[0].enable) {
			setAttributes({ enableTextShadow: true });
		}
	}, []);

	let newItems;
	const saveShadow = (value) => {
		if (value.enable === 'reset') {
			const resetItems = [
				{
					type: 'array',
					default: [
						{
							enable: false,
							color: '#000000',
							opacity: 0.2,
							blur: 1,
							hOffset: 1,
							vOffset: 1,
						},
					],
					enable: false,
				},
			];
			switch (previewDevice) {
				case 'Desktop':
					setAttributes({ textShadow: resetItems });
					break;
				case 'Tablet':
					setAttributes({ textShadowTablet: resetItems });
					break;
				case 'Mobile':
					setAttributes({ textShadowMobile: resetItems });
					break;
			}
		} else if (previewDevice === 'Desktop') {
			newItems = textShadow.map((item, thisIndex) => {
				if (0 === thisIndex) {
					item = { ...item, ...value };
				}
				return item;
			});
			setAttributes({
				textShadow: newItems,
			});
		} else if (previewDevice === 'Tablet') {
			newItems = textShadowTablet.map((item, thisIndex) => {
				if (0 === thisIndex) {
					item = { ...item, ...value };
				}
				return item;
			});
			setAttributes({
				textShadowTablet: newItems,
			});
		} else if (previewDevice === 'Mobile') {
			newItems = textShadowMobile.map((item, thisIndex) => {
				if (0 === thisIndex) {
					item = { ...item, ...value };
				}
				return item;
			});
			setAttributes({
				textShadowMobile: newItems,
			});
		}
	};

	const isDynamicReplaced =
		undefined !== kadenceDynamic &&
		undefined !== kadenceDynamic.content &&
		undefined !== kadenceDynamic.content.enable &&
		kadenceDynamic.content.enable;
	let richTextFormatsBase = applyFilters(
		'kadence.whitelist_richtext_formats',
		[
			'core/bold',
			'core/italic',
			'kadence/mark',
			'kadence/typed',
			'core/strikethrough',
			'core/superscript',
			'core/superscript',
			'toolset/inline-field',
		],
		'kadence/advancedheading'
	);

	let richTextFormats = allowedFormats.map((format) => format.name);
	if (link || kadenceDynamic?.content?.shouldReplace) {
		richTextFormatsBase = !kadenceDynamic?.content?.shouldReplace
			? [...['kadence/insert-dynamic'], ...richTextFormatsBase]
			: richTextFormatsBase;
		richTextFormats = richTextFormatsBase;
	}

	const renderTypography = typography && !typography.includes(',') ? "'" + typography + "'" : typography;
	const markBGString = markBG ? KadenceColorOutput(markBG, markBGOpacity) : '';
	const markBorderString = markBorder ? KadenceColorOutput(markBorder, markBorderOpacity) : '';
	const textColorClass = getColorClassName('color', colorClass);
	const textBackgroundColorClass = getColorClassName('background-color', backgroundColorClass);
	const tagName = htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level;
	const TagHTML = tagName;

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[0] : '',
		undefined !== tabletMargin ? tabletMargin[0] : '',
		undefined !== mobileMargin ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[1] : '',
		undefined !== tabletMargin ? tabletMargin[1] : '',
		undefined !== mobileMargin ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[2] : '',
		undefined !== tabletMargin ? tabletMargin[2] : '',
		undefined !== mobileMargin ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin ? margin[3] : '',
		undefined !== tabletMargin ? tabletMargin[3] : '',
		undefined !== mobileMargin ? mobileMargin[3] : ''
	);
	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[0] : '',
		undefined !== tabletPadding ? tabletPadding[0] : '',
		undefined !== mobilePadding ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding ? padding[1] : '',
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
		undefined !== padding ? padding[3] : '',
		undefined !== tabletPadding ? tabletPadding[3] : '',
		undefined !== mobilePadding ? mobilePadding[3] : ''
	);
	const previewFontSize = getPreviewSize(
		previewDevice,
		undefined !== fontSize?.[0] ? fontSize[0] : '',
		undefined !== fontSize?.[1] ? fontSize[1] : '',
		undefined !== fontSize?.[2] ? fontSize[2] : ''
	);
	const previewLineHeight = getPreviewSize(
		previewDevice,
		undefined !== fontHeight?.[0] ? fontHeight[0] : '',
		undefined !== fontHeight?.[1] ? fontHeight[1] : '',
		undefined !== fontHeight?.[2] ? fontHeight[2] : ''
	);

	const previewLetterSpacing = getPreviewSize(
		previewDevice,
		undefined !== letterSpacing ? letterSpacing : '',
		undefined !== tabletLetterSpacing ? tabletLetterSpacing : '',
		undefined !== mobileLetterSpacing ? mobileLetterSpacing : ''
	);

	const previewAlign = getPreviewSize(
		previewDevice,
		undefined !== align ? align : '',
		undefined !== tabletAlign ? tabletAlign : '',
		undefined !== mobileAlign ? mobileAlign : ''
	);
	const previewColorTextShadow = getPreviewSize(
		previewDevice,
		undefined !== textShadow?.[0]?.color ? textShadow[0].color : '#000000',
		undefined !== textShadowTablet?.[0]?.color ? textShadowTablet[0].color : '',
		undefined !== textShadowMobile?.[0]?.color ? textShadowMobile[0].color : ''
	);
	function isRGBA(color) {
		const rgbaRegex = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\s*\)/;
		return rgbaRegex.test(color);
	}
	const parseOpacityFromRGBA = (color, defaultOpacity = 0.2) => {
		// Check if color is in rgba() format
		const rgbaRegex = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\s*\)/;
		const match = color?.match(rgbaRegex);

		if (match && match[4]) {
			// Extract and return the alpha value (opacity) from rgba
			return parseFloat(match[4]);
		}

		// If not rgba or alpha is missing, return default opacity
		return defaultOpacity;
	};
	const previewTextShadowOpacity = getPreviewSize(
		previewDevice,
		undefined !== textShadow?.[0]?.opacity ? textShadow[0].opacity : parseOpacityFromRGBA(textShadow?.[0]?.color),
		undefined !== textShadowTablet?.[0]?.opacity
			? textShadowTablet[0].opacity
			: parseOpacityFromRGBA(textShadowTablet?.[0]?.color, ''),
		undefined !== textShadowMobile?.[0]?.opacity
			? textShadowMobile[0].opacity
			: parseOpacityFromRGBA(textShadowMobile?.[0]?.color, '')
	);
	const previewHOffset = getPreviewSize(
		previewDevice,
		undefined !== textShadow?.[0]?.hOffset ? textShadow[0].hOffset : 1,
		undefined !== textShadowTablet?.[0]?.hOffset ? textShadowTablet[0].hOffset : '',
		undefined !== textShadowMobile?.[0]?.hOffset ? textShadowMobile[0].hOffset : ''
	);
	const previewVOffset = getPreviewSize(
		previewDevice,
		undefined !== textShadow?.[0]?.vOffset ? textShadow[0].vOffset : 1,
		undefined !== textShadowTablet?.[0]?.vOffset ? textShadowTablet[0].vOffset : '',
		undefined !== textShadowMobile?.[0]?.vOffset ? textShadowMobile[0].vOffset : ''
	);
	const previewBlur = getPreviewSize(
		previewDevice,
		undefined !== textShadow?.[0]?.blur ? textShadow[0].blur : 1,
		undefined !== textShadowTablet?.[0]?.blur ? textShadowTablet[0].blur : '',
		undefined !== textShadowMobile?.[0]?.blur ? textShadowMobile[0].blur : ''
	);
	let previewJustifyAlign = previewAlign;
	switch (previewAlign) {
		case 'left':
			previewJustifyAlign = 'flex-start';
			break;
		case 'right':
			previewJustifyAlign = 'flex-end';
			break;
	}
	const previewMarkPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[0] : 0,
		undefined !== markTabPadding ? markTabPadding[0] : '',
		undefined !== markMobilePadding ? markMobilePadding[0] : ''
	);
	const previewMarkPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[1] : 0,
		undefined !== markTabPadding ? markTabPadding[1] : '',
		undefined !== markMobilePadding ? markMobilePadding[1] : ''
	);
	const previewMarkPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[2] : 0,
		undefined !== markTabPadding ? markTabPadding[2] : '',
		undefined !== markMobilePadding ? markMobilePadding[2] : ''
	);
	const previewMarkPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== markPadding ? markPadding[3] : 0,
		undefined !== markTabPadding ? markTabPadding[3] : '',
		undefined !== markMobilePadding ? markMobilePadding[3] : ''
	);
	const previewMarkSize = getPreviewSize(
		previewDevice,
		undefined !== markSize ? markSize[0] : '',
		undefined !== markSize ? markSize[1] : '',
		undefined !== markSize ? markSize[2] : ''
	);
	const previewMarkLineHeight = getPreviewSize(
		previewDevice,
		undefined !== markLineHeight ? markLineHeight[0] : '',
		undefined !== markLineHeight ? markLineHeight[1] : '',
		undefined !== markLineHeight ? markLineHeight[2] : ''
	);

	const previewIconSize = getPreviewSize(
		previewDevice,
		undefined !== iconSize?.[0] ? iconSize[0] : '',
		undefined !== iconSize?.[1] ? iconSize[1] : '',
		undefined !== iconSize?.[2] ? iconSize[2] : ''
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

	const previewMarkLetterSpacing = getPreviewSize(
		previewDevice,
		undefined !== markLetterSpacing ? markLetterSpacing : '',
		undefined !== tabletMarkLetterSpacing ? tabletMarkLetterSpacing : '',
		undefined !== mobileMarkLetterSpacing ? mobileMarkLetterSpacing : ''
	);

	const previewMaxWidth = getPreviewSize(
		previewDevice,
		maxWidth && maxWidth[0] ? maxWidth[0] : '',
		maxWidth && maxWidth[1] ? maxWidth[1] : '',
		maxWidth && maxWidth[2] ? maxWidth[2] : ''
	);

	const previewMaxHeight = getPreviewSize(
		previewDevice,
		maxHeight && maxHeight[0] ? maxHeight[0] : '',
		maxHeight && maxHeight[1] ? maxHeight[1] : '',
		maxHeight && maxHeight[2] ? maxHeight[2] : ''
	);

	const previewMarkBorderTopStyle = getBorderStyle(
		previewDevice,
		'top',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);
	const previewMarkBorderRightStyle = getBorderStyle(
		previewDevice,
		'right',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);
	const previewMarkBorderBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);
	const previewMarkBorderLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		markBorderStyles,
		tabletMarkBorderStyles,
		mobileMarkBorderStyles
	);

	const previewBorderTop = getBorderStyle(previewDevice, 'top', borderStyle, tabletBorderStyle, mobileBorderStyle);
	const previewBorderRight = getBorderStyle(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderBottom = getBorderStyle(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderLeft = getBorderStyle(previewDevice, 'left', borderStyle, tabletBorderStyle, mobileBorderStyle);
	// const previewBorderTopColor = getBorderColor( previewDevice, 'top', borderStyle, tabletBorderStyle, mobileBorderStyle );
	// const previewBorderRightColor = getBorderColor( previewDevice, 'right', borderStyle, tabletBorderStyle, mobileBorderStyle );
	// const previewBorderBottomColor = getBorderColor( previewDevice, 'bottom', borderStyle, tabletBorderStyle, mobileBorderStyle );
	// const previewBorderLeftColor = getBorderColor( previewDevice, 'left', borderStyle, tabletBorderStyle, mobileBorderStyle );

	const previewBorderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[0] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[0] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[0] : ''
	);
	const previewBorderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[1] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[1] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[1] : ''
	);
	const previewBorderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[2] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[2] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[2] : ''
	);
	const previewBorderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== borderRadius ? borderRadius[3] : '',
		undefined !== tabletBorderRadius ? tabletBorderRadius[3] : '',
		undefined !== mobileBorderRadius ? mobileBorderRadius[3] : ''
	);

	const previewMarkBorderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[0] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[0] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[0] : ''
	);
	const previewMarkBorderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[1] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[1] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[1] : ''
	);
	const previewMarkBorderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[2] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[2] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[2] : ''
	);
	const previewMarkBorderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== markBorderRadius ? markBorderRadius[3] : '',
		undefined !== tabletMarkBorderRadius ? tabletMarkBorderRadius[3] : '',
		undefined !== mobileMarkBorderRadius ? mobileMarkBorderRadius[3] : ''
	);
	const previewTextOrientation = getPreviewSize(
		previewDevice,
		undefined !== textOrientation ? textOrientation : '',
		undefined !== tabletTextOrientation ? tabletTextOrientation : '',
		undefined !== mobileTextOrientation ? mobileTextOrientation : ''
	);
	const markBorderRadiusUnitPreview = undefined !== markBorderRadiusUnit ? markBorderRadiusUnit : 'px';
	let backgroundIgnoreClass = backgroundColorClass ? false : true;
	if (!backgroundIgnoreClass && !kadence_blocks_params.isKadenceT && background && background.startsWith('palette')) {
		backgroundIgnoreClass = true;
	}
	const headingOptions = [
		[
			{
				icon: (
					<HeadingLevelIcon
						level={1}
						isPressed={1 === level && htmlTag && htmlTag === 'heading' ? true : false}
					/>
				),
				title: __('Heading 1', 'kadence-blocks'),
				isActive: 1 === level && htmlTag && htmlTag === 'heading' ? true : false,
				onClick: () => setAttributes({ level: 1, htmlTag: 'heading' }),
			},
		],
		[
			{
				icon: (
					<HeadingLevelIcon
						level={2}
						isPressed={2 === level && htmlTag && htmlTag === 'heading' ? true : false}
					/>
				),
				title: __('Heading 2', 'kadence-blocks'),
				isActive: 2 === level && htmlTag && htmlTag === 'heading' ? true : false,
				onClick: () => setAttributes({ level: 2, htmlTag: 'heading' }),
			},
		],
		[
			{
				icon: (
					<HeadingLevelIcon
						level={3}
						isPressed={3 === level && htmlTag && htmlTag === 'heading' ? true : false}
					/>
				),
				title: __('Heading 3', 'kadence-blocks'),
				isActive: 3 === level && htmlTag && htmlTag === 'heading' ? true : false,
				onClick: () => setAttributes({ level: 3, htmlTag: 'heading' }),
			},
		],
		[
			{
				icon: (
					<HeadingLevelIcon
						level={4}
						isPressed={4 === level && htmlTag && htmlTag === 'heading' ? true : false}
					/>
				),
				title: __('Heading 4', 'kadence-blocks'),
				isActive: 4 === level && htmlTag && htmlTag === 'heading' ? true : false,
				onClick: () => setAttributes({ level: 4, htmlTag: 'heading' }),
			},
		],
		[
			{
				icon: (
					<HeadingLevelIcon
						level={5}
						isPressed={5 === level && htmlTag && htmlTag === 'heading' ? true : false}
					/>
				),
				title: __('Heading 5', 'kadence-blocks'),
				isActive: 5 === level && htmlTag && htmlTag === 'heading' ? true : false,
				onClick: () => setAttributes({ level: 5, htmlTag: 'heading' }),
			},
		],
		[
			{
				icon: (
					<HeadingLevelIcon
						level={6}
						isPressed={6 === level && htmlTag && htmlTag === 'heading' ? true : false}
					/>
				),
				title: __('Heading 6', 'kadence-blocks'),
				isActive: 6 === level && htmlTag && htmlTag === 'heading' ? true : false,
				onClick: () => setAttributes({ level: 6, htmlTag: 'heading' }),
			},
		],
		[
			{
				icon: <HeadingLevelIcon level={'p'} isPressed={htmlTag && htmlTag === 'p' ? true : false} />,
				title: __('Paragraph', 'kadence-blocks'),
				isActive: htmlTag && htmlTag === 'p' ? true : false,
				onClick: () => setAttributes({ htmlTag: 'p' }),
			},
		],
		[
			{
				icon: <HeadingLevelIcon level={'span'} isPressed={htmlTag && htmlTag === 'span' ? true : false} />,
				title: __('Span', 'kadence-blocks'),
				isActive: htmlTag && htmlTag === 'span' ? true : false,
				onClick: () => setAttributes({ htmlTag: 'span' }),
			},
		],
		[
			{
				icon: <HeadingLevelIcon level={'div'} isPressed={htmlTag && htmlTag === 'div' ? true : false} />,
				title: __('div', 'kadence-blocks'),
				isActive: htmlTag && htmlTag === 'div' ? true : false,
				onClick: () => setAttributes({ htmlTag: 'div' }),
			},
		],
	];

	const classes = classnames({
		[`kt-adv-heading${uniqueID}`]: uniqueID,
		'kadence-advancedheading-text': true,
		'kb-content-is-dynamic': isDynamicReplaced,
		[textColorClass]: textColorClass,
		'has-text-color': textColorClass,
		[textBackgroundColorClass]: textBackgroundColorClass,
		'has-background': textBackgroundColorClass,
		[`hls-${linkStyle}`]: !link && linkStyle,
		[`kt-adv-heading-has-icon`]: icon,
	});
	const renderIcon = () => {
		if (!icon) {
			return null;
		}

		return (
			<Tooltip
				text={iconTooltip ? iconTooltip : undefined}
				className="kb-custom-tooltip"
				placement={iconTooltipPlacement || 'top'}
			>
				<span
					className={`kb-advanced-heading-icon-wrap${iconTooltipDash ? ' kb-adv-text-icon-dash' : ''}`}
					style={{
						display: 'inline-flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<IconRender
						className={`kb-advanced-heading-svg-icon kb-advanced-heading-svg-icon-${icon} kb-advanced-heading-icon-side-${iconSide}`}
						name={icon}
						size={'1em'}
						style={{
							fontSize: previewIconSize
								? getFontSizeOptionOutput(
										previewIconSize,
										undefined !== iconSizeUnit ? iconSizeUnit : 'px'
								  )
								: undefined,
							color: '' !== iconColor ? KadenceColorOutput(iconColor) : undefined,
							paddingTop: previewIconPaddingTop
								? getSpacingOptionOutput(previewIconPaddingTop, iconPaddingUnit)
								: undefined,
							paddingRight: previewIconPaddingRight
								? getSpacingOptionOutput(previewIconPaddingRight, iconPaddingUnit)
								: undefined,
							paddingBottom: previewIconPaddingBottom
								? getSpacingOptionOutput(previewIconPaddingBottom, iconPaddingUnit)
								: undefined,
							paddingLeft: previewIconPaddingLeft
								? getSpacingOptionOutput(previewIconPaddingLeft, iconPaddingUnit)
								: undefined,
						}}
					/>
				</span>
			</Tooltip>
		);
	};

	const headingContent = (
		<TagHTML
			className={classes}
			data-alt-title={altTitle ? altTitle : undefined}
			style={{
				display: icon ? 'flex' : undefined,
				alignItems: icon ? iconVerticalAlign : undefined,
				gap: icon ? '0.25em' : undefined,
				justifyContent: icon && previewJustifyAlign ? previewJustifyAlign : undefined,
				textAlign: previewAlign ? previewAlign : undefined,
				backgroundColor:
					!enableTextGradient && background && backgroundIgnoreClass
						? KadenceColorOutput(background)
						: undefined,
				backgroundImage: enableTextGradient && textGradient !== '' ? textGradient : undefined,
				paddingTop:
					'' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingType) : undefined,
				paddingRight:
					'' !== previewPaddingRight ? getSpacingOptionOutput(previewPaddingRight, paddingType) : undefined,
				paddingBottom:
					'' !== previewPaddingBottom ? getSpacingOptionOutput(previewPaddingBottom, paddingType) : undefined,
				paddingLeft:
					'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingType) : undefined,
				marginTop: '' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginType) : undefined,
				marginRight:
					'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginType) : undefined,
				marginBottom:
					'' !== previewMarginBottom ? getSpacingOptionOutput(previewMarginBottom, marginType) : undefined,
				marginLeft:
					'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginType) : undefined,
				lineHeight: previewLineHeight ? previewLineHeight + (fontHeightType ? fontHeightType : '') : undefined,
				color: color && (!enableTextGradient || textGradient !== '') ? KadenceColorOutput(color) : undefined,
				fontSize: previewFontSize
					? getFontSizeOptionOutput(previewFontSize, sizeType ? sizeType : 'px')
					: undefined,
				borderTopLeftRadius: previewBorderRadiusTop + borderRadiusUnit,
				borderTopRightRadius: previewBorderRadiusRight + borderRadiusUnit,
				borderBottomRightRadius: previewBorderRadiusBottom + borderRadiusUnit,
				borderBottomLeftRadius: previewBorderRadiusLeft + borderRadiusUnit,
				borderTop: previewBorderTop ? previewBorderTop : undefined,
				borderRight: previewBorderRight ? previewBorderRight : undefined,
				borderBottom: previewBorderBottom ? previewBorderBottom : undefined,
				borderLeft: previewBorderLeft ? previewBorderLeft : undefined,
			}}
		>
			{iconSide === 'left' && renderIcon()}

			{!isDynamicReplaced && (
				<RichText
					id={'adv-heading' + uniqueID}
					tagName="span"
					className={'kb-adv-heading-inner'}
					allowedFormats={richTextFormats}
					value={content}
					onChange={(value) => setAttributes({ content: value })}
					onMerge={mergeBlocks}
					onSplit={(value) => {
						if (!value && !isDefaultEditorBlock) {
							return createBlock('core/paragraph');
						}
						return createBlock('kadence/advancedheading', {
							...attributes,
							content: value ?? '',
						});
					}}
					onReplace={onReplace}
					onRemove={() => onReplace([])}
					style={{
						fontWeight,
						fontStyle,
						letterSpacing: previewLetterSpacing
							? previewLetterSpacing + (letterSpacingType ? letterSpacingType : 'px')
							: undefined,
						textTransform: textTransform ? textTransform : undefined,
						fontFamily: typography ? renderTypography : '',
						textShadow: enableTextShadow
							? `${previewHOffset}px ${previewVOffset}px ${previewBlur}px ${
									isRGBA(previewColorTextShadow)
										? KadenceColorOutput(previewColorTextShadow) // If rgba, use the color as is
										: KadenceColorOutput(previewColorTextShadow, previewTextShadowOpacity) // Otherwise, apply opacity
							  }`
							: undefined,

						writingMode:
							previewTextOrientation === 'stacked' || previewTextOrientation === 'sideways-down'
								? 'vertical-lr'
								: previewTextOrientation === 'sideways-up'
								? 'sideways-lr'
								: '',
						textOrientation: previewTextOrientation === 'stacked' ? 'upright' : '',
						maxHeight: textOrientation !== 'horizontal' && textOrientation !== '' ? previewMaxHeight : '',
					}}
					placeholder={__('Write something…', 'kadence-blocks')}
					isSelected={isSelected}
					onPaste={handlePaste}
				/>
			)}
			{isDynamicReplaced && (
				<>
					{applyFilters('kadence.dynamicContent', <Spinner />, attributes, 'content', setAttributes, context)}
				</>
			)}

			{iconSide === 'right' && renderIcon()}
		</TagHTML>
	);

	const headingLinkContent = (
		<a
			href={link}
			className={`kb-advanced-heading-link${linkStyle ? ' hls-' + linkStyle : ''}`}
			onClick={(event) => {
				event.preventDefault();
			}}
		>
			{headingContent}
		</a>
	);
	const wrapperClasses = classnames({
		'kb-is-heading': htmlTag && htmlTag === 'heading',
		'kb-adv-text': true,
	});
	const nonTransAttrs = ['content', 'altTitle'];
	const blockProps = useBlockProps({
		className: wrapperClasses,
	});

	function sanitizeString(input) {
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2F;',
		};
		const reg = /[&<>"'/]/gi;
		return input.replace(reg, (match) => map[match]);
	}

	const typed = useRef(null);
	useEffect(() => {
		if (!isSelected && undefined !== attributes.content && attributes.content.includes('kt-typed-text')) {
			const parser = new DOMParser();
			const contentHtml = parser.parseFromString(attributes.content, 'text/html');

			if (contentHtml.querySelectorAll('.kt-typed-text')[0]) {
				const typedElement = contentHtml.querySelectorAll('.kt-typed-text')[0];
				const dataStrings = typedElement.getAttribute('data-strings');
				const strings = dataStrings ? JSON.parse(dataStrings.replaceAll('&', '&amp;')) : [];

				// Adding the default/existing string twice is required for displaying properly
				strings.unshift(typedElement.textContent.replaceAll('&', '&amp;'));
				strings.unshift(typedElement.textContent.replaceAll('&', '&amp;'));

				const options = {
					strings,
					cursorChar: typedElement.getAttribute('data-cursor-char')
						? sanitizeString(typedElement.getAttribute('data-cursor-char'))
						: '_',
					startDelay: typedElement.getAttribute('data-start-delay')
						? parseInt(typedElement.getAttribute('data-start-delay'))
						: 0,
					backDelay: typedElement.getAttribute('data-back-delay')
						? parseInt(typedElement.getAttribute('data-back-delay'))
						: 700,
					typeSpeed: typedElement.getAttribute('data-type-speed')
						? parseInt(typedElement.getAttribute('data-type-speed'))
						: 40,
					backSpeed: typedElement.getAttribute('data-back-speed')
						? parseInt(typedElement.getAttribute('data-back-speed'))
						: 0,
					smartBackspace: typedElement.getAttribute('data-smart-backspace') === 'true',
					loop: typedElement.getAttribute('data-loop') !== 'false',
					loopCount: false,
					showCursor: typedElement.getAttribute('data-cursor-char') !== '',
					shuffle: typedElement.getAttribute('data-shuffle') === 'true',
				};

				const iFrameSelector = document.getElementsByName('editor-canvas');
				const selector =
					iFrameSelector.length > 0
						? document.getElementsByName('editor-canvas')[0].contentWindow.document
						: document;
				const typedElementHtml = selector
					.getElementById('adv-heading' + uniqueID)
					.querySelector('.kt-typed-text');

				typed.current = new Typed(typedElementHtml, options);
			}

			return function cleanup() {
				// Destroy the typed instance and reset richtext content
				typed.current.destroy();

				const iFrameSelector = document.getElementsByName('editor-canvas');
				const selector =
					iFrameSelector.length > 0
						? document.getElementsByName('editor-canvas')[0].contentWindow.document
						: document;
				if (selector.getElementById('adv-heading' + uniqueID)) {
					selector.getElementById('adv-heading' + uniqueID).innerHTML = attributes.content;
				}
			};
		}
	}, [isSelected]);
	return (
		<div {...blockProps}>
			<style>
				{`.kt-adv-heading${uniqueID} mark.kt-highlight, .kt-adv-heading${uniqueID} .rich-text:focus mark.kt-highlight[data-rich-text-format-boundary] {
						color: ${!enableMarkGradient ? KadenceColorOutput(markColor) : 'transparent'};
						background: ${markBG && !enableMarkGradient ? markBGString : 'transparent'};
						background-image: ${enableMarkGradient ? markGradient : enableMarkBackgroundGradient ? markBackgroundGradient : 'none'};
						-webkit-background-clip: ${enableMarkGradient ? 'text' : enableTextGradient ? 'initial !important' : undefined};
						background-clip: ${enableMarkGradient ? 'text' : enableTextGradient ? 'initial !important' : undefined};
						-webkit-text-fill-color: ${enableMarkGradient ? 'transparent' : enableTextGradient ? 'initial !important' : undefined};
						-webkit-box-decoration-break: clone;
						box-decoration-break: clone;
						font-weight: ${markFontWeight ? markFontWeight : 'inherit'};
						font-style: ${markFontStyle ? markFontStyle : 'inherit'};
						font-size: ${previewMarkSize ? getFontSizeOptionOutput(previewMarkSize, markSizeType) : 'inherit'};
						line-height: ${previewMarkLineHeight ? previewMarkLineHeight + markLineType : 'inherit'};
						letter-spacing: ${
							previewMarkLetterSpacing
								? previewMarkLetterSpacing + (markLetterSpacingType ? markLetterSpacingType : 'px')
								: 'inherit'
						};
						text-transform: ${markTextTransform ? markTextTransform : 'inherit'};
						font-family: ${markTypography ? markTypography : 'inherit'};
						border-top: ${previewMarkBorderTopStyle ? previewMarkBorderTopStyle : 'inherit'};
						border-right: ${previewMarkBorderRightStyle ? previewMarkBorderRightStyle : 'inherit'};
						border-bottom: ${previewMarkBorderBottomStyle ? previewMarkBorderBottomStyle : 'inherit'};
						border-left: ${previewMarkBorderLeftStyle ? previewMarkBorderLeftStyle : 'inherit'};
						padding-top: ${previewMarkPaddingTop ? getSpacingOptionOutput(previewMarkPaddingTop, markPaddingType) : '0'};
						padding-right: ${previewMarkPaddingRight ? getSpacingOptionOutput(previewMarkPaddingRight, markPaddingType) : '0'};
						padding-bottom: ${previewMarkPaddingBottom ? getSpacingOptionOutput(previewMarkPaddingBottom, markPaddingType) : '0'};
						padding-left: ${previewMarkPaddingLeft ? getSpacingOptionOutput(previewMarkPaddingLeft, markPaddingType) : '0'};
						${
							'' !== previewMarkBorderRadiusTop
								? 'border-top-left-radius:' +
								  previewMarkBorderRadiusTop +
								  markBorderRadiusUnitPreview +
								  ';'
								: ''
						}
						${
							'' !== previewMarkBorderRadiusRight
								? 'border-top-right-radius:' +
								  previewMarkBorderRadiusRight +
								  markBorderRadiusUnitPreview +
								  ';'
								: ''
						}
						${
							'' !== previewMarkBorderRadiusBottom
								? 'border-bottom-right-radius:' +
								  previewMarkBorderRadiusBottom +
								  markBorderRadiusUnitPreview +
								  ';'
								: ''
						}
						${
							'' !== previewMarkBorderRadiusLeft
								? 'border-bottom-left-radius:' +
								  previewMarkBorderRadiusLeft +
								  markBorderRadiusUnitPreview +
								  ';'
								: ''
						}
					}`}
				{previewMaxWidth
					? `.editor-styles-wrapper *:not(.kadence-inner-column-direction-horizontal) > .wp-block-kadence-advancedheading .kt-adv-heading${uniqueID}, .editor-styles-wrapper .kadence-inner-column-direction-horizontal > .wp-block-kadence-advancedheading[data-block="${clientId}"] { max-width:${
							previewMaxWidth + (maxWidthType ? maxWidthType : 'px')
					  } !important; }`
					: ''}
				{previewMaxWidth && previewAlign === 'center'
					? `.editor-styles-wrapper *:not(.kadence-inner-column-direction-horizontal) > .wp-block-kadence-advancedheading .kt-adv-heading${uniqueID}, .editor-styles-wrapper .kadence-inner-column-direction-horizontal > .wp-block-kadence-advancedheading[data-block="${clientId}"] { margin-left: auto; margin-right:auto; }`
					: ''}
				{previewMaxWidth && previewAlign === 'right'
					? `.editor-styles-wrapper *:not(.kadence-inner-column-direction-horizontal) > .wp-block-kadence-advancedheading .kt-adv-heading${uniqueID}, .editor-styles-wrapper .kadence-inner-column-direction-horizontal > .wp-block-kadence-advancedheading[data-block="${clientId}"] { margin-left: auto; margin-right:0; }`
					: ''}
				{linkStyle &&
					`.kt-adv-heading${uniqueID} a, #block-${clientId} a {
							${linkStyle === 'underline' ? 'text-decoration: underline;' : ''}
							${linkStyle === 'none' ? 'text-decoration: none;' : ''}
					}
					.kt-adv-heading${uniqueID} a, #block-${clientId} a:hover {
							${linkStyle === 'hover_underline' ? 'text-decoration: underline;' : ''}
					}
					`}
				{linkColor &&
					`.kt-adv-heading${uniqueID} a, #block-${clientId} a.kb-advanced-heading-link, #block-${clientId} a.kb-advanced-heading-link > .kadence-advancedheading-text {
							color: ${KadenceColorOutput(linkColor)} !important;
						}`}
				{linkHoverColor &&
					`.kt-adv-heading${uniqueID} a:hover, #block-${clientId} a.kb-advanced-heading-link:hover, #block-${clientId} a.kb-advanced-heading-link:hover > .kadence-advancedheading-text {
							color: ${KadenceColorOutput(linkHoverColor)}!important;
						}`}
				{enableTextGradient &&
					textGradient !== '' &&
					`.kt-adv-heading${uniqueID}.kadence-advancedheading-text, .kt-adv-heading${uniqueID} .kadence-advancedheading-text {
						-webkit-background-clip: text;
						background-clip: text;
						-webkit-text-fill-color: transparent;
						-webkit-box-decoration-break: clone;
				}`}
				{iconColorHover &&
					`#block-${clientId} .kadence-advancedheading-text:hover > .kb-advanced-heading-svg-icon {
							color: ${KadenceColorOutput(iconColorHover)}!important;
						}`}
				{enableTextGradient &&
					`.kt-adv-heading${uniqueID} > span#adv-heading${uniqueID} {
						background-image: ${textGradient};
						-webkit-background-clip: text;
						background-clip: text;
						-webkit-text-fill-color: transparent;
						-webkit-box-decoration-break: clone;
						box-decoration-break: clone;
						display: inline;
					}`}
			</style>
			<BlockControls>
				<ToolbarGroup group="tag">
					<ToolbarDropdownMenu
						icon={<HeadingLevelIcon level={htmlTag !== 'heading' ? htmlTag : level} />}
						label={__('Change heading tag', 'kadence-blocks')}
						controls={headingOptions}
					/>
				</ToolbarGroup>
				{showSettings('allSettings', 'kadence/advancedheading') &&
					showSettings('toolbarTypography', 'kadence/advancedheading', false) && (
						<InlineTypographyControls
							uniqueID={uniqueID}
							fontGroup={'heading'}
							letterSpacing={letterSpacing}
							onLetterSpacing={(value) => setAttributes({ letterSpacing: value })}
							fontFamily={typography}
							onFontFamily={(value) => setAttributes({ typography: value })}
							onFontChange={(select) => {
								setAttributes({
									typography: select.value,
									googleFont: select.google,
								});
							}}
							googleFont={googleFont}
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
							fontSizeArray={false}
							fontSizeType={sizeType}
							onFontSizeType={(value) => setAttributes({ sizeType: value })}
							lineHeightType={fontHeightType}
							onLineHeightType={(value) => setAttributes({ fontHeightType: value })}
							fontSize={undefined !== fontSize?.[0] ? fontSize[0] : ''}
							onFontSize={(value) =>
								setAttributes({
									fontSize: [
										value,
										undefined !== fontSize[1] ? fontSize[1] : '',
										undefined !== fontSize[2] ? fontSize[2] : '',
									],
								})
							}
							tabSize={undefined !== fontSize?.[1] ? fontSize[1] : ''}
							onTabSize={(value) =>
								setAttributes({
									fontSize: [
										undefined !== fontSize[0] ? fontSize[0] : '',
										value,
										undefined !== fontSize[2] ? fontSize[2] : '',
									],
								})
							}
							mobileSize={undefined !== fontSize?.[2] ? fontSize[2] : ''}
							onMobileSize={(value) =>
								setAttributes({
									fontSize: [
										undefined !== fontSize[0] ? fontSize[0] : '',
										undefined !== fontSize[1] ? fontSize[1] : '',
										value,
									],
								})
							}
							lineHeight={undefined !== fontHeight?.[0] ? fontHeight[0] : ''}
							onLineHeight={(value) =>
								setAttributes({
									fontHeight: [
										value,
										undefined !== fontHeight[1] ? fontHeight[1] : '',
										undefined !== fontHeight[2] ? fontHeight[2] : '',
									],
								})
							}
							tabLineHeight={undefined !== fontHeight?.[1] ? fontHeight[1] : ''}
							onTabLineHeight={(value) =>
								setAttributes({
									fontHeight: [
										undefined !== fontHeight[0] ? fontHeight[0] : '',
										value,
										undefined !== fontHeight[2] ? fontHeight[2] : '',
									],
								})
							}
							mobileLineHeight={undefined !== fontHeight?.[2] ? fontHeight[2] : ''}
							onMobileLineHeight={(value) =>
								setAttributes({
									fontHeight: [
										undefined !== fontHeight[0] ? fontHeight[0] : '',
										undefined !== fontHeight[1] ? fontHeight[1] : '',
										value,
									],
								})
							}
						/>
					)}
				{showSettings('allSettings', 'kadence/advancedheading') &&
					showSettings('toolbarColor', 'kadence/advancedheading', false) && (
						<InlinePopColorControl
							label={__('Color', 'kadence-blocks')}
							value={color ? color : ''}
							default={''}
							onChange={(value) => setAttributes({ color: value })}
							onClassChange={(value) => setAttributes({ colorClass: value })}
						/>
					)}
				<AlignmentToolbar
					value={align}
					onChange={(nextAlign) => {
						setAttributes({ align: nextAlign });
					}}
				/>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				{Boolean(kadenceDynamic?.content?.shouldReplace) && (
					<DynamicTextControl dynamicAttribute={'content'} {...props} />
				)}
			</BlockControls>
			{showSettings('allSettings', 'kadence/advancedheading') && (
				<InspectorControls>
					<InspectorControlTabs
						panelName={'advancedheading'}
						initialOpen={'style'}
						setActiveTab={(value) => setActiveTab(value)}
						activeTab={activeTab}
					/>

					{activeTab === 'general' && (
						<>
							<KadencePanelBody panelName={'kb-adv-heading-general-settings'}>
								<TagSelect
									label={__('HTML Tag', 'kadence-blocks')}
									value={'heading' === htmlTag ? level : htmlTag}
									onChange={(value) => {
										if ('div' === value || 'p' === value || 'span' === value) {
											setAttributes({ level: 2, htmlTag: value });
										} else {
											setAttributes({ level: value, htmlTag: 'heading' });
										}
									}}
								/>
								<ResponsiveAlignControls
									label={__('Text Alignment', 'kadence-blocks')}
									value={align ? align : ''}
									mobileValue={mobileAlign ? mobileAlign : ''}
									tabletValue={tabletAlign ? tabletAlign : ''}
									onChange={(nextAlign) => setAttributes({ align: nextAlign })}
									onChangeTablet={(nextAlign) => setAttributes({ tabletAlign: nextAlign })}
									onChangeMobile={(nextAlign) => setAttributes({ mobileAlign: nextAlign })}
								/>
								<ResponsiveRangeControls
									reset={() => {
										setAttributes({
											maxWidth: ['', '', ''],
											maxWidthType: 'px',
										});
									}}
									label={__('Max Width', 'kadence-blocks')}
									value={undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : ''}
									onChange={(value) => {
										setAttributes({
											maxWidth: [
												value,
												undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
												undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
											],
										});
									}}
									tabletValue={undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : ''}
									onChangeTablet={(value) => {
										setAttributes({
											maxWidth: [
												undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
												value,
												undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : '',
											],
										});
									}}
									mobileValue={undefined !== maxWidth && undefined !== maxWidth[2] ? maxWidth[2] : ''}
									onChangeMobile={(value) => {
										setAttributes({
											maxWidth: [
												undefined !== maxWidth && undefined !== maxWidth[0] ? maxWidth[0] : '',
												undefined !== maxWidth && undefined !== maxWidth[1] ? maxWidth[1] : '',
												value,
											],
										});
									}}
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
							{showSettings('linkSettings', 'kadence/advancedheading') && (
								<KadencePanelBody
									title={__('Link Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-adv-heading-link-settings'}
								>
									<PopColorControl
										label={__('Link Color', 'kadence-blocks')}
										swatchLabel={__('Link Color', 'kadence-blocks')}
										value={linkColor ? linkColor : ''}
										default={''}
										onChange={(value) => setAttributes({ linkColor: value })}
										swatchLabel2={__('Hover Color', 'kadence-blocks')}
										value2={linkHoverColor ? linkHoverColor : ''}
										default2={''}
										onChange2={(value) => setAttributes({ linkHoverColor: value })}
									/>
									<SelectControl
										label={__('Link Style', 'kadence-blocks')}
										value={linkStyle}
										options={[
											{ value: '', label: __('Unset', 'kadence-blocks') },
											{ value: 'none', label: __('None', 'kadence-blocks') },
											{ value: 'underline', label: __('Underline', 'kadence-blocks') },
											{
												value: 'hover_underline',
												label: __('Underline on Hover', 'kadence-blocks'),
											},
										]}
										onChange={(value) => setAttributes({ linkStyle: value })}
									/>
									<URLInputControl
										label={__('Text Wrap Link', 'kadence-blocks')}
										url={link}
										onChangeUrl={(value) => setAttributes({ link: value })}
										additionalControls={true}
										opensInNewTab={undefined !== linkTarget ? linkTarget : false}
										onChangeTarget={(value) => setAttributes({ linkTarget: value })}
										linkNoFollow={undefined !== linkNoFollow ? linkNoFollow : false}
										onChangeFollow={(value) => setAttributes({ linkNoFollow: value })}
										linkSponsored={undefined !== linkSponsored ? linkSponsored : false}
										onChangeSponsored={(value) => setAttributes({ linkSponsored: value })}
										dynamicAttribute={'link'}
										allowClear={true}
										{...props}
									/>
								</KadencePanelBody>
							)}
						</>
					)}

					{activeTab === 'style' && (
						<>
							<KadencePanelBody panelName={'kb-adv-heading-style'}>
								{showSettings('colorSettings', 'kadence/advancedheading') && (
									<>
										{!enableTextGradient && (
											<ColorGroup>
												<PopColorControl
													label={__('Color', 'kadence-blocks')}
													value={color ? color : ''}
													default={''}
													onChange={(value) => setAttributes({ color: value })}
													onClassChange={(value) => setAttributes({ colorClass: value })}
												/>
												<PopColorControl
													label={__('Background Color', 'kadence-blocks')}
													value={background ? background : ''}
													default={''}
													onChange={(value) => setAttributes({ background: value })}
													onClassChange={(value) =>
														setAttributes({ backgroundColorClass: value })
													}
												/>
											</ColorGroup>
										)}
										<ToggleControl
											style={{ marginTop: '10px' }}
											label={__('Enable Text Gradient', 'kadence-blocks')}
											checked={enableTextGradient}
											onChange={(value) => setAttributes({ enableTextGradient: value })}
										/>

										{enableTextGradient && (
											<GradientControl
												value={textGradient}
												onChange={(value) => setAttributes({ textGradient: value })}
												gradients={[]}
											/>
										)}
									</>
								)}
								{showSettings('sizeSettings', 'kadence/advancedheading') && (
									<>
										<ResponsiveFontSizeControl
											label={__('Font Size', 'kadence-blocks')}
											value={undefined !== fontSize?.[0] ? fontSize[0] : ''}
											onChange={(value) =>
												setAttributes({
													fontSize: [
														value,
														undefined !== fontSize[1] ? fontSize[1] : '',
														undefined !== fontSize[2] ? fontSize[2] : '',
													],
												})
											}
											tabletValue={undefined !== fontSize?.[1] ? fontSize[1] : ''}
											onChangeTablet={(value) =>
												setAttributes({
													fontSize: [
														undefined !== fontSize[0] ? fontSize[0] : '',
														value,
														undefined !== fontSize[2] ? fontSize[2] : '',
													],
												})
											}
											mobileValue={undefined !== fontSize?.[2] ? fontSize[2] : ''}
											onChangeMobile={(value) =>
												setAttributes({
													fontSize: [
														undefined !== fontSize[0] ? fontSize[0] : '',
														undefined !== fontSize[1] ? fontSize[1] : '',
														value,
													],
												})
											}
											min={0}
											max={sizeType === 'px' ? 200 : 12}
											step={sizeType === 'px' ? 1 : 0.001}
											unit={sizeType ? sizeType : 'px'}
											onUnit={(value) => {
												setAttributes({ sizeType: value });
											}}
											units={['px', 'em', 'rem', 'vw']}
										/>
										<TwoColumn className="kb-font-settings">
											<ResponsiveUnitControl
												label={__('Line Height', 'kadence-blocks')}
												value={undefined !== fontHeight?.[0] ? fontHeight[0] : ''}
												onChange={(value) =>
													setAttributes({
														fontHeight: [
															value,
															undefined !== fontHeight[1] ? fontHeight[1] : '',
															undefined !== fontHeight[2] ? fontHeight[2] : '',
														],
													})
												}
												tabletValue={undefined !== fontHeight?.[1] ? fontHeight[1] : ''}
												onChangeTablet={(value) =>
													setAttributes({
														fontHeight: [
															undefined !== fontHeight[0] ? fontHeight[0] : '',
															value,
															undefined !== fontHeight[2] ? fontHeight[2] : '',
														],
													})
												}
												mobileValue={undefined !== fontHeight?.[2] ? fontHeight[2] : ''}
												onChangeMobile={(value) =>
													setAttributes({
														fontHeight: [
															undefined !== fontHeight[0] ? fontHeight[0] : '',
															undefined !== fontHeight[1] ? fontHeight[1] : '',
															value,
														],
													})
												}
												min={0}
												max={fontHeightType === 'px' ? 200 : 12}
												step={fontHeightType === 'px' ? 1 : 0.1}
												unit={fontHeightType ? fontHeightType : ''}
												onUnit={(value) => setAttributes({ fontHeightType: value })}
												units={['-', 'px', 'em', 'rem']}
												compressedDevice={true}
											/>
											<KadenceRadioButtons
												label={__('Letter Case', 'kadence-blocks')}
												value={textTransform}
												className={'kb-letter-case'}
												options={[
													{
														value: 'none',
														label: __('-', 'kadence-blocks'),
														tooltip: __('None', 'kadence-blocks'),
													},
													{
														value: 'uppercase',
														label: __('AB', 'kadence-blocks'),
														tooltip: __('Uppercase', 'kadence-blocks'),
													},
													{
														value: 'lowercase',
														label: __('ab', 'kadence-blocks'),
														tooltip: __('Lowercase', 'kadence-blocks'),
													},
													{
														value: 'capitalize',
														label: __('Ab', 'kadence-blocks'),
														tooltip: __('Capitalize', 'kadence-blocks'),
													},
												]}
												allowClear={true}
												onChange={(value) => setAttributes({ textTransform: value })}
											/>
										</TwoColumn>
									</>
								)}
							</KadencePanelBody>
							{showSettings('advancedSettings', 'kadence/advancedheading') && (
								<KadencePanelBody
									title={__('Advanced Typography Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-adv-heading-typography-settings'}
								>
									<TypographyControls
										fontGroup={htmlTag !== 'heading' ? 'body' : 'heading'}
										reLetterSpacing={[letterSpacing, tabletLetterSpacing, mobileLetterSpacing]}
										onLetterSpacing={(value) =>
											setAttributes({
												letterSpacing: value[0],
												tabletLetterSpacing: value[1],
												mobileLetterSpacing: value[2],
											})
										}
										letterSpacingType={letterSpacingType}
										onLetterSpacingType={(value) => setAttributes({ letterSpacingType: value })}
										fontFamily={typography}
										onFontFamily={(value) => setAttributes({ typography: value })}
										onFontChange={(select) => {
											setAttributes({
												typography: select.value,
												googleFont: select.google,
											});
										}}
										googleFont={googleFont}
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
										loadItalic={loadItalic}
										onLoadItalic={(value) => setAttributes({ loadItalic: value })}
									/>
								</KadencePanelBody>
							)}
							<KadencePanelBody
								title={__('Border Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-heading-border'}
							>
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
							</KadencePanelBody>
							<KadencePanelBody
								title={__('Text Shadow Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-heading-text-shadow'}
							>
								<ToggleControl
									label={'Enable Text Shadow'}
									checked={enableTextShadow}
									onChange={(value) => {
										setAttributes({ enableTextShadow: value });
									}}
								/>
								{enableTextShadow === true && (
									<ResponsiveShadowControl
										label={__('Text Shadow', 'kadence-blocks')}
										enable={enableTextShadow}
										color={previewColorTextShadow}
										colorDefault={'#000000'}
										onArrayChange={(color, opacity) => {
											saveShadow({ color, opacity });
										}}
										opacity={previewTextShadowOpacity}
										hOffset={previewHOffset}
										vOffset={previewVOffset}
										blur={previewBlur}
										onEnableChange={(value) => {
											saveShadow({ enable: value });
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
									/>
								)}
							</KadencePanelBody>
							<KadencePanelBody
								title={__('Text Orientation', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-heading-text-orientation'}
							>
								<ResponsiveKadenceRadioButtons
									label={__('Orientation', 'kadence-blocks')}
									value={previewTextOrientation}
									tabletValue={previewTextOrientation}
									mobileValue={previewTextOrientation}
									className={'kb-text-orientation'}
									options={[
										{
											value: 'horizontal',
											tooltip: __('Horizontal', 'kadence-blocks'),
											icon: horizontalTextOrientationIcon,
										},
										{
											value: 'stacked',
											tooltip: __('Stacked Vertically', 'kadence-blocks'),
											icon: stackedTextOrientationIcon,
										},
										{
											value: 'sideways-down',
											tooltip: __('Sideways Down', 'kadence-blocks'),
											icon: sidewaysDownTextOrientationIcon,
										},
										{
											value: 'sideways-up',
											tooltip: __('Sideways Up', 'kadence-blocks'),
											icon: sidewaysUpTextOrientationIcon,
										},
									]}
									onChange={(value) => setAttributes({ textOrientation: value })}
									onChangeTablet={(value) => setAttributes({ tabletTextOrientation: value })}
									onChangeMobile={(value) => setAttributes({ mobileTextOrientation: value })}
								/>
								{textOrientation !== 'horizontal' && textOrientation !== '' && (
									<ResponsiveRangeControls
										reset={() => {
											setAttributes({
												maxHeight: ['', '', ''],
												maxHeightType: 'px',
											});
										}}
										label={__('Max Height', 'kadence-blocks')}
										value={previewMaxHeight}
										onChange={(value) => {
											setAttributes({
												maxHeight: [
													value,
													undefined !== maxHeight && undefined !== maxHeight[1]
														? maxHeight[1]
														: '',
													undefined !== maxHeight && undefined !== maxHeight[2]
														? maxHeight[2]
														: '',
												],
											});
										}}
										tabletValue={
											undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : ''
										}
										onChangeTablet={(value) => {
											setAttributes({
												maxHeight: [
													undefined !== maxHeight && undefined !== maxHeight[0]
														? maxHeight[0]
														: '',
													value,
													undefined !== maxHeight && undefined !== maxHeight[2]
														? maxHeight[2]
														: '',
												],
											});
										}}
										mobileValue={
											undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : ''
										}
										onChangeMobile={(value) => {
											setAttributes({
												maxHeight: [
													undefined !== maxHeight && undefined !== maxHeight[0]
														? maxHeight[0]
														: '',
													undefined !== maxHeight && undefined !== maxHeight[1]
														? maxHeight[1]
														: '',
													value,
												],
											});
										}}
										min={0}
										max={maxHeightType === 'px' ? 2000 : 100}
										step={1}
										unit={maxHeightType ? maxHeightType : 'px'}
										onUnit={(value) => {
											setAttributes({ maxHeightType: value });
										}}
										units={['px', '%', 'vw']}
									/>
								)}
							</KadencePanelBody>
							{showSettings('iconSettings', 'kadence/advancedheading') && (
								<KadencePanelBody
									title={__('Icon Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-adv-heading-icon'}
								>
									<div className="kt-select-icon-container">
										<KadenceIconPicker
											value={icon}
											onChange={(value) => {
												setAttributes({ icon: value });
											}}
											allowClear={true}
										/>
									</div>
									<SelectControl
										label={__('Icon Location', 'kadence-blocks')}
										value={iconSide}
										options={[
											{ value: 'left', label: __('Left', 'kadence-blocks') },
											{ value: 'right', label: __('Right', 'kadence-blocks') },
										]}
										onChange={(value) => {
											setAttributes({ iconSide: value });
										}}
									/>
									<SelectControl
										label={__('Vertical Alignment', 'kadence-blocks')}
										value={iconVerticalAlign}
										options={[
											{ value: 'unset', label: __('Unset', 'kadence-blocks') },
											{ value: 'baseline', label: __('Baseline', 'kadence-blocks') },
											{ value: 'center', label: __('Center', 'kadence-blocks') },
											{ value: 'end', label: __('End', 'kadence-blocks') },
											{ value: 'start', label: __('Start', 'kadence-blocks') },
										]}
										onChange={(value) => {
											setAttributes({ iconVerticalAlign: value });
										}}
									/>
									<ResponsiveRangeControls
										label={__('Icon Size', 'kadence-blocks')}
										value={undefined !== iconSize?.[0] ? iconSize[0] : ''}
										onChange={(value) => {
											setAttributes({
												iconSize: [
													value,
													undefined !== iconSize[1] ? iconSize[1] : '',
													undefined !== iconSize?.[2] && iconSize[2] ? iconSize[2] : '',
												],
											});
										}}
										tabletValue={undefined !== iconSize?.[1] ? iconSize[1] : ''}
										onChangeTablet={(value) => {
											setAttributes({
												iconSize: [
													undefined !== iconSize?.[0] ? iconSize[0] : '',
													value,
													undefined !== iconSize?.[2] ? iconSize[2] : '',
												],
											});
										}}
										mobileValue={undefined !== iconSize?.[2] ? iconSize[2] : ''}
										onChangeMobile={(value) => {
											setAttributes({
												iconSize: [
													undefined !== iconSize?.[0] ? iconSize[0] : '',
													undefined !== iconSize?.[1] ? iconSize[1] : '',
													value,
												],
											});
										}}
										min={0}
										max={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 12 : 200}
										step={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 0.1 : 1}
										unit={iconSizeUnit ? iconSizeUnit : 'px'}
										onUnit={(value) => {
											setAttributes({ iconSizeUnit: value });
										}}
										units={['px', 'em', 'rem']}
										reset={true}
									/>
									<PopColorControl
										label={__('Icon Color', 'kadence-blocks')}
										value={iconColor ? iconColor : ''}
										default={''}
										onChange={(value) => {
											setAttributes({ iconColor: value });
										}}
										swatchLabel2={__('Hover Color', 'kadence-blocks')}
										value2={iconColorHover ? iconColorHover : ''}
										default2={''}
										onChange2={(value) => {
											setAttributes({ iconColorHover: value });
										}}
									/>
									<ResponsiveMeasureRangeControl
										label={__('Icon Padding', 'kadence-blocks')}
										value={undefined !== iconPadding ? iconPadding : ['', '', '', '']}
										tabletValue={
											undefined !== tabletIconPadding ? tabletIconPadding : ['', '', '', '']
										}
										mobileValue={
											undefined !== mobileIconPadding ? mobileIconPadding : ['', '', '', '']
										}
										onChange={(value) => setAttributes({ iconPadding: value })}
										onChangeTablet={(value) => setAttributes({ tabletIconPadding: value })}
										onChangeMobile={(value) => setAttributes({ mobileIconPadding: value })}
										min={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? -2 : -999}
										max={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 12 : 999}
										step={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 0.1 : 1}
										unit={iconPaddingUnit}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ iconPaddingUnit: value })}
									/>
									<TextControl
										label={__('Title for screen readers', 'kadence-blocks')}
										help={__(
											'If no title added screen readers will ignore, good if the icon is purely decorative.',
											'kadence-blocks'
										)}
										value={iconTitle}
										onChange={(value) => {
											setAttributes({ iconTitle: value });
										}}
									/>
									<TextareaControl
										label={__('Icon Tooltip Content', 'kadence-blocks')}
										value={iconTooltip}
										onChange={(newValue) => setAttributes({ iconTooltip: newValue })}
									/>
									<SelectControl
										label={__('Icon Tooltip Placement', 'kadence-blocks')}
										value={iconTooltipPlacement || 'top'}
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
											setAttributes({ iconTooltipPlacement: val });
										}}
									/>
									<ToggleControl
										label={__('Show indicator underline', 'kadence-blocks')}
										checked={iconTooltipDash}
										onChange={(value) => {
											setAttributes({ iconTooltipDash: value });
										}}
									/>
								</KadencePanelBody>
							)}
							{showSettings('highlightSettings', 'kadence/advancedheading') && (
								<KadencePanelBody
									title={__('Advanced Highlight Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-adv-heading-highlight-settings'}
								>
									<>
										{!enableMarkGradient && (
											<PopColorControl
												label={__('Color', 'kadence-blocks')}
												value={markColor ? markColor : ''}
												default={''}
												onChange={(value) => setAttributes({ markColor: value })}
											/>
										)}
										{!enableMarkBackgroundGradient && (
											<ToggleControl
												style={{ marginTop: '10px' }}
												label={__('Enable Text Gradient', 'kadence-blocks')}
												help={__(
													'Enabling Text Gradient disables Background Color and Gradient.',
													'kadence-blocks'
												)}
												checked={enableMarkGradient}
												onChange={(value) => setAttributes({ enableMarkGradient: value })}
											/>
										)}

										{enableMarkGradient && (
											<GradientControl
												value={markGradient}
												onChange={(value) => setAttributes({ markGradient: value })}
												gradients={[]}
											/>
										)}

										{!enableMarkGradient && !enableMarkBackgroundGradient && (
											<PopColorControl
												label={__('Background', 'kadence-blocks')}
												value={markBG ? markBG : ''}
												default={''}
												onChange={(value) => setAttributes({ markBG: value })}
												opacityValue={markBGOpacity}
												onOpacityChange={(value) => setAttributes({ markBGOpacity: value })}
												onArrayChange={(color, opacity) =>
													setAttributes({ markBG: color, markBGOpacity: opacity })
												}
											/>
										)}
									</>
									{!enableMarkGradient && (
										<ToggleControl
											style={{ marginTop: '10px' }}
											label={__('Enable Background Gradient', 'kadence-blocks')}
											help={__(
												'Enabling Background Gradient disables Text Gradient.',
												'kadence-blocks'
											)}
											checked={enableMarkBackgroundGradient}
											onChange={(value) => setAttributes({ enableMarkBackgroundGradient: value })}
										/>
									)}
									{enableMarkBackgroundGradient && (
										<GradientControl
											value={markBackgroundGradient}
											onChange={(value) => setAttributes({ markBackgroundGradient: value })}
											gradients={[]}
										/>
									)}
									<ResponsiveBorderControl
										label={__('Border', 'kadence-blocks')}
										value={markBorderStyles}
										tabletValue={tabletMarkBorderStyles}
										mobileValue={mobileMarkBorderStyles}
										onChange={(value) => setAttributes({ markBorderStyles: value })}
										onChangeTablet={(value) => setAttributes({ tabletMarkBorderStyles: value })}
										onChangeMobile={(value) => setAttributes({ mobileMarkBorderStyles: value })}
									/>
									<ResponsiveMeasurementControls
										label={__('Border Radius', 'kadence-blocks')}
										value={markBorderRadius}
										tabletValue={tabletMarkBorderRadius}
										mobileValue={mobileMarkBorderRadius}
										onChange={(value) => setAttributes({ markBorderRadius: value })}
										onChangeTablet={(value) => setAttributes({ tabletMarkBorderRadius: value })}
										onChangeMobile={(value) => setAttributes({ mobileMarkBorderRadius: value })}
										unit={markBorderRadiusUnit}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => setAttributes({ markBorderRadiusUnit: value })}
										max={markBorderRadiusUnit === 'em' || markBorderRadiusUnit === 'rem' ? 24 : 500}
										step={markBorderRadiusUnit === 'em' || markBorderRadiusUnit === 'rem' ? 0.1 : 1}
										min={0}
										isBorderRadius={true}
										allowEmpty={true}
									/>
									<TypographyControls
										fontGroup={'heading'}
										fontSize={markSize}
										onFontSize={(value) => setAttributes({ markSize: value })}
										fontSizeType={markSizeType}
										onFontSizeType={(value) => setAttributes({ markSizeType: value })}
										lineHeight={markLineHeight}
										onLineHeight={(value) => setAttributes({ markLineHeight: value })}
										lineHeightType={markLineType}
										onLineHeightType={(value) => setAttributes({ markLineType: value })}
										reLetterSpacing={[
											markLetterSpacing,
											tabletMarkLetterSpacing,
											mobileMarkLetterSpacing,
										]}
										onLetterSpacing={(value) =>
											setAttributes({
												markLetterSpacing: value[0],
												tabletMarkLetterSpacing: value[1],
												mobileMarkLetterSpacing: value[2],
											})
										}
										letterSpacingType={markLetterSpacingType}
										onLetterSpacingType={(value) => setAttributes({ markLetterSpacingType: value })}
										fontFamily={markTypography}
										onFontFamily={(value) => setAttributes({ markTypography: value })}
										onFontChange={(select) => {
											setAttributes({
												markTypography: select.value,
												markGoogleFont: select.google,
											});
										}}
										googleFont={markGoogleFont}
										onGoogleFont={(value) => setAttributes({ markGoogleFont: value })}
										loadGoogleFont={markLoadGoogleFont}
										onLoadGoogleFont={(value) => setAttributes({ markLoadGoogleFont: value })}
										fontVariant={markFontVariant}
										onFontVariant={(value) => setAttributes({ markFontVariant: value })}
										fontWeight={markFontWeight}
										onFontWeight={(value) => setAttributes({ markFontWeight: value })}
										fontStyle={markFontStyle}
										onFontStyle={(value) => setAttributes({ markFontStyle: value })}
										fontSubset={markFontSubset}
										onFontSubset={(value) => setAttributes({ markFontSubset: value })}
										textTransform={markTextTransform}
										onTextTransform={(value) => setAttributes({ markTextTransform: value })}
									/>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={markPadding}
										tabletValue={markTabPadding}
										mobileValue={markMobilePadding}
										onChange={(value) => setAttributes({ markPadding: value })}
										onChangeTablet={(value) => setAttributes({ markTabPadding: value })}
										onChangeMobile={(value) => setAttributes({ markMobilePadding: value })}
										min={0}
										max={markPaddingType === 'em' || markPaddingType === 'rem' ? 12 : 999}
										step={markPaddingType === 'em' || markPaddingType === 'rem' ? 0.1 : 1}
										unit={markPaddingType}
										units={['px', 'em', 'rem', '%']}
										onUnit={(value) => setAttributes({ markPaddingType: value })}
									/>
								</KadencePanelBody>
							)}
						</>
					)}

					{activeTab === 'advanced' && (
						<>
							{showSettings('marginSettings', 'kadence/advancedheading') && (
								<>
									<KadencePanelBody panelName={'kb-row-padding'}>
										<ResponsiveMeasureRangeControl
											label={__('Padding', 'kadence-blocks')}
											value={padding}
											tabletValue={tabletPadding}
											mobileValue={mobilePadding}
											onChange={(value) => setAttributes({ padding: value })}
											onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
											onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
											min={0}
											max={paddingType === 'em' || paddingType === 'rem' ? 12 : 999}
											step={paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1}
											unit={paddingType}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setAttributes({ paddingType: value })}
											onMouseOver={paddingMouseOver.onMouseOver}
											onMouseOut={paddingMouseOver.onMouseOut}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Margin', 'kadence-blocks')}
											value={margin}
											tabletValue={tabletMargin}
											mobileValue={mobileMargin}
											onChange={(value) => {
												setAttributes({ margin: value });
											}}
											onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
											onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
											min={marginType === 'em' || marginType === 'rem' ? -25 : -999}
											max={marginType === 'em' || marginType === 'rem' ? 25 : 999}
											step={marginType === 'em' || marginType === 'rem' ? 0.1 : 1}
											unit={marginType}
											units={['px', 'em', 'rem', '%', 'vh']}
											onUnit={(value) => setAttributes({ marginType: value })}
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
								blockSlug={metadata.name}
								excludedAttrs={nonTransAttrs}
							/>
						</>
					)}
				</InspectorControls>
			)}

			<DynamicInlineReplaceControl dynamicAttribute={'content'} {...props} />

			<InspectorAdvancedControls>
				{htmlTag === 'heading' && (
					<TextControl
						label={__('Alterative title for table of contents', 'kadence-blocks')}
						help={__(
							'If using table of contents block you can define a custom title here.',
							'kadence-blocks'
						)}
						value={altTitle}
						onChange={(value) => {
							setAttributes({ altTitle: value });
						}}
					/>
				)}
				<TextControl
					label={__('HTML Anchor', 'kadence-blocks')}
					help={__('Anchors lets you link directly to a section on a page.', 'kadence-blocks')}
					value={anchor || ''}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						setAttributes({
							anchor: nextValue,
						});
					}}
				/>
			</InspectorAdvancedControls>

			{kadenceAnimation && (
				<div className={`kt-animation-wrap-${kadenceAnimation}`}>
					<div
						id={`animate-id${uniqueID}`}
						className={'aos-animate kt-animation-wrap'}
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
					>
						{link ? headingLinkContent : headingContent}
					</div>
				</div>
			)}
			{!kadenceAnimation && (link ? headingLinkContent : headingContent)}
			{googleFont && typography && (
				<KadenceWebfontLoader
					typography={[{ family: typography, variant: fontVariant ? fontVariant : '' }]}
					clientId={clientId}
					id={'advancedHeading'}
				/>
			)}
			{markGoogleFont && markTypography && (
				<KadenceWebfontLoader
					typography={[{ family: markTypography, variant: markFontVariant ? markFontVariant : '' }]}
					clientId={clientId}
					id={'advancedHeadingMark'}
				/>
			)}

			<SpacingVisualizer
				type="outsideVertical"
				forceShow={marginMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewMarginTop, marginType),
					getSpacingOptionOutput(previewMarginRight, marginType),
					getSpacingOptionOutput(previewMarginBottom, marginType),
					getSpacingOptionOutput(previewMarginLeft, marginType),
				]}
			/>
			<SpacingVisualizer
				style={{
					marginLeft:
						undefined !== previewMarginLeft
							? getSpacingOptionOutput(previewMarginLeft, marginType)
							: undefined,
					marginRight:
						undefined !== previewMarginRight
							? getSpacingOptionOutput(previewMarginRight, marginType)
							: undefined,
					marginTop:
						undefined !== previewMarginTop
							? getSpacingOptionOutput(previewMarginTop, marginType)
							: undefined,
					marginBottom:
						undefined !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, marginType)
							: undefined,
				}}
				type="inside"
				forceShow={paddingMouseOver.isMouseOver}
				spacing={[
					getSpacingOptionOutput(previewPaddingTop, paddingType),
					getSpacingOptionOutput(previewPaddingRight, paddingType),
					getSpacingOptionOutput(previewPaddingBottom, paddingType),
					getSpacingOptionOutput(previewPaddingLeft, paddingType),
				]}
			/>
		</div>
	);
}

export default KadenceAdvancedHeading;
