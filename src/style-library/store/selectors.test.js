/* eslint-env jest */
import { getBlockPresets, getLibraries } from './selectors';

describe('selectors', () => {
	it('getLibraries() returns the libraries slice', () => {
		const state = { libraries: [{ slug: 'default' }], presets: {}, paletteListings: {}, palettes: {} };

		expect(getLibraries(state)).toEqual([{ slug: 'default' }]);
	});

	it('getBlockPresets() reads the payload under its composite key, or null when absent', () => {
		const state = {
			libraries: [],
			presets: { 'ns::block::slug': { version: 'a1' } },
			paletteListings: {},
			palettes: {},
		};

		expect(getBlockPresets(state, 'ns', 'block', 'slug')).toEqual({ version: 'a1' });
		expect(getBlockPresets(state, 'ns', 'other-block', 'slug')).toBeNull();
	});
});
