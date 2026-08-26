/**
 * Resolve a design-token alias to a raw pixel number, for the editor render paths that cannot consume
 * a CSS variable.
 *
 * Most bound attributes reach output as a CSS declaration, where `var(--kb-token--<id>)` is the whole
 * answer. A few do not: `kadence/single-icon`'s `size` is written straight into the SVG's `width` and
 * `height` presentation attributes by `GenIcon`, and an SVG geometry attribute takes a number, not a
 * `var()`. Those call sites need the token's value as a number before they render.
 *
 * This is the JS mirror of the PHP `Converts_Number_To_Px` trait, deliberately kept exact — including
 * where it declines. Both accept only `px`, `rem`, and `em`; both assume a 16px root font size, the
 * same assumption an unstyled `rem` makes in a browser (nothing in this module tracks a site's actual
 * root font size); and both decline a UNITLESS value, `%`, and any function or keyword. A token whose
 * value is a bare `0` therefore converts in neither language. Matching the PHP behavior exactly,
 * gaps included, is the point: the two are pinned to one shared conformance fixture, so a change to
 * either has to be a deliberate change to both.
 */

/**
 * Internal dependencies
 */
import { parseCssLength } from '../../token-controls/helpers/parse-css-length';
import { activeLibrary } from '../preset-picker';
import { tokenLiteral } from './token-literals';

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
 * The pixel number a value resolves to.
 *
 * An alias resolves through the library's token map first, so `{primitive.dimension.icon-size.lg}`
 * becomes `2.25rem` becomes `36`. A literal length converts directly. Anything this cannot safely
 * convert — a unitless number, a percentage, a `calc()`/`clamp()`, a keyword, or an alias the library
 * does not define — returns `null`, so the caller falls back to its own default rather than rendering
 * a guess.
 *
 * @param {*}      value     The value to resolve: a `{dot.alias}` or a CSS length literal.
 * @param {string} [library] The token library slug; defaults to the active library.
 *
 * @since TBD
 *
 * @return {?number} The pixel value, or `null` when the value cannot be converted.
 */
export function tokenPx(value, library) {
	// `tokenLiteral()` takes an explicit library, so the active-library default is resolved here rather
	// than left to a caller that has no reason to know which library is selected.
	const parsed = parseCssLength(tokenLiteral(value, library || activeLibrary()));

	if (!parsed || !Object.prototype.hasOwnProperty.call(PX_PER_UNIT, parsed.unit)) {
		return null;
	}

	return parsed.size * PX_PER_UNIT[parsed.unit];
}
