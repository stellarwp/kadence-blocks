/* eslint-env jest */
// cspell:ignore Abril Fatface .
import { favoriteFonts, fontCatalogOptions } from '../index';

const originalFonts = window.kadenceDesignTokensFonts;
const originalParams = window.kadence_blocks_params;

afterEach(() => {
	window.kadenceDesignTokensFonts = originalFonts;
	window.kadence_blocks_params = originalParams;
});

describe('favoriteFonts', () => {
	it('fails safe to an empty list when the global is missing or malformed', () => {
		delete window.kadenceDesignTokensFonts;
		expect(favoriteFonts()).toEqual([]);

		window.kadenceDesignTokensFonts = { favorites: 'not-an-array' };
		expect(favoriteFonts()).toEqual([]);
	});

	it('reads the stored favorites in order, dropping blank and non-string entries', () => {
		window.kadenceDesignTokensFonts = { favorites: ['Inter', '', 42, '  Georgia  ', '   ', null] };

		expect(favoriteFonts()).toEqual(['Inter', 'Georgia']);
	});
});

describe('fontCatalogOptions', () => {
	it('fails safe to an empty list when neither global is present', () => {
		delete window.kadenceDesignTokensFonts;
		delete window.kadence_blocks_params;

		expect(fontCatalogOptions()).toEqual([]);
	});

	it('pins favorites first, then google names, then custom names', () => {
		window.kadenceDesignTokensFonts = { favorites: ['Georgia'], custom: ['My Font'] };
		window.kadence_blocks_params = { g_font_names: ['Abel', 'Abril Fatface'] };

		expect(fontCatalogOptions()).toEqual([
			{ value: 'Georgia', label: 'Georgia', badge: 'Favorite' },
			{ value: 'Abel', label: 'Abel' },
			{ value: 'Abril Fatface', label: 'Abril Fatface' },
			{ value: 'My Font', label: 'My Font', badge: 'Custom' },
		]);
	});

	// A favorite is almost always also a catalog name; without this it would render twice, once
	// pinned and once mid-list, and the second row would look like a different font.
	it('lists a favorite exactly once, keeping its pinned position', () => {
		window.kadenceDesignTokensFonts = { favorites: ['Abril Fatface', 'My Font'], custom: ['My Font'] };
		window.kadence_blocks_params = { g_font_names: ['Abel', 'Abril Fatface'] };

		expect(fontCatalogOptions()).toEqual([
			{ value: 'Abril Fatface', label: 'Abril Fatface', badge: 'Favorite' },
			{ value: 'My Font', label: 'My Font', badge: 'Favorite' },
			{ value: 'Abel', label: 'Abel' },
		]);
	});

	it('matches a favorite against the catalog case-insensitively when deduplicating', () => {
		window.kadenceDesignTokensFonts = { favorites: ['abril fatface'], custom: [] };
		window.kadence_blocks_params = { g_font_names: ['Abril Fatface'] };

		expect(fontCatalogOptions()).toEqual([{ value: 'abril fatface', label: 'abril fatface', badge: 'Favorite' }]);
	});
});
