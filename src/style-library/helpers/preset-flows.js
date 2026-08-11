/**
 * Pure orchestration for the Button preset screen's three write flows: create, save (which also
 * covers rename — a preset's label and token map are always written together), and delete. Same
 * `scale-flows.js` discipline: the REST call is imported here (so a test mocks `api/client`), the
 * caller supplies busy/error callbacks and a feed refresh, and every flow settles pessimistically
 * and re-throws on failure. Unlike the scale flows, no write here carries a `version` parameter —
 * the preset write routes have no optimistic-concurrency check (fact 15 of the plan overview), so
 * there is no 409 handling to thread through.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { deleteBlockPreset, saveBlockPreset } from '../api/client';
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
 * @param {string}                 args.namespace     REST namespace.
 * @param {string}                 args.block         The block name, e.g. `kadence/singlebtn`.
 * @param {string[]}               args.existingSlugs The preset slugs already taken.
 * @param {Record<string, string>} args.defaultTokens  The `$default` preset's seeded id map
 *                                                       (bare ids, as `presetInitialValues` returns).
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
	namespace,
	block,
	existingSlugs,
	defaultTokens,
	slug,
	refreshFeed,
	onBusy,
	onError,
}) {
	onBusy(true);

	const preset = nextPresetSlug(existingSlugs, 'button');

	return saveBlockPreset(
		namespace,
		block,
		{ preset, label: __('New Button', 'kadence-blocks'), tokens: presetSaveTokens(defaultTokens) },
		slug
	)
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
 * @param {string} args.slug          Token library slug.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once an unchanged draft is skipped, or the write and feed
 *                          refresh complete; rejects on failure, after `onError`/`onBusy` have
 *                          already run.
 */
export function savePresetFlow({ namespace, block, preset, draft, initialValues, slug, refreshFeed, onBusy, onError }) {
	if (isEqual(draft, initialValues)) {
		return Promise.resolve();
	}

	onBusy(true);

	return saveBlockPreset(
		namespace,
		block,
		{ preset, label: draft.label, tokens: presetSaveTokens(draft.tokens) },
		slug
	)
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
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
