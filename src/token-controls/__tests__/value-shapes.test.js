/* eslint-env jest */
import { isSlotList, isTokenId, readSlot, toShorthand, toSlotList, writeSlot } from '../helpers/value-shapes';

describe('isSlotList', () => {
	it('is true only for a four-element array', () => {
		expect(isSlotList(['a', 'b', 'c', 'd'])).toBe(true);
		expect(isSlotList(['a', 'b'])).toBe(false);
		expect(isSlotList([])).toBe(false);
		expect(isSlotList('4px')).toBe(false);
	});
});

describe('toSlotList', () => {
	it('expands a scalar to four identical slots', () => {
		expect(toSlotList('4px')).toEqual(['4px', '4px', '4px', '4px']);
	});

	it('copies an existing slot list rather than aliasing it', () => {
		const slots = ['a', 'b', 'c', 'd'];

		expect(toSlotList(slots)).not.toBe(slots);
		expect(toSlotList(slots)).toEqual(slots);
	});

	it('treats a null or undefined value as four empty slots', () => {
		expect(toSlotList(null)).toEqual(['', '', '', '']);
		expect(toSlotList(undefined)).toEqual(['', '', '', '']);
	});
});

describe('readSlot', () => {
	it('reads the indexed slot from a slot list', () => {
		expect(readSlot(['a', 'b', 'c', 'd'], 2)).toBe('c');
	});

	it('answers a scalar for every index, since linked means the same on all four', () => {
		expect(readSlot('4px', 0)).toBe('4px');
		expect(readSlot('4px', 3)).toBe('4px');
	});
});

describe('writeSlot', () => {
	it('writes one slot of a list and leaves its siblings alone', () => {
		expect(writeSlot(['a', 'b', 'c', 'd'], 1, 'x')).toEqual(['a', 'x', 'c', 'd']);
	});

	it('expands a scalar before writing, so the other slots keep the old value', () => {
		expect(writeSlot('4px', 0, '8px')).toEqual(['8px', '4px', '4px', '4px']);
	});

	it('does not mutate the value it was given', () => {
		const slots = ['a', 'b', 'c', 'd'];

		writeSlot(slots, 0, 'x');

		expect(slots).toEqual(['a', 'b', 'c', 'd']);
	});

	it('collapses to a scalar when every slot matches and collapse is asked for', () => {
		expect(writeSlot(['x', 'x', 'x', 'b'], 3, 'x', true)).toBe('x');
	});

	it('stays an array when uniform but collapse is off, for a caller whose storage is always four slots', () => {
		expect(writeSlot(['x', 'x', 'x', 'b'], 3, 'x', false)).toEqual(['x', 'x', 'x', 'x']);
	});

	it('leaves a genuinely mixed list alone even when collapse is on', () => {
		expect(writeSlot(['x', 'x', 'x', 'b'], 0, 'y', true)).toEqual(['y', 'x', 'x', 'b']);
	});
});

describe('isTokenId', () => {
	it('recognizes ids under the document roots', () => {
		expect(isTokenId('primitive.radius.sm')).toBe(true);
		expect(isTokenId('semantic.color.action-primary')).toBe(true);
	});

	it('rejects literals, including one containing a dot', () => {
		expect(isTokenId('0.5rem')).toBe(false);
		expect(isTokenId('#3182CE')).toBe(false);
		expect(isTokenId('')).toBe(false);
		expect(isTokenId(null)).toBe(false);
	});
});

describe('toShorthand', () => {
	it('collapses four identical sides to one value', () => {
		expect(toShorthand(['0', '0', '0', '0'])).toBe('0');
	});

	it('collapses a vertical/horizontal pair to two values', () => {
		expect(toShorthand(['0.4em', '1em', '0.4em', '1em'])).toBe('0.4em 1em');
	});

	it('keeps three values when only the sides match', () => {
		expect(toShorthand(['1px', '2px', '3px', '2px'])).toBe('1px 2px 3px');
	});

	it('keeps all four when every side differs', () => {
		expect(toShorthand(['1px', '2px', '3px', '4px'])).toBe('1px 2px 3px 4px');
	});

	it('returns a non-slot-list value untouched', () => {
		expect(toShorthand('0.5rem')).toBe('0.5rem');
		expect(toShorthand('')).toBe('');
	});
});
