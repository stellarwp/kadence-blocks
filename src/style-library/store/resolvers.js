/**
 * Thunk resolvers for the Style Library store: each one is auto-invoked by `@wordpress/data` the
 * first time its matching selector is read with a given argument tuple, and the framework tracks
 * `isResolving`/resolution-finished state per tuple on its own — nothing here manages loading state
 * directly.
 */

/**
 * Internal dependencies
 */
import { fetchBlockPresets, fetchLibraries, fetchPalettes } from '../api/client';
import { presetsKey, paletteListingKey } from './constants';

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

/**
 * Resolve `selectors.getBlockPresets(namespace, block, slug)`.
 *
 * @param {string} namespace REST namespace.
 * @param {string} block     The block name, e.g. `kadence/singlebtn`.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {Function} A `@wordpress/data` thunk.
 */
export const getBlockPresets =
	(namespace, block, slug) =>
	async ({ dispatch }) => {
		const payload = await fetchBlockPresets(namespace, block, slug);
		dispatch.receiveBlockPresets(presetsKey(namespace, block, slug), payload);
	};

/**
 * Resolve `selectors.getPaletteListing(namespace, slug)`.
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {Function} A `@wordpress/data` thunk.
 */
export const getPaletteListing =
	(namespace, slug) =>
	async ({ dispatch }) => {
		const rows = await fetchPalettes(namespace, slug);
		dispatch.receivePaletteListing(paletteListingKey(namespace, slug), rows);
	};
