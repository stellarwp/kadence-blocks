/**
 * BLOCK: Kadence Advanced Btn Single.
 *
 * Editor for Advanced Btn
 */
import {
	KadenceColorOutput,
	getPreviewSize,
	showSettings,
	getSpacingOptionOutput,
	mouseOverVisualizer,
	getFontSizeOptionOutput,
	typographyStyle,
	getBorderStyle,
	setBlockDefaults,
	getBorderColor,
	uniqueIdHelper,
} from '@kadence/helpers';

import {
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	SmallResponsiveControl,
	ResponsiveRangeControls,
	IconRender,
	HoverToggleControl,
	ResponsiveBorderControl,
	KadenceIconPicker,
	KadencePanelBody,
	URLInputControl,
	KadenceWebfontLoader,
	BackgroundTypeControl,
	KadenceRadioButtons,
	URLInputInline,
	ResponsiveAlignControls,
	GradientControl,
	BoxShadowControl,
	InspectorControlTabs,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	SelectParentBlock,
} from '@kadence/components';
import classnames from 'classnames';

import metadata from './block.json';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import './editor.scss';

import { Fragment, useEffect, useState } from '@wordpress/element';
import {
	RichText,
	InspectorControls,
	BlockControls,
	JustifyContentControl,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { TextControl, ToolbarGroup, SelectControl } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

export default function KadenceButtonEdit({
	attributes,
	setAttributes,
	className,
	isSelected,
	context,
	clientId,
	name,
}) {
	const {
		uniqueID,
		text,
		sizePreset,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		color,
		background,
		backgroundType,
		gradient,
		colorHover,
		backgroundHover,
		backgroundHoverType,
		gradientHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		typography,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderHoverRadius,
		tabletBorderHoverRadius,
		mobileBorderHoverRadius,
		borderHoverRadiusUnit,
		icon,
		iconSide,
		iconHover,
		width,
		widthUnit,
		widthType,
		displayShadow,
		shadow,
		displayHoverShadow,
		shadowHover,
		inheritStyles,
		iconSize,
		iconPadding,
		tabletIconPadding,
		mobileIconPadding,
		iconPaddingUnit,
		onlyIcon,
		iconColor,
		iconColorHover,
		label,
		marginUnit,
		margin,
		iconSizeUnit,
		tabletMargin,
		mobileMargin,
		hAlign,
		thAlign,
		mhAlign,
	} = attributes;

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	uniqueIdHelper({ attributes, setAttributes, isSelected, clientId, context, className, name });
	const marginMouseOver = mouseOverVisualizer();
	const paddingMouseOver = mouseOverVisualizer();
	useEffect(() => {
		setBlockDefaults('kadence/singlebtn', attributes);
	}, []);
	const [activeTab, setActiveTab] = useState('general');

	const saveTypography = (value) => {
		const newUpdate = typography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			typography: newUpdate,
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
	const saveShadowHover = (value) => {
		const newItems = shadowHover.map((item, thisIndex) => {
			if (0 === thisIndex) {
				item = { ...item, ...value };
			}

			return item;
		});
		setAttributes({
			shadowHover: newItems,
		});
	};
	const btnSizes = [
		{ value: 'small', label: __('SM', 'kadence-blocks') },
		{ value: 'standard', label: __('MD', 'kadence-blocks') },
		{ value: 'large', label: __('LG', 'kadence-blocks') },
		{ value: 'xlarge', label: __('XL', 'kadence-blocks') },
	];
	const btnWidths = [
		{ value: 'auto', label: __('Auto', 'kadence-blocks') },
		{ value: 'fixed', label: __('Fixed', 'kadence-blocks') },
		{ value: 'full', label: __('Full', 'kadence-blocks') },
	];

	const buttonStyleOptions = [
		{ value: 'fill', label: __('Fill', 'kadence-blocks') },
		{ value: 'outline', label: __('Outline', 'kadence-blocks') },
		{ value: 'inherit', label: __('Theme', 'kadence-blocks') },
	];

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin?.[0] ? margin[0] : '',
		undefined !== tabletMargin?.[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin?.[0] ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin?.[1] ? margin[1] : '',
		undefined !== tabletMargin?.[1] ? tabletMargin[1] : '',
		undefined !== mobileMargin?.[1] ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin?.[2] ? margin[2] : '',
		undefined !== tabletMargin?.[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin?.[2] ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin?.[3] ? margin[3] : '',
		undefined !== tabletMargin?.[3] ? tabletMargin[3] : '',
		undefined !== mobileMargin?.[3] ? mobileMargin[3] : ''
	);
	const previewMarginUnit = marginUnit ? marginUnit : 'px';

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding?.[0] ? tabletPadding[0] : '',
		undefined !== mobilePadding?.[0] ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] ? padding[1] : '',
		undefined !== tabletPadding?.[1] ? tabletPadding[1] : '',
		undefined !== mobilePadding?.[1] ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding?.[2] ? tabletPadding[2] : '',
		undefined !== mobilePadding?.[2] ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] ? padding[3] : '',
		undefined !== tabletPadding?.[3] ? tabletPadding[3] : '',
		undefined !== mobilePadding?.[3] ? mobilePadding[3] : ''
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

	const previewFixedWidth = getPreviewSize(
		previewDevice,
		undefined !== width?.[0] ? width[0] : '',
		undefined !== width?.[1] ? width[1] : undefined,
		undefined !== width?.[2] ? width[2] : undefined
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
	const previewBorderTopColor = getBorderColor(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderRightColor = getBorderColor(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderBottomColor = getBorderColor(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderLeftColor = getBorderColor(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const inheritBorder = [borderStyle, tabletBorderStyle, mobileBorderStyle];
	const previewBorderHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverTopColor = getBorderColor(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		inheritBorder
	);
	const previewBorderHoverRightColor = getBorderColor(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		inheritBorder
	);
	const previewBorderHoverBottomColor = getBorderColor(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		inheritBorder
	);
	const previewBorderHoverLeftColor = getBorderColor(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		inheritBorder
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

	const previewAlign = getPreviewSize(
		previewDevice,
		undefined !== hAlign ? hAlign : '',
		undefined !== thAlign ? thAlign : '',
		undefined !== mhAlign ? mhAlign : ''
	);
	const previewOnlyIcon = getPreviewSize(
		previewDevice,
		undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
		undefined !== onlyIcon?.[1] ? onlyIcon[1] : undefined,
		undefined !== onlyIcon?.[2] ? onlyIcon[2] : undefined
	);
	let btnbg;
	if (undefined !== backgroundType && 'gradient' === backgroundType) {
		btnbg = gradient;
	} else {
		btnbg = 'transparent' === background || undefined === background ? undefined : KadenceColorOutput(background);
	}
	const nonTransAttrs = ['text'];
	const btnClassName = classnames({
		'kt-button': true,
		[`kt-button-${uniqueID}`]: true,
		[`kb-btn-global-${inheritStyles}`]: inheritStyles,
		'wp-block-button__link': inheritStyles && 'inherit' === inheritStyles,
		[`kb-btn-has-icon`]: icon,
		[`kt-btn-svg-show-${!iconHover ? 'always' : 'hover'}`]: icon,
		[`kb-btn-only-icon`]: previewOnlyIcon,
		[`kt-btn-size-${sizePreset ? sizePreset : 'standard'}`]: true,
	});
	const classes = classnames({
		className,
		[`kb-single-btn-${uniqueID}`]: true,
		[`kt-btn-width-type-${widthType ? widthType : 'auto'}`]: true,
	});
	const wrapperClasses = classnames({
		'btn-inner-wrap': true,
		[`kt-btn-align-${previewAlign}`]: previewAlign,
	});
	const blockProps = useBlockProps({
		className: classes,
		style: {
			width:
				undefined !== widthType &&
				'fixed' === widthType &&
				'%' === (undefined !== widthUnit ? widthUnit : 'px') &&
				'' !== previewFixedWidth
					? previewFixedWidth + (undefined !== widthUnit ? widthUnit : 'px')
					: undefined,
		},
	});
	let btnRad = '0';
	let btnBox = '';
	let btnBox2 = '';
	const btnbgHover = 'gradient' === backgroundHoverType ? gradientHover : KadenceColorOutput(backgroundHover);
	if (
		undefined !== displayHoverShadow &&
		displayHoverShadow &&
		undefined !== shadowHover?.[0] &&
		undefined !== shadowHover?.[0].inset &&
		false === shadowHover?.[0].inset
	) {
		btnBox = `${
			(undefined !== shadowHover?.[0].inset && shadowHover[0].inset ? 'inset ' : '') +
			(undefined !== shadowHover?.[0].hOffset ? shadowHover[0].hOffset : 0) +
			'px ' +
			(undefined !== shadowHover?.[0].vOffset ? shadowHover[0].vOffset : 0) +
			'px ' +
			(undefined !== shadowHover?.[0].blur ? shadowHover[0].blur : 14) +
			'px ' +
			(undefined !== shadowHover?.[0].spread ? shadowHover[0].spread : 0) +
			'px ' +
			KadenceColorOutput(
				undefined !== shadowHover?.[0].color ? shadowHover[0].color : '#000000',
				undefined !== shadowHover?.[0].opacity ? shadowHover[0].opacity : 1
			)
		}`;
		btnBox2 = 'none';
		btnRad = '0';
	}
	if (
		undefined !== displayHoverShadow &&
		displayHoverShadow &&
		undefined !== shadowHover?.[0] &&
		undefined !== shadowHover?.[0].inset &&
		true === shadowHover?.[0].inset
	) {
		btnBox2 = `${
			(undefined !== shadowHover?.[0].inset && shadowHover[0].inset ? 'inset ' : '') +
			(undefined !== shadowHover?.[0].hOffset ? shadowHover[0].hOffset : 0) +
			'px ' +
			(undefined !== shadowHover?.[0].vOffset ? shadowHover[0].vOffset : 0) +
			'px ' +
			(undefined !== shadowHover?.[0].blur ? shadowHover[0].blur : 14) +
			'px ' +
			(undefined !== shadowHover?.[0].spread ? shadowHover[0].spread : 0) +
			'px ' +
			KadenceColorOutput(
				undefined !== shadowHover?.[0].color ? shadowHover[0].color : '#000000',
				undefined !== shadowHover?.[0].opacity ? shadowHover[0].opacity : 1
			)
		}`;
		btnRad = undefined !== borderRadius ? borderRadius : '3';
		btnBox = 'none';
	}
	const previewTypographyCSS = typographyStyle(
		typography,
		`.editor-styles-wrapper .wp-block-kadence-advanced-form-submit.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`,
		previewDevice
	);
	const renderCSS = (
		<style>
			{'' !== previewTypographyCSS ? previewTypographyCSS : ''}
			{`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kb-btn-global-outline {`}
			{!previewBorderTopStyle && previewBorderTopColor ? 'border-top-color:' + previewBorderTopColor + ';' : ''}
			{!previewBorderRightStyle && previewBorderRightColor
				? 'border-right-color:' + previewBorderRightColor + ';'
				: ''}
			{!previewBorderLeftStyle && previewBorderLeftColor
				? 'border-left-color:' + previewBorderLeftColor + ';'
				: ''}
			{!previewBorderBottomStyle && previewBorderBottomColor
				? 'border-bottom-color:' + previewBorderBottomColor + ';'
				: ''}
			{'}'}
			{`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kb-btn-global-outline:hover {`}
			{!previewBorderHoverTopStyle && previewBorderHoverTopColor
				? 'border-top-color:' + previewBorderHoverTopColor + ';'
				: ''}
			{!previewBorderHoverRightStyle && previewBorderHoverRightColor
				? 'border-right-color:' + previewBorderHoverRightColor + ';'
				: ''}
			{!previewBorderHoverLeftStyle && previewBorderHoverLeftColor
				? 'border-left-color:' + previewBorderHoverLeftColor + ';'
				: ''}
			{!previewBorderHoverBottomStyle && previewBorderHoverBottomColor
				? 'border-bottom-color:' + previewBorderHoverBottomColor + ';'
				: ''}
			{'}'}
			{`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover {`}
			{colorHover ? 'color:' + KadenceColorOutput(colorHover) + '!important;' : ''}
			{btnBox ? 'box-shadow:' + btnBox + '!important;' : ''}
			{previewBorderHoverTopStyle ? 'border-top:' + previewBorderHoverTopStyle + '!important;' : ''}
			{previewBorderHoverRightStyle ? 'border-right:' + previewBorderHoverRightStyle + '!important;' : ''}
			{previewBorderHoverLeftStyle ? 'border-left:' + previewBorderHoverLeftStyle + '!important;' : ''}
			{previewBorderHoverBottomStyle ? 'border-bottom:' + previewBorderHoverBottomStyle + '!important;' : ''}
			{'' !== previewHoverRadiusTop
				? 'border-top-left-radius:' +
				  previewHoverRadiusTop +
				  (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px') +
				  '!important;'
				: ''}
			{'' !== previewHoverRadiusRight
				? 'border-top-right-radius:' +
				  previewHoverRadiusRight +
				  (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px') +
				  '!important;'
				: ''}
			{'' !== previewHoverRadiusLeft
				? 'border-bottom-left-radius:' +
				  previewHoverRadiusLeft +
				  (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px') +
				  '!important;'
				: ''}
			{'' !== previewHoverRadiusBottom
				? 'border-bottom-right-radius:' +
				  previewHoverRadiusBottom +
				  (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px') +
				  '!important;'
				: ''}
			{'}'}
			{iconColorHover
				? `.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover .kt-btn-svg-icon { color:${KadenceColorOutput(
						iconColorHover
				  )} !important;}`
				: ''}
			{`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}::before {`}
			{btnbgHover ? 'background:' + btnbgHover + ';' : ''}
			{btnBox2 ? 'box-shadow:' + btnBox2 + ';' : ''}
			{btnRad ? 'border-radius:' + btnRad + 'px;' : ''}
			{'}'}
		</style>
	);
	return (
		<div {...blockProps}>
			{renderCSS}
			<BlockControls>
				<ToolbarGroup>
					<JustifyContentControl
						value={previewAlign}
						allowedControls={['left', 'center', 'right']}
						onChange={(value) => {
							if (previewDevice === 'Mobile') {
								setAttributes({ mhAlign: value ? value : '' });
							} else if (previewDevice === 'Tablet') {
								setAttributes({ thAlign: value ? value : '' });
							} else {
								setAttributes({ hAlign: value ? value : 'center' });
							}
						}}
					/>
				</ToolbarGroup>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			{showSettings('allSettings', 'kadence/advancedbtn') && (
				<>
					<InspectorControls>
						<SelectParentBlock
							label={__('View Form Settings', 'kadence-blocks')}
							clientId={clientId}
							parentSlug={'kadence/advanced-form'}
						/>
						<InspectorControlTabs
							panelName={'advanced-form-submit'}
							setActiveTab={setActiveTab}
							activeTab={activeTab}
						/>

						{activeTab === 'general' && (
							<>
								<KadencePanelBody
									title={__('Button Settings', 'kadence-blocks')}
									initialOpen={true}
									panelName={'kb-adv-single-btn'}
								>
									<KadenceRadioButtons
										value={inheritStyles}
										options={buttonStyleOptions}
										hideLabel={false}
										label={__('Button Inherit Styles', 'kadence-blocks')}
										onChange={(value) => {
											setAttributes({
												inheritStyles: value,
											});
										}}
									/>
									{showSettings('sizeSettings', 'kadence/advancedbtn') && (
										<>
											<KadenceRadioButtons
												value={sizePreset}
												options={btnSizes}
												hideLabel={false}
												label={__('Button Size', 'kadence-blocks')}
												onChange={(value) => {
													setAttributes({
														sizePreset: value,
													});
												}}
											/>
											<KadenceRadioButtons
												value={widthType}
												options={btnWidths}
												hideLabel={false}
												label={__('Button Width', 'kadence-blocks')}
												onChange={(value) => {
													setAttributes({
														widthType: value,
													});
												}}
											/>
											{'fixed' === widthType && (
												<div className="kt-inner-sub-section">
													<ResponsiveRangeControls
														label={__('Fixed Width', 'kadence-blocks')}
														value={undefined !== width?.[0] ? width[0] : undefined}
														onChange={(value) => {
															setAttributes({
																width: [
																	value,
																	undefined !== width?.[1] ? width[1] : '',
																	undefined !== width?.[2] ? width[2] : '',
																],
															});
														}}
														tabletValue={undefined !== width?.[1] ? width[1] : undefined}
														onChangeTablet={(value) => {
															setAttributes({
																width: [
																	undefined !== width?.[0] ? width[0] : '',
																	value,
																	undefined !== width?.[2] ? width[2] : '',
																],
															});
														}}
														mobileValue={undefined !== width?.[2] ? width[2] : undefined}
														onChangeMobile={(value) => {
															setAttributes({
																width: [
																	undefined !== width?.[0] ? width[0] : '',
																	undefined !== width?.[1] ? width[1] : '',
																	value,
																],
															});
														}}
														min={0}
														max={(widthUnit ? widthUnit : 'px') !== 'px' ? 100 : 600}
														step={1}
														unit={widthUnit ? widthUnit : 'px'}
														onUnit={(value) => {
															setAttributes({ widthUnit: value });
														}}
														units={['px', '%']}
													/>
												</div>
											)}
										</>
									)}
								</KadencePanelBody>
							</>
						)}

						{activeTab === 'style' && (
							<>
								{showSettings('colorSettings', 'kadence/advancedbtn') && (
									<KadencePanelBody
										title={__('Button Styles', 'kadence-blocks')}
										initialOpen={true}
										panelName={'kb-adv-single-btn-styles'}
									>
										<HoverToggleControl
											hover={
												<>
													<PopColorControl
														label={__('Color Hover', 'kadence-blocks')}
														value={colorHover ? colorHover : ''}
														default={''}
														onChange={(value) => setAttributes({ colorHover: value })}
													/>
													<BackgroundTypeControl
														label={__('Hover Type', 'kadence-blocks')}
														type={backgroundHoverType ? backgroundHoverType : 'normal'}
														onChange={(value) =>
															setAttributes({ backgroundHoverType: value })
														}
														allowedTypes={['normal', 'gradient']}
													/>
													{'gradient' === backgroundHoverType && (
														<GradientControl
															value={gradientHover}
															onChange={(value) =>
																setAttributes({ gradientHover: value })
															}
															gradients={[]}
														/>
													)}
													{'normal' === backgroundHoverType && (
														<PopColorControl
															label={__('Background Color', 'kadence-blocks')}
															value={backgroundHover ? backgroundHover : ''}
															default={''}
															onChange={(value) =>
																setAttributes({ backgroundHover: value })
															}
														/>
													)}
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
													<BoxShadowControl
														label={__('Box Shadow', 'kadence-blocks')}
														enable={
															undefined !== displayHoverShadow
																? displayHoverShadow
																: false
														}
														color={
															undefined !== shadowHover &&
															undefined !== shadowHover[0] &&
															undefined !== shadowHover[0].color
																? shadowHover[0].color
																: '#000000'
														}
														colorDefault={'#000000'}
														onArrayChange={(color, opacity) => {
															saveShadowHover({ color, opacity });
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
																displayHoverShadow: value,
															});
														}}
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
														onInsetChange={(value) => {
															saveShadowHover({ inset: value });
														}}
													/>
												</>
											}
											normal={
												<>
													<PopColorControl
														label={__('Color', 'kadence-blocks')}
														value={color ? color : ''}
														default={''}
														onChange={(value) => setAttributes({ color: value })}
													/>
													<BackgroundTypeControl
														label={__('Type', 'kadence-blocks')}
														type={backgroundType ? backgroundType : 'normal'}
														onChange={(value) => setAttributes({ backgroundType: value })}
														allowedTypes={['normal', 'gradient']}
													/>
													{'gradient' === backgroundType && (
														<GradientControl
															value={gradient}
															onChange={(value) => setAttributes({ gradient: value })}
															gradients={[]}
														/>
													)}
													{'normal' === backgroundType && (
														<PopColorControl
															label={__('Background Color', 'kadence-blocks')}
															value={background ? background : ''}
															default={''}
															onChange={(value) => setAttributes({ background: value })}
														/>
													)}
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
												</>
											}
										/>
									</KadencePanelBody>
								)}
								{showSettings('iconSettings', 'kadence/advancedbtn') && (
									<KadencePanelBody
										title={__('Icon Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-adv-single-btn-icons'}
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
										<SmallResponsiveControl
											label={__('Icon and Text Display', 'kadence-blocks')}
											desktopChildren={
												<SelectControl
													value={
														undefined !== onlyIcon?.[0] && onlyIcon[0] ? 'true' : 'false'
													}
													options={[
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														setAttributes({
															onlyIcon: [
																value === 'true' ? true : false,
																undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
															],
														});
													}}
												/>
											}
											tabletChildren={
												<SelectControl
													value={
														undefined !== onlyIcon?.[1] && onlyIcon[1]
															? 'true'
															: undefined !== onlyIcon?.[1] && false === onlyIcon[1]
															? 'false'
															: ''
													}
													options={[
														{ value: '', label: __('Inherit', 'kadence-blocks') },
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														let newValue = value;
														if (value === 'true') {
															newValue = true;
														} else if (value === 'false') {
															newValue = false;
														}
														setAttributes({
															onlyIcon: [
																undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																newValue,
																undefined !== onlyIcon?.[2] ? onlyIcon[2] : '',
															],
														});
													}}
												/>
											}
											mobileChildren={
												<SelectControl
													value={
														undefined !== onlyIcon?.[2] && onlyIcon[2]
															? 'true'
															: undefined !== onlyIcon?.[2] && false === onlyIcon[2]
															? 'false'
															: ''
													}
													options={[
														{ value: '', label: __('Inherit', 'kadence-blocks') },
														{
															value: 'false',
															label: __('Show Icon and Text', 'kadence-blocks'),
														},
														{
															value: 'true',
															label: __('Show Only Icon', 'kadence-blocks'),
														},
													]}
													onChange={(value) => {
														let newValue = value;
														if (value === 'true') {
															newValue = true;
														} else if (value === 'false') {
															newValue = false;
														}
														setAttributes({
															onlyIcon: [
																undefined !== onlyIcon?.[0] ? onlyIcon[0] : '',
																undefined !== onlyIcon?.[1] ? onlyIcon[1] : '',
																newValue,
															],
														});
													}}
												/>
											}
										/>
										<SelectControl
											label={__('Icon Location', 'kadence-blocks')}
											value={iconSide}
											options={[
												{ value: 'right', label: __('Right') },
												{ value: 'left', label: __('Left') },
											]}
											onChange={(value) => {
												setAttributes({ iconSide: value });
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
									</KadencePanelBody>
								)}
								{showSettings('fontSettings', 'kadence/advancedbtn') && (
									<KadencePanelBody
										title={__('Typography Settings', 'kadence-blocks')}
										initialOpen={false}
										panelName={'kb-adv-btn-font-family'}
									>
										<TypographyControls
											fontGroup={'button'}
											fontSize={typography[0].size}
											onFontSize={(value) => saveTypography({ size: value })}
											fontSizeType={typography[0].sizeType}
											onFontSizeType={(value) => saveTypography({ sizeType: value })}
											lineHeight={typography[0].lineHeight}
											onLineHeight={(value) => saveTypography({ lineHeight: value })}
											lineHeightType={typography[0].lineType}
											onLineHeightType={(value) => saveTypography({ lineType: value })}
											reLetterSpacing={typography[0].letterSpacing}
											onLetterSpacing={(value) => saveTypography({ letterSpacing: value })}
											letterSpacingType={typography[0].letterType}
											onLetterSpacingType={(value) => saveTypography({ letterType: value })}
											textTransform={typography[0].textTransform}
											onTextTransform={(value) => saveTypography({ textTransform: value })}
											fontFamily={typography[0].family}
											onFontFamily={(value) => saveTypography({ family: value })}
											onFontChange={(select) => {
												saveTypography({
													family: select.value,
													google: select.google,
												});
											}}
											onFontArrayChange={(values) => saveTypography(values)}
											googleFont={typography[0].google}
											onGoogleFont={(value) => saveTypography({ google: value })}
											loadGoogleFont={typography[0].loadGoogle}
											onLoadGoogleFont={(value) => saveTypography({ loadGoogle: value })}
											fontVariant={typography[0].variant}
											onFontVariant={(value) => saveTypography({ variant: value })}
											fontWeight={typography[0].weight}
											onFontWeight={(value) => saveTypography({ weight: value })}
											fontStyle={typography[0].style}
											onFontStyle={(value) => saveTypography({ style: value })}
											fontSubset={typography[0].subset}
											onFontSubset={(value) => saveTypography({ subset: value })}
										/>
									</KadencePanelBody>
								)}
							</>
						)}

						{activeTab === 'advanced' && (
							<>
								{showSettings('marginSettings', 'kadence/advancedbtn') && (
									<>
										<KadencePanelBody panelName={'kb-single-button-margin-settings'}>
											<ResponsiveMeasureRangeControl
												label={__('Padding', 'kadence-blocks')}
												value={padding}
												onChange={(value) => setAttributes({ padding: value })}
												tabletValue={tabletPadding}
												onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
												mobileValue={mobilePadding}
												onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
												min={paddingUnit === 'em' || paddingUnit === 'rem' ? -2 : -999}
												max={paddingUnit === 'em' || paddingUnit === 'rem' ? 12 : 999}
												step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
												unit={paddingUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ paddingUnit: value })}
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
												min={marginUnit === 'em' || marginUnit === 'rem' ? -2 : -999}
												max={marginUnit === 'em' || marginUnit === 'rem' ? 12 : 999}
												step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
												unit={marginUnit}
												units={['px', 'em', 'rem']}
												onUnit={(value) => setAttributes({ marginUnit: value })}
												onMouseOver={marginMouseOver.onMouseOver}
												onMouseOut={marginMouseOver.onMouseOut}
												allowAuto={true}
											/>
											<TextControl
												label={__('Add Aria Label', 'kadence-blocks')}
												value={label ? label : ''}
												onChange={(value) => setAttributes({ label: value })}
												className={'kb-textbox-style'}
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
				</>
			)}
			<div className={wrapperClasses}>
				<span
					className={btnClassName}
					style={{
						paddingTop: previewPaddingTop
							? getSpacingOptionOutput(previewPaddingTop, paddingUnit)
							: undefined,
						paddingRight: previewPaddingRight
							? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
							: undefined,
						paddingBottom: previewPaddingBottom
							? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
							: undefined,
						paddingLeft: previewPaddingLeft
							? getSpacingOptionOutput(previewPaddingLeft, paddingUnit)
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
						borderTopLeftRadius:
							'' !== previewRadiusTop
								? previewRadiusTop + (borderRadiusUnit ? borderRadiusUnit : 'px')
								: undefined,
						borderTopRightRadius:
							'' !== previewRadiusRight
								? previewRadiusRight + (borderRadiusUnit ? borderRadiusUnit : 'px')
								: undefined,
						borderBottomRightRadius:
							'' !== previewRadiusBottom
								? previewRadiusBottom + (borderRadiusUnit ? borderRadiusUnit : 'px')
								: undefined,
						borderBottomLeftRadius:
							'' !== previewRadiusLeft
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

						background: undefined !== btnbg ? btnbg : undefined,
						color: undefined !== color ? KadenceColorOutput(color) : undefined,
						width:
							undefined !== widthType &&
							'fixed' === widthType &&
							'px' === (undefined !== widthUnit ? widthUnit : 'px') &&
							'' !== previewFixedWidth
								? previewFixedWidth + (undefined !== widthUnit ? widthUnit : 'px')
								: undefined,
					}}
				>
					{icon && 'left' === iconSide && (
						<IconRender
							className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
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
					)}
					<RichText
						tagName="div"
						placeholder={__('Button…', 'kadence-blocks')}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						allowedFormats={applyFilters(
							'kadence.whitelist_richtext_formats',
							[
								'kadence/insert-dynamic',
								'core/bold',
								'core/italic',
								'core/strikethrough',
								'toolset/inline-field',
							],
							'kadence/advancedbtn'
						)}
						className={'kt-button-text'}
						keepPlaceholderOnFocus
					/>
					{icon && 'left' !== iconSide && (
						<IconRender
							className={`kt-btn-svg-icon kt-btn-svg-icon-${icon} kt-btn-side-${iconSide}`}
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
					)}
					<SpacingVisualizer
						type="inside"
						forceShow={paddingMouseOver.isMouseOver}
						spacing={[
							getSpacingOptionOutput(previewPaddingTop, paddingUnit),
							getSpacingOptionOutput(previewPaddingRight, paddingUnit),
							getSpacingOptionOutput(previewPaddingBottom, paddingUnit),
							getSpacingOptionOutput(previewPaddingLeft, paddingUnit),
						]}
					/>
				</span>
				<SpacingVisualizer
					type="inside"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewMarginTop, previewMarginUnit),
						getSpacingOptionOutput(previewMarginRight, previewMarginUnit),
						getSpacingOptionOutput(previewMarginBottom, previewMarginUnit),
						getSpacingOptionOutput(previewMarginLeft, previewMarginUnit),
					]}
				/>
				{typography?.[0]?.google && (
					<KadenceWebfontLoader typography={typography} clientId={clientId} id={'typography'} />
				)}
			</div>
		</div>
	);
}
