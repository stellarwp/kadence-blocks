/**
 * The Style Library app's `@wordpress/data` store name, and the key builders every resolver/
 * selector in this store uses to address a specific resource instance.
 */

/**
 * The registered store name — visible in Redux DevTools and via
 * `wp.data.select('kadence-blocks/style-library')` in the browser console.
 *
 * @since TBD
 */
export const STORE_NAME = 'kadence-blocks/style-library';

/**
 * The separator every key builder below joins its segments with. Named rather than inlined
 * because the predicates further down split keys back apart on it — the two must never drift.
 *
 * @since TBD
 */
const KEY_SEPARATOR = '::';

/**
 * Build the state key for a block's preset collection.
 *
 * @param {string} namespace REST namespace.
 * @param {string} block     The block name, e.g. `kadence/singlebtn`.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {string} The state key.
 */
export function presetsKey(namespace, block, slug) {
	return [namespace, block, slug].join(KEY_SEPARATOR);
}

/**
 * Build the state key for a library's palette listing.
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 *
 * @since TBD
 *
 * @return {string} The state key.
 */
export function paletteListingKey(namespace, slug) {
	return [namespace, slug].join(KEY_SEPARATOR);
}

/**
 * Build the state key for the optimistic-swatch-edit overlay of ONE palette within a library —
 * scoped by palette id, not just the library, so a pending edit for one palette can never be
 * misapplied to a sibling palette in the same library if `editingId` changes before the write
 * settles (e.g. a browser back/forward navigation while a write is still in flight).
 *
 * @param {string} namespace REST namespace.
 * @param {string} slug      Token library slug.
 * @param {string} paletteId The palette id being edited.
 *
 * @since TBD
 *
 * @return {string} The state key.
 */
export function paletteEditKey(namespace, slug, paletteId) {
	return [paletteListingKey(namespace, slug), paletteId].join(KEY_SEPARATOR);
}

/**
 * Whether a key built by `paletteListingKey()` or `paletteEditKey()` addresses the given library.
 * One predicate serves both (and the palette-busy slice, which is keyed by `paletteListingKey()`)
 * because all three put the slug in the second segment.
 *
 * Compares one segment rather than testing a prefix or suffix: a slug is a slugified title and a
 * namespace is a REST path, so a naive `startsWith`/`endsWith` would match a library whose slug is
 * merely a prefix of another's.
 *
 * @param {string} key  A key built by `paletteListingKey()` or `paletteEditKey()`.
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {boolean} True when the key addresses that library.
 */
export function isLibraryScopedKey(key, slug) {
	return key.split(KEY_SEPARATOR)[1] === slug;
}

/**
 * Whether a key built by `presetsKey()` addresses the given library. Its own predicate because a
 * presets key carries the block name in the second segment, so the slug sits one place later than
 * in every other key this module builds.
 *
 * @param {string} key  A key built by `presetsKey()`.
 * @param {string} slug Token library slug.
 *
 * @since TBD
 *
 * @return {boolean} True when the key addresses that library.
 */
export function isPresetsKeyForLibrary(key, slug) {
	return key.split(KEY_SEPARATOR)[2] === slug;
}

/**
 * The shape `getPaletteListing` returns before its palette listing has resolved yet.
 *
 * @since TBD
 */
export const EMPTY_LISTING = { defaultId: '', currentId: '', palettes: [], userCreated: [] };

/**
 * The empty optimistic-swatch-edit overlay for a palette listing — no pending patch, deletion, or
 * addition. Returned by `getOptimisticSwatchEdit` for a listing key with nothing pending, so
 * `applyOptimisticOverlay` never has to branch on `undefined`.
 *
 * @since TBD
 */
export const EMPTY_OPTIMISTIC_SWATCH_EDIT = {
	patches: {},
	deletedTokens: [],
	deletedGroups: [],
	addedSwatches: [],
	addedGroups: [],
};

/**
 * The empty optimistic-edit overlay for a scale-type screen's tokens — no pending patch,
 * deletion, or addition. Returned by `getOptimisticScaleEdit` for a slug with nothing pending.
 *
 * @since TBD
 */
export const EMPTY_OPTIMISTIC_SCALE_EDIT = { patches: {}, deletedTokens: [], addedTokens: [] };
