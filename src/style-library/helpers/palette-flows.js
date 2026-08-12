/**
 * Pure orchestration for the Color Palette screen's write flows: open, activate, create, rename,
 * delete, the settings-panel save (swatch rename + recolor), swatch removal, add color, add color
 * group, and within-group reorder. Extracted out of `hooks/use-palettes` so each flow can be
 * exercised directly in tests without rendering a component — a flow takes the REST calls it needs
 * (imported here, so a test mocks `api/client`) plus a small set of injected callbacks for the
 * state a caller reacts to (busy, a scoped error slot, and a `reload`/`refreshFeed` pair the hook
 * provides). Every flow settles pessimistically and re-throws on failure so its caller (a modal,
 * or the settings panel) can tell success from failure; none reloads the page.
 *
 * `writeDefaultPaletteFlow` is the single place the default-vs-edited write routing (a palette's
 * structure lives only on its `$default` node — see the module's own docblock below) is encoded.
 * Every structural flow in this file funnels through it; only `saveSwatchEditsFlow`'s color half
 * ever writes the palette being edited.
 *
 * The central distinction here mirrors `library-flows.js`: the palette a site *renders with*
 * (`$current`) versus the palette the app is *editing*. Opening is free and reversible — it only
 * reads an effective view, so a user can browse and edit any palette without touching what
 * visitors see. Activating is the one flow that writes `$current`, and it is deliberate and
 * guarded because that pointer is overlaid onto the color token leaves before alias flattening
 * (`Token_Resolver::apply_palette_overlay()`), so it re-tints resolved color values across the
 * whole app, not just this screen.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	createUserPrimitive,
	deletePalette,
	deleteUserPrimitive,
	fetchPalette,
	savePalette,
	saveSwatch,
	setCurrentPalette,
} from '../api/client';
import { errorMessage } from './library-flows';
import {
	addGroupToGroups,
	addSwatchToGroups,
	customColorTokenId,
	isDuplicatePaletteLabel,
	newSwatchValue,
	nextCustomColorSlug,
	removeSwatchFromGroups,
	renameSwatchInGroups,
	reorderGroupSwatches,
	slugifyPaletteLabel,
	stripEffectiveFlags,
} from './palettes';

/**
 * Apply a structural edit to the DEFAULT palette node and persist it. Structure (which swatches
 * exist, their labels, their grouping, their order) lives ONLY on the default palette — the
 * effective view of every other palette is projected from it — so every structural flow below
 * funnels through here, and none of them ever writes structure to the palette being edited.
 *
 * The payload is built from a FRESH read of the default palette's own view: the displayed
 * (edited) palette's view carries that palette's own values, and using it here would overwrite
 * the default palette's colors with another palette's deltas.
 *
 * @param {Object}   args
 * @param {string}   args.namespace    The REST namespace (from the feed's REST descriptor).
 * @param {string}   args.slug         The token library slug.
 * @param {string}   args.defaultId    The listing's `$default` palette id.
 * @param {Function} args.edit         Pure `(groups) => groups` transform (from `./palettes`).
 * @param {Function} args.reload       Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed  Replaces the feed for a slug.
 * @param {Function} args.onBusy       Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError      Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the write, the re-reads, and the feed refresh complete;
 *                          rejects on failure after `onError`, a rollback re-read, and `onBusy` have
 *                          run — so a caller that applied its edit optimistically is put back in sync
 *                          with the server whether the write succeeded or not.
 */
export function writeDefaultPaletteFlow({ namespace, slug, defaultId, edit, reload, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return fetchPalette(namespace, defaultId, slug)
		.then((view) => {
			const groups = edit(stripEffectiveFlags(view.groups));

			return savePalette(namespace, defaultId, { label: view.label, groups }, slug);
		})
		.then(() => reload())
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });

			// Re-read on the way out too, not only on success. A caller may have applied its edit
			// optimistically — the swatch reorder does, and says so — and depends on this re-read to put
			// the server's version back when the write fails. Reloading only in the success path leaves a
			// failed edit sitting on screen next to its own error message.
			//
			// A re-read that itself fails is swallowed: the write error is the one worth reporting, and
			// masking it with a second failure would hide what actually went wrong. `onBusy(false)` runs
			// either way, so the UI never stays stuck behind a spinner.
			return Promise.resolve()
				.then(() => reload())
				.catch(() => {})
				.then(() => {
					onBusy(false);

					throw err;
				});
		});
}

