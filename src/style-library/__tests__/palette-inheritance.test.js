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

const PILL_CLASS = 'kadence-blocks-style-library__inheritance-pill';
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

describe('Color Palette inheritance pills', () => {
	/**
	 * On a non-default palette each card states its own state: the un-overridden color names the
	 * palette it follows, the overridden one offers the way back.
	 *
	 * @return void
	 */
	it('gives an inherited swatch the source pill and an overridden swatch the Reset button', () => {
		renderScreen(makePalettes());

		const pills = [...container.querySelectorAll(`.${PILL_CLASS}`)];

		expect(pills).toHaveLength(2);
		expect(pills[0].textContent).toBe('From Base');
		expect(pills[0].tagName).toBe('SPAN');
		expect(pills[1].textContent).toBe('Reset');
		expect(pills[1].tagName).toBe('BUTTON');
	});

	/**
	 * The default palette defines the values, so its cards have nothing to inherit and show no
	 * pill at all.
	 *
	 * @return void
	 */
	it('shows no pill while the default palette is being edited', () => {
		renderScreen(makePalettes({ editingId: 'default' }));

		expect(container.querySelectorAll(`.${PILL_CLASS}`)).toHaveLength(0);
	});

	/**
	 * Clicking Reset reverts that one swatch through the hook, naming the swatch's own token.
	 *
	 * The click is awaited inside an async `act()`, not the plain synchronous form used elsewhere in
	 * this file: the screen's own `.then()` (which restores focus to the card) resolves on a
	 * microtask after the mocked `resetSwatch` promise settles, and only an async `act()` flushes
	 * that before the assertion runs.
	 *
	 * @return void
	 */
	it('reverts the swatch through resetSwatch when Reset is clicked', async () => {
		const palettes = makePalettes();

		renderScreen(palettes);
		await act(async () => container.querySelector(`.${PILL_CLASS}--reset`).click());

		expect(palettes.resetSwatch).toHaveBeenCalledWith('accent.two');
	});

	/**
	 * A write already in flight anywhere on the screen disables the Reset button, so a second
	 * click cannot queue a write the hook would reject anyway.
	 *
	 * @return void
	 */
	it('disables Reset while the screen is busy', () => {
		renderScreen(makePalettes({ isBusy: true }));

		expect(container.querySelector(`.${PILL_CLASS}--reset`).disabled).toBe(true);
	});

	/**
	 * A swatch that is optimistically deleted keeps its Reset button (it still carries an override
	 * until the delete confirms), but disabled — a card that reads as dead must not leave the pill
	 * as its only tabbable control.
	 *
	 * @return void
	 */
	it('disables Reset on a swatch that is pending delete', () => {
		const palettes = makePalettes();
		palettes.palette.groups[0].swatches[1].pendingDelete = true;

		renderScreen(palettes);

		expect(container.querySelector(`.${PILL_CLASS}--reset`).disabled).toBe(true);
	});

	/**
	 * On a successful reset the card's pill flips from the Reset button to the static "From" pill,
	 * and the inheritance notice's count goes up by one — driven here by re-rendering with the
	 * store's own post-reset shape, the way the real `usePalettes` would after the write resolves.
	 *
	 * @return void
	 */
	it('flips the pill to the static state and grows the notice count after a successful reset', async () => {
		const palettes = makePalettes();
		let resolveReset;
		palettes.resetSwatch = jest.fn(
			() =>
				new Promise((resolve) => {
					resolveReset = resolve;
				})
		);

		renderScreen(palettes);

		await act(async () => {
			container.querySelector(`.${PILL_CLASS}--reset`).click();
			resolveReset();
		});

		// A new `palette` object, not a mutation in place: `gridGroups` is memoized on
		// `palettes.palette`'s identity, exactly like the real store's own effective view replaces
		// itself on every write rather than being edited in place.
		palettes.palette = {
			groups: [
				{
					...palettes.palette.groups[0],
					swatches: palettes.palette.groups[0].swatches.map((swatch) =>
						swatch.token === 'accent.two' ? { ...swatch, overridden: false } : swatch
					),
				},
			],
		};
		renderScreen(palettes);

		const pills = [...container.querySelectorAll(`.${PILL_CLASS}`)];

		expect(pills).toHaveLength(2);
		expect(pills.every((pill) => pill.tagName === 'SPAN')).toBe(true);
		expect(container.querySelector('.kadence-blocks-style-library__palette-inheritance-notice').textContent).toBe(
			'2 colors in this palette still follow Base. Editing them in Base updates them here too, until you customize them.'
		);
	});

	/**
	 * A failed reset leaves the override in place: the swatch keeps its Reset button, and it is
	 * still enabled once the screen is no longer busy.
	 *
	 * @return void
	 */
	it('keeps the override and the operable Reset button after a failed reset', async () => {
		const palettes = makePalettes();
		palettes.resetSwatch = jest.fn(() => Promise.reject(new Error('write failed')));

		renderScreen(palettes);
		await act(async () => container.querySelector(`.${PILL_CLASS}--reset`).click());

		const resetButton = container.querySelector(`.${PILL_CLASS}--reset`);

		expect(resetButton).not.toBeNull();
		expect(resetButton.disabled).toBe(false);
	});
});

describe('Color Palette inheritance notice', () => {
	const NOTICE_CLASS = 'kadence-blocks-style-library__palette-inheritance-notice';

	/**
	 * The notice counts the colors that still follow the default palette and names that palette.
	 *
	 * @return void
	 */
	it('counts the colors that still follow the default palette', () => {
		renderScreen(makePalettes());

		expect(container.querySelector(`.${NOTICE_CLASS}`).textContent).toBe(
			'1 color in this palette still follows Base. Editing it in Base updates it here too, until you customize it.'
		);
	});

	/**
	 * With every color customized there is nothing left to explain, so the notice is absent rather
	 * than stating zero.
	 *
	 * @return void
	 */
	it('renders nothing when every color is customized', () => {
		const palettes = makePalettes();
		palettes.palette.groups[0].swatches[0].overridden = true;

		renderScreen(palettes);

		expect(container.querySelector(`.${NOTICE_CLASS}`)).toBeNull();
	});

	/**
	 * The default palette has no source to follow, so the notice never appears on it.
	 *
	 * @return void
	 */
	it('renders nothing while the default palette is being edited', () => {
		renderScreen(makePalettes({ editingId: 'default' }));

		expect(container.querySelector(`.${NOTICE_CLASS}`)).toBeNull();
	});
});
