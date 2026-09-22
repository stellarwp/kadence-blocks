/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { useSwatchViewMode } from '../hooks/use-swatch-view-mode';
import { SWATCH_VIEW_MODE_STORAGE_KEY } from '../helpers/swatch-view-mode';

describe('useSwatchViewMode', () => {
	let container;
	let root;
	let api;
	let renderedModes;

	/**
	 * A probe that exposes the hook's state and setter to the test.
	 *
	 * @since TBD
	 *
	 * @return {JSX.Element} An empty marker element.
	 */
	function Probe() {
		const [viewMode, setViewMode] = useSwatchViewMode();

		renderedModes.push(viewMode);
		api = { viewMode, setViewMode };

		return <span />;
	}

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
		window.localStorage.clear();
		renderedModes = [];
		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		window.localStorage.clear();
		jest.restoreAllMocks();
		delete global.IS_REACT_ACT_ENVIRONMENT;
	});

	/**
	 * Mount the probe.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function mount() {
		act(() => root.render(<Probe />));
	}

	/**
	 * With nothing stored the hook starts on grid.
	 *
	 * @return {void}
	 */
	it('defaults to grid', () => {
		mount();

		expect(api.viewMode).toBe('grid');
	});

	/**
	 * A saved list mode is present on the very first render, so nothing flashes as grid first.
	 *
	 * @return {void}
	 */
	it('applies a stored list mode on the first render', () => {
		window.localStorage.setItem(SWATCH_VIEW_MODE_STORAGE_KEY, 'list');

		mount();

		expect(renderedModes[0]).toBe('list');
	});

	/**
	 * The setter updates state and saves the choice.
	 *
	 * @return {void}
	 */
	it('updates and persists the mode through the setter', () => {
		mount();
		act(() => api.setViewMode('list'));

		expect(api.viewMode).toBe('list');
		expect(window.localStorage.getItem(SWATCH_VIEW_MODE_STORAGE_KEY)).toBe('list');
	});

	/**
	 * A value that is not a mode changes nothing.
	 *
	 * @return {void}
	 */
	it('ignores an invalid mode in the setter', () => {
		mount();
		act(() => api.setViewMode('table'));

		expect(api.viewMode).toBe('grid');
		expect(window.localStorage.getItem(SWATCH_VIEW_MODE_STORAGE_KEY)).toBeNull();
	});

	/**
	 * A storage that throws on write still lets the toggle switch for the session.
	 *
	 * @return {void}
	 */
	it('still switches when saving throws', () => {
		jest.spyOn(window.Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked');
		});

		mount();
		act(() => api.setViewMode('list'));

		expect(api.viewMode).toBe('list');
	});
});
