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
