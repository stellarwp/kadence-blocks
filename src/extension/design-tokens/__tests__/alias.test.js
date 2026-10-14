/* eslint-env jest */
/**
 * Design-token alias primitives, and their byte-for-byte parity with the PHP side.
 *
 * A block control stores a design-token reference as a whole-string alias, `{dot.alias}`. That same
 * value is resolved twice: in PHP for the front end (`Alias::path_of` + `Css_Var::from_id`) and in
 * this JS for the editor preview. If the two ever disagree by a single character, an authored token
 * would render one way in the editor and another on the front end. These tests lock the JS side to
 * the PHP output:
 *   - `isTokenAlias` recognizes exactly what PHP's `Alias::is_alias` recognizes (well-formed braces
 *     only; non-strings and malformed/partial braces rejected);
 *   - `resolveTokenAlias` produces the exact `var(--kb-token--<id>)` string PHP emits (dots -> `--`,
 *     no fallback literal), and passes any non-alias through untouched.
 *
 * The expected pairs are kept in a JSON fixture that is intended to be shared with a PHP test so both
 * languages assert against one source of truth. The primitives live in this plugin (not
 * `@kadence/helpers`) so the shared library carries no design-token knowledge.
 */
import { isTokenAlias, pathOfAlias, resolveTokenAlias, TOKEN_VAR_PREFIX } from '../alias';
import conformance from './fixtures/token-alias-conformance.json';

describe('isTokenAlias', () => {
	it.each(conformance.aliases.map(({ alias }) => alias))('recognizes %s as an alias', (alias) => {
		expect(isTokenAlias(alias)).toBe(true);
	});

	it.each(conformance.nonAliases)('rejects the non-alias %p', (value) => {
		expect(isTokenAlias(value)).toBe(false);
	});

	it.each([null, undefined, 5, 0, true, false, ['{a.b}'], { a: 1 }])('rejects the non-string %p', (value) => {
		expect(isTokenAlias(value)).toBe(false);
	});

	it('rejects an alias with a trailing newline (strict, unlike PHP)', () => {
		expect(isTokenAlias('{a.b}\n')).toBe(false);
	});
});

describe('resolveTokenAlias', () => {
	it.each(conformance.aliases.map(({ alias, cssVar }) => [alias, cssVar]))('resolves %s to %s', (alias, cssVar) => {
		expect(resolveTokenAlias(alias)).toBe(cssVar);
	});

	it('builds the var from the TOKEN_VAR_PREFIX constant, with no fallback literal', () => {
		expect(TOKEN_VAR_PREFIX).toBe('--kb-token--');
		expect(resolveTokenAlias('{a.b}')).toBe(`var(${TOKEN_VAR_PREFIX}a--b)`);
		expect(resolveTokenAlias('{semantic.radius.media}')).not.toContain(',');
	});

	it.each(conformance.nonAliases)('passes the non-alias %p through unchanged', (value) => {
		expect(resolveTokenAlias(value)).toBe(value);
	});

	it.each([null, undefined, 5, ['{a.b}']])('passes the non-string %p through unchanged', (value) => {
		expect(resolveTokenAlias(value)).toBe(value);
	});
});

describe('pathOfAlias', () => {
	it.each(conformance.aliases.map(({ alias }) => [alias, alias.slice(1, -1)]))(
		'returns %s the dotted path %s',
		(alias, path) => {
			expect(pathOfAlias(alias)).toBe(path);
		}
	);

	it.each(conformance.nonAliases)('returns an empty string for the non-alias %p', (value) => {
		expect(pathOfAlias(value)).toBe('');
	});

	it.each([null, undefined, 5, ['{a.b}']])('returns an empty string for the non-string %p', (value) => {
		expect(pathOfAlias(value)).toBe('');
	});
});
