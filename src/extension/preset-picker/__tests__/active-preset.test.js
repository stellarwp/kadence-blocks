/* eslint-env jest */

// `index.js` imports `@kadence/components` (an untransformed ESM module) for its `PresetPicker`
// component. This file never renders it, so stub the module out.
jest.mock('@kadence/components', () => ({}));

import { activePresetFor, blockPresetThemeClass } from '../index';

const BLOCK = 'kadence/singlebtn';
const SET = 'default';

/**
 * Seed the localized design-token catalog with a block whose `primary` preset is the declared default
 * and whose `ghost` preset is a second, non-default option.
 *
 * @return {void}
 */
function seedCatalog() {
	window.kadenceDesignTokensPresets = {
		active: SET,
		libraries: {
			[SET]: {
				[BLOCK]: {
					default: 'primary',
					presets: [
						{ slug: 'primary', label: 'Primary' },
						{ slug: 'ghost', label: 'Ghost', themeClass: 'kb-btn-global-outline' },
					],
					properties: [],
					values: { primary: {}, ghost: {} },
				},
			},
		},
	};
}

describe('activePresetFor', () => {
	beforeEach(() => {
		seedCatalog();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * A `kbPreset` naming a preset the block still declares is trusted as-is.
	 *
	 * @return {void}
	 */
	it('resolves the explicit selection when it still exists', () => {
		expect(activePresetFor(BLOCK, { kbPreset: 'ghost' }, SET)).toBe('ghost');
	});

	/**
	 * No selection at all falls back to the library's declared default preset.
	 *
	 * @return {void}
	 */
	it('falls back to the default preset when kbPreset is unset', () => {
		expect(activePresetFor(BLOCK, {}, SET)).toBe('primary');
	});

	/**
	 * A `kbPreset` naming a preset the block no longer declares (e.g. it was deleted) falls back to the
	 * default, mirroring the PHP resolver's `has_preset()` / `default_preset()` fallback instead of
	 * being trusted at face value.
	 *
	 * @return {void}
	 */
	it('falls back to the default preset when kbPreset names a deleted preset', () => {
		expect(activePresetFor(BLOCK, { kbPreset: 'deleted-preset' }, SET)).toBe('primary');
	});
});

describe('blockPresetThemeClass', () => {
	beforeEach(() => {
		seedCatalog();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * A class-painted preset answers the classes the catalog carries for it.
	 *
	 * @return {void}
	 */
	it('returns the catalog themeClass of a class-painted preset', () => {
		expect(blockPresetThemeClass(BLOCK, 'ghost', SET)).toBe('kb-btn-global-outline');
	});

	/**
	 * A preset painted through variables, or an unknown slug, answers an empty string.
	 *
	 * @return {void}
	 */
	it('returns an empty string for a preset without a themeClass', () => {
		expect(blockPresetThemeClass(BLOCK, 'primary', SET)).toBe('');
		expect(blockPresetThemeClass(BLOCK, 'missing', SET)).toBe('');
	});
});
