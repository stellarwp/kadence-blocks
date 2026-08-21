/**
 * Plain state readers for the Style Library store. `state` is always the first, implicit argument —
 * `@wordpress/data` injects it; every other parameter is what a caller passes to
 * `select(STORE_NAME).getX(...)`.
 */

/**
 * Internal dependencies
 */
import { presetsKey, paletteListingKey, EMPTY_LISTING, EMPTY_OPTIMISTIC_SWATCH_EDIT } from './constants';
import { reshapePaletteRows } from '../helpers/palettes';

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

/**
 * Read a library's design-token feed.
 *
 * @param {Object} state The store's state.
 * @param {string} slug  Token library slug.
 *
 * @since TBD
 *
 * @return {?Object} The feed, or `null` if not yet resolved.
 */
export function getDesignTokensFeed(state, slug) {
	return state.feeds[slug] ?? null;
}

/**
 * Read the pending optimistic overlay for a palette listing — patches, deletions, and additions not
 * yet confirmed by a write's response.
 *
 * @param {Object} state     The store state.
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {Object} The overlay, or `EMPTY_OPTIMISTIC_SWATCH_EDIT` when nothing is pending.
 */
export function getOptimisticSwatchEdit(state, namespace, slug) {
	return state.optimisticSwatchEdits[paletteListingKey(namespace, slug)] ?? EMPTY_OPTIMISTIC_SWATCH_EDIT;
}
