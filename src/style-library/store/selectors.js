/**
 * Plain state readers for the Style Library store. `state` is always the first, implicit argument —
 * `@wordpress/data` injects it; every other parameter is what a caller passes to
 * `select(STORE_NAME).getX(...)`.
 */

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
