import {
	KadenceBlocksCSS,
	getPreviewSize,
	KadenceColorOutput,
	typographyStyle,
	getBorderStyle,
	getBorderColor,
	getSpacingOptionOutput,
} from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, currentRef, context } = props;

	const {
		uniqueID,
		text,
		link,
		target,
		sponsored,
		download,
		noFollow,
		sizePreset,
		marginUnit,
		margin,
		tabletMargin,
		mobileMargin,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		color,
		background,
		backgroundType,
		gradient,
		textBackgroundType,
		textGradient,
		textBackgroundHoverType,
		textGradientHover,
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
		width,
		widthUnit,
		widthType,
		displayShadow,
		shadow,
		displayHoverShadow,
		shadowHover,
		iconColor,
		iconColorHover,
		colorTransparent,
		colorTransparentHover,
		backgroundTransparent,
		backgroundTransparentType,
		gradientTransparent,
		backgroundTransparentHover,
		backgroundTransparentHoverType,
		gradientTransparentHover,
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle,
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		borderTransparentRadius,
		tabletBorderTransparentRadius,
		mobileBorderTransparentRadius,
		borderTransparentRadiusUnit,
		borderTransparentHoverRadius,
		tabletBorderTransparentHoverRadius,
		mobileBorderTransparentHoverRadius,
		borderTransparentHoverRadiusUnit,
		displayShadowTransparent,
		shadowTransparent,
		displayHoverShadowTransparent,
		shadowTransparentHover,
		colorSticky,
		colorStickyHover,
		backgroundSticky,
		backgroundStickyType,
		gradientSticky,
		backgroundStickyHover,
		backgroundStickyHoverType,
		gradientStickyHover,
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle,
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		borderStickyRadius,
		tabletBorderStickyRadius,
		mobileBorderStickyRadius,
		borderStickyRadiusUnit,
		borderStickyHoverRadius,
		tabletBorderStickyHoverRadius,
		mobileBorderStickyHoverRadius,
		borderStickyHoverRadiusUnit,
		displayShadowSticky,
		shadowSticky,
		displayHoverShadowSticky,
		shadowStickyHover,
	} = attributes;

	const css = new KadenceBlocksCSS();

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
	const previewPaddingUnit = paddingUnit ? paddingUnit : 'px';

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
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverRightColor = getBorderColor(
		previewDevice,
		'right',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverBottomColor = getBorderColor(
		previewDevice,
		'bottom',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverLeftColor = getBorderColor(
		previewDevice,
		'left',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
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

	const previewRadiusTransparentTop = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[0] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[0] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[0] : ''
	);
	const previewRadiusTransparentRight = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[1] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[1] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[1] : ''
	);
	const previewRadiusTransparentBottom = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[2] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[2] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[2] : ''
	);
	const previewRadiusTransparentLeft = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[3] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[3] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[3] : ''
	);
	const previewBorderTransparentTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const previewBorderTransparentRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const previewBorderTransparentBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const previewBorderTransparentLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const inheritBorderTransparent = [
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle,
	];
	const previewBorderTransparentHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);
	const previewBorderTransparentHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);
	const previewBorderTransparentHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);
	const previewBorderTransparentHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);

	const previewHoverRadiusTransparentTop = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[0] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[0] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[0] : ''
	);
	const previewHoverRadiusTransparentRight = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[1] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[1] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[1] : ''
	);
	const previewHoverRadiusTransparentBottom = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[2] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[2] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[2] : ''
	);
	const previewHoverRadiusTransparentLeft = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[3] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[3] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[3] : ''
	);

	const previewRadiusStickyTop = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[0] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[0] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[0] : ''
	);
	const previewRadiusStickyRight = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[1] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[1] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[1] : ''
	);
	const previewRadiusStickyBottom = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[2] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[2] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[2] : ''
	);
	const previewRadiusStickyLeft = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[3] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[3] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[3] : ''
	);
	const previewBorderStickyTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const previewBorderStickyRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const previewBorderStickyBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const previewBorderStickyLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const inheritBorderSticky = [borderStickyStyle, tabletBorderStickyStyle, mobileBorderStickyStyle];
	const previewBorderStickyHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);
	const previewBorderStickyHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);
	const previewBorderStickyHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);
	const previewBorderStickyHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);

	const previewHoverRadiusStickyTop = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[0] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[0] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[0] : ''
	);
	const previewHoverRadiusStickyRight = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[1] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[1] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[1] : ''
	);
	const previewHoverRadiusStickyBottom = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[2] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[2] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[2] : ''
	);
	const previewHoverRadiusStickyLeft = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[3] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[3] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[3] : ''
	);

	const previewTypographyCSS = typographyStyle(
		typography,
		`.editor-styles-wrapper .wp-block-kadence-advancedbtn .kb-single-btn-${uniqueID} .kt-button-${uniqueID}`,
		previewDevice
	);

	let btnbg;
	if (undefined !== backgroundType && 'gradient' === backgroundType) {
		btnbg = gradient;
	} else {
		btnbg = 'transparent' === background || undefined === background ? undefined : KadenceColorOutput(background);
	}

	let btnbgTransparent;
	if (undefined !== backgroundTransparentType && 'gradient' === backgroundTransparentType) {
		btnbgTransparent = gradientTransparent;
	} else {
		btnbgTransparent =
			'transparent' === backgroundTransparent || undefined === backgroundTransparent
				? undefined
				: KadenceColorOutput(backgroundTransparent);
	}

	let btnbgSticky;
	if (undefined !== backgroundStickyType && 'gradient' === backgroundStickyType) {
		btnbgSticky = gradientSticky;
	} else {
		btnbgSticky =
			'transparent' === backgroundSticky || undefined === backgroundSticky
				? undefined
				: KadenceColorOutput(backgroundSticky);
	}

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

	let btnRadTransparent = '0';
	let btnBoxTransparent = '';
	let btnBox2Transparent = '';
	const btnbgTransparentHover =
		'gradient' === backgroundTransparentHoverType
			? gradientTransparentHover
			: KadenceColorOutput(backgroundTransparentHover);
	if (
		undefined !== displayHoverShadowTransparent &&
		displayHoverShadowTransparent &&
		undefined !== shadowTransparentHover?.[0] &&
		undefined !== shadowTransparentHover?.[0].inset &&
		false === shadowTransparentHover?.[0].inset
	) {
		btnBoxTransparent = `${
			(undefined !== shadowTransparentHover?.[0].inset && shadowTransparentHover[0].inset ? 'inset ' : '') +
			(undefined !== shadowTransparentHover?.[0].hOffset ? shadowTransparentHover[0].hOffset : 0) +
			'px ' +
			(undefined !== shadowTransparentHover?.[0].vOffset ? shadowTransparentHover[0].vOffset : 0) +
			'px ' +
			(undefined !== shadowTransparentHover?.[0].blur ? shadowTransparentHover[0].blur : 14) +
			'px ' +
			(undefined !== shadowTransparentHover?.[0].spread ? shadowTransparentHover[0].spread : 0) +
			'px ' +
			KadenceColorOutput(
				undefined !== shadowTransparentHover?.[0].color ? shadowTransparentHover[0].color : '#000000',
				undefined !== shadowTransparentHover?.[0].opacity ? shadowTransparentHover[0].opacity : 1
			)
		}`;
		btnBox2Transparent = 'none';
		btnRadTransparent = '0';
	}
	if (
		undefined !== displayHoverShadowTransparent &&
		displayHoverShadowTransparent &&
		undefined !== shadowTransparentHover?.[0] &&
		undefined !== shadowTransparentHover?.[0].inset &&
		true === shadowTransparentHover?.[0].inset
	) {
		btnBox2Transparent = `${
			(undefined !== shadowTransparentHover?.[0].inset && shadowTransparentHover[0].inset ? 'inset ' : '') +
			(undefined !== shadowTransparentHover?.[0].hOffset ? shadowTransparentHover[0].hOffset : 0) +
			'px ' +
			(undefined !== shadowTransparentHover?.[0].vOffset ? shadowTransparentHover[0].vOffset : 0) +
			'px ' +
			(undefined !== shadowTransparentHover?.[0].blur ? shadowTransparentHover[0].blur : 14) +
			'px ' +
			(undefined !== shadowTransparentHover?.[0].spread ? shadowTransparentHover[0].spread : 0) +
			'px ' +
			KadenceColorOutput(
				undefined !== shadowTransparentHover?.[0].color ? shadowTransparentHover[0].color : '#000000',
				undefined !== shadowTransparentHover?.[0].opacity ? shadowTransparentHover[0].opacity : 1
			)
		}`;
		btnRadTransparent = undefined !== borderTransparentRadius ? borderTransparentRadius : '3';
		btnBoxTransparent = 'none';
	}

	let btnRadSticky = '0';
	let btnBoxSticky = '';
	let btnBox2Sticky = '';
	const btnbgStickyHover =
		'gradient' === backgroundStickyHoverType ? gradientStickyHover : KadenceColorOutput(backgroundStickyHover);
	if (
		undefined !== displayHoverShadowSticky &&
		displayHoverShadowSticky &&
		undefined !== shadowStickyHover?.[0] &&
		undefined !== shadowStickyHover?.[0].inset &&
		false === shadowStickyHover?.[0].inset
	) {
		btnBoxSticky = `${
			(undefined !== shadowStickyHover?.[0].inset && shadowStickyHover[0].inset ? 'inset ' : '') +
			(undefined !== shadowStickyHover?.[0].hOffset ? shadowStickyHover[0].hOffset : 0) +
			'px ' +
			(undefined !== shadowStickyHover?.[0].vOffset ? shadowStickyHover[0].vOffset : 0) +
			'px ' +
			(undefined !== shadowStickyHover?.[0].blur ? shadowStickyHover[0].blur : 14) +
			'px ' +
			(undefined !== shadowStickyHover?.[0].spread ? shadowStickyHover[0].spread : 0) +
			'px ' +
			KadenceColorOutput(
				undefined !== shadowStickyHover?.[0].color ? shadowStickyHover[0].color : '#000000',
				undefined !== shadowStickyHover?.[0].opacity ? shadowStickyHover[0].opacity : 1
			)
		}`;
		btnBox2Sticky = 'none';
		btnRadSticky = '0';
	}
	if (
		undefined !== displayHoverShadowSticky &&
		displayHoverShadowSticky &&
		undefined !== shadowStickyHover?.[0] &&
		undefined !== shadowStickyHover?.[0].inset &&
		true === shadowStickyHover?.[0].inset
	) {
		btnBox2Sticky = `${
			(undefined !== shadowStickyHover?.[0].inset && shadowStickyHover[0].inset ? 'inset ' : '') +
			(undefined !== shadowStickyHover?.[0].hOffset ? shadowStickyHover[0].hOffset : 0) +
			'px ' +
			(undefined !== shadowStickyHover?.[0].vOffset ? shadowStickyHover[0].vOffset : 0) +
			'px ' +
			(undefined !== shadowStickyHover?.[0].blur ? shadowStickyHover[0].blur : 14) +
			'px ' +
			(undefined !== shadowStickyHover?.[0].spread ? shadowStickyHover[0].spread : 0) +
			'px ' +
			KadenceColorOutput(
				undefined !== shadowStickyHover?.[0].color ? shadowStickyHover[0].color : '#000000',
				undefined !== shadowStickyHover?.[0].opacity ? shadowStickyHover[0].opacity : 1
			)
		}`;
		btnRadSticky = undefined !== borderStickyRadius ? borderStickyRadius : '3';
		btnBoxSticky = 'none';
	}

	css.add_raw_styles(previewTypographyCSS);
	//global outline styles
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kb-btn-global-outline`);
	if (!previewBorderTopStyle) {
		css.add_property('border-top-color', css.render_color(previewBorderTopColor));
	}
	if (!previewBorderRightStyle) {
		css.add_property('border-right-color', css.render_color(previewBorderRightColor));
	}
	if (!previewBorderLeftStyle) {
		css.add_property('border-left-color', css.render_color(previewBorderLeftColor));
	}
	if (!previewBorderBottomStyle) {
		css.add_property('border-bottom-color', css.render_color(previewBorderBottomColor));
	}
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kb-btn-global-outline:hover`);
	if (!previewBorderHoverTopStyle) {
		css.add_property('border-top-color', css.render_color(previewBorderHoverTopColor));
	}
	if (!previewBorderHoverRightStyle) {
		css.add_property('border-right-color', css.render_color(previewBorderHoverRightColor));
	}
	if (!previewBorderHoverLeftStyle) {
		css.add_property('border-left-color', css.render_color(previewBorderHoverLeftColor));
	}
	if (!previewBorderHoverBottomStyle) {
		css.add_property('border-bottom-color', css.render_color(previewBorderHoverBottomColor));
	}
	//standard styles
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);
	if (previewPaddingTop) {
		css.add_property('padding-top', getSpacingOptionOutput(previewPaddingTop, previewPaddingUnit));
	}
	if (previewPaddingRight) {
		css.add_property('padding-right', getSpacingOptionOutput(previewPaddingRight, previewPaddingUnit));
	}
	if (previewPaddingLeft) {
		css.add_property('padding-left', getSpacingOptionOutput(previewPaddingLeft, previewPaddingUnit));
	}
	if (previewPaddingBottom) {
		css.add_property('padding-bottom', getSpacingOptionOutput(previewPaddingBottom, previewPaddingUnit));
	}

	if (previewMarginTop) {
		css.add_property('margin-top', getSpacingOptionOutput(previewMarginTop, previewMarginUnit));
	}
	if (previewMarginRight) {
		css.add_property('margin-right', getSpacingOptionOutput(previewMarginRight, previewMarginUnit));
	}
	if (previewMarginLeft) {
		css.add_property('margin-left', getSpacingOptionOutput(previewMarginLeft, previewMarginUnit));
	}
	if (previewMarginBottom) {
		css.add_property('margin-bottom', getSpacingOptionOutput(previewMarginBottom, previewMarginUnit));
	}
	if (previewBorderTopStyle) {
		css.add_property('border-top', previewBorderTopStyle);
	}
	if (previewBorderRightStyle) {
		css.add_property('border-right', previewBorderRightStyle);
	}
	if (previewBorderLeftStyle) {
		css.add_property('border-left', previewBorderLeftStyle);
	}
	if (previewBorderBottomStyle) {
		css.add_property('border-bottom', previewBorderBottomStyle);
	}
	if ('' !== previewRadiusTop) {
		css.add_property('border-top-left-radius', previewRadiusTop + (borderRadiusUnit ? borderRadiusUnit : 'px'));
	}
	if ('' !== previewRadiusRight) {
		css.add_property('border-top-right-radius', previewRadiusRight + (borderRadiusUnit ? borderRadiusUnit : 'px'));
	}
	if ('' !== previewRadiusLeft) {
		css.add_property('border-bottom-left-radius', previewRadiusLeft + (borderRadiusUnit ? borderRadiusUnit : 'px'));
	}
	if ('' !== previewRadiusBottom) {
		css.add_property(
			'border-bottom-right-radius',
			previewRadiusBottom + (borderRadiusUnit ? borderRadiusUnit : 'px')
		);
	}
	css.add_property(
		'box-shadow',
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
			: undefined
	);

	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID} .kt-button-text`);
	if (textBackgroundType === 'gradient') {
		css.add_property('background', textGradient);
		css.add_property('-webkit-background-clip', 'text');
		css.add_property('-webkit-text-fill-color', 'transparent');
	} else {
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kt-button.kt-button`);
		css.add_property('color', css.render_color(color));
	}

	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover .kt-button-text`);
	if (textBackgroundHoverType === 'gradient') {
		css.add_property('background', textGradientHover);
		css.add_property('-webkit-background-clip', 'text');
		css.add_property('-webkit-text-fill-color', 'transparent');
	} else {
		css.add_property('color', css.render_color(colorHover));
	}

	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);
	css.add_property('background', btnbg);
	css.add_property(
		'width',
		undefined !== widthType &&
			'fixed' === widthType &&
			'px' === (undefined !== widthUnit ? widthUnit : 'px') &&
			'' !== previewFixedWidth
			? previewFixedWidth + (undefined !== widthUnit ? widthUnit : 'px')
			: undefined
	);

	//hover styles
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover`);
	if (previewBorderHoverTopStyle) {
		css.add_property('border-top', previewBorderHoverTopStyle);
	}
	if (previewBorderHoverRightStyle) {
		css.add_property('border-right', previewBorderHoverRightStyle);
	}
	if (previewBorderHoverLeftStyle) {
		css.add_property('border-left', previewBorderHoverLeftStyle);
	}
	if (previewBorderHoverBottomStyle) {
		css.add_property('border-bottom', previewBorderHoverBottomStyle);
	}
	if ('' !== previewHoverRadiusTop) {
		css.add_property(
			'border-top-left-radius',
			previewHoverRadiusTop + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	if ('' !== previewHoverRadiusRight) {
		css.add_property(
			'border-top-right-radius',
			previewHoverRadiusRight + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	if ('' !== previewHoverRadiusLeft) {
		css.add_property(
			'border-bottom-left-radius',
			previewHoverRadiusLeft + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	if ('' !== previewHoverRadiusBottom) {
		css.add_property(
			'border-bottom-right-radius',
			previewHoverRadiusBottom + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	css.add_property('box-shadow', btnBox);
	css.add_property('color', css.render_color(colorHover));

	//transparent styles
	if (context?.['kadence/headerIsTransparent'] == '1') {
		//standard transparent styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);
		if (previewBorderTransparentTopStyle) {
			css.add_property('border-top', previewBorderTransparentTopStyle);
		}
		if (previewBorderTransparentRightStyle) {
			css.add_property('border-right', previewBorderTransparentRightStyle);
		}
		if (previewBorderTransparentLeftStyle) {
			css.add_property('border-left', previewBorderTransparentLeftStyle);
		}
		if (previewBorderTransparentBottomStyle) {
			css.add_property('border-bottom', previewBorderTransparentBottomStyle);
		}
		if ('' !== previewRadiusTransparentTop) {
			css.add_property(
				'border-top-left-radius',
				previewRadiusTransparentTop + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusTransparentRight) {
			css.add_property(
				'border-top-right-radius',
				previewRadiusTransparentRight + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusTransparentLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewRadiusTransparentLeft + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusTransparentBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewRadiusTransparentBottom + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		css.add_property(
			'box-shadow',
			undefined !== displayShadowTransparent &&
				displayShadowTransparent &&
				undefined !== shadowTransparent &&
				undefined !== shadowTransparent[0] &&
				undefined !== shadowTransparent[0].color
				? (undefined !== shadowTransparent[0].inset && shadowTransparent[0].inset ? 'inset ' : '') +
						(undefined !== shadowTransparent[0].hOffset ? shadowTransparent[0].hOffset : 0) +
						'px ' +
						(undefined !== shadowTransparent[0].vOffset ? shadowTransparent[0].vOffset : 0) +
						'px ' +
						(undefined !== shadowTransparent[0].blur ? shadowTransparent[0].blur : 14) +
						'px ' +
						(undefined !== shadowTransparent[0].spread ? shadowTransparent[0].spread : 0) +
						'px ' +
						KadenceColorOutput(
							undefined !== shadowTransparent[0].color ? shadowTransparent[0].color : '#000000',
							undefined !== shadowTransparent[0].opacity ? shadowTransparent[0].opacity : 1
						)
				: undefined
		);
		css.add_property('color', css.render_color(colorTransparent));
		css.add_property('background', btnbgTransparent);

		//hover styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover`);
		if (previewBorderTransparentHoverTopStyle) {
			css.add_property('border-top', previewBorderTransparentHoverTopStyle);
		}
		if (previewBorderTransparentHoverRightStyle) {
			css.add_property('border-right', previewBorderTransparentHoverRightStyle);
		}
		if (previewBorderTransparentHoverLeftStyle) {
			css.add_property('border-left', previewBorderTransparentHoverLeftStyle);
		}
		if (previewBorderTransparentHoverBottomStyle) {
			css.add_property('border-bottom', previewBorderTransparentHoverBottomStyle);
		}
		if ('' !== previewHoverRadiusTransparentTop) {
			css.add_property(
				'border-top-left-radius',
				previewHoverRadiusTransparentTop +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusTransparentRight) {
			css.add_property(
				'border-top-right-radius',
				previewHoverRadiusTransparentRight +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusTransparentLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewHoverRadiusTransparentLeft +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusTransparentBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewHoverRadiusTransparentBottom +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		css.add_property('box-shadow', btnBoxTransparent);
		css.add_property('color', css.render_color(colorTransparentHover));
	}

	//sticky styles
	if (context?.['kadence/headerIsSticky'] == '1') {
		//standard sticky styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);
		if (previewBorderStickyTopStyle) {
			css.add_property('border-top', previewBorderStickyTopStyle);
		}
		if (previewBorderStickyRightStyle) {
			css.add_property('border-right', previewBorderStickyRightStyle);
		}
		if (previewBorderStickyLeftStyle) {
			css.add_property('border-left', previewBorderStickyLeftStyle);
		}
		if (previewBorderStickyBottomStyle) {
			css.add_property('border-bottom', previewBorderStickyBottomStyle);
		}
		if ('' !== previewRadiusStickyTop) {
			css.add_property(
				'border-top-left-radius',
				previewRadiusStickyTop + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusStickyRight) {
			css.add_property(
				'border-top-right-radius',
				previewRadiusStickyRight + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusStickyLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewRadiusStickyLeft + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusStickyBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewRadiusStickyBottom + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		css.add_property(
			'box-shadow',
			undefined !== displayShadowSticky &&
				displayShadowSticky &&
				undefined !== shadowSticky &&
				undefined !== shadowSticky[0] &&
				undefined !== shadowSticky[0].color
				? (undefined !== shadowSticky[0].inset && shadowSticky[0].inset ? 'inset ' : '') +
						(undefined !== shadowSticky[0].hOffset ? shadowSticky[0].hOffset : 0) +
						'px ' +
						(undefined !== shadowSticky[0].vOffset ? shadowSticky[0].vOffset : 0) +
						'px ' +
						(undefined !== shadowSticky[0].blur ? shadowSticky[0].blur : 14) +
						'px ' +
						(undefined !== shadowSticky[0].spread ? shadowSticky[0].spread : 0) +
						'px ' +
						KadenceColorOutput(
							undefined !== shadowSticky[0].color ? shadowSticky[0].color : '#000000',
							undefined !== shadowSticky[0].opacity ? shadowSticky[0].opacity : 1
						)
				: undefined
		);
		css.add_property('color', css.render_color(colorSticky));
		css.add_property('background', btnbgSticky);

		//hover styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover`);
		if (previewBorderStickyHoverTopStyle) {
			css.add_property('border-top', previewBorderStickyHoverTopStyle);
		}
		if (previewBorderStickyHoverRightStyle) {
			css.add_property('border-right', previewBorderStickyHoverRightStyle);
		}
		if (previewBorderStickyHoverLeftStyle) {
			css.add_property('border-left', previewBorderStickyHoverLeftStyle);
		}
		if (previewBorderStickyHoverBottomStyle) {
			css.add_property('border-bottom', previewBorderStickyHoverBottomStyle);
		}
		if ('' !== previewHoverRadiusStickyTop) {
			css.add_property(
				'border-top-left-radius',
				previewHoverRadiusStickyTop + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusStickyRight) {
			css.add_property(
				'border-top-right-radius',
				previewHoverRadiusStickyRight + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusStickyLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewHoverRadiusStickyLeft + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusStickyBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewHoverRadiusStickyBottom + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		css.add_property('box-shadow', btnBoxSticky);
		css.add_property('color', css.render_color(colorStickyHover));
	}

	//icon styles
	if (iconColor) {
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID} .kt-btn-svg-icon`);
		css.add_property('color', css.render_color(iconColor));
	}
	if (iconColorHover) {
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover .kt-btn-svg-icon`);
		css.add_property('color', css.render_color(iconColorHover));
	}
	//pseudo stlyes
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}::before`);
	css.add_property('background', btnbgHover);
	css.add_property('box-shadow', btnBox2);
	css.add_property('border-radius', btnRad);

	const cssOutput = css.css_output();
	return <style>{`${cssOutput}`}</style>;
}
