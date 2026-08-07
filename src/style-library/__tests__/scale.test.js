/* eslint-env jest */
import {
	applyRowOrder,
	customScaleTokenId,
	nextScaleSlug,
	scaleInitialValues,
	scaleRows,
	scaleValueField,
} from '../helpers/scale';

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
		expect(scaleInitialValues(null, {})).toBeNull();
	});

	it('always seeds the resolved scalar value, never an authored responsive/clamp envelope', () => {
		// Primitive scales never take a responsive value, so a leaf that still carries a
		// responsive/clamp envelope from before the rule was enforced must be ignored here — the
		// panel always shows the plain resolved scalar.
		const entry = { id: 'primitive.dimension.radius.sm', label: 'SM' };
		const values = { 'primitive.dimension.radius.sm': '0.125rem' };

		expect(scaleInitialValues(entry, values)).toEqual({ label: 'SM', value: '0.125rem' });
	});

	it('defaults the value to an empty string when the resolved map has no entry', () => {
		const entry = { id: 'primitive.dimension.radius.sm', label: 'SM' };

		expect(scaleInitialValues(entry, {})).toEqual({ label: 'SM', value: '' });
	});

	it('applies parseValue to the resolved value', () => {
		const entry = { id: 'primitive.shadow.sm', label: 'SM' };
		const values = { 'primitive.shadow.sm': '0px 2px 4px 0px #171717' };
		const parseValue = (css) => ({ raw: css });

		expect(scaleInitialValues(entry, values, parseValue)).toEqual({
			label: 'SM',
			value: { raw: '0px 2px 4px 0px #171717' },
		});
	});

	it('without parseValue behaves exactly as before', () => {
		const entry = { id: 'primitive.dimension.radius.sm', label: 'SM' };
		const values = { 'primitive.dimension.radius.sm': '0.125rem' };

		expect(scaleInitialValues(entry, values)).toEqual({ label: 'SM', value: '0.125rem' });
	});
});

describe('scaleValueField', () => {
	it('sets path to "value" and defaults responsive to false', () => {
		expect(scaleValueField({ type: 'unit', label: 'Radius' })).toEqual({
			type: 'unit',
			label: 'Radius',
			path: 'value',
			responsive: false,
		});
	});

	it('forces responsive to false even when the config wrongly declares it true', () => {
		// Pins the structural guarantee: no per-screen config can opt a primitive-scale value field
		// back into breakpoint controls, no matter what it declares.
		expect(scaleValueField({ type: 'unit', label: 'Radius', responsive: true })).toEqual({
			type: 'unit',
			label: 'Radius',
			path: 'value',
			responsive: false,
		});
	});
});
