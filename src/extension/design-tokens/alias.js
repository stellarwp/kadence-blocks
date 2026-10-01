/**
 * Design-token alias primitives (JS peer of the PHP `Alias` + `Css_Var`).
 *
 * A block control can store a design-token reference as a whole-string alias, `{dot.alias}`, instead
 * of a frozen literal. These pure, data-free helpers recognize such a value and transform it to its
 * CSS custom-property reference, byte-for-byte identical to the PHP side so the editor preview and the
 * frontend never drift. The `--kb-token--*` var is injected into the editor canvas by the projector,
 * so no localized token data is needed here.
 *
 * These are registered as `@kadence/helpers` output-filter listeners (see `registerTokenAliasFilters`
 * in `early-filters.js`) so the shared helper library stays token-agnostic — the token knowledge lives
 * only in this plugin.
 */

/**
 * The CSS custom-property namespace for Kadence design tokens. Mirrors PHP `Css_Var::get_prefix()`.
 */
export const TOKEN_VAR_PREFIX = '--kb-token--';

/**
 * Whole-string alias pattern. Mirrors the PHP `Alias::PATTERN` (`^\{[\w.-]+\}$`) exactly: a "{", a
 * dot-path of word characters, dots and dashes, then a "}", anchored end to end. `\w` is ASCII on
 * both sides (no unicode flag), so the two implementations agree. Block-attribute values never carry
 * a trailing newline, so the strict `$` (unlike PHP's newline-tolerant `$`) is intentional.
 */
const TOKEN_ALIAS_PATTERN = /^\{[\w.-]+\}$/;

/**
 * Whether the given value is a whole-string design-token alias, e.g. `{semantic.radius.media}`.
 *
 * Only strings can be aliases; any non-string returns false so callers can short-circuit
 * "alias OR literal" cleanly. Mirrors PHP `Alias::is_alias()`.
 *
 * @param {*} value The value to test.
 * @return {boolean} True when the value is a well-formed alias string.
 */
export function isTokenAlias(value) {
	return typeof value === 'string' && TOKEN_ALIAS_PATTERN.test(value);
}

/**
 * The dot-path referenced by an alias string, with the surrounding braces stripped. Mirrors PHP
 * `Alias::path_of()` exactly, including its contract for a value that is not a well-formed alias.
 *
 * @param {*} value A value that may be an alias string, e.g. `{primitive.color.brand.primary}`.
 *
 * @since TBD
 *
 * @return {string} The inner dot-path, e.g. `primitive.color.brand.primary`. Empty string when the
 *                   value is not a well-formed alias.
 */
export function pathOfAlias(value) {
	if (!isTokenAlias(value)) {
		return '';
	}

	return value.slice(1, -1);
}

/**
 * Resolve a design-token alias string to its CSS custom-property reference.
 *
 * Mirrors the PHP Resolver primitive (`'var(' . Css_Var::from_id( Alias::path_of( $value ) ) . ')'`)
 * byte-for-byte: strip the braces, replace every "." with "--" behind the `--kb-token--` prefix, and
 * emit a BARE `var(--kb-token--<id>)` with no fallback literal. Non-aliases fall through untouched, so
 * callers can pipe any value through it unconditionally.
 *
 * @param {*} value A value that may be an alias string, e.g. `{semantic.radius.media}`.
 * @return {*} `var(--kb-token--<id>)` when the value is an alias; otherwise the value unchanged.
 */
export function resolveTokenAlias(value) {
	if (!isTokenAlias(value)) {
		return value;
	}

	const id = pathOfAlias(value).replace(/\./g, '--');

	return 'var(' + TOKEN_VAR_PREFIX + id + ')';
}
