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
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { buildFontCatalogOptions } from '../../token-controls/helpers/font-catalog';

/**
 * The muted badge the Kadence theme's two global font entries carry, so a row whose value is a CSS
 * variable rather than a family name reads as one.
 *
 * @since 3.8.0
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
 * @since 3.8.0
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
 * @since 3.8.0
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
 * The family names registered through the `kadence.typography_options` JS filter.
 *
 * @since TBD
 *
 * @return {string[]} The family names, in filter order.
 */
function filteredCustomNames() {
	let groups;

	try {
		groups = applyFilters('kadence.typography_options', []);
	} catch (error) {
		return [];
	}

	if (!Array.isArray(groups)) {
		return [];
	}

	return groups
		.flatMap((group) => (Array.isArray(group?.options) ? group.options : []))
		.filter((option) => option && option.google !== true && typeof option.value === 'string')
		.map((option) => option.value.trim())
		.filter((value) => value !== '' && !value.startsWith('var('));
}

/**
 * The Google family names the editor already localizes, fail-safe to an empty list.
 *
 * @since 3.8.0
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
 * @since 3.8.0
 *
 * @return {string[]} The favorite families.
 */
export function favoriteFonts() {
	return fontPool()
		.favorites.filter((family) => typeof family === 'string' && family.trim() !== '')
		.map((family) => family.trim());
}

/**
 * The font-family picker's option list.
 *
 * @since 3.8.0
 *
 * @return {Array<{value: string, label: string, badge?: string}>} The option list.
 */
export function fontCatalogOptions() {
	return buildFontCatalogOptions({
		favorites: favoriteFonts(),
		google: googleNames(),
		custom: [...fontPool().custom, ...filteredCustomNames()].filter(
			(name) => typeof name === 'string' && name.trim() !== ''
		),
		theme: themeFontOptions(),
	});
}

/**
 * The admin URL of the screen that edits the favorites list, for the picker's footer link. Empty
 * when the global carries none, which the control renders as plain text rather than a dead link.
 *
 * @since 3.8.0
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
 * @since 3.8.0
 *
 * @return {boolean} Whether to fetch it from Google.
 */
export function isGoogleFamily(family) {
	const name = String(family ?? '').trim();

	return name !== '' && googleNames().some((candidate) => candidate.toLowerCase() === name.toLowerCase());
}
