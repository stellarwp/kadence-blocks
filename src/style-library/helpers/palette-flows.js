/**
 * Pure orchestration for the Color Palette screen's write flows: open, activate, create, rename,
 * delete, the settings-panel save (swatch rename + recolor), swatch removal, add color, add color
 * group, and within-group reorder. Extracted out of `hooks/use-palettes` so each flow can be
 * exercised directly in tests without rendering a component — a flow takes the REST calls it needs
 * (imported here, so a test mocks `api/client`) plus a small set of injected callbacks for the
 * state a caller reacts to (busy, a scoped error slot, and an `onReceive`/`refreshFeed` pair the
 * hook provides). Every write's own response is the same flat embedded-array wire shape a
 * `GET /palettes?_embed` would return, so a flow hands it straight to `onReceive` RAW, with no
 * reshaping and no follow-up fetch needed to learn the fresh state. Reshaping only ever happens in
 * one place, `store/selectors.js`'s `getPaletteListing` (via `helpers/palettes.js`'s `reshapePaletteRows`), the
 * same as for a resolver-driven GET; a flow reshaping its own response before dispatch would let a write's
 * dispatched shape drift from a GET's, leaving the store holding two different shapes under the
 * same key depending on which path last wrote it. Every flow settles pessimistically and re-throws
 * on failure so its caller (a modal, or the settings panel) can tell success from failure; none
 * reloads the page.
 *
 * `writeDefaultPaletteFlow` is the single place the default-vs-edited write routing (a palette's
 * structure lives only on its `$default` node — see the module's own docblock below) is encoded.
 * Every structural flow in this file funnels through it; only `saveSwatchEditsFlow`'s color half
 * and `revertSwatchFlow` ever write the palette being edited — both are per-palette VALUE writes
 * (a delta, or the removal of one), never a structure change, which is why neither goes through
 * `writeDefaultPaletteFlow`.
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
	deleteSwatch,
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
	removeGroupFromGroups,
	removeSwatchFromGroups,
	renameGroupInGroups,
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
 * @param {Function} args.onReceive    Called with the write's own raw response (the flat
 *                                     embedded-array wire rows), once the write succeeds.
 * @param {Function} args.refreshFeed  Replaces the feed for a slug.
 * @param {Function} args.onBusy       Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError      Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the write, `onReceive`, and the feed refresh complete;
 *                          rejects on failure after `onError`/`onBusy` have run.
 */
