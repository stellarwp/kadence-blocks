import { colord } from 'colord';

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

function getReadableColor(value, colors) {
	if (!value) {
		return '';
	}
	if (!colors) {
		return value;
	}
	const paletteIndex = colors && value ? value.match(/\d+$/)?.[0] - 1 : null;
	let currentColorString = paletteIndex !== null && colors[paletteIndex] ? colors[paletteIndex].color : value;
	if (currentColorString && currentColorString.startsWith('var(')) {
		currentColorString = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue(value.replace('var(', '').split(',')[0].replace(')', ''));
	}
	return currentColorString;
}

/**
 * useColorIsDark is a hook that returns a boolean variable specifying if the Color
 * background is dark or not.
 *
 * @return {boolean} True if the Color background is considered "dark" and false otherwise.
 */
export default function useColorIsDark(color, colors) {
	if (!color) {
		return false;
	}
	return colord(getReadableColor(color, colors)).isDark();
}
