/**
 * The state binding a preset screen and its settings panel call as siblings (the `useScaleScreen`
 * role, applied to a fetched-not-localized payload): wraps `usePresets` and adds the four preset
 * write flows for whichever block the caller names.
 *
 * Create/save/delete carry no version parameter (`helpers/preset-flows.js`'s module docblock), so
 * only reorder needs the serialized-chain machinery — copied from `use-scale-screen.js`'s
 * `reorderTokens`. Reorder's version tracking is sourced from the shared feed (`library.version`),
 * not from `usePresets`'s own payload: every write anywhere in the library — scale, typography,
 * palettes, and presets itself — ends in `library.refreshFeed`, which always bumps `library.version`
 * to the server's current value, while the store's cached preset payload only catches up when this
 * screen's own wrapped `refreshFeed` (below) explicitly invalidates it. A reorder here that trusted
 * the payload's version instead would 409 the moment a write on any OTHER screen moved the server
 * past it. The chain carries the version each write returns until `library.version` catches up, so
 * two rapid drags cannot race the re-read into a spurious 409 against themselves.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { applyRowOrder } from '../helpers/scale';
import { createPresetFlow, deletePresetFlow, reorderPresetsFlow, savePresetFlow } from '../helpers/preset-flows';
import { presetInitialValues, presetStoredTokens } from '../helpers/presets';
import { usePresets } from './use-presets';
import { STORE_NAME } from '../store';

/**
 * Bind a preset screen to its block's fetched preset collection and the four write flows.
 *
 * @param {Object} library The design-tokens feed hook's return value (`useDesignTokensFeed()`).
 * @param {Object} preset  The screen's preset config: `block` (the block name whose presets this
 *                           screen edits), `properties` (its bound property surface, read lazily)
 *                           and `slugBase` (the stem new preset slugs are minted from).
 *
 * @since TBD
 *
 * @return {{payload: ?object, isLoading: boolean, loadError: ?Error, rows: Array<Object>, initialValuesFor: Function, isBusy: boolean, addError: ?Object, saveError: ?Object, deleteError: ?Object, orderError: ?Object, clearAddError: Function, clearSaveError: Function, clearDeleteError: Function, clearOrderError: Function, addPreset: Function, savePreset: Function, deletePreset: Function, reorderPresets: Function, isDeletable: Function}}
 */