/**
 * Save the settings panel's edits for a swatch: a label change (a structure edit, written to the
 * default palette node) and/or a value change (written to the palette being edited via the
 * granular per-swatch endpoint) — the only flow in this module that ever targets the edited
 * palette rather than the default node. A label change runs before a value change when both are
 * dirty; either way there is exactly one `reload` and one `refreshFeed` for the whole save.
 *
 * The color write targets `editingId`, not `$current` — recoloring a swatch on a palette a user
 * is building out must never require that palette to be live first.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.defaultId   The listing's `$default` palette id.
 * @param {string}   args.editingId   The palette id currently open for editing.
 * @param {string}   args.token       The swatch token dot-path being edited.
 * @param {Object}   args.draft       The panel's draft values, `{ label, value }`.
 * @param {Object}   args.initial     The values the panel opened with, `{ label, value }`.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves immediately, with no request, when neither field changed;
 *                          otherwise resolves once every dirty write, the reload, and the feed
 *                          refresh complete, or rejects on failure after `onError`/`onBusy` run.
 */
export function saveSwatchEditsFlow({
	namespace,
	slug,
	defaultId,
	editingId,
	token,
	draft,
	initial,
	reload,
	refreshFeed,
	onBusy,
	onError,
}) {
	const renamed = draft.label !== initial.label;
	const recolored = draft.value !== initial.value;

	if (!renamed && !recolored) {
		return Promise.resolve();
	}

	onBusy(true);

	let chain = Promise.resolve();

	if (renamed) {
		chain = chain
			.then(() => fetchPalette(namespace, defaultId, slug))
			.then((view) =>
				savePalette(
					namespace,
					defaultId,
					{
						label: view.label,
						groups: renameSwatchInGroups(stripEffectiveFlags(view.groups), token, draft.label),
					},
					slug
				)
			);
	}

	if (recolored) {
		chain = chain.then(() => saveSwatch(namespace, editingId, token, draft.value, slug));
	}

	return chain
		.then(() => reload())
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
		});
}

/**
 * Show a palette in the app: fetch its effective view, and nothing else.
 *
 * This never writes `$current`. Choosing a palette from the header dropdown is a navigation act,
 * not a publishing one — editing a palette other than the one the site renders with is the normal
 * case (e.g. building out a dark variant while the site still runs a light one), and the API
 * already supports that split with no new plumbing: `GET /palettes/{id}` returns any palette's
 * effective view without touching `$current`. The site keeps rendering whatever palette is active
 * until someone explicitly activates a different one through `activatePaletteFlow`. A future
 * reader who "fixes" this to also write `$current` would silently re-tint the live site every time
 * someone merely looks at a different palette — don't.
 *
 * Kept as its own flow, thin as it is, rather than a bare fetch inlined in the hook, only so
 * `createPaletteFlow` can chain off it the way `createLibraryFlow` chains off `openLibraryFlow` —
 * see that pair for the shape this mirrors.
 *
 * @param {Object}   args
 * @param {string}   args.namespace The REST namespace.
 * @param {string}   args.slug      The token library slug.
 * @param {string}   args.id        The palette id to open for editing.
 * @param {Function} args.onOpened  Called with the fetched effective view once the read completes.
 * @param {Function} args.onBusy    Called with a boolean as the request starts and settles.
 * @param {Function} args.onError   Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once `onOpened` has run; rejects on failure, after
 *                          `onError`/`onBusy` have already run.
 */
export function openPaletteFlow({ namespace, slug, id, onOpened, onBusy, onError }) {
	onBusy(true);

	return fetchPalette(namespace, id, slug)
		.then((view) => onOpened(view))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown so a caller chaining off an open (createPaletteFlow, below) can tell a
			// failed open from a successful one instead of treating this as done. A caller that
			// only fires a plain open (no chained action) must catch this itself — the error is
			// already surfaced through `onError` regardless.
			throw err;
		});
}

