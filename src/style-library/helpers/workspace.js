/**
 * The workspace reset: return the app to a clean, item-less view of whatever library it has
 * landed on. Called by the library flows that replace the feed under a mounted settings panel —
 * deleting a library, and switching to a different one.
 *
 * A function taking its collaborators as arguments rather than a hook, for the reason
 * `helpers/library-flows.js` gives for the same shape: it can then be exercised directly in a
 * test without rendering the app.
 */

/**
 * Drop everything the app is holding about the item that was open.
 *
 * The route rewrite is what actually discards the draft. The settings panel is mounted only while
 * `route.item` is non-empty, so emptying it unmounts the panel and the draft dies with it — the
 * panel itself cannot be told to reseed, because its one-shot seeding rule deliberately ignores
 * later value changes so a save's feed refresh never clobbers a sibling panel's in-flight edit.
 *
 * `scope` goes with `item`: it is the screen's own sub-selection (a palette id on the Color
 * Palette screen) and it belongs to the library that just changed. `screen` is left alone — every
 * screen id exists in every library, so there is no reason to move the user off the one they were
 * reading.
 *
 * `replace`, never `navigate`: a route the user is being moved off must not enter browser history,
 * or Back walks straight into the item that no longer exists.
 *
 * @param {Object}    args
 * @param {?Function} args.clearPublication Drops the draft channel's publication, pending guard
 *                                          action and guard error. Null when no channel is
 *                                          mounted (a component rendered in isolation).
 * @param {Function}  args.replace          Rewrites the route without a history entry.
 *
 * @since TBD
 *
 * @return {void}
 */
export function resetWorkspace({ clearPublication, replace }) {
	// Before the route rewrite, not after: the unmounting panel's own effect cleanup also clears
	// the channel, and doing it here first means the guard is already empty no matter which order
	// React settles those effects in.
	if (clearPublication) {
		clearPublication();
	}

	replace({ scope: '', item: '' });
}
