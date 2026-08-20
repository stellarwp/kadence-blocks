/* eslint-env jest */
import { reducer } from './reducer';
import { receiveLibraries } from './actions';

describe('reducer', () => {
	it('starts with empty slices', () => {
		const state = reducer(undefined, { type: '@@INIT' });

		expect(state).toEqual({ libraries: [] });
	});

	it('stores the libraries list on RECEIVE_LIBRARIES', () => {
		const rows = [{ slug: 'default', title: '', version: 'v1', document: {} }];
		const state = reducer(undefined, receiveLibraries(rows));

		expect(state.libraries).toBe(rows);
	});
});
