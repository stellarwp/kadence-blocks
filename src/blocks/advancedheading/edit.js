/**
 * BLOCK: Kadence Advanced Heading - Performance Optimized Version
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
	HoverToggleControl,
	BackgroundTypeControl,
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
import './formats/screen-reader-text';

import Typed from 'typed.js';

// Lazy load AI Text component
import AIText from './ai-text/ai-text.js';
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
import { useEffect, useState, useRef, useCallback, useMemo } from '@wordpress/element';

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

// Helper function moved outside component
const isRGBA = (color) => {
	const rgbaRegex = /rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\s*\)/;
	return rgbaRegex.test(color);
};

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

	const { replaceBlocks, insertBlocks } = useDispatch('core/block-editor');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	// Memoize config
	const config = useMemo(() => {
		return get(kadence_blocks_params, 'globalSettings') ? JSON.parse(kadence_blocks_params.globalSettings) : {};
	}, []);

	const isDefaultEditorBlock = useMemo(() => {
		return undefined !== config.adv_text_is_default_editor_block && config.adv_text_is_default_editor_block;
	}, [config]);

	// Memoize sanitizeString function
	const sanitizeString = useCallback((input) => {
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
	}, []);

	// Memoize handlePaste function
	const handlePaste = useCallback(
		(event) => {
			const pastedText = event.clipboardData.getData('text/plain');
			const containsBlocks = pastedText && (pastedText.includes('<!-- wp:') || pastedText.includes('wp-block-'));

			if (containsBlocks) {
				const rawBlocks = wp.blocks.rawHandler({ HTML: pastedText });

				if (!content || content === '') {
					replaceBlocks(clientId, rawBlocks);
				} else {
					const { getBlockIndex, getBlockRootClientId } = wp.data.select('core/block-editor');
					const currentBlockIndex = getBlockIndex(clientId);
					const parentBlockClientId = getBlockRootClientId(clientId);

					insertBlocks(rawBlocks, currentBlockIndex + 1, parentBlockClientId);
				}
				event.preventDefault();
			} else if (pastedText && isDefaultEditorBlock) {
				const paragraphs = pastedText.split(/\n\s*\n/).flatMap((paragraph) => paragraph.split(/\r\s*/));

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
					if (!content || content === '') {
						replaceBlocks(clientId, newBlocks);
					} else {
						// Append the content of the first new block to the existing content.
						const firstPastedBlock = newBlocks[0];
						setAttributes({
							content: content + firstPastedBlock.attributes.content,
						});

						// Insert new blocks below for the remaining paragraphs, if there are any.
						const remainingPastedBlocks = newBlocks.slice(1);
						if (remainingPastedBlocks.length > 0) {
							const { getBlockIndex, getBlockRootClientId } = wp.data.select('core/block-editor');
							const currentBlockIndex = getBlockIndex(clientId);
							const parentBlockClientId = getBlockRootClientId(clientId);

							insertBlocks(remainingPastedBlocks, currentBlockIndex + 1, parentBlockClientId);
						}
					}
					event.preventDefault();
				}
			}
		},
		[content, clientId, replaceBlocks, insertBlocks, isDefaultEditorBlock, attributes]
	);

	// Memoize saveShadow function
	const saveShadow = useCallback(
		(value) => {
			let newItems;
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
				newItems = (textShadow || []).map((item, thisIndex) => {
					if (0 === thisIndex) {
						item = { ...item, ...value };
					}
					return item;
				});
				setAttributes({
					textShadow: newItems,
				});
			} else if (previewDevice === 'Tablet') {
				newItems = (textShadowTablet || []).map((item, thisIndex) => {
					if (0 === thisIndex) {
						item = { ...item, ...value };
					}
					return item;
				});
				setAttributes({
					textShadowTablet: newItems,
				});
			} else if (previewDevice === 'Mobile') {
				newItems = (textShadowMobile || []).map((item, thisIndex) => {
					if (0 === thisIndex) {
						item = { ...item, ...value };
					}
					return item;
				});
				setAttributes({
					textShadowMobile: newItems,
				});
			}
		},
		[previewDevice, textShadow, textShadowTablet, textShadowMobile, setAttributes]
	);

	// Memoize onChange handlers
	const onChangeContent = useCallback((value) => setAttributes({ content: value }), [setAttributes]);
	const onChangeColor = useCallback((value) => setAttributes({ color: value }), [setAttributes]);
	const onChangeColorClass = useCallback((value) => setAttributes({ colorClass: value }), [setAttributes]);
	const onChangeAlign = useCallback((nextAlign) => setAttributes({ align: nextAlign }), [setAttributes]);
	const onChangeTypography = useCallback((value) => setAttributes({ typography: value }), [setAttributes]);
	const onChangeFontFamily = useCallback(
		(select) => {
			setAttributes({
				typography: select.value,
				googleFont: select.google,
			});
		},
		[setAttributes]
	);
	const onChangeGoogleFont = useCallback((value) => setAttributes({ googleFont: value }), [setAttributes]);
	const onChangeLoadGoogleFont = useCallback((value) => setAttributes({ loadGoogleFont: value }), [setAttributes]);
	const onChangeFontVariant = useCallback((value) => setAttributes({ fontVariant: value }), [setAttributes]);
	const onChangeFontWeight = useCallback((value) => setAttributes({ fontWeight: value }), [setAttributes]);
	const onChangeFontStyle = useCallback((value) => setAttributes({ fontStyle: value }), [setAttributes]);
	const onChangeFontSubset = useCallback((value) => setAttributes({ fontSubset: value }), [setAttributes]);
	const onChangeLoadItalic = useCallback((value) => setAttributes({ loadItalic: value }), [setAttributes]);
	const onChangeLetterSpacing = useCallback((value) => setAttributes({ letterSpacing: value }), [setAttributes]);
	const onChangeTextTransform = useCallback((value) => setAttributes({ textTransform: value }), [setAttributes]);
	const onChangeEnableTextShadow = useCallback(
		(value) => setAttributes({ enableTextShadow: value }),
		[setAttributes]
	);
	const onChangeIcon = useCallback((value) => setAttributes({ icon: value }), [setAttributes]);
	const onChangeIconSide = useCallback((value) => setAttributes({ iconSide: value }), [setAttributes]);
	const onChangeIconVerticalAlign = useCallback(
		(value) => setAttributes({ iconVerticalAlign: value }),
		[setAttributes]
	);
	const onChangeIconColor = useCallback((value) => setAttributes({ iconColor: value }), [setAttributes]);
	const onChangeIconColorHover = useCallback((value) => setAttributes({ iconColorHover: value }), [setAttributes]);
	const onChangeIconSizeUnit = useCallback((value) => setAttributes({ iconSizeUnit: value }), [setAttributes]);
	const onChangeBorderRadiusUnit = useCallback(
		(value) => setAttributes({ borderRadiusUnit: value }),
		[setAttributes]
	);
	const onChangeMaxHeightType = useCallback((value) => setAttributes({ maxHeightType: value }), [setAttributes]);
	const onChangeTextOrientation = useCallback((value) => setAttributes({ textOrientation: value }), [setAttributes]);
	const onChangeTabletTextOrientation = useCallback(
		(value) => setAttributes({ tabletTextOrientation: value }),
		[setAttributes]
	);
	const onChangeMobileTextOrientation = useCallback(
		(value) => setAttributes({ mobileTextOrientation: value }),
		[setAttributes]
	);

	// Memoize font size change handlers
	const onChangeFontSize = useCallback(
		(value) => {
			setAttributes({
				fontSize: [
					value,
					undefined !== fontSize?.[1] ? fontSize[1] : '',
					undefined !== fontSize?.[2] ? fontSize[2] : '',
				],
			});
		},
		[fontSize, setAttributes]
	);

	const onChangeTabFontSize = useCallback(
		(value) => {
			setAttributes({
				fontSize: [
					undefined !== fontSize?.[0] ? fontSize[0] : '',
					value,
					undefined !== fontSize?.[2] ? fontSize[2] : '',
				],
			});
		},
		[fontSize, setAttributes]
	);

	const onChangeMobileFontSize = useCallback(
		(value) => {
			setAttributes({
				fontSize: [
					undefined !== fontSize?.[0] ? fontSize[0] : '',
					undefined !== fontSize?.[1] ? fontSize[1] : '',
					value,
				],
			});
		},
		[fontSize, setAttributes]
	);

	// Memoize line height change handlers
	const onChangeLineHeight = useCallback(
		(value) => {
			setAttributes({
				fontHeight: [
					value,
					undefined !== fontHeight?.[1] ? fontHeight[1] : '',
					undefined !== fontHeight?.[2] ? fontHeight[2] : '',
				],
			});
		},
		[fontHeight, setAttributes]
	);

	const onChangeTabLineHeight = useCallback(
		(value) => {
			setAttributes({
				fontHeight: [
					undefined !== fontHeight?.[0] ? fontHeight[0] : '',
					value,
					undefined !== fontHeight?.[2] ? fontHeight[2] : '',
				],
			});
		},
		[fontHeight, setAttributes]
	);

	const onChangeMobileLineHeight = useCallback(
		(value) => {
			setAttributes({
				fontHeight: [
					undefined !== fontHeight?.[0] ? fontHeight[0] : '',
					undefined !== fontHeight?.[1] ? fontHeight[1] : '',
					value,
				],
			});
		},
		[fontHeight, setAttributes]
	);

	// Memoize icon size change handlers
	const onChangeIconSize = useCallback(
		(value) => {
			setAttributes({
				iconSize: [
					value,
					undefined !== iconSize?.[1] ? iconSize[1] : '',
					undefined !== iconSize?.[2] && iconSize[2] ? iconSize[2] : '',
				],
			});
		},
		[iconSize, setAttributes]
	);

	const onChangeTabletIconSize = useCallback(
		(value) => {
			setAttributes({
				iconSize: [
					undefined !== iconSize?.[0] ? iconSize[0] : '',
					value,
					undefined !== iconSize?.[2] ? iconSize[2] : '',
				],
			});
		},
		[iconSize, setAttributes]
	);

	const onChangeMobileIconSize = useCallback(
		(value) => {
			setAttributes({
				iconSize: [
					undefined !== iconSize?.[0] ? iconSize[0] : '',
					undefined !== iconSize?.[1] ? iconSize[1] : '',
					value,
				],
			});
		},
		[iconSize, setAttributes]
	);

	// Memoize max height change handlers
	const onChangeMaxHeight = useCallback(
		(value) => {
			setAttributes({
				maxHeight: [
					value,
					undefined !== maxHeight?.[1] ? maxHeight[1] : '',
					undefined !== maxHeight?.[2] ? maxHeight[2] : '',
				],
			});
		},
		[maxHeight, setAttributes]
	);

	const onChangeTabletMaxHeight = useCallback(
		(value) => {
			setAttributes({
				maxHeight: [
					undefined !== maxHeight?.[0] ? maxHeight[0] : '',
					value,
					undefined !== maxHeight?.[2] ? maxHeight[2] : '',
				],
			});
		},
		[maxHeight, setAttributes]
	);

	const onChangeMobileMaxHeight = useCallback(
		(value) => {
			setAttributes({
				maxHeight: [
					undefined !== maxHeight?.[0] ? maxHeight[0] : '',
					undefined !== maxHeight?.[1] ? maxHeight[1] : '',
					value,
				],
			});
		},
		[maxHeight, setAttributes]
	);

	// Memoize border style change handlers
	const onChangeBorderStyle = useCallback((value) => setAttributes({ borderStyle: value }), [setAttributes]);
	const onChangeTabletBorderStyle = useCallback(
		(value) => setAttributes({ tabletBorderStyle: value }),
		[setAttributes]
	);
	const onChangeMobileBorderStyle = useCallback(
		(value) => setAttributes({ mobileBorderStyle: value }),
		[setAttributes]
	);

	// Memoize border radius change handlers
	const onChangeBorderRadius = useCallback((value) => setAttributes({ borderRadius: value }), [setAttributes]);
	const onChangeTabletBorderRadius = useCallback(
		(value) => setAttributes({ tabletBorderRadius: value }),
		[setAttributes]
	);
	const onChangeMobileBorderRadius = useCallback(
		(value) => setAttributes({ mobileBorderRadius: value }),
		[setAttributes]
	);

	// Memoize reset handlers
	const onResetMaxHeight = useCallback(() => {
		setAttributes({
			maxHeight: ['', '', ''],
			maxHeightType: 'px',
		});
	}, [setAttributes]);

	// Memoize heading level click handlers
	const onClickHeading1 = useCallback(() => setAttributes({ level: 1, htmlTag: 'heading' }), [setAttributes]);
	const onClickHeading2 = useCallback(() => setAttributes({ level: 2, htmlTag: 'heading' }), [setAttributes]);
	const onClickHeading3 = useCallback(() => setAttributes({ level: 3, htmlTag: 'heading' }), [setAttributes]);
	const onClickHeading4 = useCallback(() => setAttributes({ level: 4, htmlTag: 'heading' }), [setAttributes]);
	const onClickHeading5 = useCallback(() => setAttributes({ level: 5, htmlTag: 'heading' }), [setAttributes]);
	const onClickHeading6 = useCallback(() => setAttributes({ level: 6, htmlTag: 'heading' }), [setAttributes]);
	const onClickParagraph = useCallback(() => setAttributes({ htmlTag: 'p' }), [setAttributes]);
	const onClickSpan = useCallback(() => setAttributes({ htmlTag: 'span' }), [setAttributes]);
	const onClickDiv = useCallback(() => setAttributes({ htmlTag: 'div' }), [setAttributes]);

	// Memoize rich text handlers
	const onSplit = useCallback(
		(value) => {
			if (!value && !isDefaultEditorBlock) {
				return createBlock('core/paragraph');
			}
			return createBlock('kadence/advancedheading', {
				...attributes,
				content: value ?? '',
			});
		},
		[isDefaultEditorBlock, attributes]
	);

	const onRemove = useCallback(() => onReplace([]), [onReplace]);

	// Memoize link click handler
	const onLinkClick = useCallback((event) => {
		event.preventDefault();
	}, []);

	// Memoize isDynamicReplaced
	const isDynamicReplaced = useMemo(() => {
		return (
			undefined !== kadenceDynamic &&
			undefined !== kadenceDynamic.content &&
			undefined !== kadenceDynamic.content.enable &&
			kadenceDynamic.content.enable
		);
	}, [kadenceDynamic]);

	// Memoize rich text formats
	const richTextFormatsBase = useMemo(() => {
		return applyFilters(
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
				'kadence/screen-reader-text',
			],
			'kadence/advancedheading'
		);
	}, []);

	const richTextFormats = useMemo(() => {
		let formats = allowedFormats.map((format) => format.name);
		if (link || kadenceDynamic?.content?.shouldReplace) {
			formats = !kadenceDynamic?.content?.shouldReplace
				? [...['kadence/insert-dynamic'], ...richTextFormatsBase]
				: richTextFormatsBase;
		}
		return formats;
	}, [allowedFormats, link, kadenceDynamic, richTextFormatsBase]);

	// Memoize preview sizes
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

	const previewTextShadowOpacity = getPreviewSize(
		previewDevice,
		undefined !== textShadow?.[0]?.opacity ? textShadow[0].opacity : 1,
		undefined !== textShadowTablet?.[0]?.opacity ? textShadowTablet[0].opacity : '',
		undefined !== textShadowMobile?.[0]?.opacity ? textShadowMobile[0].opacity : ''
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

	const previewJustifyAlign = useMemo(() => {
		let justifyAlign = previewAlign;
		switch (previewAlign) {
			case 'left':
				justifyAlign = 'flex-start';
				break;
			case 'right':
				justifyAlign = 'flex-end';
				break;
		}
		return justifyAlign;
	}, [previewAlign]);

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

	// Memoize other computed values
	const renderTypography = useMemo(
		() => (typography && !typography.includes(',') ? "'" + typography + "'" : typography),
		[typography]
	);
	const markBGString = useMemo(
		() => (markBG ? KadenceColorOutput(markBG, markBGOpacity) : ''),
		[markBG, markBGOpacity]
	);
	const markBorderString = useMemo(
		() => (markBorder ? KadenceColorOutput(markBorder, markBorderOpacity) : ''),
		[markBorder, markBorderOpacity]
	);
	const textColorClass = useMemo(() => getColorClassName('color', colorClass), [colorClass]);
	const textBackgroundColorClass = useMemo(
		() => getColorClassName('background-color', backgroundColorClass),
		[backgroundColorClass]
	);
	const tagName = useMemo(() => (htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level), [htmlTag, level]);
	const TagHTML = tagName;
	const markBorderRadiusUnitPreview = useMemo(
		() => (undefined !== markBorderRadiusUnit ? markBorderRadiusUnit : 'px'),
		[markBorderRadiusUnit]
	);

	const backgroundIgnoreClass = useMemo(() => {
		let ignore = backgroundColorClass ? false : true;
		if (!ignore && !kadence_blocks_params.isKadenceT && background && background.startsWith('palette')) {
			ignore = true;
		}
		return ignore;
	}, [backgroundColorClass, background]);

	// Memoize heading options array
	const headingOptions = useMemo(
		() => [
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
					onClick: onClickHeading1,
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
					onClick: onClickHeading2,
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
					onClick: onClickHeading3,
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
					onClick: onClickHeading4,
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
					onClick: onClickHeading5,
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
					onClick: onClickHeading6,
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={'p'} isPressed={htmlTag && htmlTag === 'p' ? true : false} />,
					title: __('Paragraph', 'kadence-blocks'),
					isActive: htmlTag && htmlTag === 'p' ? true : false,
					onClick: onClickParagraph,
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={'span'} isPressed={htmlTag && htmlTag === 'span' ? true : false} />,
					title: __('Span', 'kadence-blocks'),
					isActive: htmlTag && htmlTag === 'span' ? true : false,
					onClick: onClickSpan,
				},
			],
			[
				{
					icon: <HeadingLevelIcon level={'div'} isPressed={htmlTag && htmlTag === 'div' ? true : false} />,
					title: __('div', 'kadence-blocks'),
					isActive: htmlTag && htmlTag === 'div' ? true : false,
					onClick: onClickDiv,
				},
			],
		],
		[
			level,
			htmlTag,
			onClickHeading1,
			onClickHeading2,
			onClickHeading3,
			onClickHeading4,
			onClickHeading5,
			onClickHeading6,
			onClickParagraph,
			onClickSpan,
			onClickDiv,
		]
	);

	// Memoize classes
	const classes = useMemo(
		() =>
			classnames({
				[`kt-adv-heading${uniqueID}`]: uniqueID,
				'kadence-advancedheading-text': true,
				'kb-content-is-dynamic': isDynamicReplaced,
				[textColorClass]: textColorClass,
				'has-text-color': textColorClass,
				[textBackgroundColorClass]: textBackgroundColorClass,
				'has-background': textBackgroundColorClass,
				[`hls-${linkStyle}`]: !link && linkStyle,
				[`kt-adv-heading-has-icon`]: icon,
			}),
		[uniqueID, isDynamicReplaced, textColorClass, textBackgroundColorClass, link, linkStyle, icon]
	);

	// Memoize render icon function
	const renderIcon = useCallback(() => {
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
	}, [
		icon,
		iconTooltip,
		iconTooltipPlacement,
		iconTooltipDash,
		iconSide,
		previewIconSize,
		iconSizeUnit,
		iconColor,
		previewIconPaddingTop,
		previewIconPaddingRight,
		previewIconPaddingBottom,
		previewIconPaddingLeft,
		iconPaddingUnit,
	]);

	// Memoize heading styles
	const headingStyles = useMemo(
		() => ({
			display: icon ? 'flex' : undefined,
			alignItems: icon ? iconVerticalAlign : undefined,
			gap: icon ? '0.25em' : undefined,
			justifyContent: icon && previewJustifyAlign ? previewJustifyAlign : undefined,
			textAlign: previewAlign ? previewAlign : undefined,
			backgroundColor:
				!enableTextGradient && background && backgroundIgnoreClass ? KadenceColorOutput(background) : undefined,
			backgroundImage: enableTextGradient && textGradient !== '' ? textGradient : undefined,
			paddingTop: '' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingType) : undefined,
			paddingRight:
				'' !== previewPaddingRight ? getSpacingOptionOutput(previewPaddingRight, paddingType) : undefined,
			paddingBottom:
				'' !== previewPaddingBottom ? getSpacingOptionOutput(previewPaddingBottom, paddingType) : undefined,
			paddingLeft:
				'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingType) : undefined,
			marginTop: '' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginType) : undefined,
			marginRight: '' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginType) : undefined,
			marginBottom:
				'' !== previewMarginBottom ? getSpacingOptionOutput(previewMarginBottom, marginType) : undefined,
			marginLeft: '' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginType) : undefined,
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
		}),
		[
			icon,
			iconVerticalAlign,
			previewJustifyAlign,
			previewAlign,
			enableTextGradient,
			background,
			backgroundIgnoreClass,
			textGradient,
			previewPaddingTop,
			paddingType,
			previewPaddingRight,
			previewPaddingBottom,
			previewPaddingLeft,
			previewMarginTop,
			marginType,
			previewMarginRight,
			previewMarginBottom,
			previewMarginLeft,
			previewLineHeight,
			fontHeightType,
			color,
			previewFontSize,
			sizeType,
			previewBorderRadiusTop,
			borderRadiusUnit,
			previewBorderRadiusRight,
			previewBorderRadiusBottom,
			previewBorderRadiusLeft,
			previewBorderTop,
			previewBorderRight,
			previewBorderBottom,
			previewBorderLeft,
		]
	);

	// Memoize rich text styles
	const richTextStyles = useMemo(
		() => ({
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
							? previewColorTextShadow // If rgba, use the color as is
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
		}),
		[
			fontWeight,
			fontStyle,
			previewLetterSpacing,
			letterSpacingType,
			textTransform,
			typography,
			renderTypography,
			enableTextShadow,
			previewHOffset,
			previewVOffset,
			previewBlur,
			previewColorTextShadow,
			previewTextShadowOpacity,
			previewTextOrientation,
			textOrientation,
			previewMaxHeight,
		]
	);

	const headingContent = (
		<TagHTML className={classes} data-alt-title={altTitle ? altTitle : undefined} style={headingStyles}>
			{iconSide === 'left' && renderIcon()}

			{!isDynamicReplaced && (
				<RichText
					id={'adv-heading' + uniqueID}
					tagName="span"
					className={'kb-adv-heading-inner'}
					allowedFormats={richTextFormats}
					value={content}
					onChange={onChangeContent}
					onMerge={mergeBlocks}
					onSplit={onSplit}
					onReplace={onReplace}
					onRemove={onRemove}
					style={richTextStyles}
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

	// Memoize heading link content
	const headingLinkContent = useMemo(
		() => (
			<a
				href={link}
				className={`kb-advanced-heading-link${linkStyle ? ' hls-' + linkStyle : ''}`}
				onClick={onLinkClick}
			>
				{headingContent}
			</a>
		),
		[link, linkStyle, onLinkClick, headingContent]
	);

	// Memoize wrapper classes
	const wrapperClasses = useMemo(() => {
		const baseClasses = {
			'kb-is-heading': htmlTag && htmlTag === 'heading',
			'kb-adv-text': true,
		};
		// Add className from props if it exists
		if (className) {
			return classnames(baseClasses, className);
		}
		return classnames(baseClasses);
	}, [htmlTag, className]);

	const nonTransAttrs = ['content', 'altTitle'];

	// Ensure wrapperClasses is always a string
	const safeWrapperClasses = wrapperClasses || '';

	const blockProps = useBlockProps({
		className: safeWrapperClasses,
	});

	// Fixed useEffect with proper dependencies
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
	}, []); // Empty dependency array as this should only run once on mount

	// Typed effect
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
					iFrameSelector && iFrameSelector.length > 0
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
					iFrameSelector && iFrameSelector.length > 0
						? document.getElementsByName('editor-canvas')[0].contentWindow.document
						: document;
				if (selector.getElementById('adv-heading' + uniqueID)) {
					selector.getElementById('adv-heading' + uniqueID).innerHTML = attributes.content;
				}
			};
		}
	}, [isSelected, attributes.content, uniqueID, sanitizeString]);

	// Memoize styles
	const markHighlightStyles = useMemo(() => {
		const styles = `.kt-adv-heading${uniqueID} mark.kt-highlight, .kt-adv-heading${uniqueID} .rich-text:focus mark.kt-highlight[data-rich-text-format-boundary] {
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
					? 'border-top-left-radius:' + previewMarkBorderRadiusTop + markBorderRadiusUnitPreview + ';'
					: ''
			}
			${
				'' !== previewMarkBorderRadiusRight
					? 'border-top-right-radius:' + previewMarkBorderRadiusRight + markBorderRadiusUnitPreview + ';'
					: ''
			}
			${
				'' !== previewMarkBorderRadiusBottom
					? 'border-bottom-right-radius:' + previewMarkBorderRadiusBottom + markBorderRadiusUnitPreview + ';'
					: ''
			}
			${
				'' !== previewMarkBorderRadiusLeft
					? 'border-bottom-left-radius:' + previewMarkBorderRadiusLeft + markBorderRadiusUnitPreview + ';'
					: ''
			}
		}`;
		return styles;
	}, [
		uniqueID,
		enableMarkGradient,
		markColor,
		markBG,
		markBGString,
		markGradient,
		enableMarkBackgroundGradient,
		markBackgroundGradient,
		enableTextGradient,
		markFontWeight,
		markFontStyle,
		previewMarkSize,
		markSizeType,
		previewMarkLineHeight,
		markLineType,
		previewMarkLetterSpacing,
		markLetterSpacingType,
		markTextTransform,
		markTypography,
		previewMarkBorderTopStyle,
		previewMarkBorderRightStyle,
		previewMarkBorderBottomStyle,
		previewMarkBorderLeftStyle,
		previewMarkPaddingTop,
		markPaddingType,
		previewMarkPaddingRight,
		previewMarkPaddingBottom,
		previewMarkPaddingLeft,
		previewMarkBorderRadiusTop,
		markBorderRadiusUnitPreview,
		previewMarkBorderRadiusRight,
		previewMarkBorderRadiusBottom,
		previewMarkBorderRadiusLeft,
	]);

	const otherStyles = useMemo(() => {
		let styles = '';
		if (previewMaxWidth) {
			styles += `.editor-styles-wrapper *:not(.kadence-inner-column-direction-horizontal) > .wp-block-kadence-advancedheading .kt-adv-heading${uniqueID}, .editor-styles-wrapper .kadence-inner-column-direction-horizontal > .wp-block-kadence-advancedheading[data-block="${clientId}"] { max-width:${
				previewMaxWidth + (maxWidthType ? maxWidthType : 'px')
			} !important; }`;
		}
		if (previewMaxWidth && previewAlign === 'center') {
			styles += `.editor-styles-wrapper *:not(.kadence-inner-column-direction-horizontal) > .wp-block-kadence-advancedheading .kt-adv-heading${uniqueID}, .editor-styles-wrapper .kadence-inner-column-direction-horizontal > .wp-block-kadence-advancedheading[data-block="${clientId}"] { margin-left: auto; margin-right:auto; }`;
		}
		if (previewMaxWidth && previewAlign === 'right') {
			styles += `.editor-styles-wrapper *:not(.kadence-inner-column-direction-horizontal) > .wp-block-kadence-advancedheading .kt-adv-heading${uniqueID}, .editor-styles-wrapper .kadence-inner-column-direction-horizontal > .wp-block-kadence-advancedheading[data-block="${clientId}"] { margin-left: auto; margin-right:0; }`;
		}
		if (linkStyle) {
			styles += `.kt-adv-heading${uniqueID} a, #block-${clientId} a {
				${linkStyle === 'underline' ? 'text-decoration: underline;' : ''}
				${linkStyle === 'none' ? 'text-decoration: none;' : ''}
			}
			.kt-adv-heading${uniqueID} a, #block-${clientId} a:hover {
				${linkStyle === 'hover_underline' ? 'text-decoration: underline;' : ''}
			}`;
		}
		if (linkColor) {
			styles += `.kt-adv-heading${uniqueID} a, #block-${clientId} a.kb-advanced-heading-link, #block-${clientId} a.kb-advanced-heading-link > .kadence-advancedheading-text {
				color: ${KadenceColorOutput(linkColor)} !important;
			}`;
		}
		if (linkHoverColor) {
			styles += `.kt-adv-heading${uniqueID} a:hover, #block-${clientId} a.kb-advanced-heading-link:hover, #block-${clientId} a.kb-advanced-heading-link:hover > .kadence-advancedheading-text {
				color: ${KadenceColorOutput(linkHoverColor)}!important;
			}`;
		}
		if (enableTextGradient && textGradient !== '') {
			styles += `.kt-adv-heading${uniqueID}.kadence-advancedheading-text, .kt-adv-heading${uniqueID} .kadence-advancedheading-text {
				-webkit-background-clip: text;
				background-clip: text;
				-webkit-text-fill-color: transparent;
				-webkit-box-decoration-break: clone;
			}`;
		}
		if (iconColorHover) {
			styles += `#block-${clientId} .kadence-advancedheading-text:hover > .kb-advanced-heading-svg-icon {
				color: ${KadenceColorOutput(iconColorHover)}!important;
			}`;
		}
		if (enableTextGradient) {
			styles += `.kt-adv-heading${uniqueID} > span#adv-heading${uniqueID} {
				background-image: ${textGradient};
				-webkit-background-clip: text;
				background-clip: text;
				-webkit-text-fill-color: transparent;
				-webkit-box-decoration-break: clone;
				box-decoration-break: clone;
				display: inline;
			}`;
		}
		return styles;
	}, [
		previewMaxWidth,
		uniqueID,
		clientId,
		maxWidthType,
		previewAlign,
		linkStyle,
		linkColor,
		linkHoverColor,
		enableTextGradient,
		textGradient,
		iconColorHover,
	]);

	return (
		<div {...blockProps}>
			<style>
				{markHighlightStyles}
				{otherStyles}
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
							onLetterSpacing={onChangeLetterSpacing}
							fontFamily={typography}
							onFontFamily={onChangeTypography}
							onFontChange={onChangeFontFamily}
							googleFont={googleFont}
							onGoogleFont={onChangeGoogleFont}
							loadGoogleFont={loadGoogleFont}
							onLoadGoogleFont={onChangeLoadGoogleFont}
							fontVariant={fontVariant}
							onFontVariant={onChangeFontVariant}
							fontWeight={fontWeight}
							onFontWeight={onChangeFontWeight}
							fontStyle={fontStyle}
							onFontStyle={onChangeFontStyle}
							fontSubset={fontSubset}
							onFontSubset={onChangeFontSubset}
							textTransform={textTransform}
							onTextTransform={onChangeTextTransform}
							fontSizeArray={false}
							fontSizeType={sizeType}
							onFontSizeType={(value) => setAttributes({ sizeType: value })}
							lineHeightType={fontHeightType}
							onLineHeightType={(value) => setAttributes({ fontHeightType: value })}
							fontSize={undefined !== fontSize?.[0] ? fontSize[0] : ''}
							onFontSize={onChangeFontSize}
							tabSize={undefined !== fontSize?.[1] ? fontSize[1] : ''}
							onTabSize={onChangeTabFontSize}
							mobileSize={undefined !== fontSize?.[2] ? fontSize[2] : ''}
							onMobileSize={onChangeMobileFontSize}
							lineHeight={undefined !== fontHeight?.[0] ? fontHeight[0] : ''}
							onLineHeight={onChangeLineHeight}
							tabLineHeight={undefined !== fontHeight?.[1] ? fontHeight[1] : ''}
							onTabLineHeight={onChangeTabLineHeight}
							mobileLineHeight={undefined !== fontHeight?.[2] ? fontHeight[2] : ''}
							onMobileLineHeight={onChangeMobileLineHeight}
						/>
					)}
				{showSettings('allSettings', 'kadence/advancedheading') &&
					showSettings('toolbarColor', 'kadence/advancedheading', false) && (
						<InlinePopColorControl
							label={__('Color', 'kadence-blocks')}
							value={color ? color : ''}
							default={''}
							onChange={onChangeColor}
							onClassChange={onChangeColorClass}
						/>
					)}
				<AlignmentToolbar value={align} onChange={onChangeAlign} />
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
							{showSettings('sizeSettings', 'kadence/advancedheading') && (
								<KadencePanelBody
									title={__('Size Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-adv-heading-size-settings'}
								>
									<ResponsiveFontSizeControl
										label={__('Font Size', 'kadence-blocks')}
										value={undefined !== fontSize?.[0] ? fontSize[0] : ''}
										onChange={onChangeFontSize}
										tabletValue={undefined !== fontSize?.[1] ? fontSize[1] : ''}
										onChangeTablet={onChangeTabFontSize}
										mobileValue={undefined !== fontSize?.[2] ? fontSize[2] : ''}
										onChangeMobile={onChangeMobileFontSize}
										min={0}
										max={sizeType === 'px' ? 300 : 12}
										step={sizeType === 'px' ? 1 : 0.1}
										unit={sizeType ? sizeType : 'px'}
										onUnit={(value) => setAttributes({ sizeType: value })}
										units={['px', 'em', 'rem', 'vw']}
									/>
									<KadenceWebfontLoader
										typography={typography}
										clientId={clientId}
										id={'advancedheading'}
									/>
									<TypographyControls
										fontGroup={'heading'}
										letterSpacing={letterSpacing}
										onLetterSpacing={onChangeLetterSpacing}
										letterSpacingType={letterSpacingType}
										onLetterSpacingType={(value) => setAttributes({ letterSpacingType: value })}
										lineHeight={fontHeight}
										onLineHeight={(value) => setAttributes({ fontHeight: value })}
										lineHeightType={fontHeightType}
										onLineHeightType={(value) => setAttributes({ fontHeightType: value })}
										fontFamily={typography}
										onFontFamily={onChangeTypography}
										onFontChange={onChangeFontFamily}
										googleFont={googleFont}
										onGoogleFont={onChangeGoogleFont}
										loadGoogleFont={loadGoogleFont}
										onLoadGoogleFont={onChangeLoadGoogleFont}
										fontVariant={fontVariant}
										onFontVariant={onChangeFontVariant}
										fontWeight={fontWeight}
										onFontWeight={onChangeFontWeight}
										fontStyle={fontStyle}
										onFontStyle={onChangeFontStyle}
										fontSubset={fontSubset}
										onFontSubset={onChangeFontSubset}
										textTransform={textTransform}
										onTextTransform={onChangeTextTransform}
										loadItalic={loadItalic}
										onLoadItalic={onChangeLoadItalic}
									/>
								</KadencePanelBody>
							)}
							<KadencePanelBody
								title={__('Highlight Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-highlight-settings'}
							>
								<HoverToggleControl
									normal={
										<>
											<PopColorControl
												label={__('Highlight Color', 'kadence-blocks')}
												value={markColor ? markColor : ''}
												default={''}
												onChange={(value) => setAttributes({ markColor: value })}
											/>
											<PopColorControl
												label={__('Highlight Background', 'kadence-blocks')}
												value={markBG ? markBG : ''}
												default={''}
												opacity={markBGOpacity}
												onChange={(value) => setAttributes({ markBG: value })}
												opacityValue={markBGOpacity}
												onOpacityChange={(value) => setAttributes({ markBGOpacity: value })}
											/>
										</>
									}
									hover={
										<>
											<BackgroundTypeControl
												label={__('Type', 'kadence-blocks')}
												type={enableMarkGradient ? 'gradient' : 'normal'}
												onChange={(value) =>
													setAttributes({ enableMarkGradient: value === 'gradient' })
												}
												allowedTypes={['normal', 'gradient']}
											/>
											{enableMarkGradient && (
												<GradientControl
													value={markGradient}
													onChange={(value) => setAttributes({ markGradient: value })}
													gradients={[]}
												/>
											)}
											{!enableMarkGradient && (
												<PopColorControl
													label={__('Highlight Color', 'kadence-blocks')}
													value={markColor ? markColor : ''}
													default={''}
													onChange={(value) => setAttributes({ markColor: value })}
												/>
											)}
											<BackgroundTypeControl
												label={__('Background Type', 'kadence-blocks')}
												type={enableMarkBackgroundGradient ? 'gradient' : 'normal'}
												onChange={(value) =>
													setAttributes({
														enableMarkBackgroundGradient: value === 'gradient',
													})
												}
												allowedTypes={['normal', 'gradient']}
											/>
											{enableMarkBackgroundGradient && (
												<GradientControl
													value={markBackgroundGradient}
													onChange={(value) =>
														setAttributes({ markBackgroundGradient: value })
													}
													gradients={[]}
												/>
											)}
											{!enableMarkBackgroundGradient && (
												<PopColorControl
													label={__('Highlight Background', 'kadence-blocks')}
													value={markBG ? markBG : ''}
													default={''}
													opacity={markBGOpacity}
													onChange={(value) => setAttributes({ markBG: value })}
													opacityValue={markBGOpacity}
													onOpacityChange={(value) => setAttributes({ markBGOpacity: value })}
												/>
											)}
										</>
									}
								/>
								<ResponsiveMeasurementControls
									label={__('Highlight Padding', 'kadence-blocks')}
									value={markPadding}
									tabletValue={markTabPadding}
									mobileValue={markMobilePadding}
									onChange={(value) => setAttributes({ markPadding: value })}
									onChangeTablet={(value) => setAttributes({ markTabPadding: value })}
									onChangeMobile={(value) => setAttributes({ markMobilePadding: value })}
									min={markPaddingType === 'em' || markPaddingType === 'rem' ? -12 : -200}
									max={markPaddingType === 'em' || markPaddingType === 'rem' ? 12 : 200}
									step={markPaddingType === 'em' || markPaddingType === 'rem' ? 0.1 : 1}
									unit={markPaddingType}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ markPaddingType: value })}
								/>
								<ResponsiveBorderControl
									label={__('Highlight Border', 'kadence-blocks')}
									value={markBorderStyles}
									tabletValue={tabletMarkBorderStyles}
									mobileValue={mobileMarkBorderStyles}
									onChange={(value) => setAttributes({ markBorderStyles: value })}
									onChangeTablet={(value) => setAttributes({ tabletMarkBorderStyles: value })}
									onChangeMobile={(value) => setAttributes({ mobileMarkBorderStyles: value })}
								/>
								<ResponsiveMeasurementControls
									label={__('Highlight Border Radius', 'kadence-blocks')}
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
								<ResponsiveFontSizeControl
									label={__('Highlight Font Size', 'kadence-blocks')}
									value={undefined !== markSize?.[0] ? markSize[0] : ''}
									onChange={(value) =>
										setAttributes({
											markSize: [
												value,
												undefined !== markSize?.[1] ? markSize[1] : '',
												undefined !== markSize?.[2] ? markSize[2] : '',
											],
										})
									}
									tabletValue={undefined !== markSize?.[1] ? markSize[1] : ''}
									onChangeTablet={(value) =>
										setAttributes({
											markSize: [
												undefined !== markSize?.[0] ? markSize[0] : '',
												value,
												undefined !== markSize?.[2] ? markSize[2] : '',
											],
										})
									}
									mobileValue={undefined !== markSize?.[2] ? markSize[2] : ''}
									onChangeMobile={(value) =>
										setAttributes({
											markSize: [
												undefined !== markSize?.[0] ? markSize[0] : '',
												undefined !== markSize?.[1] ? markSize[1] : '',
												value,
											],
										})
									}
									min={0}
									max={markSizeType === 'px' ? 300 : 12}
									step={markSizeType === 'px' ? 1 : 0.1}
									unit={markSizeType ? markSizeType : 'px'}
									onUnit={(value) => setAttributes({ markSizeType: value })}
									units={['px', 'em', 'rem', 'vw']}
								/>
								<ResponsiveRangeControls
									label={__('Highlight Line Height', 'kadence-blocks')}
									value={undefined !== markLineHeight?.[0] ? markLineHeight[0] : ''}
									onChange={(value) =>
										setAttributes({
											markLineHeight: [
												value,
												undefined !== markLineHeight?.[1] ? markLineHeight[1] : '',
												undefined !== markLineHeight?.[2] ? markLineHeight[2] : '',
											],
										})
									}
									tabletValue={undefined !== markLineHeight?.[1] ? markLineHeight[1] : ''}
									onChangeTablet={(value) =>
										setAttributes({
											markLineHeight: [
												undefined !== markLineHeight?.[0] ? markLineHeight[0] : '',
												value,
												undefined !== markLineHeight?.[2] ? markLineHeight[2] : '',
											],
										})
									}
									mobileValue={undefined !== markLineHeight?.[2] ? markLineHeight[2] : ''}
									onChangeMobile={(value) =>
										setAttributes({
											markLineHeight: [
												undefined !== markLineHeight?.[0] ? markLineHeight[0] : '',
												undefined !== markLineHeight?.[1] ? markLineHeight[1] : '',
												value,
											],
										})
									}
									min={0}
									max={markLineType === 'px' ? 300 : 12}
									step={markLineType === 'px' ? 1 : 0.1}
									unit={markLineType}
									onUnit={(value) => setAttributes({ markLineType: value })}
									units={['px', 'em', 'rem']}
								/>
								<KadenceWebfontLoader
									typography={markTypography}
									clientId={clientId}
									id={'advancedheading'}
								/>
								<TypographyControls
									fontGroup={'heading'}
									letterSpacing={markLetterSpacing}
									onLetterSpacing={(value) => setAttributes({ markLetterSpacing: value })}
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
							</KadencePanelBody>
							{showSettings('advancedSettings', 'kadence/advancedheading') && (
								<KadencePanelBody
									title={__('Link Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-adv-heading-link-settings'}
								>
									<URLInputControl
										label={__('Link', 'kadence-blocks')}
										url={link}
										onChangeUrl={(value) => setAttributes({ link: value })}
										additionalControls={
											<>
												<ToggleControl
													label={__('Open in New Tab', 'kadence-blocks')}
													checked={linkTarget === '_blank' ? true : false}
													onChange={(value) => {
														if (value) {
															setAttributes({ linkTarget: '_blank' });
														} else {
															setAttributes({ linkTarget: '_self' });
														}
													}}
												/>
												<ToggleControl
													label={__('Set link to nofollow?', 'kadence-blocks')}
													checked={linkNoFollow}
													onChange={(value) => setAttributes({ linkNoFollow: value })}
												/>
												<ToggleControl
													label={__('Set link attribute Sponsored?', 'kadence-blocks')}
													checked={linkSponsored}
													onChange={(value) => setAttributes({ linkSponsored: value })}
												/>
											</>
										}
									/>
									<SelectControl
										label={__('Link Style', 'kadence-blocks')}
										value={linkStyle}
										options={[
											{ value: '', label: __('None', 'kadence-blocks') },
											{ value: 'underline', label: __('Underline', 'kadence-blocks') },
											{
												value: 'hover_underline',
												label: __('Underline on Hover', 'kadence-blocks'),
											},
										]}
										onChange={(value) => setAttributes({ linkStyle: value })}
									/>
									<ColorGroup>
										<PopColorControl
											label={__('Link Color', 'kadence-blocks')}
											value={linkColor ? linkColor : ''}
											default={''}
											onChange={(value) => setAttributes({ linkColor: value })}
										/>
										<PopColorControl
											label={__('Hover Color', 'kadence-blocks')}
											value={linkHoverColor ? linkHoverColor : ''}
											default={''}
											onChange={(value) => setAttributes({ linkHoverColor: value })}
										/>
									</ColorGroup>
								</KadencePanelBody>
							)}
						</>
					)}
					{activeTab === 'style' && (
						<>
							<KadencePanelBody panelName={'kb-adv-single-color'}>
								<HoverToggleControl
									normal={
										<>
											<PopColorControl
												label={__('Color', 'kadence-blocks')}
												value={color ? color : ''}
												default={''}
												onChange={onChangeColor}
												onClassChange={onChangeColorClass}
											/>
											<PopColorControl
												label={__('Background', 'kadence-blocks')}
												value={background ? background : ''}
												default={''}
												onChange={(value) => setAttributes({ background: value })}
												onClassChange={(value) =>
													setAttributes({ backgroundColorClass: value })
												}
											/>
										</>
									}
									hover={
										<>
											<BackgroundTypeControl
												label={__('Type', 'kadence-blocks')}
												type={enableTextGradient ? 'gradient' : 'normal'}
												onChange={(value) =>
													setAttributes({ enableTextGradient: value === 'gradient' })
												}
												allowedTypes={['normal', 'gradient']}
											/>
											{enableTextGradient && (
												<GradientControl
													value={textGradient}
													onChange={(value) => setAttributes({ textGradient: value })}
													gradients={[]}
												/>
											)}
											{!enableTextGradient && (
												<PopColorControl
													label={__('Color', 'kadence-blocks')}
													value={color ? color : ''}
													default={''}
													onChange={onChangeColor}
													onClassChange={onChangeColorClass}
												/>
											)}
											<PopColorControl
												label={__('Background', 'kadence-blocks')}
												value={background ? background : ''}
												default={''}
												onChange={(value) => setAttributes({ background: value })}
												onClassChange={(value) =>
													setAttributes({ backgroundColorClass: value })
												}
											/>
										</>
									}
								/>
							</KadencePanelBody>
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
									onChange={onChangeBorderStyle}
									onChangeTablet={onChangeTabletBorderStyle}
									onChangeMobile={onChangeMobileBorderStyle}
								/>
								<ResponsiveMeasurementControls
									label={__('Border Radius', 'kadence-blocks')}
									value={borderRadius}
									tabletValue={tabletBorderRadius}
									mobileValue={mobileBorderRadius}
									onChange={onChangeBorderRadius}
									onChangeTablet={onChangeTabletBorderRadius}
									onChangeMobile={onChangeMobileBorderRadius}
									unit={borderRadiusUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={onChangeBorderRadiusUnit}
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
									onChange={onChangeEnableTextShadow}
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
									onChange={onChangeTextOrientation}
									onChangeTablet={onChangeTabletTextOrientation}
									onChangeMobile={onChangeMobileTextOrientation}
								/>
								{textOrientation !== 'horizontal' && textOrientation !== '' && (
									<ResponsiveRangeControls
										reset={onResetMaxHeight}
										label={__('Max Height', 'kadence-blocks')}
										value={previewMaxHeight}
										onChange={onChangeMaxHeight}
										tabletValue={
											undefined !== maxHeight && undefined !== maxHeight[1] ? maxHeight[1] : ''
										}
										onChangeTablet={onChangeTabletMaxHeight}
										mobileValue={
											undefined !== maxHeight && undefined !== maxHeight[2] ? maxHeight[2] : ''
										}
										onChangeMobile={onChangeMobileMaxHeight}
										min={0}
										max={maxHeightType === 'px' ? 2000 : 100}
										step={1}
										unit={maxHeightType ? maxHeightType : 'px'}
										onUnit={onChangeMaxHeightType}
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
										<KadenceIconPicker value={icon} onChange={onChangeIcon} allowClear={true} />
									</div>
									<SelectControl
										label={__('Icon Location', 'kadence-blocks')}
										value={iconSide}
										options={[
											{ value: 'left', label: __('Left', 'kadence-blocks') },
											{ value: 'right', label: __('Right', 'kadence-blocks') },
										]}
										onChange={onChangeIconSide}
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
										onChange={onChangeIconVerticalAlign}
									/>
									<ResponsiveRangeControls
										label={__('Icon Size', 'kadence-blocks')}
										value={undefined !== iconSize?.[0] ? iconSize[0] : ''}
										onChange={onChangeIconSize}
										tabletValue={undefined !== iconSize?.[1] ? iconSize[1] : ''}
										onChangeTablet={onChangeTabletIconSize}
										mobileValue={undefined !== iconSize?.[2] ? iconSize[2] : ''}
										onChangeMobile={onChangeMobileIconSize}
										min={0}
										max={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 12 : 200}
										step={(iconSizeUnit ? iconSizeUnit : 'px') !== 'px' ? 0.1 : 1}
										unit={iconSizeUnit ? iconSizeUnit : 'px'}
										onUnit={onChangeIconSizeUnit}
										units={['px', 'em', 'rem']}
										reset={true}
									/>
									<PopColorControl
										label={__('Icon Color', 'kadence-blocks')}
										value={iconColor ? iconColor : ''}
										default={''}
										onChange={onChangeIconColor}
										swatchLabel2={__('Hover Color', 'kadence-blocks')}
										value2={iconColorHover ? iconColorHover : ''}
										default2={''}
										onChange2={onChangeIconColorHover}
									/>
									<ResponsiveMeasureRangeControl
										label={__('Icon Padding', 'kadence-blocks')}
										value={iconPadding}
										onChange={(value) => setAttributes({ iconPadding: value })}
										tabletValue={tabletIconPadding}
										onChangeTablet={(value) => setAttributes({ tabletIconPadding: value })}
										mobileValue={mobileIconPadding}
										onChangeMobile={(value) => setAttributes({ mobileIconPadding: value })}
										min={0}
										max={(iconPaddingUnit ? iconPaddingUnit : 'px') === 'px' ? 100 : 4}
										step={(iconPaddingUnit ? iconPaddingUnit : 'px') === 'px' ? 1 : 0.1}
										unit={iconPaddingUnit ? iconPaddingUnit : 'px'}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ iconPaddingUnit: value })}
										axis={'all'}
										allowEmpty={true}
									/>
									<h2 className="kt-heading-size-title">{__('Icon Tooltip', 'kadence-blocks')}</h2>
									<TextControl
										label={__('Icon Title for Tooltip', 'kadence-blocks')}
										value={iconTitle || ''}
										onChange={(value) => setAttributes({ iconTitle: value })}
									/>
									<TextareaControl
										label={__('Icon Text for Tooltip', 'kadence-blocks')}
										value={iconTooltip || ''}
										onChange={(value) => setAttributes({ iconTooltip: value })}
									/>
									<SelectControl
										label={__('Tooltip Placement', 'kadence-blocks')}
										value={iconTooltipPlacement || 'top'}
										options={[
											{ value: 'top', label: __('Top', 'kadence-blocks') },
											{ value: 'top-start', label: __('Top Start', 'kadence-blocks') },
											{ value: 'top-end', label: __('Top End', 'kadence-blocks') },
											{ value: 'right', label: __('Right', 'kadence-blocks') },
											{ value: 'right-start', label: __('Right Start', 'kadence-blocks') },
											{ value: 'right-end', label: __('Right End', 'kadence-blocks') },
											{ value: 'bottom', label: __('Bottom', 'kadence-blocks') },
											{ value: 'bottom-start', label: __('Bottom Start', 'kadence-blocks') },
											{ value: 'bottom-end', label: __('Bottom End', 'kadence-blocks') },
											{ value: 'left', label: __('Left', 'kadence-blocks') },
											{ value: 'left-start', label: __('Left Start', 'kadence-blocks') },
											{ value: 'left-end', label: __('Left End', 'kadence-blocks') },
											{ value: 'auto', label: __('Auto', 'kadence-blocks') },
											{ value: 'auto-start', label: __('Auto Start', 'kadence-blocks') },
											{ value: 'auto-end', label: __('Auto End', 'kadence-blocks') },
										]}
										onChange={(value) => setAttributes({ iconTooltipPlacement: value })}
									/>
									<ToggleControl
										label={__('Show Dotted Line under Icon', 'kadence-blocks')}
										checked={iconTooltipDash}
										onChange={(value) => setAttributes({ iconTooltipDash: value })}
									/>
								</KadencePanelBody>
							)}
						</>
					)}
					{activeTab === 'advanced' && (
						<>
							{showSettings('allSettings', 'kadence/advancedheading', false) && (
								<>
									<KadencePanelBody panelName={'kb-adv-heading-spacing-settings'}>
										<ResponsiveMeasureRangeControl
											label={__('Padding', 'kadence-blocks')}
											value={padding}
											onChange={(value) => setAttributes({ padding: value })}
											tabletValue={tabletPadding}
											onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
											mobileValue={mobilePadding}
											onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
											min={paddingType === 'em' || paddingType === 'rem' ? -25 : -400}
											max={paddingType === 'em' || paddingType === 'rem' ? 25 : 400}
											step={paddingType === 'em' || paddingType === 'rem' ? 0.1 : 1}
											unit={paddingType}
											units={['px', 'em', 'rem', '%', 'vh', 'vw']}
											onUnit={(value) => setAttributes({ paddingType: value })}
											onMouseOver={paddingMouseOver.onMouseOver}
											onMouseOut={paddingMouseOver.onMouseOut}
										/>
										<ResponsiveMeasureRangeControl
											label={__('Margin', 'kadence-blocks')}
											value={margin}
											onChange={(value) => setAttributes({ margin: value })}
											tabletValue={tabletMargin}
											onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
											mobileValue={mobileMargin}
											onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
											min={marginType === 'em' || marginType === 'rem' ? -12 : -200}
											max={marginType === 'em' || marginType === 'rem' ? 12 : 200}
											step={marginType === 'em' || marginType === 'rem' ? 0.1 : 1}
											unit={marginType}
											units={['px', 'em', 'rem', '%', 'vh']}
											onUnit={(value) => setAttributes({ marginType: value })}
											onMouseOver={marginMouseOver.onMouseOver}
											onMouseOut={marginMouseOver.onMouseOut}
											allowAuto={true}
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
												paddingLeft:
													undefined !== previewPaddingLeft
														? getSpacingOptionOutput(previewPaddingLeft, paddingType)
														: undefined,
												paddingRight:
													undefined !== previewPaddingRight
														? getSpacingOptionOutput(previewPaddingRight, paddingType)
														: undefined,
												paddingTop:
													undefined !== previewPaddingTop
														? getSpacingOptionOutput(previewPaddingTop, paddingType)
														: undefined,
												paddingBottom:
													undefined !== previewPaddingBottom
														? getSpacingOptionOutput(previewPaddingBottom, paddingType)
														: undefined,
											}}
											type="heading"
											forceShow={paddingMouseOver.isMouseOver || marginMouseOver.isMouseOver}
											level={htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level}
											color={color ? color : ''}
										/>
									</KadencePanelBody>
									<div className="kt-sidebar-settings-spacer"></div>
									<ResponsiveAlignControls
										label={__('Text Alignment', 'kadence-blocks')}
										value={align ? align : ''}
										mobileValue={mobileAlign ? mobileAlign : ''}
										tabletValue={tabletAlign ? tabletAlign : ''}
										onChange={(nextAlign) => setAttributes({ align: nextAlign })}
										onChangeTablet={(nextAlign) => setAttributes({ tabletAlign: nextAlign })}
										onChangeMobile={(nextAlign) => setAttributes({ mobileAlign: nextAlign })}
									/>
									<TwoColumn className={'kb-heading-tag-label'}>
										<TagSelect
											label={__('HTML Tag', 'kadence-blocks')}
											value={htmlTag && htmlTag !== 'heading' ? htmlTag : 'h' + level}
											onChange={(value) => {
												if ('h1' === value) {
													setAttributes({ level: 1, htmlTag: 'heading' });
												} else if ('h2' === value) {
													setAttributes({ level: 2, htmlTag: 'heading' });
												} else if ('h3' === value) {
													setAttributes({ level: 3, htmlTag: 'heading' });
												} else if ('h4' === value) {
													setAttributes({ level: 4, htmlTag: 'heading' });
												} else if ('h5' === value) {
													setAttributes({ level: 5, htmlTag: 'heading' });
												} else if ('h6' === value) {
													setAttributes({ level: 6, htmlTag: 'heading' });
												} else {
													setAttributes({ htmlTag: value });
												}
											}}
										/>
										<TextControl
											label={__('Title Attribute', 'kadence-blocks')}
											value={altTitle || ''}
											onChange={(value) => setAttributes({ altTitle: value })}
										/>
									</TwoColumn>
									<ResponsiveMeasureRangeControl
										label={__('Max Width', 'kadence-blocks')}
										value={[
											previewMaxWidth,
											maxWidth && maxWidth[1] ? maxWidth[1] : '',
											maxWidth && maxWidth[2] ? maxWidth[2] : '',
										]}
										onChange={(value) => {
											setAttributes({ maxWidth: [value[0], value[1], value[2]] });
										}}
										onChangeTablet={(value) => {
											setAttributes({
												maxWidth: [
													undefined !== maxWidth && undefined !== maxWidth[0]
														? maxWidth[0]
														: '',
													value,
													undefined !== maxWidth && undefined !== maxWidth[2]
														? maxWidth[2]
														: '',
												],
											});
										}}
										onChangeMobile={(value) => {
											setAttributes({
												maxWidth: [
													undefined !== maxWidth && undefined !== maxWidth[0]
														? maxWidth[0]
														: '',
													undefined !== maxWidth && undefined !== maxWidth[1]
														? maxWidth[1]
														: '',
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
										showUnit={true}
										single={true}
									/>
									<KadenceBlockDefaults
										attributes={attributes}
										defaultAttributes={metadata.attributes}
										blockSlug={metadata.name}
										excludedAttrs={nonTransAttrs}
									/>
									<DynamicInlineReplaceControl dynamicAttribute={'content'} {...props} />
								</>
							)}
						</>
					)}
				</InspectorControls>
			)}
			<InspectorAdvancedControls>
				<TextControl
					label={__('HTML Anchor', 'kadence-blocks')}
					help={__(
						'Anchors lets you link directly to a section on a page. Should be all lowercase.',
						'kadence-blocks'
					)}
					value={anchor || ''}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						setAttributes({
							anchor: nextValue,
						});
					}}
				/>
			</InspectorAdvancedControls>
			{paddingMouseOver.renderVisualizer}
			{marginMouseOver.renderVisualizer}
			{link ? headingLinkContent : headingContent}
		</div>
	);
}

export default KadenceAdvancedHeading;
