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
	let currentColorString =
		colors && colors?.[parseInt(value.slice(-1), 10) - 1] ? colors[parseInt(value.slice(-1), 10) - 1].color : value;
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
