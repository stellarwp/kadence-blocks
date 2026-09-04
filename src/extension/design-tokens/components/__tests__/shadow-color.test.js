/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ShadowColorField } from '../shadow-color';

// Mirrors `border-color.test.js`'s stand-in: `@wordpress/components` resolves its own nested `react`
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

// Exposes the `color` the Custom tab was seeded with, and emits a translucent `#rrggbbaa` on click —
// the shape the real picker produces once its alpha slider leaves fully opaque.
jest.mock('../../../../token-controls/molecules/ColorPicker', () => ({
	ColorPicker: ({ color, onChange }) => (
		<button
			type="button"
			data-testid="color-picker"
			data-color={color ?? ''}
			onClick={() => onChange('#abcdef80')}
		/>
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
 * @since TBD
 *
 * @return {void}
 */
function render(props = {}) {
	act(() => {
		root.render(
			createElement(ShadowColorField, {
				value: '',
				onChange: jest.fn(),
				groups: GROUPS,
				...props,
			})
		);
	});
}

describe('ShadowColorField', () => {
	/**
	 * The trigger is the full `ColorControl` row with a visible "Color" label, not the bare swatch the
	 * border field renders — the shadow popover has a whole row to give it.
	 *
	 * @return {void}
	 */
	it('renders a visible "Color" label on the trigger row', () => {
		render();

		expect(container.querySelector('.kb-color-control__label').textContent).toBe('Color');
		expect(container.querySelector('.kb-color-swatch-control')).toBeNull();
	});

	/**
	 * A token pick reaches `onChange` as the entry's bracket alias — the shape the shadow item's
	 * `color` stores, and the one the alias-aware renderers resolve.
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
	 * A bound alias names itself on the trigger, so the row reads as the token rather than as an
	 * anonymous swatch.
	 *
	 * @return {void}
	 */
	it("shows the picked token's label on the trigger", () => {
		render({ value: '{semantic.color.accent.main}' });

		expect(container.querySelector('.kb-color-control__value').textContent).toBe('Main');
	});

	/**
	 * A Custom-tab pick reaches `onChange` as the picker's own `#rrggbbaa` literal, alpha included —
	 * there is no separate opacity channel to write any more.
	 *
	 * @return {void}
	 */
	it('writes a custom color as the raw literal, alpha included', () => {
		const onChange = jest.fn();
		render({ onChange });

		act(() => {
			container.querySelector('[data-testid="color-picker"]').click();
		});

		expect(onChange).toHaveBeenCalledWith('#abcdef80');
	});

	/**
	 * A shadow saved by the previous control arrives as the `rgba(...)` string `fromNativeShadow()`
	 * folds its color and opacity into; the Custom tab must seed from that literal, and the trigger
	 * swatch must paint it, rather than either treating it as unset.
	 *
	 * @return {void}
	 */
	it('seeds the Custom tab and the swatch from an existing rgba(...) value', () => {
		render({ value: 'rgba(17, 17, 17, 0.4)' });

		expect(container.querySelector('[data-testid="color-picker"]').dataset.color).toBe('rgba(17, 17, 17, 0.4)');
		expect(container.querySelector('.kb-color-control__trigger .kb-color-swatch').style.background).toContain(
			'17, 17, 17'
		);
	});

	/**
	 * A shadow always has a color, so the popover offers no Clear row — clearing would leave geometry
	 * with no color, which renders as an opaque black shadow rather than none.
	 *
	 * @return {void}
	 */
	it('offers no Clear row', () => {
		render({ value: '#171717' });

		expect(container.querySelector('.kb-color-control__clear')).toBeNull();
	});

	/**
	 * `BoxShadowControl` passes its own `disabled` through the render prop; the trigger honors it.
	 *
	 * @return {void}
	 */
	it('disables the trigger when the shadow control is read-only', () => {
		render({ disabled: true });

		expect(container.querySelector('.kb-color-control__trigger-button').disabled).toBe(true);
	});
});
