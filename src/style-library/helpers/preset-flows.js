/**
 * Pure orchestration for the Button preset screen's write flows: create, save (which also covers
 * rename — a preset's label and token map are always written together), delete, and reorder. Same
 * `scale-flows.js` discipline: the REST call is imported here (so a test mocks `api/client`), the
 * caller supplies busy/error callbacks and a feed refresh, and every flow settles pessimistically
 * and re-throws on failure. Create/save/delete carry no `version` parameter — the preset write
 * routes have no optimistic-concurrency check for those verbs (fact 15 of the plan overview) — but
 * reorder is the one exception: the display-order sub-route DOES guard the client version (the
 * `reorderScaleTokensFlow` shape), since two rapid drags racing each other's refresh is exactly the
 * case that guard exists to catch.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { deleteBlockPreset, saveBlockPreset, setBlockPresetOrder } from '../api/client';
import { isEqual } from './settings-schema';
import { nextPresetSlug, presetSaveTokens } from './presets';

/**
 * Read the message off a REST error, falling back to a generic string when the error carries
 * none. Duplicated from `scale-flows.js`'s identical helper rather than imported — the flow
 * modules stay independent on purpose.
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
 * Mint a new button preset as a visible, editable copy of the default preset: pick the first free
 * slug, POST it with the default preset's five bound properties, refresh the feed, and resolve
 * the new preset's slug so the caller can open its settings panel.
 *
 * @param {Object}                 args
 * @param {string}                 args.slugBase      The stem new slugs are minted from, e.g. `'button'`.
 * @param {string}                 args.namespace     REST namespace.
 * @param {string}                 args.block         The block name, e.g. `kadence/singlebtn`.
 * @param {string[]}               args.existingSlugs The preset slugs already taken.
 * @param {Record<string, string>} args.defaultTokens  The `$default` preset's seeded id map
 *                                                       (bare ids, as `presetInitialValues` returns).
 * @param {string}                 args.newLabel      The label a freshly minted preset carries. Passed
 *                                                       in rather than fixed here, since this flow mints
 *                                                       presets for whichever block the caller names.
 * @param {string}                 args.slug          Token library slug.
 * @param {Function}               args.refreshFeed   Replaces the feed with a fresh REST read for a slug.
 * @param {Function}               args.onBusy        Called with a boolean as the request starts and settles.
 * @param {Function}               args.onError       Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the new preset's slug; rejects on failure, after
 *                            `onError`/`onBusy` have already run.
 */
export function createPresetFlow({
	slugBase,
	namespace,
	block,
	existingSlugs,
	defaultTokens,
	newLabel,
	slug,
	refreshFeed,
	onBusy,
	onError,
}) {
	onBusy(true);

	const preset = nextPresetSlug(existingSlugs, slugBase);

	return saveBlockPreset(namespace, block, { preset, label: newLabel, tokens: presetSaveTokens(defaultTokens) }, slug)
		.then(() => refreshFeed(slug))
		.then(() => {
			onBusy(false);
			return preset;
		})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}

/**
 * Save a preset's label and token map in one write — the panel's Save button and a NAME rename
 * both go through this flow. Skips the request entirely when the draft is unchanged; otherwise
 * always sends the full label + token map together, so a rename never has to omit `tokens` to
 * avoid clobbering it.
 *
 * @param {Object} args
 * @param {string} args.namespace     REST namespace.
 * @param {string} args.block         The block name, e.g. `kadence/singlebtn`.
 * @param {string} args.preset        The preset slug being saved.
 * @param {Object} args.draft         The panel's current draft (`{ label, tokens }`).
 * @param {Object} args.initialValues The values the draft is compared against (`{ label, tokens }`).
 * @param {Record<string, *>} [args.storedTokens] The preset's raw stored token map
 *                                                 (`presetStoredTokens`); an untouched property is
 *                                                 carried over from here byte-for-byte rather than
 *                                                 rebuilt from the draft's bare-id seed, so a save
 *                                                 that only edits, say, the label never flattens a
 *                                                 per-corner slot list or a responsive envelope into
 *                                                 a plain alias. Defaults to `{}`.
 * @param {string} args.slug          Token library slug.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<?Object>} Resolves with the preset payload the write returned — the same shape a
 *                             read returns, carrying the server's normalized tokens — or null when an
 *                             unchanged draft was skipped. Rejects on failure, after `onError`/`onBusy`
 *                             have already run.
 */
export function savePresetFlow({
	namespace,
	block,
	preset,
	draft,
	initialValues,
	storedTokens = {},
	slug,
	refreshFeed,
	onBusy,
	onError,
}) {
	if (isEqual(draft, initialValues)) {
		return Promise.resolve(null);
	}

	onBusy(true);

	return (
		saveBlockPreset(
			namespace,
			block,
			{ preset, label: draft.label, tokens: presetSaveTokens(draft.tokens, initialValues?.tokens, storedTokens) },
			slug
		)
			// The write already answers with what it stored, normalized. Carrying it past the refresh is what
			// lets the panel seed from the truth instead of guessing at the server's rewrites.
			.then((response) => refreshFeed(slug).then(() => response))
			.then((response) => {
				onBusy(false);

				return response;
			})
			.catch((err) => {
				onError({ message: errorMessage(err) });
				onBusy(false);

				throw err;
			})
	);
}

/**
 * Delete a user-created button preset. The server rejects deleting whatever the effective
 * `$default` names with a 422 (`guard_default_present`) — that response's own message is
 * surfaced through `onError` unchanged, never swallowed.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   REST namespace.
 * @param {string}   args.block       The block name, e.g. `kadence/singlebtn`.
 * @param {string}   args.preset      The preset slug to delete.
 * @param {string}   args.slug        Token library slug.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the delete and the feed refresh complete; rejects on
 *                          failure, after `onError`/`onBusy` have already run.
 */
export function deletePresetFlow({ namespace, block, preset, slug, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return deleteBlockPreset(namespace, block, preset, slug)
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}

/**
 * Persist a block's full preset display order: PUT the ordered slug list with the version the
 * caller last read, then refresh the feed. The `reorderScaleTokensFlow` shape — the caller is
 * responsible for serializing concurrent calls (see `hooks/use-preset-screen.js`'s reorder chain)
 * so a second rapid drop's write always carries the first drop's refreshed version.
 *
 * @param {Object}   args
 * @param {string}   args.namespace   REST namespace.
 * @param {string}   args.block       The block name, e.g. `kadence/singlebtn`.
 * @param {string[]} args.orderedIds  The preset slugs in their new display order.
 * @param {string}   args.feedVersion The version the client last read.
 * @param {string}   args.slug        Token library slug.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the write and the feed refresh complete; rejects on
 *                          failure, after `onError`/`onBusy` have already run.
 */
export function reorderPresetsFlow({
	namespace,
	block,
	orderedIds,
	feedVersion,
	slug,
	refreshFeed,
	onBusy,
	onError,
	onVersion,
}) {
	onBusy(true);

	return setBlockPresetOrder(namespace, block, { order: orderedIds, version: feedVersion }, slug)
		.then((response) => {
			// Reported straight off the write. The feed refresh below only bumps the library
			// version; the preset payload that carries this one arrives in a later re-read, which
			// a queued second drop would otherwise overtake and 409 against itself.
			if (response && response.version) {
				onVersion(response.version);
			}
		})
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}
