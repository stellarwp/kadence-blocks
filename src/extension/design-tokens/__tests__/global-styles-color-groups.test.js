/* eslint-env jest */
/**
 * Internal dependencies
 */
import { globalStylesColorGroups } from '../global-styles-color-groups';

jest.mock('@wordpress/i18n', () => ({ __: (text) => text }));

const THEME = [
	{ slug: 'theme-palette1', name: 'Palette Color 1', color: '#c3e085' },
	{ slug: 'theme-palette12', name: 'Palette Color 12', color: '#1159af' },
];
const DEFAULTS = [{ slug: 'vivid-red', name: 'Vivid red', color: '#cf2e2e' }];
const CUSTOM = [{ slug: 'qa-purple', name: 'QA Purple', color: '#7a1fa2' }];

describe('globalStylesColorGroups', () => {
	/**
	 * Theme, default and custom colors come back as groups in core's order.
	 *
	 * @return {void}
	 */
	it('lists theme, default and custom colors in that order', () => {
		const groups = globalStylesColorGroups({
			theme: THEME,
			defaultColors: DEFAULTS,
			custom: CUSTOM,
			defaultPalette: true,
		});

		expect(groups.map((group) => group.id)).toEqual(['theme', 'default', 'custom']);
		expect(groups.every((group) => 'global-styles' === group.source)).toBe(true);
	});

	/**
	 * Default colors are left out when the default palette is off.
	 *
	 * @return {void}
	 */
	it('leaves out default colors when the default palette is off', () => {
		const groups = globalStylesColorGroups({
			theme: THEME,
			defaultColors: DEFAULTS,
			custom: CUSTOM,
			defaultPalette: false,
		});

		expect(groups.map((group) => group.id)).toEqual(['theme', 'custom']);
	});

	/**
	 * An origin with no colors gives no group.
	 *
	 * @return {void}
	 */
	it('skips origins with no colors', () => {
		expect(globalStylesColorGroups({ theme: THEME, custom: [] }).map((group) => group.id)).toEqual(['theme']);
		expect(globalStylesColorGroups({})).toEqual([]);
	});

	/**
	 * A theme color stores its global-palette slug, any other color its literal.
	 *
	 * @return {void}
	 */
	it('stores a palette slug for theme colors and the literal for others', () => {
		const [theme, defaults, custom] = globalStylesColorGroups({
			theme: THEME,
			defaultColors: DEFAULTS,
			custom: CUSTOM,
			defaultPalette: true,
		});

		expect(theme.swatches).toEqual([
			{ id: 'theme:theme-palette1', label: 'Palette Color 1', value: '#c3e085', alias: 'palette1', fixed: true },
			{
				id: 'theme:theme-palette12',
				label: 'Palette Color 12',
				value: '#1159af',
				alias: 'palette12',
				fixed: true,
			},
		]);
		expect(defaults.swatches[0].alias).toBe('#cf2e2e');
		expect(custom.swatches[0]).toEqual({
			id: 'custom:qa-purple',
			label: 'QA Purple',
			value: '#7a1fa2',
			alias: '#7a1fa2',
			fixed: true,
		});
	});
});
