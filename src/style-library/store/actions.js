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

/**
 * Store a library's design-token feed.
 *
 * @param {string} slug The library slug the feed was resolved for.
 * @param {Object} feed The feed payload.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function receiveDesignTokensFeed(slug, feed) {
	return { type: 'RECEIVE_DESIGN_TOKENS_FEED', slug, feed };
}

/**
 * Patch a swatch's label and/or value in the optimistic overlay, ahead of its write's response.
 *
 * @param {string} key   The palette listing key (`paletteListingKey(namespace, slug)`).
 * @param {string} token The swatch token dot-path being edited.
 * @param {Object} patch `{ label?, $value? }` — whichever field(s) changed. `$value`, not `value` —
 *                       must match the DTCG field name every real swatch object already uses
 *                       (`palette.groups[].swatches[].$value`), or `applyOptimisticOverlay`'s
 *                       spread-merge silently adds a stray `value` key instead of overwriting the
 *                       one `mapPaletteToSwatchGroups`/`SwatchCard` actually read.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function setOptimisticSwatchPatch(key, token, patch) {
	return { type: 'SET_OPTIMISTIC_SWATCH_PATCH', key, token, patch };
}

/**
 * Clear a swatch's pending optimistic patch — the write's real response has landed, or it failed.
 *
 * @param {string} key   The palette listing key.
 * @param {string} token The swatch token dot-path.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function clearOptimisticSwatchPatch(key, token) {
	return { type: 'CLEAR_OPTIMISTIC_SWATCH_PATCH', key, token };
}

/**
 * Mark a swatch or group as pending deletion in the optimistic overlay — stays visible but dimmed
 * (`applyOptimisticOverlay` flags it `pendingDelete: true`, it is never filtered out) until the
 * write settles, so the UI shows a "Deleting…" transitional state rather than an instant vanish.
 *
 * @param {string}            key  The palette listing key.
 * @param {'swatch'|'group'}  kind Which id list to add to.
 * @param {string}            id   The swatch token or group id.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function setOptimisticDeletion(key, kind, id) {
	return { type: 'SET_OPTIMISTIC_DELETION', key, kind, id };
}

/**
 * Clear a pending optimistic deletion — the write's real response has landed (the row is genuinely
 * gone from the store now), or it failed and the swatch/group must return to normal.
 *
 * @param {string}            key  The palette listing key.
 * @param {'swatch'|'group'}  kind Which id list to remove from.
 * @param {string}            id   The swatch token or group id.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function clearOptimisticDeletion(key, kind, id) {
	return { type: 'CLEAR_OPTIMISTIC_DELETION', key, kind, id };
}

/**
 * Add a not-yet-confirmed swatch or group to the optimistic overlay, so it renders immediately
 * ahead of its write's response.
 *
 * @param {string}            key   The palette listing key.
 * @param {'swatch'|'group'}  kind  Which list to append to.
 * @param {Object}            entry A swatch (`{ groupId, token, label, $value }`) or a group
 *                                  (`{ id, label, swatches: [{ token, label, $value }] }`),
 *                                  matching `kind`. `$value`, not `value` — see
 *                                  `setOptimisticSwatchPatch`'s docblock for why.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function setOptimisticAddition(key, kind, entry) {
	return { type: 'SET_OPTIMISTIC_ADDITION', key, kind, entry };
}

/**
 * Clear a pending optimistic addition — the write's real response has landed (the store's real
 * listing now carries it), or it failed and the placeholder must be removed.
 *
 * @param {string}            key  The palette listing key.
 * @param {'swatch'|'group'}  kind Which list to remove from.
 * @param {string}            id   The swatch token or group id to remove.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function clearOptimisticAddition(key, kind, id) {
	return { type: 'CLEAR_OPTIMISTIC_ADDITION', key, kind, id };
}

/**
 * Patch a scale-type token's label and/or value in the optimistic overlay, ahead of its write's
 * response.
 *
 * @param {string} slug    Token library slug.
 * @param {string} tokenId The token's canonical dot-path id.
 * @param {Object} patch   `{ label?, value? }`.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function setOptimisticScalePatch(slug, tokenId, patch) {
	return { type: 'SET_OPTIMISTIC_SCALE_PATCH', slug, tokenId, patch };
}

/**
 * Clear a scale-type token's pending optimistic patch.
 *
 * @param {string} slug    Token library slug.
 * @param {string} tokenId The token's canonical dot-path id.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function clearOptimisticScalePatch(slug, tokenId) {
	return { type: 'CLEAR_OPTIMISTIC_SCALE_PATCH', slug, tokenId };
}

/**
 * Mark a scale-type token as pending deletion — stays visible, dimmed, until the write settles.
 *
 * @param {string} slug    Token library slug.
 * @param {string} tokenId The token's canonical dot-path id.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function setOptimisticScaleDeletion(slug, tokenId) {
	return { type: 'SET_OPTIMISTIC_SCALE_DELETION', slug, tokenId };
}

/**
 * Clear a scale-type token's pending optimistic deletion.
 *
 * @param {string} slug    Token library slug.
 * @param {string} tokenId The token's canonical dot-path id.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function clearOptimisticScaleDeletion(slug, tokenId) {
	return { type: 'CLEAR_OPTIMISTIC_SCALE_DELETION', slug, tokenId };
}

/**
 * Set whether a library has a write in flight — shared across every sibling `usePalettes` instance
 * so a write started in one instance is visible (and disables controls) in the other.
 *
 * @param {string}  key     The palette listing key (`paletteListingKey(namespace, slug)`).
 * @param {boolean} isBusy  Whether a write is currently in flight.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function setPaletteBusy(key, isBusy) {
	return { type: 'SET_PALETTE_BUSY', key, isBusy };
}

/**
 * Set whether a scale-type library has a write in flight — shared across every sibling
 * `useScaleScreen` instance so a write started in one instance is visible (and disables controls) in
 * the other.
 *
 * @param {string}  slug   Token library slug.
 * @param {boolean} isBusy Whether a write is currently in flight.
 *
 * @since TBD
 *
 * @return {Object} The action.
 */
export function setScaleBusy(slug, isBusy) {
	return { type: 'SET_SCALE_BUSY', slug, isBusy };
}
