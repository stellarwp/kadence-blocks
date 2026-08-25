/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { PresetScreen } from '../components/pages/PresetScreen';
import { usePresetScreen } from '../hooks/use-preset-screen';
import { BUTTON_PRESET } from '../presets/button-preset';
import { useDraftChannel } from '../hooks/use-draft-channel';

// A factory: `use-preset-screen.js` pulls in `../api/client`, which imports `@wordpress/api-fetch`
// (externalized to the `wp.apiFetch` global in production, not an installed npm dependency), so
// automocking would fail to resolve it. The screen only reads the hook's return value, so a bare
// jest.fn() stand-in is enough.
jest.mock('../hooks/use-preset-screen', () => ({
	usePresetScreen: jest.fn(),
}));

// `jest.config.js` maps the `@wordpress/components` specifier to the copy nested under
// `@kadence/components/node_modules`, which resolves its own nested `react`/`react-dom` — a
// different module instance than the top-level `react-dom/client` this test renders with. Mounting
// a real `Button`/`Notice` from that nested copy under the top-level renderer trips React's
// "Invalid hook call" guard. Simple stand-ins sidestep the cross-copy mismatch; this test only
// needs to tell the loading/empty/populated states apart, not exercise the real controls.
// The screen reads its draft overlay and its selection guard off this hook. Stubbed per test so
// the overlay branch (which needs a publication for the open item) and the guard branch are
// reachable without standing up the real provider.
jest.mock('../hooks/use-draft-channel', () => ({
	useDraftChannel: jest.fn(),
}));

jest.mock('@wordpress/components', () => ({
	// `isBusy` is a `Button` prop, not a DOM attribute — drop it so React does not warn about it.
	Button: ({ children, isBusy, ...props }) => <button {...props}>{children}</button>,
	Notice: ({ children, isDismissible, ...props }) => <div {...props}>{children}</div>,
}));

// `@wordpress/primitives` (which `@wordpress/icons`'s `Icon`/`SVG` build on) nests its own `react`
// copy under `node_modules/@wordpress/primitives/node_modules/react` — a different module instance
// than the top-level `react-dom/client` this test renders with. `DragHandle` mounts a real `Icon`
// for draggable rows, which trips the same "Objects are not valid as a React child" cross-copy
// error the `@wordpress/components` mock above sidesteps; stub `Icon` and the icon glyphs it takes
// for the same reason.
jest.mock('@wordpress/icons', () => ({
	Icon: (props) => <span className="components-icon" {...props} />,
	dragHandle: 'dragHandle',
	plus: 'plus',
}));

const LIBRARY = { rest: { namespace: 'kb-design-tokens/v1' }, slug: 'default', version: 1, values: {} };

let container;
let root;

/**
 * Render `PresetScreen` (with `BUTTON_PRESET`, the same value `ButtonScreen` passes) using the
 * given `usePresetScreen` stub and return the mounted container.
 *
 * @param {Object}   screen             The `usePresetScreen` return value to stub.
 * @param {Object}   [options]          Overrides for the props the selection and overlay paths read.
 * @param {string}   [options.item]     The route's open `kb-item`.
 * @param {Function} [options.navigate] The navigate spy.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container the screen was rendered into.
 */
