/* eslint-env jest */
/**
 * Internal dependencies
 */
import { pinDefaultFirst, splitDefaultItem } from '../helpers/preset-grid';

describe('splitDefaultItem', () => {
	const items = [{ id: 'outline' }, { id: 'default' }, { id: 'ghost' }];

	it('pulls the default item out and keeps the others in order', () => {
		expect(splitDefaultItem(items, 'default')).toEqual({
			pinned: { id: 'default' },
			sortable: [{ id: 'outline' }, { id: 'ghost' }],
		});
	});

	it('pins nothing when the default id matches no item', () => {
		expect(splitDefaultItem(items, 'missing')).toEqual({ pinned: null, sortable: items });
	});

	it('pins nothing when there is no default id', () => {
		expect(splitDefaultItem(items, '')).toEqual({ pinned: null, sortable: items });
	});
});

describe('pinDefaultFirst', () => {
	it('puts the default slug back at the front of a reordered list', () => {
		expect(pinDefaultFirst(['ghost', 'outline'], 'default', true)).toEqual(['default', 'ghost', 'outline']);
	});

	it('returns the order unchanged when no default card is pinned', () => {
		expect(pinDefaultFirst(['ghost', 'outline'], 'default', false)).toEqual(['ghost', 'outline']);
	});
});