/**
 * Point the library's `$current` palette pointer at `id` — the one palette-selection operation
 * that changes the live site. Reloads and refreshes the feed for the same reason
 * `writeDefaultPaletteFlow` does: `$current`'s swatch values are overlaid onto the color token
 * leaves before alias flattening (`Token_Resolver::apply_palette_overlay()`), so activating
 * re-tints resolved color values everywhere the feed's schema is consumed, not only on this
 * screen — unlike `activateLibraryFlow`, which skips the refresh because a library's own content
 * does not change when it becomes active.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.id          The palette id to make current.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 * @param {Function} args.onActivated Called with the id the server resolved as current.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the pointer has moved, the listing has been re-read, and
 *                          the feed refreshed; rejects on failure after `onError`/`onBusy` have run.
 */
export function activatePaletteFlow({ namespace, slug, id, reload, refreshFeed, onBusy, onError, onActivated }) {
	onBusy(true);

	return (
		setCurrentPalette(namespace, id, slug)
			// The resolved id comes from the response rather than the request, mirroring
			// `activateLibraryFlow` — the server owns which palette ended up current.
			.then((result) => onActivated(result?.current ?? id))
			.then(() => reload())
			.then(() => refreshFeed(slug))
			.then(() => onBusy(false))
			.catch((err) => {
				onError({ message: errorMessage(err) });
				onBusy(false);

				// Re-thrown so the confirmation modal can tell success from failure and knows
				// whether to close itself.
				throw err;
			})
	);
}

/**
 * Create a palette from a typed label, seeded from the default palette's own effective view (so
 * it starts as a mirror of the default until something recolors it), then open it for editing.
 *
 * Creating a palette does not activate it, mirroring `createLibraryFlow`. A new palette starts as
 * a copy of the default and is built up (recolored, renamed) over time; making it the site's live
 * palette is a separate, explicit decision the user makes once it is ready — not a side effect of
 * having typed a name.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.label       The typed palette label.
 * @param {Object}   args.listing     The current listing (`{ defaultId, palettes }`), for the
 *                                    duplicate-id check.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook —
 *                                    run BEFORE `openPalette` so the fresh listing already carries
 *                                    the new row by the time `editingId` moves onto it (see the
 *                                    ordering note below).
 * @param {Function} args.openPalette Opens a palette for editing (typically `openPaletteFlow`
 *                                    bound to the new id).
 * @param {Function} args.refreshFeed Replaces the feed for a slug. Required even though a new
 *                                    palette changes no resolved value: the feed carries the
 *                                    version token every later write is checked against, so
 *                                    skipping it leaves the page one version behind and the next
 *                                    write is rejected with a 409 conflict.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure or invalid input.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the palette is created, the listing reloaded, and the new
 *                          palette opened for editing; rejects on an empty or duplicate label, or a
 *                          request failure, after `onError` has already run.
 */
