/* eslint-env jest */

/**
 * Pins the weight of the button's own editor-canvas rules, per button kind.
 *
 * A button on a class-painted preset the Style Library has overridden carries an override rule the preset
 * projector emits at (0,5,0) resting and (0,6,0) hover. `BackendStyles` renders a `<style>` inside the
 * block, after every head stylesheet, so a rule here wins any tie; three extra `.kt-button` classes put its
 * resting rule at (0,5,0) and its hover rule at (0,6,0), which ties that override and, with the print
 * order, is the editor half of "a block's own value wins, per state". Every other button, including one on
 * an untouched class-painted preset (no override rule exists for it), keeps the weight it always had, so a
 * theme editor rule that outranked the block's before still does and the canvas matches the page.
 */

/**
 * Internal dependencies
 */
import { KadenceBlocksCSS } from '@kadence/helpers';
import { blockPresetOverridden, blockPresetThemeClass } from '../../../extension/preset-picker';
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
	activePresetFor: jest.fn((name, attributes) => attributes?.kbPreset || 'default'),
	blockDefaultOverridden: jest.fn(() => ({})),
	blockDefaultPreset: jest.fn(() => 'default'),
	blockPresetOverridden: jest.fn(() => ({})),
	blockPresetValues: jest.fn(() => ({ default: {} })),
	blockPresets: jest.fn(() => []),
	blockPresetThemeClass: jest.fn(() => ''),
}));

const SHADOW = { hOffset: 2, vOffset: 2, blur: 4, spread: 0, color: '#000000', opacity: 1, inset: false };
const ATTRIBUTES = {
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
};

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

/**
 * Renders the component for the given preset selection into a fresh fake builder.
 *
 * @param {string} kbPreset The block's `kbPreset` attribute.
 *
 * @since TBD
 *
 * @return {Array} The fake builder's recorded rules.
 */
function render(kbPreset) {
	const fakeCss = createFakeCss();
	KadenceBlocksCSS.mockImplementation(() => fakeCss);

	BackendStyles({ attributes: { ...ATTRIBUTES, kbPreset }, previewDevice: 'Desktop' });

	return fakeCss.rules;
}

describe('BackendStyles per-instance rule weight', () => {
	beforeEach(() => {
		blockPresetThemeClass.mockImplementation((name, slug) => (slug === 'outline' ? 'kb-btn-global-outline' : ''));
		blockPresetOverridden.mockReturnValue({ outline: { 'button-bg': true } });
	});

	afterEach(() => {
		KadenceBlocksCSS.mockReset();
		blockPresetThemeClass.mockReset();
		blockPresetOverridden.mockReset();
	});

	describe('on a class-painted preset the library overrides', () => {
		const RESTING = '.kb-single-btn-abc .kt-button-abc.kt-button.kt-button.kt-button';
		const HOVER = '.kb-single-btn-abc .kt-button-abc.kt-button.kt-button.kt-button:hover';

		/**
		 * Every resting value the block sets lands under the raised (0,5,0) selector.
		 *
		 * @return {void}
		 */
		it('emits the resting values under the raised per-instance selector', () => {
			const rules = render('outline');

			expect(propertiesFor(rules, RESTING)).toEqual(
				expect.arrayContaining([
					'background',
					'color',
					'border-radius',
					'padding-top',
					'border-top',
					'box-shadow',
				])
			);
		});

		/**
		 * Every hover value the block sets lands under the raised (0,6,0) hover selector. The hover
		 * background is painted by the `::before` overlay, so it is not part of this rule.
		 *
		 * @return {void}
		 */
		it('emits the hover values under the raised per-instance hover selector', () => {
			const rules = render('outline');

			expect(propertiesFor(rules, HOVER)).toEqual(
				expect.arrayContaining(['color', 'border-top-left-radius', 'border-top', 'box-shadow'])
			);
		});

		/**
		 * No rule targets the button at the lighter weights a theme's editor rule could outrank.
		 *
		 * @return {void}
		 */
		it('emits no lighter per-instance selector', () => {
			const selectors = render('outline').map((rule) => rule.selector);

			expect(selectors).not.toContain('.kb-single-btn-abc .kt-button-abc');
			expect(selectors).not.toContain('.kb-single-btn-abc .kt-button-abc:hover');
			expect(selectors).not.toContain('.kb-single-btn-abc .kt-button-abc.kt-button.kt-button');
		});
	});

	describe('on a class-painted preset the library leaves untouched', () => {
		/**
		 * With no override there is no override rule to tie, so the button keeps the weight it always had:
		 * a theme editor rule that outranks the block's own value keeps doing so, as it does on the page.
		 *
		 * @return {void}
		 */
		it('keeps the historic per-instance weight', () => {
			blockPresetOverridden.mockReturnValue({ outline: {} });

			const rules = render('outline');

			expect(propertiesFor(rules, '.kb-single-btn-abc .kt-button-abc')).toEqual(
				expect.arrayContaining(['background', 'border-radius', 'padding-top', 'border-top', 'box-shadow'])
			);
			expect(rules.map((rule) => rule.selector).join(' ')).not.toContain('.kt-button.kt-button.kt-button');
		});
	});

	describe('on a preset painted through variables, or none', () => {
		const RESTING = '.kb-single-btn-abc .kt-button-abc';
		const HOVER = '.kb-single-btn-abc .kt-button-abc:hover';

		/**
		 * A button with no class preset keeps the weight it always had, resting and hover, so the theme
		 * editor rules that outranked it keep doing so and the canvas matches the page.
		 *
		 * @return {void}
		 */
		it('keeps the historic per-instance weight', () => {
			for (const kbPreset of ['', 'default']) {
				const rules = render(kbPreset);

				expect(propertiesFor(rules, RESTING)).toEqual(
					expect.arrayContaining(['background', 'border-radius', 'padding-top', 'border-top', 'box-shadow'])
				);
				expect(propertiesFor(rules, HOVER)).toEqual(
					expect.arrayContaining(['color', 'border-top-left-radius', 'border-top', 'box-shadow'])
				);
				expect(propertiesFor(rules, '.kb-single-btn-abc .kt-button-abc.kt-button.kt-button')).toContain(
					'color'
				);
				expect(rules.map((rule) => rule.selector).join(' ')).not.toContain('.kt-button.kt-button.kt-button');
			}
		});
	});
});
