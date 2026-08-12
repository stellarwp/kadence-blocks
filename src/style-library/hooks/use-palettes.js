/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchPalette, fetchPalettes } from '../api/client';
import { errorMessage } from '../helpers/library-flows';
import { isCustomColorToken, reorderGroupSwatches, resolveEditingPaletteId } from '../helpers/palettes';
import {
	activatePaletteFlow,
	addColorFlow,
	addGroupFlow,
	createPaletteFlow,
	deletePaletteFlow,
	removeSwatchFlow,
	renamePaletteFlow,
	reorderSwatchesFlow,
	saveSwatchEditsFlow,
} from '../helpers/palette-flows';
import { flattenSchemaTokens } from '../helpers/tokens';

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
 * hook's own state — mirroring the reasoning `hooks/use-libraries.js` already documents for why
 * `editingSlug` comes from the feed rather than a second local copy: "a second copy... could
 * drift." `use-libraries.js` can derive from the feed because opening a library refreshes it;
 * opening a palette deliberately does NOT (decision 5 — it is a pure read, so browsing a palette
 * never re-tints anything), so there is no feed signal to derive from, and the route is the
 * shared source instead. This is not a hypothetical: before this derivation existed, `editingId`
 * WAS a second local `useState` here, and it drifted for real — the screen and its settings panel
 * are separate mounts of this hook, so each held its own copy, and a freshly-mounted panel had no
 * way to learn which palette the screen had already opened; it silently defaulted to `$current`
 * instead, meaning a save from the panel could target the wrong palette. Deriving from the route
 * (shared browser state, not per-instance React state) is what makes it structurally impossible
 * for the two instances to disagree, rather than merely making it less likely.
 *
 * Both the screen and its settings panel call this hook as sibling instances; they stay
 * consistent because the state that must agree between them is either server state (the hook
 * re-reads the listing and the edited view whenever the feed identity changes — every write flow
 * ends with `refreshFeed`, which bumps `feed.version` for every instance at once) or route state
 * (the URL's `scope`, read by every instance the same way).
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
 *                  saveSwatchEdits, removeSwatch, addColor, addGroup, reorderSwatches }`.
 */
export function usePalettes(feed, refreshFeed, route, navigate) {
	const [listing, setListing] = useState({ defaultId: '', currentId: '', palettes: [], userCreated: [] });
	const [palette, setPalette] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
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

	// See this function's own docblock for why this is a derivation, not a second copy of state.
	const editingId = resolveEditingPaletteId(scope, listing);

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

	// Re-reads the listing, then the edited view — resolving `editingId` fresh from the LISTING
	// THIS CALL JUST FETCHED (not the `editingId` derived above from the outer render's `listing`
	// state), so a delete that removes the palette named by `scope` self-heals to `$current` on
	// the very next read, the same way `resolveEditingPaletteId` always would once `listing` state
	// catches up — this just avoids waiting an extra render for it.
	const reload = useCallback(() => {
		return fetchPalettes(namespace, slug).then((response) => {
			const nextListing = {
				defaultId: response.$default,
				currentId: response.$current,
				palettes: response.palettes ?? [],
				userCreated: response.userCreated ?? [],
			};

			setListing(nextListing);

			const nextEditingId = resolveEditingPaletteId(scope, nextListing);

			return fetchPalette(namespace, nextEditingId, slug).then((view) => {
				setPalette(view);
				return nextListing;
			});
		});
	}, [namespace, slug, scope]);

	useEffect(() => {
		setIsLoading(true);
		reload()
			.catch((err) => setOpenError({ message: errorMessage(err) }))
			.finally(() => setIsLoading(false));
	}, [reload]);

	// The other half of the cross-instance sync the module docblock above describes: a write on a
	// SIBLING `usePalettes` instance (e.g. the settings panel saving a swatch's color, or deleting
	// one) never changes THIS instance's own `namespace`/`slug`, so `reload`'s identity — and
	// therefore the mount effect above — never changes because of it either; without this, a
	// sibling's write would persist correctly but this instance's `palette` (and whatever renders
	// from it, e.g. the grid's swatch preview) would keep showing the pre-write value until this
	// instance happened to reload for an unrelated reason. `refreshFeed` bumps `feed.version` for
	// every instance at once specifically so this effect has something to react to. Silent — no
	// `isLoading` toggle — because a write elsewhere is not "this instance is loading" from its own
	// point of view; the mount effect above is the one spinner-bearing load. Skips the very first
	// render (the mount effect already covers the cold load) via the ref below, and tolerates one
	// harmless duplicate fetch on a genuine library switch (`reload`'s identity changing pulls this
	// effect's deps forward too) rather than adding a second layer of bookkeeping to suppress it.
	const feedVersion = feed?.version;
	const hasSyncedOnceRef = useRef(false);

	useEffect(() => {
		if (!hasSyncedOnceRef.current) {
			hasSyncedOnceRef.current = true;
			return;
		}

		reload().catch((err) => setOpenError({ message: errorMessage(err) }));
	}, [feedVersion, reload]);

	const clearOpenError = useCallback(() => setOpenError(null), []);
	const clearActivateError = useCallback(() => setActivateError(null), []);
	const clearCreateError = useCallback(() => setCreateError(null), []);
	const clearRenameError = useCallback(() => setRenameError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);
	const clearSaveError = useCallback(() => setSaveError(null), []);
	const clearStructureError = useCallback(() => setStructureError(null), []);

	// Opening a palette is now a pure navigation: write `id` into the route's `scope`, and let the
	// mount effect above pick it up (its `reload` depends on `scope`, so a scope change gives it a
	// new identity and the effect re-fires) — the same mechanism every sibling instance already
	// uses to converge on the listing and feed, applied to the one remaining piece of state that
	// used to be a per-instance copy (see this hook's own docblock). This is also what makes the
	// derivation in `helpers/palettes.js` the actual fix for the two-instance divergence: there is
	// no longer a second code path (a direct `setEditingId`) that could get out of step with it.
	//
	// `helpers/palette-flows.js`'s `openPaletteFlow` predates this and is intentionally unused here
	// now — it fetched and reported success/failure itself, which only made sense when opening had
	// to update this instance's own state directly. A stale `scope` (naming no known palette) no
	// longer needs its own error path either: `resolveEditingPaletteId` already falls back instead
	// of failing, and a genuine request failure surfaces through the reload effects' `openError`
	// like every other reload does. `id` is always drawn from the already-loaded listing (the
	// dropdown's own options, or a just-created palette's own id), so this realistically never
	// needs to reject; kept as a resolved Promise so existing `.then()` callers (e.g.
	// `createPaletteFlow`, which opens the palette it just created) keep working unchanged.
	//
	// Deliberately does NOT touch `item`: `navigate({ scope: id })` merges onto the current route,
	// so a swatch open in the panel stays open across a palette switch. That is intentional, not an
	// oversight — swatch tokens are shared across palettes (structure lives on the default node —
	// decision 1/4), so the open item stays valid, and clearing it on every switch would be a
	// regression a user has to re-select through. This is Color Palette's own call, not something
	// `helpers/route.js`/`useStyleLibraryRoute` should impose on every screen.
	const openPalette = useCallback(
		(id) => {
			setOpenError(null);
			navigate({ scope: id });

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
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setActivateError,
				onActivated: (activatedId) => setListing((prev) => ({ ...prev, currentId: activatedId })),
			});
		},
		[namespace, slug, reload, refreshFeed]
	);

	const addPalette = useCallback(
		(label) => {
			setCreateError(null);
			return createPaletteFlow({
				namespace,
				slug,
				label,
				listing,
				reload,
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
		[namespace, slug, listing, reload, refreshFeed, openPalette]
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
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setRenameError,
			});
		},
		[namespace, slug, listing, reload, refreshFeed]
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
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setDeleteError,
				onActivated: (activatedId) => setListing((prev) => ({ ...prev, currentId: activatedId })),
			});
		},
		[namespace, slug, listing.currentId, reload, refreshFeed]
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
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setSaveError,
			});
		},
		[namespace, slug, listing, editingId, reload, refreshFeed]
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
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setSaveError,
			});
		},
		[namespace, slug, listing, feedTokens, reload, refreshFeed]
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
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setStructureError,
			});
		},
		[namespace, slug, listing, existingTokenIds, palette, feed?.version, reload, refreshFeed]
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
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setStructureError,
			});
		},
		[namespace, slug, listing, palette, existingTokenIds, feed?.version, reload, refreshFeed]
	);

	const reorderSwatches = useCallback(
		(groupId, orderedTokens) => {
			setStructureError(null);

			// Applied locally at drop time — a drop that snaps back behind a spinner is worse UX than
			// a rare rollback. `reorderSwatchesFlow`'s `reload()` re-reads the effective view on both
			// success (a no-op visually) and failure (restores server order), so this optimistic step
			// never needs its own undo path.
			setPalette((current) =>
				current ? { ...current, groups: reorderGroupSwatches(current.groups, groupId, orderedTokens) } : current
			);

			return reorderSwatchesFlow({
				namespace,
				slug,
				defaultId: listing.defaultId,
				groupId,
				orderedTokens,
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setStructureError,
			});
		},
		[namespace, slug, listing, reload, refreshFeed]
	);

	return {
		listing,
		activeId: listing.currentId,
		editingId,
		isEditingActive: editingId === listing.currentId,
		palette,
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
	};
}
