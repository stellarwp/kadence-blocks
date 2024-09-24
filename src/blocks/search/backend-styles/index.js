import {
	KadenceBlocksCSS,
	getFontSizeOptionOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	KadenceColorOutput,
	useElementHeight,
	getBorderStyle,
	getBorderColor,
	typographyStyle,
} from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, clientId, currentRef } = props;

	const {
		uniqueID,
		displayStyle,
		showButton,
		sizePreset,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		inputTypography,
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
		tabletInputPadding,
		mobileInputPadding,
		inputPaddingType,
		inputMargin,
		tabletInputMargin,
		mobileInputMargin,
		inputMarginType,
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
		modalBackgroundColor,
		searchProductsOnly,
		modalGradientActive,
		modalBackgroundType,
		inputIconColor,
		inputIconHoverColor,
		inputMaxWidth,
		inputMaxWidthType,
		inputMinWidth,
		inputMinWidthType,
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
		undefined !== tabletInputPadding ? tabletInputPadding[0] : '',
		undefined !== mobileInputPadding ? mobileInputPadding[0] : ''
	);
	const previewInputPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[1] : '',
		undefined !== tabletInputPadding ? tabletInputPadding[1] : '',
		undefined !== mobileInputPadding ? mobileInputPadding[1] : ''
	);
	const previewInputPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[2] : '',
		undefined !== tabletInputPadding ? tabletInputPadding[2] : '',
		undefined !== mobileInputPadding ? mobileInputPadding[2] : ''
	);
	const previewInputPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[3] : '',
		undefined !== tabletInputPadding ? tabletInputPadding[3] : '',
		undefined !== mobileInputPadding ? mobileInputPadding[3] : ''
	);

	const previewInputMarginTop = getPreviewSize(
		previewDevice,
		undefined !== inputMargin ? inputMargin[0] : '',
		undefined !== tabletInputMargin ? tabletInputMargin[0] : '',
		undefined !== mobileInputMargin ? mobileInputMargin[0] : ''
	);
	const previewInputMarginRight = getPreviewSize(
		previewDevice,
		undefined !== inputMargin ? inputMargin[1] : '',
		undefined !== tabletInputMargin ? tabletInputMargin[1] : '',
		undefined !== mobileInputMargin ? mobileInputMargin[1] : ''
	);
	const previewInputMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== inputMargin ? inputMargin[2] : '',
		undefined !== tabletInputMargin ? tabletInputMargin[2] : '',
		undefined !== mobileInputMargin ? mobileInputMargin[2] : ''
	);
	const previewInputMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== inputMargin ? inputMargin[3] : '',
		undefined !== tabletInputMargin ? tabletInputMargin[3] : '',
		undefined !== mobileInputMargin ? mobileInputMargin[3] : ''
	);

	const previewInputFontSize = getPreviewSize(
		previewDevice,
		undefined !== inputTypography[0]?.size?.[0] ? inputTypography[0].size[0] : '',
		undefined !== inputTypography[0]?.size?.[1] ? inputTypography[0].size[1] : '',
		undefined !== inputTypography[0]?.size?.[2] ? inputTypography[0].size[2] : ''
	);

	const previewInputMaxWidth = getPreviewSize(
		previewDevice,
		undefined !== inputMaxWidth ? inputMaxWidth[0] : '',
		undefined !== inputMaxWidth ? inputMaxWidth[1] : '',
		undefined !== inputMaxWidth ? inputMaxWidth[2] : ''
	);

	const previewInputMinWidth = getPreviewSize(
		previewDevice,
		undefined !== inputMinWidth ? inputMinWidth[0] : '',
		undefined !== inputMinWidth ? inputMinWidth[1] : '',
		undefined !== inputMinWidth ? inputMinWidth[2] : ''
	);

	if (isSelected) {
		css.set_selector(
			`.block-editor-block-popover__inbetween-container .block-editor-block-list__insertion-point.is-with-inserter`
		);
		css.add_property('display', 'none');
	}

	//main display container
	css.set_selector(`.kb-search${uniqueID}`);
	css.add_property('margin-top', getSpacingOptionOutput(previewMarginTop, marginUnit));
	css.add_property('margin-right', getSpacingOptionOutput(previewMarginRight, marginUnit));
	css.add_property('margin-bottom', getSpacingOptionOutput(previewMarginBottom, marginUnit));
	css.add_property('margin-left', getSpacingOptionOutput(previewMarginLeft, marginUnit));
	css.add_property('padding-top', getSpacingOptionOutput(previewPaddingTop, paddingUnit));
	css.add_property('padding-right', getSpacingOptionOutput(previewPaddingRight, paddingUnit));
	css.add_property('padding-bottom', getSpacingOptionOutput(previewPaddingBottom, paddingUnit));
	css.add_property('padding-left', getSpacingOptionOutput(previewPaddingLeft, paddingUnit));

	css.set_selector(`.kb-search${uniqueID} .kb-search-modal`);
	if (modalBackgroundType === 'gradient') {
		css.add_property('--kb-search-modal-background', modalGradientActive);
	} else {
		css.add_property('--kb-search-modal-background', KadenceColorOutput(modalBackgroundColor));
	}

	css.set_selector(`.kb-search${uniqueID} .kb-search-input[type="text"]`);
	css.add_property('color', KadenceColorOutput(inputColor));
	css.add_property('font-size', getFontSizeOptionOutput(previewInputFontSize, inputTypography[0].sizeType));
	css.add_property(
		'line-height',
		inputTypography[0].lineHeight && inputTypography[0].lineHeight[0]
			? inputTypography[0].lineHeight[0] + inputTypography[0].lineType
			: undefined
	);
	css.add_property('font-weight', inputTypography[0].weight);
	css.add_property('font-style', inputTypography[0].style);
	css.add_property('text-transform', inputTypography[0].transform);
	css.add_property('letter-spacing', inputTypography[0].letterSpacing + 'px');
	css.add_property('font-family', inputTypography[0].family);
	css.add_property(
		'border-top-left-radius',
		getSpacingOptionOutput(previewInputBorderRadiusTop, inputBorderRadiusUnit)
	);
	css.add_property(
		'border-top-right-radius',
		getSpacingOptionOutput(previewInputBorderRadiusRight, inputBorderRadiusUnit)
	);
	css.add_property(
		'border-bottom-right-radius',
		getSpacingOptionOutput(previewInputBorderRadiusBottom, inputBorderRadiusUnit)
	);
	css.add_property(
		'border-bottom-left-radius',
		getSpacingOptionOutput(previewInputBorderRadiusLeft, inputBorderRadiusUnit)
	);
	css.add_property('padding-top', getSpacingOptionOutput(previewInputPaddingTop, inputPaddingType));
	css.add_property('padding-right', getSpacingOptionOutput(previewInputPaddingRight, inputPaddingType));
	css.add_property('padding-bottom', getSpacingOptionOutput(previewInputPaddingBottom, inputPaddingType));
	css.add_property('padding-left', getSpacingOptionOutput(previewInputPaddingLeft, inputPaddingType));

	css.add_property(
		'border-top',
		getBorderStyle(previewDevice, 'top', inputBorderStyles, tabletInputBorderStyles, mobileInputBorderStyles)
	);
	css.add_property(
		'border-right',
		getBorderStyle(previewDevice, 'right', inputBorderStyles, tabletInputBorderStyles, mobileInputBorderStyles)
	);
	css.add_property(
		'border-bottom',
		getBorderStyle(previewDevice, 'bottom', inputBorderStyles, tabletInputBorderStyles, mobileInputBorderStyles)
	);
	css.add_property(
		'border-left',
		getBorderStyle(previewDevice, 'left', inputBorderStyles, tabletInputBorderStyles, mobileInputBorderStyles)
	);
	if (inputBackgroundType === 'gradient') {
		css.add_property('background', inputGradient);
	} else {
		css.add_property('background', KadenceColorOutput(inputBackgroundColor));
	}

	css.set_selector(`.kb-search${uniqueID} .kb-search-input-wrapper`);
	css.add_property('margin-top', getSpacingOptionOutput(previewInputMarginTop, inputMarginType));
	css.add_property('margin-right', getSpacingOptionOutput(previewInputMarginRight, inputMarginType));
	css.add_property('margin-bottom', getSpacingOptionOutput(previewInputMarginBottom, inputMarginType));
	css.add_property('margin-left', getSpacingOptionOutput(previewInputMarginLeft, inputMarginType));

	// Input SVG Icon
	css.set_selector(`.kb-search${uniqueID} .kb-search-icon svg`);
	css.add_property('stroke', KadenceColorOutput(inputIconColor));

	css.set_selector(`.kb-search${uniqueID}:hover .kb-search-icon svg`);
	css.add_property('stroke', KadenceColorOutput(inputIconHoverColor));

	css.set_selector(`.kb-search${uniqueID} .kb-search-icon`);
	css.add_property('right', getSpacingOptionOutput(previewInputPaddingRight, inputPaddingType));

	// Close SVG Icon
	css.set_selector(`.kb-search${uniqueID} .kb-search-close-icon svg`);
	css.add_property('stroke', KadenceColorOutput(inputIconColor));

	css.set_selector(`.kb-search${uniqueID}:hover .kb-search-close-icon svg`);
	css.add_property('stroke', KadenceColorOutput(inputIconHoverColor));

	css.set_selector(`.kb-search${uniqueID} form`);
	css.add_property('max-width', getSpacingOptionOutput(previewInputMaxWidth, inputMaxWidthType));
	css.add_property('min-width', getSpacingOptionOutput(previewInputMinWidth, inputMinWidthType));

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
