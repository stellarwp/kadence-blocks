/* eslint-env jest */
import { reducer } from './reducer';
import { receiveLibraries, receiveBlockPresets } from './actions';

describe('reducer', () => {
	it('starts with empty slices', () => {
		const state = reducer(undefined, { type: '@@INIT' });

		expect(state).toEqual({ libraries: [], presets: {} });
	});

	it('stores the libraries list on RECEIVE_LIBRARIES', () => {
		const rows = [{ slug: 'default', title: '', version: 'v1', document: {} }];
		const state = reducer(undefined, receiveLibraries(rows));

		expect(state.libraries).toBe(rows);
	});

	it('stores a block presets payload under its key, leaving other keys alone', () => {
		let state = reducer(undefined, receiveBlockPresets('a', { version: 'a1' }));
		state = reducer(state, receiveBlockPresets('b', { version: 'b1' }));

		expect(state.presets).toEqual({ a: { version: 'a1' }, b: { version: 'b1' } });
	});
});
