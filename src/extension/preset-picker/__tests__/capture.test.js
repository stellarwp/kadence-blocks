/* eslint-env jest */

// `capture.js` pulls in `./index`, which imports `@kadence/components` (an untransformed ESM module) for
// its `PresetPicker` component. `capturedTokens` never renders it, so stub the module out.
jest.mock('@kadence/components', () => ({}));

import { capturedTokens, capturedCatalogValues } from '../capture';

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
		libraries: {
			default: {
				[BLOCK]: {
					default: 'primary',
					presets: [{ slug: 'primary', label: 'Primary' }],
					properties: [
						{ key: 'button-bg', kind: 'color', token: null, control_attr: 'background' },
						{
							key: 'button-radius',
							kind: 'dimension',
							token: null,
							control_attr: 'borderRadius',
							responsive_attrs: {
								tablet: 'tabletBorderRadius',
								mobile: 'mobileBorderRadius',
							},
						},
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
			borderRadius: '8',
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toBe('8px');
	});

	it('captures a uniform token alias as a whole-string alias with no unit appended', () => {
		const alias = '{primitive.dimension.radius.sm}';
		const attributes = {
			kbPreset: 'primary',
			borderRadius: [alias, alias, alias, alias],
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toBe(alias);
	});

	it('captures four identical literals as a single value', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toBe('8px');
	});

	it('captures mixed literal corners as a slot list', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '4', '4'],
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toEqual(['8px', '8px', '4px', '4px']);
	});

	it('captures mixed alias and literal corners as a slot list, with no unit on the aliases', () => {
		const alias = '{primitive.dimension.radius.md}';
		const attributes = {
			kbPreset: 'primary',
			borderRadius: [alias, '8', alias, '8'],
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toEqual([alias, '8px', alias, '8px']);
	});

	it('captures mixed alias corners as a slot list', () => {
		const md = '{primitive.dimension.radius.md}';
		const sm = '{primitive.dimension.radius.sm}';
		const attributes = {
			kbPreset: 'primary',
			borderRadius: [md, sm, md, sm],
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toEqual([md, sm, md, sm]);
	});

	it('fills an empty corner from the preset value', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '', '', ''],
			borderRadiusUnit: 'px',
		};

		// The preset's button-radius is '4px', so the three untouched corners inherit it.
		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toEqual(['8px', '4px', '4px', '4px']);
	});

	it('fills an empty corner from the matching slot of a per-corner preset value', () => {
		window.kadenceDesignTokensPresets.libraries[SET][BLOCK].values.primary['button-radius'] = [
			'1px',
			'2px',
			'3px',
			'4px',
		];

		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '', '', ''],
			borderRadiusUnit: 'px',
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toEqual(['8px', '2px', '3px', '4px']);
	});

	it('survives a round trip through the preset values without flattening', () => {
		const slots = ['8px', '8px', '4px', '4px'];
		window.kadenceDesignTokensPresets.libraries[SET][BLOCK].values.primary['button-radius'] = slots;

		// Nothing edited: the not-edited fallback must hand the slot list back unchanged.
		expect(capturedTokens(BLOCK, SET, { kbPreset: 'primary' })['button-radius']).toEqual(slots);
	});

	it('captures a per-breakpoint override as a responsive envelope', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
			mobileBorderRadius: ['2', '2', '2', '2'],
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toEqual({
			$value: '8px',
			$extensions: { 'com.kadence.designTokens': { responsive: { mobile: '2px' } } },
		});
	});

	it('captures per-corner values at a breakpoint', () => {
		const alias = '{primitive.dimension.radius.md}';
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
			tabletBorderRadius: [alias, '4', alias, '4'],
		};

		expect(capturedTokens(BLOCK, SET, attributes)['button-radius']).toEqual({
			$value: '8px',
			$extensions: {
				'com.kadence.designTokens': { responsive: { tablet: [alias, '4px', alias, '4px'] } },
			},
		});
	});

	it('captures both breakpoints when both are set', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
			tabletBorderRadius: ['4', '4', '4', '4'],
			mobileBorderRadius: ['2', '2', '2', '2'],
		};

		expect(
			capturedTokens(BLOCK, SET, attributes)['button-radius'].$extensions['com.kadence.designTokens'].responsive
		).toEqual({ tablet: '4px', mobile: '2px' });
	});

	it('omits a breakpoint whose attribute is unset, so it inherits', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
			tabletBorderRadius: ['', '', '', ''],
			mobileBorderRadius: ['2', '2', '2', '2'],
		};

		expect(
			capturedTokens(BLOCK, SET, attributes)['button-radius'].$extensions['com.kadence.designTokens'].responsive
		).toEqual({ mobile: '2px' });
	});

	it('leaves an unset corner at a breakpoint as a gap, not filled from the base or the preset', () => {
		const full = '{primitive.dimension.radius.full}';
		const xl = '{primitive.dimension.radius.xl}';
		const attributes = {
			kbPreset: 'primary',
			borderRadius: [xl, xl, xl, xl],
			borderRadiusUnit: 'px',
			tabletBorderRadius: [full, '', '', ''],
		};

		// The three untouched Tablet corners stay a gap ('') instead of being frozen against Desktop's
		// radius at capture time, so they keep inheriting live through the cascade at render time.
		expect(
			capturedTokens(BLOCK, SET, attributes)['button-radius'].$extensions['com.kadence.designTokens'].responsive
		).toEqual({ tablet: [full, '', '', ''] });
	});

	it('leaves an unset Mobile corner as a gap even when Tablet has a captured value for it', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
			tabletBorderRadius: ['4', '4', '4', '4'],
			mobileBorderRadius: ['2', '', '', ''],
		};

		expect(
			capturedTokens(BLOCK, SET, attributes)['button-radius'].$extensions['com.kadence.designTokens'].responsive
		).toEqual({ tablet: '4px', mobile: ['2px', '', '', ''] });
	});

	it('leaves an unset Mobile corner as a gap when Tablet stores nothing either', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
			borderRadiusUnit: 'px',
			tabletBorderRadius: ['', '', '', ''],
			mobileBorderRadius: ['2', '', '', ''],
		};

		expect(
			capturedTokens(BLOCK, SET, attributes)['button-radius'].$extensions['com.kadence.designTokens'].responsive
		).toEqual({ mobile: ['2px', '', '', ''] });
	});

	it('stays a bare value when no breakpoint is set', () => {
		const attributes = {
			kbPreset: 'primary',
			borderRadius: ['8', '8', '8', '8'],
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

describe('capturedTokens border axis properties', () => {
	/**
	 * Seed the localized catalog with the three border-axis properties, all sharing the
	 * `control_attr: 'borderStyle'` binding `declarations.php` declares — the shape whose nested
	 * per-side native value corrupted the capture loop before this fix.
	 *
	 * @return {void}
	 */
	function seedBorderCatalog() {
		window.kadenceDesignTokensPresets = {
			active: 'default',
			libraries: {
				default: {
					[BLOCK]: {
						default: 'primary',
						presets: [{ slug: 'primary', label: 'Primary' }],
						properties: [
							{
								key: 'button-border-width',
								kind: 'dimension',
								token: 'semantic.border-width.default',
								control_attr: 'borderStyle',
								axis: 'border-width',
							},
							{
								key: 'button-border-style',
								kind: 'color',
								token: 'semantic.border-style.default',
								control_attr: 'borderStyle',
								axis: 'border-style',
							},
							{
								key: 'button-border-color',
								kind: 'color',
								token: 'semantic.color.border',
								control_attr: 'borderStyle',
								axis: 'border-color',
							},
						],
						values: {
							primary: {
								'button-border-width': '2px',
								'button-border-style': 'solid',
								'button-border-color': '#3182ce',
							},
						},
					},
				},
			},
		};
	}

	beforeEach(() => {
		seedBorderCatalog();
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * A block with a border set (a populated nested per-side native `borderStyle` attribute) captures
	 * the three border-axis properties as their unchanged preset values — not the "[object Object]"
	 * garbage the flat dimension/color read produced before this fix.
	 *
	 * @return {void}
	 */
	it('captures the three border-axis properties unchanged, not corrupted, when a border is set', () => {
		const attributes = {
			kbPreset: 'primary',
			borderStyle: [
				{
					top: ['#ffffff', 'dashed', '4'],
					right: ['#ffffff', 'dashed', '4'],
					bottom: ['#ffffff', 'dashed', '4'],
					left: ['#ffffff', 'dashed', '4'],
					unit: 'px',
				},
			],
		};

		const tokens = capturedTokens(BLOCK, SET, attributes);

		expect(tokens['button-border-width']).toBe('2px');
		expect(tokens['button-border-style']).toBe('solid');
		expect(tokens['button-border-color']).toBe('#3182ce');
	});

	/**
	 * A block with no border set at all also captures the three border-axis properties as their
	 * unchanged preset values, matching the "not edited" fallback every other unmapped property takes.
	 *
	 * @return {void}
	 */
	it('captures the three border-axis properties unchanged when no border is set', () => {
		const tokens = capturedTokens(BLOCK, SET, { kbPreset: 'primary' });

		expect(tokens['button-border-width']).toBe('2px');
		expect(tokens['button-border-style']).toBe('solid');
		expect(tokens['button-border-color']).toBe('#3182ce');
	});
});

describe('capturedCatalogValues', () => {
	beforeEach(() => {
		seedCatalog();

		window.kadenceDesignTokensPickable = {
			tokens: [],
			values: {
				default: {
					'primitive.dimension.radius.xl': '1rem',
					'primitive.dimension.radius.full': '9999px',
				},
			},
		};
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
		delete window.kadenceDesignTokensPickable;
	});

	it('resolves an alias to the library literal', () => {
		const captured = capturedCatalogValues({ 'button-radius': '{primitive.dimension.radius.xl}' }, SET);

		expect(captured).toEqual({ values: { 'button-radius': '1rem' }, responsive: {} });
	});

	it('passes a literal through untouched', () => {
		const captured = capturedCatalogValues({ 'button-bg': '#ff0000' }, SET);

		expect(captured.values).toEqual({ 'button-bg': '#ff0000' });
	});

	it('keeps an alias the library does not define, rather than emptying it', () => {
		const captured = capturedCatalogValues({ 'button-radius': '{primitive.dimension.radius.none}' }, SET);

		expect(captured.values['button-radius']).toBe('{primitive.dimension.radius.none}');
	});

	it('resolves a per-corner list slot by slot', () => {
		const captured = capturedCatalogValues(
			{ 'button-radius': ['{primitive.dimension.radius.full}', '8px', '8px', '8px'] },
			SET
		);

		expect(captured.values['button-radius']).toEqual(['9999px', '8px', '8px', '8px']);
	});

	it('splits a responsive envelope into the base value and the per-breakpoint map', () => {
		const captured = capturedCatalogValues(
			{
				'button-radius': {
					$value: '{primitive.dimension.radius.xl}',
					$extensions: {
						'com.kadence.designTokens': {
							responsive: { tablet: ['{primitive.dimension.radius.full}', '1rem', '1rem', '1rem'] },
						},
					},
				},
			},
			SET
		);

		expect(captured).toEqual({
			values: { 'button-radius': '1rem' },
			responsive: { tablet: { 'button-radius': ['9999px', '1rem', '1rem', '1rem'] } },
		});
	});
});
