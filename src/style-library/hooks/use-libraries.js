/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { fetchLibraries } from '../api/client';
import { sortLibraries } from '../helpers/libraries';
import { createLibraryFlow, deleteLibraryFlow, errorMessage, switchLibraryFlow } from '../helpers/library-flows';

/**
 * The library management surface for the Style Library header: the list, the active slug, and
 * the switch/create/delete operations against the design-tokens REST API.
 *
 * This hook is a thin binding of React state onto the pure flows in `helpers/library-flows` —
 * `switchLibraryFlow`, `createLibraryFlow`, `deleteLibraryFlow` — which do the actual request
 * orchestration and are what a test exercises directly. Activation and deletion wait for the
 * server before acting, because both are followed by an in-place feed refresh — an optimistic
 * flip that then errored would leave the UI lying about which library the feed describes.
 * Creation is also pessimistic: the modal stays busy until the create request resolves. None of
 * the three flows reloads the page; each settles by either refreshing the feed for the now-active
 * library or, on failure, clearing `isBusy` so the caller (the create/delete modal) can close or
 * stay open on its own.
 *
 * Each of the three flows gets its own error slot (`switchError`, `createError`, `deleteError`)
 * rather than sharing one — a failed switch must never render inside the delete/reset modal, and
 * a failed delete must never resurface under the library dropdown. Each slot is cleared the
 * instant its own flow starts again, so a stale error from a previous attempt never lingers past
 * a fresh try at the same action.
 *
 * @param {Object}   feed        The design-tokens admin feed (provides the initial active slug).
 * @param {Function} refreshFeed Replaces the feed with a fresh REST read for a slug (from
 *                               `use-design-tokens-feed`), so switching or deleting the active
 *                               library re-renders every consumer without a page reload.
 *
 * @since TBD
 *
 * @return {Object} `{ libraries, activeSlug, isLoading, isBusy, switchError, createError,
 *                  deleteError, clearSwitchError, clearCreateError, clearDeleteError,
 *                  switchLibrary, createLibrary, deleteLibrary }`.
 */
export function useLibraries(feed, refreshFeed) {
	const [libraries, setLibraries] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isBusy, setIsBusy] = useState(false);
	const [switchError, setSwitchError] = useState(null);
	const [createError, setCreateError] = useState(null);
	const [deleteError, setDeleteError] = useState(null);
	const activeSlug = feed?.slug;

	const loadLibraries = useCallback(() => {
		return fetchLibraries()
			.then((rows) => setLibraries(sortLibraries(rows)))
			.catch((err) => setSwitchError({ message: errorMessage(err) }));
	}, []);

	useEffect(() => {
		setIsLoading(true);
		loadLibraries().finally(() => setIsLoading(false));
	}, [loadLibraries]);

	const clearSwitchError = useCallback(() => setSwitchError(null), []);
	const clearCreateError = useCallback(() => setCreateError(null), []);
	const clearDeleteError = useCallback(() => setDeleteError(null), []);

	// Shared by `switchLibrary` (below) and by `addLibrary`'s post-create switch — each call site
	// passes its own `onError` so a switch that fails as part of create reports through
	// `createError`, never through `switchError`.
	const runSwitch = useCallback(
		({ slug, onError }) => switchLibraryFlow({ slug, refreshFeed, onBusy: setIsBusy, onError }),
		[refreshFeed]
	);

	const switchLibrary = useCallback(
		(slug) => {
			setSwitchError(null);
			return runSwitch({ slug, onError: setSwitchError });
		},
		[runSwitch]
	);

	const addLibrary = useCallback(
		(title) => {
			setCreateError(null);
			return createLibraryFlow({
				title,
				libraries,
				switchLibrary: (slug) => runSwitch({ slug, onError: setCreateError }),
				loadLibraries,
				onBusy: setIsBusy,
				onError: setCreateError,
			});
		},
		[libraries, runSwitch, loadLibraries]
	);

	const removeLibrary = useCallback(
		(slug) => {
			setDeleteError(null);
			return deleteLibraryFlow({
				slug,
				activeSlug,
				refreshFeed,
				loadLibraries,
				onBusy: setIsBusy,
				onError: setDeleteError,
			});
		},
		[activeSlug, loadLibraries, refreshFeed]
	);

	return {
		libraries,
		activeSlug,
		isLoading,
		isBusy,
		switchError,
		createError,
		deleteError,
		clearSwitchError,
		clearCreateError,
		clearDeleteError,
		switchLibrary,
		createLibrary: addLibrary,
		deleteLibrary: removeLibrary,
	};
}
