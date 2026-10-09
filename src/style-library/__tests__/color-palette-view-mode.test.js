/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ColorPaletteScreen } from '../components/pages/ColorPaletteScreen';
import { usePalettes } from '../hooks/use-palettes';

// A factory, not bare automocking — `use-palettes.js` pulls in `../api/client`, which imports
// `@wordpress/api-fetch` (externalized to the `wp.apiFetch` global in production, not an installed
// npm dependency), so automocking would fail to resolve it. This screen only reads the hook's
// return value.
jest.mock('../hooks/use-palettes', () => ({
	usePalettes: jest.fn(),
}));

// Same cross-module-copy rationale as `preset-screen.test.js`: `@wordpress/components`' own nested
// `react`/`react-dom` copy trips React's "Invalid hook call" guard under the top-level renderer
// this test uses. Stand-ins are enough — this test reads pill text and clicks one button. The
// screen mounts more than `ColorPaletteSettings`-style tests do (`ScreenHeader`, `SelectDropdown`,
// `ActivatePaletteButton`, and the create/rename/delete/add-group modals all live under it), so this
// list covers every export those organisms reach for, not only the ones the screen itself imports.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isBusy, isDestructive, variant, icon, ...props }) => <button {...props}>{children}</button>,
	Notice: ({ children, isDismissible, onRemove, status, ...props }) => <div {...props}>{children}</div>,
	DropdownMenu: () => null,
	MenuGroup: ({ children }) => <div>{children}</div>,
	MenuItem: ({ children, ...props }) => <button {...props}>{children}</button>,
	// Never opened by these tests, so only the toggle needs to render.
	Dropdown: ({ renderToggle }) => renderToggle({ isOpen: false, onToggle: () => {} }),
	Spinner: () => <span className="components-spinner" />,
	ExternalLink: ({ children, ...props }) => <a {...props}>{children}</a>,
	Tooltip: ({ children }) => children,
	Modal: ({ children, title, onRequestClose }) => (
		<div role="dialog" aria-label={title}>
			{children}
		</div>
	),
	TextControl: (props) => <input {...props} />,
	SelectControl: ({ children, options, ...props }) => (
		<select {...props}>
			{(options ?? []).map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	),
}));

// `@wordpress/icons` nests its own `react` copy for the same reason; the glyphs are only passed
// through as props here.
jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	dragHandle: 'dragHandle',
	moreVertical: 'moreVertical',
	plus: 'plus',
	check: 'check',
	chevronDown: 'chevronDown',
}));

const LIBRARY = { feed: {}, slug: 'default', version: 1, rest: {}, refreshFeed: jest.fn() };
const ROUTE = { screen: 'color-palette', scope: 'secondary', item: '' };

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
	jest.clearAllMocks();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Build a `usePalettes` stub for a two-swatch palette: one inherited, one overridden.
 *
 * @param {Object} [overrides] Fields merged over the defaults — e.g. `{ editingId: 'default' }`.
 *
 * @since TBD
 *
 * @return {Object} The `usePalettes` stub.
 */
function makePalettes(overrides = {}) {
	return {
		listing: {
			defaultId: 'default',
			currentId: 'secondary',
			palettes: [
				{ id: 'default', label: 'Base', groups: [] },
				{ id: 'secondary', label: 'Secondary', groups: [] },
			],
			userCreated: ['secondary'],
		},
		activeId: 'secondary',
		editingId: 'secondary',
		isEditingActive: true,
		palette: {
			groups: [
				{
					id: 'accent',
					label: 'Accent',
					swatches: [
						{ token: 'accent.one', label: 'Main 1', $value: '#3182ce', overridden: false },
						{ token: 'accent.two', label: 'Main 3', $value: '#794c25', overridden: true },
					],
				},
			],
		},
		isLoading: false,
		isBusy: false,
		openError: null,
		activateError: null,
		createError: null,
		renameError: null,
		deleteError: null,
		structureError: null,
		clearOpenError: jest.fn(),
		clearActivateError: jest.fn(),
		clearCreateError: jest.fn(),
		clearRenameError: jest.fn(),
		clearDeleteError: jest.fn(),
		clearStructureError: jest.fn(),
		openPalette: jest.fn(() => Promise.resolve()),
		activatePalette: jest.fn(() => Promise.resolve()),
		createPalette: jest.fn(() => Promise.resolve()),
		renamePalette: jest.fn(() => Promise.resolve()),
		deletePalette: jest.fn(() => Promise.resolve()),
		saveSwatchEdits: jest.fn(() => Promise.resolve()),
		removeSwatch: jest.fn(() => Promise.resolve()),
		resetSwatch: jest.fn(() => Promise.resolve()),
		isSwatchCustom: jest.fn(() => false),
		addColor: jest.fn(() => Promise.resolve()),
		addingGroupIds: [],
		addGroup: jest.fn(() => Promise.resolve()),
		reorderSwatches: jest.fn(() => Promise.resolve()),
		renameGroup: jest.fn(() => Promise.resolve()),
		removeGroup: jest.fn(() => Promise.resolve()),
		...overrides,
	};
}

/**
 * Render the screen against a `usePalettes` stub.
 *
 * @param {Object}   palettes           The stub returned by `makePalettes`.
 * @param {Object}   [overrides]        Render overrides.
 * @param {Object}   [overrides.route]  The route to render with, for the tests that need an open
 *                                      settings panel (`route.item`).
 * @param {Function} [overrides.navigate] The route navigator spy.
 *
 * @since TBD
 *
 * @return {void}
 */