export function createPaletteFlow({
	namespace,
	slug,
	label,
	listing,
	reload,
	openPalette,
	refreshFeed,
	onBusy,
	onError,
}) {
	const id = slugifyPaletteLabel(label);

	// Both validation failures reject rather than resolve: a caller that closes its modal on a
	// resolved promise must instead leave it open on the inline error so the user can fix the
	// label.
	if (!id) {
		const message = __('Enter a palette name.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	if (isDuplicatePaletteLabel(label, listing)) {
		const message = __('A palette with that name already exists.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	onBusy(true);

	return (
		fetchPalette(namespace, listing.defaultId, slug)
			.then((view) => savePalette(namespace, id, { label, groups: stripEffectiveFlags(view.groups) }, slug))
			// Reloaded BEFORE `openPalette`, not after: `hooks/use-palettes.js`'s `reload()` keeps
			// `editingId` unchanged when the currently-edited palette still exists in the fresh
			// listing (true here — nothing about creating a sibling palette removes it), so this
			// step only refreshes `listing.palettes` with the new row. `openPalette` then moves
			// `editingId` onto that row with the listing already populated, so the dropdown can
			// resolve its label and render it as a real option instead of falling back to the raw
			// id. Reloading after `openPalette` instead would leave the dropdown showing the new,
			// still-missing-from-the-list id for one render.
			.then(() => refreshFeed(slug))
			.then(() => reload())
			.then(() => openPalette(id))
			.then(() => onBusy(false))
			.catch((err) => {
				onError({ message: errorMessage(err) });
				onBusy(false);

				throw err;
			})
	);
}

/**
 * Delete a palette, first handing the active pointer to a successor when the palette being deleted
 * is the live one. Mirrors `deleteLibraryFlow`.
 *
 * Activation runs before the delete: left alone the server resolves a dangling `$current` to
 * `$default`, so the site would briefly wear a palette nobody chose.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.id          The palette id to delete.
 * @param {string}   args.currentId   The listing's `$current` palette id, which decides whether a
 *                                    successor is required at all.
 * @param {string}   [args.successorId] The palette to make current first. Required only when
 *                                    deleting the current palette.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 * @param {Function} [args.onActivated] Called with the id the server reports as current, once the
 *                                    successor is activated.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the activation, delete, reload, and feed refresh complete;
 *                          rejects on a missing successor or a request failure, after
 *                          `onError`/`onBusy` have run.
 */
export function deletePaletteFlow({
	namespace,
	slug,
	id,
	currentId,
	successorId,
	reload,
	refreshFeed,
	onBusy,
	onError,
	onActivated,
}) {
	const needsSuccessor = id === currentId;

	if (needsSuccessor && !successorId) {
		const message = __('Choose which palette your site should use instead.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	onBusy(true);

	const activation = needsSuccessor
		? setCurrentPalette(namespace, successorId, slug).then((result) => onActivated(result?.current ?? successorId))
		: Promise.resolve();

	return activation
		.then(() => deletePalette(namespace, id, slug))
		.then(() => reload())
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
		});
}

/**
 * Rename a palette: re-send its own effective view under the SAME id with a new label. Available
 * for any palette, including the default — the server only refuses DELETING the default palette,
 * not relabeling it (`Palettes_Controller::update_item()` carries no default-id guard, unlike
 * `delete_item()`).
 *
 * `id` is never re-derived from `label` here — that is the one deliberate divergence from
 * `createPaletteFlow`, which mints an id from the typed label because it is minting a NEW palette.
 * A rename's target already exists and is referenced elsewhere by that exact id (the `$current` /
 * `$default` pointers, and `data-kb-palette="<id>"` attributes already rendered onto blocks);
 * re-deriving it from the new label would silently orphan every one of those references. Do not
 * "fix" this to match `createPaletteFlow`'s id derivation — it would corrupt every reference the
 * unchanged id currently satisfies.
 *
 * Re-sending the palette's own effective view is safe and lossless: `prepare_for_storage()`
 * re-reduces a non-default palette back to its deltas on write (dropping swatches that already
 * equal the default value), so this round-trips exactly what was already stored, just under a new
 * label. `refreshFeed` is still needed even though no resolved value can change — a palette's
 * `label` lives under `$extensions.colorPalettes`, which `Effective_Document::build()` strips, so
 * the CSS is identical either way. The feed also carries the version token every later write is
 * checked against, and this write bumps it, so skipping the refresh leaves the page one version
 * behind and the next write is rejected with a 409 conflict.
 *
 * @param {Object}   args
 * @param {string}   args.namespace The REST namespace.
 * @param {string}   args.slug      The token library slug.
 * @param {string}   args.id        The palette id to rename — unchanged by this flow.
 * @param {string}   args.label     The typed label.
 * @param {Object}   args.listing   The current listing (`{ palettes }`), for the duplicate-label check.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook, so
 *                                    the dropdown's label updates immediately.
 * @param {Function} args.refreshFeed Replaces the feed for a slug, so its version token matches the
 *                                    document this write just bumped.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure or invalid input.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the rename and the listing reload complete; rejects on an
 *                          empty or duplicate label, or a request failure, after `onError` has
 *                          already run.
 */
export function renamePaletteFlow({ namespace, slug, id, label, listing, reload, refreshFeed, onBusy, onError }) {
	const trimmed = String(label ?? '').trim();

	if (trimmed === '') {
		const message = __('Enter a palette name.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	if (isDuplicatePaletteLabel(trimmed, listing, id)) {
		const message = __('A palette with that name already exists.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	onBusy(true);

	return fetchPalette(namespace, id, slug)
		.then((view) => savePalette(namespace, id, { label: trimmed, groups: stripEffectiveFlags(view.groups) }, slug))
		.then(() => refreshFeed(slug))
		.then(() => reload())
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
		});
}

/**
 * Rename a swatch — a structure edit, written to the default palette node.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.defaultId   The listing's `$default` palette id.
 * @param {string}   args.token       The swatch token dot-path to rename.
 * @param {string}   args.label       The new label.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} See `writeDefaultPaletteFlow`.
 */
export function renameSwatchFlow({ namespace, slug, defaultId, token, label, reload, refreshFeed, onBusy, onError }) {
	return writeDefaultPaletteFlow({
		namespace,
		slug,
		defaultId,
		edit: (groups) => renameSwatchInGroups(groups, token, label),
		reload,
		refreshFeed,
		onBusy,
		onError,
	});
}

/**
 * Reorder one group's swatches — a structure edit, written to the default palette node regardless
 * of which palette is being edited (palette order is genuinely ordered document data, not
 * the client-side-only reorder the rest of this app uses).
 *
 * @param {Object}         args
 * @param {string}         args.namespace     The REST namespace.
 * @param {string}         args.slug          The token library slug.
 * @param {string}         args.defaultId     The listing's `$default` palette id.
 * @param {string}         args.groupId       The group being reordered.
 * @param {Array<string>}  args.orderedTokens The new swatch token order.
 * @param {Function}       args.reload        Re-reads the listing (and the edited view) from the hook.
 * @param {Function}       args.refreshFeed   Replaces the feed for a slug.
 * @param {Function}       args.onBusy        Called with a boolean as the chain starts and settles.
 * @param {Function}       args.onError       Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} See `writeDefaultPaletteFlow`.
 */
export function reorderSwatchesFlow({
	namespace,
	slug,
	defaultId,
	groupId,
	orderedTokens,
	reload,
	refreshFeed,
	onBusy,
	onError,
}) {
	return writeDefaultPaletteFlow({
		namespace,
		slug,
		defaultId,
		edit: (groups) => reorderGroupSwatches(groups, groupId, orderedTokens),
		reload,
		refreshFeed,
		onBusy,
		onError,
	});
}

/**
 * Remove a swatch: strips its row from the default palette's structure first, then — only for a
 * user-created token — best-effort deletes the underlying primitive as a second step.
 *
 * The order is load-bearing, not incidental. `Token_Reference_Policy` never scans palette
 * swatches, so its reference gate was never what made this safe; safety instead comes from the
 * row-removal write landing first, which removes the token from every palette's effective view
 * (every palette's view is projected from the default node) before the primitive delete ever
 * runs — no later read or write in this flow can re-guard the now-absent row. The cleanup step
 * can still fail on a reference the policy DOES track elsewhere (e.g. a semantic-layer alias to
 * the same primitive); because the row is already gone by the time that call runs, that failure
 * must not read as the whole delete failing, so it is swallowed rather than re-thrown, and the
 * feed is refreshed once more regardless of its outcome so a stale version never blocks the next
 * mint.
 *
 * @param {Object}   args
 * @param {string}   args.namespace     The REST namespace.
 * @param {string}   args.slug          The token library slug.
 * @param {string}   args.defaultId     The listing's `$default` palette id.
 * @param {string}   args.token         The swatch token dot-path to remove.
 * @param {boolean}  args.isUserCreated Whether `token` is a user-created custom color — gates
 *                                      ONLY the cleanup step, never the row removal.
 * @param {Function} args.reload        Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed   Replaces the feed for a slug; resolves with the fresh feed
 *                                      payload, whose `version` the cleanup step's delete call needs.
 * @param {Function} args.onBusy        Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError       Called with `{ message }` on failure of the row-removal write.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the row-removal write (and, for a user-created token, the
 *                          best-effort cleanup attempt) settle; rejects only when the row-removal
 *                          write itself fails, after `onError`/`onBusy` have run.
 */
export function removeSwatchFlow({
	namespace,
	slug,
	defaultId,
	token,
	isUserCreated,
	reload,
	refreshFeed,
	onBusy,
	onError,
}) {
	onBusy(true);

	return fetchPalette(namespace, defaultId, slug)
		.then((view) => {
			const groups = removeSwatchFromGroups(stripEffectiveFlags(view.groups), token);

			return savePalette(namespace, defaultId, { label: view.label, groups }, slug);
		})
		.then(() => reload())
		.then(() => refreshFeed(slug))
		.then((freshFeed) => {
			if (!isUserCreated) {
				onBusy(false);
				return;
			}

			return deleteUserPrimitive(slug, token, freshFeed?.version)
				.catch(() => {
					// Best-effort: a cleanup failure never reverses the row removal.
				})
				.then(() => refreshFeed(slug))
				.then(() => onBusy(false));
		})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
		});
}

/**
 * Mint a user color primitive and append it as a new swatch in `groupId` on the default palette —
 * `guard_swatches()` rejects any swatch whose token does not already resolve to a registered
 * color token, so the primitive must exist before the swatch referencing it can be saved.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.defaultId   The listing's `$default` palette id.
 * @param {string}   args.groupId     The group to append the new swatch to.
 * @param {Array<string>} args.tokens Every existing token id (feed tokens plus the palette's own
 *                                    swatch tokens) the new slug must avoid colliding with.
 * @param {Object}   args.palette     The palette being edited's effective view, for a
 *                                    friendlier starting color (the group's last swatch's value).
 * @param {string}   args.feedVersion The feed's current version, sent as the primitive create's
 *                                    concurrency guard.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the new swatch's token id, so the caller can select it;
 *                            rejects on failure after `onError`/`onBusy` have run.
 */
export function addColorFlow({
	namespace,
	slug,
	defaultId,
	groupId,
	tokens,
	palette,
	feedVersion,
	reload,
	refreshFeed,
	onBusy,
	onError,
}) {
	const colorSlug = nextCustomColorSlug(tokens);
	const value = newSwatchValue(palette?.groups, groupId);
	const label = __('New Color', 'kadence-blocks');
	const token = customColorTokenId(colorSlug);

	onBusy(true);

	return createUserPrimitive(slug, { id: colorSlug, $type: 'color', $value: value, label, version: feedVersion })
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
		})
		.then(() =>
			writeDefaultPaletteFlow({
				namespace,
				slug,
				defaultId,
				edit: (groups) => addSwatchToGroups(groups, groupId, { token, label, $value: value }),
				reload,
				refreshFeed,
				onBusy,
				onError,
			})
		)
		.then(() => token);
}

