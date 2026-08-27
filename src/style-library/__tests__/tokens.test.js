/* eslint-env jest */
import {
	buildTokenLeaf,
	flattenSchemaTokens,
	isResponsiveType,
	pickableTokensForType,
	tokenTypeIdSegment,
} from '../helpers/tokens';
import { PICKABLE_TOKENS_GLOBAL } from '../constants';

describe('tokenTypeIdSegment', () => {
	it('maps every camelCase $type to its registered kebab id segment', () => {
		expect(tokenTypeIdSegment('fontFamily')).toBe('font-family');
		expect(tokenTypeIdSegment('fontWeight')).toBe('font-weight');
		expect(tokenTypeIdSegment('lineHeight')).toBe('line-height');
		expect(tokenTypeIdSegment('fontStyle')).toBe('font-style');
		expect(tokenTypeIdSegment('textTransform')).toBe('text-transform');
		expect(tokenTypeIdSegment('borderStyle')).toBe('border-style');
	});

	it('passes an already kebab-safe or unregistered type through verbatim', () => {
		expect(tokenTypeIdSegment('color')).toBe('color');
		expect(tokenTypeIdSegment('dimension')).toBe('dimension');
		expect(tokenTypeIdSegment('shadow')).toBe('shadow');
		expect(tokenTypeIdSegment('bogus')).toBe('bogus');
	});
});

describe('flattenSchemaTokens', () => {
	it('returns empty array when schema has no groups', () => {
		expect(flattenSchemaTokens({})).toEqual([]);
		expect(flattenSchemaTokens(null)).toEqual([]);
	});

	it('attaches group name to each token', () => {
		const schema = {
			groups: {
				Brand: [{ id: 'primitive.color.blue', type: 'color', userCreated: false }],
			},
		};

		const [token] = flattenSchemaTokens(schema);

		expect(token.group).toBe('Brand');
	});

	it('assigns Custom Colors group to user-created tokens with no server group', () => {
		const schema = {
			groups: {
				'': [{ id: 'primitive.color.custom.my-blue', type: 'color', userCreated: true }],
			},
		};

		const [token] = flattenSchemaTokens(schema);

		expect(token.userCreated).toBe(true);
		expect(token.group).not.toBe('');
		expect(token.group).toMatch(/custom/i);
	});

	it('does not remap empty group for non-user-created tokens', () => {
		const schema = {
			groups: {
				'': [{ id: 'some.token', type: 'dimension', userCreated: false }],
			},
		};

		const [token] = flattenSchemaTokens(schema);

		expect(token.group).toBe('');
	});

	it('flattens multiple groups into a single list', () => {
		const schema = {
			groups: {
				Brand: [{ id: 'primitive.color.blue', type: 'color', userCreated: false }],
				Neutral: [
					{ id: 'primitive.color.gray-100', type: 'color', userCreated: false },
					{ id: 'primitive.color.gray-200', type: 'color', userCreated: false },
				],
			},
		};

		expect(flattenSchemaTokens(schema)).toHaveLength(3);
	});
});

describe('isResponsiveType', () => {
	it('is true only for dimension and lineHeight', () => {
		expect(isResponsiveType('dimension')).toBe(true);
		expect(isResponsiveType('lineHeight')).toBe(true);
		expect(isResponsiveType('color')).toBe(false);
		expect(isResponsiveType('fontFamily')).toBe(false);
	});
});

