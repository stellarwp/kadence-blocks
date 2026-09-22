/**
 * Kind-aware normalization for the `color` kind — a Kadence palette slug (`palette3`) is resolved to its
 * literal via the global palette map, then lower-cased; a literal (`#3182CE`, `rgb(...)`) is lower-cased.
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
 * @since TBD
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
 *
 * @since TBD
 *
 * @return {string} The comparable literal, or '' when empty.
 */
export function normalizeColor(value) {
	if (value === undefined || value === null || value === '') {
		return '';
	}

	const literal = paletteMap()[value] || value;

	return String(literal).trim().toLowerCase();
}
