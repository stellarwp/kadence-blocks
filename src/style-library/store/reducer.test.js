/* eslint-env jest */
import { reducer } from './reducer';
import { receiveLibraries, receiveBlockPresets, receivePaletteListing, receivePalette } from './actions';

describe('reducer', () => {
	it('starts with empty slices', () => {
		const state = reducer(undefined, { type: '@@INIT' });

		expect(state).toEqual({ libraries: [], presets: {}, paletteListings: {}, palettes: {} });
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

	it('stores a palette listing under its key', () => {
		const state = reducer(undefined, receivePaletteListing('k', { $default: 'default' }));

		expect(state.paletteListings).toEqual({ k: { $default: 'default' } });
	});

	it('stores a palette view under its key', () => {
		const state = reducer(undefined, receivePalette('k', { id: 'default', groups: [] }));

		expect(state.palettes).toEqual({ k: { id: 'default', groups: [] } });
	});
});
