/* eslint-env jest */
import {
	applyRowOrder,
	applyOptimisticScaleOverlay,
	customScaleTokenId,
	nextScaleSlug,
	overlayDraft,
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

	it('is unchanged for a type every sibling scale screen already passes (the no-op pin)', () => {
		expect(customScaleTokenId('dimension', 'x')).toBe('primitive.dimension.custom.x');
	});

	it('maps a camelCase $type to its registered kebab id segment', () => {
		expect(customScaleTokenId('fontFamily', 'abel')).toBe('primitive.font-family.custom.abel');
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

describe('overlayDraft', () => {
	const rows = [
		{ id: 'a', label: 'A', value: '1px', userCreated: false },
		{ id: 'b', label: 'B', value: '2px', userCreated: true },
	];

	it('returns the same array reference for a null draft', () => {
		expect(overlayDraft(rows, 'a', null)).toBe(rows);
	});

	it('returns the same array reference when the itemId matches no row', () => {
		expect(overlayDraft(rows, 'ghost', { label: 'X', value: '9px' })).toBe(rows);
	});

	it('overlays label and value verbatim on the matching row only', () => {
		const next = overlayDraft(rows, 'a', { label: 'A edited', value: '3px' });

		expect(next[0]).toEqual({ id: 'a', label: 'A edited', value: '3px', userCreated: false });
		expect(next[1]).toBe(rows[1]);
	});

	it('overlays an empty string rather than falling back to the saved value', () => {
		const next = overlayDraft(rows, 'a', { label: '', value: '' });

		expect(next[0].label).toBe('');
		expect(next[0].value).toBe('');
	});

	it('preserves id and userCreated on the overlaid row', () => {
		const next = overlayDraft(rows, 'b', { label: 'B edited', value: '5px' });

		expect(next[1].id).toBe('b');
		expect(next[1].userCreated).toBe(true);
	});

	it("keeps every non-matching row's object identity", () => {
		const next = overlayDraft(rows, 'a', { label: 'A edited', value: '3px' });

		expect(next[1]).toBe(rows[1]);
	});

	it("leaves a key absent from the draft at the row's own value", () => {
		const next = overlayDraft(rows, 'a', { label: 'A edited' });

		expect(next[0].label).toBe('A edited');
		expect(next[0].value).toBe('1px');
	});
});

describe('applyOptimisticScaleOverlay', () => {
	const rows = [
		{ id: 'primitive.dimension.radius.sm', label: 'Small', value: '0.125rem', userCreated: false },
		{ id: 'primitive.dimension.radius.md', label: 'Medium', value: '0.25rem', userCreated: false },
		{ id: 'primitive.dimension.custom.radius-2', label: 'Custom', value: '0.5rem', userCreated: true },
	];

	it('returns the same reference for an empty overlay', () => {
		const overlay = { patches: {}, deletedTokens: [] };

		expect(applyOptimisticScaleOverlay(rows, overlay)).toBe(rows);
	});

	it('applies patches to their matching rows', () => {
		const overlay = {
			patches: {
				'primitive.dimension.radius.sm': { label: 'Small Updated', value: '0.15rem' },
				'primitive.dimension.radius.md': { value: '0.3rem' },
			},
			deletedTokens: [],
		};

		const next = applyOptimisticScaleOverlay(rows, overlay);

		expect(next[0]).toEqual({
			id: 'primitive.dimension.radius.sm',
			label: 'Small Updated',
			value: '0.15rem',
			userCreated: false,
			pendingDelete: false,
		});
		expect(next[1]).toEqual({
			id: 'primitive.dimension.radius.md',
			label: 'Medium',
			value: '0.3rem',
			userCreated: false,
			pendingDelete: false,
		});
		expect(next[2]).toEqual({ ...rows[2], pendingDelete: false });
	});

	it('marks deleted tokens with pendingDelete: true', () => {
		const overlay = {
			patches: {},
			deletedTokens: ['primitive.dimension.custom.radius-2', 'primitive.dimension.radius.sm'],
		};

		const next = applyOptimisticScaleOverlay(rows, overlay);

		expect(next[0].pendingDelete).toBe(true);
		expect(next[1].pendingDelete).toBe(false);
		expect(next[2].pendingDelete).toBe(true);
	});

	it('applies both patches and deletions together', () => {
		const overlay = {
			patches: {
				'primitive.dimension.radius.sm': { label: 'Patched', value: '0.2rem' },
			},
			deletedTokens: ['primitive.dimension.radius.md'],
		};

		const next = applyOptimisticScaleOverlay(rows, overlay);

		expect(next[0]).toEqual({
			id: 'primitive.dimension.radius.sm',
			label: 'Patched',
			value: '0.2rem',
			userCreated: false,
			pendingDelete: false,
		});
		expect(next[1]).toEqual({
			id: 'primitive.dimension.radius.md',
			label: 'Medium',
			value: '0.25rem',
			userCreated: false,
			pendingDelete: true,
		});
		expect(next[2]).toEqual({
			id: 'primitive.dimension.custom.radius-2',
			label: 'Custom',
			value: '0.5rem',
			userCreated: true,
			pendingDelete: false,
		});
	});

	it('only patches rows that are in the patches object', () => {
		const overlay = {
			patches: {
				'primitive.dimension.radius.sm': { label: 'Updated' },
			},
			deletedTokens: [],
		};

		const next = applyOptimisticScaleOverlay(rows, overlay);

		expect(next[0]).toEqual({
			id: 'primitive.dimension.radius.sm',
			label: 'Updated',
			value: '0.125rem',
			userCreated: false,
			pendingDelete: false,
		});
		expect(next[1]).toEqual({ ...rows[1], pendingDelete: false });
		expect(next[2]).toEqual({ ...rows[2], pendingDelete: false });
	});
});
