/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { BorderColorField } from '../border-color';

// Mirrors `ColorSwatchControl.test.js`'s stand-in: `@wordpress/components` resolves its own nested
// `react` copy, a different module instance than the top-level `react-dom/client` this test renders
// with, which trips React's "Invalid hook call" guard. `Dropdown` renders both its toggle and its
// content at once so a test can reach the popover's rows without simulating a real open click.
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
		<div>
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
	sprintf: (format, ...args) => {
		let next = 0;
		return format.replace(/%(?:(\d+)\$)?s/g, (match, position) =>
			position ? args[Number(position) - 1] : args[next++]
		);
	},
}));

jest.mock('../../../../token-controls/molecules/ColorPicker', () => ({
	ColorPicker: ({ onChange }) => (
		<button type="button" data-testid="color-picker" onClick={() => onChange('#abcdef')} />
	),
}));

jest.mock('../../../../token-controls/styles/token-controls.scss', () => ({}), { virtual: true });

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
 * Mount the field with the given prop overrides.
 *
 * @param {Object} props Prop overrides merged over the defaults.
 *
 * @return {void}
 */
function render(props = {}) {
	act(() => {
		root.render(
			createElement(BorderColorField, {
				value: '',
				onChange: jest.fn(),
				label: null,
				groups: GROUPS,
				...props,
			})
		);
	});
}

describe('BorderColorField', () => {
	/**
	 * A token pick reaches `onChange` as the entry's bracket alias, which is the shape this host
	 * already stores for a border color.
	 *
	 * @return {void}
	 */
	it('writes a picked token as its bracket alias', () => {
		const onChange = jest.fn();
		render({ onChange });

		act(() => {
			container.querySelector('.kb-color-control__item').click();
		});

		expect(onChange).toHaveBeenCalledWith('{semantic.color.accent.main}');
	});

	/**
	 * A Custom-tab color reaches the same `onChange` as a raw literal, never converted to an alias.
	 *
	 * @return {void}
	 */
	it('writes a custom color as a raw literal', () => {
		const onChange = jest.fn();
		render({ onChange });

		act(() => {
			container.querySelector('[data-testid="color-picker"]').click();
		});

		expect(onChange).toHaveBeenCalledWith('#abcdef');
	});

	/**
	 * Clear returns the side to unset. This is new surface rather than preserved surface — the
	 * widget this replaced passed `hideClear`, so a border color could not be unset at all.
	 *
	 * @return {void}
	 */
	it('clears the side back to unset', () => {
		const onChange = jest.fn();
		render({ onChange, value: '#171717' });

		act(() => {
			container.querySelector('.kb-color-control__clear').click();
		});

		expect(onChange).toHaveBeenCalledWith('');
	});

	/**
	 * An unlinked row names its own side so the four swatches, which carry no visible text, do not
	 * read as four copies of one field; the linked row takes the bare name.
	 *
	 * @return {void}
	 */
	it('names the row by its side, and generically while linked', () => {
		render({ label: 'top' });
		expect(container.querySelector('.kb-color-swatch-control__button').getAttribute('aria-label')).toBe(
			'Top Border Color'
		);

		render({ label: null });
		expect(container.querySelector('.kb-color-swatch-control__button').getAttribute('aria-label')).toBe(
			'Border Color'
		);
	});
});
