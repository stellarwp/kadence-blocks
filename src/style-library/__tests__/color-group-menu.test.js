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

// Same cross-module-copy rationale as `palette-reset-modal.test.js`: `@wordpress/components`' own
// nested `react`/`react-dom` copy trips React's "Invalid hook call" guard under the top-level
// renderer this test uses. Unlike that file, `DropdownMenu` renders its render-prop children here,
// because the menu's contents are what this file asserts on.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isBusy, isDestructive, variant, icon, ...props }) => <button {...props}>{children}</button>,
	Notice: ({ children, isDismissible, onRemove, status, ...props }) => <div {...props}>{children}</div>,
	DropdownMenu: ({ children, label }) => (
		<div role="menu" aria-label={label}>
			{children({ onClose: () => {} })}
		</div>
	),
	MenuGroup: ({ children }) => <div>{children}</div>,
	MenuItem: ({ children, isDestructive, ...props }) => <button {...props}>{children}</button>,
	Dropdown: ({ renderToggle }) => renderToggle({ isOpen: false, onToggle: () => {} }),
	Spinner: () => <span className="components-spinner" />,
	ExternalLink: ({ children, ...props }) => <a {...props}>{children}</a>,
	Tooltip: ({ children }) => children,
	Modal: ({ children, title }) => (
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
const ROUTE = { screen: 'color-palette', scope: 'default', item: '' };

const ACCENT = {
	id: 'accent',
	label: 'Accent',
	swatches: [
		{
			token: 'primitive.color.brand.primary',
			label: 'Main 1',
			$value: '#111111',
			baseline: true,
			overridden: false,
		},
	],
};

const BRAND = {
	id: 'brand',
	label: 'Brand',
	swatches: [
		{
			token: 'primitive.color.custom.custom-1',
			label: 'Custom 1',
			$value: '#222222',
			baseline: false,
			overridden: false,
		},
	],
};

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
 * Build a `usePalettes` stub with the default palette open, holding the given groups.
 *
 * @param {Array<Object>} groups The effective-view groups to render.
 *
 * @since TBD
 *
 * @return {Object} The `usePalettes` stub.
 */
function makePalettes(groups) {
	return {
		listing: {
			defaultId: 'default',
			currentId: 'default',
			palettes: [{ id: 'default', label: 'Default', groups: [] }],
			userCreated: [],
		},
		activeId: 'default',
		editingId: 'default',
		isEditingActive: true,
		palette: { id: 'default', label: 'Default', groups },
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
	};
}

/**
 * Render the screen against a `usePalettes` stub.
 *
 * @param {Object} palettes The stub returned by `makePalettes`.
 *
 * @since TBD
 *
 * @return {void}
 */
function renderScreen(palettes) {
	usePalettes.mockReturnValue(palettes);

	act(() =>
		root.render(<ColorPaletteScreen label="Color Palette" route={ROUTE} navigate={() => {}} library={LIBRARY} />)
	);
}

/**
 * The labels of the items in one group's overflow menu.
 *
 * @param {string} groupLabel The group's display label, as used in the menu's accessible name.
 *
 * @since TBD
 *
 * @return {Array<string>} The item labels, in order; empty when the menu is not rendered.
 */
function menuItems(groupLabel) {
	const menu = container.querySelector(`[role="menu"][aria-label="Options for ${groupLabel}"]`);

	return menu ? [...menu.querySelectorAll('button')].map((button) => button.textContent) : [];
}

describe('Color group overflow menu', () => {
	/**
	 * A shipped group cannot be removed — the server refuses to drop its swatches from the default
	 * palette — so the menu offers Rename only, instead of a Delete that would just error.
	 *
	 * @return void
	 */
	it('offers Rename but not Delete for a baseline group', () => {
		renderScreen(makePalettes([ACCENT, BRAND]));

		expect(menuItems('Accent')).toEqual(['Rename']);
	});

	/**
	 * A user-created group is the one kind of group that can go away, so its menu keeps Delete.
	 *
	 * @return void
	 */
	it('offers both Rename and Delete for a user-created group', () => {
		renderScreen(makePalettes([ACCENT, BRAND]));

		expect(menuItems('Brand')).toEqual(['Rename', 'Delete']);
	});

	/**
	 * The last remaining group still cannot be deleted even when it is user-created — the server
	 * rejects an empty `groups` array — so the existing single-group rule is unchanged.
	 *
	 * @return void
	 */
	it('still hides Delete when a user-created group is the only group', () => {
		renderScreen(makePalettes([BRAND]));

		expect(menuItems('Brand')).toEqual(['Rename']);
	});
});
