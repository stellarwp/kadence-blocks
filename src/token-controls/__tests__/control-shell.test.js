/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ControlShell } from '../templates/ControlShell';
import { BindingIndicator } from '../atoms/BindingIndicator';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that; these tests only need to see which affordances render and
// whether they are disabled.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, icon, showTooltip, isSmall, ...props }) => <button {...props}>{children}</button>,
	ButtonGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
	Dashicon: (props) => <span {...props} />,
	Tooltip: ({ children }) => children,
}));

jest.mock('@wordpress/icons', () => ({ undo: 'undo', link: 'link', linkOff: 'linkOff' }));

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
 * Render a component into the test container.
 *
 * @param {Function} Component The component to render.
 * @param {Object}   props     Its props.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container it rendered into.
 */
function render(Component, props) {
	act(() => root.render(createElement(Component, props)));

	return container;
}

const resetButton = () => container.querySelector('.kb-token-control__indicator-reset');

describe('BindingIndicator reset button', () => {
	/**
	 * A disabled control must not still offer a working reset: every other affordance in the shell
	 * takes `disabled`, so leaving this one live lets the value change while the rest is inert.
	 *
	 * @return {void}
	 */
	it('is disabled when the control is disabled', () => {
		render(BindingIndicator, {
			status: { bound: true, modified: true },
			onReset: jest.fn(),
			disabled: true,
		});

		expect(resetButton().disabled).toBe(true);
	});

	/**
	 * With no reset handler there is nothing to invoke, so the button stays disabled on its own.
	 *
	 * @return {void}
	 */
	it('is disabled when no reset handler is supplied', () => {
		render(BindingIndicator, { status: { bound: true, modified: true }, onReset: null });

		expect(resetButton().disabled).toBe(true);
	});

	/**
	 * The enabled case, so the two guards above cannot pass by disabling it unconditionally.
	 *
	 * @return {void}
	 */
	it('is enabled when the control is active and a reset handler exists', () => {
		render(BindingIndicator, { status: { bound: true, modified: true }, onReset: jest.fn() });

		expect(resetButton().disabled).toBe(false);
	});
});

describe('ControlShell header', () => {
	/**
	 * `status` is an object, so a plain truthiness check treats `{ bound: false }` as something to
	 * show — but the indicator renders null for it, leaving an empty header and the gap the shell
	 * exists to avoid.
	 *
	 * @return {void}
	 */
	it('renders no header for an unbound status with nothing else to show', () => {
		render(ControlShell, { status: { bound: false }, children: 'field' });

		expect(container.querySelector('.kb-token-control__header')).toBeNull();
	});

	/**
	 * Same gap, reached the other way: a bound but unmodified status renders nothing once the reset
	 * affordance is switched off.
	 *
	 * @return {void}
	 */
	it('renders no header for a bound, unmodified status when showReset is off', () => {
		render(ControlShell, { status: { bound: true, modified: false }, showReset: false, children: 'field' });

		expect(container.querySelector('.kb-token-control__header')).toBeNull();
	});

	/**
	 * The header still appears when the indicator has something to say.
	 *
	 * @return {void}
	 */
	it('renders the header for a bound, modified status', () => {
		render(ControlShell, { status: { bound: true, modified: true }, onReset: jest.fn(), children: 'field' });

		expect(container.querySelector('.kb-token-control__header')).not.toBeNull();
	});

	/**
	 * A label alone is reason enough for a header, independent of the indicator.
	 *
	 * @return {void}
	 */
	it('renders the header for a label even with no status', () => {
		render(ControlShell, { label: 'Radius', children: 'field' });

		expect(container.querySelector('.kb-token-control__header')).not.toBeNull();
	});

	/**
	 * The shell's own indicator has to inherit the disabled state it passes to every other
	 * affordance.
	 *
	 * @return {void}
	 */
	it('forwards disabled to the indicator it renders', () => {
		render(ControlShell, {
			status: { bound: true, modified: true },
			onReset: jest.fn(),
			disabled: true,
			children: 'field',
		});

		expect(resetButton().disabled).toBe(true);
	});
});
