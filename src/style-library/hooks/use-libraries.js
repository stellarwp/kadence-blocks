/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchLibraries } from '../api/client';
import { sortLibraries } from '../helpers/libraries';
import {
	activateLibraryFlow,
	createLibraryFlow,
	deleteLibraryFlow,
	errorMessage,
	openLibraryFlow,
	renameLibraryFlow,
} from '../helpers/library-flows';

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
	const [libraries, setLibraries] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isBusy, setIsBusy] = useState(false);
	const [openError, setOpenError] = useState(null);
	const [activateError, setActivateError] = useState(null);
	const [createError, setCreateError] = useState(null);
	const [renameError, setRenameError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);
	const editingSlug = feed?.slug;

	// Seeded from the feed rather than fetched. The page-load feed is always assembled for the
	// active library (see Admin\Feed\Localizer), so on first paint the two are the same and a
	// separate request would only re-learn what the page already told us. Every later move of the
	// pointer goes through a flow that reports the server's resolved slug back here.
	const [activeSlug, setActiveSlug] = useState(editingSlug);

	const loadLibraries = useCallback(() => {
		return fetchLibraries()
			.then((rows) => setLibraries(sortLibraries(rows)))
			.catch((err) => setOpenError({ message: errorMessage(err) }));
	}, []);

	useEffect(() => {
		setIsLoading(true);
		loadLibraries().finally(() => setIsLoading(false));
	}, [loadLibraries]);

	const clearOpenError = useCallback(() => setOpenError(null), []);
	const clearActivateError = useCallback(() => setActivateError(null), []);
	const clearCreateError = useCallback(() => setCreateError(null), []);
	const clearRenameError = useCallback(() => setRenameError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);

	// Shared by `openLibrary` (below) and by `addLibrary`'s post-create open — each call site
	// passes its own `onError` so an open that fails as part of create reports through
	// `createError`, never through `openError`.
	const runOpen = useCallback(
		({ slug, onError }) => openLibraryFlow({ slug, refreshFeed, onBusy: setIsBusy, onError }),
		[refreshFeed]
	);

	const openLibrary = useCallback(
		(slug) => {
			setOpenError(null);
			return runOpen({ slug, onError: setOpenError });
		},
		[runOpen]
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
				openLibrary: (slug) => runOpen({ slug, onError: setCreateError }),
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
				onBusy: setIsBusy,
				onError: setDeleteError,
				onActiveChanged: setActiveSlug,
			});
		},
		[activeSlug, loadLibraries, refreshFeed]
	);

	return {
		libraries,
		activeSlug,
		editingSlug,
		isEditingActive: activeSlug === editingSlug,
		isLoading,
		isBusy,
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
