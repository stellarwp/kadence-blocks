/* eslint-env jest */

// `../index` pulls in `../../preset-picker`, which imports `@kadence/components` (an untransformed
// ESM module) for its `PresetPicker` component. This module never renders it, so stub it out.
jest.mock('@kadence/components', () => ({}));

import {
	boundTokenAliasForControl,
	pickableTokenPool,
	pickableTokensFor,
	pickableTokensForControl,
	pickableTokensForKey,
} from '../index';

/**
 * The fixture pickable-token pool: layers are interleaved on purpose to prove the semantic-first
 * rank re-orders rather than merely preserving input order.
 */
const POOL = {
	tokens: [
		{
			id: 'primitive.color.blue-500',
			alias: '{primitive.color.blue-500}',
			label: 'Blue 500',
			type: 'color',
			layer: 'primitive',
			role: 'color',
		},
		{
			id: 'semantic.color.button-bg',
			alias: '{semantic.color.button-bg}',
			label: 'Button Background',
			type: 'color',
			layer: 'semantic',
			role: 'color',
		},
		{
			id: 'primitive.dimension.radius.sm',
			alias: '{primitive.dimension.radius.sm}',
			label: 'Radius SM',
			type: 'dimension',
			layer: 'primitive',
			role: 'radius',
		},
		{
			id: 'semantic.radius.button',
			alias: '{semantic.radius.button}',
			label: 'Button Radius',
			type: 'dimension',
			layer: 'semantic',
			role: 'radius',
		},
		{
			id: 'primitive.dimension.spacing.md',
			alias: '{primitive.dimension.spacing.md}',
			label: 'Spacing MD',
			type: 'dimension',
			layer: 'primitive',
			role: 'spacing',
		},
		{
			id: 'semantic.spacing.block',
			alias: '{semantic.spacing.block}',
			label: 'Block Spacing',
			type: 'dimension',
			layer: 'semantic',
			role: 'spacing',
		},
		{
			id: 'primitive.dimension.icon-size.md',
			alias: '{primitive.dimension.icon-size.md}',
			label: 'Icon Size MD',
			type: 'dimension',
			layer: 'primitive',
			role: 'icon-size',
		},
		{
			id: 'semantic.icon-size.default',
			alias: '{semantic.icon-size.default}',
			label: 'Default Icon Size',
			type: 'dimension',
			layer: 'semantic',
			role: 'icon-size',
		},
		{
			// A Style Library custom token minted under the Icon Sizes group: it lives in the reserved
			// `custom` namespace but carries the group's role, which is what makes it pickable alongside the
			// shipped scale steps rather than stranded under a `custom` role of its own.
			id: 'primitive.dimension.custom.brand-icon',
			alias: '{primitive.dimension.custom.brand-icon}',
			label: 'Brand Icon',
			type: 'dimension',
			layer: 'primitive',
			role: 'icon-size',
		},
		{
			id: 'primitive.font-weight.bold',
			alias: '{primitive.font-weight.bold}',
			label: 'Bold',
			type: 'fontWeight',
			layer: 'primitive',
			role: 'font-weight',
		},
		{
			id: 'primitive.shadow.sm',
			alias: '{primitive.shadow.sm}',
			label: 'Shadow SM',
			type: 'shadow',
			layer: 'primitive',
			role: 'shadow',
		},
		{
			id: 'semantic.shadow.button',
			alias: '{semantic.shadow.button}',
			label: 'Button Shadow',
			type: 'shadow',
			layer: 'semantic',
			role: 'shadow',
		},
		{
			id: 'primitive.dimension.border-width.sm',
			alias: '{primitive.dimension.border-width.sm}',
			label: 'Border Width SM',
			type: 'dimension',
			layer: 'primitive',
			role: 'border-width',
		},
		{
			id: 'semantic.border-width.default',
			alias: '{semantic.border-width.default}',
			label: 'Default Border Width',
			type: 'dimension',
			layer: 'semantic',
			role: 'border-width',
		},
	],
	values: {
		default: {
			'primitive.color.blue-500': '#3182ce',
			'semantic.color.button-bg': '#2b6cb0',
			'primitive.dimension.radius.sm': '4px',
			'semantic.radius.button': '0.5rem',
			'primitive.dimension.spacing.md': '16px',
			'semantic.spacing.block': '1.5rem',
			'primitive.dimension.icon-size.md': '1.5rem',
			'semantic.icon-size.default': '1.5rem',
			'primitive.dimension.custom.brand-icon': '2rem',
			'primitive.font-weight.bold': '700',
			'primitive.shadow.sm': '0 1px 2px rgba(0,0,0,0.1)',
			'semantic.shadow.button': '0 2px 4px rgba(0,0,0,0.2)',
			'primitive.dimension.border-width.sm': '1px',
			'semantic.border-width.default': '2px',
		},
		brand: { 'semantic.color.button-bg': '#000000' },
	},
};