function renderScreen(palettes, { route = ROUTE, navigate = () => {} } = {}) {
	usePalettes.mockReturnValue(palettes);

	act(() =>
		root.render(<ColorPaletteScreen label="Color Palette" route={route} navigate={navigate} library={LIBRARY} />)
	);
}

const MODE_KEY = 'kadence-blocks:style-library:swatch-view-mode';
const SL = 'kadence-blocks-style-library__';

const q = (selector) => container.querySelector(selector);
const qa = (selector) => container.querySelectorAll(selector);

beforeEach(() => {
	window.localStorage.clear();
});

afterEach(() => {
	window.localStorage.clear();
});

describe('Color Palette swatch view mode', () => {
	/**
	 * The toggle sits in the primary action slot, before the Add Color Group button.
	 *
	 * @return {void}
	 */
	it('places the toggle immediately before the Add Color Group button', () => {
		renderScreen(makePalettes());

		const slot = q(`.${SL}screen-header-primary-action`);
		const toggle = slot.querySelector(`.${SL}swatch-view-toggle`);
		const addButton = [...slot.querySelectorAll('button')].find((b) => 'Add Color Group' === b.textContent);

		expect(toggle).not.toBeNull();
		expect(toggle.compareDocumentPosition(addButton) & window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	/**
	 * With nothing stored the screen shows cards and the grid button is pressed.
	 *
	 * @return {void}
	 */
	it('defaults to the grid view', () => {
		renderScreen(makePalettes());

		const [grid, list] = qa(`.${SL}swatch-view-toggle button`);

		expect(grid.getAttribute('aria-pressed')).toBe('true');
		expect(list.getAttribute('aria-pressed')).toBe('false');
		expect(qa(`.${SL}swatch-card`)).toHaveLength(2);
		expect(q(`.${SL}swatch-row`)).toBeNull();
	});

	/**
	 * A saved list mode shows rows on the first render.
	 *
	 * @return {void}
	 */
	it('applies a stored list mode on first render', () => {
		window.localStorage.setItem(MODE_KEY, 'list');
		renderScreen(makePalettes());

		const [, list] = qa(`.${SL}swatch-view-toggle button`);

		expect(list.getAttribute('aria-pressed')).toBe('true');
		expect(qa(`.${SL}swatch-row`)).toHaveLength(2);
		expect(q(`.${SL}swatch-card`)).toBeNull();
	});

	/**
	 * Clicking a toggle button switches the view and stores the choice.
	 *
	 * @return {void}
	 */
	it('switches and stores the mode when a toggle button is clicked', () => {
		renderScreen(makePalettes());

		const [grid, list] = qa(`.${SL}swatch-view-toggle button`);

		act(() => list.click());
		expect(window.localStorage.getItem(MODE_KEY)).toBe('list');
		expect(qa(`.${SL}swatch-row`)).toHaveLength(2);

		act(() => grid.click());
		expect(window.localStorage.getItem(MODE_KEY)).toBe('grid');
		expect(qa(`.${SL}swatch-card`)).toHaveLength(2);
	});

	/**
	 * An unknown stored value falls back to grid.
	 *
	 * @return {void}
	 */
	it('falls back to grid for an invalid stored value', () => {
		window.localStorage.setItem(MODE_KEY, 'table');
		renderScreen(makePalettes());

		expect(qa(`.${SL}swatch-card`)).toHaveLength(2);
	});

	/**
	 * While loading, the skeleton already matches the saved list mode.
	 *
	 * @return {void}
	 */
	it('shows a list-shaped skeleton while loading in list mode', () => {
		window.localStorage.setItem(MODE_KEY, 'list');
		renderScreen(makePalettes({ isLoading: true, palette: null }));

		const status = q('[role="status"]');

		expect(status.classList.contains(`${SL}swatch-grid--list`)).toBe(true);
		expect(status.querySelectorAll(`.${SL}swatch-row`).length).toBeGreaterThan(0);
		expect(status.querySelector(`.${SL}swatch-card`)).toBeNull();
	});

	/**
	 * While loading in grid mode the skeleton is the card shape it always was.
	 *
	 * @return {void}
	 */
	it('shows a card-shaped skeleton while loading in grid mode', () => {
		renderScreen(makePalettes({ isLoading: true, palette: null }));

		const status = q('[role="status"]');

		expect(status.classList.contains(`${SL}swatch-grid--list`)).toBe(false);
		expect(status.querySelectorAll(`.${SL}swatch-card`).length).toBeGreaterThan(0);
		expect(status.querySelector(`.${SL}swatch-row`)).toBeNull();
	});

	/**
	 * After Reset from a row's pill settles, focus returns to that row's select button.
	 *
	 * @return {void}
	 */
	it('returns focus to the row select button after Reset in list mode', async () => {
		window.localStorage.setItem(MODE_KEY, 'list');
		renderScreen(makePalettes());

		const resetButton = q(`.${SL}inheritance-pill--reset`);
		const row = resetButton.closest(`.${SL}swatch-row`);

		await act(async () => resetButton.click());

		expect(document.activeElement).toBe(row.querySelector(`.${SL}swatch-row-select`));
	});
});
