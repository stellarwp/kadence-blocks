/**
 * Plain state readers for the Style Library store. `state` is always the first, implicit argument —
 * `@wordpress/data` injects it; every other parameter is what a caller passes to
 * `select(STORE_NAME).getX(...)`.
 */

/**
 * Internal dependencies
 */
import { presetsKey } from './constants';

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
