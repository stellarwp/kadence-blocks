/* eslint-env jest */
import { getBlockPresets, getLibraries, getPaletteListing, getDesignTokensFeed } from './selectors';

describe('selectors', () => {
	it('getLibraries() returns the libraries slice', () => {
		const state = { libraries: [{ slug: 'default' }], presets: {}, paletteListings: {} };

		expect(getLibraries(state)).toEqual([{ slug: 'default' }]);
	});

	it('getBlockPresets() reads the payload under its composite key, or null when absent', () => {
		const state = {
			libraries: [],
			presets: { 'ns::block::slug': { version: 'a1' } },
			paletteListings: {},
		};

		expect(getBlockPresets(state, 'ns', 'block', 'slug')).toEqual({ version: 'a1' });
		expect(getBlockPresets(state, 'ns', 'other-block', 'slug')).toBeNull();
	});

	it('getPaletteListing() returns EMPTY_LISTING when nothing has resolved yet', () => {
		const state = { libraries: [], presets: {}, paletteListings: {} };

		expect(getPaletteListing(state, 'ns', 'default')).toEqual({
			defaultId: '',
			currentId: '',
			palettes: [],
			userCreated: [],
		});
	});

	it('getPaletteListing() reshapes the flat embedded-array wire response into the internal shape', () => {
		const rows = [
			{
				id: 'default',
				label: 'Default',
				is_default: true,
				is_current: false,
				user_created: false,
				_embedded: {
					self: [
						{ id: 'default', label: 'Default', groups: [{ id: 'brand', label: 'Brand', swatches: [] }] },
					],
				},
			},
			{
				id: 'custom-1',
				label: 'Custom',
				is_default: false,
				is_current: true,
				user_created: true,
				_embedded: { self: [{ id: 'custom-1', label: 'Custom', groups: [] }] },
			},
		];
		const state = { libraries: [], presets: {}, paletteListings: { 'ns::default': rows } };

		expect(getPaletteListing(state, 'ns', 'default')).toEqual({
			defaultId: 'default',
			currentId: 'custom-1',
			palettes: [
				{ id: 'default', label: 'Default', groups: [{ id: 'brand', label: 'Brand', swatches: [] }] },
				{ id: 'custom-1', label: 'Custom', groups: [] },
			],
			userCreated: ['custom-1'],
		});
	});

	it('getPaletteListing() degrades a row with no `_embedded` data to an empty groups array', () => {
		const rows = [{ id: 'default', label: 'Default', is_default: true, is_current: true, user_created: false }];
		const state = { libraries: [], presets: {}, paletteListings: { 'ns::default': rows } };

		expect(getPaletteListing(state, 'ns', 'default')).toEqual({
			defaultId: 'default',
			currentId: 'default',
			palettes: [{ id: 'default', label: 'Default', groups: [] }],
			userCreated: [],
		});
	});

	it('getPaletteListing() returns the same object reference across calls until the rows array is replaced', () => {
		const rows = [{ id: 'default', label: 'Default', is_default: true, is_current: true, user_created: false }];
		const state = { libraries: [], presets: {}, paletteListings: { 'ns::default': rows } };

		const first = getPaletteListing(state, 'ns', 'default');
		const second = getPaletteListing(state, 'ns', 'default');

		expect(second).toBe(first);

		const nextRows = [{ id: 'default', label: 'Default', is_default: true, is_current: true, user_created: false }];
		const nextState = { libraries: [], presets: {}, paletteListings: { 'ns::default': nextRows } };

		const third = getPaletteListing(nextState, 'ns', 'default');

		expect(third).not.toBe(first);
	});

	it('getDesignTokensFeed() reads a slug’s feed, or null when unresolved', () => {
		const state = {
			libraries: [],
			presets: {},
			paletteListings: {},
			feeds: { default: { version: 'v1' } },
		};

		expect(getDesignTokensFeed(state, 'default')).toEqual({ version: 'v1' });
		expect(getDesignTokensFeed(state, 'brand')).toBeNull();
	});
});
