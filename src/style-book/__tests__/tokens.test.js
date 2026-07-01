/* eslint-env jest */
import { flattenSchemaTokens } from '../helpers/tokens';

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
