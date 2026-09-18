/**
 * Pure query-string <-> route mapping for the Style Library app.
 *
 * The route is three args layered onto the wp-admin URL: the active nav screen, the open
 * settings-panel target, and — between them — a screen-owned sub-selection, `scope`. `scope`
 * means "what `item` is relative to, within the active screen": Color Palette reads it as the
 * palette being edited; a screen with no notion of a sub-selection simply never reads it and it
 * sits unused. This module stays generic on purpose — it must never name a specific screen's
 * meaning for `scope`, in code, in a variable name, or in a comment; the whole point of the arg is
 * that a future screen can claim it for something else entirely without touching this file.
 *
 * This URL is shared wp-admin real estate — core, the active theme, and every other active plugin
 * can read or rewrite its query args — so the arg names are plugin-namespaced (`kb-screen` /
 * `kb-scope` / `kb-item`) rather than bare `screen` / `scope` / `item`. Do not "simplify" them
 * back to the generic form; a bare name is not safe to own on this URL. Everything else on the
 * URL — `page=` above all — is preserved untouched.
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
 * The query-string arg holding the active screen's own sub-selection. Namespaced (`kb-` prefix)
 * because this URL is shared wp-admin real estate — see the module docblock.
 *
 * @since TBD
 */
export const SCOPE_QUERY_ARG = 'kb-scope';

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
 * @return {{screen: string, scope: string, item: string}} The route; empty strings when an arg is absent.
 */
export function parseRoute(url) {
	return {
		screen: String(getQueryArg(url, SCREEN_QUERY_ARG) || ''),
		scope: String(getQueryArg(url, SCOPE_QUERY_ARG) || ''),
		item: String(getQueryArg(url, ITEM_QUERY_ARG) || ''),
	};
}

/**
 * Serialize a route onto an existing URL, preserving every unrelated query arg. An empty or
 * missing route field removes its arg instead of writing `screen=`.
 *
 * @param {{screen?: string, scope?: string, item?: string}} route The route to write.
 * @param {string}                                            url   The URL to layer it onto.
 *
 * @since TBD
 *
 * @return {string} The updated URL.
 */
export function serializeRoute(route, url) {
	const cleared = removeQueryArgs(url, SCREEN_QUERY_ARG, SCOPE_QUERY_ARG, ITEM_QUERY_ARG);
	const args = {};

	if (route && route.screen) {
		args[SCREEN_QUERY_ARG] = route.screen;
	}

	if (route && route.scope) {
		args[SCOPE_QUERY_ARG] = route.scope;
	}

	if (route && route.item) {
		args[ITEM_QUERY_ARG] = route.item;
	}

	return Object.keys(args).length ? addQueryArgs(cleared, args) : cleared;
}
