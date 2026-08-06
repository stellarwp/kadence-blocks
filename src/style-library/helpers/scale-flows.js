/**
 * Pure orchestration for the four scale-screen write flows shared by Border Radius, Border Width,
 * Spacing, and Icon Sizes: mint, save, delete, and reorder. Each flow takes the REST calls it needs
 * (imported here, so a test mocks `api/client`) plus a small set of injected callbacks for the
 * state a caller reacts to (busy, error, and a feed refresh) — the same `library-flows.js`
 * discipline: every flow settles pessimistically and re-throws on failure so its caller
 * (`hooks/use-scale-screen`) can tell success from failure, and none of them reloads the page.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createUserPrimitive, deleteUserPrimitive, saveTokenLeaf, setGroupOrder, setTokenLabel } from '../api/client';
import { isEqual } from './settings-schema';
import { buildTokenLeaf } from './tokens';
import { customScaleTokenId, nextScaleSlug } from './scale';

/**
 * Read the message off a REST error, falling back to a generic string when the error carries none
 * (e.g. a network failure `apiFetch` surfaces as a plain thrown value). Duplicated from
 * `library-flows.js`'s identical helper rather than imported — the two flow modules cover
 * unrelated concerns (library management vs. token editing) and stay independent on purpose.
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
 * Mint a new custom scale token: pick the first free slug, create it with the stable group key
 * (decision 3 — the translated group label never enters a write payload), refresh the feed, and
 * resolve the new token's canonical id so the caller can open its settings panel.
 *
 * @param {Object}   args
 * @param {string}   args.groupKey     The stable machine group key (e.g. `'border-radius'`).
 * @param {string}   args.tokenType    The DTCG `$type` for the minted primitive.
 * @param {string}   args.slugBase     The slug stem for the minted token.
 * @param {string}   args.label        The minted token's starting label.
 * @param {string}   args.value        The minted token's starting `$value`.
 * @param {string[]} args.existingIds  Every canonical id already registered, for slug collision.
 * @param {string}   args.slug         Token library slug.
 * @param {string}   args.feedVersion  The version token the client last read.
 * @param {Function} args.refreshFeed  Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy       Called with a boolean as the request starts and settles.
 * @param {Function} args.onError      Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the new token's canonical id; rejects on failure, after
 *                            `onError`/`onBusy` have already run.
 */
export function addScaleTokenFlow({
	groupKey,
	tokenType,
	slugBase,
	label,
	value,
	existingIds,
	slug,
	feedVersion,
	refreshFeed,
	onBusy,
	onError,
}) {
	onBusy(true);

	const terminalSlug = nextScaleSlug(existingIds, slugBase);
	const id = customScaleTokenId(tokenType, terminalSlug);

	return createUserPrimitive(slug, {
		id: terminalSlug,
		$type: tokenType,
		$value: value,
		label,
		group: groupKey,
		version: feedVersion,
	})
		.then(() => refreshFeed(slug))
		.then(() => {
			onBusy(false);
			return id;
		})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}

/**
 * Save a scale token's edited label and/or value. Writes only what changed: the label write (which
 * checks the version) always runs before the value write (which does not) when both changed — a
 * leaf PUT bumps the document version, so running it second avoids invalidating the `feedVersion`
 * the label PUT is about to send inside the same Save. A no-change call resolves without issuing a
 * request.
 *
 * @param {Object}   args
 * @param {string}   args.slug        Token library slug.
 * @param {string}   args.namespace   REST namespace for the token-leaf write.
 * @param {string}   args.tokenId     The token's canonical dot-path id.
 * @param {string}   args.tokenType   The DTCG `$type`, for building the leaf payload.
 * @param {Object}   args.draft       The panel's current draft (`{ label, value }`).
 * @param {Object}   args.initial     The values the draft is compared against (`{ label, value }`).
 * @param {string}   args.feedVersion The version token the client last read.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once every changed write (and the feed refresh) completes;
 *                          rejects on failure, after `onError`/`onBusy` have already run.
 */
export function saveScaleTokenFlow({
	slug,
	namespace,
	tokenId,
	tokenType,
	draft,
	initial,
	feedVersion,
	refreshFeed,
	onBusy,
	onError,
}) {
	const labelChanged = draft.label !== initial.label;
	const valueChanged = !isEqual(draft.value, initial.value);

	if (!labelChanged && !valueChanged) {
		return Promise.resolve();
	}

	onBusy(true);

	let chain = Promise.resolve();

	if (labelChanged) {
		chain = chain.then(() => setTokenLabel(slug, tokenId, { label: draft.label, version: feedVersion }));
	}

	if (valueChanged) {
		chain = chain.then(() => saveTokenLeaf(namespace, tokenId, buildTokenLeaf(tokenType, draft.value), slug));
	}

	return chain
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}

/**
 * Delete a user-created scale token.
 *
 * @param {Object}   args
 * @param {string}   args.slug        Token library slug.
 * @param {string}   args.tokenId     The token's canonical dot-path id.
 * @param {string}   args.feedVersion The version token the client last read.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the delete and the feed refresh complete; rejects on
 *                          failure, after `onError`/`onBusy` have already run.
 */
export function deleteScaleTokenFlow({ slug, tokenId, feedVersion, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return deleteUserPrimitive(slug, tokenId, feedVersion)
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}

/**
 * Persist a group's full reorder. The full ordered id list is always sent — the server prunes any
 * foreign id itself, so this flow never has to know which ids belong to the group.
 *
 * @param {Object}   args
 * @param {string}   args.slug        Token library slug.
 * @param {string}   args.group       The UI-schema group label (the order route's address).
 * @param {string[]} args.orderedIds  The full ordered id list for the group.
 * @param {string}   args.feedVersion The version token the client last read.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the order write and the feed refresh complete; rejects on
 *                          failure, after `onError`/`onBusy` have already run.
 */
export function reorderScaleTokensFlow({ slug, group, orderedIds, feedVersion, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return setGroupOrder(slug, group, { order: orderedIds, version: feedVersion })
		.then(() => refreshFeed(slug))
		.then(() => onBusy(false))
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}
