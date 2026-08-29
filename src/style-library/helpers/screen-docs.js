/**
 * The screen-docs lookup: the single `applyFilters` call site for `SCREEN_DOCS_FILTER`, and the
 * one place that decides whether an entry is usable.
 */

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { SCREEN_DOCS, SCREEN_DOCS_FILTER } from '../constants/screen-docs';

/**
 * Whether a value is a documentation URL this app is willing to put in an `href`. A filter
 * listener is third-party code and a screen id comes off the URL bar, so the scheme is checked
 * here rather than trusted at the render site.
 *
 * @param {*} value The candidate URL.
 *
 * @since TBD
 *
 * @return {boolean} True for an http(s) URL.
 */
function isLinkableUrl(value) {
	if (typeof value !== 'string') {
		return false;
	}

	try {
		const { protocol } = new URL(value);

		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * The helper copy for a screen, or null when the screen has none.
 *
 * `Object.hasOwn`, not a bare index read: the screen id comes from `?kb-screen=` and
 * `'constructor'` would otherwise resolve to an inherited property.
 *
 * @param {string} screenId The screen id from the route.
 *
 * @since TBD
 *
 * @return {?{description: string, docUrl: string}} The entry, or null. `docUrl` is '' when the
 *                                                   entry has no usable link.
 */
export function screenDoc(screenId) {
	if (typeof screenId !== 'string' || screenId === '') {
		return null;
	}

	/**
	 * Filters the Style Library's per-screen helper copy and documentation links.
	 *
	 * @param {Object} docs screenId => `{ description, docUrl }`.
	 */
	const docs = applyFilters(SCREEN_DOCS_FILTER, SCREEN_DOCS);

	if (!docs || !Object.hasOwn(docs, screenId)) {
		return null;
	}

	const doc = docs[screenId];

	if (!doc || typeof doc.description !== 'string' || doc.description === '') {
		return null;
	}

	return {
		description: doc.description,
		docUrl: isLinkableUrl(doc.docUrl) ? doc.docUrl : '',
	};
}
