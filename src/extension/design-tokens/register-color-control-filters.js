/**
 * Keep token-backed global-palette colors visible in the shared Kadence color controls.
 *
 * The shared `PopColorControl` / `InlinePopColorControl` (in the token-agnostic `@kadence/components`
 * library) drop every swatch that is not a user-created `kb-palette-*` color when the global
 * "Use only Custom Colors" override is on. Design tokens are projected into the standard global-palette
 * slots `palette1`..`palette9`, so those token-backed swatches would be hidden in override mode.
 *
 * The control routes its swatch list through the `kadence.components.popColorControl.colors` filter.
 * Here Kadence Blocks registers a listener that re-adds the global-palette slots in override mode and
 * passes every other case through untouched — so the palette knowledge lives only in this plugin, and
 * the change is strictly additive.
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

const NAMESPACE = 'kadence-blocks/token-palette-colors';
const HOOK = 'kadence.components.popColorControl.colors';

/**
 * Matches the global-palette slot slugs (`palette1`..`palette9`) that design tokens project into.
 *
 * @type {RegExp}
 */
const GLOBAL_PALETTE_SLUG = /^palette[1-9]$/;

/**
 * Re-add the global-palette slots so token-backed colors survive the "Use only Custom Colors"
 * override filter.
 *
 * A no-op when the override is off (the full palette already shows) or when no global-palette slots
 * are present (a site without the tokens palette). Slots already in the list are not duplicated.
 *
 * @param {Array}  colors            The swatches after the control's built-in override filter.
 * @param {Object} context           The control context.
 * @param {Array}  context.allColors The full unfiltered editor palette.
 * @param {boolean} context.override Whether the "Use only Custom Colors" override is on.
 *
 * @since TBD
 *
 * @return {Array} The swatches to render, with the global-palette slots retained.
 */
function retainTokenPaletteColors(colors, { allColors, override }) {
	if (override !== true || !Array.isArray(allColors)) {
		return colors;
	}

	const present = new Set(colors.map((color) => color.slug));
	const tokenColors = allColors.filter(
		(color) => color.slug && GLOBAL_PALETTE_SLUG.test(color.slug) && !present.has(color.slug)
	);

	return tokenColors.length ? [...colors, ...tokenColors] : colors;
}

/**
 * Register the palette-retention listener on the color-control swatch filter.
 *
 * Idempotent: it removes any prior listener under this namespace before adding, so it is safe to call
 * more than once (e.g. editor init plus a test's setup).
 *
 * @since TBD
 *
 * @return {void}
 */
export function registerColorControlFilters() {
	removeFilter(HOOK, NAMESPACE);
	addFilter(HOOK, NAMESPACE, retainTokenPaletteColors);
}
