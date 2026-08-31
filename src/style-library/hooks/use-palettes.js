/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { useRegistry, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { errorMessage } from '../helpers/library-flows';
import {
	applyOptimisticOverlay,
	customColorTokenId,
	isCustomColorToken,
	isUserCreatedPalette,
	newSwatchValue,
	nextCustomColorSlug,
	reorderGroupSwatches,
	resolveEditingPaletteId,
	validateNewGroupLabel,
} from '../helpers/palettes';
import { notifyError, notifySuccess } from '../helpers/notify';
import {
	activatePaletteFlow,
	addColorFlow,
	addGroupFlow,
	createPaletteFlow,
	deletePaletteFlow,
	removeGroupFlow,
	removeSwatchFlow,
	renameGroupFlow,
	renamePaletteFlow,
	reorderSwatchesFlow,
	revertSwatchFlow,
	saveSwatchEditsFlow,
} from '../helpers/palette-flows';
import { flattenSchemaTokens } from '../helpers/tokens';
import { STORE_NAME } from '../store';
import { EMPTY_LISTING, EMPTY_OPTIMISTIC_SWATCH_EDIT, paletteEditKey, paletteListingKey } from '../store/constants';

/**
 * Palette state for the Color Palette screen and its settings panel: the listing, the palette
 * being edited, and the write operations, all bound to the pure flows in `helpers/palette-flows`.
 *
 * Two ids, not one — mirroring `hooks/use-libraries.js`. `listing.currentId` (exposed as
 * `activeId`) is the palette the *site* renders with — `$current`, overlaid onto resolved color
 * values everywhere. `editingId` is the palette the *app* is showing. They start equal (there is
 * no persisted "last edited palette", so the first load shows whatever is active) and diverge the
 * moment a palette is opened for a different id. Keeping them apart is what makes browsing and
 * editing a palette safe: nothing a visitor sees changes until someone explicitly activates one.
 *
 * `editingId` is DERIVED from `route.scope` (via `resolveEditingPaletteId`), not owned as this
 * hook's own state — same reasoning `hooks/use-libraries.js` documents for `editingSlug`: a second
 * copy of it here could drift, and the screen and its settings panel are separate mounts of this
 * hook, so each holding its own copy previously meant a freshly-mounted panel had no way to learn
 * which palette the screen had already opened.
 *
 * `palette` is derived directly from `listing.palettes` (the listing selector's own reshape
 * already embeds each row's `groups` — see `helpers/palettes.js`'s `reshapePaletteRows`), not from
 * a second resolver call. There is only one resolver here, `getPaletteListing`, so this hook does
 * not need the two-hop "wait for the listing, then wait for the palette" loading logic a separate
 * per-palette read would require.
 *
 * `activeId` reads `listing.currentId` directly, with no optimistic override layer: every write
 * that can move `$current` (`activatePalette`, `removePalette`) dispatches the write's own
 * response into the store via `onReceive` in the SAME round trip that confirms it, so there is no
 * window where the UI would otherwise show stale data.
 *
 * Both the screen and its settings panel call this hook as sibling instances; they stay
 * consistent because the state that must agree between them is either server state (both read the
 * same `getPaletteListing(namespace, slug)` store entry, so a write from either instance updates
 * both the moment its `onReceive` dispatches) or route state (the URL's `scope`, read by every
 * instance the same way).
 *
 * @param {Object}   feed        The design-tokens admin feed (slug, version, rest descriptor).
 * @param {Function} refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Object}   route       The route from `useStyleLibraryRoute` — only `route.scope` is read.
 * @param {Function} navigate    The route navigator — `openPalette` writes `scope` through it.
 *
 * @since TBD
 *
 * @return {Object} `{ listing, activeId, editingId, isEditingActive, palette, isLoading, isBusy,
 *                  openError, activateError, createError, renameError, deleteError,
 *                  structureError,
 *                  clearOpenError, clearActivateError, clearCreateError, clearRenameError,
 *                  clearDeleteError, clearStructureError,
 *                  openPalette, activatePalette, createPalette, renamePalette, deletePalette,
 *                  saveSwatchEdits, removeSwatch, resetSwatch, isSwatchCustom, addColor,
 *                  addingGroupIds, addGroup, reorderSwatches, renameGroup, removeGroup }`.
 *                  `isSwatchCustom(token)` tells the caller whether a swatch should offer Delete
 *                  (a custom, user-created token) or Reset (a built-in token showing this palette's
 *                  own override) — `resetSwatch` is the Reset half, `removeSwatch` the Delete half.
 *                  `addingGroupIds` is an
 *                  `Array<string>` of group ids with an add-color currently in flight.
 */
export function usePalettes(feed, refreshFeed, route, navigate) {
	const [openError, setOpenError] = useState(null);
	const [activateError, setActivateError] = useState(null);
	const [createError, setCreateError] = useState(null);
	const [renameError, setRenameError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);
	const [structureError, setStructureError] = useState(null);
	const [addingGroupIds, setAddingGroupIds] = useState([]);

	const namespace = feed?.rest?.namespace;
	const slug = feed?.slug;
	const scope = route?.scope;
	const feedTokens = useMemo(() => flattenSchemaTokens(feed?.schema), [feed]);

	const registry = useRegistry();

	// Shared across every sibling instance of this hook (the screen and its settings panel), keyed
	// by the whole library rather than a single palette — a `feedVersion` conflict happens at the
	// whole-document level, so a write to any palette in this library must block a write to any
	// other palette in the same library from a sibling instance. Kept under the local variable name
	// `setIsBusy` so every existing `onBusy: setIsBusy` call site below keeps working unchanged.
	const isBusy = useSelect(
		(select) => (namespace && slug ? select(STORE_NAME).getPaletteBusy(namespace, slug) : false),
		[namespace, slug]
	);
	const setIsBusy = useCallback(
		(value) => {
			if (namespace && slug) {
				registry.dispatch(STORE_NAME).setPaletteBusy(paletteListingKey(namespace, slug), value);
			}
		},
		[registry, namespace, slug]
	);

	// Mirrors `isBusy` for `guardBusy` below to read without needing `isBusy` in every write
	// function's own `useCallback` deps — every write flips `isBusy` at both its start and its end,
	// so depending on it directly would give every OTHER write function a new identity on each of
	// those flips too, even for a write it has nothing to do with. A ref stays current regardless of
	// which render's closure reads it, so a write function created several renders ago still sees
	// the latest busy state at call time.
	const isBusyRef = useRef(isBusy);
	isBusyRef.current = isBusy;

	// Guards every write below against starting while a sibling instance's write (or this same
	// instance's) is already in flight. The shared `isBusy` flag exists to serialize palette writes
	// at the whole-library level (see the docblock above) — but until this guard, nothing actually
	// READ it before starting; every write function only ever SET it, for something else to read.
	// Not a substitute for a UI-level disabled control (several already exist, e.g.
	// `ColorPaletteSettings.js`'s `onSave`/`onDelete`) — those stay, as the first line of defense a
	// user actually sees; this is the one no UI surface can accidentally skip, and the one that
	// still holds even when a click reaches a control before its disabled state has re-rendered.
	function guardBusy() {
		if (isBusyRef.current) {
			return Promise.reject(
				new Error(__('Another change to this library is already in progress.', 'kadence-blocks'))
			);
		}

		return null;
	}

	const listing = useSelect(
		(select) => (namespace && slug ? select(STORE_NAME).getPaletteListing(namespace, slug) : EMPTY_LISTING),
		[namespace, slug]
	);

	// `hasFinishedListing` uses `hasFinishedResolution`, not `isResolving`: `@wordpress/data` schedules
	// a resolver's dispatch via a `setTimeout(fn, 0)`, so on the very first render for a given
	// `(namespace, slug)` tuple `isResolving` can still be `false` — the resolver hasn't been kicked
	// off yet — even though nothing has loaded. `hasFinishedResolution` stays `false` for that same
	// render, so `isLoading` below correctly starts `true` instead of flashing `false` for one frame.
	// It is then gated on `!listing.palettes.length`, so a re-render never shows a loading state once
	// a listing has already loaded once. This matters most for a library switch: swapping
	// `namespace`/`slug` starts a genuinely new resolution for that `(namespace, slug)` args tuple,
	// so `hasFinishedResolution` goes back to `false`. Without the `.length` check this would flash a
	// loading skeleton over the currently-displayed palettes on every switch, instead of only showing
	// it the very first time this library's listing has never resolved.
	const { hasFinishedListing, listingFailure } = useSelect(
		(select) => ({
			hasFinishedListing:
				!(namespace && slug) ||
				select(STORE_NAME).hasFinishedResolution('getPaletteListing', [namespace, slug]),
			listingFailure:
				namespace && slug
					? select(STORE_NAME).getResolutionError('getPaletteListing', [namespace, slug])
					: null,
		}),
		[namespace, slug]
	);
	const isLoading = !hasFinishedListing && !listing.palettes.length;

	// An error belongs to the library it came from. `ColorPaletteScreen` is the same element in the
	// same position across a library swap, so React reconciles rather than remounts it and this
	// state would otherwise survive onto a library it says nothing about. Declared above the effect
	// that sets it so that, on a swap that genuinely fails, the clear runs first and the new
	// library's own failure still lands.
	useEffect(() => {
		setOpenError(null);
	}, [namespace, slug]);

	// Mirrors `hooks/use-libraries.js`'s identical effect: a resolution failure for
	// `getPaletteListing` surfaces here the same way a failed write already does via its own
	// `onError: setOpenError`.
	useEffect(() => {
		if (listingFailure) {
			setOpenError({ message: errorMessage(listingFailure) });
		}
	}, [listingFailure]);

	// See this function's own docblock for why this is a derivation, not a second copy of state.
	const editingId = resolveEditingPaletteId(scope, listing);

	const overlay = useSelect(
		(select) =>
			namespace && slug
				? select(STORE_NAME).getOptimisticSwatchEdit(namespace, slug, editingId)
				: EMPTY_OPTIMISTIC_SWATCH_EDIT,
		[namespace, slug, editingId]
	);

	const editingRow = useMemo(
		() => listing.palettes.find((row) => row.id === editingId) ?? null,
		[listing.palettes, editingId]
	);

	const palette = useMemo(() => applyOptimisticOverlay(editingRow, overlay), [editingRow, overlay]);

	// The local reorder override — see `reorderSwatches` below. Cleared once the real data catches
	// up (the write's own `onReceive` lands and the STORE's row for this palette changes) — keyed
	// on `editingRow.groups`, the raw store data, not the overlay-applied `palette.groups`.
	// `applyOptimisticOverlay` returns a fresh `groups` array reference on every render where ANY
	// optimistic action is pending or was just cleared — a save, a delete, an add — not only a
	// reorder. Keying this effect off `palette.groups` would clear an in-flight reorder override
	// whenever an unrelated optimistic action starts or settles, snapping the drag back to its
	// pre-drag order until the reorder's own write eventually resolves.
	const [pendingGroups, setPendingGroups] = useState(null);

	useEffect(() => {
		setPendingGroups(null);
	}, [editingRow?.groups]);

	const displayedPalette = useMemo(
		() => (pendingGroups && palette ? { ...palette, groups: pendingGroups } : palette),
		[palette, pendingGroups]
	);

	// Every mint flow (add color, add group) needs a slug that collides with neither a baseline
	// nor an already-minted token, wherever that token currently lives — the feed's flattened list
	// covers baseline and previously-refreshed custom colors, and the edited palette's own swatch
	// tokens cover anything minted since the last refresh.
	const existingTokenIds = useMemo(() => {
		const swatchTokens = (palette?.groups ?? []).flatMap((group) =>
			(group.swatches ?? []).map((swatch) => swatch.token)
		);

		return [...feedTokens.map((token) => token.id), ...swatchTokens];
	}, [feedTokens, palette]);

	// Dispatches a write's own raw response (the flat embedded-array wire rows) straight into the
	// store under this library's listing key — reused by every write flow below instead of each
	// one reshaping its own response, so the store only ever gets this shape from one place (see
	// `helpers/palettes.js`'s `reshapePaletteRows` docblock).
	const onReceive = useCallback(
		(rows) => {
			if (namespace && slug) {
				registry.dispatch(STORE_NAME).receivePaletteListing(paletteListingKey(namespace, slug), rows);
			}
		},
		[registry, namespace, slug]
	);

	const clearOpenError = useCallback(() => setOpenError(null), []);
	const clearActivateError = useCallback(() => setActivateError(null), []);
	const clearCreateError = useCallback(() => setCreateError(null), []);
	const clearRenameError = useCallback(() => setRenameError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);
	const clearStructureError = useCallback(() => setStructureError(null), []);

	// Opening a palette is a pure navigation: write `id` into the route's `scope`. `editingId`
	// above re-derives from the already-loaded listing the moment the route changes — there is no
	// separate fetch, and therefore no failure path of its own; a stale `scope` (naming no known
	// palette) falls back to `$current` via `resolveEditingPaletteId` rather than erroring.
	//
	// Clears `item` as well as setting `scope`. A swatch token is valid on every palette (structure
	// lives on the default node), so the panel *could* stay open across a switch — but its values
	// would change underneath the user without them asking, which reads as the panel silently
	// editing something else. Switching palettes is a context switch, so the selection resets with
	// it. This is Color Palette's own call, not something `helpers/route.js` imposes on every
	// screen.
	const openPalette = useCallback(
		(id) => {
			setOpenError(null);
			navigate({ scope: id, item: '' });

			return Promise.resolve();
		},
		[navigate]
	);

	const activatePalette = useCallback(
		(id) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			setActivateError(null);
			return activatePaletteFlow({
				namespace,
				slug,
				id,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setActivateError,
			}).then((result) => {
				notifySuccess(__('Palette activated.', 'kadence-blocks'));
				return result;
			});
		},
		[namespace, slug, onReceive, refreshFeed]
	);

	const addPalette = useCallback(
		(label) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			setCreateError(null);
			return createPaletteFlow({
				namespace,
				slug,
				label,
				listing,
				onReceive,
				// Reuses `openPalette` directly rather than a create-specific variant — now that
				// opening is a plain navigation with nothing left to fail (see `openPalette`'s own
				// comment), there is no separate error/busy path left to route through `createError`
				// instead of `openError`.
				openPalette,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setCreateError,
			}).then((result) => {
				notifySuccess(__('Palette created.', 'kadence-blocks'));
				return result;
			});
		},
		[namespace, slug, listing, onReceive, refreshFeed, openPalette]
	);

	const renamePalette = useCallback(
		(id, label) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			setRenameError(null);
			return renamePaletteFlow({
				namespace,
				slug,
				id,
				label,
				listing,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setRenameError,
			}).then((result) => {
				notifySuccess(__('Palette renamed.', 'kadence-blocks'));
				return result;
			});
		},
		[namespace, slug, listing, onReceive, refreshFeed]
	);

	const removePalette = useCallback(
		(id, successorId) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			// Decides both halves of what this call means: only a user-created palette is removed and
			// can need a successor, while a baseline one is reset in place and stays in the listing.
			const isUserCreated = isUserCreatedPalette(listing, id);

			setDeleteError(null);
			return deletePaletteFlow({
				namespace,
				slug,
				id,
				currentId: listing.currentId,
				isUserCreated,
				successorId,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setDeleteError,
			}).then((result) => {
				notifySuccess(
					isUserCreated ? __('Palette deleted.', 'kadence-blocks') : __('Palette reset.', 'kadence-blocks')
				);
				return result;
			});
		},
		[namespace, slug, listing, onReceive, refreshFeed]
	);

	const saveSwatchEdits = useCallback(
		(token, draft, initial) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			if (namespace && slug) {
				const patch = {};
				if (draft.label !== initial.label) {
					patch.label = draft.label;
				}
				if (draft.value !== initial.value) {
					// `$value`, not `value` — must match the field name every real swatch object carries
					// (`palette.groups[].swatches[].$value`), or `applyOptimisticOverlay`'s merge would add a
					// stray `value` key instead of overwriting the one the grid actually renders.
					patch.$value = draft.value;
				}
				if (Object.keys(patch).length > 0) {
					registry
						.dispatch(STORE_NAME)
						.setOptimisticSwatchPatch(paletteEditKey(namespace, slug, editingId), token, patch);
				}
			}

			return saveSwatchEditsFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				editingId,
				token,
				draft,
				initial,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
			})
				.then(() => notifySuccess(__('Swatch saved.', 'kadence-blocks')))
				.finally(() => {
					if (namespace && slug) {
						registry
							.dispatch(STORE_NAME)
							.clearOptimisticSwatchPatch(paletteEditKey(namespace, slug, editingId), token);
					}
				});
		},
		[namespace, slug, listing.defaultId, editingId, onReceive, refreshFeed, registry]
	);

	const removeSwatch = useCallback(
		(token) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			// Trust the feed's own `userCreated` flag when the token has a feed entry (defense in
			// depth against a token id that merely looks custom-prefixed); fall back to the prefix
			// check for a token minted since the last feed refresh, which has no feed entry yet.
			const feedEntry = feedTokens.find((entry) => entry.id === token);
			const isUserCreated = feedEntry ? Boolean(feedEntry.userCreated) : isCustomColorToken(token);

			// Delete is deliberately more conservative than save/add: the swatch stays visible,
			// flagged `pendingDelete` (see `applyOptimisticOverlay`), dimmed and disabled by the
			// grid, until the write confirms it — never an instant vanish.
			if (namespace && slug) {
				registry
					.dispatch(STORE_NAME)
					.setOptimisticDeletion(paletteEditKey(namespace, slug, editingId), 'swatch', token);
			}

			return removeSwatchFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				token,
				isUserCreated,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
			})
				.then(() => notifySuccess(__('Swatch deleted.', 'kadence-blocks')))
				.finally(() => {
					if (namespace && slug) {
						registry
							.dispatch(STORE_NAME)
							.clearOptimisticDeletion(paletteEditKey(namespace, slug, editingId), 'swatch', token);
					}
				});
		},
		[namespace, slug, listing.defaultId, editingId, feedTokens, onReceive, refreshFeed, registry]
	);

	// Same feed-entry-first, prefix-fallback check `removeSwatch`/`removeGroup` each run inline —
	// exposed here too since `ColorPaletteSettings.js` needs it BEFORE calling either write, to pick
	// which destructive action applies to a given swatch (see `resetSwatch`'s docblock).
	const isSwatchCustom = useCallback(
		(token) => {
			const feedEntry = feedTokens.find((entry) => entry.id === token);
			return feedEntry ? Boolean(feedEntry.userCreated) : isCustomColorToken(token);
		},
		[feedTokens]
	);

	// Revert a NON-default palette's own override for a token back to inherited — the counterpart
	// to `removeSwatch`, for a swatch that is a delta on a built-in token rather than a user-created
	// one. Not optimistic: unlike a save (where the new value is already known) or a delete (where
	// "gone" is unambiguous), showing the reverted color instantly would mean guessing the inherited
	// value ahead of the response, so this only shows a busy state (`SettingsPanel`'s `isDeleting`,
	// relabeled "Resetting…" by the caller) until the write confirms.
	const resetSwatch = useCallback(
		(token) => {
			if (!namespace || !slug || editingId === listing.defaultId) {
				return Promise.reject(new Error('A swatch of the default palette cannot be reverted.'));
			}

			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			return revertSwatchFlow({
				namespace,
				slug,
				id: editingId,
				token,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
			}).then(() => notifySuccess(__('Swatch reset.', 'kadence-blocks')));
		},
		[namespace, slug, listing.defaultId, editingId, onReceive, refreshFeed]
	);

	const addColor = useCallback(
		(groupId, onOptimistic) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			const colorSlug = nextCustomColorSlug(existingTokenIds);
			const value = newSwatchValue(palette?.groups, groupId);
			const label = __('New Color', 'kadence-blocks');
			const token = customColorTokenId(colorSlug);

			setAddingGroupIds((ids) => [...ids, groupId]);

			if (namespace && slug) {
				// `$value`, not `value` — matches the field name every real swatch object carries; see
				// `setOptimisticSwatchPatch`'s docblock (Task 1) for why this matters.
				registry
					.dispatch(STORE_NAME)
					.setOptimisticAddition(paletteEditKey(namespace, slug, editingId), 'swatch', {
						groupId,
						token,
						label,
						$value: value,
					});
			}

			// Fired synchronously, once the optimistic swatch is already in the store — the token is
			// known up front (client-generated, not server-assigned), so the caller can open the new
			// swatch's settings panel immediately instead of waiting on the write. `palettes.isBusy`
			// is already true for the whole write below, so the panel opens already showing its
			// buttons disabled.
			onOptimistic?.(token);

			return addColorFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				colorSlug,
				value,
				label,
				feedVersion: feed?.version,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
			})
				.then((newToken) => {
					notifySuccess(__('Color added.', 'kadence-blocks'));
					return newToken;
				})
				.finally(() => {
					setAddingGroupIds((ids) => ids.filter((id) => id !== groupId));
					if (namespace && slug) {
						registry
							.dispatch(STORE_NAME)
							.clearOptimisticAddition(paletteEditKey(namespace, slug, editingId), 'swatch', token);
					}
				});
		},
		[
			namespace,
			slug,
			listing.defaultId,
			editingId,
			existingTokenIds,
			palette,
			feed?.version,
			onReceive,
			refreshFeed,
			registry,
		]
	);

	const addGroup = useCallback(
		(label, onOptimistic) => {
			const { groupId, error } = validateNewGroupLabel(label, palette);

			if (error) {
				return Promise.reject(new Error(error));
			}

			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			const colorSlug = nextCustomColorSlug(existingTokenIds);
			const value = newSwatchValue(palette?.groups, groupId);
			const swatchLabel = __('New Color', 'kadence-blocks');
			const token = customColorTokenId(colorSlug);

			if (namespace && slug) {
				// `$value`, not `value` — matches the field name every real swatch object carries; see
				// `setOptimisticSwatchPatch`'s docblock (Task 1) for why this matters.
				registry
					.dispatch(STORE_NAME)
					.setOptimisticAddition(paletteEditKey(namespace, slug, editingId), 'group', {
						id: groupId,
						label,
						swatches: [{ token, label: swatchLabel, $value: value }],
					});
			}

			// See `addColor`'s identical call for why this fires synchronously, before the write below.
			onOptimistic?.(token);

			return addGroupFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				label,
				colorSlug,
				value,
				swatchLabel,
				feedVersion: feed?.version,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
			})
				.then((newToken) => {
					notifySuccess(__('Color group added.', 'kadence-blocks'));
					return newToken;
				})
				.finally(() => {
					if (namespace && slug) {
						registry
							.dispatch(STORE_NAME)
							.clearOptimisticAddition(paletteEditKey(namespace, slug, editingId), 'group', groupId);
					}
				});
		},
		[
			namespace,
			slug,
			listing.defaultId,
			editingId,
			palette,
			existingTokenIds,
			feed?.version,
			onReceive,
			refreshFeed,
			registry,
		]
	);

	const reorderSwatches = useCallback(
		(groupId, orderedTokens) => {
			// A drag gesture isn't gated by a disabled button the way every other write's own trigger
			// is, so this guard is the one most likely to actually fire in practice — surfaced through
			// `structureError` rather than `guardBusy()`'s silent rejection, so dropping mid-write
			// still tells the user something, instead of the drop just silently reverting.
			if (isBusyRef.current) {
				const message = __('Another change to this library is already in progress.', 'kadence-blocks');
				setStructureError({ message });
				return Promise.reject(new Error(message));
			}

			setStructureError(null);

			if (palette) {
				// Applied immediately (optimistic), at drop time — a drop that snaps back behind a
				// spinner is worse UX than a rare rollback. Cleared automatically once `onReceive`'s
				// dispatch lands and `palette.groups` catches up (see the effect above).
				setPendingGroups(reorderGroupSwatches(palette.groups, groupId, orderedTokens));
			}

			return reorderSwatchesFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				orderedTokens,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => {
					// A failed write must not leave the optimistic edit stuck: drop the local
					// override so the display falls back to the last known-good `palette.groups`
					// from the store.
					setPendingGroups(null);
					setStructureError(err);
				},
			});
		},
		[namespace, slug, listing.defaultId, palette, onReceive, refreshFeed]
	);

	const renameGroup = useCallback(
		(groupId, label) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			setStructureError(null);
			return renameGroupFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				label,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setStructureError,
			}).then((result) => {
				notifySuccess(__('Color group renamed.', 'kadence-blocks'));
				return result;
			});
		},
		[namespace, slug, listing.defaultId, onReceive, refreshFeed]
	);

	const removeGroup = useCallback(
		(groupId) => {
			const busy = guardBusy();
			if (busy) {
				return busy;
			}

			const group = (palette?.groups ?? []).find((row) => row.id === groupId);
			const userCreatedTokens = (group?.swatches ?? [])
				.map((swatch) => swatch.token)
				.filter((token) => {
					const feedEntry = feedTokens.find((entry) => entry.id === token);
					return feedEntry ? Boolean(feedEntry.userCreated) : isCustomColorToken(token);
				});

			if (namespace && slug) {
				registry
					.dispatch(STORE_NAME)
					.setOptimisticDeletion(paletteEditKey(namespace, slug, editingId), 'group', groupId);
			}

			return removeGroupFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				userCreatedTokens,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: (err) => notifyError(err.message),
			})
				.then(() => notifySuccess(__('Color group deleted.', 'kadence-blocks')))
				.finally(() => {
					if (namespace && slug) {
						registry
							.dispatch(STORE_NAME)
							.clearOptimisticDeletion(paletteEditKey(namespace, slug, editingId), 'group', groupId);
					}
				});
		},
		[namespace, slug, listing.defaultId, editingId, palette, feedTokens, onReceive, refreshFeed, registry]
	);

	return {
		listing,
		activeId: listing.currentId,
		editingId,
		isEditingActive: editingId === listing.currentId,
		palette: displayedPalette,
		isLoading,
		isBusy,
		openError,
		activateError,
		createError,
		renameError,
		deleteError,
		structureError,
		clearOpenError,
		clearActivateError,
		clearCreateError,
		clearRenameError,
		clearDeleteError,
		clearStructureError,
		openPalette,
		activatePalette,
		createPalette: addPalette,
		renamePalette,
		deletePalette: removePalette,
		saveSwatchEdits,
		removeSwatch,
		resetSwatch,
		isSwatchCustom,
		addColor,
		addingGroupIds,
		addGroup,
		reorderSwatches,
		renameGroup,
		removeGroup,
	};
}
