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
import { DraftChannelContext } from '../hooks/use-draft-channel';

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
	Button: ({ children, isBusy, isDestructive, variant, icon, iconPosition, ...props }) => (
		<button {...props}>{children}</button>
	),
	Notice: ({ children, isDismissible, onRemove, status, ...props }) => <div {...props}>{children}</div>,
	DropdownMenu: () => null,
	MenuGroup: ({ children }) => <div>{children}</div>,
	MenuItem: ({ children, suffix, icon, iconPosition, ...props }) => <button {...props}>{children}</button>,
	// Opens on click and renders its content, so the palette selector's menu items are reachable —
	// the swatch-selection tests below never open a menu and stay unaffected.
	Dropdown: ({ renderToggle, renderContent, onClose, onToggle }) => {
		const React = require('react');
		const [isOpen, setIsOpen] = React.useState(false);
		const setOpen = (nextOpen) => {
			setIsOpen(nextOpen);
			onToggle?.(nextOpen);
		};
		const close = () => {
			setOpen(false);
			onClose?.();
		};

		return (
			<div>
				{renderToggle({ isOpen, onToggle: () => setOpen(!isOpen) })}
				{isOpen && <div data-popover>{renderContent({ onClose: close })}</div>}
			</div>
		);
	},
	Spinner: () => <span className="components-spinner" />,
	ExternalLink: ({ children, ...props }) => <a {...props}>{children}</a>,
	Tooltip: ({ children }) => children,
	Modal: ({ children, title, onRequestClose }) => (
		<div role="dialog" aria-label={title}>
			{children}
		</div>
	),
	TextControl: ({ label, value, onChange, help, ...props }) => (
		<input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} {...props} />
	),
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
 * @param {?Object}  [overrides.channel]  The draft channel to provide, or null for none.
 *
 * @since TBD
 *
 * @return {void}
 */
function renderScreen(palettes, { route = ROUTE, navigate = () => {}, channel = null } = {}) {
	usePalettes.mockReturnValue(palettes);

	act(() =>
		root.render(
			<DraftChannelContext.Provider value={channel}>
				<ColorPaletteScreen label="Color Palette" route={route} navigate={navigate} library={LIBRARY} />
			</DraftChannelContext.Provider>
		)
	);
}

const SL = 'kadence-blocks-style-library__';

describe('Color Palette selection and the unsaved-changes guard', () => {
	/**
	 * Build a fake draft channel whose guard records what it was asked to run.
	 *
	 * @since TBD
	 *
	 * @return {Object} The channel.
	 */
	function makeChannel() {
		return { guard: jest.fn(), publish: jest.fn(), clearPublication: jest.fn(), actionsRef: { current: null } };
	}

	/**
	 * Selecting another swatch hands the navigation to the guard instead of navigating directly.
	 *
	 * @return {void}
	 */
	it('routes selecting another swatch through the guard', () => {
		const channel = makeChannel();
		const navigate = jest.fn();

		renderScreen(makePalettes(), { route: { ...ROUTE, item: 'accent.one' }, navigate, channel });
		act(() => container.querySelectorAll(`.${SL}swatch-card-select`)[1]?.click());

		expect(channel.guard).toHaveBeenCalledTimes(1);
		expect(navigate).not.toHaveBeenCalled();

		channel.guard.mock.calls[0][0]();

		expect(navigate).toHaveBeenCalledWith({ item: 'accent.two' });
	});

	/**
	 * Selecting the swatch that is already open changes nothing, so it skips the guard.
	 *
	 * @return {void}
	 */
	it('skips the guard when the open swatch is selected again', () => {
		const channel = makeChannel();

		renderScreen(makePalettes(), { route: { ...ROUTE, item: 'accent.one' }, channel });
		act(() => container.querySelectorAll(`.${SL}swatch-card-select`)[0]?.click());

		expect(channel.guard).not.toHaveBeenCalled();
	});

	/**
	 * With no channel mounted, selecting navigates directly.
	 *
	 * @return {void}
	 */
	it('navigates directly without a channel', () => {
		const navigate = jest.fn();

		renderScreen(makePalettes(), { navigate });
		act(() => container.querySelectorAll(`.${SL}swatch-card-select`)[1]?.click());

		expect(navigate).toHaveBeenCalledWith({ item: 'accent.two' });
	});

	/**
	 * Choosing a different palette in the header selector hands the open to the guard instead of
	 * opening it directly — the open swatch's dirty draft must be able to block it the same way a
	 * swatch selection does.
	 *
	 * @return {void}
	 */
	it('routes changing the palette selector through the guard', () => {
		const channel = makeChannel();
		const palettes = makePalettes();

		renderScreen(palettes, { channel });

		act(() => container.querySelector(`.${SL}select-dropdown-toggle`)?.click());
		act(() =>
			[...container.querySelectorAll('[data-popover] button')]
				.find((button) => button.textContent === 'Base')
				?.click()
		);

		expect(channel.guard).toHaveBeenCalledTimes(1);
		expect(palettes.openPalette).not.toHaveBeenCalled();

		channel.guard.mock.calls[0][0]();

		expect(palettes.openPalette).toHaveBeenCalledWith('default');
	});

	/**
	 * With no channel mounted, changing the palette selector opens the palette directly.
	 *
	 * @return {void}
	 */
	it('opens the selected palette directly without a channel', () => {
		const palettes = makePalettes();

		renderScreen(palettes);

		act(() => container.querySelector(`.${SL}select-dropdown-toggle`)?.click());
		act(() =>
			[...container.querySelectorAll('[data-popover] button')]
				.find((button) => button.textContent === 'Base')
				?.click()
		);

		expect(palettes.openPalette).toHaveBeenCalledWith('default');
	});

	/**
	 * Adding a color group fires its optimistic navigate callback synchronously, before the write
	 * settles, so the action must go through the guard the same way Add Color already does.
	 *
	 * @return {void}
	 */
	it('routes adding a color group through the guard', () => {
		const channel = makeChannel();
		const palettes = makePalettes();

		renderScreen(palettes, { channel });

		act(() =>
			[...container.querySelectorAll('button')]
				.find((button) => button.textContent === 'Add Color Group')
				?.click()
		);

		const input = container.querySelector('input[aria-label="Group name"]');

		act(() => {
			const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

			setter.call(input, 'Highlights');
			input.dispatchEvent(new Event('input', { bubbles: true }));
		});

		act(() => {
			container.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
		});

		expect(channel.guard).toHaveBeenCalledTimes(1);
		expect(palettes.addGroup).not.toHaveBeenCalled();

		channel.guard.mock.calls[0][0]();

		expect(palettes.addGroup).toHaveBeenCalledWith('Highlights', expect.any(Function));
	});
});
