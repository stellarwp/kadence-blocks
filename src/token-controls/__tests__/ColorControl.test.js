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

// A module-level spy so a test can assert `onToggle` was (or was not) called without the
// `Dropdown` mock needing to accept one through props — e.g. confirming a `BindingIndicator`
// Reset click, which sits as `onToggle`'s DOM sibling now rather than nested inside it, never
// bubbles up and reopens the popover it just closed.
const mockOnToggle = jest.fn();

// Matches `token-popover.test.js`'s stand-in: `@wordpress/components` resolves its own nested
// `react` copy, a different module instance than the top-level `react-dom/client` this test renders
// with, which trips React's "Invalid hook call" guard. `Dropdown` renders both its toggle and its
// content at once (rather than gating on `isOpen`) so a test can reach the popover's rows without
// simulating a real open click.
jest.mock('@wordpress/components', () => ({
	// `showTooltip` (like `isPressed`) is a `Button`-only prop — spreading it onto a DOM `<button>`
	// trips React's "unrecognized DOM attribute" warning, which `@wordpress/jest-console` treats as
	// a test failure.
	Button: ({ children, isPressed, showTooltip, ...props }) => <button {...props}>{children}</button>,
	Dropdown: ({ renderToggle, renderContent }) => (
		<>
			{renderToggle({ isOpen: false, onToggle: mockOnToggle })}
			{renderContent({ onClose: () => {} })}
		</>
	),
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
	RangeControl: ({ label }) => <div>{label}</div>,
	SelectControl: ({ label }) => <div>{label}</div>,
	// Renders every tab's content unconditionally, not just `initialTabName`'s — `ColorControl`
	// computes its own initial tab internally (never `'custom'` while a value is bound to an entry,
	// since a bound value is always alias-shaped), so a test asserting on the Custom tab's output
	// needs it mounted regardless of which tab a real `TabPanel` would show as active.
	TabPanel: ({ children, tabs }) => (
		<div data-testid="tab-panel">
			{tabs.map((tab) => (
				<div key={tab.name} data-tab={tab.name}>
					{children(tab)}
				</div>
			))}
		</div>
	),
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

// `ColorPicker` pulls in `react-color`, which these tests never need to exercise — this stand-in
// exposes the `color` prop it was called with (`data-testid="color-picker"`'s own `data-color`
// attribute) so a test can assert what `ColorControl` resolves for the Custom tab without
// rendering the real saturation/hue UI.
jest.mock('../molecules/ColorPicker', () => ({
	ColorPicker: ({ color }) => <div data-testid="color-picker" data-color={color ?? ''} />,
}));

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
	mockOnToggle.mockClear();
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
		render({ value: '{semantic.color.button-text}' });

		expect(container.querySelector('.kb-color-control__value').textContent).toBe('Default');
	});

	/**
	 * The same out-of-group case never leaks the raw bracket-alias string into the swatch's inline
	 * `background`, which is not a valid CSS color.
	 *
	 * @return {void}
	 */
	it('renders a transparent swatch, not the raw alias, for an out-of-group value', () => {
		render({ value: '{semantic.color.button-text}' });

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

	/**
	 * `BindingIndicator`'s Reset button is a DOM sibling of the dropdown's toggle button, not
	 * nested inside it — a Reset click must never bubble up and reopen the popover it just closed.
	 *
	 * @return {void}
	 */
	it('does not toggle the popover when the binding indicator is reset', () => {
		const onReset = jest.fn();

		render({
			value: '{semantic.color.accent.soft}',
			status: { bound: true, modified: true },
			onReset,
		});

		const reset = container.querySelector('.kb-token-control__indicator-reset');
		expect(reset).not.toBeNull();
		expect(container.querySelector('.kb-color-control__trigger-button').contains(reset)).toBe(false);

		act(() => reset.dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onReset).toHaveBeenCalled();
		expect(mockOnToggle).not.toHaveBeenCalled();
	});

	/**
	 * When the value is bound to a group entry and the host supplies no `resolveLiteral`, the
	 * Custom tab must never receive the raw bracket alias as a literal CSS color — `ColorPicker`
	 * requires a parseable value, and an alias string like `{semantic.color.accent.soft}` isn't one.
	 *
	 * @return {void}
	 */
	it('does not pass a raw token alias to the Custom tab when resolveLiteral is omitted', () => {
		render({ value: '{semantic.color.accent.soft}', resolveLiteral: undefined });

		expect(container.querySelector('[data-testid="color-picker"]').dataset.color).toBe('');
	});

	/**
	 * The Custom tab still seeds from the host's resolved literal when one is available.
	 *
	 * @return {void}
	 */
	it('passes the resolved literal to the Custom tab when resolveLiteral is provided', () => {
		render({ value: '{semantic.color.accent.soft}', resolveLiteral: () => '#3182ce' });

		expect(container.querySelector('[data-testid="color-picker"]').dataset.color).toBe('#3182ce');
	});

	/**
	 * Clear is opt-in: a host that passes no `onClear` gets no Clear row, keeping the control
	 * unchanged for callers that have their own way back to unset.
	 *
	 * @return {void}
	 */
	it('renders no Clear row when onClear is omitted', () => {
		render({ value: '{semantic.color.accent.soft}' });

		expect(container.querySelector('.kb-color-control__clear')).toBeNull();
	});

	/**
	 * The Clear row is the only path back to unset for an attribute no preset binds, so it clears the
	 * value and closes the popover.
	 *
	 * @return {void}
	 */
	it('calls onClear and closes the popover when the Clear row is clicked', () => {
		const onClear = jest.fn();

		render({ value: '{semantic.color.accent.soft}', onClear });

		const clear = container.querySelector('.kb-color-control__clear');

		act(() => clear.dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onClear).toHaveBeenCalled();
		expect(mockOnToggle).not.toHaveBeenCalled();
	});

	/**
	 * With nothing set there is nothing to clear, so the row is present but inert rather than
	 * offering an action that would be a no-op.
	 *
	 * @return {void}
	 */
	it('disables the Clear row when the value is already unset', () => {
		render({ value: '', onClear: jest.fn() });

		expect(container.querySelector('.kb-color-control__clear').disabled).toBe(true);
	});
});