export function usePresetScreen(library, preset) {
	// `properties` is deliberately not destructured here: on the preset configs it is a getter that
	// throws when the feed carries no bound surface for the block, and reading it at render scope
	// would fire on every render instead of only where the value is actually needed.
	const { block, slugBase, newLabel } = preset;
	const presets = usePresets(library, preset);

	const [isBusy, setIsBusy] = useState(false);
	const [addError, setAddError] = useState(null);
	const [saveError, setSaveError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);
	const [orderError, setOrderError] = useState(null);
	const [pendingOrder, setPendingOrder] = useState(null);

	const namespace = library?.rest?.namespace;
	const slug = library?.slug;
	const payloadVersion = presets.payload?.version;
	const feedVersion = library?.version;

	const registry = useRegistry();

	// Every write flow below still calls `refreshFeed(slug)` — this wraps that same call so a preset
	// write also re-resolves the store's `getBlockPresets` selector, instead of relying on a `version`
	// bump (no longer part of `usePresets`'s own logic) to trigger a re-read.
	const refreshFeed = useCallback(
		(targetSlug) => {
			const feedRefresh = library?.refreshFeed?.(targetSlug) ?? Promise.resolve();

			let storeRefresh = Promise.resolve();
			if (namespace && block && slug) {
				registry.dispatch(STORE_NAME).invalidateResolution('getBlockPresets', [namespace, block, slug]);
				storeRefresh = registry.resolveSelect(STORE_NAME).getBlockPresets(namespace, block, slug);
			}

			return Promise.all([feedRefresh, storeRefresh]);
		},
		// `library.refreshFeed`, not `library` — this only ever calls that one function off it, and
		// `library` is a fresh object literal every render (`useDesignTokensFeed()`'s own return
		// value), so depending on the whole object would rebuild this callback (and everything that
		// depends on its identity) on every render instead of only when the function itself changes.
		[library?.refreshFeed, registry, namespace, block, slug]
	);

	// `feedVersionSnapshotRef` mirrors `library.version` for reads inside the queued continuations
	// below, which are created once per `useCallback` identity and would otherwise close over the
	// version from the render that made them. `writtenVersionRef` holds the version the last reorder
	// write returned, until the feed's own version — bumped by every write everywhere in the
	// library, not just this screen's — catches up; a second drop queued behind the first would
	// otherwise dereference the pre-write version and 409 against itself. `feedVersionAtWriteRef` is
	// the feed version at the moment that override was recorded, so the retirement check below can
	// tell whether the feed has moved since. `feedVersionRef` mirrors the version the queued reorder
	// continuation below must send — see `use-scale-screen.js`'s identical comment for why, and the
	// module docblock for why this is sourced from `library.version`, not the store's cached preset
	// payload.
	const feedVersionSnapshotRef = useRef(feedVersion);
	const writtenVersionRef = useRef(null);
	const feedVersionAtWriteRef = useRef(feedVersion);
	const feedVersionRef = useRef(feedVersion);

	// Synchronized from a layout effect, not the render body: React can replay or discard a render
	// before it commits, and a ref write inside the render body itself would leak a value from a
	// render that never actually happened. A layout effect still runs before the browser paints and
	// before any user-triggered event handler (e.g. a drop that calls `reorderPresets`), so nothing
	// that reads these refs can ever observe a value from a discarded render.
	useLayoutEffect(() => {
		feedVersionSnapshotRef.current = feedVersion;

		// The override is retired as soon as the feed version moves off it at all, rather than only
		// on an exact match with what the write returned: a refresh that carries a newer version —
		// someone else's write, or a response this screen never saw — supersedes the override, and
		// holding on to it would keep sending a version the server has already replaced.
		if (writtenVersionRef.current !== null && feedVersion !== feedVersionAtWriteRef.current) {
			writtenVersionRef.current = null;
		}

		feedVersionRef.current = writtenVersionRef.current ?? feedVersion;
	}, [feedVersion]);

	// One in-flight reorder promise, the `use-scale-screen.js` shape: each call chains onto the
	// previous reorder's settled promise so a second drop's write waits for the first drop's flow
	// (including its own refresh) before reading the refreshed version.
	const reorderChainRef = useRef(Promise.resolve());
	const reorderPendingCountRef = useRef(0);

	// The local reorder override clears itself once the fetched payload catches up — but only
	// while the reorder chain is idle, or the first drop's refresh would visually revert the
	// second drop while its write is still queued. A failed link clears it itself, inline, in its
	// own catch below.
	useEffect(() => {
		if (reorderPendingCountRef.current === 0) {
			setPendingOrder(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [payloadVersion]);

	const rows = useMemo(
		() => (pendingOrder ? applyRowOrder(presets.rows, pendingOrder) : presets.rows),
		[presets.rows, pendingOrder]
	);

	const clearAddError = useCallback(() => setAddError(null), []);
	const clearSaveError = useCallback(() => setSaveError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);
	const clearOrderError = useCallback(() => setOrderError(null), []);

	const addPreset = useCallback(() => {
		setAddError(null);

		const existingSlugs = Object.keys(presets.payload?.presets ?? {});
		const defaultTokens =
			presetInitialValues(presets.payload, presets.payload?.default, preset.properties)?.tokens ?? {};

		return createPresetFlow({
			namespace,
			block,
			slugBase,
			existingSlugs,
			defaultTokens,
			newLabel,
			slug,
			refreshFeed,
			onBusy: setIsBusy,
			onError: setAddError,
		});
	}, [namespace, block, slugBase, newLabel, preset, presets.payload, slug, refreshFeed]);

	const savePreset = useCallback(
		(id, draft, initialValues) => {
			setSaveError(null);

			return savePresetFlow({
				namespace,
				block,
				preset: id,
				draft,
				initialValues,
				storedTokens: presetStoredTokens(presets.payload, id),
				slug,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setSaveError,
			});
		},
		[namespace, block, presets.payload, slug, refreshFeed]
	);

	const deletePreset = useCallback(
		(id) => {
			setDeleteError(null);

			return deletePresetFlow({
				namespace,
				block,
				preset: id,
				slug,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setDeleteError,
			});
		},
		[namespace, block, presets.payload, slug, refreshFeed]
	);

	const isDeletable = useCallback(
		(id) => presets.rows.find((row) => row.id === id)?.userCreated ?? false,
		[presets.rows]
	);

	const reorderPresets = useCallback(
		(orderedIds) => {
			// Applied immediately (optimistic), at drop time, before the write is even queued — see
			// `use-scale-screen.js`'s identical comment.
			setPendingOrder(orderedIds);
			reorderPendingCountRef.current += 1;

			const run = () => {
				setOrderError(null);

				return reorderPresetsFlow({
					namespace,
					block,
					orderedIds,
					// Dereferenced here, inside the queued continuation — never a value captured earlier.
					feedVersion: feedVersionRef.current,
					slug,
					refreshFeed,
					onBusy: setIsBusy,
					onError: setOrderError,
					// Assigned outside a render on purpose: the next queued link may run before React
					// commits one, and it reads `feedVersionRef` directly.
					onVersion: (version) => {
						writtenVersionRef.current = version;
						feedVersionAtWriteRef.current = feedVersionSnapshotRef.current;
						feedVersionRef.current = version;
					},
				})
					.catch(() => {
						// Caught here, not re-thrown — every link must settle so the chain is never left
						// permanently rejected. Snap the optimistic order back to the last confirmed one.
						setPendingOrder(null);

						// A failed write returned no version, so the override is meaningless now, and a
						// drop already queued behind this one would otherwise resend it and fail the same
						// way. Fall back to the feed's own version and re-read it, so the next link in the
						// chain carries whatever the server actually holds.
						writtenVersionRef.current = null;
						feedVersionRef.current = feedVersionSnapshotRef.current;

						return refreshFeed ? refreshFeed(slug).catch(() => {}) : undefined;
					})
					.then(() => {
						reorderPendingCountRef.current -= 1;
					});
			};

			reorderChainRef.current = reorderChainRef.current.then(run);

			return reorderChainRef.current;
		},
		[namespace, block, slug, refreshFeed]
	);

	return {
		payload: presets.payload,
		isLoading: presets.isLoading,
		loadError: presets.loadError,
		rows,
		initialValuesFor: presets.initialValuesFor,
		isBusy,
		addError,
		saveError,
		deleteError,
		orderError,
		clearAddError,
		clearSaveError,
		clearDeleteError,
		clearOrderError,
		addPreset,
		savePreset,
		deletePreset,
		reorderPresets,
		isDeletable,
	};
}
