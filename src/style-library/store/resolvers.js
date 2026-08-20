/**
 * Thunk resolvers for the Style Library store: each one is auto-invoked by `@wordpress/data` the
 * first time its matching selector is read with a given argument tuple, and the framework tracks
 * `isResolving`/resolution-finished state per tuple on its own — nothing here manages loading state
 * directly.
 */

/**
 * Internal dependencies
 */
import { fetchLibraries } from '../api/client';

/**
 * Resolve `selectors.getLibraries()`.
 *
 * @since TBD
 *
 * @return {Function} A `@wordpress/data` thunk.
 */
export const getLibraries =
	() =>
	async ({ dispatch }) => {
		const rows = await fetchLibraries();
		dispatch.receiveLibraries(rows);
	};
