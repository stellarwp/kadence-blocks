/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchPalette, fetchPalettes } from '../api/client';
import { errorMessage } from '../helpers/library-flows';
import { isCustomColorToken, reorderGroupSwatches } from '../helpers/palettes';
import {
	activatePaletteFlow,
	addColorFlow,
	addGroupFlow,
	createPaletteFlow,
	deletePaletteFlow,
	openPaletteFlow,
	removeSwatchFlow,
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
 * moment `openPalette` is called for a different id. Keeping them apart is what makes browsing and
 * editing a palette safe: nothing a visitor sees changes until someone explicitly activates one.
 *
 * Both the screen and its settings panel call this hook as sibling instances; they stay
 * consistent because all shared state is server state — the hook re-reads the listing and the
 * edited view whenever the feed identity changes (`[feed.slug, feed.version]`), and every flow
 * ends with `refreshFeed`, which bumps that version for every instance at once.
 *
 * @param {Object}   feed        The design-tokens admin feed (slug, version, rest descriptor).
 * @param {Function} refreshFeed Replaces the feed with a fresh REST read for a slug.
 *
 * @since TBD
 *
 * @return {Object} `{ listing, activeId, editingId, isEditingActive, palette, isLoading, isBusy,
 *                  openError, activateError, createError, deleteError, saveError, structureError,
 *                  clearOpenError, clearActivateError, clearCreateError, clearDeleteError,
 *                  clearSaveError, clearStructureError,
 *                  openPalette, activatePalette, createPalette, deletePalette,
 *                  saveSwatchEdits, removeSwatch, addColor, addGroup, reorderSwatches }`.
 */
export function usePalettes(feed, refreshFeed) {
	const [listing, setListing] = useState({ defaultId: '', currentId: '', palettes: [] });
	const [editingId, setEditingId] = useState('');
	const [palette, setPalette] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isBusy, setIsBusy] = useState(false);
	const [openError, setOpenError] = useState(null);
	const [activateError, setActivateError] = useState(null);
	const [createError, setCreateError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);
	const [saveError, setSaveError] = useState(null);
	const [structureError, setStructureError] = useState(null);

	const namespace = feed?.rest?.namespace;
	const slug = feed?.slug;
	const feedTokens = useMemo(() => flattenSchemaTokens(feed?.schema), [feed]);

	// Read inside `reload` without making it depend on `editingId` — see the comment there. A
	// plain-assignment ref (no effect) is enough because it only ever needs the value as of the
	// most recent render, and `reload` always runs after render, never during it.
	const editingIdRef = useRef(editingId);
	editingIdRef.current = editingId;

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

	// Re-reads the listing, then the edited view — falling back to the server-resolved `$current`
	// when the palette last being edited is no longer in the list (deletePaletteFlow names no
	// successor of its own; this is where that fallback actually happens, the same way
	// `deleteLibraryFlow` defers to a fresh read of the active-library pointer). Every other write
	// flow's `reload` call is a no-op for this fallback (the edited palette never disappears from
	// underneath a structure or value write), so folding it in here — rather than only inside a
	// delete-specific path — costs nothing beyond a cheap array scan.
	const reload = useCallback(() => {
		return fetchPalettes(namespace, slug).then((response) => {
			const nextListing = {
				defaultId: response.$default,
				currentId: response.$current,
				palettes: response.palettes ?? [],
			};

			setListing(nextListing);

			const lastEditingId = editingIdRef.current;
			const nextEditingId = nextListing.palettes.some((row) => row.id === lastEditingId)
				? lastEditingId
				: nextListing.currentId;

			if (nextEditingId !== lastEditingId) {
				setEditingId(nextEditingId);
			}

			return fetchPalette(namespace, nextEditingId, slug).then((view) => {
				setPalette(view);
				return nextListing;
			});
		});
	}, [namespace, slug]);

	useEffect(() => {
		setIsLoading(true);
		reload()
			.catch((err) => setOpenError({ message: errorMessage(err) }))
			.finally(() => setIsLoading(false));
	}, [reload]);

	const clearOpenError = useCallback(() => setOpenError(null), []);
	const clearActivateError = useCallback(() => setActivateError(null), []);
	const clearCreateError = useCallback(() => setCreateError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);
	const clearSaveError = useCallback(() => setSaveError(null), []);
	const clearStructureError = useCallback(() => setStructureError(null), []);

	// Shared by `openPalette` (below) and by `addPalette`'s post-create open — each call site
	// passes its own `onError` so an open that fails as part of create reports through
	// `createError`, never through `openError`, and its own `onBusy` so only the user-initiated
	// open blocks the app. Creation runs behind its own modal, which reports progress itself.
	const runOpen = useCallback(
		({ id, onError, onBusy }) =>
			openPaletteFlow({
				namespace,
				slug,
				id,
				onOpened: (view) => {
					setEditingId(view.id);
					setPalette(view);
				},
				onBusy,
				onError,
			}),
		[namespace, slug]
	);

	const openPalette = useCallback(
		(id) => {
			setOpenError(null);
			return runOpen({ id, onError: setOpenError, onBusy: setIsBusy });
		},
		[runOpen]
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
				openPalette: (id) => runOpen({ id, onError: setCreateError, onBusy: setIsBusy }),
				onBusy: setIsBusy,
				onError: setCreateError,
			});
		},
		[namespace, slug, listing, runOpen]
	);

	const removePalette = useCallback(
		(id) => {
			setDeleteError(null);
			return deletePaletteFlow({
				namespace,
				slug,
				id,
				reload,
				refreshFeed,
				onBusy: setIsBusy,
				onError: setDeleteError,
			});
		},
		[namespace, slug, reload, refreshFeed]
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
		deleteError,
		saveError,
		structureError,
		clearOpenError,
		clearActivateError,
		clearCreateError,
		clearDeleteError,
		clearSaveError,
		clearStructureError,
		openPalette,
		activatePalette,
		createPalette: addPalette,
		deletePalette: removePalette,
		saveSwatchEdits,
		removeSwatch,
		addColor,
		addGroup,
		reorderSwatches,
	};
}
