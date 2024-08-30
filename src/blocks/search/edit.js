/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { TextControl, ToggleControl, SelectControl } from '@wordpress/components';
import {
	ResponsiveRangeControls,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadencePanelBody,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	KadenceRadioButtons,
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	SmallResponsiveControl,
	IconRender,
	HoverToggleControl,
	ResponsiveBorderControl,
	KadenceIconPicker,
	KadenceWebfontLoader,
	BackgroundTypeControl,
	GradientControl,
	BoxShadowControl,
	SelectParentBlock,
	ResponsiveButtonStyleControlsWithStates,
} from '@kadence/components';
import {
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getUniqueId,
	getPostOrFseId,
	getPreviewSize,
	KadenceColorOutput,
	showSettings,
	getFontSizeOptionOutput,
	typographyStyle,
	getBorderStyle,
	getBorderColor,
} from '@kadence/helpers';

import { useBlockProps, BlockControls, RichText } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * External dependencies
 */
import classnames from 'classnames';

export function Edit(props) {
	const { attributes, setAttributes, className, isSelected, context, clientId } = props;

	const {
		uniqueID,
		displayStyle,
		showButton,
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
		backgroundTypeHover,
		gradientHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		buttonTypography,
		inputTypography,
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
		setBlockDefaults('kadence/search', attributes);

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

	const [activeTab, setActiveTab] = useState('general');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const saveButtonTypography = (value) => {
		const newUpdate = buttonTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			buttonTypography: newUpdate,
		});
	};
	const saveInputTypography = (value) => {
		const newUpdate = inputTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			inputTypography: newUpdate,
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
	const btnbgHover = 'gradient' === backgroundTypeHover ? gradientHover : KadenceColorOutput(backgroundHover);
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
		buttonTypography,
		`.editor-styles-wrapper .wp-block-kadence-search-button.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`,
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
		<>
			{renderCSS}
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/search'}>
				<InspectorControlTabs panelName={'kadence-search'} setActiveTab={setActiveTab} activeTab={activeTab} />

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							initialOpen={true}
							panelName={'kadence-search-general'}
							blockSlug={'kadence/search'}
						>
							<KadenceRadioButtons
								label={__('Search Style', 'kadence-blocks')}
								value={displayStyle}
								options={[
									{ value: 'input', label: __('Input', 'kadence-blocks') },
									{ value: 'modal', label: __('Modal', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setAttributes({ displayStyle: value });
								}}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Button Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'search-button-settings'}
						>
							<ToggleControl
								label={__('Show Button', 'kadence-blocks')}
								checked={showButton}
								onChange={(value) => {
									setAttributes({ showButton: value });
								}}
							/>
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

						<KadencePanelBody
							title={__('Input Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'search-input-settings'}
						>
							<TypographyControls
								fontSize={inputTypography[0].size}
								onFontSize={(value) => saveInputTypography({ size: value })}
								fontSizeType={inputTypography[0].sizeType}
								onFontSizeType={(value) => saveInputTypography({ sizeType: value })}
								lineHeight={inputTypography[0].lineHeight}
								onLineHeight={(value) => saveInputTypography({ lineHeight: value })}
								lineHeightType={inputTypography[0].lineType}
								onLineHeightType={(value) => saveInputTypography({ lineType: value })}
								reLetterSpacing={inputTypography[0].letterSpacing}
								onLetterSpacing={(value) => saveInputTypography({ letterSpacing: value })}
								letterSpacingType={inputTypography[0].letterType}
								onLetterSpacingType={(value) => saveInputTypography({ letterType: value })}
								textTransform={inputTypography[0].textTransform}
								onTextTransform={(value) => saveInputTypography({ textTransform: value })}
								fontFamily={inputTypography[0].family}
								onFontFamily={(value) => saveInputTypography({ family: value })}
								onFontChange={(select) => {
									saveInputTypography({
										family: select.value,
										google: select.google,
									});
								}}
								onFontArrayChange={(values) => saveInputTypography(values)}
								googleFont={inputTypography[0].google}
								onGoogleFont={(value) => saveInputTypography({ google: value })}
								loadGoogleFont={inputTypography[0].loadGoogle}
								onLoadGoogleFont={(value) => saveInputTypography({ loadGoogle: value })}
								fontVariant={inputTypography[0].variant}
								onFontVariant={(value) => saveInputTypography({ variant: value })}
								fontWeight={inputTypography[0].weight}
								onFontWeight={(value) => saveInputTypography({ weight: value })}
								fontStyle={inputTypography[0].style}
								onFontStyle={(value) => saveInputTypography({ style: value })}
								fontSubset={inputTypography[0].subset}
								onFontSubset={(value) => saveInputTypography({ subset: value })}
							/>
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
								<ResponsiveButtonStyleControlsWithStates
									colorBase={'linkColor'}
									backgroundBase={'background'}
									backgroundTypeBase={'backgroundType'}
									backgroundGradientBase={'gradient'}
									borderBase={'borderStyle'}
									borderRadiusBase={'borderRadius'}
									borderRadiusUnitBase={'borderRadiusUnit'}
									shadowBase={'shadow'}
									setAttributes={setAttributes}
									attributes={attributes}
									includeActive={false}
								/>
							</KadencePanelBody>
						)}
						{showSettings('iconSettings', 'kadence/advancedbtn') && (
							<KadencePanelBody
								title={__('Button Icon Settings', 'kadence-blocks')}
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
											value={undefined !== onlyIcon?.[0] && onlyIcon[0] ? 'true' : 'false'}
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
									tabletValue={undefined !== tabletIconPadding ? tabletIconPadding : ['', '', '', '']}
									mobileValue={undefined !== mobileIconPadding ? mobileIconPadding : ['', '', '', '']}
									onChange={(value) => setAttributes({ iconPadding: value })}
									onChangeTablet={(value) => setAttributes({ tabletIconPadding: value })}
									onChangeMobile={(value) => setAttributes({ mobileIconPadding: value })}
									min={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? -2 : -200}
									max={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 12 : 200}
									step={iconPaddingUnit === 'em' || iconPaddingUnit === 'rem' ? 0.1 : 1}
									unit={iconPaddingUnit}
									units={['px', 'em', 'rem']}
									onUnit={(value) => setAttributes({ iconPaddingUnit: value })}
								/>
							</KadencePanelBody>
						)}
						{showSettings('fontSettings', 'kadence/advancedbtn') && (
							<KadencePanelBody
								title={__('Button Typography Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-btn-font-family'}
							>
								<TypographyControls
									fontGroup={'button'}
									fontSize={buttonTypography[0].size}
									onFontSize={(value) => saveButtonTypography({ size: value })}
									fontSizeType={buttonTypography[0].sizeType}
									onFontSizeType={(value) => saveButtonTypography({ sizeType: value })}
									lineHeight={buttonTypography[0].lineHeight}
									onLineHeight={(value) => saveButtonTypography({ lineHeight: value })}
									lineHeightType={buttonTypography[0].lineType}
									onLineHeightType={(value) => saveButtonTypography({ lineType: value })}
									reLetterSpacing={buttonTypography[0].letterSpacing}
									onLetterSpacing={(value) => saveButtonTypography({ letterSpacing: value })}
									letterSpacingType={buttonTypography[0].letterType}
									onLetterSpacingType={(value) => saveButtonTypography({ letterType: value })}
									textTransform={buttonTypography[0].textTransform}
									onTextTransform={(value) => saveButtonTypography({ textTransform: value })}
									fontFamily={buttonTypography[0].family}
									onFontFamily={(value) => saveButtonTypography({ family: value })}
									onFontChange={(select) => {
										saveButtonTypography({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveButtonTypography(values)}
									googleFont={buttonTypography[0].google}
									onGoogleFont={(value) => saveButtonTypography({ google: value })}
									loadGoogleFont={buttonTypography[0].loadGoogle}
									onLoadGoogleFont={(value) => saveButtonTypography({ loadGoogle: value })}
									fontVariant={buttonTypography[0].variant}
									onFontVariant={(value) => saveButtonTypography({ variant: value })}
									fontWeight={buttonTypography[0].weight}
									onFontWeight={(value) => saveButtonTypography({ weight: value })}
									fontStyle={buttonTypography[0].style}
									onFontStyle={(value) => saveButtonTypography({ style: value })}
									fontSubset={buttonTypography[0].subset}
									onFontSubset={(value) => saveButtonTypography({ subset: value })}
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
										min={paddingUnit === 'em' || paddingUnit === 'rem' ? -2 : -200}
										max={paddingUnit === 'em' || paddingUnit === 'rem' ? 12 : 200}
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
										min={marginUnit === 'em' || marginUnit === 'rem' ? -2 : -200}
										max={marginUnit === 'em' || marginUnit === 'rem' ? 12 : 200}
										step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
										unit={marginUnit}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ marginUnit: value })}
										onMouseOver={marginMouseOver.onMouseOver}
										onMouseOut={marginMouseOver.onMouseOut}
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
			</KadenceInspectorControls>
			<div
				{...blockProps}
				style={{
					marginTop:
						'' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginUnit) : undefined,
					marginRight:
						'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginUnit) : undefined,
					marginBottom:
						'' !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, marginUnit)
							: undefined,
					marginLeft:
						'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginUnit) : undefined,

					paddingTop:
						'' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingUnit) : undefined,
					paddingRight:
						'' !== previewPaddingRight
							? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
							: undefined,
					paddingBottom:
						'' !== previewPaddingBottom
							? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
							: undefined,
					paddingLeft:
						'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingUnit) : undefined,
				}}
			>
				{displayStyle === 'input' ? (
					<>
						<input
							type="text"
							style={{
								color: undefined !== color ? KadenceColorOutput(color) : undefined,
							}}
						/>
						{showButton && (
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
										placeholder={__('Search', 'kadence-blocks')}
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
								{buttonTypography?.[0]?.google && (
									<KadenceWebfontLoader
										typography={buttonTypography}
										clientId={clientId}
										id={'buttonTypography'}
									/>
								)}
								{inputTypography?.[0]?.google && (
									<KadenceWebfontLoader
										typography={inputTypography}
										clientId={clientId}
										id={'inputTypography'}
									/>
								)}
							</div>
						)}
					</>
				) : (
					<>
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
									placeholder={__('Search', 'kadence-blocks')}
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
							{buttonTypography?.[0]?.google && (
								<KadenceWebfontLoader
									typography={buttonTypography}
									clientId={clientId}
									id={'buttonTypography'}
								/>
							)}
							{inputTypography?.[0]?.google && (
								<KadenceWebfontLoader
									typography={inputTypography}
									clientId={clientId}
									id={'inputTypography'}
								/>
							)}
						</div>
					</>
				)}

				<SpacingVisualizer
					style={{
						marginLeft:
							undefined !== previewMarginLeft
								? getSpacingOptionOutput(previewMarginLeft, marginUnit)
								: undefined,
						marginRight:
							undefined !== previewMarginRight
								? getSpacingOptionOutput(previewMarginRight, marginUnit)
								: undefined,
						marginTop:
							undefined !== previewMarginTop
								? getSpacingOptionOutput(previewMarginTop, marginUnit)
								: undefined,
						marginBottom:
							undefined !== previewMarginBottom
								? getSpacingOptionOutput(previewMarginBottom, marginUnit)
								: undefined,
					}}
					type="inside"
					forceShow={paddingMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewPaddingTop, paddingUnit),
						getSpacingOptionOutput(previewPaddingRight, paddingUnit),
						getSpacingOptionOutput(previewPaddingBottom, paddingUnit),
						getSpacingOptionOutput(previewPaddingLeft, paddingUnit),
					]}
				/>
				<SpacingVisualizer
					type="outside"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewMarginTop, marginUnit),
						getSpacingOptionOutput(previewMarginRight, marginUnit),
						getSpacingOptionOutput(previewMarginBottom, marginUnit),
						getSpacingOptionOutput(previewMarginLeft, marginUnit),
					]}
				/>
			</div>
		</>
	);
}

export default Edit;
