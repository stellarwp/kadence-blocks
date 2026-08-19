/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { PresetSidebar } from '../components/pages/PresetSidebar';

// `PresetSidebar` takes the preset-screen binding as a prop rather than calling a hook itself, so
// both cases below can stub `screen` directly with a plain object — no module mock is needed.
// Both resolve to no initial values, so `PresetSidebar` returns null before mounting its body; the
// write-flow fields (`savePreset`, `isDeletable`, etc.) never need stubbing.
const PRESET = { tabs: null, schemaFor: () => [] };

let container;
let root;

/**
 * Render `PresetSidebar` with the given `screen` binding and route item, returning the `navigate`
 * spy passed to it.
 *
 * @param {Object} screen The preset-screen binding to stub.
 * @param {string} item   The route's `item` (`kb-item`) value.
 *
 * @since TBD
 *
 * @return {Function} The `navigate` jest spy.
 */
function renderPresetSidebar(screen, item) {
	const navigate = jest.fn();

	act(() => {
		root.render(
			createElement(PresetSidebar, {
				route: { screen: 'blocks/kadence/singlebtn', item },
				navigate,
				screen,
				preset: PRESET,
			})
		);
	});

	return navigate;
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('PresetSidebar self-heal guard', () => {
	/**
	 * A failed preset fetch must not be mistaken for a stale `kb-item`: the route must survive so a
	 * retry can still restore the selected preset.
	 *
	 * @return {void}
	 */
	it('does not clear a valid kb-item when the preset fetch fails', () => {
		const navigate = renderPresetSidebar(
			{
				payload: null,
				isLoading: false,
				loadError: new Error('Request failed'),
				initialValuesFor: () => null,
			},
			'primary'
		);

		expect(navigate).not.toHaveBeenCalled();
	});

	/**
	 * A successful load that resolves to no preset for the given slug is genuinely stale, so the
	 * self-heal must still clear the route.
	 *
	 * @return {void}
	 */
	it('clears an unknown kb-item once a successful load finds no matching preset', () => {
		const navigate = renderPresetSidebar(
			{
				payload: {},
				isLoading: false,
				loadError: null,
				initialValuesFor: () => null,
			},
			'does-not-exist'
		);

		expect(navigate).toHaveBeenCalledWith({ item: '' });
	});
});
