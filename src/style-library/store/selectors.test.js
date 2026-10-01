/* eslint-env jest */
import {
	getBlockPresets,
	getLibraries,
	getPaletteListing,
	getDesignTokensFeed,
	getOptimisticSwatchEdit,
	getOptimisticScaleEdit,
	getPaletteBusy,
	getScaleBusy,
} from './selectors';
import { EMPTY_OPTIMISTIC_SWATCH_EDIT, EMPTY_OPTIMISTIC_SCALE_EDIT } from './constants';

describe('selectors', () => {
	it('getLibraries() returns the libraries slice', () => {
		const state = { libraries: [{ slug: 'default' }], presets: {}, paletteListings: {}, optimisticSwatchEdits: {} };

		expect(getLibraries(state)).toEqual([{ slug: 'default' }]);
	});

	it('getBlockPresets() reads the payload under its composite key, or null when absent', () => {
		const state = {
			libraries: [],
			presets: { 'ns::block::slug': { version: 'a1' } },
			paletteListings: {},
			optimisticSwatchEdits: {},
		};

		expect(getBlockPresets(state, 'ns', 'block', 'slug')).toEqual({ version: 'a1' });
		expect(getBlockPresets(state, 'ns', 'other-block', 'slug')).toBeNull();
	});

	it('getPaletteListing() returns EMPTY_LISTING when nothing has resolved yet', () => {
		const state = { libraries: [], presets: {}, paletteListings: {}, optimisticSwatchEdits: {} };

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
		const state = {
			libraries: [],
			presets: {},
			paletteListings: { 'ns::default': rows },
			optimisticSwatchEdits: {},
		};

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
		const state = {
			libraries: [],
			presets: {},
			paletteListings: { 'ns::default': rows },
			optimisticSwatchEdits: {},
		};

		expect(getPaletteListing(state, 'ns', 'default')).toEqual({
			defaultId: 'default',
			currentId: 'default',
			palettes: [{ id: 'default', label: 'Default', groups: [] }],
			userCreated: [],
		});
	});

	it('getPaletteListing() returns the same object reference across calls until the rows array is replaced', () => {
		const rows = [{ id: 'default', label: 'Default', is_default: true, is_current: true, user_created: false }];
		const state = {
			libraries: [],
			presets: {},
			paletteListings: { 'ns::default': rows },
			optimisticSwatchEdits: {},
		};

		const first = getPaletteListing(state, 'ns', 'default');
		const second = getPaletteListing(state, 'ns', 'default');

		expect(second).toBe(first);

		const nextRows = [{ id: 'default', label: 'Default', is_default: true, is_current: true, user_created: false }];
		const nextState = { libraries: [], presets: {}, paletteListings: { 'ns::default': nextRows } };

		const third = getPaletteListing(nextState, 'ns', 'default');

		expect(third).not.toBe(first);
	});

	it("getDesignTokensFeed() reads a slug's feed, or null when unresolved", () => {
		const state = {
			libraries: [],
			presets: {},
			paletteListings: {},
			feeds: { default: { version: 'v1' } },
			optimisticSwatchEdits: {},
		};

		expect(getDesignTokensFeed(state, 'default')).toEqual({ version: 'v1' });
		expect(getDesignTokensFeed(state, 'brand')).toBeNull();
	});

	it('getOptimisticSwatchEdit() returns EMPTY_OPTIMISTIC_SWATCH_EDIT for an unresolved key', () => {
		const state = { libraries: [], presets: {}, paletteListings: {}, optimisticSwatchEdits: {} };

		expect(getOptimisticSwatchEdit(state, 'ns', 'default', 'palette-1')).toBe(EMPTY_OPTIMISTIC_SWATCH_EDIT);
	});

	it('getOptimisticSwatchEdit() returns the stored overlay object for a resolved key, scoped by palette id', () => {
		const overlay = {
			patches: { 'token.color': { label: 'Red' } },
			deletedTokens: ['token.old'],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [],
		};
		const state = {
			libraries: [],
			presets: {},
			paletteListings: {},
			optimisticSwatchEdits: { 'ns::default::palette-1': overlay },
		};

		expect(getOptimisticSwatchEdit(state, 'ns', 'default', 'palette-1')).toEqual(overlay);
	});

	it("getOptimisticSwatchEdit() does not return a different palette's overlay for the same library", () => {
		const overlay = {
			patches: { 'token.color': { label: 'Red' } },
			deletedTokens: [],
			deletedGroups: [],
			addedSwatches: [],
			addedGroups: [],
		};
		const state = {
			libraries: [],
			presets: {},
			paletteListings: {},
			optimisticSwatchEdits: { 'ns::default::palette-1': overlay },
		};

		expect(getOptimisticSwatchEdit(state, 'ns', 'default', 'palette-2')).toBe(EMPTY_OPTIMISTIC_SWATCH_EDIT);
	});

	it('getOptimisticScaleEdit() returns EMPTY_OPTIMISTIC_SCALE_EDIT for an unresolved slug', () => {
		const state = { libraries: [], presets: {}, paletteListings: {}, feeds: {}, optimisticScaleEdits: {} };

		expect(getOptimisticScaleEdit(state, 'default')).toBe(EMPTY_OPTIMISTIC_SCALE_EDIT);
	});

	it('getOptimisticScaleEdit() returns the stored overlay object for a resolved slug', () => {
		const overlay = {
			patches: { 'primitive.dimension.radius.sm': { label: 'Small' } },
			deletedTokens: ['primitive.dimension.custom.radius-2'],
		};
		const state = {
			libraries: [],
			presets: {},
			paletteListings: {},
			feeds: {},
			optimisticScaleEdits: { default: overlay },
		};

		expect(getOptimisticScaleEdit(state, 'default')).toEqual(overlay);
	});

	it('getPaletteBusy() defaults to false for an unset library key', () => {
		const state = { libraries: [], presets: {}, paletteListings: {}, paletteBusy: {} };

		expect(getPaletteBusy(state, 'ns', 'default')).toBe(false);
	});

	it('getPaletteBusy() reads the stored busy flag for a library key', () => {
		const state = { libraries: [], presets: {}, paletteListings: {}, paletteBusy: { 'ns::default': true } };

		expect(getPaletteBusy(state, 'ns', 'default')).toBe(true);
	});

	it('getScaleBusy() defaults to false for an unset slug', () => {
		const state = { libraries: [], presets: {}, paletteListings: {}, scaleBusy: {} };

		expect(getScaleBusy(state, 'default')).toBe(false);
	});

	it('getScaleBusy() reads the stored busy flag for a slug', () => {
		const state = { libraries: [], presets: {}, paletteListings: {}, scaleBusy: { default: true } };

		expect(getScaleBusy(state, 'default')).toBe(true);
	});
});
