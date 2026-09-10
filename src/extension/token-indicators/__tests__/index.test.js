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

import {
	usePresetBinding,
	resetAttrPatch,
	presetPropertyReference,
	presetPropertyValueForDevice,
	mappedAttrsFor,
	deriveStateBinding,
} from '../index';

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
					overridden: {
						primary: { 'button-radius': true },
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

describe('usePresetBinding per-corner breakpoint gaps', () => {
	// The preset's tablet override touches only the top corner (index 0); the other three corners
	// carry a `''` gap, meaning "keep inheriting the base value live" — see
	// `resolve_responsive_literal()`'s docblock. The indicator must read each corner's own state
	// rather than treating the whole property as one overridden/matching unit.
	beforeEach(() => {
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
							primary: { tablet: { 'button-radius': ['8px', '', '', ''] } },
						},
						overridden: {
							primary: { 'button-radius': true },
						},
					},
				},
			},
		};
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * A stored tablet value matching the overridden top corner AND the base value the other three
	 * corners keep inheriting reads as bound, not overridden — a gap corner is compared against the
	 * base, not against the (nonexistent) tablet override.
	 *
	 * @return {void}
	 */
	it('reports not overridden when every corner matches its own per-corner cascade value', () => {
		const attributes = {
			kbPreset: 'primary',
			tabletBorderRadius: ['8', '4', '4', '4'],
			borderRadiusUnit: 'px',
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(state.borderRadius.overridden).toBe(false);
	});

	/**
	 * A stored value on a GAP corner (right, index 1) that diverges from the base value it should be
	 * inheriting is caught as overridden, even though the touched corner (top) still matches its own
	 * tablet override.
	 *
	 * @return {void}
	 */
	it('reports overridden when a gap corner diverges from the base value it inherits', () => {
		const attributes = {
			kbPreset: 'primary',
			tabletBorderRadius: ['8', '5', '4', '4'],
			borderRadiusUnit: 'px',
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(state.borderRadius.overridden).toBe(true);
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
						overridden: {
							primary: { 'button-border-width': true },
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
		window.kadenceDesignTokensPresets.libraries[SET][BLOCK].overridden.secondary = { 'button-border-width': true };

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

describe('usePresetBinding border width/style/color combining', () => {
	/**
	 * Seed the localized catalog with the three border-axis properties, all sharing the
	 * `control_attr: 'borderStyle'` binding `declarations.php` now declares.
	 *
	 * @return {void}
	 */
	function seedBorderCatalog() {
		window.kadenceDesignTokensPresets = {
			active: SET,
			libraries: {
				[SET]: {
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
						responsive: {
							primary: { tablet: { 'button-border-color': '#000000' } },
						},
						overridden: {
							primary: {
								'button-border-width': true,
								'button-border-style': true,
								'button-border-color': true,
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
	 * A never-written native border value reads as bound and not overridden, combining all three axes
	 * into the single `borderStyle` state entry.
	 *
	 * @return {void}
	 */
	it('combines the three axes into one borderStyle entry, reading bound when never written', () => {
		const state = usePresetBinding(BLOCK, { kbPreset: 'primary' }, SET, 'Desktop');

		expect(Object.keys(state)).toEqual(['borderStyle']);
		expect(state.borderStyle.kind).toBe('border');
		expect(state.borderStyle.bound).toBe(true);
		expect(state.borderStyle.overridden).toBe(false);
		expect(state.borderStyle.presetValue).toEqual({ width: '2px', style: 'solid', color: '#3182ce' });
	});

	/**
	 * A native border value equal to the preset on every axis and every side is bound, not overridden.
	 *
	 * @return {void}
	 */
	it('reads a native value matching the preset on every axis as not overridden', () => {
		const attributes = {
			kbPreset: 'primary',
			borderStyle: [
				{
					top: ['#3182ce', 'solid', '2'],
					right: ['#3182ce', 'solid', '2'],
					bottom: ['#3182ce', 'solid', '2'],
					left: ['#3182ce', 'solid', '2'],
					unit: 'px',
				},
			],
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Desktop');

		expect(state.borderStyle.overridden).toBe(false);
	});

	/**
	 * A native border value diverging on only ONE axis (color) still reports the combined entry as
	 * overridden — "overridden" means any axis diverges, not every axis.
	 *
	 * @return {void}
	 */
	it('reports overridden when only one axis diverges from its own preset value', () => {
		const attributes = {
			kbPreset: 'primary',
			borderStyle: [
				{
					top: ['#ffffff', 'solid', '2'],
					right: ['#ffffff', 'solid', '2'],
					bottom: ['#ffffff', 'solid', '2'],
					left: ['#ffffff', 'solid', '2'],
					unit: 'px',
				},
			],
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Desktop');

		expect(state.borderStyle.overridden).toBe(true);
	});

	/**
	 * On Tablet, a border axis reads its OWN device's stored attribute against the preset's tablet
	 * override — not the desktop attribute against the desktop preset value, which is what the border
	 * axes did before treating them as responsive like a dimension.
	 *
	 * @return {void}
	 */
	it('reports not overridden when the tablet border value matches the preset tablet override', () => {
		const attributes = {
			kbPreset: 'primary',
			tabletBorderStyle: [
				{
					top: ['#000000', 'solid', '2'],
					right: ['#000000', 'solid', '2'],
					bottom: ['#000000', 'solid', '2'],
					left: ['#000000', 'solid', '2'],
					unit: 'px',
				},
			],
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(state.borderStyle.overridden).toBe(false);
	});

	/**
	 * On Tablet, a border axis diverging from the preset's tablet override reads as overridden even
	 * though it would match the preset's desktop value.
	 *
	 * @return {void}
	 */
	it('reports overridden when the tablet border value differs from the preset tablet override', () => {
		const attributes = {
			kbPreset: 'primary',
			tabletBorderStyle: [
				{
					top: ['#3182ce', 'solid', '2'],
					right: ['#3182ce', 'solid', '2'],
					bottom: ['#3182ce', 'solid', '2'],
					left: ['#3182ce', 'solid', '2'],
					unit: 'px',
				},
			],
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(state.borderStyle.overridden).toBe(true);
	});

	/**
	 * On Tablet, the compare uses the tablet border attribute against the preset value in effect at
	 * Tablet, not the (empty) desktop attribute — mirroring the dimension kind's own device-awareness
	 * (see the `usePresetBinding device-aware overridden` suite above). Before this fix, border kinds
	 * always read the desktop attribute regardless of `previewDevice`.
	 *
	 * @return {void}
	 */
	it('reads the tablet border attribute, not the desktop one, when previewDevice is Tablet', () => {
		const attributes = {
			kbPreset: 'primary',
			// Desktop stores a color that would NOT match the preset if read by mistake.
			borderStyle: [
				{
					top: ['#ffffff', 'solid', '2'],
					right: ['#ffffff', 'solid', '2'],
					bottom: ['#ffffff', 'solid', '2'],
					left: ['#ffffff', 'solid', '2'],
					unit: 'px',
				},
			],
			// Tablet stores exactly the preset's tablet-effective values — color from its tablet
			// override, width/style falling back to their (device-less) desktop value.
			tabletBorderStyle: [
				{
					top: ['#000000', 'solid', '2'],
					right: ['#000000', 'solid', '2'],
					bottom: ['#000000', 'solid', '2'],
					left: ['#000000', 'solid', '2'],
					unit: 'px',
				},
			],
		};

		const state = usePresetBinding(BLOCK, attributes, SET, 'Tablet');

		expect(state.borderStyle.overridden).toBe(false);
	});
});

describe('mappedAttrsFor border dedupe', () => {
	/**
	 * The three border-axis properties, sharing one `control_attr`, collapse to a single mapped
	 * attribute reporting the combined `'border'` kind — not three entries with three different
	 * (individually wrong) kinds for `resetAttrPatch` to act on.
	 *
	 * @return {void}
	 */
	it('collapses the three border-axis properties into one border-kind entry', () => {
		window.kadenceDesignTokensPresets = {
			active: SET,
			libraries: {
				[SET]: {
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
							{ key: 'button-radius', kind: 'dimension', token: null, control_attr: 'borderRadius' },
						],
						values: {},
						responsive: {},
					},
				},
			},
		};

		expect(mappedAttrsFor(BLOCK, SET)).toEqual([
			{ attr: 'borderStyle', kind: 'border' },
			{ attr: 'borderRadius', kind: 'dimension' },
		]);

		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * The axis is read from the declaration, not matched against a list of property names, so a block
	 * naming its border properties differently (Advanced Text's `borderWidth`/`borderStyle`/`borderColor`
	 * against the Button's `button-border-*`) collapses to one border-kind entry just the same.
	 *
	 * @return {void}
	 */
	it('collapses a differently-named border trio declared by another block', () => {
		window.kadenceDesignTokensPresets = {
			active: SET,
			libraries: {
				[SET]: {
					'kadence/advancedheading': {
						default: 'default',
						presets: [{ slug: 'default', label: 'Default' }],
						properties: [
							{
								key: 'borderWidth',
								kind: 'dimension',
								token: 'semantic.border-width.default',
								control_attr: 'borderStyle',
								axis: 'border-width',
							},
							{
								key: 'borderStyle',
								kind: 'color',
								token: 'semantic.border-style.default',
								control_attr: 'borderStyle',
								axis: 'border-style',
							},
							{
								key: 'borderColor',
								kind: 'color',
								token: 'semantic.color.border',
								control_attr: 'borderStyle',
								axis: 'border-color',
							},
						],
						values: {},
						responsive: {},
					},
				},
			},
		};

		expect(mappedAttrsFor('kadence/advancedheading', SET)).toEqual([{ attr: 'borderStyle', kind: 'border' }]);

		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * A property that declares no axis keeps its own generic kind, so the ordinary one-property-per-
	 * attribute case is untouched by the axis lookup.
	 *
	 * @return {void}
	 */
	it('leaves a property that declares no axis on its own kind', () => {
		window.kadenceDesignTokensPresets = {
			active: SET,
			libraries: {
				[SET]: {
					[BLOCK]: {
						default: 'primary',
						presets: [{ slug: 'primary', label: 'Primary' }],
						properties: [
							{ key: 'button-bg', kind: 'color', token: null, control_attr: 'background' },
							{ key: 'button-radius', kind: 'dimension', token: null, control_attr: 'borderRadius' },
						],
						values: {},
						responsive: {},
					},
				},
			},
		};

		expect(mappedAttrsFor(BLOCK, SET)).toEqual([
			{ attr: 'background', kind: 'color' },
			{ attr: 'borderRadius', kind: 'dimension' },
		]);

		delete window.kadenceDesignTokensPresets;
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
	 * A SCALAR dimension clears to a bare value, not to the four-slot shape, and gains no unit
	 * companion. `kadence/single-icon`'s `size` is a plain number with no `sizeUnit`, so the four-slot
	 * default would store an array in a scalar -- which the field reads straight back as a custom
	 * value -- alongside an attribute the block never declares. Only the block's own schema can say
	 * which shape an attribute is, which is why every reset call site passes it.
	 *
	 * @return {void}
	 */
	it('clears a scalar dimension to a bare value, with no unit companion', () => {
		const declared = {
			size: { type: ['number', 'string'], default: 50 },
			tabletSize: { type: ['number', 'string'], default: '' },
			mobileSize: { type: ['number', 'string'], default: '' },
		};

		expect(resetAttrPatch('size', 'dimension', declared)).toEqual({
			size: '',
			tabletSize: '',
			mobileSize: '',
		});
	});

	/**
	 * Without a schema the four-slot shape stands. That is the historical fallback, and the reason a
	 * block whose attribute is a scalar must not be left relying on it.
	 *
	 * @return {void}
	 */
	it('falls back to the four-slot shape when no schema is given', () => {
		expect(resetAttrPatch('size', 'dimension')).toEqual({
			size: ['', '', '', ''],
			sizeUnit: 'px',
			tabletSize: ['', '', '', ''],
			mobileSize: ['', '', '', ''],
		});
	});

	/**
	 * A non-dimension kind clears only its single attribute when the block declares no companion.
	 *
	 * @return {void}
	 */
	it('clears only the primary attribute for a non-dimension kind', () => {
		expect(resetAttrPatch('background', 'color')).toEqual({ background: '' });
	});

	/**
	 * A color also clears its palette-CLASS companion, in whichever spelling the block declares.
	 *
	 * WordPress emits its palette utility classes with `!important` -- over a hundred of them -- so a
	 * stale `has-<slug>-color` beats every rule a preset can produce, at any specificity. Clearing the
	 * color attribute alone leaves the class on the element still winning, and the preset reads as
	 * broken rather than overridden.
	 *
	 * @return {void}
	 */
	it('clears a color attribute palette-class companion', () => {
		// `color` -> `colorClass`, the Advanced Text spelling.
		expect(resetAttrPatch('color', 'color', { color: {}, colorClass: {} })).toEqual({
			color: '',
			colorClass: '',
		});

		// `background` -> `backgroundColorClass`, the same block's other spelling.
		expect(resetAttrPatch('background', 'color', { background: {}, backgroundColorClass: {} })).toEqual({
			background: '',
			backgroundColorClass: '',
		});

		// `bgColor` -> `bgColorClass`, the Row Layout spelling.
		expect(resetAttrPatch('bgColor', 'color', { bgColor: {}, bgColorClass: {} })).toEqual({
			bgColor: '',
			bgColorClass: '',
		});
	});

	/**
	 * A block declaring no such companion gains no attribute it never declared, and a non-color kind is
	 * never given one at all.
	 *
	 * @return {void}
	 */
	it('writes no palette-class companion the block does not declare', () => {
		expect(resetAttrPatch('color', 'color', { color: {} })).toEqual({ color: '' });

		// Not a color: a `textTransform` has no palette class even if something similarly named exists.
		expect(resetAttrPatch('textTransform', 'text', { textTransform: {}, textTransformClass: {} })).toEqual({
			textTransform: '',
		});
	});

	/**
	 * A dimension whose block stores it as a SCALAR clears to '', not to a 4-side array. Writing the
	 * array shape into `kadence/single-icon`'s `size` — a single number written into the SVG's geometry
	 * attributes — leaves the control reading an array back as a custom value.
	 *
	 * @return {void}
	 */
	it('clears a scalar dimension to an empty string, not a 4-side array', () => {
		const declared = {
			size: { type: ['number', 'string'], default: 50 },
			tabletSize: { type: ['number', 'string'], default: '' },
			mobileSize: { type: ['number', 'string'], default: '' },
		};

		expect(resetAttrPatch('size', 'dimension', declared)).toEqual({
			size: '',
			tabletSize: '',
			mobileSize: '',
		});
	});

	/**
	 * The unit companion is written only when the block declares one — `size` has no `sizeUnit`, and
	 * inventing it would store an attribute the block never reads.
	 *
	 * @return {void}
	 */
	it('does not invent a unit attribute the block does not declare', () => {
		const declared = { size: { default: 50 } };

		expect(resetAttrPatch('size', 'dimension', declared)).not.toHaveProperty('sizeUnit');
	});

	/**
	 * A 4-side dimension still clears to the array shape and its unit when the schema says so, so the
	 * shape is read from the block rather than guessed either way.
	 *
	 * @return {void}
	 */
	it('still clears a declared 4-side dimension to the array shape', () => {
		const declared = {
			borderRadius: { type: 'array', default: ['', '', '', ''] },
			borderRadiusUnit: { type: 'string', default: 'px' },
			tabletBorderRadius: { type: 'array', default: ['', '', '', ''] },
			mobileBorderRadius: { type: 'array', default: ['', '', '', ''] },
		};

		expect(resetAttrPatch('borderRadius', 'dimension', declared)).toEqual({
			borderRadius: ['', '', '', ''],
			borderRadiusUnit: 'px',
			tabletBorderRadius: ['', '', '', ''],
			mobileBorderRadius: ['', '', '', ''],
		});
	});

	/**
	 * A block that declares no responsive companions gets none written.
	 *
	 * @return {void}
	 */
	it('omits responsive companions the block does not declare', () => {
		const declared = { iconSize: { type: 'string', default: '' } };

		expect(resetAttrPatch('iconSize', 'dimension', declared)).toEqual({ iconSize: '' });
	});

	/**
	 * A border reset clears the primary attribute and both responsive companions to an empty ARRAY
	 * (`[]`), not `['', '', '', '']` — the shape `EditorBorderControl`'s `fromNativeBorder` reads as
	 * "never written" via its `!native?.[0]` short-circuit.
	 *
	 * @return {void}
	 */
	it('clears the primary and responsive companions to an empty array for a border', () => {
		expect(resetAttrPatch('borderStyle', 'border')).toEqual({
			borderStyle: [],
			tabletBorderStyle: [],
			mobileBorderStyle: [],
		});
	});
});

describe('deriveStateBinding', () => {
	/**
	 * When the shared binding is not bound at all (no preset governs the property), the derived state
	 * is not bound either — there is nothing to compare a per-state value against.
	 *
	 * @return {void}
	 */
	it('reports not bound when the shared binding is not bound', () => {
		expect(deriveStateBinding({ shared: undefined, kind: 'dimension', value: ['4', '4', '4', '4'] })).toEqual({
			bound: false,
			overridden: false,
		});
	});

	/**
	 * A dimension state (e.g. Sticky's own Border Radius) whose own value matches the shared preset at
	 * the active device reads as bound and not overridden.
	 *
	 * @return {void}
	 */
	it('reports a dimension state as bound and not overridden when its own value matches the shared preset', () => {
		const shared = { bound: true };

		const state = deriveStateBinding({
			shared,
			kind: 'dimension',
			value: ['4', '4', '4', '4'],
			unit: 'px',
			devicePresetValue: '4px',
		});

		expect(state).toEqual({ bound: true, overridden: false });
	});

	/**
	 * A dimension state whose own value diverges from the shared preset reads as overridden — even
	 * though the shared binding itself (Normal's) might still match.
	 *
	 * @return {void}
	 */
	it('reports a dimension state as overridden when its own value diverges from the shared preset', () => {
		const shared = { bound: true };

		const state = deriveStateBinding({
			shared,
			kind: 'dimension',
			value: ['8', '8', '8', '8'],
			unit: 'px',
			devicePresetValue: '4px',
		});

		expect(state).toEqual({ bound: true, overridden: true });
	});

	/**
	 * A never-written dimension state reads as bound and not overridden, matching the empty => bound
	 * signal `usePresetBinding` itself uses.
	 *
	 * @return {void}
	 */
	it('reports a never-written dimension state as bound and not overridden', () => {
		const shared = { bound: true };

		const state = deriveStateBinding({
			shared,
			kind: 'dimension',
			value: ['', '', '', ''],
			unit: 'px',
			devicePresetValue: '4px',
		});

		expect(state).toEqual({ bound: true, overridden: false });
	});

	/**
	 * A border state whose own value matches every axis of the shared border binding's preset values
	 * reads as bound and not overridden.
	 *
	 * @return {void}
	 */
	it('reports a border state as bound and not overridden when every axis matches', () => {
		const shared = {
			bound: true,
			presetValue: { width: '2px', style: 'solid', color: '#3182ce' },
			responsive: { width: {}, style: {}, color: {} },
		};
		const value = [
			{
				top: ['#3182ce', 'solid', '2'],
				right: ['#3182ce', 'solid', '2'],
				bottom: ['#3182ce', 'solid', '2'],
				left: ['#3182ce', 'solid', '2'],
				unit: 'px',
			},
		];

		const state = deriveStateBinding({ shared, kind: 'border', value, previewDevice: 'Desktop' });

		expect(state).toEqual({ bound: true, overridden: false });
	});

	/**
	 * A border state diverging on only one axis (color) still reports the combined entry as
	 * overridden, matching `usePresetBinding`'s own "any axis diverges" rule.
	 *
	 * @return {void}
	 */
	it('reports a border state as overridden when only one axis diverges', () => {
		const shared = {
			bound: true,
			presetValue: { width: '2px', style: 'solid', color: '#3182ce' },
			responsive: { width: {}, style: {}, color: {} },
		};
		const value = [
			{
				top: ['#ffffff', 'solid', '2'],
				right: ['#ffffff', 'solid', '2'],
				bottom: ['#ffffff', 'solid', '2'],
				left: ['#ffffff', 'solid', '2'],
				unit: 'px',
			},
		];

		const state = deriveStateBinding({ shared, kind: 'border', value, previewDevice: 'Desktop' });

		expect(state).toEqual({ bound: true, overridden: true });
	});

	/**
	 * A border state's own device preset value resolves per axis at the active device, mirroring
	 * `usePresetBinding`'s own device-awareness — a value matching the DESKTOP preset but not the
	 * TABLET override reads as overridden on Tablet.
	 *
	 * @return {void}
	 */
	it('resolves each border axis preset value at the active device', () => {
		const shared = {
			bound: true,
			presetValue: { width: '2px', style: 'solid', color: '#3182ce' },
			responsive: { width: {}, style: {}, color: { tablet: '#ffffff' } },
		};
		const value = [
			{
				top: ['#3182ce', 'solid', '2'],
				right: ['#3182ce', 'solid', '2'],
				bottom: ['#3182ce', 'solid', '2'],
				left: ['#3182ce', 'solid', '2'],
				unit: 'px',
			},
		];

		const state = deriveStateBinding({ shared, kind: 'border', value, previewDevice: 'Tablet' });

		expect(state).toEqual({ bound: true, overridden: true });
	});

	/**
	 * A preset that binds only ONE border axis (width) is compared on that axis alone — the style and
	 * color axes, which the preset never sets, are not checked against an undefined preset value, so a
	 * value matching the bound width axis reads as bound, not overridden.
	 *
	 * @return {void}
	 */
	it('compares only the border axes the preset actually binds', () => {
		const shared = {
			bound: true,
			presetValue: { width: '2px' },
			responsive: { width: {} },
		};
		const value = [
			{
				top: ['#ffffff', 'dashed', '2'],
				right: ['#ffffff', 'dashed', '2'],
				bottom: ['#ffffff', 'dashed', '2'],
				left: ['#ffffff', 'dashed', '2'],
				unit: 'px',
			},
		];

		const state = deriveStateBinding({ shared, kind: 'border', value, previewDevice: 'Desktop' });

		expect(state).toEqual({ bound: true, overridden: false });
	});
});

describe('presetPropertyReference', () => {
	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * Seed a catalog carrying BOTH the flattened literal and the CSS reference for one property, which is
	 * the shape the editor localizer prints.
	 *
	 * @return {void}
	 */
	function seedReferences() {
		window.kadenceDesignTokensPresets = {
			active: SET,
			libraries: {
				[SET]: {
					[BLOCK]: {
						default: 'primary',
						presets: [{ slug: 'primary', label: 'Primary' }],
						properties: [{ key: 'button-bg', kind: 'color', token: null, control_attr: 'background' }],
						values: { primary: { 'button-bg': '#3182CE' } },
						references: { primary: { 'button-bg': 'var(--kb-token--semantic--color--button-bg)' } },
						responsive: {},
					},
				},
			},
		};
	}

	/**
	 * The reference is returned, not the literal. Only the `var()` chain resolves through the projector's
	 * per-block palette layer, so an editor path that paints a preset value itself must use it.
	 *
	 * @return {void}
	 */
	it("returns the active preset's var() chain rather than its flattened literal", () => {
		seedReferences();

		expect(presetPropertyReference(BLOCK, 'button-bg', { kbPreset: 'primary' }, SET)).toBe(
			'var(--kb-token--semantic--color--button-bg)'
		);
	});

	/**
	 * With nothing selected the block follows its `$default`, exactly as the value reader does.
	 *
	 * @return {void}
	 */
	it('falls back to the block default preset when nothing is selected', () => {
		seedReferences();

		expect(presetPropertyReference(BLOCK, 'button-bg', {}, SET)).toBe(
			'var(--kb-token--semantic--color--button-bg)'
		);
	});

	/**
	 * A property the active preset does not set has no reference, so a caller can fall through to its own
	 * default rather than painting something invented.
	 *
	 * @return {void}
	 */
	it('returns undefined for a property the preset does not set', () => {
		seedReferences();

		expect(presetPropertyReference(BLOCK, 'button-text', { kbPreset: 'primary' }, SET)).toBeUndefined();
	});

	/**
	 * A catalog with no references section at all degrades to undefined rather than throwing.
	 *
	 * @return {void}
	 */
	it('returns undefined when the catalog carries no references', () => {
		window.kadenceDesignTokensPresets = {
			active: SET,
			libraries: { [SET]: { [BLOCK]: { default: 'primary', presets: [], properties: [], values: {} } } },
		};

		expect(presetPropertyReference(BLOCK, 'button-bg', {}, SET)).toBeUndefined();
	});
});