export function writeDefaultPaletteFlow({ namespace, slug, defaultId, edit, onReceive, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return fetchPalette(namespace, defaultId, slug)
		.then((view) => {
			const groups = edit(stripEffectiveFlags(view.groups));

			return savePalette(namespace, defaultId, { label: view.label, groups }, slug);
		})
		.then((rows) => onReceive(rows))
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}

/**
 * Save the settings panel's edits for a swatch: a label change (a structure edit, written through
 * the targeted swatch endpoint against the default palette — the server only accepts a `label`
 * field when the target id is the default palette) and/or a value change (written to the palette
 * being edited via the same granular per-swatch endpoint). A label change runs before a value
 * change when both are dirty; either way there is exactly one `onReceive` and one `refreshFeed` for
 * the whole save.
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
 * @param {Function} args.onReceive   Called with the last dirty write's own raw response (the flat
 *                                    embedded-array wire rows), once every dirty write succeeds.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves immediately, with no request, when neither field changed;
 *                          otherwise resolves once every dirty write, `onReceive`, and the feed
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
	onReceive,
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
		chain = chain.then(() => saveSwatch(namespace, defaultId, token, { label: draft.label }, slug));
	}

	if (recolored) {
		chain = chain.then(() => saveSwatch(namespace, editingId, token, { value: draft.value }, slug));
	}

	return chain
		.then((rows) => onReceive(rows))
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
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
 * @param {Function} args.onReceive   Called with the write's own raw response (the flat
 *                                    embedded-array wire rows) — carrying the activated palette
 *                                    already flagged `is_current`, so no separate confirmation
 *                                    step is needed to learn which id the server resolved.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the pointer has moved, `onReceive` has run, and the feed
 *                          refreshed; rejects on failure after `onError`/`onBusy` have run.
 */
export function activatePaletteFlow({ namespace, slug, id, onReceive, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return setCurrentPalette(namespace, id, slug)
		.then((rows) => onReceive(rows))
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			// Re-thrown so the confirmation modal can tell success from failure and knows
			// whether to close itself.
			throw err;
		});
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
 * @param {Function} args.onReceive   Called with the write's own raw response (the flat
 *                                    embedded-array wire rows) — run BEFORE `openPalette` so the
 *                                    fresh listing already carries the new row by the time
 *                                    `editingId` moves onto it (see the ordering note below).
 * @param {Function} args.openPalette Opens a palette for editing (`hooks/use-palettes.js`'s
 *                                    `openPalette`, a pure navigation that writes the new id into
 *                                    the route's `scope`, bound to the new id).
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
 * @return {Promise<void>} Resolves once the palette is created, `onReceive` has run, and the new
 *                          palette opened for editing; rejects on an empty or duplicate label, or a
 *                          request failure, after `onError` has already run.
 */
export function createPaletteFlow({
	namespace,
	slug,
	label,
	listing,
	onReceive,
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
			// `onReceive` runs BEFORE `openPalette`, not after: it dispatches the fresh listing — which
			// already carries the new row — so `openPalette` moves `editingId` onto that row with the
			// listing already populated, and the dropdown can resolve its label and render it as a real
			// option instead of falling back to the raw id. Running it after `openPalette` instead would
			// leave the dropdown showing the new, still-missing-from-the-list id for one render.
			.then((rows) => refreshFeed(slug).then(() => onReceive(rows)))
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
 * @param {Function} args.onReceive   Called with the FINAL write's own raw response (the delete's,
 *                                    not the successor activation's — the activation's response
 *                                    would already be stale by the time the delete completes).
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the activation, delete, `onReceive`, and feed refresh
 *                          complete; rejects on a missing successor or a request failure, after
 *                          `onError`/`onBusy` have run.
 */
export function deletePaletteFlow({
	namespace,
	slug,
	id,
	currentId,
	successorId,
	onReceive,
	refreshFeed,
	onBusy,
	onError,
}) {
	const needsSuccessor = id === currentId;

	if (needsSuccessor && !successorId) {
		const message = __('Choose which palette your site should use instead.', 'kadence-blocks');
		onError({ message });
		return Promise.reject(new Error(message));
	}

	onBusy(true);

	const activation = needsSuccessor ? setCurrentPalette(namespace, successorId, slug) : Promise.resolve();

	return activation
		.then(() => deletePalette(namespace, id, slug))
		.then((rows) => onReceive(rows))
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
 * @param {Function} args.onReceive   Called with the write's own raw response (the flat
 *                                    embedded-array wire rows), so the dropdown's label
 *                                    updates immediately.
 * @param {Function} args.refreshFeed Replaces the feed for a slug, so its version token matches the
 *                                    document this write just bumped.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure or invalid input.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the rename and `onReceive` complete; rejects on an
 *                          empty or duplicate label, or a request failure, after `onError` has
 *                          already run.
 */
export function renamePaletteFlow({ namespace, slug, id, label, listing, onReceive, refreshFeed, onBusy, onError }) {
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
		.then((rows) => refreshFeed(slug).then(() => onReceive(rows)))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
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
 * @param {Function}       args.onReceive     Called with the write's own raw response (the flat
 *                                            embedded-array wire rows), once the write succeeds.
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
	onReceive,
	refreshFeed,
	onBusy,
	onError,
}) {
	return writeDefaultPaletteFlow({
		namespace,
		slug,
		defaultId,
		edit: (groups) => reorderGroupSwatches(groups, groupId, orderedTokens),
		onReceive,
		refreshFeed,
		onBusy,
		onError,
	});
}

