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
 * Tracks each slug's most recent in-flight design-tokens feed fetch, whether started by THIS
 * resolver or by `hooks/use-design-tokens-feed.js`'s `refreshFeed` (which bumps and checks this
 * same counter directly — see `bumpFeedRevision`/`isFeedRevisionCurrent` below — rather than
 * going through this resolver's own thunk; that hook's own docblock explains why). Every write
 * flow across the app (scale, typography, palettes, presets) ends in a same-slug refresh, and two
 * sibling instances writing close together (e.g. a screen and its settings panel) can each trigger
 * one — without a shared guard, a slower earlier fetch's response landing after a faster later one
 * would silently overwrite the newer feed with stale data. This is the store-data-level half of
 * that defense; `use-design-tokens-feed.js`'s `latestRequestRef` is the separate, unrelated guard
 * for a slug SWITCH (which slug the UI ends up pointing at), not an overlapping same-slug refresh.
 *
 * @since TBD
 */
const feedRevisionBySlug = new Map();

/**
 * Advance a slug's feed revision, marking any still-in-flight fetch for it stale. Call once, at
 * the moment a new fetch for that slug starts — every caller (this resolver, and `refreshFeed`)
 * shares this one counter, so whichever of two overlapping fetches for the same slug started LAST
 * is the only one `isFeedRevisionCurrent` will still say yes to once it lands.
 *
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {number} The new current revision for this slug — pass this to `isFeedRevisionCurrent`
 *         once the fetch this call started resolves.
 */
export function bumpFeedRevision(slug) {
	const revision = (feedRevisionBySlug.get(slug) ?? 0) + 1;
	feedRevisionBySlug.set(slug, revision);
	return revision;
}

/**
 * Whether `revision` is still the current one for `slug` — false the moment a later call has
 * bumped past it, meaning the fetch this revision belongs to is stale and its response must not
 * be dispatched.
 *
 * @param {string} slug     Token library slug.
 * @param {number} revision The revision `bumpFeedRevision` returned when this fetch started.
 *
 * @since TBD
 *
 * @return {boolean} Whether this revision's response may still be dispatched.
 */
export function isFeedRevisionCurrent(slug, revision) {
	return feedRevisionBySlug.get(slug) === revision;
}

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
		const revision = bumpFeedRevision(slug);
		const feed = await fetchDesignTokensFeed(slug);

		// A newer fetch for this same slug started (and will dispatch its own response) after this
		// one did — this response is stale and must not overwrite it.
		if (!isFeedRevisionCurrent(slug, revision)) {
			return;
		}

		dispatch.receiveDesignTokensFeed(slug, feed);
	};