/**
 * The fixture preset catalog: enough for `activeLibrary()` and `blockProperties()` to resolve a single
 * mapped control (`borderRadius` -> `dimension`) for `kadence/singlebtn`. `button-shadow` mirrors the
 * real PHP binding: it has a `key` and a bound `token`, but no `control_attr` at all — the native shadow
 * attribute is a composite shape, not a scalar a `control_attr` lookup can target — which is exactly the
 * case `pickableTokensForKey` exists to reach.
 */
const PRESETS = {
	active: 'default',
	libraries: {
		default: {
			'kadence/singlebtn': {
				properties: [
					{ key: 'button-radius', kind: 'dimension', token: null, control_attr: 'borderRadius' },
					{ key: 'button-gap', kind: 'dimension', token: null, control_attr: 'gap' },
					{ key: 'button-shadow', kind: 'shadow', token: 'semantic.shadow.button', control_attr: null },
					{ key: 'button-padding', kind: 'dimension', token: null, control_attr: 'padding' },
					{ key: 'button-margin', kind: 'dimension', token: null, control_attr: 'margin' },
					{
						key: 'button-border-width',
						kind: 'dimension',
						token: 'semantic.border-width.default',
						control_attr: 'borderStyle',
					},
				],
			},
			'kadence/single-icon': {
				properties: [
					{
						key: 'size',
						kind: 'dimension',
						token: 'semantic.icon-size.default',
						control_attr: 'size',
						responsive_attrs: { tablet: 'tabletSize', mobile: 'mobileSize' },
					},
				],
			},
		},
	},
};

/**
 * A preset catalog whose `kadence/singlebtn` borderRadius control binds a role token, so the picker
 * narrows to that token's sub-kind and pins it. Mirrors PRESETS but with a non-null `token`.
 */
const boundPresets = (token) => ({
	active: 'default',
	libraries: {
		default: {
			'kadence/singlebtn': {
				properties: [{ key: 'button-radius', kind: 'dimension', token, control_attr: 'borderRadius' }],
			},
		},
	},
});

describe('pickableTokenPool', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPickable = POOL;
		window.kadenceDesignTokensPresets = PRESETS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensPresets;
	});

	it('returns the seeded pool', () => {
		expect(pickableTokenPool()).toBe(POOL);
	});

	it('returns an empty object when the global is absent', () => {
		delete window.kadenceDesignTokensPickable;

		expect(pickableTokenPool()).toEqual({});
	});
});