/**
 * Revert a NON-default palette's own override for a token back to inherited: a per-palette VALUE
 * write, not a structure change, so unlike every flow above it never touches the default palette's
 * groups — `id` here is the palette actually being edited. The backend rejects `id === defaultId`
 * with a 400 (the default palette has nothing to inherit from), so this flow is only ever the
 * right choice when `use-palettes.js`'s `resetSwatch` confirms the palette being edited isn't the
 * default one; `removeSwatchFlow` below covers the other case (removing the swatch's definition
 * entirely, always against the default palette, for a user-created token).
 *
 * @param {Object}   args
 * @param {string}   args.namespace  The REST namespace.
 * @param {string}   args.slug       The token library slug.
 * @param {string}   args.id         The palette id being reverted — never the default palette.
 * @param {string}   args.token      The swatch token dot-path to revert.
 * @param {Function} args.onReceive  Called with the write's own raw response (the flat
 *                                   embedded-array wire rows), once the write succeeds.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy     Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError    Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the write, `onReceive`, and the feed refresh complete;
 *                          rejects on failure after `onError`/`onBusy` have run.
 */
export function revertSwatchFlow({ namespace, slug, id, token, onReceive, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return deleteSwatch(namespace, id, token, slug)
		.then((rows) => onReceive(rows))
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
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
 * @param {Function} args.onReceive     Called with the row-removal write's own raw response (the
 *                                      flat embedded-array wire rows), once the write succeeds.
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
	onReceive,
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
		.then((rows) => onReceive(rows))
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
 * The swatch's identity (`colorSlug`/`value`/`label`) is computed by the caller, not here — see
 * `hooks/use-palettes.js`'s `addColor`, which needs the same identity to apply an optimistic
 * addition to the overlay store BEFORE this flow's write resolves, and must use the exact values
 * this flow ends up writing rather than a second, independently-computed guess.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.defaultId   The listing's `$default` palette id.
 * @param {string}   args.groupId     The group to append the new swatch to.
 * @param {string}   args.colorSlug   The minted primitive's slug (not the full token dot-path).
 * @param {string}   args.value       The minted swatch's starting `$value`.
 * @param {string}   args.label       The minted swatch's starting label.
 * @param {string}   args.feedVersion The feed's current version, sent as the primitive create's
 *                                    concurrency guard.
 * @param {Function} args.onReceive   Called with the write's own raw response (the flat
 *                                    embedded-array wire rows), once the write succeeds.
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
	colorSlug,
	value,
	label,
	feedVersion,
	onReceive,
	refreshFeed,
	onBusy,
	onError,
}) {
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
				onReceive,
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
 * `groupId`/`colorSlug`/`value`/`swatchLabel` are computed and validated by the caller, not here —
 * see `hooks/use-palettes.js`'s `addGroup`, which validates via `helpers/palettes.js`'s
 * `validateNewGroupLabel` and needs the same identity to apply an optimistic addition to the
 * overlay store before this flow's write resolves.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.defaultId   The listing's `$default` palette id.
 * @param {string}   args.groupId     The new group's (already-validated, already-slugified) id.
 * @param {string}   args.label       The typed group label.
 * @param {string}   args.colorSlug   The minted primitive's slug for the group's first swatch.
 * @param {string}   args.value       The minted swatch's starting `$value`.
 * @param {string}   args.swatchLabel The minted swatch's starting label.
 * @param {string}   args.feedVersion The feed's current version, sent as the primitive create's
 *                                    concurrency guard.
 * @param {Function} args.onReceive   Called with the write's own raw response (the flat
 *                                    embedded-array wire rows), once the write succeeds.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the new group's first swatch's token id; rejects on a
 *                            request failure, after `onError`/`onBusy` have run.
 */
export function addGroupFlow({
	namespace,
	slug,
	defaultId,
	groupId,
	label,
	colorSlug,
	value,
	swatchLabel,
	feedVersion,
	onReceive,
	refreshFeed,
	onBusy,
	onError,
}) {
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
				onReceive,
				refreshFeed,
				onBusy,
				onError,
			})
		)
		.then(() => token);
}

