/* eslint-env jest */

/**
 * Pins the weight of the button's own editor-canvas rules. `BackendStyles` renders a `<style>` inside
 * the block, after every head stylesheet, so a rule here wins any tie; three extra `.kt-button` classes
 * put its resting rule at (0,5,0) and its hover rule at (0,6,0), which ties the class-preset override
 * the preset projector emits and outranks every theme editor rule for the button's classes. Together
 * with that print order this is the editor half of "a block's own value wins, per state".
 */

/**
 * Internal dependencies
 */
import { KadenceBlocksCSS } from '@kadence/helpers';
import BackendStyles from '../components/backend-styles';

// `backend-styles/index.js` imports the `@kadence/helpers` barrel, which eagerly pulls in a REST-fetch
// helper that has no `@wordpress/api-fetch` module to resolve under Jest. The stubs below answer the
// desktop value of every preview lookup so each per-instance declaration is emitted.
jest.mock('@kadence/helpers', () => ({
	KadenceBlocksCSS: jest.fn(),
	getPreviewSize: jest.fn((device, desktop) => desktop),
	KadenceColorOutput: jest.fn((color) => color),
	typographyStyle: jest.fn(() => ''),
	getBorderStyle: jest.fn(() => '1px solid #112233'),
	getBorderColor: jest.fn(() => '#112233'),
	getSpacingOptionOutput: jest.fn((value, unit) => `${value}${unit}`),
}));

jest.mock('../../../extension/preset-picker', () => ({
	activePresetFor: jest.fn(() => 'default'),
	blockDefaultOverridden: jest.fn(() => ({})),
	blockDefaultPreset: jest.fn(() => 'default'),
	blockPresetValues: jest.fn(() => ({ default: {} })),
	blockPresetThemeClass: jest.fn(() => ''),
}));

const RESTING = '.kb-single-btn-abc .kt-button-abc.kt-button.kt-button.kt-button';
const HOVER = '.kb-single-btn-abc .kt-button-abc.kt-button.kt-button.kt-button:hover';
const SHADOW = { hOffset: 2, vOffset: 2, blur: 4, spread: 0, color: '#000000', opacity: 1, inset: false };

/**
 * A fake CSS builder recording every selector and declaration the component adds, so a test can read
 * the rule body emitted under one selector.
 *
 * @since TBD
 *
 * @return {{set_selector: Function, add_property: Function, add_raw_styles: Function, render_color:
 *   Function, render_measure_output: Function, css_output: Function, rules: Array}} The fake builder.
 */
function createFakeCss() {
	const rules = [];
	let current = null;

	return {
		set_selector: (selector) => {
			current = { selector, props: {} };
			rules.push(current);
		},
		add_property: (property, value) => {
			if (undefined !== value && '' !== value) {
				current.props[property] = value;
			}
		},
		add_raw_styles: () => {},
		render_color: (color) => color,
		render_measure_output: (value, tablet, mobile, device, property) => {
			current.props[property] = value;
		},
		css_output: () => '',
		rules,
	};
}

/**
 * Every property name recorded under one selector, across every rule opened for it.
 *
 * @param {Array}  rules    The fake builder's recorded rules.
 * @param {string} selector The selector to read.
 *
 * @since TBD
 *
 * @return {string[]} The declared property names.
 */
function propertiesFor(rules, selector) {
	return rules.filter((rule) => rule.selector === selector).flatMap((rule) => Object.keys(rule.props));
}

describe('BackendStyles per-instance rule weight', () => {
	let fakeCss;

	beforeEach(() => {
		fakeCss = createFakeCss();
		KadenceBlocksCSS.mockImplementation(() => fakeCss);

		BackendStyles({
			attributes: {
				uniqueID: 'abc',
				background: '#c81e1e',
				color: '#ffffff',
				borderRadius: [20, 20, 20, 20],
				borderRadiusUnit: 'px',
				padding: [4, 40, 4, 40],
				paddingUnit: 'px',
				borderStyle: [
					{
						top: ['#112233', 'solid', 1],
						right: ['#112233', 'solid', 1],
						bottom: ['#112233', 'solid', 1],
						left: ['#112233', 'solid', 1],
						unit: 'px',
					},
				],
				displayShadow: true,
				shadow: [SHADOW],
				backgroundHover: '#a01818',
				colorHover: '#ffffff',
				borderHoverRadius: [10, 10, 10, 10],
				borderHoverRadiusUnit: 'px',
				borderHoverStyle: [
					{
						top: ['#445566', 'solid', 2],
						right: ['#445566', 'solid', 2],
						bottom: ['#445566', 'solid', 2],
						left: ['#445566', 'solid', 2],
						unit: 'px',
					},
				],
				displayHoverShadow: true,
				shadowHover: [SHADOW],
			},
			previewDevice: 'Desktop',
		});
	});

	afterEach(() => {
		KadenceBlocksCSS.mockReset();
	});

	/**
	 * Every resting value the block sets lands under the raised (0,5,0) selector.
	 *
	 * @return {void}
	 */
	it('emits the resting values under the raised per-instance selector', () => {
		const properties = propertiesFor(fakeCss.rules, RESTING);

		expect(properties).toEqual(
			expect.arrayContaining(['background', 'color', 'border-radius', 'padding-top', 'border-top', 'box-shadow'])
		);
	});

	/**
	 * Every hover value the block sets lands under the raised (0,6,0) hover selector. The hover
	 * background is painted by the `::before` overlay, so it is not part of this rule.
	 *
	 * @return {void}
	 */
	it('emits the hover values under the raised per-instance hover selector', () => {
		const properties = propertiesFor(fakeCss.rules, HOVER);

		expect(properties).toEqual(
			expect.arrayContaining(['color', 'border-top-left-radius', 'border-top', 'box-shadow'])
		);
	});

	/**
	 * No rule targets the button at the old, lighter weights, which the theme's editor rules outranked.
	 *
	 * @return {void}
	 */
	it('no longer emits the lighter per-instance selectors', () => {
		const selectors = fakeCss.rules.map((rule) => rule.selector);

		expect(selectors).not.toContain('.kb-single-btn-abc .kt-button-abc');
		expect(selectors).not.toContain('.kb-single-btn-abc .kt-button-abc:hover');
		expect(selectors).not.toContain('.kb-single-btn-abc .kt-button-abc.kt-button.kt-button');
	});
});
