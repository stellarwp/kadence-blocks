/* eslint-env jest */

// `../index` pulls in `../../preset-picker`, which imports `@kadence/components` (an untransformed
// ESM module) for its `PresetPicker` component. This module never renders it, so stub it out.
jest.mock('@kadence/components', () => ({}));

import { pickableTokenPool, pickableTokensFor, pickableTokensForControl, pickableTokensForKey } from '../index';

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
			id: 'semantic.color.button-primary-bg',
			alias: '{semantic.color.button-primary-bg}',
			label: 'Button Primary Background',
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
	],
	values: {
		default: {
			'primitive.color.blue-500': '#3182ce',
			'semantic.color.button-primary-bg': '#2b6cb0',
			'primitive.dimension.radius.sm': '4px',
			'semantic.radius.button': '0.5rem',
			'primitive.dimension.spacing.md': '16px',
			'semantic.spacing.block': '1.5rem',
			'primitive.font-weight.bold': '700',
			'primitive.shadow.sm': '0 1px 2px rgba(0,0,0,0.1)',
			'semantic.shadow.button': '0 2px 4px rgba(0,0,0,0.2)',
		},
		brand: { 'semantic.color.button-primary-bg': '#000000' },
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
				id: 'semantic.color.button-primary-bg',
				alias: '{semantic.color.button-primary-bg}',
				label: 'Button Primary Background',
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
			'primitive.dimension.radius.sm',
			'primitive.dimension.spacing.md',
		]);
		expect(result.map((token) => token.value)).toEqual(['0.5rem', '1.5rem', '4px', '16px']);
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
				id: 'semantic.color.button-primary-bg',
				alias: '{semantic.color.button-primary-bg}',
				label: 'Button Primary Background',
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

		expect(result.find((token) => token.id === 'semantic.color.button-primary-bg').value).toBe('#2b6cb0');
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
		// picker offers only the size scale, so the semantic radius token is dropped too.
		expect(result.map((token) => token.id)).toEqual(['primitive.dimension.radius.sm']);
		expect(result.every((token) => token.role === 'radius')).toBe(true);
	});

	it('falls back to the coarse kind list when the attribute implies no single role', () => {
		expect(pickableTokensForControl('kadence/singlebtn', 'gap')).toEqual(pickableTokensFor('dimension'));
	});

	it('returns an empty array for an unmapped attribute', () => {
		expect(pickableTokensForControl('kadence/singlebtn', 'padding')).toEqual([]);
	});

	it('returns an empty array for an unknown block', () => {
		expect(pickableTokensForControl('kadence/does-not-exist', 'borderRadius')).toEqual([]);
	});

	it('narrows to the bound token sub-kind, still dropping the semantic radii for the size scale', () => {
		window.kadenceDesignTokensPresets = boundPresets('semantic.radius.button');

		const result = pickableTokensForControl('kadence/singlebtn', 'borderRadius');

		// The bound token fixes the radius sub-kind (spacing drops out); the primitive size scale still wins,
		// so even the bound semantic radius is dropped.
		expect(result.map((token) => token.id)).toEqual(['primitive.dimension.radius.sm']);
		expect(result.every((token) => token.role === 'radius')).toBe(true);
	});

	it('keeps a bound primitive size in the list', () => {
		window.kadenceDesignTokensPresets = boundPresets('primitive.dimension.radius.sm');

		const result = pickableTokensForControl('kadence/singlebtn', 'borderRadius');

		// A bound primitive is itself a size, so it survives the primitives-only scoping and is pinned first.
		expect(result.map((token) => token.id)).toEqual(['primitive.dimension.radius.sm']);
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
		// the size scale (mirroring the radius narrowing above), so even the bound semantic drops out.
		expect(result.map((token) => token.id)).toEqual(['primitive.shadow.sm']);
		expect(result.every((token) => token.role === 'shadow')).toBe(true);
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

	it('returns an empty array for an unknown block', () => {
		expect(pickableTokensForKey('kadence/does-not-exist', 'button-shadow')).toEqual([]);
	});
});
