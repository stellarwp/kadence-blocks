/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { ButtonSettings } from '../components/pages/ButtonSettings';
import { useButtonPresets } from '../hooks/use-button-presets';

// Same rationale as `button-screen.test.js`: `use-button-presets.js` pulls in `../api/client`,
// which imports `@wordpress/api-fetch` (externalized in production, not an installed dependency),
// so automocking would fail to resolve it. `ButtonSettings` only reads the hook's return value.
jest.mock('../hooks/use-button-presets', () => ({
	useButtonPresets: jest.fn(),
}));

const LIBRARY = { rest: { namespace: 'kb-design-tokens/v1' }, slug: 'default', version: 1, values: {} };

let container;
let root;

/**
 * Render `ButtonSettings` with the given `useButtonPresets` stub and route item, returning the
 * `navigate` spy passed to it.
 *
 * @param {Object} presets The `useButtonPresets` return value to stub.
 * @param {string} item    The route's `item` (`kb-item`) value.
 *
 * @since TBD
 *
 * @return {Function} The `navigate` jest spy.
 */
function renderButtonSettings(presets, item) {
	useButtonPresets.mockReturnValue(presets);
	const navigate = jest.fn();

	act(() => {
		root.render(
			createElement(ButtonSettings, {
				route: { screen: 'blocks/kadence/singlebtn', item },
				navigate,
				library: LIBRARY,
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
	useButtonPresets.mockReset();
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
});

describe('ButtonSettings self-heal guard', () => {
	/**
	 * A failed preset fetch must not be mistaken for a stale `kb-item`: the route must survive so a
	 * retry can still restore the selected preset.
	 *
	 * @return {void}
	 */
	it('does not clear a valid kb-item when the preset fetch fails', () => {
		const navigate = renderButtonSettings(
			{
				payload: null,
				isLoading: false,
				loadError: new Error('Request failed'),
				rows: [],
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
		const navigate = renderButtonSettings(
			{
				payload: {},
				isLoading: false,
				loadError: null,
				rows: [],
				initialValuesFor: () => null,
			},
			'does-not-exist'
		);

		expect(navigate).toHaveBeenCalledWith({ item: '' });
	});
});
