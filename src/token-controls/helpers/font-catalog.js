/**
 * The one place the font-family picker's option list is assembled.
 *
 * Three dropdowns list the same fonts: the block editor's Typography and Highlight Font Family fields
 * (both mounted through `src/extension/font-picker`) and the Style Library's Typography screen. Each
 * reads its names from a different global, but what a site's list looks like — what leads, what is
 * badged, what appears once — is decided here, so it cannot drift between them.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Normalize a family name for comparison: trimmed, wrapping quotes removed, case-folded.
 *
 * @param {*} name The family name.
 *
 * @since TBD
 *
 * @return {string} The comparison key, or "" for anything that is not a usable name.
 */
function familyKey(name) {
	return String(name ?? '')
		.trim()
		.replace(/^(["'])(.*)\1$/, '$2')
		.trim()
		.toLowerCase();
}

/**
 * Build the picker's option list.
 *
 * Order, top to bottom: the site's own custom fonts, the theme's global font rows, the favorites,
 * then every Google family. This is the order the shared `TypographyControls` select has always used
 * (custom fonts, then the theme's rows, then the rest), so a site's own faces are never buried under
 * ~1,900 Google names. Favorites sit above Google for the same reason.
 *
 * Every name appears exactly once, matched case-insensitively across favorites, Google and custom. A
 * favorite wins over any other source, so a favorited custom font renders once, as a favorite; a
 * custom font that duplicates a Google one renders once, as the Google one (the server diffs the two
 * lists by exact string, so `inter` beside Google's `Inter` reaches here as two names for one font).
 * Theme rows are exempt: their values are `var()` references, not family names.
 *
 * @param {Object}                                                 sources
 * @param {string[]}                                               [sources.favorites] Favorite family names.
 * @param {string[]}                                               [sources.google]    Google family names.
 * @param {string[]}                                               [sources.custom]    Site-registered family names.
 * @param {Array<{value: string, label: string, badge?: string}>} [sources.theme]     Theme global font rows, already shaped as options.
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string, badge?: string}>} The option list.
 */
export function buildFontCatalogOptions({ favorites = [], google = [], custom = [], theme = [] } = {}) {
	const seen = new Set();
	const unique = (name) => {
		const key = familyKey(name);

		if (key === '' || seen.has(key)) {
			return false;
		}

		seen.add(key);

		return true;
	};

	// Claimed in precedence order (favorite, then Google, then custom), rendered in display order.
	const favoriteOptions = favorites
		.filter(unique)
		.map((name) => ({ value: name, label: name, badge: __('Favorite', 'kadence-blocks') }));
	const googleOptions = google.filter(unique).map((name) => ({ value: name, label: name }));
	const customOptions = custom
		.filter(unique)
		.map((name) => ({ value: name, label: name, badge: __('Custom', 'kadence-blocks') }));

	return [...customOptions, ...theme, ...favoriteOptions, ...googleOptions];
}
