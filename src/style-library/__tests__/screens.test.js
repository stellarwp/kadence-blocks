/* eslint-env jest */
import { addFilter, removeFilter } from '@wordpress/hooks';
import {
	blockFromScreenId,
	buildBaseStylesNav,
	buildBlockPresetsNav,
	presetScreenId,
	resolveScreen,
} from '../helpers/screens';
import { BASE_STYLES_SCREENS, PRESET_SCREENS_FILTER } from '../constants/screens';

describe('presetScreenId and blockFromScreenId', () => {
	it('round-trip a block name', () => {
		const screenId = presetScreenId('kadence/singlebtn');

		expect(screenId).toBe('blocks/kadence/singlebtn');
		expect(blockFromScreenId(screenId)).toBe('kadence/singlebtn');
	});

	it('returns empty for a base styles id', () => {
		expect(blockFromScreenId('color-palette')).toBe('');
	});
});

describe('buildBaseStylesNav', () => {
	it('returns the seven fixed entries in design order', () => {
		expect(buildBaseStylesNav()).toEqual(BASE_STYLES_SCREENS.map(({ id, label }) => ({ id, label })));
		expect(buildBaseStylesNav()).toHaveLength(7);
	});
});

describe('buildBlockPresetsNav', () => {
	it('maps the feed presetNav section to nav entries with preset screen ids', () => {
		const feed = { presetNav: [{ block: 'kadence/singlebtn', label: 'Style' }] };

		expect(buildBlockPresetsNav(feed)).toEqual([
			{ id: 'blocks/kadence/singlebtn', label: 'Style', block: 'kadence/singlebtn' },
		]);
	});

	it('returns an empty list when the feed lacks presetNav', () => {
		expect(buildBlockPresetsNav({})).toEqual([]);
		expect(buildBlockPresetsNav(null)).toEqual([]);
	});
});

describe('resolveScreen', () => {
	const ColorPaletteScreen = () => null;
	const PresetFallback = () => null;
	const registry = { baseStyles: { 'color-palette': ColorPaletteScreen }, presetFallback: PresetFallback };

	it('returns the base styles component for a known id', () => {
		expect(resolveScreen('color-palette', registry)).toEqual({ Component: ColorPaletteScreen, block: '' });
	});

	it('returns null for an unknown id', () => {
		expect(resolveScreen('nonsense', registry)).toBeNull();
	});

	it('uses a filter-registered component for its block', () => {
		const ButtonScreen = () => null;

		addFilter(PRESET_SCREENS_FILTER, 'test/screens', (screens) => ({
			...screens,
			'kadence/singlebtn': ButtonScreen,
		}));

		try {
			expect(resolveScreen('blocks/kadence/singlebtn', registry)).toEqual({
				Component: ButtonScreen,
				block: 'kadence/singlebtn',
			});
		} finally {
			removeFilter(PRESET_SCREENS_FILTER, 'test/screens');
		}
	});

	it('falls back to the generic component for an unregistered block', () => {
		expect(resolveScreen('blocks/kadence/unregistered', registry)).toEqual({
			Component: PresetFallback,
			block: 'kadence/unregistered',
		});
	});
});
