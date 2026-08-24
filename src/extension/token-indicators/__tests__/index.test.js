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

import { usePresetBinding, resetAttrPatch, presetPropertyValueForDevice } from '../index';

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

describe('presetPropertyValueForDevice', () => {
	/**
	 * Seed a property with no `control_attr` — `usePresetBinding` cannot key it by an attribute name,
	 * so `presetPropertyValueForDevice` is the only way a caller reads its resolved preset value.
	 *
	 * @return {void}
	 */
	function seedNoAttrProperty() {
		window.kadenceDesignTokensPresets = {
			active: SET,
			libraries: {
				[SET]: {
					[BLOCK]: {
						default: 'primary',
						presets: [{ slug: 'primary', label: 'Primary' }],
						properties: [{ key: 'button-border-width', kind: 'dimension', token: null }],
						values: {
							primary: { 'button-border-width': '2px' },
						},
						responsive: {
							primary: { tablet: { 'button-border-width': '4px' } },
						},
					},
				},
			},
		};
	}

	beforeEach(() => {
		seedNoAttrProperty();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * The active preset's desktop value resolves for a property `usePresetBinding` has no attribute to
	 * key it by.
	 *
	 * @return {void}
	 */
	it('resolves the active preset value for a property with no control_attr', () => {
		const value = presetPropertyValueForDevice(
			BLOCK,
			'button-border-width',
			{ kbPreset: 'primary' },
			SET,
			'Desktop'
		);

		expect(value).toBe('2px');
	});

	/**
	 * A resolved value of `0` (a real, meaningful preset value) is not falsy-collapsed to `undefined` —
	 * distinguishing "the preset sets 0" from "the preset sets nothing" matters to a caller deciding
	 * whether to show a muted default at all.
	 *
	 * @return {void}
	 */
	it('resolves a zero preset value rather than treating it as unset', () => {
		window.kadenceDesignTokensPresets.libraries[SET][BLOCK].values.primary['button-border-width'] = '0px';

		const value = presetPropertyValueForDevice(
			BLOCK,
			'button-border-width',
			{ kbPreset: 'primary' },
			SET,
			'Desktop'
		);

		expect(value).toBe('0px');
	});

	/**
	 * On Tablet, the preset's tablet override resolves instead of its desktop value.
	 *
	 * @return {void}
	 */
	it('resolves the tablet override on Tablet', () => {
		const value = presetPropertyValueForDevice(
			BLOCK,
			'button-border-width',
			{ kbPreset: 'primary' },
			SET,
			'Tablet'
		);

		expect(value).toBe('4px');
	});

	/**
	 * A user-selected preset (`kbPreset` in `attributes`) resolves, not just the block's default preset
	 * — the whole point of taking `attributes` is to honor a genuine user selection.
	 *
	 * @return {void}
	 */
	it('resolves the user-selected preset, not just the block default', () => {
		window.kadenceDesignTokensPresets.libraries[SET][BLOCK].presets.push({ slug: 'secondary', label: 'Secondary' });
		window.kadenceDesignTokensPresets.libraries[SET][BLOCK].values.secondary = { 'button-border-width': '6px' };

		const value = presetPropertyValueForDevice(
			BLOCK,
			'button-border-width',
			{ kbPreset: 'secondary' },
			SET,
			'Desktop'
		);

		expect(value).toBe('6px');
	});

	/**
	 * A property the active preset does not set resolves to `undefined`, so a caller can tell "no
	 * default" apart from a real, falsy-but-meaningful value like `0`.
	 *
	 * @return {void}
	 */
	it('resolves undefined when the active preset does not set the property', () => {
		const value = presetPropertyValueForDevice(BLOCK, 'button-shadow', { kbPreset: 'primary' }, SET, 'Desktop');

		expect(value).toBeUndefined();
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
