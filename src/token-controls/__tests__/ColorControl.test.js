/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ColorControl } from '../controls/ColorControl';

// Matches `token-popover.test.js`'s stand-in: `@wordpress/components` resolves its own nested
// `react` copy, a different module instance than the top-level `react-dom/client` this test renders
// with, which trips React's "Invalid hook call" guard. `Dropdown` renders both its toggle and its
// content at once (rather than gating on `isOpen`) so a test can reach the popover's rows without
// simulating a real open click.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isPressed, ...props }) => <button {...props}>{children}</button>,
	Dropdown: ({ renderToggle, renderContent }) => (
		<>
			{renderToggle({ isOpen: false, onToggle: () => {} })}
			{renderContent({ onClose: () => {} })}
		</>
	),
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
	RangeControl: ({ label }) => <div>{label}</div>,
	SelectControl: ({ label }) => <div>{label}</div>,
	TabPanel: ({ children, tabs, initialTabName }) => {
		const initialTab = tabs.find((tab) => tab.name === initialTabName) || tabs[0];
		return <div data-testid="tab-panel">{children(initialTab)}</div>;
	},
	Tooltip: ({ children }) => children,
	__experimentalNumberControl: ({ label }) => <div>{label}</div>,
}));

jest.mock('@wordpress/icons', () => ({
	check: 'check',
	globe: 'globe',
	settings: 'settings',
	undo: 'undo',
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
}));

jest.mock('@wordpress/i18n', () => ({
	__: (text) => text,
	sprintf: (format, ...args) => format.replace(/%s/g, () => args.shift()),
}));

// `ColorPicker` pulls in `react-color`, which the token-popover-style tests never need to exercise —
// `ColorControl`'s own behavior under test never opens the Custom tab.
jest.mock('../molecules/ColorPicker', () => ({ ColorPicker: () => null }));

jest.mock('../styles/token-controls.scss', () => ({}), { virtual: true });

const GROUPS = [
	{
		id: 'accent',
		label: 'Accent',
		swatches: [
			{
				id: 'semantic.color.accent.strong',
				label: 'Strongest',
				value: '',
				alias: '{semantic.color.accent.strong}',
			},
			{
				id: 'semantic.color.accent.soft',
				label: 'Soft',
				value: '',
				alias: '{semantic.color.accent.soft}',
			},
		],
	},
];

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Render `ColorControl` with the given props.
 *
 * @param {Object} props The component props.
 *
 * @since TBD
 *
 * @return {void}
 */
function render(props = {}) {
	act(() =>
		root.render(
			createElement(ColorControl, {
				label: 'Text',
				value: '',
				groups: GROUPS,
				onPick: jest.fn(),
				onCustom: jest.fn(),
				resolveLiteral: () => '',
				...props,
			})
		)
	);
}

describe('ColorControl', () => {
	/**
	 * The static attribute label always renders on the trigger, regardless of the current value.
	 *
	 * @return {void}
	 */
	it('renders the static label', () => {
		render();

		expect(container.querySelector('.kb-color-control__label').textContent).toBe('Text');
	});

	/**
	 * When the bound value matches a group entry, the trigger shows that entry's own label
	 * right-aligned beside the static label.
	 *
	 * @return {void}
	 */
	it("shows the selected token's label when value matches a group entry", () => {
		render({ value: '{semantic.color.accent.soft}' });

		expect(container.querySelector('.kb-color-control__value').textContent).toBe('Soft');
	});

	/**
	 * An unbound trigger shows no selected-value text.
	 *
	 * @return {void}
	 */
	it('shows no selected-value text when nothing is bound', () => {
		render();

		expect(container.querySelector('.kb-color-control__value')).toBeNull();
	});

	/**
	 * A bound alias that resolves to no entry in this control's own groups (e.g. a button preset's
	 * default text/background color, outside the Accent/Contrast/Background palette) shows the muted
	 * "Default" fallback rather than the raw, overflowing alias text.
	 *
	 * @return {void}
	 */
	it('shows the muted "Default" fallback when the value is bound but not one of the pickable groups', () => {
		render({ value: '{semantic.color.button-primary-text}' });

		expect(container.querySelector('.kb-color-control__value').textContent).toBe('Default');
	});

	/**
	 * The same out-of-group case never leaks the raw bracket-alias string into the swatch's inline
	 * `background`, which is not a valid CSS color.
	 *
	 * @return {void}
	 */
	it('renders a transparent swatch, not the raw alias, for an out-of-group value', () => {
		render({ value: '{semantic.color.button-primary-text}' });

		expect(container.querySelector('.kb-color-swatch').style.background).toBe('transparent');
	});

	/**
	 * The trigger always renders a swatch mark, bound or not.
	 *
	 * @return {void}
	 */
	it('renders the swatch', () => {
		render({ value: '{semantic.color.accent.soft}' });

		expect(container.querySelector('.kb-color-control__trigger .kb-color-swatch')).not.toBeNull();
	});

	/**
	 * Clicking a `ColorGroupList` row calls `onPick` with that entry's alias.
	 *
	 * @return {void}
	 */
	it('calls onPick with the alias when a group list row is clicked', () => {
		const onPick = jest.fn();

		render({ onPick });

		const items = container.querySelectorAll('.kb-color-control__item');
		act(() => items[1].dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onPick).toHaveBeenCalledWith('{semantic.color.accent.soft}');
	});
});
