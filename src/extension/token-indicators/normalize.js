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
 * The populated sides of a stored dimension value, each trimmed to a string. A measurement control writes
 * a 4-side array (`[top, right, bottom, left]`) where an untouched side is `''`; a scalar value is a
 * single side. Empty/undefined sides are dropped, so an all-empty value yields `[]` and a per-corner
 * override yields one entry per touched side — the shape a side-aware compare needs.
 *
 * @param {*} value The stored dimension value (number, string, or 4-side array).
 * @return {string[]} The populated sides as trimmed strings; empty array when nothing is set.
 */
function dimensionSides(value) {
	const raw = Array.isArray(value) ? value : [value];

	return raw.filter((side) => side !== '' && side !== undefined && side !== null).map((side) => String(side).trim());
}

/**
 * Normalize a dimension attribute to `{ value, unit }`. A measurement control writes a 4-side array
 * (`[top, right, bottom, left]`); the representative value is the first populated side. An empty value
 * yields an empty marker so "no override" is detectable. This is the scalar view used for empty
 * detection and the single-value path; the bound-vs-overridden compare uses the side-aware `matchesVariant`
 * so a per-corner override is not masked by a matching first side.
 *
 * @param {*}      value The stored dimension value (number, string, or 4-side array).
 * @param {string} unit  The companion unit attribute (e.g. `borderRadiusUnit`).
 * @return {{ value: string, unit: string }} The canonical dimension, `value: ''` when empty.
 */
export function normalizeDimension(value, unit) {
	const sides = dimensionSides(value);

	if (!sides.length) {
		return { value: '', unit: '' };
	}

	return { value: sides[0], unit: String(unit || '').trim() };
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
		const sides = dimensionSides(value);
		const storedUnit = String(unit || '').trim();
		const variant = parseDimensionLiteral(variantValue);

		if (!sides.length) {
			return false;
		}

		const unitMatches = variant.unit === '' || storedUnit === variant.unit;

		// Side-aware: a stored dimension matches only when EVERY populated side equals the variant value.
		// A per-corner override (e.g. `['8','8','8','4']` vs `8px`) leaves one side differing and so reads
		// as overridden, not still-bound.
		return unitMatches && sides.every((side) => side === variant.value);
	}

	if (kind === 'color') {
		return normalizeColor(value) === normalizeColor(variantValue);
	}

	return normalizeText(value) === normalizeText(variantValue);
}
