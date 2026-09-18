/**
 * The draft channel: the one sanctioned exception to the screen/settings-panel siblings-only rule.
 * A screen and its settings panel are
 * mounted as siblings under `AppShell`, each running its own data-hook instance, sharing state
 * only through the feed and the route — the feed only changes on Save. That leaves the open
 * panel's in-flight draft with no path to the row it edits, so `StyleLibraryApp` (the one
 * component that already renders both slots) provides this channel: the panel publishes its draft,
 * the screen reads it back strictly keyed to the open item, and the app drives an unsaved-changes
 * guard over both.
 *
 * The channel is ephemeral and never a second source of truth: it is written only by the mounted
 * settings panel, cleared by that panel's own effect cleanup (unmount or item change), and read by
 * a screen only when the publication's `itemId` matches the open route item. Nothing from it is
 * ever written back into the feed, the route, or storage.
 */

/**
 * WordPress dependencies
 */
import { createContext, useCallback, useContext, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * The draft-channel context. Default value `null` — a consumer with no provider mounted (e.g. a
 * component rendered in isolation, such as the dev gallery) treats a `null` channel as "no channel"
 * and falls back to its pre-channel behavior.
 *
 * @since TBD
 */
export const DraftChannelContext = createContext(null);

/**
 * Build the draft-channel value. Called once, by `StyleLibraryApp`, which passes the result to
 * `DraftChannelContext.Provider` and also reads it directly — a component cannot consume the very
 * context it provides.
 *
 * @since TBD
 *
 * @return {{publication: ?Object, publish: Function, clearPublication: Function, actionsRef: Object, guard: Function, isGuardOpen: boolean, isGuardBusy: boolean, guardError: ?Object, confirmSave: Function, confirmDiscard: Function, cancelGuard: Function}}
 *         The channel value.
 */
export function useDraftChannelState() {
	const [publication, setPublication] = useState(null);
	const [pendingAction, setPendingAction] = useState(null);
	const [isGuardBusy, setIsGuardBusy] = useState(false);
	const [guardError, setGuardError] = useState(null);

	// Mirrors `publication` so `guard()` below can stay a stable callback (no `publication` in its
	// deps) while still reading the *current* dirty bit at call time — the same ref-mirror pattern
	// `use-scale-screen.js` uses for `feedVersionRef`, needed here for the same reason: a memoized
	// caller built before the last keystroke must not see a stale clean/dirty bit.
	const publicationRef = useRef(publication);
	publicationRef.current = publication;

	// The registered save/discard actions. A ref, reassigned every render by the publishing panel
	// (never `useState`): the callbacks close over the panel's current draft, so storing them in
	// state would either loop the publish effect (a new function identity every render) or hand the
	// modal a stale draft frozen at whatever render first stored it.
	const actionsRef = useRef(null);

	const publish = useCallback((next) => setPublication(next), []);

	const clearPublication = useCallback(() => {
		setPublication(null);
		// A panel that unmounts out-of-band (the stale-item self-heal, a cross-tab delete) must not
		// leave an orphaned modal pointing at actions that no longer exist.
		setPendingAction(null);
		setGuardError(null);
	}, []);

	const guard = useCallback((fn) => {
		const current = publicationRef.current;

		if (!current || !current.isDirty) {
			fn();

			return;
		}

		// The updater form, so React never mistakes `fn` for a lazy state initializer.
		setPendingAction(() => fn);
	}, []);

	const cancelGuard = useCallback(() => {
		setPendingAction(null);
		setGuardError(null);
	}, []);

	const confirmSave = useCallback(() => {
		const actions = actionsRef.current;
		const fn = pendingAction;

		if (!actions || !fn) {
			return;
		}

		setIsGuardBusy(true);
		setGuardError(null);

		return actions
			.save()
			.then(() => {
				setIsGuardBusy(false);
				setPendingAction(null);
				fn();
			})
			.catch((error) => {
				// Kept open, not cleared: the pending action stays parked so the user can retry Save
				// or fall back to Discard without re-triggering whatever navigation asked for the
				// guard in the first place.
				setIsGuardBusy(false);
				setGuardError({ message: error?.message || __('Saving failed.', 'kadence-blocks') });
			});
	}, [pendingAction]);

	const confirmDiscard = useCallback(() => {
		const actions = actionsRef.current;
		const fn = pendingAction;

		if (!actions || !fn) {
			return;
		}

		actions.discard();
		setPendingAction(null);
		setGuardError(null);
		fn();
	}, [pendingAction]);

	return {
		publication,
		publish,
		clearPublication,
		actionsRef,
		guard,
		isGuardOpen: Boolean(pendingAction),
		isGuardBusy,
		guardError,
		confirmSave,
		confirmDiscard,
		cancelGuard,
	};
}

/**
 * The consumer hook: `ScaleScreen` reads `publication` and calls `guard()`; `ScaleSettings`
 * additionally publishes and registers `actionsRef.current`. Returns `null` when no
 * `DraftChannelContext.Provider` is mounted.
 *
 * @since TBD
 *
 * @return {?Object} The channel value, or `null` outside a provider.
 */
export function useDraftChannel() {
	return useContext(DraftChannelContext);
}
