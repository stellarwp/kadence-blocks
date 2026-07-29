/* eslint-env jest */
/**
 * The color-control swatch filter listener.
 *
 * The shared `PopColorControl` (in the token-agnostic `@kadence/components` library) hides every
 * non-`kb-palette-*` swatch when the "Use only Custom Colors" override is on, and resolves each swatch's
 * display through `@kadence/helpers`. Design tokens are projected into the global-palette slots
 * `palette1`..`palette9`. Kadence Blocks registers a listener on the control's
 * `kadence.components.popColorControl.colors` filter that, when the registry is active, sets those slots'
 * value to their token alias (so a selection follows palette swaps) and re-adds them in override mode.
 *
 * These tests drive the listener exactly as the component does - by firing `applyFilters` with the
 * built-in filtered list plus the `{ allColors, override }` context - and assert the aliasing, the
 * override-mode retention, and that a site with no active tokens is left untouched.
 */
import { applyFilters, removeFilter } from '@wordpress/hooks';
import { registerColorControlFilters } from '../register-color-control-filters';

const HOOK = 'kadence.components.popColorControl.colors';
const NAMESPACE = 'kadence-blocks/token-palette-colors';

const custom = { name: 'My Green', slug: 'kb-palette-9', color: '#00ff00' };
const token1 = { name: 'Brand Primary', slug: 'palette1', color: '#3182ce' };
const token2 = { name: 'Brand Secondary', slug: 'palette2', color: '#2b6cb0' };
const theme = { name: 'Vivid Red', slug: 'vivid-red', color: '#ff0000' };

const ALIAS1 = '{primitive.color.brand.primary}';
const ALIAS2 = '{primitive.color.brand.secondary}';

/**
 * The full unfiltered editor palette: a custom color, two token-backed global-palette slots, and a
 * generic theme color.
 *
 * @type {Array}
 */
const allColors = [custom, token1, token2, theme];

describe('registerColorControlFilters', () => {
	beforeEach(() => {
		// The Localizer attaches this global only when the design-tokens registry is active; the listener
		// gates on it, so simulate an active registry.
		window.kadenceDesignTokensPalettes = { active: 'default', current: 'default', palettes: [] };
		registerColorControlFilters();
	});

	afterEach(() => {
		removeFilter(HOOK, NAMESPACE);
		delete window.kadenceDesignTokensPalettes;
	});

	/**
	 * In override mode the listener re-adds the global-palette slots the control dropped, each carrying
	 * its token alias as the value, appended after the surviving custom colors.
	 *
	 * @return {void}
	 */
	it('re-adds palette slots in override mode with their token alias', () => {
		// What the control computes in override mode: only kb-palette-* survives.
		const result = applyFilters(HOOK, [custom], { allColors, override: true });

		expect(result).toEqual([custom, { ...token1, color: ALIAS1 }, { ...token2, color: ALIAS2 }]);
	});

	/**
	 * In merge mode the global-palette slots are already present; the listener rewrites their value to the
	 * token alias without dropping or reordering anything.
	 *
	 * @return {void}
	 */
	it('aliases the palette slots already present in merge mode', () => {
		const result = applyFilters(HOOK, allColors, { allColors, override: false });

		expect(result).toEqual([custom, { ...token1, color: ALIAS1 }, { ...token2, color: ALIAS2 }, theme]);
	});

	/**
	 * A generic theme color (neither a palette slot nor a custom color) is never aliased or re-added.
	 *
	 * @return {void}
	 */
	it('leaves non-palette colors untouched', () => {
		const result = applyFilters(HOOK, [custom, theme], { allColors, override: true });

		expect(result).toContainEqual(theme);
		expect(result).toContainEqual(custom);
	});

	/**
	 * A palette slot already present in the list is aliased in place, not duplicated by the override re-add.
	 *
	 * @return {void}
	 */
	it('does not duplicate a slot already present in the list', () => {
		const result = applyFilters(HOOK, [custom, token1], { allColors, override: true });

		expect(result).toEqual([custom, { ...token1, color: ALIAS1 }, { ...token2, color: ALIAS2 }]);
	});

	/**
	 * With the registry inactive (no editor palette global) the listener is a pass-through: the literal
	 * palette colors are left untouched and nothing is re-added.
	 *
	 * @return {void}
	 */
	it('is a pass-through when the registry is inactive', () => {
		delete window.kadenceDesignTokensPalettes;

		const filtered = [custom];
		const result = applyFilters(HOOK, filtered, { allColors, override: true });

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

		const result = applyFilters(HOOK, [custom], { allColors, override: true });

		expect(result).toEqual([custom, { ...token1, color: ALIAS1 }, { ...token2, color: ALIAS2 }]);
	});
});
