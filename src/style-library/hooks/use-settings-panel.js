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
 * @return {{itemId: string, isOpen: boolean, close: Function, draft: Object, setFieldValue: Function, isDirty: boolean, resetDraft: Function}}
 *         The panel state and controls.
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
	const isDirty = computeIsDirty(draft, initialValues);

	return { itemId, isOpen: Boolean(itemId), close, draft, setFieldValue, isDirty, resetDraft };
}
