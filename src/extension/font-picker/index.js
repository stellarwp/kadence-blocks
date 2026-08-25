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
 * - `window.kadenceDesignTokensFonts` — `{ favorites, custom }`, printed by the design-tokens
 *   editor Localizer. `custom` arrives already normalized to family names, because the raw
 *   `c_fonts` shape keys entries by a name OR by a whole font-stack expression.
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
 * @return {{favorites: string[], custom: string[]}} The favorites and custom names, or two empty lists.
 */
function fontPool() {
	const pool = window.kadenceDesignTokensFonts;

	return {
		favorites: Array.isArray(pool?.favorites) ? pool.favorites : [],
		custom: Array.isArray(pool?.custom) ? pool.custom : [],
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
 * A favorite is filtered out of the two catalog runs below it so it appears exactly once, in
 * its pinned position — the same rule the Style Library's Typography dropdown applies, so the two
 * screens list the same names in the same order.
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string, badge?: string}>} The option list.
 */
export function fontCatalogOptions() {
	const favorites = favoriteFonts();
	const { custom } = fontPool();
	const pinned = new Set(favorites.map((name) => name.toLowerCase()));
	const unpinned = (name) => !pinned.has(name.toLowerCase());

	return [
		...favorites.map((name) => ({ value: name, label: name, badge: FAVORITE_BADGE })),
		...googleNames()
			.filter(unpinned)
			.map((name) => ({ value: name, label: name })),
		...custom
			.filter((name) => typeof name === 'string' && name !== '')
			.filter(unpinned)
			.map((name) => ({ value: name, label: name, badge: CUSTOM_BADGE })),
	];
}
