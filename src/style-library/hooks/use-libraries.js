/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { useSelect, useRegistry } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { DEFAULT_LIBRARY_SLUG } from '../constants';
import { sortLibraries } from '../helpers/libraries';
import {
	activateLibraryFlow,
	createLibraryFlow,
	deleteLibraryFlow,
	errorMessage,
	openLibraryFlow,
	renameLibraryFlow,
} from '../helpers/library-flows';
import { STORE_NAME } from '../store';

/**
 * The library management surface for the Style Library header: the list, the two slugs, and the
 * open/activate/create/rename/delete operations against the design-tokens REST API.
 *
 * Two slugs, not one. `activeSlug` is the library the *site* renders with — every projector and
 * the front end follow it. `editingSlug` is the library the *app* is showing. They start equal
 * (the page-load feed is assembled for the active library) and diverge as soon as the user opens
 * a different library to work on. Keeping them apart is what makes browsing and editing a library
 * safe: nothing a visitor sees changes until someone explicitly activates one.
 *
 * `editingSlug` stays derived from the feed, because the feed is the thing that actually moved —
 * a second copy of it here could drift. `activeSlug` is real state, seeded from the initial feed
 * slug and updated from the server's own response whenever the pointer moves.
 *
 * This hook is a thin binding of React state onto the pure flows in `helpers/library-flows`,
 * which do the request orchestration and are what a test exercises directly. Every flow waits for
 * the server rather than flipping optimistically — an optimistic change that then errored would
 * leave the UI lying about which library it is showing, or worse, which one the site is using.
 * None of the flows reloads the page.
 *
 * Each flow gets its own error slot rather than sharing one — a failed open must never render
 * inside the delete modal, and a failed rename must never resurface under the library dropdown.
 * Each slot is cleared the instant its own flow starts again, so a stale error from a previous
 * attempt never lingers past a fresh try at the same action.
 *
 * @param {Object}   feed        The design-tokens admin feed (provides the library being edited).
 * @param {Function} refreshFeed Replaces the feed with a fresh REST read for a slug (from
 *                               `use-design-tokens-feed`), so opening a library re-renders every
 *                               consumer without a page reload.
 *
 * @since TBD
 *
 * @return {Object} The library list, the two slugs, the busy flag, the per-flow error slots and
 *                  the functions that clear them, and the five operations.
 */
