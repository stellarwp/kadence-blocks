/**
 * The font catalog dropdown's matching + render-cap logic, pulled out of
 * `SearchableSelectDropdown.js` as its own pure module (no React/JSX/REST) so it is directly
 * jest-covered without importing the component's JSX/`.scss` chain — this app's tests are
 * pure-helpers-only for exactly that reason.
 */

/**
 * The maximum number of matching options rendered at once. 1,916 uncapped rows is visibly slow to
 * open, and a virtualization dependency is not worth it for a type-to-narrow catalog.
 *
 * @since TBD
 */
export const CATALOG_RENDER_CAP = 100;

/**
 * Filter a flat option list to those whose label case-insensitively contains `query`, capped to
 * `cap` rendered rows. An empty query matches everything (subject to the same cap), so opening the
 * menu with no search yet still shows a capped, non-empty starting list rather than nothing.
 *
 * @param {Array<{value: string, label: string}>} options The full option list.
 * @param {string}                                 query   The search input's current value.
 * @param {number}                                 [cap]   The maximum rendered rows. Defaults to
 *                                                          `CATALOG_RENDER_CAP`.
 *
 * @since TBD
 *
 * @return {{visible: Array<Object>, truncated: boolean}} The rows to render, and whether the full
 *         match count exceeds `cap` (the caller shows the "keep typing" footer when true).
 */
export function filterCatalogOptions(options, query, cap = CATALOG_RENDER_CAP) {
	const needle = String(query ?? '')
		.trim()
		.toLowerCase();

	const matches = needle === '' ? options : options.filter((option) => option.label.toLowerCase().includes(needle));

	return {
		visible: matches.slice(0, cap),
		truncated: matches.length > cap,
	};
}
