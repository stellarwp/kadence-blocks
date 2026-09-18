/* eslint-env jest */
import { moveItem } from '../helpers/reorder';

describe('moveItem', () => {
	it('moves an id forward', () => {
		expect(moveItem(['a', 'b', 'c'], 'a', 'c')).toEqual(['b', 'c', 'a']);
	});

	it('moves an id backward', () => {
		expect(moveItem(['a', 'b', 'c'], 'c', 'a')).toEqual(['c', 'a', 'b']);
	});

	it('returns the same reference when active equals over', () => {
		const ids = ['a', 'b', 'c'];

		expect(moveItem(ids, 'b', 'b')).toBe(ids);
	});

	it('returns the same reference for an unknown active id', () => {
		const ids = ['a', 'b', 'c'];

		expect(moveItem(ids, 'nonsense', 'b')).toBe(ids);
	});

	it('returns the same reference for an unknown over id', () => {
		const ids = ['a', 'b', 'c'];

		expect(moveItem(ids, 'a', 'nonsense')).toBe(ids);
	});

	it('does not mutate its input', () => {
		const ids = ['a', 'b', 'c'];
		moveItem(ids, 'a', 'c');

		expect(ids).toEqual(['a', 'b', 'c']);
	});
});
