/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ColorSwatchControl } from '../controls/ColorSwatchControl';

// Matches `ColorControl.test.js`'s stand-in: `@wordpress/components` resolves its own nested `react`
// copy, a different module instance than the top-level `react-dom/client` this test renders with,
// which trips React's "Invalid hook call" guard. `Dropdown` renders both its toggle and its content
// at once so a test can reach the popover's rows without simulating a real open click.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isPressed, showTooltip, ...props }) => <button {...props}>{children}</button>,
	Dropdown: ({ renderToggle, renderContent }) => (
		<>
			{renderToggle({ isOpen: false, onToggle: () => {} })}
			{renderContent({ onClose: () => {} })}
		</>
	),
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
	RangeControl: ({ label }) => <div>{label}</div>,
	SelectControl: ({ label }) => <div>{label}</div>,
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

jest.mock('../molecules/ColorPicker', () => ({
	ColorPicker: ({ color, onChange }) => (
		<button type="button" data-testid="color-picker" data-color={color ?? ''} onClick={() => onChange('#abcdef')} />
	),
}));

jest.mock('../styles/token-controls.scss', () => ({}), { virtual: true });

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
 * Mount the control with the given prop overrides.
 *
 * @param {Object} props Prop overrides merged over the defaults.
 *
 * @return {void}
 */
function render(props = {}) {
	act(() => {
		root.render(
			createElement(ColorSwatchControl, {
				label: 'Top Border Color',
				value: '',
				groups: GROUPS,
				onPick: jest.fn(),
				onCustom: jest.fn(),
				...props,
			})
		);
	});
}

describe('ColorSwatchControl', () => {
	/**
	 * The trigger is a bare swatch button carrying its name only as an accessible label — the border
	 * row has no room for the visible label and value text `ColorControl`'s own trigger renders.
	 *
	 * @return {void}
	 */
	it('renders a bare swatch trigger named by aria-label, with no visible text', () => {
		render();

		const toggle = container.querySelector('.kb-color-swatch-control__button');

		expect(toggle).toBeTruthy();
		expect(toggle.getAttribute('aria-label')).toBe('Top Border Color');
		expect(toggle.textContent).toBe('');
		expect(toggle.querySelector('.kb-color-swatch')).toBeTruthy();
	});

	/**
	 * A read-only host disables the trigger so the popover cannot be opened at all.
	 *
	 * @return {void}
	 */
	it('disables the trigger when disabled', () => {
		render({ disabled: true });

		expect(container.querySelector('.kb-color-swatch-control__button').disabled).toBe(true);
	});

	/**
	 * The popover shows the grouped Style Library list, and picking a swatch hands back that
	 * entry's bracket alias.
	 *
	 * @return {void}
	 */
	it('picks a grouped swatch by its alias', () => {
		const onPick = jest.fn();
		render({ onPick });

		expect(container.querySelector('.kb-color-control__group-label').textContent).toBe('Accent');

		act(() => {
			container.querySelector('.kb-color-control__item').click();
		});

		expect(onPick).toHaveBeenCalledWith('{semantic.color.accent.main}');
	});

	/**
	 * The Custom tab writes a raw literal through `onCustom`, not through `onPick`.
	 *
	 * @return {void}
	 */
	it('writes a literal from the Custom tab', () => {
		const onCustom = jest.fn();
		render({ onCustom });

		act(() => {
			container.querySelector('[data-testid="color-picker"]').click();
		});

		expect(onCustom).toHaveBeenCalledWith('#abcdef');
	});

	/**
	 * The Custom tab is seeded from the bound entry through the host's `resolveLiteral`, so it opens
	 * on the token's current color rather than empty.
	 *
	 * @return {void}
	 */
	it('seeds the Custom tab from the bound entry via resolveLiteral', () => {
		render({ value: '{semantic.color.accent.main}', resolveLiteral: (entry) => entry.value });

		expect(container.querySelector('[data-testid="color-picker"]').getAttribute('data-color')).toBe('#3182ce');
	});

	/**
	 * A legacy `var(--...)` literal is not handed to `ColorPicker` as its seed — `react-color`
	 * cannot parse it and would render black, then overwrite the stored color with a hex on the
	 * first touch. The Custom tab opens neutral instead.
	 *
	 * @return {void}
	 */
	it('does not seed the Custom tab with a CSS-variable literal', () => {
		render({ value: 'var(--global-palette1)' });

		expect(container.querySelector('[data-testid="color-picker"]').getAttribute('data-color')).toBe('');
	});

	/**
	 * The Clear row renders only when the host passes `onClear`, and is inert while the slot is
	 * already unset.
	 *
	 * @return {void}
	 */
	it('renders Clear only with onClear, disabled while unset', () => {
		render();
		expect(container.querySelector('.kb-color-control__clear')).toBeFalsy();

		const onClear = jest.fn();
		render({ onClear, value: '#171717' });

		const clear = container.querySelector('.kb-color-control__clear');
		expect(clear.disabled).toBe(false);

		act(() => clear.click());
		expect(onClear).toHaveBeenCalled();
	});
});
