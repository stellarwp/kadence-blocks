/**
 * The pure token-id-to-CSS-variable transform, private to this library.
 *
 * A clean-room copy of the same rule `src/extension/design-tokens/alias.js`'s `resolveTokenAlias()`
 * and PHP's `Css_Var::from_id()` both apply — prefix `--kb-token--`, replace every `.` with `--`,
 * leave `-` untouched — kept here rather than imported so `token-controls` never reaches into the
 * host plugin's `src/extension/*` tree (see this library's README, "no host imports").
 */

/**
 * The CSS custom-property namespace for Kadence design tokens.
 *
 * @since TBD
 */
const TOKEN_VAR_PREFIX = '--kb-token--';

/**
 * The CSS custom-property name a design-token id resolves to.
 *
 * @param {string} id The token's dot-path id, e.g. `semantic.radius.media`.
 *
 * @since TBD
 *
 * @return {string} `--kb-token--<id>`, with every `.` replaced by `--`.
 */
export function tokenCssVar(id) {
	return TOKEN_VAR_PREFIX + id.replace(/\./g, '--');
}
