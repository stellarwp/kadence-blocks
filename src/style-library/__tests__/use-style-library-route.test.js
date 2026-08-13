/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { useStyleLibraryRoute } from '../hooks/use-style-library-route';
import { SCREEN_QUERY_ARG, ITEM_QUERY_ARG } from '../helpers/route';

// Same-origin as jsdom: the History API refuses a URL differing anywhere but path/query/fragment.
const ADMIN_URL = '/wp-admin/admin.php?page=kadence-blocks-style-library';

let container;
let root;
let pushState;
let replaceState;

/**
 * Render the hook inside StrictMode and expose its latest return value.
 *
 * StrictMode is the point of these tests, not incidental: it double-invokes render and state updaters
 * in development, which is what turns an impure updater into a duplicated history entry.
 *
 * @return {{current: Object}} A ref-like box holding the hook's most recent return value.
 */
function renderHook() {
	const box = {};

	function Probe() {
		box.current = useStyleLibraryRoute();

		return null;
	}

	act(() => {
		root.render(createElement(StrictMode, null, createElement(Probe)));
	});

	return box;
}

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;

	window.history.replaceState(null, '', ADMIN_URL);

	pushState = jest.spyOn(window.history, 'pushState');
	replaceState = jest.spyOn(window.history, 'replaceState');

	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	if (root) {
		act(() => root.unmount());
	}

	container.remove();
	jest.restoreAllMocks();

	delete global.IS_REACT_ACT_ENVIRONMENT;
});

describe('useStyleLibraryRoute under StrictMode', () => {
	/**
	 * Each navigation writes exactly one history entry, so one Back press leaves one screen.
	 *
	 * Two navigations, deliberately: React takes an eager-state path for the first update to a freshly
	 * mounted hook and runs the updater outside render, so a `pushState` hidden in a `setState` updater
	 * still fires once. From the second update on, the updater runs during render and StrictMode
	 * double-invokes it. Collapsing this back to a single navigation would stop catching the bug.
	 *
	 * @return {void}
	 */
	it('pushes one history entry per navigation, not one per updater invocation', () => {
		const box = renderHook();

		act(() => box.current.navigate({ screen: 'typography' }));
		act(() => box.current.navigate({ screen: 'color' }));

		expect(pushState).toHaveBeenCalledTimes(2);
		expect(box.current.route).toEqual({ screen: 'color', scope: '', item: '' });
	});

	/**
	 * Replacing likewise writes once.
	 *
	 * @return {void}
	 */
	it('replaces a single history entry per call', () => {
		const box = renderHook();

		replaceState.mockClear();

		act(() => box.current.replace({ screen: 'color' }));

		expect(replaceState).toHaveBeenCalledTimes(1);
	});

	/**
	 * A partial merges into the live route rather than replacing it, so setting an item keeps the screen.
	 *
	 * @return {void}
	 */
	it('merges a partial into the current route', () => {
		const box = renderHook();

		act(() => box.current.navigate({ screen: 'typography' }));
		act(() => box.current.navigate({ item: 'heading-1' }));

		expect(box.current.route).toEqual({ screen: 'typography', scope: '', item: 'heading-1' });
		expect(pushState).toHaveBeenCalledTimes(2);
	});

	/**
	 * Two navigations in the same tick compose, because the live route is updated synchronously rather
	 * than through the pending state.
	 *
	 * @return {void}
	 */
	it('composes two navigations dispatched in one tick', () => {
		const box = renderHook();

		act(() => {
			box.current.navigate({ screen: 'typography' });
			box.current.navigate({ item: 'heading-1' });
		});

		expect(box.current.route).toEqual({ screen: 'typography', scope: '', item: 'heading-1' });

		const lastUrl = pushState.mock.calls[pushState.mock.calls.length - 1][2];

		expect(lastUrl).toContain(`${SCREEN_QUERY_ARG}=typography`);
		expect(lastUrl).toContain(`${ITEM_QUERY_ARG}=heading-1`);
	});

	/**
	 * A browser Back press re-reads the route from the URL without writing history again.
	 *
	 * @return {void}
	 */
	it('reads the route back from the URL on popstate', () => {
		const box = renderHook();

		act(() => box.current.navigate({ screen: 'typography' }));

		pushState.mockClear();

		act(() => {
			window.history.replaceState(null, '', `${ADMIN_URL}&${SCREEN_QUERY_ARG}=color`);
			window.dispatchEvent(new window.PopStateEvent('popstate'));
		});

		expect(box.current.route).toEqual({ screen: 'color', scope: '', item: '' });
		expect(pushState).not.toHaveBeenCalled();
	});
});
