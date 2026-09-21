/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { AddLink } from '../components/atoms/AddLink';

// `@wordpress/icons` nests its own `react` copy; the glyph is only passed through as a prop here.
jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	plus: 'plus',
}));

describe('AddLink', () => {
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
	 * The link shows its label and reports a click.
	 *
	 * @return {void}
	 */
	it('renders the label and calls onClick', () => {
		const onClick = jest.fn();

		act(() => root.render(<AddLink label="Add color" onClick={onClick} />));

		const button = container.querySelector('button.kadence-blocks-style-library__add-link');

		expect(button.getAttribute('type')).toBe('button');
		expect(button.textContent).toBe('Add color');

		act(() => button.click());

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	/**
	 * A disabled link is disabled for the browser and for assistive tech, and ignores clicks.
	 *
	 * @return {void}
	 */
	it('is disabled and aria-disabled when disabled', () => {
		const onClick = jest.fn();

		act(() => root.render(<AddLink label="Add color" onClick={onClick} disabled />));

		const button = container.querySelector('button');

		expect(button.disabled).toBe(true);
		expect(button.getAttribute('aria-disabled')).toBe('true');

		act(() => button.click());

		expect(onClick).not.toHaveBeenCalled();
	});
});
