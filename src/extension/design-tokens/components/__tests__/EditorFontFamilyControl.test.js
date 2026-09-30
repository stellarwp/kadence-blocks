/* eslint-env jest */
// cspell:ignore Abril Fatface

// `@wordpress/components` is not resolvable in the jest env; the token UI only references it at
// render time, and these tests inspect the returned element types and props without rendering.
jest.mock(
	'@wordpress/components',
	() => ({
		Button: 'Button',
		ButtonGroup: 'ButtonGroup',
		Dashicon: 'Dashicon',
		Dropdown: 'Dropdown',
		Spinner: 'Spinner',
	}),
	{ virtual: true }
);

/**
 * Internal dependencies
 */
import { ControlShell, FontFamilySelector } from '../../../../token-controls';
import { TokenIndicator } from '../../../token-indicators/components/TokenIndicator';
import { EditorFontFamilyControl } from '../EditorFontFamilyControl';

/**
 * Call `EditorFontFamilyControl` as a plain function and return the element tree it produced. It holds
 * no hooks of its own, so the tree can be inspected directly, matching its sibling tests.
 *
 * @param {Object} overrides Props to override on top of the defaults.
 *
 * @since TBD
 *
 * @return {{shell: Object, selector: Object, props: Object}} The `ControlShell` element, the
 *   `FontFamilySelector` nested in it, and the props passed in.
 */
function renderControl(overrides = {}) {
	const props = {
		label: 'Font Family',
		value: 'Inter',
		onChange: jest.fn(),
		onClear: jest.fn(),
		...overrides,
	};

	const shell = EditorFontFamilyControl(props);

	return { shell, selector: shell.props.children, props };
}

describe('EditorFontFamilyControl', () => {
	beforeEach(() => {
		window.kadenceDesignTokensFonts = { favorites: ['Georgia'], custom: [], manageUrl: 'https://example.test' };
		window.kadence_blocks_params = { g_font_names: ['Abel'] };
	});

	afterEach(() => {
		delete window.kadenceDesignTokensFonts;
		delete window.kadence_blocks_params;
	});

	/**
	 * The field wears the same `ControlShell` chrome Font Size does: the label in the header, stacked
	 * over a full-width body.
	 *
	 * @return {void}
	 */
	it('wraps the field in the stacked control shell with its label', () => {
		const { shell } = renderControl();

		expect(shell.type).toBe(ControlShell);
		expect(shell.props.label).toBe('Font Family');
		expect(shell.props.stacked).toBe(true);
	});

	/**
	 * The shell's header carries the block's own binding mark, with the block's reset handler.
	 *
	 * @return {void}
	 */
	it('passes the binding state and reset handler to the header indicator', () => {
		const onReset = jest.fn();
		const { shell } = renderControl({ state: { bound: true, overridden: true }, onReset });

		expect(shell.props.indicator.type).toBe(TokenIndicator);
		expect(shell.props.indicator.props.state).toEqual({ bound: true, overridden: true });
		expect(shell.props.indicator.props.onReset).toBe(onReset);
	});

	/**
	 * A block whose preset surface has no family entry passes no state, and the indicator renders
	 * nothing.
	 *
	 * @return {void}
	 */
	it('renders an empty indicator when the block supplies no binding state', () => {
		const { shell } = renderControl();

		expect(shell.props.indicator.props.state).toBeNull();
	});

	/**
	 * The body is the favorites-aware picker, carrying the current family and the site's favorites.
	 *
	 * @return {void}
	 */
	it('renders the favorites-aware picker as the body', () => {
		const { selector } = renderControl({ inheritedLabel: 'Anton' });

		expect(selector.type).toBe(FontFamilySelector);
		expect(selector.props.value).toBe('Inter');
		expect(selector.props.favorites).toEqual(['Georgia']);
		expect(selector.props.inheritedLabel).toBe('Anton');
	});

	/**
	 * Clearing goes straight to the host's handler, which returns the family to the preset's or the
	 * theme's.
	 *
	 * @return {void}
	 */
	it('clears through the host handler', () => {
		const { selector, props } = renderControl();

		selector.props.onClear();

		expect(props.onClear).toHaveBeenCalled();
	});
});