describe('pickableTokensFor', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPickable = POOL;
		window.kadenceDesignTokensPresets = PRESETS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensPresets;
	});

	it('returns only color tokens, semantic first, with no dimension or fontWeight leakage', () => {
		const result = pickableTokensFor('color');

		expect(result).toEqual([
			{
				id: 'semantic.color.button-bg',
				alias: '{semantic.color.button-bg}',
				label: 'Button Background',
				value: '#2b6cb0',
				type: 'color',
				role: 'color',
			},
			{
				id: 'primitive.color.blue-500',
				alias: '{primitive.color.blue-500}',
				label: 'Blue 500',
				value: '#3182ce',
				type: 'color',
				role: 'color',
			},
		]);
	});

	it('returns every dimension token, semantic first, with resolved values', () => {
		const result = pickableTokensFor('dimension');

		expect(result.map((token) => token.id)).toEqual([
			'semantic.radius.button',
			'semantic.spacing.block',
			'semantic.icon-size.default',
			'semantic.border-width.default',
			'primitive.dimension.radius.sm',
			'primitive.dimension.spacing.md',
			'primitive.dimension.icon-size.md',
			'primitive.dimension.custom.brand-icon',
			'primitive.dimension.border-width.sm',
		]);
		expect(result.map((token) => token.value)).toEqual([
			'0.5rem',
			'1.5rem',
			'1.5rem',
			'2px',
			'4px',
			'16px',
			'1.5rem',
			'2rem',
			'1px',
		]);
	});

	it('returns only the fontWeight token for the text kind', () => {
		const result = pickableTokensFor('text');

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('primitive.font-weight.bold');
	});

	it('fails closed on an unknown kind', () => {
		expect(pickableTokensFor('nope')).toEqual([]);
	});

	it('reads the requested library, leaving a missing entry blank', () => {
		const result = pickableTokensFor('color', 'brand');

		expect(result).toEqual([
			{
				id: 'semantic.color.button-bg',
				alias: '{semantic.color.button-bg}',
				label: 'Button Background',
				value: '#000000',
				type: 'color',
				role: 'color',
			},
			{
				id: 'primitive.color.blue-500',
				alias: '{primitive.color.blue-500}',
				label: 'Blue 500',
				value: '',
				type: 'color',
				role: 'color',
			},
		]);
	});

	it('falls back to the active library values for an unknown library slug', () => {
		const result = pickableTokensFor('color', 'nonexistent-set');

		expect(result.find((token) => token.id === 'semantic.color.button-bg').value).toBe('#2b6cb0');
	});

	it('fails soft when the pool is missing, returning empty results without throwing', () => {
		delete window.kadenceDesignTokensPickable;

		expect(() => pickableTokensFor('color')).not.toThrow();
		expect(pickableTokensFor('color')).toEqual([]);
		expect(pickableTokensFor('dimension')).toEqual([]);
	});
});

