/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ColorPicker } from '../molecules/ColorPicker';

jest.mock('@wordpress/icons', () => ({ Icon: () => null, chevronDown: 'chevronDown', chevronUp: 'chevronUp' }));
jest.mock('@wordpress/i18n', () => ({ __: (text) => text }));
jest.mock('../molecules/ColorPicker.scss', () => ({}), { virtual: true });

// jsdom has no canvas, which the checkerboard behind the swatch draws with.
jest.mock('react-color/lib/components/common/Checkboard', () => ({
	__esModule: true,
	default: () => null,
	Checkboard: () => null,
}));

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

function hexInput() {
	return container.querySelector('.kadence-blocks-style-library__color-picker-field--hex input');
}

function type(input, value) {
	const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
	act(() => {
		setter.call(input, value);
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

describe('ColorPicker hex field', () => {
	it('is blank when there is no color', () => {
		act(() => root.render(createElement(ColorPicker, { color: '', onChange: () => {} })));

		expect(hexInput().value).toBe('');
	});

	it('is blank when the color is undefined', () => {
		act(() => root.render(createElement(ColorPicker, { onChange: () => {} })));

		expect(hexInput().value).toBe('');
	});

	it('saves black typed into an empty picker', () => {
		const onChange = jest.fn();
		act(() => root.render(createElement(ColorPicker, { color: '', onChange })));

		type(hexInput(), '000000');

		expect(onChange).toHaveBeenLastCalledWith('#000000');
	});

	it('shows the hex of a set color', () => {
		act(() => root.render(createElement(ColorPicker, { color: '#ff0080', onChange: () => {} })));

		expect(hexInput().value).toBe('FF0080');
	});
});
