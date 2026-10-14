/* eslint-env jest */

// `index.js` imports `@kadence/components` (an untransformed ESM module) for its `PresetPicker`
// component. This file never renders it, so stub the module out.
jest.mock('@kadence/components', () => ({}));

import { activePresetFor, blockPresetThemeClass, presetFallbackReason, storedPresetFor } from '../index';

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
						{ slug: 'outline', label: 'Outline', themeClass: 'kb-btn-global-outline' },
						{ slug: 'theme-base', label: 'Theme Base', themeClass: 'wp-block-button__link button' },
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

	/**
	 * A theme preset the active theme no longer offers falls to the theme's base preset, the closest
	 * look, and to the default only when the theme has no base preset either.
	 *
	 * @return {void}
	 */
	it('falls back to theme-base for a theme preset the theme lacks, then to the default', () => {
		expect(activePresetFor(BLOCK, { kbPreset: 'theme-secondary' }, SET)).toBe('theme-base');

		window.kadenceDesignTokensPresets.libraries[SET][BLOCK].presets = [{ slug: 'primary', label: 'Primary' }];

		expect(activePresetFor(BLOCK, { kbPreset: 'theme-secondary' }, SET)).toBe('primary');
	});

	/**
	 * A block with no kbPreset yet renders the preset its retired inheritStyles value maps to, through the
	 * same chain, so a saved button lists the same preset the server resolves for it.
	 *
	 * @return {void}
	 */
	it('maps a retired inheritStyles value through the chain when kbPreset is empty', () => {
		expect(activePresetFor(BLOCK, { inheritStyles: 'inherit' }, SET)).toBe('theme-base');
		expect(activePresetFor(BLOCK, { inheritStyles: 'inherit-secondary' }, SET)).toBe('theme-base');
		expect(activePresetFor(BLOCK, { inheritStyles: 'outline' }, SET)).toBe('outline');
		expect(activePresetFor(BLOCK, { inheritStyles: 'fill' }, SET)).toBe('primary');
		expect(activePresetFor(BLOCK, { kbPreset: 'ghost', inheritStyles: 'inherit' }, SET)).toBe('ghost');
	});
});

describe('storedPresetFor', () => {
	/**
	 * Only the button maps its retired style attribute; every other block reads its kbPreset alone.
	 *
	 * @return {void}
	 */
	it('maps inheritStyles for the button only', () => {
		expect(storedPresetFor(BLOCK, { inheritStyles: 'inherit-secondary' })).toBe('theme-secondary');
		expect(storedPresetFor(BLOCK, { inheritStyles: 'fill' })).toBe('');
		expect(storedPresetFor(BLOCK, {})).toBe('');
		expect(storedPresetFor('kadence/column', { inheritStyles: 'inherit', kbPreset: '' })).toBe('');
		expect(storedPresetFor('kadence/column', { kbPreset: 'ghost' })).toBe('ghost');
	});
});

describe('presetFallbackReason', () => {
	beforeEach(() => {
		seedCatalog();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * The reason names why the stored preset is not the one rendered, and is empty when it renders.
	 *
	 * @return {void}
	 */
	it('answers theme for a missing theme preset, missing for a deleted one, and nothing otherwise', () => {
		expect(presetFallbackReason(BLOCK, { kbPreset: 'theme-secondary' }, SET)).toBe('theme');
		expect(presetFallbackReason(BLOCK, { inheritStyles: 'inherit-secondary' }, SET)).toBe('theme');
		expect(presetFallbackReason(BLOCK, { kbPreset: 'gone' }, SET)).toBe('missing');
		expect(presetFallbackReason(BLOCK, { kbPreset: 'theme-base' }, SET)).toBe('');
		expect(presetFallbackReason(BLOCK, { inheritStyles: 'inherit' }, SET)).toBe('');
		expect(presetFallbackReason(BLOCK, {}, SET)).toBe('');
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