describe('pickableTokensForControl', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPickable = POOL;
		window.kadenceDesignTokensPresets = PRESETS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensPresets;
	});

	it('infers the radius role and offers only the primitive sizes, dropping the semantic radii', () => {
		const result = pickableTokensForControl('kadence/singlebtn', 'borderRadius');

		// `borderRadius` implies the radius role (spacing drops out); with a primitive radius present the
		// picker offers only the size scale, so the semantic radius token is dropped too. A fixed "None"
		// entry is prepended for every radius-role control, ahead of the size scale.
		expect(result.map((token) => token.id)).toEqual(['ss-none-radius', 'primitive.dimension.radius.sm']);
		expect(result.every((token) => token.role === 'radius')).toBe(true);
	});

	it('still offers only primitives when the attribute implies no single role', () => {
		// No role narrows the sub-kind, but the picker's job does not change: it surfaces scale steps, and
		// a semantic is a delivery point for one rather than a choice to make on a block. Offering the
		// whole kind bucket here is what put every unrelated semantic in front of a control whose bound
		// token the registry never declared.
		const result = pickableTokensForControl('kadence/singlebtn', 'gap');

		expect(result.length).toBeGreaterThan(0);
		expect(result.every((token) => token.id.startsWith('primitive.'))).toBe(true);
	});

	it('infers the role from the attribute when the bound token is absent from the registry', () => {
		// Several bound semantics live only in `baseline.json` — they resolve and paint, but carry no
		// label, group, or role, so the pool cannot answer for them. Reading that as "no role" is what
		// put the whole dimension bucket, every unrelated semantic in it, in front of a radius control.
		window.kadenceDesignTokensPresets = boundPresets('semantic.radius.never-registered');

		const result = pickableTokensForControl('kadence/singlebtn', 'borderRadius');

		expect(result.map((token) => token.id)).toEqual(['ss-none-radius', 'primitive.dimension.radius.sm']);
	});

	it('returns an empty array for an unmapped attribute', () => {
		expect(pickableTokensForControl('kadence/singlebtn', 'backgroundColor')).toEqual([]);
	});

	it('returns an empty array for an unknown block', () => {
		expect(pickableTokensForControl('kadence/does-not-exist', 'borderRadius')).toEqual([]);
	});

	it('narrows to the bound token sub-kind, still dropping the semantic radii for the size scale', () => {
		window.kadenceDesignTokensPresets = boundPresets('semantic.radius.button');

		const result = pickableTokensForControl('kadence/singlebtn', 'borderRadius');

		// The bound token fixes the radius sub-kind (spacing drops out); the primitive size scale still wins,
		// so even the bound semantic radius is dropped. The bound token itself did not survive the scoping,
		// so the pin is a no-op and the fixed "None" entry leads.
		expect(result.map((token) => token.id)).toEqual(['ss-none-radius', 'primitive.dimension.radius.sm']);
		expect(result.every((token) => token.role === 'radius')).toBe(true);
	});

	it('narrows the icon size control to the icon-size scale, dropping radius and spacing', () => {
		const result = pickableTokensForControl('kadence/single-icon', 'size');

		// The bound `semantic.icon-size.default` fixes the sub-kind, and the primitives-only scoping then
		// offers the scale steps rather than the component semantic that merely aliases one of them. `size`
		// alone would infer nothing (it matches no role once de-hyphenated), so the bound token is doing the
		// narrowing here — without it the whole dimension bucket would be offered.
		expect(result.map((token) => token.id)).toEqual([
			'primitive.dimension.icon-size.md',
			'primitive.dimension.custom.brand-icon',
		]);
		expect(result.every((token) => token.role === 'icon-size')).toBe(true);
	});

	it('offers a Style Library custom icon-size token alongside the shipped scale steps', () => {
		const custom = pickableTokensForControl('kadence/single-icon', 'size').find(
			(token) => token.id === 'primitive.dimension.custom.brand-icon'
		);

		expect(custom).toMatchObject({
			alias: '{primitive.dimension.custom.brand-icon}',
			label: 'Brand Icon',
			value: '2rem',
		});
	});

	it('keeps a bound primitive size in the list', () => {
		window.kadenceDesignTokensPresets = boundPresets('primitive.dimension.radius.sm');

		const result = pickableTokensForControl('kadence/singlebtn', 'borderRadius');

		// A bound primitive is itself a size, so it survives the primitives-only scoping and is pinned
		// first — ahead of even the fixed "None" entry, since the pin always wins.
		expect(result.map((token) => token.id)).toEqual(['primitive.dimension.radius.sm', 'ss-none-radius']);
	});

	it('prepends a fixed None entry for a radius-role control', () => {
		// The existing setup above stubs `window.kadenceDesignTokensPickable` with a radius-role token pool
		// and `blockProperties()` (via `PRESETS`) returning a `borderRadius` control_attr property.
		const tokens = pickableTokensForControl('kadence/singlebtn', 'borderRadius');

		expect(tokens[0]).toMatchObject({ id: 'ss-none-radius', alias: 0, fixed: true });
	});
});

