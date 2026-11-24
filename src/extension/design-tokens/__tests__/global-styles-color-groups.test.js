/* eslint-env jest */
/**
 * Internal dependencies
 */
import { globalStylesColorGroups, themeColorGroups } from '../global-styles-color-groups';

jest.mock('@wordpress/i18n', () => ({ __: (text) => text }));

const THEME = [
	{ slug: 'theme-palette1', name: 'Palette Color 1', color: '#c3e085' },
	{ slug: 'theme-palette12', name: 'Palette Color 12', color: '#1159af' },
];
const DEFAULTS = [{ slug: 'vivid-red', name: 'Vivid red', color: '#cf2e2e' }];
const CUSTOM = [{ slug: 'qa-purple', name: 'QA Purple', color: '#7a1fa2' }];

describe('globalStylesColorGroups', () => {
	/**
	 * A custom color that reuses a theme palette slug stores its own literal, not the slug.
	 *
	 * @return {void}
	 */
	it('stores the literal for a custom color with a theme palette slug', () => {
		const [custom] = globalStylesColorGroups({
			custom: [{ slug: 'theme-palette1', name: 'Mine', color: '#123456' }],
		});

		expect(custom.swatches[0].alias).toBe('#123456');
	});

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

describe('themeColorGroups', () => {
	/**
	 * A non-Kadence theme color stores its literal, even when its slug looks like a Kadence palette slot.
	 *
	 * @return {void}
	 */
	it('stores the literal for a theme color whose slug looks like a palette slot', () => {
		const [theme] = themeColorGroups(THEME);

		expect(theme.swatches.map((swatch) => swatch.alias)).toEqual(['#c3e085', '#1159af']);
	});

	/**
	 * The theme group carries no Global Styles source, so it sits beside the Style Library groups.
	 *
	 * @return {void}
	 */
	it('leaves the group without a Global Styles source', () => {
		const [theme] = themeColorGroups(THEME);

		expect(theme.id).toBe('theme');
		expect(theme.source).toBeUndefined();
	});

	/**
	 * A theme without colors adds no group.
	 *
	 * @return {void}
	 */
	it('returns no group when the theme has no colors', () => {
		expect(themeColorGroups([])).toEqual([]);
		expect(themeColorGroups(undefined)).toEqual([]);
	});

	/**
	 * Global Styles groups keep the Kadence slot alias for a theme palette slot.
	 *
	 * @return {void}
	 */
	it('does not change the Global Styles slot alias', () => {
		const [theme] = globalStylesColorGroups({ theme: THEME });

		expect(theme.swatches.map((swatch) => swatch.alias)).toEqual(['palette1', 'palette12']);
	});
});
