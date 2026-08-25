/**
 * A large flat catalog's matching + render-cap logic — a pure module (no React/JSX/REST) so it is
 * directly jest-covered without importing any component's JSX/`.scss` chain.
 *
 * Shared rather than app-local: the Style Library's font dropdown and the block editor's font-family
 * picker search the same ~1,900-name catalog, and a cap or a match rule that drifted between them
 * would make the same query return different lists on the two screens.
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
