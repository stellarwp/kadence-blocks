/* eslint-env jest */
/**
 * Design-token alias primitives + PHP/JS conformance.
 *
 * These guard byte-for-byte parity with the PHP transform (`Alias` + `Css_Var::from_id`) via a shared
 * fixture (seeding SOFT-3904), plus the recognition edge cases. The primitives live in this plugin
 * (not `@kadence/helpers`) so the shared library stays token-agnostic.
 */
import { isTokenAlias, resolveTokenAlias, TOKEN_VAR_PREFIX } from '../alias';
import conformance from './fixtures/token-alias-conformance.json';

describe('isTokenAlias', () => {
	it.each(conformance.aliases.map(({ alias }) => alias))('recognizes %s as an alias', (alias) => {
		expect(isTokenAlias(alias)).toBe(true);
	});

	it.each(conformance.nonAliases)('rejects the non-alias %p', (value) => {
		expect(isTokenAlias(value)).toBe(false);
	});

	it.each([null, undefined, 5, 0, true, false, ['{a.b}'], { a: 1 }])(
		'rejects the non-string %p',
		(value) => {
			expect(isTokenAlias(value)).toBe(false);
		}
	);

	it('rejects an alias with a trailing newline (strict, unlike PHP)', () => {
		expect(isTokenAlias('{a.b}\n')).toBe(false);
	});
});

describe('resolveTokenAlias', () => {
	it.each(conformance.aliases.map(({ alias, cssVar }) => [alias, cssVar]))(
		'resolves %s to %s',
		(alias, cssVar) => {
			expect(resolveTokenAlias(alias)).toBe(cssVar);
		}
	);

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
