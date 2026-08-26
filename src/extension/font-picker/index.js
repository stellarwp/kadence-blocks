/**
 * The block editor's font list accessor: the site's favorite families, and the full catalog option
 * list the font-family picker's `Custom` tab searches.
 *
 * A favorite is not a token. Nothing here resolves an alias, reads the pickable-token pool, or emits
 * a CSS variable — a picked family is written to the block attribute verbatim, exactly as the shared
 * `TypographyControls` select has always written it. The only thing favorites buy is position: they
 * sit at the top of the list so a site is not searching ~1,900 names for the same face every time.
 *
 * Two page-load globals feed this, and neither is fetched:
 *
 * - `window.kadenceDesignTokensFonts` — `{ favorites, custom, manageUrl }`, printed by the
 *   design-tokens editor Localizer. `custom` arrives already normalized to family names, because
 *   the raw `c_fonts` shape keys entries by a name OR by a whole font-stack expression, and
 *   `manageUrl` deep-links the Style Library screen that edits the favorites.
 * - `window.kadence_blocks_params.g_font_names` — the ~1,900 Google names the editor already
 *   carries on every screen. Read from there rather than shipped a second time.
 *
 * Because both are page-load values, a favorite added in another tab is not reflected until reload —
 * the same staleness the token pool documents, and harmless for the same reason: the value written
 * is the family name itself, which cannot go stale.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * The muted badge a site-registered custom font carries in the catalog list, matching the Style
 * Library's Typography screen.
 *
 * @since TBD
 */
const CUSTOM_BADGE = __('Custom', 'kadence-blocks');

/**
 * The muted badge a favorite carries where it sits pinned above the catalog.
 *
 * @since TBD
 */
const FAVORITE_BADGE = __('Favorite', 'kadence-blocks');

/**
 * Read the design-tokens font global. Fail-safe on a missing or malformed global, mirroring the
 * token pool's posture — a caller never has to null-check before using either list.
 *
 * @since TBD
 *
 * @return {{favorites: string[], custom: string[], manageUrl: string}} The pool, or empty values.
 */
function fontPool() {
	const pool = window.kadenceDesignTokensFonts;

	return {
		favorites: Array.isArray(pool?.favorites) ? pool.favorites : [],
		custom: Array.isArray(pool?.custom) ? pool.custom : [],
		manageUrl: typeof pool?.manageUrl === 'string' ? pool.manageUrl : '',
	};
}

/**
 * The Google family names the editor already localizes, fail-safe to an empty list.
 *
 * @since TBD
 *
 * @return {string[]} The Google family names.
 */
function googleNames() {
	const names = window.kadence_blocks_params?.g_font_names;

	return Array.isArray(names) ? names.filter((name) => typeof name === 'string') : [];
}

/**
 * The site's favorite font families, in stored order, with blank entries dropped.
 *
 * @since TBD
 *
 * @return {string[]} The favorite families.
 */
export function favoriteFonts() {
	return fontPool()
		.favorites.filter((family) => typeof family === 'string' && family.trim() !== '')
		.map((family) => family.trim());
}

/**
 * The font-family picker's full option list: favorites first, then every Google family, then every
 * site-registered custom family.
 *
 * Every name appears exactly once, matched case-insensitively across all three sources: a favorite
 * keeps its pinned position rather than repeating mid-list, and a custom font that duplicates a
 * Google one renders once — the same rule the Style Library's Typography dropdown applies, so the
 * two screens list the same names in the same order.
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string, badge?: string}>} The option list.
 */
export function fontCatalogOptions() {
	// One set across all three sources, not just the favorites. The custom list is diffed against the
	// Google list server-side by exact string, so a theme registering `inter` alongside Google's
	// `Inter` reaches here as two names for one font.
	const seen = new Set();
	const unique = (name) => {
		const key = name.toLowerCase();

		if (seen.has(key)) {
			return false;
		}

		seen.add(key);

		return true;
	};

	const favorites = favoriteFonts().filter(unique);
	const { custom } = fontPool();

	return [
		...favorites.map((name) => ({ value: name, label: name, badge: FAVORITE_BADGE })),
		...googleNames()
			.filter(unique)
			.map((name) => ({ value: name, label: name })),
		...custom
			.filter((name) => typeof name === 'string' && name.trim() !== '')
			.filter(unique)
			.map((name) => ({ value: name, label: name, badge: CUSTOM_BADGE })),
	];
}

/**
 * The admin URL of the screen that edits the favorites list, for the picker's footer link. Empty
 * when the global carries none, which the control renders as plain text rather than a dead link.
 *
 * @since TBD
 *
 * @return {string} The deep link, or an empty string.
 */
export function favoriteFontsManageUrl() {
	return fontPool().manageUrl;
}

/**
 * Whether a family is one Google serves, and so one a stylesheet has to be fetched for.
 *
 * A system face and a site-registered custom font are both already present in the document — asking
 * Google for either returns a 400 for a font the browser could have painted all along.
 *
 * @param {string} family The family name.
 *
 * @since TBD
 *
 * @return {boolean} Whether to fetch it from Google.
 */
export function isGoogleFamily(family) {
	const name = String(family ?? '').trim();

	return name !== '' && googleNames().some((candidate) => candidate.toLowerCase() === name.toLowerCase());
}
