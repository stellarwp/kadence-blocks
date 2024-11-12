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
		useFixedWidths,
		columnSettings,
	} = attributes;
	const css = new KadenceBlocksCSS();

	// Get preview sizes
	const previewHeaderAlign = getPreviewSize(previewDevice, headerAlign, headerAlignTablet, headerAlignMobile);
	const previewTextAlign = getPreviewSize(previewDevice, textAlign, textAlignTablet, textAlignMobile);
	const previewMaxHeight = getPreviewSize(previewDevice, maxHeight?.[0], maxHeight?.[1], maxHeight?.[2]);
	const previewMaxWidth = getPreviewSize(previewDevice, maxWidth?.[0], maxWidth?.[1], maxWidth?.[2]);

	css.set_selector(`.kb-table${uniqueID}`);
	css.render_font(dataTypography ? dataTypography : [], previewDevice);

	css.set_selector(`.kb-table-container${uniqueID}`);
	if (maxHeight) {
		css.add_property('max-height', getSpacingOptionOutput(previewMaxHeight, maxHeightUnit) + ' !important');
		css.add_property('overflow-y', 'auto');
	}

	if (maxWidth) {
		css.add_property('max-width', getSpacingOptionOutput(previewMaxWidth, maxWidthUnit) + ' !important');
		css.add_property('overflow-x', 'auto');
	}

	// Add column width styles
	if (useFixedWidths && Array.isArray(columnSettings)) {
		let hasFixedColumns = false;

		columnSettings.forEach((settings, index) => {
			if (settings?.useFixed && settings?.width) {
				hasFixedColumns = true;
				css.set_selector(
					`.kb-table${uniqueID} td:nth-child(${index + 1}), .kb-table${uniqueID} th:nth-child(${index + 1})`
				);
				css.add_property('width', `${settings.width}${settings.unit}`);
			}
		});

		// Only apply fixed layout if we have any fixed columns
		if (hasFixedColumns) {
			css.set_selector(`.kb-table${uniqueID}`);
			css.add_property('table-layout', 'fixed');
			css.add_property('width', '100%');
		}
	}

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

	if (stickyFirstRow) {
		css.set_selector(`.kb-table${uniqueID} tr:first-child`);
		css.add_property('position', 'sticky !important');
		css.add_property('top', '0');
		css.add_property('z-index', '1');
	}

	if (stickyFirstColumn) {
		css.set_selector(`.kb-table${uniqueID} td:first-child, .kb-table${uniqueID} th:first-child`);
		css.add_property('position', 'sticky !important');
		css.add_property('left', '0');
	}

	const cssOutput = css.css_output();

	return <style>{`${cssOutput}`}</style>;
}