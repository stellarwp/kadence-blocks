/* eslint-env jest */
/**
 * Internal dependencies
 */
import { tokenCssVar } from '../helpers/token-css-var';

describe('tokenCssVar', () => {
	it('prefixes a single-segment id with --kb-token--', () => {
		expect(tokenCssVar('a')).toBe('--kb-token--a');
	});

	it('replaces every dot with a double dash', () => {
		expect(tokenCssVar('semantic.radius.media')).toBe('--kb-token--semantic--radius--media');
	});

	it('leaves a dash inside a segment untouched', () => {
		expect(tokenCssVar('semantic.color.button-bg')).toBe('--kb-token--semantic--color--button-bg');
	});

	it('matches the shared alias-conformance fixture for a dot-path id', () => {
		// The fixture pairs the bracketed alias with its full `var(--kb-token--…)` reference; tokenCssVar
		// produces only the bare custom-property name, so the alias's braces are stripped and the
		// `var(...)` wrapper is trimmed off both ends before comparing.
		const alias = '{primitive.color.brand.primary}';
		const expectedVar = 'var(--kb-token--primitive--color--brand--primary)';
		const id = alias.slice(1, -1);

		expect(tokenCssVar(id)).toBe(expectedVar.slice(4, -1));
	});
});
