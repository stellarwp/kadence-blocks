/* eslint-env jest */

// `index.js` also re-exports the indicator store and components, which pull in `@wordpress/data` and
// the full `@wordpress/components` tree — neither installed/resolvable here and neither exercised by
// these tests (they only cover the plain functions `index.js` defines directly). Stub the re-exported
// modules out so loading `index.js` doesn't drag that chain in.
jest.mock('@kadence/components', () => ({}));
jest.mock('../store', () => ({ TOKEN_INDICATORS_STORE: 'kadence/token-indicators' }));
jest.mock('../components/TokenIndicator', () => ({ TokenIndicator: () => null }));
jest.mock('../components/TokenLabel', () => ({ TokenLabel: () => null }));
jest.mock('../components/TokenControlRow', () => ({ TokenControlRow: () => null }));

import { usePresetBinding, resetAttrPatch } from '../index';

const BLOCK = 'kadence/singlebtn';
const SET = 'default';

/**
 * Seed the localized design-token catalog with one dimension property (`button-radius` ->
 * `borderRadius`) whose `primary` preset carries a desktop value and a tablet override.
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
					presets: [{ slug: 'primary', label: 'Primary' }],
					properties: [
						{ key: 'button-radius', kind: 'dimension', token: null, control_attr: 'borderRadius' },
					],
					values: {
						primary: { 'button-radius': '4px' },
					},
					responsive: {
						primary: { tablet: { 'button-radius': '8px' } },
					},
				},
			},
		},
	};
}

describe('usePresetBinding device-aware overridden', () => {
	beforeEach(() => {
		seedCatalog();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * On Desktop, a stored value matching the preset's base value reads as bound, not overridden.
	 *
	 * @return {void}
	 */
	it('reports not overridden when the desktop value matches the preset base value', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['4', '4', '4', '4'],
			borderRadiusUnit: 'px',
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Desktop');

		expect(state.borderRadius.overridden).toBe(false);
	});

	/**
	 * On Tablet, the compare uses the tablet attribute against the preset's tablet override, not the
	 * (empty) desktop attribute against the preset's desktop value — so a tablet-only edit that matches
	 * the preset's desktop value but not its tablet override is still caught as overridden.
	 *
	 * @return {void}
	 */
	it('reports overridden when the tablet value differs from the preset tablet override', () => {
		const attributes = {
			kbPreset: 'primary',
			tabletBorderRadius: ['4', '4', '4', '4'],
			borderRadiusUnit: 'px',
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(state.borderRadius.overridden).toBe(true);
	});

	/**
	 * On Tablet, a stored tablet value matching the preset's tablet override reads as bound, not
	 * overridden.
	 *
	 * @return {void}
	 */
	it('reports not overridden when the tablet value matches the preset tablet override', () => {
		const attributes = {
			kbPreset: 'primary',
			tabletBorderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(state.borderRadius.overridden).toBe(false);
	});

	/**
	 * The returned state is always keyed by the desktop attribute name, even when the compare ran
	 * against a different device's attribute.
	 *
	 * @return {void}
	 */
	it('keys the state by the desktop attribute name regardless of the active device', () => {
		const attributes = { kbPreset: 'primary', tabletBorderRadius: ['8', '8', '8', '8'] };

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(Object.keys(state)).toEqual(['borderRadius']);
	});

	/**
	 * With no `previewDevice` argument, the compare falls back to the desktop attribute, preserving the
	 * pre-existing behavior for a caller with no device context (e.g. a block-wide summary).
	 *
	 * @return {void}
	 */
	it('falls back to the desktop attribute when no previewDevice is given', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['4', '4', '4', '4'],
			borderRadiusUnit: 'px',
		};

		const state = usePresetBinding(BLOCK, attributes, SET);

		expect(state.borderRadius.overridden).toBe(false);
	});
});

describe('resetAttrPatch', () => {
	/**
	 * A dimension reset clears the primary, unit, and both responsive companion attributes to their
	 * block.json default shape, using the same device-attribute spelling `usePresetBinding` reads.
	 *
	 * @return {void}
	 */
	it('clears the primary, unit, and responsive companions for a dimension', () => {
		expect(resetAttrPatch('borderRadius', 'dimension')).toEqual({
			borderRadius: ['', '', '', ''],
			borderRadiusUnit: 'px',
			tabletBorderRadius: ['', '', '', ''],
			mobileBorderRadius: ['', '', '', ''],
		});
	});

	/**
	 * A non-dimension kind clears only its single attribute.
	 *
	 * @return {void}
	 */
	it('clears only the primary attribute for a non-dimension kind', () => {
		expect(resetAttrPatch('background', 'color')).toEqual({ background: '' });
	});
});
