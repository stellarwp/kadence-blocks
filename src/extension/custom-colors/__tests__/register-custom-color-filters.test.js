/* eslint-env jest */
/**
 * The custom-color listener on the color-control swatch filter.
 *
 * With "Use only Custom Colors" on, the shared color controls keep only `kb-palette-*` swatches. In the Kadence
 * theme's Full Site Editing mode Global Styles owns the editor palette, so the custom colors are not in it until
 * the Color Palette panel pushes them. These tests fire `applyFilters` the way the control does and assert the
 * stored custom colors are added in that mode only.
 */
import { applyFilters, removeFilter } from '@wordpress/hooks';
import { registerCustomColorFilters } from '../register-custom-color-filters';
import { registerColorControlFilters } from '../../design-tokens/register-color-control-filters';

const HOOK = 'kadence.components.popColorControl.colors';
const NAMESPACE = 'kadence-blocks/custom-colors';
const TOKEN_NAMESPACE = 'kadence-blocks/token-palette-colors';

const customOne = { color: '#7a1fa2', name: 'Purple', slug: 'kb-palette-1' };
const customTwo = { color: '#00ff00', name: 'Green', slug: 'kb-palette-2' };
const theme = { color: 'var(--global-palette1)', name: 'Palette Color 1', slug: 'theme-palette1' };
const user = { color: '#ffffff', name: 'QA White', slug: 'custom-qa-white' };

/**
 * The editor palette in FSE mode: Global Styles theme and user colors, no custom colors.
 *
 * @type {Array}
 */
const allColors = [theme, user];

describe('registerCustomColorFilters', () => {
	beforeEach(() => {
		window.kadenceSiteStyles = { isFseMode: true, blocks: {} };
		global.kadence_blocks_params = {
			colors: JSON.stringify({ palette: [customOne, customTwo], override: true }),
		};
		registerCustomColorFilters();
	});

	afterEach(() => {
		removeFilter(HOOK, NAMESPACE);
		removeFilter(HOOK, TOKEN_NAMESPACE);
		delete window.kadenceSiteStyles;
		delete window.kadenceDesignTokensPalettes;
		delete global.kadence_blocks_params;
	});

	/**
	 * In FSE mode with the override on, the stored custom colors fill the list the override filter emptied.
	 *
	 * @return {void}
	 */
	it('adds the stored custom colors in FSE mode with the override on', () => {
		const result = applyFilters(HOOK, [], { allColors, override: true });

		expect(result).toEqual([customOne, customTwo]);
	});

	/**
	 * Once the Color Palette panel has pushed the custom colors into the editor palette, the list is left as is.
	 *
	 * @return {void}
	 */
	it('leaves the list unchanged when the custom colors are already in it', () => {
		const pushed = [{ ...customOne }, { ...customTwo }];
		const result = applyFilters(HOOK, pushed, { allColors: [...pushed, user], override: true });

		expect(result).toBe(pushed);
	});

	/**
	 * Only the custom colors missing from the list are appended, so none is duplicated.
	 *
	 * @return {void}
	 */
	it('appends only the missing custom colors', () => {
		const result = applyFilters(HOOK, [customOne], { allColors: [customOne, theme], override: true });

		expect(result).toEqual([customOne, customTwo]);
	});

	/**
	 * With the override off the control already shows the full palette, so the listener passes it through.
	 *
	 * @return {void}
	 */
	it('is a pass-through with the override off', () => {
		const result = applyFilters(HOOK, allColors, { allColors, override: false });

		expect(result).toBe(allColors);
	});

	/**
	 * Outside FSE mode the server already puts the custom colors in the editor palette, so nothing is added.
	 *
	 * @return {void}
	 */
	it('is a pass-through outside FSE mode', () => {
		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };

		const filtered = [];
		const result = applyFilters(HOOK, filtered, { allColors, override: true });

		expect(result).toBe(filtered);
	});

	/**
	 * Missing or malformed color settings add nothing.
	 *
	 * @return {void}
	 */
	it('adds nothing when the color settings are missing or malformed', () => {
		const filtered = [];

		global.kadence_blocks_params = { colors: '{not json' };
		expect(applyFilters(HOOK, filtered, { allColors, override: true })).toBe(filtered);

		global.kadence_blocks_params = { colors: JSON.stringify({ override: true }) };
		expect(applyFilters(HOOK, filtered, { allColors, override: true })).toBe(filtered);

		delete global.kadence_blocks_params;
		expect(applyFilters(HOOK, filtered, { allColors, override: true })).toBe(filtered);
	});

	/**
	 * The custom colors lead the list ahead of the token palette colors the token listener restores.
	 *
	 * @return {void}
	 */
	it('runs before the token palette listener', () => {
		const slot = { color: '#3182ce', name: 'Brand Primary', slug: 'palette1' };

		window.kadenceDesignTokensPalettes = { slots: { palette1: '{primitive.color.brand.primary}' } };
		// Production order (src/early-filters.js), so only the priority puts the custom colors first.
		registerColorControlFilters();
		registerCustomColorFilters();

		const result = applyFilters(HOOK, [], { allColors: [slot, user], override: true });

		expect(result).toEqual([customOne, customTwo, { ...slot, color: '{primitive.color.brand.primary}' }]);
	});

	/**
	 * Registering twice does not stack a second listener.
	 *
	 * @return {void}
	 */
	it('is idempotent across repeated registration', () => {
		registerCustomColorFilters();

		const result = applyFilters(HOOK, [], { allColors, override: true });

		expect(result).toEqual([customOne, customTwo]);
	});
});