function renderPresetScreen(screen, { item = '', navigate = () => {} } = {}) {
	usePresetScreen.mockReturnValue(screen);

	act(() => {
		root.render(
			createElement(PresetScreen, {
				label: 'Button',
				route: { screen: 'blocks/kadence/singlebtn', item },
				navigate,
				library: LIBRARY,
				preset: BUTTON_PRESET,
			})
		);
	});

	return container;
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
	usePresetScreen.mockReset();
	useDraftChannel.mockReset();
	useDraftChannel.mockReturnValue(null);
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('PresetScreen loading state', () => {
	/**
	 * While `usePresetScreen` is still fetching, the screen must show a row-shaped skeleton instead
	 * of the empty state — `usePresetScreen` starts with `isLoading: true` and no rows, and
	 * rendering the empty state at that point would flash "Add Button" before the presets arrive.
	 *
	 * @return {void}
	 */
	it('renders a skeleton instead of the empty state while loading', () => {
		renderPresetScreen({ payload: null, isLoading: true, loadError: null, rows: [], initialValuesFor: () => ({}) });

		expect(container.querySelectorAll('.kadence-blocks-style-library__skeleton').length).toBeGreaterThan(0);
		expect(container.querySelector('.kadence-blocks-style-library__empty-state')).toBeNull();
	});

	/**
	 * Once loading finishes with no rows, the empty state renders in place of the skeleton.
	 *
	 * @return {void}
	 */
	it('renders the empty state once loading finishes with no rows', () => {
		renderPresetScreen({ payload: {}, isLoading: false, loadError: null, rows: [], initialValuesFor: () => ({}) });

		expect(container.querySelector('.kadence-blocks-style-library__skeleton')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__empty-state')).not.toBeNull();
	});

	/**
	 * Once loading finishes with rows present, neither the skeleton nor the empty state renders.
	 *
	 * @return {void}
	 */
	it('renders the rows once loading finishes with presets present', () => {
		const rows = [
			{
				id: 'primary',
				label: 'Primary',
				preview: { background: '#111111', color: '#ffffff', borderRadius: '4px' },
			},
		];

		renderPresetScreen({ payload: {}, isLoading: false, loadError: null, rows, initialValuesFor: () => ({}) });

		expect(container.querySelector('.kadence-blocks-style-library__skeleton')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__empty-state')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__row-list')).not.toBeNull();
	});
});

describe('PresetScreen load failure', () => {
	/**
	 * A failed preset fetch renders its message as a notice. The list still renders, so a retry
	 * that succeeds needs no remount.
	 *
	 * @return {void}
	 */
	it('renders the load error message and still renders the list', () => {
		renderPresetScreen({
			payload: null,
			isLoading: false,
			loadError: new Error('Request failed'),
			rows: [],
			initialValuesFor: () => ({}),
		});

		expect(container.textContent).toContain('Request failed');
		expect(container.querySelector('.components-spinner')).toBeNull();
	});
});

describe('PresetScreen draft overlay', () => {
	const ROWS = [
		{
			id: 'primary',
			label: 'Primary',
			preview: { background: '#111111', color: '#ffffff', borderRadius: '4px' },
		},
		{
			id: 'secondary',
			label: 'Secondary',
			preview: { background: '#222222', color: '#ffffff', borderRadius: '4px' },
		},
	];

	/**
	 * A publication for the open item overlays that row's label, so the list shows what Save would
	 * write rather than the last fetched value.
	 *
	 * @return {void}
	 */
	it('overlays the open row label from the draft publication', () => {
		useDraftChannel.mockReturnValue({
			publication: { itemId: 'primary', draft: { label: 'Primary edited' } },
			guard: (fn) => fn(),
		});

		renderPresetScreen(
			{ payload: {}, isLoading: false, loadError: null, rows: ROWS, initialValuesFor: () => ({}) },
			{ item: 'primary' }
		);

		expect(container.textContent).toContain('Primary edited');
		expect(container.textContent).toContain('Secondary');
	});

	/**
	 * A publication belonging to a different item must not leak onto this screen's rows, so the
	 * fetched labels stay as they are.
	 *
	 * @return {void}
	 */
	it('ignores a publication whose itemId is not the open item', () => {
		useDraftChannel.mockReturnValue({
			publication: { itemId: 'secondary', draft: { label: 'Leaked' } },
			guard: (fn) => fn(),
		});

		renderPresetScreen(
			{ payload: {}, isLoading: false, loadError: null, rows: ROWS, initialValuesFor: () => ({}) },
			{ item: 'primary' }
		);

		expect(container.textContent).not.toContain('Leaked');
		expect(container.textContent).toContain('Primary');
	});
});

describe('PresetScreen selection', () => {
	const ROWS = [
		{
			id: 'primary',
			label: 'Primary',
			preview: { background: '#111111', color: '#ffffff', borderRadius: '4px' },
		},
		{
			id: 'secondary',
			label: 'Secondary',
			preview: { background: '#222222', color: '#ffffff', borderRadius: '4px' },
		},
	];

	/**
	 * Selecting a different preset routes through the draft guard before navigating, so an unsaved
	 * draft is never dropped silently.
	 *
	 * @return {void}
	 */
	it('routes a selection of another preset through the guard', () => {
		const guard = jest.fn((fn) => fn());
		const navigate = jest.fn();
		useDraftChannel.mockReturnValue({ publication: null, guard });

		renderPresetScreen(
			{ payload: {}, isLoading: false, loadError: null, rows: ROWS, initialValuesFor: () => ({}) },
			{ item: 'primary', navigate }
		);

		act(() => {
			container.querySelectorAll('.kadence-blocks-style-library__list-row-main')[1].click();
		});

		expect(guard).toHaveBeenCalled();
		expect(navigate).toHaveBeenCalledWith({ item: 'secondary' });
	});

	/**
	 * Selecting the preset that is already open is a no-op that bypasses the guard entirely, so an
	 * in-progress draft survives a stray click on its own row.
	 *
	 * @return {void}
	 */
	it('does nothing when the already-open preset is selected', () => {
		const guard = jest.fn((fn) => fn());
		const navigate = jest.fn();
		useDraftChannel.mockReturnValue({ publication: null, guard });

		renderPresetScreen(
			{ payload: {}, isLoading: false, loadError: null, rows: ROWS, initialValuesFor: () => ({}) },
			{ item: 'primary', navigate }
		);

		act(() => {
			container.querySelectorAll('.kadence-blocks-style-library__list-row-main')[0].click();
		});

		expect(guard).not.toHaveBeenCalled();
		expect(navigate).not.toHaveBeenCalled();
	});
});
