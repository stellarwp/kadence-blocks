/**
 * Kind-aware value normalization for the design-token indicator's bound-vs-overridden compare.
 *
 * A control's stored attribute value and the selected variant's resolved value are compared after being
 * reduced to a canonical form per `kind`:
 *   - `color`      — a Kadence palette slug (`palette3`) is resolved to its literal via the global
 *                    palette map, then lower-cased; a literal (`#3182CE`, `rgb(...)`) is lower-cased.
 *   - `dimension`  — the numeric value is paired with its unit (`{ value, unit }`), tolerant of the
 *                    4-side array shape a measurement control writes.
 *   - `text`       — trimmed string compare.
 */

import { get } from 'lodash';

/**
 * The editor's global color palette map (`paletteN -> literal color`). Kadence localizes the theme
 * palette as `window.kadence_blocks_params.global_colors`, keyed by CSS custom-property name
 * (`--global-palette1`..`--global-palette9`); this reader strips the `--global-` prefix so the map keys
 * line up with the bare `paletteN` slug a color control writes into a block attribute (confirmed against
 * `SinglePopColorControl`, the swatch component behind `PopColorControl`). Empty when the params are
 * absent, so an unresolved slug simply compares as itself — the degrade-safe fallback.
 *
 * @return {Object} slug ('paletteN') => color literal.
 */
function paletteMap() {
	const colors = get(window, ['kadence_blocks_params', 'global_colors'], {}) || {};

	return Object.keys(colors).reduce((map, cssVar) => {
		const slug = cssVar.replace(/^--global-/, '');

		map[slug] = colors[cssVar];

		return map;
	}, {});
}

/**
 * Resolve a color attribute value to a comparable literal: a `paletteN` slug becomes its mapped color;
 * anything else passes through. Lower-cased so `#3182CE` and `#3182ce` compare equal. An unresolved slug
 * (palette map missing the key) passes through as the slug itself, which degrades safe — it never
 * produces a false match, at worst a false override.
 *
 * @param {*} value The stored color value (slug or literal), possibly empty.
 * @return {string} The comparable literal, or '' when empty.
 */
export function normalizeColor(value) {
	if (value === undefined || value === null || value === '') {
		return '';
	}

	const literal = paletteMap()[value] || value;

	return String(literal).trim().toLowerCase();
}

/**
 * Normalize a dimension attribute to `{ value, unit }`. A measurement control writes a 4-side array
 * (`[top, right, bottom, left]`); a uniform value is taken from the first defined side. An empty value
 * yields an empty marker so "no override" is detectable.
 *
 * @param {*}      value The stored dimension value (number, string, or 4-side array).
 * @param {string} unit  The companion unit attribute (e.g. `borderRadiusUnit`).
 * @return {{ value: string, unit: string }} The canonical dimension, `value: ''` when empty.
 */
export function normalizeDimension(value, unit) {
	let scalar = value;

	if (Array.isArray(value)) {
		scalar = value.find((side) => side !== '' && side !== undefined && side !== null);
	}

	if (scalar === undefined || scalar === null || scalar === '') {
		return { value: '', unit: '' };
	}

	return { value: String(scalar).trim(), unit: String(unit || '').trim() };
}

/**
 * Normalize a text attribute for compare.
 *
 * @param {*} value The stored value.
 * @return {string} The trimmed string, or '' when empty.
 */
export function normalizeText(value) {
	if (value === undefined || value === null) {
		return '';
	}

	return String(value).trim();
}

/**
 * Whether a stored attribute value is "empty" (untouched) for its kind — the signal a retarget-bound
 * control uses for `empty => bound`.
 *
 * @param {string} kind  The property kind ('color' | 'dimension' | 'text').
 * @param {*}      value The stored primary attribute value.
 * @return {boolean} True when the value is unset/empty.
 */
export function isEmptyValue(kind, value) {
	if (kind === 'dimension') {
		return normalizeDimension(value, '').value === '';
	}

	return normalizeColor(value) === '' && normalizeText(value) === '';
}

/**
 * Split a resolved dimension literal (`"1.5rem"`, `"8px"`, `"0"`) into `{ value, unit }` so it compares
 * against the control's separate value/unit attributes.
 *
 * @param {string} literal The resolved dimension literal.
 * @return {{ value: string, unit: string }} The parsed value and unit.
 */
function parseDimensionLiteral(literal) {
	const match = String(literal || '')
		.trim()
		.match(/^(-?[\d.]+)\s*([a-z%]*)$/i);

	if (!match) {
		return { value: String(literal || '').trim(), unit: '' };
	}

	return { value: match[1], unit: match[2] };
}

/**
 * Whether a stored value equals the selected variant's resolved value, normalized per kind.
 *
 * @param {string} kind         The property kind.
 * @param {*}      value        The stored primary attribute value.
 * @param {string} unit         The companion unit (dimension only; '' otherwise).
 * @param {string} variantValue The variant's resolved literal for this property.
 * @return {boolean} True when the stored value matches the variant value.
 */
export function matchesVariant(kind, value, unit, variantValue) {
	if (kind === 'dimension') {
		const stored = normalizeDimension(value, unit);
		const variant = parseDimensionLiteral(variantValue);

		return stored.value === variant.value && (stored.unit === variant.unit || variant.unit === '');
	}

	if (kind === 'color') {
		return normalizeColor(value) === normalizeColor(variantValue);
	}

	return normalizeText(value) === normalizeText(variantValue);
}
