/**
 * The Global Styles palette as `ColorControl` groups, for FSE mode.
 *
 * In the Kadence theme's FSE mode Global Styles is the site's palette, so the block color controls
 * list its origins in the order core's color panel uses: theme colors, then WordPress defaults when
 * the default palette is on, then the site's own colors.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Marks groups built from Global Styles, so the popover can title its list tab "Palette" instead of
 * "Style Library".
 *
 * @type {string}
 */
export const GLOBAL_STYLES_SOURCE = 'global-styles';

/**
 * The value a palette swatch stores when picked.
 *
 * A theme color stores its Kadence global-palette slug (`palette1`), as the classic color controls
 * do, so it renders through `--global-palette1` and follows later Global Styles edits. Any other
 * color stores its literal.
 *
 * @param {Object} color A palette entry (`{ slug, color }`).
 *
 * @since TBD
 *
 * @return {string} The value to store.
 */
function storedValue(color) {
	const match = /^theme-(palette\d+)$/.exec(color.slug || '');

	return match ? match[1] : color.color;
}

/**
 * Map one palette origin to a `ColorControl` group, or null when it has no colors.
 *
 * Swatches are `fixed`, so a stored slug or literal matches its swatch the way a token alias does.
 *
 * @param {string} id     The group id.
 * @param {string} label  The group label.
 * @param {*}      colors The origin's palette entries (`{ slug, name, color }`).
 *
 * @since TBD
 *
 * @return {?Object} `{ id, label, source, swatches: [{ id, label, value, alias, fixed }] }`, or null.
 */
function toGroup(id, label, colors) {
	if (!Array.isArray(colors) || !colors.length) {
		return null;
	}

	return {
		id,
		label,
		source: GLOBAL_STYLES_SOURCE,
		swatches: colors.map((color) => ({
			id: `${id}:${color.slug}`,
			label: color.name || color.slug,
			value: color.color,
			alias: storedValue(color),
			fixed: true,
		})),
	};
}

/**
 * Build `ColorControl`'s `groups` from the Global Styles palette origins.
 *
 * @param {Object}  origins                  The palette origins.
 * @param {Array}   [origins.theme]          Theme palette entries.
 * @param {Array}   [origins.defaultColors]  WordPress default palette entries.
 * @param {Array}   [origins.custom]         The site's own palette entries.
 * @param {boolean} [origins.defaultPalette] Whether the default palette is on.
 *
 * @since TBD
 *
 * @return {Array} The non-empty groups, theme first.
 */
export function globalStylesColorGroups({ theme, defaultColors, custom, defaultPalette }) {
	return [
		toGroup('theme', __('Theme', 'kadence-blocks'), theme),
		defaultPalette ? toGroup('default', __('Default', 'kadence-blocks'), defaultColors) : null,
		toGroup('custom', __('Custom', 'kadence-blocks'), custom),
	].filter(Boolean);
}
