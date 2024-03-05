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
} from '@kadence/components';
import {
	getPreviewSize,
	KadenceColorOutput,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	arrayStringToInt,
} from '@kadence/helpers';

import {
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
	store as editorStore,
} from '@wordpress/block-editor';
import { TextControl, ToggleControl, ToolbarGroup, ExternalLink, Button, Placeholder } from '@wordpress/components';

import { FormTitle, SelectForm } from './components';

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
	const { attributes, setAttributes, clientId, direct, id, isSelected } = props;
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

	const [padding] = useHeaderMeta('_kad_header_padding');
	const [tabletPadding] = useHeaderMeta('_kad_header_tabletPadding');
	const [mobilePadding] = useHeaderMeta('_kad_header_mobilePadding');
	const [paddingUnit] = useHeaderMeta('_kad_header_paddingUnit');

	const [margin] = useHeaderMeta('_kad_header_margin');
	const [tabletMargin] = useHeaderMeta('_kad_header_tabletMargin');
	const [mobileMargin] = useHeaderMeta('_kad_header_mobileMargin');
	const [marginUnit] = useHeaderMeta('_kad_header_marginUnit');

	const [borderColor] = useHeaderMeta('_kad_header_borderColor');
	const [border] = useHeaderMeta('_kad_header_border');
	const [headerBorder] = useHeaderMeta('_kad_header_headerBorder');
	const [headerMobileBorder] = useHeaderMeta('_kad_header_headerMobileBorder');
	const [headerTabletBorder] = useHeaderMeta('_kad_header_headerTabletBorder');
	const [tabletBorder] = useHeaderMeta('_kad_header_tabletBorder');
	const [mobileBorder] = useHeaderMeta('_kad_header_mobileBorder');
	const [borderUnit] = useHeaderMeta('_kad_header_borderUnit');
	const [borderRadius] = useHeaderMeta('_kad_header_borderRadius');
	const [tabletBorderRadius] = useHeaderMeta('_kad_header_tabletBorderRadius');
	const [mobileBorderRadius] = useHeaderMeta('_kad_header_mobileBorderRadius');
	const [borderRadiusUnit] = useHeaderMeta('_kad_header_borderRadiusUnit');

	// Typography options
	const [fontSize] = useHeaderMeta('_kad_header_fontSize');
	const [fontSizeType] = useHeaderMeta('_kad_header_fontSizeType');
	const [lineHeight] = useHeaderMeta('_kad_header_lineHeight');
	const [lineHeightType] = useHeaderMeta('_kad_header_lineHeightType');
	const [letterSpacing] = useHeaderMeta('_kad_header_letterSpacing');
	const [letterSpacingType] = useHeaderMeta('_kad_header_letterSpacingType');
	const [textTransform] = useHeaderMeta('_kad_header_textTransform');
	const [fontFamily] = useHeaderMeta('_kad_header_fontFamily');
	const [googleFont] = useHeaderMeta('_kad_header_googleFont');
	const [loadGoogle] = useHeaderMeta('_kad_header_loadGoogle');
	const [fontVariant] = useHeaderMeta('_kad_header_fontVariant');
	const [fontWeight] = useHeaderMeta('_kad_header_fontWeight');
	const [fontStyle] = useHeaderMeta('_kad_header_fontStyle');
	const [fontSubset] = useHeaderMeta('_kad_header_fontSubset');

	//Background Options
	const [bgColor] = useHeaderMeta('_kad_header_bgColor');
	const [bgImg] = useHeaderMeta('_kad_header_bgImg');
	const [bgImgID] = useHeaderMeta('_kad_header_bgImgID');
	const [bgImgPosition] = useHeaderMeta('_kad_header_bgImgPosition');
	const [bgImgSize] = useHeaderMeta('_kad_header_bgImgSize');
	const [bgImgRepeat] = useHeaderMeta('_kad_header_bgImgRepeat');
	const [bgImgAttachment] = useHeaderMeta('_kad_header_bgImgAttachment');

	// Text color options
	const [textColor] = useHeaderMeta('_kad_header_textColor');
	const [linkColor] = useHeaderMeta('_kad_header_linkColor');
	const [linkHoverColor] = useHeaderMeta('_kad_header_linkHoverColor');

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

	const headerClasses = classnames({
		'kb-header': true,
		[`kb-header-${id}`]: true,
		[`kb-header${uniqueID}`]: uniqueID,
	});

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

				borderTopWidth: '' !== previewBorderTop ? previewBorderTop : undefined,
				borderRightWidth: '' !== previewBorderRight ? previewBorderRight : undefined,
				borderBottomWidth: '' !== previewBorderBottom ? previewBorderBottom : undefined,
				borderLeftWidth: '' !== previewBorderLeft ? previewBorderLeft : undefined,
				borderTopColor: '' !== previewBorderColorTop ? previewBorderColorTop : undefined,
				borderRightColor: '' !== previewBorderColorRight ? previewBorderColorRight : undefined,
				borderBottomColor: '' !== previewBorderColorBottom ? previewBorderColorBottom : undefined,
				borderLeftColor: '' !== previewBorderColorLeft ? previewBorderColorLeft : undefined,
				borderTopStyle: '' !== previewBorderStyleTop ? previewBorderStyleTop : undefined,
				borderRightStyle: '' !== previewBorderStyleRight ? previewBorderStyleRight : undefined,
				borderBottomStyle: '' !== previewBorderStyleBottom ? previewBorderStyleBottom : undefined,
				borderLeftStyle: '' !== previewBorderStyleLeft ? previewBorderStyleLeft : undefined,
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
						General tab
						<div className="kt-sidebar-settings-spacer"></div>
					</>
				)}

				{activeTab === 'style' && (
					<>
						<KadencePanelBody
							title={__('Background Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-header-bg-settings'}
						>
							<PopColorControl
								label={__('Background Color', 'kadence-blocks')}
								value={bgColor ? bgColor : ''}
								default={''}
								onChange={(value) => {
									console.log(value);
									setMetaAttribute(value, 'bgColor');
								}}
							/>
							<KadenceBackgroundControl
								label={__('Background Image', 'kadence-blocks')}
								hasImage={bgImg}
								imageURL={bgImg}
								imageID={bgImgID}
								imagePosition={bgImgPosition ? bgImgPosition : 'center center'}
								imageSize={bgImgSize ? bgImgSize : 'cover'}
								imageRepeat={bgImgRepeat ? bgImgRepeat : 'no-repeat'}
								imageAttachment={bgImgAttachment ? bgImgAttachment : 'scroll'}
								imageAttachmentParallax={true}
								onRemoveImage={() => {
									setMetaAttribute(null, 'bgImgID');
									setMetaAttribute(null, 'bgImg');
								}}
								onSaveImage={(img) => {
									setMetaAttribute(img.id, 'bgImgID');
									setMetaAttribute(img.url, 'bgImg');
								}}
								onSaveURL={(newURL) => {
									if (newURL !== bgImg) {
										setMetaAttribute(undefined, 'bgImgID');
										setMetaAttribute(newURL, 'bgImg');
									}
								}}
								onSavePosition={(value) => setMetaAttribute(value, 'bgImgPosition')}
								onSaveSize={(value) => setMetaAttribute(value, 'bgImgSize')}
								onSaveRepeat={(value) => setMetaAttribute(value, 'bgImgRepeat')}
								onSaveAttachment={(value) => setMetaAttribute(value, 'bgImgAttachment')}
								disableMediaButtons={bgImg}
								dynamicAttribute="bgImg"
								isSelected={isSelected}
								attributes={attributes}
								setAttributes={setAttributes}
								name={'kadence/header'}
								clientId={clientId}
								//context={context}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Border Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-border'}
						>
							<ResponsiveBorderControl
								label={__('Border', 'kadence-blocks')}
								value={[headerBorder]}
								tabletValue={[headerTabletBorder]}
								mobileValue={[headerMobileBorder]}
								onChange={(value) => {
									console.log(value);
									setMetaAttribute(value[0], 'headerBorder');
								}}
								onChangeTablet={(value) => setMetaAttribute(value[0], 'headerTabletBorder')}
								onChangeMobile={(value) => setMetaAttribute(value[0], 'headerMobileBorder')}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Typography Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-font-family'}
						>
							<TypographyControls
								fontGroup={'header'}
								fontSize={fontSize}
								onFontSize={(value) => setMetaAttribute(value, 'fontSize')}
								fontSizeType={fontSizeType}
								onFontSizeType={(value) => setMetaAttribute(value, 'fontSizeType')}
								lineHeight={lineHeight}
								onLineHeight={(value) => setMetaAttribute(value, 'lineHeight')}
								lineHeightType={lineHeightType}
								onLineHeightType={(value) => setMetaAttribute(value, 'lineHeightType')}
								reLetterSpacing={letterSpacing}
								onLetterSpacing={(value) => setMetaAttribute(value, 'letterSpacing')}
								letterSpacingType={letterSpacingType}
								onLetterSpacingType={(value) => setMetaAttribute(value, 'letterSpacingType')}
								textTransform={textTransform}
								onTextTransform={(value) => setMetaAttribute(value, 'textTransform')}
								fontFamily={fontFamily}
								onFontFamily={(value) => setMetaAttribute(value, 'fontFamily')}
								onFontChange={(select) => {
									setMetaAttribute(select.value, 'fontFamily');
									setMetaAttribute(select.google, 'googleFont');
								}}
								onFontArrayChange={(values) => setMetaAttribute(values)}
								//googleFont={googleFont}
								//onGoogleFont={(value) => setMetaAttribute(value, 'googleFont')}
								//loadGoogleFont={loadGoogle}
								//onLoadGoogleFont={(value) => setMetaAttribute(value, 'loadGoogle')}
								fontVariant={fontVariant}
								onFontVariant={(value) => setMetaAttribute(value, 'fontVariant')}
								fontWeight={fontWeight}
								onFontWeight={(value) => setMetaAttribute(value, 'fontWeight')}
								fontStyle={fontStyle}
								onFontStyle={(value) => setMetaAttribute(value, 'fontStyle')}
								fontSubset={fontSubset}
								onFontSubset={(value) => setMetaAttribute(value, 'fontSubset')}
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