/**
 * Create a new color group on the default palette, seeded with a first minted swatch — the server
 * drops a group with zero swatches even on the default palette, so the group and its first color
 * are written together in one request.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.defaultId   The listing's `$default` palette id.
 * @param {string}   args.label       The typed group label.
 * @param {Object}   args.palette     The palette being edited's effective view, for the
 *                                    duplicate group-id check.
 * @param {Array<string>} args.tokens Every existing token id the new swatch's slug must avoid
 *                                    colliding with.
 * @param {string}   args.feedVersion The feed's current version, sent as the primitive create's
 *                                    concurrency guard.
 * @param {Function} args.reload      Re-reads the listing (and the edited view) from the hook.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure or invalid input.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the new group's first swatch's token id; rejects on an
 *                            empty or duplicate group label, or a request failure, after
 *                            `onError`/`onBusy` have run.
 */
export function addGroupFlow({
	namespace,
	slug,
	defaultId,
	label,
	palette,
	tokens,
	feedVersion,
	reload,
	refreshFeed,
	onBusy,
	onError,
}) {
	const groupId = slugifyPaletteLabel(label);

	if (!groupId) {
		const message = __('Enter a color group name.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	if ((palette?.groups ?? []).some((group) => group.id === groupId)) {
		const message = __('A color group with that name already exists.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	const colorSlug = nextCustomColorSlug(tokens);
	const value = newSwatchValue(palette?.groups, groupId);
	const swatchLabel = __('New Color', 'kadence-blocks');
	const token = customColorTokenId(colorSlug);

	onBusy(true);

	return createUserPrimitive(slug, {
		id: colorSlug,
		$type: 'color',
		$value: value,
		label: swatchLabel,
		version: feedVersion,
	})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
		})
		.then(() =>
			writeDefaultPaletteFlow({
				namespace,
				slug,
				defaultId,
				edit: (groups) =>
					addGroupToGroups(groups, {
						id: groupId,
						label,
						swatches: [{ token, label: swatchLabel, $value: value }],
					}),
				reload,
				refreshFeed,
				onBusy,
				onError,
			})
		)
		.then(() => token);
}
