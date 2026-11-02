/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ColorPicker } from '../molecules/ColorPicker';

// `Checkboard` only paints the checkered backdrop behind a translucent color, through a canvas jsdom
// doesn't implement, so it is stood in for here. Everything the tests assert on stays real.
jest.mock('react-color/lib/components/common/Checkboard', () => ({
	__esModule: true,
	Checkboard: () => null,
	default: () => null,
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

/**
 * Render the picker.
 *
 * @param {Object} props The `ColorPicker` props.
 *
 * @since TBD
 *
 * @return {void}
 */
function render(props) {
	act(() => root.render(<ColorPicker {...props} />));
}

/**
 * The picker's fields in the order they show: hex, then R, G, B and A.
 *
 * @since TBD
 *
 * @return {HTMLInputElement[]} The field inputs.
 */
function fields() {
	return [...container.querySelectorAll('.kadence-blocks-style-library__color-picker-fields input')];
}

/**
 * Replace a field's text in one step, the way a paste does. The input's native setter is used so that
 * React, which tracks the value it last saw, only reports a change when the text really differs.
 *
 * @param {HTMLInputElement} input The field.
 * @param {string}           text  The text to enter.
 *
 * @since TBD
 *
 * @return {void}
 */
function enterAtOnce(input, text) {
	const setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

	act(() => {
		setValue.call(input, text);
		input.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

describe('ColorPicker', () => {
	it('shows blank fields while no color is set', () => {
		render({ color: '', onChange: jest.fn() });

		expect(fields().map((input) => input.value)).toEqual(['', '', '', '', '']);
	});

	it('reports black entered in one step into a picker with no color set', () => {
		const onChange = jest.fn();

		render({ color: '', onChange });
		enterAtOnce(fields()[0], '000000');

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('#000000');
	});

	it('shows the fields of a color that is set', () => {
		render({ color: '#336699', onChange: jest.fn() });

		expect(fields().map((input) => input.value)).toEqual(['336699', '51', '102', '153', '1']);
	});

	it('does not treat a missing color as no color set', () => {
		render({ color: undefined, onChange: jest.fn() });

		expect(fields()[0].value).not.toBe('');
	});
});
