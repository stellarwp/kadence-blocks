import { __ } from '@wordpress/i18n';

import { SPACING_SIZES_MAP } from './constants';
export function getGutterPercentUnit(columnGutter, customGutter, gutterType) {
	const columnGutterString = undefined !== columnGutter ? columnGutter : 'default';
	let gutter = parseFloat(30 / 100);
	switch (columnGutterString) {
		case 'none':
			gutter = 0;
			break;
		case 'skinny':
			gutter = parseFloat(10 / 100);
			break;
		case 'wider':
			gutter = parseFloat(60 / 100);
			break;
		case 'custom':
			let custom = undefined !== customGutter && undefined !== customGutter[0] ? customGutter[0] : 30;
			const gutterUnit = undefined !== gutterType && gutterType ? gutterType : 'px';
			if ('px' !== gutterUnit) {
				custom = parseFloat(custom * 16);
			}
			gutter = parseFloat(custom / 100);
			break;
	}
	return gutter;
}
export function getGutterTotal(gutter, columns) {
	if (gutter && columns > 1) {
		return `(${gutter} * ${columns - 1})`;
	}
	return 0;
}
export function getPreviewGutterSize(previewDevice, columnGutter, customGutter, gutterType) {
	const columnGutterString = undefined !== columnGutter ? columnGutter : 'default';
	let gutter = 'var(--global-row-gutter-md, 2rem)';
	switch (columnGutterString) {
		case 'none':
			gutter = 0;
			break;
		case 'skinny':
			gutter = 'var(--global-row-gutter-sm, 1rem)';
			break;
		case 'wider':
			gutter = 'var(--global-row-gutter-lg, 4rem)';
			break;
		case 'custom':
			const gutterUnit = undefined !== gutterType && gutterType ? gutterType : 'px';
			let custom = undefined !== customGutter && undefined !== customGutter[0] ? customGutter[0] : 30;
			if ('Tablet' === previewDevice) {
				custom =
					undefined !== customGutter && undefined !== customGutter[1] && '' !== customGutter[1]
						? customGutter[1]
						: custom;
			} else if ('Mobile' === previewDevice) {
				custom =
					undefined !== customGutter && undefined !== customGutter[2] && '' !== customGutter[2]
						? customGutter[2]
						: custom;
			}
			if (custom) {
				custom = custom + gutterUnit;
			}
			gutter = custom;
			break;
	}
	return gutter;
}
export function getSpacingOptionName(value, unit) {
	if (!value) {
		return __('None', 'kadence-blocks');
	}
	if (!SPACING_SIZES_MAP) {
		return __('Unset', 'kadence-blocks');
	}
	if (value === '0') {
		return __('None', 'kadence-blocks');
	}
	const found = SPACING_SIZES_MAP.find((option) => option.value === value);
	if (!found) {
		return value + unit;
	}
	return found.name;
}
export function getSpacingOptionSize(value) {
	if (!value) {
		return 0;
	}
	if (!SPACING_SIZES_MAP) {
		return value;
	}
	if (value === '0') {
		return 0;
	}
	const found = SPACING_SIZES_MAP.find((option) => option.value === value);
	if (!found) {
		return value;
	}
	return found.size;
}
export function getSpacingNameFromSize(value) {
	if (!value) {
		return '';
	}
	if (value === '0') {
		return '0';
	}
	const found = SPACING_SIZES_MAP.find((option) => option.size === value);
	if (!found) {
		return value + 'px';
	}
	return found.name;
}
export function getSpacingValueFromSize(value) {
	if (!value) {
		return '';
	}
	if (value === '0') {
		return '0';
	}
	const found = SPACING_SIZES_MAP.find((option) => option.size === value);
	if (!found) {
		return value;
	}
	return found.value;
}
