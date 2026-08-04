/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { fetchLibraries, setActiveLibrary, createLibrary, deleteLibrary } from '../api/client';
import { slugifyLibraryTitle, sortLibraries } from '../helpers/libraries';

/**
 * Read the message off a REST error, falling back to a generic string when the error carries
 * none (e.g. a network failure `apiFetch` surfaces as a plain thrown value).
 *
 * @param {*} error The rejected value from an `apiFetch` call.
 *
 * @since TBD
 *
 * @return {string} A user-facing message.
 */
function errorMessage(error) {
	return error?.message || __('Something went wrong. Please try again.', 'kadence-blocks');
}

/**
 * The library management surface for the Style Library header: the list, the active slug, and
 * the switch/create/delete operations against the design-tokens REST API.
 *
 * Activation and deletion wait for the server before acting, because both are followed by a
 * reload or a refetch — an optimistic flip that then errored would leave the UI lying about which
 * library the printed feed describes. Creation is also pessimistic: the modal stays busy until
 * the create request resolves.
 *
 * @param {Object} feed The design-tokens admin feed (provides the initial active slug).
 *
 * @since TBD
 *
 * @return {Object} `{ libraries, activeSlug, isLoading, isBusy, error, clearError, switchLibrary,
 *                  createLibrary, deleteLibrary }`.
 */
export function useLibraries(feed) {
	const [libraries, setLibraries] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isBusy, setIsBusy] = useState(false);
	const [error, setError] = useState(null);
	const activeSlug = feed?.slug;

	const loadLibraries = useCallback(() => {
		return fetchLibraries()
			.then((rows) => setLibraries(sortLibraries(rows)))
			.catch((err) => setError({ message: errorMessage(err) }));
	}, []);

	useEffect(() => {
		setIsLoading(true);
		loadLibraries().finally(() => setIsLoading(false));
	}, [loadLibraries]);

	const clearError = useCallback(() => setError(null), []);

	const switchLibrary = useCallback((slug) => {
		setIsBusy(true);

		return setActiveLibrary(slug)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				setError({ message: errorMessage(err) });
				setIsBusy(false);
			});
	}, []);

	const addLibrary = useCallback(
		(title) => {
			const slug = slugifyLibraryTitle(title);

			if (!slug) {
				setError({ message: __('Enter a library title.', 'kadence-blocks') });
				return Promise.resolve();
			}

			if (libraries.some((library) => library.slug === slug)) {
				setError({ message: __('A library with that title already exists.', 'kadence-blocks') });
				return Promise.resolve();
			}

			setIsBusy(true);

			return createLibrary(slug, title)
				.then(() => switchLibrary(slug))
				.catch((err) => {
					setError({ message: errorMessage(err) });
					setIsBusy(false);
				});
		},
		[libraries, switchLibrary]
	);

	const removeLibrary = useCallback(
		(slug) => {
			setIsBusy(true);

			return deleteLibrary(slug)
				.then(() => {
					if (slug === activeSlug) {
						window.location.reload();
						return;
					}

					setIsBusy(false);
					return loadLibraries();
				})
				.catch((err) => {
					setError({ message: errorMessage(err) });
					setIsBusy(false);

					// Re-thrown, unlike the other flows here, because the caller (the delete/reset
					// modal) needs to tell success from failure to know whether to close itself — a
					// non-active-library delete has no reload to fall back on, so this is the only
					// signal it gets. Success and failure look the same (a resolved promise) without
					// this; the modal would close on an error too, hiding the very Notice it left
					// behind to explain what went wrong.
					throw err;
				});
		},
		[activeSlug, loadLibraries]
	);

	return {
		libraries,
		activeSlug,
		isLoading,
		isBusy,
		error,
		clearError,
		switchLibrary,
		createLibrary: addLibrary,
		deleteLibrary: removeLibrary,
	};
}