describe('buildTokenLeaf', () => {
	it('builds a flat leaf from a plain string', () => {
		expect(buildTokenLeaf('dimension', ' 1.125rem ')).toEqual({
			$type: 'dimension',
			$value: '1.125rem',
		});
	});

	it('serializes a stepped responsive shape under $extensions', () => {
		const leaf = buildTokenLeaf('dimension', {
			base: '1.125rem',
			responsive: { tablet: '1.0625rem', mobile: '1rem' },
		});

		expect(leaf).toEqual({
			$type: 'dimension',
			$value: '1.125rem',
			$extensions: {
				'com.kadence.designTokens': {
					responsive: { tablet: '1.0625rem', mobile: '1rem' },
				},
			},
		});
	});

	it('omits empty breakpoint steps and drops $extensions when all are empty', () => {
		const leaf = buildTokenLeaf('dimension', {
			base: '1.125rem',
			responsive: { tablet: '', mobile: '  ' },
		});

		expect(leaf).toEqual({ $type: 'dimension', $value: '1.125rem' });
		expect(leaf.$extensions).toBeUndefined();
	});

	it('keeps only the populated breakpoint step', () => {
		const leaf = buildTokenLeaf('dimension', {
			base: '1.125rem',
			responsive: { tablet: '', mobile: '1rem' },
		});

		expect(leaf.$extensions['com.kadence.designTokens'].responsive).toEqual({ mobile: '1rem' });
	});

	it('serializes a structured clamp shape', () => {
		const leaf = buildTokenLeaf('dimension', {
			base: 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)',
			clamp: { min: '1.1rem', preferred: '0.995rem + 0.326vw', max: '1.25rem' },
		});

		expect(leaf.$extensions['com.kadence.designTokens'].clamp).toEqual({
			min: '1.1rem',
			preferred: '0.995rem + 0.326vw',
			max: '1.25rem',
		});
	});

	it('drops an incomplete clamp shape', () => {
		const leaf = buildTokenLeaf('dimension', {
			base: '1.1rem',
			clamp: { min: '1.1rem', preferred: '', max: '1.25rem' },
		});

		expect(leaf.$extensions).toBeUndefined();
	});
});

describe('pickableTokensForType', () => {
	const originalPool = window[PICKABLE_TOKENS_GLOBAL];
	const originalFeed = window.kadenceDesignTokens;

	beforeEach(() => {
		window.kadenceDesignTokens = { slug: 'brand' };
		window[PICKABLE_TOKENS_GLOBAL] = {
			tokens: [
				{ id: 'semantic.color.action-primary', label: 'Action Primary', type: 'color' },
				{ id: 'primitive.dimension.radius.sm', label: 'Radius Small', type: 'dimension', role: 'radius' },
				{ id: 'primitive.dimension.spacing.sm', label: 'Spacing Small', type: 'dimension', role: 'spacing' },
			],
			values: { brand: { 'semantic.color.action-primary': '#3633e1', 'primitive.dimension.radius.sm': '4px' } },
		};
	});

	afterEach(() => {
		window[PICKABLE_TOKENS_GLOBAL] = originalPool;
		window.kadenceDesignTokens = originalFeed;
	});

	it('filters to a $type and behaves exactly as before when no role is given', () => {
		const tokens = pickableTokensForType('dimension');

		expect(tokens.map((token) => token.id)).toEqual([
			'primitive.dimension.radius.sm',
			'primitive.dimension.spacing.sm',
		]);
	});

	it('narrows to matching entries when a role is given', () => {
		const tokens = pickableTokensForType('dimension', 'radius');

		// The fixed "None" entry every radius/spacing role carries (see `fixedNoneEntry`) leads the list.
		expect(tokens).toHaveLength(2);
		expect(tokens[0]).toMatchObject({ id: 'ss-none-radius', value: '0', role: 'radius', fixed: true });
		expect(tokens[1]).toMatchObject({ id: 'primitive.dimension.radius.sm', value: '4px', role: 'radius' });
	});

	it('keeps the token the field is already bound to, even when it loses the primitive narrowing', () => {
		// The bound value is passed through as `selected`. Without it the narrowing drops a semantic
		// token from its own picker, so the field renders with its current value missing.
		window[PICKABLE_TOKENS_GLOBAL].tokens.push({
			id: 'semantic.dimension.radius-control',
			label: 'Control Radius',
			type: 'dimension',
			role: 'radius',
		});

		const withoutSelected = pickableTokensForType('dimension', 'radius');
		const withSelected = pickableTokensForType('dimension', 'radius', 'semantic.dimension.radius-control');

		expect(withoutSelected.map((token) => token.id)).not.toContain('semantic.dimension.radius-control');
		expect(withSelected.map((token) => token.id)).toContain('semantic.dimension.radius-control');
	});

	it('resolves the active-library value for a color type', () => {
		const tokens = pickableTokensForType('color');

		expect(tokens).toEqual([
			{ id: 'semantic.color.action-primary', label: 'Action Primary', value: '#3633e1', role: null },
		]);
	});
});
