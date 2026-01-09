/**
 * Measure styles utility with optional CSS variable output.
 *
 * Provides parity with PHP filter `kadence_blocks_measure_output_css_variables`.
 */
import { applyFilters } from '@wordpress/hooks';
import { getSpacingOptionOutput } from '@kadence/helpers';

/**
 * Generate measure styles with optional CSS variable output.
 *
 * @param {Object} options
 * @param {string} options.property      - 'padding', 'margin', or 'border-radius'
 * @param {string} options.blockName     - Block identifier (e.g., 'kadence/column')
 * @param {string} options.selector      - Unique ID for filter context
 * @param {Object} options.values        - { top, right, bottom, left } or { topLeft, topRight, bottomRight, bottomLeft }
 * @param {string} options.unit          - CSS unit (e.g., 'px', 'em')
 * @returns {Object} Style object for spread into component style prop
 */
export function getMeasureStyles({ property, blockName, selector, values, unit, attributes = {} }) {
	const useVariables = applyFilters('kadence.blocks.measureOutputCssVariables', false, property, blockName, selector, attributes);

	if (property === 'border-radius') {
		return getBorderRadiusStyles(values, unit, useVariables);
	}

	return getSpacingStyles(property, values, unit, useVariables);
}

/**
 * Generate spacing styles (padding/margin) with optional CSS variables.
 *
 * @param {string} property     - 'padding' or 'margin'
 * @param {Object} values       - { top, right, bottom, left }
 * @param {string} unit         - CSS unit
 * @param {boolean} useVariables - Whether to output CSS variables
 * @returns {Object} Style object
 */
function getSpacingStyles(property, values, unit, useVariables) {
	const sides = ['top', 'right', 'bottom', 'left'];
	const cssProps = {
		padding: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
		margin: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
	};

	const styles = {};

	sides.forEach((side, index) => {
		const value = values[side];
		if (value === undefined || value === '') {
			return;
		}

		const resolved = getSpacingOptionOutput(value, unit);
		const cssProp = cssProps[property][index];
		const varName = `--kb-${property}-${side}`;

		if (useVariables) {
			styles[varName] = resolved;
			styles[cssProp] = `var(${varName})`;
		} else {
			styles[cssProp] = resolved;
		}
	});

	return styles;
}

/**
 * Generate border-radius styles with optional CSS variables.
 *
 * @param {Object} values       - { topLeft, topRight, bottomRight, bottomLeft }
 * @param {string} unit         - CSS unit
 * @param {boolean} useVariables - Whether to output CSS variables
 * @returns {Object} Style object
 */
function getBorderRadiusStyles(values, unit, useVariables) {
	const corners = [
		{ key: 'topLeft', css: 'borderTopLeftRadius', var: '--kb-border-top-left-radius' },
		{ key: 'topRight', css: 'borderTopRightRadius', var: '--kb-border-top-right-radius' },
		{ key: 'bottomRight', css: 'borderBottomRightRadius', var: '--kb-border-bottom-right-radius' },
		{ key: 'bottomLeft', css: 'borderBottomLeftRadius', var: '--kb-border-bottom-left-radius' },
	];

	const styles = {};

	corners.forEach(({ key, css, var: varName }) => {
		const value = values[key];
		if (value === undefined || value === '') {
			return;
		}

		// Border radius doesn't use getSpacingOptionOutput - it's a simple value + unit
		const resolved = value + (unit || 'px');

		if (useVariables) {
			styles[varName] = resolved;
			styles[css] = `var(${varName})`;
		} else {
			styles[css] = resolved;
		}
	});

	return styles;
}
