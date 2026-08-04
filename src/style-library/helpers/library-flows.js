/**
 * Pure orchestration for the library-management flows the Style Library header runs: switch,
 * create-then-switch, and delete-or-reset. Extracted out of `hooks/use-libraries` so each flow can
 * be exercised directly in tests without rendering a component — a flow takes the REST calls it
 * needs (imported here, so a test mocks `api/client`) plus a small set of injected callbacks for
 * the state a caller reacts to (busy, error, and — for create/delete — a refresh of the libraries
 * list or the feed). None of the three flows reloads the page; each settles by resolving once its
 * side effects (the switch, the refreshed feed, the refreshed list) are done, or rejecting so its
 * caller (a modal) can tell success from failure.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createLibrary, deleteLibrary, getActiveLibrary, setActiveLibrary } from '../api/client';
import { slugifyLibraryTitle } from './libraries';

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
export function errorMessage(error) {
	return error?.message || __('Something went wrong. Please try again.', 'kadence-blocks');
}

/**
 * Point the active-library pointer at a slug, then refresh the feed for it.
 *
 * @param {Object}   args
 * @param {string}   args.slug        The token library slug to make active.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the switch and the feed refresh both complete; rejects on
 *                          failure, after `onError`/`onBusy` have already run.
 */
export function switchLibraryFlow({ slug, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return setActiveLibrary(slug)
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown so a caller chaining off a switch (the create flow, below) can tell a failed
			// switch from a successful one instead of treating this as done. A caller that only fires
			// a plain switch (no chained action) must catch this itself — the error is already
			// surfaced through `onError` regardless.
			throw err;
		});
}

/**
 * Create a library from a typed title, then switch to it and refresh the libraries list.
 *
 * @param {Object}        args
 * @param {string}        args.title         The typed library title.
 * @param {Array<Object>} args.libraries     The existing library rows, for the duplicate-title check.
 * @param {Function}      args.switchLibrary Switches the active library (typically `switchLibraryFlow` bound to a slug).
 * @param {Function}      args.loadLibraries Refreshes the libraries list.
 * @param {Function}      args.onBusy        Called with a boolean as the request starts and settles.
 * @param {Function}      args.onError       Called with `{ message }` on failure or invalid input.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the library is created, switched to, and the list is
 *                          refreshed; rejects on an invalid title, a duplicate title, or a
 *                          request failure, after `onError` has already run.
 */
export function createLibraryFlow({ title, libraries, switchLibrary, loadLibraries, onBusy, onError }) {
	const slug = slugifyLibraryTitle(title);

	// Both validation failures reject rather than resolve: a caller that closes on a resolved
	// promise (see LibrarySelector) must instead leave its modal open on the inline error so the
	// user can fix the title.
	if (!slug) {
		const message = __('Enter a library title.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	if (libraries.some((library) => library.slug === slug)) {
		const message = __('A library with that title already exists.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	onBusy(true);

	return createLibrary(slug, title)
		.then(() => switchLibrary(slug))
		.then(() => loadLibraries())
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown so the create modal can tell success from failure and knows whether to close
			// itself — with no reload to fall back on, this is the only signal it gets.
			throw err;
		});
}

/**
 * Delete (or, for the default library, reset) a library. When the deleted library was active,
 * re-reads the resolved active-library pointer and refreshes the feed for whatever library ends
 * up active, rather than assuming which slug that is.
 *
 * @param {Object}   args
 * @param {string}   args.slug          The token library slug to delete or reset.
 * @param {string}   args.activeSlug    The currently active library slug.
 * @param {Function} args.refreshFeed   Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.loadLibraries Refreshes the libraries list.
 * @param {Function} args.onBusy        Called with a boolean as the request starts and settles.
 * @param {Function} args.onError       Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the delete (and, when the target was active, the feed
 *                          refresh) completes; rejects on failure, after `onError` has already run.
 */
export function deleteLibraryFlow({ slug, activeSlug, refreshFeed, loadLibraries, onBusy, onError }) {
	onBusy(true);

	return deleteLibrary(slug)
		.then(() => {
			if (slug !== activeSlug) {
				onBusy(false);
				return loadLibraries();
			}

			// Deleting the active library always leaves some library active (deleting the default
			// resets it in place; deleting any other library falls the pointer back to the default) —
			// re-read the resolved pointer rather than assuming which slug that is, then refresh the
			// feed for it.
			return getActiveLibrary()
				.then(({ slug: nextActiveSlug }) => refreshFeed(nextActiveSlug))
				.then(() => loadLibraries())
				.then(() => onBusy(false));
		})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown, unlike the create flow but for the same reason, because the caller (the
			// delete/reset modal) needs to tell success from failure to know whether to close itself.
			// Success and failure look the same (a resolved promise) without this; the modal would
			// close on an error too, hiding the very Notice it left behind to explain what went wrong.
			throw err;
		});
}
