/* eslint-env jest */
import { reducer } from './reducer';
import { receiveLibraries, receiveBlockPresets, receivePaletteListing, receiveDesignTokensFeed } from './actions';

describe('reducer', () => {
	it('starts with empty slices', () => {
		const state = reducer(undefined, { type: '@@INIT' });

		expect(state).toEqual({ libraries: [], presets: {}, paletteListings: {}, feeds: {} });
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

	it('stores a palette listing payload under its key, leaving other keys alone', () => {
		const rowsA = [{ id: 'default', label: 'Default' }];
		const rowsB = [{ id: 'custom-1', label: 'Custom' }];

		let state = reducer(undefined, receivePaletteListing('a', rowsA));
		state = reducer(state, receivePaletteListing('b', rowsB));

		expect(state.paletteListings).toEqual({ a: rowsA, b: rowsB });
	});

	it('stores a feed payload under its slug', () => {
		const state = reducer(undefined, receiveDesignTokensFeed('default', { version: 'v1' }));

		expect(state.feeds).toEqual({ default: { version: 'v1' } });
	});
});
