import {
	KadenceBlocksCSS,
	getFontSizeOptionOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	KadenceColorOutput,
	useElementHeight,
} from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, previewDevice } = props;

	const {
		uniqueID,
		// padding,
		// tabletPadding,
		// mobilePadding,
		// paddingUnit,
		// margin,
		// tabletMargin,
		// mobileMargin,
		// marginUnit,
		dataTypography,
		headerTypography,
		evenOddBackground,
		backgroundColorEven,
		backgroundColorOdd,
		backgroundHoverColorEven,
		backgroundHoverColorOdd,
	} = attributes;

	const css = new KadenceBlocksCSS();

	// const previewMarginTop = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== margin ? margin[0] : '',
	// 	undefined !== tabletMargin ? tabletMargin[0] : '',
	// 	undefined !== mobileMargin ? mobileMargin[0] : ''
	// );
	// const previewMarginRight = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== margin ? margin[1] : '',
	// 	undefined !== tabletMargin ? tabletMargin[1] : '',
	// 	undefined !== mobileMargin ? mobileMargin[1] : ''
	// );
	// const previewMarginBottom = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== margin ? margin[2] : '',
	// 	undefined !== tabletMargin ? tabletMargin[2] : '',
	// 	undefined !== mobileMargin ? mobileMargin[2] : ''
	// );
	// const previewMarginLeft = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== margin ? margin[3] : '',
	// 	undefined !== tabletMargin ? tabletMargin[3] : '',
	// 	undefined !== mobileMargin ? mobileMargin[3] : ''
	// );
	//
	// const previewPaddingTop = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== padding ? padding[0] : '',
	// 	undefined !== tabletPadding ? tabletPadding[0] : '',
	// 	undefined !== mobilePadding ? mobilePadding[0] : ''
	// );
	// const previewPaddingRight = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== padding ? padding[1] : '',
	// 	undefined !== tabletPadding ? tabletPadding[1] : '',
	// 	undefined !== mobilePadding ? mobilePadding[1] : ''
	// );
	// const previewPaddingBottom = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== padding ? padding[2] : '',
	// 	undefined !== tabletPadding ? tabletPadding[2] : '',
	// 	undefined !== mobilePadding ? mobilePadding[2] : ''
	// );
	// const previewPaddingLeft = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== padding ? padding[3] : '',
	// 	undefined !== tabletPadding ? tabletPadding[3] : '',
	// 	undefined !== mobilePadding ? mobilePadding[3] : ''
	// );

	// const previewWidth = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== width?.[0] ? width[0] : '',
	// 	undefined !== width?.[1] ? width[1] : '',
	// 	undefined !== width?.[2] ? width[2] : ''
	// );

	css.set_selector(`.wp-block-kadence-table${uniqueID}`);
	css.render_font(dataTypography ? dataTypography : [], previewDevice);

	css.set_selector(`.wp-block-kadence-table${uniqueID} th`);
	css.render_font(headerTypography ? headerTypography : [], previewDevice);

	if (evenOddBackground) {
		css.set_selector(`.wp-block-kadence-table${uniqueID} tr:nth-child(even)`);
		css.add_property('background-color', KadenceColorOutput(backgroundColorEven));

		css.set_selector(`.wp-block-kadence-table${uniqueID} tr:nth-child(odd)`);
		css.add_property('background-color', KadenceColorOutput(backgroundColorOdd));

		css.set_selector(`.wp-block-kadence-table${uniqueID} tr:nth-child(odd):hover`);
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColorOdd));

		css.set_selector(`.wp-block-kadence-table${uniqueID} tr:nth-child(even):hover`);
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColorEven));
	} else {
		css.set_selector(`.wp-block-kadence-table${uniqueID} tr`);
		css.add_property('background-color', KadenceColorOutput(backgroundColorEven));

		css.set_selector(`.wp-block-kadence-table${uniqueID} tr:hover`);
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColorEven));
	}

	// css.add_property('color', KadenceColorOutput(dataTypography.color));
	// css.add_property('font-size', getFontSizeOptionOutput(previewFontSize, dataTypography.sizeType));
	// css.add_property('letter-spacing', getSpacingOptionOutput(previewLetterSpacing, dataTypography.letterType));
	// css.add_property('text-transform', dataTypography.textTransform);
	// css.add_property('font-family', dataTypography.family);
	// css.add_property('font-style', dataTypography.style);
	// css.add_property('font-weight', dataTypography.weight);
	// css.add_property('line-height', getSpacingOptionOutput(previewLineHeight, dataTypography.lineType));
	// css.add_property('margin-top', getSpacingOptionOutput(previewMarginTop, marginUnit));
	// css.add_property('margin-right', getSpacingOptionOutput(previewMarginRight, marginUnit));
	// css.add_property('margin-bottom', getSpacingOptionOutput(previewMarginBottom, marginUnit));
	// css.add_property('margin-left', getSpacingOptionOutput(previewMarginLeft, marginUnit));
	// css.add_property('padding-top', getSpacingOptionOutput(previewPaddingTop, paddingUnit));
	// css.add_property('padding-right', getSpacingOptionOutput(previewPaddingRight, paddingUnit));
	// css.add_property('padding-bottom', getSpacingOptionOutput(previewPaddingBottom, paddingUnit));
	// css.add_property('padding-left', getSpacingOptionOutput(previewPaddingLeft, paddingUnit));

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
