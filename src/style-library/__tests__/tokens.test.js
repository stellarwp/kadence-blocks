/* eslint-env jest */
import { buildTokenLeaf, flattenSchemaTokens, isResponsiveType } from '../helpers/tokens';

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
