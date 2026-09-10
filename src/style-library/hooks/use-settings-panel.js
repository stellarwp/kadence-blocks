/**
 * Settings-panel state bound to the route: the panel is open exactly when the `item` route arg is
 * non-empty. Holds the draft values and dirty flag; save/delete stay caller callbacks so the hook
 * is storage-agnostic — what Save writes differs per screen (token writes, palette writes, preset
 * writes), so this hook ends at the callback boundary.
 *
 * Readiness contract for `initialValues`: pass `null` (not a computed empty object) while the
 * caller's own data for the open item has not loaded yet, and the real values once it has. This
 * matters on a cold load / reload / pasted deep link, where `route.item` is already set at mount
 * while the caller (typically a `usePalettes`-shaped hook) is still fetching — `null` is the only
 * way the hook can tell "no data yet" apart from "the item resolved to genuinely empty values"
 * (e.g. `swatchInitialValues()` on a stale token, which returns `{label: '', value: ''}` — an
 * object with keys, not an absence).
 */

/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { isEqual, setValueAtPath } from '../helpers/settings-schema';

/**
 * Decide whether the draft should (re)seed from `initialValues` this render, and the seed-tracking
 * value to carry forward. Seeding has two independent triggers — the open item changing, and the
 * first arrival of real values for an item that was already open when the caller's data was still
 * loading — but only one one-shot guarantee applies: once the draft has actually been seeded for the
 * current item, no later `initialValues` identity change reseeds it, because every successful save
 * ends in `refreshFeed`, which changes that identity while the user may be mid-edit on a sibling
 * instance of this hook.
 *
 * That rule governs seeding driven by `initialValues` ARRIVING. It is not the only way the draft can be
 * replaced: `reseedDraft` seeds from a settled write, on a caller that knows one just happened, and
 * leaves the tracking value alone precisely so this guarantee still holds for a sibling panel.
 *
 * Pure so the seeding rule is testable without rendering a component — `useSettingsPanel` is a thin
 * `useEffect` wrapper around this.
 *
 * @param {string}  itemId        The open item id.
 * @param {?Object} initialValues The caller's initial values, or null while its data is still loading.
 * @param {?string} seededFor     The item id the draft was last actually seeded for, or null if never.
 *
 * @since TBD
 *
 * @return {{shouldSeed: boolean, nextSeededFor: ?string}} `shouldSeed` when the draft must be
 *          (re)seeded from `initialValues` this render; `nextSeededFor` the tracking value to store.
 */
export function resolveDraftSeed(itemId, initialValues, seededFor) {
	const hasValues = initialValues !== null && initialValues !== undefined;
	const alreadySeeded = seededFor === itemId;

	if (!hasValues || alreadySeeded) {
		return { shouldSeed: false, nextSeededFor: alreadySeeded ? seededFor : null };
	}

	return { shouldSeed: true, nextSeededFor: itemId };
}

/**
 * Whether the draft differs from the caller's persisted values. A named, exported wrapper (rather
 * than an inline expression in the hook) purely so the exact comparison `isDirty` uses is directly
 * testable without rendering a component — see this module's own test file for the scenario this
 * exists to prove: a draft holding a just-saved value converges to "not dirty" on its own once
 * `initialValues` catches up to it, with no reset step required.
 *
 * @param {Object}  draft         The panel's current draft values.
 * @param {?Object} initialValues The caller's persisted values, or null while still loading.
 *
 * @since TBD
 *
 * @return {boolean} True when `draft` differs from `initialValues`.
 */
export function computeIsDirty(draft, initialValues) {
	return !isEqual(draft, initialValues || {});
}

/**
 * The draft to hold after a write settles: what the server actually stored, unless the user has edited
 * since the request went out.
 *
 * A write is not a round trip. The server rewrites a captured literal into the semantic alias that
 * carries it, so what comes back is equivalent to what was sent without being equal to it — and the
 * panel's dirty flag is a deep equality test. Seeding from the response is what lets a saved panel go
 * clean; nothing else can, because the two values never converge on their own.
 *
 * A draft that moved while the request was in flight is kept untouched, and kept BY REFERENCE so React
 * bails out of the re-render. Merging the two would produce a draft matching neither the save nor the
 * user, and "the user typed during the save, so the panel is still dirty" is already the honest answer.
 *
 * @param {Object}  current   The draft as it stands now.
 * @param {Object}  submitted The draft the write was given.
 * @param {?Object} saved     What the server stored, or null when there was nothing to write.
 *
 * @since TBD
 *
 * @return {Object} The draft to hold.
 */
export function resolveSavedSeed(current, submitted, saved) {
	if (!saved || !isEqual(current, submitted)) {
		return current;
	}

	return saved;
}

/**
 * Read and drive the settings-panel state.
 *
 * @param {Object}   options               The options.
 * @param {Object}   options.route         The route from `useStyleLibraryRoute`.
 * @param {Function} options.navigate      The route navigator.
 * @param {?Object}  options.initialValues The persisted values for the open item, or null while
 *                                         the caller's data is still loading — see this module's
 *                                         docblock for the readiness contract.
 *
 * @since TBD
 *
 * @return {{itemId: string, isOpen: boolean, close: Function, draft: Object, setFieldValue: Function, isDirty: boolean, resetDraft: Function, reseedDraft: Function}}
 *         The panel state and controls. `reseedDraft(submitted, saved)` re-seeds from a settled write —
 *         see `resolveSavedSeed`.
 */
export function useSettingsPanel({ route, navigate, initialValues }) {
	const itemId = route.item;
	const [draft, setDraft] = useState(initialValues || {});
	const seededForRef = useRef(null);

	// See `resolveDraftSeed`'s docblock for the full rule. Depending on `initialValues` here (unlike
	// a plain itemId-only dependency) is what lets a cold-loaded item's data seed the draft once it
	// arrives; `resolveDraftSeed`'s one-shot-per-item tracking is what stops that same dependency
	// from clobbering an in-flight edit on every later identity change (e.g. a save's `refreshFeed`).
	useEffect(() => {
		const { shouldSeed, nextSeededFor } = resolveDraftSeed(itemId, initialValues, seededForRef.current);

		seededForRef.current = nextSeededFor;

		if (shouldSeed) {
			setDraft(initialValues || {});
		}
	}, [itemId, initialValues]);

	const close = () => navigate({ item: '' });
	const setFieldValue = (path, value) => setDraft((current) => setValueAtPath(current, path, value));
	const resetDraft = () => setDraft(initialValues || {});
	// Functional, so the equality check reads the live draft rather than the one this render closed
	// over — the whole point is to detect an edit made while the write was in flight. Deliberately does
	// not touch `seededForRef`: the one-shot seeding rule protects a SIBLING panel from a feed refresh,
	// and this reseed is a different thing, driven by a caller that knows a write just settled.
	const reseedDraft = (submitted, saved) => setDraft((current) => resolveSavedSeed(current, submitted, saved));
	const isDirty = computeIsDirty(draft, initialValues);

	return { itemId, isOpen: Boolean(itemId), close, draft, setFieldValue, isDirty, resetDraft, reseedDraft };
}
