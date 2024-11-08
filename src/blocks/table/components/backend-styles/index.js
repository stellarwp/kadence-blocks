import {
	KadenceBlocksCSS,
	getFontSizeOptionOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	KadenceColorOutput,
	getBorderStyle,
} from '@kadence/helpers';

export default function BackendStyles(props) {
	const { attributes, previewDevice } = props;

	const {
		uniqueID,
		rows,
		columns,
		dataTypography,
		headerTypography,
		evenOddBackground,
		backgroundColorEven,
		backgroundColorOdd,
		backgroundHoverColorEven,
		backgroundHoverColorOdd,
		columnBackgrounds,
		columnBackgroundsHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderOnRowOnly,
		stickyFirstRow,
		stickyFirstColumn,
		maxWidth,
		maxWidthUnit,
		maxHeight,
		maxHeightUnit,
		cellPadding,
		tabletCellPadding,
		mobileCellPadding,
		cellPaddingType,
		textAlign,
		textAlignTablet,
		textAlignMobile,
		headerAlign,
		headerAlignTablet,
		headerAlignMobile,
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
	// const previewWidth = getPreviewSize(
	// 	previewDevice,
	// 	undefined !== width?.[0] ? width[0] : '',
	// 	undefined !== width?.[1] ? width[1] : '',
	// 	undefined !== width?.[2] ? width[2] : ''
	// );

	const previewHeaderAlign = getPreviewSize(previewDevice, headerAlign, headerAlignTablet, headerAlignMobile);
	const previewTextAlign = getPreviewSize(previewDevice, textAlign, textAlignTablet, textAlignMobile);

	css.set_selector(`.kb-table${uniqueID}`);
	css.render_font(dataTypography ? dataTypography : [], previewDevice);

	css.set_selector(`.kb-table${uniqueID} th`);
	css.render_font(headerTypography ? headerTypography : [], previewDevice);
	css.add_property('text-align', previewHeaderAlign);
	css.render_measure_output(
		cellPadding,
		tabletCellPadding,
		mobileCellPadding,
		previewDevice,
		'padding',
		cellPaddingType
	);

	css.set_selector(`.kb-table${uniqueID} td`);
	css.add_property('text-align', previewTextAlign);
	css.render_measure_output(
		cellPadding,
		tabletCellPadding,
		mobileCellPadding,
		previewDevice,
		'padding',
		cellPaddingType
	);

	if (evenOddBackground) {
		css.set_selector(`.kb-table${uniqueID} tr:nth-child(even)`);
		css.add_property('background-color', KadenceColorOutput(backgroundColorEven));

		css.set_selector(`.kb-table${uniqueID} tr:nth-child(odd)`);
		css.add_property('background-color', KadenceColorOutput(backgroundColorOdd));

		css.set_selector(`.kb-table${uniqueID} tr:nth-child(odd):hover`);
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColorOdd));

		css.set_selector(`.kb-table${uniqueID} tr:nth-child(even):hover`);
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColorEven));
	} else {
		css.set_selector(`.kb-table${uniqueID} tr`);
		css.add_property('background-color', KadenceColorOutput(backgroundColorEven));

		css.set_selector(`.kb-table${uniqueID} tr:hover`);
		css.add_property('background-color', KadenceColorOutput(backgroundHoverColorEven));
	}

	if (columnBackgrounds) {
		columnBackgrounds.forEach((background, index) => {
			if (background) {
				css.set_selector(`.kb-table${uniqueID} td:nth-child(${index + 1})`);
				css.add_property('background-color', KadenceColorOutput(background));
			}
		});
	}

	if (columnBackgroundsHover) {
		columnBackgroundsHover.forEach((background, index) => {
			if (background) {
				css.set_selector(`.kb-table${uniqueID} td:nth-child(${index + 1}):hover`);
				css.add_property('background-color', KadenceColorOutput(background));
			}
		});
	}

	if (borderOnRowOnly) {
		css.set_selector(`.kb-table${uniqueID} tr`);
	} else {
		css.set_selector(`.kb-table${uniqueID} th, .kb-table${uniqueID} td`);
	}
	css.add_property(
		'border-top',
		getBorderStyle(previewDevice, 'top', borderStyle, tabletBorderStyle, mobileBorderStyle)
	);
	css.add_property(
		'border-right',
		getBorderStyle(previewDevice, 'right', borderStyle, tabletBorderStyle, mobileBorderStyle)
	);
	css.add_property(
		'border-bottom',
		getBorderStyle(previewDevice, 'bottom', borderStyle, tabletBorderStyle, mobileBorderStyle)
	);
	css.add_property(
		'border-left',
		getBorderStyle(previewDevice, 'left', borderStyle, tabletBorderStyle, mobileBorderStyle)
	);

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

	if (stickyFirstRow) {
		css.set_selector(`.kb-table${uniqueID}:first-child`);
		css.add_property('position', 'sticky');
		css.add_property('top', '0');
		css.add_property('z-index', '1');
	}

	if (stickyFirstColumn) {
		css.set_selector(`.kb-table${uniqueID} td:first-child, .kb-table${uniqueID} th:first-child`);
		css.add_property('position', 'sticky');
		css.add_property('left', '0');
	}

	css.set_selector(`.kb-table-container${uniqueID}`);
	css.add_property('position', 'sticky');

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}
