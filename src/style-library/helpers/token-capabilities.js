/**
 * Pure capability checks over a feed token entry: whether it is baseline (shipped), deletable, or
 * renameable. The one module in the shared content primitives that knows the feed's token shape —
 * every component stays agnostic and only ever sees the resulting booleans. Not yet imported by any
 * screen; consumed by `ListRow`/`SwatchCard` callers gating the delete affordance in the settings
 * panel.
 *
 * The server refuses baseline deletion regardless of what the UI shows; these helpers are
 * defense-in-depth driving the affordances, and they **fail closed**: a missing `userCreated` flag
 * means baseline, never user-created.
 */

/**
 * Whether a feed token is a baseline (shipped) token. A missing `userCreated` flag counts as
 * baseline — the fail-closed default.
 *
 * @param {Object} token The token entry from `feed.schema.groups`.
 *
 * @since TBD
 *
 * @return {boolean} True for a baseline token.
 */
export function isBaselineToken(token) {
	return !(token && token.userCreated === true);
}

/**
 * Whether a feed token may be deleted: user-created only, never baseline.
 *
 * @param {Object} token The token entry from `feed.schema.groups`.
 *
 * @since TBD
 *
 * @return {boolean} True when deletable.
 */
export function isDeletable(token) {
	return !isBaselineToken(token);
}

/**
 * Whether a feed token may be renamed. Everything is renameable — but a rename only ever edits
 * the display label; the token id is immutable and no UI path changes it.
 *
 * @param {Object} token The token entry from `feed.schema.groups`.
 *
 * @since TBD
 *
 * @return {boolean} True when renameable (always, for a token entry).
 */
export function isRenameable(token) {
	return Boolean(token);
}
