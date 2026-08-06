/* eslint-env jest */
import { applyRowOrder, customScaleTokenId, nextScaleSlug, scaleInitialValues, scaleRows } from '../helpers/scale';

describe('scaleRows', () => {
	it('returns [] for a missing schema', () => {
		expect(scaleRows(undefined, {}, 'Border Radius')).toEqual([]);
		expect(scaleRows({}, {}, 'Border Radius')).toEqual([]);
	});

	it('returns [] for an unknown group', () => {
		const schema = { groups: { 'Border Radius': [] } };

		expect(scaleRows(schema, {}, 'Border Width')).toEqual([]);
	});

	it('maps id, effective label, resolved value, and userCreated in feed order', () => {
		const schema = {
			groups: {
				'Border Radius': [
					{ id: 'primitive.dimension.radius.none', label: 'None', userCreated: false },
					{ id: 'primitive.dimension.custom.radius-2', label: 'Custom', userCreated: true },
				],
			},
		};
		const values = {
			'primitive.dimension.radius.none': '0',
			'primitive.dimension.custom.radius-2': '0.75rem',
		};

		expect(scaleRows(schema, values, 'Border Radius')).toEqual([
			{ id: 'primitive.dimension.radius.none', label: 'None', value: '0', userCreated: false },
			{ id: 'primitive.dimension.custom.radius-2', label: 'Custom', value: '0.75rem', userCreated: true },
		]);
	});

	it('defaults a row missing from the values map to an empty string', () => {
		const schema = { groups: { 'Border Radius': [{ id: 'primitive.dimension.radius.sm', label: 'SM' }] } };

		expect(scaleRows(schema, {}, 'Border Radius')[0].value).toBe('');
	});
});

describe('applyRowOrder', () => {
	const rows = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

	it('sorts by the id list and appends unlisted rows in their incoming order', () => {
		expect(applyRowOrder(rows, ['c', 'a'])).toEqual([{ id: 'c' }, { id: 'a' }, { id: 'b' }]);
	});

	it('ignores an id in the order that names no row', () => {
		expect(applyRowOrder(rows, ['ghost', 'b', 'a'])).toEqual([{ id: 'b' }, { id: 'a' }, { id: 'c' }]);
	});

	it('returns the same reference for a no-op order', () => {
		expect(applyRowOrder(rows, ['a', 'b', 'c'])).toBe(rows);
	});

	it('returns the same reference for an empty order list', () => {
		expect(applyRowOrder(rows, [])).toBe(rows);
	});
});

describe('nextScaleSlug', () => {
	it('returns the bare base first when it is free', () => {
		expect(nextScaleSlug([], 'radius')).toBe('radius');
		expect(nextScaleSlug(['primitive.dimension.radius.sm'], 'radius')).toBe('radius');
	});

	it('returns the first free numeric suffix after the bare base is taken', () => {
		const existingIds = ['primitive.dimension.custom.radius', 'primitive.dimension.custom.radius-2'];

		expect(nextScaleSlug(existingIds, 'radius')).toBe('radius-3');
	});

	it('checks collisions by terminal segment, across any type or group', () => {
		// 'radius' is taken by a token under a completely different type namespace — still a
		// collision, because the id space is flat per DTCG $type, not per screen/group.
		const existingIds = ['primitive.color.custom.radius'];

		expect(nextScaleSlug(existingIds, 'radius')).toBe('radius-2');
	});
});

describe('customScaleTokenId', () => {
	it('builds primitive.<type>.custom.<slug>', () => {
		expect(customScaleTokenId('dimension', 'radius-2')).toBe('primitive.dimension.custom.radius-2');
	});
});

describe('scaleInitialValues', () => {
	it('returns null for an unknown entry', () => {
		expect(scaleInitialValues(null, {}, {})).toBeNull();
	});

	it('prefers the authored responsive shape over the scalar value', () => {
		const entry = { id: 'primitive.dimension.radius.sm', label: 'SM' };
		const values = { 'primitive.dimension.radius.sm': '0.125rem' };
		const responsive = { 'primitive.dimension.radius.sm': { base: '0.125rem', responsive: { tablet: '0.25rem' } } };

		expect(scaleInitialValues(entry, values, responsive)).toEqual({
			label: 'SM',
			value: { base: '0.125rem', responsive: { tablet: '0.25rem' } },
		});
	});

	it('falls back to the resolved scalar value when nothing authored exists', () => {
		const entry = { id: 'primitive.dimension.radius.sm', label: 'SM' };
		const values = { 'primitive.dimension.radius.sm': '0.125rem' };

		expect(scaleInitialValues(entry, values, {})).toEqual({ label: 'SM', value: '0.125rem' });
	});
});
