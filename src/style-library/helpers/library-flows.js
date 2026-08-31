/**
 * Pure orchestration for the library-management flows the Style Library header runs: open,
 * activate, create-then-open, rename, and delete-or-reset. Extracted out of `hooks/use-libraries`
 * so each flow can be exercised directly in tests without rendering a component — a flow takes the
 * REST calls it needs (imported here, so a test mocks `api/client`) plus a small set of injected
 * callbacks for the state a caller reacts to (busy, error, and a refresh of the libraries list,
 * the feed, or the active-library pointer). None of the flows reloads the page; each settles by
 * resolving once its side effects are done, or rejecting so its caller (a modal) can tell success
 * from failure.
 *
 * The central distinction here is between the library a site *renders with* and the library the
 * app is *editing*. Opening is free and reversible: it only re-reads the feed, so a user can
 * browse and edit any library without touching what visitors see. Activating is the deliberate,
 * guarded act that changes what the site uses, and it lives in exactly one flow so it stays easy
 * to audit.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createLibrary, deleteLibrary, renameLibrary, setActiveLibrary } from '../api/client';
import { isDefaultLibrary, isDuplicateLibraryName, slugifyLibraryTitle } from './libraries';

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
 * Show a library in the app: refresh the feed for it, and nothing else.
 *
 * This never writes the active-library pointer. Choosing a library from the header dropdown is a
 * navigation act, not a publishing one — the site keeps rendering whatever library is active
 * until someone explicitly activates a different one through `activateLibraryFlow`.
 *
 * @param {Object}   args
 * @param {string}   args.slug           The token library slug to open for editing.
 * @param {Function} args.refreshFeed    Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.resetWorkspace Clears the draft channel and the open route item, so the
 *                                       library being left behind cannot strand a draft.
 * @param {Function} args.onBusy         Called with a boolean as the request starts and settles.
 * @param {Function} args.onError        Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the feed refresh completes; rejects on failure, after
 *                          `onError`/`onBusy` have already run.
 */
export function openLibraryFlow({ slug, refreshFeed, resetWorkspace, onBusy, onError }) {
	onBusy(true);

	return Promise.resolve()
		.then(() => {
			// Before the read, not after: the open panel's draft belongs to the library being left,
			// and the panel cannot reseed itself when the values change underneath it. Unmounting it
			// first is what stops it reporting unsaved changes about a draft with nowhere left to go.
			// Running it inside the chain (rather than before it starts) keeps a throw here inside
			// this flow's own `.catch()`, instead of escaping synchronously and leaving `onBusy(false)`
			// never called.
			resetWorkspace();

			return refreshFeed(slug);
		})
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown so a caller chaining off an open (the create flow, below) can tell a failed
			// open from a successful one instead of treating this as done. A caller that only fires
			// a plain open (no chained action) must catch this itself — the error is already
			// surfaced through `onError` regardless.
			throw err;
		});
}

/**
 * Point the site's active-library pointer at a slug.
 *
 * The one place in the app that writes that pointer, so the blast radius of "the whole site
 * restyles" stays auditable: if this function has one caller, the guarded modal is the only way
 * a site can change its active library.
 *
 * Deliberately does not refresh the feed. Activating a library changes which library the front
 * end reads, not any value inside it — the app is already showing this library's tokens, and
 * re-reading them would cost a request and re-render every screen to produce identical output.
 *
 * @param {Object}   args
 * @param {string}   args.slug        The token library slug to make active.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 * @param {Function} args.onActivated Called with the slug the server resolved as active.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the pointer has moved; rejects on failure, after
 *                          `onError`/`onBusy` have already run.
 */
export function activateLibraryFlow({ slug, onBusy, onError, onActivated }) {
	onBusy(true);

	return (
		setActiveLibrary(slug)
			// The resolved slug comes from the response rather than the request: the server owns
			// which library ended up active, and reading it back is what keeps the app honest if it
			// ever resolves something other than what was asked for.
			.then((result) => onActivated(result?.slug ?? slug))
			.then(() => onBusy(false))
			.catch((err) => {
				onError({ message: errorMessage(err) });
				onBusy(false);

				// Re-thrown so the confirmation modal can tell success from failure and knows whether
				// to close itself.
				throw err;
			})
	);
}

