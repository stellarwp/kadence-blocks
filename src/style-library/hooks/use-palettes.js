/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { useRegistry, useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { errorMessage } from '../helpers/library-flows';
import { isCustomColorToken, reorderGroupSwatches, resolveEditingPaletteId } from '../helpers/palettes';
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
	saveSwatchEditsFlow,
} from '../helpers/palette-flows';
import { flattenSchemaTokens } from '../helpers/tokens';
import { STORE_NAME } from '../store';
import { EMPTY_LISTING, paletteListingKey } from '../store/constants';

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
 *                  openError, activateError, createError, renameError, deleteError, saveError,
 *                  structureError,
 *                  clearOpenError, clearActivateError, clearCreateError, clearRenameError,
 *                  clearDeleteError, clearSaveError, clearStructureError,
 *                  openPalette, activatePalette, createPalette, renamePalette, deletePalette,
 *                  saveSwatchEdits, removeSwatch, addColor, addGroup, reorderSwatches,
 *                  renameGroup, removeGroup }`.
 */
export function usePalettes(feed, refreshFeed, route, navigate) {
	const [isBusy, setIsBusy] = useState(false);
	const [openError, setOpenError] = useState(null);
	const [activateError, setActivateError] = useState(null);
	const [createError, setCreateError] = useState(null);
	const [renameError, setRenameError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);
	const [saveError, setSaveError] = useState(null);
	const [structureError, setStructureError] = useState(null);

	const namespace = feed?.rest?.namespace;
	const slug = feed?.slug;
	const scope = route?.scope;
	const feedTokens = useMemo(() => flattenSchemaTokens(feed?.schema), [feed]);

	const registry = useRegistry();

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

	const palette = useMemo(
		() => listing.palettes.find((row) => row.id === editingId) ?? null,
		[listing.palettes, editingId]
	);

	// The local reorder override — see `reorderSwatches` below. Cleared once the real data catches
	// up (the write's own `onReceive` lands and `palette.groups` changes), mirroring
	// `hooks/use-scale-screen.js`'s identical `pendingOrder`-clearing effect.
	const [pendingGroups, setPendingGroups] = useState(null);

	useEffect(() => {
		setPendingGroups(null);
	}, [palette?.groups]);

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
	const clearSaveError = useCallback(() => setSaveError(null), []);
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
			setActivateError(null);
			return activatePaletteFlow({
				namespace,
				slug,
				id,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setActivateError,
			});
		},
		[namespace, slug, onReceive, refreshFeed]
	);

	const addPalette = useCallback(
		(label) => {
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
			});
		},
		[namespace, slug, listing, onReceive, refreshFeed, openPalette]
	);

	const renamePalette = useCallback(
		(id, label) => {
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
			});
		},
		[namespace, slug, listing, onReceive, refreshFeed]
	);

	const removePalette = useCallback(
		(id, successorId) => {
			setDeleteError(null);
			return deletePaletteFlow({
				namespace,
				slug,
				id,
				currentId: listing.currentId,
				successorId,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setDeleteError,
			});
		},
		[namespace, slug, listing.currentId, onReceive, refreshFeed]
	);

	const saveSwatchEdits = useCallback(
		(token, draft, initial) => {
			setSaveError(null);
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
				onError: setSaveError,
			});
		},
		[namespace, slug, listing.defaultId, editingId, onReceive, refreshFeed]
	);

	const removeSwatch = useCallback(
		(token) => {
			setSaveError(null);

			// Trust the feed's own `userCreated` flag when the token has a feed entry (defense in
			// depth against a token id that merely looks custom-prefixed); fall back to the prefix
			// check for a token minted since the last feed refresh, which has no feed entry yet.
			const feedEntry = feedTokens.find((entry) => entry.id === token);
			const isUserCreated = feedEntry ? Boolean(feedEntry.userCreated) : isCustomColorToken(token);

			return removeSwatchFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				token,
				isUserCreated,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setSaveError,
			});
		},
		[namespace, slug, listing.defaultId, feedTokens, onReceive, refreshFeed]
	);

	const addColor = useCallback(
		(groupId) => {
			setStructureError(null);
			return addColorFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				tokens: existingTokenIds,
				palette,
				feedVersion: feed?.version,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setStructureError,
			});
		},
		[namespace, slug, listing.defaultId, existingTokenIds, palette, feed?.version, onReceive, refreshFeed]
	);

	const addGroup = useCallback(
		(label) => {
			setStructureError(null);
			return addGroupFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				label,
				palette,
				tokens: existingTokenIds,
				feedVersion: feed?.version,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setStructureError,
			});
		},
		[namespace, slug, listing.defaultId, palette, existingTokenIds, feed?.version, onReceive, refreshFeed]
	);

	const reorderSwatches = useCallback(
		(groupId, orderedTokens) => {
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
			});
		},
		[namespace, slug, listing.defaultId, onReceive, refreshFeed]
	);

	const removeGroup = useCallback(
		(groupId) => {
			setStructureError(null);

			// Same defense-in-depth as `removeSwatch`: trust the feed's own `userCreated` flag when
			// the token has a feed entry, fall back to the prefix check for a token minted since the
			// last feed refresh.
			const group = (palette?.groups ?? []).find((row) => row.id === groupId);
			const userCreatedTokens = (group?.swatches ?? [])
				.map((swatch) => swatch.token)
				.filter((token) => {
					const feedEntry = feedTokens.find((entry) => entry.id === token);
					return feedEntry ? Boolean(feedEntry.userCreated) : isCustomColorToken(token);
				});

			return removeGroupFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				userCreatedTokens,
				onReceive,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setStructureError,
			});
		},
		[namespace, slug, listing.defaultId, palette, feedTokens, onReceive, refreshFeed]
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
		saveError,
		structureError,
		clearOpenError,
		clearActivateError,
		clearCreateError,
		clearRenameError,
		clearDeleteError,
		clearSaveError,
		clearStructureError,
		openPalette,
		activatePalette,
		createPalette: addPalette,
		renamePalette,
		deletePalette: removePalette,
		saveSwatchEdits,
		removeSwatch,
		addColor,
		addGroup,
		reorderSwatches,
		renameGroup,
		removeGroup,
	};
}
