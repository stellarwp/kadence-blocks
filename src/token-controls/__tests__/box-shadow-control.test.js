/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { BoxShadowControl } from '../controls/BoxShadowControl';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that. `Dropdown` always renders both its toggle and its content so
// the popover's tabs are reachable without simulating a real popover open, and `TabPanel` keeps its
// own active-tab state so a test can click between `Style Library` and `Custom`.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isPressed, showTooltip, ...props }) => <button {...props}>{children}</button>,
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
	Dropdown: ({ renderToggle, renderContent }) => (
		<>
			{renderToggle({ isOpen: true, onToggle: () => {} })}
			{renderContent({ onClose: () => {} })}
		</>
	),
	TabPanel: ({ children, tabs, initialTabName }) => {
		const { useState: mockUseState } = require('react');
		const [active, setActive] = mockUseState(tabs.find((tab) => tab.name === initialTabName) || tabs[0]);
		return (
			<div data-testid="tab-panel">
				<div data-testid="tab-buttons">
					{tabs.map((tab) => (
						<button key={tab.name} data-testid={`tab-${tab.name}`} onClick={() => setActive(tab)}>
							{tab.title}
						</button>
					))}
				</div>
				{children(active)}
			</div>
		);
	},
	__experimentalNumberControl: ({ label, value, onChange }) => (
		<label>
			{label}
			<input aria-label={label} type="number" value={value} onChange={(event) => onChange(event.target.value)} />
		</label>
	),
	ToggleControl: ({ label, checked, onChange }) => (
		<label>
			<input
				aria-label={label}
				type="checkbox"
				checked={checked}
				onChange={(event) => onChange(event.target.checked)}
			/>
			{label}
		</label>
	),
}));

jest.mock('@wordpress/icons', () => ({ globe: 'globe', settings: 'settings', undo: 'undo' }));
jest.mock('@wordpress/i18n', () => ({
	__: (text) => text,
	sprintf: (format, ...args) => format.replace(/%s/g, () => args.shift()),
}));

jest.mock('../styles/token-controls.scss', () => ({}), { virtual: true });

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

const TOKENS = [
	{ id: 'md', label: 'Medium', value: '0px 2px 8px 0px #1717171f', alias: '{primitive.shadow.md}' },
	{ id: 'lg', label: 'Large', value: '0px 4px 16px 0px #1717172f', alias: '{primitive.shadow.lg}' },
];

/**
 * Render `BoxShadowControl` with the props it needs, plus overrides.
 *
 * @param {Object} props Overrides for the defaults below.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container it rendered into.
 */
function renderControl(props = {}) {
	act(() =>
		root.render(
			createElement(BoxShadowControl, {
				value: '',
				onChange: jest.fn(),
				label: 'Shadow',
				tokens: TOKENS,
				...props,
			})
		)
	);

	return container;
}

const trigger = () => container.querySelector('.kadence-token-field__trigger');
const resetButton = () => container.querySelector('.kadence-token-field__reset');
const tokenItem = (label) =>
	Array.from(container.querySelectorAll('.kadence-token-field__item')).find((el) => el.textContent.includes(label));
const numberInput = (label) => container.querySelector(`input[aria-label="${label}"][type="number"]`);
const insetCheckbox = () => container.querySelector('input[aria-label="Inset"]');

/**
 * Click a rendered DOM element inside `act`, so React flushes the resulting state/prop updates
 * before the next assertion reads them.
 *
 * @param {HTMLElement} element The element to click.
 *
 * @since TBD
 *
 * @return {void}
 */
function click(element) {
	act(() => element.click());
}

/**
 * Change a text/number input inside `act`.
 *
 * @param {HTMLElement} element The input element.
 * @param {string}      value   The next value.
 *
 * @since TBD
 *
 * @return {void}
 */
