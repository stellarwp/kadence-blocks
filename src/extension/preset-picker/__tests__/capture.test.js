/* eslint-env jest */

// `capture.js` pulls in `./index`, which imports `@kadence/components` (an untransformed ESM module) for
// its `PresetPicker` component. `capturedTokens` never renders it, so stub the module out.
jest.mock('@kadence/components', () => ({}));

import { capturedTokens } from '../capture';

const BLOCK = 'kadence/singlebtn';
const SET = 'default';

/**
 * Seed the localized design-token catalog with a two-property block (a color and a dimension) whose
 * `primary` preset carries known values.
 *
 * @return {void}
 */
function seedCatalog() {
	window.kadenceDesignTokensPresets = {
		active: 'default',
		sets: {
			default: {
				[BLOCK]: {
					default: 'primary',
					presets: [{ slug: 'primary', label: 'Primary' }],
					properties: [
						{ key: 'button-bg', kind: 'color', token: null, control_attr: 'background' },
						{ key: 'button-radius', kind: 'dimension', token: null, control_attr: 'borderRadius' },
					],
					values: {
						primary: { 'button-bg': '#111111', 'button-radius': '4px' },
					},
				},
			},
		},
	};
}

describe('capturedTokens', () => {
	beforeEach(() => {
		seedCatalog();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	it('captures an edited color as its normalized literal', () => {
		const attributes = { kbPreset: 'primary', background: '#FF0000' };

		expect(capturedTokens(BLOCK, SET, attributes)['button-bg']).toBe('#ff0000');
	});

	it('falls back to the preset value when a control is not edited', () => {
		const attributes = { kbPreset: 'primary' };

		expect(capturedTokens(BLOCK, SET, attributes)['button-bg']).toBe('#111111');
	});

	it('composes an edited dimension from its value and unit', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '', '', ''],
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toBe('8px');
	});

	it('uses the default preset when no preset is selected', () => {
		const tokens = capturedTokens(BLOCK, SET, {});

		expect(tokens).toEqual({ 'button-bg': '#111111', 'button-radius': '4px' });
	});

	it('layers an edit over the preset for the rest of the surface', () => {
		const attributes = { kbPreset: 'primary', background: '#00FF00' };
		const tokens = capturedTokens(BLOCK, SET, attributes);

		expect(tokens).toEqual({ 'button-bg': '#00ff00', 'button-radius': '4px' });
	});
});