describe('pickableTokensForKey', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPickable = POOL;
		window.kadenceDesignTokensPresets = PRESETS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensPresets;
	});

	it('finds a property with no control_attr by its key and narrows to the bound token sub-kind', () => {
		const result = pickableTokensForKey('kadence/singlebtn', 'button-shadow');

		// The bound token fixes the shadow role; with a primitive shadow present the picker offers only
		// the size scale (mirroring the radius narrowing above), so even the bound semantic drops out. The
		// bound token did not survive the scoping, so the fixed "None" entry leads.
		expect(result.map((token) => token.id)).toEqual(['ss-none-shadow', 'primitive.shadow.sm']);
		expect(result.every((token) => token.role === 'shadow')).toBe(true);
	});

	it('carries exactly one fixed "None" entry for shadow, so a host must not prepend its own', () => {
		// `src/blocks/singlebtn/edit.js` builds its shadow picker list straight from this call. A second
		// prepend at that call site would duplicate the row and collide on the React key.
		const result = pickableTokensForKey('kadence/singlebtn', 'button-shadow');

		expect(result.filter((token) => token.id === 'ss-none-shadow')).toHaveLength(1);
	});

	it('succeeds by key on the exact same property that pickableTokensForControl cannot reach by any control_attr guess, proving the two lookup paths are genuinely independent', () => {
		// Not a vacuous "no control_attr matches, so both return []" comparison: pickableTokensForKey
		// resolves real tokens for this property (asserted above), while pickableTokensForControl fails to
		// find it under its own key used AS a controlAttr, or under the attribute the real control writes
		// ('shadow') — because the property carries no control_attr at all, not because the guess is wrong.
		expect(pickableTokensForControl('kadence/singlebtn', 'button-shadow')).toEqual([]);
		expect(pickableTokensForControl('kadence/singlebtn', 'shadow')).toEqual([]);
		expect(pickableTokensForKey('kadence/singlebtn', 'button-shadow').length).toBeGreaterThan(0);
	});

	it('returns an empty array for an unmapped key', () => {
		expect(pickableTokensForKey('kadence/singlebtn', 'button-does-not-exist')).toEqual([]);
	});

	it('narrows padding to the spacing role, dropping radius/shadow/font-weight tokens', () => {
		// `button-padding` binds no `token`, and its `control_attr` ('padding') does not literally
		// contain the word 'spacing' — the fixed padding/margin -> spacing role alias is what narrows it,
		// not the generic substring match `borderRadius` relies on.
		const result = pickableTokensForKey('kadence/singlebtn', 'button-padding');

		// A primitive spacing size exists, so (mirroring the radius narrowing above) the picker offers
		// only the size scale, dropping even the bound-role semantic spacing token. Padding's fixed
		// "None" entry leads (Padding never offers "Auto"; only Margin does).
		expect(result.map((token) => token.id)).toEqual(['ss-none-spacing', 'primitive.dimension.spacing.md']);
		expect(result.every((token) => token.role === 'spacing')).toBe(true);
	});

	it('returns an empty array for an unknown block', () => {
		expect(pickableTokensForKey('kadence/does-not-exist', 'button-shadow')).toEqual([]);
	});

	it('prepends a fixed None entry, and no Auto, for the padding property', () => {
		const tokens = pickableTokensForKey('kadence/singlebtn', 'button-padding');

		expect(tokens[0]).toMatchObject({ id: 'ss-none-spacing', alias: 0, fixed: true });
		expect(tokens.some((token) => token.id === 'ss-auto')).toBe(false);
	});

	it('prepends None and appends Auto for the margin property, matching the Style Library order', () => {
		const tokens = pickableTokensForKey('kadence/singlebtn', 'button-margin');

		expect(tokens[0]).toMatchObject({ id: 'ss-none-spacing', alias: 0, fixed: true });
		expect(tokens[tokens.length - 1]).toMatchObject({ id: 'ss-auto', alias: 'ss-auto', fixed: true });
	});

	it('prepends a fixed None entry for the border-width property', () => {
		const tokens = pickableTokensForKey('kadence/singlebtn', 'button-border-width');

		expect(tokens[0]).toMatchObject({ id: 'ss-none-border-width', alias: 0, fixed: true });
	});
});

describe('boundTokenAliasForControl', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPickable = POOL;
		window.kadenceDesignTokensPresets = PRESETS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensPresets;
	});

	it('returns the bound token as an alias, ready to resolve', () => {
		expect(boundTokenAliasForControl('kadence/single-icon', 'size')).toBe('{semantic.icon-size.default}');
	});

	it('returns empty for a control that binds no token', () => {
		expect(boundTokenAliasForControl('kadence/singlebtn', 'borderRadius')).toBe('');
	});

	it('returns empty for an unmapped attribute or an unknown block', () => {
		expect(boundTokenAliasForControl('kadence/singlebtn', 'padding')).toBe('');
		expect(boundTokenAliasForControl('kadence/does-not-exist', 'size')).toBe('');
	});

	it('fails soft when the catalog is missing', () => {
		delete window.kadenceDesignTokensPresets;

		expect(() => boundTokenAliasForControl('kadence/single-icon', 'size')).not.toThrow();
		expect(boundTokenAliasForControl('kadence/single-icon', 'size')).toBe('');
	});
});
