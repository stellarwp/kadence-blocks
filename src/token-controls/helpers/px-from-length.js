/**
 * A resolved CSS length turned into a raw pixel number, on the 16px root-font-size assumption an
 * unstyled `rem` makes in a browser. The number grammar is deliberately strict — an optional sign, digits
 * with at most one decimal point and at least one digit after it — so a malformed length (`1..2px`,
 * `1.2.3rem`) is declined rather than half-parsed. Nothing here tracks a site's real root font size; that
 * is a known, accepted simplification.
 *
 * Two consumers: the icon block's preview, where an SVG geometry attribute takes a number, not a `var()`,
 * so a preset's length has to become one before it reaches `GenIcon`; and the token-indicator dimension
 * compare, which checks a stored bare number against a preset length. The fixture in
 * `src/extension/design-tokens/__tests__/fixtures/length-to-px-conformance.json` pins the grammar.
 */

/**
 * Internal dependencies
 */
import { parseCssLength } from './parse-css-length';

/**
 * Pixel-convertible units and their multiplier against the assumed 16px root.
 *
 * @since TBD
 *
 * @type {Object<string, number>}
 */
const PX_PER_UNIT = {
	px: 1,
	rem: 16,
	em: 16,
};

/**
 * The pixel number a CSS length literal resolves to.
 *
 * @param {*} literal A CSS length literal (`"1.5rem"`, `"24px"`).
 *
 * @since TBD
 *
 * @return {?number} The pixel value, or `null` when the literal cannot be safely converted.
 */
export function pxFromLength(literal) {
	const parsed = parseCssLength(literal);

	if (!parsed || !Object.prototype.hasOwnProperty.call(PX_PER_UNIT, parsed.unit)) {
		return null;
	}

	return parsed.size * PX_PER_UNIT[parsed.unit];
}
