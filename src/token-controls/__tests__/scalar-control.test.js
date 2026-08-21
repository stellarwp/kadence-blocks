/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ScalarControl } from '../controls/ScalarControl';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that; these tests only need the chrome and the field's trigger.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, icon, showTooltip, isSmall, ...props }) => <button {...props}>{children}</button>,
	ButtonGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
	Dashicon: (props) => <span {...props} />,
	Dropdown: ({ renderToggle, renderContent }) => (
		<div>
			{renderToggle({ isOpen: true, onToggle: () => {} })}
			{renderContent({ onClose: () => {} })}
		</div>
	),
	Tooltip: ({ children }) => children,
}));

jest.mock('@wordpress/icons', () => ({ undo: 'undo', link: 'link', linkOff: 'linkOff' }));
jest.mock('../styles/token-controls.scss', () => ({}), { virtual: true });

// The popover is exercised by its own tests; here it stands in as a set of buttons so each of the
// field's three write intents can be fired without driving the real tab UI.
jest.mock('../molecules/TokenPopover', () => ({
	TokenPopover: ({ onPick, onClear, custom }) => (
		<div>
			<button className="test-pick" onClick={() => onPick('{primitive.dimension.icon-size.lg}')} />
			<button className="test-clear" onClick={() => onClear()} />
			<button className="test-custom" onClick={() => custom.onNumber('40')} />
		</div>
	),
}));

const TOKENS = [
	{
		id: 'primitive.dimension.icon-size.lg',
		alias: '{primitive.dimension.icon-size.lg}',
		label: 'LG',
		value: '2.25rem',
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
 * Render `ScalarControl` with the props it needs, overridable per test.
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
			createElement(ScalarControl, {
				value: '',
				onChange: jest.fn(),
				label: 'Icon Size',
				tokens: TOKENS,
				...props,
			})
		)
	);

	return container;
}

describe('ScalarControl chrome', () => {
	/**
	 * The control wears its label and exactly one token field — the whole point of a scalar control is
	 * that there are no slots to render.
	 */
	it('renders the label and a single token field', () => {
		renderControl();

		expect(container.querySelector('.kb-token-control__label').textContent).toBe('Icon Size');
		expect(container.querySelectorAll('.kadence-token-field')).toHaveLength(1);
	});

	/**
	 * A scalar has nothing to link, so the shell's link toggle must never appear — passing `onToggleLink`
	 * is the only thing that draws it, and this control passes none.
	 */
	it('never renders a linked/individual toggle', () => {
		renderControl();

		expect(container.querySelector('.kadence-control-toggle')).toBeNull();
	});

	/**
	 * The breakpoint switcher is opt-in on the shell, so a control given no `breakpoints` is
	 * non-responsive and shows none.
	 */
	it('renders the breakpoint switcher only when breakpoints are passed', () => {
		renderControl();
		expect(container.querySelector('.kb-measure-responsive-options')).toBeNull();

		renderControl({ breakpoints: ['desktop', 'tablet', 'mobile'], breakpoint: 'tablet' });
		expect(container.querySelectorAll('.kb-measure-responsive-options .kb-responsive-btn')).toHaveLength(3);
	});

	/**
	 * The switcher reports the breakpoint the user chose; the shell owns no breakpoint state of its own,
	 * so the host's handler is what moves the control.
	 */
	it('reports a breakpoint change to its handler', () => {
		const onBreakpointChange = jest.fn();

		renderControl({
			breakpoints: ['desktop', 'tablet', 'mobile'],
			breakpoint: 'desktop',
			onBreakpointChange,
		});

		act(() => container.querySelector('.kb-tablet-tab').dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onBreakpointChange).toHaveBeenCalledWith('tablet');
	});
});

describe('ScalarControl writes', () => {
	/**
	 * A pick writes the token's alias, never its resolved literal — the alias is what keeps the value
	 * following the token after the token's value changes.
	 */
	it('writes the picked token alias', () => {
		const onChange = jest.fn();

		renderControl({ onChange });
		act(() => container.querySelector('.test-pick').dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onChange).toHaveBeenCalledWith('{primitive.dimension.icon-size.lg}');
	});

	/**
	 * Clearing writes an empty string rather than deleting the value, so the host's attribute keeps its
	 * declared shape and falls back to its own default.
	 */
	it('writes an empty string on clear', () => {
		const onChange = jest.fn();

		renderControl({ onChange, value: '{primitive.dimension.icon-size.lg}' });
		act(() => container.querySelector('.test-clear').dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onChange).toHaveBeenCalledWith('');
	});

	/**
	 * A custom value writes a bare number, not a number-plus-unit string: the unit is the control's and
	 * lives in the host's own attribute, exactly as `BoxControl` treats it.
	 */
	it('writes a bare number for a custom value', () => {
		const onChange = jest.fn();

		renderControl({ onChange, unit: 'px' });
		act(() => container.querySelector('.test-custom').dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onChange).toHaveBeenCalledWith(40);
	});

	/**
	 * A read-only control drops every write. The field's trigger is disabled too, so in the real UI the
	 * popover cannot even open — these assertions cover the callbacks behind it.
	 */
	it('drops every write when disabled', () => {
		const onChange = jest.fn();

		renderControl({ onChange, disabled: true });
		act(() => container.querySelector('.test-pick').dispatchEvent(new MouseEvent('click', { bubbles: true })));
		act(() => container.querySelector('.test-clear').dispatchEvent(new MouseEvent('click', { bubbles: true })));

		expect(onChange).not.toHaveBeenCalled();
	});
});
