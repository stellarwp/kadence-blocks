/**
 * Plain action creators for the Style Library store's RECEIVE_* actions. Every one of them is
 * dispatched from a resolver in `resolvers.js` once its matching REST read resolves.
 */

/**
 * Store the libraries list.
 *
 * @param {Array<Object>} rows The library rows.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function receiveLibraries(rows) {
	return { type: 'RECEIVE_LIBRARIES', rows };
}

/**
 * Store a block's preset collection.
 *
 * @param {string} key     `presetsKey()`'s output for this block/library.
 * @param {Object} payload The fetched preset collection.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function receiveBlockPresets(key, payload) {
	return { type: 'RECEIVE_BLOCK_PRESETS', key, payload };
}

/**
 * Store a library's palette listing.
 *
 * @param {string}        key  `paletteListingKey()`'s output for this library.
 * @param {Array<Object>} rows The fetched palette listing rows.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function receivePaletteListing(key, rows) {
	return { type: 'RECEIVE_PALETTE_LISTING', key, rows };
}
