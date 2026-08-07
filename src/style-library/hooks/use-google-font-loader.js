/**
 * Loads the currently previewed Google font's stylesheet into the page, so the Typography
 * screen's sample text renders in the real face instead of the `system-ui` fallback. Nothing loads
 * font files on the Style Library page otherwise — verified: zero `fonts.googleapis` references
 * under `src/` outside a vendored player — so even the shipped baseline "Inter" preview would
 * silently fall back without this.
 *
 * System families (e.g. Georgia, Menlo) are not in the Google catalog and are skipped by
 * construction (the catalog-membership check below). Custom fonts are also skipped: the
 * names-only custom-fonts filter carries no file URLs, so loading them is the custom-font
 * provider's job, not this hook's — a custom preview renders correctly only when the site already
 * loads those files in wp-admin.
 */

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getFontCatalog } from '../helpers/typography';

/**
 * Every family name a `<link>` has already been injected for, across the whole page's lifetime —
 * module-scoped (not component state) so switching the preview font back and forth never injects a
 * duplicate stylesheet, and a link is never removed once added (browser-cached, cheap to keep).
 *
 * @since TBD
 *
 * @type {Set<string>}
 */
const loadedFamilies = new Set();

/**
 * Inject a Google Fonts stylesheet `<link>` for `familyName`, once, when that family is in the
 * Google catalog.
 *
 * @param {string} familyName The currently previewed font's first family (`fontOptions()`'s
 *                             `label`), or an empty string when nothing is selected yet.
 *
 * @since TBD
 *
 * @return {void}
 */
export function useGoogleFontLoader(familyName) {
	useEffect(() => {
		if (!familyName || loadedFamilies.has(familyName)) {
			return;
		}

		const { google } = getFontCatalog();

		if (!google.includes(familyName)) {
			return;
		}

		loadedFamilies.add(familyName);

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(familyName)}&display=swap`;
		document.head.appendChild(link);
	}, [familyName]);
}
