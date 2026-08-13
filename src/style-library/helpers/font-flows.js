/**
 * Pure orchestration for the Typography screen's font-catalog write flow: adding a picked catalog
 * family as a user primitive. Font deletion needs no font-specific flow — it reuses
 * `deleteScaleTokenFlow` verbatim, since deletion is token-generic. Same `scale-flows.js`
 * discipline: the REST call is imported here (so a test mocks `api/client`), the caller supplies
 * busy/error callbacks and a feed refresh, and the flow settles pessimistically and re-throws on
 * failure.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { createUserPrimitive } from '../api/client';
import { customScaleTokenId, nextScaleSlug } from './scale';
import { fontFamilySlug } from './typography';

/**
 * The DTCG `$type` every minted font uses.
 *
 * @since TBD
 */
const FONT_FAMILY_TYPE = 'fontFamily';

/**
 * The stable group key every minted font is filed under (mirrors `declarations.php`'s
 * `group_key: 'font-family'`).
 *
 * @since TBD
 */
const FONT_FAMILY_GROUP_KEY = 'font-family';

/**
 * Read the message off a REST error, falling back to a generic string when the error carries none.
 * Duplicated from `scale-flows.js`'s identical helper rather than imported — the flow modules stay
 * independent on purpose.
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
 * Mint a picked catalog family as a user `fontFamily` primitive: derive a kebab slug from the
 * family name (suffixing on collision, the `nextScaleSlug` idiom applied to the derived stem),
 * create it as a single-family stack with no invented generic fallback (the shipped font arrays
 * carry no category data, so appending one would be a guess), refresh the feed, and resolve the
 * new token's canonical id via the segment-aware `customScaleTokenId` so the caller can preview it
 * immediately.
 *
 * @param {Object}   args
 * @param {string}   args.name        The picked catalog family name, verbatim (becomes the label).
 * @param {string[]} args.existingIds Every canonical id already registered, for slug collision.
 * @param {string}   args.slug        Token library slug.
 * @param {string}   args.feedVersion The version token the client last read.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the new font's canonical id; rejects on failure, after
 *                            `onError`/`onBusy` have already run.
 */
export function addFontFlow({ name, existingIds, slug, feedVersion, refreshFeed, onBusy, onError }) {
	onBusy(true);

	const stem = fontFamilySlug(name);
	const terminalSlug = nextScaleSlug(existingIds, stem);
	const id = customScaleTokenId(FONT_FAMILY_TYPE, terminalSlug);

	return createUserPrimitive(slug, {
		id: terminalSlug,
		$type: FONT_FAMILY_TYPE,
		$value: [name],
		label: name,
		group: FONT_FAMILY_GROUP_KEY,
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
