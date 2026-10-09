/**
 * Pure orchestration for the Typography screen's favorite-font write flows: adding a picked catalog
 * family to the library's favorites, and removing one. Same `scale-flows.js` discipline: the REST
 * call is imported here (so a test mocks `api/client`), the caller supplies busy/error callbacks and
 * a feed refresh, and each flow settles pessimistically and re-throws on failure.
 *
 * A favorite is not a token, so neither flow mints or deletes anything in the registry — the family
 * name is stored verbatim in the document's `favoriteFonts` section and read back by every font
 * picker. That is the whole model: no alias, no CSS variable, no indirection to re-point.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { addFavoriteFont, removeFavoriteFont } from '../api/client';

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
 * Add a picked catalog family to the library's favorites, then refresh the feed so every reader of
 * `feed.favoriteFonts` sees it.
 *
 * @param {Object}   args
 * @param {string}   args.name        The picked catalog family name, verbatim.
 * @param {string}   args.slug        Token library slug.
 * @param {string}   args.feedVersion The version token the client last read.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the added family name; rejects on failure, after
 *                            `onError`/`onBusy` have already run.
 */
export function addFavoriteFontFlow({ name, slug, feedVersion, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return addFavoriteFont(slug, name, { version: feedVersion })
		.then(() => refreshFeed(slug))
		.then(() => {
			onBusy(false);
			return name;
		})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}

/**
 * Remove a family from the library's favorites, then refresh the feed.
 *
 * @param {Object}   args
 * @param {string}   args.name        The family name to un-star, verbatim.
 * @param {string}   args.slug        Token library slug.
 * @param {string}   args.feedVersion The version token the client last read.
 * @param {Function} args.refreshFeed Replaces the feed with a fresh REST read for a slug.
 * @param {Function} args.onBusy      Called with a boolean as the request starts and settles.
 * @param {Function} args.onError     Called with `{ message }` on failure.
 *
 * @since TBD
 *
 * @return {Promise<string>} Resolves with the removed family name; rejects on failure, after
 *                            `onError`/`onBusy` have already run.
 */
export function removeFavoriteFontFlow({ name, slug, feedVersion, refreshFeed, onBusy, onError }) {
	onBusy(true);

	return removeFavoriteFont(slug, name, { version: feedVersion })
		.then(() => refreshFeed(slug))
		.then(() => {
			onBusy(false);
			return name;
		})
		.catch((err) => {
			onError({ message: errorMessage(err) });
			onBusy(false);

			throw err;
		});
}
