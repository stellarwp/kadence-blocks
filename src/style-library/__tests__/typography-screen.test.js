/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { TypographyScreen } from '../components/pages/TypographyScreen';
import { useScaleScreen } from '../hooks/use-scale-screen';
import { useDraftChannel } from '../hooks/use-draft-channel';
import { useGoogleFontLoader } from '../hooks/use-google-font-loader';
import { addFavoriteFontFlow, removeFavoriteFontFlow } from '../helpers/font-flows';

// `use-scale-screen.js` pulls in `../api/client`, which imports `@wordpress/api-fetch` (externalized
// to the `wp.apiFetch` global in production, not an installed npm dependency), so automocking would
// fail to resolve it. The screen only positions this hook's return value; a stub is enough.
jest.mock('../hooks/use-scale-screen', () => ({
	useScaleScreen: jest.fn(),
}));

// The screen reads its selection guard off this hook. A null channel is the "no provider mounted"
// path `ScaleScreen` already degrades to.
jest.mock('../hooks/use-draft-channel', () => ({
	useDraftChannel: jest.fn(),
}));

// Loads a real web font off the network. Stubbed so the sample's font never gates a render.
jest.mock('../hooks/use-google-font-loader', () => ({
	useGoogleFontLoader: jest.fn(),
}));

// The subject: these are driven by hand so a write can be held mid-flight, which is the whole point
// of the states under test. `../api/client` is never reached.
jest.mock('../helpers/font-flows', () => ({
	addFavoriteFontFlow: jest.fn(),
	removeFavoriteFontFlow: jest.fn(),
}));

// The row list mounts `@dnd-kit` and `ListRow`, neither of which this screen's toolbar touches.
jest.mock('../components/templates/RowList', () => ({
	RowList: () => <div className="row-list" />,
}));

// `jest.config.js` maps the `@wordpress/components` specifier to the copy nested under
// `@kadence/components/node_modules`, which resolves its own nested `react`/`react-dom` — a
// different module instance than the top-level `react-dom/client` this test renders with. Mounting
// the real controls under the top-level renderer trips React's "Invalid hook call" guard. The
// `Button` stand-in reproduces the one piece of real `Button` behavior under test: `disabled` plus
// `accessibleWhenDisabled` renders `aria-disabled` INSTEAD of the `disabled` attribute, which is
// what keeps the button focusable while its write runs.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, icon, isBusy, accessibleWhenDisabled, variant, disabled, ...props }) => (
		<button
			{...props}
			disabled={Boolean(disabled) && !accessibleWhenDisabled}
			aria-disabled={disabled && accessibleWhenDisabled ? 'true' : undefined}
			data-variant={variant}
			data-icon={typeof icon === 'string' ? icon : undefined}
			data-is-busy={isBusy ? 'true' : undefined}
		>
			{children}
		</button>
	),
	Notice: ({ children, status, isDismissible, onRemove, ...props }) => (
		<div className="components-notice" {...props}>
			{children}
		</div>
	),
	Spinner: () => <span className="components-spinner" />,
	// Never opened here, so only the toggle is rendered.
	Dropdown: ({ renderToggle }) => renderToggle({ isOpen: false, onToggle: () => {} }),
	MenuGroup: ({ children }) => <div>{children}</div>,
	MenuItem: ({ children, ...props }) => <button {...props}>{children}</button>,
	TextControl: (props) => <input {...props} />,
}));

// `@wordpress/primitives` (which `@wordpress/icons`'s `Icon` builds on) nests its own `react` copy,
// the same cross-copy problem the mock above sidesteps. The glyphs become plain strings so the
// `Button` stand-in can surface which one the toolbar chose.
jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	chevronDown: 'chevronDown',
	plus: 'plus',
	starEmpty: 'starEmpty',
	starFilled: 'starFilled',
}));

const SCALE = {
	rows: [],
	selectedId: '',
	selectToken: () => {},
	isBusy: false,
	addError: null,
	orderError: null,
	clearAddError: () => {},
	clearOrderError: () => {},
	addToken: () => {},
	saveToken: () => {},
	deleteToken: () => {},
	reorderTokens: () => {},
	tokenById: () => null,
	initialValuesFor: () => ({}),
};

let container;
let root;

/**
 * Build the `library` prop with a given favorites list.
 *
 * @param {Array<string>} favoriteFonts The families the feed reports as favorites.
 *
 * @since TBD
 *
 * @return {Object} The design-tokens feed hook's return value, as far as this screen reads it.
 */
function libraryWith(favoriteFonts) {
	return {
		slug: 'default',
		version: 1,
		feed: { favoriteFonts },
		refreshFeed: () => Promise.resolve(),
		rest: { namespace: 'kb-design-tokens/v1' },
	};
}

/**
 * Render (or re-render) `TypographyScreen` against a given favorites list.
 *
 * @param {Array<string>} favoriteFonts The families the feed reports as favorites.
 *
 * @since TBD
 *
 * @return {void}
 */
function renderScreen(favoriteFonts) {
	act(() => {
		root.render(
			createElement(TypographyScreen, {
				label: 'Typography',
				route: { screen: 'typography', item: '' },
				navigate: () => {},
				library: libraryWith(favoriteFonts),
			})
		);
	});
}

/**
 * The contextual Add/Remove Favorite button currently mounted.
 *
 * @since TBD
 *
 * @return {HTMLElement} The button node.
 */
