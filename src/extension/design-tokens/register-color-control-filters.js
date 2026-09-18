/**
 * Make token-backed global-palette colors first-class in the shared Kadence color controls.
 *
 * The shared `PopColorControl` / `InlinePopColorControl` (in the token-agnostic `@kadence/components`
 * library) route their swatch list through the `kadence.components.popColorControl.colors` filter and
 * resolve each swatch's display through `@kadence/helpers` `KadenceColorOutput`. Design tokens are
 * projected into the standard global-palette slots `palette1`..`palette9`, so those swatches are already
 * in the editor palette.
 *
 * Here Kadence Blocks does two things through that filter, only when the design-tokens registry is active:
 *   1. Sets each global-palette swatch's value to the token alias it is bound to, so selecting it stores a
 *      `{dot.alias}` (resolved to `var(--kb-token--<id>)` by the helper seam) instead of a frozen literal
 *      - the selection then follows the active color palette instead of a fixed hex.
 *   2. Re-adds those swatches when the "Use only Custom Colors" override drops everything that is not a
 *      `kb-palette-*` custom color, so token colors stay selectable in that mode.
 *
 * The slot -> alias binding is read from the localized catalog (see `paletteSlotAliases`), so the palette
 * knowledge lives in the projection registry only and the library stays token-agnostic.
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

const NAMESPACE = 'kadence-blocks/token-palette-colors';
const HOOK = 'kadence.components.popColorControl.colors';

/**
 * The global-palette slot -> token-alias map the editor was localized with, or an empty map when the
 * design-tokens registry is inactive.
 *
 * The Localizer attaches `window.kadenceDesignTokensPalettes.slots` (built by `Editor\Palette_Catalog`
 * from the registry's `kadence_slot` projection), so `declarations.php` stays the single source of truth
 * for which primitive each palette slot renders - there is no second copy to keep in sync here. An empty
 * map (registry inactive, or nothing claims a slot) makes the listener a no-op, so a site with no active
 * tokens keeps its literal palette colors untouched.
 *
 * @since TBD
 *
 * @return {Object<string, string>} slug => `{alias}`.
 */
function paletteSlotAliases() {
	if (typeof window === 'undefined' || typeof window.kadenceDesignTokensPalettes === 'undefined') {
		return {};
	}

	return window.kadenceDesignTokensPalettes.slots || {};
}

/**
 * A swatch with its value set to the slot's token alias when the slot is a token-backed global-palette
 * slot, else the swatch unchanged. The alias renders through `KadenceColorOutput` (both the control
 * preview and the block output) and re-tints under the active color palette, so the selection follows
 * palette swaps instead of freezing to a literal.
 *
 * @param {Object} swatch      A color-palette swatch ({ color, slug, name }).
 * @param {Object} slotAliases The slug -> `{alias}` map from the localized catalog.
 *
 * @since TBD
 *
 * @return {Object} The swatch, aliased when its slug is a token-backed global-palette slot.
 */
function aliasSwatch(swatch, slotAliases) {
	const alias = swatch.slug ? slotAliases[swatch.slug] : undefined;

	return alias ? { ...swatch, color: alias } : swatch;
}

/**
 * Alias the token-backed global-palette swatches, and re-add them in override mode.
 *
 * A no-op when the slot map is empty (registry inactive, so the editor has no `--kb-token--*` vars to
 * resolve against) or the list is not an array. Re-added slots are not duplicated.
 *
 * @param {Array}   colors            The swatches after the control's built-in override filter.
 * @param {Object}  context           The control context.
 * @param {Array}   context.allColors The full unfiltered editor palette.
 * @param {boolean} context.override  Whether the "Use only Custom Colors" override is on.
 *
 * @since TBD
 *
 * @return {Array} The swatches to render, with token-backed slots aliased (and retained in override mode).
 */
function applyTokenPaletteColors(colors, { allColors, override }) {
	if (!Array.isArray(colors)) {
		return colors;
	}

	const slotAliases = paletteSlotAliases();

	if (Object.keys(slotAliases).length === 0) {
		return colors;
	}

	let result = colors.map((swatch) => aliasSwatch(swatch, slotAliases));

	// In override mode the control's built-in filter dropped the global-palette slots (they are not
	// kb-palette custom colors); re-add them, aliased, so token colors stay selectable.
	if (override === true && Array.isArray(allColors)) {
		const present = new Set(result.map((swatch) => swatch.slug));
		const restored = allColors
			.filter((swatch) => swatch.slug && slotAliases[swatch.slug] && !present.has(swatch.slug))
			.map((swatch) => aliasSwatch(swatch, slotAliases));

		if (restored.length) {
			result = [...result, ...restored];
		}
	}

	return result;
}

/**
 * Register the palette-color listener on the color-control swatch filter.
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
	addFilter(HOOK, NAMESPACE, applyTokenPaletteColors);
}
