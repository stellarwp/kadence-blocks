/**
 * The state binding over the pure scale flows (`helpers/scale.js` / `helpers/scale-flows.js`) for
 * the shared scale-screen contract (Border Radius, Border Width, Spacing, Icon Sizes). No component
 * imports `api/client` directly — every write goes through this hook.
 *
 * Unlike `usePalettes` there is no secondary fetch, no `reload`, and no `isLoading` — the feed IS
 * the data source, already in hand at mount (the app gates render on `feed.isReady`), and every
 * write ends in `refreshFeed`, which re-renders every sibling instance (the screen body and its
 * settings panel are siblings under `AppShell`, each calling this hook independently) at once.
 *
 * Reordering is serialized through one in-flight promise chain so two rapid drops can never race
 * the feed refresh in between and manufacture a 409 against themselves — see `reorderTokens` below
 * for the mechanics.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useRegistry, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	applyOptimisticScaleOverlay,
	applyRowOrder,
	customScaleTokenId,
	nextScaleSlug,
	scaleInitialValues,
	scaleRows,
} from '../helpers/scale';
import {
	addScaleTokenFlow,
	deleteScaleTokenFlow,
	reorderScaleTokensFlow,
	saveScaleTokenFlow,
} from '../helpers/scale-flows';
import { isEqual } from '../helpers/settings-schema';
import { notifyError, notifySuccess } from '../helpers/notify';
import { STORE_NAME } from '../store';

/**
 * Bind a scale screen's config to live feed state and the four write flows.
 *
 * @param {Object}   config   The per-screen scale config (see `components/pages/BorderRadiusScreen.js`).
 * @param {Object}   library  The design-tokens feed hook's return value (`useDesignTokensFeed()`).
 * @param {Object}   route    The current route (`{ screen, item }`).
 * @param {Function} navigate The route navigator.
 *
 * @since TBD
 *
 * @return {{rows: Array<Object>, selectedId: string, selectToken: Function, isBusy: boolean, addError: ?Object, orderError: ?Object, clearAddError: Function, clearOrderError: Function, addToken: Function, saveToken: Function, deleteToken: Function, reorderTokens: Function, tokenById: Function, initialValuesFor: Function}}
 */
