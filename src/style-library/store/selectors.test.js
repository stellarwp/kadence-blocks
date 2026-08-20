/* eslint-env jest */
import { getLibraries } from './selectors';

describe('selectors', () => {
	it('getLibraries() returns the libraries slice', () => {
		const state = { libraries: [{ slug: 'default' }], presets: {}, paletteListings: {}, palettes: {} };

		expect(getLibraries(state)).toEqual([{ slug: 'default' }]);
	});
});
