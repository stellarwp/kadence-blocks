/**
 * The Shadow screen's value-shape boundary: converting between the feed's resolved CSS shorthand
 * string, the composite draft `ShadowField` edits (plain numbers), and the composite leaf the
 * backend stores (dimension strings). No React, no JSX, no REST — see
 * `components/pages/ShadowScreen.js` for where these plug into the scale-screen contract's
 * `parseValue`/`buildLeaf` config seam.
 */

/**
 * The shadow draft's default shape — the same default `ShadowField` itself falls back to, so a
 * resolved value that is empty or fails to parse seeds the panel with a shape the field already
 * knows how to render rather than a bespoke "nothing yet" sentinel.
 *
 * @since TBD
 */
const DEFAULT_SHADOW_DRAFT = { color: '#000000', offsetX: 0, offsetY: 0, blur: 0, spread: 0, inset: false };

/**
 * The renderer shorthand's grammar, matching what `Css_Renderer::shadow()` produces: an optional
 * leading `inset `, four space-separated dimension tokens (offsetX, offsetY, blur, spread), then
 * the color as the remainder of the string. Capturing the color as "everything after the fourth
 * dimension" (rather than a fifth token) keeps a color with internal spaces —
 * `rgba(23, 23, 23, 0.12)` — intact.
 *
 * @since TBD
 */
const SHADOW_SHORTHAND_PATTERN = /^(inset\s+)?(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.+)$/;

/**
 * Parse a resolved shadow CSS string into the composite draft shape `ShadowField` edits.
 *
 * @param {string} css The resolved `box-shadow` shorthand (e.g. `"0px 2px 8px 0px #1717171f"`, with
 *                      an optional `inset ` prefix), or a string that is empty or fails to parse.
 *
 * @since TBD
 *
 * @return {{color: string, offsetX: number, offsetY: number, blur: number, spread: number, inset: boolean}}
 *         The parsed draft, or the field's default shape when the input is empty or fails to parse —
 *         the honest "nothing stored" seed.
 */
export function parseShadowValue(css) {
	const match = typeof css === 'string' ? css.trim().match(SHADOW_SHORTHAND_PATTERN) : null;

	if (!match) {
		return { ...DEFAULT_SHADOW_DRAFT };
	}

	const [, insetPrefix, offsetX, offsetY, blur, spread, color] = match;

	return {
		color,
		offsetX: parseFloat(offsetX) || 0,
		offsetY: parseFloat(offsetY) || 0,
		blur: parseFloat(blur) || 0,
		spread: parseFloat(spread) || 0,
		inset: Boolean(insetPrefix),
	};
}

/**
 * Build the composite `$value` a shadow token leaf stores from the panel's draft: every numeric
 * sub-field serialized as a px dimension string (the numeric fields are px-only — the board shows
 * no unit selector, and the composite's blur/spread are lengths where px is the universal
 * authoring unit), `inset` omitted entirely when false (the optional-field map exists precisely so
 * absent means unset — writing `false` would be valid but pointlessly grows every token) and
 * written as strict `true` otherwise.
 *
 * @param {{color: string, offsetX: number, offsetY: number, blur: number, spread: number, inset?: boolean}} draftValue
 *        The panel's current draft.
 *
 * @since TBD
 *
 * @return {{color: string, offsetX: string, offsetY: string, blur: string, spread: string, inset?: true}}
 *         The composite leaf `$value`.
 */
export function shadowLeafValue(draftValue) {
	const shadow = { ...DEFAULT_SHADOW_DRAFT, ...(draftValue || {}) };

	const value = {
		color: shadow.color,
		offsetX: `${Number(shadow.offsetX) || 0}px`,
		offsetY: `${Number(shadow.offsetY) || 0}px`,
		blur: `${Number(shadow.blur) || 0}px`,
		spread: `${Number(shadow.spread) || 0}px`,
	};

	if (shadow.inset === true) {
		value.inset = true;
	}

	return value;
}

/**
 * Build the full token leaf for a shadow save write — the `config.buildLeaf` implementation the
 * scale-screen contract's optional seam calls instead of the generic `buildTokenLeaf()`, which only
 * understands string and responsive-envelope values, not a composite object.
 *
 * @param {string} tokenType The DTCG `$type` (`'shadow'`).
 * @param {Object} draftValue The panel's current draft.
 *
 * @since TBD
 *
 * @return {{$type: string, $value: Object}} The composite token leaf.
 */
export function buildShadowLeaf(tokenType, draftValue) {
	return { $type: tokenType, $value: shadowLeafValue(draftValue) };
}

/**
 * Render a `box-shadow` CSS value from either shape a row's `value` can hold on this screen: the
 * feed's resolved string (passed through verbatim) or an overlaid live draft object (serialized in
 * the same order `Css_Renderer` emits). This is what lets the live preview update on every
 * keystroke with no draft-channel or overlay change — `overlayDraft` copies the draft's `value`
 * verbatim, and this helper is the one place on the screen that has to accept both shapes.
 *
 * @param {string|{color: string, offsetX: number|string, offsetY: number|string, blur: number|string, spread: number|string, inset?: boolean}} value
 *        A row's `value`, resolved string or draft object.
 *
 * @since TBD
 *
 * @return {string} The `box-shadow` CSS value, or an empty string for an empty/missing value.
 */
export function shadowCss(value) {
	if (typeof value === 'string') {
		return value;
	}

	if (!value) {
		return '';
	}

	const shadow = { ...DEFAULT_SHADOW_DRAFT, ...value };
	const offsetX = typeof shadow.offsetX === 'string' ? shadow.offsetX : `${Number(shadow.offsetX) || 0}px`;
	const offsetY = typeof shadow.offsetY === 'string' ? shadow.offsetY : `${Number(shadow.offsetY) || 0}px`;
	const blur = typeof shadow.blur === 'string' ? shadow.blur : `${Number(shadow.blur) || 0}px`;
	const spread = typeof shadow.spread === 'string' ? shadow.spread : `${Number(shadow.spread) || 0}px`;
	const shorthand = `${offsetX} ${offsetY} ${blur} ${spread} ${shadow.color}`;

	return shadow.inset === true ? `inset ${shorthand}` : shorthand;
}
