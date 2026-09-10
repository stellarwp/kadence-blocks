/**
 * Resolve a design-token alias to a raw pixel number, for the editor render paths that cannot consume
 * a CSS variable.
 *
 * Most bound attributes reach output as a CSS declaration, where `var(--kb-token--<id>)` is the whole
 * answer. A few do not: `kadence/single-icon`'s `size` is written straight into the SVG's `width` and
 * `height` presentation attributes by `GenIcon`, and an SVG geometry attribute takes a number, not a
 * `var()`. Those call sites need the token's value as a number before they render.
 *
 * This module is the alias-resolving half: it looks a `{dot.alias}` up in the active token library and
 * hands the resulting literal to `pxFromLength`, which owns the conversion itself and is the JS mirror
 * of the PHP `Converts_Number_To_Px` trait (see that helper for the shared units, the assumed 16px root,
 * and what both languages decline). The conversion lives there rather than here because the indicator
 * layer's dimension compare needs it without any library lookup.
 */

/**
 * Internal dependencies
 */
import { pxFromLength } from '../../token-controls/helpers/px-from-length';
import { activeLibrary } from '../preset-picker';
import { tokenLiteral } from './token-literals';

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
	return pxFromLength(tokenLiteral(value, library || activeLibrary()));
}
