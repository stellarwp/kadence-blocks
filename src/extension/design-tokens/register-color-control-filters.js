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
 * The palette knowledge lives only in this plugin; the library stays token-agnostic.
 */
import { addFilter, removeFilter } from '@wordpress/hooks';

const NAMESPACE = 'kadence-blocks/token-palette-colors';
const HOOK = 'kadence.components.popColorControl.colors';

/**
 * The token alias each global-palette slot is bound to.
 *
 * Mirrors the projection map in includes/resources/Design_Tokens/Registry/declarations.php
 * (`$palette_slots`), the single source of truth for which primitive each palette slot renders. Kept in
 * sync by hand - like `alias.js` mirrors the PHP alias / CSS-var format - so a swatch can carry its token
 * reference without a round-trip. Applied only when the registry is active (see `tokensActive`), so a
 * site with no active tokens keeps its literal palette colors untouched.
 *
 * @type {Object<string, string>}
 */
const PALETTE_SLOT_ALIASES = {
	palette1: '{primitive.color.brand.primary}',
	palette2: '{primitive.color.brand.secondary}',
	palette3: '{primitive.color.neutral.900}',
	palette4: '{primitive.color.neutral.700}',
	palette5: '{primitive.color.neutral.600}',
	palette6: '{primitive.color.neutral.500}',
	palette7: '{primitive.color.neutral.100}',
	palette8: '{primitive.color.neutral.50}',
	palette9: '{primitive.color.neutral.0}',
};

/**
 * Whether the design-tokens registry is active in this editor - i.e. the projector has injected the
 * `--kb-token--*` custom properties a stored alias resolves against. Proxied by the presence of the
 * palette catalog global the Localizer attaches only when the registry is active, so on a site with no
 * active tokens the listener leaves the literal palette colors alone.
 *
 * @since TBD
 *
 * @return {boolean} True when design tokens are active in this editor.
 */
function tokensActive() {
	return typeof window !== 'undefined' && typeof window.kadenceDesignTokensPalettes !== 'undefined';
}

/**
 * A swatch with its value set to the slot's token alias when the slot is a token-backed global-palette
 * slot, else the swatch unchanged. The alias renders through `KadenceColorOutput` (both the control
 * preview and the block output) and re-tints under the active color palette, so the selection follows
 * palette swaps instead of freezing to a literal.
 *
 * @param {Object} swatch A color-palette swatch ({ color, slug, name }).
 *
 * @since TBD
 *
 * @return {Object} The swatch, aliased when its slug is a token-backed global-palette slot.
 */
function aliasSwatch(swatch) {
	const alias = swatch.slug ? PALETTE_SLOT_ALIASES[swatch.slug] : undefined;

	return alias ? { ...swatch, color: alias } : swatch;
}

/**
 * Alias the token-backed global-palette swatches, and re-add them in override mode.
 *
 * A no-op when the registry is inactive (the editor has no `--kb-token--*` vars to resolve against) or
 * the list is not an array. Re-added slots are not duplicated.
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
	if (!tokensActive() || !Array.isArray(colors)) {
		return colors;
	}

	let result = colors.map(aliasSwatch);

	// In override mode the control's built-in filter dropped the global-palette slots (they are not
	// kb-palette custom colors); re-add them, aliased, so token colors stay selectable.
	if (override === true && Array.isArray(allColors)) {
		const present = new Set(result.map((swatch) => swatch.slug));
		const restored = allColors
			.filter((swatch) => swatch.slug && PALETTE_SLOT_ALIASES[swatch.slug] && !present.has(swatch.slug))
			.map(aliasSwatch);

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