/**
 * Rename a color group — a structure edit, written to the default palette node. Label only: the
 * group's id is immutable, because `template_slot_for()` places minted swatches by group id and
 * every non-default palette's stored deltas key their groups by the same ids — changing the id
 * would silently misfile future colors and orphan existing deltas.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   The REST namespace.
 * @param {string}   args.slug        The token library slug.
 * @param {string}   args.defaultId   The listing's `$default` palette id.
 * @param {string}   args.groupId     The group id to rename.
 * @param {string}   args.label       The new label.
 * @param {Function} args.onReceive   Called with the write's own raw response (the flat
 *                                    embedded-array wire rows), once the write succeeds.
 * @param {Function} args.refreshFeed Replaces the feed for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the chain starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} See `writeDefaultPaletteFlow`.
 */
export function renameGroupFlow({
	namespace,
	slug,
	defaultId,
	groupId,
	label,
	onReceive,
	refreshFeed,
	onBusy,
	onError,
}) {
	return writeDefaultPaletteFlow({
		namespace,
		slug,
		defaultId,
		edit: (groups) => renameGroupInGroups(groups, groupId, label),
		onReceive,
		refreshFeed,
		onBusy,
		onError,
	});
}

/**
 * Remove a color group and every swatch in it: strips the group from the default palette's
 * structure first, then — for each user-created token the group carried — best-effort deletes
 * the underlying primitive, one at a time.
 *
 * Same load-bearing order as `removeSwatchFlow`, for the same reason: `Token_Reference_Policy`
 * never scans palette swatches, so nothing server-side blocks deleting a primitive a palette
 * still references — safety comes entirely from the group-removal write landing first, which
 * removes every one of its tokens from every palette's effective view before any primitive
 * delete runs. Each cleanup delete swallows its own failure and refreshes the feed regardless,
 * so a token that is legitimately blocked (aliased outside the palette layer) neither reverses
 * the group removal nor wedges the deletes after it on a stale version.
 *
 * @param {Object}        args
 * @param {string}        args.namespace         The REST namespace.
 * @param {string}        args.slug              The token library slug.
 * @param {string}        args.defaultId         The listing's `$default` palette id.
 * @param {string}        args.groupId           The group id to remove.
 * @param {Array<string>} args.userCreatedTokens The group's user-created swatch tokens — gates
 *                                               ONLY the cleanup steps, never the group removal.
 * @param {Function}      args.onReceive         Called with the group-removal write's own raw
 *                                               response (the flat embedded-array wire rows),
 *                                               once the write succeeds.
 * @param {Function}      args.refreshFeed       Replaces the feed for a slug; resolves with the
 *                                               fresh feed payload, whose `version` each cleanup
 *                                               delete needs.
 * @param {Function}      args.onBusy            Called with a boolean as the chain starts and settles.
 * @param {Function}      args.onError           Called with `{ message }` on failure of the
 *                                               group-removal write.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the group-removal write and every best-effort cleanup
 *                          attempt settle; rejects only when the group-removal write itself
 *                          fails (e.g. the last-group 400), after `onError`/`onBusy` have run.
 */
export function removeGroupFlow({
	namespace,
	slug,
	defaultId,
	groupId,
	userCreatedTokens,
	onReceive,
	refreshFeed,
	onBusy,
	onError,
}) {
	onBusy(true);

	return fetchPalette(namespace, defaultId, slug)
		.then((view) => {
			const groups = removeGroupFromGroups(stripEffectiveFlags(view.groups), groupId);

			return savePalette(namespace, defaultId, { label: view.label, groups }, slug);
		})
		.then((rows) => onReceive(rows))
		.then(() => refreshFeed(slug))
		.then((freshFeed) => {
			let chain = Promise.resolve(freshFeed);

			userCreatedTokens.forEach((token) => {
				chain = chain
					.then((feed) =>
						deleteUserPrimitive(slug, token, feed?.version).catch(() => {
							// Best-effort: a cleanup failure never reverses the group removal and
							// never blocks the deletes after it.
						})
					)
					.then(() => refreshFeed(slug));
			});

			return chain.then(() => onBusy(false));
		})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);
			throw err;
		});
}
