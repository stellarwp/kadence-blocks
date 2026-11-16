/* eslint-env jest */
// cspell:ignore Abril Fatface .
import { buildFontCatalogOptions } from '../helpers/font-catalog';

const THEME = [
	{ value: 'var( --global-heading-font-family, inherit )', label: 'Inherit Heading Font Family', badge: 'Theme' },
];

describe('buildFontCatalogOptions', () => {
	it('returns an empty list when given nothing', () => {
		expect(buildFontCatalogOptions()).toEqual([]);
		expect(buildFontCatalogOptions({})).toEqual([]);
	});

	// A site's own faces must not sit under ~1,900 Google names, which is where the picker used to put them.
	it('orders custom, theme, favorites, then google', () => {
		const options = buildFontCatalogOptions({
			favorites: ['Georgia'],
			google: ['Abel', 'Abril Fatface'],
			custom: ['Brand Sans', 'Zeta Display'],
			theme: THEME,
		});

		expect(options.map((option) => option.label)).toEqual([
			'Brand Sans',
			'Zeta Display',
			'Inherit Heading Font Family',
			'Georgia',
			'Abel',
			'Abril Fatface',
		]);
		expect(options.map((option) => option.badge)).toEqual([
			'Custom',
			'Custom',
			'Theme',
			'Favorite',
			undefined,
			undefined,
		]);
	});

	it('keeps the order custom fonts arrive in', () => {
		const options = buildFontCatalogOptions({ custom: ['Zeta', 'Alpha', 'Mid'] });

		expect(options.map((option) => option.value)).toEqual(['Zeta', 'Alpha', 'Mid']);
	});

	it('lists a favorited custom font once, as a favorite', () => {
		expect(buildFontCatalogOptions({ favorites: ['Brand Sans'], custom: ['Brand Sans'] })).toEqual([
			{ value: 'Brand Sans', label: 'Brand Sans', badge: 'Favorite' },
		]);
	});

	it('lets a Google name win over a custom font that duplicates it', () => {
		expect(buildFontCatalogOptions({ google: ['Inter'], custom: ['inter'] })).toEqual([
			{ value: 'Inter', label: 'Inter' },
		]);
	});

	it('matches names ignoring case, whitespace and wrapping quotes', () => {
		const options = buildFontCatalogOptions({
			favorites: ['"Abril Fatface"'],
			google: ['Abril Fatface'],
			custom: ['  abril fatface  '],
		});

		expect(options).toEqual([{ value: '"Abril Fatface"', label: '"Abril Fatface"', badge: 'Favorite' }]);
	});

	it('drops blank and non-string names', () => {
		expect(buildFontCatalogOptions({ google: ['', '   ', null, 'Abel'], custom: [undefined] })).toEqual([
			{ value: 'Abel', label: 'Abel' },
		]);
	});

	it('does not dedupe theme rows against family names', () => {
		const options = buildFontCatalogOptions({ google: ['Abel'], theme: [...THEME, ...THEME] });

		expect(options).toHaveLength(3);
	});
});
