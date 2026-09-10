/**
 * A dimension value for an editor INLINE style, with design-token aliases resolved.
 *
 * A block that paints a dimension into a React `style` object rather than through
 * `KadenceBlocksCSS` has no filter seam to run the value through: it concatenates the stored value
 * with its unit attribute and hands the result to the DOM. That is correct for the numbers those
 * attributes have always held, and wrong the moment a token-aware control can write a
 * `{dot.alias}` — `"{primitive.dimension.radius.lg}" + "px"` is not a CSS length, so the browser
 * drops the declaration and the block renders with no value at all while the saved page (rendered
 * through PHP's `render_measure_output`, which does resolve the alias) shows it correctly.
 *
 * This is the inline-style counterpart of that resolution, matching `register-filters.js`'s
 * `resolveAlias` exactly: a backed alias becomes its `var(--kb-token--<id>)` reference, and an
 * alias the active library does not back is left alone so the editor emits no dead variable — the
 * same "fall back to whatever global CSS exists" behavior the front-end renderer has.
 */

/**
 * Internal dependencies
 */
import { isTokenAlias, pathOfAlias, resolveTokenAlias } from './alias';
import { isBackedToken } from './backed-tokens';

/**
 * Resolve one dimension slot for an inline style.
 *
 * Passing the value through untouched when it is not an alias keeps every existing numeric slot
 * byte-identical to the concatenation it replaces, including the `0` that has to stay a real `0px`
 * rather than becoming an omitted declaration.
 *
 * @param {*}      value The stored slot value: a number, a numeric string, or a `{dot.alias}`.
 * @param {string} unit  The unit attribute's value, already defaulted by the caller.
 *
 * @since TBD
 *
 * @return {string} A CSS length, or a `var(--kb-token--<id>)` reference for a backed alias.
 */
export function tokenDimension(value, unit) {
	if (!isTokenAlias(value)) {
		return `${value}${unit}`;
	}

	if (!isBackedToken(pathOfAlias(value))) {
		return value;
	}

	return resolveTokenAlias(value);
}
