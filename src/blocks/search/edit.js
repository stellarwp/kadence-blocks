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
import { TextControl, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
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
import BackendStyles from './backend-styles';

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
		inputPlaceholder,
		inputColor,
		inputBorderRadius,
		tabletInputBorderRadius,
		mobileInputBorderRadius,
		inputBorderRadiusUnit,
		inputPadding,
		inputTabletPadding,
		inputMobilePadding,
		inputPaddingType,
		inputBackgroundType,
		inputFocusBackgroundType,
		inputFocusBackgroundColor,
		inputFocusGradientActive,
		inputFocusBoxShadowActive,
		inputFocusBorderColor,
		inputPlaceholderColor,
		inputBackgroundColor,
		inputGradient,
		inputBoxShadow,
		inputBorderStyles,
		tabletInputBorderStyles,
		mobileInputBorderStyles,
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
	const [isShowingModal, setIsShowingModal] = useState(false);

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

	const previewInputBorderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[0] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[0] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[0] : ''
	);
	const previewInputBorderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[1] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[1] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[1] : ''
	);
	const previewInputBorderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[2] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[2] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[2] : ''
	);
	const previewInputBorderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[3] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[3] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[3] : ''
	);

	const previewInputPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[0] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[0] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[0] : ''
	);
	const previewInputPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[1] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[1] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[1] : ''
	);
	const previewInputPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[2] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[2] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[2] : ''
	);
	const previewInputPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[3] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[3] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[3] : ''
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
		[`kb-search`]: true,
		[`kb-search-${uniqueID}`]: true,
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

	const renderCSS = (
		<style>
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

	const renderInputField = () => {
		return (
			<input
				id={'kb-search-input' + uniqueID}
				className={'kb-search-input'}
				type="text"
				placeholder={inputPlaceholder}
				style={{
					color: inputColor ? KadenceColorOutput(inputColor) : undefined,
					fontSize: getFontSizeOptionOutput(inputTypography[0].size, inputTypography[0].sizeType),
					lineHeight:
						inputTypography[0].lineHeight && inputTypography[0].lineHeight[0]
							? inputTypography[0].lineHeight[0] + inputTypography[0].lineType
							: undefined,
					fontWeight: inputTypography[0].weight,
					fontStyle: inputTypography[0].style,
					letterSpacing: inputTypography[0].letterSpacing + 'px',
					textTransform: inputTypography[0].textTransform,
					fontFamily: inputTypography[0].family,
					borderTopLeftRadius: previewInputBorderRadiusTop + (inputBorderRadiusUnit || 'px'),
					borderTopRightRadius: previewInputBorderRadiusRight + (inputBorderRadiusUnit || 'px'),
					borderBottomRightRadius: previewInputBorderRadiusBottom + (inputBorderRadiusUnit || 'px'),
					borderBottomLeftRadius: previewInputBorderRadiusLeft + (inputBorderRadiusUnit || 'px'),
					paddingTop: previewInputPaddingTop + (inputPaddingType || 'px'),
					paddingRight: previewInputPaddingRight + (inputPaddingType || 'px'),
					paddingBottom: previewInputPaddingBottom + (inputPaddingType || 'px'),
					paddingLeft: previewInputPaddingLeft + (inputPaddingType || 'px'),
					// borderTop: getBorderStyle(
					// 	previewDevice,
					// 	'top',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
					// borderRight: getBorderStyle(
					// 	previewDevice,
					// 	'right',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
					// borderBottom: getBorderStyle(
					// 	previewDevice,
					// 	'bottom',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
					// borderLeft: getBorderStyle(
					// 	previewDevice,
					// 	'left',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
				}}
			/>
		);
	};

	const saveStyleBoxShadowActive = (value, index) => {
		const newItems = inputFocusBoxShadowActive.map((item, thisIndex) => {
			if (index === thisIndex) {
				item = value;
			}

			return item;
		});

		setAttributes({ inputFocusBoxShadowActive: newItems });
	};

	return (
		<>
			<BackendStyles {...props} previewDevice={previewDevice} />
			{renderCSS}
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				{displayStyle === 'modal' && (
					<ToolbarGroup>
						<ToolbarButton
							className="components-tab-button"
							isPressed={isShowingModal}
							onClick={() => setIsShowingModal(!isShowingModal)}
						>
							<span>{__('Show Modal', 'kadence-blocks')}</span>
						</ToolbarButton>
					</ToolbarGroup>
				)}
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
									setAttributes({
										displayStyle: value,
									});
								}}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Button Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'search-button-settings'}
						>
							{displayStyle === 'input' && (
								<ToggleControl
									label={__('Show Button', 'kadence-blocks')}
									checked={showButton}
									onChange={(value) => {
										setAttributes({ showButton: value });
									}}
								/>
							)}
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
									{/*<KadenceRadioButtons*/}
									{/*	value={widthType}*/}
									{/*	options={btnWidths}*/}
									{/*	hideLabel={false}*/}
									{/*	label={__('Button Width', 'kadence-blocks')}*/}
									{/*	onChange={(value) => {*/}
									{/*		setAttributes({*/}
									{/*			widthType: value,*/}
									{/*		});*/}
									{/*	}}*/}
									{/*/>*/}
								</>
							)}
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Input Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'search-input-settings'}
						>
							<TextControl
								label={__('Placeholder Text', 'kadence-blocks')}
								value={inputPlaceholder}
								onChange={(value) => setAttributes({ inputPlaceholder: value })}
							/>

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

							<PopColorControl
								label={__('Text Color', 'kadence-blocks')}
								value={inputColor}
								default={''}
								onChange={(value) => {
									setAttributes({ inputColor: value });
								}}
							/>
							<PopColorControl
								label={__('Placeholder Text Color', 'kadence-blocks')}
								value={inputPlaceholderColor}
								default={''}
								onChange={(value) => {
									setAttributes({ inputPlaceholderColor: value });
								}}
							/>

							<ResponsiveMeasurementControls
								label={__('Border Radius', 'kadence-blocks')}
								value={inputBorderRadius}
								tabletValue={tabletInputBorderRadius}
								mobileValue={mobileInputBorderRadius}
								onChange={(value) => setAttributes({ inputBorderRadius: value })}
								onChangeTablet={(value) => setAttributes({ tabletInputBorderRadius: value })}
								onChangeMobile={(value) => setAttributes({ mobileInputBorderRadius: value })}
								min={0}
								max={inputBorderRadiusUnit === 'em' || inputBorderRadiusUnit === 'rem' ? 24 : 100}
								step={inputBorderRadiusUnit === 'em' || inputBorderRadiusUnit === 'rem' ? 0.1 : 1}
								unit={inputBorderRadiusUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ inputBorderRadiusUnit: value })}
								isBorderRadius={true}
								allowEmpty={true}
							/>

							<HoverToggleControl
								hover={
									<>
										<BackgroundTypeControl
											label={__('Focus Type', 'kadence-blocks')}
											type={inputFocusBackgroundType}
											onChange={(value) => setAttributes({ inputFocusBackgroundType: value })}
											allowedTypes={['normal', 'gradient']}
										/>
										{'gradient' !== inputFocusBackgroundType && (
											<PopColorControl
												label={__('Input Focus Background', 'kadence-blocks')}
												value={inputFocusBackgroundColor}
												default={''}
												onChange={(value) => {
													setAttributes({ inputFocusBackgroundColor: value });
												}}
											/>
										)}
										{'gradient' === inputFocusBackgroundType && (
											<GradientControl
												value={inputFocusGradientActive}
												onChange={(value) => setAttributes({ inputFocusGradientActive: value })}
												gradients={[]}
											/>
										)}
										<BoxShadowControl
											label={__('Input Focus Box Shadow', 'kadence-blocks')}
											enable={
												undefined !== inputFocusBoxShadowActive[0]
													? inputFocusBoxShadowActive[0]
													: false
											}
											color={
												undefined !== inputFocusBoxShadowActive[1]
													? inputFocusBoxShadowActive[1]
													: '#000000'
											}
											default={'#000000'}
											opacity={
												undefined !== inputFocusBoxShadowActive[2]
													? inputFocusBoxShadowActive[2]
													: 0.4
											}
											hOffset={
												undefined !== inputFocusBoxShadowActive[3]
													? inputFocusBoxShadowActive[3]
													: 2
											}
											vOffset={
												undefined !== inputFocusBoxShadowActive[4]
													? inputFocusBoxShadowActive[4]
													: 2
											}
											blur={
												undefined !== inputFocusBoxShadowActive[5]
													? inputFocusBoxShadowActive[5]
													: 3
											}
											spread={
												undefined !== inputFocusBoxShadowActive[6]
													? inputFocusBoxShadowActive[6]
													: 0
											}
											inset={
												undefined !== inputFocusBoxShadowActive[7]
													? inputFocusBoxShadowActive[7]
													: false
											}
											onEnableChange={(value) => {
												saveStyleBoxShadowActive(value, 0);
											}}
											onColorChange={(value) => {
												saveStyleBoxShadowActive(value, 1);
											}}
											onOpacityChange={(value) => {
												saveStyleBoxShadowActive(value, 2);
											}}
											onHOffsetChange={(value) => {
												saveStyleBoxShadowActive(value, 3);
											}}
											onVOffsetChange={(value) => {
												saveStyleBoxShadowActive(value, 4);
											}}
											onBlurChange={(value) => {
												saveStyleBoxShadowActive(value, 5);
											}}
											onSpreadChange={(value) => {
												saveStyleBoxShadowActive(value, 6);
											}}
											onInsetChange={(value) => {
												saveStyleBoxShadowActive(value, 7);
											}}
										/>
										<PopColorControl
											label={__('Input Focus Border', 'kadence-blocks')}
											value={inputFocusBorderColor}
											default={''}
											onChange={(value) => {
												setAttributes({ inputFocusBorderColor: KadenceColorOutput(value) });
											}}
										/>
									</>
								}
								normal={
									<>
										<BackgroundTypeControl
											label={__('Background Type', 'kadence-blocks')}
											type={inputBackgroundType}
											onChange={(value) => setAttributes({ inputBackgroundType: value })}
											allowedTypes={['normal', 'gradient']}
										/>
										{'gradient' !== inputBackgroundType && (
											<PopColorControl
												label={__('Input Background', 'kadence-blocks')}
												value={inputBackgroundColor}
												default={''}
												onChange={(value) => {
													setAttributes({ inputBackgroundColor: value });
												}}
											/>
										)}
										{'gradient' === inputBackgroundType && (
											<GradientControl
												value={inputGradient}
												onChange={(value) => setAttributes({ inputGradient: value })}
												gradients={[]}
											/>
										)}
										<BoxShadowControl
											label={__('Input Box Shadow', 'kadence-blocks')}
											enable={undefined !== inputBoxShadow[0] ? inputBoxShadow[0] : false}
											color={undefined !== inputBoxShadow[1] ? inputBoxShadow[1] : '#000000'}
											default={'#000000'}
											opacity={undefined !== inputBoxShadow[2] ? inputBoxShadow[2] : 0.4}
											hOffset={undefined !== inputBoxShadow[3] ? inputBoxShadow[3] : 2}
											vOffset={undefined !== inputBoxShadow[4] ? inputBoxShadow[4] : 2}
											blur={undefined !== inputBoxShadow[5] ? inputBoxShadow[5] : 3}
											spread={undefined !== inputBoxShadow[6] ? inputBoxShadow[6] : 0}
											inset={undefined !== inputBoxShadow[7] ? inputBoxShadow[7] : false}
											onEnableChange={(value) => {
												saveInputBoxShadow({ enable: value });
											}}
											onColorChange={(value) => {
												saveInputBoxShadow({ color: value });
											}}
											onOpacityChange={(value) => {
												saveInputBoxShadow({ opacity: value });
											}}
											onHOffsetChange={(value) => {
												saveInputBoxShadow({ hOffset: value });
											}}
											onVOffsetChange={(value) => {
												saveInputBoxShadow({ vOffset: value });
											}}
											onBlurChange={(value) => {
												saveInputBoxShadow({ blur: value });
											}}
											onSpreadChange={(value) => {
												saveInputBoxShadow({ spread: value });
											}}
											onInsetChange={(value) => {
												saveInputBoxShadow({ inset: value });
											}}
										/>
										<ResponsiveBorderControl
											label={__('Input Border', 'kadence-blocks')}
											value={inputBorderStyles}
											tabletValue={tabletInputBorderStyles}
											mobileValue={mobileInputBorderStyles}
											onChange={(value) => setAttributes({ inputBorderStyles: value })}
											onChangeTablet={(value) =>
												setAttributes({ tabletInputBorderStyles: value })
											}
											onChangeMobile={(value) =>
												setAttributes({ mobileInputBorderStyles: value })
											}
										/>
									</>
								}
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
			<div {...blockProps}>
				{displayStyle === 'input' ? (
					<>
						{renderInputField()}
						{showButton && (
							<div className={wrapperClasses}>
								<span
									className={btnClassName}
									style={{
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
								</span>
							</div>
						)}
					</>
				) : (
					<>
						{isShowingModal && (
							<div
								id="search-drawer"
								className="popup-drawer active popup-drawer-layout-fullwidth"
								data-drawer-target-string="#search-drawer"
								onClick={() => setIsShowingModal(false)}
							>
								<div className="drawer-overlay" data-drawer-target-string="#search-drawer"></div>
								<div className="drawer-inner">
									<div className="drawer-header">
										<button
											className="search-toggle-close drawer-toggle"
											aria-label="Close search"
											data-toggle-target="#search-drawer"
											data-toggle-body-class="showing-popup-drawer-from-full"
											aria-expanded="false"
											data-set-focus=".search-toggle-open"
										>
											<span className="kadence-svg-iconset">SVG HERE </span>
										</button>
									</div>
									<div className="drawer-content">
										<form role="search" method="get" className="kb-search-form" action="/">
											<label
												className="screen-reader-text"
												htmlFor={'kb-search-input' + uniqueID}
											>
												Search for:
											</label>
											{renderInputField()}
										</form>
									</div>
								</div>
							</div>
						)}
						<div className={wrapperClasses}>
							<span
								className={btnClassName}
								style={{
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
							</span>
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
