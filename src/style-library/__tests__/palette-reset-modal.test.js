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

// Same cross-module-copy rationale as `palette-inheritance.test.js`: `@wordpress/components`' own
// nested `react`/`react-dom` copy trips React's "Invalid hook call" guard under the top-level
// renderer this test uses. The stand-ins mirror that file's, so the two screen tests mount the same
// way — `SelectControl` matters most here, since its absence is what this file asserts.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, isBusy, isDestructive, variant, icon, ...props }) => <button {...props}>{children}</button>,
	Notice: ({ children, isDismissible, onRemove, status, ...props }) => <div {...props}>{children}</div>,
	DropdownMenu: () => null,
	MenuGroup: ({ children }) => <div>{children}</div>,
	MenuItem: ({ children, ...props }) => <button {...props}>{children}</button>,
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
const ROUTE = { screen: 'color-palette', scope: 'default', item: '' };

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
 * Build a `usePalettes` stub sitting in the shipped state: the baseline default palette is the one
 * being edited AND the live one, with one user-created palette alongside it.
 *
 * @param {Object} [overrides] Fields merged over the defaults — e.g. `{ editingId: 'secondary' }`.
 *
 * @since TBD
 *
 * @return {Object} The `usePalettes` stub.
 */
function makePalettes(overrides = {}) {
	return {
		listing: {
			defaultId: 'default',
			currentId: 'default',
			palettes: [
				{ id: 'default', label: 'Default', groups: [] },
				{ id: 'secondary', label: 'Secondary', groups: [] },
			],
			userCreated: ['secondary'],
		},
		activeId: 'default',
		editingId: 'default',
		isEditingActive: true,
		palette: { groups: [] },
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
 * The one button whose text matches, searched inside `scope`.
 *
 * @param {Element} scope The element to search under.
 * @param {string}  text  The exact button label.
 *
 * @since TBD
 *
 * @return {?Element} The button, or null when nothing matches.
 */
function buttonByText(scope, text) {
	return [...scope.querySelectorAll('button')].find((button) => button.textContent === text) ?? null;
}

/**
 * The open modal.
 *
 * @since TBD
 *
 * @return {?Element} The dialog element, or null while none is open.
 */
function dialog() {
	return container.querySelector('[role="dialog"]');
}

describe('Color Palette reset modal', () => {
	/**
	 * The shipped state — the baseline default palette open and live — offers a Reset, and
	 * confirming it calls through to the hook with no successor. The screen never asks for one
	 * because a reset leaves the palette in place and still live.
	 *
	 * @return void
	 */
	it('confirms a reset of the live default palette with no successor', async () => {
		const palettes = makePalettes();

		renderScreen(palettes);
		act(() => buttonByText(container, 'Reset').click());

		expect(dialog().getAttribute('aria-label')).toBe('Reset "Default"?');
		expect(dialog().querySelector('select')).toBeNull();

		await act(async () => buttonByText(dialog(), 'Reset').click());

		expect(palettes.deletePalette).toHaveBeenCalledWith('default', '');
	});

	/**
	 * The same screen still demands a successor for a real delete: a user-created palette that is
	 * also the live one has to hand the active pointer somewhere before it goes away, so the
	 * dropdown renders and the confirm button stays disabled until it is answered.
	 *
	 * @return void
	 */
	it('asks for a successor before deleting the live user-created palette', () => {
		const base = makePalettes();
		const palettes = makePalettes({
			editingId: 'secondary',
			activeId: 'secondary',
			// A third palette keeps the choice open. With only one candidate left the modal picks it
			// for the user and renders no dropdown at all, which would hide what this asserts.
			listing: {
				...base.listing,
				currentId: 'secondary',
				palettes: [...base.listing.palettes, { id: 'sunset', label: 'Sunset', groups: [] }],
				userCreated: ['secondary', 'sunset'],
			},
		});

		renderScreen(palettes);
		act(() => buttonByText(container, 'Delete').click());

		expect(dialog().getAttribute('aria-label')).toBe('Delete "Secondary"?');
		expect(dialog().querySelector('select')).not.toBeNull();
		expect(buttonByText(dialog(), 'Delete').disabled).toBe(true);
	});

	/**
	 * The modal keeps describing the palette it was opened for while the delete settles. The
	 * delete's own response drops the row from the listing before the confirm resolves, which
	 * snaps `editingId` back to the default palette — props derived live at that point would flip
	 * the still-open modal to the default palette's Reset copy for its closing frame.
	 *
	 * @return void
	 */
	it('keeps the Delete copy while the deleted palette leaves the listing', async () => {
		const base = makePalettes();
		const after = makePalettes();
		let resolveDelete;
		const palettes = makePalettes({
			editingId: 'secondary',
			activeId: 'secondary',
			listing: { ...base.listing, currentId: 'secondary' },
			// The write's `onReceive` lands the post-delete listing — the row gone, the default
			// palette live again — in the same round trip that confirms it, so the screen
			// re-renders against that state BEFORE this promise resolves and the modal closes.
			deletePalette: jest.fn(() => {
				usePalettes.mockReturnValue(after);
				root.render(
					<ColorPaletteScreen label="Color Palette" route={ROUTE} navigate={() => {}} library={LIBRARY} />
				);
				return new Promise((resolve) => {
					resolveDelete = resolve;
				});
			}),
		});

		renderScreen(palettes);
		act(() => buttonByText(container, 'Delete').click());
		act(() => buttonByText(dialog(), 'Delete').click());

		// The screen already reads the post-delete listing here, but the confirm has not resolved
		// yet: the still-open modal must keep naming what was deleted.
		expect(dialog().getAttribute('aria-label')).toBe('Delete "Secondary"?');

		await act(async () => resolveDelete());
		expect(dialog()).toBeNull();
	});
});
