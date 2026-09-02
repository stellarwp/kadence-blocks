/**
 * Convert a CSS length literal to a raw pixel number.
 *
 * The JS mirror of the PHP `Converts_Number_To_Px` trait, deliberately kept exact — including where it
 * declines. Both accept only `px`, `rem`, and `em`; both assume a 16px root font size, the same
 * assumption an unstyled `rem` makes in a browser (nothing in this module tracks a site's actual root
 * font size); and both decline a UNITLESS value, `%`, and any function or keyword. A value that is a
 * bare `0` therefore converts in neither language. Matching the PHP behavior exactly, gaps included, is
 * the point: the two are pinned to one shared conformance fixture, so a change to either has to be a
 * deliberate change to both.
 *
 * Lives here, beside `parse-css-length`, rather than in either consumer: the editor's `token-px.js`
 * wraps it with alias resolution against the active token library, and the indicator layer's dimension
 * compare needs the bare conversion with no library lookup at all. A shared, dependency-free home keeps
 * one conversion table without either consumer importing the other's dependencies.
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