export function useLibraries(feed, refreshFeed) {
	const [isBusy, setIsBusy] = useState(false);
	const [openError, setOpenError] = useState(null);
	const [activateError, setActivateError] = useState(null);
	const [createError, setCreateError] = useState(null);
	const [renameError, setRenameError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);
	const [isSwappingLibrary, setIsSwappingLibrary] = useState(false);

	// The feed always carries a slug, but the default library is the one every read falls back to, so
	// naming it here keeps a malformed feed from addressing REST paths with `undefined`.
	const editingSlug = feed?.slug || DEFAULT_LIBRARY_SLUG;

	// Seeded from the feed rather than fetched. The page-load feed is always assembled for the
	// active library (see Admin\Feed\Localizer), so on first paint the two are the same and a
	// separate request would only re-learn what the page already told us. Every later move of the
	// pointer goes through a flow that reports the server's resolved slug back here.
	const [activeSlug, setActiveSlug] = useState(editingSlug);

	const registry = useRegistry();
	const { libraryRows, isLoading, loadFailure } = useSelect(
		(select) => ({
			libraryRows: select(STORE_NAME).getLibraries(),
			isLoading: select(STORE_NAME).isResolving('getLibraries', []),
			loadFailure: select(STORE_NAME).getResolutionError('getLibraries', []),
		}),
		[]
	);
	const libraries = useMemo(() => sortLibraries(libraryRows ?? []), [libraryRows]);

	// The original hook's mount-effect `.catch()` wrote a failed list fetch into the SAME `openError`
	// slot `openLibrary` (below) also writes to — `LibrarySelector.js` renders one `openError` prop for
	// both cases. This effect preserves that: a resolution failure for `getLibraries` surfaces here the
	// same way a failed `openLibrary` call already does via its own `onError: setOpenError`.
	useEffect(() => {
		if (loadFailure) {
			setOpenError({ message: errorMessage(loadFailure) });
		}
	}, [loadFailure]);

	// The flows in `helpers/library-flows.js` call this after create/rename/delete to refresh the list —
	// unchanged from their point of view. Internally: `invalidateResolution` clears the "this selector
	// call is already resolved" flag the framework tracks per argument tuple, and `resolveSelect` then
	// re-runs the `getLibraries` resolver (rather than returning the now-invalidated cached result),
	// resolving once the fresh rows land in the store — every mounted `useLibraries` instance re-renders
	// from the same updated state automatically.
	const loadLibraries = useCallback(() => {
		registry.dispatch(STORE_NAME).invalidateResolution('getLibraries', []);
		return registry.resolveSelect(STORE_NAME).getLibraries();
	}, [registry]);

	const clearOpenError = useCallback(() => setOpenError(null), []);
	const clearActivateError = useCallback(() => setActivateError(null), []);
	const clearCreateError = useCallback(() => setCreateError(null), []);
	const clearRenameError = useCallback(() => setRenameError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);

	// Marks the operations that replace the feed, and therefore the content of every screen at
	// once, so the app can block itself rather than show a spinner next to one control. Distinct
	// from `isBusy`, which is also true for a rename or an activation — neither of those changes
	// anything on screen, and blanking the app for them would be theatre.
	const setSwapBusy = useCallback((busy) => {
		setIsBusy(busy);
		setIsSwappingLibrary(busy);
	}, []);

	// Shared by `openLibrary` (below) and by `addLibrary`'s post-create open — each call site
	// passes its own `onError` so an open that fails as part of create reports through
	// `createError`, never through `openError`, and its own `onBusy` so only the user-initiated
	// open blocks the app. Creation runs behind its own modal, which reports progress itself.
	const runOpen = useCallback(
		({ slug, onError, onBusy }) => openLibraryFlow({ slug, refreshFeed, onBusy, onError }),
		[refreshFeed]
	);

	const openLibrary = useCallback(
		(slug) => {
			setOpenError(null);
			return runOpen({ slug, onError: setOpenError, onBusy: setSwapBusy });
		},
		[runOpen, setSwapBusy]
	);

	const activateLibrary = useCallback((slug) => {
		setActivateError(null);
		return activateLibraryFlow({
			slug,
			onBusy: setIsBusy,
			onError: setActivateError,
			onActivated: setActiveSlug,
		});
	}, []);

	const addLibrary = useCallback(
		(title) => {
			setCreateError(null);
			return createLibraryFlow({
				title,
				libraries,
				openLibrary: (slug) => runOpen({ slug, onError: setCreateError, onBusy: setIsBusy }),
				loadLibraries,
				onBusy: setIsBusy,
				onError: setCreateError,
			});
		},
		[libraries, runOpen, loadLibraries]
	);

	const renameCurrentLibrary = useCallback(
		(slug, title) => {
			setRenameError(null);
			return renameLibraryFlow({
				slug,
				title,
				libraries,
				loadLibraries,
				onBusy: setIsBusy,
				onError: setRenameError,
			});
		},
		[libraries, loadLibraries]
	);

	const removeLibrary = useCallback(
		(slug, successorSlug) => {
			setDeleteError(null);
			return deleteLibraryFlow({
				slug,
				activeSlug,
				successorSlug,
				refreshFeed,
				loadLibraries,
				onBusy: setSwapBusy,
				onError: setDeleteError,
				onActiveChanged: setActiveSlug,
			});
		},
		[activeSlug, loadLibraries, refreshFeed, setSwapBusy]
	);

	return {
		libraries,
		activeSlug,
		editingSlug,
		isEditingActive: activeSlug === editingSlug,
		isLoading,
		isBusy,
		isSwappingLibrary,
		openError,
		activateError,
		createError,
		renameError,
		deleteError,
		clearOpenError,
		clearActivateError,
		clearCreateError,
		clearRenameError,
		clearDeleteError,
		openLibrary,
		activateLibrary,
		createLibrary: addLibrary,
		renameLibrary: renameCurrentLibrary,
		deleteLibrary: removeLibrary,
	};
}