/**
 * Create a library from a typed title, then open it for editing and refresh the libraries list.
 *
 * Creating a library does not activate it. A new library starts empty and is built up over time;
 * publishing it to the site is a separate, explicit decision the user makes once it is ready.
 *
 * @param {Object}        args
 * @param {string}        args.title         The typed library title.
 * @param {Array<Object>} args.libraries     The existing library rows, for the duplicate-title check.
 * @param {Function}      args.openLibrary   Opens a library for editing (typically `openLibraryFlow` bound to a slug).
 * @param {Function}      args.loadLibraries Refreshes the libraries list.
 * @param {Function}      args.onBusy        Called with a boolean as the request starts and settles.
 * @param {Function}      args.onError       Called with `{ message }` on failure or invalid input.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the library is created, opened, and the list is
 *                          refreshed; rejects on an invalid title, a duplicate title, or a
 *                          request failure, after `onError` has already run.
 */
export function createLibraryFlow({ title, libraries, openLibrary, loadLibraries, onBusy, onError }) {
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
		.then(() => openLibrary(slug))
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
 * Rename a library, then refresh the libraries list so the dropdown label and ordering follow.
 *
 * Only the title changes; the slug is the library's permanent identity. The feed is deliberately
 * not refreshed — a library's name is not part of the feed payload, and every screen renders
 * token values rather than the library's name.
 *
 * @param {Object}        args
 * @param {string}        args.slug          The library to rename.
 * @param {string}        args.title         The new title.
 * @param {Array<Object>} args.libraries     The existing library rows, for the duplicate-name check.
 * @param {Function}      args.loadLibraries Refreshes the libraries list.
 * @param {Function}      args.onBusy        Called with a boolean as the request starts and settles.
 * @param {Function}      args.onError       Called with `{ message }` on failure or invalid input.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the rename and the list refresh complete; rejects on an
 *                          empty or duplicate name, or a request failure, after `onError` has run.
 */
export function renameLibraryFlow({ slug, title, libraries, loadLibraries, onBusy, onError }) {
	const trimmed = String(title ?? '').trim();

	// The server reads an empty title as "leave the stored one untouched", so a blank name would
	// silently do nothing rather than clearing the name. Rejecting here makes that honest, and
	// reuses the create flow's wording for the same condition.
	if (trimmed === '') {
		const message = __('Enter a library title.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	if (isDuplicateLibraryName(trimmed, libraries, slug)) {
		const message = __('A library with that title already exists.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	onBusy(true);

	return renameLibrary(slug, trimmed)
		.then(() => loadLibraries())
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown so the rename modal stays open on its inline error instead of closing as if
			// the rename had worked.
			throw err;
		});
}

/**
 * Delete (or, for the default library, reset) a library.
 *
 * Deleting the library the site is currently using requires naming its successor: that library is
 * activated *first*, then the target is deleted. The reverse order would let the server fall the
 * pointer back to the default in between, briefly serving a site-wide look nobody chose. Doing it
 * this way, the site moves straight from the old library to the chosen one and the delete that
 * follows changes nothing a visitor can see.
 *
 * The default library is exempt: deleting it resets its values in place rather than removing it,
 * so it remains and stays active, and there is no successor to name.
 *
 * @param {Object}   args
 * @param {string}   args.slug                    The token library slug to delete or reset.
 * @param {string}   args.activeSlug              The slug the site currently renders with.
 * @param {string}   [args.successorSlug]         The library to activate first, required when
 *                                                deleting the active non-default library.
 * @param {Function} args.refreshFeed             Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.loadLibraries           Refreshes the libraries list.
 * @param {Function} args.forgetLibrary           Drops every cached entry addressed to a library slug.
 * @param {Function} args.revalidateLibraryCaches Re-arms the resolvers `forgetLibrary` left empty,
 *                                                once the feed has moved off the deleted library.
 * @param {Function} args.resetWorkspace          Clears the draft channel and the open route item.
 * @param {Function} args.onBusy                  Called with a boolean as the request starts and settles.
 * @param {Function} args.onError                 Called with `{ message }` on failure.
 * @param {Function} args.onActiveChanged         Called with the slug that ends up active, when it moves.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the delete (and any activation and feed refresh it
 *                          entails) completes; rejects on failure, after `onError` has run.
 */
export function deleteLibraryFlow({
	slug,
	activeSlug,
	successorSlug,
	refreshFeed,
	loadLibraries,
	forgetLibrary,
	revalidateLibraryCaches,
	resetWorkspace,
	onBusy,
	onError,
	onActiveChanged,
}) {
	const needsSuccessor = slug === activeSlug && !isDefaultLibrary(slug);

	// The modal's disabled confirm button is the real gate, but this flow is the unit under test
	// and a future caller could get it wrong — refusing here means no request is ever issued
	// without somewhere for the site to land.
	if (needsSuccessor && !successorSlug) {
		const message = __('Choose which library your site should use instead.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	onBusy(true);

	// Activate the successor before deleting, never after — see the docblock.
	const activation = needsSuccessor
		? setActiveLibrary(successorSlug).then((result) => onActiveChanged(result?.slug ?? successorSlug))
		: Promise.resolve();

	// Where the app lands afterwards. `slug` is always the library being edited (the modal offers
	// no other target), so the feed it is showing is invalid the moment that row is gone and has
	// to move somewhere that certainly exists.
	let nextSlug = activeSlug; // Deleted a library the site was not using: fall back to the one it is.

	if (needsSuccessor) {
		nextSlug = successorSlug; // Deleted the live library: the successor just activated.
	} else if (slug === activeSlug) {
		nextSlug = slug; // Reset the default library: it stays put, now holding baseline values.
	}

	return activation
		.then(() => deleteLibrary(slug))
		.then(() => {
			// Both run only once the delete has actually landed, and both run before the feed is
			// re-read. Resetting earlier would throw away an open draft for a request that might
			// still fail; resetting later would let a screen render the fresh feed while still
			// holding the deleted library's cached presets, palettes and pending overlays.
			//
			// Wrapped in its own try/catch, not folded into the flow's outer `.catch()`, for the same
			// reason the `loadLibraries()` step below swallows its own failure: by this point
			// `deleteLibrary(slug)` has already resolved, so a throw from either callback (e.g.
			// `resetWorkspace()`'s `history.replaceState`) must not be reported as a failed delete.
			// Caught separately rather than as one block: the workspace reset is what stops a deleted
			// library's draft from claiming unsaved changes, so it has to run even if forgetting that
			// library's cached state failed first.
			try {
				forgetLibrary(slug);
			} catch {
				// Intentionally swallowed — see above.
			}

			try {
				resetWorkspace();
			} catch {
				// Intentionally swallowed — see above.
			}
		})
		.then(() => refreshFeed(nextSlug))
		.then(() => {
			// After the feed swap, never before: re-arming these resolvers while the app still
			// points at the deleted library re-fetches a slug the server no longer has, and the
			// failure surfaces as a stale error notice on the library the user lands on.
			try {
				revalidateLibraryCaches();
			} catch {
				// Intentionally swallowed — see above.
			}
		})
		.then(() =>
			// A failed refetch here must not undo a delete that already succeeded — by this point
			// `deleteLibrary(slug)` has already resolved. A stale list is already surfaced
			// separately, via `getResolutionError('getLibraries', [])` feeding `openError` in
			// `use-libraries.js`, which the header's own library dropdown renders. Letting this
			// rejection propagate into the `.catch()` below would report "delete failed" for a
			// delete that worked, leaving the modal open and a retry 404ing against the row that is
			// already gone.
			loadLibraries().catch(() => {})
		)
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown, like the create and rename flows and for the same reason: the modal needs to
			// tell success from failure to know whether to close itself. Success and failure look the
			// same (a resolved promise) without this; the modal would close on an error too, hiding
			// the very Notice it left behind to explain what went wrong.
			//
			// Note a successor may already have been activated when the delete itself fails. That
			// leaves the site on a library the user explicitly chose, with the target intact — a
			// partial outcome, but every part of it was asked for, and retrying the delete finishes
			// the job. Reordering to "delete first" to avoid it would trade this for a window where
			// the site serves default styles nobody picked.
			throw err;
		});
}
