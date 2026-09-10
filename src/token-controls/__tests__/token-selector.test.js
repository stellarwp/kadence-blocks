/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { TokenSelector } from '../organisms/TokenSelector';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that; this test only needs the trigger button.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, showTooltip, ...props }) => <button {...props}>{children}</button>,
	Dropdown: ({ renderToggle }) => renderToggle({ isOpen: false, onToggle: () => {} }),
	Tooltip: ({ children }) => children,
}));

jest.mock('../molecules/TokenPopover', () => ({ TokenPopover: () => null }));
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

/**
 * Render `TokenSelector` with the props it needs to draw its trigger.
 *
 * @param {Object} props Overrides for the defaults below.
 *
 * @since TBD
 *
 * @return {HTMLElement} The trigger button.
 */
function renderSelector(props = {}) {
	act(() =>
		root.render(
			createElement(TokenSelector, {
				value: '',
				tokens: [],
				onPick: jest.fn(),
				onClear: jest.fn(),
				onCustom: jest.fn(),
				...props,
			})
		)
	);

	return container.querySelector('.kadence-token-field__trigger');
}

describe('TokenSelector disabled state', () => {
	/**
	 * A read-only control has to look and behave read-only. Guarding only the write callbacks leaves
	 * the trigger clickable, so the popover opens and picks are silently dropped.
	 *
	 * @return {void}
	 */
	it('disables the trigger when disabled', () => {
		expect(renderSelector({ disabled: true }).disabled).toBe(true);
	});

	/**
	 * The enabled case, so the assertion above cannot pass by disabling unconditionally.
	 *
	 * @return {void}
	 */
	it('leaves the trigger active by default', () => {
		expect(renderSelector().disabled).toBe(false);
	});
});

describe('TokenSelector fixed-entry round trip', () => {
	// Margin's `Auto` choice (`kadence/singlebtn`'s `edit.js`) is a real spacing slot at the PHP/CSS
	// layer that was never registered as a DTCG token, so it has no bracket-form alias. Its pickable
	// entry is marked `fixed: true` instead, and this proves the trigger reads that entry back as the
	// picked token rather than falling through to a `Custom` literal with the unit concatenated on.
	const AUTO_TOKENS = [{ id: 'ss-auto', label: 'Auto', value: 'auto', alias: 'ss-auto', fixed: true }];

	/**
	 * Selecting Auto stores the bare `ss-auto` slug; the trigger must show it as the picked `Auto`
	 * token, never as `Custom` with the unit concatenated onto it.
	 *
	 * @return {void}
	 */
	it('shows a fixed entry as its label, not as a Custom literal with the unit appended', () => {
		const trigger = renderSelector({ value: 'ss-auto', tokens: AUTO_TOKENS, unit: 'px' });

		expect(trigger.textContent).toBe('Autoauto');
		expect(trigger.textContent).not.toContain('ss-auto');
		expect(trigger.textContent).not.toContain('Custom');
	});
});
