/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ButtonScreen } from '../components/pages/ButtonScreen';
import { useButtonPresets } from '../hooks/use-button-presets';

// A factory: `use-button-presets.js` pulls in `../api/client`, which imports `@wordpress/api-fetch`
// (externalized to the `wp.apiFetch` global in production, not an installed npm dependency), so
// automocking would fail to resolve it. The screen only reads the hook's return value, so a bare
// jest.fn() stand-in is enough.
jest.mock('../hooks/use-button-presets', () => ({
	useButtonPresets: jest.fn(),
}));

// `jest.config.js` maps the `@wordpress/components` specifier to the copy nested under
// `@kadence/components/node_modules`, which resolves its own nested `react`/`react-dom` — a
// different module instance than the top-level `react-dom/client` this test renders with. Mounting
// a real `Button`/`Notice`/`Spinner` from that nested copy under the top-level renderer trips
// React's "Invalid hook call" guard. Simple stand-ins sidestep the cross-copy mismatch; this test
// only needs to tell the loading/empty/populated states apart, not exercise the real controls.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, ...props }) => <button {...props}>{children}</button>,
	Notice: ({ children, ...props }) => <div {...props}>{children}</div>,
	Spinner: (props) => <div className="components-spinner" {...props} />,
}));

const LIBRARY = { rest: { namespace: 'kb-design-tokens/v1' }, slug: 'default', version: 1, values: {} };

let container;
let root;

/**
 * Render `ButtonScreen` with the given `useButtonPresets` stub and return the mounted container.
 *
 * @param {Object} presets The `useButtonPresets` return value to stub.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container the screen was rendered into.
 */
function renderButtonScreen(presets) {
	useButtonPresets.mockReturnValue(presets);

	act(() => {
		root.render(
			createElement(ButtonScreen, {
				label: 'Button',
				route: { screen: 'blocks/kadence/singlebtn', item: '' },
				navigate: () => {},
				library: LIBRARY,
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
	useButtonPresets.mockReset();
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('ButtonScreen loading state', () => {
	/**
	 * While `useButtonPresets` is still fetching, the screen must show a busy indicator instead of
	 * the empty state — `useButtonPresets` starts with `isLoading: true` and no rows, and rendering
	 * the empty state at that point would flash "Add Button" before the presets arrive.
	 *
	 * @return {void}
	 */
	it('renders a spinner instead of the empty state while loading', () => {
		renderButtonScreen({ payload: null, isLoading: true, loadError: null, rows: [], initialValuesFor: () => ({}) });

		expect(container.querySelector('.components-spinner')).not.toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__empty-state')).toBeNull();
	});

	/**
	 * Once loading finishes with no rows, the empty state renders in place of the spinner.
	 *
	 * @return {void}
	 */
	it('renders the empty state once loading finishes with no rows', () => {
		renderButtonScreen({ payload: {}, isLoading: false, loadError: null, rows: [], initialValuesFor: () => ({}) });

		expect(container.querySelector('.components-spinner')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__empty-state')).not.toBeNull();
	});

	/**
	 * Once loading finishes with rows present, neither the spinner nor the empty state renders.
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

		renderButtonScreen({ payload: {}, isLoading: false, loadError: null, rows, initialValuesFor: () => ({}) });

		expect(container.querySelector('.components-spinner')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__empty-state')).toBeNull();
		expect(container.querySelector('.kadence-blocks-style-library__row-list')).not.toBeNull();
	});
});
