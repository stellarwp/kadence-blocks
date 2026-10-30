/* eslint-env jest */
/**
 * Internal dependencies
 */
import { resolveColorLiteral } from '../color-literal';

describe('resolveColorLiteral', () => {
	afterEach(() => {
		document.documentElement.style.removeProperty('--kb-token--semantic--color--accent--main');
	});

	/**
	 * A token entry resolves through its CSS custom property.
	 *
	 * @return {void}
	 */
	it('reads a token entry from its CSS custom property', () => {
		document.documentElement.style.setProperty('--kb-token--semantic--color--accent--main', '#3182ce');

		expect(resolveColorLiteral({ id: 'semantic.color.accent.main', alias: '{semantic.color.accent.main}' })).toBe(
			'#3182ce'
		);
	});

	/**
	 * A Global Styles palette entry stores a slug, so it resolves to the color it carries.
	 *
	 * @return {void}
	 */
	it('returns the carried color for a palette entry', () => {
		expect(resolveColorLiteral({ id: 'theme:theme-palette1', alias: 'palette1', value: '#c3e085' })).toBe(
			'#c3e085'
		);
	});
});
