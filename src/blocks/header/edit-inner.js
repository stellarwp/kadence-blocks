/**
 * BLOCK: Kadence Advanced Heading
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, isEqual } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { formBlockIcon } from '@kadence/icons';
import {
	KadencePanelBody,
	InspectorControlTabs,
	SpacingVisualizer,
	ResponsiveMeasureRangeControl,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
	TypographyControls,
	PopColorControl,
	ColorGroup,
	BackgroundControl as KadenceBackgroundControl,
	HoverToggleControl,
	ResponsiveAlignControls,
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	arrayStringToInt,
	getFontSizeOptionOutput,
} from '@kadence/helpers';

import {
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
	store as editorStore,
} from '@wordpress/block-editor';
import { TextControl, ToggleControl, ToolbarGroup, ExternalLink, Button, Placeholder } from '@wordpress/components';

import { FormTitle, SelectForm, FieldBlockAppender } from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { useEntityPublish } from './hooks';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;
export function EditInner(props) {
	const { attributes, setAttributes, clientId, context, direct, id, isSelected } = props;
	const { uniqueID } = attributes;

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const [activeTab, setActiveTab] = useState('general');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	// Padding options
	const [padding] = useHeaderMeta('_kad_header_padding');
	const [tabletPadding] = useHeaderMeta('_kad_header_tabletPadding');
	const [mobilePadding] = useHeaderMeta('_kad_header_mobilePadding');
	const [paddingUnit] = useHeaderMeta('_kad_header_paddingUnit');

	// Margin options
	const [margin] = useHeaderMeta('_kad_header_margin');
	const [tabletMargin] = useHeaderMeta('_kad_header_tabletMargin');
	const [mobileMargin] = useHeaderMeta('_kad_header_mobileMargin');
	const [marginUnit] = useHeaderMeta('_kad_header_marginUnit');

	// Border options
	const [headerBorder] = useHeaderMeta('_kad_header_headerBorder');
	const [headerHoverBorder] = useHeaderMeta('_kad_header_headerHoverBorder');
	const [headerMobileBorder] = useHeaderMeta('_kad_header_headerMobileBorder');
	const [headerTabletBorder] = useHeaderMeta('_kad_header_headerTabletBorder');
	const [borderUnit] = useHeaderMeta('_kad_header_borderUnit');
	const [borderRadius] = useHeaderMeta('_kad_header_borderRadius');
	const [tabletBorderRadius] = useHeaderMeta('_kad_header_tabletBorderRadius');
	const [mobileBorderRadius] = useHeaderMeta('_kad_header_mobileBorderRadius');
	const [borderRadiusUnit] = useHeaderMeta('_kad_header_borderRadiusUnit');
	const [borderHoverRadius] = useHeaderMeta('_kad_header_borderHoverRadius');
	const [tabletBorderHoverRadius] = useHeaderMeta('_kad_header_tabletBorderHoverRadius');
	const [mobileBorderHoverRadius] = useHeaderMeta('_kad_header_mobileBorderHoverRadius');
	const [borderHoverRadiusUnit] = useHeaderMeta('_kad_header_borderHoverRadiusUnit');

	// Typography options

	const [headerFont] = useHeaderMeta('_kad_header_headerFont');

	//Background Options
	const [background] = useHeaderMeta('_kad_header_background');
	const [backgroundHover] = useHeaderMeta('_kad_header_backgroundHover');

	// Text color options
	const [textColor] = useHeaderMeta('_kad_header_textColor');
	const [linkColor] = useHeaderMeta('_kad_header_linkColor');
	const [linkHoverColor] = useHeaderMeta('_kad_header_linkHoverColor');

	// Flex direction settings
	const [flex] = useHeaderMeta('_kad_header_flex');

	const [className] = useHeaderMeta('_kad_header_className');
	const [anchor] = useHeaderMeta('_kad_header_anchor');

	const [meta, setMeta] = useHeaderProp('meta');

	const setMetaAttribute = (value, key) => {
		setMeta({ ...meta, ['_kad_header_' + key]: value });
	};

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

	const previewBorderTop = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.top ? getSpacingOptionOutput(headerBorder.top[2], headerBorder.unit) : '',
		undefined !== headerTabletBorder?.top
			? getSpacingOptionOutput(headerTabletBorder.top[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.top
			? getSpacingOptionOutput(headerMobileBorder.top[2], headerMobileBorder.unit)
			: ''
	);
	const previewBorderRight = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.right ? getSpacingOptionOutput(headerBorder.right[2], headerBorder.unit) : '',
		undefined !== headerTabletBorder?.right
			? getSpacingOptionOutput(headerTabletBorder.right[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.right
			? getSpacingOptionOutput(headerMobileBorder.right[2], headerMobileBorder.unit)
			: ''
	);
	const previewBorderBottom = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.bottom ? getSpacingOptionOutput(headerBorder.bottom[2], headerBorder.unit) : '',
		undefined !== headerTabletBorder?.bottom
			? getSpacingOptionOutput(headerTabletBorder.bottom[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.bottom
			? getSpacingOptionOutput(headerMobileBorder.bottom[2], headerMobileBorder.unit)
			: ''
	);
	const previewBorderLeft = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.left ? getSpacingOptionOutput(headerBorder.left[2], headerBorder.unit) : '',
		undefined !== headerTabletBorder?.left
			? getSpacingOptionOutput(headerTabletBorder.left[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.left
			? getSpacingOptionOutput(headerMobileBorder.left[2], headerMobileBorder.unit)
			: ''
	);

	const previewBorderColorTop = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.top ? KadenceColorOutput(headerBorder.top[0]) : '',
		undefined !== headerTabletBorder?.top ? KadenceColorOutput(headerTabletBorder.top[0]) : '',
		undefined !== headerMobileBorder?.top ? KadenceColorOutput(headerTabletBorder.top[0]) : ''
	);

	const previewBorderColorRight = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.right ? KadenceColorOutput(headerBorder.right[0]) : '',
		undefined !== headerTabletBorder?.right ? KadenceColorOutput(headerTabletBorder.right[0]) : '',
		undefined !== headerMobileBorder?.right ? KadenceColorOutput(headerTabletBorder.right[0]) : ''
	);

	const previewBorderColorBottom = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.bottom ? KadenceColorOutput(headerBorder.bottom[0]) : '',
		undefined !== headerTabletBorder?.bottom ? KadenceColorOutput(headerTabletBorder.bottom[0]) : '',
		undefined !== headerMobileBorder?.bottom ? KadenceColorOutput(headerTabletBorder.bottom[0]) : ''
	);

	const previewBorderColorLeft = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.left ? KadenceColorOutput(headerBorder.left[0]) : '',
		undefined !== headerTabletBorder?.left ? KadenceColorOutput(headerTabletBorder.left[0]) : '',
		undefined !== headerMobileBorder?.left ? KadenceColorOutput(headerTabletBorder.left[0]) : ''
	);

	const previewBorderStyleTop = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.top ? headerBorder.top[1] : '',
		undefined !== headerTabletBorder?.top ? headerTabletBorder.top[1] : '',
		undefined !== headerMobileBorder?.top ? headerMobileBorder.top[1] : ''
	);

	const previewBorderStyleRight = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.right ? headerBorder.right[1] : '',
		undefined !== headerTabletBorder?.right ? headerTabletBorder.right[1] : '',
		undefined !== headerMobileBorder?.right ? headerMobileBorder.right[1] : ''
	);

	const previewBorderStyleBottom = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.bottom ? headerBorder.bottom[1] : '',
		undefined !== headerTabletBorder?.bottom ? headerTabletBorder.bottom[1] : '',
		undefined !== headerMobileBorder?.bottom ? headerMobileBorder.bottom[1] : ''
	);

	const previewBorderStyleLeft = getPreviewSize(
		previewDevice,
		undefined !== headerBorder?.left ? headerBorder.left[1] : '',
		undefined !== headerTabletBorder?.left ? headerTabletBorder.left[1] : '',
		undefined !== headerMobileBorder?.left ? headerMobileBorder.left[1] : ''
	);

	const previewHoverBorderColorTop = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.top ? KadenceColorOutput(headerHoverBorder.top[0]) : '',
		undefined !== headerTabletBorder?.top ? KadenceColorOutput(headerTabletBorder.top[0]) : '',
		undefined !== headerMobileBorder?.top ? KadenceColorOutput(headerTabletBorder.top[0]) : ''
	);

	const previewHoverBorderColorRight = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.right ? KadenceColorOutput(headerHoverBorder.right[0]) : '',
		undefined !== headerTabletBorder?.right ? KadenceColorOutput(headerTabletBorder.right[0]) : '',
		undefined !== headerMobileBorder?.right ? KadenceColorOutput(headerTabletBorder.right[0]) : ''
	);

	const previewHoverBorderColorBottom = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.bottom ? KadenceColorOutput(headerHoverBorder.bottom[0]) : '',
		undefined !== headerTabletBorder?.bottom ? KadenceColorOutput(headerTabletBorder.bottom[0]) : '',
		undefined !== headerMobileBorder?.bottom ? KadenceColorOutput(headerTabletBorder.bottom[0]) : ''
	);

	const previewHoverBorderColorLeft = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.left ? KadenceColorOutput(headerHoverBorder.left[0]) : '',
		undefined !== headerTabletBorder?.left ? KadenceColorOutput(headerTabletBorder.left[0]) : '',
		undefined !== headerMobileBorder?.left ? KadenceColorOutput(headerTabletBorder.left[0]) : ''
	);

	const previewHoverBorderStyleTop = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.top ? headerHoverBorder.top[1] : '',
		undefined !== headerTabletBorder?.top ? headerTabletBorder.top[1] : '',
		undefined !== headerMobileBorder?.top ? headerMobileBorder.top[1] : ''
	);

	const previewHoverBorderStyleRight = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.right ? headerHoverBorder.right[1] : '',
		undefined !== headerTabletBorder?.right ? headerTabletBorder.right[1] : '',
		undefined !== headerMobileBorder?.right ? headerMobileBorder.right[1] : ''
	);

	const previewHoverBorderStyleBottom = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.bottom ? headerHoverBorder.bottom[1] : '',
		undefined !== headerTabletBorder?.bottom ? headerTabletBorder.bottom[1] : '',
		undefined !== headerMobileBorder?.bottom ? headerMobileBorder.bottom[1] : ''
	);

	const previewHoverBorderStyleLeft = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.left ? headerHoverBorder.left[1] : '',
		undefined !== headerTabletBorder?.left ? headerTabletBorder.left[1] : '',
		undefined !== headerMobileBorder?.left ? headerMobileBorder.left[1] : ''
	);

	const previewHoverBorderTop = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.top
			? getSpacingOptionOutput(headerHoverBorder.top[2], headerHoverBorder.unit)
			: '',
		undefined !== headerTabletBorder?.top
			? getSpacingOptionOutput(headerTabletBorder.top[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.top
			? getSpacingOptionOutput(headerMobileBorder.top[2], headerMobileBorder.unit)
			: ''
	);
	const previewHoverBorderRight = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.right
			? getSpacingOptionOutput(headerHoverBorder.right[2], headerHoverBorder.unit)
			: '',
		undefined !== headerTabletBorder?.right
			? getSpacingOptionOutput(headerTabletBorder.right[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.right
			? getSpacingOptionOutput(headerMobileBorder.right[2], headerMobileBorder.unit)
			: ''
	);
	const previewHoverBorderBottom = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.bottom
			? getSpacingOptionOutput(headerHoverBorder.bottom[2], headerHoverBorder.unit)
			: '',
		undefined !== headerTabletBorder?.bottom
			? getSpacingOptionOutput(headerTabletBorder.bottom[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.bottom
			? getSpacingOptionOutput(headerMobileBorder.bottom[2], headerMobileBorder.unit)
			: ''
	);
	const previewHoverBorderLeft = getPreviewSize(
		previewDevice,
		undefined !== headerHoverBorder?.left
			? getSpacingOptionOutput(headerHoverBorder.left[2], headerHoverBorder.unit)
			: '',
		undefined !== headerTabletBorder?.left
			? getSpacingOptionOutput(headerTabletBorder.left[2], headerTabletBorder.unit)
			: '',
		undefined !== headerMobileBorder?.left
			? getSpacingOptionOutput(headerMobileBorder.left[2], headerMobileBorder.unit)
			: ''
	);

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

	// Header font options
	const previewFontSize = getPreviewSize(
		previewDevice,
		undefined !== headerFont?.size?.[0] ? headerFont.size[0] : '',
		undefined !== headerFont?.size?.[1] ? headerFont.size[1] : '',
		undefined !== headerFont?.size?.[2] ? headerFont.size[2] : ''
	);
	const previewLineHeight = getPreviewSize(
		previewDevice,
		undefined !== headerFont?.lineHeight?.[0] ? headerFont.lineHeight[0] : '',
		undefined !== headerFont?.lineHeight?.[1] ? headerFont.lineHeight[1] : '',
		undefined !== headerFont?.lineHeight?.[2] ? headerFont.lineHeight[2] : ''
	);

	const previewLetterSpacing = getPreviewSize(
		previewDevice,
		undefined !== headerFont?.letterSpacing?.[0] ? headerFont.letterSpacing[0] : '',
		undefined !== headerFont?.letterSpacing?.[1] ? headerFont.letterSpacing[1] : '',
		undefined !== headerFont?.letterSpacing?.[2] ? headerFont.letterSpacing[2] : ''
	);

	// Flex direction options
	const previewDirection = getPreviewSize(
		previewDevice,
		undefined !== flex?.direction?.[0] ? flex.direction[0] : '',
		undefined !== flex?.direction?.[1] ? flex.direction[1] : '',
		undefined !== flex?.direction?.[2] ? flex.direction[2] : ''
	);

	const headerClasses = classnames({
		'kb-header': true,
		[`kb-header-${id}`]: true,
		[`kb-header${uniqueID}`]: uniqueID,
	});

	const renderCSS = (
		<style>
			{`
				.kb-header.kb-header${uniqueID} {
					${previewFontSize ? 'font-size:' + getFontSizeOptionOutput(previewFontSize, headerFont.sizeType) + ';' : ''}
					${previewLineHeight ? 'line-height:' + previewLineHeight + headerFont.lineType + ';' : ''}
					${previewLetterSpacing ? 'letter-spacing:' + previewLetterSpacing + 'px;' : ''}
					${headerFont?.textTransform ? 'text-transform:' + headerFont.textTransform + ';' : ''}
					${headerFont?.family ? 'font-family:' + headerFont.family + ';' : ''}
					${headerFont?.style ? 'font-style:' + headerFont.style + ';' : ''}
					${headerFont?.weight ? 'font-weight:' + headerFont.weight + ';' : ''}
					${undefined !== background?.image ? 'background-image: url("' + background.image + '")' + ';' : ''}
					${undefined !== background?.imageSize ? 'background-size: ' + background.imageSize + ';' : ''}
					${undefined !== background?.imageRepeat ? 'background-repeat: ' + background.imageRepeat + ';' : ''}
					${undefined !== background?.imageAttachment ? 'background-attachment: ' + background.imageAttachment + ';' : ''}
					${undefined !== background?.imagePosition ? 'background-position: ' + background.imagePosition + ';' : ''}
					${'' !== previewBorderTop ? 'border-top-width: ' + previewBorderTop + ';' : ''}
					${'' !== previewBorderRight ? 'border-right-width: ' + previewBorderRight + ';' : ''}
					${'' !== previewBorderBottom ? 'border-bottom-width: ' + previewBorderBottom + ';' : ''}
					${'' !== previewBorderLeft ? 'border-left-width: ' + previewBorderLeft + ';' : ''}
					${'' !== previewBorderStyleTop ? 'border-top-style: ' + previewBorderStyleTop + ';' : ''}
					${'' !== previewBorderStyleRight ? 'border-right-style: ' + previewBorderStyleRight + ';' : ''}
					${'' !== previewBorderStyleBottom ? 'border-bottom-style: ' + previewBorderStyleBottom + ';' : ''}
					${'' !== previewBorderStyleLeft ? 'border-left-style: ' + previewBorderStyleLeft + ';' : ''}
					${'' !== previewBorderColorTop ? 'border-top-color: ' + previewBorderColorTop + ';' : ''}
					${'' !== previewBorderColorRight ? 'border-right-color: ' + previewBorderColorRight + ';' : ''}
					${'' !== previewBorderColorBottom ? 'border-bottom-color: ' + previewBorderColorBottom + ';' : ''}
					${'' !== previewBorderColorLeft ? 'border-left-color: ' + previewBorderColorLeft + ';' : ''}
				}
				.kb-header.kb-header${uniqueID}:hover {
					${undefined !== backgroundHover?.image ? 'background-image: url("' + backgroundHover.image + '")' + ';' : ''}
					${undefined !== backgroundHover?.imageSize ? 'background-size: ' + backgroundHover.imageSize + ';' : ''}
					${undefined !== backgroundHover?.imageRepeat ? 'background-repeat: ' + backgroundHover.imageRepeat + ';' : ''}
					${
						undefined !== backgroundHover?.imageAttachment
							? 'background-attachment: ' + backgroundHover.imageAttachment + ';'
							: ''
					}
					${undefined !== backgroundHover?.imagePosition ? 'background-position: ' + backgroundHover.imagePosition + ';' : ''}
					${'' !== previewHoverBorderTop ? 'border-top-width: ' + previewHoverBorderTop + ';' : ''}
					${'' !== previewHoverBorderRight ? 'border-right-width: ' + previewHoverBorderRight + ';' : ''}
					${'' !== previewHoverBorderBottom ? 'border-bottom-width: ' + previewHoverBorderBottom + ';' : ''}
					${'' !== previewHoverBorderLeft ? 'border-left-width: ' + previewHoverBorderLeft + ';' : ''}
					${'' !== previewHoverBorderStyleTop ? 'border-top-style: ' + previewHoverBorderStyleTop + ';' : ''}
					${'' !== previewHoverBorderStyleRight ? 'border-right-style: ' + previewHoverBorderStyleRight + ';' : ''}
					${'' !== previewHoverBorderStyleBottom ? 'border-bottom-style: ' + previewHoverBorderStyleBottom + ';' : ''}
					${'' !== previewHoverBorderStyleLeft ? 'border-left-style: ' + previewHoverBorderStyleLeft + ';' : ''}
					${'' !== previewHoverBorderColorTop ? 'border-top-color: ' + previewHoverBorderColorTop + ';' : ''}
					${'' !== previewHoverBorderColorRight ? 'border-right-color: ' + previewHoverBorderColorRight + ';' : ''}
					${'' !== previewHoverBorderColorBottom ? 'border-bottom-color: ' + previewHoverBorderColorBottom + ';' : ''}
					${'' !== previewHoverBorderColorLeft ? 'border-left-color: ' + previewHoverBorderColorLeft + ';' : ''}
				}

				.kb-header.kb-header${uniqueID}, .kb-header.kb-header${uniqueID} p {
					${undefined !== textColor ? 'color: ' + KadenceColorOutput(textColor) + ';' : ''}
				}
				.kb-header.kb-header${uniqueID} a {
					${undefined !== linkColor ? 'color: ' + KadenceColorOutput(linkColor) + ';' : ''}
				}

				.kb-header.kb-header${uniqueID} a:hover {
					${undefined !== linkHoverColor ? 'color: ' + KadenceColorOutput(linkHoverColor) + ';' : ''}
				}
			`}
		</style>
	);

	const [title, setTitle] = useHeaderProp('title');

	let [blocks, onInput, onChange] = useEntityBlockEditor('postType', 'kadence_header', id);
	const { updateBlockAttributes } = useDispatch(editorStore);

	const emptyHeader = useMemo(() => {
		return [createBlock('kadence/column', {})];
	}, [clientId]);

	if (blocks.length === 0) {
		blocks = emptyHeader;
	}

	const headerInnerBlocks = useMemo(() => {
		return get(blocks, [0, 'innerBlocks'], []);
	}, [blocks]);

	const newBlock = useMemo(() => {
		return get(blocks, [0], {});
	}, [blocks]);

	const [isAdding, addNew] = useEntityPublish('kadence_header', id);
	const onAdd = async (title, template, initialDescription) => {
		try {
			const response = await addNew();

			if (response.id) {
				onChange([{ ...newBlock, innerBlocks: [createBlock('kadence/column', {})] }], clientId);

				setTitle(title);

				const updatedMeta = meta;
				updatedMeta._kad_header_description = initialDescription;

				setMeta({ ...meta, updatedMeta });
				await wp.data.dispatch('core').saveEditedEntityRecord('postType', 'kadence_header', id);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: headerClasses,
			style: {
				marginTop: '' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginUnit) : undefined,
				marginRight:
					'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginUnit) : undefined,
				marginBottom:
					'' !== previewMarginBottom ? getSpacingOptionOutput(previewMarginBottom, marginUnit) : undefined,
				marginLeft:
					'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginUnit) : undefined,

				paddingTop:
					'' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingUnit) : undefined,
				paddingRight:
					'' !== previewPaddingRight ? getSpacingOptionOutput(previewPaddingRight, paddingUnit) : undefined,
				paddingBottom:
					'' !== previewPaddingBottom ? getSpacingOptionOutput(previewPaddingBottom, paddingUnit) : undefined,
				paddingLeft:
					'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingUnit) : undefined,
				borderTopLeftRadius:
					'' !== previewBorderRadiusTop
						? getSpacingOptionOutput(previewBorderRadiusLeft, borderUnit)
						: undefined,
				borderTopRightRadius:
					'' !== previewBorderRadiusRight
						? getSpacingOptionOutput(previewBorderRadiusRight, borderUnit)
						: undefined,
				borderBottomLeftRadius:
					'' !== previewBorderRadiusBottom
						? getSpacingOptionOutput(previewBorderRadiusBottom, borderUnit)
						: undefined,
				borderBottomRightRadius:
					'' !== previewBorderLeft ? getSpacingOptionOutput(previewPaddingLeft, borderUnit) : undefined,
			},
		},
		{
			// allowedBlocks: ALLOWED_BLOCKS,
			value: !direct ? headerInnerBlocks : undefined,
			onInput: !direct ? (a, b) => onInput([{ ...newBlock, innerBlocks: a }], b) : undefined,
			onChange: !direct ? (a, b) => onChange([{ ...newBlock, innerBlocks: a }], b) : undefined,
			templateLock: false,
			// renderAppender: headerInnerBlocks.length === 0 ? useFieldBlockAppenderBase : useFieldBlockAppender
		}
	);

	if (headerInnerBlocks.length === 0) {
		return (
			<>
				<FormTitle onAdd={onAdd} isAdding={isAdding} existingTitle={title} />
				<div className="kb-form-hide-while-setting-up">
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	}
	if (typeof pagenow !== 'undefined' && ('widgets' === pagenow || 'customize' === pagenow)) {
		const editPostLink = addQueryArgs('post.php', {
			post: id,
			action: 'edit',
		});
		return (
			<>
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__('Kadence Heading', 'kadence-blocks')}
					icon={formBlockIcon}
				>
					<p style={{ width: '100%', marginBottom: '10px' }}>
						{__('Advanced Headers can not be edited within the widgets screen.', 'kadence-blocks')}
					</p>
					<Button href={editPostLink} variant="primary" className="kb-form-edit-link">
						{__('Edit Form', 'kadence-blocks')}
					</Button>
				</Placeholder>
				<InspectorControls>
					<KadencePanelBody
						panelName={'kb-advanced-form-selected-switch'}
						title={__('Selected Header', 'kadence-blocks')}
					>
						<SelectForm
							postType="kadence_header"
							label={__('Selected Header', 'kadence-blocks')}
							hideLabelFromVision={true}
							onChange={(nextId) => {
								setAttributes({ id: parseInt(nextId) });
							}}
							value={id}
						/>
					</KadencePanelBody>
				</InspectorControls>
			</>
		);
	}
	return (
		<>
			<style>
				{isSelected && (
					<>
						{`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter { display: none }`}
						;
					</>
				)}
			</style>

			<InspectorControls>
				<InspectorControlTabs
					panelName={'advanced-header'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Flex Settings', 'kadence-blocks')}
							panelName={'kb-col-flex-settings'}
						>
							<ResponsiveAlignControls
								label={__('Direction', 'kadence-blocks')}
								value={flex.direction && flex.direction[0] ? flex.direction[0] : 'vertical'}
								tabletValue={flex.direction && flex.direction[1] ? flex.direction[1] : ''}
								mobileValue={flex.direction && flex.direction[2] ? flex.direction[2] : ''}
								onChange={(value) => {
									if (value) {
										setMetaAttribute(
											{
												...flex,
												direction: [
													value,
													undefined !== flex.direction?.[1] ? flex.direction[1] : '',
													undefined !== flex.direction?.[2] ? flex.direction[2] : '',
												],
											},
											'flex'
										);
									}
								}}
								onChangeTablet={(value) => {
									let tempValue = value;
									if (flex.direction && flex.direction[1] && tempValue === flex.direction[1]) {
										tempValue = '';
									}
									setMetaAttribute(
										{
											...flex,
											direction: [
												undefined !== flex.direction?.[0] ? flex.direction[0] : '',
												tempValue,
												undefined !== flex.direction?.[2] ? flex.direction[2] : '',
											],
										},
										'flex'
									);
								}}
								onChangeMobile={(value) => {
									let tempValue = value;
									if (flex.direction && flex.direction[2] && tempValue === flex.direction[2]) {
										tempValue = '';
									}
									setMetaAttribute(
										{
											...flex,
											direction: [
												undefined !== flex.direction?.[0] ? flex.direction[0] : '',
												undefined !== flex.direction?.[1] ? flex.direction[1] : '',
												tempValue,
											],
										},
										'flex'
									);
								}}
								type={'orientation-column'}
							/>
							<div className="kt-sidebar-settings-spacer"></div>
							{(previewDirection === 'horizontal-reverse' || previewDirection === 'horizontal') && (
								<ResponsiveAlignControls
									label={__('Alignment', 'kadence-blocks')}
									value={
										flex.justifyContent && flex.justifyContent?.[0] ? flex.justifyContent[0] : ''
									}
									tabletValue={
										flex.justifyContent && flex.justifyContent?.[1] ? flex.justifyContent[1] : ''
									}
									mobileValue={
										flex.justifyContent && flex.justifyContent?.[2] ? flex.justifyContent[2] : ''
									}
									onChange={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[0]
												? flex.justifyContent[0]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													tempValue,
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeTablet={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[1]
												? flex.justifyContent[1]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													tempValue,
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeMobile={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[2]
												? flex.justifyContent[2]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													tempValue,
												],
											},
											'flex'
										);
									}}
									type={'justify-column'}
									reverse={previewDirection === 'horizontal-reverse' ? true : false}
								/>
							)}
							{(previewDirection === 'vertical-reverse' || previewDirection === 'vertical') && (
								<ResponsiveAlignControls
									label={__('Alignment', 'kadence-blocks')}
									value={
										flex.justifyContent && flex.justifyContent?.[0] ? flex.justifyContent[0] : ''
									}
									tabletValue={
										flex.justifyContent && flex.justifyContent?.[1] ? flex.justifyContent[1] : ''
									}
									mobileValue={
										flex.justifyContent && flex.justifyContent?.[2] ? flex.justifyContent[2] : ''
									}
									onChange={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[0]
												? flex.justifyContent[0]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													tempValue,
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeTablet={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[1]
												? flex.justifyContent[1]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													tempValue,
													flex.justifyContent && flex.justifyContent[2]
														? flex.justifyContent[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeMobile={(value) => {
										let tempValue = value;
										if (
											(flex.justifyContent && flex.justifyContent?.[2]
												? flex.justifyContent[2]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												justifyContent: [
													flex.justifyContent && flex.justifyContent?.[0]
														? flex.justifyContent[0]
														: '',
													flex.justifyContent && flex.justifyContent[1]
														? flex.justifyContent[1]
														: '',
													tempValue,
												],
											},
											'flex'
										);
									}}
									type={'justify-align'}
									reverse={previewDirection === 'horizontal-reverse' ? true : false}
								/>
							)}
							{(previewDirection === 'vertical-reverse' || previewDirection === 'vertical') && (
								<ResponsiveAlignControls
									label={__('Vertical Alignment', 'kadence-blocks')}
									value={undefined !== flex?.verticalAlignment?.[0] ? flex.verticalAlignment[0] : ''}
									mobileValue={
										undefined !== flex?.verticalAlignment?.[1] ? flex.verticalAlignment[1] : ''
									}
									tabletValue={
										undefined !== flex?.verticalAlignment?.[2] ? flex.verticalAlignment[2] : ''
									}
									onChange={(value) => {
										let tempValue = value;
										if (
											(flex.verticalAlignment && flex.verticalAlignment?.[0]
												? flex.verticalAlignment[0]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												verticalAlignment: [
													tempValue,
													flex.verticalAlignment && flex.verticalAlignment?.[1]
														? flex.verticalAlignment[1]
														: '',
													flex.verticalAlignment && flex.verticalAlignment?.[2]
														? flex.verticalAlignment[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeTablet={(value) => {
										let tempValue = value;
										if (
											(undefined !== flex?.verticalAlignment?.[1]
												? flex.verticalAlignment[1]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute(
											{
												...flex,
												verticalAlignmentTablet: [
													flex.verticalAlignment && flex.verticalAlignment?.[1]
														? flex.verticalAlignment[1]
														: '',
													tempValue,
													flex.verticalAlignment && flex.verticalAlignment?.[2]
														? flex.verticalAlignment[2]
														: '',
												],
											},
											'flex'
										);
									}}
									onChangeMobile={(value) => {
										let tempValue = value;
										if (
											(undefined !== flex?.verticalAlignment?.[2]
												? flex.verticalAlignment[2]
												: '') === value
										) {
											tempValue = '';
										}
										setMetaAttribute({
											...flex,
											verticalAlignmentMobile: [
												flex.verticalAlignment && flex.verticalAlignment?.[0]
													? flex.verticalAlignment[0]
													: '',
												flex.verticalAlignment && flex.verticalAlignment?.[1]
													? flex.verticalAlignment[1]
													: '',
												tempValue,
											],
										});
									}}
									type={'justify-vertical'}
									reverse={previewDirection === 'vertical-reverse' ? true : false}
								/>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody
							title={__('Background Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-header-bg-settings'}
						>
							<HoverToggleControl
								normal={
									<>
										<PopColorControl
											label={__('Background Color', 'kadence-blocks')}
											value={undefined !== background?.color ? background.color : ''}
											default={''}
											onChange={(value) => {
												setMetaAttribute({ ...background, color: value }, 'background');
											}}
										/>
										<KadenceBackgroundControl
											label={__('Background Image', 'kadence-blocks')}
											hasImage={
												undefined === background.image || '' === background.image ? false : true
											}
											imageURL={background.image ? background.image : ''}
											imageID={background.imageID}
											imagePosition={
												background.imagePosition ? background.imagePosition : 'center center'
											}
											imageSize={background.imageSize ? background.imageSize : 'cover'}
											imageRepeat={background.imageRepeat ? background.imageRepeat : 'no-repeat'}
											imageAttachment={
												background.imageAttachment ? background.imageAttachment : 'scroll'
											}
											imageAttachmentParallax={true}
											onRemoveImage={() => {
												setMetaAttribute({ ...background, imageID: undefined }, 'background');
												setMetaAttribute({ ...background, image: undefined }, 'background');
											}}
											onSaveImage={(value) => {
												setMetaAttribute(
													{ ...background, imageID: value.id.toString() },
													'background'
												);
												setMetaAttribute({ ...background, image: value.url }, 'background');
											}}
											onSaveURL={(newURL) => {
												if (newURL !== background.image) {
													setMetaAttribute(
														{ ...background, imageID: undefined },
														'background'
													);
													setMetaAttribute({ ...background, image: newURL }, 'background');
												}
											}}
											onSavePosition={(value) =>
												setMetaAttribute({ ...background, imagePosition: value }, 'background')
											}
											onSaveSize={(value) =>
												setMetaAttribute({ ...background, imageSize: value }, 'background')
											}
											onSaveRepeat={(value) =>
												setMetaAttribute({ ...background, imageRepeat: value }, 'background')
											}
											onSaveAttachment={(value) =>
												setMetaAttribute(
													{ ...background, imageAttachment: value },
													'background'
												)
											}
											disableMediaButtons={background.image ? true : false}
											dynamicAttribute="background:image"
											isSelected={isSelected}
											attributes={attributes}
											setAttributes={setAttributes}
											name={'kadence/header'}
											clientId={clientId}
											context={context}
										/>
									</>
								}
								hover={
									<KadenceBackgroundControl
										label={__('Background Image', 'kadence-blocks')}
										hasImage={
											undefined === backgroundHover.image || '' === backgroundHover.image
												? false
												: true
										}
										imageURL={backgroundHover.image ? backgroundHover.image : ''}
										imageID={backgroundHover.imageID}
										imagePosition={
											backgroundHover.imagePosition
												? backgroundHover.imagePosition
												: 'center center'
										}
										imageSize={backgroundHover.imageSize ? backgroundHover.imageSize : 'cover'}
										imageRepeat={
											backgroundHover.imageRepeat ? backgroundHover.imageRepeat : 'no-repeat'
										}
										imageAttachment={
											backgroundHover.imageAttachment ? backgroundHover.imageAttachment : 'scroll'
										}
										imageAttachmentParallax={true}
										onRemoveImage={() => {
											setMetaAttribute(
												{ ...backgroundHover, imageID: undefined },
												'backgroundHover'
											);
											setMetaAttribute(
												{ ...backgroundHover, image: undefined },
												'backgroundHover'
											);
										}}
										onSaveImage={(value) => {
											setMetaAttribute(
												{ ...backgroundHover, imageID: value.id.toString() },
												'backgroundHover'
											);
											setMetaAttribute(
												{ ...backgroundHover, image: value.url },
												'backgroundHover'
											);
										}}
										onSaveURL={(newURL) => {
											if (newURL !== backgroundHover.image) {
												setMetaAttribute(
													{ ...backgroundHover, imageID: undefined },
													'backgroundHover'
												);
												setMetaAttribute(
													{ ...backgroundHover, image: newURL },
													'backgroundHover'
												);
											}
										}}
										onSavePosition={(value) =>
											setMetaAttribute(
												{ ...backgroundHover, imagePosition: value },
												'backgroundHover'
											)
										}
										onSaveSize={(value) =>
											setMetaAttribute(
												{ ...backgroundHover, imageSize: value },
												'backgroundHover'
											)
										}
										onSaveRepeat={(value) =>
											setMetaAttribute(
												{ ...backgroundHover, imageRepeat: value },
												'backgroundHover'
											)
										}
										onSaveAttachment={(value) =>
											setMetaAttribute(
												{ ...backgroundHover, imageAttachment: value },
												'backgroundHover'
											)
										}
										disableMediaButtons={backgroundHover.image ? true : false}
										dynamicAttribute="backgroundHover:image"
										isSelected={isSelected}
										attributes={attributes}
										setAttributes={setAttributes}
										name={'kadence/header'}
										clientId={clientId}
										context={context}
									/>
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Border Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-border'}
						>
							<HoverToggleControl
								normal={
									<>
										<ResponsiveBorderControl
											label={__('Border', 'kadence-blocks')}
											value={[headerBorder]}
											tabletValue={[headerTabletBorder]}
											mobileValue={[headerMobileBorder]}
											onChange={(value) => {
												setMetaAttribute(value[0], 'headerBorder');
											}}
											onChangeTablet={(value) => setMetaAttribute(value[0], 'headerTabletBorder')}
											onChangeMobile={(value) => setMetaAttribute(value[0], 'headerMobileBorder')}
										/>
										<ResponsiveMeasurementControls
											label={__('Border Radius', 'kadence-blocks')}
											value={borderRadius}
											tabletValue={tabletBorderRadius}
											mobileValue={mobileBorderRadius}
											onChange={(value) => setMetaAttribute(value, 'borderRadius')}
											onChangeTablet={(value) => setMetaAttribute(value, 'tabletBorderRadius')}
											onChangeMobile={(value) => setMetaAttribute(value, 'mobileBorderRadius')}
											unit={borderRadiusUnit}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setMetaAttribute(value, 'borderRadiusUnit')}
											max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 500}
											step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
											min={0}
											isBorderRadius={true}
											allowEmpty={true}
										/>
									</>
								}
								hover={
									<>
										<ResponsiveBorderControl
											label={__('Hover Border', 'kadence-blocks')}
											value={[headerHoverBorder]}
											tabletValue={[headerTabletBorder]}
											mobileValue={[headerMobileBorder]}
											onChange={(value) => {
												setMetaAttribute(value[0], 'headerHoverBorder');
											}}
											onChangeTablet={(value) => setMetaAttribute(value[0], 'headerTabletBorder')}
											onChangeMobile={(value) => setMetaAttribute(value[0], 'headerMobileBorder')}
										/>
										<ResponsiveMeasurementControls
											label={__('Border Radius', 'kadence-blocks')}
											value={borderHoverRadius}
											tabletValue={tabletBorderHoverRadius}
											mobileValue={mobileBorderHoverRadius}
											onChange={(value) => setMetaAttribute(value, 'borderHoverRadius')}
											onChangeTablet={(value) =>
												setMetaAttribute(value, 'tabletBorderHoverRadius')
											}
											onChangeMobile={(value) =>
												setMetaAttribute(value, 'mobileBorderHoverRadius')
											}
											unit={borderHoverRadiusUnit}
											units={['px', 'em', 'rem', '%']}
											onUnit={(value) => setMetaAttribute(value, 'borderHoverRadiusUnit')}
											max={
												borderHoverRadiusUnit === 'em' || borderHoverRadiusUnit === 'rem'
													? 24
													: 500
											}
											step={
												borderHoverRadiusUnit === 'em' || borderHoverRadiusUnit === 'rem'
													? 0.1
													: 1
											}
											min={0}
											isBorderRadius={true}
											allowEmpty={true}
										/>
									</>
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Typography Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-font-family'}
						>
							<TypographyControls
								fontGroup={'header'}
								fontSize={headerFont.size}
								onFontSize={(value) => setMetaAttribute({ ...headerFont, size: value }, 'headerFont')}
								fontSizeType={headerFont.sizeType}
								onFontSizeType={(value) =>
									setMetaAttribute({ ...headerFont, sizeType: value }, 'headerFont')
								}
								lineHeight={headerFont.lineHeight}
								onLineHeight={(value) =>
									setMetaAttribute({ ...headerFont, lineHeight: value }, 'headerFont')
								}
								lineHeightType={headerFont.lineType}
								onLineHeightType={(value) =>
									setMetaAttribute({ ...headerFont, lineType: value }, 'headerFont')
								}
								reLetterSpacing={headerFont.letterSpacing}
								onLetterSpacing={(value) =>
									setMetaAttribute({ ...headerFont, letterSpacing: value }, 'headerFont')
								}
								letterSpacingType={headerFont.letterType}
								onLetterSpacingType={(value) =>
									setMetaAttribute({ ...headerFont, letterType: value }, 'headerFont')
								}
								textTransform={headerFont.textTransform}
								onTextTransform={(value) =>
									setMetaAttribute({ ...headerFont, textTransform: value }, 'headerFont')
								}
								fontFamily={headerFont.family}
								onFontFamily={(value) =>
									setMetaAttribute({ ...headerFont, family: value }, 'headerFont')
								}
								onFontChange={(select) => {
									setMetaAttribute({ ...headerFont, ...select }, 'headerFont');
								}}
								onFontArrayChange={(values) =>
									setMetaAttribute({ ...headerFont, ...values }, 'headerFont')
								}
								googleFont={headerFont.google}
								onGoogleFont={(value) =>
									setMetaAttribute({ ...headerFont, google: value }, 'headerFont')
								}
								loadGoogleFont={headerFont.loadGoogle}
								onLoadGoogleFont={(value) =>
									setMetaAttribute({ ...headerFont, loadGoogle: value }, 'headerFont')
								}
								fontVariant={headerFont.variant}
								onFontVariant={(value) =>
									setMetaAttribute({ ...headerFont, variant: value }, 'headerFont')
								}
								fontWeight={headerFont.weight}
								onFontWeight={(value) =>
									setMetaAttribute({ ...headerFont, weight: value }, 'headerFont')
								}
								fontStyle={headerFont.style}
								onFontStyle={(value) => setMetaAttribute({ ...headerFont, style: value }, 'headerFont')}
								fontSubset={headerFont.subset}
								onFontSubset={(value) =>
									setMetaAttribute({ ...headerFont, subset: value }, 'headerFont')
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Text Color Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-text-color'}
						>
							<ColorGroup>
								<PopColorControl
									label={__('Text Color', 'kadence-blocks')}
									value={textColor ? textColor : ''}
									default={''}
									onChange={(value) => setMetaAttribute(value, 'textColor')}
								/>
								<PopColorControl
									label={__('Link Color', 'kadence-blocks')}
									value={linkColor ? linkColor : ''}
									default={''}
									onChange={(value) => setMetaAttribute(value, 'linkColor')}
									swatchLabel2={__('Hover Color', 'kadence-blocks')}
									value2={linkHoverColor ? linkHoverColor : ''}
									default2={''}
									onChange2={(value) => setMetaAttribute(value, 'linkHoverColor')}
								/>
							</ColorGroup>
						</KadencePanelBody>
						<div className="kt-sidebar-settings-spacer"></div>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-header-padding'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={arrayStringToInt(padding)}
								tabletValue={arrayStringToInt(tabletPadding)}
								mobileValue={arrayStringToInt(mobilePadding)}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'padding');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletPadding');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobilePadding');
								}}
								min={0}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'paddingUnit')}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={arrayStringToInt(margin)}
								tabletValue={arrayStringToInt(tabletMargin)}
								mobileValue={arrayStringToInt(mobileMargin)}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'margin');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletMargin');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobileMargin');
								}}
								min={marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setMetaAttribute(value, 'marginUnit')}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowAuto={true}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					__nextHasNoMarginBottom
					className="html-anchor-control"
					label={__('HTML anchor')}
					help={
						<>
							{__(
								'Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page.'
							)}

							<ExternalLink href={__('https://wordpress.org/documentation/article/page-jumps/')}>
								{__('Learn more about anchors')}
							</ExternalLink>
						</>
					}
					value={anchor}
					placeholder={__('Add an anchor')}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						setMetaAttribute(nextValue, 'anchor');
					}}
					autoCapitalize="none"
					autoComplete="off"
				/>

				<TextControl
					__nextHasNoMarginBottom
					autoComplete="off"
					label={__('Additional CSS class(es)')}
					value={className}
					onChange={(nextValue) => {
						setMetaAttribute(nextValue !== '' ? nextValue : undefined, 'className');
					}}
					help={__('Separate multiple classes with spaces.')}
				/>
			</InspectorAdvancedControls>
			{renderCSS}
			<div {...innerBlocksProps} />
			{/*<SpacingVisualizer*/}
			{/*	style={ {*/}
			{/*		marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),*/}
			{/*		marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),*/}
			{/*		marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),*/}
			{/*		marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),*/}
			{/*	} }*/}
			{/*	type="inside"*/}
			{/*	forceShow={ paddingMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingUnit ), getSpacingOptionOutput( previewPaddingRight, paddingUnit ), getSpacingOptionOutput( previewPaddingBottom, paddingUnit ), getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) ] }*/}
			{/*/>*/}
			{/*<SpacingVisualizer*/}
			{/*	type="inside"*/}
			{/*	forceShow={ marginMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewMarginTop, marginUnit ), getSpacingOptionOutput( previewMarginRight, marginUnit ), getSpacingOptionOutput( previewMarginBottom, marginUnit ), getSpacingOptionOutput( previewMarginLeft, marginUnit ) ] }*/}
			{/*/>*/}
		</>
	);
}
export default EditInner;

function useHeaderProp(prop) {
	return useEntityProp('postType', 'kadence_header', prop);
}

function useHeaderMeta(key) {
	const [meta, setMeta] = useHeaderProp('meta');

	return [
		meta[key],
		useCallback(
			(newValue) => {
				setMeta({ ...meta, [key]: newValue });
			},
			[key, setMeta]
		),
	];
}