function favoriteButton() {
	return container.querySelector('.kadence-blocks-style-library__typography-font-action');
}

/**
 * The toolbar's polite live region.
 *
 * @since TBD
 *
 * @return {HTMLElement} The live-region node.
 */
function liveRegion() {
	return container.querySelector('.kadence-blocks-style-library__typography-toolbar [role="status"]');
}

/**
 * Stub a favorite flow so its write can be held mid-flight, mirroring the real flows: `onBusy(true)`
 * as the call starts, and nothing else until the returned settle function is invoked.
 *
 * @param {Function} flow The mocked flow to arm.
 *
 * @since TBD
 *
 * @return {Function} Returns the captured `{ args, resolve, reject }` for the call in flight.
 */
function armFlow(flow) {
	let inFlight = null;

	flow.mockImplementation((args) => {
		args.onBusy(true);

		return new Promise((resolve, reject) => {
			inFlight = { args, resolve, reject };
		});
	});

	return () => inFlight;
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);

	useScaleScreen.mockReturnValue(SCALE);
	useDraftChannel.mockReturnValue(null);
	useGoogleFontLoader.mockReturnValue({ readyFamily: 'Inter', isLoading: false });
	addFavoriteFontFlow.mockReset();
	removeFavoriteFontFlow.mockReset();
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

describe('TypographyScreen favorite button', () => {
	it('offers Remove Favorite for the seeded favorite, idle and focusable', () => {
		renderScreen(['Inter']);

		const button = favoriteButton();

		expect(button.textContent).toBe('Remove Favorite');
		expect(button.dataset.variant).toBe('tertiary');
		expect(button.dataset.icon).toBe('starFilled');
		expect(button.dataset.isBusy).toBeUndefined();
		expect(button.getAttribute('aria-disabled')).toBeNull();
		expect(button.disabled).toBe(false);
	});

	it('shows a busy label and stays focusable while the write is in flight', () => {
		const pending = armFlow(removeFavoriteFontFlow);

		renderScreen(['Inter']);

		act(() => favoriteButton().click());

		expect(pending().args.name).toBe('Inter');

		const button = favoriteButton();

		expect(button.textContent).toBe('Removing Favorite…');
		expect(button.dataset.isBusy).toBe('true');
		// The write disables the button, but through `aria-disabled` — a `disabled` attribute would
		// drop focus to the document the moment a keyboard user activated it.
		expect(button.getAttribute('aria-disabled')).toBe('true');
		expect(button.disabled).toBe(false);
	});

	it('keeps naming the in-flight action after the feed refreshes beneath it', () => {
		armFlow(removeFavoriteFontFlow);

		renderScreen(['Inter']);

		act(() => favoriteButton().click());

		// What the real flow does next: refresh the feed, and only then settle `onBusy`. The button
		// must not read "Adding Favorite…" for that window.
		renderScreen([]);

		const button = favoriteButton();

		expect(button.textContent).toBe('Removing Favorite…');
		expect(button.dataset.icon).toBe('starFilled');
		expect(button.dataset.variant).toBe('tertiary');
	});

	it('announces the outcome and flips to the opposite action once the write settles', async () => {
		const pending = armFlow(removeFavoriteFontFlow);

		renderScreen(['Inter']);

		act(() => favoriteButton().click());

		renderScreen([]);

		const settled = pending();

		await act(async () => {
			settled.args.onBusy(false);
			settled.resolve('Inter');
		});

		const button = favoriteButton();

		expect(button.textContent).toBe('Add Favorite');
		expect(button.dataset.variant).toBe('secondary');
		expect(button.dataset.icon).toBe('starEmpty');
		expect(button.dataset.isBusy).toBeUndefined();
		expect(liveRegion().textContent).toBe('Inter removed from favorites.');
	});

	it('runs the add path with its own busy label once the family is no longer a favorite', async () => {
		const pendingRemove = armFlow(removeFavoriteFontFlow);

		renderScreen(['Inter']);

		act(() => favoriteButton().click());

		renderScreen([]);

		await act(async () => {
			pendingRemove().args.onBusy(false);
			pendingRemove().resolve('Inter');
		});

		const pendingAdd = armFlow(addFavoriteFontFlow);

		act(() => favoriteButton().click());

		expect(favoriteButton().textContent).toBe('Adding Favorite…');
		expect(favoriteButton().dataset.isBusy).toBe('true');
		expect(favoriteButton().dataset.variant).toBe('secondary');

		renderScreen(['Inter']);

		await act(async () => {
			pendingAdd().args.onBusy(false);
			pendingAdd().resolve('Inter');
		});

		expect(favoriteButton().textContent).toBe('Remove Favorite');
		expect(liveRegion().textContent).toBe('Inter added to favorites.');
	});

	it('surfaces the error and announces nothing when the write fails', async () => {
		const pending = armFlow(removeFavoriteFontFlow);

		renderScreen(['Inter']);

		act(() => favoriteButton().click());

		const settled = pending();

		await act(async () => {
			settled.args.onError({ message: 'Nope.' });
			settled.args.onBusy(false);
			settled.reject(new Error('Nope.'));
		});

		expect(container.querySelector('.components-notice').textContent).toBe('Nope.');
		expect(liveRegion().textContent).toBe('');
		// Back to the label it carried before the click, not stuck on the busy one.
		expect(favoriteButton().textContent).toBe('Remove Favorite');
	});
});