export function useScaleScreen(config, library, route, navigate) {
	const registry = useRegistry();
	const [addError, setAddError] = useState(null);
	const [orderError, setOrderError] = useState(null);
	const [pendingOrder, setPendingOrder] = useState(null);

	const feed = library.feed;
	const feedVersion = feed?.version;

	// Shared across every sibling instance of this hook (the screen body and its settings panel),
	// keyed by `slug` — mirroring `optimisticScaleEdits`'s own keying — so a write started in one
	// instance disables controls in the other too, instead of two writes racing the same document.
	// Kept under the local variable name `setIsBusy` so every existing `onBusy: setIsBusy` call site
	// below keeps working unchanged.
	const isBusy = useSelect((select) => select(STORE_NAME).getScaleBusy(library.slug), [library.slug]);
	const setIsBusy = useCallback(
		(value) => registry.dispatch(STORE_NAME).setScaleBusy(library.slug, value),
		[registry, library.slug]
	);

	const overlay = useSelect((select) => select(STORE_NAME).getOptimisticScaleEdit(library.slug), [library.slug]);

	// Mirrors the feed so the queued reorder continuation below always dereferences the live
	// version at execution time, never a value captured when the drop was enqueued — no re-render
	// separates two rapid drops, so a captured version would still be the first drop's stale one and
	// would manufacture the exact 409 the serialization exists to prevent.
	const feedVersionRef = useRef(feedVersion);
	feedVersionRef.current = feedVersion;

	// One in-flight reorder promise: each call chains onto the previous reorder's settled promise,
	// so a second drop's write waits for the first drop's flow (including its own refresh) before
	// reading the refreshed version. The count (not a boolean) reflects every drop still queued or
	// running, not just "one happens to be running right now" — the pendingOrder-clearing effect
	// below reads it to decide whether the chain is idle.
	const reorderChainRef = useRef(Promise.resolve());
	const reorderPendingCountRef = useRef(0);

	const baseRows = useMemo(() => scaleRows(feed?.schema, feed?.values, config.group), [feed, config.group]);

	// The local reorder override clears itself once the feed catches up — but only while the
	// reorder chain is idle, or the first drop's refresh would visually revert the second drop while
	// its write is still queued (see reorderTokens). A failed link clears it itself, inline, as part
	// of its own catch below.
	useEffect(() => {
		if (reorderPendingCountRef.current === 0) {
			setPendingOrder(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [feedVersion]);

	const rows = useMemo(() => {
		const overlaid = applyOptimisticScaleOverlay(baseRows, overlay);
		return pendingOrder ? applyRowOrder(overlaid, pendingOrder) : overlaid;
	}, [baseRows, overlay, pendingOrder]);

	const selectToken = useCallback((id) => navigate({ item: id }), [navigate]);

	const clearAddError = useCallback(() => setAddError(null), []);
	const clearOrderError = useCallback(() => setOrderError(null), []);

	// Reads `rows` (overlay-applied), not `baseRows` — a settings panel opened for a not-yet-
	// confirmed optimistic addition must find it here, or `ScaleSettings`'s stale-item self-heal
	// (`if (id && !token) navigate({ item: '' })`) would immediately close the panel that
	// `addToken`'s `onOptimistic` just opened.
	const tokenById = useCallback((id) => rows.find((row) => row.id === id) ?? null, [rows]);

	const initialValuesFor = useCallback(
		(id) => {
			// A pending optimistic addition's value lives only on the overlay entry — `feed.values`
			// has nothing under its id until the write confirms — so it is merged in here rather than
			// changing `scaleInitialValues`'s own contract (a plain resolved-values map).
			const pending = overlay.addedTokens.find((entry) => entry.id === id);
			const values = pending ? { ...feed?.values, [id]: pending.value } : feed?.values;

			return scaleInitialValues(tokenById(id), values, config.parseValue);
		},
		[tokenById, feed, overlay.addedTokens, config.parseValue]
	);

	const addToken = useCallback(
		(onOptimistic) => {
			setAddError(null);

			const terminalSlug = nextScaleSlug(
				library.tokens.map((token) => token.id),
				config.slugBase
			);
			const id = customScaleTokenId(config.tokenType, terminalSlug);

			registry.dispatch(STORE_NAME).setOptimisticScaleAddition(library.slug, {
				id,
				label: config.newTokenLabel,
				value: config.newTokenValue,
				userCreated: true,
			});

			// Fired synchronously, once the optimistic token is already in the store — the id is
			// known up front (client-generated, not server-assigned), so the caller can open the new
			// token's settings panel immediately instead of waiting on the write. `scale.isBusy` is
			// already true for the whole write below, so the panel opens already showing its buttons
			// disabled. See `usePalettes`'s `addColor` for the identical pattern.
			onOptimistic?.(id);

			return addScaleTokenFlow({
				groupKey: config.groupKey,
				tokenType: config.tokenType,
				terminalSlug,
				label: config.newTokenLabel,
				value: config.newTokenValue,
				slug: library.slug,
				feedVersion,
				refreshFeed: library.refreshFeed,
				onBusy: setIsBusy,
				onError: setAddError,
			})
				.then((result) => {
					notifySuccess(__('Token created.', 'kadence-blocks'));
					return result;
				})
				.finally(() => {
					registry.dispatch(STORE_NAME).clearOptimisticScaleAddition(library.slug, id);
				});
		},
		[config, library, feedVersion, registry]
	);

	const saveToken = useCallback(
		(id, draft, initial) => {
			const patch = {};
			if (draft.label !== initial.label) {
				patch.label = draft.label;
			}
			if (!isEqual(draft.value, initial.value)) {
				patch.value = draft.value;
			}

			if (Object.keys(patch).length === 0) {
				return Promise.resolve();
			}

			registry.dispatch(STORE_NAME).setOptimisticScalePatch(library.slug, id, patch);

			return saveScaleTokenFlow({
				slug: library.slug,
				namespace: feed?.rest?.namespace,
				tokenId: id,
				tokenType: config.tokenType,
				draft,
				initial,
				feedVersion,
				refreshFeed: library.refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
				buildLeaf: config.buildLeaf,
			})
				.then(() => notifySuccess(__('Token saved.', 'kadence-blocks')))
				.finally(() => registry.dispatch(STORE_NAME).clearOptimisticScalePatch(library.slug, id));
		},
		[library, feed, config, feedVersion, registry]
	);

	const deleteToken = useCallback(
		(id) => {
			registry.dispatch(STORE_NAME).setOptimisticScaleDeletion(library.slug, id);

			return deleteScaleTokenFlow({
				slug: library.slug,
				tokenId: id,
				feedVersion,
				refreshFeed: library.refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
			})
				.then(() => notifySuccess(__('Token deleted.', 'kadence-blocks')))
				.finally(() => registry.dispatch(STORE_NAME).clearOptimisticScaleDeletion(library.slug, id));
		},
		[library, feedVersion, registry]
	);

	const reorderTokens = useCallback(
		(orderedIds) => {
			// Applied immediately (optimistic), at drop time, before the write is even queued — a
			// second rapid drop must show its own order right away, not wait for the first drop's
			// network round trip.
			setPendingOrder(orderedIds);
			reorderPendingCountRef.current += 1;

			const run = () => {
				setOrderError(null);

				return reorderScaleTokensFlow({
					slug: library.slug,
					group: config.group,
					orderedIds,
					// Dereferenced here, inside the queued continuation — see the module docblock and the
					// `feedVersionRef` comment above for why this must never be a value captured earlier.
					feedVersion: feedVersionRef.current,
					refreshFeed: library.refreshFeed,
					onBusy: setIsBusy,
					onError: setOrderError,
				})
					.then(() => {
						notifySuccess(__('Token order saved.', 'kadence-blocks'));
					})
					.catch(() => {
						// Caught here, not re-thrown: every link in the chain must settle (resolve) so
						// `reorderChainRef` is never left permanently rejected — an uncaught rejection would
						// silently skip every later drop's handler for the rest of the session. The error
						// itself already reached `orderError` inside the flow above; snap the optimistic
						// order back to whatever the feed last confirmed.
						setPendingOrder(null);
					})
					.then(() => {
						reorderPendingCountRef.current -= 1;
					});
			};

			reorderChainRef.current = reorderChainRef.current.then(run);

			return reorderChainRef.current;
		},
		[library, config]
	);

	return {
		rows,
		selectedId: route.item,
		selectToken,
		isBusy,
		addError,
		orderError,
		clearAddError,
		clearOrderError,
		addToken,
		saveToken,
		deleteToken,
		reorderTokens,
		tokenById,
		initialValuesFor,
	};
}
