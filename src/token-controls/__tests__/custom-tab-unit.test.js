/* eslint-env jest */
/**
 * The Custom tab shows a unit that every device shares as a disabled select with an explanation on the
 * devices that cannot change it, and renders as before when the unit is not shared.
 *
 * @since TBD
 */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { CustomTab } from '../molecules/TokenPopover';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that; this test only needs the tab panel structure.
jest.mock('@wordpress/components', () => ({
	// `isPressed` is dropped rather than spread: it is a `Button`-only prop, and passing it straight
	// through to a DOM `<button>` trips React's "unrecognized DOM attribute" warning under
	// `@wordpress/jest-console`'s strict console assertions.
	Button: ({ children, isPressed, ...props }) => <button {...props}>{children}</button>,
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
	RangeControl: ({ label }) => <div>{label}</div>,
	SelectControl: ({ label, value, disabled }) => (
		<select aria-label={label} value={value} disabled={disabled} onChange={() => {}}>
			<option value={value}>{value}</option>
		</select>
	),
	Tooltip: ({ text, children }) => <div data-tooltip={text}>{children}</div>,
	TabPanel: ({ children, tabs, initialTabName }) => {
		const initialTab = tabs.find((tab) => tab.name === initialTabName) || tabs[0];
		return <div data-testid="tab-panel">{children(initialTab)}</div>;
	},
	__experimentalNumberControl: ({ label }) => <div>{label}</div>,
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

/**
 * Renders the Custom tab body.
 *
 * @param {Object} props The tab props.
 *
 * @return {void}
 */
function renderTab(props) {
	act(() => {
		root.render(
			<CustomTab
				number="2"
				unit="rem"
				units={['px', 'em', 'rem']}
				onUnit={() => {}}
				onNumber={() => {}}
				{...props}
			/>
		);
	});
}

describe('CustomTab unit', () => {
	/**
	 * A unit that serves every device is selectable where it is owned, with a note saying so.
	 *
	 * @return {void}
	 */
	it('notes that a shared unit applies to every device', () => {
		renderTab({ unitShared: true });

		expect(container.querySelector('.kadence-token-field__unit-note').textContent).toBe(
			'The unit applies to every device.'
		);
		expect(container.querySelector('.kadence-token-field__unit--pinned')).toBeNull();
	});

	/**
	 * Where the unit cannot be changed it shows as a disabled select with a tooltip, and the note names where to change it.
	 *
	 * @return {void}
	 */
	it('shows a pinned unit as a disabled select with an explanation', () => {
		renderTab({ unitShared: true, unitPinned: true, units: ['rem'] });

		const pinned = container.querySelector('.kadence-token-field__unit--pinned select');
		const message = 'The unit is set on Desktop and applies to every device. Switch to Desktop to change it.';

		expect(pinned.disabled).toBe(true);
		expect(pinned.value).toBe('rem');
		expect(container.querySelector('[data-tooltip]').getAttribute('data-tooltip')).toBe(message);
		expect(container.querySelector('.kadence-token-field__unit-note').textContent).toBe(message);
	});

	/**
	 * A field whose unit is not shared renders exactly as before, with no note.
	 *
	 * @return {void}
	 */
	it('adds nothing for a unit that is not shared', () => {
		renderTab({});

		expect(container.querySelector('.kadence-token-field__unit-note')).toBeNull();
		expect(container.querySelector('.kadence-token-field__unit--pinned')).toBeNull();
	});
});
