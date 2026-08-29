/**
 * Parsing the feed's resolved `box-shadow` shorthand string into the composite object shape both
 * `BoxShadowControl` (this library) and its two host adapters (`EditorShadowControl`,
 * `BoxShadowField`) edit — moved here so a fixed "None" shadow pick (which carries a literal
 * shorthand string as its `value`, not a live token reference) resolves identically in both hosts.
 */

/**
 * The composite's default shape: the canonical "no shadow" composite, matching both
 * `noneEntryForRole('shadow')`'s resolved value (`fixed-tokens.js`) and `NONE_SHADOW_ITEM`
 * (`src/blocks/singlebtn/deprecated.js`) in their own coordinate systems — transparent and
 * all-zero, not the old visible black composite.
 *
 * @since TBD
 */
export const DEFAULT_COMPOSITE = {
	color: 'transparent',
	offsetX: '0px',
	offsetY: '0px',
	blur: '0px',
	spread: '0px',
	inset: false,
};

/**
 * The feed's resolved `box-shadow` shorthand grammar, matching what `Css_Renderer::shadow()`
 * produces: an optional leading `inset `, four space-separated dimension tokens (offsetX, offsetY,
 * blur, spread), then the color as the remainder of the string. Capturing the color as "everything
 * after the fourth dimension" (rather than a fifth token) keeps a color with internal spaces —
 * `rgba(23, 23, 23, 0.12)` — intact.
 *
 * @since TBD
 */
const SHADOW_SHORTHAND_PATTERN = /^(inset\s+)?(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/;

/**
 * Parse a resolved `box-shadow` shorthand string into the composite `{ color, offsetX, offsetY, blur,
 * spread, inset }` shape `BoxShadowControl` edits.
 *
 * @param {*} css The resolved shorthand (e.g. `"0px 2px 8px 0px #1717171f"`, with an optional
 *                `inset ` prefix), or anything that fails to parse as one.
 *
 * @since TBD
 *
 * @return {Object} The parsed composite, or the field's default shape when `css` is empty or does
 *                   not match the shorthand grammar.
 */
export function parseResolvedShadow(css) {
	const match = typeof css === 'string' ? css.trim().match(SHADOW_SHORTHAND_PATTERN) : null;

	if (!match) {
		return { ...DEFAULT_COMPOSITE };
	}

	const [, insetPrefix, offsetX, offsetY, blur, spread, color] = match;

	return {
		color,
		offsetX,
		offsetY,
		blur,
		spread,
		inset: Boolean(insetPrefix),
	};
}
