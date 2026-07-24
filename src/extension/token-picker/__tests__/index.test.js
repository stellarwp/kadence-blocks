/* eslint-env jest */

// `../index` pulls in `../../variant-picker`, which imports `@kadence/components` (an untransformed
// ESM module) for its `VariantPicker` component. This module never renders it, so stub it out.
jest.mock('@kadence/components', () => ({}));

import { pickableTokenPool, pickableTokensFor, pickableTokensForControl } from '../index';

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
		},
		{
			id: 'semantic.color.button-primary-bg',
			alias: '{semantic.color.button-primary-bg}',
			label: 'Button Primary Background',
			type: 'color',
			layer: 'semantic',
		},
		{
			id: 'primitive.dimension.radius.sm',
			alias: '{primitive.dimension.radius.sm}',
			label: 'Radius SM',
			type: 'dimension',
			layer: 'primitive',
		},
		{
			id: 'semantic.radius.button',
			alias: '{semantic.radius.button}',
			label: 'Button Radius',
			type: 'dimension',
			layer: 'semantic',
		},
		{
			id: 'primitive.font-weight.bold',
			alias: '{primitive.font-weight.bold}',
			label: 'Bold',
			type: 'fontWeight',
			layer: 'primitive',
		},
	],
	values: {
		default: {
			'primitive.color.blue-500': '#3182ce',
			'semantic.color.button-primary-bg': '#2b6cb0',
			'primitive.dimension.radius.sm': '4px',
			'semantic.radius.button': '0.5rem',
			'primitive.font-weight.bold': '700',
		},
		brand: { 'semantic.color.button-primary-bg': '#000000' },
	},
};

/**
 * The fixture variant catalog: enough for `activeSet()` and `blockProperties()` to resolve a single
 * mapped control (`borderRadius` -> `dimension`) for `kadence/singlebtn`.
 */
const VARIANTS = {
	active: 'default',
	sets: {
		default: {
			'kadence/singlebtn': {
				properties: [{ key: 'button-radius', kind: 'dimension', token: null, control_attr: 'borderRadius' }],
			},
		},
	},
};

describe('pickableTokenPool', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPickable = POOL;
		window.kadenceDesignTokensVariants = VARIANTS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensVariants;
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
		window.kadenceDesignTokensVariants = VARIANTS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensVariants;
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
			},
			{
				id: 'primitive.color.blue-500',
				alias: '{primitive.color.blue-500}',
				label: 'Blue 500',
				value: '#3182ce',
				type: 'color',
			},
		]);
	});

	it('returns only dimension tokens, semantic first, with resolved values', () => {
		const result = pickableTokensFor('dimension');

		expect(result.map((token) => token.id)).toEqual(['semantic.radius.button', 'primitive.dimension.radius.sm']);
		expect(result.map((token) => token.value)).toEqual(['0.5rem', '4px']);
	});

	it('returns only the fontWeight token for the text kind', () => {
		const result = pickableTokensFor('text');

		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('primitive.font-weight.bold');
	});

	it('fails closed on an unknown kind', () => {
		expect(pickableTokensFor('nope')).toEqual([]);
	});

	it('reads the requested set, leaving a missing entry blank', () => {
		const result = pickableTokensFor('color', 'brand');

		expect(result).toEqual([
			{
				id: 'semantic.color.button-primary-bg',
				alias: '{semantic.color.button-primary-bg}',
				label: 'Button Primary Background',
				value: '#000000',
				type: 'color',
			},
			{
				id: 'primitive.color.blue-500',
				alias: '{primitive.color.blue-500}',
				label: 'Blue 500',
				value: '',
				type: 'color',
			},
		]);
	});

	it('falls back to the active set values for an unknown set slug', () => {
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
		window.kadenceDesignTokensVariants = VARIANTS;
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensVariants;
	});

	it('resolves the mapped control kind and delegates to pickableTokensFor', () => {
		expect(pickableTokensForControl('kadence/singlebtn', 'borderRadius')).toEqual(pickableTokensFor('dimension'));
	});

	it('returns an empty array for an unmapped attribute', () => {
		expect(pickableTokensForControl('kadence/singlebtn', 'padding')).toEqual([]);
	});

	it('returns an empty array for an unknown block', () => {
		expect(pickableTokensForControl('kadence/does-not-exist', 'borderRadius')).toEqual([]);
	});
});
