/**
 * Builds the option list shared by the font-family pickers.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Normalize a family name for comparison.
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
 * Builds the picker's option list: custom, theme, favorites, then Google.
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

	const favoriteOptions = favorites
		.filter(unique)
		.map((name) => ({ value: name, label: name, badge: __('Favorite', 'kadence-blocks') }));
	const googleOptions = google.filter(unique).map((name) => ({ value: name, label: name }));
	const customOptions = custom
		.filter(unique)
		.map((name) => ({ value: name, label: name, badge: __('Custom', 'kadence-blocks') }));

	return [...customOptions, ...theme, ...favoriteOptions, ...googleOptions];
}
