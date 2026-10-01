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
 * The muted badge the Kadence theme's two global font entries carry, so a row whose value is a CSS
 * variable rather than a family name reads as one.
 *
 * @since TBD
 */
const THEME_BADGE = __('Theme', 'kadence-blocks');

/**
 * The Kadence theme's two global font entries, as the shared `TypographyControls` select has always
 * offered them.
 *
 * These are not families. Each writes a `var()` reference at the theme's Customizer typography
 * settings, so a block set to one tracks whatever the site's Heading or Body font is rather than
 * naming a face — which is why they can never be favorites (a favorite is a catalog family) and why
 * they belong in the catalog tab beside the families a block can also be set to.
 *
 * Offered only when the Kadence theme is active. On any other theme the custom properties are never
 * emitted, and an option resolving to `inherit` everywhere would be a row that does nothing.
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string, badge: string}>} The theme options, or none.
 */
function themeFontOptions() {
	if (!window.kadence_blocks_params?.isKadenceT) {
		return [];
	}

	return [
		{
			value: 'var( --global-heading-font-family, inherit )',
			label: __('Inherit Heading Font Family', 'kadence-blocks'),
			badge: THEME_BADGE,
		},
		{
			value: 'var( --global-body-font-family, inherit )',
			label: __('Inherit Body Font Family', 'kadence-blocks'),
			badge: THEME_BADGE,
		},
	];
}

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
 * The font-family picker's full option list: the Kadence theme's global font entries first, then
 * favorites, then every Google family, then every site-registered custom family.
 *
 * The theme entries lead for the same reason the shared select put them first — they are the two
 * rows that follow the site's own typography settings, so they are what most blocks want. They are
 * exempt from the dedupe below: their values are `var()` references, not family names, so they
 * cannot collide with one.
 *
 * Every name appears exactly once, matched case-insensitively across all three name sources: a
 * favorite keeps its pinned position rather than repeating mid-list, and a custom font that
 * duplicates a Google one renders once — the same rule the Style Library's Typography dropdown
 * applies, so the two screens list the same names in the same order.
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
		...themeFontOptions(),
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
