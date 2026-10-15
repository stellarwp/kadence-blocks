/* eslint-env jest */

// The preset picker imports `@kadence/components` (an untransformed ESM module), which this file never renders.
jest.mock('@kadence/components', () => ({}));

import { scopeStyle } from '../scope-style';
import { scopeSiteAttributes } from '../store';
import entry from './fixtures/singlebtn-entry.json';

const BLOCK = 'kadence/singlebtn';
const SET = 'default';
const SITE = { background: '#000', color: '#fff', typography: ['16'] };

/**
 * Seed the catalog with Single Button's presets as the Kadence theme offers them.
 *
 * @param {string[]} themeSlugs The theme presets to offer.
 * @return {void}
 */
function seedCatalog(themeSlugs = ['theme-base', 'theme-secondary']) {
	const theme = {
		'theme-base': {
			slug: 'theme-base',
			label: 'Theme Base',
			themeClass: 'wp-block-button__link button kb-btn-global-inherit',
		},
		'theme-secondary': {
			slug: 'theme-secondary',
			label: 'Theme Secondary',
			themeClass: 'wp-block-button__link button button-style-secondary kb-btn-global-inherit',
		},
	};

	window.kadenceDesignTokensPresets = {
		active: SET,
		libraries: {
			[SET]: {
				[BLOCK]: {
					default: 'default',
					presets: [
						{ slug: 'default', label: 'Default' },
						{ slug: 'outline', label: 'Outline', themeClass: 'kb-btn-global-outline' },
						{ slug: 'brand', label: 'Brand', userCreated: true },
						...themeSlugs.map((slug) => theme[slug]),
					],
					properties: [],
					values: {},
				},
			},
		},
	};
}

describe('scopeStyle', () => {
	beforeEach(() => {
		seedCatalog();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	it('reads the style from an Outline preset', () => {
		expect(scopeStyle(BLOCK, { kbPreset: 'outline', inheritStyles: 'fill' }, entry.scope)).toBe('outline');
	});

	it('reads a theme style from a theme preset', () => {
		expect(scopeStyle(BLOCK, { kbPreset: 'theme-base', inheritStyles: 'fill' }, entry.scope)).toBe('inherit');
		expect(scopeStyle(BLOCK, { kbPreset: 'theme-secondary', inheritStyles: '' }, entry.scope)).toBe(
			'inherit-secondary'
		);
	});

	it('keeps a secondary button secondary when its preset falls back to the theme base', () => {
		seedCatalog(['theme-base']);

		expect(scopeStyle(BLOCK, { kbPreset: 'theme-secondary', inheritStyles: '' }, entry.scope)).toBe(
			'inherit-secondary'
		);
	});

	it('reads a legacy style through its preset', () => {
		expect(scopeStyle(BLOCK, { kbPreset: '', inheritStyles: 'outline' }, entry.scope)).toBe('outline');
	});

	it('uses the scope attribute when the preset is painted through variables', () => {
		expect(scopeStyle(BLOCK, { kbPreset: '', inheritStyles: 'fill' }, entry.scope)).toBe('fill');
		expect(scopeStyle(BLOCK, { kbPreset: 'default', inheritStyles: '' }, entry.scope)).toBe('');
		expect(scopeStyle(BLOCK, { kbPreset: 'brand', inheritStyles: 'fill' }, entry.scope)).toBe('fill');
	});

	it('uses the scope attribute when there is no preset catalog', () => {
		delete window.kadenceDesignTokensPresets;

		expect(scopeStyle(BLOCK, { kbPreset: 'outline', inheritStyles: 'fill' }, entry.scope)).toBe('fill');
	});

	it('gives an Outline preset button only the shape values, and a theme preset button none', () => {
		const scoped = (attributes) =>
			scopeSiteAttributes(
				SITE,
				{ inheritStyles: scopeStyle(BLOCK, attributes, entry.scope) },
				entry.scope,
				'fill'
			);

		expect(scoped({ kbPreset: 'outline', inheritStyles: 'fill' })).toEqual({ typography: ['16'] });
		expect(scoped({ kbPreset: 'theme-base', inheritStyles: '' })).toEqual({});
		expect(scoped({ kbPreset: '', inheritStyles: 'fill' })).toEqual(SITE);
	});
});
