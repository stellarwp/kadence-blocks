/* eslint-env jest */
/**
 * The color-control swatch filter listener.
 *
 * The shared `PopColorControl` (in the token-agnostic `@kadence/components` library) hides every
 * non-`kb-palette-*` swatch when the "Use only Custom Colors" override is on. Design tokens are
 * projected into the global-palette slots `palette1`..`palette9`, so those token-backed swatches
 * would disappear in override mode. Kadence Blocks registers a listener on the control's
 * `kadence.components.popColorControl.colors` filter that re-adds those slots.
 *
 * These tests drive the listener exactly as the component does — by firing `applyFilters` with the
 * built-in filtered list plus the `{ allColors, override }` context — and assert that it re-adds the
 * global-palette slots in override mode without duplicating swatches, and is an exact pass-through in
 * every other case.
 */
import { applyFilters, removeFilter } from '@wordpress/hooks';
import { registerColorControlFilters } from '../register-color-control-filters';

const HOOK = 'kadence.components.popColorControl.colors';
const NAMESPACE = 'kadence-blocks/token-palette-colors';

const custom = { name: 'My Green', slug: 'kb-palette-9', color: '#00ff00' };
const token1 = { name: 'Primary', slug: 'palette1', color: '#3182ce' };
const token2 = { name: 'Secondary', slug: 'palette2', color: '#2b6cb0' };
const theme = { name: 'Vivid Red', slug: 'vivid-red', color: '#ff0000' };

/**
 * The full unfiltered editor palette: a custom color, two token-backed global-palette slots, and a
 * generic theme color.
 *
 * @type {Array}
 */
const allColors = [custom, token1, token2, theme];

describe('registerColorControlFilters', () => {
	afterEach(() => {
		removeFilter(HOOK, NAMESPACE);
	});

	/**
	 * In override mode the listener re-adds the global-palette slots that the control's built-in
	 * filter dropped, appended after the surviving custom colors.
	 *
	 * @return {void}
	 */
	it('re-adds palette1..9 slots to the override-filtered list', () => {
		registerColorControlFilters();

		// What the control computes in override mode: only kb-palette-* survives.
		const filtered = [custom];
		const result = applyFilters(HOOK, filtered, { allColors, override: true });

		expect(result).toEqual([custom, token1, token2]);
	});

	/**
	 * A generic theme color (neither `kb-palette-*` nor a `paletteN` slot) stays hidden in override
	 * mode.
	 *
	 * @return {void}
	 */
	it('does not re-add non-palette theme colors', () => {
		registerColorControlFilters();

		const result = applyFilters(HOOK, [custom], { allColors, override: true });

		expect(result).not.toContain(theme);
	});

	/**
	 * A global-palette slot already present in the list is not duplicated.
	 *
	 * @return {void}
	 */
	it('does not duplicate a slot already present in the list', () => {
		registerColorControlFilters();

		const result = applyFilters(HOOK, [custom, token1], { allColors, override: true });

		expect(result).toEqual([custom, token1, token2]);
	});

	/**
	 * With the override off the control already shows the full palette, so the listener passes the
	 * list through unchanged.
	 *
	 * @return {void}
	 */
	it('passes the list through unchanged when override is off', () => {
		registerColorControlFilters();

		const result = applyFilters(HOOK, allColors, { allColors, override: false });

		expect(result).toBe(allColors);
	});

	/**
	 * With no global-palette slots present (a site without the tokens palette) the override-filtered
	 * list is returned unchanged.
	 *
	 * @return {void}
	 */
	it('is a no-op when no palette slots are present', () => {
		registerColorControlFilters();

		const filtered = [custom];
		const result = applyFilters(HOOK, filtered, {
			allColors: [custom, theme],
			override: true,
		});

		expect(result).toBe(filtered);
	});

	/**
	 * Registering twice does not stack duplicate listeners (the registrar removes any prior listener
	 * under its namespace first).
	 *
	 * @return {void}
	 */
	it('is idempotent across repeated registration', () => {
		registerColorControlFilters();
		registerColorControlFilters();

		const result = applyFilters(HOOK, [custom], { allColors, override: true });

		expect(result).toEqual([custom, token1, token2]);
	});
});
