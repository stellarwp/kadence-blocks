/**
 * Keep the Kadence Blocks custom colors in the shared color controls when "Use only Custom Colors" is on in the
 * Kadence theme's Full Site Editing mode.
 *
 * In that mode Global Styles owns the editor palette, so the custom colors are not in it, and the control's
 * override filter (only `kb-palette-*` swatches) leaves an empty list.
 */
import { addFilter, removeFilter } from '@wordpress/hooks';
import { isFseMode } from '../../site-styles/supported-blocks';

const NAMESPACE = 'kadence-blocks/custom-colors';
const HOOK = 'kadence.components.popColorControl.colors';

/**
 * The stored custom colors from the localized color settings, or an empty list when absent or malformed.
 *
 * @since TBD
 *
 * @return {Array} The custom colors ({ color, name, slug }).
 */
function storedCustomColors() {
	if (typeof kadence_blocks_params === 'undefined' || !kadence_blocks_params.colors) {
		return [];
	}

	try {
		const palette = JSON.parse(kadence_blocks_params.colors)?.palette;

		return Array.isArray(palette) ? palette : [];
	} catch (e) {
		return [];
	}
}

/**
 * Append the stored custom colors the override filter could not keep because the editor palette lacks them.
 *
 * @param {Array}   colors           The swatches after the control's override filter.
 * @param {Object}  context          The control context.
 * @param {boolean} context.override Whether "Use only Custom Colors" is on.
 *
 * @since TBD
 *
 * @return {Array} The swatches, with any missing custom colors appended.
 */
function addCustomColors(colors, { override } = {}) {
	if (true !== override || !Array.isArray(colors) || !isFseMode()) {
		return colors;
	}

	const present = new Set(colors.map((swatch) => swatch?.slug));
	const missing = storedCustomColors().filter((swatch) => swatch?.slug && !present.has(swatch.slug));

	return missing.length ? [...colors, ...missing] : colors;
}

/**
 * Register the custom-color listener on the color-control swatch filter. Idempotent.
 *
 * @since TBD
 *
 * @return {void}
 */
export function registerCustomColorFilters() {
	removeFilter(HOOK, NAMESPACE);
	// Ahead of the token palette listener, so the custom colors lead the list as the override filter keeps them.
	addFilter(HOOK, NAMESPACE, addCustomColors, 5);
}
