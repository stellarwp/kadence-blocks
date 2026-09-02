/* eslint-env jest */
/**
 * Internal dependencies
 */
import { colorSelection } from '../helpers/color-selection';

jest.mock('@wordpress/i18n', () => ({
	__: (text) => text,
}));

const GROUPS = [
	{
		id: 'accent',
		label: 'Accent',
		swatches: [
			{
				id: 'semantic.color.accent.main',
				label: 'Main',
				value: '#3182ce',
				alias: '{semantic.color.accent.main}',
			},
		],
	},
	{
		id: 'background',
		label: 'Background',
		swatches: [
			{
				id: 'semantic.color.background.base',
				label: 'Base',
				value: '#ffffff',
				alias: '{semantic.color.background.base}',
			},
		],
	},
];

describe('colorSelection', () => {
	/**
	 * Every group's swatches are flattened into one list, in group order, so the popover can hand
	 * `TokenPopover` a single `tokens` array.
	 *
	 * @return {void}
	 */
	it("flattens every group's swatches in order", () => {
		expect(colorSelection(GROUPS, '').allSwatches.map((entry) => entry.id)).toEqual([
			'semantic.color.accent.main',
			'semantic.color.background.base',
		]);
	});

	/**
	 * A bracket alias matching a swatch resolves to that entry, and the trigger shows the entry's
	 * own label.
	 *
	 * @return {void}
	 */
	it('matches a bracket alias to its entry and labels it', () => {
		const result = colorSelection(GROUPS, '{semantic.color.accent.main}');

		expect(result.entry.id).toBe('semantic.color.accent.main');
		expect(result.selectedLabel).toBe('Main');
	});

	/**
	 * A bound alias no group defines is still a real color, so it reads as the muted "Default"
	 * fallback rather than as raw dot-path text that would overflow the trigger.
	 *
	 * @return {void}
	 */
	it('labels an alias outside its own groups as Default', () => {
		const result = colorSelection(GROUPS, '{semantic.color.notice.error}');

		expect(result.entry).toBeFalsy();
		expect(result.selectedLabel).toBe('Default');
	});

	/**
	 * A raw literal matches no entry and gets no selected label — the trigger paints the literal on
	 * its swatch instead of naming it.
	 *
	 * @return {void}
	 */
	it('gives a raw literal no entry and no label', () => {
		const result = colorSelection(GROUPS, '#171717');

		expect(result.entry).toBeFalsy();
		expect(result.selectedLabel).toBeNull();
	});

	/**
	 * The popover opens on Style Library for an alias or an unset value, and on Custom for a
	 * literal — a literal could only have come from the Custom tab.
	 *
	 * @return {void}
	 */
	it("opens on the tab that matches the value's shape", () => {
		expect(colorSelection(GROUPS, '{semantic.color.accent.main}').initialTab).toBe('style-library');
		expect(colorSelection(GROUPS, '').initialTab).toBe('style-library');
		expect(colorSelection(GROUPS, '#171717').initialTab).toBe('custom');
	});

	/**
	 * A legacy `var(--...)` literal (the old editor's global-palette storage shape) is real and
	 * working but `react-color` cannot parse it, so it must open on Style Library, never the
	 * destructive Custom tab.
	 *
	 * @return {void}
	 */
	it('opens a CSS-variable literal on Style Library, not Custom', () => {
		expect(colorSelection(GROUPS, 'var(--global-palette1)').initialTab).toBe('style-library');
	});

	/**
	 * A CSS-variable literal matches no entry, so it must not be labeled as if it were a bound
	 * token.
	 *
	 * @return {void}
	 */
	it('gives a CSS-variable literal no entry and no label', () => {
		const result = colorSelection(GROUPS, 'var(--global-palette1)');

		expect(result.entry).toBeFalsy();
		expect(result.selectedLabel).toBeNull();
	});

	/**
	 * CSS allows whitespace around the custom-property name and a fallback after it. Every such
	 * spelling is still a CSS variable, and missing one would route a real color to the destructive
	 * Custom tab.
	 *
	 * @param {string} value The CSS-variable spelling under test.
	 *
	 * @return {void}
	 */
	it.each([
		['var( --global-palette1 )'],
		['var(--global-palette1 , #fff)'],
		['var(--global-palette1, #fff)'],
		['VAR(--global-palette1)'],
		['var(--caf\u00e9)'],
		['var(--escaped\\ name)'],
	])('opens %s on Style Library too', (value) => {
		expect(colorSelection(GROUPS, value).initialTab).toBe('style-library');
	});
});
