/**
 * Pure query-string <-> route mapping for the Style Library app.
 *
 * The route is two args layered onto the wp-admin URL: the active nav screen and the open
 * settings-panel target. This URL is shared wp-admin real estate — core, the active theme, and
 * every other active plugin can read or rewrite its query args — so the arg names are
 * plugin-namespaced (`kb-screen` / `kb-item`) rather than bare `screen` / `item`. Do not
 * "simplify" them back to the generic form; a bare name is not safe to own on this URL. Everything
 * else on the URL — `page=` above all — is preserved untouched.
 */

/**
 * WordPress dependencies
 */
import { addQueryArgs, getQueryArg, removeQueryArgs } from '@wordpress/url';

/**
 * The query-string arg holding the active screen id. Namespaced (`kb-` prefix) because this URL
 * is shared wp-admin real estate — see the module docblock.
 *
 * @since TBD
 */
export const SCREEN_QUERY_ARG = 'kb-screen';

/**
 * The query-string arg holding the open settings-panel target. Namespaced (`kb-` prefix) because
 * this URL is shared wp-admin real estate — see the module docblock.
 *
 * @since TBD
 */
export const ITEM_QUERY_ARG = 'kb-item';

/**
 * Parse a URL (or search string) into the app route.
 *
 * @param {string} url The current URL or search string.
 *
 * @since TBD
 *
 * @return {{screen: string, item: string}} The route; empty strings when an arg is absent.
 */
export function parseRoute(url) {
	return {
		screen: String(getQueryArg(url, SCREEN_QUERY_ARG) || ''),
		item: String(getQueryArg(url, ITEM_QUERY_ARG) || ''),
	};
}

/**
 * Serialize a route onto an existing URL, preserving every unrelated query arg. An empty or
 * missing route field removes its arg instead of writing `screen=`.
 *
 * @param {{screen?: string, item?: string}} route The route to write.
 * @param {string}                           url   The URL to layer it onto.
 *
 * @since TBD
 *
 * @return {string} The updated URL.
 */
export function serializeRoute(route, url) {
	const cleared = removeQueryArgs(url, SCREEN_QUERY_ARG, ITEM_QUERY_ARG);
	const args = {};

	if (route && route.screen) {
		args[SCREEN_QUERY_ARG] = route.screen;
	}

	if (route && route.item) {
		args[ITEM_QUERY_ARG] = route.item;
	}

	return Object.keys(args).length ? addQueryArgs(cleared, args) : cleared;
}