function change(element, value) {
	act(() => {
		const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
		setter.call(element, value);
		element.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

describe('BoxShadowControl trigger', () => {
	/**
	 * The trigger shows the bound token's label when the value is that token's alias.
	 *
	 * @return {void}
	 */
	it('shows the token label when value is a token alias', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(trigger().textContent).toBe('Medium');
	});

	/**
	 * The trigger reads "Custom" when the value is a composite shadow object.
	 *
	 * @return {void}
	 */
	it('shows "Custom" when value is a composite object', () => {
		renderControl({ value: { color: '#000000', offsetX: '2px', offsetY: '2px', blur: '4px', spread: '0px' } });

		expect(trigger().textContent).toBe('Custom');
	});
});

describe('BoxShadowControl initial tab', () => {
	/**
	 * An aliased value opens the popover on the Style Library tab, so the token list is reachable
	 * without switching tabs.
	 *
	 * @return {void}
	 */
	it('opens on the Style Library tab for an aliased value', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(tokenItem('Medium')).not.toBeUndefined();
	});

	/**
	 * A composite value opens the popover on the Custom tab, so the axis fields are reachable
	 * without switching tabs.
	 *
	 * @return {void}
	 */
	it('opens on the Custom tab for a composite value', () => {
		renderControl({ value: { color: '#000000', offsetX: '2px', offsetY: '2px', blur: '4px', spread: '0px' } });

		expect(numberInput('X')).not.toBeNull();
	});
});

describe('BoxShadowControl Style Library tab', () => {
	/**
	 * Picking a token calls onChange with that token's alias.
	 *
	 * @return {void}
	 */
	it('calls onChange with the picked token alias', () => {
		const onChange = jest.fn();
		renderControl({ value: '{primitive.shadow.md}', onChange });

		click(tokenItem('Large'));

		expect(onChange).toHaveBeenCalledWith('{primitive.shadow.lg}');
	});

	/**
	 * Reset clears an aliased value back to empty.
	 *
	 * @return {void}
	 */
	it('calls onChange with an empty string when Reset is clicked', () => {
		const onChange = jest.fn();
		renderControl({ value: '{primitive.shadow.md}', onChange });

		click(resetButton());

		expect(onChange).toHaveBeenCalledWith('');
	});
});

describe('BoxShadowControl Custom tab', () => {
	/**
	 * Editing an axis writes the full composite object with only that axis changed, serialized as a
	 * px dimension string, and the rest of the value preserved.
	 *
	 * @return {void}
	 */
	it('calls onChange with the full composite object when an axis changes', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '2px', offsetY: '4px', blur: '8px', spread: '0px' },
			onChange,
		});

		change(numberInput('Blur'), '12');

		expect(onChange).toHaveBeenCalledWith({
			color: '#111111',
			offsetX: '2px',
			offsetY: '4px',
			blur: '12px',
			spread: '0px',
		});
	});

	/**
	 * Turning Inset on writes the composite object with `inset: true`.
	 *
	 * @return {void}
	 */
	it('calls onChange with inset true when the Inset toggle is switched on', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			onChange,
		});

		click(insetCheckbox());

		expect(onChange).toHaveBeenCalledWith({
			color: '#111111',
			offsetX: '0px',
			offsetY: '0px',
			blur: '0px',
			spread: '0px',
			inset: true,
		});
	});

	/**
	 * Turning Inset back off writes the composite object with the `inset` key absent entirely,
	 * matching `helpers/shadow.js`'s existing convention rather than writing `inset: false`.
	 *
	 * @return {void}
	 */
	it('calls onChange with the inset key absent when the Inset toggle is switched back off', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px', inset: true },
			onChange,
		});

		click(insetCheckbox());

		const next = onChange.mock.calls[0][0];
		expect(next).not.toHaveProperty('inset');
		expect(next).toEqual({ color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' });
	});

	/**
	 * `renderColor` is invoked with the shadow's current color and an onChange that patches only the
	 * color field, leaving every other sub-field untouched.
	 *
	 * @return {void}
	 */
	it('invokes renderColor with the color value and patches only color on change', () => {
		const onChange = jest.fn();
		let received;
		const renderColor = ({ value, onChange: patch }) => {
			received = { value, patch };
			return <div data-testid="color-slot" />;
		};

		renderControl({
			value: { color: '#111111', offsetX: '2px', offsetY: '4px', blur: '8px', spread: '0px' },
			onChange,
			renderColor,
		});

		expect(received.value).toBe('#111111');
		expect(container.querySelector('[data-testid="color-slot"]')).not.toBeNull();

		act(() => received.patch('#ffffff'));

		expect(onChange).toHaveBeenCalledWith({
			color: '#ffffff',
			offsetX: '2px',
			offsetY: '4px',
			blur: '8px',
			spread: '0px',
		});
	});
});

describe('BoxShadowControl disabled state', () => {
	/**
	 * A disabled control's trigger cannot be interacted with.
	 *
	 * @return {void}
	 */
	it('disables the trigger', () => {
		renderControl({ disabled: true });

		expect(trigger().disabled).toBe(true);
	});

	/**
	 * `BoxShadowControl` guards each write path (`onPick`, `onClear`) separately rather than relying
	 * on the trigger's `disabled` attribute alone — a real popover would still be reachable through
	 * assistive tech or a stray click on an already-open panel, so the guards inside `TokenPopover`
	 * are what actually stop a write while disabled. This exercises the Style Library tab's pick and
	 * reset paths directly and confirms neither fires `onChange`, matching `BorderControl`'s sibling
	 * "disables every field and fires no onChange from a disabled sub-field" coverage.
	 *
	 * @return {void}
	 */
	it('fires no onChange from a pick or reset in the Style Library tab while disabled', () => {
		const onChange = jest.fn();
		renderControl({ value: '{primitive.shadow.md}', onChange, disabled: true });

		click(tokenItem('Large'));
		click(resetButton());

		expect(onChange).not.toHaveBeenCalled();
	});

	/**
	 * Same guard, exercised on the Custom tab's axis-edit and inset-toggle paths — the third of the
	 * three `!disabled &&` guards this control relies on.
	 *
	 * @return {void}
	 */
	it('fires no onChange from an axis edit or the Inset toggle in the Custom tab while disabled', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			onChange,
			disabled: true,
		});

		change(numberInput('Blur'), '12');
		click(insetCheckbox());

		expect(onChange).not.toHaveBeenCalled();
	});
});
