/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { FontCatalogTab } from '../molecules/FontFamilyPopover';

// Same stand-ins as `font-family-selector.test.js`, for the same reason: the nested
// `@wordpress/components` copy resolves its own `react`, which trips the hook guard.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isPressed, ...props }) => <button {...props}>{children}</button>,
	Icon: () => null,
	TabPanel: ({ children }) => children({ name: 'custom' }),
	TextControl: ({ value, onChange }) => <input value={value} onChange={(e) => onChange(e.target.value)} />,
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
 * Render the catalog tab.
 *
 * @param {Object} props Overrides.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container.
 */
function renderTab(props = {}) {
	act(() =>
		root.render(
			createElement(FontCatalogTab, {
				value: '',
				options: [{ value: 'Inter', label: 'Inter' }],
				onPick: jest.fn(),
				onClear: jest.fn(),
				onClose: jest.fn(),
				...props,
			})
		)
	);

	return container;
}

describe('FontCatalogTab stale note', () => {
	/**
	 * No row is pressed for a stale theme reference, so the list explains why above the rows.
	 *
	 * @return {void}
	 */
	it('shows the explanation when stale', () => {
		const el = renderTab({ value: 'var( --global-heading-font-family, inherit )', stale: true });

		expect(el.querySelector('.kadence-token-field__stale-note').textContent).toContain('no longer active');
	});

	/**
	 * A normal value renders the list with no note.
	 *
	 * @return {void}
	 */
	it('renders no note otherwise', () => {
		const el = renderTab({ value: 'Inter' });

		expect(el.querySelector('.kadence-token-field__stale-note')).toBeNull();
	});
});
