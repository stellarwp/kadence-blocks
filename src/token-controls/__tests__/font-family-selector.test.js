/* eslint-env jest */
// cspell:ignore Abril Fatface .
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { FontFamilySelector } from '../organisms/FontFamilySelector';

// Same stand-ins as `token-selector.test.js`, for the same reason its docblock gives: `jest.config.js`
// maps `@wordpress/components` to the copy nested under `@kadence/components/node_modules`, which
// resolves its own `react` — a different module instance than the top-level `react-dom/client` this
// test renders with, which trips React's "Invalid hook call" guard.
// Unlike the sibling stub in `token-selector.test.js`, this one renders the popover too: the tab
// these tests assert on is decided by the field and passed down, so it is only observable once
// `renderContent` runs.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, showTooltip, ...props }) => <button {...props}>{children}</button>,
	Dropdown: ({ renderToggle, renderContent }) => (
		<>
			{renderToggle({ isOpen: true, onToggle: () => {} })}
			{renderContent({ onClose: () => {} })}
		</>
	),
	Tooltip: ({ children }) => children,
}));

// The popover is captured rather than rendered: these tests assert which tab the field ASKS for, and
// mounting the real TabPanel would test `@wordpress/components` instead.
let popoverProps = null;

jest.mock('../molecules/FontFamilyPopover', () => ({
	FontFamilyPopover: (props) => {
		popoverProps = props;
		return null;
	},
}));

jest.mock('../styles/token-controls.scss', () => ({}), { virtual: true });

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
	popoverProps = null;
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Render `FontFamilySelector` with the props it needs to draw its trigger.
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
			createElement(FontFamilySelector, {
				value: '',
				favorites: [],
				catalogOptions: [],
				onPick: jest.fn(),
				onClear: jest.fn(),
				...props,
			})
		)
	);

	return container.querySelector('.kadence-token-field__trigger');
}

describe('FontFamilySelector trigger', () => {
	/**
	 * A set family names itself on the trigger, and is previewed in its own face so the field reads
	 * as the font it selects rather than only saying so.
	 *
	 * @return {void}
	 */
	it('shows the family, rendered in that family', () => {
		const trigger = renderSelector({ value: 'Abril Fatface' });
		const value = trigger.querySelector('.kadence-token-field__value');

		expect(value.textContent).toBe('Abril Fatface');
		expect(value.style.fontFamily).toBe('Abril Fatface');
	});

	/**
	 * An unset family shows what it falls back to, muted — a block with no family set still renders
	 * in some face, and naming it keeps "what this block sets" and "what it inherits" apart.
	 *
	 * @return {void}
	 */
	it('shows the inherited label, muted, when unset', () => {
		const trigger = renderSelector({ value: '', inheritedLabel: 'Inter' });
		const value = trigger.querySelector('.kadence-token-field__value');

		expect(value.textContent).toBe('Inter');
		expect(value.className).toContain('kadence-token-field__label--default');
	});

	/**
	 * With nothing inherited to name either, the field still says something rather than rendering an
	 * empty trigger.
	 *
	 * @return {void}
	 */
	it('falls back to a generic label when nothing is inherited', () => {
		const trigger = renderSelector({ value: '' });

		expect(trigger.querySelector('.kadence-token-field__value').textContent).toBe('Theme default');
	});

	/**
	 * A read-only control has to look and behave read-only. The trigger is the only control outside
	 * the popover, so guarding only the write callbacks would leave it clickable and drop picks
	 * silently.
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

describe('FontFamilySelector initial tab', () => {
	/**
	 * An unset field opens on the curated list — the same nudge `TokenSelector` makes toward picking
	 * from what the site chose rather than hand-searching a ~1,900-name catalog.
	 *
	 * @return {void}
	 */
	it('opens on Favorites when nothing is set', () => {
		renderSelector({ value: '', favorites: ['Inter'] });

		expect(popoverProps.initialTab).toBe('favorites');
	});

	/**
	 * A family the site favorited opens on the short list that contains it.
	 *
	 * @return {void}
	 */
	it('opens on Favorites when the family is one', () => {
		renderSelector({ value: 'Inter', favorites: ['Inter'] });

		expect(popoverProps.initialTab).toBe('favorites');
	});

	/**
	 * Anything else opens on the catalog — the tab it was picked from, and the only one that can show
	 * it in context.
	 *
	 * @return {void}
	 */
	it('opens on Custom when the family is not a favorite', () => {
		renderSelector({ value: 'Abril Fatface', favorites: ['Inter'] });

		expect(popoverProps.initialTab).toBe('custom');
	});
});
