/**
 * Thunk resolvers for the Style Library store: each one is auto-invoked by `@wordpress/data` the
 * first time its matching selector is read with a given argument tuple, and the framework tracks
 * `isResolving`/resolution-finished state per tuple on its own — nothing here manages loading state
 * directly.
 */

/**
 * Internal dependencies
 */
import { fetchBlockPresets, fetchLibraries, fetchPalettes, fetchDesignTokensFeed } from '../api/client';
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

/**
 * Tracks each slug's most recent `getDesignTokensFeed` resolver invocation. `refreshFeed`
 * (`hooks/use-design-tokens-feed.js`) always invalidates before re-resolving, even for the SAME
 * slug already showing — every write flow across the app (scale, typography, palettes, presets)
 * ends in a same-slug refresh, and two sibling instances writing close together (e.g. the screen
 * and its settings panel) can each trigger one. Without this, a slower earlier fetch's response
 * landing after a faster later one would silently overwrite the newer feed with stale data — this
 * store-level guard is the same defense `use-design-tokens-feed.js`'s `latestRequestRef` already
 * applies for a slug SWITCH, applied here to an overlapping refresh of the SAME slug.
 *
 * @since TBD
 */
const feedRevisionBySlug = new Map();

/**
 * Resolve `selectors.getDesignTokensFeed(slug)`.
 *
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {Function} A `@wordpress/data` thunk.
 */
export const getDesignTokensFeed =
	(slug) =>
	async ({ dispatch }) => {
		const revision = (feedRevisionBySlug.get(slug) ?? 0) + 1;
		feedRevisionBySlug.set(slug, revision);

		const feed = await fetchDesignTokensFeed(slug);

		// A newer fetch for this same slug started (and will dispatch its own response) after this
		// one did — this response is stale and must not overwrite it.
		if (feedRevisionBySlug.get(slug) !== revision) {
			return;
		}

		dispatch.receiveDesignTokensFeed(slug, feed);
	};
