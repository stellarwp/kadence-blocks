/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

// Stand-ins, not the real controls: this suite is only after the numeric axes, and the real
// `Dropdown`/`ColorPicker` pull in a popover tree that has nothing to do with the blur floor.
jest.mock('@wordpress/components', () => ({
	__experimentalNumberControl: ({ value, onChange, disabled, min }) => (
		<input
			type="number"
			value={value}
			min={min}
			disabled={disabled}
			onChange={(event) => onChange(event.target.value)}
		/>
	),
	ColorIndicator: () => null,
	ColorPicker: () => null,
	Dropdown: ({ renderToggle }) => renderToggle({ isOpen: false, onToggle: () => {} }),
	ToggleControl: ({ label }) => <div>{label}</div>,
}));

jest.mock('@wordpress/i18n', () => ({ __: (text) => text }));
jest.mock('../components/molecules/fields/ShadowField.scss', () => ({}), { virtual: true });

// eslint-disable-next-line import/first -- must follow the jest.mock calls above.
import { ShadowField } from '../components/molecules/fields/ShadowField';

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
 * Mount the field and return its four numeric inputs, in X / Y / Blur / Spread order.
 *
 * @param {Function} onChange The change handler to pass through.
 *
 * @since TBD
 *
 * @return {Array<HTMLElement>} The rendered number inputs.
 */
function renderField(onChange = jest.fn()) {
	act(() => {
		root.render(
			createElement(ShadowField, {
				field: { label: 'Shadow' },
				value: { color: '#000000', offsetX: 0, offsetY: 2, blur: 8, spread: 0, inset: false },
				onChange,
			})
		);
	});

	return [...container.querySelectorAll('input[type="number"]')];
}

/**
 * Type a value into one of the numeric inputs, the way a user replacing its contents would.
 *
 * @param {HTMLElement} input The input to type into.
 * @param {string}      next  The value to type.
 *
 * @since TBD
 *
 * @return {void}
 */
function typeInto(input, next) {
	act(() => {
		Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, next);
		input.dispatchEvent(new Event('change', { bubbles: true }));
	});
}

describe('ShadowField blur floor', () => {
	/**
	 * Blur is floored at zero and the other three axes stay unbounded: CSS rejects a negative blur
	 * radius, and one invalid component makes the browser drop the whole `box-shadow`.
	 *
	 * @return {void}
	 */
	it('floors only the blur input at zero', () => {
		const [x, y, blur, spread] = renderField();

		expect(blur.getAttribute('min')).toBe('0');
		expect(x.getAttribute('min')).toBeNull();
		expect(y.getAttribute('min')).toBeNull();
		expect(spread.getAttribute('min')).toBeNull();
	});

	/**
	 * A negative blur typed past the input's own `min` is still held at zero on the way to the stored
	 * value, so the screen can never write a shadow that CSS discards.
	 *
	 * @return {void}
	 */
	it('clamps a typed negative blur to zero', () => {
		const onChange = jest.fn();
		const [, , blur] = renderField(onChange);

		typeInto(blur, '-9');

		expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ blur: 0 }));
	});

	/**
	 * The floor covers the whole shadow, not just the blur input: a negative blur already in the value
	 * is held at zero by a write to any other field.
	 *
	 * @return {void}
	 */
	it('floors a negative blur already in the value when another field is edited', () => {
		const onChange = jest.fn();
		act(() => {
			root.render(
				createElement(ShadowField, {
					field: { label: 'Shadow' },
					value: { color: '#000000', offsetX: 0, offsetY: 2, blur: -6, spread: 0, inset: false },
					onChange,
				})
			);
		});

		typeInto([...container.querySelectorAll('input[type="number"]')][0], '5');

		expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ offsetX: 5, blur: 0 }));
	});

	/**
	 * A negative spread is valid CSS — it shrinks the shadow — so it is stored unchanged.
	 *
	 * @return {void}
	 */
	it('stores a negative spread unchanged', () => {
		const onChange = jest.fn();
		const [, , , spread] = renderField(onChange);

		typeInto(spread, '-4');

		expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ spread: -4 }));
	});
});
