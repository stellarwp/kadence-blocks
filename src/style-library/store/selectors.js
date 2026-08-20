/**
 * Plain state readers for the Style Library store. `state` is always the first, implicit argument —
 * `@wordpress/data` injects it; every other parameter is what a caller passes to
 * `select(STORE_NAME).getX(...)`.
 */

/**
 * Internal dependencies
 */
import { presetsKey, paletteListingKey, EMPTY_LISTING } from './constants';

/**
 * Read the libraries list.
 *
 * @param {Object} state The store's state.
 *
 * @since TBD
 *
 * @return {Array<Object>} The library rows.
 */
export function getLibraries(state) {
	return state.libraries;
}

/**
 * Read a block's preset collection.
 *
 * @param {Object} state     The store's state.
 * @param {string} namespace REST namespace.
 * @param {string} block     The block name, e.g. `kadence/singlebtn`.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {?Object} The preset collection, or `null` if not yet resolved.
 */
export function getBlockPresets(state, namespace, block, slug) {
	return state.presets[presetsKey(namespace, block, slug)] ?? null;
}

/**
 * Reshape the flat embedded-array wire response into the shape every consumer already expects. The
 * wire shape is a flat array of rows (WP core's `_embed` only resolves top-level collection items,
 * never something nested inside a wrapper key — see the REST controller's own docblock for why)
 * with `is_default`/`is_current`/`user_created` flags per row instead of collection-level pointers;
 * this reshapes those flags back into the pointer-based shape this app's own code was already built
 * around.
 *
 * Used internally by `getPaletteListing` below only — reshaping the raw wire-format rows, exactly
 * as the reducer stores them, into the shape the frontend consumes. Nothing else should call this
 * directly, and specifically not code that writes into the store: `helpers/palette-flows.js`
 * dispatches every write's response RAW, via `onReceive`, with no reshaping before dispatch —
 * reshaping a write's response before it reaches the store would double-reshape it on the next
 * read, since `getPaletteListing` is the one canonical place reshaping happens.
 *
 * @param {Array<Object>} rows The flat embedded-array rows.
 *
 * @since TBD
 *
 * @return {{defaultId: string, currentId: string, palettes: Array<Object>, userCreated: Array<string>}}
 */
export function reshapePaletteRows(rows) {
	return {
		defaultId: rows.find((row) => row.is_default)?.id ?? '',
		currentId: rows.find((row) => row.is_current)?.id ?? '',
		palettes: rows.map((row) => ({
			id: row.id,
			label: row.label,
			groups: row._embedded?.self?.[0]?.groups ?? [],
		})),
		userCreated: rows.filter((row) => row.user_created).map((row) => row.id),
	};
}

/**
 * Caches `reshapePaletteRows()`'s output per raw `rows` array reference, so `getPaletteListing`
 * below returns the SAME object on every call until the reducer actually replaces those rows (a
 * fresh dispatch). Without this, every call reshapes fresh — a new object every time even when
 * nothing changed — which `useSelect` sees as "the selector's result changed," triggering a
 * re-render loop and `@wordpress/data`'s "returns different values" dev warning on every render of
 * any component reading this selector.
 *
 * @since TBD
 */
const reshapedListingCache = new WeakMap();

/**
 * Read a library's palette listing, reshaped from the flat embedded-array wire response into the
 * shape every consumer already expects.
 *
 * @param {Object} state     The store's state.
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {{defaultId: string, currentId: string, palettes: Array<Object>, userCreated: Array<string>}}
 */
export function getPaletteListing(state, namespace, slug) {
	const rows = state.paletteListings[paletteListingKey(namespace, slug)];

	if (!rows) {
		return EMPTY_LISTING;
	}

	if (!reshapedListingCache.has(rows)) {
		reshapedListingCache.set(rows, reshapePaletteRows(rows));
	}

	return reshapedListingCache.get(rows);
}
