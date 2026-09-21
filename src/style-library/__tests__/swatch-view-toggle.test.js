/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { SwatchViewToggle } from '../components/molecules/SwatchViewToggle';

describe('SwatchViewToggle', () => {
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
	 * Render the toggle.
	 *
	 * @param {string}   value    The current mode.
	 * @param {Function} onChange The change spy.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderToggle(value, onChange = () => {}) {
		act(() => root.render(<SwatchViewToggle value={value} onChange={onChange} />));
	}

	/**
	 * The two buttons sit in one labeled group.
	 *
	 * @return {void}
	 */
	it('renders a group labeled Swatch view with two buttons', () => {
		renderToggle('grid');

		const group = container.querySelector('[role="group"]');

		expect(group.getAttribute('aria-label')).toBe('Swatch view');
		expect(group.querySelectorAll('button[type="button"]')).toHaveLength(2);
	});

	/**
	 * Exactly the button matching the value is pressed.
	 *
	 * @return {void}
	 */
	it('marks only the button for the current value as pressed', () => {
		renderToggle('list');

		const [grid, list] = container.querySelectorAll('button');

		expect(grid.getAttribute('aria-pressed')).toBe('false');
		expect(list.getAttribute('aria-pressed')).toBe('true');

		renderToggle('grid');

		expect(grid.getAttribute('aria-pressed')).toBe('true');
		expect(list.getAttribute('aria-pressed')).toBe('false');
	});

	/**
	 * Each button reports its own mode.
	 *
	 * @return {void}
	 */
	it('calls onChange with the clicked mode', () => {
		const onChange = jest.fn();

		renderToggle('grid', onChange);

		const [grid, list] = container.querySelectorAll('button');

		act(() => list.click());
		act(() => grid.click());

		expect(onChange).toHaveBeenNthCalledWith(1, 'list');
		expect(onChange).toHaveBeenNthCalledWith(2, 'grid');
	});

	/**
	 * The icons are decoration; the buttons carry the accessible names.
	 *
	 * @return {void}
	 */
	it('hides the icons and names the buttons', () => {
		renderToggle('grid');

		const buttons = container.querySelectorAll('button');

		expect(buttons[0].getAttribute('aria-label')).toBe('Grid view');
		expect(buttons[1].getAttribute('aria-label')).toBe('List view');
		container.querySelectorAll('svg').forEach((svg) => expect(svg.getAttribute('aria-hidden')).toBe('true'));
	});
});
